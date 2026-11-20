/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
  School,
  Sparkles,
} from "lucide-react";
import { toBengaliDigits, getStudentClassDetails } from "@/lib/studentUtils";
import siteConfig from "@/config/siteConfig";

export const FALLBACK_AVATAR_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='36' r='20'/><path d='M20 86c0-16.5 13.5-30 30-30s30 13.5 30 30z'/></svg>";

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "[object Object]"
  ) {
    return false;
  }
  return /^(https?:\/\/|\/|data:image\/)/i.test(trimmed);
};

// হলের কনফিগারেশন এবং অবস্থান
export const HALL_CONFIGS = {
  1: {
    hallNo: 1,
    name: "হল নং ১",
    location: "নিচ তলার নার্সারির রুম",
    fullTitle: "হল নং ১ — নিচ তলার নার্সারির রুম",
    shortTitle: "নিচ তলা (নার্সারি)",
    floor: "নিচ তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  2: {
    hallNo: 2,
    name: "হল নং ২",
    location: "২য় তলার থ্রির রুম",
    fullTitle: "হল নং ২ — ২য় তলার থ্রির রুম",
    shortTitle: "২য় তলা (ক্লাস থ্রি)",
    floor: "২য় তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  3: {
    hallNo: 3,
    name: "হল নং ৩",
    location: "২য় তলার ক্লাস টু এর রুম",
    fullTitle: "হল নং ৩ — ২য় তলার ক্লাস টু এর রুম",
    shortTitle: "২য় তলা (ক্লাস টু)",
    floor: "২য় তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  4: {
    hallNo: 4,
    name: "হল নং ৪",
    location: "৩য় তলায় হিফজ বিভাগের ক্লাস রুম",
    fullTitle: "হল নং ৪ — ৩য় তলায় হিফজ বিভাগের ক্লাস রুম",
    shortTitle: "৩য় তলা (হিফজ বিভাগ)",
    floor: "৩য় তলা",
    capacity: 44,
    deskCount: 22,
    rows: 11,
  },
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000"
).replace(/\/$/, "");

export default function ExamHallMapPage() {
  const printAreaRef = useRef(null);

  // স্টেটসমূহ
  const [selectedHall, setSelectedHall] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("২য় সাময়িক পরীক্ষা");
  const [examYear, setExamYear] = useState("২০২৬");
  const [showPhotos, setShowPhotos] = useState(true);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const activeHallConfig = HALL_CONFIGS[selectedHall] || HALL_CONFIGS[1];

  // ব্যাকএন্ড থেকে শিক্ষার্থীদের ডাটা ফেচ করা (শুধুমাত্র Approved ও Active)
  const fetchHallData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ১. নির্দিষ্ট হলের সিট প্ল্যান ডাটা লোড
      const hallUrl = `${API_BASE_URL}/api/seat-plan?hallNo=${selectedHall}&semester=${encodeURIComponent(
        selectedSemester,
      )}`;

      const res = await fetch(hallUrl);
      const data = await res.json();

      let studentList = [];

      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        studentList = data.data;
      } else {
        // ফলব্যাক: যদি /api/seat-plan খালি থাকে, তাহলে মূল /api/students থেকে ওই হলের একটিভ শিক্ষার্থীদের ফিল্টার
        const fallbackRes = await fetch(
          `${API_BASE_URL}/api/students?status=Approved&activity=active&limit=1000`,
        );
        const fallbackData = await fallbackRes.json();

        if (fallbackData?.success && Array.isArray(fallbackData.data)) {
          studentList = fallbackData.data
            .filter((s) => {
              const h = s.seatPlan?.hallNo || s.hallNo;
              return (
                h &&
                (Number(h) === Number(selectedHall) ||
                  String(h) === String(selectedHall) ||
                  toBengaliDigits(h) === toBengaliDigits(selectedHall))
              );
            })
            .map((s) => {
              const details = getStudentClassDetails(s);
              return {
                _id: s._id?.$oid || s._id || s.studentId,
                hallNo: Number(s.seatPlan?.hallNo || s.hallNo || selectedHall),
                seatNo: Number(s.seatPlan?.seatNo || s.seatNo || 0),
                class: details.className || "N/A",
                divisionName: details.divisionName,
                name: s.studentNameBangla || s.studentNameEnglish || "নাম নেই",
                studentId: s.studentId,
                roll: s.roll || s.officeUse?.rollNumber || "",
                studentImage: s.studentImage || s.profilePhoto || "",
              };
            });
        }
      }

      setStudents(studentList);
    } catch (err) {
      console.error("Error loading hall map data:", err);
      setError("সার্ভার থেকে হল ম্যাপ ডাটা লোড করতে সমস্যা হয়েছে।");
      toast.error("সিট প্ল্যান লোড করা যায়নি!");
    } finally {
      setLoading(false);
    }
  }, [selectedHall, selectedSemester]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHallData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHallData]);

  // সিট নম্বর অনুযায়ী স্টুডেন্টদের ম্যাপ তৈরি
  const studentMapBySeatNo = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const seat = Number(s.seatNo);
      if (seat && !isNaN(seat) && seat > 0) {
        map[seat] = s;
      }
    });
    return map;
  }, [students]);

  // ২ কলামের বেঞ্চ ও আইল রো স্ট্রাকচার তৈরি
  const deskRows = useMemo(() => {
    const rows = [];
    const totalRows = activeHallConfig.rows;
    let currentSeatNo = 1;
    let benchNumber = 1;

    for (let r = 0; r < totalRows; r++) {
      // বামের বেঞ্চ (Left Desk)
      const leftSeat1No = currentSeatNo;
      const leftSeat2No = currentSeatNo + 1;
      const leftDesk = {
        benchNo: benchNumber++,
        label: `বেঞ্চ ${toBengaliDigits(benchNumber - 1)}`,
        seatRange: `আসন ${toBengaliDigits(leftSeat1No)} ও ${toBengaliDigits(leftSeat2No)}`,
        leftSeat: {
          seatNo: leftSeat1No,
          student: studentMapBySeatNo[leftSeat1No] || null,
        },
        rightSeat: {
          seatNo: leftSeat2No,
          student: studentMapBySeatNo[leftSeat2No] || null,
        },
      };
      currentSeatNo += 2;

      // ডানের বেঞ্চ (Right Desk)
      const rightSeat1No = currentSeatNo;
      const rightSeat2No = currentSeatNo + 1;
      const rightDesk = {
        benchNo: benchNumber++,
        label: `বেঞ্চ ${toBengaliDigits(benchNumber - 1)}`,
        seatRange: `আসন ${toBengaliDigits(rightSeat1No)} ও ${toBengaliDigits(rightSeat2No)}`,
        leftSeat: {
          seatNo: rightSeat1No,
          student: studentMapBySeatNo[rightSeat1No] || null,
        },
        rightSeat: {
          seatNo: rightSeat2No,
          student: studentMapBySeatNo[rightSeat2No] || null,
        },
      };
      currentSeatNo += 2;

      rows.push({
        rowIdx: r + 1,
        rowLabel: `সারি ${toBengaliDigits(r + 1)}`,
        leftDesk,
        rightDesk,
      });
    }

    return rows;
  }, [activeHallConfig, studentMapBySeatNo]);

  // মোট বরাদ্দকৃত সিট এবং ফাঁকা সিটের পরিসংখ্যান
  const stats = useMemo(() => {
    let occupied = 0;
    const capacity = activeHallConfig.capacity;
    for (let i = 1; i <= capacity; i++) {
      if (studentMapBySeatNo[i]) occupied++;
    }
    return {
      capacity,
      occupied,
      vacant: capacity - occupied,
      totalStudentsFound: students.length,
    };
  }, [activeHallConfig, studentMapBySeatNo, students]);

  // প্রিন্ট হ্যান্ডলার (react-to-print)
  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Exam-Hall-Map-${activeHallConfig.name}-${selectedSemester}-${examYear}`,
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
      {/* ----------------- ১. পেজ হেডার ও নেভিগেশন বার ----------------- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-entry"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সিট প্ল্যান এন্ট্রি</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-stickers"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
            >
              <span>আসন স্টিকার</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">হল ম্যাপ</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight flex items-center gap-2">
            <span>পরীক্ষার হল ম্যাপ ও আসন বিন্যাস</span>
            <span className="bg-emerald-100 text-[#043e30] text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              Classroom Floor Plan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ২-সিটার বেঞ্চ, ওয়াকিং আইল এবং সম্মুখ শিক্ষক টেবিল সংবলিত বাস্তবসম্মত শ্রেণিকক্ষ আসন বিন্যাস।
          </p>
        </div>

        {/* প্রিন্ট বাটন এবং ছবি টগল */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowPhotos((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${showPhotos
              ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
              : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
          >
            {showPhotos ? (
              <>
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>ছবি দৃশ্যমান</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>ছবি লুকানো</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || students.length === 0 || isPrinting}
            className="inline-flex items-center gap-2 bg-[#043e30] hover:bg-[#065341] text-amber-300 hover:text-amber-200 font-black px-5 py-2.5 rounded-xl text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট হল ম্যাপ (A4)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ----------------- ২. হল ও সেমিস্টার ফিল্টার কন্ট্রোল ----------------- */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* হল নির্বাচন ট্যাবসমূহ */}
        <div>
          <label className="text-xs font-black text-slate-600 uppercase tracking-wider block mb-2">
            হল ও কক্ষ নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Object.values(HALL_CONFIGS).map((hall) => {
              const isSelected = selectedHall === hall.hallNo;
              return (
                <button
                  key={hall.hallNo}
                  type="button"
                  onClick={() => setSelectedHall(hall.hallNo)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${isSelected
                    ? "bg-[#043e30] text-white border-[#043e30] shadow-sm ring-2 ring-emerald-600/30"
                    : "bg-slate-50 hover:bg-emerald-50/50 text-slate-700 border-slate-200 hover:border-emerald-300"
                    }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${isSelected
                        ? "bg-amber-300 text-slate-900"
                        : "bg-emerald-100 text-emerald-900"
                        }`}
                    >
                      {hall.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${isSelected ? "text-emerald-200" : "text-slate-500"
                        }`}
                    >
                      {toBengaliDigits(hall.capacity)} টি আসন
                    </span>
                  </div>
                  <h4
                    className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? "text-white" : "text-slate-800"
                      }`}
                  >
                    {hall.location}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* সেমিস্টার, শিক্ষাবর্ষ এবং সামারি পরিসংখ্যান */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">পরীক্ষা:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 focus:outline-emerald-600"
              >
                <option value="১ম সাময়িক পরীক্ষা">১ম সাময়িক পরীক্ষা</option>
                <option value="২য় সাময়িক পরীক্ষা">২য় সাময়িক পরীক্ষা</option>
                <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">শিক্ষাবর্ষ:</span>
              <span className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 font-ubuntu">
                {toBengaliDigits(examYear)}
              </span>
            </div>
          </div>

          {/* স্ট্যাটাস কাউন্ট */}
          <div className="flex items-center gap-2 font-ubuntu">
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              মোট বরাদ্দ:{" "}
              <strong className="text-emerald-950 font-black">
                {toBengaliDigits(stats.occupied)}
              </strong>
              /{toBengaliDigits(stats.capacity)}
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
              ফাঁকা আসন:{" "}
              <strong className="text-amber-950 font-black">
                {toBengaliDigits(stats.vacant)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ----------------- ৩. অন-স্ক্রিন ক্লাসরুম ফ্লোর প্ল্যান ভিউ ----------------- */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            <p className="font-bold text-sm">হল ম্যাপ ও শ্রেণিকক্ষ সাজানো হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchHallData}
              className="text-xs font-bold underline cursor-pointer text-rose-700"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* রুম ইনফো টাইটেল ব্যানার */}
            <div className="bg-gradient-to-r from-[#043e30] to-[#085a47] text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                  পরীক্ষার হল ও আসন ম্যাপ
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-black text-amber-200">
                  {activeHallConfig.fullTitle}
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {selectedSemester} - {toBengaliDigits(examYear)} শিক্ষাবর্ষ • ধারণক্ষমতা:{" "}
                  {toBengaliDigits(activeHallConfig.capacity)} জন
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-center shrink-0">
                <span className="text-[10px] text-emerald-200 block font-semibold">
                  কক্ষের ধরন
                </span>
                <span className="text-sm font-black text-white">
                  ২ কলাম • কেন্দ্রীয় আইল
                </span>
              </div>
            </div>

            {/* সম্মুখভাগ নির্দেশক (Whiteboard & Invigilator Desk) */}
            <div className="bg-slate-800 text-white border-2 border-slate-700 rounded-xl p-3 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪑</span>
                <div>
                  <span className="text-xs font-black text-amber-300 block">
                    শিক্ষক টেবিল ও ডায়াস (সম্মুখভাগ)
                  </span>
                  <span className="text-[10px] text-slate-300">
                    Invigilator Desk • সম্মুখ দিক
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-1 text-center hidden sm:block">
                <span className="text-xs font-black text-emerald-300 tracking-wide">
                  📋 হোয়াইটবোর্ড এলাকা (Whiteboard)
                </span>
              </div>

              <div className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                প্রবেশদ্বার 🚪
              </div>
            </div>

            {/* ক্লাসরুম গ্রিড: বামের কলাম + সেন্ট্রাল হাঁটার পথ (Aisle) + ডানের কলাম */}
            <div className="space-y-4">
              {deskRows.map((row) => (
                <div
                  key={`row-${row.rowIdx}`}
                  className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-stretch"
                >
                  {/* বাম পাশের বেঞ্চ (২ সিটার) */}
                  <DeskContainer desk={row.leftDesk} showPhoto={showPhotos} />

                  {/* কেন্দ্রীয় হাঁটার পথ (Central Walking Aisle) */}
                  <div className="w-10 sm:w-16 flex flex-col items-center justify-center border-x-2 border-dashed border-slate-300 bg-slate-100/70 rounded-md select-none py-2 text-center">
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
                      হাঁটার পথ (AISLE)
                    </span>
                  </div>

                  {/* ডান পাশের বেঞ্চ (২ সিটার) */}
                  <DeskContainer desk={row.rightDesk} showPhoto={showPhotos} />
                </div>
              ))}
            </div>

            {/* ক্লাসরুম পেছনের সীমানা নির্দেশক */}
            <div className="text-center py-2 border-t-2 border-dashed border-slate-300 text-xs font-bold text-slate-400">
              শ্রেণিকক্ষের শেষ প্রান্ত (Back of Classroom)
            </div>
          </div>
        )}
      </div>

      {/* ----------------- ৪. অফ-স্ক্রিন প্রিন্ট এলিমেন্ট (A4 Portrait Print View) ----------------- */}
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
        <div ref={printAreaRef}>
          <HallMapPrintTemplate
            hallConfig={activeHallConfig}
            semester={selectedSemester}
            year={examYear}
            deskRows={deskRows}
            stats={stats}
            showPhoto={showPhotos}
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ২-সিটার বেঞ্চ কন্টেইনার কম্পোনেন্ট (Desk Container)
// -------------------------------------------------------------
function DeskContainer({ desk, showPhoto = true, isPrint = false }) {
  return (
    <div
      className={`bg-white border-2 border-slate-300 rounded-xl p-2 sm:p-2.5 shadow-2xs flex flex-col justify-between ${isPrint ? "print-desk-box" : ""
        }`}
    >
      {/* বেঞ্চের পরিচিতি হেডার */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5 text-[9px] sm:text-[10px] text-slate-600 font-bold">
        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-ubuntu font-bold border border-slate-200">
          {desk.label}
        </span>
        <span className="text-slate-500 font-ubuntu">{desk.seatRange}</span>
      </div>

      {/* পাশাপাশি ২টি আসন */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 items-stretch flex-1">
        <StudentSeatCard
          slot={desk.leftSeat}
          positionLabel="বাম আসন"
          showPhoto={showPhoto}
          isPrint={isPrint}
        />
        <StudentSeatCard
          slot={desk.rightSeat}
          positionLabel="ডান আসন"
          showPhoto={showPhoto}
          isPrint={isPrint}
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// একক শিক্ষার্থীর আসন কার্ড কম্পোনেন্ট (Student Seat Card)
// -------------------------------------------------------------
function StudentSeatCard({ slot, positionLabel, showPhoto = true, isPrint = false }) {
  const { seatNo, student } = slot;
  const isOccupied = Boolean(student);

  if (!isOccupied) {
    return (
      <div
        className={`border-2 border-dashed border-slate-300 rounded-lg p-2 flex flex-col items-center justify-between text-center bg-slate-50/50 text-slate-400 ${isPrint ? "h-[34mm]" : "min-h-[85px]"
          }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="bg-slate-200 text-slate-600 font-bold text-[9px] px-1.5 py-0.2 rounded font-ubuntu">
            আসন {toBengaliDigits(seatNo)}
          </span>
          <span className="text-[8px] text-slate-400">{positionLabel}</span>
        </div>
        <div className="my-auto">
          <span className="text-sm block opacity-40">🪑</span>
          <span className="text-[9.5px] font-bold text-slate-400">ফাঁকা আসন</span>
        </div>
        <span className="text-[7.5px] text-slate-400">অবরাদ্দকৃত</span>
      </div>
    );
  }

  const studentClass = student.class || "প্রযোজ্য নয়";
  const rollDisplay = student.roll ? toBengaliDigits(student.roll) : "—";
  const idDisplay = student.studentId ? toBengaliDigits(student.studentId) : "—";

  return (
    <div
      className={`bg-white border border-slate-300 rounded-lg p-1.5 sm:p-2 flex flex-col justify-between transition-all relative overflow-hidden shadow-2xs ${isPrint ? "h-[34mm] p-1.5" : "min-h-[85px]"
        }`}
    >
      {/* ১. টপ বার: হাই-কন্ট্রাস্ট আসন ব্যাজ ও শ্রেণি */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="bg-[#043e30] text-amber-300 font-black px-1.5 py-0.2 rounded text-[10px] sm:text-[10.5px] font-ubuntu leading-tight shrink-0 shadow-2xs">
          আসন {toBengaliDigits(seatNo)}
        </span>
        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[8.5px] sm:text-[9px] px-1.5 py-0.2 rounded truncate max-w-[85px]">
          {studentClass}
        </span>
      </div>

      {/* ২. মূল বডি: ছবি + নাম ও রোল */}
      <div className="flex items-center gap-1.5 sm:gap-2 my-auto min-w-0">
        {showPhoto && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-300 overflow-hidden relative bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
            {isValidImageUrl(student.studentImage) ? (
              <img
                src={student.studentImage.trim()}
                alt={student.name}
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                }}
              />
            ) : (
              <span className="text-xs sm:text-sm text-slate-400">👤</span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] sm:text-[11.5px] font-black text-slate-900 leading-tight truncate">
            {student.name}
          </h4>
          <div className="text-[8.5px] sm:text-[9px] text-slate-600 font-ubuntu font-bold flex items-center gap-1.5 mt-0.5">
            <span>রোল: {rollDisplay}</span>
            <span>•</span>
            <span className="text-slate-500">আইডি: {idDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// A4 Portrait প্রিন্ট টেমপ্লেট কম্পোনেন্ট (HallMapPrintTemplate)
// -------------------------------------------------------------
function HallMapPrintTemplate({
  hallConfig,
  semester,
  year,
  deskRows,
  stats,
  showPhoto = true,
}) {
  // হল ৪ (৪৪ সিট / ১১ রো) এর জন্য ২ পেজে ভাগ করা, বাকি হল ১, ২, ৩ এর জন্য ১ পেজেই সম্পূর্ণ ফিট
  const isMultiPage = deskRows.length > 6;
  const pages = isMultiPage
    ? [deskRows.slice(0, 6), deskRows.slice(6)]
    : [deskRows];

  return (
    <div className="font-bornomala text-slate-900 bg-white">
      {/* প্রিন্ট স্টাইল ইনজেকশন */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            @media print {
              html, body {
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                color: #000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: 'Bornomala', 'Ubuntu Sans', sans-serif !important;
              }
              .no-print {
                display: none !important;
              }
              .hall-print-sheet {
                width: 194mm !important;
                min-height: 275mm !important;
                max-height: 281mm !important;
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                overflow: hidden !important;
              }
              .hall-print-sheet:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
              }
              .print-desk-box {
                box-sizing: border-box !important;
                border: 1.5px solid #94a3b8 !important;
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
        }}
      />

      {pages.map((pageRows, pageIdx) => (
        <div
          key={`page-${pageIdx}`}
          className="hall-print-sheet w-[194mm] h-[278mm] mx-auto p-0 flex flex-col justify-between overflow-hidden bg-white"
        >
          {/* ১. প্রাতিষ্ঠানিক প্রিন্ট হেডার */}
          <div className="border-b-2 border-[#043e30] pb-2 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              {/* লোগো */}
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-emerald-900/30">
                <img
                  src={siteConfig.assets.logo}
                  alt={`${siteConfig.name.short} Logo`}
                  width={56}
                  height={56}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.05]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                  }}
                />
              </div>

              {/* মাদ্রাসার নাম ও হলের টাইটেল */}
              <div className="flex-1 text-center min-w-0">
                <h2 className="text-xl font-black text-[#043e30] tracking-tight leading-tight">
                  {siteConfig.name.bn}
                </h2>
                <p className="text-[10px] text-slate-600 font-bold">
                  {siteConfig.address.bn}
                </p>
                <div className="inline-block bg-[#043e30] text-amber-300 font-black text-xs px-3 py-0.5 rounded-full mt-1 font-ubuntu shadow-2xs">
                  {hallConfig.fullTitle}
                </div>
              </div>

              {/* পরীক্ষার তথ্য ও পৃষ্ঠা নম্বর */}
              <div className="text-right shrink-0 space-y-0.5 text-[9px] text-slate-700">
                <div className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-emerald-950">
                  {semester}
                </div>
                <div className="font-ubuntu font-bold">
                  শিক্ষাবর্ষ: {toBengaliDigits(year)}
                </div>
                {isMultiPage && (
                  <div className="text-[8px] text-slate-500 font-bold">
                    পৃষ্ঠা {toBengaliDigits(pageIdx + 1)}/
                    {toBengaliDigits(pages.length)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ২. সম্মুখভাগ নির্দেশক (Whiteboard & Front Indicator) */}
          <div className="bg-slate-900 text-white rounded-lg px-3 py-1 flex items-center justify-between text-[10px] font-bold my-1 flex-shrink-0 border border-slate-700">
            <span className="text-amber-300">
              🪑 সম্মুখভাগ: শিক্ষক টেবিল ও ইনভিজিলেটর ডায়াস
            </span>
            <span className="bg-slate-800 px-3 py-0.5 rounded text-emerald-300 border border-slate-600">
              📋 হোয়াইটবোর্ড
            </span>
            <span className="text-slate-300">প্রবেশ পথ 🚪</span>
          </div>

          {/* ৩. মূল ক্লাসরুম ডেস্ক ও হাঁটার পথ (Aisle) গ্রিড */}
          <div className="flex-1 flex flex-col justify-around py-0.5">
            {pageRows.map((row) => (
              <div
                key={`print-row-${row.rowIdx}`}
                className="grid grid-cols-[89mm_12mm_89mm] gap-x-1 items-stretch my-0.5"
              >
                {/* বাম পাশের বেঞ্চ */}
                <DeskContainer
                  desk={row.leftDesk}
                  showPhoto={showPhoto}
                  isPrint={true}
                />

                {/* হাঁটার পথ (Central Aisle) */}
                <div className="flex flex-col items-center justify-around border-x border-dashed border-slate-300 bg-slate-50 rounded select-none py-1 text-center">
                  <span className="text-[7px] font-black text-slate-400 tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
                    আইল
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <span className="text-[7px] font-black text-slate-400 tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
                    আইল
                  </span>
                </div>

                {/* ডান পাশের বেঞ্চ */}
                <DeskContainer
                  desk={row.rightDesk}
                  showPhoto={showPhoto}
                  isPrint={true}
                />
              </div>
            ))}
          </div>

          {/* ৪. প্রিন্ট ফুটার (স্বাক্ষর ও পরিসংখ্যান) */}
          <div className="border-t border-slate-300 pt-1.5 flex items-end justify-between text-[9px] text-slate-600 flex-shrink-0">
            <div className="font-ubuntu space-y-0.5">
              <div>
                মোট আসন: <strong>{toBengaliDigits(hallConfig.capacity)}</strong> টি
                | উপস্থিত শিক্ষার্থী:{" "}
                <strong>{toBengaliDigits(stats.occupied)}</strong> জন
              </div>
              <div className="text-[7.5px] text-slate-400">
                মুদ্রণ তারিখ: {toBengaliDigits(new Date().toLocaleDateString("bn-BD"))}
              </div>
            </div>

            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
                <span className="text-[8px] font-bold text-slate-700">
                  হল পরিদর্শক স্বাক্ষর
                </span>
              </div>
              <div>
                <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
                <span className="text-[8px] font-bold text-slate-700">
                  পরীক্ষা নিয়ন্ত্রক / অধ্যক্ষ
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
