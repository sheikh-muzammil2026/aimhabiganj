"use client";

import React, { useState } from 'react';

export default function AdminAdmissionDashboard() {
    const [activeTab, setActiveTab] = useState('requests'); // requests | settings
    const [selectedRequest, setSelectedRequest] = useState(null); // Detailed modal profile
    const [actionMessage, setActionMessage] = useState('');

    // ১. ডামি ভর্তি আবেদন ডাটা (ডাটাবেজ যুক্ত করার আগ পর্যন্ত)
    const [admissionRequests, setAdmissionRequests] = useState([
        {
            id: "ADM-2026-001",
            studentNameBangla: "মুহাম্মাদ আব্দুল্লাহ",
            studentNameEnglish: "Muhammad Abdullah",
            fatherNameBangla: "আব্দুর রহমান",
            mobile: "01712345678",
            appliedDivision: "হিফজ বিভাগ (আবাসিক)",
            status: "Pending", // Pending | Approved | Rejected
            date: "২০২৬-০৭-০১",
            bloodGroup: "A+",
            birthCert: "2015369852147",
            guardianIncome: "২৫,০০০/-"
        },
        {
            id: "ADM-2026-002",
            studentNameBangla: "আহমেদ আল-আজাদ",
            studentNameEnglish: "Ahmed Al-Azad",
            fatherNameBangla: "জয়নাল আবেদীন",
            mobile: "01898765432",
            appliedDivision: "কিতাব বিভাগ",
            status: "Approved",
            date: "২০২৬-০৭-০২",
            bloodGroup: "O+",
            birthCert: "2014369852148",
            guardianIncome: "১৮,০০০/-"
        },
        {
            id: "ADM-2026-003",
            studentNameBangla: "মাহমুদ হাসান",
            studentNameEnglish: "Mahmud Hasan",
            fatherNameBangla: "শফিকুল ইসলাম",
            mobile: "01511223344",
            appliedDivision: "নূরানী ও নাজেরা",
            status: "Rejected",
            date: "২০২৬-০৭-০৩",
            bloodGroup: "B+",
            birthCert: "2018369852149",
            guardianIncome: "১২,০০০/-"
        }
    ]);

    // ২. পাবলিক পেজের ভর্তি নির্দেশিকা গাইডলাইন ডাটা স্টেট
    const [guideSettings, setGuideSettings] = useState({
        timeline_start: "০১ শাওয়াল থেকে",
        timeline_exam: "১০ শাওয়াল, সকাল ৯:০০ টা",
        timeline_class: "১৫ শাওয়াল থেকে ইনশাআল্লাহ",
        test_details: "হিফজ ও কিতাব বিভাগের শিক্ষার্থীদের জন্য মৌখিক (তিলাওয়াত ও ইস্তেমাল) এবং সাধারণ লিখিত পরীক্ষা নেওয়া হবে। নূরানী ও নাজেরা বিভাগের জন্য শুধুমাত্র মৌখিক ও উচ্চারণ যোগ্যতা যাচাই করা হবে।",
        fee_noorani_adm: "১,৫০০/-", fee_noorani_monthly: "৫০০/-",
        fee_hifz_adm: "৩,০০০/-", fee_hifz_monthly: "৩,৫০০/-",
        fee_kitab_adm: "২,৫০০/-", fee_kitab_monthly: "৮০০/-",
        terms: "• শিক্ষার্থীকে অবশ্যই সদাচারী এবং মাদরাসার নিয়ম-কানুন মানতে বাধ্য থাকতে হবে।\n• আবাসিক ছাত্রদের ক্ষেত্রে নির্দিষ্ট সময়ে বোর্ডিংয়ের নিয়ম অনুধাবন করতে হবে।\n• ভর্তির সময় জন্ম নিবন্ধন এবং অভিভাবকের জাতীয় পরিচয়পত্রের কপি জমা দেওয়া বাধ্যতা মূলক।"
    });

    // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার
    const updateStatus = (id, newStatus) => {
        setAdmissionRequests(prev => 
            prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
        );
        if(selectedRequest && selectedRequest.id === id) {
            setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
        setActionMessage(`আবেদন আইডি ${id} সফলভাবে ${newStatus === 'Approved' ? 'অনুমোদন (Approve)' : 'প্রত্যাখ্যান (Reject)'} করা হয়েছে।`);
        setTimeout(() => setActionMessage(''), 4000);
    };

    // গাইডলাইন সেভ হ্যান্ডলার
    const handleGuideSubmit = (e) => {
        e.preventDefault();
        setActionMessage("আলহামদুলিল্লাহ, পাবলিক ভর্তি নির্দেশিকার সকল তথ্য ডাটাবেজে আপডেট হয়েছে!");
        setTimeout(() => setActionMessage(''), 4000);
        console.log("পাবলিক পেজে এপিআই দিয়ে যাওয়ার জন্য রেডি তথ্য:", guideSettings);
    };

    return (
        <div className="space-y-6">
            {/* পেজ হেডার */}
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-emerald-900">ভর্তি ও আবেদনপত্র ব্যবস্থাপনা</h1>
                    <p className="text-xs text-gray-500 mt-1">ভর্তি গাইডলাইন পরিবর্তন করুন এবং শিক্ষার্থীদের আবেদনসমূহ যাচাই করুন।</p>
                </div>

                {/* মেইন মোড সিলেকশন ট্যাব */}
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

            {/* গ্লোবাল নোটিফিকেশন অ্যালার্ট */}
            {actionMessage && (
                <div className="p-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs transition-all">
                    📢 {actionMessage}
                </div>
            )}

            {/* TAB CONTENT 1: আবেদন রিকোয়েস্ট টেবিল */}
            {activeTab === 'requests' && (
                <div className="bg-white border border-emerald-900/10 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-700">জমা হওয়া অনলাইন ভর্তি ফরমের তালিকা</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200 bg-emerald-900/5 text-emerald-900 font-bold">
                                    <th className="p-4">আবেদন আইডি</th>
                                    <th className="p-4">ছাত্রের নাম</th>
                                    <th className="p-4">পিতার নাম & মোবাইল</th>
                                    <th className="p-4">আবেদনকৃত বিভাগ</th>
                                    <th className="p-4 text-center">স্ট্যাটাস</th>
                                    <th className="p-4 text-right">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {admissionRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="p-4 font-mono font-bold text-gray-900">{req.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{req.studentNameBangla}</div>
                                            <div className="text-[11px] text-gray-400 font-normal">{req.studentNameEnglish}</div>
                                        </td>
                                        <td className="p-4">
                                            <div>{req.fatherNameBangla}</div>
                                            <div className="text-gray-400 font-mono text-[11px]">{req.mobile}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200/50">
                                                {req.appliedDivision}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider
                                                ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                  req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                                  'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {req.status === 'Approved' ? 'অনুমোদিত' : req.status === 'Rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-1 sm:space-x-2 whitespace-nowrap">
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                👁️ ভিউ
                                            </button>
                                            <button 
                                                disabled={req.status === 'Approved'}
                                                onClick={() => updateStatus(req.id, 'Approved')}
                                                className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all disabled:opacity-30"
                                            >
                                                ✓ ইম্প্রুভ
                                            </button>
                                            <button 
                                                disabled={req.status === 'Rejected'}
                                                onClick={() => updateStatus(req.id, 'Rejected')}
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                                            >
                                                ✕ রিজেক্ট
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: গাইডলাইন ও ফি সেটিং ফরম */}
            {activeTab === 'settings' && (
                <form onSubmit={handleGuideSubmit} className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-6">
                    
                    {/* সেকশন ১: সময়সূচী */}
                    <div>
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📅 ১. ভর্তির সময়সূচী মডিউল</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ভর্তি ফরম বিতরণ শুরু</label>
                                <input type="text" value={guideSettings.timeline_start} onChange={(e) => setGuideSettings({...guideSettings, timeline_start: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ভর্তি পরীক্ষার তারিখ</label>
                                <input type="text" value={guideSettings.timeline_exam} onChange={(e) => setGuideSettings({...guideSettings, timeline_exam: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">ক্লাস শুরুর তারিখ</label>
                                <input type="text" value={guideSettings.timeline_class} onChange={(e) => setGuideSettings({...guideSettings, timeline_class: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold" />
                            </div>
                        </div>
                    </div>

                    {/* সেকশন ২: পরীক্ষা সংক্রান্ত */}
                    <div>
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📝 ২. ভর্তি পরীক্ষা সংক্রান্ত গাইডলাইন</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">পরীক্ষার সংক্ষিপ্ত নিয়ম</label>
                            <textarea rows={3} value={guideSettings.test_details} onChange={(e) => setGuideSettings({...guideSettings, test_details: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm leading-relaxed" />
                        </div>
                    </div>

                    {/* সেকশন ৩: ভর্তি ও মাসিক ফি টেবিল এডিটর */}
                    <div>
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">💵 ৩. ভর্তি ও মাসিক ফি স্ট্রাকচার</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/60">
                                <p className="text-xs font-bold text-emerald-900 mb-2">নূরানী ও নাজেরা বিভাগ</p>
                                <input type="text" placeholder="ভর্তি ফি" value={guideSettings.fee_noorani_adm} onChange={(e) => setGuideSettings({...guideSettings, fee_noorani_adm: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs mb-2 font-bold" />
                                <input type="text" placeholder="মাসিক ফি" value={guideSettings.fee_noorani_monthly} onChange={(e) => setGuideSettings({...guideSettings, fee_noorani_monthly: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                            </div>
                            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/60">
                                <p className="text-xs font-bold text-emerald-900 mb-2">হিফজ বিভাগ (আবাসিক)</p>
                                <input type="text" placeholder="ভর্তি ফি" value={guideSettings.fee_hifz_adm} onChange={(e) => setGuideSettings({...guideSettings, fee_hifz_adm: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs mb-2 font-bold" />
                                <input type="text" placeholder="মাসিক ফি" value={guideSettings.fee_hifz_monthly} onChange={(e) => setGuideSettings({...guideSettings, fee_hifz_monthly: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                            </div>
                            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/60">
                                <p className="text-xs font-bold text-emerald-900 mb-2">কিতাব বিভাগ</p>
                                <input type="text" placeholder="ভর্তি ফি" value={guideSettings.fee_kitab_adm} onChange={(e) => setGuideSettings({...guideSettings, fee_kitab_adm: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs mb-2 font-bold" />
                                <input type="text" placeholder="মাসিক ফি" value={guideSettings.fee_kitab_monthly} onChange={(e) => setGuideSettings({...guideSettings, fee_kitab_monthly: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* সেকশন ৪: শর্তাবলী */}
                    <div>
                        <h3 className="text-sm font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl mb-4">📜 ৪. ভর্তির শর্তাবলী ও রুলস</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">শর্তসমূহ (প্রতি লাইনে একটি করে দিন)</label>
                            <textarea rows={4} value={guideSettings.terms} onChange={(e) => setGuideSettings({...guideSettings, terms: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm leading-relaxed" />
                        </div>
                    </div>

                    {/* সাবমিট বাটন */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-[#043e30] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all">
                            💾 গাইডলাইন ডাটা আপডেট করুন
                        </button>
                    </div>
                </form>
            )}

            {/* ৪. বিস্তারিত ভিউ প্রোফাইল মোডাল (Detailed View Modal) */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl flex flex-col">
                        
                        {/* মোডাল হেডার */}
                        <div className="p-4 sm:p-5 border-b border-gray-100 bg-emerald-900 text-white flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h3 className="text-base sm:text-lg font-black flex items-center gap-2">📝 আবেদনপত্র বিস্তারিত বিবরণ</h3>
                                <p className="text-[11px] text-emerald-200/90 font-mono mt-0.5">আইডি: {selectedRequest.id} | আবেদন তারিখ: {selectedRequest.date}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 text-xs transition-all font-bold"
                            >
                                ✕ বন্ধ করুন
                            </button>
                        </div>

                        {/* মোডাল কন্টেন্ট বডি */}
                        <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-gray-700">
                            
                            {/* ছাত্রের বেসিক প্রোফাইল গ্রিড */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                                <div><span className="block text-[11px] font-bold text-gray-400 uppercase">ছাত্রের নাম (বাংলা)</span> <span className="font-bold text-gray-900">{selectedRequest.studentNameBangla}</span></div>
                                <div><span className="block text-[11px] font-bold text-gray-400 uppercase">Student Name (English)</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.studentNameEnglish}</span></div>
                                <div><span className="block text-[11px] font-bold text-gray-400 uppercase">রক্তের গ্রুপ</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.bloodGroup}</span></div>
                                <div><span className="block text-[11px] font-bold text-gray-400 uppercase">জন্ম নিবন্ধন নং</span> <span className="font-bold text-gray-900 font-mono">{selectedRequest.birthCert}</span></div>
                            </div>

                            {/* অভিভাবক ও অন্যান্য বিবরণ */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-emerald-800 border-b border-emerald-900/10 pb-1">👥 অভিভাবক ও পারিবারিক তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div><span className="text-gray-400 font-bold block text-[11px]">পিতার নাম:</span> <span className="font-semibold">{selectedRequest.fatherNameBangla}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">মোবাইল নম্বর:</span> <span className="font-semibold font-mono">{selectedRequest.mobile}</span></div>
                                    <div><span className="text-gray-400 font-bold block text-[11px]">বার্ষিক আনুমানিক আয়:</span> <span className="font-semibold">{selectedRequest.guardianIncome}</span></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-emerald-800 border-b border-emerald-900/10 pb-1">🕌 আবেদনকৃত ক্লাসের তথ্য</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div><span className="text-gray-400 font-bold block text-[11px]">মনোনীত বিভাগ:</span> <span className="font-bold text-emerald-800">{selectedRequest.appliedDivision}</span></div>
                                    <div>
                                        <span className="text-gray-400 font-bold block text-[11px]">বর্তমান স্ট্যাটাস:</span> 
                                        <span className={`font-black ${selectedRequest.status === 'Approved' ? 'text-emerald-600' : selectedRequest.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
                                            {selectedRequest.status === 'Approved' ? 'অনুমোদিত' : selectedRequest.status === 'Rejected' ? 'বাতিলকৃত' : 'অপেক্ষমাণ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* মোডাল ফুটার অ্যাকশন বার */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center sticky bottom-0">
                            <span className="text-[11px] font-medium text-gray-400">নিবিড়ভাবে ফাইল যাচাই করে সিদ্ধান্ত নিন।</span>
                            <div className="flex gap-2">
                                <button 
                                    disabled={selectedRequest.status === 'Rejected'}
                                    onClick={() => updateStatus(selectedRequest.id, 'Rejected')}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200 transition-all disabled:opacity-40"
                                >
                                    ✕ আবেদন বাতিল করুন
                                </button>
                                <button 
                                    disabled={selectedRequest.status === 'Approved'}
                                    onClick={() => updateStatus(selectedRequest.id, 'Approved')}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-all disabled:opacity-40"
                                >
                                    ✓ চূড়ান্ত অনুমোদন (Approve)
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
