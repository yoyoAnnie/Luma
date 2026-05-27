import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { simplifyMedicalLetter, simplifyMedicalLetterStream } from './geminiService.js';
import supabase from './supabaseClient.js';
import requireAuth from './requireAuth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer in memory storage with customizable size limit
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024; // Default 20MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE }
}).single('file'); // Expects single file upload with field name 'file'

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    maxFileSizeLimit: MAX_FILE_SIZE,
    streamingSupported: true
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Medical Letter Simplifier API is running. Use POST /api/simplify for simplification.');
});

// Simplification Route
app.post('/api/simplify', (req, res) => {
  // Use custom multer wrapper to catch file size or upload errors gracefully
  upload(req, res, async (err) => {
    let file = req.file;
    let fileWarning = null;

    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        console.warn(`[server] Uploaded file exceeded size limit of ${MAX_FILE_SIZE} bytes. Treating as empty input.`);
        fileWarning = `File exceeded size limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB. Processed text only.`;
        file = null; // Force empty input for the file block
      } else {
        console.error('[server] Multer file upload error:', err);
        fileWarning = `File upload error: ${err.message}. Processed text only.`;
        file = null; // Force empty input for the file block
      }
    }

    const text = req.body.text;

    console.log(`[server] Received /api/simplify request. Has text: ${!!text}, Has file: ${!!file}`);

    // Call gemini service with text and file
    const result = await simplifyMedicalLetter({ text, file });

    // Include warning if the file was rejected due to size/parsing errors
    if (fileWarning) {
      result.fileWarning = fileWarning;
      // If result was successful but file was ignored, mark that it was only text
      if (result.success) {
        result.note = "Processed text only. The uploaded file was omitted due to size or error.";
      }
    }

    // Save successful simplification to Supabase (fire-and-forget — never blocks the response)
    if (result.success && supabase) {
      (async () => {
        let userId = req.body.user_id || 'anonymous';
        let userEmail = null;
        const token = req.headers.authorization?.split(' ')[1];
        console.log('[server] Token present:', !!token);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        console.log('[server] Auth error:', authError);
        console.log('[server] Auth user:', user?.id);
        if (user) {
          userId = user.id;
          userEmail = user.email;
        }
        console.log('[server] Auth header present:', !!req.headers.authorization);
        console.log('[server] Resolved user_id:', userId);
        const { data: insertData, error: dbError } = await supabase
          .from('uploads')
          .insert({
            user_id: userId,
            user_email: userEmail,
            file_name: file?.originalname || 'text-input',
            input_text: (text || '').slice(0, 2000),
            simplified_text: result.simplifiedText
          });
        if (dbError) {
          console.error('[server] Supabase insert error:', JSON.stringify(dbError));
        } else {
          console.log('[server] Supabase insert success, user_id:', userId);
        }
      })();
    }

    // Determine HTTP status code: Always return 200 to allow the client to handle
    // the output gracefully as requested, but flag errors inside the JSON response.
    res.json(result);
  });
});
// Streaming Simplification Route (SSE)
app.post('/api/simplify/stream', (req, res) => {
  upload(req, res, async (err) => {
    let file = req.file;

    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        console.warn(`[server] Stream: file exceeded size limit of ${MAX_FILE_SIZE} bytes.`);
      } else {
        console.error('[server] Stream: multer error:', err);
      }
      file = null;
    }

    const text = req.body.text;

    console.log(`[server] Received /api/simplify/stream request. Has text: ${!!text}, Has file: ${!!file}`);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    res.write(': connected\n\n'); // keep-alive comment, frontend ignores this

    // Track whether the client has disconnected
    let clientDisconnected = false;
    req.on('close', () => {
      clientDisconnected = true;
      console.log('[server] Stream: client disconnected.');
    });

    try {
      const stream = simplifyMedicalLetterStream({ text, file });

      let accumulatedText = '';
      for await (const chunk of stream) {
        if (clientDisconnected) break;
        accumulatedText += chunk;
        const encoded = chunk.replace(/\n/g, '\\n');
        res.write(`data: ${encoded}\n\n`);
      }

      if (!clientDisconnected) {
        res.write('data: [DONE]\n\n');
        // Save accumulated stream result to Supabase (fire-and-forget)
        if (supabase && accumulatedText) {
          const authHeader = req.headers.authorization;
          (async () => {
            let userId = req.body.user_id || 'anonymous';
            let userEmail = null;
            if (authHeader?.startsWith('Bearer ')) {
              const { data: authData } = await supabase.auth.getUser(authHeader.slice(7));
              if (authData?.user) {
                userId = authData.user.id;
                userEmail = authData.user.email;
              }
            }
            const { data: insertData, error: dbError } = await supabase
              .from('uploads')
              .insert({
                user_id: userId,
                user_email: userEmail,
                file_name: file?.originalname || 'text-input',
                input_text: (text || '').slice(0, 2000),
                simplified_text: accumulatedText
              });
            if (dbError) {
              console.error('[server] Supabase insert error:', JSON.stringify(dbError));
            } else {
              console.log('[server] Supabase insert success, user_id:', userId);
            }
          })();
        }
      }
    } catch (streamErr) {
      console.error('[server] Stream error:', streamErr);
      if (!clientDisconnected) {
        res.write(`data: [ERROR] ${streamErr.message}\n\n`);
      }
    } finally {
      res.end();
    }
  });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!supabase) return res.json({ success: false, error: 'Supabase is not configured.' });
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.json({ success: false, error: error.message });
  res.json({ success: true, user: data.user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!supabase) return res.json({ success: false, error: 'Supabase is not configured.' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.json({ success: false, error: error.message });
  res.json({ success: true, user: data.user, session: data.session });
});

app.post('/api/auth/logout', async (req, res) => {
  const { access_token } = req.body;
  if (!supabase) return res.json({ success: false, error: 'Supabase is not configured.' });
  const { error } = await supabase.auth.admin.signOut(access_token);
  if (error) return res.json({ success: false, error: error.message });
  res.json({ success: true });
});

// History Route
app.get('/api/history', requireAuth, async (req, res) => {
  const userId = req.user.id;
  if (!supabase) {
    return res.json({ success: false, error: 'Supabase is not configured.' });
  }
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[supabase] History query error:', error);
    return res.json({ success: false, error: error.message });
  }
  res.json({ success: true, history: data });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[server] Uncaught Exception:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    simplifiedText: '',
    emptyInput: true
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Medical Letter Simplifier Backend Running!`);
  console.log(`Port: ${PORT}`);
  console.log(`Gemini Key Configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`Max Upload Size: ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
  console.log(`==================================================`);
});
