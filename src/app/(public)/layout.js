import Footer from '@/components/public/shared/footer';
import TopHeader from '@/components/public/shared/topHeader';
import BottomNavbar from '@/components/public/shared/BottomNavbar';
import AIChatbot from "@/components/AIChatbot";
import React from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';


export const metadata = {
  title: {
    default: "As-Salam Ideal Madrasah | আস-সালাম আইডিয়াল মাদ্রাসা",
    template: "%s | As-Salam Ideal Madrasah",
  },
  description: "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থাসহ চারবর্ষে হিফজ ও একাডেমিক শিক্ষার এক অনন্য প্রতিষ্ঠান, হবিগঞ্জ।",
  keywords: ["aimhabiganj", "As-Salam Ideal Madrasah", "আস-সালাম আইডিয়াল মাদ্রাসা", "হবিগঞ্জ মাদ্রাসা", "Hifz Madrasah Habiganj"],
  openGraph: {
    title: "As-Salam Ideal Madrasah, Habiganj",
    description: "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থাসহ ৬ মাসে হিফজ একাডেমিক শিক্ষার এক অনন্য প্রতিষ্ঠান।",
    url: "https://aimhabiganj.vercel.app", // আপনার বর্তমান ডোমেইন
    siteName: "As-Salam Ideal Madrasah",
    locale: "bn_BD",
    type: "website",
  },
};

const layout = ({ children }) => {
  return (
    <div>
      <TopHeader />


      <main className="min-h-screen pb-16 md:pb-0">
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
// BETTER_AUTH_SECRET=E1NnJYqNWZq0OIw49znddHpNbp4U2IAC
// NEXT_PUBLIC_SERVER_API=http://localhost:5000
// NEXT_PUBLIC_IMGBB_API_KEY=5a4f8c279ddcedf0d73f50444bad88b0
