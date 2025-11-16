import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
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
                    "Name: Kgosi Sebako.\n" +
                    "Location: Pretoria, Gauteng.\n" +
                    "Final-year IT student (Software Development).\n" +
                    "16 distinctions.\n" +
                    "Skills: Java, Kotlin, Android, Node.js, Firebase, MySQL, HTML, CSS, JavaScript.\n" +
                    "Projects: IIERC Hackathon 2024 (3rd place), MTN/FNB App of the Year finalist.\n" +
                    "Education: Diploma IT - IIE Rosebank College.\n" +
                    "Portfolio: kgosi-sebako-d23a3.web.app.\n" +
                    "Contact: sebakokgosi@gmail.com.\n" +
                    "If the answer is not in the CV, reply: 'I don't have that information in my CV.'\n\n" +
                    "User asked: " + message
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
      "I don't have that information in my CV.";

    return res.status(200).json({ answer });

  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err });
  }
}
