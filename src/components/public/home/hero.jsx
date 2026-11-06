"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { language, t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden -mt-[104px] sm:-mt-[112px]">
      {/* 1. Main Hero Container with Static Background Image & Overlay */}
      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] w-full flex flex-col justify-between pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        {/* Background Image: Static /assembly.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assembly2.jpg"
            alt="AIM Campus Assembly"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />

          {/* Dark Overlay so typography is crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Decorative Islamic Geometric Star Pattern on the left (matching reference) */}
          <div className="hidden md:flex pointer-events-none absolute -bottom-6 -left-10 w-80 h-80 sm:w-96 sm:h-96 opacity-15 text-white">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-full h-full"
            >
              <polygon points="100,10 120,60 170,40 150,90 195,120 145,140 150,190 100,165 50,190 55,140 5,120 50,90 30,40 80,60" />
              <polygon points="100,25 115,65 155,50 140,90 175,115 135,130 140,170 100,150 60,170 65,130 25,115 60,90 45,50 85,65" />
              <circle cx="100" cy="100" r="50" />
              <circle cx="100" cy="100" r="25" />
            </svg>
          </div>
        </div>

        {/* 2. Left Side: Left-aligned bold white typography & action buttons */}
        <div className="flex items-center justify-center relative z-10 max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-6">
          <div className="max-w-[1380px]  space-y-4 sm:space-y-5 py-12">
            {/* Bold White Headline */}
            <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold text-white tracking-tight leading-tight">
              {language === "bn"
                ? "আস-সালাম আইডিয়াল মাদরাসা (এইম)"
                : language === "ar"
                  ? "مدرسة السلام النموذجية"
                  : "As-Salam Ideal Madrasah (AIM)"}
            </h1>

            {/* Slogan */}
            <p className="text-sm sm:text-base text-emerald-300 font-semibold tracking-wide">
              {t("header.slogan")}
            </p>

            {/* Concise Description Text */}
            <p className="text-xs sm:text-sm md:text-[15px] text-gray-200 font-normal leading-relaxed max-w-xl">
              {language === "bn"
                ? "আস-সালাম আইডিয়াল মাদরাসা একটি অনন্য দ্বীনি ও আধুনিক শিক্ষাপ্রতিষ্ঠান। আদর্শ মানুষ গড়ার প্রত্যয়ে অভিজ্ঞ উলামা ও মেধাবী শিক্ষকমণ্ডলীর তত্ত্বাবধানে পরিচালিত এক নির্ভরযোগ্য প্রতিষ্ঠান।"
                : language === "ar"
                  ? "مدرسة السلام النموذجية هي مؤسسة رائدة تجمع بين تحفيظ القرآن الكريم والتعليم الأكاديمي الحديث مع بيئة سকনية آمنة بإشراف نخبة من العلماء والأساتذة المتخصصين."
                  : "As-Salam Ideal Madrasah (AIM) is a premier educational institution committed to nurturing moral leadership through balanced Quranic Hifz and modern academic excellence."}
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary button: solid green (#008744) with rounded-md edges */}
              <Link
                href="/admission/form"
                className="inline-flex items-center justify-center bg-[#008744] hover:bg-[#00733a] text-white font-semibold px-6 py-2.5 rounded-md shadow-md transition-colors text-sm sm:text-base cursor-pointer"
              >
                {language === "bn"
                  ? "অনলাইন ভর্তি"
                  : language === "ar"
                    ? "القبول والتسجيل"
                    : "Online Admission"}
              </Link>

              {/* Secondary button: transparent outline/border button with white text */}
              <Link
                href="/results"
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white font-medium border border-white/80 px-6 py-2.5 rounded-md shadow-sm transition-colors text-sm sm:text-base cursor-pointer"
              >
                {language === "bn"
                  ? "ফলাফল দেখুন"
                  : language === "ar"
                    ? "النتائج"
                    : "Results"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
