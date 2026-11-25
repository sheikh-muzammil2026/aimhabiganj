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
import siteConfig from "@/config/siteConfig";

export default function WhyChooseUs() {
  const { language } = useLanguage();

  const content = {
    bn: {
      badge: "আমাদের বিশেষত্ব ও শ্রেষ্ঠত্ব",
      titlePrefix: "কেন আপনার সন্তানের জন্য",
      titleHighlight: siteConfig.name.fullBn,
      titleSuffix: "নির্বাচন করবেন?",
      subtitle:
        "দ্বীনি ইলম, সুন্নতি আখলাক এবং আধুনিক একাডেমিক শিক্ষার এক অনন্য ও যুগোপযোগী সমন্বয়—যা আপনার সন্তানকে দুনিয়া ও আখিরাতে সফল মানুষ হিসেবে গড়ে তুলবে।",
      cardFooterLabel: `${siteConfig.name.short} মানদণ্ডের শ্রেষ্ঠত্ব`,
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
      cardFooterLabel: "AIM Standard Excellence",
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
      cardFooterLabel: "معايير التميز في السلام",
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
      className="relative py-20 md:py-28 bg-white transition-colors duration-300 overflow-hidden font-bornomala"
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] bg-[#2196F3]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[420px] h-[420px] bg-[#90CAF9]/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 site-container">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#E3F2FD] border border-[#90CAF9] px-4 py-1.5 rounded-full shadow-xs">

            <span className="text-[#0D47A1] font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#0D47A1] leading-[1.22] tracking-tight">
            {active.titlePrefix}{" "}
            <span className="text-[#2196F3]">
              {active.titleHighlight}
            </span>{" "}
            {active.titleSuffix}
          </h2>

          <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed max-w-2xl mx-auto font-normal">
            {active.subtitle}
          </p>

          {/* অর্নামেন্টাল ডিভাইডার */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#90CAF9]" />
            <div className="h-2 w-2 rotate-45 bg-[#2196F3] shadow-xs" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#90CAF9]" />
          </div>
        </div>

        {/* Features / Services Grid: Clean white #FFFFFF section background housing cards styled with #E3F2FD fill, 1px solid #90CAF9 borders, #2196F3 icons, and #0D47A1 card titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {active.features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group relative p-7 sm:p-8 rounded-xl bg-[#E3F2FD] border border-[#90CAF9] shadow-xs hover:shadow-xl hover:border-[#2196F3] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* সূক্ষ্ম কর্নার গ্লো */}
                <div className="pointer-events-none absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#90CAF9]/20 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <div>
                  {/* কার্ডের টপ বার: আইকন মেডেলিয়ন ও ইনডেক্স নাম্বার */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative w-14 h-14 rounded-xl bg-white border border-[#90CAF9] text-[#2196F3] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-[#2196F3] transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-[#2196F3] transition-transform duration-300 group-hover:rotate-6" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black font-mono text-[#90CAF9] group-hover:text-[#2196F3] transition-colors select-none">
                        {indexLabels[index]}
                      </span>
                      <span className="text-[11px] font-bold text-[#0D47A1] bg-white border border-[#90CAF9] px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* টাইটেল ও ডেসক্রিপশন */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0D47A1] mb-3 group-hover:text-[#2196F3] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#1E293B] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* নিচের অর্নামেন্টাল ফুটার লাইন */}
                <div className="mt-6 pt-4 border-t border-[#90CAF9]/60 flex items-center justify-between text-xs font-semibold text-[#0D47A1]">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3]" />
                    <span>{active.cardFooterLabel}</span>
                  </span>
                  <span className="h-1 w-8 rounded-full bg-[#2196F3] group-hover:w-14 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
