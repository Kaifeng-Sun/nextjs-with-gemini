const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");

  req.on("close", () => {
    res.end();
  });

  const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 100,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
  };

  const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
  const prompt = "Write me a four-line poem about puppies and Android phones. Make sure it rhymes."

  let text = "";

    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
    }
    res.write(`data: ${JSON.stringify(text)}\n\n`);
    res.end();
}
