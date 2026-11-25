"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Images,
  Video,
  Sparkles,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ExternalLink,
  Clock,
  Camera,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getVideoPlaybackInfo } from "@/components/public/gallery/galleryMediaUtils";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export default function GalleryTab() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all"); // all | photos | videos
  const [selectedTag, setSelectedTag] = useState("all");
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const content = {
    bn: {
      title: "মাদরাসা মিডিয়া গ্যালারি",
      subtitle:
        "আমাদের বিভিন্ন দ্বীনি মাহফিল, প্রতিযোগিতা, ক্যাম্পাস ও ভিডিওর জীবন্ত সংকলন",
      tabs: {
        all: "সকল মিডিয়া",
        photos: "ফটো গ্যালারি",
        videos: "ভিডিও গ্যালারি",
      },
      allTags: "সব ক্যাটাগরি",
      viewPhoto: "বড় করে দেখুন",
      watchVideo: "ভিডিও দেখুন",
      emptyTitle: "কোনো মিডিয়া কন্টেন্ট খুঁজে পাওয়া যায়নি",
      emptySubtitle:
        "ড্যাশবোর্ড থেকে নতুন ছবি বা ভিডিও আপলোড করলে তা স্বয়ংক্রিয়ভাবে এখানে প্রদর্শিত হবে।",
      errorText: "সার্ভার থেকে গ্যালারি লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
      close: "বন্ধ করুন",
      openExternal: "নতুন ট্যাবে ভিডিও দেখুন",
      unsupportedEmbed: "এই ভিডিও লিংকটি সরাসরি এম্বেড করা যাচ্ছে না।",
    },
    en: {
      title: "Madrasah Media Gallery",
      subtitle:
        "A living collection of our Islamic events, competitions, campus life, and featured videos",
      tabs: {
        all: "All Media",
        photos: "Photo Gallery",
        videos: "Video Gallery",
      },
      allTags: "All Categories",
      viewPhoto: "View Photo",
      watchVideo: "Play Video",
      emptyTitle: "No media items found",
      emptySubtitle:
        "Photos and videos uploaded from the admin dashboard will appear here automatically.",
      errorText: "Failed to load gallery from the server. Please try again later.",
      close: "Close",
      openExternal: "Watch in New Tab",
      unsupportedEmbed: "This video link cannot be embedded directly.",
    },
    ar: {
      title: "معرض وسائط المدرسة",
      subtitle:
        "مجموعة حية من فعالياتنا الدينية ومسابقاتنا وحياة الحرم المدرسي ومقاطع الفيديو",
      tabs: {
        all: "جميع الوسائط",
        photos: "معرض الصور",
        videos: "معرض الفيديو",
      },
      allTags: "جميع التصنيفات",
      viewPhoto: "تكبير الصورة",
      watchVideo: "تشغيل الفيديو",
      emptyTitle: "لم يتم العثور على وسائط",
      emptySubtitle:
        "ستظهر الصور ومقاطع الفيديو تلقائياً هنا بعد إضافتها من لوحة التحكم.",
      errorText: "تعذر تحميل المعرض من الخادم. يرجى المحاولة لاحقاً.",
      close: "إغلاق",
      openExternal: "مشاهدة في نافذة جديدة",
      unsupportedEmbed: "لا يمكن تضمين رابط الفيديو هذا مباشرة.",
    },
  };

  const t = content[language] || content.bn;

  useEffect(() => {
    let active = true;
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`${API_BASE}/api/gallery`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (active && res.ok && data?.success) {
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
          setVideos(Array.isArray(data.videos) ? data.videos : []);
        } else if (active) {
          setError(true);
        }
      } catch (err) {
        console.error("Gallery page fetch error:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchGallery();
    return () => {
      active = false;
    };
  }, []);

  const photoTags = useMemo(() => {
    const tags = new Set();
    photos.forEach((p) => {
      if (p.tag) tags.add(p.tag);
    });
    return Array.from(tags);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedTag === "all") return photos;
    return photos.filter((p) => p.tag === selectedTag);
  }, [photos, selectedTag]);

  const combinedItems = useMemo(() => {
    const photoItems = filteredPhotos.map((p, idx) => ({
      ...p,
      mediaKind: "photo",
      photoIndex: idx,
      sortTime: p.createdAt ? new Date(p.createdAt).getTime() : 0,
    }));
    const videoItems = videos.map((v) => ({
      ...v,
      mediaKind: "video",
      sortTime: v.createdAt ? new Date(v.createdAt).getTime() : 0,
    }));
    return [...photoItems, ...videoItems].sort(
      (a, b) => b.sortTime - a.sortTime,
    );
  }, [filteredPhotos, videos]);

  const handleNextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredPhotos.length,
    );
  }, [filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null
        ? 0
        : (prev - 1 + filteredPhotos.length) % filteredPhotos.length,
    );
  }, [filteredPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null && !activeVideo) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
        setActiveVideo(null);
      } else if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") handleNextPhoto();
        if (e.key === "ArrowLeft") handlePrevPhoto();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, activeVideo, handleNextPhoto, handlePrevPhoto]);

  const activePhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  const activeVideoInfo = activeVideo
    ? getVideoPlaybackInfo(activeVideo.url, activeVideo.platform)
    : null;

  return (
    <div className="site-container py-12">
      {/* হেডার সেকশন */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {t.title}{" "}
          <span className="text-[#2196F3]">❖</span>
        </h1>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* ফটো ও ভিডিও সুইচিং ট্যাব বাটন */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="bg-white p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 border border-[#90CAF9] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#0D47A1] text-white shadow-sm"
                : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {t.tabs.all} ({photos.length + videos.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#2196F3] text-white shadow-sm"
                : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
            }`}
          >
            <Images className="w-4 h-4" />
            <span>
              {t.tabs.photos} ({photos.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "videos"
                ? "bg-[#2196F3] text-white shadow-sm"
                : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>
              {t.tabs.videos} ({videos.length})
            </span>
          </button>
        </div>

        {/* ফটো ট্যাগ ফিল্টার পিলস */}
        {activeTab === "photos" && photoTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                selectedTag === "all"
                  ? "bg-[#0D47A1] text-white border-[#0D47A1]"
                  : "bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]"
              }`}
            >
              {t.allTags}
            </button>
            {photoTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-[#2196F3] text-white border-[#2196F3]"
                    : "bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* কন্টেন্ট ডিসপ্লে */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-[#90CAF9]/50 shadow-xs animate-pulse"
            >
              <div className="w-full h-56 rounded-xl bg-[#E3F2FD]" />
              <div className="h-4 bg-[#E3F2FD] rounded w-3/4 mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-14 px-6 bg-white rounded-2xl border border-[#90CAF9] shadow-xs max-w-xl mx-auto">
          <p className="text-sm font-bold text-[#0D47A1]">{t.errorText}</p>
        </div>
      ) : activeTab === "photos" ? (
        filteredPhotos.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-[#90CAF9] max-w-xl mx-auto space-y-2">
            <Camera className="w-10 h-10 text-[#2196F3] mx-auto opacity-80" />
            <h3 className="text-base font-black text-[#0D47A1]">
              {t.emptyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.emptySubtitle}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <button
                key={photo._id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="text-left bg-white rounded-2xl p-3 border border-[#90CAF9] shadow-sm group hover:shadow-lg hover:border-[#2196F3] transition-all cursor-pointer"
              >
                <div className="w-full h-56 bg-[#E3F2FD] rounded-xl relative overflow-hidden border border-[#90CAF9]/40">
                  <img
                    src={photo.url}
                    alt={photo.title || "Gallery photo"}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                      <ZoomIn className="w-4 h-4" />
                      {t.viewPhoto}
                    </span>
                  </div>
                  {photo.tag && (
                    <span className="absolute top-3 left-3 bg-[#2196F3] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {photo.tag}
                    </span>
                  )}
                </div>
                <div className="pt-3 px-1">
                  <h2 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                    {photo.title}
                  </h2>
                </div>
              </button>
            ))}
          </div>
        )
      ) : activeTab === "videos" ? (
        videos.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-[#90CAF9] max-w-xl mx-auto space-y-2">
            <Video className="w-10 h-10 text-[#2196F3] mx-auto opacity-80" />
            <h3 className="text-base font-black text-[#0D47A1]">
              {t.emptyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.emptySubtitle}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {videos.map((video) => {
              const info = getVideoPlaybackInfo(video.url, video.platform);
              return (
                <button
                  key={video._id}
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="text-left bg-white rounded-2xl p-4 border border-[#90CAF9] shadow-sm group hover:shadow-lg hover:border-[#2196F3] transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-full h-56 sm:h-64 bg-[#0D47A1] rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden border border-[#90CAF9]/40">
                    {info.thumbnailUrl && (
                      <img
                        src={info.thumbnailUrl}
                        alt={video.title || "Video thumbnail"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/85 via-black/30 to-transparent" />
                    <div className="relative z-10 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white/25">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                    <span className="absolute top-3 left-3 z-10 bg-black/65 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                      {info.platformLabel}
                    </span>
                    {video.length && (
                      <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {video.length}
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 z-10 text-xs font-bold text-white/95">
                      {t.watchVideo}
                    </span>
                  </div>

                  <div className="pt-4">
                    <h2 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                      {video.title}
                    </h2>
                  </div>
                </button>
              );
            })}
          </div>
        )
      ) : combinedItems.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-[#90CAF9] max-w-xl mx-auto space-y-2">
          <Camera className="w-10 h-10 text-[#2196F3] mx-auto opacity-80" />
          <h3 className="text-base font-black text-[#0D47A1]">{t.emptyTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-600">{t.emptySubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedItems.map((item) => {
            if (item.mediaKind === "photo") {
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setLightboxIndex(item.photoIndex)}
                  className="text-left bg-white rounded-2xl p-3 border border-[#90CAF9] shadow-sm group hover:shadow-lg hover:border-[#2196F3] transition-all cursor-pointer"
                >
                  <div className="w-full h-56 bg-[#E3F2FD] rounded-xl relative overflow-hidden border border-[#90CAF9]/40">
                    <img
                      src={item.url}
                      alt={item.title || "Gallery photo"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                        <ZoomIn className="w-4 h-4" />
                        {t.viewPhoto}
                      </span>
                    </div>
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-[#2196F3] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="pt-3 px-1">
                    <h2 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                      {item.title}
                    </h2>
                  </div>
                </button>
              );
            }

            const info = getVideoPlaybackInfo(item.url, item.platform);
            return (
              <button
                key={item._id}
                type="button"
                onClick={() => setActiveVideo(item)}
                className="text-left bg-white rounded-2xl p-3 border border-[#90CAF9] shadow-sm group hover:shadow-lg hover:border-[#2196F3] transition-all cursor-pointer"
              >
                <div className="w-full h-56 bg-[#0D47A1] rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden border border-[#90CAF9]/40">
                  {info.thumbnailUrl && (
                    <img
                      src={info.thumbnailUrl}
                      alt={item.title || "Video thumbnail"}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/85 via-black/30 to-transparent" />
                  <div className="relative z-10 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white/25">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                  <span className="absolute top-3 left-3 z-10 bg-black/65 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                    {info.platformLabel}
                  </span>
                  {item.length && (
                    <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {item.length}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 z-10 text-xs font-bold text-white/95">
                    {t.watchVideo}
                  </span>
                </div>
                <div className="pt-3 px-1">
                  <h2 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                    {item.title}
                  </h2>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ফটো লাইটবক্স মোডাল */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#90CAF9]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#0D47A1] text-white">
              <div className="flex items-center gap-2 min-w-0">
                {activePhoto.tag && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2196F3] text-[10px] font-bold shrink-0">
                    {activePhoto.tag}
                  </span>
                )}
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label={t.close}
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center min-h-[280px] sm:min-h-[420px]">
              <img
                src={activePhoto.url}
                alt={activePhoto.title || "Gallery photo preview"}
                className="max-w-full max-h-[75vh] object-contain"
              />

              {filteredPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#2196F3] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#2196F3] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3 bg-white flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="truncate pr-4">{activePhoto.title}</span>
              <span className="shrink-0 text-[#0D47A1] font-bold">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ভিডিও প্লেয়ার মোডাল */}
      {activeVideo && activeVideoInfo && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#0D47A1] text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2196F3] text-[10px] font-bold uppercase shrink-0">
                  {activeVideoInfo.platformLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label={t.close}
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
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
                  title={activeVideo.title || "Video player"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-300">
                    {t.unsupportedEmbed}
                  </p>
                  <a
                    href={activeVideoInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.openExternal}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
