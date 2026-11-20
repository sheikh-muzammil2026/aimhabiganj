"use client";

import Link from "next/link";
import { Star, Quote, Sparkles, BadgeCheck, MessageSquarePlus } from "lucide-react";
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
      feedbackBtnText: "মতামত দিন / Give Feedback",
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
      feedbackBtnText: "মতামত দিন",
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
      feedbackBtnText: "شارك برأيك",
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
      className="relative py-20 md:py-28 bg-[#E3F2FD] overflow-hidden transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-1/3 w-96 h-96 bg-[#90CAF9]/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-12 right-1/3 w-96 h-96 bg-[#2196F3]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 site-container mb-14 md:mb-16">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-[#90CAF9] px-4 py-1.5 rounded-full shadow-xs">
            <span className="text-[#0D47A1] font-bold text-xs uppercase tracking-widest">
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#0D47A1] leading-tight tracking-tight">
            {active.titlePrefix}{" "}
            <span className="text-[#2196F3]">
              {active.titleHighlight}
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
      </div>

      {/* অ্যানিমেশন কন্টেইনার জোন - ইনফিনিট মার্কি */}
      <div className="relative w-full flex overflow-x-hidden pt-2 pb-8 group">
        {/* দুই পাশের সফট ফেইড মাস্ক */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#E3F2FD] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#E3F2FD] to-transparent z-20" />

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
              className="group/card w-[320px] sm:w-[420px] rounded-xl p-[1px] bg-[#90CAF9] hover:bg-[#2196F3] shadow-sm hover:shadow-lg hover:shadow-[#0D47A1]/10 transition-all duration-300 hover:-translate-y-1.5 flex-shrink-0 whitespace-normal"
            >
              <div className="relative h-full bg-white p-7 sm:p-8 rounded-[11px] flex flex-col justify-between overflow-hidden border border-[#90CAF9]">
                {/* টপ অ্যাকসেন্ট লাইন */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2196F3] to-transparent opacity-80" />

                {/* ব্যাকগ্রাউন্ড উদ্ধৃতি চিহ্ন */}
                <Quote className="pointer-events-none absolute right-6 top-6 w-12 h-12 text-[#0D47A1]/[0.05] rotate-180" />

                <div className="relative z-10">
                  {/* ৫ স্টার রেটিং ও ভেরিফাইড ব্যাজ */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#2196F3] text-[#2196F3]"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#0D47A1] bg-[#E3F2FD] border border-[#90CAF9] px-2.5 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3 text-[#2196F3]" />
                      <span>{active.verifiedLabel}</span>
                    </span>
                  </div>

                  {/* মন্তব্য */}
                  <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed mb-7 font-normal">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* প্রোফাইল প্যানেল */}
                <div className="relative z-10 flex items-center gap-3.5 pt-4 border-t border-[#90CAF9]/40">
                  <div className="w-11 h-11 rounded-xl bg-[#0D47A1] text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-[#0D47A1] truncate group-hover/card:text-[#2196F3] transition-colors">
                      {review.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#2196F3] truncate mt-0.5">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* অভিভাবক মতামত বাটন */}
      <div className="relative z-10 site-container pt-6 text-center">
        <Link
          href="/parent-feedback"
          className="btn-primary"
        >
          <MessageSquarePlus className="w-4 h-4 text-white" />
          <span>{active.feedbackBtnText}</span>
        </Link>
      </div>
    </section>
  );
}
