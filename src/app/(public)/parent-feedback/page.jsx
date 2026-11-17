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

export default function ParentFeedbackPage() {
  // Dynamic DB Syllabus State (Classes & Class-wise Subjects)
  const [dbClasses, setDbClasses] = useState([]);
  const [classSubjectsMap, setClassSubjectsMap] = useState({});
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
    q10_selectedSubject: "", // ১০. বিষয় নির্বাচন করুন
    q10_teacherComment: "", // ১০. মতামত লিখুন
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
          setDbClasses(Array.isArray(result.classes) ? result.classes : []);
          setClassSubjectsMap(result.classSubjects || {});
        }
      } catch (err) {
        console.error("Failed to load syllabus classes/subjects:", err);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  // Available subjects for currently selected class (from DB syllabus)
  const availableSubjectsForClass = useMemo(() => {
    if (!formData.className) return [];
    return classSubjectsMap[formData.className] || [];
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
      q10_selectedSubject: "",
      q10_teacherComment: "",
    }));
  };

  // Handle Class Change in Q2
  const handleClassChange = (newClass) => {
    setFormData((prev) => ({
      ...prev,
      className: newClass,
      q10_selectedSubject: "",
      q10_teacherComment: "",
    }));
  };

  // Handle Q9 Checkboxes
  const handleCheckboxToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.q9_improvementAreas.includes(option);
      const next = exists
        ? prev.q9_improvementAreas.filter((item) => item !== option)
        : [...prev.q9_improvementAreas, option];
      return { ...prev, q9_improvementAreas: next };
    });
  };

  // Copy Shareable Form Link
  const handleCopyShareLink = async () => {
    try {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/parent-feedback`
          : "https://aimhabiganj.vercel.app/parent-feedback";
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

      const payload = {
        ...formData,
        q10_subjectFeedbacks:
          formData.q10_selectedSubject && formData.q10_teacherComment.trim()
            ? [
                {
                  subject: formData.q10_selectedSubject,
                  comment: formData.q10_teacherComment.trim(),
                },
              ]
            : [],
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
      q10_selectedSubject: "",
      q10_teacherComment: "",
      q11_suggestionsOrComplaints: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f9f6] via-white to-[#eef7f2] dark:from-[#010a06] dark:via-[#02150e] dark:to-[#010a06] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-bornomala">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Utility Bar: Back to Home & Shareable Copy Link Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00733a] dark:text-emerald-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-emerald-950/80 border border-emerald-700/25 dark:border-amber-400/35 text-xs sm:text-sm font-bold text-[#00733a] dark:text-amber-300 shadow-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/60 transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
                <span>লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#00733a] dark:text-amber-300" />
                <span>লিংক কপি করুন / Copy Form Link</span>
              </>
            )}
          </button>
        </div>

        {/* Official Institutional Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#022c1b] via-[#00733a] to-[#034429] text-white p-6 sm:p-10 shadow-xl border border-amber-400/30">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl" />

          <div className="relative z-10 text-center space-y-3">
            <p className="text-lg sm:text-2xl font-bold text-amber-300 tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-widest uppercase text-emerald-100 font-ubuntu">
              AS-SALAM IDEAL MADRASAH — AIM HABIGANJ
            </h2>

            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Annual Parents Feedback Form – 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white pt-1">
              বার্ষিক অভিভাবক মতামত ফরম – ২০২৬
            </h1>

            <div className="max-w-3xl mx-auto mt-4 pt-4 border-t border-white/15 text-xs sm:text-sm md:text-base text-emerald-50/95 leading-relaxed text-left bg-black/15 rounded-2xl p-4 sm:p-5">
              <p className="font-bold text-amber-300 mb-1.5">ভূমিকা:</p>
              <p>সম্মানিত অভিভাবক, আসসালামু আলাইকুম।</p>
              <p className="mt-1">
                ২০২৬ শিক্ষাবর্ষে আপনার সন্তানের শিক্ষা, নৈতিক ও চারিত্রিক উন্নয়ন এবং
                প্রতিষ্ঠানের সার্বিক কার্যক্রম সম্পর্কে আপনার মূল্যবান মতামত জানতে আমরা
                আগ্রহী। আপনার মতামত আগামী শিক্ষাবর্ষে প্রতিষ্ঠানের শিক্ষার মানোন্নয়নে
                গুরুত্বপূর্ণ ভূমিকা রাখবে।
              </p>
              <p className="mt-1 font-semibold text-amber-200">
                আপনার মূল্যবান সময় ও সহযোগিতার জন্য আন্তরিক ধন্যবাদ।
              </p>
            </div>
          </div>
        </div>

        {/* Post-Submission Thank You Screen */}
        {isSubmitted ? (
          <div className="bg-white dark:bg-[#041e14] rounded-3xl p-8 sm:p-12 border border-emerald-600/25 dark:border-amber-400/30 shadow-lg text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#00733a] dark:text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              আপনাকে আন্তরিক ধন্যবাদ।
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/85 max-w-xl mx-auto leading-relaxed">
              আপনার মূল্যবান মতামত আমাদের আগামী দিনের পথচলাকে আরও সুন্দর, সমৃদ্ধ ও
              কার্যকর করতে সহায়তা করবে।
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-2.5 rounded-xl bg-[#00733a] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                অন্য সন্তানের জন্য মতামত দিন
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-emerald-950/60 transition-all"
              >
                হোমপেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Controlled Student Lookup Card (Auto-fills Name, Class & Class Subjects from DB) */}
            <div className="bg-white dark:bg-[#041e14] rounded-3xl p-5 sm:p-7 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00733a] dark:text-amber-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <UserCheck className="w-3.5 h-3.5" />
                    দ্রুত তথ্য পূরণ (ঐচ্ছিক)
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-2">
                    শিক্ষার্থীর আইডি / রোল অথবা নাম দিয়ে খুঁজুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-200/70 mt-0.5">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStudentLookup}
                  disabled={searchingStudent}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#00733a] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-60 shrink-0"
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
                  <p className="text-xs font-bold text-emerald-800 dark:text-amber-300">
                    নিচের তালিকা থেকে আপনার সন্তানকে নির্বাচন করুন:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {matchedStudents.map((st) => (
                      <button
                        key={st._id}
                        type="button"
                        onClick={() => applyStudentSelection(st)}
                        className="text-left p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {st.studentName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-emerald-200/70">
                            শ্রেণি: <strong>{st.className || "—"}</strong> • আইডি:{" "}
                            {st.studentId || "—"} • রোল: {st.roll || "—"}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#00733a] dark:text-amber-300 px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-700 shrink-0">
                          নির্বাচন করুন
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Student Confirmation Banner */}
              {selectedStudentRecord && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-[#00733a] dark:text-amber-400 shrink-0" />
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
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    পরিবর্তন করুন
                  </button>
                </div>
              )}
            </div>

            {/* Main 11-Question Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Questions 1 & 2: Student Name & Student Class */}
              <div className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-8 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Question 1 */}
                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a]"
                    />
                  </div>

                  {/* Question 2 */}
                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2">
                      ২. শিক্ষার্থীর শ্রেণি <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.className}
                      onChange={(e) => handleClassChange(e.target.value)}
                      disabled={loadingMeta}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a]"
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
                  className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-7 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-4"
                >
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {q.number}. {q.label} <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {q.options.map((opt) => {
                      const isSelected = formData[q.id] === opt;
                      return (
                        <label
                          key={opt}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          className={`cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all select-none ${
                            isSelected
                              ? "bg-[#00733a] text-white border-[#00733a] shadow-md"
                              : "bg-slate-50 dark:bg-[#02130c] text-slate-700 dark:text-emerald-100 border-slate-200 dark:border-emerald-800/50 hover:border-emerald-500/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={isSelected}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, [q.id]: opt }))
                            }
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? "border-white bg-white text-[#00733a]"
                                : "border-slate-400 dark:border-emerald-600"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#00733a]" />
                            )}
                          </span>
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Question 9: Checkboxes (Multiple Selection) */}
              <div className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-7 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    ৯. আগামী শিক্ষাবর্ষে প্রতিষ্ঠানের কোন বিষয়গুলোর উন্নয়ন বেশি
                    প্রয়োজন বলে মনে করেন?
                  </label>
                  <p className="text-xs text-emerald-700 dark:text-amber-300/90 font-semibold mt-1">
                    (একাধিক নির্বাচন করা যাবে)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Q9_IMPROVEMENT_OPTIONS.map((option) => {
                    const isChecked =
                      formData.q9_improvementAreas.includes(option);
                    return (
                      <label
                        key={option}
                        onClick={() => handleCheckboxToggle(option)}
                        className={`cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all select-none ${
                          isChecked
                            ? "bg-emerald-50 dark:bg-emerald-900/50 text-[#00733a] dark:text-amber-300 border-[#00733a] dark:border-amber-400/60 shadow-xs"
                            : "bg-slate-50 dark:bg-[#02130c] text-slate-700 dark:text-emerald-100 border-slate-200 dark:border-emerald-800/50 hover:border-emerald-500/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                            isChecked
                              ? "bg-[#00733a] border-[#00733a] text-white"
                              : "border-slate-400 dark:border-emerald-600 bg-white dark:bg-transparent"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </span>
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Question 10: Subject-Wise Teacher Comment (Optional, Dynamic DB Subjects, NO Teacher Names) */}
              <div className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-7 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#00733a] dark:text-amber-300 shrink-0" />
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    ১০. বিষয়ভিত্তিক শিক্ষক সম্পর্কে আপনার মতামত (ঐচ্ছিক)
                  </label>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-emerald-200 mb-2">
                    বিষয় নির্বাচন করুন:
                  </label>
                  <select
                    value={formData.q10_selectedSubject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        q10_selectedSubject: e.target.value,
                      }))
                    }
                    disabled={!formData.className}
                    className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a] disabled:opacity-60"
                  >
                    <option value="">
                      {!formData.className
                        ? "-- প্রথমে ২ নং প্রশ্নে শ্রেণি নির্বাচন করুন --"
                        : "-- বিষয় নির্বাচন করুন --"}
                    </option>
                    {availableSubjectsForClass.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reveal comment textarea when a subject is selected */}
                {formData.q10_selectedSubject && (
                  <div className="pt-2 space-y-2 transition-all">
                    <label className="block text-xs sm:text-sm font-bold text-[#00733a] dark:text-amber-300">
                      মতামত লিখুন ({formData.q10_selectedSubject}):
                    </label>
                    <textarea
                      rows={4}
                      value={formData.q10_teacherComment}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          q10_teacherComment: e.target.value,
                        }))
                      }
                      placeholder={`${formData.q10_selectedSubject} বিষয়ের পাঠদান ও শিক্ষক সম্পর্কে আপনার মূল্যবান মতামত লিখুন...`}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a]"
                    />
                  </div>
                )}
              </div>

              {/* Question 11: Overall Suggestions, Complaints or Expectations */}
              <div className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-7 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00733a] dark:text-amber-300 shrink-0" />
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
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
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-[#02130c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00733a]"
                />
              </div>

              {/* Footer Message & Submit Button */}
              <div className="bg-white dark:bg-[#041e14] rounded-3xl p-6 sm:p-8 border border-emerald-800/15 dark:border-emerald-800/40 shadow-sm space-y-5 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60">
                  <p className="text-sm sm:text-base font-extrabold text-[#00733a] dark:text-amber-300">
                    আপনাকে আন্তরিক ধন্যবাদ।
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/85 mt-1">
                    আপনার মূল্যবান মতামত আমাদের আগামী দিনের পথচলাকে আরও সুন্দর,
                    সমৃদ্ধ ও কার্যকর করতে সহায়তা করবে।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-2xl bg-[#00733a] hover:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60 active:scale-95"
                >
                  <Send className="w-4 h-4 text-amber-300" />
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
