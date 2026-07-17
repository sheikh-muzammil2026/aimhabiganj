"use client";

import Image from "next/image"; // Next.js-এর Image কম্পোনেন্ট ইম্পোর্ট করা হলো

export default function TopHeader() {
  return (
    <div className="w-full print:hidden bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 text-white py-4 px-6 border-b border-amber-500/30 relative overflow-hidden transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-emerald-800">

      {/* ব্যাকগ্রাউন্ড জলছাপ/মেহরাব ইফেক্ট */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* মেইন কন্টেইনার: রেসপনসিভ লেআউট */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-4">
        
        {/* বাম পাশ: লোগো এবং ৩ ভাষার নাম */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          
          {/* লোগো সেকশন */}
          <div className="flex-shrink-0 bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur-sm">
            <Image 
              src="/aimlogo.png" 
              alt="As-Salam Ideal Madrasah Logo" 
              width={75} 
              height={75} 
              className="object-contain h-auto w-[65px] md:w-[75px]"
              priority
            />
          </div>

          {/* ৩ ভাষার নাম সেকশন */}
          <div className="flex flex-col space-y-0.5">
            {/* ১. আরবি নাম (Reem Kufi ফন্ট) */}
            <p className="text-sm md:text-base font-arabic text-emerald-200/90 tracking-wider dark:text-slate-400 sm:text-right" dir="rtl" lang="ar">
              مدرسة السلام النموذجية، حبيغنج
            </p>
            {/* ২. বাংলা নাম */}
            <p className="text-base md:text-xl font-bold text-emerald-50 tracking-normal dark:text-slate-200">
              আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ
            </p>
            {/* ৩. ইংরেজি নাম */}
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans">
              As-Salam Ideal Madrasah
            </h1>
          </div>

        </div>

        {/* ডান পাশ: স্লোগান সেকশন */}
        <div className="flex items-center justify-center md:justify-end md:self-end md:pb-1">
          <p className="text-xs md:text-sm font-medium tracking-widest text-amber-300/90 italic border-t border-amber-500/20 pt-1 md:border-t-0 md:pt-0 uppercase dark:text-emerald-300/80">
            Aİ M For Ultimate Success
          </p>
        </div>

      </div>
    </div>
  );
}
