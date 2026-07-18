// components/AdmissionFormPage2.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AdmissionFormPage2({ formData, handleChange }) {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ড্রপডাউনের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার জন্য ইফেক্ট
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ইমেজবিবি (ImgBB) API-তে ছবি আপলোড করার ফাংশন
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      // আপনার ImgBB API Key
      const apiKey = "5a4f8c279ddcedf0d73f50444bad88b0";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        handleChange({
          target: { name: "guardianImage", value: result.data.url },
        });
      } else {
        alert("ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  // অভিভাবকের অঙ্গীকারনামার জন্য ডায়নামিক রিলেশন এবং নামের লজিক
  const getDynamicRelation = () => {
    if (formData.fatherStatus === "জীবিত") return "পিতা";
    if (formData.motherStatus === "জীবিত") return "মাতা";
    return formData.guardianRelation || "অভিভাবক";
  };

  const getDynamicSignatureName = () => {
    if (formData.fatherStatus === "জীবিত") return formData.fatherNameBangla || "পিতার নাম";
    if (formData.motherStatus === "জীবিত") return formData.motherNameBangla || "মাতার নাম";
    return formData.guardianNameAbsentParents || "অভিভাবকের নাম";
  };

  // ড্রপডাউন অপশন সিলেক্ট হ্যান্ডলার (AIM তথ্য জানার জন্য)
  const handleDropdownSelect = (source) => {
    let currentSources = formData.infoSource ? formData.infoSource.split(", ") : [];

    if (currentSources.includes(source)) {
      currentSources = currentSources.filter(src => src !== source);
    } else {
      currentSources.push(source);
    }

    handleChange({
      target: { name: "infoSource", value: currentSources.join(", ") }
    });
  };

  const infoSourcesList = [
    "ফেসবুক / সোশ্যাল মিডিয়া",
    "মাদরাসার ওয়েবসাইট",
    "ব্যানার / লিফলেট",
    "পরিচিত অভিভাবক",
    "AIM এর শিক্ষকের মাধ্যমে",
    "মসজিদের খুতবা / এলান",
    "ইউটিউব ভিডিও",
    "অন্যান্য माध्यम"
  ];

  return (
    <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen overflow-x-hidden">

      {/* টপ সেকশন: শিক্ষার্থী বিষয়ক তথ্য ও অভিভাবকের ছবি */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start w-full gap-4 mb-6">
        <div className="flex-1 w-full sm:mr-4">
          <div className="border border-gray-400 rounded-md p-1 px-4 inline-block bg-gray-50 mb-4 font-bold text-gray-700 text-sm">
            শিক্ষার্থী বিষয়ক তথ্য <br /> পিতা/মাতা/অভিভাবকের পূরণীয় অংশ
          </div>

          {/* প্রশ্ন ও উত্তর সেকশন */}
          <div className="space-y-4 text-sm w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-700">১. আপনার সন্তানের শারীরিক কোনো সমস্যা আছে কি? (যেমন: অ্যাজমা, অ্যালার্জি, অটিজম, প্রতিবন্ধী, চোখে কম দেখা ইত্যাদি)</span>
              <div className="flex gap-4 mt-1 sm:mt-0">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="physicalProblem" value="হ্যাঁ" checked={formData.physicalProblem === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="physicalProblem" value="না" checked={formData.physicalProblem === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            {/* হ্যাঁ হলে এই ইনপুট ফিল্ডটি বের হবে */}
            {formData.physicalProblem === "হ্যাঁ" && (
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 animate-fade-in w-full">
                <span className="text-xs text-gray-600 whitespace-nowrap">● রোগের নাম লিখুন:</span>
                <input type="text" name="physicalProblemDetails" value={formData.physicalProblemDetails || ""} onChange={handleChange} className="w-full sm:flex-1 border-b border-gray-400 focus:outline-none px-1" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-700">২. পরিষ্কার-পরিচ্ছন্ন থাকতে পছন্দ করে কি?</span>
              <div className="flex gap-4 mt-1 sm:mt-0">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cleanlinessLover" value="হ্যাঁ" checked={formData.cleanlinessLover === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cleanlinessLover" value="না" checked={formData.cleanlinessLover === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-700">৩. খাবার গ্রহণে সে কি অনাগ্রহী?</span>
              <div className="flex gap-4 mt-1 sm:mt-0">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="foodReluctance" value="হ্যাঁ" checked={formData.foodReluctance === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="foodReluctance" value="না" checked={formData.foodReluctance === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-700">৪. কী ধরণের খাবার খেতে বেশি পছন্দ করে?</span>
              <div className="flex flex-wrap gap-4 mt-1 sm:mt-0">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="favFoodType" value="বাসায় তৈরি খাবার" checked={formData.favFoodType === "বাসায় তৈরি খাবার"} onChange={handleChange} className="accent-orange-600" /> বাসায় তৈরি খাবার</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="favFoodType" value="ফাস্টফুড" checked={formData.favFoodType === "ফাস্টফুড"} onChange={handleChange} className="accent-orange-600" /> ফাস্টফুড</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="favFoodType" value="অন্যান্য" checked={formData.favFoodType === "অন্যান্য"} onChange={handleChange} className="accent-orange-600" /> অন্যান্য</label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-700">৫. সালাত পড়তে অভ্যস্ত কি?</span>
              <div className="flex gap-4 mt-1 sm:mt-0">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="prayerHabit" value="হ্যাঁ" checked={formData.prayerHabit === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="prayerHabit" value="না" checked={formData.prayerHabit === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            {/* ৬ ও ৭ নং প্রশ্ন */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <span className="text-gray-700 font-semibold">৬. সাধারণত রাতে কখন ঘুমায়?</span>
                <input type="time" name="sleepTime" value={formData.sleepTime || ""} onChange={handleChange} className="w-full border-b border-gray-400 text-left focus:outline-none pb-0.5 cursor-pointer bg-transparent" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-gray-700 font-semibold">৭. সকালে কখন ঘুম থেকে উঠে?</span>
                <input type="time" name="wakeUpTime" value={formData.wakeUpTime || ""} onChange={handleChange} className="w-full border-b border-gray-400 text-left focus:outline-none pb-0.5 cursor-pointer bg-transparent" />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="font-semibold text-gray-700">৮. তার প্রিয় জিনিস কী?</span>
              <input type="text" name="favThing" value={formData.favThing || ""} onChange={handleChange} className="w-full border-b border-gray-400 focus:outline-none pb-0.5" />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="font-semibold text-gray-700">৯. কোন বিষয় তাকে বেশি দুঃখিত করে?</span>
              <input type="text" name="anxietyReason" value={formData.anxietyReason || ""} onChange={handleChange} className="w-full border-b border-gray-400 focus:outline-none pb-0.5" />
            </div>
          </div>
        </div>

        {/* অভিভাবকের ছবি বক্স */}
        <div className="w-32 h-40 border-2 border-dashed border-gray-400 bg-gray-50 flex flex-col items-center justify-center p-2 text-center rounded relative group cursor-pointer overflow-hidden mx-auto sm:mx-0 sm:mt-2">
          {formData.guardianImage ? (
            <img src={formData.guardianImage} alt="Guardian" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-500">{uploading ? "আপলোড হচ্ছে..." : "অভিভাবকের ছবি"}</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* সেকশন ২: অভিভাবকের তথ্য */}
      <div className="w-full mb-4">
        <div className="bg-[#231f20] text-white font-bold px-4 py-1.5 text-sm inline-block rounded-r-md mb-4 transform -skew-x-12">
          <span className="inline-block skew-x-12">অভিভাবকের তথ্য:</span>
        </div>

        <div className="space-y-4 text-sm">
          {/* পিতার তথ্য */}
          <div className="border border-gray-200 p-3 rounded-md space-y-3 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">পিতার নাম (বাংলায়):</span>
                <input type="text" name="fatherNameBangla" value={formData.fatherNameBangla || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">ইংরেজিতে (বড় হাতের অক্ষর):</span>
                <input type="text" name="fatherNameEnglish" value={formData.fatherNameEnglish || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent uppercase" />
              </div>
            </div>

            {/* জীবিত নাকি মৃত প্রশ্ন */}
            <div className="flex gap-4 pb-1">
              <span className="font-bold text-gray-700">পিতা জীবিত নাকি মৃত?:</span>
              <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="fatherStatus" value="জীবিত" checked={formData.fatherStatus === "জীবিত"} onChange={handleChange} /> জীবিত</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="fatherStatus" value="مৃত" checked={formData.fatherStatus === "مৃত" || formData.fatherStatus === "মৃত"} onChange={handleChange} /> মৃত</label>
            </div>

            {/* জীবিত থাকলে এই ফিল্ডগুলো শো হবে */}
            {formData.fatherStatus === "জীবিত" && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">এন আইডি নং:</span>
                    <input type="text" name="fatherNid" value={formData.fatherNid || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">মোবাইল (হোয়াটসঅ্যাপ):</span>
                    <input type="text" name="fatherMobile" value={formData.fatherMobile || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">পেশা:</span>
                    <input type="text" name="fatherProfession" value={formData.fatherProfession || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">ইমেইল:</span>
                    <input type="email" name="fatherEmail" value={formData.fatherEmail || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* মাতার তথ্য */}
          <div className="border border-gray-200 p-3 rounded-md space-y-3 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">মাতার নাম (বাংলায়):</span>
                <input type="text" name="motherNameBangla" value={formData.motherNameBangla || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">ইংরেজিতে (বড় হাতের অক্ষর):</span>
                <input type="text" name="motherNameEnglish" value={formData.motherNameEnglish || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent uppercase" />
              </div>
            </div>

            {/* জীবিত নাকি মৃত প্রশ্ন */}
            <div className="flex gap-4 pb-1">
              <span className="font-bold text-gray-700">মাতা জীবিত নাকি মৃত?:</span>
              <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="motherStatus" value="জীবিত" checked={formData.motherStatus === "জীবিত"} onChange={handleChange} /> জীবিত</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="motherStatus" value="মৃত" checked={formData.motherStatus === "মৃত" || formData.motherStatus === "মৃত"} onChange={handleChange} /> মৃত</label>
            </div>

            {/* জীবিত থাকলে এই ফিল্ডগুলো শো হবে */}
            {formData.motherStatus === "জীবিত" && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">এন আইডি নং:</span>
                    <input type="text" name="motherNid" value={formData.motherNid || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">মোবাইল (হোয়াটসঅ্যাপ):</span>
                    <input type="text" name="motherMobile" value={formData.motherMobile || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">পেশা:</span>
                    <input type="text" name="motherProfession" value={formData.motherProfession || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-700">ইমেইল:</span>
                    <input type="email" name="motherEmail" value={formData.motherEmail || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* পিতা/মাতার অবর্তমানে অন্য অভিভাবক */}
          <div className="border border-dashed border-gray-300 p-3 rounded-md space-y-3 bg-gray-50/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700 text-xs md:text-sm">অভিভাবকের নাম (পিতা/মাতার অবর্তমানে):</span>
                <input type="text" name="guardianNameAbsentParents" value={formData.guardianNameAbsentParents || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">সম্পর্ক:</span>
                <input type="text" name="guardianRelation" value={formData.guardianRelation || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">এন আইডি নং:</span>
                <input type="text" name="guardianNid" value={formData.guardianNid || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">পেশা:</span>
                <input type="text" name="guardianProfession" value={formData.guardianProfession || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">ইমেইল:</span>
                <input type="email" name="guardianEmail" value={formData.guardianEmail || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-700">মোবাইল (হোয়াটসঅ্যাপ):</span>
                <input type="text" name="guardianMobile" value={formData.guardianMobile || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="font-bold text-gray-700">পিতা/অভিভাবকের বার্ষিক আয়:</span>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-gray-500 text-xs">অংকে:</span>
                    <input type="text" name="guardianAnnualIncome" value={formData.guardianAnnualIncome || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent pb-0.5" />
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-gray-500 text-xs">কথায়:</span>
                    <input type="text" name="guardianAnnualIncomeWords" value={formData.guardianAnnualIncomeWords || ""} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none bg-transparent pb-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* প্রাথমিক যোগাযোগ মাধ্যম ফিল্ড */}
          <div className="border border-gray-300 p-3 rounded-md bg-amber-50/20 flex flex-col gap-2">
            <span className="font-bold text-gray-700">প্রাথমিক যোগাযোগ মাধ্যম:</span>
            <div className="flex flex-wrap gap-4">
              <label className={`flex items-center gap-1 cursor-pointer ${formData.fatherStatus === "মৃত" || formData.fatherStatus === "মৃত" ? "opacity-50 cursor-not-allowed text-gray-400" : ""}`}>
                <input
                  type="radio"
                  name="primaryContactMethod"
                  value="পিতা"
                  checked={formData.primaryContactMethod === "পিতা"}
                  onChange={handleChange}
                  disabled={formData.fatherStatus === "মৃত" || formData.fatherStatus === "মৃত"}
                /> পিতা
              </label>
              <label className={`flex items-center gap-1 cursor-pointer ${formData.motherStatus === "মৃত" || formData.motherStatus === "মৃত" ? "opacity-50 cursor-not-allowed text-gray-400" : ""}`}>
                <input
                  type="radio"
                  name="primaryContactMethod"
                  value="মাতা"
                  checked={formData.primaryContactMethod === "মাতা"}
                  onChange={handleChange}
                  disabled={formData.motherStatus === "মৃত" || formData.motherStatus === "মৃত"}
                /> মাতা
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="primaryContactMethod"
                  value="পিতামাতার অবর্তমানে অভিভাবক"
                  checked={formData.primaryContactMethod === "পিতামাতার অবর্তমানে অভিভাবক"}
                  onChange={handleChange}
                /> পিতামাতার অবর্তমানে অভিভাবক
              </label>
            </div>
          </div>

          {/* ভর্তির সিদ্ধান্তের প্রশ্ন */}
          <div className="flex flex-col gap-2 pt-2 bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md shadow-sm">
            <span className="font-bold text-slate-950 block text-xs md:text-sm leading-relaxed">কেন আপনার সন্তানকে অত্র প্রতিষ্ঠানে ভর্তি করার সিদ্ধান্ত নিয়েছেন?</span>
            <input type="text" name="admissionReason" value={formData.admissionReason || ""} onChange={handleChange} className="w-full border-b border-dotted border-slate-700 focus:outline-none bg-transparent font-medium py-1" />
          </div>

          {/* AIM তথ্য জানার মাধ্যম */}
          <div className="border border-gray-200 p-3 rounded-md bg-gray-50/30 space-y-3 relative" ref={dropdownRef}>
            <div>
              <span className="font-bold text-gray-700 block mb-2">AIM তথ্য আপনি কিভাবে জানতে পেরেছেন?</span>
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white cursor-pointer min-h-[40px] flex items-center justify-between text-xs md:text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <span>
                    {formData.infoSource ? formData.infoSource : "একাধিক অপশন বাছাই করতে পারেন"}
                  </span>
                  <span className="text-gray-400 text-xs">▼</span>
                </div>

                {isOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto z-50 animate-fade-in">
                    {infoSourcesList.map((source) => {
                      const isSelected = formData.infoSource ? formData.infoSource.split(", ").includes(source) : false;
                      return (
                        <div
                          key={source}
                          onClick={() => handleDropdownSelect(source)}
                          className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer text-xs md:text-sm hover:bg-orange-50 transition-colors ${isSelected ? "bg-orange-50 font-bold text-orange-600" : "text-gray-700"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-orange-600 rounded"
                          />
                          <span>{source}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* শিক্ষক আইডি ফিল্ড */}
            {formData.infoSource && formData.infoSource.split(", ").includes("AIM এর শিক্ষকের মাধ্যমে") && (
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 p-3 bg-orange-50/50 border-l-4 border-orange-500 rounded-r-md animate-fade-in w-full">
                <span className="font-bold text-gray-700 text-xs md:text-sm whitespace-nowrap">● শিক্ষকের আইডি নাম্বার লিখুন (পুরস্কারের জন্য):</span>
                <input
                  type="text"
                  name="teacherId"
                  value={formData.teacherId || ""}
                  onChange={handleChange}
                  placeholder="এখানে শিক্ষকের আইডি লিখুন..."
                  className="w-full sm:flex-1 border-b border-dotted border-orange-600 focus:outline-none bg-transparent px-1 font-semibold text-orange-800 placeholder-orange-300"
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* বিশেষ জ্ঞাতব্য বিষয় */}
      <div className="w-full bg-[#1a1a1a] text-white p-3 rounded-sm text-xs md:text-sm space-y-1 my-4 shadow-sm">
        <span className="font-bold text-orange-400 underline block mb-1">বিশেষ জ্ঞাতব্য বিষয়:</span>
        <p className="pl-2">● ভর্তি পরীক্ষায় উত্তীর্ণ হয়ে যথাসময়ে ভর্তি না হলে ভর্তির অযোগ্য হিসেবে বিবেচিত হবে।</p>
        <p className="pl-2">● কোনো শিক্ষার্থী কোনো কারণে ভর্তি বাতিল করলে তার প্রদেয় ফি ফেরত পাবে না।</p>
        <p className="pl-2">● কোনো শিক্ষার্থী অনুমোদিত অভিভাবক ছাড়া মাদরাসা ক্যাম্পাস ত্যাগ করতে পারবে না।</p>
      </div>

      {/* সেকশন ৩: অভিভাবকের অঙ্গীকারনামা */}
      <div className="w-full mt-2">
        <div className="text-center mb-4">
          <span className="border border-gray-500 rounded-full px-6 py-1 bg-gray-50 font-bold text-gray-800 text-sm shadow-sm inline-block">
            অভিভাবকের অঙ্গীকারনামা
          </span>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 text-justify space-y-3">
          <p className="flex flex-wrap items-end gap-x-2 gap-y-1">
            আমি উপরে উল্লেখিত শিক্ষার্থীর
            <span className="font-bold text-emerald-800 px-2 border-b border-gray-400 min-w-[60px] text-center">{getDynamicRelation()}</span>
            এবং বৈধ অভিভাবক হিসেবে অঙ্গীকার করছি যে, এই প্রতিষ্ঠানের যাবতীয় বিষয় সম্পর্কে সম্যক অবগত হয়ে আমার অভিভাবকত্বে
            <input type="text" name="studentNameBangla" value={formData.studentNameBangla || ""} onChange={handleChange} placeholder="(শিক্ষার্থীর নাম)" className="w-full sm:w-48 text-center font-bold border-b border-gray-400 focus:outline-none bg-transparent px-1 text-xs md:text-sm mt-1 sm:mt-0" />
            কে ভর্তি করার ইচ্ছা পোষণ করলাম।
          </p>
          <p>
            সে অত্র প্রতিষ্ঠানে যাতায়াতকালে কোনো দুর্ঘটনার সম্মুখীন হলে কিংবা ক্যাম্পাসে অবস্থানকালে কাউকে অবহিত না করে কোথাও চলে গেলে অথবা অন্য যেকোনো দুর্ঘটনা ঘটলে আমি বৈধ অভিভাবক হিসেবে তার সকল দায়-দায়িত্ব বহন করব, ইন-শা-আল্লাহ। আমি উপরিউক্ত শর্তসমূহ স্বজ্ঞানে অবগত হয়ে নিম্নে স্বাক্ষর প্রদান করলাম।
          </p>
        </div>

        {/* ফুটার স্বাক্ষর ও তারিখ */}
        <div className="flex justify-between items-end mt-14 pt-4 gap-4">
          <div className="flex items-end gap-2 text-sm">
            <span className="font-bold text-gray-700">তারিখ:</span>
            <input type="date" name="applicantSignatureDate" value={formData.applicantSignatureDate || ""} onChange={handleChange} className="border border-gray-400 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-transparent cursor-pointer" />
          </div>
          <div className="text-center w-40 sm:w-60 border-t border-gray-500 pt-1 text-xs sm:text-sm font-bold text-gray-700 flex flex-col items-center">
            <span className="text-xs text-emerald-800 font-medium truncate max-w-[140px] sm:max-w-[180px] mb-0.5">({getDynamicSignatureName()})</span>
            <span>অভিভাবকের স্বাক্ষর</span>
          </div>
        </div>
      </div>

    </div>
  );
}