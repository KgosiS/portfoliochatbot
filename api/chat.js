import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { question, cvText } = req.body;

    if (!question) return res.status(400).json({ error: "No question provided" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are Kgosi's CV chatbot. Answer using ONLY the CV below:

${cvText}

User asked: ${question}

If the answer is not in the CV, say: "I don't have that information in my CV."
`;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    res.status(200).json({ answer: output });

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ answer: "Server error. Please try again." });
  }
}
