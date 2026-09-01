"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function ExamFeePage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    
    const [studentId, setStudentId] = useState("");
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
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

    // ২. ফি তথ্য লোড করা
    const fetchFeeData = async () => {
        if (!studentId) return;
        try {
            setLoading(true);
            setError("");
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/fees?studentId=${studentId}`);
            const result = await res.json();
            
            if (result.success) {
                setFeeData(result.data);
            } else {
                setError(result.message || "ফি এর তথ্য পাওয়া যায়নি।");
            }
        } catch (err) {
            console.error("Error fetching fees:", err);
            setError("সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeData();
    }, [studentId]);

    // ৩. পেমেন্ট সম্পন্ন করার রিকোয়েস্ট (সিমুলেশন)
    const handlePayment = async (method) => {
        if (!studentId) return;
        try {
            setPaying(true);
            setError("");
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/student/pay-fee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, paymentMethod: method }),
            });
            const result = await res.json();
            
            if (result.success) {
                // পেমেন্ট সফল হলে ফি ডাটা আবার ফেচ করা হবে
                await fetchFeeData();
            } else {
                setError(result.message || "ফি পরিশোধ করতে সমস্যা হয়েছে।");
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError("পেমেন্ট সম্পন্ন করতে সার্ভারে সমস্যা হয়েছে।");
        } finally {
            setPaying(false);
        }
    };

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
                            <span className="text-2xl">💰</span>
                            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">পরীক্ষার ফি ও পেমেন্ট পোর্টাল</h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            পরীক্ষার ফি বিবরণী এবং পেমেন্ট সম্পন্নকরণ
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
                        <p className="text-sm font-medium text-slate-600">ফি লোড করা হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center shadow-xs">
                        <span className="text-3xl">⚠️</span>
                        <h3 className="font-bold text-base mt-2">ত্রুটি ঘটেছে!</h3>
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                        <button
                            onClick={fetchFeeData}
                            className="mt-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                        >
                            পুনরায় চেষ্টা করুন
                        </button>
                    </div>
                ) : !feeData ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                        <span className="text-5xl block mb-4">💳</span>
                        <h3 className="font-black text-lg text-emerald-950">ফি সংক্রান্ত তথ্য মেলেনি</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            উক্ত শিক্ষার্থীর জন্য কোনো ফি নির্ধারণ করা হয়নি বা পেমেন্ট সিস্টেম নিষ্ক্রিয় রয়েছে।
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* বাম ও মধ্য পাশ: ফি বিবরণী কার্ড */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 md:col-span-2 space-y-6">
                            <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2 border-b pb-3">
                                <span>📄</span> পেমেন্ট রশিদ ও বিল বিবরণী
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">বিবরণ</span>
                                    <span className="text-slate-900 font-bold">পরীক্ষার প্রবেশপত্র ফি</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">শিক্ষাবর্ষ</span>
                                    <span className="text-slate-950 font-bold font-mono">২০২৬-২০২৭</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">নির্ধারিত শেষ তারিখ</span>
                                    <span className="text-slate-950 font-bold text-rose-600">১০ আগস্ট, ২০২৬</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">বিল স্ট্যাটাস</span>
                                    <span>
                                        {feeData.status === "PAID" ? (
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                                                পরিশোধিত (PAID)
                                            </span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200">
                                                বকেয়া (UNPAID)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-base py-3 bg-slate-50 px-4 rounded-xl font-black">
                                    <span className="text-emerald-950">সর্বমোট প্রদেয় পরিমাণ</span>
                                    <span className="text-emerald-800 font-mono text-lg">৳ {feeData.amount || 1500}</span>
                                </div>
                            </div>
                        </div>

                        {/* ডান পাশ: পেমেন্ট অ্যাকশন বা কনফার্মেশন */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 flex flex-col justify-center">
                            {feeData.status === "PAID" ? (
                                <div className="text-center space-y-4 animate-scaleUp">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-inner border border-emerald-200">
                                        ✓
                                    </div>
                                    <div>
                                        <h3 className="font-black text-emerald-950 text-base">পেমেন্ট সম্পন্ন হয়েছে!</h3>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            আপনার ট্রানজেকশন তথ্য নিচে সংরক্ষিত আছে
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl text-left space-y-2.5">
                                        <div>
                                            <span className="block text-[9px] uppercase font-bold text-emerald-700/80">পেমেন্ট মাধ্যম</span>
                                            <span className="text-xs font-extrabold text-emerald-900">{feeData.paymentMethod || "bKash"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] uppercase font-bold text-emerald-700/80">ট্রানজেকশন আইডি</span>
                                            <span className="text-xs font-mono font-bold text-slate-900 tracking-wider bg-white px-2 py-0.5 rounded border">
                                                {feeData.transactionId || "TXN000000"}
                                            </span>
                                        </div>
                                        {feeData.paidAt && (
                                            <div>
                                                <span className="block text-[9px] uppercase font-bold text-emerald-700/80">তারিখ ও সময়</span>
                                                <span className="text-[11px] text-slate-700 font-medium">
                                                    {new Date(feeData.paidAt).toLocaleString("bn-BD")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2 text-xs font-bold text-emerald-800">
                                        প্রবেশপত্র ডাউনলোডের জন্য প্রস্তুত।
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-black text-emerald-950 text-sm">ফি পেমেন্ট করুন</h3>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            নিচের যেকোনো একটি নির্ভরযোগ্য ও দ্রুত পেমেন্ট গেটওয়ে বেছে নিন
                                        </p>
                                    </div>

                                    {paying ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-800 border-t-transparent mx-auto mb-3"></div>
                                            <p className="text-xs font-bold text-slate-600">পেমেন্ট সম্পন্ন হচ্ছে...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            
                                            {/* bKash পেমেন্ট বোতাম */}
                                            <button
                                                onClick={() => handlePayment("bKash")}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100/60 hover:-translate-y-0.5 text-pink-700 transition-all font-extrabold text-xs"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-lg">📱</span> বিকাশ (bKash)
                                                </span>
                                                <span>৳ {feeData.amount || 1500}</span>
                                            </button>

                                            {/* Nagad পেমেন্ট বোতাম */}
                                            <button
                                                onClick={() => handlePayment("Nagad")}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100/60 hover:-translate-y-0.5 text-orange-700 transition-all font-extrabold text-xs"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-lg">📱</span> নগদ (Nagad)
                                                </span>
                                                <span>৳ {feeData.amount || 1500}</span>
                                            </button>

                                            {/* Bank পেমেন্ট বোতাম */}
                                            <button
                                                onClick={() => handlePayment("Bank")}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100/60 hover:-translate-y-0.5 text-sky-700 transition-all font-extrabold text-xs"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-lg">🏛️</span> ব্যাংক (Bank Transfer)
                                                </span>
                                                <span>৳ {feeData.amount || 1500}</span>
                                            </button>

                                        </div>
                                    )}
                                    
                                    <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                                        * পেমেন্ট সম্পন্ন করার পর সিস্টেম স্বয়ংক্রিয়ভাবে প্রবেশপত্র উন্মুক্ত করে দিবে।
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
                
            </div>
        </div>
    );
}
