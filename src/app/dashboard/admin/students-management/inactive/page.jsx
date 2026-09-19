"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Pagination from "@/components/dashboard/Pagination";

function InactiveStudentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL search params থেকে page এবং limit সিঙ্ক (ডিফল্ট limit: 20)
  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);

  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const currentLimit = [10, 20, 50, 100].includes(limitParam) ? limitParam : 20;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("all"); // "all", "active", "inactive", "temporary_inactive", "permanent_inactive"
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
  const [selectedAcademyType, setSelectedAcademyType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  // পেজিনেশন স্টেটসমূহ
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // URL query params আপডেট করার হেলপার ফাংশন
  const updatePaginationParams = useCallback(
    (newPage, newLimit) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      params.set("limit", String(newLimit || currentLimit));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, currentLimit, pathname, router]
  );

  // ফিল্টার পরিবর্তন হলে পেজ নম্বর ১-এ রিসেট করার হেলপার
  const resetPageToFirst = useCallback(() => {
    if (currentPage !== 1) {
      updatePaginationParams(1, currentLimit);
    }
  }, [currentPage, currentLimit, updatePaginationParams]);

  const fetchInactiveStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        status: "Approved",
        activity: selectedActivity,
        page: String(currentPage),
        limit: String(currentLimit),
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSession !== "all") params.append("sessionYear", selectedSession);
      if (selectedDivision !== "all") params.append("division", selectedDivision);
      if (selectedAcademyType !== "all") params.append("academyType", selectedAcademyType);
      if (selectedClass !== "all") params.append("class", selectedClass);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`);
      const result = await response.json();

      if (result.success || result.data) {
        setStudents(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalStudents(result.total !== undefined ? result.total : result.totalCount || 0);
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students in inactive management:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    currentLimit,
    searchTerm,
    selectedActivity,
    selectedSession,
    selectedDivision,
    selectedAcademyType,
    selectedClass,
  ]);

  // ডেটা ফেচ করার ইফেক্ট
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInactiveStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchInactiveStudents]);

  // স্টুডেন্টের অ্যাক্টিভিটি স্ট্যাটাস পরিবর্তনের ফাংশন
  const handleUpdateActivity = async (studentId, newActivity) => {
    try {
      setUpdatingId(studentId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students/${studentId}/activity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activity: newActivity }),
        }
      );

      const result = await response.json();

      if (result.success) {
        const labels = {
          active: "সক্রিয় (Active)",
          permanent_inactive: "স্থায়ী নিষ্ক্রিয় (Permanent Inactive)",
          temporary_inactive: "সাময়িক নিষ্ক্রিয় (Temporary Inactive)",
        };
        toast.success(`শিক্ষার্থীর স্ট্যাটাস '${labels[newActivity]}' হিসেবে আপডেট হয়েছে!`);

        // যদি active করা হয়, তবে নিষ্ক্রিয় তালিকা থেকে অবিলম্বে অপসারণ
        if (newActivity === "active") {
          setStudents((prev) =>
            prev.filter((s) => {
              const sId = s._id?.$oid || s._id;
              const sCode = s.studentId;
              return sId !== studentId && sCode !== studentId;
            })
          );
          setTotalStudents((prev) => Math.max(0, prev - 1));
        } else {
          // স্থানীয়ভাবে স্ট্যাটাস আপডেট
          setStudents((prev) =>
            prev.map((s) => {
              const sId = s._id?.$oid || s._id;
              const sCode = s.studentId;
              if (sId === studentId || sCode === studentId) {
                return { ...s, activity: newActivity };
              }
              return s;
            })
          );
        }
      } else {
        toast.error(result.message || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error updating student activity:", err);
      toast.error("সার্ভার সমস্যা! স্ট্যাটাস আপডেট করা যায়নি।");
    } finally {
      setUpdatingId(null);
    }
  };

  // একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
  const getAcademyClasses = (academyType) => {
    if (academyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
    if (academyType === "প্রাথমিক") return ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম"];
    if (academyType === "মাধ্যমিক") return ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
    if (academyType === "উচ্চমাধ্যমিক") return ["১১শ শ্রেণি", "১২শ শ্রেণি"];
    return [];
  };

  // বিভাগ অনুযায়ী ক্লাসের ড্রপডাউন অপশন ডায়নামিকভাবে তৈরি করা
  const getClassOptions = () => {
    if (selectedDivision === "preHifz") {
      return ["কায়দা/আমপারা", "নাজেরা"];
    }
    if (selectedDivision === "hifz") {
      return ["সবক", "শুনানি"];
    }
    if (selectedDivision === "academy") {
      if (selectedAcademyType !== "all") {
        return getAcademyClasses(selectedAcademyType);
      }
      return [
        "প্লে", "নার্সারি",
        "প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম",
        "ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম",
        "১১শ শ্রেণি", "১২শ শ্রেণি"
      ];
    }
    return [];
  };

  // শিক্ষার্থীর একটিভ বিভাগ, ক্লাস ও টাইপ বের করার হেলপার ফাংশন
  const getStudentClassDetails = (student) => {
    if (student.divisionPreHifz?.active) {
      return {
        divisionKey: "preHifz",
        divisionName: "প্রি-হিফজ",
        className: student.divisionPreHifz.class || "N/A",
        type: student.divisionPreHifz.type || "N/A",
      };
    }
    if (student.divisionHifz?.active) {
      return {
        divisionKey: "hifz",
        divisionName: "হিফজ",
        className: student.divisionHifz.class || "N/A",
        type: student.divisionHifz.type || "N/A",
      };
    }
    if (student.divisionAcademy?.active) {
      return {
        divisionKey: "academy",
        divisionName: "একাডেমিক",
        className: student.divisionAcademy.class || "N/A",
        type: student.divisionAcademy.type || "N/A",
      };
    }
    return {
      divisionKey: "none",
      divisionName: "অন্যান্য",
      className: student.officeUse?.recommendedClass || "N/A",
      type: "N/A",
    };
  };

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

  // রোল নম্বর অনুযায়ী ক্রমানুসারে (১, ২, ৩...) গাণিতিক সর্টিং
  const filteredStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const rollDiff = parseRollNumber(a.roll) - parseRollNumber(b.roll);
      if (rollDiff !== 0) return rollDiff;
      return String(a.studentId || "").localeCompare(String(b.studentId || ""), undefined, { numeric: true });
    });
  }, [students]);

  const sessionYears = [
    "২০২৬", "২০২৫", "২০২৪",
    "২০২৩", "২০২২", "২০২১",
    "২০২০", "২০১৯", "২০১৮"
  ];

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 min-h-screen space-y-5">

      {/* ১. পেজ হেডার */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-rose-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-950 tracking-tight flex items-center gap-2">
            <span>শিক্ষার্থী স্ট্যাটাস ও ঝরে পড়া ব্যবস্থাপনা</span>
          </h1>
          <p className="text-xs sm:text-sm text-rose-800/80 mt-0.5 font-medium">
            সকল শিক্ষার্থী এবং তাদের স্ট্যাটাস (সক্রিয় / সাময়িক / স্থায়ী নিষ্ক্রিয়) ব্যবস্থাপনা
          </p>
        </div>
        <div>
          <span className="inline-block px-3 py-1.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-200">
            মোট শিক্ষার্থী: {totalStudents} জন
          </span>
        </div>
      </div>

      {/* ২. সংক্ষিপ্ত স্ট্যাটস/পরিসংখ্যান */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-rose-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            👥
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">মোট শিক্ষার্থী</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800">{totalStudents} জন</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            ✅
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">সক্রিয় শিক্ষার্থী</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600">
              {students.filter((s) => s.activity === "active").length} জন
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            ⏳
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">সাময়িক নিষ্ক্রিয়</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600">
              {students.filter((s) => s.activity === "temporary_inactive").length} জন
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 text-red-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            🚫
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">স্থায়ী নিষ্ক্রিয়</p>
            <p className="text-xl sm:text-2xl font-black text-red-700">
              {students.filter((s) => s.activity === "permanent_inactive").length} জন
            </p>
          </div>
        </div>
      </div>

      {/* ৩. ফিল্টারিং সেকশন */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-900/10 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">খুঁজুন এবং ফিল্টার করুন:</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* নাম / আইডি / সার্চ */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="নাম, আইডি, পিতার নাম, মোবাইল বা জেলা..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPageToFirst();
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white transition-all"
            />
          </div>

          {/* অ্যাক্টিভিটি স্ট্যাটাস ফিল্টার */}
          <div>
            <select
              value={selectedActivity}
              onChange={(e) => {
                setSelectedActivity(e.target.value);
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-rose-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-bold text-rose-900"
            >
              <option value="all">সকল শিক্ষার্থী (সকল স্ট্যাটাস)</option>
              <option value="active">শুধুমাত্র সক্রিয় (Active)</option>
              <option value="inactive">সকল নিষ্ক্রিয় (Inactive)</option>
              <option value="temporary_inactive">সাময়িক নিষ্ক্রিয় (Temporary)</option>
              <option value="permanent_inactive">স্থায়ী নিষ্ক্রিয় (Permanent)</option>
            </select>
          </div>

          {/* সেশন বছর ফিল্টার */}
          <div>
            <select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল শিক্ষাবর্ষ</option>
              {sessionYears.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* বিভাগ ফিল্টার */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedClass("all");
                setSelectedAcademyType("all");
                resetPageToFirst();
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল বিভাগ</option>
              <option value="preHifz">প্রি-হিফজ</option>
              <option value="hifz">হিফজ</option>
              <option value="academy">একাডেমিক</option>
            </select>
          </div>

          {/* একাডেমি টাইপ ফিল্টার */}
          {selectedDivision === "academy" && (
            <div>
              <select
                value={selectedAcademyType}
                onChange={(e) => {
                  setSelectedAcademyType(e.target.value);
                  setSelectedClass("all");
                  resetPageToFirst();
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-medium text-slate-700"
              >
                <option value="all">সকল একাডেমি লেভেল</option>
                <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
                <option value="প্রাথমিক">প্রাথমিক</option>
                <option value="মাধ্যমিক">মাধ্যমিক</option>
                <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
              </select>
            </div>
          )}

          {/* শ্রেণি ফিল্টার */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                resetPageToFirst();
              }}
              disabled={selectedDivision === "all"}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 focus:bg-white font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">
                {selectedDivision === "all" ? "প্রথমে বিভাগ নির্বাচন করুন" : "সকল শ্রেণি"}
              </option>
              {getClassOptions().map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ৪. ডাটা টেবিল */}
      <div className="bg-white rounded-2xl border border-rose-900/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">নিষ্ক্রিয় শিক্ষার্থীদের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium space-y-3">
            <p className="text-sm">⚠️ {error}</p>
            <button
              onClick={fetchInactiveStudents}
              className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-2">
            <p className="text-3xl">👥</p>
            <p className="text-sm sm:text-base font-semibold">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-400">বর্তমান ফিল্টারে কোনো শিক্ষার্থী নেই।</p>
          </div>
        ) : (
          <div className="w-full">
            {/* ডেস্কটপ ও ট্যাবলেট ভিউ */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-rose-950 text-rose-100 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4">শিক্ষার্থী ও আইডি</th>
                    <th className="py-3.5 px-4">বিভাগ, শ্রেণি ও টাইপ</th>
                    <th className="py-3.5 px-4">পিতার নাম</th>
                    <th className="py-3.5 px-4">যোগাযোগ</th>
                    <th className="py-3.5 px-4">জেলা</th>
                    <th className="py-3.5 px-4 text-center">বর্তমান স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-center min-w-[280px]">স্ট্যাটাস পরিবর্তন অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredStudents.map((student) => {
                    const details = getStudentClassDetails(student);
                    const id = student._id?.$oid || student._id;
                    const studentId = student.studentId || id;
                    const isUpdating = updatingId === id || updatingId === student.studentId;

                    const primaryMethod = student.primaryContactMethod || "পিতা";
                    let contactNumber = student.fatherMobile || "N/A";
                    if (primaryMethod === "মাতা" && student.motherMobile) contactNumber = student.motherMobile;
                    if (primaryMethod === "অভিভাবক" && student.guardianMobile) contactNumber = student.guardianMobile;

                    const currentActivity = student.activity || "temporary_inactive";

                    return (
                      <tr key={id} className="hover:bg-rose-50/40 transition-colors duration-150">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-rose-200 text-xs">
                              {student.studentImage ? (
                                <img src={student.studentImage} alt={student.studentNameBangla} className="w-full h-full object-cover" />
                              ) : (
                                student.studentNameBangla?.charAt(0) || "S"
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{student.studentNameBangla || "নাম বিহীন"}</p>
                              <span className="text-[10px] text-rose-800 font-extrabold bg-rose-100 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                                ID: {student.studentId || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{details.className}</div>
                          <div className="text-[11px] text-slate-500">{details.divisionName} {details.type !== "N/A" && `(${details.type})`}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-800">{student.fatherNameBangla || "N/A"}</td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">📞 {contactNumber !== "0" ? contactNumber : "N/A"}</div>
                          <div className="text-[10px] text-slate-400">মাধ্যম: {primaryMethod}</div>
                        </td>

                        <td className="py-3 px-4 text-slate-600">{student.currentAddress?.district || student.permanentAddress?.district || "N/A"}</td>

                        <td className="py-3 px-4 text-center">
                          {currentActivity === "permanent_inactive" ? (
                            <span className="inline-block text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                              স্থায়ী নিষ্ক্রিয়
                            </span>
                          ) : currentActivity === "active" ? (
                            <span className="inline-block text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                              সক্রিয়
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                              সাময়িক নিষ্ক্রিয়
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* ১. Active বাটন */}
                            <button
                              onClick={() => handleUpdateActivity(studentId, "active")}
                              disabled={isUpdating || currentActivity === "active"}
                              title="শিক্ষার্থীকে পুনরায় সক্রিয় করুন"
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 flex items-center gap-1 ${
                                currentActivity === "active"
                                  ? "bg-emerald-800 text-white cursor-not-allowed opacity-80"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            >
                              <span>Active</span>
                            </button>

                            {/* ২. Permanent Inactive বাটন */}
                            <button
                              onClick={() => handleUpdateActivity(studentId, "permanent_inactive")}
                              disabled={isUpdating || currentActivity === "permanent_inactive"}
                              title="স্থায়ী নিষ্ক্রিয় হিসেবে চিহ্নিত করুন"
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 ${
                                currentActivity === "permanent_inactive"
                                  ? "bg-red-800 text-white cursor-not-allowed opacity-80"
                                  : "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
                              }`}
                            >
                              <span>Permanent Inactive</span>
                            </button>

                            {/* ৩. Temporary Inactive বাটন */}
                            <button
                              onClick={() => handleUpdateActivity(studentId, "temporary_inactive")}
                              disabled={isUpdating || currentActivity === "temporary_inactive"}
                              title="সাময়িক নিষ্ক্রিয় হিসেবে চিহ্নিত করুন"
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 ${
                                currentActivity === "temporary_inactive"
                                  ? "bg-amber-700 text-white cursor-not-allowed opacity-80"
                                  : "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300"
                              }`}
                            >
                              <span>Temporary Inactive</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* মোবাইল ভিউ */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredStudents.map((student) => {
                const details = getStudentClassDetails(student);
                const id = student._id?.$oid || student._id;
                const studentId = student.studentId || id;
                const isUpdating = updatingId === id || updatingId === student.studentId;

                const primaryMethod = student.primaryContactMethod || "পিতা";
                let contactNumber = student.fatherMobile || "N/A";
                if (primaryMethod === "মাতা" && student.motherMobile) contactNumber = student.motherMobile;
                if (primaryMethod === "অভিভাবক" && student.guardianMobile) contactNumber = student.guardianMobile;

                const currentActivity = student.activity || "temporary_inactive";

                return (
                  <div key={id} className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-rose-200 text-sm">
                          {student.studentImage ? (
                            <img src={student.studentImage} alt={student.studentNameBangla} className="w-full h-full object-cover" />
                          ) : (
                            student.studentNameBangla?.charAt(0) || "S"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{student.studentNameBangla || "নাম বিহীন"}</p>
                          <span className="text-[10px] text-rose-800 font-extrabold bg-rose-100 px-1.5 py-0.5 rounded-md inline-block">
                            ID: {student.studentId || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div>
                        {currentActivity === "permanent_inactive" ? (
                          <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                            স্থায়ী নিষ্ক্রিয়
                          </span>
                        ) : currentActivity === "active" ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                            সক্রিয়
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                            সাময়িক নিষ্ক্রিয়
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">শ্রেণি ও বিভাগ:</span>
                        <span className="font-bold text-slate-800">{details.className}</span>
                        <span className="text-[10px] text-slate-500 block">{details.divisionName} {details.type !== "N/A" && `(${details.type})`}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">পিতার নাম:</span>
                        <span className="font-semibold text-slate-800">{student.fatherNameBangla || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">যোগাযোগ ({primaryMethod}):</span>
                        <span className="font-semibold text-slate-800">📞 {contactNumber !== "0" ? contactNumber : "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">জেলা:</span>
                        <span className="text-slate-700 font-medium">{student.currentAddress?.district || student.permanentAddress?.district || "N/A"}</span>
                      </div>
                    </div>

                    {/* মোবাইল অ্যাকশন বাটনসমূহ */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleUpdateActivity(studentId, "active")}
                        disabled={isUpdating || currentActivity === "active"}
                        className={`px-2 py-1.5 text-[11px] font-bold rounded-lg text-center transition-all disabled:opacity-50 ${
                          currentActivity === "active"
                            ? "bg-emerald-800 text-white cursor-not-allowed opacity-80"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleUpdateActivity(studentId, "permanent_inactive")}
                        disabled={isUpdating || currentActivity === "permanent_inactive"}
                        className={`px-2 py-1.5 text-[11px] font-bold rounded-lg text-center transition-all disabled:opacity-50 ${
                          currentActivity === "permanent_inactive"
                            ? "bg-red-800 text-white cursor-not-allowed opacity-80"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        Permanent
                      </button>
                      <button
                        onClick={() => handleUpdateActivity(studentId, "temporary_inactive")}
                        disabled={isUpdating || currentActivity === "temporary_inactive"}
                        className={`px-2 py-1.5 text-[11px] font-bold rounded-lg text-center transition-all disabled:opacity-50 ${
                          currentActivity === "temporary_inactive"
                            ? "bg-amber-700 text-white cursor-not-allowed opacity-80"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        Temporary
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ৫. পেজিনেশন কন্ট্রোলস */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalStudents}
              limit={currentLimit}
              limitOptions={[10, 20, 50, 100]}
              onPageChange={(newPage) => updatePaginationParams(newPage, currentLimit)}
              onLimitChange={(newLimit) => updatePaginationParams(1, newLimit)}
              itemName="inactive students"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function InactiveStudentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">লোড হচ্ছে...</div>}>
      <InactiveStudentsContent />
    </Suspense>
  );
}
