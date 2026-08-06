"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AdmitCardPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    
    const [studentId, setStudentId] = useState("");
    const [admitData, setAdmitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [inputId, setInputId] = useState("");
    const [showIdInput, setShowIdInput] = useState(false);

    // ১. সেশন থেকে ইমেইল অনুযায়ী স্টুডেন্ট ডাটা খোঁজা
    useEffect(() => {
        if (sessionPending) return;
        
        const fetchStudentInfo = async () => {
            try {
                setLoading(true);
                setError("");
                
                const email = session?.user?.email;
                if (!email) {
                    setStudentId("04337");
                    setInputId("04337");
                    return;
                }
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/info?email=${encodeURIComponent(email)}`);
                const result = await res.json();
                
                if (result.success && result.data) {
                    const id = result.data.studentId || String(result.data._id);
                    setStudentId(id);
                    setInputId(id);
                } else {
                    setStudentId("04337");
                    setInputId("04337");
                }
            } catch (err) {
                console.error("Error fetching student profile:", err);
                setStudentId("04337");
                setInputId("04337");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentInfo();
    }, [session, sessionPending]);

    // ২. প্রবেশপত্র ডাটা ও পারমিশন চেক লোড করা
    useEffect(() => {
        if (!studentId) return;

        const fetchAdmitCardStatus = async () => {
            try {
                setLoading(true);
                setError("");
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/admit-card?studentId=${studentId}`);
                const result = await res.json();
                
                if (result.success) {
                    setAdmitData(result);
                } else {
                    setError(result.message || "প্রবেশপত্রের তথ্য লোড করা সম্ভব হয়নি।");
                }
            } catch (err) {
                console.error("Error fetching admit card:", err);
                setError("সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmitCardStatus();
    }, [studentId]);

    const handlePrint = () => {
        window.print();
    };

    const handleIdChangeSubmit = (e) => {
        e.preventDefault();
        if (inputId.trim()) {
            setStudentId(inputId.trim());
            setShowIdInput(false);
        }
    };

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-800 print:bg-white print:p-0">
            <div className="max-w-4xl mx-auto space-y-6 print:space-y-0 print:max-w-full">
                
                {/* টপ কার্ড: প্রোফাইল সামারি এবং স্টুডেন্ট আইডি চেঞ্জার (প্রিন্ট করার সময় হাইড থাকবে) */}
                <div className="print:hidden bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎟️</span>
                            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">পরীক্ষার প্রবেশপত্র (Admit Card)</h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            পরীক্ষার্থীর ব্যক্তিগত ডিজিটাল প্রবেশপত্র যাচাই ও মুদ্রণ
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-bold text-slate-400">পরীক্ষার্থী আইডি</span>
                                <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    {studentId || "N/A"}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowIdInput(!showIdInput)}
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                            >
                                আইডি পরিবর্তন করুন
                            </button>
                        </div>

                        {showIdInput && (
                            <form onSubmit={handleIdChangeSubmit} className="flex gap-2 mt-2 w-full max-w-xs animate-fadeIn">
                                <input
                                    type="text"
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                    placeholder="স্টুডেন্ট আইডি লিখুন"
                                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-900 transition-colors"
                                >
                                    নিশ্চিত
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* মেইন কনটেন্ট এরিয়া */}
                {loading ? (
                    <div className="print:hidden flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-900 border-t-transparent mb-4"></div>
                        <p className="text-sm font-medium text-slate-600">তথ্য যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
                    </div>
                ) : error ? (
                    <div className="print:hidden bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center shadow-xs">
                        <span className="text-3xl">⚠️</span>
                        <h3 className="font-bold text-base mt-2">ত্রুটি ঘটেছে!</h3>
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                        <button
                            onClick={() => setStudentId(studentId)}
                            className="mt-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                        >
                            পুনরায় চেষ্টা করুন
                        </button>
                    </div>
                ) : admitData ? (
                    <div className="space-y-6 print:space-y-0">
                        
                        {/* কন্ডিশন ১: পেমেন্ট বকেয়া থাকলে */}
                        {!admitData.isPaid && (
                            <div className="print:hidden bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-6 md:p-8 text-center space-y-4 shadow-sm">
                                <span className="text-5xl block">💳</span>
                                <div className="space-y-1">
                                    <h3 className="font-black text-lg text-amber-950">পরীক্ষার ফি বকেয়া রয়েছে!</h3>
                                    <p className="text-xs text-amber-800 max-w-lg mx-auto">
                                        প্রবেশপত্র ডাউনলোড বা মুদ্রণ করতে হলে প্রথমে আপনার বকেয়া পরীক্ষা ফি পরিশোধ করতে হবে। অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন।
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href="/dashboard/exam-fee"
                                        className="inline-block bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                                    >
                                        💳 ফি পরিশোধ করুন
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* কন্ডিশন ২: প্রবেশপত্র অপ্রকাশিত থাকলে */}
                        {admitData.isPaid && !admitData.isAdmitPublished && (
                            <div className="print:hidden bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl p-8 text-center space-y-3 shadow-xs">
                                <span className="text-5xl block">⏳</span>
                                <h3 className="font-black text-lg text-slate-900">প্রবেশপত্র প্রকাশ করা হয়নি</h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                    প্রবেশপত্র এখনও প্রশাসন কর্তৃক প্রকাশিত হয়নি। দয়া করে পরীক্ষার কিছুদিন পূর্বে পুনরায় পরীক্ষা করুন।
                                </p>
                            </div>
                        )}

                        {/* কন্ডিশন ৩: পেমেন্ট পরিশোধিত এবং প্রবেশপত্র প্রকাশিত হলে */}
                        {admitData.isPaid && admitData.isAdmitPublished && admitData.studentData && (
                            <div className="space-y-6 print:space-y-0">
                                
                                {/* প্রিন্ট অ্যাকশন বাটন (প্রিন্ট করার সময় হাইড থাকবে) */}
                                <div className="print:hidden flex justify-end">
                                    <button
                                        onClick={handlePrint}
                                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                                    >
                                        <span>🖨️</span> প্রবেশপত্র প্রিন্ট করুন
                                    </button>
                                </div>

                                {/* প্রিন্ট ফ্রেন্ডলি প্রবেশপত্র লেআউট */}
                                <div className="flex justify-center">
                                    <div 
                                        id="printable-admit-card"
                                        className="w-[210mm] min-h-[148mm] bg-white border-4 border-double border-emerald-800 p-8 relative font-sans text-gray-800 shadow-md print:shadow-none print:m-0 print:border-4 print:border-emerald-800 print:w-full print:min-h-0"
                                    >
                                        {/* ওয়াটারমার্ক */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.05]">
                                            <img
                                                src="/aimlogo1.png"
                                                alt="Watermark Logo"
                                                className="w-[280px] h-[280px] object-contain"
                                            />
                                        </div>

                                        {/* হেডার সেকশন */}
                                        <div className="flex justify-between items-center border-b-2 border-emerald-900 pb-4 relative z-10">
                                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-150 p-0.5">
                                                <img
                                                    src="/aimlogo1.png"
                                                    alt="AIM Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="text-center flex-1 px-4">
                                                <h1 className="text-lg font-bold text-emerald-950 tracking-wide font-serif">
                                                    مدرسة السلام النموذجية
                                                </h1>
                                                <h2 className="text-xl sm:text-2xl font-black text-emerald-900 leading-tight">
                                                    আস-সালাম আইডিয়াল মাদরাসা (AIM)
                                                </h2>
                                                <h3 className="text-xs font-bold text-slate-500 tracking-wider">
                                                    As-Salam Ideal Madrasah (AiM For Ultimate Success)
                                                </h3>
                                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                                    হবিগঞ্জ, বাংলাদেশ | ইমেইল: info@aimhabiganj.edu.bd
                                                </p>
                                            </div>

                                            <div className="w-20 h-24 border-2 border-emerald-800 p-0.5 bg-slate-50 overflow-hidden flex items-center justify-center">
                                                {admitData.studentData.photoUrl ? (
                                                    <img
                                                        src={admitData.studentData.photoUrl}
                                                        alt="Student"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[9px] text-slate-400 font-bold text-center">ছবি যুক্ত নেই</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* এডমিট কার্ড টাইটেল ও পরীক্ষা নাম */}
                                        <div className="relative z-10 my-4 text-center space-y-1">
                                            <span className="bg-emerald-50 text-emerald-900 text-xs font-black px-5 py-1 rounded-full border border-emerald-300 inline-block uppercase tracking-wider">
                                                পরীক্ষার প্রবেশপত্র (ADMIT CARD)
                                            </span>
                                            <p className="text-xs font-bold text-slate-800">
                                                শিক্ষাবর্ষ: {admitData.studentData.sessionYear || "২০২৬-২০২৭"}
                                            </p>
                                        </div>

                                        {/* পরীক্ষার্থীর বিস্তারিত তথ্য গ্রিড */}
                                        <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-3 my-5 text-xs font-bold border-t border-b border-slate-200 py-4 px-2 bg-slate-50/50">
                                            <div className="flex">
                                                <span className="w-28 text-slate-500">পরীক্ষার্থীর নাম:</span>
                                                <span className="text-slate-900">{admitData.studentData.studentNameBangla || admitData.studentData.studentNameEnglish}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-20 text-slate-500">শিক্ষার্থী আইডি:</span>
                                                <span className="font-mono text-emerald-800">{admitData.studentData.studentId}</span>
                                            </div>

                                            <div className="flex">
                                                <span className="w-28 text-slate-500">পিতার নাম:</span>
                                                <span className="text-slate-900">{admitData.studentData.fatherNameBangla || "N/A"}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-20 text-slate-500">রোল নং:</span>
                                                <span className="text-slate-900 font-mono">{admitData.studentData.roll}</span>
                                            </div>

                                            <div className="flex">
                                                <span className="w-28 text-slate-500">শ্রেণি:</span>
                                                <span className="text-emerald-900">{admitData.studentData.class}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-20 text-slate-500">পরীক্ষা হল:</span>
                                                <span className="text-slate-950 font-bold">{admitData.studentData.building || "প্রধান ভবন"} (কক্ষ: {admitData.studentData.hallNo || "১০২"})</span>
                                            </div>

                                            <div className="flex col-span-2">
                                                <span className="w-28 text-slate-500">আসন নম্বর:</span>
                                                <span className="text-amber-600 font-black font-mono">{admitData.studentData.seatNo || "১২"}</span>
                                            </div>
                                        </div>

                                        {/* স্বাক্ষর সেকশন */}
                                        <div className="relative z-10 flex justify-between items-end mt-10 px-6 text-[10px] font-bold text-slate-600">
                                            <div className="text-center w-36">
                                                <div className="h-8 border-b border-dashed border-slate-400 mb-1"></div>
                                                <p>শ্রেণি শিক্ষকের স্বাক্ষর</p>
                                            </div>
                                            <div className="text-center w-36">
                                                <div className="h-8 border-b border-dashed border-slate-400 mb-1"></div>
                                                <p>পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর</p>
                                            </div>
                                            <div className="text-center w-36">
                                                <div className="h-8 border-b border-dashed border-slate-400 mb-1"></div>
                                                <p>অধ্যক্ষ / সুপারিনটেনডেন্ট</p>
                                            </div>
                                        </div>

                                        {/* ফুটার বার্তা */}
                                        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[9px] text-slate-400 font-semibold leading-relaxed">
                                            * প্রবেশপত্রটি কোনো প্রকার ঘষামাজা ব্যতীত পরীক্ষার হলে প্রদর্শন করতে হবে।
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                ) : (
                    <div className="print:hidden bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                        <span className="text-5xl block mb-4">📭</span>
                        <h3 className="font-black text-lg text-slate-800">কোনো তথ্য নেই</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            অনুরোধকৃত প্রবেশপত্র সংক্রান্ত কোনো ডাটা খুঁজে পাওয়া যায়নি।
                        </p>
                    </div>
                )}
                
            </div>
        </div>
    );
}
