"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function RoutinePage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    
    const [studentId, setStudentId] = useState("");
    const [studentProfile, setStudentProfile] = useState(null);
    const [routines, setRoutines] = useState([]);
    
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
                    // সেশন না থাকলে বা ইমেইল না থাকলে ডিফল্ট আইডি ব্যবহার করবে
                    setStudentId("04337");
                    setInputId("04337");
                    return;
                }
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/info?email=${encodeURIComponent(email)}`);
                const result = await res.json();
                
                if (result.success && result.data) {
                    setStudentProfile(result.data);
                    const id = result.data.studentId || String(result.data._id);
                    setStudentId(id);
                    setInputId(id);
                } else {
                    // ইমেইল দিয়ে না পাওয়া গেলে ডিফল্ট আইডি সেট করা হবে
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

    // ২. স্টুডেন্ট আইডি সেট হলে রুটিন লোড করা
    useEffect(() => {
        if (!studentId) return;

        const fetchRoutine = async () => {
            try {
                setLoading(true);
                setError("");
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/routine?studentId=${studentId}`);
                const result = await res.json();
                
                if (result.success) {
                    // রুটিন ডেটা সেট করা
                    setRoutines(result.data || []);
                } else {
                    setError(result.message || "রুটিন লোড করা সম্ভব হয়নি।");
                }
            } catch (err) {
                console.error("Error fetching routine:", err);
                setError("সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
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
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* টপ কার্ড: প্রোফাইল সামারি এবং স্টুডেন্ট আইডি চেঞ্জার */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📅</span>
                            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">পরীক্ষার রুটিন ও সময়সূচী</h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            চলতি পরীক্ষার বিষয়ভিত্তিক তারিখ ও কক্ষ বিন্যাস
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
                        <p className="text-sm font-medium text-slate-600">লোড করা হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
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
                ) : routines.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                        <span className="text-5xl block mb-4">📖</span>
                        <h3 className="font-black text-lg text-emerald-950">কোনো রুটিন পাওয়া যায়নি!</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            উক্ত শিক্ষার্থীর শ্রেণি বা ব্যাচের জন্য বর্তমানে কোনো পরীক্ষার রুটিন প্রকাশ করা হয়নি।
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {routines.map((exam, idx) => (
                            <div key={exam._id || idx} className="bg-white rounded-2xl shadow-xs border border-emerald-900/10 overflow-hidden">
                                {/* পরীক্ষার সাধারণ তথ্য */}
                                <div className="bg-gradient-to-r from-[#043e30] to-emerald-900 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <span className="bg-amber-400 text-[#043e30] text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1">
                                            {exam.className || exam.class} শ্রেণি
                                        </span>
                                        <h2 className="text-base sm:text-lg font-black tracking-wide">
                                            {exam.examName || "সাময়িক পরীক্ষা"} - {exam.sessionYear || exam.batch}
                                        </h2>
                                    </div>
                                    <div className="text-xs text-emerald-200/90 font-medium bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
                                        <span>প্রवेशপত্র প্রকাশ: </span>
                                        <span className={`font-bold ${exam.isAdmitPublished ? "text-amber-400" : "text-gray-300"}`}>
                                            {exam.isAdmitPublished ? "প্রকাশিত ✅" : "অপ্রকাশিত ❌"}
                                        </span>
                                    </div>
                                </div>

                                {/* রুটিন টেবিল */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 tracking-wider">বিষয়</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 tracking-wider">তারিখ</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 tracking-wider">সময়সূচী</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 tracking-wider">পরীক্ষার কক্ষ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {exam.routine && exam.routine.length > 0 ? (
                                                exam.routine.map((item, itemIdx) => (
                                                    <tr key={itemIdx} className="hover:bg-slate-50/60 transition-colors">
                                                        <td className="py-4 px-6 font-bold text-slate-900">{item.subject}</td>
                                                        <td className="py-4 px-6 text-slate-600 font-medium">
                                                            📅 {item.date}
                                                        </td>
                                                        <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                                                            ⏰ {item.time}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                                                                🚪 কক্ষ {item.room}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="py-8 text-center text-xs text-slate-400">
                                                        রুটিনের কোনো বিস্তারিত বিষয় পাওয়া যায়নি।
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
            </div>
        </div>
    );
}
