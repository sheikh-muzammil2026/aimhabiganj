"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AllStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ভিউ মোড: 'seatPlan' = সিট প্ল্যান ইনপুট/টেবিল, 'seatPlanPreview' = সিট প্ল্যান প্রিভিউ ও প্রিন্ট
    const [viewMode, setViewMode] = useState("seatPlan");

    // সিট প্ল্যান এডিটিং এর জন্য লোকাল স্টেট
    const [seatData, setSeatData] = useState({}); // { studentId: { hallNo: '', seatNo: '' } }
    const [savingId, setSavingId] = useState(null);

    // ফিল্টারিং স্টেটসমূহ
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState("all");
    const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
    const [selectedAcademyType, setSelectedAcademyType] = useState("all");
    const [selectedClass, setSelectedClass] = useState("all");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students?status=Approved`);
            const result = await response.json();

            if (result.success) {
                const studentList = result.data || [];
                setStudents(studentList);

                // সিট প্ল্যানের প্রাথমিক ডাটা সেটআপ (যদি ডাটাবেজে আগে থেকে hallNo & seatNo থাকে)
                const initialSeatMap = {};
                studentList.forEach((s) => {
                    const id = s._id?.$oid || s._id;
                    initialSeatMap[id] = {
                        hallNo: s.seatPlan?.hallNo || s.hallNo || "",
                        seatNo: s.seatPlan?.seatNo || s.seatNo || ""
                    };
                });
                setSeatData(initialSeatMap);
            } else {
                setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
        } finally {
            setLoading(false);
        }
    };

    // সিট বা হলের ইনপুট চ্যাঞ্জ হ্যান্ডলার
    const handleSeatInputChange = (id, field, value) => {
        setSeatData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    // সিট প্ল্যান ডাটাবেজে সেভ করার ফাংশন
    const handleSaveSeatPlan = async (studentId) => {
        try {
            setSavingId(studentId);
            const payload = {
                hallNo: seatData[studentId]?.hallNo || "",
                seatNo: seatData[studentId]?.seatNo || ""
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students/${studentId}/seat-plan`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("সিট প্ল্যান সফলভাবে আপডেট করা হয়েছে!");
            } else {
                alert(result.message || "সিট প্ল্যান সেভ করতে সমস্যা হয়েছে।");
            }
        } catch (err) {
            console.error("Error saving seat plan:", err);
            alert("সার্ভার এরর! সিট প্ল্যান সেভ করা যায়নি।");
        } finally {
            setSavingId(null);
        }
    };

    // একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
    const getAcademyClasses = (academyType) => {
        if (academyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
        if (academyType === "প্রাথমিক") return ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম"];
        if (academyType === "মাধ্যমিক") return ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
        if (academyType === "উচ্চমাধ্যমিক") return ["১১শ শ্রেণি", "১২শ শ্রেণি"];
        return [];
    };

    // বিভাগ অনুযায়ী ক্লাসের ড্রপডাউন অপশন
    const getClassOptions = () => {
        if (selectedDivision === "preHifz") return ["কায়দা/আমপারা", "নাজেরা"];
        if (selectedDivision === "hifz") return ["সবক", "শুনানি"];
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

    // শিক্ষার্থীর একটিভ বিভাগ, ক্লাস ও টাইপ বের করার হেলপার
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

    // ডায়নামিক ফিল্টারিং লজিক
    const filteredStudents = students.filter((student) => {
        const details = getStudentClassDetails(student);

        const matchesSearch =
            (student.studentNameBangla && student.studentNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.studentNameEnglish && student.studentNameEnglish.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.studentId && student.studentId.toString().includes(searchTerm)) ||
            (student.fatherNameBangla && student.fatherNameBangla.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.fatherMobile && student.fatherMobile.includes(searchTerm)) ||
            (student.guardianMobile && student.guardianMobile.includes(searchTerm)) ||
            (student.currentAddress?.district && student.currentAddress.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.permanentAddress?.district && student.permanentAddress.district.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSession = selectedSession === "all" || student.sessionYear === selectedSession;
        const matchesDivision = selectedDivision === "all" || details.divisionKey === selectedDivision;
        const matchesAcademyType = selectedAcademyType === "all" || details.academyType === selectedAcademyType;
        const matchesClass = selectedClass === "all" || details.className === selectedClass;

        return (
            matchesSearch &&
            matchesSession &&
            matchesDivision &&
            matchesAcademyType &&
            matchesClass
        );
    });

    const sessionYears = [
        "২০২৬", "২০২৫", "২০২৪",
        "২০২৩", "২০২২", "২০২১",
        "২০২০", "২০১৯", "২০১৮"
    ];

    // প্রিন্ট ফাংশন
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 min-h-screen space-y-5">

            {/* ১. পেজ হেডার এবং ভিউ টগল (সিট প্ল্যান / সিট প্ল্যান প্রিভিউ) */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight">
                        {viewMode === "seatPlanPreview" ? "পরীক্ষা/হল সিট প্ল্যান প্রিভিউ" : "পরীক্ষা/হল সিট প্ল্যান ম্যানেজমেন্ট"}
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-700/80 mt-0.5 font-medium">
                        {viewMode === "seatPlanPreview"
                            ? "প্রিন্ট এবং চূড়ান্ত পরীক্ষার সিট প্ল্যান প্রিভিউ"
                            : "শিক্ষার্থীদের রোল নম্বর অনুযায়ী হল এবং সিট বরাদ্দকরণ"}
                    </p>
                </div>

                {/* মোড সুইচিং এবং প্রিন্ট বাটন */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setViewMode("seatPlan")}
                            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${viewMode === "seatPlan"
                                ? "bg-[#043e30] text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            🪑 সিট প্ল্যান
                        </button>
                        <button
                            onClick={() => setViewMode("seatPlanPreview")}
                            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${viewMode === "seatPlanPreview"
                                ? "bg-[#043e30] text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            👁️ সিট প্ল্যান প্রিভিউ
                        </button>
                    </div>

                    {/* প্রিন্ট বাটন (শুধু প্রিভিউ মোডে দেখাবে) */}
                    {viewMode === "seatPlanPreview" && (
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            🖨️ প্রিন্ট করুন
                        </button>
                    )}
                </div>
            </div>

            {/* ৩. এডভান্সড ফিল্টারিং সেকশন */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-900/10 shadow-xs space-y-3 print:hidden">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">খুঁজুন এবং ফিল্টার করুন:</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
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
                </div>
            </div>

            {/* ৪. মেইন ডাটা টেবিল (সিট প্ল্যান / সিট প্ল্যান প্রিভিউ) */}
            <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs overflow-hidden print:border-none print:shadow-none">
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
                            পুনরায় চেষ্টা করুন
                        </button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 space-y-2">
                        <p className="text-3xl">📂</p>
                        <p className="text-sm sm:text-base font-semibold">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি!</p>
                        <p className="text-xs text-slate-400">আপনার নির্বাচন করা ফিল্টার পরিবর্তন করে দেখতে পারেন।</p>
                    </div>
                ) : viewMode === "seatPlan" ? (
{/* ========================================================
   মোড ১: সিট প্ল্যান টেবিল (এডিটেবল ইনপুট সহ) - ১০০% রেসপন্সিভ
   ======================================================== */}
<div className="w-full p-2 sm:p-4">
    {/* ১. ছোট স্ক্রিনের জন্য কার্ড ভিউ (মোবাইল) */}
    <div className="block sm:hidden space-y-3">
        {filteredStudents.map((student, idx) => {
            const id = student._id?.$oid || student._id;
            const rollNo = student.officeUse?.rollNumber || student.studentId || (idx + 1);

            return (
                <div key={id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                    <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                        <div>
                            <div className="font-bold text-slate-900 text-sm">{student.studentNameBangla || "নাম বিহীন"}</div>
                            <div className="text-[11px] text-slate-500">
                                {getStudentClassDetails(student).className}
                            </div>
                        </div>
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-mono font-bold shrink-0">
                            রোল: {rollNo}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <label className="block text-slate-500 mb-1 font-semibold">Hall No (হল নম্বর)</label>
                            <input
                                type="text"
                                placeholder="যেমন: হল-১"
                                value={seatData[id]?.hallNo || ""}
                                onChange={(e) => handleSeatInputChange(id, "hallNo", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-500 mb-1 font-semibold">Seat No (সিট নম্বর)</label>
                            <input
                                type="text"
                                placeholder="যেমন: B-12"
                                value={seatData[id]?.seatNo || ""}
                                onChange={(e) => handleSeatInputChange(id, "seatNo", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                            />
                        </div>
                    </div>

                    <div className="pt-1">
                        <button
                            onClick={() => handleSaveSeatPlan(id)}
                            disabled={savingId === id}
                            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer text-center"
                        >
                            {savingId === id ? "সেভ হচ্ছে..." : "সেভ করুন"}
                        </button>
                    </div>
                </div>
            );
        })}
    </div>

    {/* ২. বড় স্ক্রিনের জন্য প্রথাগত টেবিল ভিউ (ট্যাবলেট ও ডেস্কটপ) */}
    <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
                <tr className="bg-[#043e30] text-emerald-100 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4 w-1/6">Roll Number (রোল নম্বর)</th>
                    <th className="py-3.5 px-4 w-2/6">Name (শিক্ষার্থীর নাম)</th>
                    <th className="py-3.5 px-4 w-1/6">Hall No (হল নম্বর)</th>
                    <th className="py-3.5 px-4 w-1/6">Seat No (সিট নম্বর)</th>
                    <th className="py-3.5 px-4 text-center w-1/6">অ্যাকশন</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 bg-white">
                {filteredStudents.map((student, idx) => {
                    const id = student._id?.$oid || student._id;
            const rollNo = student.roll || student.studentId || (idx + 1);

                    return (
                        <tr key={id} className="hover:bg-emerald-50/40 transition-colors">
                            {/* ১. রোল নম্বর */}
                            <td className="py-3 px-4 font-bold text-slate-900">
                                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-mono">
                                    {rollNo}
                                </span>
                            </td>

                            {/* ২. শিক্ষার্থীর নাম ও তথ্য */}
                            <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{student.studentNameBangla || "নাম বিহীন"}</div>
                                <div className="text-[11px] text-slate-500">
                                    {getStudentClassDetails(student).className}
                                </div>
                            </td>

                            {/* ৩. হল নম্বর (ইনপুট বক্স) */}
                            <td className="py-3 px-4">
                                <input
                                    type="text"
                                    placeholder="যেমন: হল-১"
                                    value={seatData[id]?.hallNo || ""}
                                    onChange={(e) => handleSeatInputChange(id, "hallNo", e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                                />
                            </td>

                            {/* ৪. সিট নম্বর (ইনপুট বক্স) */}
                            <td className="py-3 px-4">
                                <input
                                    type="text"
                                    placeholder="যেমন: B-12"
                                    value={seatData[id]?.seatNo || ""}
                                    onChange={(e) => handleSeatInputChange(id, "seatNo", e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                                />
                            </td>

                            {/* সেভ বাটন */}
                            <td className="py-3 px-4 text-center">
                                <button
                                    onClick={() => handleSaveSeatPlan(id)}
                                    disabled={savingId === id}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {savingId === id ? "সেভ হচ্ছে..." : "সেভ করুন"}
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</div>
                ) : (

                    /* ========================================================
                       মোড ২: সিট প্ল্যান প্রিভিউ (প্রিন্ট ফ্রেন্ডলি ভিউ)
                       ======================================================== */
                    <div className="w-full overflow-x-auto p-4 print:p-0">

                        {/* Header with separate Logo and Banner */}
                        <div className="flex items-center justify-center mb-4 border-b-4 border-double border-gray-800 pb-2">
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center">
                                <Image
                                    src={"/aimlogo1.png"}
                                    alt="Institution Logo"
                                    width={200}
                                    height={200}
                                    quality={100}
                                    priority
                                    className="w-full h-full object-cover scale-[1.05] transform-gpu"
                                />
                            </div>
                            <div className="flex-grow text-center">
                                <Image
                                    src={"/banner_routine.png"}
                                    alt="Institution Banner"
                                    width={2000}
                                    height={400}
                                    quality={100}
                                    priority
                                    className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                                />
                            </div>
                        </div>

                        {/* পরীক্ষার শিরোনাম ও তথ্য সেকশন */}
                        <div className="text-center mb-5">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                পরীক্ষার সিট প্ল্যান
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                                মোট শিক্ষার্থী: {filteredStudents.length} জন
                            </p>
                        </div>

                        {/* প্রিভিউ টেবিল */}
                        <table className="w-full text-left border-collapse border border-slate-300 print:border-black">
                            <thead>
                                <tr className="bg-[#043e30] text-emerald-100 text-xs uppercase tracking-wider font-bold print:bg-slate-200 print:text-black">
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">রোল নম্বর</th>
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">আইডি</th>
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">শিক্ষার্থীর নাম</th>
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">শ্রেণি</th>
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">হল নম্বর</th>
                                    <th className="py-3 px-4 border border-slate-300 print:border-black">সিট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-800">
                                {filteredStudents.map((student, idx) => {
                                    const id = student._id?.$oid || student._id;
                                    const rollNo = student.roll || student.studentId || (idx + 1);
                                    const details = getStudentClassDetails(student);

                                    return (
                                        <tr key={id} className="hover:bg-slate-50 transition-colors print:hover:bg-transparent">
                                            <td className="py-2.5 px-4 font-mono font-bold border border-slate-300 print:border-black">
                                                {rollNo}
                                            </td>
                                            <td className="py-2.5 px-4 font-mono font-bold border border-slate-300 print:border-black">
                                                {student.studentId}
                                            </td>
                                            <td className="py-2.5 px-4 font-bold border border-slate-300 print:border-black">
                                                {student.studentNameBangla || "নাম বিহীন"}
                                            </td>
                                            <td className="py-2.5 px-4 text-xs border border-slate-300 print:border-black">
                                                {details.className}
                                            </td>
                                            <td className="py-2.5 px-4 font-semibold border border-slate-300 print:border-black">
                                                {seatData[id]?.hallNo || "N/A"}
                                            </td>
                                            <td className="py-2.5 px-4 font-semibold border border-slate-300 print:border-black">
                                                {seatData[id]?.seatNo || "N/A"}
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


/**
 * 1) seat_plan theke info ene table er sticker bananu . 
 * 2) seat_plan er moddhe ager bochorer sokol info bosanu
 * 3) seat_plan er moddhe hall 5 ta bananu. 
 * 4) hifj er sokol students er seat plane niye asa.
 * 5) ager bochorer result database e rakha
 * 6) admit-card bosanu.
 * */ 
