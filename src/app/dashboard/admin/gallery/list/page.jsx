"use client";

import React, { useState, useEffect } from 'react';

export default function GalleryListPage() {
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // all | photo | video

    // 🔄 ডাটাবেজ থেকে ডাটা নিয়ে আসার ফাংশন (Fetch Data)
    const fetchGalleryData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/gallery`);
            const data = await response.json();
            if (data.success) {
                setPhotos(data.photos || []);
                setVideos(data.videos || []);
            }
        } catch (error) {
            console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error);
            alert("সার্ভার থেকে গ্যালারি ডাটা লোড করা যায়নি।");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    // 🗑️ আইটেম ডিলিট করার ফাংশন (Client API Call)
    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" গ্যালারি থেকে মুছে ফেলতে চান?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/gallery/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                alert("✅ আইটেমটি সফলভাবে মুছে ফেলা হয়েছে।");
                // স্টেট থেকে ডাটা ফিল্টার করে রিলোড ছাড়াই ইউআই আপডেট
                setPhotos(prev => prev.filter(item => item._id !== id));
                setVideos(prev => prev.filter(item => item._id !== id));
            } else {
                alert("❌ ত্রুটি: " + data.message);
            }
        } catch (error) {
            console.error("ডিলিট করতে সমস্যা হয়েছে:", error);
            alert("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-emerald-950 font-bold text-sm">
                ⏳ গ্যালারি লিস্ট লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
            
            {/* হেডার সেকশন */}
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-emerald-900">ফটো এবং ভিডিও তালিকা</h1>
                    <p className="text-xs text-gray-500 mt-1">বর্তমানে গ্যালারিতে লাইভ থাকা সমস্ত ছবি এবং ভিডিওর লিস্ট ও ব্যবস্থাপনা।</p>
                </div>
                
                {/* ফিল্টারিং বাটন গ্রুপ */}
                <div className="flex bg-gray-200/80 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
                    <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>সব ({photos.length + videos.length})</button>
                    <button onClick={() => setFilterType('photo')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'photo' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>🖼️ ফটো ({photos.length})</button>
                    <button onClick={() => setFilterType('video')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'video' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>🎥 ভিডিও ({videos.length})</button>
                </div>
            </div>

            {/* কন্টেন্ট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* 🖼️ ফটো ডিসপ্লে লজিক */}
                {(filterType === 'all' || filterType === 'photo') && photos.map((photo) => (
                    <div key={photo._id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs flex flex-col justify-between group">
                        <div>
                            <div className="w-full h-40 rounded-xl relative overflow-hidden bg-slate-100 border border-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    {photo.tag}
                                </span>
                                <span className="absolute bottom-2 left-2 bg-emerald-900 text-white text-[9px] font-medium px-2 py-0.5 rounded-sm">
                                    ইমেজ
                                </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mt-3 line-clamp-2 leading-snug">{photo.title}</h3>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button onClick={() => handleDelete(photo._id, photo.title)} className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all border border-rose-100">
                                🗑️ মুছুন
                            </button>
                        </div>
                    </div>
                ))}

                {/* 🎥 ভিডিও ডিসপ্লে লজিক */}
                {(filterType === 'all' || filterType === 'video') && videos.map((video) => (
                    <div key={video._id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs flex flex-col justify-between group">
                        <div>
                            <div className="w-full h-40 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white relative">
                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-sm shadow-md">▶</div>
                                <span className="text-[9px] tracking-widest opacity-50 mt-2 font-black uppercase">{video.platform} PLAYER</span>
                                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                                    ⏱️ {video.length}
                                </span>
                                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-medium px-2 py-0.5 rounded-sm">
                                    ভিডিও
                                </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mt-3 line-clamp-2 leading-snug">{video.title}</h3>
                            <p className="text-[10px] font-mono text-gray-400 mt-1 truncate max-w-full">{video.url}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button onClick={() => handleDelete(video._id, video.title)} className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all border border-rose-100">
                                🗑️ মুছুন
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* কোনো ডাটা না থাকলে খালি অবস্থা দেখানোর মেসেজ */}
            {((filterType === 'photo' && photos.length === 0) || 
              (filterType === 'video' && videos.length === 0) || 
              (photos.length === 0 && videos.length === 0)) && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-xs font-semibold text-gray-400">
                    কোনো মিডিয়া কন্টেন্ট খুঁজে পাওয়া যায়নি।
                </div>
            )}

        </div>
    );
}
