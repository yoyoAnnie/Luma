# Luma — Medical Letter Simplifier

**Luma** is an emotionally intelligent healthcare translation application that transforms complex, anxiety-inducing medical jargon into clear, comforting, plain-English explanations. It also compiles a list of personalized questions for patients to ask their doctors during follow-up appointments.

Luma was built for a hackathon environment using **Vanilla HTML/CSS/JS** for the frontend interfaces, and a **Node.js (ESM) Express** server integrating **Google's Gemini 2.5 Flash** for streaming and multimodal processing.

---

## 🌟 Key Features

*   **Multimodal File Upload**: Drag-and-drop or browse files (PDFs and image formats like JPEG, PNG, WebP) up to 20MB.
*   **Plain Text Paste**: Copy-paste clinician letters or lab results directly if digital documents aren't available.
*   **SSE Real-Time Streaming**: Uses Server-Sent Events (SSE) to stream plain-English translations chunk-by-chunk for a highly responsive, "live" user experience.
*   **Calming, Adaptive UI**: Premium glassmorphic interfaces designed to reduce medical anxiety, featuring custom-themed loading messages and slow-breathing pulse animations.
*   **Doctor Conversation Prep**: Generates 3 to 5 first-person questions tailored specifically to the patient's diagnosis.
*   **Printable Reports**: Generates a clean, printed copy of the simplified report to take directly to physician consultations.
*   **Robust Size & Error Interception**: Rejects files over 20MB or of unsupported types gracefully at the boundary, processing any available text while notifying the user of ignored files.

---

## 🛠️ Technology Stack

### Frontend
*   **Vanilla HTML5 & CSS3**: Custom dark-mode theme (`luma_healthcare_website.html`) and light-mode theme (`luma_light_mode_website.html`) using premium CSS custom properties, grid layouts, animations, and typography (DM Serif Display & Inter from Google Fonts).
*   **Vanilla JavaScript (ES6)**: Clean DOM manipulation, file drag-and-drop API integration, and custom Fetch SSE stream reader.

### Backend
*   **Node.js (ESM)**: Standard ESM modules (`"type": "module"`).
*   **Express**: Lightweight web routing.
*   **Multer**: In-memory file buffer processing.
*   **Official Google Gen AI SDK (`@google/genai`)**: Interfacing with the **Gemini 2.5 Flash** model.

---

## 🚀 Getting Started

### 1. Setup Environment
Clone the repository, then copy the template environment variables:
```bash
cp .env.template .env
```
Open your newly created `.env` file and configure your port and Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```

### 2. Install Dependencies
Run the package installer from the project root:
```bash
npm install
```

### 3. Run the Backend Server
Start the Express server in either production or hot-reload (development) modes:
```bash
# Production mode
npm start

# Development mode (runs with nodemon auto-restart)
npm run dev
```
The server will start up on `http://localhost:5000`. You can test service health at `http://localhost:5000/health`.

### 4. Launch the Frontend
Simply double-click or run one of the HTML pages in your default browser:
*   [luma_healthcare_website.html](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/luma_healthcare_website.html) (Dark Theme - Premium & Integrated)
*   [luma_light_mode_website.html](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/luma_light_mode_website.html) (Light Theme - Alternative view)

---

## 📖 Documentation Index

For detailed architectural walk-throughs of each phase, review the documentation files under `md_files/`:

1.  **[1implementation_plan.md](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/md_files/1implementation_plan.md)**: Original proposal and planning phase for Node/Express setup and multer config.
2.  **[2walkthrough.md](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/md_files/2walkthrough.md)**: Details on the initial backend configuration, setup, and endpoints.
3.  **[3walkthrough.md](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/md_files/3walkthrough.md)**: In-depth information about the Server-Sent Events (SSE) streaming API implementation.
4.  **[4frontend.md](file:///c:/Users/alexs/OneDrive/Documents/GitHub/Luma-CTC-hack/md_files/4frontend.md)**: Detailed breakdown of the frontend client modal, CSS variables, drag-and-drop logic, and raw Markdown parser.
