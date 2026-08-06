"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function SeatPlanPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    
    const [studentId, setStudentId] = useState("");
    const [seatData, setSeatData] = useState(null);
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

    // ২. সীট প্ল্যান ডাটা লোড করা
    useEffect(() => {
        if (!studentId) return;

        const fetchSeatPlan = async () => {
            try {
                setLoading(true);
                setError("");
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/seat-plan?studentId=${studentId}`);
                const result = await res.json();
                
                if (result.success) {
                    setSeatData(result.data);
                } else {
                    setError(result.message || "সীট প্ল্যান লোড করা সম্ভব হয়নি।");
                }
            } catch (err) {
                console.error("Error fetching seat plan:", err);
                setError("সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।");
            } finally {
                setLoading(false);
            }
        };

        fetchSeatPlan();
    }, [studentId]);

    const handleIdChangeSubmit = (e) => {
        e.preventDefault();
        if (inputId.trim()) {
            setStudentId(inputId.trim());
            setShowIdInput(false);
        }
    };

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-800">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* টপ কার্ড: প্রোফাইল সামারি এবং স্টুডেন্ট আইডি চেঞ্জার */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🪑</span>
                            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">পরীক্ষার সীট প্ল্যান ও হল বরাদ্দ</h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            পরীক্ষার্থীর বসার স্থান, হল নম্বর এবং রোল নম্বর বিন্যাস
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
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-900 border-t-transparent mb-4"></div>
                        <p className="text-sm font-medium text-slate-600">সীট প্ল্যান লোড করা হচ্ছে...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center shadow-xs">
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
                ) : !seatData ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                        <span className="text-5xl block mb-4">🪑</span>
                        <h3 className="font-black text-lg text-emerald-950">সীট প্ল্যান মেলেনি!</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            উক্ত পরীক্ষার্থীর জন্য এখনও কোনো সীট প্ল্যান তৈরি বা আসন বরাদ্দ করা হয়নি।
                        </p>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto animate-scaleUp">
                        {/* সীট কার্ড ডিজাইন */}
                        <div className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-900/10 shadow-lg shadow-slate-200/50">
                            
                            {/* মাদ্রাসা হেডার */}
                            <div className="bg-[#043e30] p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-emerald-800/40 rounded-full blur-xl"></div>
                                <div className="absolute left-0 bottom-0 -translate-x-1/4 translate-y-1/4 w-32 h-32 bg-amber-500/20 rounded-full blur-xl"></div>
                                
                                <div className="relative z-10 space-y-1">
                                    <h2 className="text-lg font-black tracking-wide text-amber-400">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h2>
                                    <p className="text-[10px] text-emerald-200/90 font-bold uppercase tracking-widest">পরীক্ষা হল কার্ড (Exam Hall Card)</p>
                                </div>
                            </div>

                            {/* কার্ডের মূল অংশ */}
                            <div className="p-8 space-y-6 relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <img src="/aimlogo1.png" alt="watermark" className="w-56 h-56 object-contain" />
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    
                                    {/* ভবন */}
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center text-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">ভবনের নাম</span>
                                        <span className="text-sm sm:text-base font-black text-emerald-900">{seatData.building || "প্রধান ভবন"}</span>
                                    </div>

                                    {/* কক্ষ */}
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center text-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">কক্ষ নম্বর</span>
                                        <span className="text-sm sm:text-base font-black text-emerald-900 font-mono">🚪 {seatData.room || "N/A"}</span>
                                    </div>

                                    {/* রোল */}
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center text-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">রোল নম্বর</span>
                                        <span className="text-sm sm:text-base font-black text-emerald-900 font-mono">{seatData.roll || "N/A"}</span>
                                    </div>

                                    {/* আসন */}
                                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-center text-center">
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">আসন নম্বর</span>
                                        <span className="text-base sm:text-lg font-black text-amber-500 font-mono">🪑 {seatData.seatNo || "N/A"}</span>
                                    </div>

                                </div>

                                {/* নির্দেশনাবলী */}
                                <div className="border-t border-dashed border-slate-200 pt-6">
                                    <h4 className="text-xs font-bold text-emerald-950 mb-2">⚠️ পরীক্ষার্থীর জন্য গুরুত্বপূর্ণ নির্দেশনাবলী:</h4>
                                    <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 font-medium leading-relaxed">
                                        <li>পরীক্ষা শুরুর অন্তত ১৫ মিনিট পূর্বে নির্ধারিত আসন গ্রহণ করতে হবে।</li>
                                        <li>পরীক্ষার হলে প্রবেশপত্র (Admit Card) সাথে আনা বাধ্যতামূলক।</li>
                                        <li>মোবাইল ফোন, ডিজিটাল ঘড়ি বা যেকোনো ইলেকট্রনিক ডিভাইস বহন সম্পূর্ণ নিষিদ্ধ।</li>
                                    </ul>
                                </div>
                            </div>
                            
                            {/* কার্ডের বটম ডিজাইন */}
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-[10px] font-bold text-slate-400 tracking-wider">
                                আইডেন্টিফিকেশন আইডি: {seatData.studentId || studentId}
                            </div>

                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}
