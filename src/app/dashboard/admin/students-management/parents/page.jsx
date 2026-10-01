"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Users,
  Phone,
  MapPin,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layers,
  Home,
  BookOpen,
  X,
  PhoneCall,
  User,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";

// Dynamic import of PDF print & download button (SSR disabled to ensure clean client-side canvas/pdf generation)
const ParentsPrintButton = dynamic(
  () => import("@/components/dashboard/students/parents/ParentsPrintButton"),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-400 flex items-center gap-1.5 animate-pulse">
        <span>PDF লোড হচ্ছে...</span>
      </div>
    ),
  }
);

// Standard class ordering for Madrasah
const CLASS_ORDER = [
  "প্লে",
  "নার্সারি",
  "প্রথম",
  "দ্বিতীয়",
  "তৃতীয়",
  "চতুর্থ",
  "পঞ্চম",
  "ষষ্ঠ",
  "সপ্তম",
  "অষ্টম",
  "নবম",
  "দশম",
  "১১শ শ্রেণি",
  "১২শ শ্রেণি",
  "কায়দা/আমপারা",
  "নাজেরা",
  "সবক",
  "শুনানি",
];

function ParentsContent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedClassFilter, setSelectedClassFilter] = useState("all");

  // Accordion Expand/Collapse Map
  const [expandedClasses, setExpandedClasses] = useState({});
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Fetch approved active students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        status: "Approved",
        activity: "active",
        limit: "1000",
      });

      if (selectedSession !== "all") params.append("sessionYear", selectedSession);
      if (selectedDivision !== "all") params.append("division", selectedDivision);
      if (selectedClassFilter !== "all") params.append("class", selectedClassFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`
      );
      const result = await res.json();

      if (result.success || result.data) {
        const list = result.data || [];
        setStudents(list);

        const initialExpanded = {};
        list.forEach((s) => {
          const cls = getStudentClassName(s);
          initialExpanded[cls] = true;
        });
        setExpandedClasses(initialExpanded);
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching parents data:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [selectedSession, selectedDivision, selectedClassFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Helper: extract class name
  const getStudentClassName = (student) => {
    if (!student) return "অনির্ধারিত";
    if (student.divisionAcademy?.active && student.divisionAcademy.class) {
      return student.divisionAcademy.class;
    }
    if (student.divisionPreHifz?.active && student.divisionPreHifz.class) {
      return student.divisionPreHifz.class;
    }
    if (student.divisionHifz?.active && student.divisionHifz.class) {
      return student.divisionHifz.class;
    }
    if (student.officeUse?.recommendedClass) {
      return student.officeUse.recommendedClass;
    }
    return "অন্যান্য / অনির্ধারিত";
  };

  // Helper: extract division name
  const getStudentDivisionName = (student) => {
    if (!student) return "সাধারণ";
    if (student.divisionAcademy?.active) {
      return student.divisionAcademy.academyType
        ? `একাডেমিক (${student.divisionAcademy.academyType})`
        : "একাডেমিক বিভাগ";
    }
    if (student.divisionPreHifz?.active) return "প্রি-হিফজ বিভাগ";
    if (student.divisionHifz?.active) return "হিফজুল কুরআন বিভাগ";
    return "সাধারণ";
  };

  // Roll number numeric parser
  const parseRollNumber = (r) => {
    if (!r || r === "N/A") return Infinity;
    const bnToEn = {
      "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
      "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    };
    const enStr = String(r)
      .split("")
      .map((char) => bnToEn[char] || char)
      .join("");
    const num = parseInt(enStr, 10);
    return isNaN(num) ? Infinity : num;
  };

  // Search filtering
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.trim().toLowerCase();

    return students.filter((s) => {
      const sNameBn = (s.studentNameBangla || "").toLowerCase();
      const sNameEn = (s.studentNameEnglish || "").toLowerCase();
      const sId = (s.studentId || "").toLowerCase();
      const fName = (s.fatherNameBangla || s.fatherNameEnglish || "").toLowerCase();
      const fPhone = (s.fatherMobile || "").toLowerCase();
      const fProfession = (s.fatherProfession || "").toLowerCase();
      const mName = (s.motherNameBangla || s.motherNameEnglish || "").toLowerCase();
      const mPhone = (s.motherMobile || "").toLowerCase();
      const gName = (s.guardianNameAbsentParents || "").toLowerCase();
      const gPhone = (s.guardianMobile || "").toLowerCase();
      const district = (
        s.permanentAddress?.district ||
        s.currentAddress?.district ||
        ""
      ).toLowerCase();
      const village = (
        s.permanentAddress?.village ||
        s.currentAddress?.village ||
        ""
      ).toLowerCase();

      return (
        sNameBn.includes(q) ||
        sNameEn.includes(q) ||
        sId.includes(q) ||
        fName.includes(q) ||
        fPhone.includes(q) ||
        fProfession.includes(q) ||
        mName.includes(q) ||
        mPhone.includes(q) ||
        gName.includes(q) ||
        gPhone.includes(q) ||
        district.includes(q) ||
        village.includes(q)
      );
    });
  }, [students, searchTerm]);

  // Group by Class
  const classGroups = useMemo(() => {
    const groups = {};

    filteredStudents.forEach((student) => {
      const cls = getStudentClassName(student);
      if (!groups[cls]) {
        groups[cls] = {
          className: cls,
          divisionName: getStudentDivisionName(student),
          students: [],
        };
      }
      groups[cls].students.push(student);
    });

    Object.values(groups).forEach((group) => {
      group.students.sort((a, b) => {
        const diff = parseRollNumber(a.roll) - parseRollNumber(b.roll);
        if (diff !== 0) return diff;
        return String(a.studentId || "").localeCompare(String(b.studentId || ""), undefined, { numeric: true });
      });
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const idxA = CLASS_ORDER.indexOf(a);
      const idxB = CLASS_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b, "bn");
    });

    return sortedKeys.map((key) => groups[key]);
  }, [filteredStudents]);

  // Key metrics
  const metrics = useMemo(() => {
    let totalContacts = 0;
    filteredStudents.forEach((s) => {
      if (s.fatherMobile || s.motherMobile || s.guardianMobile) {
        totalContacts++;
      }
    });

    return {
      totalStudents: filteredStudents.length,
      totalClasses: classGroups.length,
      withContacts: totalContacts,
    };
  }, [filteredStudents, classGroups]);

  const toggleClass = (className) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  const handleExpandAll = () => {
    const next = {};
    classGroups.forEach((g) => {
      next[g.className] = true;
    });
    setExpandedClasses(next);
  };

  const handleCollapseAll = () => {
    setExpandedClasses({});
  };

  const formatAddress = (addr) => {
    if (!addr) return "তথ্য নেই";
    const parts = [addr.village, addr.postOffice, addr.thana, addr.district].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "তথ্য নেই";
  };

  const sessionYears = [
    "২০২৬", "২০২৫", "২০২৪", "২০২৩", "২০২২", "২০২১", "২০২০", "২০১৯", "২০১৮"
  ];

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* ---------------- PRINT MEDIA CSS OVERRIDES ---------------- */}
      <style jsx global>{`
        @media print {
          /* 1. Hide UI controls, inputs, search, buttons, sidebars, modals */
          .no-print,
          nav,
          header,
          aside,
          button,
          input,
          select {
            display: none !important;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 5mm !important;
            font-size: 10pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* 2. Print Header branding visible */
          .print-header {
            display: block !important;
            margin-bottom: 12px !important;
            text-align: center !important;
          }
          /* 3. Ensure tables break cleanly */
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* 1. Header Banner (with PDF / Print Toolbar) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              অভিভাবক ডাটাবেজ ও যোগাযোগ পোর্টাল
            </span>
            <span className="text-xs text-slate-400 font-medium">AIM Parents Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            অভিভাবকের তথ্য ও যোগাযোগ ব্যবস্থাপনা
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            শ্রেণিভিত্তিক সকল শিক্ষার্থীর পিতা, মাতা, অভিভাবকের পেশা, মোবাইল নম্বর, জরুরি যোগাযোগ এবং পূর্ণাঙ্গ ঠিকানা।
          </p>
        </div>

        {/* Toolbar: Dedicated React-PDF Print & Download Trigger */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <ParentsPrintButton
            classGroups={classGroups}
            sessionYear={selectedSession === "all" ? "সকল শিক্ষাবর্ষ" : selectedSession}
            disabled={loading || classGroups.length === 0}
          />

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

      {/* 2. Metric Overview Cards */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              মোট শিক্ষার্থী সংখ্যা
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.totalStudents} জন
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ডাটাবেসে তালিকাভুক্ত
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              সক্রিয় শ্রেণি সংখ্যা
            </p>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {metrics.totalClasses} টি শ্রেণি
            </h3>
            <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 font-medium">
              শ্রেণিভিত্তিক বিন্যস্ত
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              যোগাযোগ নম্বর সমৃদ্ধ পরিবার
            </p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {metrics.withContacts} টি পরিবার
            </h3>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">
              সরাসরি কলযোগ্য
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search & Class Filters Bar (Excluded from Print) */}
      <div className="no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিক্ষার্থীর নাম, আইডি, পিতার নাম, মাতার নাম, ফোন নম্বর বা জেলা..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>সব খুলুন</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>সব বন্ধ করুন</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল শিক্ষাবর্ষ (Session)</option>
              {sessionYears.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedClassFilter("all");
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল বিভাগ (All Divisions)</option>
              <option value="preHifz">প্রি-হিফজ</option>
              <option value="hifz">হিফজুল কুরআন</option>
              <option value="academy">একাডেমিক</option>
            </select>
          </div>

          <div>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="all">সকল শ্রেণি (All Classes)</option>
              {CLASS_ORDER.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Class-wise Organized Data: Interactive Accordions & Tables */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-900/10 dark:border-slate-800 p-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            অভিভাবক ও শিক্ষার্থীর তথ্য লোড করা হচ্ছে...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-950 p-12 text-center text-rose-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-rose-400" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      ) : classGroups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-900/10 dark:border-slate-800 p-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-base">
            কোনো তথ্য পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            আপনার দেওয়া সার্চ বা ফিল্টারের সাথে কোনো শিক্ষার্থী অথবা অভিভাবকের তথ্য মেলেনি।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {classGroups.map((group) => {
            const isExpanded = !!expandedClasses[group.className];

            return (
              <div
                key={group.className}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Class Header */}
                <div
                  onClick={() => toggleClass(group.className)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 select-none transition-colors border-b border-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center text-base border border-emerald-200 dark:border-emerald-800">
                      {group.className.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          শ্রেণি: {group.className}
                        </h2>
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {group.divisionName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        মোট শিক্ষার্থী:{" "}
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {group.students.length} জন
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="no-print flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">
                      {isExpanded ? "সংকুচিত করুন" : "বিস্তারিত দেখুন"}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800">
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
                          <tr>
                            <th className="py-3 px-4 font-bold">শিক্ষার্থীর বিবরণ</th>
                            <th className="py-3 px-4 font-bold">পিতার তথ্য</th>
                            <th className="py-3 px-4 font-bold">মাতার তথ্য</th>
                            <th className="py-3 px-4 font-bold">অভিভাবক / জরুরি যোগাযোগ</th>
                            <th className="py-3 px-4 font-bold">ঠিকানা</th>
                            <th className="no-print py-3 px-4 font-bold text-center">একশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {group.students.map((student) => (
                            <tr
                              key={student._id}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                            >
                              {/* 1. Student Info Column */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 dark:border-emerald-800">
                                    {student.studentImage ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={student.studentImage}
                                        alt={student.studentNameBangla}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      (student.studentNameBangla || student.studentNameEnglish || "S").charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                                      {student.studentNameBangla || student.studentNameEnglish}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      আইডি: {student.studentId || "—"} • রোল: {student.roll || "—"}
                                    </p>
                                    {student.gender && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {student.gender}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 2. Father Info Column */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 dark:text-slate-200">
                                    {student.fatherNameBangla || student.fatherNameEnglish || "তথ্য নেই"}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 text-slate-400" />
                                    <span>{student.fatherProfession || "পেশা উল্লেখ নেই"}</span>
                                  </p>
                                  {student.fatherMobile ? (
                                    <div className="flex items-center gap-2 pt-0.5">
                                      <a
                                        href={`tel:${student.fatherMobile}`}
                                        className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-semibold hover:underline"
                                      >
                                        <Phone className="w-3 h-3" />
                                        <span>{student.fatherMobile}</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/88${student.fatherMobile.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="no-print text-emerald-500 hover:text-emerald-600"
                                        title="WhatsApp মেসেজ পাঠান"
                                      >
                                        <BsWhatsapp className="w-3 h-3" />
                                      </a>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">ফোন নম্বর নেই</span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Mother Info Column */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 dark:text-slate-200">
                                    {student.motherNameBangla || student.motherNameEnglish || "তথ্য নেই"}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 text-slate-400" />
                                    <span>{student.motherProfession || "গৃহিণী"}</span>
                                  </p>
                                  {student.motherMobile ? (
                                    <div className="flex items-center gap-2 pt-0.5">
                                      <a
                                        href={`tel:${student.motherMobile}`}
                                        className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-mono font-semibold hover:underline"
                                      >
                                        <Phone className="w-3 h-3" />
                                        <span>{student.motherMobile}</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/88${student.motherMobile.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="no-print text-emerald-500 hover:text-emerald-600"
                                        title="WhatsApp মেসেজ পাঠান"
                                      >
                                        <BsWhatsapp className="w-3 h-3" />
                                      </a>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">ফোন নম্বর নেই</span>
                                  )}
                                </div>
                              </td>

                              {/* 4. Guardian / Emergency Contact */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="space-y-0.5">
                                  {student.guardianNameAbsentParents ? (
                                    <>
                                      <p className="font-bold text-slate-800 dark:text-slate-200">
                                        {student.guardianNameAbsentParents}
                                      </p>
                                      <p className="text-[11px] text-slate-500">
                                        সম্পর্ক: {student.guardianRelation || "অভিভাবক"}
                                      </p>
                                      {student.guardianMobile && (
                                        <a
                                          href={`tel:${student.guardianMobile}`}
                                          className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-semibold hover:underline"
                                        >
                                          <Phone className="w-3 h-3" />
                                          <span>{student.guardianMobile}</span>
                                        </a>
                                      )}
                                    </>
                                  ) : student.referenceName ? (
                                    <>
                                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                                        রেফারেন্স: {student.referenceName}
                                      </p>
                                      {student.referenceMobile && (
                                        <a
                                          href={`tel:${student.referenceMobile}`}
                                          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-mono hover:underline"
                                        >
                                          <Phone className="w-3 h-3" />
                                          <span>{student.referenceMobile}</span>
                                        </a>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">
                                      অভিভাবক পিতা/মাতা স্বয়ং
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 5. Address Column */}
                              <td className="py-3.5 px-4 align-top max-w-[200px]">
                                <div className="space-y-1">
                                  <div className="flex items-start gap-1 text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                    <span>
                                      {formatAddress(student.permanentAddress || student.currentAddress)}
                                    </span>
                                  </div>
                                  {student.permanentAddress?.district && (
                                    <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      জেলা: {student.permanentAddress.district}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 6. Actions */}
                              <td className="no-print py-3.5 px-4 align-top text-center">
                                <button
                                  onClick={() => setSelectedStudentForModal(student)}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] transition-all whitespace-nowrap"
                                >
                                  পূর্ণ বিবরণ
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE & TABLET RESPONSIVE CARDS */}
                    <div className="lg:hidden p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.students.map((student) => (
                        <div
                          key={student._id}
                          className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs overflow-hidden">
                                {student.studentImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={student.studentImage}
                                    alt={student.studentNameBangla}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  (student.studentNameBangla || student.studentNameEnglish || "S").charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs">
                                  {student.studentNameBangla || student.studentNameEnglish}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  আইডি: {student.studentId || "—"} • রোল: {student.roll || "—"}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedStudentForModal(student)}
                              className="text-[11px] text-emerald-600 font-bold hover:underline"
                            >
                              বিস্তারিত
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] text-slate-400 font-semibold block">
                                পিতা:
                              </span>
                              <p className="font-bold text-slate-800 dark:text-white truncate">
                                {student.fatherNameBangla || student.fatherNameEnglish || "তথ্য নেই"}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {student.fatherProfession || "পেশা উল্লেখ নেই"}
                              </p>
                              {student.fatherMobile ? (
                                <a
                                  href={`tel:${student.fatherMobile}`}
                                  className="inline-flex items-center gap-1 text-emerald-600 font-mono text-[11px] font-bold"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{student.fatherMobile}</span>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400">নম্বর নেই</span>
                              )}
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] text-slate-400 font-semibold block">
                                মাতা:
                              </span>
                              <p className="font-bold text-slate-800 dark:text-white truncate">
                                {student.motherNameBangla || student.motherNameEnglish || "তথ্য নেই"}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {student.motherProfession || "গৃহিণী"}
                              </p>
                              {student.motherMobile ? (
                                <a
                                  href={`tel:${student.motherMobile}`}
                                  className="inline-flex items-center gap-1 text-teal-600 font-mono text-[11px] font-bold"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{student.motherMobile}</span>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400">নম্বর নেই</span>
                              )}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                              {formatAddress(student.permanentAddress || student.currentAddress)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Complete Admission Guardian Dossier Modal */}
      {selectedStudentForModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-lg text-emerald-200">
                  {selectedStudentForModal.studentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedStudentForModal.studentImage}
                      alt={selectedStudentForModal.studentNameBangla}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    (selectedStudentForModal.studentNameBangla || "AIM").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedStudentForModal.studentNameBangla || selectedStudentForModal.studentNameEnglish}
                  </h3>
                  <p className="text-xs text-emerald-200 font-mono">
                    আইডি: {selectedStudentForModal.studentId || "—"} • রোল: {selectedStudentForModal.roll || "—"} • শ্রেণি: {getStudentClassName(selectedStudentForModal)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  পিতার সম্পূর্ণ তথ্য
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">পিতার নাম (বাংলা):</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.fatherNameBangla || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">পিতার নাম (ইংরেজি):</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.fatherNameEnglish || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">পেশা:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.fatherProfession || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">মোবাইল নম্বর:</span>
                    {selectedStudentForModal.fatherMobile ? (
                      <a
                        href={`tel:${selectedStudentForModal.fatherMobile}`}
                        className="text-emerald-600 font-mono font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedStudentForModal.fatherMobile}</span>
                      </a>
                    ) : (
                      <strong className="text-slate-500">—</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">জাতীয় পরিচয়পত্র (NID):</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.fatherNid || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">ইমেইল:</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.fatherEmail || "—"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  মাতার সম্পূর্ণ তথ্য
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">মাতার নাম (বাংলা):</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.motherNameBangla || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">মাতার নাম (ইংরেজি):</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.motherNameEnglish || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">পেশা:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.motherProfession || "গৃহিণী"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">মোবাইল নম্বর:</span>
                    {selectedStudentForModal.motherMobile ? (
                      <a
                        href={`tel:${selectedStudentForModal.motherMobile}`}
                        className="text-teal-600 font-mono font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedStudentForModal.motherMobile}</span>
                      </a>
                    ) : (
                      <strong className="text-slate-500">—</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">জাতীয় পরিচয়পত্র (NID):</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.motherNid || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">ইমেইল:</span>
                    <strong className="text-slate-800 dark:text-white font-mono">
                      {selectedStudentForModal.motherEmail || "—"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  অভিভাবক (পিতা-মাতার অবর্তমানে) ও জরুরি রেফারেন্স
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">অভিভাবকের নাম:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.guardianNameAbsentParents || "পিতা/মাতা নিজেই অভিভাবক"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">সম্পর্ক:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.guardianRelation || "—"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">অভিভাবকের ফোন:</span>
                    {selectedStudentForModal.guardianMobile ? (
                      <a
                        href={`tel:${selectedStudentForModal.guardianMobile}`}
                        className="text-amber-600 font-mono font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedStudentForModal.guardianMobile}</span>
                      </a>
                    ) : (
                      <strong className="text-slate-500">—</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">রেফারেন্স যোগাযোগ:</span>
                    <strong className="text-slate-800 dark:text-white">
                      {selectedStudentForModal.referenceName || "—"}{" "}
                      {selectedStudentForModal.referenceMobile && `(${selectedStudentForModal.referenceMobile})`}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                  <Home className="w-4 h-4" />
                  ঠিকানা বিবরণী
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">স্থায়ী ঠিকানা:</span>
                    <p className="text-slate-800 dark:text-white font-medium leading-relaxed">
                      {formatAddress(selectedStudentForModal.permanentAddress)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">বর্তমান ঠিকানা:</span>
                    <p className="text-slate-800 dark:text-white font-medium leading-relaxed">
                      {formatAddress(selectedStudentForModal.currentAddress)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentsInformationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">অভিভাবক পোর্টাল লোড হচ্ছে...</p>
        </div>
      }
    >
      <ParentsContent />
    </Suspense>
  );
}
