"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function ClientLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {" "}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
