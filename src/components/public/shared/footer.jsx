"use client";

import Image from "next/image";
import Link from "next/link";
import { BsYoutube } from "react-icons/bs";
import { RiFacebookCircleFill, RiGlobalFill } from "react-icons/ri";
import { MapPin, Phone, Mail, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    bn: {
      desc: "দ্বীনি ও আধুনিক শিক্ষার এক অপূর্ব সমন্বয়। অভিজ্ঞ উলামায়ে কেরাম ও দক্ষ শিক্ষকমণ্ডলী দ্বারা পরিচালিত হবিগঞ্জের একটি নির্ভরযোগ্য ও যুগোপযোগী দ্বীনি শিক্ষা প্রতিষ্ঠান।",
      colLinks: "গুরুত্বপূর্ণ লিংক",
      links: [
        { name: "আমাদের সম্পর্কে", href: "/about" },
        { name: "নোটিশ বোর্ড", href: "/notices" },
        { name: "মিডিয়া গ্যালারি", href: "/gallery" },
        { name: "পরীক্ষার ফলাফল", href: "/results" },
        { name: "অভিযোগ ও পরামর্শ", href: "/contact#feedback" },
      ],
      colAcademic: "শিক্ষা ও ভর্তি",
      academics: [
        { name: "ভর্তি প্রক্রিয়া", href: "/admission#process" },
        { name: "ভর্তি ও মাসিক ফি", href: "/admission#fees" },
        { name: "অনলাইন ভর্তি ফরম", href: "/admission/form", highlight: true },
        { name: "একাডেমিক কারিকুলাম", href: "/academics" },
        { name: "আবাসিক কার্যসূচি", href: "/hostel#routine" },
      ],
      colContact: "যোগাযোগ করুন",
      address: "দক্ষিণ শ্যামলী, হবিগঞ্জ সদর, হবিগঞ্জ, সিলেট, বাংলাদেশ।",
      copyright:
        "© ২০২৬ আস-সালাম আইডিয়াল মাদরাসা (এইম), হবিগঞ্জ। সর্বস্বত্ব সংরক্ষিত।",
    },
    en: {
      desc: "A distinguished blend of authentic Islamic scholarship and modern education. Managed by experienced Ulama and dedicated faculty in Habiganj.",
      colLinks: "Quick Links",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Notice Board", href: "/notices" },
        { name: "Media Gallery", href: "/gallery" },
        { name: "Exam Results", href: "/results" },
        { name: "Feedback & Suggestions", href: "/contact#feedback" },
      ],
      colAcademic: "Academics & Admission",
      academics: [
        { name: "Admission Process", href: "/admission#process" },
        { name: "Tuition & Fees", href: "/admission#fees" },
        {
          name: "Online Admission Form",
          href: "/admission/form",
          highlight: true,
        },
        { name: "Academic Curriculum", href: "/academics" },
        { name: "Residential Hostel Routine", href: "/hostel#routine" },
      ],
      colContact: "Contact Info",
      address:
        "Dakshin Shyamoli, Habiganj Sadar, Habiganj, Sylhet, Bangladesh.",
      copyright:
        "© 2026 As-Salam Ideal Madrasah (AIM), Habiganj. All rights reserved.",
    },
    ar: {
      desc: "منظومة تعليمية رائدة تجمع بين الأصالة الشرعية والتميز الأكاديمي الحديث تحت إشراف نخبة من العلماء والأساتذة المتخصصين في حبيغنج.",
      colLinks: "روابط هامة",
      links: [
        { name: "من نحن", href: "/about" },
        { name: "لوحة الإعلانات", href: "/notices" },
        { name: "معرض الصور", href: "/gallery" },
        { name: "نتائج الامتحانات", href: "/results" },
        { name: "الشكاوى والاقتراحات", href: "/contact#feedback" },
      ],
      colAcademic: "التعليم والقبول",
      academics: [
        { name: "إجراءات القبول", href: "/admission#process" },
        { name: "الرسوم الدراسية", href: "/admission#fees" },
        {
          name: "استمارة القبول الإلكترونية",
          href: "/admission/form",
          highlight: true,
        },
        { name: "المنهج الأكاديمي", href: "/academics" },
        { name: "برنامج السكن الداخلي", href: "/hostel#routine" },
      ],
      colContact: "تواصل معنا",
      address: "داكشين شامولي، حبيغنج صدر، حبيغنج، سيلهت، بنغلاديش.",
      copyright:
        "© ٢٠٢٦ مدرسة السلام النموذجية (AIM)، حبيغنج. جميع الحقوق محفوظة.",
    },
  };

  const active = content[language] || content.bn;

  return (
    <footer className="relative bg-gradient-to-b from-[#021d12] via-[#01160e] to-[#010e09] dark:from-[#02140d] dark:via-[#010b07] dark:to-[#000503] print:hidden text-slate-300 transition-colors pb-20 md:pb-0 duration-300 overflow-hidden">
      {/* টপ গোল্ডেন অ্যাকসেন্ট বর্ডার ও অ্যাম্বিয়েন্ট লাইট */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800" />
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px]" />

      {/* প্রধান ফুটার কন্টেইনার */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ১. মাদরাসা পরিচিতি ও লোগো সেকশন (৪ কলাম) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-amber-200 to-emerald-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex-shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#021d12]">
                  <Image
                    src="/aimlogo1.png"
                    alt="As-Salam Ideal Madrasah (AIM) Logo"
                    fill
                    sizes="48px"
                    className="object-cover scale-[1.10] rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[15px] text-amber-300 tracking-wide leading-tight font-britanic">
                  As-Salam Ideal Madrasah (AIM)
                </span>
                {language === "ar" ? (
                  <h2
                    className="text-sm font-bold text-white mt-0.5 kufi-custom"
                    dir="rtl"
                    lang="ar"
                  >
                    مدرس<span className="font-sans">ة</span> الس
                    <span className="font-sans">لا</span>م النموذجي
                    <span className="font-sans">ة</span>
                  </h2>
                ) : (
                  <span className="text-sm font-bold text-white mt-0.5 font-shalda">
                    আস-সালাম আইডিয়াল মাদরাসা (এইম)
                  </span>
                )}
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-normal max-w-sm">
              {active.desc}
            </p>

            {/* সোশ্যাল মিডিয়া ও ওয়েবসাইট আইকন লিংক */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/p/AIM-Habiganj-100062973924471/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 hover:border-amber-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-lg"
                title="Facebook"
              >
                <RiFacebookCircleFill />
              </a>
              <a
                href="http://www.youtube.com/@aimhabiganj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 hover:border-amber-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-base"
                title="YouTube"
              >
                <BsYoutube />
              </a>
              <a
                href="https://aimhabiganj.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 hover:border-amber-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-lg"
                title="Website"
              >
                <RiGlobalFill />
              </a>
            </div>
          </div>

          {/* ২. গুরুত্বপূর্ণ লিংকসমূহ (২.৫ কলাম -> ৩ কলাম) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-5">
              {active.colLinks}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {active.links.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-slate-300/85 hover:text-amber-300 transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. শিক্ষা ও ভর্তি কার্যক্রম (৩ কলাম) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-5">
              {active.colAcademic}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {active.academics.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`group inline-flex items-center gap-1.5 transition-colors duration-200 ${
                      item.highlight
                        ? "text-amber-300 font-bold hover:text-amber-200"
                        : "text-slate-300/85 hover:text-amber-300"
                    }`}
                  >
                    {item.highlight ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৪. যোগাযোগ ও ঠিকানা (৩ কলাম) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider border-b border-white/10 pb-3 mb-5">
              {active.colContact}
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300/85">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-amber-400/25 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">{active.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-amber-400/25 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+8801748868161"
                  className="hover:text-amber-300 transition-colors font-mono"
                >
                  +8801748-868161
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-amber-400/25 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href="mailto:aimhabiganj@gmail.com"
                  className="break-all hover:text-amber-300 transition-colors"
                >
                  aimhabiganj@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* কপিরাইট ও আরবি নাম অংশ */}
      <div className="relative z-10 bg-black/30 border-t border-white/10 text-xs py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-slate-400 font-medium">{active.copyright}</p>
          <p
            className="text-amber-300/85 kufi-custom tracking-wide text-sm sm:text-base"
            dir="rtl"
            lang="ar"
          >
            مدرس<span className="font-sans">ة</span> الس
            <span className="font-sans">لا</span>م النموذجي
            <span className="font-sans">ة</span>، حبيغنج
          </p>
        </div>
      </div>
    </footer>
  );
}
