import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment secrets. Real AI-driven transformations will fall back to smart local simulations.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Transformation API route
app.post("/api/transform", async (req, res) => {
  const { text, fileData, mode } = req.body;

  if (!text && !fileData) {
    return res.status(400).json({ error: "Medical text, diagnostic data, or file is required." });
  }

  const selectedMode = mode || "panic"; // panic | learner | burnout

  // System instruction tailored for high emotional intelligence and the specific UI Mode
  let systemInstructions = `
    You are LUMA, an extremely empathetic, warm, and comforting medical interpretation AI.
    Your absolute core goal is to stand as a soothing, emotionally supportive shield between an anxious patient and overwhelming medical jargon.
    
    You do NOT sound clinical, cold, or sterile.
    You design clarity out of panic.
    
    Keep explanations deeply human, reassuring, and highly accurate but phrased with profound tenderness.
  `;

  if (selectedMode === "panic") {
    systemInstructions += `
      The user is currently in PANIC MODE. They are terrified and cognitively overloaded.
      - Keep sentences short and incredibly soothing.
      - Start with an immediate, deep emotional stabilization sentence.
      - Do NOT over-explain complex biochemical pathways.
      - Keep next steps highly linear, gentle, and slow.
      - Your tone should feel like a slow, deep breath.
    `;
  } else if (selectedMode === "burnout") {
    systemInstructions += `
      The user is currently in BURNOUT MODE. They are emotionally and mentally exhausted, perhaps from dealing with chronic illness or endless doctor calls.
      - Focus ONLY on the single absolute most important action.
      - Minimize text volume. Make the summary ultra-concise.
      - Exclude excess scientific context.
      - Reassure them that it is okay to rest and take things one tiny step at a time.
    `;
  } else {
    // learner
    systemInstructions += `
      The user is currently in CURIOUS LEARNER MODE. They are ready to empower themselves with biology.
      - Expand your breakdown to explain the biological 'why' in a fascinating, clear, and reassuring way.
      - Describe the body's natural defense mechanism or how the treatment works.
      - Maintain standard soothing empathy but inspire clinical curiosity.
      - Provide a section detailing the 'preventativeScience' aspect of this topic.
    `;
  }

  const promptText = `
    Analyze the following scary doctor's note or medical report:
    ---
    ${text}
    ---
    
    Provide your analysis conforming strictly to the requested JSON layout.
  `;

  try {
    const ai = getAiClient();
    
    if (!ai) {
      return res.status(400).json({ error: "GEMINI_API_KEY is not configured on the server. Please add it to your .env file." });
    }

    const promptText = `
      Analyze the following scary doctor's note or medical report:
      ---
      ${text || "See attached document image."}
      ---
      
      Provide your analysis conforming strictly to the requested JSON layout.
    `;

    const parts: any[] = [{ text: promptText }];
    if (fileData && fileData.data && fileData.mimeType) {
      parts.push({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: parts,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stabilizingReassurance: {
              type: Type.STRING,
              description: "A very warm, beautiful, comforting opening statement designed to calm a panic attack or emotional overwhelm immediately."
            },
            simplifiedExplanation: {
              type: Type.STRING,
              description: "An elegant, crystal-clear explanation of what is going on, using simple metaphors. No scary words left untranslated."
            },
            urgencyLevel: {
              type: Type.INTEGER,
              description: "Visual urgency guidance on a scale of 1 to 10 (1 = absolute green light comfort, 10 = important to go to the clinic immediately but state it safely)."
            },
            urgencyAnalysis: {
              type: Type.STRING,
              description: "Empathetic context for the urgency level. Reassure them why this number is given."
            },
            primaryFocusAction: {
              type: Type.STRING,
              description: "The absolute, single most important action they should take. Be extremely gentle."
            },
            keyActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A step-by-step, calming list of personalized next steps designed to feel manageable."
            },
            jargonMappings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  scaryTerm: { type: Type.STRING, description: "The scary sounding Latin or medical word in the original text (e.g., 'Acute Pharyngitis', 'Erythema')." },
                  gentleTranslation: { type: Type.STRING, description: "The beautiful, clear alternative human phrase (e.g., 'Sore throat', 'Mild redness')." },
                  description: { type: Type.STRING, description: "A simple, reassuring description of why doctors use this word." }
                },
                required: ["scaryTerm", "gentleTranslation", "description"]
              },
              description: "A breakdown mapping intimidating medical jargon to gentle everyday terms."
            },
            questionsToAskDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of comforting, smart questions they can copy-paste to ask their clinician at the next visit."
            },
            preventativeScience: {
              type: Type.STRING,
              description: "Only filled in for Leaner mode. An interesting, positive, biological explanation of how the healing process works or the medical science behind it."
            }
          },
          required: [
            "stabilizingReassurance",
            "simplifiedExplanation",
            "urgencyLevel",
            "urgencyAnalysis",
            "primaryFocusAction",
            "keyActions",
            "jargonMappings",
            "questionsToAskDoctor"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini transformation error:", error);
    res.status(500).json({ error: error.message || "Gemini transformation failed. Please verify your API key and connection." });
  }
});



// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LUMA sever running elegantly on Port ${PORT}`);
  });
}

startServer();
