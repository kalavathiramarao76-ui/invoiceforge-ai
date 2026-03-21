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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("invoiceforge-theme")||"dark";var r=t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light":t;document.documentElement.setAttribute("data-theme",r);if(r==="light"){document.body.style.background="#f7f7f8";document.body.style.color="#09090b";document.documentElement.style.setProperty("--if-bg","#f7f7f8");document.documentElement.style.setProperty("--if-text","#09090b");document.documentElement.style.setProperty("--if-bg-card","#ffffff");document.documentElement.style.setProperty("--if-border","rgba(0,0,0,0.08)");document.documentElement.style.setProperty("--if-surface","rgba(0,0,0,0.02)");document.documentElement.style.setProperty("--if-text-secondary","#52525b");document.documentElement.style.setProperty("--if-text-muted","#71717a");document.documentElement.style.setProperty("--if-bg-hover","#f0f0f2");document.documentElement.style.setProperty("--if-sidebar-bg","#ffffff")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
