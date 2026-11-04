"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideBadges = {
    bn: [
      "দ্বীনি ও আধুনিক শিক্ষার অনন্য সমন্বয়",
      "নিরাপদ, মনোরম ও সুশৃঙ্খল আবাসিক ক্যাম্পাস",
      "অভিজ্ঞ উলামা ও মেধাবী শিক্ষকমণ্ডলীর তত্ত্বাবধান",
    ],
    en: [
      "Harmony of Islamic & Modern Education",
      "Safe, Serene & Disciplined Residential Campus",
      "Guided by Experienced Ulama & Dedicated Faculty",
    ],
    ar: [
      "تكامل فريد بين التعليم الديني والحديث",
      "حرم جامعي داخلي آمن ومنظم ومتميز",
      "إشراف نخبة من العلماء والأساتذة المتخصصين",
    ],
  };

  const highlightsContent = {
    bn: {
      cardHeader: "কেন এইম হবিগঞ্জ অনন্য?",
      cardSub: "আদর্শ মানুষ গড়ার প্রত্যয়ে আমাদের বিশেষত্ব",
      liveTag: "ভর্তি চলছে",
      liveText: "নতুন শিক্ষাবর্ষে হিফজ ও একাডেমিক বিভাগে সীমিত আসনে ভর্তি চলছে",
      applyNow: "আবেদন করুন",
      resultBtn: "ফলাফল দেখুন",
      items: [
        {
          icon: BookOpen,
          title: "৬ মাসে হিফজুল কুরআন",
          desc: "আন্তর্জাতিক মানের তাজবীদ ও তিলাওয়াতসহ বিশেষ হিফজ কারিকুলাম",
        },
        {
          icon: GraduationCap,
          title: "স্মার্ট একাডেমিক শিক্ষা",
          desc: "দ্বীনি শিক্ষার পাশাপাশি আরবি, বাংলা ও ইংরেজিতে সমান দক্ষতা",
        },
        {
          icon: ShieldCheck,
          title: "আধুনিক ও নিরাপদ আবাসন",
          desc: "সিসিটিভি নিয়ন্ত্রিত ক্যাম্পাস, পুষ্টিকর খাবার ও সার্বক্ষণিক তদারকি",
        },
        {
          icon: Award,
          title: "১০০% সাফল্যের ঐতিহ্য",
          desc: "বোর্ড ও বৃত্তি পরীক্ষায় ধারাবাহিক ঈর্ষণীয় ফলাফল অর্জন",
        },
      ],
    },
    en: {
      cardHeader: "Why Choose AIM Habiganj?",
      cardSub: "Excellence in nurturing moral & academic leaders",
      liveTag: "Admissions Open",
      liveText: "Limited seats available for Hifz & Academic sections",
      applyNow: "Apply Online",
      resultBtn: "Exam Results",
      items: [
        {
          icon: BookOpen,
          title: "Hifzul Quran in 6 Months",
          desc: "Specialized Hifz curriculum with international standard Tajweed",
        },
        {
          icon: GraduationCap,
          title: "Smart Academic System",
          desc: "Fluency in Arabic, English & Bengali alongside Islamic studies",
        },
        {
          icon: ShieldCheck,
          title: "Safe Residential Hostel",
          desc: "24/7 CCTV monitored campus, nutritious meals & caring mentors",
        },
        {
          icon: Award,
          title: "100% Success Track",
          desc: "Outstanding achievements in board & scholarship examinations",
        },
      ],
    },
    ar: {
      cardHeader: "لماذا مدرسة السلام النموذجية؟",
      cardSub: "التميز في بناء الجيل القرآني والأكاديمي",
      liveTag: "التسجيل مفتوح",
      liveText: "المقاعد محدودة لقسمي تحفيظ القرآن والقسم الأكاديمي",
      applyNow: "سجل الآن",
      resultBtn: "النتائج",
      items: [
        {
          icon: BookOpen,
          title: "ختم القرآن في ٦ أشهر",
          desc: "منهج متميز لتحفيظ القرآن الكريم مع التجويد المتقن",
        },
        {
          icon: GraduationCap,
          title: "تعليم أكاديمي ذكي",
          desc: "إتقان اللغات العربية والإنجليزية والبنغالية مع العلوم الشرعية",
        },
        {
          icon: ShieldCheck,
          title: "سكن طلابي آمن وحديث",
          desc: "رعاية متكاملة على مدار الساعة وبيئة تربوية راقية",
        },
        {
          icon: Award,
          title: "نسبة نجاح ١٠٠٪",
          desc: "تفوق مستمر في الاختبارات الرسمية والمسابقات العلمية",
        },
      ],
    },
  };

  const activeLocale = highlightsContent[language] || highlightsContent.bn;
  const activeBadges = slideBadges[language] || slideBadges.bn;

  const carouselImages = [
    {
      url: "/deenishikka.png",
      title: t("hero.slides.0.title"),
      subtitle: t("hero.slides.0.subtitle"),
      badge: activeBadges[0],
    },
    {
      url: "/hero2.png",
      title: t("hero.slides.1.title"),
      subtitle: t("hero.slides.1.subtitle"),
      badge: activeBadges[1],
    },
    {
      url: "/hero3.png",
      title: t("hero.slides.2.title"),
      subtitle: t("hero.slides.2.subtitle"),
      badge: activeBadges[2],
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  }, [carouselImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  }, [carouselImages.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full select-none overflow-hidden bg-[#01140d]">
      {/* মেইন হিরো কন্টেইনার */}
      <div className="relative min-h-[560px] md:min-h-[680px] lg:min-h-[720px] w-full flex items-center py-12 md:py-16 lg:py-20">
        {/* ১. ব্যাকগ্রাউন্ড স্লাইড ইমেজ ও সিনেম্যাটিক ওভারলে */}
        {carouselImages.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isCurrent ? "opacity-100 z-0" : "opacity-0 invisible -z-10"
              }`}
            >
              <Image
                src={slide.url}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isCurrent ? "scale-110" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* ২. মাল্টি-লেয়ারড রয়েল এমেরাল্ড, অবসিডিয়ান ও গোল্ডেন অ্যাটমস্ফিয়ারিক ওভারলে */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#01140d]/95 via-[#022015]/85 to-[#01140d]/70 dark:from-[#010906]/95 dark:via-[#021910]/85 dark:to-[#010906]/75 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#01140d] via-transparent to-[#01140d]/60 dark:from-[#010a06] dark:to-[#010a06]/65 z-10" />

        {/* সূক্ষ্ম ইসলামিক জিওমেট্রিক প্যাটার্ন ও অ্যাম্বিয়েন্ট লাইট গ্লো */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.8) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] z-10" />
        <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[130px] z-10" />

        {/* ৩. মূল কন্টেন্ট গ্রিড */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* বাম কলাম: হিরো টাইপোগ্রাফি ও অ্যাকশন বাটন (৭ কলাম) */}
            <div className="lg:col-span-7 space-y-6 text-start">
              {/* বিসমিল্লাহ ও স্লাইড ব্যাজ পিল */}
              <div className="inline-flex flex-wrap items-center gap-2.5 bg-white/[0.06] backdrop-blur-xl border border-amber-400/30 rounded-full px-4 py-1.5 shadow-[0_0_25px_rgba(245,158,11,0.12)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                </span>
                <span
                  className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide"
                  dir="rtl"
                  lang="ar"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <span className="text-white/25">•</span>
                <span className="text-xs sm:text-[13px] font-semibold text-emerald-100 tracking-wide">
                  {carouselImages[currentSlide]?.badge}
                </span>
              </div>

              {/* মেইন হেডলাইন (স্লাইড অনুযায়ী পরিবর্তনশীল) */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[54px] font-extrabold leading-[1.18] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                  <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
                    {carouselImages[currentSlide]?.title}
                  </span>
                </h1>

                {/* গোল্ডেন অর্নামেন্টাল ডিভাইডার */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                  <div className="h-1.5 w-1.5 rotate-45 bg-amber-300" />
                  <div className="h-[1px] w-24 bg-gradient-to-r from-amber-400/50 to-transparent" />
                </div>
              </div>

              {/* সাবটাইটেল */}
              <p className="text-base sm:text-lg md:text-xl text-slate-200/95 font-normal leading-relaxed max-w-2xl border-s-2 border-amber-400/70 ps-4 py-0.5 bg-gradient-to-r from-white/[0.03] to-transparent rounded-e-xl">
                {carouselImages[currentSlide]?.subtitle}
              </p>

              {/* অ্যাকশন বাটনসমূহ (CTA Buttons) */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
                <Link
                  href="/admission/form"
                  className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:via-amber-400 hover:to-amber-300 text-slate-950 font-extrabold px-6 sm:px-7 py-3.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(245,158,11,0.45)] hover:shadow-[0_15px_35px_-5px_rgba(245,158,11,0.65)] transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 transition-transform duration-300 group-hover:rotate-12" />
                  <span>{t("hero.btn_form")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl text-white border border-white/20 hover:border-amber-300/50 font-semibold px-6 py-3.5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>{t("hero.btn_about")}</span>
                </Link>

                <Link
                  href="/results"
                  className="inline-flex items-center gap-2 bg-emerald-950/60 hover:bg-emerald-900/70 backdrop-blur-xl text-emerald-100 hover:text-amber-200 border border-emerald-500/30 hover:border-amber-400/40 font-semibold px-5 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-300" />
                  <span>{activeLocale.resultBtn}</span>
                </Link>
              </div>
            </div>

            {/* ডান কলাম: লাক্সারি গ্লাসমরফিক বেন্টো শোকেস কার্ড (৫ কলাম) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/50 via-white/15 to-emerald-500/35 dark:from-amber-400/65 dark:via-emerald-500/25 dark:to-amber-500/40 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75)] dark:shadow-[0_25px_80px_-10px_rgba(0,0,0,0.9),0_0_45px_rgba(16,185,129,0.12)]">
                <div className="bg-[#021d12]/75 dark:bg-[#02120b]/85 backdrop-blur-2xl rounded-[22.5px] p-5 sm:p-6 space-y-5">
                  {/* কার্ড হেডার */}
                  <div className="flex items-center justify-between border-b border-white/10 dark:border-amber-400/15 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                        {activeLocale.cardHeader}
                      </h2>
                      <p className="text-xs text-emerald-200/80 dark:text-emerald-200/85 mt-0.5">
                        {activeLocale.cardSub}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border border-amber-400/35 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  {/* ৪টি মূল বৈশিষ্ট্য গ্রিড */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLocale.items.map((feature, idx) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={idx}
                          className="group/card p-3.5 rounded-2xl bg-white/[0.04] dark:bg-gradient-to-br dark:from-[#06291b]/70 dark:to-[#02130c]/85 hover:bg-white/[0.08] dark:hover:from-[#083523]/80 dark:hover:to-[#031910]/90 border border-white/10 dark:border-emerald-500/20 hover:border-amber-400/40 dark:hover:border-amber-400/50 transition-all duration-300 shadow-inner"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-500/15 border border-amber-400/35 flex items-center justify-center text-amber-300 mb-2.5 group-hover/card:scale-110 transition-transform duration-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover/card:text-amber-200 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-[11px] text-slate-300/80 dark:text-emerald-100/75 leading-relaxed mt-1">
                            {feature.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* নিচের লাইভ ভর্তি স্ট্যাটাস বার */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/60 via-emerald-950/80 to-amber-950/40 border border-amber-400/25">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>{activeLocale.liveTag}</span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-snug">
                        {activeLocale.liveText}
                      </p>
                    </div>
                    <Link
                      href="/admission"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-slate-950 border border-amber-400/40 font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-300 whitespace-nowrap"
                    >
                      <span>{activeLocale.applyNow}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ৪. নিচের ইন্টারেক্টিভ স্লাইডার কন্ট্রোল ও প্রগ্রেস বার */}
          <div className="mt-10 lg:mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* স্লাইড নাম্বার ও প্রগ্রেস ইন্ডিকেটর */}
            <div className="flex items-center gap-3">
              {carouselImages.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                    className={`group flex items-center gap-2 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "text-amber-300 font-bold"
                        : "text-white/50 hover:text-white/80 font-medium"
                    }`}
                  >
                    <span className="text-xs font-mono">0{index + 1}</span>
                    <span
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? "w-10 sm:w-14 bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          : "w-3 bg-white/25 group-hover:bg-white/45"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* নেক্সট / প্রিভিয়াস অ্যারো বাটন */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-amber-400/20 text-white hover:text-amber-300 border border-white/15 hover:border-amber-400/40 backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-amber-400/20 text-white hover:text-amber-300 border border-white/15 hover:border-amber-400/40 backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
