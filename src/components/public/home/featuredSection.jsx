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
      className="relative py-20 md:py-28 bg-[#E3F2FD] transition-colors duration-300 overflow-hidden"
    >
      {/* সূক্ষ্ম অ্যাম্বিয়েন্ট লাইট ডেকোরেশন */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#90CAF9]/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#2196F3]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 site-container">
        {/* সেকশন হেডার */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-[#90CAF9] px-4 py-1.5 rounded-full shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#2196F3]" />
            <span className="text-[#0D47A1] font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#0D47A1] leading-tight tracking-tight">
            {active.headingPrefix}{" "}
            <span className="text-[#2196F3]">
              {active.headingHighlight}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed max-w-2xl mx-auto">
            {active.subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#90CAF9]" />
            <div className="h-2 w-2 rotate-45 bg-[#2196F3] shadow-[0_0_8px_rgba(33,150,243,0.5)]" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#90CAF9]" />
          </div>
        </div>

        {/* ২টি ডিপার্টমেন্ট শোকেস কার্ড */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {active.departments.map((dept) => {
            const IconComponent = dept.icon;

            return (
              <div
                key={dept.id}
                id={dept.id}
                className="group relative rounded-2xl p-[1px] bg-[#90CAF9] hover:bg-[#2196F3] transition-all duration-300 hover:-translate-y-1.5 shadow-md shadow-[#0D47A1]/5 hover:shadow-xl hover:shadow-[#0D47A1]/10 scroll-mt-28"
              >
                <div
                  className="relative h-full w-full rounded-[15px] p-7 sm:p-9 flex flex-col justify-between overflow-hidden bg-white text-[#1E293B]"
                >
                  {/* টপ ব্লু অ্যাকসেন্ট বার */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2196F3] via-[#90CAF9] to-[#2196F3]" />

                  {/* আরবি ক্যালিগ্রাফি ওয়াটারমার্ক */}
                  <div
                    className="pointer-events-none select-none absolute -right-4 -bottom-6 text-7xl sm:text-8xl font-bold kufi-custom transition-transform duration-700 group-hover:scale-110 text-[#0D47A1]/[0.04]"
                    dir="rtl"
                    lang="ar"
                  >
                    {dept.watermark}
                  </div>

                  <div className="relative z-10 space-y-6">
                    {/* কার্ড হেডার: আইকন ও ব্যাজ */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
                        <span>{dept.tag}</span>
                      </span>

                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0D47A1] text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#2196F3]"
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* টাইটেল ও সাব-টাইটেল */}
                    <div>
                      <h3
                        className="text-2xl sm:text-3xl font-black text-[#0D47A1] tracking-tight"
                      >
                        {dept.title}
                      </h3>
                      <p
                        className="text-xs font-semibold text-[#2196F3] mt-1"
                      >
                        {dept.sub}
                      </p>
                    </div>

                    {/* স্পেশাল হাইলাইট ব্যানার */}
                    <div
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#90CAF9] bg-[#E3F2FD] text-xs sm:text-[13px] font-bold text-[#0D47A1]"
                    >
                      <Clock className="w-4 h-4 text-[#2196F3] flex-shrink-0" />
                      <span>{dept.highlightPill}</span>
                    </div>

                    {/* বিবরণ */}
                    <p
                      className="text-sm leading-relaxed text-[#1E293B]"
                    >
                      {dept.description}
                    </p>

                    {/* ৬টি মূল আকর্ষণের গ্রিড */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {dept.points.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#90CAF9]/60 bg-[#E3F2FD]/50 hover:bg-[#E3F2FD] text-xs sm:text-[13px] font-medium text-[#1E293B] transition-all duration-200"
                        >
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2196F3]"
                          />
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* নিচের অ্যাকশন বাটনসমূহ */}
                  <div
                    className="relative z-10 mt-8 pt-6 border-t border-[#90CAF9]/40 flex flex-wrap items-center gap-3"
                  >
                    <Link
                      href={dept.primaryHref}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-md bg-[#2196F3] hover:bg-[#1976D2] text-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{active.applyBtn}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>

                    <Link
                      href={dept.secondaryHref}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-3 rounded-md border-2 border-[#90CAF9] bg-white hover:bg-[#E3F2FD] text-[#0D47A1] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
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
