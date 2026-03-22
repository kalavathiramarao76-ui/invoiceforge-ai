import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

const siteUrl = "https://invoiceforge-ai.vercel.app";

export const metadata: Metadata = {
  title: "InvoiceForge AI — Get Paid Faster | AI Invoice, Proposal & Contract Generator",
  description:
    "AI-powered invoice, proposal & contract generator for freelancers. Create professional documents in seconds. Free, no signup required.",
  keywords: [
    "invoice generator",
    "AI invoice",
    "proposal writer",
    "contract generator",
    "freelancer tools",
    "billing software",
    "AI documents",
  ],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "InvoiceForge AI — AI Invoice, Proposal & Contract Generator",
    description:
      "AI-powered invoice, proposal & contract generator for freelancers. Create professional documents in seconds. Free, no signup required.",
    type: "website",
    url: siteUrl,
    siteName: "InvoiceForge AI",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "InvoiceForge AI — Get Paid Faster",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceForge AI — AI Invoice, Proposal & Contract Generator",
    description:
      "AI-powered invoice, proposal & contract generator for freelancers. Create professional documents in seconds.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@invoiceforge_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InvoiceForge AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered invoice, proposal & contract generator for freelancers. Create professional documents in seconds.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "95",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <div className="noise" />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
