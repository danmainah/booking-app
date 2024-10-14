import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
