import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const inter = Lexend({ subsets: ["latin"] });

let title = "Hemp Chat – AI Search Engine";
let description =
  "Ask me anything about hemp!";
let url = "https://zasti.ai/";
let ogimage = "public/img/zasti.svg";
let sitename = "Zasti.ai";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="Zasti.ai" />
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col justify-between bg-[#D9E8C5]`}
      >
        {children}
      </body>
    </html>
  );
}
