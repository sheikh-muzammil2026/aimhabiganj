"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Images,
  Video,
  Sparkles,
  Play,
  ArrowRight,
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

const MAX_HOME_ALL = 8;
const MAX_HOME_PHOTOS = 6;
const MAX_HOME_VIDEOS = 4;

export default function GallerySection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all"); // all | photos | videos
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const content = {
    bn: {
      badge: "মাদরাসা মিডিয়া আর্কাইভ",
      headingPrefix: "আমাদের ক্যাম্পাস ও",
      headingHighlight: "গ্যালারি মুহূর্ত",
      subtitle:
        "আস-সালাম আইডিয়াল মাদরাসার দ্বীনি মাহফিল, ক্লাসরুম কার্যক্রম, পুরস্কার বিতরণী ও স্মরণীয় মুহূর্তগুলোর জীবন্ত প্রতিচ্ছবি।",
      tabs: {
        all: "সকল",
        photos: "ফটো",
        videos: "ভিডিও",
      },
      viewAll: "সম্পূর্ণ গ্যালারি দেখুন",
      watchVideo: "ভিডিও দেখুন",
      viewPhoto: "বড় করে দেখুন",
      emptyTitle: "গ্যালারিতে এখনো কোনো মিডিয়া যুক্ত করা হয়নি",
      emptySubtitle:
        "অ্যাডমিন প্যানেল থেকে নতুন ছবি বা ভিডিও যুক্ত করা মাত্রই এখানে প্রদর্শিত হবে।",
      errorText: "এই মুহূর্তে গ্যালারি লোড করা যাচ্ছে না। অনুগ্রহ করে পরে চেষ্টা করুন।",
      close: "বন্ধ করুন",
      openExternal: "নতুন ট্যাবে ভিডিও দেখুন",
      unsupportedEmbed: "এই ভিডিও লিংকটি সরাসরি এম্বেড করা যাচ্ছে না।",
    },
    en: {
      badge: "Campus Media Archive",
      headingPrefix: "Moments from Our",
      headingHighlight: "Media Gallery",
      subtitle:
        "Explore highlights from our Islamic gatherings, smart classrooms, Quran competitions, and vibrant campus life.",
      tabs: {
        all: "All",
        photos: "Photos",
        videos: "Videos",
      },
      viewAll: "View Full Gallery",
      watchVideo: "Play Video",
      viewPhoto: "View Photo",
      emptyTitle: "No gallery items published yet",
      emptySubtitle:
        "Photos and videos uploaded from the dashboard will automatically appear here.",
      errorText: "Unable to load gallery right now. Please try again later.",
      close: "Close",
      openExternal: "Watch in New Tab",
      unsupportedEmbed: "This video link cannot be embedded directly.",
    },
    ar: {
      badge: "أرشيف الوسائط",
      headingPrefix: "لقطات من",
      headingHighlight: "معرض الصور والفيديو",
      subtitle:
        "تصفح أجمل اللحظات من فعاليات المدرسة الدينية والفصول الدراسية الذكية ومسابقات القرآن الكريم.",
      tabs: {
        all: "الكل",
        photos: "الصور",
        videos: "الفيديو",
      },
      viewAll: "عرض المعرض الكامل",
      watchVideo: "تشغيل الفيديو",
      viewPhoto: "تكبير الصورة",
      emptyTitle: "لا توجد وسائط منشورة حالياً",
      emptySubtitle:
        "ستظهر الصور ومقاطع الفيديو تلقائياً هنا فور إضافتها من لوحة التحكم.",
      errorText: "تعذر تحميل المعرض في الوقت الحالي. يرجى المحاولة لاحقاً.",
      close: "إغلاق",
      openExternal: "مشاهدة في نافذة جديدة",
      unsupportedEmbed: "لا يمكن تضمين رابط الفيديو هذا مباشرة.",
    },
  };

  const t = content[language] || content.bn;

  useEffect(() => {
    let active = true;
    const loadGallery = async () => {
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
        console.error("Homepage gallery fetch error:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadGallery();
    return () => {
      active = false;
    };
  }, []);

  const combinedItems = useMemo(() => {
    const taggedPhotos = photos.map((p, idx) => ({
      ...p,
      mediaKind: "photo",
      photoIndex: idx,
      sortTime: p.createdAt ? new Date(p.createdAt).getTime() : 0,
    }));
    const taggedVideos = videos.map((v) => ({
      ...v,
      mediaKind: "video",
      sortTime: v.createdAt ? new Date(v.createdAt).getTime() : 0,
    }));
    return [...taggedPhotos, ...taggedVideos].sort(
      (a, b) => b.sortTime - a.sortTime,
    );
  }, [photos, videos]);

  const displayedItems = useMemo(() => {
    if (activeTab === "photos") {
      return photos.slice(0, MAX_HOME_PHOTOS).map((p, idx) => ({
        ...p,
        mediaKind: "photo",
        photoIndex: idx,
      }));
    }
    if (activeTab === "videos") {
      return videos.slice(0, MAX_HOME_VIDEOS).map((v) => ({
        ...v,
        mediaKind: "video",
      }));
    }
    return combinedItems.slice(0, MAX_HOME_ALL);
  }, [activeTab, photos, videos, combinedItems]);

  const handleNextPhoto = useCallback(() => {
    if (photos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % photos.length,
    );
  }, [photos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (photos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + photos.length) % photos.length,
    );
  }, [photos.length]);

  // Keyboard shortcuts for Lightbox & Video Modal
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
    lightboxIndex !== null && photos[lightboxIndex]
      ? photos[lightboxIndex]
      : null;

  const activeVideoInfo = activeVideo
    ? getVideoPlaybackInfo(activeVideo.url, activeVideo.platform)
    : null;

  const totalCount = photos.length + videos.length;

  return (
    <section
      id="gallery"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white via-[#F5FAFF] to-white border-t border-[#90CAF9]/30 overflow-hidden transition-colors duration-300"
    >
      {/* সূক্ষ্ম ডেকোরেটিভ ব্যাকগ্রাউন্ড গ্লো */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-10 w-80 h-80 bg-[#90CAF9]/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 left-10 w-80 h-80 bg-[#2196F3]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 site-container">
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#E3F2FD] border border-[#90CAF9] px-4 py-1.5 rounded-full shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#2196F3]" />
            <span className="text-[#0D47A1] font-bold text-xs uppercase tracking-widest">
              {t.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#0D47A1] leading-tight tracking-tight">
            {t.headingPrefix}{" "}
            <span className="text-[#2196F3]">{t.headingHighlight}</span>
          </h2>

          <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#90CAF9]" />
            <div className="h-2 w-2 rotate-45 bg-[#2196F3] shadow-[0_0_8px_rgba(33,150,243,0.5)]" />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#90CAF9]" />
          </div>
        </div>

        {/* ফিল্টার ট্যাব বার */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="inline-flex flex-wrap justify-center bg-white p-1.5 rounded-2xl border border-[#90CAF9] shadow-xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#0D47A1] text-white shadow-sm"
                  : "text-[#1E293B] hover:text-[#0D47A1] hover:bg-[#E3F2FD]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {t.tabs.all} ({totalCount})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("photos")}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
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
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
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
        </div>

        {/* কন্টেন্ট এরিয়া */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-[#90CAF9]/50 shadow-xs animate-pulse"
              >
                <div className="w-full h-52 rounded-xl bg-[#E3F2FD]" />
                <div className="h-4 bg-[#E3F2FD] rounded w-3/4 mt-4" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#90CAF9]/60 shadow-xs max-w-xl mx-auto">
            <p className="text-sm font-bold text-[#0D47A1]">{t.errorText}</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-14 px-6 bg-white rounded-2xl border border-dashed border-[#90CAF9] shadow-xs max-w-xl mx-auto space-y-2">
            <Camera className="w-10 h-10 text-[#2196F3] mx-auto opacity-80" />
            <h3 className="text-base font-black text-[#0D47A1]">
              {t.emptyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.emptySubtitle}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              activeTab === "videos"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {displayedItems.map((item) => {
              if (item.mediaKind === "photo") {
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setLightboxIndex(item.photoIndex)}
                    className="group text-left bg-white rounded-2xl p-2.5 border border-[#90CAF9]/70 hover:border-[#2196F3] shadow-sm hover:shadow-xl hover:shadow-[#0D47A1]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                  >
                    <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#E3F2FD]">
                      <img
                        src={item.url}
                        alt={item.title || "Gallery photo"}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
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

                    <div className="pt-3 px-1.5 pb-1 flex-1 flex flex-col justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </button>
                );
              }

              const videoInfo = getVideoPlaybackInfo(item.url, item.platform);
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  className="group text-left bg-white rounded-2xl p-2.5 border border-[#90CAF9]/70 hover:border-[#2196F3] shadow-sm hover:shadow-xl hover:shadow-[#0D47A1]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                >
                  <div
                    className={`relative w-full ${
                      activeTab === "videos" ? "h-56 sm:h-64" : "h-52"
                    } rounded-xl overflow-hidden bg-[#0D47A1] flex flex-col items-center justify-center text-white`}
                  >
                    {videoInfo.thumbnailUrl && (
                      <img
                        src={videoInfo.thumbnailUrl}
                        alt={item.title || "Video thumbnail"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/85 via-black/30 to-transparent" />

                    <div className="relative z-10 w-14 h-14 rounded-full bg-[#2196F3] group-hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ring-4 ring-white/25">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>

                    <span className="absolute top-3 left-3 z-10 bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/15">
                      {videoInfo.platformLabel}
                    </span>

                    {item.length && (
                      <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        {item.length}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 z-10 text-[11px] font-bold text-white/95">
                      {t.watchVideo}
                    </span>
                  </div>

                  <div className="pt-3 px-1.5 pb-1 flex-1 flex flex-col justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2 leading-snug group-hover:text-[#2196F3] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ভিউ অল বাটন */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0D47A1] hover:bg-[#2196F3] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0D47A1]/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

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

              {photos.length > 1 && (
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
                {lightboxIndex + 1} / {photos.length}
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
    </section>
  );
}
