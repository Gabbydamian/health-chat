// app/api/huggingface-chat/route.js
import { HfInference } from "@huggingface/inference";

export async function POST(req) {
  const client = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);
  const { messages } = await req.json();

  try {
    const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 10000); 

    let out = "";
    const stream = client.chatCompletionStream({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages,
      max_tokens: 500,
      signal: controller.signal, 
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        out += newContent;
        // console.log(newContent);
      }
    }

    // clearTimeout(timeoutId);
    return new Response(JSON.stringify({ response: out }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Hugging Face API" }),
      { status: 500 }
    );
  }
}

