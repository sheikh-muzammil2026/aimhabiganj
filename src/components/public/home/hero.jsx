"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  GraduationCap,
  FileCheck2,
  BookOpenCheck,
  ShieldCheck,
  Users,
  Award,
  ArrowUpRight,
} from "lucide-react";
import NavbarTicker from "@/components/shared/NavbarTicker";

export default function HeroSection() {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";

  const stats = [
    {
      icon: BookOpenCheck,
      value: language === "bn" ? "হিফজ ও জেনারেল" : language === "ar" ? "تحفيظ وأكاديمي" : "Hifz & General",
      label: language === "bn" ? "সমন্বিত কারিকুলাম" : language === "ar" ? "منهج متكامل" : "Integrated Curriculum",
    },
    {
      icon: Users,
      value: language === "bn" ? "অভিজ্ঞ উলামা" : language === "ar" ? "نخبة العلماء" : "Expert Scholars",
      label: language === "bn" ? "যোগ্য শিক্ষকমণ্ডলী" : language === "ar" ? "هيئة تدريس متميزة" : "Dedicated Faculty",
    },
    {
      icon: ShieldCheck,
      value: language === "bn" ? "নিরাপদ ক্যাম্পাস" : language === "ar" ? "بيئة آمنة" : "Safe Campus",
      label: language === "bn" ? "সুশৃঙ্খল পরিবেশ" : language === "ar" ? "انضباط ورعاية" : "Disciplined Environment",
    },
    {
      icon: Award,
      value: language === "bn" ? "১০০% ডিজিটাল" : language === "ar" ? "نظام رقمي" : "Smart ERP",
      label: language === "bn" ? "আধুনিক ব্যবস্থাপনা" : language === "ar" ? "إدارة حديثة" : "Modern Management",
    },
  ];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative w-full overflow-hidden -mt-[104px] sm:-mt-[112px] bg-[#04150d] font-bornomala select-none"
    >
      {/* Subtle Background Campus Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Assembly2.jpg"
          alt="As-Salam Ideal Madrasah Campus"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-20 blur-[2px] scale-105"
        />
        {/* Deep Emerald & Slate Radial Glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04150d]/95 via-[#061f14]/92 to-[#04150d]" />
        <div
          className={`absolute -top-24 ${isArabic ? "left-1/4" : "right-1/4"
            } w-[520px] h-[520px] rounded-full bg-[#00733a]/25 blur-[130px] pointer-events-none`}
        />
        <div
          className={`absolute bottom-0 ${isArabic ? "right-0" : "left-0"
            } w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none`}
        />

        {/* Fine Architectural Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-[900px] max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-10 pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Editorial Typography & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Status & Slogan Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-emerald-400/25 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">
                {t("header.slogan")}
              </span>
            </div>

            {/* Institutional Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.18]">
              {language === "bn" ? (
                <>
                  আস-সালাম আইডিয়াল{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">
                    মাদরাসা
                  </span>
                </>
              ) : language === "ar" ? (
                <>
                  مدرسة السلام{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-emerald-200 to-amber-300">
                    النموذجية
                  </span>
                </>
              ) : (
                <>
                  As-Salam Ideal{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">
                    Madrasah (AIM)
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Mission Statement */}
            <p className="text-sm sm:text-base md:text-[17px] text-slate-300 leading-relaxed max-w-2xl font-normal">
              {language === "bn"
                ? "আস-সালাম আইডিয়াল মাদরাসা একটি অনন্য দ্বীনি ও আধুনিক শিক্ষাপ্রতিষ্ঠান। আদর্শ মানুষ গড়ার প্রত্যয়ে অভিজ্ঞ উলামা ও মেধাবী শিক্ষকমণ্ডলীর তত্ত্বাবধানে পরিচালিত এক নির্ভরযোগ্য প্রতিষ্ঠান।"
                : language === "ar"
                  ? "مدرسة السلام النموذجية هي مؤسسة رائدة تجمع بين تحفيظ القرآن الكريم والتعليم الأكاديمي الحديث مع بيئة سكنية آمنة بإشراف نخبة من العلماء والأساتذة المتخصصين."
                  : "As-Salam Ideal Madrasah (AIM) is a premier educational institution committed to nurturing moral leadership through balanced Quranic Hifz and modern academic excellence."}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
              <Link
                href="/admission/form"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#00733a] hover:bg-[#008c47] text-white font-semibold px-7 py-3.5 rounded-xl shadow-xl shadow-[#00733a]/35 border border-emerald-400/35 transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span>
                  {language === "bn"
                    ? "অনলাইন ভর্তি"
                    : language === "ar"
                      ? "القبول والتسجيل"
                      : "Online Admission"}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.14] backdrop-blur-md text-white font-semibold border border-white/20 hover:border-amber-400/50 px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <span>
                  {language === "bn"
                    ? "ফলাফল দেখুন"
                    : language === "ar"
                      ? "النتائج"
                      : "Results"}
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Framed Campus Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Decorative Back Accent Frame */}
            <div
              className={`hidden sm:block absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#00733a]/40 via-emerald-500/15 to-amber-400/30 blur-sm`}
            />

            {/* Main Framed Photo Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900/80 shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/Assembly2.jpg"
                  alt="AIM Campus Assembly"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04150d]/90 via-transparent to-transparent" />

                {/* Top Corner Live Admission Pill */}
                <div
                  className={`absolute top-4 ${isArabic ? "left-4" : "right-4"
                    } px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md`}
                >
                  {language === "bn"
                    ? "ভর্তি চলছে ২০২৬"
                    : language === "ar"
                      ? "التسجيل مفتوح ٢٠٢٦"
                      : "Admissions 2026"}
                </div>

                {/* Bottom Glass Caption Inside Image */}
                <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-emerald-300 font-semibold">
                      {language === "bn"
                        ? "দৈনিক সমাবেশ ও নৈতিক চর্চা"
                        : language === "ar"
                          ? "الطابور الصباحي والتربية الأخلاقية"
                          : "Morning Assembly & Moral Tarbiyah"}
                    </p>
                    <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
                      {language === "bn"
                        ? "প্লে থেকে হিফজ ও একাডেমিক শাখা"
                        : language === "ar"
                          ? "من التمهيدي إلى قسم التحفيظ"
                          : "Playgroup to Hifz & Academic Wings"}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#00733a] flex items-center justify-center shrink-0 text-amber-300 font-bold text-xs border border-emerald-400/30">
                    AIM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Notice Ticker aligned to same container width */}
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-10">
        <NavbarTicker />
      </div>
      {/* Bottom Accent Line */}
      <div className="relative z-10 h-1 w-full bg-gradient-to-r from-[#00733a] via-emerald-400 to-amber-400" />
    </section>
  );
}