"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, PhoneCall, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";

export default function HomeCtaBanner() {
  const { language } = useLanguage();

  const content = {
    bn: {
      badge: siteConfig.admissionConfig.badgeText.bn,
      title: "দ্বীনি ও আধুনিক শিক্ষার সমন্বয়ে আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ গড়ুন",
      subtitle: `${siteConfig.name.fullBn}-এ প্লে/নূরানী থেকে হিফজ ও একাডেমিক বিভাগে ভর্তি চলছে। সীমিত আসনে এখনই আবেদন সম্পন্ন করুন।`,
      primaryBtn: "অনলাইন ভর্তি আবেদন",
      secondaryBtn: "যোগাযোগ করুন",
    },
    en: {
      badge: siteConfig.admissionConfig.badgeText.en,
      title: "Shape Your Child's Future with Faith and Modern Academic Excellence",
      subtitle: `Admissions are now open for Noorani, Hifz, and Academic departments at ${siteConfig.name.fullEn}. Secure your seat today.`,
      primaryBtn: "Apply for Admission",
      secondaryBtn: "Contact Us",
    },
    ar: {
      badge: siteConfig.admissionConfig.badgeText.ar,
      title: "اصنع مستقبلاً مشرقاً لطفلك في مهد التعليم الإسلامي والأكاديمي المتميز",
      subtitle: `التسجيل متاح الآن في قسم تحفيظ القرآن الكريم والأقسام الأكاديمية بـ${siteConfig.name.fullAr}. بادر بالتقديم.`,
      primaryBtn: "طلب القبول الإلكتروني",
      secondaryBtn: "تواصل معنا",
    },
  };

  const active = content[language] || content.bn;

  return (
    <section className="section-padding bg-white">
      <div className="site-container">
        <div className="relative rounded-2xl bg-[#0D47A1] text-white p-8 sm:p-12 md:p-16 border border-[#90CAF9]/40 shadow-xl shadow-[#0D47A1]/20 overflow-hidden text-center">
          {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2196F3]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#90CAF9]/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            {/* ব্যাজ */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-[#90CAF9]/40 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#90CAF9]" />
              <span className="text-[#E3F2FD] font-bold text-xs uppercase tracking-wider">
                {active.badge}
              </span>
            </div>

            {/* টাইটেল */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {active.title}
            </h2>

            {/* সাবটাইটেল */}
            <p className="text-sm sm:text-base text-[#E3F2FD]/90 max-w-2xl mx-auto leading-relaxed">
              {active.subtitle}
            </p>

            {/* অ্যাকশন বাটনসমূহ */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={siteConfig.admissionConfig.formRoute || "/admission/form"}
                className="btn-primary text-sm sm:text-base"
              >
                <GraduationCap className="w-5 h-5 text-white" />
                <span>{active.primaryBtn}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-[#90CAF9] bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#90CAF9]" />
                <span>{active.secondaryBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
