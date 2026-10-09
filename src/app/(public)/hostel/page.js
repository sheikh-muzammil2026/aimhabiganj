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
    <div className="scroll-smooth min-h-screen bg-gray-50 dark:bg-slate-900">
      
      {/* ১. ছাত্রাবাস পরিচিতি সেকশন */}
      <section id="about" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <HostelAbout data={hostelData?.about} />
      </section>

      {/* ২. আবাসিক হলের পরিচালকবৃন্দ সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="directors" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <HostelDirectors data={hostelData?.directors} />
      </section>

      {/* ৩. আবাসন প্রাপ্তির নিয়মাবলী সেকশন */}
      <section id="rules" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <HostelRules data={hostelData?.rules} />
      </section>

      {/* ৪. আবাসন চার্ট সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="chart" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <HostelChart data={hostelData?.chart} />
      </section>

      {/* ৫. দৈনিক আবাসিক কার্যসূচি সেকশন */}
      <section id="routine" className="py-16">
        <HostelRoutine data={hostelData?.routine} />
      </section>

    </div>
  );
}
