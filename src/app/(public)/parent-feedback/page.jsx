"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Search,
  Copy,
  Check,
  CheckCircle2,
  UserCheck,
  BookOpen,
  MessageSquare,
  Send,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const MCQ_QUESTIONS = [
  {
    id: "q3_overallProgress",
    number: "৩",
    label: "আপনার সন্তানের সার্বিক শিক্ষার অগ্রগতি কেমন হয়েছে?",
    options: ["অত্যন্ত ভালো", "ভালো", "মোটামুটি", "আশানুরূপ নয়"],
  },
  {
    id: "q4_islamicEducation",
    number: "৪",
    label: "প্রতিষ্ঠানের দ্বীনি শিক্ষার মান সম্পর্কে আপনার মতামত কী?",
    options: ["অত্যন্ত ভালো", "ভালো", "মোটামুটি", "উন্নতি প্রয়োজন"],
  },
  {
    id: "q5_teachingCare",
    number: "৫",
    label: "শিক্ষকদের পাঠদান ও শিক্ষার্থীদের প্রতি যত্ন কেমন ছিল?",
    options: ["অত্যন্ত ভালো", "ভালো", "মোটামুটি", "উন্নতি প্রয়োজন"],
  },
  {
    id: "q6_disciplineManagement",
    number: "৬",
    label: "প্রতিষ্ঠানের শৃঙ্খলা, পরিবেশ ও ব্যবস্থাপনা সম্পর্কে আপনি কতটুকু সন্তুষ্ট?",
    options: ["অত্যন্ত সন্তুষ্ট", "সন্তুষ্ট", "মোটামুটি সন্তুষ্ট", "অসন্তুষ্ট"],
  },
  {
    id: "q7_moralBehavioralChange",
    number: "৭",
    label: "আপনার সন্তানের আচার-আচরণ ও নৈতিকতায় ইতিবাচক পরিবর্তন লক্ষ্য করেছেন কি?",
    options: [
      "অনেক পরিবর্তন হয়েছে",
      "কিছুটা পরিবর্তন হয়েছে",
      "তেমন পরিবর্তন হয়নি",
      "বলতে পারছি না",
    ],
  },
  {
    id: "q8_overallSatisfaction",
    number: "৮",
    label: "সামগ্রিকভাবে AIM Habiganj-এর কার্যক্রমে আপনি কতটুকু সন্তুষ্ট?",
    options: ["অত্যন্ত সন্তুষ্ট", "সন্তুষ্ট", "মোটামুটি সন্তুষ্ট", "অসন্তুষ্ট"],
  },
];

const Q9_IMPROVEMENT_OPTIONS = [
  "সাধারণ শিক্ষার মান",
  "কুরআন ও হিফজ শিক্ষা",
  "আরবি ভাষা শিক্ষা",
  "শিক্ষকদের পাঠদান পদ্ধতি",
  "শৃঙ্খলা ও তদারকি",
  "সহশিক্ষা ও সৃজনশীল কার্যক্রম",
  "অভিভাবকদের সঙ্গে যোগাযোগ",
  "অবকাঠামো ও পরিবেশ",
];

// ডিফল্ট শ্রেণি ও বিষয় ম্যাপিং (ডাটাবেস সিলেবাসের পাশাপাশি ফলব্যাক হিসেবে ব্যবহৃত হবে)
const DEFAULT_CLASS_SUBJECTS = {
  প্লে: ["আরবি-০১", "ইংরেজি", "বাংলা", "গণিত"],
  নার্সারি: ["আরবি-০২", "ইংরেজি", "বাংলা", "গণিত"],
  প্রথম: [
    "কুরআন ও তাজভীদ-০১",
    "আরবি",
    "তাওহীদ ও ফিকহ-১",
    "ইংরেজি",
    "স্পোকেন ইংলিশ",
    "বাংলা",
    "গণিত",
    "সাধারণ জ্ঞান",
  ],
  দ্বিতীয়: [
    "কুরআন ও তাজভীদ-০২",
    "আরবি",
    "তাওহীদ ও ফিকহ-২",
    "ইংরেজি",
    "স্পোকেন ইংলিশ",
    "বাংলা",
    "গণিত",
    "সাধারণ জ্ঞান",
  ],
  তৃতীয়: [
    "কুরআন ও তাজভীদ-০৩",
    "আরবি",
    "আদব ও দোয়া",
    "তাওহীদ ও ফিকহ-৩",
    "ইংরেজি",
    "স্পোকেন ইংলিশ",
    "বাংলা",
    "গণিত",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "বিজ্ঞান",
    "হাতের লেখা",
  ],
  চতুর্থ: [
    "কুরআন ও তাজভীদ-০৪",
    "এসো আরবি শিখি",
    "এসো তামরিন শিখি",
    "আদাব ও দোয়া",
    "তাওহীদ ও ফিকহ-৪",
    "ইংরেজি",
    "স্পোকেন ইংলিশ",
    "বাংলা",
    "গণিত",
    "বিজ্ঞান",
  ],
  পঞ্চম: [
    "কুরআন ও তাজভীদ-০৫",
    "এসো আরবি শিখি",
    "এসো তামরিন শিখি",
    "সরফ",
    "তাওহীদ ও ফিকহ-৫",
    "ইংরেজি",
    "স্পোকেন ইংলিশ",
    "বাংলা",
    "গণিত",
    "বিজ্ঞান",
  ],
  ষষ্ঠ: [
    "হিফজুল কুরআন ও তাজভীদ-০১",
    "কুরআন অনুবাদ-০১",
    "হাদিস আরবাঈন",
    "আরবি",
    "সরফ",
    "নাহু",
    "তাওহীদ ও ফিকহ-৫",
    "ইংরেজি ১ম ও ২য়",
    "স্পোকেন ইংলিশ",
    "বাংলা ১ম ও ২য়",
    "গণিত",
    "বিজ্ঞান",
  ],
  সপ্তম: [
    "হিফজুল কুরআন ও তাজভীদ-০২",
    "কুরআন অনুবাদ-০২",
    "হাদিস",
    "আরবি",
    "সরফ",
    "নাহু",
    "তাওহীদ",
    "ফিকহ",
    "ইংরেজি ১ম ও ২য়",
    "স্পোকেন ইংলিশ",
    "বাংলা ১ম ও ২য়",
    "গণিত",
    "বিজ্ঞান",
  ],
  অষ্টম: [
    "হিফজুল কুরআন ও তাজভীদ-০৩",
    "কুরআন অনুবাদ-০৩",
    "হাদিস",
    "উসুলুল হাদিস",
    "আরবি",
    "সরফ",
    "নাহু",
    "তাওহীদ",
    "ফিকহ",
    "ইংরেজি ১ম ও ২য়",
    "স্পোকেন ইংলিশ",
    "বাংলা ১ম ও ২য়",
    "গণিত",
    "বিজ্ঞান",
  ],
  নবম: [
    "বাংলা ১ম ও ২য়",
    "ইংরেজি ১ম ও ২য়",
    "গণিত",
    "বিজ্ঞান",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "ইসলাম ও নৈতিক শিক্ষা",
    "আরবি",
    "ফিকহ",
  ],
  দশম: [
    "বাংলা ১ম ও ২য়",
    "ইংরেজি ১ম ও ২য়",
    "গণিত",
    "বিজ্ঞান",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "ইসলাম ও নৈতিক শিক্ষা",
    "আরবি",
    "ফিকহ",
  ],
  "কায়দা/আমপারা": [
    "কুরআন",
    "তাজভীদ ও দোয়া",
    "আরবি",
    "ইংরেজি",
    "বাংলা",
    "গণিত",
  ],
  নাজেরা: ["কুরআন", "তাজভীদ ও দোয়া", "আরবি", "ইংরেজি", "বাংলা", "গণিত"],
  সবক: ["কুরআন", "তাজভীদ ও দোয়া"],
  শুনানি: ["কুরআন", "তাজভীদ ও দোয়া"],
};

export default function ParentFeedbackPage() {
  // Dynamic DB Syllabus State (Classes & Class-wise Subjects)
  const [dbClasses, setDbClasses] = useState(Object.keys(DEFAULT_CLASS_SUBJECTS));
  const [classSubjectsMap, setClassSubjectsMap] = useState(DEFAULT_CLASS_SUBJECTS);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Student Lookup State
  const [lookupQuery, setLookupQuery] = useState("");
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [selectedStudentRecord, setSelectedStudentRecord] = useState(null);

  // Copy Link State
  const [copiedLink, setCopiedLink] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Data State (All 11 Questions)
  const [formData, setFormData] = useState({
    academicYear: "2026",
    studentId: "",
    studentRoll: "",
    studentName: "", // ১. শিক্ষার্থীর নাম
    className: "", // ২. শিক্ষার্থীর শ্রেণি
    q3_overallProgress: "",
    q4_islamicEducation: "",
    q5_teachingCare: "",
    q6_disciplineManagement: "",
    q7_moralBehavioralChange: "",
    q8_overallSatisfaction: "",
    q9_improvementAreas: [],
    q10_subjectComments: {}, // ১০. বিষয়ভিত্তিক শিক্ষকদের মন্তব্য ({ [subjectName]: comment })
    q11_suggestionsOrComplaints: "", // ১১. পরামর্শ, অভিযোগ বা প্রত্যাশা
  });

  // Load Classes & Class-wise Subjects directly from existing DB `syllabus` collection
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoadingMeta(true);
        const res = await fetch("/api/parent-feedback?mode=meta");
        const result = await res.json();
        if (result.success) {
          const apiClasses = Array.isArray(result.classes) ? result.classes : [];
          const mergedClasses = Array.from(
            new Set([...apiClasses, ...Object.keys(DEFAULT_CLASS_SUBJECTS)]),
          );
          setDbClasses(mergedClasses);
          setClassSubjectsMap((prev) => ({
            ...prev,
            ...(result.classSubjects || {}),
          }));
        }
      } catch (err) {
        console.error("Failed to load syllabus classes/subjects:", err);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  // Available normalized subjects [{ subject, teacherName }] for currently selected class
  const availableSubjectsForClass = useMemo(() => {
    if (!formData.className) return [];
    const rawList =
      classSubjectsMap[formData.className] ||
      DEFAULT_CLASS_SUBJECTS[formData.className] ||
      [];
    return rawList
      .map((item) => {
        if (typeof item === "string") {
          return { subject: item.trim(), teacherName: "" };
        }
        if (item && typeof item === "object") {
          return {
            subject: String(
              item.subject || item.subjectName || item.name || "",
            ).trim(),
            teacherName: String(
              item.teacherName || item.teacher || "",
            ).trim(),
          };
        }
        return null;
      })
      .filter((item) => item && item.subject);
  }, [formData.className, classSubjectsMap]);

  // Controlled Student Lookup Handler
  const handleStudentLookup = async (e) => {
    if (e) e.preventDefault();
    const q = lookupQuery.trim();
    if (!q) {
      toast.info("অনুগ্রহ করে শিক্ষার্থীর আইডি, রোল অথবা নাম লিখুন।");
      return;
    }

    try {
      setSearchingStudent(true);
      setMatchedStudents([]);

      const params = new URLSearchParams({
        mode: "lookup",
        q,
      });
      const res = await fetch(`/api/parent-feedback?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.students)) {
        if (data.students.length === 0) {
          toast.warning(
            "এই আইডি/নামে কোনো শিক্ষার্থী পাওয়া যায়নি। আপনি নিচে সরাসরি নাম ও শ্রেণি পূরণ করতে পারেন।",
          );
        } else if (data.students.length === 1) {
          applyStudentSelection(data.students[0]);
          toast.success("শিক্ষার্থীর তথ্য স্বয়ংক্রিয়ভাবে পূরণ করা হয়েছে!");
        } else {
          setMatchedStudents(data.students);
          toast.info(
            `${data.students.length} জন শিক্ষার্থী পাওয়া গেছে। তালিকা থেকে আপনার সন্তানকে নির্বাচন করুন।`,
          );
        }
      } else {
        toast.error(data.message || "অনুসন্ধান সম্পন্ন করা যায়নি।");
      }
    } catch (error) {
      console.error("Student lookup error:", error);
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setSearchingStudent(false);
    }
  };

  // Auto-fill Q1 (Student Name), Q2 (Class), and Class Subjects when student is selected
  const applyStudentSelection = (student) => {
    setSelectedStudentRecord(student);
    setMatchedStudents([]);

    const matchedClass = student.className || "";
    if (
      matchedClass &&
      Array.isArray(student.subjects) &&
      student.subjects.length > 0
    ) {
      setClassSubjectsMap((prev) => ({
        ...prev,
        [matchedClass]: student.subjects,
      }));
      setDbClasses((prev) =>
        prev.includes(matchedClass) ? prev : [...prev, matchedClass],
      );
    }

    setFormData((prev) => ({
      ...prev,
      studentId: student.studentId || "",
      studentRoll: String(student.roll || ""),
      studentName:
        student.studentNameBangla ||
        student.studentNameEnglish ||
        student.studentName ||
        prev.studentName,
      className: matchedClass || prev.className,
      q10_subjectComments:
        matchedClass && matchedClass !== prev.className
          ? {}
          : prev.q10_subjectComments,
    }));
  };

  // Handle Class Change in Q2
  const handleClassChange = (newClass) => {
    setFormData((prev) => ({
      ...prev,
      className: newClass,
      q10_subjectComments: {},
    }));
  };

  // Handle Individual Subject Comment Change in Q10
  const handleSubjectCommentChange = (subjectName, value) => {
    setFormData((prev) => ({
      ...prev,
      q10_subjectComments: {
        ...(prev.q10_subjectComments || {}),
        [subjectName]: value,
      },
    }));
  };

  // Handle Q9 Multi-Select Toggle
  const handleCheckboxToggle = (option) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.q9_improvementAreas)
        ? prev.q9_improvementAreas
        : [];
      const exists = currentList.includes(option);
      const next = exists
        ? currentList.filter((item) => item !== option)
        : [...currentList, option];
      return { ...prev, q9_improvementAreas: next };
    });
  };

  // Copy Shareable Form Link
  const handleCopyShareLink = async () => {
    try {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/parent-feedback`
          : "https://aimpurbachal.com/parent-feedback";
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast.success("ফরমের লিংক কপি করা হয়েছে!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {
      toast.error("লিংক কপি করা যায়নি।");
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName.trim()) {
      toast.error("১. শিক্ষার্থীর নাম প্রদান করুন।");
      return;
    }
    if (!formData.className.trim()) {
      toast.error("২. শিক্ষার্থীর শ্রেণি নির্বাচন করুন।");
      return;
    }

    for (const q of MCQ_QUESTIONS) {
      if (!formData[q.id]) {
        toast.error(`অনুগ্রহ করে প্রশ্ন ${q.number}-এর উত্তর নির্বাচন করুন।`);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Build array of non-empty subject feedbacks [{ subject, teacherName, comment }]
      const subjectFeedbacks = availableSubjectsForClass
        .map(({ subject, teacherName }) => {
          const comment = String(
            formData.q10_subjectComments?.[subject] || "",
          ).trim();
          return {
            subject,
            teacherName: teacherName || "",
            comment,
          };
        })
        .filter((item) => item.subject && item.comment.length > 0);

      const payload = {
        ...formData,
        q10_selectedSubject: subjectFeedbacks[0]?.subject || "",
        q10_teacherComment: subjectFeedbacks[0]?.comment || "",
        q10_subjectFeedbacks: subjectFeedbacks,
      };

      const res = await fetch("/api/parent-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsSubmitted(true);
        toast.success(result.message || "আপনার মতামত সফলভাবে জমা হয়েছে!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(result.message || "মতামত জমা দিতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Feedback submit error:", error);
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setLookupQuery("");
    setSelectedStudentRecord(null);
    setMatchedStudents([]);
    setFormData({
      academicYear: "2026",
      studentId: "",
      studentRoll: "",
      studentName: "",
      className: "",
      q3_overallProgress: "",
      q4_islamicEducation: "",
      q5_teachingCare: "",
      q6_disciplineManagement: "",
      q7_moralBehavioralChange: "",
      q8_overallSatisfaction: "",
      q9_improvementAreas: [],
      q10_subjectComments: {},
      q11_suggestionsOrComplaints: "",
    });
  };

  return (
    <div className="page-wrapper font-bornomala">
      <div className="site-container space-y-6">
        {/* Top Utility Bar: Back to Home & Shareable Copy Link Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D47A1] hover:text-[#2196F3] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#90CAF9] text-xs sm:text-sm font-bold text-[#0D47A1] shadow-xs hover:bg-[#E3F2FD] transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-[#2196F3]" />
                <span>লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#0D47A1]" />
                <span>লিংক কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Official Institutional Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D47A1] via-[#0A3880] to-[#0D47A1] text-white p-6 sm:p-10 shadow-xl border border-[#90CAF9]/40">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-[#2196F3]/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-[#90CAF9]/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center space-y-3">
            <p className="text-lg sm:text-2xl font-bold text-[#90CAF9] tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-widest uppercase text-white font-ubuntu">
              AS-SALAM IDEAL MADRASAH — AIM HABIGANJ
            </h2>

            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#2196F3]/30 border border-[#90CAF9]/40 text-white text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-[#90CAF9]" />
              <span>Parents Feedback</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white pt-1">
              অভিভাবক মতামত
            </h1>

            <div className="max-w-3xl mx-auto mt-4 pt-4 border-t border-white/20 text-xs sm:text-sm md:text-base text-[#E3F2FD] leading-relaxed text-left bg-black/15 rounded-2xl p-4 sm:p-5 border border-[#90CAF9]/20">
              <p className="font-bold text-[#90CAF9] mb-1.5">ভূমিকা:</p>
              <p>সম্মানিত অভিভাবক, আসসালামু আলাইকুম।</p>
              <p className="mt-1">
                ২০২৬ শিক্ষাবর্ষে আপনার সন্তানের শিক্ষা, নৈতিক ও চারিত্রিক উন্নয়ন এবং
                প্রতিষ্ঠানের সার্বিক কার্যক্রম সম্পর্কে আপনার মূল্যবান মতামত জানতে আমরা
                আগ্রহী। আপনার মতামত আগামী শিক্ষাবর্ষে প্রতিষ্ঠানের শিক্ষার মানোন্নয়নে
                গুরুত্বপূর্ণ ভূমিকা রাখবে।
              </p>
              <p className="mt-1 font-semibold text-white">
                আপনার মূল্যবান সময় ও সহযোগিতার জন্য আন্তরিক ধন্যবাদ।
              </p>
            </div>
          </div>
        </div>

        {/* Post-Submission Thank You Screen */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#90CAF9] shadow-lg text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 text-[#2196F3]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0D47A1]">
              আপনাকে আন্তরিক ধন্যবাদ।
            </h2>

            <p className="text-sm sm:text-base text-[#1E293B] max-w-xl mx-auto leading-relaxed">
              আপনার মূল্যবান মতামত আমাদের আগামী দিনের পথচলাকে আরও সুন্দর, সমৃদ্ধ ও
              কার্যকর করতে সহায়তা করবে।
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="btn-primary px-6 py-2.5 text-xs sm:text-sm shadow-md"
              >
                অন্য সন্তানের জন্য মতামত দিন
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl border border-[#90CAF9] text-[#0D47A1] font-bold text-xs sm:text-sm hover:bg-[#E3F2FD] transition-all"
              >
                হোমপেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Controlled Student Lookup Card (Auto-fills Name, Class & Class Subjects from DB) */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#90CAF9] shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] bg-[#E3F2FD] px-3 py-1 rounded-full border border-[#90CAF9]">
                    <UserCheck className="w-3.5 h-3.5 text-[#2196F3]" />
                    দ্রুত তথ্য পূরণ (ঐচ্ছিক)
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0D47A1] mt-2">
                    শিক্ষার্থীর আইডি / রোল অথবা নাম দিয়ে খুঁজুন
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    আইডি বা নাম দিয়ে খুঁজলে শিক্ষার্থীর নাম, শ্রেণি এবং ওই শ্রেণির
                    বিষয়সমূহ স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleStudentLookup(e);
                      }
                    }}
                    placeholder="শিক্ষার্থীর আইডি (যেমন: 04189), রোল অথবা নাম লিখুন..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStudentLookup}
                  disabled={searchingStudent}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm disabled:opacity-60 shrink-0"
                >
                  {searchingStudent ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>খোঁজা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>খুঁজুন (Search)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Multiple Matched Students Selector */}
              {matchedStudents.length > 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-[#0D47A1]">
                    নিচের তালিকা থেকে আপনার সন্তানকে নির্বাচন করুন:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {matchedStudents.map((st) => (
                      <button
                        key={st._id}
                        type="button"
                        onClick={() => applyStudentSelection(st)}
                        className="text-left p-3 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 hover:bg-[#E3F2FD] transition-all flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#0D47A1]">
                            {st.studentName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            শ্রেণি: <strong>{st.className || "—"}</strong> • আইডি:{" "}
                            {st.studentId || "—"} • রোল: {st.roll || "—"}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#0D47A1] px-2.5 py-1 rounded-lg bg-white border border-[#90CAF9] shrink-0">
                          নির্বাচন করুন
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Student Confirmation Banner */}
              {selectedStudentRecord && (
                <div className="p-3 rounded-xl bg-[#E3F2FD] border border-[#90CAF9] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#0D47A1]">
                    <CheckCircle2 className="w-4 h-4 text-[#2196F3] shrink-0" />
                    <span>
                      নির্বাচিত শিক্ষার্থী:{" "}
                      <strong>{selectedStudentRecord.studentName}</strong> (আইডি:{" "}
                      {selectedStudentRecord.studentId || "—"}, শ্রেণি:{" "}
                      {selectedStudentRecord.className || "—"})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentRecord(null)}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    পরিবর্তন করুন
                  </button>
                </div>
              )}
            </div>

            {/* Main 11-Question Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Questions 1 & 2: Student Name & Student Class */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#90CAF9] shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Question 1 */}
                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1] mb-2">
                      ১. শিক্ষার্থীর নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData({ ...formData, studentName: e.target.value })
                      }
                      placeholder="শিক্ষার্থীর পূর্ণ নাম লিখুন..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3]"
                    />
                  </div>

                  {/* Question 2 */}
                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1] mb-2">
                      ২. শিক্ষার্থীর শ্রেণি <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.className}
                      onChange={(e) => handleClassChange(e.target.value)}
                      disabled={loadingMeta}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-xs sm:text-sm font-semibold text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3]"
                    >
                      <option value="">
                        {loadingMeta
                          ? "শ্রেণি লোড হচ্ছে..."
                          : "-- শ্রেণি নির্বাচন করুন --"}
                      </option>
                      {dbClasses.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Questions 3 to 8: Multiple Choice Questions */}
              {MCQ_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#90CAF9] shadow-sm space-y-4"
                >
                  <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1]">
                    {q.number}. {q.label} <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {q.options.map((opt) => {
                      const isSelected = formData[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          aria-pressed={isSelected}
                          className={`cursor-pointer w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all select-none ${isSelected
                              ? "bg-[#2196F3] text-white border-[#2196F3] shadow-md"
                              : "bg-white text-[#1E293B] border-[#90CAF9] hover:bg-[#E3F2FD]"
                            }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${isSelected
                                ? "border-white bg-white text-[#2196F3]"
                                : "border-slate-400"
                              }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
                            )}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Question 9: Checkboxes (Multiple Selection) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#90CAF9] shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1]">
                      ৯. আগামী শিক্ষাবর্ষে প্রতিষ্ঠানের কোন বিষয়গুলোর উন্নয়ন বেশি
                      প্রয়োজন বলে মনে করেন?
                    </label>
                    <p className="text-xs text-[#2196F3] font-semibold mt-1">
                      (একাধিক নির্বাচন করা যাবে)
                    </p>
                  </div>

                  {formData.q9_improvementAreas.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2FD] text-[#0D47A1] text-xs font-extrabold border border-[#90CAF9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3]" />
                      <span>
                        {formData.q9_improvementAreas.length} টি নির্বাচিত
                      </span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Q9_IMPROVEMENT_OPTIONS.map((option) => {
                    const isChecked =
                      formData.q9_improvementAreas.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleCheckboxToggle(option)}
                        aria-pressed={isChecked}
                        className={`cursor-pointer w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all select-none ${isChecked
                            ? "bg-[#E3F2FD] text-[#0D47A1] border-[#2196F3] ring-2 ring-[#2196F3]/20 shadow-xs"
                            : "bg-white text-[#1E293B] border-[#90CAF9] hover:bg-[#E3F2FD]"
                          }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${isChecked
                              ? "bg-[#2196F3] border-[#2196F3] text-white"
                              : "border-slate-400 bg-white"
                            }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 10: Auto-Display Comment Fields for All Class Subjects / Subject Teachers (Optional) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#90CAF9] shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#2196F3] shrink-0" />
                      <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1]">
                        ১০. বিষয়ভিত্তিক শিক্ষক সম্পর্কে আপনার মতামত (ঐচ্ছিক)
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 pl-7">
                      আপনার সন্তানের শ্রেণির সকল বিষয়ের তালিকা নিচে দেওয়া হলো। যে সকল
                      বিষয়ের শিক্ষকের ব্যাপারে মতামত দিতে চান, শুধুমাত্র সেই ঘরগুলোতে
                      লিখুন (বাকিগুলো খালি রাখা যাবে)।
                    </p>
                  </div>

                  {formData.className && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2FD] border border-[#90CAF9] text-xs font-extrabold text-[#0D47A1]">
                      শ্রেণি: {formData.className} (
                      {availableSubjectsForClass.length} টি বিষয়)
                    </span>
                  )}
                </div>

                {!formData.className ? (
                  <div className="p-5 sm:p-6 rounded-2xl border border-dashed border-[#90CAF9] bg-[#E3F2FD]/40 text-center space-y-1.5">
                    <BookOpen className="w-7 h-7 text-[#2196F3] mx-auto" />
                    <p className="text-xs sm:text-sm font-bold text-[#0D47A1]">
                      বিষয়ভিত্তিক শিক্ষকদের তালিকা দেখতে অনুগ্রহ করে প্রথমে ২ নং প্রশ্নে
                      শিক্ষার্থীর শ্রেণি নির্বাচন করুন।
                    </p>
                    <p className="text-[11px] text-slate-500">
                      শ্রেণি নির্বাচন করার সাথে সাথেই উক্ত শ্রেণির সকল বিষয়ের মন্তব্যের
                      ঘর স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
                    </p>
                  </div>
                ) : availableSubjectsForClass.length === 0 ? (
                  <div className="p-5 rounded-2xl border border-[#90CAF9] bg-[#E3F2FD]/30 text-center text-xs sm:text-sm text-slate-500">
                    এই শ্রেণির জন্য কোনো বিষয় তালিকা পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {availableSubjectsForClass.map(
                      ({ subject, teacherName }, index) => {
                        const commentVal =
                          formData.q10_subjectComments?.[subject] || "";
                        const hasText = commentVal.trim().length > 0;
                        return (
                          <div
                            key={subject}
                            className={`p-4 rounded-2xl border transition-all space-y-2.5 ${hasText
                                ? "bg-[#E3F2FD]/60 border-[#2196F3] shadow-xs"
                                : "bg-white border-[#90CAF9]"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#0D47A1]">
                                  <span className="w-5 h-5 rounded-full bg-[#2196F3] text-white text-[11px] flex items-center justify-center shrink-0">
                                    {index + 1}
                                  </span>
                                  <span>{subject}</span>
                                </span>
                                {teacherName && (
                                  <p className="text-[11px] font-semibold text-[#2196F3] mt-0.5 pl-6">
                                    শিক্ষক: {teacherName}
                                  </p>
                                )}
                              </div>

                              {hasText && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2196F3] text-white shrink-0">
                                  মতামত যুক্ত
                                </span>
                              )}
                            </div>

                            <textarea
                              rows={2}
                              value={commentVal}
                              onChange={(e) =>
                                handleSubjectCommentChange(
                                  subject,
                                  e.target.value,
                                )
                              }
                              placeholder={`${subject}${teacherName ? ` (${teacherName})` : ""} বিষয়ের শিক্ষক ও পাঠদান সম্পর্কে মতামত লিখুন (ঐচ্ছিক)...`}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3]"
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Question 11: Overall Suggestions, Complaints or Expectations */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#90CAF9] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#2196F3] shrink-0" />
                  <label className="block text-sm sm:text-base font-extrabold text-[#0D47A1]">
                    ১১. প্রতিষ্ঠানের প্রতি আপনার কোনো পরামর্শ, অভিযোগ বা প্রত্যাশা
                    থাকলে লিখুন।
                  </label>
                </div>

                <textarea
                  rows={4}
                  value={formData.q11_suggestionsOrComplaints}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      q11_suggestionsOrComplaints: e.target.value,
                    }))
                  }
                  placeholder="আপনার পরামর্শ, অভিযোগ বা প্রত্যাশা বিস্তারিত লিখুন..."
                  className="w-full px-4 py-3 rounded-2xl border border-[#90CAF9] bg-white text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#2196F3]"
                />
              </div>

              {/* Footer Message & Submit Button */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#90CAF9] shadow-sm space-y-5 text-center">
                <div className="p-4 rounded-2xl bg-[#E3F2FD] border border-[#90CAF9]">
                  <p className="text-sm sm:text-base font-extrabold text-[#0D47A1]">
                    আপনাকে আন্তরিক ধন্যবাদ।
                  </p>
                  <p className="text-xs sm:text-sm text-[#1E293B] mt-1">
                    আপনার মূল্যবান মতামত আমাদের আগামী দিনের পথচলাকে আরও সুন্দর,
                    সমৃদ্ধ ও কার্যকর করতে সহায়তা করবে।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>
                    {isSubmitting
                      ? "মতামত জমা হচ্ছে, অপেক্ষা করুন..."
                      : "মতামত জমা দিন (Submit Feedback)"}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
