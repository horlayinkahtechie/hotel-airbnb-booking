"use client";
import { useState } from "react";
import useChat from "@/hooks/chat";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const { messages, replies, sendMessage } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempId = uuidv4();

    const optimisticMsg = {
      id: tempId,
      content: input,
      sender: "You",
      status: "sending",
      created_at: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    try {
      await sendMessage(input);
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (err) {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  // Combine and organize messages with replies
  const messageThreads = [
    ...messages,
    ...localMessages.filter((lm) => !messages.some((m) => m.id === lm.id)),
  ].map((message) => ({
    ...message,
    replies: replies.filter((reply) => reply.message_id === message.id),
  }));

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white border shadow-lg rounded-lg z-50 flex flex-col">
          <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
            <h4 className="font-semibold">Chat Support</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messageThreads.map((thread) => (
              <div key={thread.id || thread.tempId} className="space-y-2">
                {/* User message */}
                <div className="bg-blue-100 p-3 rounded-lg ml-auto max-w-[80%]">
                  <div className="font-medium text-blue-800">You</div>
                  <p>{thread.content}</p>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(thread.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {thread.status && (
                      <span
                        className={`ml-2 ${
                          thread.status === "sent"
                            ? "text-green-500"
                            : thread.status === "sending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {thread.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin replies */}
                {thread.replies?.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]"
                  >
                    <div className="font-medium text-gray-800">
                      Support Team
                    </div>
                    <p>{reply.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(reply.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaCommentDots size={24} />
      </button>
    </>
  );
}
