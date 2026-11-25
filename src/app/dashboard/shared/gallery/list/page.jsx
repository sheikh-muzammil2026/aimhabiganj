"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Play, Trash2, X, ExternalLink } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVideoPlaybackInfo } from "@/components/public/gallery/galleryMediaUtils";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export default function GalleryListPage() {
  const { data: session } = authClient.useSession();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  // মোডাল ও লাইটবক্স স্টেট
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const fetchGalleryData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/gallery`);
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
    const confirmDelete = window.confirm(
      `আপনি কি নিশ্চিতভাবে "${title}" গ্যালারি থেকে মুছে ফেলতে চান?`,
    );
    if (!confirmDelete) return;

    try {
      const headers = {};
      if (session?.user?.email) {
        headers["x-user-email"] = session.user.email;
      }

      const response = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ আইটেমটি সফলভাবে মুছে ফেলা হয়েছে।");
        setPhotos((prev) => prev.filter((item) => item._id !== id));
        setVideos((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("❌ ত্রুটি: " + (data.message || "মুছে ফেলার অনুমতি নেই।"));
      }
    } catch (error) {
      console.error("ডিলিট করতে সমস্যা হয়েছে:", error);
      alert("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] text-[#0D47A1] font-bold text-sm">
        ⏳ গ্যালারি লিস্ট লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
      </div>
    );
  }

  const activeVideoInfo = previewVideo
    ? getVideoPlaybackInfo(previewVideo.url, previewVideo.platform)
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* হেডার সেকশন */}
      <div className="border-b border-[#90CAF9]/40 pb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0D47A1]">
            ফটো এবং ভিডিও তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            মিডিয়াতে ক্লিক করে লাইভ প্রিভিউ দেখুন অথবা ম্যানেজ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-[#90CAF9]/60 p-1 rounded-xl text-xs font-bold shadow-xs">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filterType === "all"
                ? "bg-[#0D47A1] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0D47A1]"
                }`}
            >
              সব ({photos.length + videos.length})
            </button>
            <button
              onClick={() => setFilterType("photo")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filterType === "photo"
                ? "bg-[#0D47A1] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0D47A1]"
                }`}
            >
              🖼️ ফটো ({photos.length})
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filterType === "video"
                ? "bg-[#0D47A1] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0D47A1]"
                }`}
            >
              🎥 ভিডিও ({videos.length})
            </button>
          </div>

          <Link
            href="/dashboard/shared/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন যোগ করুন</span>
          </Link>
        </div>
      </div>

      {/* কন্টেন্ট গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* ফটো সেকশন */}
        {(filterType === "all" || filterType === "photo") &&
          photos.map((photo) => (
            <div
              key={photo._id}
              className="bg-white border border-[#90CAF9]/40 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => setPreviewImage(photo)}
                  className="w-full h-44 rounded-xl relative overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {photo.tag && (
                    <span className="absolute top-2 left-2 bg-[#2196F3] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                      {photo.tag}
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-[#0D47A1]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    🔍 বড় করে দেখুন
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-3 line-clamp-2 leading-snug">
                  {photo.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(photo._id, photo.title)}
                  className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all border border-rose-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              </div>
            </div>
          ))}

        {/* ভিডিও সেকশন */}
        {(filterType === "all" || filterType === "video") &&
          videos.map((video) => {
            const info = getVideoPlaybackInfo(video.url, video.platform);
            return (
              <div
                key={video._id}
                className="bg-white border border-[#90CAF9]/40 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => setPreviewVideo(video)}
                    className="w-full h-44 rounded-xl bg-[#0D47A1] flex flex-col items-center justify-center text-white relative overflow-hidden cursor-pointer"
                  >
                    {info.thumbnailUrl && (
                      <img
                        src={info.thumbnailUrl}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    <div className="relative z-10 w-11 h-11 bg-red-600 group-hover:bg-red-700 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="relative z-10 text-[10px] tracking-wider mt-2 font-bold uppercase bg-black/50 px-2 py-0.5 rounded">
                      {info.platformLabel}
                    </span>
                    {video.length && (
                      <span className="absolute bottom-2 right-2 z-10 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        ⏱️ {video.length}
                      </span>
                    )}
                    <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      প্লে করুন
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-3 line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(video._id, video.title)}
                    className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-all border border-rose-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* ইমেজ লাইটবক্স মোডাল */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white p-3 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-11 right-0 inline-flex items-center gap-1 text-white font-bold text-sm hover:text-[#90CAF9] cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>বন্ধ করুন</span>
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.title || "Preview"}
              className="w-full max-h-[75vh] object-contain rounded-xl bg-slate-950"
            />
            {previewImage.title && (
              <div className="pt-3 px-1 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#0D47A1]">
                  {previewImage.title}
                </p>
                {previewImage.tag && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E3F2FD] text-[#0D47A1]">
                    {previewImage.tag}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ভিডিও প্লেয়ার মোডাল */}
      {previewVideo && activeVideoInfo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
              <p className="text-xs sm:text-sm font-bold text-white truncate pr-4">
                {previewVideo.title}
              </p>
              <button
                onClick={() => setPreviewVideo(null)}
                className="inline-flex items-center gap-1 text-white/80 hover:text-white text-xs font-bold bg-white/10 hover:bg-rose-600 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
                <span>বন্ধ করুন</span>
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {activeVideoInfo.kind === "direct" ? (
                <video
                  src={activeVideoInfo.embedUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full"
                />
              ) : activeVideoInfo.kind === "youtube" ||
                activeVideoInfo.kind === "vimeo" ||
                activeVideoInfo.kind === "facebook" ? (
                <iframe
                  src={activeVideoInfo.embedUrl}
                  title={previewVideo.title || "Video Player"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-300">
                    এই ভিডিও লিংকটি সরাসরি এম্বেড করা যাচ্ছে না।
                  </p>
                  <a
                    href={activeVideoInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>নতুন ট্যাবে ভিডিও দেখুন</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* নো ডাটা অ্যালার্ট */}
      {((filterType === "photo" && photos.length === 0) ||
        (filterType === "video" && videos.length === 0) ||
        (photos.length === 0 && videos.length === 0)) && (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-[#90CAF9] text-xs sm:text-sm font-semibold text-slate-500">
            কোনো মিডিয়া কন্টেন্ট খুঁজে পাওয়া যায়নি।
          </div>
        )}
    </div>
  );
}
