import "./globals.css";
import Providers from "@/components/Providers/providers";
import AIChatbot from "@/components/AIChatbot";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "As-Salam Ideal Madrasah  (AIM)",
  description: "Welcome to our website",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <link
          rel="preload"
          href="/fonts/Bornomala-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Bornomala-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/UbuntuSans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#01160e] dark:bg-[#010604]">
        <Providers>
          <main>{children}</main>
          <AIChatbot />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
