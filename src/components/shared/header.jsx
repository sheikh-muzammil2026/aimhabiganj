"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import siteConfig from "@/config/siteConfig";

export default function Header() {
  return (
    <header className="w-full bg-[#0D47A1] text-white py-3 px-4 sm:px-6 border-b border-[#90CAF9]/30 shadow-sm font-sans antialiased print:hidden">
      <div className="site-container flex flex-col md:flex-row justify-between items-center gap-4">

        {/* --- বাম পাশে: ৩ ভাষায় প্রতিষ্ঠানের নাম ও স্লোগান --- */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex flex-wrap justify-center md:justify-start items-baseline gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
              {siteConfig.name.fullBn}
            </h1>
            <span className="text-sm sm:text-base font-bold text-[#90CAF9] tracking-wide dir-rtl" style={{ fontFamily: "'Amiri', serif" }}>
              {siteConfig.name.fullAr}
            </span>
          </div>

          <h2 className="text-xs sm:text-sm font-semibold text-[#E3F2FD]/90">
            {siteConfig.name.fullEn}
          </h2>

          <p className="text-[11px] sm:text-xs font-medium tracking-wider uppercase text-[#90CAF9] italic mt-0.5">
            &ldquo;{siteConfig.slogan.en}&rdquo;
          </p>
        </div>

        {/* --- ডান পাশে: যোগাযোগের তথ্য --- */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#E3F2FD]">
          <a
            href={`tel:${siteConfig.contacts.phone[0]}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#90CAF9]" />
            <span>{siteConfig.contacts.phoneBn[0] || siteConfig.contacts.phone[0]}</span>
          </a>

          <a
            href={`mailto:${siteConfig.contacts.email}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#90CAF9]" />
            <span>{siteConfig.contacts.email}</span>
          </a>

          <span className="flex items-center gap-1.5 text-[#E3F2FD]/80">
            <MapPin className="w-3.5 h-3.5 text-[#90CAF9]" />
            <span>{siteConfig.address.district}, {siteConfig.address.country}</span>
          </span>
        </div>

      </div>
    </header>
  );
}