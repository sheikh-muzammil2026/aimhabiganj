"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function TopHeader() {
  const { t } = useLanguage();

  return (
    <div className="w-full print:hidden bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 text-white py-3 px-4 md:px-6 border-b border-amber-500/30 relative overflow-hidden transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-emerald-800">



      {/* মেইন কন্টেইনার */}
      <div className="max-w-7xl mx-auto flex flex-row items-center relative z-10 gap-4 md:gap-6">

        {/* লোগো সেকশন:  */}
        <div className="flex-shrink-0 w-[80px] h-[80px] md:w-[128px] md:h-[128px] relative rounded-full overflow-hidden p-[2px] bg-transparent">
          <Link href={'/'}> <Image
            src="/aimlogo1.png"
            alt="As-Salam Ideal Madrasah  (AIM) Logo"
            fill
            sizes="(max-width: 768px) 60px, 85px"
            className="object-cover scale-[1.06] rounded-full"
            priority
          /></Link>
        </div>

        {/* নাম ও স্লোগান কন্টেইনার: ফুল উইডথ দখল করবে */}
        <div className="flex-1 flex flex-col space-y-1 w-full text-center">

          {/* ১. আরবি নাম: ة এবং لا এর জন্য ফালব্যাক ফন্ট ব্যবহার করা হয়েছে */}
          <p className="text-[18px] scale-x-130 md:text-3xl md:scale-x-235  kufi-custom text-emerald-200/90 tracking-wide dark:text-slate-400" dir="rtl" lang="ar">
            مدرس<span className="font-sans">ة</span> الس<span className="font-sans">لا</span>م النموذجي<span className="font-sans">ة</span>
          </p>
          {/* text-[25px] md:text-[90px] md:scale-x-125 origin-right kufi-custom text-emerald-200/90 tracking-wide dark:text-slate-400" dir="rtl" lang="ar" */}

          {/* ২. বাংলা নাম: ফন্ট সাইজ বড় করে রেগুলার এলাইনমেন্ট */}
          <p className="text-[13px] md:text-4xl font-bold text-emerald-50 tracking-normal dark:text-slate-200 leading-tight font-shalda">
            আস-সালাম আইডিয়াল মাদরাসা (এইম)
          </p>

          {/* ৩. ইংরেজি নাম */}
          <h1 className="text-[15px] md:text-[46px] font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize  leading-none font-britanic">
            As-Salam Ideal Madrasah  (AIM)
          </h1>

          {/* ৪. স্লোগান: সম্পূর্ণ নতুন লাইনে এবং রাইট সাইডে পুশ করা হয়েছে */}
          <div className="w-full flex justify-end pt-1 md:pt-1.5 border-t border-white/5">
            <p className="text-[10px] md:text-sm font-medium tracking-widest text-amber-300/85 italic uppercase dark:text-emerald-300/70">
              {t('header.slogan')}
            </p>
          </div>

        </div>

        {/* ৫. ভাষা পরিবর্তনকারী (Language Switcher) */}
        <div className="hidden md:flex-shrink-0 md:z-50">
          <LanguageSwitcher />
        </div>

      </div>
    </div>
  );
}
