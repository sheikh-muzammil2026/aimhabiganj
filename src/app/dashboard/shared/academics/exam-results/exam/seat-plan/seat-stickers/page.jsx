/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft, Loader2, Sparkles, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import StudentFilterBar from "@/components/dashboard/students/StudentFilterBar";
import SeatStickersPrintView, {
  SEAT_STICKERS_PAGE_STYLE,
  FALLBACK_AVATAR_DATA_URI,
  isValidImageUrl,
} from "@/components/dashboard/academics/SeatStickersPrintView";
import {
  getStudentClassDetails,
  compareStudentsByClassAndRoll,
  SESSION_YEARS,
  toBengaliDigits,
} from "@/lib/studentUtils";
import siteConfig from "@/config/siteConfig";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000"
).replace(/\/$/, "");

export default function SeatStickersGeneratorPage() {
  const printAreaRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // পরীক্ষার তথ্য স্টেট
  const [examName, setExamName] = useState("২য় সাময়িক পরীক্ষা");
  const [examList, setExamList] = useState([
    "১ম সাময়িক পরীক্ষা",
    "২য় সাময়িক পরীক্ষা",
    "বার্ষিক পরীক্ষা",
  ]);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState(
    siteConfig.academicSession?.currentBn ||
      siteConfig.academicSession?.currentEn ||
      "২০২৬"
  );
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedAcademyType, setSelectedAcademyType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedHall, setSelectedHall] = useState("all");
  const [seatAssignmentStatus, setSeatAssignmentStatus] = useState("all"); // 'all' | 'assigned' | 'unassigned'

  // ১. ব্যাকএন্ড থেকে পরীক্ষার তালিকা ফেচ করা
  useEffect(() => {
    let isMounted = true;
    const fetchExams = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admit-cards/exams`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setExamList(data.data);
          setExamName(data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching exams list:", err);
      }
    };
    fetchExams();
    return () => {
      isMounted = false;
    };
  }, []);

  // ২. সকল অনুমোদিত ও সক্রিয় শিক্ষার্থীর তথ্য ফেচ করা
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE_URL}/api/students?status=Approved&activity=active&limit=1000`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const data = res.ok ? await res.json() : null;

      if (data?.success && Array.isArray(data.data)) {
        // রোল এবং ক্লাস অনুযায়ী সর্ট করা
        const sorted = [...data.data].sort(compareStudentsByClassAndRoll);
        setStudents(sorted);
      } else {
        setStudents([]);
        setError(data?.message || "শিক্ষার্থীদের তথ্য পাওয়া যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students for seat stickers:", err);
      setError("সার্ভার থেকে শিক্ষার্থীদের তথ্য লোড করতে সমস্যা হয়েছে।");
      toast.error("শিক্ষার্থীদের তথ্য লোড করা যায়নি!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // ৩. শিক্ষার্থীদের থেকে ডায়নামিক হলের তালিকা তৈরি
  const availableHalls = useMemo(() => {
    const halls = new Set();
    students.forEach((s) => {
      const hall = s.seatPlan?.hallNo || s.hallNo;
      if (hall && String(hall).trim() !== "") {
        halls.add(String(hall).trim());
      }
    });
    return Array.from(halls).sort((a, b) => a.localeCompare(b, "bn"));
  }, [students]);

  // ৪. ফিল্টারিং লজিক
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const details = getStudentClassDetails(student);
        const currentSeat = student.seatPlan || {
          hallNo: student.hallNo || "",
          benchNo: student.benchNo || "",
          seatNo: student.seatNo || "",
        };

        const hasAssignedSeat = Boolean(
          (currentSeat.seatNo && String(currentSeat.seatNo).trim() !== "") ||
          (student.seatNo && String(student.seatNo).trim() !== "")
        );

        if (seatAssignmentStatus === "assigned" && !hasAssignedSeat) return false;
        if (seatAssignmentStatus === "unassigned" && hasAssignedSeat) return false;

        const studentYear = (student.sessionYear || "").split(/[-–/]/)[0].trim();
        const matchesSession =
          selectedSession === "all" || studentYear === selectedSession;
        const matchesDivision =
          selectedDivision === "all" || details.divisionKey === selectedDivision;
        const matchesAcademyType =
          selectedAcademyType === "all" || details.academyType === selectedAcademyType;
        const matchesClass =
          selectedClass === "all" || details.className === selectedClass;

        const hall = currentSeat.hallNo || student.hallNo || "";
        const matchesHall =
          selectedHall === "all" || String(hall).trim() === selectedHall;

        if (!matchesSession || !matchesDivision || !matchesAcademyType || !matchesClass || !matchesHall) {
          return false;
        }

        if (!searchTerm.trim()) return true;

        const q = searchTerm.toLowerCase();
        const nameBn = (student.studentNameBangla || "").toLowerCase();
        const nameEn = (student.studentNameEnglish || "").toLowerCase();
        const sId = String(student.studentId || "");
        const roll = String(student.roll || "");
        const seat = String(currentSeat.seatNo || student.seatNo || "");
        const hallName = String(hall).toLowerCase();

        return (
          nameBn.includes(q) ||
          nameEn.includes(q) ||
          sId.includes(q) ||
          roll.includes(q) ||
          seat.includes(q) ||
          hallName.includes(q)
        );
      })
      .sort(compareStudentsByClassAndRoll);
  }, [
    students,
    searchTerm,
    selectedSession,
    selectedDivision,
    selectedAcademyType,
    selectedClass,
    selectedHall,
    seatAssignmentStatus,
  ]);

  // ৫. সারাংশ পরিসংখ্যান
  const stats = useMemo(() => {
    let assignedCount = 0;
    filteredStudents.forEach((s) => {
      const seat = s.seatPlan?.seatNo || s.seatNo;
      if (seat && String(seat).trim() !== "") assignedCount++;
    });
    const unassignedCount = filteredStudents.length - assignedCount;
    const pagesNeeded = Math.ceil(filteredStudents.length / 8);

    return {
      total: filteredStudents.length,
      assignedCount,
      unassignedCount,
      pagesNeeded,
    };
  }, [filteredStudents]);

  // ৬. প্রিন্ট হ্যান্ডলার (react-to-print)
  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Seat-Stickers-${selectedClass !== "all" ? selectedClass : "All"}-${examName}-${selectedSession}`,
    pageStyle: SEAT_STICKERS_PAGE_STYLE,
    suppressErrors: true,
    onPrintError: (errorLocation, error) => {
      console.warn("Print error suppressed:", errorLocation, error);
    },
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 min-h-screen space-y-6 font-bornomala text-slate-800">
      {/* ১. পেজ হেডার ও অ্যাকশন বার */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-entry"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সিট প্ল্যান এন্ট্রি</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">
              আসন স্টিকার জেনারেটর
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight flex items-center gap-2">
            <span>পরীক্ষার আসন স্টিকার জেনারেটর</span>
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full border border-amber-300">
              A4 Print Ready
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            শিক্ষার্থীদের রোল, আইডি, ছবি এবং বরাদ্দকৃত হল ও আসন নম্বর সংবলিত
            প্রিন্ট-রেডি স্টিকার তৈরি ও প্রিন্ট করুন।
          </p>
        </div>

        {/* প্রিন্ট বাটন ও কাউন্ট */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handlePrint()}
            disabled={loading || filteredStudents.length === 0 || isPrinting}
            className="px-5 py-2.5 bg-[#043e30] hover:bg-[#065c47] text-amber-300 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>আসন স্টিকার প্রিন্ট করুন ({toBengaliDigits(filteredStudents.length)})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ২. ফিল্টারিং ও কনফিগারেশন বক্স */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* পরীক্ষার নাম ও হল নির্বাচন */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>পরীক্ষার নাম (স্টিকারে প্রদর্শিত হবে) *</span>
            </label>
            <div className="flex gap-2">
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
              >
                {examList.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              হল / রুম নম্বর অনুযায়ী ফিল্টার
            </label>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="all">সকল হল / রুম (All Rooms)</option>
              {availableHalls.map((hall) => (
                <option key={hall} value={hall}>
                  হল / রুম: {toBengaliDigits(hall)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              আসন বরাদ্দ অবস্থা
            </label>
            <select
              value={seatAssignmentStatus}
              onChange={(e) => setSeatAssignmentStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
            >
              <option value="all">সকল শিক্ষার্থী (All Students)</option>
              <option value="assigned">শুধুমাত্র আসন বরাদ্দকৃত (Assigned Only)</option>
              <option value="unassigned">আসন বরাদ্দবিহীন (Unassigned Only)</option>
            </select>
          </div>
        </div>

        {/* স্ট্যান্ডার্ড শ্রেণি ও সেশন ফিল্টার বার */}
        <StudentFilterBar
          variant="card"
          theme="emerald"
          className="p-0 border-none shadow-none bg-transparent"
          includeHigherSecondary={false}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          sessionYears={SESSION_YEARS}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
          selectedAcademyType={selectedAcademyType}
          onAcademyTypeChange={setSelectedAcademyType}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
      </div>

      {/* ৩. রিয়েল-টাইম সামারি কার্ডস */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold block">
            মোট নির্বাচিত শিক্ষার্থী
          </span>
          <span className="text-xl font-black text-[#043e30] font-ubuntu">
            {toBengaliDigits(stats.total)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            স্টিকার সংখ্যা
          </span>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[10px] text-emerald-800 font-bold block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>আসন বরাদ্দকৃত</span>
          </span>
          <span className="text-xl font-black text-emerald-800 font-ubuntu">
            {toBengaliDigits(stats.assignedCount)}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">
            কমপ্লিট সিট
          </span>
        </div>

        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-[10px] text-amber-800 font-bold block flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>আসন বরাদ্দবিহীন</span>
          </span>
          <span className="text-xl font-black text-amber-800 font-ubuntu">
            {toBengaliDigits(stats.unassignedCount)}
          </span>
          <span className="text-[10px] text-amber-700/80 block mt-0.5">
            সিট খালি বা নির্ধারণহীন
          </span>
        </div>

        <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-600 font-bold block">
            প্রয়োজনীয় A4 পাতা
          </span>
          <span className="text-xl font-black text-slate-900 font-ubuntu">
            {toBengaliDigits(stats.pagesNeeded)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            (৮টি স্টিকার প্রতি পাতায়)
          </span>
        </div>
      </div>

      {/* ৪. স্ক্রিন প্রিভিউ গ্রিড */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>স্টিকার প্রিভিউ (অন-স্ক্রিন ভিউ):</span>
            <span className="text-xs font-normal text-slate-500">
              প্রিন্ট আউটে স্বয়ংক্রিয়ভাবে ৮টি করে স্টিকার প্রতি A4 পেজে সুবিন্যস্ত হবে।
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#043e30]" />
            <p className="text-xs font-bold text-slate-600">
              শিক্ষার্থীদের স্টিকার ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-sm space-y-2">
            <p>⚠️ {error}</p>
            <button
              onClick={fetchStudents}
              className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-rose-700"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-2">
            <span className="text-3xl block">🏷️</span>
            <h3 className="font-bold text-slate-800 text-base">
              কোনো আসন স্টিকার পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500">
              আপনার ফিল্টার পরিবর্তন করে বা আসন বরাদ্দের অবস্থা পরিবর্তন করে পুনরায় দেখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student) => {
              const id = student._id?.$oid || student._id || student.studentId;
              const details = getStudentClassDetails(student);
              const currentSeat = student.seatPlan || {
                hallNo: student.hallNo || "",
                benchNo: student.benchNo || "",
                seatNo: student.seatNo || "",
              };

              const hallDisplay = currentSeat.hallNo || student.hallNo || "—";
              const benchDisplay = currentSeat.benchNo || student.benchNo || "";
              const seatDisplay = currentSeat.seatNo || student.seatNo || "—";
              const hasSeat = Boolean(currentSeat.seatNo || student.seatNo);
              const studentPhoto =
                student.studentImage ||
                student.profilePhoto ||
                student.photoUrl ||
                student.profileImage ||
                student.image ||
                student.avatar ||
                "";

              return (
                <div
                  key={id}
                  className="bg-white border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* স্টিকার হেডার */}
                  <div className="flex items-center justify-between gap-1.5 border-b border-emerald-900/10 pb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center bg-white border border-emerald-900/20">
                        <img
                          src={siteConfig.assets.logo}
                          alt="Logo"
                          width={20}
                          height={20}
                          loading="eager"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-[#043e30] truncate">
                        {siteConfig.name.bn}
                      </span>
                    </div>

                    <span className="bg-emerald-50 text-[#043e30] font-bold text-[8px] px-1.5 py-0.2 rounded border border-emerald-200 whitespace-nowrap">
                      {examName}
                    </span>
                  </div>

                  {/* ছবি ও তথ্যাবলী */}
                  <div className="flex items-center gap-2.5 my-2.5">
                    <div className="w-12 h-14 rounded-lg border border-slate-300 overflow-hidden relative bg-slate-100 flex items-center justify-center shrink-0">
                      {isValidImageUrl(studentPhoto) ? (
                        <img
                          src={studentPhoto.trim()}
                          alt={student.studentNameBangla || student.studentNameEnglish || "Student"}
                          loading="eager"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs">
                          👤
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="font-black text-slate-900 text-xs truncate">
                        {student.studentNameBangla || student.studentNameEnglish || "নাম নেই"}
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold truncate">
                        শ্রেণি: {details.className || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500 font-ubuntu">
                        <span>রোল: <strong>{toBengaliDigits(student.roll || "-")}</strong></span>
                        <span>•</span>
                        <span>আইডি: <strong>{toBengaliDigits(student.studentId || "-")}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* ডেস্ক ও সিট ইনফো */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-2 flex items-center justify-between gap-1 text-[10px]">
                    <div className="font-bold text-slate-700">
                      <span>হল: <strong>{toBengaliDigits(hallDisplay)}</strong></span>
                      {benchDisplay && (
                        <span className="ml-1 text-slate-500 font-ubuntu">
                          (বেঞ্চ: {toBengaliDigits(benchDisplay)})
                        </span>
                      )}
                    </div>

                    <div
                      className={`px-2 py-0.5 rounded font-black text-xs font-ubuntu flex items-center gap-1 ${
                        hasSeat
                          ? "bg-[#043e30] text-amber-300"
                          : "bg-rose-100 text-rose-700 border border-rose-300"
                      }`}
                    >
                      <span className="text-[8px] font-bold">আসন:</span>
                      <span>{toBengaliDigits(seatDisplay)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ৫. অফস্ক্রিন প্রিন্ট এলিমেন্ট (react-to-print এর জন্য প্রস্তুত) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          overflow: "hidden",
        }}
      >
        <SeatStickersPrintView
          ref={printAreaRef}
          students={filteredStudents}
          examName={examName}
          sessionYear={selectedSession}
        />
      </div>
    </div>
  );
}
