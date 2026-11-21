// app/hostel/page.js
"use client";

import { useEffect, useState } from "react";
import { HostelAbout, HostelChart } from "@/components/public/hostel/HostelIntro";
import HostelDirectors from "@/components/public/hostel/HostelDirectors";
import HostelRules from "@/components/public/hostel/HostelRules";
import HostelRoutine from "@/components/public/hostel/HostelRoutine";

export default function HostelPage() {
  const [hostelData] = useState({
    about: null,
    directors: null,
    rules: null,
    chart: null,
    routine: null,
  });

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        if (id === "about") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    scrollToHash();
    const timer = setTimeout(scrollToHash, 250);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="page-wrapper scroll-smooth">
      
      {/* ১. ছাত্রাবাস পরিচিতি সেকশন */}
      <section id="about" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-white">
        <HostelAbout data={hostelData?.about} />
      </section>

      {/* ২. আবাসিক হলের পরিচালকবৃন্দ সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="directors" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-[#E3F2FD]/50">
        <HostelDirectors data={hostelData?.directors} />
      </section>

      {/* ৩. আবাসন প্রাপ্তির নিয়মাবলী সেকশন */}
      <section id="rules" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-white">
        <HostelRules data={hostelData?.rules} />
      </section>

      {/* ৪. আবাসন চার্ট সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="chart" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-[#E3F2FD]/50">
        <HostelChart data={hostelData?.chart} />
      </section>

      {/* ৫. দৈনিক আবাসিক কার্যসূচি সেকশন */}
      <section id="routine" className="py-12 sm:py-16 bg-white">
        <HostelRoutine data={hostelData?.routine} />
      </section>

    </div>
  );
}
