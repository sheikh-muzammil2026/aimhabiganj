"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

  // Name & Image state
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [prevUser, setPrevUser] = useState(user);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  if (user !== prevUser) {
    setPrevUser(user);
    if (user?.name) setName(user.name);
    if (user?.image) setImage(user.image);
  }

  // Handle ImgBB Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg({
        type: "error",
        text: "শুধুমাত্র ইমেজ ফাইল (JPG, PNG ইত্যাদি) আপলোড করা যাবে।",
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setProfileMsg({
        type: "error",
        text: "ছবির সাইজ ৩MB-র কম হতে হবে।",
      });
      return;
    }

    try {
      setUploadingImage(true);
      setProfileMsg({ type: "", text: "" });

      const formData = new FormData();
      formData.append("image", file);

      const apiKey =
        process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
        "655d8bb450403cae15210dca401de9af";
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (data.success) {
        setImage(data.data.display_url);
        setProfileMsg({
          type: "success",
          text: "ছবি সফলভাবে নির্বাচিত হয়েছে! সেভ করতে 'প্রোফাইল সংরক্ষণ করুন' বাটনে চাপুন।",
        });
      } else {
        setProfileMsg({
          type: "error",
          text: data.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setProfileMsg({
        type: "error",
        text: "ছবি আপলোড সার্ভারের সাথে যোগাযোগ ব্যর্থ হয়েছে।",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Profile (Name & Image)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "নাম খালি রাখা যাবে না।" });
      return;
    }

    try {
      setSavingProfile(true);
      setProfileMsg({ type: "", text: "" });

      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          email: user?.email,
          name: name.trim(),
          image: image.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfileMsg({
          type: "success",
          text: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
        });
        if (typeof refetch === "function") {
          refetch();
        }
      } else {
        setProfileMsg({
          type: "error",
          text: data.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setProfileMsg({
        type: "error",
        text: "সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Request Email Update
  const handleRequestEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailMsg({
        type: "error",
        text: "একটি সঠিক নতুন ইমেইল ঠিকানা লিখুন।",
      });
      return;
    }

    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setEmailMsg({
        type: "error",
        text: "এটি আপনার বর্তমান ইমেইল। নতুন কোনো ইমেইল ঠিকানা দিন।",
      });
      return;
    }

    try {
      setSendingEmailOtp(true);
      setEmailMsg({ type: "", text: "" });

      const res = await fetch(`${API_BASE_URL}/api/user/request-email-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          email: user?.email,
          newEmail: newEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailMsg({
          type: "success",
          text:
            data.message ||
            "নতুন ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন।",
        });
      } else {
        setEmailMsg({
          type: "error",
          text: data.message || "ইমেইল ভেরিফিকেশন লিংক পাঠাতে ব্যর্থ হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Email update error:", err);
      setEmailMsg({
        type: "error",
        text: "সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।",
      });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({
        type: "error",
        text: "বর্তমান পাসওয়ার্ড প্রদান করুন।",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: "নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।",
      });
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordMsg({ type: "", text: "" });

      const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          email: user?.email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordMsg({
          type: "success",
          text: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({
          type: "error",
          text: data.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।",
        });
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordMsg({
        type: "error",
        text: "সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
          প্রোফাইল তথ্য লোড হচ্ছে...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#043e30] via-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>নিরাপত্তা ও সেটিংস</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              প্রোফাইল সেটিংস
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm">
              আপনার ব্যক্তিগত তথ্য, ছবি এবং নিরাপত্তা সেটিংস পরিচালনা করুন
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold capitalize">
              রোল: {user?.role || "ব্যবহারকারী"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar Card & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-emerald-500/20 dark:ring-emerald-400/20 overflow-hidden bg-emerald-50 dark:bg-slate-800 flex items-center justify-center">
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg cursor-pointer transition-all transform hover:scale-105"
                title="ছবি পরিবর্তন করুন"
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={handleImageUpload}
              />
            </div>

            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {name || "নাম প্রদান করুন"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.email}
            </p>
            <div className="inline-block mt-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              {user?.role || "User"}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
              সর্বোচ্চ ৩MB পর্যন্ত ছবি অনুমোদিত।
            </p>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Name and Avatar Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                সাধারণ তথ্য
              </h2>
            </div>

            {profileMsg.text && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  প্রোফাইল ছবির লিংক (URL - ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile || uploadingImage}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>প্রোফাইল সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Email Address & Verification */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Mail className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                ইমেইল ঠিকানা পরিবর্তন
              </h2>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  বর্তমান ইমেইল
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {user?.email}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ভেরিফাইড</span>
              </span>
            </div>

            {emailMsg.text && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                  emailMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                }`}
              >
                {emailMsg.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{emailMsg.text}</span>
              </div>
            )}

            <form
              onSubmit={handleRequestEmailUpdate}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  নতুন ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="newemail@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  নিরাপত্তার স্বার্থে নতুন ইমেইলে একটি নিশ্চিতকরণ লিংক পাঠানো
                  হবে। লিংকটিতে ক্লিক করলেই কেবল নতুন ইমেইল কার্যকর হবে।
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={sendingEmailOtp}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {sendingEmailOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>লিংক পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <span>ভেরিফিকেশন লিংক পাঠান</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 3. Password Change Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Lock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                পাসওয়ার্ড পরিবর্তন
              </h2>
            </div>

            {passwordMsg.text && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                }`}
              >
                {passwordMsg.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড দিন"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    নতুন পাসওয়ার্ড নিশ্চিত করুন{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="পুনরায় টাইপ করুন"
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>আপডেট হচ্ছে...</span>
                    </>
                  ) : (
                    <span>পাসওয়ার্ড আপডেট করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
