"use client";

import React, { useState, useEffect } from "react";

export default function TeacherProfileDashboard() {
  const teacherEmail = "yousuf.hasani@madrasah.edu";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [profile, setProfile] = useState({
    email: teacherEmail,
    fullName: "",
    designation: "",
    phone: "",
    address: "",
    bio: "",
    profileImage: "", // <-- ইমেজ URL স্টেট
    socialLinks: { linkedin: "", researchgate: "", website: "" },
    academic: { department: "", expertise: "", degree: "", institution: "", passingYear: "" },
    experience: [],
    publications: [],
    isPublicView: true
  });

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/teacher/profile/${teacherEmail}`);
      const result = await res.json();

      if (result.success && result.data) {
        setProfile((prev) => ({ ...prev, ...result.data }));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("প্রোফাইল লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ আপলোড হ্যান্ডলার (এখানে ImgBB API ব্যবহার করা হয়েছে উদাহরণ হিসেবে)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      // ImgBB API key (আপনার নিজস্ব ImgBB/Cloudinary API কী ব্যবহার করুন)
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfile((prev) => ({ ...prev, profileImage: data.data.display_url }));
        setSuccessMsg("ছবি সফলভাবে আপলোড করা হয়েছে!");
      } else {
        setError("ছবি আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError("ছবি আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg("");

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/teacher/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <p className="text-slate-600 font-bold animate-pulse">তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen space-y-6 text-slate-800 max-w-6xl mx-auto">
      {/* হেডার */}
      <div className="bg-[#043e30] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">উস্তাদ প্রোফাইল ও ড্যাশবোর্ড 🕌</h1>
          <p className="text-sm text-emerald-200 mt-1">আপনার প্রাতিষ্ঠানিক ও ব্যক্তিগত তথ্য পরিচালনা করুন</p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving || uploadingImage}
          className="bg-amber-400 hover:bg-amber-500 text-[#043e30] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {saving ? "সেভ হচ্ছে..." : "💾 সমস্ত তথ্য সেভ করুন"}
        </button>
      </div>

      {/* মেসেজ */}
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
        {/* ১. প্রোফাইল পিকচার এবং প্রাথমিক তথ্য */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            👤 মৌলিক ও ব্যক্তিগত তথ্য
          </h2>

          {/* প্রোফাইল পিকচার সেকশন */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-700 shadow-md bg-slate-200 flex justify-center items-center">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🕌</span>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <label className="block text-xs font-bold text-slate-700">প্রোফাইল ছবি পরিবর্তন করুন</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />
              {uploadingImage && <p className="text-xs text-amber-600 font-semibold animate-pulse">ছবি আপলোড হচ্ছে...</p>}
              <p className="text-[11px] text-slate-400">অনুমোদিত ফরম্যাট: JPG, PNG (সর্বোচ্চ ২MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="যেমন: মাওলানা কারী ইউসুফ"
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">পদবী (Designation)</label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                placeholder="যেমন: সিনিয়র শিক্ষক, কিতাব বিভাগ"
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">ফোন নম্বর</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+88017xxxxxxxx"
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">ইমেইল (Read-only)</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">বায়ো / সংক্ষিপ্ত বিবরণ</label>
            <textarea
              rows="3"
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="আপনার অভিজ্ঞতা বা টিচিং ফিলোসফি সম্পর্কিত বিবরণ লিখুন..."
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-none"
            ></textarea>
          </div>
        </div>

        {/* সেভ বাটন */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="bg-[#043e30] hover:bg-emerald-950 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {saving ? "তথ্য আপডেট হচ্ছে..." : "প্রোফাইল তথ্য আপডেট করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}