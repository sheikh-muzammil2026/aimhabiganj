"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Pagination from "@/components/dashboard/Pagination";
import { Globe, Mail, Phone } from "lucide-react";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API;

function ClassWiseResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const currentLimit = [10, 20, 50, 100].includes(limitParam) ? limitParam : 20;

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  const [selectedClass, setSelectedClass] = useState("প্রথম");
  const [examType, setExamType] = useState("term1");
  const [year, setYear] = useState("২০২৬");

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  const updatePaginationParams = useCallback(
    (newPage, newLimit) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      params.set("limit", String(newLimit || currentLimit));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, currentLimit, pathname, router],
  );

  const resetPageToFirst = useCallback(() => {
    if (currentPage !== 1) {
      updatePaginationParams(1, currentLimit);
    }
  }, [currentPage, currentLimit, updatePaginationParams]);

  const [principalSignatureSrc] = useState("/principle's_signature.jpg");
  const [controllerSignatureSrc] = useState("/anarul.png");

  const fetchClassResults = useCallback(async () => {
    if (!selectedClass) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        class: selectedClass,
        year: year,
        term: examType,
        page: String(currentPage),
        limit: String(currentLimit),
      });

      const res = await fetch(
        `${API_BASE_URL}/api/results/class?${queryParams.toString()}`,
        {
          headers: {
            "x-user-email": user?.email || "",
            "x-user-role": user?.role || "",
          },
        },
      );
      const data = await res.json();

      if (res.status === 403) {
        setResults([]);
        setIsPublished(false);
        setTotalPages(1);
        setTotalResults(0);
        return;
      }

      if (data.success && Array.isArray(data.data)) {
        setResults(data.data);
        setIsPublished(Boolean(data.isPublished));
        setTotalPages(data.totalPages || 1);
        setTotalResults(
          data.total !== undefined
            ? data.total
            : data.totalCount || data.data.length,
        );
      } else {
        setResults([]);
        setIsPublished(Boolean(data.isPublished));
        setTotalPages(1);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Fetch Class Results Error:", error);
      toast.error("ফলাফলের তথ্য লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, year, examType, currentPage, currentLimit, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClassResults();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchClassResults]);

  const handleTogglePublish = async () => {
    if (!isAdmin) {
      toast.error("শুধুমাত্র অ্যাডমিন ফলাফল প্রকাশ বা অপ্রকাশিত করতে পারেন।");
      return;
    }

    setToggling(true);
    try {
      const nextStatus = !isPublished;
      const res = await fetch(`${API_BASE_URL}/api/results/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
          "x-user-role": user?.role || "",
        },
        body: JSON.stringify({
          class: selectedClass,
          examType: examType,
          year: year,
          isPublished: nextStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsPublished(nextStatus);
        toast.success(
          data.message ||
            (nextStatus
              ? "ফলাফল সফলভাবে প্রকাশিত হয়েছে!"
              : "ফলাফল সফলভাবে অপ্রকাশিত করা হয়েছে!"),
        );
        fetchClassResults();
      } else {
        toast.error(data.message || "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Publish toggle error:", error);
      toast.error("সার্ভারে সমস্যা হয়েছে!");
    } finally {
      setToggling(false);
    }
  };

  const getSubjectPoint = (mark) => {
    const num = typeof mark === "number" ? mark : parseFloat(mark) || 0;
    if (num >= 80) return 5.0;
    if (num >= 70) return 4.0;
    if (num >= 60) return 3.5;
    if (num >= 50) return 3.0;
    if (num >= 40) return 2.0;
    if (num >= 33) return 1.0;
    return 0.0;
  };

  const getOverallGradeFromGPA = (gpaVal) => {
    const num = parseFloat(gpaVal) || 0;
    if (num >= 5.0) return "A+";
    if (num >= 4.0) return "A";
    if (num >= 3.5) return "A-";
    if (num >= 3.0) return "B";
    if (num >= 2.0) return "C";
    if (num >= 1.0) return "D";
    return "F";
  };

  const getStudentCalculations = useCallback(
    (student) => {
      const subjects = student.allSubjects || [];
      const totalSubs = subjects.length;

      if (totalSubs === 0) {
        return {
          totalMarks: 0,
          average: "0.00",
          totalGradePoints: "0.00",
          gpa: "0.00",
          grade: "F",
          hasFailed: true,
          isAbsentAll: true,
        };
      }

      let totalMarks = 0;
      let totalPoints = 0;
      let absentSubsCount = 0;
      let hasFailedSub = false;

      subjects.forEach((sub) => {
        const termData = sub[examType] || {};
        const isAbsent =
          Boolean(termData.isAbsent) ||
          termData.exam === "A" ||
          termData.exam === "a" ||
          termData.exam === "ABS" ||
          termData.ct === "A" ||
          termData.ct === "a" ||
          termData.ct === "ABS";

        const ct = parseFloat(termData.ct) || 0;
        const exam = parseFloat(termData.exam) || 0;
        const total = isAbsent ? 0 : ct + exam;

        if (isAbsent) {
          absentSubsCount++;
          hasFailedSub = true;
        } else if (total < 33) {
          hasFailedSub = true;
          totalMarks += total;
        } else {
          totalMarks += total;
          totalPoints += getSubjectPoint(total);
        }
      });

      const isAbsentAll = absentSubsCount === totalSubs;
      const average =
        totalSubs > 0 ? (totalMarks / totalSubs).toFixed(2) : "0.00";
      const totalGradePoints = totalPoints.toFixed(2);

      let gpa = "0.00";
      let grade = "F";

      if (isAbsentAll) {
        gpa = "0.00";
        grade = "ABS";
      } else if (hasFailedSub) {
        gpa = "0.00";
        grade = "F";
      } else {
        const calculatedGPA = Math.min(5.0, totalPoints / totalSubs);
        gpa = calculatedGPA.toFixed(2);
        grade = getOverallGradeFromGPA(calculatedGPA);
      }

      return {
        totalMarks,
        average,
        totalGradePoints,
        gpa,
        grade,
        hasFailed: hasFailedSub,
        isAbsentAll,
      };
    },
    [examType],
  );

  const studentCalculationsMap = useMemo(() => {
    const map = new Map();
    results.forEach((s) => {
      map.set(s.studentId, getStudentCalculations(s));
    });
    return map;
  }, [results, getStudentCalculations]);

  const meritRankMap = useMemo(() => {
    const rankMap = new Map();
    const passedList = results
      .filter((s) => {
        const calc = studentCalculationsMap.get(s.studentId);
        return calc && !calc.hasFailed && !calc.isAbsentAll;
      })
      .sort((a, b) => {
        const calcA = studentCalculationsMap.get(a.studentId);
        const calcB = studentCalculationsMap.get(b.studentId);

        const gpaDiff = parseFloat(calcB.gpa) - parseFloat(calcA.gpa);
        if (Math.abs(gpaDiff) > 0.001) return gpaDiff;

        const markDiff = calcB.totalMarks - calcA.totalMarks;
        if (markDiff !== 0) return markDiff;

        const rollA = parseInt(a.roll) || 999999;
        const rollB = parseInt(b.roll) || 999999;
        return rollA - rollB;
      });

    passedList.forEach((student, idx) => {
      if (idx > 0) {
        const prevStudent = passedList[idx - 1];
        const prevCalc = studentCalculationsMap.get(prevStudent.studentId);
        const currCalc = studentCalculationsMap.get(student.studentId);
        if (
          parseFloat(currCalc.gpa) === parseFloat(prevCalc.gpa) &&
          currCalc.totalMarks === prevCalc.totalMarks
        ) {
          rankMap.set(student.studentId, rankMap.get(prevStudent.studentId));
        } else {
          rankMap.set(student.studentId, idx + 1);
        }
      } else {
        rankMap.set(student.studentId, 1);
      }
    });

    return rankMap;
  }, [results, studentCalculationsMap]);

  const totalStudents = results.length;
  let absentCount = 0;
  let failedCount = 0;
  let passedCount = 0;

  results.forEach((student) => {
    const calc = studentCalculationsMap.get(student.studentId);
    if (!calc) return;
    if (calc.isAbsentAll) {
      absentCount++;
    } else if (calc.hasFailed) {
      failedCount++;
    } else {
      passedCount++;
    }
  });

  const presentStudents = totalStudents - absentCount;
  const passRate =
    presentStudents > 0
      ? ((passedCount / presentStudents) * 100).toFixed(2)
      : "0.00";

  const allSubjectsList = useMemo(() => {
    return Array.from(
      new Set(
        results.flatMap(
          (student) => student.allSubjects?.map((s) => s.subject) || [],
        ),
      ),
    );
  }, [results]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        .watermark-wrapper {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 0 !important;
          pointer-events: none !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          height: 100% !important;
          opacity: 0.08 !important;
        }

        .watermark-wrapper img {
          width: 320px !important;
          height: auto !important;
          object-fit: contain !important;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          html,
          body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            position: relative !important;
          }
          .overflow-x-auto {
            overflow: visible !important;
            width: 100% !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .watermark-wrapper {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 0 !important;
            opacity: 0.08 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table {
            width: 100% !important;
            min-width: 100% !important;
            font-size: 9px !important;
            border-collapse: collapse !important;
            background: transparent !important;
            page-break-inside: auto !important;
          }
          thead {
            display: table-header-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          th,
          td {
            border: 1px solid #475569 !important;
            padding: 3.5px 2px !important;
          }
          thead th {
            background-color: #043e30 !important;
            color: #fef08a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cell-fail {
            background-color: #fee2e2 !important;
            color: #dc2626 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="p-1 sm:p-6 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 relative print-container">
          <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                  শ্রেণিভিত্তিক ফলাফল ও মেরিট তালিকা
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    isPublished
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-rose-50 text-rose-700 border-rose-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPublished ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  ></span>
                  {isPublished
                    ? "প্রকাশিত (Published)"
                    : "অপ্রকাশিত (Unpublished)"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                শ্রেণি, পরীক্ষার ধরন এবং শিক্ষাবর্ষ অনুযায়ী সম্পূর্ণ ক্লাসের
                ফলাফল এক নজরে দেখুন।
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleTogglePublish}
                  disabled={toggling || loading}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${
                    isPublished
                      ? "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700"
                      : "bg-[#043e30] hover:bg-emerald-900 text-amber-300 border border-emerald-950"
                  }`}
                >
                  {toggling ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      আপডেট...
                    </>
                  ) : isPublished ? (
                    <>
                      <span>🚫</span>
                      অপ্রকাশিত করুন
                    </>
                  ) : (
                    <>
                      <span>📢</span>
                      ফলাফল প্রকাশ করুন
                    </>
                  )}
                </button>
              )}

              {results.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 bg-[#043e30] hover:bg-[#065c47] text-amber-300 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  🖨️ প্রিন্ট করুন
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6 no-print">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                শ্রেণি
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  resetPageToFirst();
                }}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="প্লে">প্লে</option>
                <option value="নার্সারি">নার্সারি</option>
                <option value="প্রথম">প্রথম</option>
                <option value="দ্বিতীয়">দ্বিতীয়</option>
                <option value="তৃতীয়">তৃতীয়</option>
                <option value="চতুর্থ">চতুর্থ</option>
                <option value="পঞ্চম">পঞ্চম</option>
                <option value="ষষ্ঠ">ষষ্ঠ</option>
                <option value="সপ্তম">সপ্তম</option>
                <option value="অষ্টম">অষ্টম</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পরীক্ষার ধরন
              </label>
              <select
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  resetPageToFirst();
                }}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="term1">প্রথম সাময়িক</option>
                <option value="term2">দ্বিতীয় সাময়িক</option>
                <option value="annual">বার্ষিক পরীক্ষা</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                শিক্ষাবর্ষ
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  resetPageToFirst();
                }}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {!isAdmin && !isPublished && !loading ? (
            <div className="py-16 px-6 text-center bg-amber-50/60 rounded-2xl border border-amber-200 text-slate-700 max-w-xl mx-auto my-8 shadow-sm no-print">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                🔒
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                ফলাফল এখনো প্রকাশ করা হয়নি
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedClass} শ্রেণির{" "}
                {examType === "term1"
                  ? "১ম সাময়িক"
                  : examType === "term2"
                    ? "২য় সাময়িক"
                    : "বার্ষিক"}{" "}
                পরীক্ষার ফলাফল কর্তৃপক্ষ কর্তৃক আনুষ্ঠানিকভাবে এখনো প্রকাশিত
                হয়নি। ফলাফল প্রকাশিত হলে এখানে দেখা যাবে।
              </p>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              ফলাফল প্রস্তুত করা হচ্ছে...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
              এই শ্রেণিতে কোনো ফলাফলের রেকর্ড পাওয়া যায়নি।
            </div>
          ) : (
            <div className="relative">
              {isAdmin && !isPublished && (
                <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 font-bold flex items-center gap-2 mb-4 no-print">
                  <span>⚠️</span>
                  এটি একটি অপ্রকাশিত ফলাফল। অ্যাডমিন প্রিভিউ হিসেবে আপনি এটি
                  দেখতে পাচ্ছেন। প্রকাশ করতে উপরের বাটনে চাপুন।
                </div>
              )}

              <div className="watermark-wrapper">
                <Image
                  src="/aimlogo1.png"
                  alt="Watermark Logo"
                  width={360}
                  height={360}
                  className="object-contain"
                />
              </div>

              {/* ১. ৩-কলাম হেডার লেআউট (Madrasah Logo, Banner & Info, Grading System Table) */}
              <div className="mb-3 border-b-2 border-slate-800 pb-2 print-page-break-avoid">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-16 sm:w-20 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src="/aimlogo1.png"
                      alt="Institution Logo"
                      width={80}
                      height={80}
                      priority
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center px-1">
                    <Image
                      src="/banner.png"
                      alt="Institution Banner"
                      width={500}
                      height={95}
                      priority
                      className="w-full max-w-[300px] sm:max-w-[380px] h-auto max-h-14 object-contain mx-auto"
                    />
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      শ্রেণিভিত্তিক ফলাফল বিবরণী -{" "}
                      {(year || "").split(/[-–/]/)[0].trim()}
                    </h2>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-700">
                      শ্রেণি:{" "}
                      <span className="font-bold text-slate-900">
                        {selectedClass}
                      </span>{" "}
                      | পরীক্ষা:{" "}
                      <span className="font-bold text-slate-900">
                        {examType === "term1"
                          ? "প্রথম সাময়িক"
                          : examType === "term2"
                            ? "দ্বিতীয় সাময়িক"
                            : "বার্ষিক পরীক্ষা"}
                      </span>
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex justify-end">
                    <table className="border-collapse border border-slate-600 text-[7.5px] sm:text-[8px] leading-none text-center bg-white shadow-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold">
                          <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                            Mark Interval
                          </th>
                          <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                            Grade
                          </th>
                          <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                            Point
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            80 - 100
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold">
                            A+
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            5.00
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            70 - 79
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold">
                            A
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            4.00
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            60 - 69
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold">
                            A-
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            3.50
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            50 - 59
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold">
                            B
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            3.00
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            40 - 49
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold">
                            C
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            2.00
                          </td>
                        </tr>

                        <tr>
                          <td className="border border-slate-400 px-1 py-0.2">
                            0 - 39
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2 font-bold text-red-600">
                            F
                          </td>
                          <td className="border border-slate-400 px-1 py-0.2">
                            0.00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* মোবাইল ভিউ (স্ক্রিন অনলি) */}
              <div className="block sm:hidden divide-y divide-slate-200 bg-white/90 no-print relative z-10">
                {results.map((student) => {
                  const calc =
                    studentCalculationsMap.get(student.studentId) || {};
                  const merit =
                    calc.hasFailed || calc.isAbsentAll
                      ? "-"
                      : meritRankMap.get(student.studentId) || "-";

                  return (
                    <div key={student.studentId} className="p-4 space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#043e30] text-amber-300 font-bold px-2 py-0.5 rounded text-xs">
                            রোল: {student.roll || "N/A"}
                          </span>
                          <span className="font-mono font-bold text-slate-700 text-xs">
                            ID: {student.studentId}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            মেধাস্থান
                          </span>
                          <span className="font-extrabold text-[#043e30] text-sm">
                            {merit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          শিক্ষার্থীর নাম
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {student.studentName || "N/A"}
                        </h4>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                          বিষয়ভিত্তিক নম্বর
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {student.allSubjects?.map((sub, idx) => {
                            const termData = sub[examType] || {};
                            const isAbsent =
                              Boolean(termData.isAbsent) ||
                              termData.exam === "A" ||
                              termData.exam === "Abs" ||
                              termData.exam === "ABS" ||
                              termData.ct === "A" ||
                              termData.ct === "Abs" ||
                              termData.ct === "ABS";
                            const ct = parseFloat(termData.ct) || 0;
                            const exam = parseFloat(termData.exam) || 0;
                            const subTotal = isAbsent ? 0 : ct + exam;
                            const isSubFail = isAbsent || subTotal < 33;

                            return (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                                  isSubFail
                                    ? "bg-[#fee2e2] text-red-700 border-red-200 font-bold"
                                    : "bg-slate-100 text-slate-700 border-slate-200/60"
                                }`}
                              >
                                <span className="font-semibold">
                                  {sub.subject}:
                                </span>
                                <span>{isAbsent ? "Absent" : subTotal}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-500 block">
                            মোট মার্ক
                          </span>
                          <span className="font-bold text-slate-800">
                            {calc.isAbsentAll ? "ABS" : calc.totalMarks}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-500 block">
                            জিপিএ
                          </span>
                          <span className="font-bold text-slate-800">
                            {calc.gpa}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-500 block">
                            গ্রেড
                          </span>
                          <span
                            className={`font-bold ${calc.grade === "F" ? "text-red-600" : "text-emerald-700"}`}
                          >
                            {calc.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ২. ডেস্কটপ ও প্রিন্ট টেবিল ভিউ */}
              <div className="hidden sm:block print-only overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="bg-[#043e30] text-amber-300">
                      <th className="p-1.5 border border-emerald-900 font-bold text-center w-10">
                        রোল
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold w-16">
                        আইডি
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold min-w-[120px]">
                        শিক্ষার্থীর নাম
                      </th>

                      {allSubjectsList.map((subjectName, i) => (
                        <th
                          key={i}
                          className="p-1 border border-emerald-900 font-bold text-center whitespace-nowrap"
                        >
                          {subjectName}
                        </th>
                      ))}

                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        মোট মার্ক
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        গড়
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        মোট গ্রেড পয়েন্ট
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        জিপিএ
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        গ্রেড
                      </th>
                      <th className="p-1.5 border border-emerald-900 font-bold text-center whitespace-nowrap">
                        মেধাস্থান
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/90">
                    {results.map((student) => {
                      const calc =
                        studentCalculationsMap.get(student.studentId) || {};
                      const merit =
                        calc.hasFailed || calc.isAbsentAll
                          ? "-"
                          : meritRankMap.get(student.studentId) || "-";

                      return (
                        <tr
                          key={student.studentId}
                          className="hover:bg-slate-50 border-b border-slate-200"
                        >
                          <td className="p-1.5 border border-slate-300 font-bold text-slate-700 text-center">
                            {student.roll || "N/A"}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-mono font-bold text-slate-800">
                            {student.studentId}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-bold text-slate-900 whitespace-nowrap">
                            {student.studentName || "N/A"}
                          </td>

                          {allSubjectsList.map((subjName, idx) => {
                            const matchedSub = student.allSubjects?.find(
                              (s) => s.subject === subjName,
                            );
                            if (!matchedSub) {
                              return (
                                <td
                                  key={idx}
                                  className="p-1 border border-slate-300 text-center text-slate-400"
                                >
                                  -
                                </td>
                              );
                            }

                            const termData = matchedSub[examType] || {};
                            const isAbsent =
                              Boolean(termData.isAbsent) ||
                              termData.exam === "A" ||
                              termData.exam === "Abs" ||
                              termData.exam === "ABS" ||
                              termData.ct === "A" ||
                              termData.ct === "Abs" ||
                              termData.ct === "ABS";

                            if (isAbsent) {
                              return (
                                <td
                                  key={idx}
                                  className="p-1 border border-slate-300 text-center font-bold bg-[#fee2e2] text-red-600 cell-fail"
                                >
                                  অনুঃ
                                </td>
                              );
                            }

                            const ct = parseFloat(termData.ct) || 0;
                            const exam = parseFloat(termData.exam) || 0;
                            const subTotal = ct + exam;
                            const isSubFail = subTotal < 33;

                            return (
                              <td
                                key={idx}
                                className={`p-1 border border-slate-300 text-center font-semibold ${
                                  isSubFail
                                    ? "bg-[#fee2e2] text-red-600 font-bold cell-fail"
                                    : "text-slate-800"
                                }`}
                              >
                                {subTotal}
                              </td>
                            );
                          })}

                          <td className="p-1.5 border border-slate-300 font-bold text-center text-slate-900">
                            {calc.isAbsentAll ? "ABS" : calc.totalMarks}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-semibold text-center text-slate-800">
                            {calc.isAbsentAll ? "-" : calc.average}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-semibold text-center text-slate-800">
                            {calc.isAbsentAll ? "-" : calc.totalGradePoints}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-bold text-center text-slate-900">
                            {calc.gpa}
                          </td>
                          <td
                            className={`p-1.5 border border-slate-300 font-bold text-center ${
                              calc.grade === "F" || calc.grade === "ABS"
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {calc.grade}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-bold text-center text-[#043e30]">
                            {merit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* এক নজরে পরিসংখ্যান */}
              <div className="text-[10px] sm:text-xs font-bold text-slate-800 bg-white/95 rounded-lg mt-2 py-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 print-page-break-avoid">
                <span>
                  মোট পরীক্ষার্থী:{" "}
                  <strong className="text-slate-900">{totalStudents}</strong>{" "}
                  জন,
                </span>
                <span>
                  পাশ করেছে:{" "}
                  <strong className="text-emerald-700">{passedCount}</strong>{" "}
                  জন,
                </span>
                <span>
                  পাসের হার:{" "}
                  <strong className="text-[#043e30]">{passRate}%</strong>,
                </span>
                <span>
                  অকৃতকার্য:{" "}
                  <strong className="text-rose-600">{failedCount}</strong> জন,
                </span>
                <span>
                  অনুপস্থিত:{" "}
                  <strong className="text-amber-600">{absentCount}</strong> জন।
                </span>
              </div>

              {/* ৫. ফুটার লেআউট (স্বাক্ষর এরিয়া এবং সোশ্যাল ও কন্টাক্ট ইনফো) */}
              <div className="mt-1 pt-1 print-page-break-avoid">
                <div className="flex justify-between items-end px-4 sm:px-12 mb-6">
                  <div className="text-center flex flex-col items-center">
                    <div className="relative w-28 sm:w-36 h-10 flex items-end justify-center mb-1">
                      <Image
                        src={controllerSignatureSrc || "/anarul.png"}
                        alt="Exam Controller Signature"
                        width={90}
                        height={34}
                        priority
                        className="max-h-10 w-auto object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90 mx-auto"
                      />
                    </div>
                    <div className="w-28 sm:w-36 border-b border-slate-800 mb-1"></div>
                    <span className="text-[9.5px] sm:text-xs font-bold text-slate-800 block">
                      পরীক্ষা নিয়ন্ত্রক
                    </span>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <div className="relative w-28 sm:w-36 h-10 flex items-end justify-center mb-1">
                      <Image
                        src={
                          principalSignatureSrc || "/principle's_signature.jpg"
                        }
                        alt="Principal Signature"
                        width={90}
                        height={34}
                        priority
                        className="max-h-10 w-auto object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45 mx-auto"
                      />
                    </div>
                    <div className="w-28 sm:w-36 border-b border-slate-800 mb-1"></div>
                    <span className="text-[9.5px] sm:text-xs font-bold text-slate-800 block">
                      প্রিন্সিপালের স্বাক্ষর
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-gray-300">
                  <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 text-[8.5px] sm:text-[9px] font-semibold text-gray-800">
                    <span className="flex items-center gap-0.5">
                      <Phone className="w-2.5 h-2.5 text-gray-700" />
                      01316-209201
                    </span>

                    <span className="flex items-center gap-0.5">
                      <BsWhatsapp className="w-2.5 h-2.5 text-green-600" />
                      01748-886161
                    </span>

                    <span className="flex items-center gap-0.5">
                      <Globe className="w-2.5 h-2.5 text-blue-500" />
                      www.aimhabiganj.com
                    </span>

                    <span className="flex items-center gap-0.5">
                      <Mail className="w-2.5 h-2.5 text-red-500" />
                      aimhabiganj@gmail.com
                    </span>

                    <span className="flex items-center gap-0.5">
                      <FaFacebook className="w-2.5 h-2.5 text-blue-600" />
                      aimhabiganj
                    </span>

                    <span className="flex items-center gap-0.5">
                      <BsYoutube className="w-2.5 h-2.5 text-red-600" />
                      aimhabiganj
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="no-print mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalResults}
                limit={currentLimit}
                limitOptions={[10, 20, 50, 100]}
                onPageChange={(newPage) =>
                  updatePaginationParams(newPage, currentLimit)
                }
                onLimitChange={(newLimit) =>
                  updatePaginationParams(1, newLimit)
                }
                itemName="items"
                className="no-print"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ClassResultView() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          লোড হচ্ছে...
        </div>
      }
    >
      <ClassWiseResultContent />
    </Suspense>
  );
}
