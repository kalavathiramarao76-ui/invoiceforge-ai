import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvoiceForge AI — Get Paid Faster",
  description:
    "AI-powered invoice, proposal & contract generator for freelancers. Create professional documents in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
