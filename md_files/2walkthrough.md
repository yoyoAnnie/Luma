# Walkthrough - Medical Letter Simplifier Backend

We have successfully initialized the backend codebase for the Medical Letter Simplifier. The system is designed to handle plain text inputs and file uploads (PDFs and images), base64 encode the files, handle size boundaries gracefully, and call Gemini for plain-English simplification and question generation.

## Created Files

We added the following files to the codebase:
1. [package.json](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/package.json): Initializes dependencies (`express`, `cors`, `multer`, `@google/genai`, `dotenv`, `nodemon`).
2. [.env.template](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/.env.template) & [.env](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/.env): Environment variables configuration template and local file containing port and api key placeholders.
3. [.gitignore](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/.gitignore): Excludes node_modules, log files, and sensitive credentials from source control.
4. [geminiService.js](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/geminiService.js): Contains:
   - File validation logic (supported MIME types: PDFs/images, and maximum size limits).
   - Base64 encoding.
   - Integration with Google Gen AI client (`gemini-2.5-flash`).
   - Compassionate system instructions.
   - Graceful fallback for API failures (returns `emptyInput: true`).
5. [server.js](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/server.js): The entry point for the Express backend. Configures CORS, sets up `multer` in-memory storage, captures upload errors (e.g. `LIMIT_FILE_SIZE`), and routes simplification requests.

---

## Configuration & Usage

### 1. Setup Environment
Open the [.env](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/.env) file and add your Google Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Start Backend Server
Run either of the following commands in the workspace root directory:
```powershell
npm run dev    # runs server with hot-reload (nodemon)
# OR
npm start      # runs server normally
```

### 3. API Usage
#### Route: `POST /api/simplify`
Accepts `multipart/form-data`.
- **Fields**:
  - `text`: (Optional string) Text paste of the medical letter.
  - `file`: (Optional file block) Uploaded image or PDF.
- **Successful Response Structure (200 OK)**:
  ```json
  {
    "success": true,
    "simplifiedText": "# Plain-English Explanation\n...\n# Questions to Ask Your Doctor\n...",
    "emptyInput": false
  }
  ```
- **Error/Oversized File Fallback (200 OK)**:
  If the file exceeds 20MB, the file is ignored (treated as empty input) and the server processes only the text. If both are empty or the API errors, a fallback is returned:
  ```json
  {
    "success": false,
    "error": "API Error: ...",
    "simplifiedText": "",
    "emptyInput": true,
    "fileWarning": "File exceeded size limit of 20MB. Processed text only."
  }
  ```

---

## Verification & Testing

We ran a mock verification suite testing the `geminiService` file limits, MIME boundaries, and API error interceptions.
Test results:
- **Test 1**: Valid PDF under size limit (5MB) -> `✅ PASS`
- **Test 2**: Valid JPEG image under size limit (1.2MB) -> `✅ PASS`
- **Test 3**: Oversized Scan file (25MB) -> `✅ PASS` (rejected, returned empty input)
- **Test 4**: Unsupported .docx File -> `✅ PASS` (rejected, returned empty input)
- **Test 5**: Graceful API Error Fallback -> `✅ PASS` (intercepted key absence, returned `emptyInput: true` status structure)
