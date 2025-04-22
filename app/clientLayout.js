"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./_components/Navbar";

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
