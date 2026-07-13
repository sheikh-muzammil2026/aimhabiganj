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

    // সম্পূর্ণ ভর্তি আবেদন তথ্য আপডেট হ্যান্ডলার (PUT)
    const handleFullRequestUpdate = async (e) => {
        e.preventDefault();
        const id = selectedRequest._id?.$oid || selectedRequest._id;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/admissions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedRequest)
            });
            const data = await response.json();

            if (data.success) {
                toast.success("🎉 শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে!");
                setAdmissionRequests(prev =>
                    prev.map(req => (req._id === id ? selectedRequest : req))
                );
                setActionMessage("শিক্ষার্থীর প্রোফাইল তথ্য আপডেট করা হয়েছে।");
                setTimeout(() => setActionMessage(''), 4000);
            } else {
                toast.error(data.message || "আপডেট করা সম্ভব হয়নি।");
            }
        } catch (error) {
            console.error("আপডেট করতে সমস্যা:", error);
            toast.error("সার্ভারে সমস্যা হওয়ার কারণে তথ্য আপডেট করা যায়নি।");
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
                    toast.error(data.message || "মুছে ফেলা সম্ভব হয়নি।");
                }
            } catch (error) {
                console.error("ডিলিট করতে সমস্যা:", error);
                toast.error("সার্ভারে সমস্যা হওয়ার কারণে আবেদনটি মুছা যায়নি।");
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
                                    <th className="p-4">শিক্ষার্থী আইডি</th>
                                    <th className="p-4">ছাত্রের নাম</th>
                                    <th className="p-4">পিতার নাম & মোবাইল</th>
                                    <th className="p-4">আবেদনকৃত বিভাগ</th>
                                    <th className="p-4 text-center">স্ট্যাটাস</th>
                                    <th className="p-4 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium block md:table-row-group">
                                {admissionRequests.map((req) => {
                                    // ডেটাবেজ ফরম্যাট অনুযায়ী কোন কোন বিভাগগুলো active তা বের করার লজিক
                                    const activeDivisions = [];
                                    if (req.divisionPreHifz?.active) activeDivisions.push("Pre-Hifz");
                                    if (req.divisionHifz?.active) activeDivisions.push("Hifz");
                                    if (req.divisionAcademic?.active) activeDivisions.push("Academic");
                                    if (req.divisionArabicCourse?.active) activeDivisions.push("Arabic Course");

                                    return (
                                        <tr
                                            key={req._id?.$oid || req._id}
                                            className="hover:bg-gray-50/70 transition-colors block md:table-row p-4 md:p-0 space-y-3 md:space-y-0 border-b border-gray-100 md:border-b-0"
                                        >
                                            {/* মঙ্গোডিবি আইডির পরিবর্তে ডেটাবেজের শর্ট আইডি (যেমন: 02420) প্রদর্শন */}
                                            <td className="p-0 md:p-4 font-mono font-bold text-gray-900 flex justify-between md:table-cell items-center before:content-['আইডি:'] before:md:hidden before:font-sans before:text-gray-400 before:text-[11px]">
                                                <span className="bg-emerald-50 text-emerald-800 md:bg-transparent px-2 py-0.5 md:p-0 rounded-sm">
                                                    {req.id || 'N/A'}
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
                                                    <div className="text-gray-400 font-mono text-[11px]">{req.fatherMobile}</div>
                                                </div>
                                            </td>

                                            {/* ডাইনামিকালি সচল অ্যাক্টিভ বিভাগ প্রদর্শন লজিক */}
                                            <td className="p-0 md:p-4 flex justify-between md:table-cell items-center before:content-['বিভাগ:'] before:md:hidden before:text-gray-400 before:text-[11px]">
                                                <div className="flex flex-wrap gap-1 justify-end md:justify-start">
                                                    {activeDivisions.length > 0 ? (
                                                        activeDivisions.map((div, index) => (
                                                            <span key={index} className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200/60 whitespace-nowrap">
                                                                {div}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-[11px] italic">কোনোটিই নয়</span>
                                                    )}
                                                </div>
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
                                                <button onClick={() => setSelectedRequest(req)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer flex-1 md:flex-none text-center">👁️ ভিউ & এডিট</button>
                                                <button disabled={req.status === 'Approved'} onClick={() => updateStatus(req._id?.$oid || req._id, 'Approved')} className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-30 cursor-pointer flex-1 md:flex-none text-center">✓ অ্যাপ্রুভ</button>
                                                <button disabled={req.status === 'Rejected'} onClick={() => updateStatus(req._id?.$oid || req._id, 'Rejected')} className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-30 cursor-pointer flex-1 md:flex-none text-center">✕ রিজেক্ট</button>
                                                <button onClick={() => deleteAdmissionRequest(req._id?.$oid || req._id)} className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer flex-1 md:flex-none text-center">🗑️ ডিলিট</button>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                <label className="block text-xs font-bold text-gray-500 mb-1">клаস শুরুর তারিখ</label>
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

                    {/* ⚡ নতুন সংযোজিত: ৩. ভর্তি প্রক্রিয়া (Admission Process) */}
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
            {/* ৪. বিস্তারিত ভিউ প্রোফাইল ও এডিট মোডাল */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 print:p-0 print:bg-white print:static print:block">

                    {/* প্রিন্ট করার জন্য পারফেক্ট A4 সাইজ ও লেআউট সিএসএস স্টাইল */}
                    <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                .print-modal-content, .print-modal-content * {
                    visibility: visible;
                }
                .print-modal-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    max-height: none !important;
                    overflow: visible !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                }
                input, select, textarea {
                    border: none !important;
                    background: transparent !important;
                    padding: 0 !important;
                    appearance: none !important;
                    width: 100% !important;
                    font-weight: bold !important;
                }
                .no-print {
                    display: none !important;
                }
            }
        `}</style>

                    <form onSubmit={handleFullRequestUpdate} className="print-modal-content bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        {/* মোডাল হেডার */}
                        <div className="p-4 sm:p-5 border-b border-emerald-900/10 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex justify-between items-center sticky top-0 z-10 shadow-sm print:bg-transparent print:text-black print:border-b-2 print:border-emerald-900">
                            <div>
                                <h3 className="text-base sm:text-lg font-black tracking-wide">📝 মাদ্রাসা ভর্তি আবেদনপত্র (বিস্তারিত ও এডিট)</h3>
                                <p className="text-[11px] text-emerald-200/90 font-mono mt-0.5 print:text-gray-600">
                                    সেশন: {selectedRequest.sessionYear} | ফরম নং: {selectedRequest.formNo} | সিরিয়াল: {selectedRequest.serialNo}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 no-print">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 px-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                    🖨️ প্রিন্ট (A4)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRequest(null)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl p-2 px-3 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    ✕ বন্ধ করুন
                                </button>
                            </div>
                        </div>

                        {/* মোডাল বডি */}
                        <div className="p-4 sm:p-6 space-y-6 text-xs sm:text-sm text-gray-700 bg-gray-50/30 print:bg-white print:p-0">

                            {/* শীর্ষ কার্ড: সিস্টেম ও স্ট্যাটাস */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-emerald-900/5 p-4 rounded-xl border border-emerald-900/10 shadow-2xs print:border-none print:bg-transparent print:p-0 items-center">
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">আইডি (ID)</span>
                                    <span className="font-bold text-gray-900 font-mono">{selectedRequest.id || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">ডাটাবেজ আইডি</span>
                                    <span className="font-bold text-gray-500 font-mono text-[10px] break-all">{selectedRequest._id?.$oid || selectedRequest._id || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">আবেদনের স্ট্যাটাস</span>
                                    <select
                                        value={selectedRequest.status || 'Pending'}
                                        onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}
                                        className="mt-1 p-1.5 w-full border border-gray-300 rounded bg-white text-xs font-bold focus:outline-emerald-600"
                                    >
                                        <option value="Pending">Pending (অপেক্ষমাণ)</option>
                                        <option value="Approved">Approved (অনুমোদিত)</option>
                                        <option value="Rejected">Rejected (বাতিল)</option>
                                    </select>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-bold text-emerald-800/80">আবেদনের তারিখ</span>
                                    <span className="font-bold text-gray-900 font-mono">
                                        {selectedRequest.createdAt?.$date ? new Date(selectedRequest.createdAt.$date).toLocaleDateString('bn-BD') : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* সেকশন ১: কাঙ্ক্ষিত বিভাগ (মাদ্রাসা ডিভিশন) */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">🕌 ভর্তির কাঙ্ক্ষিত বিভাগ (Division Details)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">হিফজ বিভাগ (Hifz Active?)</label>
                                        <select
                                            value={selectedRequest.divisionHifz?.active ? "true" : "false"}
                                            onChange={(e) => setSelectedRequest({
                                                ...selectedRequest,
                                                divisionHifz: { ...selectedRequest.divisionHifz, active: e.target.value === "true" }
                                            })}
                                            className="w-full p-2 border border-gray-200 rounded-lg font-semibold bg-white"
                                        >
                                            <option value="true">হ্যাঁ (Active)</option>
                                            <option value="false">না (Inactive)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">ধরন (Hifz Type)</label>
                                        <input type="text" value={selectedRequest.divisionHifz?.type || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, divisionHifz: { ...selectedRequest.divisionHifz, type: e.target.value } })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">শ্রেণী (Hifz Class)</label>
                                        <input type="text" value={selectedRequest.divisionHifz?.class || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, divisionHifz: { ...selectedRequest.divisionHifz, class: e.target.value } })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ২: শিক্ষার্থীর ব্যক্তিগত তথ্য */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">👤 শিক্ষার্থীর ব্যক্তিগত তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">নাম (বাংলা)</label>
                                        <input type="text" value={selectedRequest.studentNameBangla || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, studentNameBangla: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">নাম (English)</label>
                                        <input type="text" value={selectedRequest.studentNameEnglish || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, studentNameEnglish: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">নাম (আরবি)</label>
                                        <input type="text" value={selectedRequest.studentNameArabic || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, studentNameArabic: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold text-right" dir="rtl" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">জন্ম তারিখ</label>
                                        <input type="date" value={selectedRequest.dateOfBirth || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, dateOfBirth: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">বয়স (Age)</label>
                                        <input type="text" value={selectedRequest.age || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, age: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">জেন্ডার</label>
                                        <input type="text" value={selectedRequest.gender || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, gender: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">জন্ম নিবন্ধন নম্বর</label>
                                        <input type="text" value={selectedRequest.birthCertificateNo || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, birthCertificateNo: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">রক্তের গ্রুপ</label>
                                        <input type="text" value={selectedRequest.bloodGroup || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, bloodGroup: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">জাতীয়তা</label>
                                        <input type="text" value={selectedRequest.nationality || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, nationality: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">ওজন (Weight)</label>
                                        <input type="text" value={selectedRequest.weight || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, weight: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">উচ্চতা (Height)</label>
                                        <input type="text" value={selectedRequest.height || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, height: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৩: বর্তমান ও স্থায়ী ঠিকানা (Nested Object Map) */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">📍 ঠিকানার বিবরণ</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* বর্তমান ঠিকানা */}
                                    <div className="space-y-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                        <h5 className="font-bold text-gray-600 text-xs mb-1">🏡 বর্তমান ঠিকানা:</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" placeholder="বাসা" value={selectedRequest.currentAddress?.house || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, house: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="রোড" value={selectedRequest.currentAddress?.road || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, road: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="গ্রাম" value={selectedRequest.currentAddress?.village || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, village: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="পোস্ট অফিস" value={selectedRequest.currentAddress?.postOffice || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, postOffice: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="থানা" value={selectedRequest.currentAddress?.thana || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, thana: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="জেলা" value={selectedRequest.currentAddress?.district || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, currentAddress: { ...selectedRequest.currentAddress, district: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                        </div>
                                    </div>
                                    {/* স্থায়ী ঠিকানা */}
                                    <div className="space-y-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                        <h5 className="font-bold text-gray-600 text-xs mb-1">🏢 স্থায়ী ঠিকানা:</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" placeholder="বাসা" value={selectedRequest.permanentAddress?.house || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, house: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="রোড" value={selectedRequest.permanentAddress?.road || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, road: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="গ্রাম" value={selectedRequest.permanentAddress?.village || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, village: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="পোস্ট অফিস" value={selectedRequest.permanentAddress?.postOffice || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, postOffice: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="থানা" value={selectedRequest.permanentAddress?.thana || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, thana: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                            <input type="text" placeholder="জেলা" value={selectedRequest.permanentAddress?.district || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, permanentAddress: { ...selectedRequest.permanentAddress, district: e.target.value } })} className="p-1.5 border border-gray-200 rounded bg-white text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৪: পিতা ও মাতার তথ্য */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">👨‍👩‍👦 পিতা ও মাতার তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার নাম (বাংলা)</label>
                                        <input type="text" value={selectedRequest.fatherNameBangla || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherNameBangla: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার নাম (English)</label>
                                        <input type="text" value={selectedRequest.fatherNameEnglish || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherNameEnglish: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার মোবাইল</label>
                                        <input type="text" value={selectedRequest.fatherMobile || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherMobile: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার NID</label>
                                        <input type="text" value={selectedRequest.fatherNid || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherNid: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার পেশা</label>
                                        <input type="text" value={selectedRequest.fatherProfession || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherProfession: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পিতার অবস্থা (Alive/Dead)</label>
                                        <input type="text" value={selectedRequest.fatherStatus || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, fatherStatus: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>

                                    <div className="sm:col-span-3 border-t border-gray-100 my-1"></div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">মাতার নাম (বাংলা)</label>
                                        <input type="text" value={selectedRequest.motherNameBangla || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, motherNameBangla: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">মাতার মোবাইল</label>
                                        <input type="text" value={selectedRequest.motherMobile || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, motherMobile: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">মাতার NID</label>
                                        <input type="text" value={selectedRequest.motherNid || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, motherNid: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৫: অভিভাবকের আর্থিক অবস্থা ও রেফারেন্স */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">💰 অভিভাবকের আয় ও রেফারেন্স</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">বার্ষিক আয় (অংকে)</label>
                                        <input type="text" value={selectedRequest.guardianAnnualIncome || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, guardianAnnualIncome: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">বার্ষিক আয় (কথায়)</label>
                                        <input type="text" value={selectedRequest.guardianAnnualIncomeWords || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, guardianAnnualIncomeWords: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">সুপারিশকারী/রেফারেন্স ব্যক্তির নাম</label>
                                        <input type="text" value={selectedRequest.referenceName || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, referenceName: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">রেফারেন্স মোবাইল নম্বর</label>
                                        <input type="text" value={selectedRequest.referenceMobile || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, referenceMobile: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৬: পূর্ববর্তী প্রতিষ্ঠানের বিবরণ */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">🎓 পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-gray-400">প্রতিষ্ঠানের নাম</label>
                                        <input type="text" value={selectedRequest.prevInstituteName || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevInstituteName: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পূর্ববর্তী শ্রেণী</label>
                                        <input type="text" value={selectedRequest.prevClass || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevClass: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-gray-400">মাদ্রাসা ত্যাগের কারণ</label>
                                        <input type="text" value={selectedRequest.prevInstituteLeaveReason || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevInstituteLeaveReason: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">প্রধান শিক্ষকের মোবাইল</label>
                                        <input type="text" value={selectedRequest.prevPrincipalMobile || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevPrincipalMobile: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">ছাড়পত্র/TC নং</label>
                                        <input type="text" value={selectedRequest.prevTransferCertificateNo || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevTransferCertificateNo: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">টিসি প্রদানের তারিখ</label>
                                        <input type="text" value={selectedRequest.prevTcDate || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prevTcDate: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৭: আচরণ, অভ্যাস ও মনস্তাত্ত্বিক তথ্য */}
                            <div className="border border-gray-200/80 p-4 rounded-xl bg-white space-y-4 print:border-none print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm">🧠 শিক্ষার্থীর অভ্যাস ও মনস্তাত্ত্বিক তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">নিয়মিত নামাজ পড়ে?</label>
                                        <input type="text" value={selectedRequest.prayerAddicted || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, prayerAddicted: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পরিষ্কার-পরিচ্ছন্নতা পছন্দ করে?</label>
                                        <input type="text" value={selectedRequest.cleanlinessLover || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, cleanlinessLover: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">খাবারে অরুচি আছে?</label>
                                        <input type="text" value={selectedRequest.foodReluctance || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, foodReluctance: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">পছন্দের খাবার</label>
                                        <input type="text" value={selectedRequest.favFoodType || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, favFoodType: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">ঘুমানোর সময়</label>
                                        <input type="text" value={selectedRequest.sleepTime || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, sleepTime: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">ঘুম থেকে ওঠার সময়</label>
                                        <input type="text" value={selectedRequest.wakeUpTime || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, wakeUpTime: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400">প্রিয় কাজ/শখ</label>
                                        <input type="text" value={selectedRequest.favThing || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, favThing: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-gray-400">উদ্বেগ বা চিন্তার কারণ</label>
                                        <input type="text" value={selectedRequest.anxietyReason || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, anxietyReason: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg font-semibold" />
                                    </div>
                                </div>
                            </div>

                            {/* সেকশন ৮: অফিসের ব্যবহারের জন্য (Office Use Only) */}
                            <div className="border border-dashed border-emerald-600 p-4 rounded-xl bg-emerald-50/20 space-y-4 print:border-solid print:p-0">
                                <h4 className="font-bold text-emerald-900 border-b pb-1 text-sm flex items-center gap-1">🏢 অফিসের ব্যবহারের জন্য (Office Use Only)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">অফিস আইডি (Student ID)</label>
                                        <input type="text" value={selectedRequest.officeUse?.studentIdOffice || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, studentIdOffice: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">পরীক্ষার প্রাপ্ত নম্বর</label>
                                        <input type="text" value={selectedRequest.officeUse?.examMark || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, examMark: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">মেধা তালিকা (Position)</label>
                                        <input type="text" value={selectedRequest.officeUse?.meritPosition || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, meritPosition: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">অফিস রোল নং</label>
                                        <input type="text" value={selectedRequest.officeUse?.officeRollNo || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, officeRollNo: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">ভর্তিকৃত শ্রেণী</label>
                                        <input type="text" value={selectedRequest.officeUse?.admittedClass || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, admittedClass: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">ভর্তিকৃত শাখা/সেকশন</label>
                                        <input type="text" value={selectedRequest.officeUse?.admittedSection || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, admittedSection: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-emerald-800">ভর্তির তারিখ</label>
                                        <input type="date" value={selectedRequest.officeUse?.admissionDate || ''} onChange={(e) => setSelectedRequest({ ...selectedRequest, officeUse: { ...selectedRequest.officeUse, admissionDate: e.target.value } })} className="w-full p-2 border border-emerald-200 bg-white rounded-lg font-bold font-mono" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* মোডাল ফুটার (অ্যাকশন বাটন) */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 z-10 no-print">
                            <button
                                type="button"
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 cursor-pointer"
                            >
                                বন্ধ করুন
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-transform active:scale-95"
                            >
                                💾 তথ্য আপডেট করুন
                            </button>
                        </div>

                    </form>
                </div>
            )}

        </div>
    );
}