"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturedSections() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  const content = {
    bn: {
      badge: "আমাদের প্রধান কারিকুলাম",
      headingPrefix: "প্রধান শিক্ষাক্রম ও",
      headingHighlight: "বিভাগসমূহ",
      subtitle:
        "কুরআন-সুন্নাহর বিশুদ্ধ ইলম এবং আধুনিক একাডেমিক শিক্ষার সমন্বয়ে আমাদের প্রতিটি বিভাগ সাজানো হয়েছে আন্তর্জাতিক মানদণ্ডে।",
      applyBtn: "ভর্তি আবেদন করুন",
      detailsBtn: "একাডেমিক বিস্তারিত",
      departments: [
        {
          id: "hifz",
          icon: BookOpen,
          watermark: "تحفيظ القرآن",
          tag: "তাহফীযুল কুরআন কারিকুলাম",
          title: "হিফজুল কুরআন বিভাগ",
          sub: "আন্তর্জাতিক মানের তাহফীযুল কুরআন কারিকুলাম",
          highlightPill: "৬ মাসে হিফজ সম্পন্ন করার বিশেষ তত্ত্বাবধান",
          description:
            "অভিজ্ঞ হাফেজ ও ক্বারীগণের নিবিড় তত্ত্বাবধানে আন্তর্জাতিক মানের তাজবীদ, সুমধুর তিলাওয়াত এবং মানসিক চাপমুক্ত পরিবেশে পবিত্র কুরআন হিফজ সম্পন্ন করার অনন্য বিভাগ।",
          points: [
            "নূরানী ও নাজেরা ইবতিদায়ী ভিত্তি গঠন",
            "আন্তর্জাতিক মানের মাখরাজ ও তাজবীদ অনুশীলন",
            "নিয়মিত সবক, সাত-সবক ও হিফজ রিভিশন (দাউর)",
            "সুন্নতি আখলাক, মাসনূন দোয়া ও ইবাদত প্রশিক্ষণ",
            "জাতীয় ও আন্তর্জাতিক প্রতিযোগিতায় অংশগ্রহণ",
            "প্রতিটি শিক্ষার্থীর দৈনিক অগ্রগতি ট্র্যাকিং",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#levels",
        },
        {
          id: "academic",
          icon: GraduationCap,
          watermark: "الأكاديمية",
          tag: "সমন্বিত আধুনিক শিক্ষা",
          title: "একাডেমিক ও জেনারেল বিভাগ",
          sub: "দ্বীনি ও আধুনিক সমন্বিত একাডেমিক শাখা",
          highlightPill: "দ্বীনি শিক্ষার পাশাপাশি জেনারেল শিক্ষায় ১০০% দক্ষতা",
          description:
            "দ্বীনি শিক্ষার পাশাপাশি বাংলা, ইংরেজি, আরবি, গণিত ও বিজ্ঞান বিষয়ে সমান পারদর্শিতা অর্জনের মাধ্যমে শিক্ষার্থীদের যোগ্য আলেম ও আধুনিক পেশাজীবী হিসেবে গড়ে তোলার বিশেষায়িত বিভাগ।",
          points: [
            "প্লে/নূরানী থেকে দাখিল ও দশম শ্রেণী পর্যন্ত পাঠদান",
            "স্মার্ট মাল্টিমিডিয়া ও ডিজিটাল ক্লাসরুম সুবিধা",
            "ইংরেজি, আরবি ও গণিতে বিশেষ কেয়ার ও স্পোকেন ক্লাব",
            "আধুনিক কম্পিউটার ও আইটি প্রশিক্ষণ ল্যাব",
            "সৃজনশীল মেধা বিকাশ, কুইজ ও বক্তৃতা প্রশিক্ষণ",
            "দুর্বল শিক্ষার্থীদের জন্য অতিরিক্ত এক্সট্রা কেয়ার ক্লাস",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#syllabus",
        },
      ],
    },
    en: {
      badge: "Our Core Curriculum",
      headingPrefix: "Signature Academic",
      headingHighlight: "Departments",
      subtitle:
        "Every department at AIM Habiganj is thoughtfully structured to unite authentic Quranic scholarship with contemporary academic excellence.",
      applyBtn: "Apply for Admission",
      detailsBtn: "Explore Curriculum",
      departments: [
        {
          id: "hifz",
          icon: BookOpen,
          watermark: "تحفيظ القرآن",
          tag: "Tahfizul Quran Wing",
          title: "Hifzul Quran Department",
          sub: "International Standard Hifz Curriculum",
          highlightPill: "Specialized Mentorship for 6-Month Hifz Completion",
          description:
            "Guided by master Huffaz and Qaris, our Hifz wing nurtures students to memorize the Holy Quran with flawless Tajweed, melodious recitation, and joyful spiritual focus.",
          points: [
            "Strong Noorani & Nazera foundational prep",
            "International standard Makhraj & Tajweed mastery",
            "Structured Sabaq, Sabqi & Daur revision system",
            "Prophetic character, Masnoon Duas & etiquette",
            "Preparation for national & global competitions",
            "Individualized daily progress tracking for parents",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#levels",
        },
        {
          id: "academic",
          icon: GraduationCap,
          watermark: "الأكاديمية",
          tag: "Integrated Modern Education",
          title: "Academic & General Department",
          sub: "Integrated Islamic & Modern Academic Wing",
          highlightPill: "100% Proficiency in Both Islamic & General Subjects",
          description:
            "Blending comprehensive Islamic studies with rigorous training in English, Arabic, Mathematics, and Science so students excel in board exams and future careers.",
          points: [
            "Structured classes from Play/Noorani up to Grade 10",
            "Interactive Smart Multimedia Classroom environment",
            "Special care in English, Arabic & Mathematics",
            "Modern Computer & Digital Literacy training",
            "Debate, calligraphy & leadership co-curricular clubs",
            "Dedicated remedial & extra-care mentoring sessions",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#syllabus",
        },
      ],
    },
    ar: {
      badge: "مناهجنا الدراسية",
      headingPrefix: "الأقسام التعليمية",
      headingHighlight: "الرئيسية",
      subtitle:
        "صُممت أقسامنا التعليمية وفق أعلى المعايير العالمية للجمع بين إتقان القرآن الكريم والعلوم الشرعية والتفوق في العلوم الحديثة.",
      applyBtn: "طلب القبول الآن",
      detailsBtn: "تفاصيل المنهج",
      departments: [
        {
          id: "hifz",
          icon: BookOpen,
          watermark: "تحفيظ القرآن",
          tag: "قسم تحفيظ القرآن الكريم",
          title: "قسم تحفيظ القرآن الكريم",
          sub: "منهج عالمي متكامل لتحفيظ القرآن الكريم",
          highlightPill: "إشراف خاص لإتمام حفظ القرآن في ٦ أشهر",
          description:
            "تحت إشراف نخبة من الحفاظ والقراء المتقنين، نقدم بيئة إيمانية محفزة لحفظ كتاب الله عز وجل مع إتقان أحكام التجويد وحسن الأداء.",
          points: [
            "تأسيس متقن في القاعدة النورانية والقراءة الصحيحة",
            "تطبيق عملي لأحكام التجويد ومخارج الحروف",
            "نظام دقيق للحفظ الجديد والمراجعة المستمرة",
            "التربية على الآداب النبوية والأذكار اليومية",
            "تأهيل الطلاب للمسابقات القرآنية المحلية والدولية",
            "متابعة يومية دقيقة لمستوى تقدم كل طالب",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#levels",
        },
        {
          id: "academic",
          icon: GraduationCap,
          watermark: "الأكاديمية",
          tag: "التعليم الأكاديمي المتكامل",
          title: "القسم الأكاديمي والعام",
          sub: "منظومة التعليم الإسلامي والأكاديمي الحديث",
          highlightPill: "كفاءة عالية في العلوم الشرعية والأكاديمية معاً",
          description:
            "منهج متكامل يجمع بين العلوم الإسلامية واللغات والرياضيات والعلوم الحديثة، لإعداد جيل متفوق علمياً وأخلاقياً.",
          points: [
            "مراحل دراسية متدرجة من التمهيدي حتى الصف العاشر",
            "فصول دراسية ذكية مجهزة بالوسائط المتعددة",
            "عناية فائقة باللغتين العربية والإنجليزية والرياضيات",
            "تدريب عملي على الحاسب الآلي والتقنيات الحديثة",
            "أنشطة ثقافية ومسابقات لتنمية مهارات الإلقاء والقيادة",
            "حصص تقوية ورعاية خاصة لدعم جميع الطلاب",
          ],
          primaryHref: "/admission/form",
          secondaryHref: "/academics#syllabus",
        },
      ],
    },
  };

  const active = content[language] || content.bn;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-white dark:bg-gradient-to-b dark:from-[#010b07] dark:via-[#031810] dark:to-[#010b07] transition-colors duration-300 overflow-hidden"
    >
      {/* ডার্ক মোড গোল্ডেন ডট প্যাটার্ন ও অ্যাম্বিয়েন্ট লাইট ডেকোরেশন */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.04] transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.9) 1px, transparent 0)`,
          backgroundSize: "34px 34px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-emerald-500/8 dark:bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-amber-500/8 dark:bg-amber-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* সেকশন হেডার */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-950/5 dark:bg-gradient-to-r dark:from-amber-500/15 dark:to-emerald-500/10 border border-emerald-800/15 dark:border-amber-400/35 px-4 py-1.5 rounded-full shadow-xs dark:shadow-[0_0_20px_rgba(245,158,11,0.12)]">
            <Layers className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            <span className="text-emerald-900 dark:text-amber-300 font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {active.headingPrefix}{" "}
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600 dark:from-amber-200 dark:via-amber-400 dark:to-emerald-300 bg-clip-text text-transparent">
              {active.headingHighlight}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/75 leading-relaxed max-w-2xl mx-auto">
            {active.subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-amber-500" />
            <div className="h-2 w-2 rotate-45 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
        </div>

        {/* ২টি রয়েল ডিপার্টমেন্ট শোকেস কার্ড */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {active.departments.map((dept, index) => {
            const IconComponent = dept.icon;
            const isHifz = index === 0;

            return (
              <div
                key={dept.id}
                id={dept.id}
                className={`group relative rounded-[28px] p-[1.5px] transition-all duration-500 hover:-translate-y-2 scroll-mt-28 ${
                  isHifz
                    ? "bg-gradient-to-b from-amber-400/60 via-emerald-500/35 to-amber-500/40 shadow-[0_20px_60px_-15px_rgba(2,32,20,0.18)] hover:shadow-[0_30px_70px_-15px_rgba(2,32,20,0.28)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.12)]"
                    : "bg-gradient-to-b from-emerald-600/45 via-amber-400/35 to-emerald-900/40 dark:from-emerald-400/55 dark:via-amber-400/35 dark:to-emerald-600/40 shadow-[0_20px_60px_-15px_rgba(2,32,20,0.12)] hover:shadow-[0_30px_70px_-15px_rgba(2,32,20,0.22)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.12)]"
                }`}
              >
                <div
                  className={`relative h-full w-full rounded-[26.5px] p-7 sm:p-10 flex flex-col justify-between overflow-hidden ${
                    isHifz
                      ? "bg-gradient-to-br from-[#022014] via-[#042f1e] to-[#01160e] dark:from-[#05291b] dark:via-[#031910] dark:to-[#010a06] text-white dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.2)]"
                      : "bg-gradient-to-br from-white via-[#f9fcfb] to-[#f1f8f5] dark:from-[#042418] dark:via-[#02160f] dark:to-[#010906] text-slate-900 dark:text-white dark:shadow-[inset_0_1px_1px_rgba(52,211,153,0.2)]"
                  }`}
                >
                  {/* টপ গোল্ডেন অ্যাকসেন্ট বার */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-85" />

                  {/* আরবি ক্যালিগ্রাফি ওয়াটারমার্ক */}
                  <div
                    className={`pointer-events-none select-none absolute -right-4 -bottom-6 text-7xl sm:text-8xl font-bold kufi-custom transition-transform duration-700 group-hover:scale-110 ${
                      isHifz
                        ? "text-white/[0.04] dark:text-amber-300/[0.05]"
                        : "text-emerald-950/[0.04] dark:text-emerald-300/[0.05]"
                    }`}
                    dir="rtl"
                    lang="ar"
                  >
                    {dept.watermark}
                  </div>

                  {/* অ্যাম্বিয়েন্ট কর্নার লাইট */}
                  <div
                    className={`pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl transition-opacity duration-500 ${
                      isHifz
                        ? "bg-amber-400/15 dark:bg-amber-400/20"
                        : "bg-emerald-500/10 dark:bg-emerald-400/20"
                    }`}
                  />

                  <div className="relative z-10 space-y-6">
                    {/* কার্ড হেডার: আইকন ও ব্যাজ */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider border ${
                          isHifz
                            ? "bg-amber-400/15 text-amber-300 border-amber-400/35 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                            : "bg-emerald-950/8 dark:bg-amber-400/15 text-emerald-900 dark:text-amber-300 border-emerald-800/20 dark:border-amber-400/35 dark:shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{dept.tag}</span>
                      </span>

                      <div
                        className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                          isHifz
                            ? "bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border border-amber-400/45 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
                            : "bg-gradient-to-br from-[#022014] to-emerald-800 dark:from-emerald-500/20 dark:to-amber-400/20 text-amber-300 ring-1 ring-amber-400/45 shadow-lg dark:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* টাইটেল ও সাব-টাইটেল */}
                    <div>
                      <h3
                        className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          isHifz
                            ? "bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent"
                            : "text-slate-900 dark:bg-gradient-to-r dark:from-white dark:via-amber-50 dark:to-amber-200 dark:bg-clip-text dark:text-transparent"
                        }`}
                      >
                        {dept.title}
                      </h3>
                      <p
                        className={`text-xs font-semibold mt-1 ${
                          isHifz
                            ? "text-amber-300/90"
                            : "text-emerald-700 dark:text-amber-300/90"
                        }`}
                      >
                        {dept.sub}
                      </p>
                    </div>

                    {/* স্পেশাল হাইলাইট ব্যানার */}
                    <div
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-[13px] font-bold ${
                        isHifz
                          ? "bg-white/[0.06] dark:bg-gradient-to-r dark:from-amber-500/15 dark:to-emerald-500/10 border-amber-400/35 text-amber-200"
                          : "bg-emerald-950/[0.04] dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-amber-500/10 border-emerald-800/15 dark:border-amber-400/35 text-emerald-900 dark:text-amber-200"
                      }`}
                    >
                      {isHifz ? (
                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                      )}
                      <span>{dept.highlightPill}</span>
                    </div>

                    {/* বিবরণ */}
                    <p
                      className={`text-sm leading-relaxed ${
                        isHifz
                          ? "text-emerald-100/85"
                          : "text-slate-600 dark:text-emerald-100/85"
                      }`}
                    >
                      {dept.description}
                    </p>

                    {/* ৬টি মূল আকর্ষণের গ্রিড */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {dept.points.map((pt, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-[13px] font-medium transition-all duration-200 ${
                            isHifz
                              ? "bg-white/[0.04] dark:bg-[#062d1e]/55 hover:bg-white/[0.08] dark:hover:bg-[#083a27]/70 border-white/10 dark:border-emerald-500/20 dark:hover:border-amber-400/40 text-slate-100"
                              : "bg-white/80 dark:bg-[#05291b]/55 hover:bg-emerald-50/60 dark:hover:bg-[#073624]/70 border-slate-200/70 dark:border-emerald-500/20 dark:hover:border-amber-400/40 text-slate-700 dark:text-slate-100"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isHifz
                                ? "text-amber-400"
                                : "text-emerald-600 dark:text-amber-400"
                            }`}
                          />
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* নিচের অ্যাকশন বাটনসমূহ */}
                  <div
                    className={`relative z-10 mt-8 pt-6 border-t flex flex-wrap items-center gap-3 ${
                      isHifz
                        ? "border-white/10 dark:border-emerald-800/50"
                        : "border-slate-200/80 dark:border-emerald-800/50"
                    }`}
                  >
                    <Link
                      href={dept.primaryHref}
                      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
                        isHifz
                          ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 shadow-[0_8px_25px_rgba(245,158,11,0.35)]"
                          : "bg-gradient-to-r from-[#022014] via-emerald-900 to-emerald-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 text-white dark:text-slate-950 shadow-md dark:shadow-[0_8px_25px_rgba(245,158,11,0.35)]"
                      }`}
                    >
                      <span>{active.applyBtn}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>

                    <Link
                      href={dept.secondaryHref}
                      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
                        isHifz
                          ? "bg-white/[0.07] hover:bg-white/[0.14] text-white border-white/20 dark:border-amber-400/25 dark:hover:border-amber-400/50"
                          : "bg-slate-100 hover:bg-emerald-50 dark:bg-white/[0.07] dark:hover:bg-white/[0.14] text-slate-800 dark:text-white border-slate-200 dark:border-amber-400/25 dark:hover:border-amber-400/50"
                      }`}
                    >
                      <span>{active.detailsBtn}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
