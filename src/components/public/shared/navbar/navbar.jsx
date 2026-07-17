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

      {/* মেইন কন্টেইনার: লোগো বামে এবং টেক্সট ব্লক বাকি পুরোটা জুড়ে থাকবে */}
      <div className="max-w-7xl mx-auto flex flex-row items-center relative z-10 gap-3 md:gap-5">
        
        {/* লোগো সেকশন: বাড়তি সব ব্যাকগ্রাউন্ড ও বর্ডার রিমুভ করে একদম ক্লিন করা হয়েছে */}
        <div className="flex-shrink-0 w-[60px] h-[60px] md:w-[80px] md:h-[80px] relative rounded-full overflow-hidden">
          <Image 
            src="/aimlogo1.png" 
            alt="As-Salam Ideal Madrasah Logo" 
            fill
            sizes="(max-width: 768px) 60px, 80px"
            className="object-cover scale-[1.12]" // scale ব্যবহার করে বিশ্রী চারকোনা মার্জিনটা কেটে ফেলে শুধু ভেতরের গোল লোগোটা জুম করা হয়েছে
            priority
          />
        </div>

        {/* নাম ও স্লোগান সেকশন: w-full এবং flex-1 দিয়ে এটি লোগোর পর বাকি পুরো হেডার জুড়ে থাকবে */}
        <div className="flex-1 flex flex-col space-y-0.5 text-left">
          
          {/* ১. আরবি নাম */}
          <p className="text-xs md:text-base font-arabic text-emerald-200/90 tracking-wider dark:text-slate-400" dir="rtl" lang="ar">
            مدرسة السلام النموذجية، حبيغنج
          </p>
          
          {/* ২. বাংলা নাম */}
          <p className="text-sm md:text-xl font-bold text-emerald-50 tracking-normal dark:text-slate-200 leading-tight">
            আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ
          </p>
          
          {/* ৩. ইংরেজি নাম */}
          <h1 className="text-base md:text-2xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans leading-none">
            As-Salam Ideal Madrasah
          </h1>

          {/* ৪. স্লোগান: ইংরেজি নামের ঠিক নিচে নতুন লাইনে */}
          <p className="text-[10px] md:text-xs font-medium tracking-widest text-amber-300/85 italic uppercase dark:text-emerald-300/70 pt-1">
            AIM For Ultimate Success
          </p>
          
        </div>

      </div>
    </div>
  );
}
