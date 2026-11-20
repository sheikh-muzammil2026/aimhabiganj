"use client";

import Image from "next/image";
import Link from "next/link";
import { BsYoutube } from "react-icons/bs";
import { RiFacebookCircleFill, RiGlobalFill } from "react-icons/ri";
import { MapPin, Phone, Mail, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import siteConfig from "@/config/siteConfig";

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    bn: {
      desc: siteConfig.description.bn,
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
      address: siteConfig.address.bn,
      copyright: `© ${siteConfig.academicSession.currentBn} ${siteConfig.name.fullBn}। সর্বস্বত্ব সংরক্ষিত।`,
    },
    en: {
      desc: siteConfig.description.en,
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
      address: siteConfig.address.en,
      copyright: `© ${siteConfig.academicSession.currentEn} ${siteConfig.name.fullEn}. All rights reserved.`,
    },
    ar: {
      desc: siteConfig.description.ar,
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
      address: siteConfig.address.ar,
      copyright: `© ٢٠٢٦ ${siteConfig.name.fullAr}. جميع الحقوق محفوظة.`,
    },
  };

  const active = content[language] || content.bn;

  return (
    <footer className="relative bg-[#0D47A1] print:hidden text-[#E3F2FD] transition-colors pb-20 md:pb-0 duration-300 overflow-hidden">
      {/* টপ স্কাই ব্লু অ্যাকসেন্ট বর্ডার */}
      <div className="h-[2px] w-full bg-[#90CAF9]" />
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-[#2196F3]/15 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 bg-[#90CAF9]/15 rounded-full blur-[130px]" />

      {/* প্রধান ফুটার কন্টেইনার */}
      <div className="relative z-10 site-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ১. প্রতিষ্ঠান পরিচিতি ও লোগো সেকশন (৪ কলাম) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 rounded-full p-[2px] ring-2 ring-[#90CAF9]/80 shadow-md flex-shrink-0 bg-white">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={siteConfig.assets.logo}
                    alt={`${siteConfig.name.short} Logo`}
                    fill
                    sizes="48px"
                    className="object-cover scale-[1.10] rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[15px] text-white tracking-wide leading-tight font-britanic">
                  {siteConfig.name.fullEn}
                </span>
                {language === "ar" ? (
                  <h2
                    className="text-sm font-bold text-[#E3F2FD] mt-0.5 kufi-custom"
                    dir="rtl"
                    lang="ar"
                  >
                    {siteConfig.name.fullAr}
                  </h2>
                ) : (
                  <span className="text-sm font-bold text-[#E3F2FD] mt-0.5 font-shalda">
                    {siteConfig.name.fullBn}
                  </span>
                )}
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#E3F2FD]/80 leading-relaxed font-normal max-w-sm">
              {active.desc}
            </p>

            {/* সোশ্যাল মিডিয়া ও ওয়েবসাইট আইকন লিংক */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 border border-[#90CAF9]/40 text-[#90CAF9] hover:bg-[#2196F3] hover:text-white hover:border-[#2196F3] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-lg cursor-pointer"
                title="Facebook"
              >
                <RiFacebookCircleFill />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 border border-[#90CAF9]/40 text-[#90CAF9] hover:bg-[#2196F3] hover:text-white hover:border-[#2196F3] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-base cursor-pointer"
                title="YouTube"
              >
                <BsYoutube />
              </a>
              <a
                href={siteConfig.contacts.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 border border-[#90CAF9]/40 text-[#90CAF9] hover:bg-[#2196F3] hover:text-white hover:border-[#2196F3] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-sm text-lg cursor-pointer"
                title="Website"
              >
                <RiGlobalFill />
              </a>
            </div>
          </div>

          {/* ২. গুরুত্বপূর্ণ লিংকসমূহ (২ কলাম) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#90CAF9]/30 pb-3 mb-5">
              {active.colLinks}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {active.links.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[#E3F2FD]/85 hover:text-[#90CAF9] transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#90CAF9] group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. শিক্ষা ও ভর্তি কার্যক্রম (৩ কলাম) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#90CAF9]/30 pb-3 mb-5">
              {active.colAcademic}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {active.academics.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`group inline-flex items-center gap-1.5 transition-colors duration-200 ${
                      item.highlight
                        ? "text-white font-bold hover:text-[#90CAF9]"
                        : "text-[#E3F2FD]/85 hover:text-[#90CAF9]"
                    }`}
                  >
                    {item.highlight ? (
                      <Sparkles className="w-3.5 h-3.5 text-[#2196F3] animate-pulse" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#90CAF9] group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৪. যোগাযোগ ও ঠিকানা (৩ কলাম) */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#90CAF9]/30 pb-3 mb-5">
              {active.colContact}
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#E3F2FD]/85">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#90CAF9]/30 flex items-center justify-center text-[#90CAF9] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">{active.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#90CAF9]/30 flex items-center justify-center text-[#90CAF9] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href={`tel:${siteConfig.contacts.phone[0]}`}
                  className="hover:text-[#90CAF9] transition-colors font-mono"
                >
                  {siteConfig.contacts.phone[0]}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#90CAF9]/30 flex items-center justify-center text-[#90CAF9] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="break-all hover:text-[#90CAF9] transition-colors"
                >
                  {siteConfig.contacts.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* কপিরাইট, ডেভেলপার ক্রেডিট ও আরবি নাম অংশ */}
      <div className="relative z-10 bg-[#082c66] border-t border-[#90CAF9]/20 text-xs py-5 px-4">
        <div className="site-container flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[#E3F2FD]/75 font-medium">
            <span>{active.copyright}</span>
            <span className="hidden sm:inline text-[#90CAF9]/60">•</span>
            <span>
              {siteConfig.developer.creditText[language] || siteConfig.developer.creditText.bn}{" "}
              <a
                href={siteConfig.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#90CAF9] hover:underline font-bold"
              >
                {siteConfig.developer.name}
              </a>
            </span>
          </div>
          <p
            className="text-[#90CAF9] kufi-custom tracking-wide text-sm sm:text-base"
            dir="rtl"
            lang="ar"
          >
            {siteConfig.name.fullAr}
          </p>
        </div>
      </div>
    </footer>
  );
}
