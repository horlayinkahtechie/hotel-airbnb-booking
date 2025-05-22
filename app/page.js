"use client";

import { useState } from "react";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import StandardListingCard from "./_components/StandardListingCard";
import HowItWorks from "./_components/HowItWorks";
import Footer from "./_components/Footer";
import LuxuryListingCard from "./_components/luxuryListingCard";
import BasicListingCard from "./_components/BasicListingCard";
import Chat from "@/hooks/chat";
import ChatWidget from "./_components/chatWidget";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const { messages, sendMessage } = Chat();

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <BasicListingCard />
      <StandardListingCard />
      <LuxuryListingCard />
      <HowItWorks />
      <Footer />

      <ChatWidget />
    </div>
  );
}
