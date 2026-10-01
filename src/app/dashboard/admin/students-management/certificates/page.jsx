"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import Pagination from "@/components/dashboard/Pagination";
import {
  Award,
  Search,
  Printer,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  FileText,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  ChevronRight,
  BookOpen,
  Compass,
  Building,
  RotateCcw,
  Check,
  AlertCircle,
  FileCheck,
} from "lucide-react";

// Certificate Types Definitions
const CERTIFICATE_TYPES = [
  {
    id: "character",
    name: "চারিত্রিক সনদপত্র (Character Certificate)",
    badge: "চারিত্রিক সনদ",
    color: "from-emerald-700 to-teal-800",
    defaultNote:
      "আমার জানামতে সে সৎ, বিনয়ী, চরিত্রবান এবং নিয়মিত শিক্ষার্থী। অত্র প্রতিষ্ঠানে অধ্যয়নকালীন সময়ে সে মাদরাসার সকল নিয়মকানুন নিষ্ঠার সাথে পালন করেছে এবং কোনো প্রকার শৃঙ্খলাবিরোধী কাজে জড়িত ছিল না।",
  },
  {
    id: "testimonial",
    name: "প্রশংসাপত্র (Testimonial / Appreciation)",
    badge: "প্রশংসাপত্র",
    color: "from-teal-700 to-cyan-800",
    defaultNote:
      "অত্র প্রতিষ্ঠানে অধ্যয়নকালে তাহার পাঠোন্নতি, স্বভাব-চরিত্র, শৃঙ্খলাবোধ এবং শিষ্টাচার অত্যন্ত প্রশংসনীয় ও সন্তোষজনক ছিল। সে সহপাঠী ও শিক্ষকদের প্রতি অত্যন্ত শ্রদ্ধাশীল।",
  },
  {
    id: "transfer",
    name: "ছাড়পত্র / টিসি (Transfer Certificate)",
    badge: "ছাড়পত্র (TC)",
    color: "from-amber-700 to-orange-800",
    defaultNote:
      "অভিভাবকের ইচ্ছানুযায়ী ও সম্মতিতে শিক্ষার্থীকে অত্র মাদরাসা হইতে ছাড়পত্র প্রদান করা হইল। অত্র প্রতিষ্ঠান বরাবর তাহার যাবতীয় প্রদেয় পাওনাদি পরিশোধিত রহিয়াছে। তাহার পূর্ববর্তী আচরণ সন্তোষজনক ছিল।",
  },
  {
    id: "hifz",
    name: "হিফজুল কুরআন সনদ (Hifz Completion)",
    badge: "হিফজ সমাপন",
    color: "from-emerald-800 to-green-950",
    defaultNote:
      "আল্লাহ তাআলার অশেষ মেহেরবানিতে অত্র মাদরাসার হিফজুল কুরআন বিভাগ হইতে পবিত্র কালামুল্লাহিল কারীম সম্পূর্ণ হিফজ (মুখস্থ) সম্পন্ন করিয়াছে। মাশাআল্লাহ তাহার তাজবিদ ও কুরআন তিলাওয়াত প্রশংসনীয়।",
  },
  {
    id: "merit",
    name: "মেধা ও কৃতিত্ব সনদ (Academic Merit)",
    badge: "কৃতিত্ব সনদ",
    color: "from-blue-700 to-indigo-800",
    defaultNote:
      "বার্ষিক মেধা মূল্যায়ন ও একাডেমিক কার্যক্রমে অনন্য সাধারণ মেধার স্বাক্ষর রাখায় শিক্ষার্থীকে এই সম্মানসূচক কৃতিত্ব সনদ প্রদান করা হইল।",
  },
];

function CertificatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL pagination params
  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);

  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const currentLimit = [10, 20, 50, 100].includes(limitParam) ? limitParam : 20;

  // Student fetching states
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Filters (Category filter EXCLUDED as per instructions)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
  const [selectedAcademyType, setSelectedAcademyType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Certificate Customization State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certType, setCertType] = useState("character");
  const [issueDate, setIssueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [refNumber, setRefNumber] = useState("");
  const [customRemarks, setCustomRemarks] = useState("");
  const [certificateOrientation, setCertificateOrientation] = useState("landscape"); // landscape | portrait
  const [mobileActiveTab, setMobileActiveTab] = useState("list"); // 'list' | 'preview'

  const certificateRef = useRef(null);

  // Update URL params
  const updatePaginationParams = useCallback(
    (newPage, newLimit) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      params.set("limit", String(newLimit || currentLimit));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, currentLimit, pathname, router]
  );

  const resetPageToFirst = useCallback(() => {
    if (currentPage !== 1) {
      updatePaginationParams(1, currentLimit);
    }
  }, [currentPage, currentLimit, updatePaginationParams]);

  // Fetch Students API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        status: "Approved",
        activity: "active",
        page: String(currentPage),
        limit: String(currentLimit),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedSession !== "all") params.append("sessionYear", selectedSession);
      if (selectedDivision !== "all") params.append("division", selectedDivision);
      if (selectedAcademyType !== "all") params.append("academyType", selectedAcademyType);
      if (selectedClass !== "all") params.append("class", selectedClass);
      if (selectedType !== "all") params.append("type", selectedType);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`
      );
      const result = await response.json();

      if (result.success || result.data) {
        const studentList = result.data || [];
        setStudents(studentList);
        setTotalPages(result.totalPages || 1);
        setTotalStudents(result.total !== undefined ? result.total : result.totalCount || 0);

        // Auto select first student if none selected or keep selected if exists in list
        if (studentList.length > 0) {
          setSelectedStudent((prev) => {
            if (!prev) return studentList[0];
            const found = studentList.find((s) => s._id === prev._id);
            return found || studentList[0];
          });
        } else {
          setSelectedStudent(null);
        }
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students for certificates:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    currentLimit,
    searchTerm,
    selectedSession,
    selectedDivision,
    selectedAcademyType,
    selectedClass,
    selectedType,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Update default reference number and note when student or certType changes
  useEffect(() => {
    if (selectedStudent) {
      const year = selectedStudent.sessionYear?.split(/[-–/]/)[0] || new Date().getFullYear();
      const stId = selectedStudent.studentId || selectedStudent.roll || "001";
      const certCode = certType.toUpperCase().slice(0, 3);
      setRefNumber(`AIM/${year}/${certCode}-${stId}`);

      const foundType = CERTIFICATE_TYPES.find((c) => c.id === certType);
      if (foundType) {
        setCustomRemarks(foundType.defaultNote);
      }
    }
  }, [selectedStudent, certType]);

  // Helper for academy classes
  const getAcademyClasses = (academyType) => {
    if (academyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
    if (academyType === "প্রাথমিক") return ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম"];
    if (academyType === "মাধ্যমিক") return ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
    if (academyType === "উচ্চমাধ্যমিক") return ["১১শ শ্রেণি", "১২শ শ্রেণি"];
    return [];
  };

  // Helper for dynamic class options
  const getClassOptions = () => {
    if (selectedDivision === "preHifz") return ["কায়দা/আমপারা", "নাজেরা"];
    if (selectedDivision === "hifz") return ["সবক", "শুনানি"];
    if (selectedDivision === "academy") {
      if (selectedAcademyType !== "all") {
        return getAcademyClasses(selectedAcademyType);
      }
      return [
        "প্লে", "নার্সারি",
        "প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম",
        "ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম",
        "১১শ শ্রেণি", "১২শ শ্রেণি",
      ];
    }
    return [];
  };

  // Helper to extract student's active class & division
  const getStudentClassDetails = (student) => {
    if (!student) return { divisionName: "N/A", className: "N/A", type: "N/A" };
    if (student.divisionPreHifz?.active) {
      return {
        divisionName: "প্রি-হিফজ",
        className: student.divisionPreHifz.class || "N/A",
        type: student.divisionPreHifz.type || "N/A",
      };
    }
    if (student.divisionHifz?.active) {
      return {
        divisionName: "হিফজুল কুরআন",
        className: student.divisionHifz.class || "N/A",
        type: student.divisionHifz.type || "N/A",
      };
    }
    if (student.divisionAcademy?.active) {
      return {
        divisionName: "একাডেমিক",
        className: student.divisionAcademy.class || "N/A",
        type: student.divisionAcademy.type || "N/A",
      };
    }
    return {
      divisionName: "সাধারণ",
      className: student.officeUse?.recommendedClass || "N/A",
      type: "N/A",
    };
  };

  // Format Bangladesh Date string
  const formatBanglaDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedSession("all");
    setSelectedDivision("all");
    setSelectedAcademyType("all");
    setSelectedClass("all");
    setSelectedType("all");
    resetPageToFirst();
  };

  const sessionYears = [
    "২০২৬", "২০২৫", "২০২৪", "২০২৩", "২০২২", "২০২১", "২০২০", "২০১৯", "২০১৮"
  ];

  const currentClassDetails = selectedStudent ? getStudentClassDetails(selectedStudent) : null;
  const currentCertConfig = CERTIFICATE_TYPES.find((c) => c.id === certType) || CERTIFICATE_TYPES[0];

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* ---------------- CSS FOR PRINT MEDIA ---------------- */}
      <style jsx global>{`
        @media print {
          /* Hide all surrounding app chrome, navigation, headers, and buttons */
          body * {
            visibility: hidden !important;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Only the certificate container is made visible */
          .printable-certificate-wrapper,
          .printable-certificate-wrapper * {
            visibility: visible !important;
          }
          .printable-certificate-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: ${certificateOrientation === "landscape" ? "A4 landscape" : "A4 portrait"};
            margin: 8mm !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. Header Banner */}
      <div className="no-print bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              সনদপত্র ও প্রত্যয়ন ব্যবস্থাপনা
            </span>
            <span className="text-xs text-slate-400 font-medium">AIM Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            শিক্ষার্থী সনদপত্র ও প্রশংসাপত্র জেনারেটর
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            চারিত্রিক সনদপত্র, প্রশংসাপত্র, প্রত্যয়নপত্র ও ছাড়পত্র (TC) নির্বাচন, কাস্টমাইজ ও প্রিন্ট করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedStudent && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>সনদপত্র প্রিন্ট করুন</span>
            </button>
          )}

          <button
            onClick={fetchStudents}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Advanced Search & Filtering (Category filter EXCLUDED) */}
      <div className="no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            শিক্ষার্থী খুঁজুন এবং ফিল্টার করুন:
          </h2>
          {(searchTerm ||
            selectedSession !== "all" ||
            selectedDivision !== "all" ||
            selectedClass !== "all" ||
            selectedType !== "all") && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              ফিল্টার রিসেট
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষার্থীর নাম, আইডি, পিতার নাম বা রোল..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPageToFirst();
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 dark:text-white"
            />
          </div>

          {/* Academic Session */}
          <div>
            <select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল শিক্ষাবর্ষ (২০১৮ - ২০২৬)</option>
              {sessionYears.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedClass("all");
                setSelectedAcademyType("all");
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল বিভাগ</option>
              <option value="preHifz">প্রি-হিফজ</option>
              <option value="hifz">হিফজুল কুরআন</option>
              <option value="academy">একাডেমিক বিভাগ</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                resetPageToFirst();
              }}
              disabled={selectedDivision === "all"}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">
                {selectedDivision === "all" ? "প্রথমে বিভাগ নির্বাচন করুন" : "সকল শ্রেণি"}
              </option>
              {getClassOptions().map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Row for Type & Academy Level if active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {selectedDivision === "academy" && (
            <div>
              <select
                value={selectedAcademyType}
                onChange={(e) => {
                  setSelectedAcademyType(e.target.value);
                  setSelectedClass("all");
                  resetPageToFirst();
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
              >
                <option value="all">সকল একাডেমি লেভেল</option>
                <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
                <option value="প্রাথমিক">প্রাথমিক</option>
                <option value="মাধ্যমিক">মাধ্যমিক</option>
                <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
              </select>
            </div>
          )}

          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল আবাসন ধরন (আবাসিক/অনাবাসিক)</option>
              <option value="আবাসিক">আবাসিক</option>
              <option value="অনাবাসিক">অনাবাসিক</option>
              <option value="ডে-কেয়ার">ডে-কেয়ার</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Mobile View Switcher (List vs Preview) */}
      <div className="no-print lg:hidden flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setMobileActiveTab("list")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveTab === "list"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>শিক্ষার্থী তালিকা ({totalStudents})</span>
        </button>

        <button
          onClick={() => setMobileActiveTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveTab === "preview"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>সনদ প্রিভিউ {selectedStudent ? `(${selectedStudent.studentNameBangla || selectedStudent.studentNameEnglish || "১"})` : ""}</span>
        </button>
      </div>

      {/* 4. Dual Workspace Layout: Student Selector + Live Certificate Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Student Selection Table & Cards (lg:col-span-5) */}
        <div
          className={`no-print lg:col-span-5 space-y-4 ${
            mobileActiveTab !== "list" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                  শিক্ষার্থী নির্বাচন করুন
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                মোট {totalStudents} জন
              </span>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  শিক্ষার্থীদের তালিকা লোড হচ্ছে...
                </p>
              </div>
            ) : error ? (
              <div className="py-16 text-center text-rose-500 text-xs sm:text-sm px-4">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                {error}
              </div>
            ) : students.length === 0 ? (
              /* Empty State */
              <div className="py-16 text-center text-slate-400 text-xs sm:text-sm px-4 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p>কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।</p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              /* Students List */
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[640px] overflow-y-auto">
                {students.map((student) => {
                  const isSelected = selectedStudent?._id === student._id;
                  const details = getStudentClassDetails(student);

                  return (
                    <div
                      key={student._id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setMobileActiveTab("preview");
                      }}
                      className={`p-3.5 sm:p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Student Avatar / Photo */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 dark:border-emerald-800 overflow-hidden">
                          {student.studentImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={student.studentImage}
                              alt={student.studentNameBangla || student.studentNameEnglish}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (student.studentNameBangla || student.studentNameEnglish || "AIM").charAt(0)
                          )}
                        </div>

                        {/* Student Details */}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm truncate">
                            {student.studentNameBangla || student.studentNameEnglish || "নাম পাওয়া যায়নি"}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            আইডি: {student.studentId || "N/A"} • রোল: {student.roll || "N/A"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {details.className}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                              {details.divisionName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected ? (
                          <span className="p-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && students.length > 0 && (
              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalStudents}
                  limit={currentLimit}
                  limitOptions={[10, 20, 50]}
                  onPageChange={(newPage) => updatePaginationParams(newPage, currentLimit)}
                  onLimitChange={(newLimit) => updatePaginationParams(1, newLimit)}
                  itemName="শিক্ষার্থী"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Certificate Customizer & Elegant Certificate Preview (lg:col-span-7) */}
        <div
          className={`lg:col-span-7 space-y-5 ${
            mobileActiveTab !== "preview" ? "hidden lg:block" : ""
          }`}
        >
          {selectedStudent ? (
            <>
              {/* Certificate Control Toolbar */}
              <div className="no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
                      সনদ কাস্টমাইজেশন ও বিন্যাস
                    </h3>
                  </div>

                  {/* Print Orientation Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">লেআউট:</span>
                    <button
                      onClick={() => setCertificateOrientation("landscape")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        certificateOrientation === "landscape"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Landscape (ল্যান্ডস্কেপ)
                    </button>
                    <button
                      onClick={() => setCertificateOrientation("portrait")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        certificateOrientation === "portrait"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Portrait (পোর্ট্রেট)
                    </button>
                  </div>
                </div>

                {/* Certificate Type Selection Tabs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    সনদপত্রের ধরন নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CERTIFICATE_TYPES.map((type) => {
                      const isActive = certType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setCertType(type.id)}
                          className={`p-2.5 rounded-2xl text-left transition-all border ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:border-slate-300"
                          }`}
                        >
                          <p className="text-xs leading-snug">{type.badge}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Ref Number Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      স্মারক নং (Ref No):
                    </label>
                    <input
                      type="text"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 dark:text-white"
                      placeholder="AIM/2026/CRT-001"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      ইস্যুর তারিখ (Issue Date):
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 dark:text-white font-medium"
                    />
                  </div>
                </div>

                {/* Custom Note or Evaluation */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    সনদের বিশেষ মন্তব্য / বিবরণী:
                  </label>
                  <textarea
                    rows={2}
                    value={customRemarks}
                    onChange={(e) => setCustomRemarks(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 dark:text-white leading-relaxed resize-none"
                    placeholder="সনদের মূল বিবরণ বা মন্তব্য..."
                  />
                </div>
              </div>

              {/* ---------------- THE CERTIFICATE ITSELF (PREVIEW & PRINT) ---------------- */}
              <div className="overflow-x-auto pb-4">
                <div
                  ref={certificateRef}
                  className={`printable-certificate-wrapper bg-white text-slate-900 shadow-xl mx-auto relative rounded-sm p-6 sm:p-10 border-[6px] border-double border-emerald-900 transition-all ${
                    certificateOrientation === "landscape"
                      ? "min-w-[780px] max-w-[950px] aspect-[1.414/1]"
                      : "min-w-[650px] max-w-[780px] aspect-[1/1.414]"
                  }`}
                  style={{
                    backgroundImage:
                      "radial-gradient(#064e3b08 1px, transparent 1px), radial-gradient(#064e3b08 1px, #ffffff 1px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                >
                  {/* Decorative Corner Ornaments */}
                  <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-emerald-800 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-emerald-800 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-emerald-800 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-emerald-800 pointer-events-none" />

                  {/* Inner Golden Hairline Frame */}
                  <div className="border border-amber-600/40 p-5 sm:p-7 h-full flex flex-col justify-between relative z-10">
                    {/* Watermark Crest in Center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                      <div className="w-80 h-80 rounded-full border-8 border-emerald-950 flex items-center justify-center">
                        <span className="text-7xl font-black font-serif">AIM</span>
                      </div>
                    </div>

                    {/* TOP: Islamic Header, Madrasa Branding & Logos */}
                    <div className="text-center space-y-2">
                      {/* Bismillah Calligraphy */}
                      <p className="text-sm sm:text-base font-serif text-emerald-950 font-bold tracking-widest">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>

                      <div className="flex items-center justify-between gap-4 border-b-2 border-emerald-900/30 pb-3">
                        {/* Left: Madrasa Official Logo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/aimlogo1.png"
                            alt="AIM Madrasah"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Center: Madrasa Name & Titles */}
                        <div className="space-y-0.5 flex-1">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-950 tracking-tight font-serif">
                            আস-সালাম আইডিয়াল মাদরাসা
                          </h2>
                          <h3 className="text-xs sm:text-sm font-bold text-emerald-900 tracking-wider font-sans uppercase">
                            AS-SALAM IDEAL MADRASAH (AIM)
                          </h3>
                          <p className="text-[11px] text-slate-600 font-medium">
                            দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বিত বিদ্যাপীঠ
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            হবিগঞ্জ সদর / পূর্বাচল ক্যাম্পাস • গভ. রেজি নং: AIM-2024 • ফোন: +৮৮০১৭১০০০০০০০
                          </p>
                        </div>

                        {/* Right: Student Photo / QR Code */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center bg-slate-50 border border-emerald-200 rounded-lg p-1">
                          <QRCodeSVG
                            value={`https://aimpurbachal.com/verify-certificate?id=${selectedStudent.studentId || selectedStudent._id}&ref=${encodeURIComponent(refNumber)}`}
                            size={64}
                            level="M"
                          />
                        </div>
                      </div>

                      {/* Reference No & Date Line */}
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 pt-1">
                        <span className="font-mono">
                          স্মারক নং: <strong className="text-emerald-950">{refNumber}</strong>
                        </span>
                        <span>
                          তারিখ: <strong className="text-emerald-950">{formatBanglaDate(issueDate)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* MIDDLE: Certificate Title Banner & Formal Body */}
                    <div className="my-auto py-4 space-y-5 text-center">
                      {/* Certificate Heading Ribbon */}
                      <div className="inline-block relative">
                        <div className="px-6 sm:px-8 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-full shadow-md border-2 border-amber-400">
                          <h4 className="text-base sm:text-xl font-black tracking-wide font-serif">
                            {currentCertConfig.name.split("(")[0].trim()}
                          </h4>
                        </div>
                        <p className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mt-0.5">
                          {currentCertConfig.badge}
                        </p>
                      </div>

                      {/* Dynamic Certificate Text in Formal Bengali */}
                      <div className="text-justify sm:text-center text-xs sm:text-sm md:text-base leading-relaxed text-slate-800 space-y-3 font-serif px-2 sm:px-6">
                        <p>
                          এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,{" "}
                          <strong className="text-emerald-950 text-sm sm:text-base border-b border-emerald-950 font-bold px-1.5">
                            {selectedStudent.studentNameBangla || selectedStudent.studentNameEnglish}
                          </strong>
                          , পিতা:{" "}
                          <strong className="text-slate-900 font-bold px-1">
                            {selectedStudent.fatherNameBangla || selectedStudent.fatherNameEnglish || "—"}
                          </strong>
                          , মাতা:{" "}
                          <strong className="text-slate-900 font-bold px-1">
                            {selectedStudent.motherNameBangla || selectedStudent.motherNameEnglish || "—"}
                          </strong>
                          , ঠিকানা:{" "}
                          <span className="text-slate-800">
                            {selectedStudent.permanentAddress?.village || selectedStudent.currentAddress?.village || "গ্রাম/মহল্লা"}
                            , ডাকঘর: {selectedStudent.permanentAddress?.postOffice || selectedStudent.currentAddress?.postOffice || "—"}
                            , উপজেলা/থানা: {selectedStudent.permanentAddress?.thana || selectedStudent.currentAddress?.thana || "—"}
                            , জেলা: {selectedStudent.permanentAddress?.district || selectedStudent.currentAddress?.district || "—"}।
                          </span>
                        </p>

                        <p>
                          সে অত্র মাদরাসার{" "}
                          <strong className="text-emerald-900 font-bold">
                            {currentClassDetails?.divisionName}
                          </strong>{" "}
                          বিভাগের{" "}
                          <strong className="text-emerald-900 font-bold">
                            {currentClassDetails?.className}
                          </strong>{" "}
                          শ্রেণির একজন নিয়মিত শিক্ষার্থী ছিল/আছে। তাহার শ্রেণি রোল নম্বর{" "}
                          <strong className="font-mono text-emerald-950 font-bold px-1">
                            {selectedStudent.roll || "—"}
                          </strong>
                          , শিক্ষার্থী আইডি:{" "}
                          <strong className="font-mono text-emerald-950 font-bold px-1">
                            {selectedStudent.studentId || "—"}
                          </strong>{" "}
                          এবং শিক্ষাবর্ষ:{" "}
                          <strong className="font-bold text-slate-900 px-1">
                            {selectedStudent.sessionYear || "২০২৬"}
                          </strong>
                          ।
                        </p>

                        <p className="italic text-slate-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                          &quot;{customRemarks}&quot;
                        </p>

                        <p className="font-medium text-slate-700 pt-1">
                          আমি তাহার ইহকালীন শান্তি, পরকালীন মুক্তি এবং জীবনের সর্বাঙ্গীন উন্নতি ও উজ্জ্বল ভবিষ্যৎ কামনা করি।
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM: Signatures & Official Seals */}
                    <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-center text-xs font-semibold text-slate-800">
                      {/* Left: Prepared By / Class Teacher */}
                      <div className="space-y-1">
                        <div className="w-32 sm:w-40 border-b border-slate-800 mx-auto" />
                        <p className="font-bold text-slate-800">যাচাইকারী / শ্রেণি শিক্ষক</p>
                        <p className="text-[10px] text-slate-500 font-medium">AIM একাডেমিক শাখা</p>
                      </div>

                      {/* Center: Official Seal / Stamp */}
                      <div className="hidden sm:flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-900/50 flex items-center justify-center text-[10px] text-emerald-950 font-black tracking-widest text-center uppercase p-1">
                          মাদরাসা সিলমোহর
                        </div>
                      </div>

                      {/* Right: Principal / Muhtamim Signature */}
                      <div className="space-y-1">
                        <div className="h-10 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/principle's_signature.jpg"
                            alt="Principal Signature"
                            className="max-h-9 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="w-36 sm:w-44 border-b border-slate-800 mx-auto" />
                        <p className="font-bold text-emerald-950">অধ্যক্ষ / মুহতামিম</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          আস-সালাম আইডিয়াল মাদরাসা (AIM)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty Selection State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-900/10 dark:border-slate-800 p-12 text-center space-y-4">
              <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                কোনো শিক্ষার্থী নির্বাচন করা হয়নি
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                বাম পাশের তালিকা থেকে যেকোনো একজন শিক্ষার্থীকে ক্লিক করে নির্বাচন করুন। তৎক্ষণাৎ তার জন্য
                স্বয়ংক্রিয়ভাবে চারিত্রিক সনদপত্র, প্রশংসাপত্র বা ছাড়পত্র তৈরি হবে।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentCertificatesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">সনদপত্র পোর্টাল লোড হচ্ছে...</p>
        </div>
      }
    >
      <CertificatesContent />
    </Suspense>
  );
}
