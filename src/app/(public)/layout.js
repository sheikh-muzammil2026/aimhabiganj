import Footer from '@/components/public/shared/footer';
import TopHeader from '@/components/public/shared/topHeader';
import BottomNavbar from '@/components/public/shared/BottomNavbar';
import AIChatbot from "@/components/AIChatbot";
import React from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';


export const metadata = {
  // মেটাডাটা বেস URL (ওপেন গ্রাফ ইমেজের জন্য আবশ্যক)
  metadataBase: new URL("https://aimhabiganj.vercel.app"),

  title: {
    default: "As-Salam Ideal Madrasah (AIM) | আস-সালাম আইডিয়াল মাদরাসা (এইম)",
    template: "%s | As-Salam Ideal Madrasah (AIM)",
  },
  description:
    "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থাসহ একাডেমিক শিক্ষা ও ৬ মাসে হিফজ করার এক অনন্য প্রতিষ্ঠান, হবিগঞ্জ।",
  
  // কিওয়ার্ড সংখ্যা ও প্রাসঙ্গিকতা বৃদ্ধি
  keywords: [
    "aimhabiganj",
    "As-Salam Ideal Madrasah (AIM)",
    "আস-সালাম আইডিয়াল মাদরাসা (এইম)",
    "হবিগঞ্জ মাদ্রাসা",
    "Hifz Madrasah Habiganj",
    "Habiganj Islamic School",
    "হবিগঞ্জ হিফজ মাদ্রাসা",
    "best madrasah in habiganj",
    "ইসলামিক শিক্ষা হবিগঞ্জ",
  ],

  // Google Search & indexing নির্দেশিকা
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // সোশ্যাল মিডিয়া রিচ বাড়াতে OpenGraph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "As-Salam Ideal Madrasah (AIM) | আস-সালাম আইডিয়াল মাদরাসা (এইম)",
    description:
      "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থাসহ একাডেমিক শিক্ষা ও ৬ মাসে হিফজ করার এক অনন্য প্রতিষ্ঠান, হবিগঞ্জ।",
    url: "https://aimhabiganj.vercel.app",
    siteName: "As-Salam Ideal Madrasah (AIM)",
    images: [
      {
        url: "/og-image.png", // public/og-image.png ফোল্ডারে ১২০০x৬৩০ সাইজের ব্যানার রাখবেন
        width: 1200,
        height: 630,
        alt: "As-Salam Ideal Madrasah Habiganj Banner",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },

  // Twitter / X কার্ড মেটাডেটা
  twitter: {
    card: "summary_large_image",
    title: "As-Salam Ideal Madrasah (AIM), Habiganj",
    description:
      "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থাসহ একাডেমিক শিক্ষা ও ৬ মাসে হিফজ করার এক অনন্য প্রতিষ্ঠান।",
    images: ["/og-image.png"],
  },

  // ডুप्लिकেট ইউআরএল সমস্যা দূর করতে
  alternates: {
    canonical: "https://aimhabiganj.vercel.app",
  },
};

const layout = ({ children }) => {
  return (
    <div>
      <TopHeader />


      <main className="min-h-screen pb-24 md:pb-28">
        {children}
      </main>

      <BottomNavbar />
      <AIChatbot />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default layout;

// MONGODB_URI=mongodb://aimhabiganj:r9eTrIxDeV8lsUKI@ac-famfzlt-shard-00-00.w9cbrwo.mongodb.net:27017,ac-famfzlt-shard-00-01.w9cbrwo.mongodb.net:27017,ac-famfzlt-shard-00-02.w9cbrwo.mongodb.net:27017/aimhabiganj?ssl=true&replicaSet=atlas-131uq2-shard-0&authSource=admin&appName=Cluster0
// BETTER_AUTH_URL=http://localhost:3000
// GEMINI_API_KEY=AQ.Ab8RN6I-3s6LG9nM8T-7OiFqxXcSf7amO8v4OsK43NJLiMRb2w
// KIMI_API_KEY=sk-drSwsZI4cBkmY6X6PVz8RyZCGs4wgBcvFQkZibbxxwkDkxFm
// BETTER_AUTH_SECRET=E1NnJYqNWZq0OIw49znddHpNbp4U2IAC
// NEXT_PUBLIC_SERVER_API=http://localhost:5000
// NEXT_PUBLIC_BASE_URI=https://aimhabiganj.vercel.app
// NEXT_PUBLIC_IMGBB_API_KEY=655d8bb450403cae15210dca401de9af
