"use client";

import React, { useState, useEffect } from 'react';

export default function GalleryListPage() {
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    // 🌟 মোডাল ও লাইটবক্স এর জন্য নতুন স্টেট
    const [previewImage, setPreviewImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

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

    // 🎥 ইউটিউব লিঙ্ককে এম্বেড (Embed) লিঙ্কে রূপান্তর করার ফাংশন
    const getEmbedUrl = (url) => {
        if (!url) return "";
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
        }
        return url; // ফেসবুক বা অন্য লিঙ্ক হলে সরাসরি রিটার্ন করবে
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
                    <p className="text-xs text-gray-500 mt-1">মিডিয়াতে ক্লিক করে লাইভ প্রিভিউ দেখুন অথবা ম্যানেজ করুন।</p>
                </div>
                
                <div className="flex bg-gray-200/80 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
                    <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>সব ({photos.length + videos.length})</button>
                    <button onClick={() => setFilterType('photo')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'photo' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>🖼️ ফটো ({photos.length})</button>
                    <button onClick={() => setFilterType('video')} className={`px-4 py-2 rounded-lg transition-all ${filterType === 'video' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600'}`}>🎥 ভিডিও ({videos.length})</button>
                </div>
            </div>

            {/* কন্টেন্ট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* 🖼️ ফটো সেকশন */}
                {(filterType === 'all' || filterType === 'photo') && photos.map((photo) => (
                    <div key={photo._id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs flex flex-col justify-between group">
                        <div>
                            {/* ছবিতে ক্লিক করলে বড় হবে */}
                            <div 
                                onClick={() => setPreviewImage(photo.url)}
                                className="w-full h-40 rounded-xl relative overflow-hidden bg-slate-100 border border-gray-100 cursor-pointer"
                            >
                                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    {photo.tag}
                                </span>
                                <span className="absolute bottom-2 left-2 bg-emerald-900 text-white text-[9px] font-medium px-2 py-0.5 rounded-sm">
                                    🔍 বড় করে দেখুন
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

                {/* 🎥 ভিডিও সেকশন */}
                {(filterType === 'all' || filterType === 'video') && videos.map((video) => (
                    <div key={video._id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs flex flex-col justify-between group">
                        <div>
                            {/* ভিডিও বক্সে ক্লিক করলে প্লে হবে */}
                            <div 
                                onClick={() => setPreviewVideo(video.url)}
                                className="w-full h-40 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white relative cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-red-600 group-hover:bg-red-700 rounded-full flex items-center justify-center text-sm shadow-md transition-transform group-hover:scale-110">▶</div>
                                <span className="text-[9px] tracking-widest opacity-50 mt-2 font-black uppercase">{video.platform} PLAY</span>
                                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                                    ⏱️ {video.length}
                                </span>
                                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-medium px-2 py-0.5 rounded-sm">
                                    প্লে করুন
                                </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mt-3 line-clamp-2 leading-snug">{video.title}</h3>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button onClick={() => handleDelete(video._id, video.title)} className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all border border-rose-100">
                                🗑️ মুছুন
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= 🖼️ ইমেজ লাইটবক্স মোডাল ================= */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh] bg-white p-2 rounded-xl shadow-2xl">
                        <button className="absolute -top-10 right-0 text-white font-bold text-xl hover:text-amber-400">✕ বন্ধ করুন</button>
                        <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}

            {/* ================= 🎥 ভিডিও প্লেয়ার মোডাল ================= */}
            {previewVideo && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewVideo(null)}
                >
                    <div className="relative w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewVideo(null)} className="absolute top-2 right-3 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded-md hover:bg-rose-600 z-10">✕ বন্ধ করুন</button>
                        <iframe 
                            src={getEmbedUrl(previewVideo)} 
                            title="Video Player"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* নো ডাটা অ্যালার্ট */}
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
