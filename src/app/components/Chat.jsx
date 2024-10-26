"use client";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Scroll to the latest message when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-[80%] mx-auto p-4">
      <div className="overflow-y-auto h-[85vh] p-4 mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.role === "user"
                ? "bg-green-200 self-end ml-auto"
                : "bg-gray-200 self-start"
            } p-3 rounded-lg max-w-max break-words`}
          >
            {msg.content}
          </div>
        ))}
        {/* Dummy div to keep scroll at the bottom */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-md border border-gray-300"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="ml-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
