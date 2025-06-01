import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useSession } from "next-auth/react";

export default function useChat() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const email = session.user.email;

    const fetchData = async () => {
      // Fetch user messages
      const { data: messages, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: true });

      if (!msgError && messages) {
        setMessages(messages);

        // Fetch replies for these messages
        const { data: replies, error: replyError } = await supabase
          .from("messages_replies")
          .select("*")
          .in(
            "message_id",
            messages.map((m) => m.id)
          );

        if (!replyError) setReplies(replies);
      }
    };

    fetchData();

    // Realtime subscriptions
    const messagesChannel = supabase
      .channel("user-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.email === email) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    const repliesChannel = supabase
      .channel("admin-replies")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_replies" },
        (payload) => {
          if (messages.some((m) => m.id === payload.new.message_id)) {
            setReplies((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, [session, status]);

  const sendMessage = async (text) => {
    if (!text.trim() || !session?.user?.email) return;

    await supabase.from("messages").insert({
      content: text,
      sender: "You",
      email: session.user.email,
    });
  };

  return { messages, replies, sendMessage };
}
