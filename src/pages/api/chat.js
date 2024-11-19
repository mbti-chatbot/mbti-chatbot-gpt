import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: req.body.messages
    });

    res.status(200).json({
      message: completion.data.choices[0].message.content
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request"
    });
  }
}
