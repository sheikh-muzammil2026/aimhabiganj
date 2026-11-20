"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users,
  BookOpenCheck,
  MonitorPlay,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const formatLocalizedNumber = (num, language) => {
  const formatted = num
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (language === "bn") {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return formatted.replace(/\d/g, (digit) => bengaliDigits[digit]);
  }

  if (language === "ar") {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return formatted.replace(/\d/g, (digit) => arabicDigits[digit]);
  }

  return formatted;
};

function AnimatedCounter({ targetNumber, suffix = "", language = "bn" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000;
          const steps = 60;
          const stepTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * targetNumber);

            if (currentStep >= steps) {
              setCount(targetNumber);
              clearInterval(timer);
            } else {
              setCount(currentVal);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [targetNumber, hasAnimated]);

  return (
    <span ref={elementRef}>
      {formatLocalizedNumber(count, language)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { language } = useLanguage();

  const content = {
    bn: {
      badge: "গৌরবময় অর্জনের মাইলফলক",
      titlePrefix: "সংখ্যায় আমাদের",
      titleHighlight: "সাফল্য ও অগ্রযাত্রা",
      stats: [
        {
          value: 1200,
          suffix: "+",
          label: "মোট শিক্ষার্থী",
          desc: "হিফজ ও একাডেমিক বিভাগ মিলিয়ে অধ্যয়নরত",
          icon: Users,
        },
        {
          value: 45,
          suffix: "+",
          label: "বিজ্ঞ শিক্ষক ও উলামা",
          desc: "সার্বক্ষণিক মায়া, যত্ন ও তদারকিতে নিয়োজিত",
          icon: BookOpenCheck,
        },
        {
          value: 15,
          suffix: "+",
          label: "স্মার্ট ও ডিজিটাল ক্লাসরুম",
          desc: "আধুনিক মাল্টিমিডিয়া ও প্রযুক্তিসমৃদ্ধ পরিবেশ",
          icon: MonitorPlay,
        },
        {
          value: 100,
          suffix: "%",
          label: "পরীক্ষায় সফলতার হার",
          desc: "বিগত বছরের বোর্ড ও বৃত্তি পরীক্ষার ফলাফল",
          icon: Trophy,
        },
      ],
    },
    en: {
      badge: "Milestones of Excellence",
      titlePrefix: "Our Impact &",
      titleHighlight: "Success in Numbers",
      stats: [
        {
          value: 1200,
          suffix: "+",
          label: "Active Students",
          desc: "Across Hifz, Noorani & Academic wings",
          icon: Users,
        },
        {
          value: 45,
          suffix: "+",
          label: "Ulama & Educators",
          desc: "Dedicated to 24/7 mentorship & care",
          icon: BookOpenCheck,
        },
        {
          value: 15,
          suffix: "+",
          label: "Smart Classrooms",
          desc: "Equipped with multimedia & digital tools",
          icon: MonitorPlay,
        },
        {
          value: 100,
          suffix: "%",
          label: "Exam Success Rate",
          desc: "Consistent excellence in board exams",
          icon: Trophy,
        },
      ],
    },
    ar: {
      badge: "إنجازاتنا المشرقة",
      titlePrefix: "مسيرة النجاح والتميز",
      titleHighlight: "في أرقام",
      stats: [
        {
          value: 1200,
          suffix: "+",
          label: "طالب منتظم",
          desc: "في قسمي تحفيظ القرآن والقسم الأكاديمي",
          icon: Users,
        },
        {
          value: 45,
          suffix: "+",
          label: "عالماًومعلماً متقناً",
          desc: "كرسوا جهودهم للتربية والتعليم",
          icon: BookOpenCheck,
        },
        {
          value: 15,
          suffix: "+",
          label: "فصلاً دراسياً ذكياً",
          desc: "مجهزة بأحدث الوسائل التعليمية",
          icon: MonitorPlay,
        },
        {
          value: 100,
          suffix: "%",
          label: "نسبة النجاح",
          desc: "تفوق مستمر في الاختبارات الرسمية",
          icon: Trophy,
        },
      ],
    },
  };

  const active = content[language] || content.bn;

  return (
    <section className="relative py-20 md:py-24 bg-white text-[#1E293B] overflow-hidden transition-colors duration-300">
      <div className="site-container relative z-10">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#E3F2FD] border border-[#90CAF9] px-4 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
            <span className="text-[#0D47A1] font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0D47A1]">
            {active.titlePrefix}{" "}
            <span className="text-[#2196F3]">
              {active.titleHighlight}
            </span>
          </h2>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#90CAF9]" />
            <div className="h-2 w-2 rotate-45 bg-[#2196F3] shadow-[0_0_8px_rgba(33,150,243,0.5)]" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#90CAF9]" />
          </div>
        </div>

        {/* ৪টি কাউন্টার কার্ড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {active.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl p-[1px] bg-[#90CAF9] hover:bg-[#2196F3] transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg hover:shadow-[#0D47A1]/10"
              >
                <div className="relative h-full bg-[#E3F2FD] p-7 rounded-[11px] text-center flex flex-col items-center justify-between overflow-hidden border border-[#90CAF9]">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2196F3] to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* আইকন মেডেলিয়ন */}
                  <div className="w-14 h-14 rounded-xl bg-[#0D47A1] group-hover:bg-[#2196F3] border border-[#90CAF9]/40 flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* এনিমেটেড সংখ্যা */}
                  <p className="text-4xl sm:text-5xl font-black text-[#0D47A1] tracking-tight mb-2 font-sans drop-shadow-xs">
                    <AnimatedCounter
                      targetNumber={stat.value}
                      suffix={stat.suffix}
                      language={language}
                    />
                  </p>

                  {/* টাইটেল */}
                  <h3 className="text-base sm:text-lg font-black text-[#0D47A1] group-hover:text-[#2196F3] transition-colors mb-1.5">
                    {stat.label}
                  </h3>

                  {/* ছোট ডেসক্রিপশন */}
                  <p className="text-xs text-[#1E293B] leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
