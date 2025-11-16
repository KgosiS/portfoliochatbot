import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST required" });
  }

  const { question, cvText } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDz9GIPb5-MRjsciE3jC8-8s3KeHqvGe8o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Use ONLY this CV:\n" +
                    cvText +
                    "\n\nUser question: " +
                    question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiRes.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't respond.";

    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API error", details: err.message });
  }
}
