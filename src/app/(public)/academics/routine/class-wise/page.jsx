"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClassWiseRoutinePage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");

  // ১. সকল পরীক্ষার তালিকা লোড করা
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admit-cards/exams`);
        const result = await res.json();
        if (result.success && result.data?.length > 0) {
          setExams(result.data);
          setSelectedExam(result.data[0]); // ডিফল্ট প্রথম পরীক্ষা সিলেক্ট থাকবে
        } else {
          setError("কোনো পরীক্ষার তথ্য পাওয়া যায়নি।");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("পরীক্ষার তালিকা লোড করতে সমস্যা হয়েছে।");
      }
    }
    fetchExams();
  }, []);

  // ২. নির্বাচিত পরীক্ষার রুটিন ডেটা লোড করা
  useEffect(() => {
    if (!selectedExam) return;

    async function fetchRoutine() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/api/admin/routine?examTitle=${encodeURIComponent(
            selectedExam
          )}&division=all`
        );
        const result = await res.json();
        if (result.success) {
          setRoutine(result.data);
        } else {
          setRoutine(null);
          setError(result.message || "এই পরীক্ষার কোনো রুটিন পাওয়া যায়নি।");
        }
      } catch (err) {
        console.error("Error fetching routine:", err);
        setError("রুটিন লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }
    fetchRoutine();
  }, [selectedExam]);

  // প্রিন্ট হ্যান্ডলার
  const handlePrint = () => {
    window.print();
  };

  // ইউনিক ক্লাসের তালিকা পাওয়া
  const availableClasses = routine?.routineData?.map((r) => r.class) || [];

  // ক্লাস অনুযায়ী ফিল্টার করা রুটিন ডেটা
  const filteredRoutineData = routine?.routineData?.filter((r) => {
    // শুধুমাত্র সেই ক্লাসগুলোই দেখাবো যেগুলোর অন্তত একটি বিষয়ও রুটিনে আছে
    const hasSubjects = Object.values(r.subjects || {}).some(Boolean);
    if (!hasSubjects) return false;

    if (selectedClass === "all") return true;
    return r.class === selectedClass;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      
      {/* ========================================== */}
      {/* স্ক্রিন কন্ট্রোল সেকশন (প্রিন্ট করার সময় দেখা যাবে না) */}
      {/* ========================================== */}
      <div className="no-print max-w-4xl mx-auto mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-950/10 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-400">
              শ্রেণি-ভিত্তিক পরীক্ষার রুটিন 🖨️
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              পরীক্ষার নাম ও শ্রেণি অনুযায়ী ফিল্টার করে রুটিন প্রিন্ট বা ডাউনলোড করুন
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/academics"
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              ← ব্যাক টু একাডেমি
            </Link>
            <button
              onClick={handlePrint}
              disabled={!routine || filteredRoutineData.length === 0}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🖨️ রুটিন প্রিন্ট করুন
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* পরীক্ষা সিলেকশন ড্রপডাউন */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">পরীক্ষা নির্বাচন করুন:</label>
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                setSelectedClass("all");
              }}
              className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
            >
              {exams.map((title, idx) => (
                <option key={idx} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* শ্রেণি সিলেকশন ড্রপডাউন */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">শ্রেণি ফিল্টার করুন:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={!routine}
              className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-600 font-bold disabled:opacity-50"
            >
              <option value="all">সকল শ্রেণির রুটিন (All Classes)</option>
              {availableClasses.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* লোডিং ও এরর হ্যান্ডলিং */}
      {loading && (
        <div className="no-print text-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-500">রুটিন ডাটা লোড হচ্ছে...</p>
        </div>
      )}

      {!loading && error && (
        <div className="no-print max-w-4xl mx-auto bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* ========================================== */}
      {/* রুটিন প্রিন্ট লেআউট এরিয়া */}
      {/* ========================================== */}
      {!loading && routine && filteredRoutineData.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredRoutineData.map((clsData) => (
            <div
              key={clsData.class}
              className="print-card bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden"
            >
              {/* প্রাতিষ্ঠানিক হেডার */}
              <div className="text-center pb-4 mb-6 border-b-2 border-slate-800 dark:border-slate-600 space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-400">
                  আস-সালাম আইডিয়াল মাদরাসা (এইম) 🕌
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ইসলামিক শিক্ষা ও সাধারণ শিক্ষার এক অপূর্ব সমন্বয়
                </p>
                <h3 className="text-md sm:text-lg font-bold bg-emerald-950/15 dark:bg-emerald-950/45 text-emerald-900 dark:text-emerald-300 py-1.5 px-3 rounded-lg inline-block mt-2">
                  পরীক্ষার সময়সূচী ও রুটিন
                </h3>
              </div>

              {/* রুটিন ইনফো সেকশন */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5">
                  <p>📂 <span className="font-semibold text-slate-500 dark:text-slate-400">পরীক্ষার নাম:</span> {routine.examTitle}</p>
                  <p>🏫 <span className="font-semibold text-slate-500 dark:text-slate-400">শ্রেণি:</span> {clsData.class}</p>
                </div>
                <div className="space-y-1.5 sm:text-right">
                  <p>🌙 <span className="font-semibold text-slate-500 dark:text-slate-400">হিজরী বর্ষ:</span> {routine.hijriYear ? String(routine.hijriYear).split(/[-–/]/)[0].trim() : "N/A"}</p>
                  <p>📅 <span className="font-semibold text-slate-500 dark:text-slate-400">ঈসায়ী বর্ষ:</span> {routine.gregorianYear ? String(routine.gregorianYear).split(/[-–/]/)[0].trim() : "N/A"}</p>
                </div>
                {routine.note && (
                  <div className="col-span-1 sm:col-span-2 bg-amber-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-amber-200/50 dark:border-slate-800 text-[11px] sm:text-xs text-amber-900 dark:text-amber-300 mt-2 font-medium">
                    📝 <span className="font-bold">বিশেষ নির্দেশিকা:</span> {routine.note}
                  </div>
                )}
              </div>

              {/* রুটিন টেবিল */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#043e30] text-emerald-100 text-xs sm:text-sm uppercase tracking-wider font-bold">
                      <th className="py-3 px-4 border-r border-[#05503e]/40">তারিখ (Date)</th>
                      <th className="py-3 px-4 border-r border-[#05503e]/40">দিন (Day)</th>
                      <th className="py-3 px-4">বিষয় (Subject)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {routine.dates.map((d) => {
                      const subjectName = clsData.subjects?.[d.id];
                      if (!subjectName) return null; // বিষয় না থাকলে সেই তারিখ রুটিনে দেখাব না

                      return (
                        <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="py-2.5 px-4 font-bold border-r border-slate-200 dark:border-slate-700">{d.date}</td>
                          <td className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-700 font-semibold">{d.day}</td>
                          <td className="py-2.5 px-4 font-extrabold text-emerald-800 dark:text-emerald-400">{subjectName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* স্বাক্ষর সেকশন (প্রিন্ট অপ্টিমাইজড) */}
              <div className="mt-12 flex justify-between text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 pt-8 border-t border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-center w-28 sm:w-36 space-y-1">
                  <div className="h-6"></div>
                  <p className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold">অধ্যক্ষ / মোহতামিম</p>
                  <p className="text-[9px] text-slate-400">আস-সালাম আইডিয়াল মাদরাসা</p>
                </div>
                <div className="text-center w-28 sm:w-36 space-y-1">
                  <div className="h-6"></div>
                  <p className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold">পরীক্ষা নিয়ন্ত্রক</p>
                  <p className="text-[9px] text-slate-400">পরীক্ষা কমিটি (AIM)</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* প্রিন্ট সিএসএস স্টাইল */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          /* প্রতিটি ক্লাসের রুটিন প্রিন্ট করার সময় আলাদা আলাদা পেইজে যাবে */
          .print-card {
            page-break-after: always;
            break-after: page;
            border: 1px solid #000 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            margin-bottom: 0 !important;
            padding: 20px !important;
          }
          /* ডার্ক মোডের সব কালার প্রিন্ট করার সময় লাইট করে ফেলা */
          .print-card * {
            color: black !important;
            border-color: #000 !important;
          }
          table {
            border: 1px solid #000 !important;
          }
          th {
            background-color: #f1f5f9 !important;
            color: black !important;
            border-bottom: 2px solid #000 !important;
          }
          tr {
            border-bottom: 1px solid #000 !important;
          }
          td {
            border-right: 1px solid #000 !important;
          }
        }
      `}</style>
      
    </div>
  );
}
