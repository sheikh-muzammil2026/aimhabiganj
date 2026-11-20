"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";
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

  // <-- 2. ADDED SLIDER IMAGES & AUTO-PLAY LOGIC HERE
  // Make sure the file extensions (.jpg / .png / .webp) match your /public folder files
  const heroSlides = [
    {
      src: "/assembly1.jpg",
      titleBn: "দৈনিক সমাবেশ ও নৈতিক চর্চা",
      titleAr: "الطابور الصباحي والتربية الأخلاقية",
      titleEn: "Morning Assembly & Moral Tarbiyah",
      subBn: "প্লে থেকে হিফজ ও একাডেমিক শাখা",
      subAr: "من التمهيدي إلى قسم التحفيظ",
      subEn: "Playgroup to Hifz & Academic Wings",
    },
    {
      src: "/nice_campas.jpg",
      titleBn: "সুশৃঙ্খল ক্যাম্পাস পরিবেশ",
      titleAr: "بيئة تعليمية منضبطة وآمنة",
      titleEn: "Disciplined & Safe Campus",
      subBn: "আধুনিক ও দ্বীনি শিক্ষার অপূর্ব সমন্বয়",
      subAr: "توازن بين التعليم الأكاديمي والشرعي",
      subEn: "Harmonious Blend of Deen & Modern Studies",
    },
    {
      src: "/teachers_training.jpg",
      titleBn: "দ্বীনি শিক্ষা ও ন্যাশনাল কারিকুলাম",
      titleAr: "تحفيظ القرآن الكريم والتجويد",
      titleEn: "Hifzul Quran & Tajweed Excellence",
      subBn: "অভিজ্ঞ হাফেজ ও উলামাদের নিবিড় তত্ত্বাবধান",
      subAr: "إشراف مباشر من نخبة الحفاظ والعلماء",
      subEn: "Close Mentorship by Experienced Huffaz",
    },
    {
      src: "/prise.jpg",
      titleBn: "মেধা বিকাশ",
      titleAr: "الأنشطة اللاصفية وتنمية المهارات",
      titleEn: "Co-Curricular & Talent Development",
      subBn: "আদর্শ নেতৃত্ব ও চরিত্র গঠনের অঙ্গীকার",
      subAr: "بناء الشخصية والقيادة الأخلاقية",
      subEn: "Committed to Character & Moral Leadership",
    },
    // Add more images from your /public folder here following the exact same format
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // Changes image every 4 seconds (4000ms)
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlide];

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
      className="relative w-full overflow-hidden -mt-[104px] sm:-mt-[112px] bg-[#E3F2FD] font-bornomala select-none"
    >
      {/* Subtle Background Campus Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/Assembly2.jpg"
          alt="As-Salam Ideal Madrasah Campus"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-10 blur-[1px] scale-105"
        />
        {/* Soft Blue Radial Glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E3F2FD]/90 via-[#E3F2FD]/85 to-[#E3F2FD]" />
        <div
          className={`absolute -top-24 ${isArabic ? "left-1/4" : "right-1/4"
            } w-[520px] h-[520px] rounded-full bg-[#2196F3]/10 blur-[130px] pointer-events-none`}
        />
        <div
          className={`absolute bottom-0 ${isArabic ? "right-0" : "left-0"
            } w-[420px] h-[420px] rounded-full bg-[#90CAF9]/25 blur-[120px] pointer-events-none`}
        />

        {/* Fine Architectural Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(144, 202, 249, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(144, 202, 249, 0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-[820px] site-container pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Editorial Typography & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Status & Slogan Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#90CAF9] shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2196F3] opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2196F3]" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0D47A1] tracking-wide">
                {siteConfig.slogan[language] || siteConfig.slogan.bn}
              </span>
            </div>

            {/* Institutional Headline: Bold #0D47A1 with #2196F3 highlight */}
            <h1 className="heading-primary text-3xl sm:text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.18]">
              {language === "bn" ? (
                <>
                  {siteConfig.name.bn}{" "}
                  <span className="text-[#2196F3]">
                    ({siteConfig.name.short})
                  </span>
                </>
              ) : language === "ar" ? (
                <>
                  {siteConfig.name.ar}{" "}
                  <span className="text-[#2196F3]">
                    ({siteConfig.name.short})
                  </span>
                </>
              ) : (
                <>
                  {siteConfig.name.en}{" "}
                  <span className="text-[#2196F3]">
                    ({siteConfig.name.short})
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Mission Statement: #1E293B for WCAG AAA Accessibility */}
            <p className="text-sm sm:text-base md:text-[17px] text-[#1E293B] leading-relaxed max-w-2xl font-normal">
              {siteConfig.description[language] || siteConfig.description.bn}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
              <Link
                href={siteConfig.admissionConfig.formRoute || "/admission/form"}
                className="btn-primary group text-sm sm:text-base"
              >
                <GraduationCap className="w-5 h-5 text-white" />
                <span>
                  {language === "bn"
                    ? "অনলাইন ভর্তি"
                    : language === "ar"
                      ? "القبول والتسجيل"
                      : "Online Admission"}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-90 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/results"
                className="btn-secondary text-sm sm:text-base"
              >
                <FileCheck2 className="w-5 h-5 text-[#2196F3]" />
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
              className="hidden sm:block absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#0D47A1]/20 via-[#2196F3]/15 to-[#90CAF9]/40 blur-sm"
            />

            {/* Main Framed Photo Card (Auto-Sliding) */}
            <div className="relative rounded-xl overflow-hidden border border-[#90CAF9] bg-white shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                      ? "opacity-100 scale-100 z-0"
                      : "opacity-0 scale-105 pointer-events-none z-0"
                      }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.titleEn}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      priority={index === 0}
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/85 via-transparent to-transparent pointer-events-none" />

                {/* Top Corner Live Admission Pill */}
                <div
                  className={`absolute top-4 ${isArabic ? "left-4" : "right-4"
                    } z-10 px-3 py-1 rounded-full bg-[#2196F3] text-white text-xs font-bold shadow-md border border-white/20`}
                >
                  {siteConfig.admissionConfig.badgeText[language] || siteConfig.admissionConfig.badgeText.bn}
                </div>

                {/* Slide Dots Indicator */}
                <div
                  className={`absolute top-4 ${isArabic ? "right-4" : "left-4"
                    } z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0D47A1]/70 backdrop-blur-xs border border-[#90CAF9]/30`}
                >
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide
                        ? "w-5 bg-[#2196F3]"
                        : "w-1.5 bg-white/60 hover:bg-white"
                        }`}
                    />
                  ))}
                </div>

                {/* Bottom Caption Inside Image */}
                <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-lg bg-[#0D47A1]/95 backdrop-blur-md border border-[#90CAF9]/30 flex items-center justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs text-[#90CAF9] font-bold">
                      {language === "bn"
                        ? activeSlide.titleBn
                        : language === "ar"
                          ? activeSlide.titleAr
                          : activeSlide.titleEn}
                    </p>
                    <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
                      {language === "bn"
                        ? activeSlide.subBn
                        : language === "ar"
                          ? activeSlide.subAr
                          : activeSlide.subEn}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-md bg-[#2196F3] flex items-center justify-center shrink-0 text-white font-bold text-xs border border-white/30 shadow-xs">
                    {siteConfig.name.short}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Notice Ticker aligned to same container width */}
      <div className="site-container pb-4">
        <NavbarTicker />
      </div>
      {/* Bottom Accent Line */}
      <div className="relative z-10 h-1 w-full bg-gradient-to-r from-[#0D47A1] via-[#2196F3] to-[#90CAF9]" />
    </section>
  );
}