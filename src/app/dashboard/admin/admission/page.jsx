// app/admin/admission/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AdminAdmissionDashboard() {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [activeTab, setActiveTab] = useState('requests');
    const [admissionRequests, setAdmissionRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionMessage, setActionMessage] = useState('');

    // পাবলিক পেজের সাথে মিল রেখে এবং process_details সহ স্টেট সাজানো হয়েছে
    const [guideSettings, setGuideSettings] = useState({
        timeline_start: "",
        timeline_exam: "",
        timeline_class: "",
        test_details: "",
        process_details: "", // নতুন সংযোজিত ফিল্ড
        fee_noorani_adm: "",
        fee_noorani_monthly: "",
        fee_hifz_adm: "",
        fee_hifz_monthly: "",
        fee_kitab_adm: "",
        fee_kitab_monthly: "",
        terms: ""
    });

    // স্ক্রলিং এর জন্য রেফ (Refs)
    const timelineRef = useRef(null);
    const testRef = useRef(null);
    const processRef = useRef(null); // নতুন রেফ
    const feesRef = useRef(null);
    const termsRef = useRef(null);

    // ডাটা লোড করার ফাংশন
    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            // ১. ভর্তি আবেদনপত্র নিয়ে আসা
            const resApps = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions`);
            const dataApps = await resApps.json();
            if (dataApps.success) setAdmissionRequests(dataApps.data);

            // ২. গাইডলাইন সেটিংস নিয়ে আসা
            const resSett = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admission-settings`);
            const dataSett = await resSett.json();
            if (dataSett.success && dataSett.data) {
                setGuideSettings(prev => ({
                    ...prev,
                    ...dataSett.data
                }));
            }
        } catch (error) {
            console.error("ডাটা লোড করতে সমস্যা:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // সাইডবার ক্লিক লিসেনার ও স্ক্রলিং লজিক
    useEffect(() => {
        if (sectionParam) {
            setActiveTab('settings');
            setTimeout(() => {
                if (sectionParam === 'timeline' && timelineRef.current) {
                    timelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (sectionParam === 'test' && testRef.current) {
                    testRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (sectionParam === 'process' && processRef.current) {
                    processRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (sectionParam === 'fees' && feesRef.current) {
                    feesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (sectionParam === 'terms' && termsRef.current) {
                    termsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }, [sectionParam]);

    // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার (PATCH)
    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();

            if (data.success) {
                toast.success("📢 ভর্তি নির্দেশিকা সফলভাবে আপডেট হয়েছে!")
                setAdmissionRequests(prev =>
                    prev.map(req => req._id === id ? { ...req, status: newStatus } : req)
                );
                if (selectedRequest && selectedRequest._id === id) {
                    setSelectedRequest(prev => ({ ...prev, status: newStatus }));
                }
                setActionMessage(data.message);
                setTimeout(() => setActionMessage(''), 4000);
            }
        } catch (error) {
            toast.error("স্ট্যাটাস আপডেট করা যায়নি।");
        }
    };

    // আবেদনপত্র চিরতরে মুছে ফেলার হ্যান্ডলার (DELETE API)
    const deleteAdmissionRequest = async (id) => {
        if (confirm("আপনি কি নিশ্চিত যে এই ভর্তি আবেদনপত্রটি চিরতরে মুছে ফেলতে চান?")) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.success) {
                    // স্টেট থেকে ডাটা রিমুভ করা
                    setAdmissionRequests(prev => prev.filter(req => req._id !== id));
                    setActionMessage(data.message || "আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।");
                    setTimeout(() => setActionMessage(''), 4000);
                } else {
                    toast.error(data.message || "মুছে ফেলা সম্ভব হয়নি।");
                }
            } catch (error) {
                console.error("ডিলিট করতে সমস্যা:", error);
                toast.error("সার্ভারে সমস্যা হওয়ার কারণে আবেদনটি মুছা যায়নি।");
            }
        }
    };

    // গাইডলাইন সেভ হ্যান্ডলার (PUT)
    const handleGuideSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admission-settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guideSettings)
            });
            const data = await response.json();
            if (data.success) {
                setActionMessage(data.message || "সেটিংস সফলভাবে আপডেট করা হয়েছে!");
                setTimeout(() => setActionMessage(''), 4000);
            }
        } catch (error) {
            toast.error("সেটিংস সেভ করা যায়নি।");
        }
    };

    if (isLoading) {
        return <div className="text-center p-12 text-sm font-bold text-emerald-900">⏳ ডাটা লোড হচ্ছে...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-emerald-900">ভর্তি ও আবেদনপত্র ব্যবস্থাপনা</h1>
                    <p className="text-xs text-gray-500 mt-1">ভর্তি গাইডলাইন পরিবর্তন করুন এবং শিক্ষার্থীদের আবেদনসমূহ যাচাই করুন।</p>
                </div>

                <div className="flex bg-emerald-900/5 p-1 rounded-xl w-fit border border-emerald-900/10">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'requests' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-900 hover:bg-emerald-800/5'}`}
                    >
                        📥 আবেদন রিকোয়েস্ট ({admissionRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-900 hover:bg-emerald-800/5'}`}
                    >
                        ⚙️ ভর্তি গাইডলাইন সেটিং
                    </button>
                </div>
            </div>

            {actionMessage && (
                <div className="p-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs transition-all">
                    📢 {actionMessage}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white border border-emerald-900/10 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-700">জমা হওয়া অনলাইন ভর্তি ফরমের তালিকা</h3>
                    </div>

                    <div className="w-full">
                        <table className="w-full text-left text-xs sm:text-sm text-gray-600 block md:table">
                            <thead className="hidden md:table-header-group">
                                <tr className="border-b border-gray-200 bg-emerald-900/5 text-emerald-900 font-bold">
                                    <th className="p-4">আবেদন আইডি</th>
                                    <th className="p-4">ছাত্রের নাম</th>
                                    <th className="p-4">পিতার নাম & মোবাইল</th>
                                    <th className="p-4">আবেদনকৃত বিভাগ</th>
                                    <th className="p-4 text-center">স্ট্যাটাস</th>
                                    <th className="p-4 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium block md:table-row-group">
                                {admissionRequests.map((req) => (
                                    <tr
                                        key={req._id}
                                        className="hover:bg-gray-50/70 transition-colors block md:table-row p-4 md:p-0 space-y-3 md:space-y-0 border-b border-gray-100 md:border-b-0"
                                    >
                                        <td className="p-0 md:p-4 font-mono font-bold text-gray-900 flex justify-between md:table-cell items-center before:content-['আবেদন_আইডি:'] before:md:hidden before:font-sans before:text-gray-400 before:text-[11px]">
                                            <span className="bg-gray-100 md:bg-transparent px-2 py-0.5 md:p-0 rounded-sm">
                                                ...{req._id?.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="p-0 md:p-4 flex justify-between md:table-cell items-start before:content-['ছাত্রের_নাম:'] before:md:hidden before:text-gray-400 before:text-[11px] before:pt-1">
                                            <div className="text-right md:text-left">
                                                <div className="font-bold text-gray-800">{req.studentNameBangla}</div>
                                                <div className="text-[11px] text-gray-400 font-normal">{req.studentNameEnglish}</div>
                                            </div>
                                        </td>
                                        <td className="p-0 md:p-4 flex justify-between md:table-cell items-start before:content-['পিতা_&_মোবাইল:'] before:md:hidden before:text-gray-400 before:text-[11px]">
                                            <div className="text-right md:text-left">
                                                <div>{req.fatherNameBangla}</div>
                                                <div className="text-gray-400 font-mono text-[11px]">{req?.fatherMobile}</div>
                                            </div>
                                        </td>
                                        <td className="p-0 md:p-4 flex justify-between md:table-cell items-center before:content-['বিভাগ:'] before:md:hidden before:text-gray-400 before:text-[11px]">
                                            <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200/50">
                                                {req.appliedDivision}
                                            </span>
                                        </td>
                                        <td className="p-0 md:p-4 flex justify-between md:table-cell items-center md:text-center before:content-['স্ট্যাটাস:'] before:md:hidden before:text-gray-400 before:text-[11px]">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider
                                                ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {req.status === 'Approved' ? 'অনুমোদিত' : req.status === 'Rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
                                            </span>
                                        </td>
                                        <td className="p-0 md:p-4 pt-2 md:pt-4 flex flex-wrap gap-2 md:table-cell md:text-right md:space-x-1 sm:space-x-2 whitespace-nowrap justify-end border-t border-dashed border-gray-100 md:border-t-0">
                                            <button onClick={() => setSelectedRequest(req)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer flex-1 md:flex-none text-center">👁️ ভিউ</button>
                                            <button disabled={req.status === 'Approved'} onClick={() => updateStatus(req._id, 'Approved')} className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-30 cursor-pointer flex-1 md:flex-none text-center">✓ অ্যাপ্রুভ</button>
                                            <button disabled={req.status === 'Rejected'} onClick={() => updateStatus(req._id, 'Rejected')} className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-30 cursor-pointer flex-1 md:flex-none text-center">✕ রিজেক্ট</button>
                                            <button onClick={() => deleteAdmissionRequest(req._id)} className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer flex-1 md:flex-none text-center">🗑️ ডিলিট</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <form onSubmit={handleGuideSubmit} className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-6">

                    {/* ১. ভর্তির সময়সূচী */}
                    <div ref={timelineRef} className="scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📅 ১. ভর্তির সময়সূচী মডিউল</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ভর্তি ফরম বিতরণ শুরু</label>
                                <input type="text" value={guideSettings.timeline_start} onChange={(e) => setGuideSettings({ ...guideSettings, timeline_start: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-emerald-600" placeholder="উদাঃ ০১ শাওয়াল থেকে" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ভর্তি পরীক্ষার তারিখ</label>
                                <input type="text" value={guideSettings.timeline_exam} onChange={(e) => setGuideSettings({ ...guideSettings, timeline_exam: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-emerald-600" placeholder="উদাঃ ১০ শাওয়াল, সকাল ৯:০০ টা" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ক্লাস শুরুর তারিখ</label>
                                <input type="text" value={guideSettings.timeline_class} onChange={(e) => setGuideSettings({ ...guideSettings, timeline_class: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-emerald-600" placeholder="উদাঃ ১৫ শাওয়াল থেকে ইনশাالله" />
                            </div>
                        </div>
                    </div>

                    {/* ২. ভর্তি পরীক্ষা সংক্রান্ত */}
                    <div ref={testRef} className="scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📝 ২. ভর্তি পরীক্ষা সংক্রান্ত গাইডলাইন</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">পরীক্ষার সংক্ষিপ্ত নিয়ম</label>
                            <textarea rows={3} value={guideSettings.test_details} onChange={(e) => setGuideSettings({ ...guideSettings, test_details: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600" placeholder="পরীক্ষার সিলেবাস বা নিয়মাবলী এখানে লিখুন..." />
                        </div>
                    </div>

                    {/* ⚡ নতুন সংযোজিত: ৩. ভর্তি প্রক্রিয়া (Admission Process) */}
                    <div ref={processRef} className="scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">⚡ ৩. ভর্তি প্রক্রিয়া </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ভর্তির ধাপসমূহ (নতুন লাইন তৈরি করতে Enter চাপুন)</label>
                            <textarea rows={3} value={guideSettings.process_details} onChange={(e) => setGuideSettings({ ...guideSettings, process_details: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600" placeholder="১. অনলাইন বা অফিস থেকে ফরম সংগ্রহ করুন...&#10;২. অফিসে জমা দিন..." />
                        </div>
                    </div>

                    {/* ৪. ভর্তি ও মাসিক ফি স্ট্রাকচার */}
                    <div ref={feesRef} className="scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">💵 ৪. ভর্তি ও মাসিক ফি স্ট্রাকচার</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* নূরানী ও নাজেরা */}
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-3">
                                <p className="text-xs font-black text-emerald-900 border-b pb-1">নূরানী ও নাজেরা বিভাগ</p>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">ভর্তি ফি</label>
                                    <input type="text" value={guideSettings.fee_noorani_adm} onChange={(e) => setGuideSettings({ ...guideSettings, fee_noorani_adm: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" placeholder="১,৫০০/-" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">মাসিক ফি</label>
                                    <input type="text" value={guideSettings.fee_noorani_monthly} onChange={(e) => setGuideSettings({ ...guideSettings, fee_noorani_monthly: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs" placeholder="৫০০/-" />
                                </div>
                            </div>

                            {/* হিফজ বিভাগ */}
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-3">
                                <p className="text-xs font-black text-emerald-900 border-b pb-1">হিফজ বিভাগ (আবাসিক)</p>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">ভর্তি ফি</label>
                                    <input type="text" value={guideSettings.fee_hifz_adm} onChange={(e) => setGuideSettings({ ...guideSettings, fee_hifz_adm: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" placeholder="৩,০০০/-" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">মাসিক ফি</label>
                                    <input type="text" value={guideSettings.fee_hifz_monthly} onChange={(e) => setGuideSettings({ ...guideSettings, fee_hifz_monthly: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs" placeholder="৩,৫০০/-" />
                                </div>
                            </div>

                            {/* কিতাব বিভাগ */}
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/60 space-y-3">
                                <p className="text-xs font-black text-emerald-900 border-b pb-1">কিতাব বিভাগ</p>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">ভর্তি ফি</label>
                                    <input type="text" value={guideSettings.fee_kitab_adm} onChange={(e) => setGuideSettings({ ...guideSettings, fee_kitab_adm: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" placeholder="২,৫০০/-" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 font-bold">মাসিক ফি</label>
                                    <input type="text" value={guideSettings.fee_kitab_monthly} onChange={(e) => setGuideSettings({ ...guideSettings, fee_kitab_monthly: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-xs" placeholder="৮০০/-" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ৫. ভর্তির শর্তাবলী */}
                    <div ref={termsRef} className="scroll-mt-6">
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📜 ৫. ভর্তির শর্তাবলী ও রুলস</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">শর্তসমূহ (নতুন লাইন তৈরি করতে Enter চাপুন)</label>
                            <textarea rows={4} value={guideSettings.terms} onChange={(e) => setGuideSettings({ ...guideSettings, terms: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-emerald-600" placeholder="প্রতিটি শর্ত আলাদা লাইনে লিখুন..." />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-[#043e30] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer">
                            💾 গাইডলাইন ডাটা আপডেট করুন
                        </button>
                    </div>
                </form>
            )}

            {/* ৪. বিস্তারিত ভিউ প্রোফাইল মোডাল */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        {/* মোডাল হেডার */}
                        <div className="p-4 sm:p-5 border-b border-emerald-900/10 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                            <div>
                                <h3 className="text-base sm:text-lg font-black tracking-wide">📝 অনলাইন ভর্তি আবেদনপত্রের বিস্তারিত বিবরণ</h3>
                                <p className="text-[11px] text-emerald-200/90 font-mono mt-0.5">
                                    সেশন: {selectedRequest.sessionYear} | আইডি: {selectedRequest._id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 px-3 text-xs font-bold transition-colors cursor-pointer"
                            >
                                ✕ বন্ধ করুন
                            </button>
                        </div>

                        {/* মোডাল বডি */}
                        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-gray-700 bg-gray-50/30">

                            {/* বেসিক ও কভার ডাটা কার্ড */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-900/5 p-4 rounded-xl border border-emerald-900/10 shadow-2xs">
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">कवर अभिभावक</span>
                                    <span className="font-bold text-gray-900">{selectedRequest.guardianNameCover || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">কভার মোবাইল</span>
                                    <span className="font-bold text-gray-900 font-mono">{selectedRequest.mobileNumberCover || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">কভার আইডি নম্বর</span>
                                    <span className="font-bold text-gray-900 font-mono">{selectedRequest.idNumberCover || 'N/A'}</span>
                                </div>
                            </div>

                            {/* সেকশন ১: শিক্ষার্থীর ব্যক্তিগত তথ্য */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                                <h4 className="text-xs font-black text-emerald-800 border-b border-emerald-900/10 pb-1.5 flex items-center gap-1">
                                    👤 শিক্ষার্থীর ব্যক্তিগত তথ্য
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div><span className="text-gray-400 font-bold block text-[11px]">নাম (বাংলা):</span> <span className="font-bold text-gray-900">{selectedRequest.studentNameBangla}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">Name (English):</span> <span className="font-semibold text-gray-900 font-mono">{selectedRequest.studentNameEnglish}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">الاسم (العربية):</span> <span className="font-semibold text-gray-900">{selectedRequest.studentNameArabic || 'N/A'}</span></div>

                                    <div><span className="text-gray-400 font-bold block text-[11px]">জন্ম তারিখ:</span> <span className="font-semibold font-mono">{selectedRequest.dateOfBirth}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">বয়স:</span> <span className="font-semibold font-mono">{selectedRequest.age} বছর</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">লিঙ্গ:</span> <span className="font-semibold">{selectedRequest.gender}</span></div>

                                    <div><span className="text-gray-400 font-bold block text-[11px]">জন্ম নিবন্ধন নম্বর:</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.birthCertificateNo || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">রক্তের গ্রুপ:</span> <span className="font-bold text-rose-600 font-mono">{selectedRequest.bloodGroup || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">জাতীয়তা:</span> <span className="font-semibold">{selectedRequest.nationality}</span></div>

                                    <div><span className="text-gray-400 font-bold block text-[11px]">উচ্চতা:</span> <span className="font-semibold font-mono">{selectedRequest.height} ইঞ্চি</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">ওজন:</span> <span className="font-semibold font-mono">{selectedRequest.weight} কেজি</span></div>
                                </div>
                            </div>

                            {/* সেকশন ২: অভিভাবকের তথ্য (মাতা ও পিতা) */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-4">
                                <h4 className="text-xs font-black text-emerald-800 border-b border-emerald-900/10 pb-1.5">
                                    👨‍👩‍👦 পিতা ও মাতার বিবরণ
                                </h4>

                                {/* পিতার তথ্য */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-b border-gray-100 pb-3">
                                    <div className="col-span-full font-bold text-xs text-gray-500">পিতার ডাটা:</div>
                                    <div><span className="text-gray-400 block text-[11px]">পিতার নাম (বাংলা):</span> <span className="font-semibold text-gray-900">{selectedRequest.fatherNameBangla || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">Father Name (English):</span> <span className="font-medium text-gray-900 font-mono">{selectedRequest.fatherNameEnglish || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">পিতার মোবাইল:</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.fatherMobile || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">পিতার এনআইডি (NID):</span> <span className="font-medium text-gray-900 font-mono">{selectedRequest.fatherNid || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">পিতার পেশা:</span> <span className="font-medium text-gray-900">{selectedRequest.fatherProfession || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">অবস্থা:</span> <span className="font-semibold text-gray-900">{selectedRequest.fatherStatus || 'N/A'}</span></div>
                                </div>

                                {/* মাতার তথ্য */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="col-span-full font-bold text-xs text-gray-500">মাতার ডাটা:</div>
                                    <div><span className="text-gray-400 block text-[11px]">মাতার নাম (বাংলা):</span> <span className="font-semibold text-gray-900">{selectedRequest.motherNameBangla || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">Mother Name (English):</span> <span className="font-medium text-gray-900 font-mono">{selectedRequest.motherNameEnglish || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">মাতার মোবাইল:</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.motherMobile || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">মাতার এনআইডি (NID):</span> <span className="font-medium text-gray-900 font-mono">{selectedRequest.motherNid || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">মাতার পেশা:</span> <span className="font-medium text-gray-900">{selectedRequest.motherProfession || 'N/A'}</span></div>
                                    <div><span className="text-gray-400 block text-[11px]">অবস্থা:</span> <span className="font-semibold text-gray-900">{selectedRequest.motherStatus || 'N/A'}</span></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
