"use client";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the conversation
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send the message to your API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (response.ok) {
        // Add the model's response to the conversation
        setMessages([
          ...newMessages,
          { role: "model", content: data.response },
        ]);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="overflow-y-auto h-[85vh] p-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              backgroundColor: msg.role === "user" ? "#DCF8C6" : "#E8E8E8",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              maxWidth: "80%",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
