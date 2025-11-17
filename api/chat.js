import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { question, cvText } = req.body;

    if (!question) return res.status(400).json({ error: "No question provided" });
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY missing!");
      return res.status(500).json({ answer: "Server error: API key missing." });
    }

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
