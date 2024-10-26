// app/api/huggingface-chat/route.js
import { HfInference } from "@huggingface/inference";

export async function POST(req) {
  const client = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);
  const { messages } = await req.json();

  let out = "";
  const stream = client.chatCompletionStream({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages,
    max_tokens: 500,
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
      console.log(newContent);
    }
  }

  return new Response(JSON.stringify({ response: out }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
