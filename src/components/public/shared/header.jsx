"use client";

import React from "react";
import Link from "next/link";
// নোট: আইকনের জন্য lucide-react ব্যবহার করা হয়েছে। 
// ইনস্টল না থাকলে টার্মিনালে রান করুন: npm i lucide-react
import { Phone, Mail, MapPin } from "lucide-react"; 

export default function Header() {
  return (
    <header className="w-full shadow-md font-sans antialiased print:hidden">
      
      {/* --- টপ বার (Top Bar) --- */}
      <div className="w-full bg-[#00441B] text-white py-2.5 px-4 sm:px-6 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* বাম পাশে: যোগাযোগের তথ্য */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs sm:text-sm text-gray-200">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              +৮৮০ ১২৩৪-৫৬৭৮৯০
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              info@assalam.edu.bd
            </span>
          </div>

          {/* মাঝখানে: আরবি নাম (ক্যালিগ্রাফি স্টাইল ফন্ট) */}
          <div className="text-xl sm:text-2xl font-bold tracking-wide text-[#E8C87C]" style={{ fontFamily: "'Amiri', serif" }}>
            مدرسة السلام النموذجية
          </div>

          {/* ডান পাশে: ইংরেজি স্লোগান */}
          <div className="text-xs sm:text-sm font-medium tracking-wider uppercase text-gray-300 italic">
            "Aim for Ultimate Success"
          </div>
          
        </div>
      </div>

      {/* --- মূল ন্যাভবার (Main Navbar) --- */}
      <div className="w-full bg-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* বাম পাশে: লোগো এবং মাদ্রাসার নাম (বাংলা ও ইংরেজি) */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* ডামি লোগো প্লেসহোল্ডার (এখানে আপনার আসল লোগো ইমেজ বসবে) */}
            <div className="w-14 h-14 bg-[#00441B] rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-white font-bold text-xl shadow-inner">
              AS
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-[#00441B] leading-tight tracking-wide">
                আস-সালাম আইডিয়াল মাদ্রাসাহ
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-500 tracking-normal">
                As-Salam Ideal Madrasah, Habiganj
              </span>
            </div>
          </Link>

          {/* ডান পাশে: বেশি সংখ্যক মেনু আইটেমসমূহ */}
          <nav className="flex flex-wrap justify-center lg:justify-end items-center gap-1 sm:gap-2">
            {[
              { name: "হোম", href: "/" },
              { name: "আমাদের সম্পর্কে", href: "/about" },
              { name: "ভর্তি তথ্য", href: "/admission" },
              { name: "একাডেমিক", href: "/academic" },
              { name: "ফলাফল", href: "/results" },
              { name: "গ্যালারি", href: "/gallery" },
              { name: "যোগাযোগ", href: "/contact" },
            ].map((menu, idx) => (
              <Link
                key={idx}
                href={menu.href}
                className="px-3 py-2 text-sm font-bold text-gray-700 hover:text-[#00441B] hover:bg-emerald-50 rounded-md transition-all duration-200"
              >
                {menu.name}
              </Link>
            ))}
            
            {/* অনলাইন ভর্তি বা জরুরি একটি বাটন */}
            <Link 
              href="/admission/form" 
              className="ml-2 bg-[#00441B] hover:bg-[#003314] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg border border-[#D4AF37] shadow-sm transition-all duration-150 active:scale-95"
            >
              অনলাইন ভর্তি
            </Link>
          </nav>

        </div>
      </div>
      
    </header>
  );
}
