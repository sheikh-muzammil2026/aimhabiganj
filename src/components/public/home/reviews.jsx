"use client";

import { Star, Quote, Sparkles, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ReviewsTestimonial() {
  const { language } = useLanguage();

  const content = {
    bn: {
      badge: "অভিভাবক ও উলামায়ে কেরামের অনুভূতি",
      titlePrefix: "অভিভাবক ও সুধীমহলের",
      titleHighlight: "মূল্যবান বাণী",
      subtitle:
        "আমাদের শিক্ষা, আবাসন ও সার্বিক পরিবেশ সম্পর্কে সম্মানিত অভিভাবক ও বিশিষ্ট শিক্ষাবিদদের আন্তরিক মূল্যায়ন।",
      verifiedLabel: "যাচাইকৃত মতামত",
      reviews: [
        {
          name: "মাওলানা মাহমুদুল হাসান",
          role: "বিশিষ্ট আলেম ও শিক্ষাবিদ",
          comment:
            "আস-সালাম আইডিয়াল মাদরাসা (এইম)-এর দ্বীনি ও আধুনিক শিক্ষার সমন্বয়টি সত্যিই অনন্য। বিশেষ করে শিক্ষার্থীদের আখলাক এবং সুন্নতি জিন্দেগি গঠনের প্রতি শিক্ষকদের আন্তরিকতা অত্যন্ত প্রশংসনীয়।",
        },
        {
          name: "প্রকৌশলী আনিসুর রহমান",
          role: "অভিভাবক (একাডেমিক বিভাগ)",
          comment:
            "আমার সন্তান এখানে ৩ বছর ধরে পড়ছে। মাদরাসার স্মার্ট ডিজিটাল ক্লাসরুম এবং চমৎকার হোস্টেল ম্যানেজমেন্টের কারণে আমি সন্তানের পড়াশোনা ও নিরাপত্তা নিয়ে সম্পূর্ণ নিশ্চিন্ত থাকি।",
        },
        {
          name: "ডা. আমিনা বেগম",
          role: "অভিভাবক (হিফজ বিভাগ)",
          comment:
            "হিফজ বিভাগের উস্তাদদের স্নেহপূর্ণ আচরণ ও মানসিক চাপহীন আধুনিক ট্র্যাকিং সিস্টেম আমার সন্তানের হিফজ সম্পন্ন করা সহজ করে দিয়েছে। আল্লাহ তাআলা প্রতিষ্ঠানটিকে কবুল করুন।",
        },
        {
          name: "মুহাম্মদ জাহিদুল ইসলাম",
          role: "ব্যবসায়ী ও অভিভাবক",
          comment:
            "মাদরাসার ভেতর সম্পূর্ণ নিরাপদ ও মোবাইলমুক্ত পরিবেশ এবং শিক্ষকদের নিবিড় তদারকি রয়েছে, যা বর্তমান যুগে সন্তানের ঈমান ও নৈতিকতা সুরক্ষায় ভীষণ প্রয়োজন।",
        },
      ],
    },
    en: {
      badge: "Voices of Trust & Appreciation",
      titlePrefix: "Words from Guardians &",
      titleHighlight: "Esteemed Scholars",
      subtitle:
        "Heartfelt reflections from parents, scholars, and community leaders on our academic standards and spiritual environment.",
      verifiedLabel: "Verified Review",
      reviews: [
        {
          name: "Mawlana Mahmudul Hasan",
          role: "Islamic Scholar & Educator",
          comment:
            "The integration of authentic Islamic scholarship and modern academics at As-Salam Ideal Madrasah (AIM) is exemplary. The faculty’s dedication to building prophetic character is truly inspiring.",
        },
        {
          name: "Engr. Anisur Rahman",
          role: "Parent (Academic Wing)",
          comment:
            "My son has been studying here for three years. Thanks to the smart classrooms and disciplined hostel care, I have complete peace of mind regarding both his education and safety.",
        },
        {
          name: "Dr. Amina Begum",
          role: "Parent (Hifz Department)",
          comment:
            "The compassionate guidance of the Hifz teachers and their stress-free daily tracking method made my child’s Quran memorization journey smooth and joyful. May Allah bless AIM.",
        },
        {
          name: "Muhammad Zahidul Islam",
          role: "Entrepreneur & Guardian",
          comment:
            "A completely distraction-free, morally uplifting campus with 24/7 caring supervision—exactly what every parent seeks to protect their child’s faith and character today.",
        },
      ],
    },
    ar: {
      badge: "شهادات الثقة والتقدير",
      titlePrefix: "كلمات أولياء الأمور",
      titleHighlight: "والعلماء الأجلاء",
      subtitle:
        "انطباعات صادقة من أولياء الأمور والعلماء حول المستوى العلمي والتربوي والبيئة الإيمانية في مدرستنا.",
      verifiedLabel: "تقييم موثوق",
      reviews: [
        {
          name: "الشيخ محمود الحسن",
          role: "عالم وباحث تربوي",
          comment:
            "إن التكامل بين العلوم الشرعية والتعليم الحديث في مدرسة السلام النموذجية (AIM) رائع للغاية، واهتمام المعلمين بغرس الأخلاق النبوية والسلوك الإسلامي يستحق كل تقدير.",
        },
        {
          name: "المهندس أنيس الرحمن",
          role: "ولي أمر طالب (القسم الأكاديمي)",
          comment:
            "يدرس ابني هنا منذ ثلاث سنوات. بفضل الفصول الذكية والإدارة المتميزة للسكن الداخلي، أشعر باطمئنان تام على مستواه الدراسي وأمنه وتربيته.",
        },
        {
          name: "الدكتورة أمينة بيغم",
          role: "ولية أمر (قسم تحفيظ القرآن)",
          comment:
            "المعاملة الأبوية الحانية من معلمي التحفيظ ونظام المتابعة الميسر الخالي من الضغوط سهّل على طفلي إتمام حفظ القرآن الكريم بتفوق وسعادة.",
        },
        {
          name: "محمد زاهد الإسلام",
          role: "رجل أعمال وولي أمر",
          comment:
            "بيئة تربوية آمنة ونقية تماماً مع إشراف مستمر من المعلمين المخلصين، وهو ما نحتاجه بشدة في هذا العصر للحفاظ على إيمان وأخلاق أبنائنا.",
        },
      ],
    },
  };

  const active = content[language] || content.bn;
  const duplicatedReviews = [...active.reviews, ...active.reviews];

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-28 bg-gradient-to-b from-[#f6faf8] via-white to-[#f2f8f5] dark:from-[#010a06] dark:via-[#02150e] dark:to-[#010a06] overflow-hidden transition-colors duration-300"
    >
      {/* ডার্ক মোড গোল্ডেন ডট প্যাটার্ন ও অ্যাম্বিয়েন্ট লাইট গ্লো */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.04] transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.9) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-emerald-500/8 dark:bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-12 right-1/3 w-96 h-96 bg-amber-500/8 dark:bg-amber-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 md:mb-16">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/5 dark:bg-gradient-to-r dark:from-amber-500/15 dark:to-emerald-500/10 border border-emerald-800/15 dark:border-amber-400/35 px-4 py-1.5 rounded-full shadow-xs dark:shadow-[0_0_20px_rgba(245,158,11,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            <span className="text-emerald-900 dark:text-amber-300 font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {active.titlePrefix}{" "}
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600 dark:from-amber-200 dark:via-amber-400 dark:to-emerald-300 bg-clip-text text-transparent">
              {active.titleHighlight}
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
      </div>

      {/* অ্যানিমেশন কন্টেইনার জোন - ইনফিনিট মার্কি */}
      <div className="relative w-full flex overflow-x-hidden pt-2 pb-8 group">
        {/* দুই পাশের সফট ফেইড মাস্ক */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#f6faf8] dark:from-[#010a06] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#f6faf8] dark:from-[#010a06] to-transparent z-20" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-left {
                display: flex;
                gap: 1.75rem;
                animation: marquee 32s linear infinite;
              }
              .group:hover .animate-marquee-left {
                animation-play-state: paused;
              }
            `,
          }}
        />

        <div className="animate-marquee-left flex whitespace-nowrap px-4">
          {duplicatedReviews.map((review, index) => (
            <div
              key={index}
              className="group/card w-[320px] sm:w-[420px] rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-400/45 via-emerald-600/20 to-slate-200 dark:from-amber-400/55 dark:via-emerald-500/25 dark:to-amber-500/30 shadow-[0_15px_40px_-15px_rgba(2,32,20,0.08)] hover:shadow-[0_25px_55px_-12px_rgba(2,32,20,0.16)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.08)] transition-all duration-300 hover:-translate-y-1.5 flex-shrink-0 whitespace-normal"
            >
              <div className="relative h-full bg-white dark:bg-gradient-to-br dark:from-[#041e14] dark:via-[#02130c] dark:to-[#010906] p-7 sm:p-8 rounded-[22.5px] flex flex-col justify-between overflow-hidden dark:shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)]">
                {/* টপ গোল্ডেন অ্যাকসেন্ট লাইন */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

                {/* ব্যাকগ্রাউন্ড উদ্ধৃতি চিহ্ন */}
                <Quote className="pointer-events-none absolute right-6 top-6 w-12 h-12 text-emerald-900/[0.06] dark:text-amber-400/[0.08] rotate-180" />

                <div className="relative z-10">
                  {/* ৫ স্টার রেটিং ও ভেরিফাইড ব্যাজ */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.45)]"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 dark:text-amber-300 bg-emerald-50 dark:bg-amber-400/10 border border-emerald-200/70 dark:border-amber-400/30 px-2.5 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      <span>{active.verifiedLabel}</span>
                    </span>
                  </div>

                  {/* মন্তব্য */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-50/90 leading-relaxed mb-7 font-normal">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* প্রোফাইল প্যানেল */}
                <div className="relative z-10 flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-emerald-800/45">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#022014] via-emerald-900 to-emerald-800 dark:from-[#062d1e] dark:to-[#02120b] text-amber-300 font-extrabold flex items-center justify-center text-sm ring-1 ring-amber-400/45 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover/card:text-emerald-800 dark:group-hover/card:text-amber-200 transition-colors">
                      {review.name}
                    </h4>
                    <p className="text-xs font-medium text-emerald-700 dark:text-amber-300/90 truncate mt-0.5">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
