"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AllStudentsPage() {
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/students?status=Approved");
      const result = await response.json();

      if (result.success) {
        setStudents(result.data || []);
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  // একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
  const getAcademyClasses = (academyType) => {
    if (academyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
    if (academyType === "প্রাথমিক") return ["১ম শ্রেণি", "২য় শ্রেণি", "৩য় শ্রেণি", "৪র্থ শ্রেণি", "৫ম শ্রেণি"];
    if (academyType === "মাধ্যমিক") return ["৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি", "নবম শ্রেণি", "দশম শ্রেণি"];
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
        "১ম শ্রেণি", "২য় শ্রেণি", "৩য় শ্রেণি", "৪র্থ শ্রেণি", "৫ম শ্রেণি",
        "৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি", "নবম শ্রেণি", "দশম শ্রেণি",
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
        academyType: ""
      };
    }
    if (student.divisionHifz?.active) {
      return {
        divisionKey: "hifz",
        divisionName: "হিফজ",
        className: student.divisionHifz.class || "N/A",
        type: student.divisionHifz.type || "N/A",
        academyType: ""
      };
    }
    if (student.divisionAcademy?.active) {
      return {
        divisionKey: "academy",
        divisionName: "একাডেমিক",
        className: student.divisionAcademy.class || "N/A",
        type: student.divisionAcademy.type || "N/A",
        academyType: student.divisionAcademy.academyType || ""
      };
    }
    return {
      divisionKey: "none",
      divisionName: "অন্যান্য",
      className: student.officeUse?.recommendedClass || "N/A",
      type: "N/A",
      academyType: ""
    };
  };

  // ডায়নামিক ফিল্টারিং লজিক
  const filteredStudents = students.filter((student) => {
    const details = getStudentClassDetails(student);

    // সার্চ ফিল্টার (নাম, আইডি, পিতার নাম, মোবাইল, জেলা)
    const matchesSearch =
      (student.studentNameBangla && student.studentNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentNameEnglish && student.studentNameEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentId && student.studentId.toString().includes(searchTerm)) ||
      (student.fatherNameBangla && student.fatherNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.fatherMobile && student.fatherMobile.includes(searchTerm)) ||
      (student.guardianMobile && student.guardianMobile.includes(searchTerm)) ||
      (student.currentAddress?.district && student.currentAddress.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.permanentAddress?.district && student.permanentAddress.district.toLowerCase().includes(searchTerm.toLowerCase()));

    // সেশন বছর ফিল্টার
    const matchesSession =
      selectedSession === "all" || student.sessionYear === selectedSession;

    // বিভাগ ফিল্টার
    const matchesDivision =
      selectedDivision === "all" || details.divisionKey === selectedDivision;

    // একাডেমি টাইপ ফিল্টার (শুধুমাত্র একাডেমি সিলেক্ট করা থাকলে)
    const matchesAcademyType =
      selectedAcademyType === "all" || details.academyType === selectedAcademyType;

    // ক্লাস ফিল্টার
    const matchesClass =
      selectedClass === "all" || details.className === selectedClass;

    // টাইপ ফিল্টার (আবাসিক/অনাবাসিক/ডে-কেয়ার)
    const matchesType =
      selectedType === "all" || details.type === selectedType;

    // ফি ক্যাটাগরি ফিল্টার
    const matchesFeeCategory =
      selectedFeeCategory === "all" || (student.officeUse?.feeCategory || "") === selectedFeeCategory;

    return (
      matchesSearch &&
      matchesSession &&
      matchesDivision &&
      matchesAcademyType &&
      matchesClass &&
      matchesType &&
      matchesFeeCategory
    );
  });

  // ২০১৮ থেকে ২০২৬ পর্যন্ত সেশন বছরের লিস্ট
  const sessionYears = [
    "২০২৬-২০২৭", "২০২৫-২০২৬", "২০২৪-২০২৫", 
    "২০২৩-২০২৪", "২০২২-২০২৩", "২০২১-২০২২", 
    "২০২০-২০২১", "২০১৯-২০২০", "২০১৮-২০১৯"
  ];

  // ইউনিক ফি ক্যাটাগরি লিস্ট
  const uniqueFeeCategories = [...new Set(students.map((s) => s.officeUse?.feeCategory).filter(Boolean))];

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
            মোট শিক্ষার্থী: {students.length} জন
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
            <p className="text-xl sm:text-2xl font-black text-amber-600">{filteredStudents.length} জন</p>
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-900/10 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">খুঁজুন এবং ফিল্টার করুন:</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* নাম / আইডি / পিতা / জেলা সার্চ */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="নাম, আইডি, পিতার নাম, মোবাইল বা জেলা..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* সেশন বছর ফিল্টার (২০১৮-২০২৬) */}
          <div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল শিক্ষাবর্ষ (২০১৮ - ২০২৬)</option>
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
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল বিভাগ</option>
              <option value="preHifz">প্রি-হিফজ</option>
              <option value="hifz">হিফজ</option>
              <option value="academy">একাডেমিক</option>
            </select>
          </div>

          {/* একাডেমি টাইপ ফিল্টার (শুধুমাত্র একাডেমি সিলেক্ট করলে দেখাবে) */}
          {selectedDivision === "academy" && (
            <div>
              <select
                value={selectedAcademyType}
                onChange={(e) => {
                  setSelectedAcademyType(e.target.value);
                  setSelectedClass("all");
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700"
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
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={selectedDivision === "all"}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">
                {selectedDivision === "all" ? "প্রথমে বিভাগ নির্বাচন করুন" : "সকল শ্রেণি"}
              </option>
              {getClassOptions().map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* টাইপ ফিল্টার (আবাসিক/অনাবাসিক/ডে-কেয়ার) */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল টাইপ (আবাসিক/অনাবাসিক)</option>
              <option value="আবাসিক">আবাসিক</option>
              <option value="অনাবাসিক">অনাবাসিক</option>
              <option value="ডে-কেয়ার">ডে-কেয়ার</option>
            </select>
          </div>

          {/* ফি ক্যাটাগরি ফিল্টার */}
          <div>
            <select
              value={selectedFeeCategory}
              onChange={(e) => setSelectedFeeCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-slate-700"
            >
              <option value="all">সকল ফি ক্যাটাগরি</option>
              {uniqueFeeCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#043e30] text-emerald-100 text-[11px] sm:text-xs uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">শিক্ষার্থী ও আইডি</th>
                  <th className="py-3.5 px-4">বিভাগ, শ্রেণি ও টাইপ</th>
                  <th className="py-3.5 px-4">পিতার নাম</th>
                  <th className="py-3.5 px-4">যোগাযোগ মাধ্যম ও নম্বর</th>
                  <th className="py-3.5 px-4">জেলা</th>
                  <th className="py-3.5 px-4">সেশন</th>
                  <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                {filteredStudents.map((student) => {
                  const details = getStudentClassDetails(student);
                  const id = student._id?.$oid || student._id;

                  // প্রাথমিক যোগাযোগের মোবাইল বের করা
                  const primaryMethod = student.primaryContactMethod || "পিতা";
                  let contactNumber = student.fatherMobile || "N/A";
                  if (primaryMethod === "মাতা" && student.motherMobile) contactNumber = student.motherMobile;
                  if (primaryMethod === "অভিভাবক" && student.guardianMobile) contactNumber = student.guardianMobile;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-emerald-50/40 transition-colors duration-150"
                    >
                      {/* শিক্ষার্থী ছবি, নাম ও আইডি */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200 text-xs">
                            {student.studentImage ? (
                              <img
                                src={student.studentImage}
                                alt={student.studentNameBangla}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              student.studentNameBangla?.charAt(0) || "S"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {student.studentNameBangla || "নাম বিহীন"}
                            </p>
                            <span className="text-[10px] text-emerald-800 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                              ID: {student.studentId || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* বিভাগ, শ্রেণি ও টাইপ */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {details.className}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {details.divisionName} {details.type !== "N/A" && `(${details.type})`}
                        </div>
                      </td>

                      {/* পিতার নাম */}
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {student.fatherNameBangla || "N/A"}
                      </td>

                      {/* যোগাযোগ মাধ্যম ও মোবাইল */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          📞 {contactNumber !== "0" ? contactNumber : "N/A"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          মাধ্যম: {primaryMethod}
                        </div>
                      </td>

                      {/* জেলা */}
                      <td className="py-3 px-4 text-slate-600">
                        {student.currentAddress?.district || student.permanentAddress?.district || "N/A"}
                      </td>

                      {/* সেশন বছর */}
                      <td className="py-3 px-4">
                        <span className="inline-block text-[10px] sm:text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                          {student.sessionYear || "N/A"}
                        </span>
                      </td>

                      {/* অ্যাকশন বাটন */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/dashboard/students/${id}`}
                            title="বিস্তারিত প্রোফাইল"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all"
                          >
                            👁️
                          </Link>
                          <Link
                            href={`/dashboard/students/edit/${id}`}
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
        )}
      </div>
    </div>
  );
}
