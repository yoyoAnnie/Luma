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

  // Each mode gets its own complete system instruction — no shared emotional base that bleeds across modes
  let systemInstructions: string = "";

  if (selectedMode === "panic") {
    systemInstructions = `
      You are LUMA in PANIC MODE. The user is frightened and cognitively overloaded. Emotional safety is your only priority.

      TONE: Speak like a calm, trusted friend holding their hand. Slow sentences. Warm. Never clinical.

      RULES:
      - stabilizingReassurance: Long and deeply comforting. Use "we" ("we will get through this together"). Validate their fear before anything medical. No medical terms here.
      - simplifiedExplanation: Zero numbers, zero statistics, zero technical terms. Use gentle everyday metaphors only ("your body is just asking for a little extra rest right now"). Frame everything as temporary and manageable.
      - urgencyAnalysis: Purely reassuring. If urgency is low, say so clearly and warmly. Never alarming.
      - keyActions: Maximum 3 steps. Each must be immediately doable and soft (e.g. "drink a glass of water", "sit somewhere quiet"). Nothing complex.
      - jargonMappings: Translate every term to the warmest possible everyday phrase. No technical definitions.
      - questionsToAskDoctor: Gentle conversation starters, not demands.
      - preventativeScience: Leave completely empty — do not fill this in.
    `;
  } else if (selectedMode === "burnout") {
    systemInstructions = `
      You are LUMA in BURNOUT MODE. The user is mentally exhausted from chronic illness or endless medical appointments.

      TONE: Ultra-minimal. Compassionate but brief. Every word must earn its place.

      RULES:
      - Focus ONLY on the single most important action. One thing. That is all.
      - simplifiedExplanation: Three sentences maximum. Plain language.
      - keyActions: One action only.
      - Cut all scientific context, history, and detail.
      - Reassure them it is okay to rest and take things one tiny step at a time.
      - preventativeScience: Leave completely empty.
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
      Analyze the following medical report:
      ---
      ${text || "See attached document image."}
      ---

      Provide your analysis conforming strictly to the requested JSON layout.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        stabilizingReassurance: {
          type: Type.STRING,
          description: "Opening message to the user. Tone and length vary by mode: long and emotional in panic mode, one factual sentence in learner mode."
        },
        simplifiedExplanation: {
          type: Type.STRING,
          description: "Explanation of the condition. In panic mode: gentle metaphors only, no numbers. In learner mode: full biological/physiological mechanism with accurate terminology."
        },
        urgencyLevel: {
          type: Type.INTEGER,
          description: "Urgency on a scale of 1 to 10. 1 = routine. 10 = urgent clinical attention required."
        },
        urgencyAnalysis: {
          type: Type.STRING,
          description: "Context for the urgency level. In panic mode: warm and reassuring. In learner mode: evidence-based clinical prognosis."
        },
        primaryFocusAction: {
          type: Type.STRING,
          description: "The single most important action the user should take."
        },
        keyActions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Next steps. In panic mode: max 3 gentle actions. In learner mode: 4–6 evidence-based interventions each with clinical mechanism or study citation."
        },
        jargonMappings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              scaryTerm: { type: Type.STRING, description: "The medical term from the text." },
              gentleTranslation: { type: Type.STRING, description: "Plain-English equivalent." },
              description: { type: Type.STRING, description: "In panic mode: reassuring plain explanation. In learner mode: accurate clinical definition with etymology." }
            },
            required: ["scaryTerm", "gentleTranslation", "description"]
          },
          description: "Medical terminology mapped to plain language."
        },
        questionsToAskDoctor: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Questions for the next clinical visit. In panic mode: gentle starters. In learner mode: specific clinical questions about biomarkers, genetics, monitoring, and treatment."
        },
        preventativeScience: {
          type: Type.STRING,
          description: "Learner mode only — leave empty for other modes. Covers risk factors, condition history, evidence-based prevention, and epidemiology."
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
    };

    const parts: any[] = [{ text: promptText }];
    if (fileData && fileData.data && fileData.mimeType) {
      parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: parts,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema
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
