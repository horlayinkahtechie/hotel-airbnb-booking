"use client";

import { useState } from "react";
import useChat from "@/hooks/chat";
import { FaCommentDots, FaTimes } from "react-icons/fa";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
    setInput(""); // clear input
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border shadow-lg rounded-lg z-50 flex flex-col">
          <div className="flex items-center justify-between bg-blue-600 text-white p-3">
            <h4 className="font-semibold">Chat with us</h4>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm text-gray-700">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-gray-100 p-2 rounded">
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Chat with us"
      >
        <FaCommentDots size={24} />
      </button>
    </>
  );
}
