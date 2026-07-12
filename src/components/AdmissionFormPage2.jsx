// components/AdmissionFormPage2.jsx
"use client";

import React, { useState } from "react";

export default function AdmissionFormPage2({ formData, handleChange }) {
  const [uploading, setUploading] = useState(false);

  // ইমেজবিবি (ImgBB) API-তে ছবি আপলোড করার ফাংশন
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      // আপনার ImgBB API Key এখানে বসাবেন
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
        alert("ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen overflow-x-hidden">
      
      {/* টপ সেকশন: শিক্ষার্থী বিষয়ক তথ্য ও অভিভাবকের ছবি */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start w-full gap-4 mb-6">
        <div className="flex-1 w-full sm:mr-4">
          <div className="border border-gray-400 rounded-md p-1 px-4 inline-block bg-gray-50 mb-4 font-bold text-gray-700 text-sm">
            শিক্ষার্থী বিষয়ক তথ্য <br /> পিতা/মাতা/অভিভাবকের পূরণীয় অংশ
          </div>

          {/* প্রশ্ন ও উত্তর সেকশন */}
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">১. আপনার সন্তানের শারীরিক কোনো সমস্যা আছে কি?</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="physicalProblem" value="হ্যাঁ" checked={formData.physicalProblem === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="physicalProblem" value="না" checked={formData.physicalProblem === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">● অ্যাজমা/অ্যালার্জি/অটিজম/প্রতিবন্ধী/চোখে কম দেখা ইত্যাদি কোনটি আছে কি?</span>
              <input type="text" name="physicalProblemDetails" value={formData.physicalProblemDetails} onChange={handleChange} className="flex-1 border-b border-gray-400 focus:outline-none px-1" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">২. পরিষ্কার-পরিচ্ছন্ন থাকতে পছন্দ করে কি?</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cleanlinessLover" value="হ্যাঁ" checked={formData.cleanlinessLover === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cleanlinessLover" value="না" checked={formData.cleanlinessLover === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">৩. খাবার গ্রহণে সে কি অনাগ্রহী?</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="foodReluctance" value="হ্যাঁ" checked={formData.foodReluctance === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="foodReluctance" value="না" checked={formData.foodReluctance === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">৪. কি ধরণের খাবার খেতে বেশি পছন্দ করে?</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="favFoodType" value="বাসায় তৈরি খাবার" checked={formData.favFoodType === "বাসায় তৈরি খাবার"} onChange={handleChange} className="accent-orange-600" /> বাসায় তৈরি খাবার</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="favFoodType" value="ফাস্টফুড" checked={formData.favFoodType === "ফাস্টফুড"} onChange={handleChange} className="accent-orange-600" /> ফাস্টফুড</label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">৫. সালাত পড়তে অভ্যস্ত কি?</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="prayerAddicted" value="হ্যাঁ" checked={formData.prayerAddicted === "হ্যাঁ"} onChange={handleChange} className="accent-orange-600" /> হ্যাঁ</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="prayerAddicted" value="না" checked={formData.prayerAddicted === "না"} onChange={handleChange} className="accent-orange-600" /> না</label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="text-gray-700 font-semibold whitespace-nowrap">৬. সাধারণত রাতে কখন ঘুমায়?</span>
                <input type="text" name="sleepTime" value={formData.sleepTime} onChange={handleChange} className="flex-1 border-b border-gray-400 text-center focus:outline-none pb-0.5" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="text-gray-700 font-semibold whitespace-nowrap">৭. সকালে কখন ঘুম থেকে উঠে?</span>
                <input type="text" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleChange} className="flex-1 border-b border-gray-400 text-center focus:outline-none pb-0.5" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-semibold text-gray-700 whitespace-nowrap">৮. তার প্রিয় জিনিস কী?</span>
              <input type="text" name="favThing" value={formData.favThing} onChange={handleChange} className="flex-1 border-b border-gray-400 focus:outline-none pb-0.5" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-semibold text-gray-700 whitespace-nowrap">৯. কোন বিষয়ে তাকে বেশি দুশ্চিন্তিত করে?</span>
              <input type="text" name="anxietyReason" value={formData.anxietyReason} onChange={handleChange} className="flex-1 border-b border-gray-400 focus:outline-none pb-0.5" />
            </div>
          </div>
        </div>

        {/* অভিভাবকের ছবি বক্স (ImgBB ইন্টিগ্রেশন) */}
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
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">পিতার নাম (বাংলায়):</span>
                <input type="text" name="fatherNameBangla" value={formData.fatherNameBangla} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">ইংরেজিতে (বড় হাতের অক্ষর):</span>
                <input type="text" name="fatherNameEnglish" value={formData.fatherNameEnglish} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">এন আইডি নং:</span>
                <input type="text" name="fatherNid" value={formData.fatherNid} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">মোবাইল (হোয়াটসঅ্যাপ):</span>
                <input type="text" name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div className="flex gap-4 pb-1">
                <span className="font-bold text-gray-700">জীবিত/মৃত:</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="fatherStatus" value="জীবিত" checked={formData.fatherStatus === "জীবিত"} onChange={handleChange} /> জীবিত</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="fatherStatus" value="মৃত" checked={formData.fatherStatus === "মৃত"} onChange={handleChange} /> মৃত</label>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">পেশা:</span>
                <input type="text" name="fatherProfession" value={formData.fatherProfession} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">ইমেইল:</span>
                <input type="email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>
          </div>

          {/* মাতার তথ্য */}
          <div className="border border-gray-200 p-3 rounded-md space-y-3 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">মাতার নাম (বাংলায়):</span>
                <input type="text" name="motherNameBangla" value={formData.motherNameBangla} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">ইংরেজিতে (বড় হাতের অক্ষর):</span>
                <input type="text" name="motherNameEnglish" value={formData.motherNameEnglish} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">এন আইডি নং:</span>
                <input type="text" name="motherNid" value={formData.motherNid} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">মোবাইল (হোয়াটসঅ্যাপ):</span>
                <input type="text" name="motherMobile" value={formData.motherMobile} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div className="flex gap-4 pb-1">
                <span className="font-bold text-gray-700">জীবিত/মৃত:</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="motherStatus" value="জীবিত" checked={formData.motherStatus === "জীবিত"} onChange={handleChange} /> জীবিত</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="motherStatus" value="মৃত" checked={formData.motherStatus === "মৃত"} onChange={handleChange} /> মৃত</label>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">পেশা:</span>
                <input type="text" name="motherProfession" value={formData.motherProfession} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">ইমেইল:</span>
                <input type="email" name="motherEmail" value={formData.motherEmail} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>
          </div>

          {/* পিতা/মাতার অবর্তমানে অন্য অভিভাবক */}
          <div className="border border-dashed border-gray-300 p-3 rounded-md space-y-3 bg-gray-50/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 text-xs md:text-sm whitespace-nowrap">অভিভাবকের নাম (পিতা/মাতার অবর্তমানে):</span>
                <input type="text" name="guardianNameAbsentParents" value={formData.guardianNameAbsentParents} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">সম্পর্ক:</span>
                <input type="text" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">এন আইডি নং:</span>
                <input type="text" name="guardianNid" value={formData.guardianNid} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">পেশা:</span>
                <input type="text" name="guardianProfession" value={formData.guardianProfession} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">ইমেইল:</span>
                <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap">মোবাইল (হোয়াটসঅ্যাপ):</span>
                <input type="text" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono" />
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap">পিতা/অভিভাবকের বার্ষিক আয়:</span>
                <input type="text" name="guardianAnnualIncome" value={formData.guardianAnnualIncome} onChange={handleChange} className="w-24 border-b border-dotted border-gray-400 text-center focus:outline-none bg-transparent pb-0.5" />
                <span className="text-gray-500 whitespace-nowrap">কথায়:</span>
                <input type="text" name="guardianAnnualIncomeWords" value={formData.guardianAnnualIncomeWords || ""} onChange={handleChange} className="flex-1 min-w-[120px] border-b border-dotted border-gray-400 focus:outline-none bg-transparent pb-0.5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-2 pt-2">
            <span className="font-bold text-gray-700 whitespace-nowrap">কেন আপনার সন্তানকে অত্র প্রতিষ্ঠানে ভর্তি করার সিদ্ধান্ত নিয়েছেন?</span>
            <input type="text" name="admissionReason" value={formData.admissionReason} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* বিশেষ জ্ঞাতব্য বিষয়: ছবির মতো কালো ব্যাকগ্রাউন্ডের ব্যানার */}
      <div className="w-full bg-[#1a1a1a] text-white p-3 rounded-sm text-xs md:text-sm space-y-1 my-4 shadow-sm">
        <span className="font-bold text-orange-400 underline block mb-1">বিশেষ জ্ঞাতব্য বিষয়:</span>
        <p className="pl-2">● ভর্তি পরীক্ষায় উত্তীর্ণ হয়ে যথাসময়ে ভর্তি না হলে ভর্তির অযোগ্য হিসেবে বিবেচিত হবে।</p>
        <p className="pl-2">● কোন শিক্ষার্থী কোন কারণে ভর্তি বাতিল করলে তার প্রদেয় ফি ফেরত পাবে না।</p>
        <p className="pl-2">● কোন শিক্ষার্থী অনুমোদিত অভিভাবক ছাড়া মাদরাসা ক্যাম্পাস ত্যাগ করতে পারবে না।</p>
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
            <input type="text" name="guardianRelationToStudent" value={formData.guardianRelationToStudent || ""} onChange={handleChange} placeholder="(সম্পর্ক)" className="w-24 text-center font-bold border-b border-gray-400 focus:outline-none bg-transparent px-1 text-xs md:text-sm" /> 
            এবং বৈধ অভিভাবক হিসেবে অঙ্গীকার করছি যে, এই প্রতিষ্ঠানের যাবতীয় বিষয় সম্পর্কে সম্যক অবগত হয়ে আমার অভিভাবকত্বে 
            <input type="text" name="studentNameConfirmation" value={formData.studentNameConfirmation || ""} onChange={handleChange} placeholder="(শিক্ষার্থীর নাম)" className="w-48 text-center font-bold border-b border-gray-400 focus:outline-none bg-transparent px-1 text-xs md:text-sm" /> 
            কে আবাসিক/অনাবাসিক/ডে-কেয়ার শিক্ষার্থী হিসেবে ভর্তি করার ইচ্ছা পোষণ করলাম।
          </p>
          <p>
            সে অত্র প্রতিষ্ঠানে যাতায়াতকালে কোন দুর্ঘটনার সম্মুখীন হলে কিংবা ক্যাম্পাসে অবস্থানকালে কাউকে অবহিত না করে কোথাও চলে গেলে অথবা অন্য যেকোন দুর্ঘটনা ঘটলে আমি বৈধ অভিভাবক হিসেবে তার সকল দায়-দায়িত্ব বহন করব, ইন-শা-আল্লাহ। আমি উপরিউক্ত শর্তসমূহ স্বজ্ঞানে অবগত হয়ে নিম্নে স্বাক্ষর প্রদান করলাম।
          </p>
        </div>

        {/* ফুটার স্বাক্ষর ও তারিখ */}
        <div className="flex justify-between items-end mt-14 pt-4">
          <div className="flex items-end gap-2 text-sm">
            <span className="font-bold text-gray-700">তারিখ:</span>
            <input type="date" name="applicantSignatureDate" value={formData.applicantSignatureDate} onChange={handleChange} className="border border-gray-400 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-transparent cursor-pointer" />
          </div>
          <div className="text-center w-32 sm:w-48 border-t border-gray-500 pt-1 text-xs sm:text-sm font-bold text-gray-700">
            অভিভাবকের স্বাক্ষর
          </div>
        </div>
      </div>

    </div>
  );
}
