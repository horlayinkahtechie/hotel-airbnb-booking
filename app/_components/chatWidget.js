"use client";

import { useState } from "react";
import useChat from "@/hooks/chat";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const { messages, sendMessage } = useChat();
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const year = now.getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempId = uuidv4(); // generate a temporary ID for tracking

    // A message to UI immediately with status "sending"
    const optimisticMsg = {
      id: tempId,
      content: input,
      sender: "You",
      status: "sending",
      time: time,
      year: year,
    };
    setLocalMessages((prev) => [...prev, optimisticMsg]);

    setInput("");

    try {
      await sendMessage(input, "You");
      // Update the message status to "sent"
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (err) {
      // Update status to "not sent"
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "not sent" } : msg
        )
      );
    }
  };

  // Combine real messages from DB with local optimistic ones
  const displayedMessages = [
    ...messages,
    ...localMessages.filter(
      (localMsg) => !messages.some((msg) => msg.id === localMsg.id)
    ),
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-90 h-120 bg-white border shadow-lg rounded-lg z-50 flex flex-col">
          <div className="flex items-center justify-between bg-blue-600 text-white p-3">
            <h4 className="font-semibold">Chat with us</h4>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 p-4 pl-10 overflow-y-auto space-y-2 text-sm text-gray-700">
            {displayedMessages.map((msg) => (
              <>
                <div
                  key={msg.id}
                  className="bg-gray-100 p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                </div>
                <div className="text-right">
                  <p>
                    {msg.time ||
                      new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    {msg.year || new Date(msg.created_at).getFullYear()}
                  </p>

                  {msg.status && (
                    <p
                      className={`text-[13.5px] ml-2  ${
                        msg.status === "sent"
                          ? "text-green-500"
                          : msg.status === "sending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {msg.status}
                    </p>
                  )}
                </div>
              </>
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
