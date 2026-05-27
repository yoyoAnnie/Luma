# Medical Letter Simplifier Backend Implementation Plan

We will build the backend for the Medical Letter Simplifier. The backend will accept PDF or image uploads, encode them to base64, and pass them to the Gemini API alongside a system prompt that simplifies the medical jargon and generates a "questions to ask your doctor" section.

## User Review Required

Please review the proposed tech stack and error-handling decisions:
- **Runtime**: We propose using **Node.js (ESM)** with **Express** and **Multer** for multipart uploads. This fits the hackathon style well (fast setup, no build compilation step).
- **Gemini SDK**: We will use the official `@google/genai` library (or `@google/generative-ai` depending on npm dependency availability).
- **Prompting**: We will configure a system instruction tailored to medical letter simplification (clear, compassionate, plain-English explanation, and a dedicated bulleted questions section).

> [!WARNING]
> Gemini inline data payload limit is 20MB. We will enforce a 20MB limit on `multer` uploads to prevent payload errors before reaching the Gemini API. If the file is too large or if the Gemini API fails, we will handle this gracefully as described below.

## Open Questions

1. **How should the API handle errors when a file is too large or the Gemini API fails?**
   - *Option A*: Fallback to processing only the text input (if provided) and ignore the file input (i.e., empty input for the file).
   - *Option B*: Return a successful HTTP 200 response with a warning/status flag (e.g., `error: "file_too_large"` or `error: "api_failed"`) and allow the frontend to display a helper message.
   - *Option C*: Throw a standard HTTP 400/500 error code.
   We suggest **Option B** (returning a graceful response with a status indicator) to align with "there will be an empty input" without breaking the backend.

2. **Gemini Model Choice**:
   - We propose using `gemini-2.5-flash` as it is fast, highly capable with multimodal input (images + PDFs), and supports structured outputs or clear formatting.

## Proposed Changes

### Configuration & Package Files

#### [NEW] [package.json](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/package.json)
Initialize the project, configure ESM modules (`"type": "module"`), and add scripts.
- Dependencies: `express`, `cors`, `multer`, `@google/genai`, `dotenv`, `nodemon` (dev dependency).

#### [NEW] [dotenv](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/.env)
Store configuration environment variables, such as `GEMINI_API_KEY` and `PORT`.

### Source Files

#### [NEW] [server.js](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/server.js)
The entry point of the application. It will:
- Set up the Express application.
- Enable CORS and JSON parsing.
- Define a `/api/simplify` endpoint.

#### [NEW] [geminiService.js](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/geminiService.js)
A service module that:
- Initializes the Gemini SDK.
- Handles base64 conversion of files (PDFs and images).
- Validates file sizes.
- Submits the prompt + files to Gemini.
- Gracefully handles errors (oversized files or API failure), returning an empty/fallback structure.

## Verification Plan

### Automated/Manual Tests
- Run `node server.js` to start the backend.
- Test PDF/Image upload via `curl` or Postman to `/api/simplify`.
  - Check file size boundary conditions (e.g. testing with an oversized file to verify the "empty input" logic).
  - Verify that both image files (PNG/JPG) and PDF documents are correctly simplified.
