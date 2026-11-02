"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import Pagination from "@/components/dashboard/Pagination";
import StudentFilterBar from "@/components/dashboard/students/StudentFilterBar";
import useUrlPagination from "@/hooks/useUrlPagination";
import {
  FEE_CATEGORIES,
  getStudentClassDetails,
  parseRollNumber,
  SESSION_YEARS,
} from "@/lib/studentUtils";

function StudentsContent() {
  const { currentPage, currentLimit, updatePaginationParams, resetPageToFirst } =
    useUrlPagination();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
  const [selectedAcademyType, setSelectedAcademyType] = useState("all"); // প্রাক-প্রাথমিক, প্রাথমিক, ইত্যাদি
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // আবাসিক, অনাবাসিক, ডে-কেয়ার
  const [selectedFeeCategory, setSelectedFeeCategory] = useState("all");

  // পেজিনেশন স্টেটসমূহ
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

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
      if (selectedFeeCategory !== "all") params.append("feeCategory", selectedFeeCategory);

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
      console.error("Error fetching students:", err);
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
    selectedFeeCategory
  ]);

  // ডেটা ফেচ করার ইফেক্ট
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // রোল নম্বর অনুযায়ী ক্রমানুসারে (১, ২, ৩...) গাণিতিক সর্টিং
  const filteredStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const rollDiff = parseRollNumber(a.roll) - parseRollNumber(b.roll);
      if (rollDiff !== 0) return rollDiff;
      return String(a.studentId || "").localeCompare(
        String(b.studentId || ""),
        undefined,
        { numeric: true },
      );
    });
  }, [students]);

  const sessionYears = SESSION_YEARS;
  const uniqueFeeCategories = FEE_CATEGORIES;

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 min-h-screen space-y-5">

      {/* ১. পেজ হেডার */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight">
            সকল শিক্ষার্থী তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 mt-0.5 font-medium">
            মাদ্রাসার সকল শিক্ষার্থীর তথ্য ও ফিল্টারিং ব্যবস্থা
          </p>
        </div>
        <div>
          <span className="inline-block px-3 py-1.5 bg-emerald-100 text-[#043e30] font-bold text-xs rounded-xl border border-emerald-200">
            মোট শিক্ষার্থী: {totalStudents} জন
          </span>
        </div>
      </div>

      {/* ২. সংক্ষিপ্ত স্ট্যাটস/পরিসংখ্যান */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            🔍
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ফিল্টারকৃত সংখ্যা</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600">{totalStudents} জন</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            📖
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">প্রি-হিফজ / হিফজ</p>
            <p className="text-xl sm:text-2xl font-black text-blue-900">
              {students.filter(s => s.divisionPreHifz?.active || s.divisionHifz?.active).length} জন
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            🏫
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">একাডেমিক বিভাগ</p>
            <p className="text-xl sm:text-2xl font-black text-purple-900">
              {students.filter(s => s.divisionAcademy?.active).length} জন
            </p>
          </div>
        </div>
      </div>

      {/* ৩. এডভান্সড ফিল্টারিং সেকশন */}
      <StudentFilterBar
        variant="card"
        theme="emerald"
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
        showType
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        showFeeCategory
        selectedFeeCategory={selectedFeeCategory}
        onFeeCategoryChange={setSelectedFeeCategory}
        feeCategories={uniqueFeeCategories}
        onResetPage={resetPageToFirst}
      />

      {/* ৪. মেইন ডাটা টেবিল */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">শিক্ষার্থীদের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium space-y-3">
            <p className="text-sm">⚠️ {error}</p>
            <button
              onClick={fetchStudents}
              className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-2">
            <p className="text-3xl">📂</p>
            <p className="text-sm sm:text-base font-semibold">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-400">আপনার নির্বাচন করা ফিল্টার পরিবর্তন করে দেখতে পারেন।</p>
          </div>
        ) : (
          <div className="w-full">
            {/* ১. ডেস্কটপ ও ট্যাবলেট ভিউ (md:block) */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#043e30] text-emerald-100 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4">শিক্ষার্থী ও আইডি</th>
                    <th className="py-3.5 px-4">বিভাগ, শ্রেণি ও টাইপ</th>
                    <th className="py-3.5 px-4">পিতার নাম</th>
                    <th className="py-3.5 px-4">যোগাযোগ মাধ্যম ও নম্বর</th>
                    <th className="py-3.5 px-4">জেলা</th>
                    <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredStudents.map((student) => {
                    const details = getStudentClassDetails(student);
                    const id = student._id?.$oid || student._id;

                    const primaryMethod = student.primaryContactMethod || "পিতা";
                    let contactNumber = student.fatherMobile || "N/A";
                    if (primaryMethod === "মাতা" && student.motherMobile) contactNumber = student.motherMobile;
                    if (primaryMethod === "অভিভাবক" && student.guardianMobile) contactNumber = student.guardianMobile;

                    return (
                      <tr key={id} className="hover:bg-emerald-50/40 transition-colors duration-150">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200 text-xs">
                              {student.studentImage ? (
                                <img src={student.studentImage} alt={student.studentNameBangla} className="w-full h-full object-cover" />
                              ) : (
                                student.studentNameBangla?.charAt(0) || "S"
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{student.studentNameBangla || "নাম বিহীন"}</p>
                              <span className="text-[10px] text-emerald-800 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
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
                          <div className="flex items-center justify-center">
                            <Link
                              href={`/dashboard/admin/students-management/edit/${id}`}
                              title="এডিট করুন"
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-all"
                            >
                              ✏️
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ২. মোবাইল ভিউ (md:hidden) - ফিল্ডগুলোকে সুন্দর কার্ড আকারে উপস্থাপন */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredStudents.map((student) => {
                const details = getStudentClassDetails(student);
                const id = student._id?.$oid || student._id;

                const primaryMethod = student.primaryContactMethod || "পিতা";
                let contactNumber = student.fatherMobile || "N/A";
                if (primaryMethod === "মাতা" && student.motherMobile) contactNumber = student.motherMobile;
                if (primaryMethod === "অভিভাবক" && student.guardianMobile) contactNumber = student.guardianMobile;

                return (
                  <div key={id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    {/* প্রোফাইল হেডার */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200 text-sm">
                          {student.studentImage ? (
                            <img src={student.studentImage} alt={student.studentNameBangla} className="w-full h-full object-cover" />
                          ) : (
                            student.studentNameBangla?.charAt(0) || "S"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{student.studentNameBangla || "নাম বিহীন"}</p>
                          <span className="text-[10px] text-emerald-800 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded-md inline-block">
                            ID: {student.studentId || "N/A"}
                          </span>
                        </div>
                      </div>
                      {/* অ্যাকশন বাটন */}
                      <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <Link
                          href={`/dashboard/admin/students-management/edit/${id}`}
                          className="p-1.5 text-slate-600 hover:bg-amber-100 rounded-md"
                          title="এডিট করুন"
                        >
                          ✏️
                        </Link>
                      </div>
                    </div>

                    {/* বিস্তারিত তথ্য বিবরণী */}
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
              itemName="students"
            />

          </div>
        )}
      </div>
    </div>
  );
}

export default function AllStudentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">লোড হচ্ছে...</div>}>
      <StudentsContent />
    </Suspense>
  );
}