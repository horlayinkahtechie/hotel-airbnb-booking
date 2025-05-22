import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function useChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (text, sender = "Guest") => {
    if (!text.trim()) return;
    await supabase.from("messages").insert({ content: text, sender });
  };

  return { messages, sendMessage };
}
