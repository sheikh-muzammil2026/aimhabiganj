// app/academics/page.js
"use client";

import { useEffect, useState } from "react";
import ClassTeachers from "@/components/public/academics/ClassTeachers";
import EducationLevels from "@/components/public/academics/EducationLevels";
import { Syllabus, CoCurricular } from "@/components/public/academics/SyllabusAndCoCurricular";
import RoutineSection from "@/components/public/academics/RoutineSection";

export default function AcademicsPage() {
  const [academicData] = useState({
    teachers: null,
    levels: null,
    syllabus: null,
    coCurricular: null,
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
      
      {/* ১. শ্রেণী শিক্ষকের তালিকা সেকশন */}
      <section id="teachers" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <ClassTeachers data={academicData?.teachers} />
      </section>

      {/* ২. শিক্ষা স্তর সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="levels" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <EducationLevels data={academicData?.levels} />
      </section>

      {/* ৩. পাঠ্যক্রম (Syllabus) সেকশন */}
      <section id="syllabus" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Syllabus data={academicData?.syllabus} />
      </section>

      {/* ৪. সহ-পাঠ্যক্রম সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="co-curricular" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <CoCurricular data={academicData?.coCurricular} />
      </section>

      {/* ৫. ক্লাস রুটিন সেকশন */}
      <section id="class-routine" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <RoutineSection 
          title="ক্লাস রুটিন" 
          subtitle="দৈনন্দিন পিরিয়ড ও ঘন্টা ভিত্তিক ক্লাসের সময়সূচী বিবরণী" 
          type="class"
        />
      </section>

      {/* ৬. পরীক্ষা রুটিন সেকশন (সর্বশেষ সেকশন) */}
      <section id="exam-routine" className="py-16 scroll-mt-24 bg-emerald-50/10 dark:bg-slate-900/40">
        <RoutineSection 
          title="পরীক্ষা রুটিন" 
          subtitle="সাময়িক ও বার্ষিক পরীক্ষার সময়সূচী এবং হল বিন্যাস" 
          type="exam"
        />
      </section>

    </div>
  );
}
