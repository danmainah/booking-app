import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";

export const metadata: Metadata = {
  title: "Booking App",
  description: "An app to make reservations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
          <SessionProvider>
            {children}
          </SessionProvider>
        </body>
    </html>
  );
}
