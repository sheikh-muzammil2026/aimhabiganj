"use client";

import {
  Compass,
  MonitorPlay,
  Languages,
  ShieldCheck,
  GraduationCap,
  Trophy,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyChooseUs() {
  const { language } = useLanguage();

  const content = {
    bn: {
      badge: "আমাদের বিশেষত্ব ও শ্রেষ্ঠত্ব",
      titlePrefix: "কেন আপনার সন্তানের জন্য",
      titleHighlight: "আস-সালাম আইডিয়াল মাদরাসা (এইম)",
      titleSuffix: "নির্বাচন করবেন?",
      subtitle:
        "দ্বীনি ইলম, সুন্নতি আখলাক এবং আধুনিক একাডেমিক শিক্ষার এক অনন্য ও যুগোপযোগী সমন্বয়—যা আপনার সন্তানকে দুনিয়া ও আখিরাতে সফল মানুষ হিসেবে গড়ে তুলবে।",
      features: [
        {
          icon: Compass,
          tag: "আত্মশুদ্ধি ও আমল",
          title: "সহীহ আকিদা ও সুন্নতি জিন্দেগি",
          description:
            "কুরআন ও সুন্নাহর সঠিক নির্দেশনায় শিক্ষার্থীদের আত্মশুদ্ধি, আদব-আখলাক এবং সুন্নতি জিন্দেগি গঠনে সার্বক্ষণিক নিবিড় তদারকি।",
        },
        {
          icon: MonitorPlay,
          tag: "ডিজিটাল শিক্ষা",
          title: "স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়া",
          description:
            "আধুনিক প্রজেক্টর, ইন্টারেক্টিভ ক্লাস, ই-বুক এবং ডিজিটাল প্রযুক্তির মাধ্যমে কঠিন পাঠকে সহজ, আনন্দময় ও আকর্ষণীয় করে উপস্থাপন।",
        },
        {
          icon: Languages,
          tag: "ত্রিভাষিক দক্ষতা",
          title: "আরবি, বাংলা ও ইংরেজি ভাষা শিক্ষা",
          description:
            "দ্বীনি শিক্ষার পাশাপাশি আন্তর্জাতিক ভাষা হিসেবে আরবি ও ইংরেজিতে অনর্গল কথা বলা, শোনা ও লেখার বিশেষ ল্যাঙ্গুয়েজ ক্লাব।",
        },
        {
          icon: ShieldCheck,
          tag: "নিরাপদ ক্যাম্পাস",
          title: "উন্নত আবাসিক ও নিরাপদ পরিবেশ",
          description:
            "২৪ ঘণ্টা সিসিটিভি ক্যামেরায় নিয়ন্ত্রিত ক্যাম্পাস, স্বাস্থ্যসম্মত পুষ্টিকর খাবার এবং অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে মনোরম হোস্টেল ব্যবস্থা।",
        },
        {
          icon: GraduationCap,
          tag: "অভিজ্ঞ শিক্ষকমণ্ডলী",
          title: "দক্ষ ও মায়াবিপন্ন উলামায়ে কেরাম",
          description:
            "দেশ-বিদেশের স্বনামধন্য বিশ্ববিদ্যালয় ও শীর্ষস্থানীয় মাদরাসা থেকে উচ্চশিক্ষাপ্রাপ্ত একঝাঁক আন্তরিক ও মেধাবী শিক্ষক মণ্ডলী।",
        },
        {
          icon: Trophy,
          tag: "সহ-পাঠ্যক্রম",
          title: "ব্যক্তিগত প্রতিভা ও নেতৃত্ব বিকাশ",
          description:
            "বক্তৃতা, কুরআন তিলাওয়াত, ক্যালিগ্রাফি, কুইজ এবং সৃজনশীল সহ-শিক্ষা কার্যক্রমের মাধ্যমে প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা বিকাশ।",
        },
      ],
    },
    en: {
      badge: "Why Choose Us",
      titlePrefix: "Why Select",
      titleHighlight: "As-Salam Ideal Madrasah (AIM)",
      titleSuffix: "for Your Child’s Future?",
      subtitle:
        "A harmonious blend of authentic Islamic scholarship, prophetic character, and modern academic excellence designed to nurture leaders for both worlds.",
      features: [
        {
          icon: Compass,
          tag: "Faith & Character",
          title: "Authentic Aqeedah & Sunnah Lifestyle",
          description:
            "Continuous mentorship to instill pure Islamic beliefs, prophetic manners, and spiritual discipline in every student’s daily life.",
        },
        {
          icon: MonitorPlay,
          tag: "Digital Learning",
          title: "Smart Classrooms & Multimedia",
          description:
            "Interactive multimedia lessons, digital resources, and modern pedagogy that make complex subjects engaging and easy to master.",
        },
        {
          icon: Languages,
          tag: "Trilingual Fluency",
          title: "Arabic, English & Bengali Mastery",
          description:
            "Dedicated language clubs and practical speaking sessions to build confident communication in Arabic, English, and Bengali.",
        },
        {
          icon: ShieldCheck,
          tag: "Safe Campus",
          title: "Premium & Secure Residential Hostel",
          description:
            "24/7 CCTV-monitored campus, hygienic nutritious meals, and a caring home-like environment supervised by resident mentors.",
        },
        {
          icon: GraduationCap,
          tag: "Expert Faculty",
          title: "Compassionate Ulama & Educators",
          description:
            "Taught by accomplished scholars and graduates from renowned universities and premier Islamic institutions.",
        },
        {
          icon: Trophy,
          tag: "Co-Curricular",
          title: "Holistic Talent & Leadership Growth",
          description:
            "Regular debates, Quranic recitation, calligraphy, quizzes, and leadership programs to unlock every child’s unique potential.",
        },
      ],
    },
    ar: {
      badge: "مميزاتنا الفريدة",
      titlePrefix: "لماذا تختار",
      titleHighlight: "مدرسة السلام النموذجية (AIM)",
      titleSuffix: "لمستقبل أبنائك؟",
      subtitle:
        "منظومة تربوية متكاملة تجمع بين أصالة العلوم الشرعية والتربية الإيمانية وبين التفوق الأكاديمي الحديث لبناء جيل رائد ومتميز.",
      features: [
        {
          icon: Compass,
          tag: "العقيدة والأخلاق",
          title: "عقيدة صحيحة ومنهج نبوي",
          description:
            "رعاية مستمرة لغرس العقيدة الإسلامية الصافية والأخلاق النبوية والآداب الإسلامية في نفوس الطلاب عملياً وسلوكياً.",
        },
        {
          icon: MonitorPlay,
          tag: "التعليم الذكي",
          title: "فصول ذكية ووسائط متعددة",
          description:
            "استخدام أحدث الوسائل التعليمية التفاعلية والعروض المرئية لجعل العملية التعليمية ممتعة وميسرة وعالية الكفاءة.",
        },
        {
          icon: Languages,
          tag: "إتقان اللغات",
          title: "إتقان العربية والإنجليزية والبنغالية",
          description:
            "برامج تدريبية خاصة لإتقان المحادثة والكتابة باللغتين العربية والإنجليزية إلى جانب اللغة الأم بطلاقة وثقة.",
        },
        {
          icon: ShieldCheck,
          tag: "بيئة آمنة",
          title: "سكن طلابي راقٍ وآمن",
          description:
            "حرم جامعي مراقب بالكاميرات على مدار الساعة، مع وجبات صحية متوازنة وإشراف تربوي حانٍ يوفر بيئة أسرية مطمئنة.",
        },
        {
          icon: GraduationCap,
          tag: "نخبة المعلمين",
          title: "علماء وأساتذة ذوو خبرة وكفاءة",
          description:
            "نخبة متميزة من العلماء المربين وخريجي الجامعات والمعاهد الإسلامية العريقة يجمعون بين العلم الغزير والرحمة الأبوية.",
        },
        {
          icon: Trophy,
          tag: "تنمية المهارات",
          title: "تنمية المواهب والقيادة الفردية",
          description:
            "أنشطة لا صفية متنوعة تشمل الخطابة، التلاوة، الخط العربي، والمسابقات العلمية لصقل شخصية الطالب ومواهبه.",
        },
      ],
    },
  };

  const active = content[language] || content.bn;
  const indexLabels = ["01", "02", "03", "04", "05", "06"];

  return (
    <section
      id="features"
      className="relative py-20 md:py-28 bg-gradient-to-b from-[#f6faf8] via-white to-[#f2f8f5] dark:from-[#010a06] dark:via-[#02140c] dark:to-[#010a06] transition-colors duration-300 overflow-hidden"
    >
      {/* অ্যানিমেটেড বর্ডার কি-ফ্রেম */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spinBorder {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .custom-border-spin {
              animation: spinBorder 6s linear infinite;
              will-change: transform;
            }
          `,
        }}
      />

      {/* ডার্ক মোড গোল্ডেন ডট প্যাটার্ন ও অ্যাম্বিয়েন্ট লাইট গ্লো */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.045] transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.9) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] bg-emerald-500/8 dark:bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[420px] h-[420px] bg-amber-500/8 dark:bg-amber-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/5 dark:bg-gradient-to-r dark:from-amber-500/15 dark:to-emerald-500/10 border border-emerald-800/15 dark:border-amber-400/35 px-4 py-1.5 rounded-full shadow-xs dark:shadow-[0_0_20px_rgba(245,158,11,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            <span className="text-emerald-900 dark:text-amber-300 font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white leading-[1.22] tracking-tight">
            {active.titlePrefix}{" "}
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600 dark:from-amber-200 dark:via-amber-400 dark:to-emerald-300 bg-clip-text text-transparent">
              {active.titleHighlight}
            </span>{" "}
            {active.titleSuffix}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/75 leading-relaxed max-w-2xl mx-auto">
            {active.subtitle}
          </p>

          {/* অর্নামেন্টাল ডিভাইডার */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-amber-500" />
            <div className="h-2 w-2 rotate-45 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
        </div>

        {/* ৬টি লাক্সারি বৈশিষ্ট্য কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {active.features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="relative p-[1.5px] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-[0_10px_35px_-12px_rgba(2,32,20,0.08)] hover:shadow-[0_25px_55px_-12px_rgba(2,32,20,0.18)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.16)]"
              >
                {/* ১. এনিমেটেড ঘূর্ণায়মান বর্ডার লেয়ার (Conic Gradient) */}
                <div
                  className="absolute inset-[-100%] custom-border-spin opacity-55 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 60%, #10b981 80%, #fbbf24 100%)`,
                  }}
                />

                {/* ২. ভেতরের মূল লাক্সারি কার্ড */}
                <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02120c] dark:to-[#010906] p-7 sm:p-8 rounded-[22.5px] h-full w-full z-10 flex flex-col justify-between overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
                  {/* ডার্ক মোড টপ গোল্ডেন গ্লো লাইন */}
                  <div className="hidden dark:block absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/45 to-transparent" />

                  {/* সূক্ষ্ম কর্নার গ্লো */}
                  <div className="pointer-events-none absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-500/8 to-amber-500/8 dark:from-amber-400/15 dark:to-emerald-500/15 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  <div>
                    {/* কার্ডের টপ বার: আইকন মেডেলিয়ন ও ইনডেক্স নাম্বার */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#022014] via-emerald-900 to-emerald-800 dark:from-[#062d1e] dark:via-[#041f14] dark:to-[#02100a] text-amber-300 flex items-center justify-center ring-1 ring-amber-400/35 dark:ring-amber-400/50 shadow-[0_8px_20px_-4px_rgba(2,32,20,0.35)] dark:shadow-[0_0_25px_rgba(245,158,11,0.22)] group-hover:scale-110 group-hover:ring-amber-400/80 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-amber-300 transition-transform duration-300 group-hover:rotate-6" />
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black font-mono bg-gradient-to-b from-slate-200 to-slate-100 dark:from-amber-400/35 dark:to-emerald-500/10 bg-clip-text text-transparent group-hover:from-amber-400/60 group-hover:to-emerald-400/30 transition-all select-none">
                          {indexLabels[index]}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-amber-300 bg-emerald-50 dark:bg-amber-400/10 border border-emerald-200/60 dark:border-amber-400/30 px-2.5 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* টাইটেল ও ডেসক্রিপশন */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-800 dark:group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* নিচের অর্নামেন্টাল ফুটার লাইন */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-amber-300/90">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>AIM Standard Excellence</span>
                    </span>
                    <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 group-hover:w-14 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
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
