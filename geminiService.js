import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Max file size for inline data (Gemini limit is 20MB, we default to 20MB)
const DEFAULT_MAX_SIZE = 20 * 1024 * 1024; // 20 megabytes

/**
 * Encodes a buffer to a base64 inline data block for Gemini API.
 * Returns null if the file is invalid or too large.
 * 
 * @param {Object} file - Multer file object
 * @returns {Object|null} Gemini inlineData object or null if invalid/too large
 */
export function prepareFileBlock(file) {
  if (!file) return null;

  try {
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || DEFAULT_MAX_SIZE;

    if (file.size > maxSize) {
      console.warn(`[geminiService] File too large: ${file.originalname} (${file.size} bytes). Max limit is ${maxSize} bytes. Sending empty input.`);
      return null;
    }

    // Supported MIME types for Gemini: images, PDFs, text files, audio, video.
    // We are focusing on PDFs and images as requested.
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.warn(`[geminiService] Unsupported MIME type: ${file.mimetype}. Sending empty input.`);
      return null;
    }

    console.log(`[geminiService] Encoding ${file.originalname} (${file.size} bytes) to base64...`);
    return {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype
      }
    };
  } catch (error) {
    console.error('[geminiService] Error encoding file to base64, returning empty input:', error);
    return null;
  }
}

/**
 * Simplifies a medical letter using Gemini.
 * 
 * @param {Object} params
 * @param {string} [params.text] - Plain text entered by the user
 * @param {Object} [params.file] - Multer file object (image or PDF)
 * @returns {Promise<Object>} Response object containing simplified markdown text or error/fallback status
 */
export async function simplifyMedicalLetter({ text, file }) {
  // Determine if we have a valid file block or if it's empty due to size/encoding errors
  const fileBlock = prepareFileBlock(file);

  // Construct contents array for multimodal Gemini API call
  // CORRECT — parts nested inside a user message
  const parts = [];
  if (text && text.trim().length > 0) {
    parts.push({ text: text.trim() });
  }
  if (fileBlock) {
    parts.push(fileBlock);
  }

  const contents = [{ role: 'user', parts }];
  // If both are empty, we return an empty response
  if (contents.length === 0) {
    console.warn('[geminiService] Empty input: No valid text or file provided.');
    return {
      success: false,
      error: 'Empty input: No text or valid file was provided.',
      simplifiedText: 'No input was provided. Please paste a medical letter or upload an image/PDF.',
      emptyInput: true
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[geminiService] GEMINI_API_KEY environment variable is not defined.');
      // Handle missing API key as an API error by returning empty input/output response
      return {
        success: false,
        error: 'API Error: Gemini API Key is missing.',
        simplifiedText: '',
        emptyInput: true
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    console.log(`[geminiService] Calling ${modelName} with ${contents.length} content blocks...`);

    const systemInstruction = `
You are a compassionate, patient-focused medical translator. Your role is to simplify complex medical letters, lab results, clinical summaries, or doctor's notes into plain, everyday English.

Please format your response in clear, beautiful Markdown with the following two distinct sections:

# Plain-English Explanation
- Break down and translate medical jargon, anatomical terms, diagnostic labels, and abbreviations.
- Explain the key medical findings, what they mean, and what the next steps are in simple terms.
- Use formatting (bullet points, bold text, paragraphs) to make it highly readable.
- Maintain a warm, encouraging, clear, and professional tone. Avoid generating panic.

# Questions to Ask Your Doctor
- Provide a list of 3 to 5 clear, actionable, and personalized questions that the patient can take to their next appointment.
- These questions should be written in the first person (e.g., "What does the swelling in my joint indicate?") so the patient can read them directly.
- Group the questions logically if applicable.
`.trim();

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2
      }
    });

    const simplifiedText = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return {
      success: true,
      simplifiedText: simplifiedText,
      emptyInput: false
    };

  } catch (apiError) {
    console.error('[geminiService] Gemini API Error:', apiError);
    // If there is an API error, return a graceful empty/fallback input state
    return {
      success: false,
      error: `API Error: ${apiError.message || 'Gemini API invocation failed.'}`,
      simplifiedText: '',
      emptyInput: true
    };
  }
}

/**
 * Streaming version of simplifyMedicalLetter.
 * Yields text chunks as they arrive from Gemini.
 *
 * @param {Object} params
 * @param {string} [params.text] - Plain text entered by the user
 * @param {Object} [params.file] - Multer file object (image or PDF)
 * @yields {string} text chunks from the model
 */
export async function* simplifyMedicalLetterStream({ text, file }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }

  // Reuse the same file-handling logic
  const fileBlock = prepareFileBlock(file);

  // Build parts array identically to simplifyMedicalLetter
  const parts = [];
  if (text && text.trim().length > 0) {
    parts.push({ text: text.trim() });
  }
  if (fileBlock) {
    parts.push(fileBlock);
  }

  if (parts.length === 0) {
    throw new Error('Empty input: No text or valid file was provided.');
  }

  const contents = [{ role: 'user', parts }];

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Same system instruction used by the non-streaming function
  const systemInstruction = `
You are a compassionate, patient-focused medical translator. Your role is to simplify complex medical letters, lab results, clinical summaries, or doctor's notes into plain, everyday English.

Please format your response in clear, beautiful Markdown with the following two distinct sections:

# Plain-English Explanation
- Break down and translate medical jargon, anatomical terms, diagnostic labels, and abbreviations.
- Explain the key medical findings, what they mean, and what the next steps are in simple terms.
- Use formatting (bullet points, bold text, paragraphs) to make it highly readable.
- Maintain a warm, encouraging, clear, and professional tone. Avoid generating panic.

# Questions to Ask Your Doctor
- Provide a list of 3 to 5 clear, actionable, and personalized questions that the patient can take to their next appointment.
- These questions should be written in the first person (e.g., "What does the swelling in my joint indicate?") so the patient can read them directly.
- Group the questions logically if applicable.
`.trim();

  console.log(`[geminiService] Streaming from ${modelName} with ${parts.length} part(s)...`);

  const response = await ai.models.generateContentStream({
    model: modelName,
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.2
    }
  });

  for await (const chunk of response) {
    const chunkText = chunk.text;
    if (chunkText) {
      yield chunkText;
    }
  }
}
