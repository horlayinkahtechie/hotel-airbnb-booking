import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useSession } from "next-auth/react";

export default function useChat() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const email = session.user.email;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("email", email)
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
          // Only add to state if message belongs to this user
          if (payload.new.email === email) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, status]);

  const sendMessage = async (text, sender = "You") => {
    if (!text.trim() || !session?.user?.email) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const year = now.getFullYear();

    await supabase.from("messages").insert({
      content: text,
      sender,
      email: session.user.email,
      time,
      year,
    });
  };

  return { messages, sendMessage };
}
