"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminAboutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // URL এর query parameter (?section=...) থেকে কারেন্ট সেকশন ট্র্যাক করা
    const currentSection = searchParams.get('section') || 'profile';

    // ডামি কন্টেন্ট ডাটা (ডাটাবেজ যুক্ত করার আগ পর্যন্ত)
    const [aboutData, setAboutData] = useState({
        profile: "আস-সালাম মাদরাসা হবিগঞ্জের অন্যতম একটি দ্বীনি শিক্ষা প্রতিষ্ঠান। সুনামের সাথে এটি ইলমে দ্বীনের আলো ছড়িয়ে যাচ্ছে...",
        founder: "হযরত মাওলানা অমুক সাহেব (রহ.) এই প্রতিষ্ঠানটি প্রতিষ্ঠা করেন। তাঁর অক্লান্ত পরিশ্রমে...",
        vision: "আমাদের মূল লক্ষ্য হলো যুগোপযোগী ও মুখস্থনির্ভরতাহীন খাটি আলেম ও আদর্শ নাগরিক তৈরি করা...",
        committee: "১. সভাপতি: আলহাজ্ব অমুক আলী\n২. সাধারণ সম্পাদক: মুফতি অমুক রহমান...",
        features: "• শীতাতপ নিয়ন্ত্রিত হিফজ বিভাগ\n• সার্বক্ষণিক সিসিটিভি ক্যামেরা\n• অভিজ্ঞ শিক্ষকমণ্ডলী...",
        roadmap: "আমাদের ভবিষ্যৎ পরিকল্পনা হলো প্রতিষ্ঠানটিকে একটি কামিল মাদরাসা ও ইসলামিক ইউনিভার্সিটিতে রূপান্তর করা...",
        faculty: "মাদরাসায় বর্তমানে ১৫ জন অভিজ্ঞ শিক্ষক কর্মরত আছেন...",
        staff: "অফিস ও আবাসিক ব্যবস্থাপনায় ৫ জন সহকারী নিয়োজিত আছেন...",
        policies: "১. প্রত্যেক শিক্ষার্থীকে শালীন পোশাক পরিধান করতে হবে।\n২. নিয়মানুবর্তিতা কঠোরভাবে পালনীয়..."
    });

    // ফর্ম ইনপুট স্টেট
    const [editorContent, setEditorContent] = useState(aboutData[currentSection]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // সেকশন পরিবর্তন হলে ফর্মের ভেতরের টেক্সট আপডেট করা
    useEffect(() => {
        setEditorContent(aboutData[currentSection]);
        setMessage({ type: '', text: '' });
    }, [currentSection, aboutData]);

    // ট্যাব পরিবর্তন করার ফাংশন (URL আপডেট করবে)
    const handleTabChange = (sectionKey) => {
        router.push(`/dashboard/admin/about?section=${sectionKey}`);
    };

    // ফরম সাবমিট হ্যান্ডলার
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // সাময়িক ব্যাকএন্ড সিমুলেশন
        setTimeout(() => {
            setAboutData(prev => ({
                ...prev,
                [currentSection]: editorContent
            }));
            setIsSubmitting(false);
            setMessage({ type: 'success', text: 'কন্টেন্টটি সফলভাবে আপডেট করা হয়েছে এবং পাবলিক পেজে প্রদর্শিত হবে ইনশাআল্লাহ।' });
        }, 1000);
    };

    // ট্যাবের বাংলা নামসমূহ
    const tabs = [
        { key: 'profile', title: 'প্রতিষ্ঠান পরিচিতি', icon: '🏢' },
        { key: 'founder', title: 'প্রতিষ্ঠাতা পরিচিতি', icon: '🕌' },
        { key: 'vision', title: 'লক্ষ্য ও উদ্দেশ্য', icon: '🎯' },
        { key: 'committee', title: 'পরিচালনা পর্ষদ', icon: '👥' },
        { key: 'features', title: 'আমাদের বৈশিষ্ট্য', icon: '✨' },
        { key: 'roadmap', title: 'ভবিষ্যৎ পরিকল্পনা', icon: '🚀' },
        { key: 'faculty', title: 'শিক্ষকমণ্ডলী', icon: '📖' },
        { key: 'staff', title: 'কর্মকর্তা ও কর্মচারী', icon: '🛠️' },
        { key: 'policies', title: 'নীতিমালা', icon: '📜' },
    ];

    return (
        <div className="space-y-6">
            {/* পেজ হেডার */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl sm:text-2xl font-black text-emerald-900">মাদরাসা পরিচিতি নিয়ন্ত্রণ কেন্দ্র</h1>
                <p className="text-xs text-gray-500 mt-1">পাবলিক "আমাদের সম্পর্কে" পেজের যাবতীয় তথ্য এখান থেকে যুক্ত ও পরিবর্তন করুন।</p>
            </div>

            {/* অ্যালার্ট মেসেজ */}
            {message.text && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
                </div>
            )}

            {/* মেইন গ্রিড লেআউট */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* বাম পাশ: ট্যাব মেনু লিস্ট */}
                <div className="lg:col-span-1 bg-white border border-emerald-900/10 p-3 rounded-2xl shadow-xs space-y-1 h-fit">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">সেকশনসমূহ</p>
                    {tabs.map((tab) => {
                        const isSelected = currentSection === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-all text-left
                                    ${isSelected 
                                        ? 'bg-emerald-800 text-white shadow-sm font-bold scale-[1.01]' 
                                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
                            >
                                <span>{tab.icon}</span>
                                <span className="truncate">{tab.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ডান পাশ: কন্টেন্ট এডিটর ফরম */}
                <div className="lg:col-span-3 bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                        <span className="text-xl">✍️</span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800">
                            {tabs.find(t => t.key === currentSection)?.title} - সম্পাদন (Edit) করুন
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">বিবরণ / কন্টেন্ট বডি</label>
                            <textarea
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                rows={10}
                                required
                                className="w-full p-4 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-all font-medium text-gray-700 placeholder-gray-400"
                                placeholder="এখানে বিস্তারিত বিবরণ লিখুন..."
                            ></textarea>
                        </div>

                        {/* সাবমিট বাটন */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center gap-2 bg-amber-500 text-[#043e30] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-[#043e30]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        সংরক্ষণ হচ্ছে...
                                    </>
                                ) : (
                                    '💾 কন্টেন্ট আপডেট করুন'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
