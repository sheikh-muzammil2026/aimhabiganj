"use client";

import Image from "next/image";

export default function TopHeader() {
  return (
    <div className="w-full print:hidden bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 text-white py-3 px-4 md:px-6 border-b border-amber-500/30 relative overflow-hidden transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-emerald-800">

      {/* ব্যাকগ্রাউন্ড জলছাপ/মেহরাব ইফেক্ট */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* মেইন কন্টেইনার */}
      <div className="max-w-7xl mx-auto flex flex-row items-center relative z-10 gap-4 md:gap-6">
        
        {/* লোগো সেকশন: মার্জিন ১ পিক্সেল বাড়ানো হয়েছে এবং scale কমিয়ে গোল অংশ নিখুঁত করা হয়েছে */}
        <div className="flex-shrink-0 w-[60px] h-[60px] md:w-[85px] md:h-[85px] relative rounded-full overflow-hidden p-[2px] bg-transparent">
          <Image 
            src="/aimlogo1.png" 
            alt="As-Salam Ideal Madrasah Logo" 
            fill
            sizes="(max-width: 768px) 60px, 85px"
            className="object-cover scale-[1.06] rounded-full" 
            priority
          />
        </div>

        {/* নাম ও স্লোগান কন্টেইনার: ফুল উইডথ দখল করবে */}
        <div className="flex-1 flex flex-col space-y-1 w-full text-left">
          
          {/* ১. আরবি নাম: ফন্ট সাইজ বাড়িয়ে স্বাভাবিক ফ্লুইড অবস্থায় আনা হয়েছে */}
          <p className="text-xl md:text-5xl font-arabic text-emerald-200/90 tracking-wide dark:text-slate-400" dir="rtl" lang="ar">
            مدرسة السلام النموذجية
          </p>
          
          {/* ২. বাংলা নাম: ফন্ট সাইজ বড় করে রেগুলার এলাইনমেন্ট */}
          <p className="text-sm md:text-5xl font-bold text-emerald-50 tracking-normal dark:text-slate-200 leading-tight">
            আস-সালাম আইডিয়াল মাদ্রাসা
          </p>
          
          {/* ৩. ইংরেজি নাম */}
          <h1 className="text-xl md:text-5xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans leading-none">
            As-Salam Ideal Madrasah
          </h1>

          {/* ৪. স্লোগান: সম্পূর্ণ নতুন লাইনে এবং রাইট সাইডে পুশ করা হয়েছে */}
          <div className="w-full flex justify-end pt-1 md:pt-1.5 border-t border-white/5">
            <p className="text-[10px] md:text-sm font-medium tracking-widest text-amber-300/85 italic uppercase dark:text-emerald-300/70">
              AIM For Ultimate Success
            </p>
          </div>
          
        </div>

      </div>
    </div>
  );
}
