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
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      // সার্ভার থেকে এপিআই এর মাধ্যমে ডেটা আনা
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students?status=Approved`);
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

  // শিক্ষার্থী কোন বিভাগে এবং কোন ক্লাসে তা বের করার হেলপার ফাংশন
  const getStudentClassInfo = (student) => {
    if (student.divisionPreHifz?.active) {
      return { division: "প্রাক-হিফজ", className: student.divisionPreHifz.class || "আমপারা/কায়দা" };
    }
    if (student.divisionHifz?.active) {
      return { division: "হিফজ", className: student.divisionHifz.class || "হিফজ বিভাগ" };
    }
    if (student.divisionAcademy?.active) {
      return { division: "একাডেমিক/জেনারেল", className: student.divisionAcademy.class || "একাডেমিক" };
    }
    return { division: "অন্যান্য", className: student.officeUse?.recommendedClass || "N/A" };
  };

  // ডায়নামিক ফিল্টারিং লজিক
  const filteredStudents = students.filter((student) => {
    const classInfo = getStudentClassInfo(student);

    // সার্চ ফিল্টার (নাম, আইডি, পিতার নাম, পিতা/অভিভাবকের মোবাইল, গ্রাম)
    const matchesSearch =
      (student.studentNameBangla && student.studentNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentNameEnglish && student.studentNameEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentId && student.studentId.toString().includes(searchTerm)) ||
      (student.fatherNameBangla && student.fatherNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.fatherMobile && student.fatherMobile.includes(searchTerm)) ||
      (student.guardianMobile && student.guardianMobile.includes(searchTerm)) ||
      (student.currentAddress?.village && student.currentAddress.village.toLowerCase().includes(searchTerm.toLowerCase()));

    // সেশন ফিল্টার
    const matchesSession =
      selectedSession === "all" || student.sessionYear === selectedSession;

    // বিভাগ ফিল্টার
    const matchesDivision =
      selectedDivision === "all" || classInfo.division === selectedDivision;

    // ক্লাস ফিল্টার
    const matchesClass =
      selectedClass === "all" || classInfo.className === selectedClass;

    // ব্লাড গ্রুপ ফিল্টার
    const matchesBloodGroup =
      selectedBloodGroup === "all" || student.bloodGroup === selectedBloodGroup;

    return matchesSearch && matchesSession && matchesDivision && matchesClass && matchesBloodGroup;
  });

  // ডায়নামিক ফিল্টার অপশন তৈরির জন্য ইউনিক ভ্যালু লিস্ট
  const uniqueSessions = [...new Set(students.map((s) => s.sessionYear).filter(Boolean))];
  const uniqueClasses = [...new Set(students.map((s) => getStudentClassInfo(s).className).filter(Boolean))];
  const uniqueBloodGroups = [...new Set(students.map((s) => s.bloodGroup).filter(Boolean))];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
      
      {/* ১. পেজ হেডার */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#043e30] tracking-tight">
            সকল শিক্ষার্থী তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 mt-1 font-medium">
            মাদ্রাসার অনুমোদিত শিক্ষার্থীদের সম্পূর্ণ তথ্য ও ফিল্টারিং সিস্টেম
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-[#043e30] font-bold text-xs rounded-lg border border-emerald-200">
            মোট স্টুডেন্ট: {students.length} জন
          </span>
        </div>
      </div>

      {/* ২. সংক্ষিপ্ত স্ট্যাটস/পরিসংখ্যান */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">মোট অনুমোদিত</p>
            <p className="text-2xl font-black text-[#043e30]">{students.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
            🔍
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ফিল্টারকৃত সংখ্যা</p>
            <p className="text-2xl font-black text-amber-600">{filteredStudents.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl">
            📖
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">প্রাক-হিফজ / হিফজ</p>
            <p className="text-2xl font-black text-blue-900">
              {students.filter(s => s.divisionPreHifz?.active || s.divisionHifz?.active).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl">
            🏫
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">একাডেমিক বিভাগ</p>
            <p className="text-2xl font-black text-purple-900">
              {students.filter(s => s.divisionAcademy?.active).length}
            </p>
          </div>
        </div>
      </div>

      {/* ৩. এডভান্সড ফিল্টারিং সেকশন */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">খুঁজুন এবং ফিল্টার করুন:</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* নাম / আইডি / ফোন নাম্বার দিয়ে সার্চ */}
          <div className="lg:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="নাম, আইডি, পিতার নাম, মোবাইল বা গ্রাম..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* সেশন ফিল্টার */}
          <div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-slate-700"
            >
              <option value="all">সকল সেশন/শিক্ষাবর্ষ</option>
              {uniqueSessions.map((session, idx) => (
                <option key={idx} value={session}>{session}</option>
              ))}
            </select>
          </div>

          {/* বিভাগ ফিল্টার */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-slate-700"
            >
              <option value="all">সকল বিভাগ</option>
              <option value="প্রাক-হিফজ">প্রাক-হিফজ</option>
              <option value="হিফজ">হিফজ</option>
              <option value="একাডেমিক/জেনারেল">একাডেমিক/জেনারেল</option>
            </select>
          </div>

          {/* শ্রেণী ফিল্টার */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-slate-700"
            >
              <option value="all">সকল শ্রেণী</option>
              {uniqueClasses.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* ব্লাড গ্রুপ ফিল্টার */}
          <div>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-slate-700"
            >
              <option value="all">সকল ব্লাড গ্রুপ</option>
              {uniqueBloodGroups.map((bg, idx) => (
                <option key={idx} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ৪. মেইন ডাটা টেবিল */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-600">শিক্ষার্থীদের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium space-y-3">
            <p>⚠️ {error}</p>
            <button
              onClick={fetchStudents}
              className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="text-3xl">📂</p>
            <p className="text-base font-semibold">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-400">আপনার নির্বাচন করা ফিল্টার পরিবর্তন করে দেখতে পারেন।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#043e30] text-emerald-100 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-4 sm:px-6">শিক্ষার্থী ও আইডি</th>
                  <th className="py-4 px-4">বিভাগ ও শ্রেণী</th>
                  <th className="py-4 px-4">পিতার নাম ও মোবাইল</th>
                  <th className="py-4 px-4">ঠিকানা (গ্রাম/উপজেলা)</th>
                  <th className="py-4 px-4">সেশন</th>
                  <th className="py-4 px-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                {filteredStudents.map((student) => {
                  const classInfo = getStudentClassInfo(student);
                  const id = student._id?.$oid || student._id;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-emerald-50/50 transition-colors duration-150"
                    >
                      {/* শিক্ষার্থী ছবি, নাম ও আইডি */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200">
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
                            <span className="text-[10px] text-emerald-800 font-extrabold bg-amber-400/20 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                              ID: {student.studentId || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* বিভাগ ও শ্রেণী */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {classInfo.className}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {classInfo.division}
                        </div>
                      </td>

                      {/* পিতার নাম ও মোবাইল */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {student.fatherNameBangla || student.guardianNameAbsentParents || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500">
                          📞 {student.fatherMobile && student.fatherMobile !== "0" ? student.fatherMobile : student.guardianMobile || "N/A"}
                        </div>
                      </td>

                      {/* গ্রাম ও ঠিকানা */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {student.currentAddress?.village ? (
                          <div>
                            <p className="font-semibold text-slate-800">{student.currentAddress.village}</p>
                            <p className="text-[11px] text-slate-400">{student.currentAddress.thana || student.currentAddress.district}</p>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {/* সেশন বছর */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                          {student.sessionYear || "N/A"}
                        </span>
                      </td>

                      {/* অ্যাকশন বাটন */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/students/${id}`}
                            title="বিস্তারিত প্রোফাইল"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all"
                          >
                            👁️
                          </Link>
                          <Link
                            href={`/dashboard/admin/admission/edit/${id}`}
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
