import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { simplifyMedicalLetter, simplifyMedicalLetterStream } from './geminiService.js';
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
    res.flushHeaders();

    // Track whether the client has disconnected
    let clientDisconnected = false;
    req.on('close', () => {
      clientDisconnected = true;
      console.log('[server] Stream: client disconnected.');
    });

    try {
      const stream = simplifyMedicalLetterStream({ text, file });

      for await (const chunk of stream) {
        if (clientDisconnected) break;
        res.write(`data: ${chunk}\n\n`);
      }

      if (!clientDisconnected) {
        res.write('data: [DONE]\n\n');
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
