import Footer from '@/components/public/shared/footer';
import Navbar from '@/components/public/shared/navbar/navbar';
import TopHeader from '@/components/public/shared/topHeader';
import BottomNavbar from '@/components/public/shared/BottomNavbar';
import React from 'react';


export const metadata = {
  title: {
    default: "As-Salam Ideal Madrasah, Habiganj | আস-সালাম আইডিয়াল মাদ্রাসা",
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
      <Navbar />
      
      <main className="min-h-screen pb-16 md:pb-0">
        {children}
      </main>
      
      <BottomNavbar />
      <Footer />
    </div>
  );
};

export default layout;
