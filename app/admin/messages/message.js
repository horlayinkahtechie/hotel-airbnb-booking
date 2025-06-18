"use client";
import AdminNavbar from "@/app/_components/adminNav";
import AdminSidebar from "@/app/_components/adminSidebar";
import Spinner from "@/app/_components/Spinner";
import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiMail,
  FiUser,
  FiClock,
  FiSend,
  FiArrowLeft,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

import { useRouter } from "next/navigation";

const AdminMessages = () => {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  // Filter messages based on tab and search
  const filteredMessages = messages.filter((msg) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !msg.is_read) ||
      (activeTab === "replied" && msg.status === "replied");

    const matchesSearch =
      msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg))
      );
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data: messages, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (session?.user?.role !== "admin") {
          router.push("/unauthorized");
          setLoading(false);
          return;
        }
        if (error) throw error;

        // Fetch replies for each message
        const messagesWithReplies = await Promise.all(
          messages.map(async (msg) => {
            const { data: replies } = await supabase
              .from("messages_replies")
              .select("*")
              .eq("message_id", msg.id);
            return { ...msg, replies: replies || [] };
          })
        );

        setMessages(messagesWithReplies);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedMessage) return;

    try {
      // Insert reply into database
      const { error } = await supabase.from("messages_replies").insert({
        message_id: selectedMessage.id,
        content: replyContent,
      });

      if (session?.user?.role !== "admin") {
        console.log("Unauthorized access - redirecting");
        router.push("/unauthorized");
        setLoading(false);
        return;
      }
      if (error) throw error;

      // Update message status
      await supabase
        .from("messages")
        .update({ status: "replied" })
        .eq("id", selectedMessage.id);

      // Update local state
      setMessages(
        messages.map((msg) =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                status: "replied",
                replies: [
                  ...msg.replies,
                  {
                    id: Date.now().toString(),
                    content: replyContent,
                    created_at: new Date().toISOString(),
                  },
                ],
              }
            : msg
        )
      );

      setReplyContent("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);

      if (error) throw error;

      setMessages(messages.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <div className="lg:flex">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full min-h-screen bg-gray-50">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Guest Messages
            </h1>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "unread"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setActiveTab("replied")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "replied"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Replied
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Message List */}
                <div
                  className={`${
                    selectedMessage ? "hidden md:block md:w-2/5" : "w-full"
                  } bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`}
                >
                  <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            markAsRead(msg.id);
                          }}
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                            !msg.is_read ? "bg-blue-50" : ""
                          } ${
                            selectedMessage?.id === msg.id ? "bg-blue-100" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Olayinka
                              </h3>
                              <p className="text-sm text-gray-600">
                                {msg.email}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {new Date(msg.created_at).toLocaleDateString()}
                              </span>
                              {!msg.is_read && (
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                          </div>
                          <h4 className="font-semibold mt-2 text-gray-800">
                            {msg.subject}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {msg.message}
                          </p>
                          {msg.status === "replied" && (
                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Replied
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No messages found
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Detail View */}
                {selectedMessage ? (
                  <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="md:hidden flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FiArrowLeft className="mr-1" /> Back
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedMessage.subject}
                          </h2>
                          <div className="flex items-center mt-2 text-gray-600">
                            <FiUser className="mr-2" />
                            <span>
                              {selectedMessage.name} &lt;{selectedMessage.email}
                              &gt;
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-500 text-sm">
                            <FiClock className="mr-2" />
                            <span>
                              {new Date(
                                selectedMessage.created_at
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="whitespace-pre-line">
                          {selectedMessage.content}
                        </p>
                      </div>

                      {/* Replies */}
                      {selectedMessage.replies.length > 0 && (
                        <div className="mb-8">
                          <h3 className="font-medium text-gray-900 mb-4">
                            Replies
                          </h3>
                          {selectedMessage.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="mb-4 pl-4 border-l-4 border-blue-200"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-blue-600">
                                  Admin
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="whitespace-pre-line">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-900 mb-3">
                          Send Reply
                        </h3>
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Type your reply here..."
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={handleReply}
                            disabled={!replyContent.trim()}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <FiSend className="mr-2" /> Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex flex-1 items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center p-8">
                      <FiMail className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        Select a message
                      </h3>
                      <p className="mt-1 text-gray-500">
                        Choose a message from the list to view details and reply
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMessages;
