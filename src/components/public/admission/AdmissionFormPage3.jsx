// components/AdmissionFormPage3.jsx
"use client";

import React, { useState } from "react";

export default function AdmissionFormPage3({ formData, handleChange }) {
  const [uploadingField, setUploadingField] = useState(null);

  // ImgBB API এর মাধ্যমে ছবি আপলোড হ্যান্ডলার (নিরাপত্তা ও ফাইল ভ্যালিডেশন সহ)
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // ImgBB PDF সাপোর্ট করে না, তাই শুধুমাত্র ছবি ফরম্যাট নিশ্চিত করা হচ্ছে
    if (file.type === "application/pdf") {
      alert("দুঃখিত, শুধুমাত্র ছবি (Image) ফরম্যাট সাপোর্ট করে। অনুগ্রহ করে PDF এর পরিবর্তে JPG বা PNG ছবি আপলোড করুন।");
      return;
    }

    // সর্বোচ্চ ৫ MB সাইজ লিমিট ভ্যালিডেশন
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("ফাইলটি অনেক বড়! অনুগ্রহ করে ৫ MB এর চেয়ে ছোট সাইজের ছবি আপলোড করুন।");
      return;
    }

    setUploadingField(fieldName);
    const data = new FormData();
    data.append("image", file);

    try {
      // পরিবেশ চলক (Environment Variable) অথবা ফলব্যাক হিসেবে আপনার API Key
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "5a4f8c279ddcedf0d73f50444bad88b0";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        // ফাইল আপলোড সফল হলে URL 'formData.attachments' এর ভেতরে সেভ হবে
        handleChange({
          target: {
            name: "attachments",
            value: {
              ...(formData?.attachments || {}),
              [fieldName]: result.data.url,
            },
          },
        });
      } else {
        alert("فাইল আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("নেটওয়ার্ক ত্রুটি! আবার চেষ্টা করুন।");
    } finally {
      setUploadingField(null);
    }
  };

  // আপলোড করা ফাইলের নাম বা সফলতার শর্টকাট মেসেজ রিডার
  const getFileStatus = (fieldName) => {
    if (uploadingField === fieldName) return "আপলোড হচ্ছে...";
    if (formData?.attachments?.[fieldName]) {
      return "✓ আপলোড সম্পন্ন";
    }
    return "ফাইল নির্বাচন করুন (ক্লিক করুন)";
  };

  return (
    <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen overflow-x-hidden">

      {/* ১. শিক্ষার্থীর অঙ্গীকারনামা */}
      <div className="w-full mb-6">
        <div className="text-center mb-4">
          <span className="border border-gray-500 rounded-full px-6 py-1.5 bg-gray-50 font-bold text-gray-800 text-sm shadow-sm inline-block">
            শিক্ষার্থীর অঙ্গীকার (প্রযোজ্যক্ষেত্রে)
          </span>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 text-justify space-y-3">
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            আমি
            <input
              type="text"
              name="studentCommitmentName"
              value={formData.studenttNameBangla || ""}
              onChange={handleChange}
              placeholder="(শিক্ষার্থীর নাম লিখুন)"
              className="w-full sm:w-60 text-center font-bold border-b border-gray-400 focus:outline-none bg-transparent px-1 text-sm mt-1 sm:mt-0 text-emerald-850"
            />
            <span>আস-সালাম আইডিয়াল মাদরাসা (AIM) এ ভর্তি হওয়ার আগ্রহ প্রকাশ করে অঙ্গীকার করছি যে—</span>
          </div>

          {/* ১০টি পয়েন্ট */}
          <ul className="space-y-2.5 pl-2 mt-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>অত্র মাদরাসার যাবতীয় নিয়ম কানুন মেনে চলব।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>পাঁচ ওয়াক্ত সালাত জামা'তের সাথে আদায় করব।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>মাথার চুল ও হাত পায়ের নখ ছোট রাখব।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>অনুমতি (গেট পাস) ছাড়া বা অভিভাবক ছাড়া কখনো মাদরাসা ক্যাম্পাসের বাহিরে যাব না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>কখনো বিদ্যুৎ, খাবার সহ অন্য যেকোনো কিছুর অপচয়/নষ্ট করব না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>মাদরাসা ক্যাম্পাসে নিজের কাছে কোন ধরনের মোবাইল, ইলেকট্রনিক্স ডিভাইস, চাকু-ছুরি বা এই জাতীয় কোন ক্ষতিকর জিনিস রাখব না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>উপরে ক্লাসের ভাইদের শ্রদ্ধা ও সম্মান করব। ছোটদের বা নিচের ক্লাসের শিক্ষার্থীদের আদর ও স্নেহ করব।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>কোন অবস্থাতেই নিজেদের মধ্যে কোন প্রকার ফেৎনা-ফাসাদ, মারামারি, বকাবকি করব না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>কোন রাজনৈতিক দলের সাথে জড়িত হব না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">★</span>
              <span>সমাজ ও রাষ্ট্রবিরোধী কোন কাজে জড়িত হব না, ইন-শা-আল্লাহ।</span>
            </li>
          </ul>
        </div>

        {/* শিক্ষার্থীর স্বাক্ষর ও তারিখ */}
        <div className="flex justify-between items-end mt-10">
          <div className="flex items-end gap-2 text-sm">
            <span className="font-bold text-gray-700">তারিখ:</span>
            <input
              type="date"
              name="studentSignatureDate"
              value={formData.studentSignatureDate || ""}
              onChange={handleChange}
              className="border border-gray-400 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="flex flex-col items-center w-36 sm:w-52">
    {/* শিক্ষার্থীর নাম (এখানে ফর্ম থেকে নাম দেখাবে) */}
    <div className="text-xs sm:text-sm text-gray-800 mb-1 font-medium min-h-[20px]">
      {formData.studentNameBangla || ""}
    </div>
    
    {/* স্বাক্ষর লাইন */}
    <div className="w-full text-center border-t border-gray-500 pt-1 text-xs sm:text-sm font-bold text-gray-700">
      শিক্ষার্থীর স্বাক্ষর
    </div>
  </div>
        </div>
      </div>

      {/* ২. প্রয়োজনীয় সংযুক্তিসমূহ ও আপলোড (প্রিন্ট করার সময় হাইড রাখার জন্য print:hidden যুক্ত) */}
      <div className="w-full mb-6 border border-gray-300 rounded-md p-4 bg-gray-50/30 print:hidden">
        <span className="font-bold text-pink-700 text-xs sm:text-sm block mb-4 border-b pb-1.5">
          সংযুক্তি: এই ফরমের সাথে নিম্নোক্ত প্রয়োজনীয় কাগজপত্র আপলোড করুন:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">

          {/* ১. জন্ম সনদপত্র */}
          <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded border border-gray-200">
            <span className="font-semibold text-gray-700">১. শিক্ষার্থীর অনলাইন জন্ম সনদপত্র:</span>
            <div className="relative border border-dashed border-orange-400 rounded bg-orange-50/30 h-10 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors overflow-hidden">
              <span className={`text-xs font-medium ${formData?.attachments?.birthCertificate ? 'text-emerald-700' : 'text-gray-500'}`}>
                {getFileStatus("birthCertificate")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "birthCertificate")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {formData?.attachments?.birthCertificate && (
              <a href={formData.attachments.birthCertificate} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
            )}
          </div>

          {/* ২. নাগরিক সনদপত্র */}
          <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded border border-gray-200">
            <span className="font-semibold text-gray-700">২. অভিভাবকের নাগরিক সনদপত্র:</span>
            <div className="relative border border-dashed border-orange-400 rounded bg-orange-50/30 h-10 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors overflow-hidden">
              <span className={`text-xs font-medium ${formData?.attachments?.citizenshipCertificate ? 'text-emerald-700' : 'text-gray-500'}`}>
                {getFileStatus("citizenshipCertificate")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "citizenshipCertificate")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {formData?.attachments?.citizenshipCertificate && (
              <a href={formData.attachments.citizenshipCertificate} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
            )}
          </div>

          {/* ৩. অভিভাবকের এনআইডি কার্ড */}
          <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded border border-gray-200">
            <span className="font-semibold text-gray-700">৩. অভিভাবকের এনআইডি (NID) কার্ডের স্পষ্ট কপি:</span>
            <div className="relative border border-dashed border-orange-400 rounded bg-orange-50/30 h-10 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors overflow-hidden">
              <span className={`text-xs font-medium ${formData?.attachments?.guardianNid ? 'text-emerald-700' : 'text-gray-500'}`}>
                {getFileStatus("guardianNid")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "guardianNid")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {formData?.attachments?.guardianNid && (
              <a href={formData.attachments.guardianNid} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
            )}
          </div>

          {/* ৪. পূর্ববর্তী প্রতিষ্ঠানের প্রশংসাপত্র/নম্বরপত্র */}
          <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded border border-gray-200">
            <span className="font-semibold text-gray-700">৪. পূর্ববর্তী প্রতিষ্ঠানের প্রশংসাপত্র এবং নম্বরপত্র (মার্কশিট):</span>
            <div className="relative border border-dashed border-orange-400 rounded bg-orange-50/30 h-10 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors overflow-hidden">
              <span className={`text-xs font-medium ${formData?.attachments?.academicTranscript ? 'text-emerald-700' : 'text-gray-500'}`}>
                {getFileStatus("academicTranscript")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "academicTranscript")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {formData?.attachments?.academicTranscript && (
              <a href={formData.attachments.academicTranscript} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
            )}
          </div>

          {/* ৫. নতুন ডাইনামিক ফিল্ড ১: ৭ম বা ৮ম শ্রেণীতে ভর্তি হতে চাইলে রেজিস্ট্রেশন কার্ড আপলোড */}
          {(formData.admissionClass === "সপ্তম" || formData.admissionClass === "অষ্টম" || formData.admissionClass === "7" || formData.admissionClass === "8") && (
            <div className="flex flex-col gap-1.5 bg-amber-50/60 p-2.5 rounded border border-amber-300 md:col-span-2 animate-fade-in">
              <span className="font-bold text-amber-900">৫. পূর্ববর্তী বোর্ডের প্রাথমিক/জেএসডি রেজিস্ট্রেশন কার্ডের স্পষ্ট কপি (৭ম/৮ম শ্রেণীতে ভর্তির জন্য):</span>
              <div className="relative border border-dashed border-amber-500 rounded bg-white h-10 flex items-center justify-center cursor-pointer hover:bg-amber-100/50 transition-colors overflow-hidden">
                <span className={`text-xs font-semibold ${formData?.attachments?.boardRegCard ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {getFileStatus("boardRegCard")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "boardRegCard")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {formData?.attachments?.boardRegCard && (
                <a href={formData.attachments.boardRegCard} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
              )}
            </div>
          )}

          {/* ৬. নতুন ডাইনামিক ফিল্ড ২: পিতা মৃত হলে ইয়াতীম সনদপত্র আপলোড */}
          {(formData.fatherStatus === "মৃত" || formData.fatherStatus === "مৃত") && (
            <div className="flex flex-col gap-1.5 bg-rose-50/60 p-2.5 rounded border border-rose-300 md:col-span-2 animate-fade-in">
              <span className="font-bold text-rose-900">৬. স্থানীয় চেয়ারম্যান/উপযুক্ত কর্তৃপক্ষ কর্তৃক প্রত্যয়িত অফিসিয়াল ইয়াতীম সনদপত্র:</span>
              <div className="relative border border-dashed border-rose-500 rounded bg-white h-10 flex items-center justify-center cursor-pointer hover:bg-rose-100/50 transition-colors overflow-hidden">
                <span className={`text-xs font-semibold ${formData?.attachments?.orphanCertificate ? 'text-emerald-700' : 'text-rose-800'}`}>
                  {getFileStatus("orphanCertificate")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "orphanCertificate")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {formData?.attachments?.orphanCertificate && (
                <a href={formData.attachments.orphanCertificate} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-0.5">আপলোডকৃত ফাইল দেখুন</a>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
