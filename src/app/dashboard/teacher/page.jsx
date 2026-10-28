"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const DESIGNATION_OPTIONS = [
  "প্রিন্সিপাল",
  "ভাইস প্রিন্সিপাল",
  "আবাসিক শিক্ষক",
  "অনাবাসিক শিক্ষক",
  "হিফজ শিক্ষক",
];

export default function TeacherProfileDashboard() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const teacherEmail = session?.user?.email || "yousuf.hasani@madrasah.edu";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);

  const syncPermissions = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/user/me?email=${encodeURIComponent(email)}`,
        {
          headers: { "x-user-email": email },
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUserPermissions(
            Array.isArray(data.user.permissions) ? data.user.permissions : [],
          );
        }
      }
    } catch (_) {}
  }, [session?.user?.email]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncPermissions();
  }, [syncPermissions]);

  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel("aim-auth-sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "PERMISSIONS_UPDATED") {
          syncPermissions();
        }
      };
    } catch (_) {}

    const handleCustomSync = () => {
      syncPermissions();
    };

    window.addEventListener("aim-auth-sync", handleCustomSync);
    window.addEventListener("storage", handleCustomSync);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("aim-auth-sync", handleCustomSync);
      window.removeEventListener("storage", handleCustomSync);
    };
  }, [syncPermissions]);

  const hasFinancePermission =
    currentUserPermissions.includes("manage_finance") ||
    currentUserPermissions.includes("accountant") ||
    currentUserPermissions.includes("accounts") ||
    currentUserPermissions.includes("finance") ||
    (Array.isArray(session?.user?.permissions) &&
      (session.user.permissions.includes("manage_finance") ||
        session.user.permissions.includes("accountant") ||
        session.user.permissions.includes("accounts") ||
        session.user.permissions.includes("finance")));

  // সিভির ১০টি পয়েন্ট অনুযায়ী পূর্ণাঙ্গ স্টেট
  const [profile, setProfile] = useState({
    email: teacherEmail,
    // ১. হেডার ও ব্যক্তিগত তথ্য
    teacherId: "",
    fullName: "",
    nameEnglish: "",
    designation: "",
    phone: "",
    address: "",
    addressDetails: {
      district: "",
      thana: "",
      postOffice: "",
      village: "",
    },
    bankAccount: {
      bankName: "",
      accountNumber: "",
      branchName: "",
      routingNumber: "",
      accountType: "সঞ্চয়ী (Savings)",
    },
    profileImage: "",

    bio: "",

    academic: [{ degree: "", institution: "", passingYear: "", result: "" }],

    experience: [
      { title: "", institution: "", duration: "", responsibilities: "" },
    ],

    hardSkills: "",
    softSkills: "",

    edTechSkills: "",

    certifications: [{ title: "", organization: "", year: "" }],

    publications: [{ title: "", journal: "", year: "", link: "" }],

    awards: [{ title: "", organization: "", year: "" }],

    references: [
      { name: "", designation: "", institution: "", email: "", phone: "" },
    ],
  });

  const fetchTeacherProfile = useCallback(async (email) => {
    if (!email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE}/api/teacher/profile/${encodeURIComponent(email)}`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          // নতুন শিক্ষক, ডাটাবেজে এখনো প্রোফাইল নেই
          return;
        }
        throw new Error(`সার্ভার কোড: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && result.data) {
        const rawBank = result.data.bankAccount;
        let parsedBank = {
          bankName: "",
          accountNumber: "",
          branchName: "",
          routingNumber: "",
          accountType: "সঞ্চয়ী (Savings)",
        };
        if (typeof rawBank === "object" && rawBank !== null) {
          parsedBank = { ...parsedBank, ...rawBank };
        } else if (typeof rawBank === "string") {
          parsedBank.accountNumber = rawBank;
        }

        // Map legacy English designation slug if present
        let parsedDesignation = result.data.designation || "";
        if (parsedDesignation === "residential_teacher") {
          parsedDesignation = "আবাসিক শিক্ষক";
        } else if (parsedDesignation === "hifz_teacher") {
          parsedDesignation = "হিফজ শিক্ষক";
        } else if (parsedDesignation === "teacher") {
          parsedDesignation = "অনাবাসিক শিক্ষক";
        }

        const rawAddrDetails = result.data.addressDetails;
        let parsedAddrDetails = {
          district: "",
          thana: "",
          postOffice: "",
          village: "",
        };
        if (typeof rawAddrDetails === "object" && rawAddrDetails !== null) {
          parsedAddrDetails = { ...parsedAddrDetails, ...rawAddrDetails };
        }

        setProfile((prev) => ({
          ...prev,
          ...result.data,
          teacherId:
            result.data.teacherId || result.data.idNo || prev.teacherId || "",
          designation: parsedDesignation,
          nameEnglish: result.data.nameEnglish || prev.nameEnglish || "",
          bankAccount: parsedBank,
          addressDetails: parsedAddrDetails,
          address: result.data.address || prev.address || "",
          email: email,
          socialLinks: {
            ...(prev.socialLinks || {}),
            ...(result.data.socialLinks || {}),
          },
          // অ্যারে ভ্যালুগুলো না থাকলে ডিফল্ট বজায় রাখা
          academic: result.data.academic?.length
            ? result.data.academic
            : prev.academic,
          experience: result.data.experience?.length
            ? result.data.experience
            : prev.experience,
          certifications: result.data.certifications?.length
            ? result.data.certifications
            : prev.certifications,
          publications: result.data.publications?.length
            ? result.data.publications
            : prev.publications,
          awards: result.data.awards?.length ? result.data.awards : prev.awards,
          references: result.data.references?.length
            ? result.data.references
            : prev.references,
        }));
      }
    } catch (err) {
      console.warn("Notice loading teacher profile:", err);
      if (
        err instanceof TypeError ||
        (err.message && err.message.includes("fetch"))
      ) {
        setError(
          "ব্যাকএন্ড সার্ভারের (port 5000) সাথে সংযোগ করা যায়নি। অনুগ্রহ করে ব্যাকএন্ড সার্ভার চালু রয়েছে কিনা যাচাই করুন।",
        );
      } else {
        setError("প্রোফাইল লোড করতে ব্যর্থ হয়েছে।");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionPending) {
      setProfile((prev) => ({ ...prev, email: teacherEmail }));
      fetchTeacherProfile(teacherEmail);
    }
  }, [sessionPending, teacherEmail, fetchTeacherProfile]);

  // ইনপুট পরিবর্তন হ্যান্ডলার
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value,
      },
    }));
  };

  const handleAddressDetailChange = (field, value) => {
    setProfile((prev) => {
      const updatedDetails = {
        ...(prev.addressDetails || {}),
        [field]: value,
      };
      // Format combined address string
      const parts = [
        updatedDetails.village,
        updatedDetails.postOffice ? `ডাকঘর: ${updatedDetails.postOffice}` : "",
        updatedDetails.thana,
        updatedDetails.district,
      ]
        .map((p) => (p || "").trim())
        .filter(Boolean);

      return {
        ...prev,
        addressDetails: updatedDetails,
        address: parts.length > 0 ? parts.join(", ") : prev.address,
      };
    });
  };

  // ডায়নামিক অ্যারে আপডেট হ্যান্ডলার
  const handleArrayChange = (arrayName, index, field, value) => {
    const list = [...profile[arrayName]];
    list[index][field] = value;
    setProfile((prev) => ({ ...prev, [arrayName]: list }));
  };

  const addArrayItem = (arrayName, emptyObj) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyObj],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    const list = profile[arrayName].filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, [arrayName]: list }));
  };

  // ইমেজ আপলোড
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      console.log("ImgBB Full Response:", data); // ব্রাউজার কনসোলে রেসপন্স দেখতে

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          profileImage: data.data.display_url,
        }));
        setSuccessMsg("ছবি সফলভাবে আপলোড করা হয়েছে!");
      } else {
        // ImgBB থেকে আসা আসল ইরর কনসোলে প্রিন্ট হবে
        console.error("ImgBB Error Details:", data.error);
        setError(data.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError("ছবি আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      setUploadingImage(false);
    }
  };
  // প্রোফাইল সেভ
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg("");

      const response = await fetch(`${API_BASE}/api/teacher/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMsg("প্রোফাইল সফলভাবে আপডেট করা হয়েছে! 🎉");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(result.message || "সেভ করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("সার্ভারে কানেক্ট করা সম্ভব হয়নি।");
    } finally {
      setSaving(false);
    }
  };

  // ব্রাউজার প্রিন্ট কল করা
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
        <p className="text-slate-600 font-bold animate-pulse text-center">
          তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* CSS Styles for Print Optimization */}
      <style jsx global>{`
        @media print {
          /* প্রিন্ট করার সময় ফর্ম ইনপুট পেজটি লুকিয়ে ফেলা হবে */
          .no-print {
            display: none !important;
          }
          /* শুধু সিভির প্রিন্ট প্রিভিউ লেআউটটি দৃশ্যমান হবে */
          .print-only {
            display: block !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

      {/* ======================================================================== */}
      {/* 🟢১. ড্যাশবোর্ড ভিউ (শুধুমাত্র স্ক্রিনে দেখা যাবে - `no-print`) */}
      {/* ======================================================================== */}
      <div className="no-print p-3 sm:p-6 md:p-8 bg-slate-50 min-h-screen space-y-6 text-slate-800 max-w-6xl mx-auto w-full">
        {/* হেডার ও প্রিন্ট বাটন */}
        <div className="bg-[#043e30] text-white p-4 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-400">
              সিভি ড্যাশবোর্ড 🕌
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              আপনার সমস্ত প্রাতিষ্ঠানিক ও সিভি সংক্রান্ত তথ্য আপডেট করুন
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
            {hasFinancePermission && (
              <Link
                href="/dashboard/accountant/finance"
                className="w-full sm:w-auto justify-center bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                💰 হিসাব বিভাগ
              </Link>
            )}
            <Link
              href="/dashboard/teacher/teachers-attendance"
              className="w-full sm:w-auto justify-center bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-100 font-bold px-4 py-2.5 rounded-xl border border-emerald-400/30 shadow-md transition-all flex items-center gap-2 text-sm"
            >
              📋 Attendance
            </Link>
            <button
              onClick={handlePrint}
              type="button"
              className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              🖨️ সিভি প্রিন্ট / ডাউনলোড
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving || uploadingImage}
              className="w-full sm:w-auto justify-center bg-amber-400 hover:bg-amber-500 text-[#043e30] font-bold px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
            >
              {saving ? "সেভ হচ্ছে..." : "💾 সেভ করুন"}
            </button>
          </div>
        </div>

        {/* হিসাব ও অর্থ বিভাগ অ্যাক্সেস নোটিফিকেশন ব্যানার */}
        {hasFinancePermission && (
          <div className="bg-[#032e24] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-emerald-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 bg-emerald-800/80 rounded-xl border border-emerald-600/50">
                💰
              </span>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-amber-300">
                  হিসাব ও অর্থ বিভাগের দায়িত্ব অর্পিত হয়েছে
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  আপনাকে মাদরাসার হিসাব ও অর্থ (Finance & Accounts) বিভাগ
                  পরিচালনার অনুমতি দেওয়া হয়েছে।
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Link
                href="/dashboard/accountant"
                className="flex-1 md:flex-none text-center bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold px-3.5 py-2 rounded-xl text-xs border border-emerald-600/60 shadow-xs transition-all"
              >
                হিসাব ওভারভিউ
              </Link>
              <Link
                href="/dashboard/accountant/finance"
                className="flex-1 md:flex-none text-center bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all"
              >
                অ্যাকাউন্টিং রিপোর্টস ↗
              </Link>
              <Link
                href="/dashboard/accountant/finance/category-management"
                className="flex-1 md:flex-none text-center bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold px-3.5 py-2 rounded-xl text-xs border border-emerald-600/60 shadow-xs transition-all"
              >
                খাত তৈরি ↗
              </Link>
            </div>
          </div>
        )}

        {/* মেসেজ নোটিফিকেশন */}
        {successMsg && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* ১. হেডার ও ব্যক্তিগত তথ্য */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ১. হেডার ও ব্যক্তিগত তথ্য (Profile & Personal Details)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                শিক্ষকের নাম, পদবি, যোগাযোগ, ঠিকানা এবং ব্যাংক হিসাব সংক্রান্ত
                তথ্য
              </p>
            </div>

            {/* প্রোফাইল ছবি আপলোড */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-emerald-700 shadow-md bg-slate-200 flex justify-center items-center shrink-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="text-xs w-full max-w-xs mx-auto sm:mx-0 cursor-pointer"
                    />
                    {uploadingImage && (
                      <p className="text-xs text-amber-600 font-semibold animate-pulse">
                        ছবি আপলোড হচ্ছে...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ১.১ নাম ও পরিচিতি (Personal Information) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                <span>👤</span>
                <span>নাম ও পদবি সংক্রান্ত তথ্য (Identity)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    শিক্ষক আইডি
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 0235"
                    value={profile.teacherId || ""}
                    onChange={(e) => handleChange("teacherId", e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono font-bold text-emerald-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মুহাম্মদ ইউসুফ হাসানী"
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    পূর্ণ নাম (ইংরেজিতে)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Yousuf Hasani"
                    value={profile.nameEnglish}
                    onChange={(e) =>
                      handleChange("nameEnglish", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রফেশনাল টাইটেল / পদবি{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={profile.designation}
                    onChange={(e) =>
                      handleChange("designation", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium text-slate-800"
                  >
                    <option value="">পদবি নির্বাচন করুন</option>
                    <option value="প্রিন্সিপাল">প্রিন্সিপাল</option>
                    <option value="ভাইস প্রিন্সিপাল">ভাইস প্রিন্সিপাল</option>
                    <option value="অনাবাসিক শিক্ষক">অনাবাসিক শিক্ষক</option>
                    <option value="আবাসিক শিক্ষক">আবাসিক শিক্ষক</option>
                    <option value="হিফজ শিক্ষক">হিফজ শিক্ষক</option>
                    {profile.designation &&
                      !DESIGNATION_OPTIONS.includes(profile.designation) && (
                        <option value={profile.designation}>
                          {profile.designation}
                        </option>
                      )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ইমেইল এড্রেস (Read-only)
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ১.২ বর্তমান ঠিকানা (Address Details) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                <span>📍</span>
                <span>বর্তমান ঠিকানা (Address Details)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    জেলা (District)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: হবিগঞ্জ"
                    value={profile.addressDetails?.district || ""}
                    onChange={(e) =>
                      handleAddressDetailChange("district", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    থানা / উপজেলা (Thana/Upazila)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: হবিগঞ্জ সদর"
                    value={profile.addressDetails?.thana || ""}
                    onChange={(e) =>
                      handleAddressDetailChange("thana", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ডাকঘর (Post Office)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: হবিগঞ্জ - ৩৩০০"
                    value={profile.addressDetails?.postOffice || ""}
                    onChange={(e) =>
                      handleAddressDetailChange("postOffice", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    গ্রাম / এলাকা / হোল্ডিং (Village/Area)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: রাজনগর (জজ বাড়ি সংলগ্ন)"
                    value={profile.addressDetails?.village || ""}
                    onChange={(e) =>
                      handleAddressDetailChange("village", e.target.value)
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পূর্ণাঙ্গ ঠিকানা (Full Address - সিভিতে প্রদর্শনের জন্য)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রাজনগর, ডাকঘর: হবিগঞ্জ, হবিগঞ্জ সদর, হবিগঞ্জ"
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* ১.৩ ব্যাংক অ্যাকাউন্ট ও আর্থিক তথ্য (Bank Account Details) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                <span>🏦</span>
                <span>
                  ব্যাংক অ্যাকাউন্ট সংক্রান্ত তথ্য (Bank Account Details)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ব্যাংকের নাম (Bank Name)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ পিএলসি"
                    value={profile.bankAccount?.bankName || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankAccount",
                        "bankName",
                        e.target.value,
                      )
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    হিসাব নম্বর (Account Number)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 20501234567890"
                    value={profile.bankAccount?.accountNumber || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankAccount",
                        "accountNumber",
                        e.target.value,
                      )
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono tracking-wider transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    শাখার নাম (Branch Name)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: হবিগঞ্জ শাখা"
                    value={profile.bankAccount?.branchName || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankAccount",
                        "branchName",
                        e.target.value,
                      )
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    রাউটিং নম্বর (Routing Number)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 125360789"
                    value={profile.bankAccount?.routingNumber || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankAccount",
                        "routingNumber",
                        e.target.value,
                      )
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono transition-all"
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অ্যাকাউন্টের ধরন (Account Type)
                  </label>
                  <select
                    value={
                      profile.bankAccount?.accountType || "সঞ্চয়ী (Savings)"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "bankAccount",
                        "accountType",
                        e.target.value,
                      )
                    }
                    className="w-full p-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-slate-800"
                  >
                    <option value="সঞ্চয়ী (Savings)">
                      সঞ্চয়ী হিসাব (Savings Account)
                    </option>
                    <option value="চলতি (Current)">
                      চলতি হিসাব (Current Account)
                    </option>
                    <option value="বেতন (Salary)">
                      বেতন হিসাব (Salary Account)
                    </option>
                    <option value="অন্যান্য">অন্যান্য (Other)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ২. প্রোফাইল সামারি / অবজেক্টিভ */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b pb-2">
              ২. প্রোফাইল সামারি / অবজেক্টিভ (Professional Summary)
            </h2>
            <textarea
              rows="3"
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="আপনার টিচিং ফিলোসফি ও সংক্ষিপ্ত অভিজ্ঞতা..."
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600"
            ></textarea>
          </div>

          {/* ৩. শিক্ষাগত যোগ্যতা */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ৩. শিক্ষাগত যোগ্যতা (Education)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("academic", {
                    degree: "",
                    institution: "",
                    passingYear: "",
                    result: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + নতুন ডিগ্রি যোগ করুন
              </button>
            </div>
            {profile.academic.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 relative"
              >
                <input
                  type="text"
                  placeholder="ডিগ্রীর নাম (যেমন: M.Sc / দাওরায়ে হাদিস)"
                  value={item.degree}
                  onChange={(e) =>
                    handleArrayChange("academic", idx, "degree", e.target.value)
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="প্রতিষ্ঠানের নাম"
                  value={item.institution}
                  onChange={(e) =>
                    handleArrayChange(
                      "academic",
                      idx,
                      "institution",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="পাসের বছর"
                  value={item.passingYear}
                  onChange={(e) =>
                    handleArrayChange(
                      "academic",
                      idx,
                      "passingYear",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="GPA / গ্রেড"
                    value={item.result}
                    onChange={(e) =>
                      handleArrayChange(
                        "academic",
                        idx,
                        "result",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  {profile.academic.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("academic", idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ৪. শিক্ষাদানের অভিজ্ঞতা */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ৪. শিক্ষাদানের অভিজ্ঞতা (Teaching Experience)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("experience", {
                    title: "",
                    institution: "",
                    duration: "",
                    responsibilities: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + অভিজ্ঞতা যোগ করুন
              </button>
            </div>
            {profile.experience.map((item, idx) => (
              <div
                key={idx}
                className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="পদবী (যেমন: Senior Teacher)"
                    value={item.title}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        idx,
                        "title",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  <input
                    type="text"
                    placeholder="প্রতিষ্ঠানের নাম"
                    value={item.institution}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        idx,
                        "institution",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  <div className="flex gap-2 items-center sm:col-span-2 md:col-span-1">
                    <input
                      type="text"
                      placeholder="সময়কাল (যেমন: 2021 - Present)"
                      value={item.duration}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          idx,
                          "duration",
                          e.target.value,
                        )
                      }
                      className="p-2 border rounded-lg text-xs w-full"
                    />
                    {profile.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("experience", idx)}
                        className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  rows="2"
                  placeholder="মূল দায়িত্ব ও সাফল্যসমূহ (কমা দিয়ে লিখুন)..."
                  value={item.responsibilities}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      idx,
                      "responsibilities",
                      e.target.value,
                    )
                  }
                  className="w-full p-2 border rounded-lg text-xs bg-white resize-none"
                ></textarea>
              </div>
            ))}
          </div>

          {/* ৫. বিষয়ভিত্তিক ও সফট স্কিল */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b pb-2">
              ৫. বিষয়ভিত্তিক ও পেশাগত দক্ষতা (Teaching Skills)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  হার্ড স্কিল (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  placeholder="Curriculum Development, Lesson Planning, Tajweed"
                  value={profile.hardSkills}
                  onChange={(e) => handleChange("hardSkills", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  সফট স্কিল (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  placeholder="Communication, Leadership, Problem Solving"
                  value={profile.softSkills}
                  onChange={(e) => handleChange("softSkills", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* ৬. টেকনোলজি ও সফটওয়্যার স্কিল */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b pb-2">
              ৬. টেকনোলজি ও সফটওয়্যার স্কিল (EdTech Skills)
            </h2>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                ডিজিটাল ও লার্নিং টুলস (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                placeholder="Google Classroom, MS PowerPoint, Zoom, Canva"
                value={profile.edTechSkills}
                onChange={(e) => handleChange("edTechSkills", e.target.value)}
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* ৭. সার্টিফিকেট ও ট্রেনিং */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ৭. সার্টিফিকেট ও ট্রেনিং (Certifications & Training)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("certifications", {
                    title: "",
                    organization: "",
                    year: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + নতুন যোগ করুন
              </button>
            </div>
            {profile.certifications.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 items-center"
              >
                <input
                  type="text"
                  placeholder="ট্রেনিং/সার্টিফিকেট শিরোনাম"
                  value={item.title}
                  onChange={(e) =>
                    handleArrayChange(
                      "certifications",
                      idx,
                      "title",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="ইস্টিটিউট/প্রতিষ্ঠান"
                  value={item.organization}
                  onChange={(e) =>
                    handleArrayChange(
                      "certifications",
                      idx,
                      "organization",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="সাল"
                    value={item.year}
                    onChange={(e) =>
                      handleArrayChange(
                        "certifications",
                        idx,
                        "year",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  {profile.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("certifications", idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ৮. গবেষণা ও পাবলিকেশন */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ৮. গবেষণা ও পাবলিকেশন (Research & Publications)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("publications", {
                    title: "",
                    journal: "",
                    year: "",
                    link: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + পাবলিকেশন যোগ করুন
              </button>
            </div>
            {profile.publications.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200"
              >
                <input
                  type="text"
                  placeholder="পেপার এর শিরোনাম"
                  value={item.title}
                  onChange={(e) =>
                    handleArrayChange(
                      "publications",
                      idx,
                      "title",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="জার্নালের নাম"
                  value={item.journal}
                  onChange={(e) =>
                    handleArrayChange(
                      "publications",
                      idx,
                      "journal",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="সাল"
                  value={item.year}
                  onChange={(e) =>
                    handleArrayChange(
                      "publications",
                      idx,
                      "year",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    placeholder="DOI / লিঙ্ক"
                    value={item.link}
                    onChange={(e) =>
                      handleArrayChange(
                        "publications",
                        idx,
                        "link",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  {profile.publications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("publications", idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ৯. অর্জন ও পুরস্কার */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ৯. অর্জন ও পুরস্কার (Honors & Awards)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("awards", {
                    title: "",
                    organization: "",
                    year: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + অ্যাওয়ার্ড যোগ করুন
              </button>
            </div>
            {profile.awards.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 items-center"
              >
                <input
                  type="text"
                  placeholder="পুরস্কারের নাম (যেমন: Best Teacher Award)"
                  value={item.title}
                  onChange={(e) =>
                    handleArrayChange("awards", idx, "title", e.target.value)
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="প্রদানকারী প্রতিষ্ঠান"
                  value={item.organization}
                  onChange={(e) =>
                    handleArrayChange(
                      "awards",
                      idx,
                      "organization",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="সাল"
                    value={item.year}
                    onChange={(e) =>
                      handleArrayChange("awards", idx, "year", e.target.value)
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  {profile.awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("awards", idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ১০. রেফারেন্স */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ১০. রেফারেন্স (References)
              </h2>
              <button
                type="button"
                onClick={() =>
                  addArrayItem("references", {
                    name: "",
                    designation: "",
                    institution: "",
                    email: "",
                    phone: "",
                  })
                }
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                + রেফারেন্স যোগ করুন
              </button>
            </div>
            {profile.references.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200"
              >
                <input
                  type="text"
                  placeholder="রেফারার এর নাম"
                  value={item.name}
                  onChange={(e) =>
                    handleArrayChange("references", idx, "name", e.target.value)
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="পদবী"
                  value={item.designation}
                  onChange={(e) =>
                    handleArrayChange(
                      "references",
                      idx,
                      "designation",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="text"
                  placeholder="প্রতিষ্ঠান"
                  value={item.institution}
                  onChange={(e) =>
                    handleArrayChange(
                      "references",
                      idx,
                      "institution",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <input
                  type="email"
                  placeholder="ইমেইল"
                  value={item.email}
                  onChange={(e) =>
                    handleArrayChange(
                      "references",
                      idx,
                      "email",
                      e.target.value,
                    )
                  }
                  className="p-2 border rounded-lg text-xs w-full"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="ফোন নম্বর"
                    value={item.phone}
                    onChange={(e) =>
                      handleArrayChange(
                        "references",
                        idx,
                        "phone",
                        e.target.value,
                      )
                    }
                    className="p-2 border rounded-lg text-xs w-full"
                  />
                  {profile.references.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("references", idx)}
                      className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1 border border-red-200 rounded bg-red-50"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={handlePrint}
              type="button"
              className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm flex items-center gap-2"
            >
              🖨️ প্রিভিউ ও সিভি প্রিন্ট করুন
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="w-full sm:w-auto justify-center bg-[#043e30] hover:bg-emerald-950 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
            >
              {saving ? "তথ্য সেভ হচ্ছে..." : "প্রোফাইল সেভ করুন"}
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================================== */}
      {/* 🟦২. সিভির প্রিন্ট লেআউট (শুধুমাত্র প্রিন্ট করার সময় দৃশ্যমান হবে - `print-only`) */}
      {/* ======================================================================== */}
      <div className="print-only p-4 sm:p-8 text-black bg-white max-w-4xl mx-auto leading-relaxed">
        {/* ১. সিভি হেডার */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-4 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-900">
              {profile.fullName || "Your Full Name"}
            </h1>
            {profile.nameEnglish &&
              profile.nameEnglish !== profile.fullName && (
                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
                  {profile.nameEnglish}
                </p>
              )}
            <p className="text-sm sm:text-md font-semibold text-slate-700 mt-1">
              {profile.designation || "Professional Title"}
              {profile.teacherId && (
                <span className="ml-2 text-xs font-mono px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-800">
                  ID: {profile.teacherId}
                </span>
              )}
            </p>
            <div className="text-xs text-slate-600 mt-2 space-y-0.5">
              <p>
                📍 {profile.address} | 📞 {profile.phone}
              </p>
              <p>
                ✉️ {profile.email}{" "}
                {profile?.socialLinks?.linkedin &&
                  `| 🔗 ${profile?.socialLinks?.linkedin}`}
              </p>
            </div>
          </div>
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt={profile.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-400 object-cover shrink-0"
            />
          )}
        </div>

        {/* ২. সামারি */}
        {profile.bio && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-1 text-slate-800">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 justify-baseline">
              {profile.bio}
            </p>
          </div>
        )}

        {/* ৩. অভিজ্ঞতা */}
        {profile.experience.some((e) => e.title) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
              Teaching Experience
            </h2>
            <div className="space-y-2">
              {profile.experience.map(
                (exp, i) =>
                  exp.title && (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>
                          {exp.title} - {exp.institution}
                        </span>
                        <span>{exp.duration}</span>
                      </div>
                      {exp.responsibilities && (
                        <p className="text-xs text-slate-700 mt-0.5">
                          • {exp.responsibilities}
                        </p>
                      )}
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {/* ৪. শিক্ষাগত যোগ্যতা */}
        {profile.academic.some((a) => a.degree) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
              Education
            </h2>
            <div className="space-y-1.5">
              {profile.academic.map(
                (ac, i) =>
                  ac.degree && (
                    <div key={i} className="flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {ac.degree}
                        </span>{" "}
                        - {ac.institution}{" "}
                        {ac.result && `(GPA/Grade: ${ac.result})`}
                      </div>
                      <span className="font-semibold text-slate-600">
                        {ac.passingYear}
                      </span>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {/* ৫. দক্ষতা ও টেকনোলজি স্কিল */}
        {(profile.hardSkills || profile.softSkills || profile.edTechSkills) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
              Skills & Expertise
            </h2>
            <div className="text-xs space-y-1 text-slate-700">
              {profile.hardSkills && (
                <p>
                  <strong>Teaching Skills:</strong> {profile.hardSkills}
                </p>
              )}
              {profile.softSkills && (
                <p>
                  <strong>Soft Skills:</strong> {profile.softSkills}
                </p>
              )}
              {profile.edTechSkills && (
                <p>
                  <strong>EdTech & Tools:</strong> {profile.edTechSkills}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ৬. গবেষণা ও পাবলিকেশন */}
        {profile.publications.some((p) => p.title) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
              Publications & Research
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {profile.publications.map(
                (pub, i) =>
                  pub.title && (
                    <p key={i}>
                      • "{pub.title}" - <i>{pub.journal}</i> ({pub.year})
                    </p>
                  ),
              )}
            </div>
          </div>
        )}

        {/* ৭. সার্টিফিকেট ও অ্যাওয়ার্ড */}
        {(profile.certifications.some((c) => c.title) ||
          profile.awards.some((a) => a.title)) && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.certifications.some((c) => c.title) && (
              <div>
                <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
                  Certifications
                </h2>
                <div className="text-xs space-y-1 text-slate-700">
                  {profile.certifications.map(
                    (c, i) =>
                      c.title && (
                        <p key={i}>
                          • {c.title} ({c.organization}, {c.year})
                        </p>
                      ),
                  )}
                </div>
              </div>
            )}
            {profile.awards.some((a) => a.title) && (
              <div>
                <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
                  Honors & Awards
                </h2>
                <div className="text-xs space-y-1 text-slate-700">
                  {profile.awards.map(
                    (a, i) =>
                      a.title && (
                        <p key={i}>
                          • {a.title} ({a.organization}, {a.year})
                        </p>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ৮. রেফারেন্স */}
        {profile.references.some((r) => r.name) && (
          <div>
            <h2 className="text-sm font-bold uppercase border-b border-slate-400 pb-1 mb-2 text-slate-800">
              References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              {profile.references.map(
                (ref, i) =>
                  ref.name && (
                    <div key={i}>
                      <p className="font-bold text-slate-900">{ref.name}</p>
                      <p>
                        {ref.designation}, {ref.institution}
                      </p>
                      <p>
                        Email: {ref.email} | Phone: {ref.phone}
                      </p>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
