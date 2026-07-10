"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminAboutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentSection = searchParams.get('section') || 'profile';

    // ১. সম্পূর্ণ স্ট্রাকচার্ড ডাটাবেজ মডেল (পাবলিক পেজের কার্ড ও লেআউটের সাথে মিল রেখে)
    const [aboutData, setAboutData] = useState({
        profile: {
            mainTitle: "স্বাগতম আস-সালাম মাদরাসায়",
            description: "আস-সালাম মাদরাসা হবিগঞ্জের অন্যতম একটি দ্বীনি শিক্ষা প্রতিষ্ঠান। সুনামের সাথে এটি ইলমে দ্বীনের আলো ছড়িয়ে যাচ্ছে...",
            stat1_label: "মোট শিক্ষার্থী", stat1_value: "+১২০০",
            stat2_label: "অভিজ্ঞ উস্তাদ", stat2_value: "২৫ জন",
            stat3_label: "পাসের হার", stat3_value: "১০০%"
        },
        founder: {
            name: "হযরত মাওলানা অমুক সাহেব (রহ.)",
            designation: "প্রতিষ্ঠাতা ও প্রথম মুহতামিম",
            biography: "তিনি এই প্রতিষ্ঠানটি প্রতিষ্ঠা করেন। তাঁর অক্লান্ত পরিশ্রমে আজ এই অবস্থানে..."
        },
        vision: {
            title: "আমাদের লক্ষ্য ও উদ্দেশ্য",
            points: "• খাটি আলেম তৈরি করা\n• আধুনিক শিক্ষার সমন্বয়\n• নৈতিক চরিত্র গঠন"
        },
        committee: {
            title: "পরিচালনা পর্ষদ সদস্যবৃন্দ",
            members: "১. সভাপতি: আলহাজ্ব অমুক আলী\n২. সাধারণ সম্পাদক: মুফতি অমুক রহমান"
        },
        features: {
            title: "মাদরাসার অনন্য বৈশিষ্ট্যসমূহ",
            items: "• শীতাতপ নিয়ন্ত্রিত হিফজ বিভাগ\n• সার্বক্ষণিক সিসিটিভি ক্যামেরা\n• মানসম্মত আবাসন ব্যবস্থা"
        },
        roadmap: {
            title: "ভবিষ্যৎ কর্মপরিকল্পনা",
            description: "আমাদের ভবিষ্যৎ পরিকল্পনা হলো প্রতিষ্ঠানটিকে একটি কামিল মাদরাসা ও ইসলামিক ইউনিভার্সিটিতে রূপান্তর করা..."
        },
        faculty: {
            title: "আমাদের যোগ্য শিক্ষকমণ্ডলী",
            total_teachers: "২৫ জন",
            description: "আমাদের এখানে দেশসেরা বিশ্ববিদ্যালয় ও কওমি মাদরাসা থেকে উত্তীর্ণ উস্তাদগণ পাঠদান করেন।"
        },
        staff: {
            title: "কর্মকর্তা ও কর্মচারী",
            total_staff: "৮ জন",
            description: "আবাসিক ও প্রশাসনিক তদারকির জন্য আমাদের রয়েছে ডেডিকেটেড স্টাফ টিম।"
        },
        policies: {
            title: "মাদরাসার সাধারণ নীতিমালা ও নিয়মাবলী",
            rules: "১. প্রত্যেক শিক্ষার্থীকে শালীন পোশাক পরিধান করতে হবে।\n২. নিয়মানুবর্তিতা কঠোরভাবে পালনীয়।"
        }
    });

    // ফর্ম স্টেট ম্যানেজমেন্ট
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // সেকশন চেঞ্জ হলে বা ডাটা লোড হলে ফর্ম ডাটা সিঙ্ক করা
    useEffect(() => {
        if (aboutData[currentSection]) {
            setFormData(aboutData[currentSection]);
        }
        setMessage({ type: '', text: '' });
    }, [currentSection, aboutData]);

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleTabChange = (sectionKey) => {
        router.push(`/dashboard/admin/about?section=${sectionKey}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // সাময়িক ব্যাকএন্ড সাবমিশন সিমুলেশন
        setTimeout(() => {
            setAboutData(prev => ({
                ...prev,
                [currentSection]: formData
            }));
            setIsSubmitting(false);
            setMessage({ type: 'success', text: 'আলহামদুলিল্লাহ, কন্টেন্টটি সফলভাবে আপডেট করা হয়েছে এবং পাবলিক পেজের কার্ডে বসে গেছে!' });
            console.log("ডাটাবেজে সেভ হওয়া ডাটা (পাবলিক API এর জন্য):", formData);
        }, 1000);
    };

    // ৯টি ইসলামিক ও প্রফেশনাল ট্যাব কনফিগারেশন
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
                <p className="text-xs text-gray-500 mt-1">পাবলিক পেজের লেআউট ঠিক রেখে সুনির্দিষ্ট কার্ড, টাইটেল এবং টেক্সট আলাদা ফিল্ডে নিখুঁতভাবে এডিট করুন।</p>
            </div>

            {/* অ্যালার্ট মেসেজ */}
            {message.text && (
                <div className="p-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs animate-fade-in">
                    ✅ {message.text}
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
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm rounded-xl font-semibold transition-all text-left
                                    ${isSelected 
                                        ? 'bg-emerald-800 text-white shadow-md font-bold scale-[1.01]' 
                                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900 hover:translate-x-1'}`}
                            >
                                <span className="text-sm">{tab.icon}</span>
                                <span className="truncate">{tab.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ডান পাশ: ডাইনামিক কন্টেন্ট এডিটর ফরম */}
                <div className="lg:col-span-3 bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-5">
                        <span className="text-xl">✍️</span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800">
                            {tabs.find(t => t.key === currentSection)?.title} - ডাটা সম্পাদন করুন
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* ১. প্রতিষ্ঠান পরিচিতি (Profile) */}
                        {currentSection === 'profile' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">মূল শিরোনাম (Main Title)</label>
                                    <input type="text" value={formData.mainTitle || ''} onChange={(e) => handleInputChange('mainTitle', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/20 outline-hidden" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">মূল বিবরণ (Description)</label>
                                    <textarea rows={4} value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800/20 outline-hidden" />
                                </div>
                                <h4 className="text-xs font-bold text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">📊 পাবলিক পেজের ৩টি ইনফোগ্রাফিক কার্ডের ডাটা</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl space-y-2">
                                        <p className="text-[11px] font-bold text-amber-600">কার্ড ০১ (শিক্ষার্থী)</p>
                                        <input type="text" placeholder="লেবেল" value={formData.stat1_label || ''} onChange={(e) => handleInputChange('stat1_label', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                                        <input type="text" placeholder="ভ্যালু" value={formData.stat1_value || ''} onChange={(e) => handleInputChange('stat1_value', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" />
                                    </div>
                                    <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl space-y-2">
                                        <p className="text-[11px] font-bold text-amber-600">কার্ড ০২ (উস্তাদ)</p>
                                        <input type="text" placeholder="লেবেল" value={formData.stat2_label || ''} onChange={(e) => handleInputChange('stat2_label', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                                        <input type="text" placeholder="ভ্যালু" value={formData.stat2_value || ''} onChange={(e) => handleInputChange('stat2_value', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" />
                                    </div>
                                    <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl space-y-2">
                                        <p className="text-[11px] font-bold text-amber-600">কার্ড ০৩ (পাস হার)</p>
                                        <input type="text" placeholder="লেবেল" value={formData.stat3_label || ''} onChange={(e) => handleInputChange('stat3_label', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                                        <input type="text" placeholder="ভ্যালু" value={formData.stat3_value || ''} onChange={(e) => handleInputChange('stat3_value', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ২. প্রতিষ্ঠাতা পরিচিতি (Founder) */}
                        {currentSection === 'founder' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">প্রতিষ্ঠাতার নাম</label>
                                    <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">পদবী/উপাধি</label>
                                    <input type="text" value={formData.designation || ''} onChange={(e) => handleInputChange('designation', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">সংक्षिप्त জীবনী ও অবদান</label>
                                    <textarea rows={5} value={formData.biography || ''} onChange={(e) => handleInputChange('biography', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৩. লক্ষ্য ও উদ্দেশ্য (Vision) */}
                        {currentSection === 'vision' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">সেকশন শিরোনাম</label>
                                    <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">উদ্দেশ্যসমূহ (প্রতি লাইনে বুলেট পয়েন্ট `•` বা নম্বর দিন)</label>
                                    <textarea rows={6} value={formData.points || ''} onChange={(e) => handleInputChange('points', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-mono" />
                                </div>
                            </div>
                        )}

                        {/* ৪. পরিচালনা পর্ষদ (Committee) */}
                        {currentSection === 'committee' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                    <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">কমিটি সদস্যদের তালিকা (নাম ও পদবী)</label>
                                    <textarea rows={6} value={formData.members || ''} onChange={(e) => handleInputChange('members', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৫. আমাদের বৈশিষ্ট্য (Features) */}
                        {currentSection === 'features' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                    <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">বৈশিষ্ট্যের তালিকা</label>
                                    <textarea rows={6} value={formData.items || ''} onChange={(e) => handleInputChange('items', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৬. ভবিষ্যৎ পরিকল্পনা (Roadmap) */}
                        {currentSection === 'roadmap' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                    <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">পরিকল্পনার বিবরণ</label>
                                    <textarea rows={6} value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৭. শিক্ষকমণ্ডলী (Faculty) */}
                        {currentSection === 'faculty' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                        <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">মোট শিক্ষক সংখ্যা (কার্ডের জন্য)</label>
                                        <input type="text" value={formData.total_teachers || ''} onChange={(e) => handleInputChange('total_teachers', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">ভূমিকা/বিবরণ</label>
                                    <textarea rows={4} value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৮. কর্মকর্তা ও কর্মচারী (Staff) */}
                        {currentSection === 'staff' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                        <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">মোট স্টাফ সংখ্যা</label>
                                        <input type="text" value={formData.total_staff || ''} onChange={(e) => handleInputChange('total_staff', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">বিবরণ</label>
                                    <textarea rows={4} value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* ৯. নীতিমালা (Policies) */}
                        {currentSection === 'policies' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">শিরোনাম</label>
                                    <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">নীতিমালা ও সাধারণ নিয়মাবলী</label>
                                    <textarea rows={6} value={formData.rules || ''} onChange={(e) => handleInputChange('rules', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>
                        )}

                        {/* সাবমিট বাটন অ্যাকশন বার */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#043e30] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? '💾 সংরক্ষণ হচ্ছে...' : '💾 ডাটা আপডেট করুন'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
