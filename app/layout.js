import "./globals.css";
import ClientLayout from "./clientLayout";

export const metadata = {
  title: "BookNest",
  description: "Find the best hotels, apartments, and shortlets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
