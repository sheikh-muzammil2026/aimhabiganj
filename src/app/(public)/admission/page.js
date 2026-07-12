// app/admission/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PublicAdmissionPage() {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [activeTab, setActiveTab] = useState('guide'); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // অ্যাডমিন ড্যাশবোর্ডের সাথে হুবহু মিল রেখে গাইডলাইন স্টেট
    const [guideSettings, setGuideSettings] = useState({
        timeline_start: "", 
        timeline_exam: "", 
        timeline_class: "",
        test_details: "",
        process_details: "", 
        fee_noorani_adm: "", 
        fee_noorani_monthly: "",
        fee_hifz_adm: "", 
        fee_hifz_monthly: "",
        fee_kitab_adm: "", 
        fee_kitab_monthly: "",
        terms: ""
    });

    // অ্যাডমিন পেজের মোডাল ডাটা ফিল্ডের সাথে মিল রেখে তৈরি ফরম স্টেট
    const [formData, setFormData] = useState({
        sessionYear: "২০২৬", // বর্তমান সেশন
        appliedDivision: "নূরানী ও নাজেরা",
        studentNameBangla: "",
        studentNameEnglish: "",
        studentNameArabic: "",
        dateOfBirth: "",
        age: "",
        gender: "ছাত্র",
        birthCertificateNo: "",
        bloodGroup: "",
        nationality: "বাংলাদেশী",
        height: "",
        weight: "",
        
        guardianNameCover: "",
        mobileNumberCover: "",
        idNumberCover: "",

        fatherNameBangla: "",
        fatherNameEnglish: "",
        fatherMobile: "",
        fatherNid: "",
        fatherProfession: "",
        fatherStatus: "জীবিত",

        motherNameBangla: "",
        motherNameEnglish: "",
        motherMobile: "",
        motherNid: "",
        motherProfession: "",
        motherStatus: "জীবিত"
    });

    // স্ক্রলিং মডিউলের রেফ (Refs)
    const timelineRef = useRef(null);
    const testRef = useRef(null);
    const processRef = useRef(null); 
    const feesRef = useRef(null);
    const termsRef = useRef(null);

    // API থেকে ভর্তি গাইডলাইন সেটিংস লোড করা
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admission-settings`);
                const data = await response.json();
                if (data.success && data.data) {
                    setGuideSettings(prev => ({ ...prev, ...data.data }));
                }
            } catch (error) {
                console.error("ভর্তি সেটিংস ডাটা লোড করতে সমস্যা:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // ইউআরএল প্যারামিটার অনুযায়ী সঠিক ট্যাবে নেওয়া ও স্ক্রল করার বাগ ফিক্সড লজিক
    useEffect(() => {
        if (sectionParam) {
            setActiveTab('guide'); 
            const timer = setTimeout(() => {
                let targetRef = null;
                if (sectionParam === 'timeline') targetRef = timelineRef;
                else if (sectionParam === 'test') targetRef = testRef;
                else if (sectionParam === 'process') targetRef = processRef;
                else if (sectionParam === 'fees') targetRef = feesRef;
                else if (sectionParam === 'terms') targetRef = termsRef;

                if (targetRef && targetRef.current) {
                    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [sectionParam]);

    // ইনপুট পরিবর্তনের হ্যান্ডলার
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // অনলাইন ভর্তি ফরম সাবমিট হ্যান্ডলার (POST API)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setSubmitMessage({ type: '', text: '' });

            // অ্যাডমিন প্যানেল ডিফল্টভাবে 'Pending' (অপেক্ষমাণ) স্ট্যাটাস রিসিভ করবে
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status: 'Pending' })
            });

            const data = await response.json();
            if (data.success) {
                setSubmitMessage({ type: 'success', text: 'আলহামদুলিল্লাহ! আপনার ভর্তি আবেদনটি সফলভাবে জমা হয়েছে। অ্যাডমিন প্যানেল থেকে যাচাই করতঃ আপনার সাথে যোগাযোগ করা হবে।' });
                // ফরম রিসেট করা
                setFormData(prev => ({
                    ...prev,
                    studentNameBangla: "", studentNameEnglish: "", studentNameArabic: "",
                    dateOfBirth: "", age: "", birthCertificateNo: "", height: "", weight: "",
                    guardianNameCover: "", mobileNumberCover: "", idNumberCover: "",
                    fatherNameBangla: "", fatherMobile: "", motherNameBangla: ""
                }));
            } else {
                setSubmitMessage({ type: 'error', text: data.message || 'আবেদন জমা দেওয়া সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।' });
            }
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'সার্ভারে সমস্যা হওয়ার কারণে আবেদনটি পাঠানো যায়নি।' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-12 text-sm font-bold text-emerald-900">⏳ ডাটা লোড হচ্ছে...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            {/* হেডার ও ট্যাব সুইচ */}
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-emerald-900">অনলাইন ভর্তি তথ্য ও নির্দেশিকা</h1>
                    <p className="text-xs text-gray-500 mt-1">ভর্তি সংক্রান্ত নিয়মাবলী জানুন এবং অনলাইনে আবেদন ফরম পূরণ করুন।</p>
                </div>

                <div className="flex bg-emerald-900/5 p-1 rounded-xl w-fit border border-emerald-900/10">
                    <button 
                        onClick={() => setActiveTab('guide')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'guide' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-900 hover:bg-emerald-800/5'}`}
                    >
                        📜 ভর্তি নির্দেশিকা
                    </button>
                    <button 
                        onClick={() => setActiveTab('form')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'form' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-900 hover:bg-emerald-800/5'}`}
                    >
                        📝 অনলাইন আবেদন ফরম
                    </button>
                </div>
            </div>

            {/* ১. ভর্তি নির্দেশিকা ট্যাব */}
            {activeTab === 'guide' && (
                <div className="space-y-6">
                    {/* সময়সূচী */}
                    <div ref={timelineRef} className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📅 ১. ভর্তির সময়সূচী</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-semibold">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="block text-xs text-gray-400 font-bold mb-1">ভর্তি ফরম বিতরণ শুরু</span>
                                <span className="text-gray-800 font-bold">{guideSettings.timeline_start || "শীঘ্রই আসছে"}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="block text-xs text-gray-400 font-bold mb-1">ভর্তি পরীক্ষার তারিখ</span>
                                <span className="text-gray-800 font-bold">{guideSettings.timeline_exam || "শীঘ্রই আসছে"}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="block text-xs text-gray-400 font-bold mb-1">ক্লাস শুরুর তারিখ</span>
                                <span className="text-gray-800 font-bold">{guideSettings.timeline_class || "শীঘ্রই আসছে"}</span>
                            </div>
                        </div>
                    </div>

                    {/* গাইডলাইন */}
                    <div ref={testRef} className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📝 ২. ভর্তি পরীক্ষা সংক্রান্ত গাইডলাইন</h3>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{guideSettings.test_details || "আপডেট করা হচ্ছে..."}</div>
                    </div>

                    {/* ভর্তি প্রক্রিয়া */}
                    <div ref={processRef} className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">⚡ ৩. ভর্তি প্রক্রিয়া</h3>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{guideSettings.process_details || "আপডেট করা হচ্ছে..."}</div>
                    </div>

                    {/* ফি স্ট্রাকচার */}
                    <div ref={feesRef} className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">💵 ৪. ভর্তি ও মাসিক ফি স্ট্রাকচার</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium">
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-2">
                                <p className="font-black text-emerald-900 border-b pb-1">নূরানী ও নাজেরা বিভাগ</p>
                                <div className="flex justify-between"><span>ভর্তি ফি:</span> <span className="font-bold">{guideSettings.fee_noorani_adm || "N/A"}</span></div>
                                <div className="flex justify-between"><span>মাসিক ফি:</span> <span className="font-bold">{guideSettings.fee_noorani_monthly || "N/A"}</span></div>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-2">
                                <p className="font-black text-emerald-900 border-b pb-1">হিফজ বিভাগ (আবাসিক)</p>
                                <div className="flex justify-between"><span>ভর্তি ফি:</span> <span className="font-bold">{guideSettings.fee_hifz_adm || "N/A"}</span></div>
                                <div className="flex justify-between"><span>মাসিক ফি:</span> <span className="font-bold">{guideSettings.fee_hifz_monthly || "N/A"}</span></div>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-2">
                                <p className="font-black text-emerald-900 border-b pb-1">কিতাব বিভাগ</p>
                                <div className="flex justify-between"><span>ভর্তি ফি:</span> <span className="font-bold">{guideSettings.fee_kitab_adm || "N/A"}</span></div>
                                <div className="flex justify-between"><span>মাসিক ফি:</span> <span className="font-bold">{guideSettings.fee_kitab_monthly || "N/A"}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* শর্তাবলী */}
                    <div ref={termsRef} className="bg-white border border-emerald-900/10 p-5 rounded-2xl shadow-xs scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📜 ৫. ভর্তির শর্তাবলী ও রুলস</h3>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{guideSettings.terms || "আপডেট করা হচ্ছে..."}</div>
                    </div>
                </div>
            )}

            {/* ২. অনলাইন আবেদন ফরম ট্যাব */}
            {activeTab === 'form' && (
                <form onSubmit={handleFormSubmit} className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-6 text-xs sm:text-sm">
                    
                    {submitMessage.text && (
                        <div className={`p-4 rounded-xl font-bold ${submitMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                            {submitMessage.text}
                        </div>
                    )}

                    {/* বিভাগ ও সেশন নির্বাচন */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-900/5 p-4 rounded-xl border border-emerald-900/10">
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 mb-1">আবেদনকৃত বিভাগ *</label>
                            <select name="appliedDivision" value={formData.appliedDivision} onChange={handleInputChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700">
                                <option value="নূরানী ও নাজেরা">নূরানী ও নাজেরা বিভাগ</option>
                                <option value="হিফজ বিভাগ">হিফজ বিভাগ (আবাসিক)</option>
                                <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-900 mb-1">শিক্ষাবর্ষ</label>
                            <input type="text" name="sessionYear" value={formData.sessionYear} disabled className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono font-bold text-gray-500" />
                        </div>
                    </div>

                    {/* অভিভাবকের কভার তথ্য কার্ড */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-800 border-b pb-1">📇 প্রধান অভিভাবকের তথ্য (কভার ডাটা)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">অভিভাবকের নাম *</label>
                                <input type="text" name="guardianNameCover" value={formData.guardianNameCover} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl" placeholder="পিতা/অন্যান্য অভিভাবক" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">প্রধান মোবাইল নম্বর *</label>
                                <input type="text" name="mobileNumberCover" value={formData.mobileNumberCover} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="উদাঃ 017xxxxxxxx" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">আইডি নম্বর (NID/অন্যান্য)</label>
                                <input type="text" name="idNumberCover" value={formData.idNumberCover} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="এনআইডি নম্বর লিখুন" />
                            </div>
                        </div>
                    </div>

                    {/* শিক্ষার্থীর ব্যক্তিগত তথ্য */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-800 border-b pb-1">👤 শিক্ষার্থীর ব্যক্তিগত বিবরণ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">ছাত্রের নাম (বাংলা) *</label>
                                <input type="text" name="studentNameBangla" value={formData.studentNameBangla} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-bold" placeholder="বাংলায় নাম লিখুন" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">Student Name (English) *</label>
                                <input type="text" name="studentNameEnglish" value={formData.studentNameEnglish} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl uppercase font-mono" placeholder="In Capital Letters" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">الاسم بالكامل (العربية)</label>
                                <input type="text" name="studentNameArabic" value={formData.studentNameArabic} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl text-right" placeholder="আরবিতে নাম (ঐচ্ছিক)" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">জন্ম তারিখ *</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">বয়স *</label>
                                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="উদাঃ ৯" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">জন্ম নিবন্ধন নম্বর *</label>
                                <input type="text" name="birthCertificateNo" value={formData.birthCertificateNo} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="১৭ ডিজিটের নম্বর" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">রক্তের গ্রুপ</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-bold font-mono">
                                    <option value="">বাছাই করুন</option>
                                    <option value="A+">A+</option><option value="A-">A-</option>
                                    <option value="B+">B+</option><option value="B-">B-</option>
                                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    <option value="O+">O+</option><option value="O-">O-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">উচ্চতা (ইঞ্চি)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="ইঞ্চিতে" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">ওজন (কেজি)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" placeholder="কেজিতে" />
                            </div>
                        </div>
                    </div>

                    {/* পিতার তথ্য */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black text-emerald-800 border-b pb-1">👨 পিতার বিবরণ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">পিতার নাম (বাংলা) *</label>
                                <input type="text" name="fatherNameBangla" value={formData.fatherNameBangla} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">Father Name (English)</label>
                                <input type="text" name="fatherNameEnglish" value={formData.fatherNameEnglish} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono uppercase" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">পিতার মোবাইল নম্বর *</label>
                                <input type="text" name="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">পিতার এনআইডি (NID)</label>
                                <input type="text" name="fatherNid" value={formData.fatherNid} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">পিতার পেশা</label>
                                <input type="text" name="fatherProfession" value={formData.fatherProfession} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl" placeholder="ব্যবসায়ী/চাকরিজীবী" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">পিতার অবস্থা</label>
                                <select name="fatherStatus" value={formData.fatherStatus} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-bold">
                                    <option value="জীবিত">জীবিত</option>
                                    <option value="মৃত">মৃত</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* মাতার তথ্য */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black text-emerald-800 border-b pb-1">👩 মাতার বিবরণ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">মাতার নাম (বাংলা) *</label>
                                <input type="text" name="motherNameBangla" value={formData.motherNameBangla} onChange={handleInputChange} required className="w-full p-2.5 border border-gray-200 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">Mother Name (English)</label>
                                <input type="text" name="motherNameEnglish" value={formData.motherNameEnglish} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono uppercase" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">মাতার মোবাইল নম্বর</label>
                                <input type="text" name="motherMobile" value={formData.motherMobile} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">মাতার এনআইডি (NID)</label>
                                <input type="text" name="motherNid" value={formData.motherNid} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-mono" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">মাতার পেশা</label>
                                <input type="text" name="motherProfession" value={formData.motherProfession} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl" placeholder="গৃহিণী" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1">মাতার অবস্থা</label>
                                <select name="motherStatus" value={formData.motherStatus} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-xl font-bold">
                                    <option value="জীবিত">জীবিত</option>
                                    <option value="মৃত">মৃত</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-emerald-800 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? "📤 আবেদন পাঠানো হচ্ছে..." : "📝 অনলাইন ভর্তি আবেদন জমা দিন"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
