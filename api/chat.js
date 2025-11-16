import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { question, cvText } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a CV assistant chatbot for Kgosi.

CV DATA:
${cvText}

User Question:
${question}

Answer based ONLY on the CV. Keep responses short and friendly.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({ answer: responseText });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
}
