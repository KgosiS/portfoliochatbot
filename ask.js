import fetch from "node-fetch";

const GEMINI_API_KEY = "AIzaSyDz9GIPb5-MRjsciE3jC8-8s3KeHqvGe8o";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { question } = req.body;

    const CV_TEXT = `
Name: Kgosi Sebako.
Location: Pretoria, Gauteng.
Final-year IT student (Software Development).
16 distinctions.
Skills: Java, Kotlin, Android, Node.js, Firebase, MySQL, HTML, CSS, JavaScript.
Projects: IIERC Hackathon 2024 (3rd place), MTN/FNB App of the Year finalist.
Education: Diploma IT - IIE Rosebank College.
Portfolio: kgosi-sebako-d23a3.web.app.
Contact: sebakokgosi@gmail.com, 077 498 6080.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Answer using ONLY this CV:\n" + CV_TEXT + "\n\nQuestion: " + question }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't get a response.";
    res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Server error. Try again." });
  }
}
