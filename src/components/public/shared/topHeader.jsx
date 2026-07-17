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

      {/* মেইন কন্টেইনার: মোবাইল ও ডেস্কটপ সবখানে পাশাপাশি রাখার জন্য flex-row এবং justify-between */}
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between relative z-10 gap-2 md:gap-4">
        
        {/* বাম পাশ: লোগো এবং ৩ ভাষার নাম (মোবাইলেও লম্বালম্বি হবে না, পাশাপাশি থাকবে) */}
        <div className="flex flex-row items-center text-left gap-3 md:gap-4">
          
          {/* লোগো সেকশন: rounded-full এবং overflow-hidden দিয়ে নিশ্চিতভাবে গোল করা হয়েছে */}
          <div className="flex-shrink-0 w-[55px] h-[55px] md:w-[75px] md:h-[75px] rounded-full overflow-hidden bg-white/5 border border-white/20 backdrop-blur-sm relative">
            <Image 
              src="/aimlogo1.png" 
              alt="As-Salam Ideal Madrasah Logo" 
              fill
              sizes="(max-width: 768px) 55px, 75px"
              className="object-contain p-0.5 rounded-full"
              priority
            />
          </div>

          {/* ৩ ভাষার নাম সেকশন: text-left দিয়ে লেখাগুলো সবসময় বাম ঘেঁষে থাকবে */}
          <div className="flex flex-col space-y-0.5 text-left">
            {/* ১. আরবি নাম */}
            <p className="text-xs md:text-base font-arabic text-emerald-200/90 tracking-wider dark:text-slate-400" dir="rtl" lang="ar">
         مدرسة السلام النموذجية
            </p>
            {/* ২. বাংলা নাম */}
            <p className="text-sm md:text-xl font-bold text-emerald-50 tracking-normal dark:text-slate-200 leading-tight">
              আস-সালাম আইডিয়াল মাদ্রাসা
            </p>
            {/* ৩. ইংরেজি নাম */}
            <h1 className="text-base md:text-2xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans leading-none">
              As-Salam Ideal Madrasah
            </h1>
          </div>

        </div>

        {/* ডান পাশ: স্লোগান সেকশন (সব ডিভাইসে ডানেই থাকবে এবং টেক্সট সাইজ ছোট করে অ্যাডজাস্ট করা) */}
        <div className="flex flex-col items-end justify-center self-end pb-0.5 md:pb-1 text-right min-w-[100px] md:min-w-[180px]">
          <p className="text-[9px] md:text-sm font-medium tracking-tighter md:tracking-widest text-amber-300/90 italic uppercase dark:text-emerald-300/80 leading-tight">
            AIM For Ultimate Success
          </p>
        </div>

      </div>
    </div>
  );
}
