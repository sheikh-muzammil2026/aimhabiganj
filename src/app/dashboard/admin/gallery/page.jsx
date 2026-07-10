"use client";

import React, { useState } from 'react';

export default function AdminGalleryPage() {
    const [itemType, setItemType] = useState('photo'); // photo | video
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('ক্যাম্পাস'); // ফটো ট্যাগ
    const [videoUrl, setVideoUrl] = useState(''); // ভিডিও লিঙ্ক
    const [videoLength, setVideoLength] = useState(''); // ভিডিও ডিউরেশন
    const [platform, setPlatform] = useState('YouTube'); // YouTube | Facebook
    
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 🔴 ImgBB API Key (আপনার নিজের কী-টি এখানে বসাবেন)
    const IMGBB_API_KEY = "5a4f8c279ddcedf0d73f50444bad88b0"; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        let finalUrl = "";

        try {
            // ১. আইটেম যদি ফটো হয়, প্রথমে ImgBB তে আপলোড হবে
            if (itemType === 'photo') {
                if (!imageFile) {
                    alert("দয়া করে একটি ছবি সিলেক্ট করুন।");
                    setIsSubmitting(false);
                    return;
                }

                const formData = new FormData();
                formData.append('image', imageFile);

                const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const imgbbData = await imgbbResponse.json();

                if (imgbbData.success) {
                    finalUrl = imgbbData.data.url; // ImgBB ডাইরেক্ট ইমেজ URL
                } else {
                    throw new Error("ImgBB-তে ছবি আপলোড ব্যর্থ হয়েছে।");
                }
            } else {
                // ২. আইটেম যদি ভিডিও হয়, ডিরেক্ট ইনপুট ইউআরএল নেওয়া হবে
                finalUrl = videoUrl;
            }

            // ৩. মঙ্গোডিবি-র জন্য ডাটা অবজেক্ট তৈরি
            const payload = {
                type: itemType,
                title,
                url: finalUrl,
                ...(itemType === 'photo' ? { tag } : { length: videoLength, platform })
            };

            // ৪. আপনার এক্সপ্রেস সার্ভারে ডাটা পাঠানো
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/gallery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'আলহামদুলিল্লাহ্‌, মিডিয়াটি সফলভাবে লাইভ গ্যালারিতে যুক্ত হয়েছে।' });
                // ফর্ম রিসেট
                setTitle('');
                setVideoUrl('');
                setVideoLength('');
                setImageFile(null);
            } else {
                setMessage({ type: 'error', text: data.message });
            }

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'কোনো একটি ত্রুটি ঘটেছে, আবার চেষ্টা করুন।' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6">
            {/* হেডার */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl sm:text-2xl font-black text-emerald-900">মিডিয়া গ্যালারি নিয়ন্ত্রণ</h1>
                <p className="text-xs text-gray-500 mt-1">পাবলিক পেজের ফটো এবং ভিডিও গ্যালারিতে নতুন কন্টেন্ট আপলোড ও যুক্ত করুন।</p>
            </div>

            {/* মেসেজ অ্যালার্ট */}
            {message.text && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
                </div>
            )}

            {/* আপলোড ফরম */}
            <form onSubmit={handleSubmit} className="bg-white border border-emerald-900/10 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
                
                {/* টাইপ সিলেকশন */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">মিডিয়া টাইপ সিলেক্ট করুন</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                            <input type="radio" checked={itemType === 'photo'} onChange={() => setItemType('photo')} className="accent-emerald-800" />
                            🖼️ নতুন ছবি (Photo)
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                            <input type="radio" checked={itemType === 'video'} onChange={() => setItemType('video')} className="accent-emerald-800" />
                            🎥 নতুন ভিডিও (Video)
                        </label>
                    </div>
                </div>

                {/* সাধারণ শিরোনাম */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">মিডিয়া শিরোনাম/ক্যাপশন</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: বার্ষিক দাস্তারবন্দী ও দুআ মাহফিল" className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold" />
                </div>

                {/* কন্ডিশনাল ফিল্ড ১: ফটো আপলোড এরিয়া */}
                {itemType === 'photo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ফটো ট্যাগ (Tag)</label>
                            <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white font-semibold text-gray-700">
                                <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                                <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                                <option value="প্রতিযোগিতা">প্রতিযোগিতা</option>
                                <option value="শিক্ষা">শিক্ষা</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ছবি সিলেক্ট করুন (Image File)</label>
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 cursor-pointer" />
                        </div>
                    </div>
                )}

                {/* কন্ডিশনাল ফিল্ড ২: ভিডিও এরিয়া */}
                {itemType === 'video' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">ভিডিও ইউআরএল (YouTube/Facebook URL)</label>
                            <input type="url" required placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ভিডিওর দৈর্ঘ্য (Duration)</label>
                            <input type="text" required placeholder="যেমন: ১২:৩০" value={videoLength} onChange={(e) => setVideoLength(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-semibold text-center" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">প্লাটফর্ম (Platform)</label>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white font-semibold">
                                <option value="YouTube">YouTube</option>
                                <option value="Facebook">Facebook</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* সাবমিট বোতাম */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button type="submit" disabled={isSubmitting} className="bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50">
                        {isSubmitting ? '⏳ প্রসেসিং ও আপলোড হচ্ছে...' : '🚀 গ্যালারিতে প্রকাশ করুন'}
                    </button>
                </div>

            </form>
        </div>
    );
}
