import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple GET route for testing
app.get("/", (req, res) => {
  res.send("Kgosi Sebako CV Chatbot API is running!");
});

// POST /api/chat route
app.post("/api/chat", async (req, res) => {
  const { question, cvText } = req.body;

  if (!question) return res.status(400).json({ error: "No question provided" });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ answer: "API key missing" });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are Kgosi's CV chatbot. Use ONLY this CV:

${cvText}

User asked: ${question}

If the answer is not in the CV, say: "I don't have that information in my CV."
`;

    const result = await model.generateContent(prompt);
    const output = result.response?.text() || "I couldn't get a response.";

    res.status(200).json({ answer: output });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ answer: "Server error. Please try again." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
