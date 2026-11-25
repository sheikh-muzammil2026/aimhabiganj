"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Video,
  UploadCloud,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Film,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVideoPlaybackInfo } from "@/components/public/gallery/galleryMediaUtils";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000";

export default function AdminGalleryPage() {
  const { data: session } = authClient.useSession();
  const [itemType, setItemType] = useState("photo"); // photo | video
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("ক্যাম্পাস");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLength, setVideoLength] = useState("");
  const [platform, setPlatform] = useState("YouTube");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const IMGBB_API_KEY = "5a4f8c279ddcedf0d73f50444bad88b0";

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const videoInfo =
    itemType === "video" && videoUrl
      ? getVideoPlaybackInfo(videoUrl, platform)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    let finalUrl = "";

    try {
      // ১. আইটেম যদি ফটো হয়, প্রথমে ImgBB তে আপলোড হবে
      if (itemType === "photo") {
        if (!imageFile) {
          setMessage({
            type: "error",
            text: "দয়া করে একটি ছবি সিলেক্ট করুন।",
          });
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          },
        );
        const imgbbData = await imgbbResponse.json();

        if (imgbbData.success) {
          finalUrl = imgbbData.data.url;
        } else {
          throw new Error("ImgBB-তে ছবি আপলোড ব্যর্থ হয়েছে।");
        }
      } else {
        // ২. আইটেম যদি ভিডিও হয়, ডিরেক্ট ইনপুট ইউআরএল নেওয়া হবে
        finalUrl = videoUrl.trim();
      }

      // ৩. ডাটাবেজের জন্য ডাটা অবজেক্ট তৈরি
      const payload = {
        type: itemType,
        title: title.trim(),
        url: finalUrl,
        ...(itemType === "photo"
          ? { tag }
          : { length: videoLength.trim(), platform }),
      };

      const headers = { "Content-Type": "application/json" };
      if (session?.user?.email) {
        headers["x-user-email"] = session.user.email;
      }

      // ৪. এক্সপ্রেস সার্ভারে ডাটা পাঠানো (Admin RBAC সুরক্ষিত)
      const response = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "আলহামদুলিল্লাহ্‌, মিডিয়াটি সফলভাবে লাইভ গ্যালারিতে যুক্ত হয়েছে।",
        });
        setTitle("");
        setVideoUrl("");
        setVideoLength("");
        setImageFile(null);
      } else {
        setMessage({
          type: "error",
          text:
            data.message ||
            "মিডিয়া যুক্ত করা সম্ভব হয়নি। শুধুমাত্র অ্যাডমিনরা গ্যালারিতে আপলোড করতে পারবেন।",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "কোনো একটি ত্রুটি ঘটেছে, আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9]/40 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0D47A1] flex items-center gap-2">
            <span>🖼️</span>
            <span>মিডিয়া গ্যালারি নিয়ন্ত্রণ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            হোমপেজ এবং পাবলিক গ্যালারির ফটো ও ভিডিও কন্টেন্ট আপলোড এবং প্রকাশ করুন।
          </p>
        </div>

        <Link
          href="/dashboard/shared/gallery/list"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] text-xs sm:text-sm font-bold shadow-xs transition-all self-start sm:self-auto"
        >
          <ListChecks className="w-4 h-4 text-[#2196F3]" />
          <span>সকল মিডিয়া তালিকা দেখুন</span>
        </Link>
      </div>

      {/* মেসেজ অ্যালার্ট */}
      {message.text && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-2xl text-xs sm:text-sm font-bold border shadow-xs ${message.type === "success"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* মূল ২-কলাম রেসপন্সিভ গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* বাম কলাম: আপলোড ফর্ম */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white border border-[#90CAF9]/40 p-5 sm:p-7 rounded-2xl shadow-xs space-y-6"
        >
          {/* টাইপ সিলেকশন */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wide">
              মিডিয়া টাইপ সিলেক্ট করুন
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemType("photo")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${itemType === "photo"
                  ? "border-[#2196F3] bg-[#E3F2FD]/70 text-[#0D47A1] shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#90CAF9]"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${itemType === "photo"
                    ? "bg-[#2196F3] text-white"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">নতুন ছবি (Photo)</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    ইমেজ আপলোড করে গ্যালারিতে যুক্ত করুন
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setItemType("video")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${itemType === "video"
                  ? "border-[#2196F3] bg-[#E3F2FD]/70 text-[#0D47A1] shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#90CAF9]"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${itemType === "video"
                    ? "bg-[#2196F3] text-white"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">নতুন ভিডিও (Video)</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    YouTube, Facebook, Vimeo বা MP4 লিংক
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* সাধারণ শিরোনাম */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              মিডিয়া শিরোনাম / ক্যাপশন <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: বার্ষিক দস্তারবন্দী ও দুআ মাহফিল ২০২৬"
              className="w-full px-4 py-3 border border-slate-200 focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all"
            />
          </div>

          {/* কন্ডিশনাল ফিল্ড ১: ফটো আপলোড এরিয়া */}
          {itemType === "photo" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  ফটো ক্যাটাগরি / ট্যাগ (Tag)
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 rounded-xl text-sm bg-white font-semibold text-slate-800 outline-none"
                >
                  <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                  <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                  <option value="প্রতিযোগিতা">প্রতিযোগিতা</option>
                  <option value="শিক্ষা">শিক্ষা</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  ছবি সিলেক্ট করুন (Image File){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E3F2FD] file:text-[#0D47A1] hover:file:bg-[#90CAF9]/40 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* কন্ডিশনাল ফিল্ড ২: ভিডিও এরিয়া */}
          {itemType === "video" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  ভিডিও ইউআরএল (YouTube / Facebook / Vimeo / Direct MP4){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... অথবা https://.../video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 rounded-xl text-sm font-mono text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    প্লাটফর্ম (Platform)
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 rounded-xl text-sm bg-white font-semibold text-slate-800 outline-none"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Vimeo">Vimeo</option>
                    <option value="Direct Video">Direct Video (MP4/WebM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    ভিডিওর দৈর্ঘ্য (Duration)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ১২:৩০"
                    value={videoLength}
                    onChange={(e) => setVideoLength(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 rounded-xl text-sm font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* সাবমিট বোতাম */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 font-medium">
              প্রকাশিত মিডিয়া স্বয়ংক্রিয়ভাবে পাবলিক হোমপেজ ও গ্যালারি পেজে যুক্ত হবে।
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "প্রসেসিং ও আপলোড হচ্ছে..."
                  : "গ্যালারিতে প্রকাশ করুন"}
              </span>
            </button>
          </div>
        </form>

        {/* ডান কলাম: লাইভ কার্ড প্রিভিউ */}
        <div className="lg:col-span-4 bg-white border border-[#90CAF9]/40 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#0D47A1] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2196F3]" />
              <span>লাইভ কার্ড প্রিভিউ</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E3F2FD] text-[#0D47A1]">
              {itemType === "photo" ? "Photo" : "Video"}
            </span>
          </div>

          <div className="rounded-xl border border-[#90CAF9]/50 overflow-hidden bg-slate-50">
            {itemType === "photo" ? (
              <div className="relative h-48 bg-[#E3F2FD]/60 flex items-center justify-center overflow-hidden">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Selected preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-400 px-4">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 text-[#90CAF9]" />
                    <p className="text-xs font-semibold">
                      ছবি নির্বাচন করলে এখানে প্রিভিউ দেখাবে
                    </p>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 bg-[#2196F3] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                  {tag}
                </span>
              </div>
            ) : (
              <div className="relative h-48 bg-[#0D47A1] flex flex-col items-center justify-center text-white overflow-hidden">
                {videoInfo?.thumbnailUrl ? (
                  <img
                    src={videoInfo.thumbnailUrl}
                    alt="Video thumbnail preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                  />
                ) : null}
                <div className="relative z-10 w-12 h-12 rounded-full bg-red-600/95 flex items-center justify-center shadow-lg">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider mt-2 bg-black/50 px-2.5 py-0.5 rounded-full">
                  {platform}
                </span>
                {videoLength && (
                  <span className="absolute bottom-2.5 right-2.5 z-10 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    ⏱️ {videoLength}
                  </span>
                )}
              </div>
            )}

            <div className="p-3.5 bg-white">
              <p className="text-xs sm:text-sm font-bold text-[#0D47A1] line-clamp-2">
                {title || "এখানে মিডিয়ার শিরোনাম প্রদর্শিত হবে..."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#E3F2FD]/50 border border-[#90CAF9]/40 p-3.5 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
            <p className="font-bold text-[#0D47A1]">সাপোর্টেড ভিডিও ফরম্যাট:</p>
            <p>• YouTube লিংক (watch, youtu.be, shorts)</p>
            <p>• Facebook ও Vimeo ভিডিও লিংক</p>
            <p>• ডাইরেক্ট ভিডিও ফাইল (.mp4, .webm, .ogg)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
