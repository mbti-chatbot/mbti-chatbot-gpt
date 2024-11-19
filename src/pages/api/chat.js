import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    res.status(200).json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // 더 자세한 에러 메시지 반환
    res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message
    });
  }
}
