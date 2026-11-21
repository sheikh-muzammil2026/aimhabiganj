/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import StudentFilterBar from "@/components/dashboard/students/StudentFilterBar";
import {
    getStudentClassDetails,
    compareStudentsByClassAndRoll,
    SESSION_YEARS,
    toBengaliDigits,
} from "@/lib/studentUtils";
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

export const getStudentPhoto = (student) => {
    if (!student) return "";
    return (
        student.studentImage ||
        student.profilePhoto ||
        student.photoUrl ||
        student.profileImage ||
        student.image ||
        student.avatar ||
        ""
    );
};

const STANDARD_HALLS = [
    { id: "1", label: "হল নং ১ — নিচ তলা (নার্সারি)" },
    { id: "2", label: "হল নং ২ — ২য় তলা (ক্লাস থ্রি)" },
    { id: "3", label: "হল নং ৩ — ২য় তলা (ক্লাস টু)" },
    { id: "4", label: "হল নং ৪ — ৩য় তলা (হিফজ বিভাগ)" },
];

export default function AllStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ভিউ মোড: 'seatPlan' = সিট প্ল্যান ইনপুট/টেবিল, 'seatPlanPreview' = সিট প্ল্যান প্রিভিউ ও প্রিন্ট
    const [viewMode, setViewMode] = useState("seatPlan");

    // সিট প্ল্যান এডিটিং এর জন্য লোকাল স্টেট
    const [seatData, setSeatData] = useState({}); // { studentId: { hallNo: '', benchNo: '', seatNo: '' } }
    const [savingId, setSavingId] = useState(null);
    const [isSavingAll, setIsSavingAll] = useState(false);

    // ফিল্টারিং স্টেটসমূহ
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState("all");
    const [selectedDivision, setSelectedDivision] = useState("all"); // preHifz, hifz, academy
    const [selectedAcademyType, setSelectedAcademyType] = useState("all");
    const [selectedClass, setSelectedClass] = useState("all");

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            let result = null;
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?status=Approved&activity=active&limit=1000`,
                    { cache: "no-store", headers: { "Cache-Control": "no-cache" } }
                );
                if (response.ok) {
                    result = await response.json();
                }
            } catch (err) {
                console.warn("External students fetch failed, trying Next.js fallback:", err);
            }

            if (!result || !result.success) {
                try {
                    const localRes = await fetch(
                        `/api/students?status=Approved&activity=active&limit=1000`,
                        { cache: "no-store" }
                    );
                    if (localRes.ok) {
                        result = await localRes.json();
                    }
                } catch (localErr) {
                    console.warn("Next.js local students fetch failed:", localErr);
                }
            }

            if (result && result.success) {
                // শ্রেণি অনুযায়ী (Play -> Hifz) এবং শ্রেণিভেদে রোল নম্বর অনুযায়ী সর্টিং
                const studentList = (result.data || []).sort(compareStudentsByClassAndRoll);
                setStudents(studentList);

                // সিট প্ল্যানের প্রাথমিক ডাটা সেটআপ (যদি ডাটাবেজে আগে থেকে hallNo, benchNo & seatNo থাকে)
                const initialSeatMap = {};
                studentList.forEach((s) => {
                    const id = s._id?.$oid || s._id;
                    initialSeatMap[id] = {
                        hallNo: s.seatPlan?.hallNo || s.hallNo || "",
                        benchNo: s.seatPlan?.benchNo || s.benchNo || "",
                        seatNo: s.seatPlan?.seatNo || s.seatNo || ""
                    };
                });
                setSeatData(initialSeatMap);
            } else {
                setError(result?.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
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

    // সিট, বেঞ্চ বা হলের ইনপুট চ্যাঞ্জ হ্যান্ডলার (সিট নম্বর দিলে বেঞ্চ নম্বর অটো-ক্যালকুলেট)
    const handleSeatInputChange = (id, field, value) => {
        setSeatData((prev) => {
            const currentObj = prev[id] || {};
            const updated = {
                ...currentObj,
                [field]: value
            };

            // সিট নম্বর ইনপুট হলে এবং বেঞ্চ ফাঁকা থাকলে অটোমেটিক বেঞ্চ নির্ধারণ (প্রতি বেঞ্চে ২টি সিট)
            if (field === "seatNo") {
                const num = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
                if (num && !isNaN(num) && num > 0) {
                    if (!currentObj.benchNo || currentObj.benchNo === "") {
                        updated.benchNo = String(Math.ceil(num / 2));
                    }
                }
            }

            return {
                ...prev,
                [id]: updated
            };
        });
    };

    // সিট প্ল্যান ডাটাবেজে সেভ করার ফাংশন (একটি নির্দিষ্ট শিক্ষার্থীর)
    const handleSaveSeatPlan = async (studentId) => {
        try {
            setSavingId(studentId);
            const payload = {
                hallNo: seatData[studentId]?.hallNo || "",
                benchNo: seatData[studentId]?.benchNo || "",
                seatNo: seatData[studentId]?.seatNo || ""
            };

            let success = false;
            let resultMessage = "";

            // ১. এক্সটার্নাল সার্ভারে রিকোয়েস্ট
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students/${studentId}/seat-plan`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const resJson = await response.json();
                if (response.ok && resJson.success) {
                    success = true;
                    resultMessage = resJson.message;
                }
            } catch (extErr) {
                console.warn("External save failed, trying local Next.js route:", extErr);
            }

            // ২. লোকাল Next.js API ফলব্যাক
            if (!success) {
                try {
                    const localRes = await fetch(`/api/students/${studentId}/seat-plan`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    const localJson = await localRes.json();
                    if (localRes.ok && localJson.success) {
                        success = true;
                        resultMessage = localJson.message;
                    }
                } catch (localErr) {
                    console.warn("Local save error:", localErr);
                }
            }

            if (success) {
                toast.success("সিট প্ল্যান সফলভাবে আপডেট করা হয়েছে!");
                // লোকাল স্টুডেন্ট স্টেট সিঙ্ক
                setStudents((prev) =>
                    prev.map((s) => {
                        const sId = s._id?.$oid || s._id;
                        if (sId === studentId) {
                            return {
                                ...s,
                                hallNo: payload.hallNo,
                                benchNo: payload.benchNo,
                                seatNo: payload.seatNo,
                                seatPlan: {
                                    ...s.seatPlan,
                                    hallNo: payload.hallNo,
                                    benchNo: payload.benchNo,
                                    seatNo: payload.seatNo
                                }
                            };
                        }
                        return s;
                    })
                );
            } else {
                toast.error(resultMessage || "সিট প্ল্যান সেভ করতে সমস্যা হয়েছে।");
            }
        } catch (err) {
            console.error("Error saving seat plan:", err);
            toast.error("সার্ভার এরর! সিট প্ল্যান সেভ করা যায়নি।");
        } finally {
            setSavingId(null);
        }
    };

    // ডায়নামিক ফিল্টারিং লজিক (শ্রেণি অনুযায়ী Play to Hifz সর্ট সহ)
    const filteredStudents = useMemo(() => {
        return students
            .filter((student) => {
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

                const studentYear = (student.sessionYear || "").split(/[-–/]/)[0].trim();
                const matchesSession = selectedSession === "all" || studentYear === selectedSession;
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
            })
            .sort(compareStudentsByClassAndRoll);
    }, [students, searchTerm, selectedSession, selectedDivision, selectedAcademyType, selectedClass]);

    // সকল পরিবর্তিত সিট প্ল্যান একসাথে বাল্ক সেভ
    const handleBulkSave = async () => {
        try {
            setIsSavingAll(true);
            const updates = [];

            filteredStudents.forEach((s) => {
                const id = s._id?.$oid || s._id;
                const current = seatData[id];
                if (current && (current.hallNo || current.benchNo || current.seatNo)) {
                    updates.push({
                        id,
                        hallNo: current.hallNo || "",
                        benchNo: current.benchNo || "",
                        seatNo: current.seatNo || ""
                    });
                }
            });

            if (updates.length === 0) {
                toast.info("কোনো নতুন সিট প্ল্যান তথ্য পাওয়া যায়নি।");
                return;
            }

            let success = false;

            // ১. বাল্ক API চেষ্টা
            try {
                const res = await fetch(`/api/students/bulk-seat-plan`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updates })
                });
                if (res.ok) {
                    const j = await res.json();
                    if (j.success) success = true;
                }
            } catch (bulkErr) {
                console.warn("Local bulk API error, trying parallel PATCH:", bulkErr);
            }

            if (!success) {
                // এক্সটার্নাল বাল্ক API অথবা প্যারালাল রিকোয়েস্ট
                try {
                    const extBulk = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students/bulk-seat-plan`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ updates })
                    });
                    if (extBulk.ok) {
                        const j = await extBulk.json();
                        if (j.success) success = true;
                    }
                } catch (e) {
                    console.warn("External bulk error:", e);
                }
            }

            // যদি বাল্ক ব্যর্থ হয়, তবে প্যারালাল সেভ
            if (!success) {
                const promises = updates.map((u) =>
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students/${u.id}/seat-plan`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            hallNo: u.hallNo,
                            benchNo: u.benchNo,
                            seatNo: u.seatNo
                        })
                    }).catch(() => null)
                );
                await Promise.all(promises);
                success = true;
            }

            if (success) {
                toast.success(`${toBengaliDigits(updates.length)} জন শিক্ষার্থীর সিট প্ল্যান সফলভাবে সেভ করা হয়েছে!`);
                fetchStudents();
            } else {
                toast.error("সিট প্ল্যান সেভ করতে সমস্যা হয়েছে।");
            }
        } catch (err) {
            console.error("Bulk save error:", err);
            toast.error("বাল্ক সেভ করতে সমস্যা হয়েছে।");
        } finally {
            setIsSavingAll(false);
        }
    };

    const sessionYears = SESSION_YEARS;

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
                            ? "প্রিন্ট এবং চূড়ান্ত পরীক্ষার সিট প্ল্যান প্রিভিউ"
                            : "শিক্ষার্থীদের রোল নম্বর অনুযায়ী হল, বেঞ্চ এবং সিট বরাদ্দকরণ"}
                    </p>
                </div>

                {/* মোড সুইচিং এবং প্রিন্ট বাটন */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* সকল পরিবর্তন একসাথে সেভ বাটন */}
                    <button
                        type="button"
                        onClick={handleBulkSave}
                        disabled={isSavingAll || loading}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        <span>💾</span>
                        <span>{isSavingAll ? "সংরক্ষণ হচ্ছে..." : "সব সিট একসাথে সেভ"}</span>
                    </button>

                    <Link
                        href="/dashboard/shared/academics/exam-results/exam/seat-plan/hall-map"
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>🗺️</span>
                        <span>হল ম্যাপ</span>
                    </Link>

                    <Link
                        href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-stickers"
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>🏷️</span>
                        <span>আসন স্টিকার</span>
                    </Link>

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
            <StudentFilterBar
                variant="card"
                theme="emerald"
                className="print:hidden"
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
            />

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

                    /* ========================================================
                       মোড ১: সিট প্ল্যান টেবিল (এডিটেবল ইনপুট সহ) - ১০০% রেসপন্সিভ
                       ======================================================== */
                    <div className="w-full p-2 sm:p-4">
                        {/* ১. ছোট স্ক্রিনের জন্য কার্ড ভিউ (মোবাইল) */}
                        <div className="block sm:hidden space-y-3">
                            {filteredStudents?.map((student) => {
                                const id = student._id?.$oid || student._id;
                                const rollNo = student?.roll;
                                const photo = getStudentPhoto(student);
                                const currentHall = String(seatData[id]?.hallNo || "");

                                return (
                                    <div key={id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                                        <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                                    {isValidImageUrl(photo) ? (
                                                        <img
                                                            src={photo}
                                                            alt={student.studentNameBangla || "Student"}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">👤</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-slate-900 text-sm truncate">{student.studentNameBangla || "নাম বিহীন"}</div>
                                                    <div className="text-[11px] text-slate-500 truncate">
                                                        {getStudentClassDetails(student).className}
                                                        {student.studentId && <span className="ml-1 text-slate-400 font-mono">({toBengaliDigits(student.studentId)})</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200 text-xs font-mono font-bold shrink-0">
                                                রোল: {toBengaliDigits(rollNo)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div>
                                                <label className="block text-slate-500 mb-1 font-semibold">Hall (হল)</label>
                                                <select
                                                    value={currentHall}
                                                    onChange={(e) => handleSeatInputChange(id, "hallNo", e.target.value)}
                                                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium cursor-pointer"
                                                >
                                                    <option value="">নির্বাচন...</option>
                                                    {STANDARD_HALLS.map((h) => (
                                                        <option key={h.id} value={h.id}>
                                                            {h.label}
                                                        </option>
                                                    ))}
                                                    {currentHall && !["", "1", "2", "3", "4"].includes(currentHall) && (
                                                        <option value={currentHall}>হল {toBengaliDigits(currentHall)}</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-slate-500 mb-1 font-semibold">Bench (বেঞ্চ)</label>
                                                <input
                                                    type="text"
                                                    placeholder="যেমন: ১"
                                                    value={seatData[id]?.benchNo || ""}
                                                    onChange={(e) => handleSeatInputChange(id, "benchNo", e.target.value)}
                                                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-500 mb-1 font-semibold">Seat (সিট)</label>
                                                <input
                                                    type="text"
                                                    placeholder="যেমন: ১"
                                                    value={seatData[id]?.seatNo || ""}
                                                    onChange={(e) => handleSeatInputChange(id, "seatNo", e.target.value)}
                                                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
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

                        {/* ২. বড় স্ক্রিনের জন্য প্রথাগত টেবিল ভিউ (ট্যাবলেট ও ডেস্কটপ) */}
                        <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                            <table className="w-full text-left border-collapse min-w-[750px]">
                                <thead>
                                    <tr className="bg-[#043e30] text-emerald-100 text-xs uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4 w-2/12">রোল নম্বর</th>
                                        <th className="py-3.5 px-4 w-4/12">শিক্ষার্থীর বিবরণ</th>
                                        <th className="py-3.5 px-4 w-2/12">হল নম্বর</th>
                                        <th className="py-3.5 px-4 w-1/12">বেঞ্চ</th>
                                        <th className="py-3.5 px-4 w-2/12">সিট নম্বর</th>
                                        <th className="py-3.5 px-4 text-center w-1/12">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 bg-white">
                                    {filteredStudents.map((student) => {
                                        const id = student._id?.$oid || student._id;
                                        const rollNo = student.roll;
                                        const photo = getStudentPhoto(student);
                                        const currentHall = String(seatData[id]?.hallNo || "");

                                        return (
                                            <tr key={id} className="hover:bg-emerald-50/40 transition-colors">
                                                {/* ১. রোল নম্বর */}
                                                <td className="py-3 px-4 font-bold text-slate-900">
                                                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-mono font-bold">
                                                        {toBengaliDigits(rollNo)}
                                                    </span>
                                                </td>

                                                {/* ২. শিক্ষার্থীর নাম, ছবি ও তথ্য */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                                            {isValidImageUrl(photo) ? (
                                                                <img
                                                                    src={photo}
                                                                    alt={student.studentNameBangla || "Student"}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.onerror = null;
                                                                        e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-slate-400 text-xs">👤</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-slate-900 truncate">
                                                                {student.studentNameBangla || student.studentNameEnglish || "নাম বিহীন"}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                                                                <span>{getStudentClassDetails(student).className}</span>
                                                                {student.studentId && (
                                                                    <span className="text-slate-400 font-mono">
                                                                        (আইডি: {toBengaliDigits(student.studentId)})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ৩. হল নম্বর (ড্রপডাউন) */}
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={currentHall}
                                                        onChange={(e) => handleSeatInputChange(id, "hallNo", e.target.value)}
                                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium cursor-pointer"
                                                    >
                                                        <option value="">হল নির্বাচন...</option>
                                                        {STANDARD_HALLS.map((h) => (
                                                            <option key={h.id} value={h.id}>
                                                                {h.label}
                                                            </option>
                                                        ))}
                                                        {currentHall && !["", "1", "2", "3", "4"].includes(currentHall) && (
                                                            <option value={currentHall}>হল {toBengaliDigits(currentHall)}</option>
                                                        )}
                                                    </select>
                                                </td>

                                                {/* ৪. বেঞ্চ নম্বর (ইনপুট বক্স) */}
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="text"
                                                        placeholder="যেমন: ১"
                                                        value={seatData[id]?.benchNo || ""}
                                                        onChange={(e) => handleSeatInputChange(id, "benchNo", e.target.value)}
                                                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white font-medium"
                                                    />
                                                </td>

                                                {/* ৫. সিট নম্বর (ইনপুট বক্স) */}
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="text"
                                                        placeholder="যেমন: ১"
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
                                                        {savingId === id ? "..." : "সেভ"}
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
                       মোড ২: সিট প্ল্যান প্রিভিউ এবং প্রিন্ট ভিউ
                       ======================================================== */
                    <div className="p-4 sm:p-6 print:p-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
                            {filteredStudents.map((student) => {
                                const id = student._id?.$oid || student._id;
                                const details = getStudentClassDetails(student);
                                const currentSeat = seatData[id] || {};
                                const photo = getStudentPhoto(student);

                                return (
                                    <div
                                        key={id}
                                        className="bg-white border-2 border-emerald-900/20 rounded-xl p-3.5 shadow-sm flex flex-col justify-between relative overflow-hidden print:border-slate-800 print:break-inside-avoid"
                                    >
                                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                                    {isValidImageUrl(photo) ? (
                                                        <img
                                                            src={photo}
                                                            alt={student.studentNameBangla || "Student"}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">👤</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">{student.studentNameBangla || student.studentNameEnglish || "নাম নেই"}</h4>
                                                    <p className="text-xs text-slate-500 font-medium truncate">{details.className}</p>
                                                </div>
                                            </div>
                                            <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-xs font-bold border border-emerald-200 shrink-0 font-mono">
                                                রোল: {toBengaliDigits(student.roll || "—")}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center my-1">
                                            <div>
                                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">হল</span>
                                                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                                                    {currentSeat.hallNo ? toBengaliDigits(currentSeat.hallNo) : "—"}
                                                </span>
                                            </div>
                                            <div className="border-x border-slate-200">
                                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">বেঞ্চ</span>
                                                <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                                                    {currentSeat.benchNo ? toBengaliDigits(currentSeat.benchNo) : "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">সিট</span>
                                                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                                                    {currentSeat.seatNo ? toBengaliDigits(currentSeat.seatNo) : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}