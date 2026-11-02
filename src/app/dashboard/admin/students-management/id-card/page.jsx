"use client";
import Pagination from "@/components/dashboard/Pagination";
import StudentFilterBar from "@/components/dashboard/students/StudentFilterBar";
import { IdCardBack } from "@/components/dashboard/students/id-card/IdCardBack";
import { IdCardFront } from "@/components/dashboard/students/id-card/IdCardFront";
import {
  getStudentClassDetails,
  SESSION_YEARS,
} from "@/lib/studentUtils";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ID_CARD_PAGE_STYLE = `
  @media print {
    html,
    body {
      background: #ffffff !important;
      height: auto !important;
      min-height: 100% !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    @page {
      size: A4 portrait;
      margin: 10mm 8mm;
    }

    .print-grid-container {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 12px 10px !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
    }

    .id-card-print-box {
      width: 2.125in !important;
      height: 3.375in !important;
      box-sizing: border-box !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      -webkit-column-break-inside: avoid !important;
      margin-bottom: 8px !important;
    }
  }
`;

export default function IdCardGenerator() {
  const printAreaRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
  const [selectedAcademyType, setSelectedAcademyType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  // পেজিনেশন স্টেটসমূহ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(20);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        status: "Approved",
        activity: "active",
        page: currentPage,
        limit: limit,
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSession !== "all")
        params.append("sessionYear", selectedSession);
      if (selectedDivision !== "all")
        params.append("division", selectedDivision);
      if (selectedAcademyType !== "all")
        params.append("academyType", selectedAcademyType);
      if (selectedClass !== "all") params.append("class", selectedClass);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`,
      );
      const result = await response.json();

      if (result.success) {
        const sorted = (result.data || []).sort(
          (a, b) =>
            (parseInt(a.roll, 10) || Infinity) -
            (parseInt(b.roll, 10) || Infinity),
        );
        setStudents(sorted);
        setTotalPages(result.totalPages || 1);
        setTotalStudents(result.total || result.totalCount || 0);
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    limit,
    searchTerm,
    selectedSession,
    selectedDivision,
    selectedAcademyType,
    selectedClass,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // ডায়নামিক ফিল্টারিং লজিক (ব্যাকএন্ড দ্বারা নিয়ন্ত্রিত)
  const filteredStudents = students;

  const sessionYears = SESSION_YEARS;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) => {
        const nextIds = [...prev];
        currentPageIds.forEach((id) => {
          if (!nextIds.includes(id)) nextIds.push(id);
        });
        return nextIds;
      });
    } else {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    }
  };

  const handleSelectStudent = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const reactToPrintFn = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: "Student-ID-Cards",
    pageStyle: ID_CARD_PAGE_STYLE,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    if (!printAreaRef.current) return;
    setIsPrinting(true);
    reactToPrintFn();
  };

  const studentsToPrint = students.filter((s) => selectedIds.includes(s._id));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6">
      {/* প্রিন্ট সিএসএস ফিক্স (ব্যাকগ্রাউন্ড কালার ঠিক রাখার জন্য) */}
      <style jsx global>{`
        @media print {
          /* ১. প্রিন্ট মোডে অনাবশ্যক লেআউট রিসেট */
          html,
          body {
            background: #ffffff !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* ২. A4 পেজ মার্জিন ও সাইজ */
          @page {
            size: A4 portrait;
            margin: 10mm 8mm;
          }

          /* ৩. স্ক্রিনের অনাবশ্যক এলিমেন্ট লুকানো */
          .print-hide,
          nav,
          header,
          sidebar,
          footer {
            display: none !important;
          }

          /* ৪. প্রিন্ট গ্রিড কন্টেইনার (Grid উঠিয়ে Flex/Block ব্যবহার) */
          .print-grid-container {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            align-items: flex-start !important;
            gap: 12px 10px !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* ৫. প্রতিটি কার্ডের প্রিন্ট আচরণ (A4 পেজে ৩টি করে বসবে) */
          .id-card-print-box {
            width: 2.125in !important;
            height: 3.375in !important;
            box-sizing: border-box !important;

            /* কার্ড ভাঙা রোধ করার জন্য */
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;

            margin-bottom: 8px !important;
          }
        }
      `}</style>

      {/* ----------------- ১. এডমিন কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden max-w-7xl mx-auto bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#043e30] dark:text-emerald-450 mb-4 sm:mb-6 border-b dark:border-slate-850 pb-2">
          আইডি কার্ড জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/20 text-red-750 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-sm">
            {error}
          </div>
        )}

        <StudentFilterBar
          variant="labeled"
          includeHigherSecondary={false}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          sessionYears={sessionYears}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
          selectedAcademyType={selectedAcademyType}
          onAcademyTypeChange={setSelectedAcademyType}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          onResetPage={() => setCurrentPage(1)}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t dark:border-slate-800 pt-4 mb-4">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center sm:text-left">
            মোট স্টুডেন্ট: {totalStudents} জন | সিলেক্ট করা হয়েছে:{" "}
            {selectedIds.length} জন
          </span>
          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0 || isPrinting}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-md font-bold text-sm sm:text-base text-white transition flex items-center justify-center gap-2 ${
              selectedIds.length === 0 || isPrinting
                ? "bg-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            }`}
          >
            {isPrinting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>🖨️ সিলেক্টেড আইডি কার্ড প্রিন্ট করুন ({selectedIds.length})</>
            )}
          </button>
        </div>

        {/* ----------------- রেসপন্সিভ স্টুডেন্ট ডাটা ভিউ ----------------- */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-[#0f172a]">
          {/* ১. মোবাইল ভিউ (কার্ড ফরম্যাট - md স্ক্রিনের নিচে) */}
          <div className="block md:hidden">
            {/* মোবাইল সিলেক্ট অল বার */}
            <div className="p-3 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-250">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredStudents.length > 0 &&
                    filteredStudents.every((s) => selectedIds.includes(s._id))
                  }
                  className="rounded border-gray-300"
                />
                <span>সবাইকে সিলেক্ট করুন</span>
              </label>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-slate-800">
              {loading ? (
                <div className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">
                  ডাটা লোড হচ্ছে...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">
                  কোনো শিক্ষার্থী পাওয়া যায়নি!
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const details = getStudentClassDetails(student);
                  const isSelected = selectedIds.includes(student._id);
                  return (
                    <div
                      key={student._id}
                      onClick={() => handleSelectStudent(student._id)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-50/70 dark:bg-blue-950/20"
                          : "hover:bg-gray-50 dark:hover:bg-slate-900/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // হ্যান্ডেল করা হচ্ছে প্যারেন্ট div ক্লিক দিয়ে
                        className="mt-1 rounded border-gray-300"
                      />
                      <img
                        src={
                          student.studentImage ||
                          student.photoUrl ||
                          "/default-avatar.png"
                        }
                        alt={student.studentNameEnglish || "Student"}
                        className="w-12 h-12 rounded-full object-cover border dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <p className="font-bold text-gray-900 dark:text-gray-205 dark:text-gray-200 text-sm truncate">
                            {student.studentNameBangla ||
                              student.studentNameEnglish ||
                              "N/A"}
                          </p>
                          {!(student.studentImage || student.photoUrl) ? (
                            <span className="text-[10px] bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded shrink-0">
                              ছবি মিসিং
                            </span>
                          ) : (
                            <span className="text-[10px] bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded shrink-0">
                              ওকে
                            </span>
                          )}
                        </div>
                        <p className="text-gray-650 dark:text-gray-400 font-medium">
                          আইডি:{" "}
                          <span className="text-gray-900 dark:text-gray-200 font-semibold">
                            {student.studentId || "N/A"}
                          </span>
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {details.divisionName}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {details.className}
                          </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-450">
                          মোবাইল:{" "}
                          {student.fatherMobile ||
                            student.guardianMobile ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ২. ডেস্কটপ ও ট্যাবলেট ভিউ (টেবিল ফরম্যাট - md স্ক্রিন ও তার উপরে) */}
          <div className="hidden md:block overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-slate-900 sticky top-0 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        filteredStudents.length > 0 &&
                        filteredStudents.every((s) =>
                          selectedIds.includes(s._id),
                        )
                      }
                    />
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    ছবি
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    আইডি
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    নাম
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    বিভাগ ও শ্রেণি
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    মোবাইল
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">
                    স্ট্যাটাস
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-4 text-slate-500 dark:text-slate-400"
                    >
                      ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-4 text-slate-500 dark:text-slate-400"
                    >
                      কোনো শিক্ষার্থী পাওয়া যায়নি!
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const details = getStudentClassDetails(student);
                    return (
                      <tr
                        key={student._id}
                        className="border-b border-gray-250 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/60"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </td>
                        <td className="p-3">
                          <img
                            src={
                              student.studentImage ||
                              student.photoUrl ||
                              "/default-avatar.png"
                            }
                            alt={student.studentNameEnglish || "Student"}
                            className="w-8 h-8 rounded-full object-cover border dark:border-slate-700"
                          />
                        </td>
                        <td className="p-3 font-medium text-gray-700 dark:text-gray-300">
                          {student.studentId || "N/A"}
                        </td>
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                          {student.studentNameBangla ||
                            student.studentNameEnglish ||
                            "N/A"}
                        </td>
                        <td className="p-3">
                          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">
                            {details.divisionName}
                          </span>
                          {details.className}
                        </td>
                        <td className="p-3">
                          {student.fatherMobile ||
                            student.guardianMobile ||
                            "N/A"}
                        </td>
                        <td className="p-3">
                          {!(student.studentImage || student.photoUrl) ? (
                            <span className="text-xs bg-red-100 dark:bg-red-950/30 text-red-650 dark:text-red-400 px-2 py-1 rounded">
                              ছবি মিসিং
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 dark:bg-green-950/30 text-green-650 dark:text-green-400 px-2 py-1 rounded">
                              ওকে
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ৫. পেজিনেশন কন্ট্রোলস */}
          <Pagination
            variant="simple"
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalStudents}
            statusText={`${totalPages} পেজ থেকে ${currentPage} নং পেজ`}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ----------------- ২. কার্ড প্রিভিউ এবং প্রিন্ট জোন ----------------- */}
      <div className="max-w-6xl mx-auto">
        <h2 className="print:hidden text-lg sm:text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          আইডি কার্ডের প্রিভিউ
        </h2>

        {studentsToPrint.length === 0 ? (
          <div className="print:hidden text-center py-8 sm:py-12 bg-white dark:bg-[#0f172a] rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-800 p-4">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-450 font-medium">
              প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox
              Select) করুন।
            </p>
          </div>
        ) : (
          <div
            ref={printAreaRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-1 sm:gap-6 print:gap-4 print:mt-3 justify-items-center"
          >
            {studentsToPrint.map((student) => (
              <IdCardFront key={student._id} student={student} />
            ))}
            <IdCardBack />
          </div>
        )}
      </div>
    </div>
  );
}
