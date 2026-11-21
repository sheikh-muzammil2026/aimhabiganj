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
        if (id === "teachers") {
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
      
      {/* ১. শ্রেণী শিক্ষকের তালিকা সেকশন */}
      <section id="teachers" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-white">
        <ClassTeachers data={academicData?.teachers} />
      </section>

      {/* ২. শিক্ষা স্তর সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="levels" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-[#E3F2FD]/50">
        <EducationLevels data={academicData?.levels} />
      </section>

      {/* ৩. পাঠ্যক্রম (Syllabus) সেকশন */}
      <section id="syllabus" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-white">
        <Syllabus data={academicData?.syllabus} />
      </section>

      {/* ৪. সহ-পাঠ্যক্রম সেকশন (অল্টারনেট ব্যাকগ্রাউন্ড) */}
      <section id="co-curricular" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-[#E3F2FD]/50">
        <CoCurricular data={academicData?.coCurricular} />
      </section>

      {/* ৫. ক্লাস রুটিন সেকশন */}
      <section id="class-routine" className="py-12 sm:py-16 scroll-mt-24 border-b border-[#90CAF9]/40 bg-white">
        <RoutineSection 
          title="ক্লাস রুটিন" 
          subtitle="দৈনন্দিন পিরিয়ড ও ঘন্টা ভিত্তিক ক্লাসের সময়সূচী বিবরণী" 
          type="class"
        />
      </section>

      {/* ৬. পরীক্ষা রুটিন সেকশন (সর্বশেষ সেকশন) */}
      <section id="exam-routine" className="py-12 sm:py-16 scroll-mt-24 bg-[#E3F2FD]/50">
        <RoutineSection 
          title="পরীক্ষা রুটিন" 
          subtitle="সাময়িক ও বার্ষিক পরীক্ষার সময়সূচী এবং হল বিন্যাস" 
          type="exam"
        />
      </section>

    </div>
  );
}
