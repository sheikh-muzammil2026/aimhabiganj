// components/AdmissionFormPage1.jsx
"use client";

import React, { useState, useEffect } from "react";

// বাংলাদেশের জেলা এবং তাদের থানার লিস্ট ডেটা
const bdDistrictsAndThanas = {
  "হবিগঞ্জ": ["হবিগঞ্জ সদর", "নবীগঞ্জ", "বাহুবল", "চুনারুঘাট", "মাধবপুর", "লাখাই", "বানিয়াচং", "আজমিরীগঞ্জ", "শায়েস্তাগঞ্জ"],
  "সিলেট": ["সিলেট সদর", "দক্ষিণ সুরমা", "বিশ্বনাথ", "ওসমানীনগর", "বালাগঞ্জ", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "বিয়ানীবাজার", "জকিগঞ্জ", "কানাইঘাট", "জৈন্তাপুর", "গোয়াইনঘাট", "কোম্পানীগঞ্জ"],
  "সুনামগঞ্জ": ["সুনামগঞ্জ সদর", "দক্ষিণ সুনামগঞ্জ", "দোয়ারাবাজার", "ছাতক", "জগন্নাথপুর", "দিরাই", "শাল্লা", "জামালগঞ্জ", "তাহিরপুর", "বিশ্বম্ভরপুর", "ধর্মপাশা"],
  "মৌলভীবাজার": ["মৌলভীবাজার সদর", "রাজনগর", "কুলাউড়া", "জুড়ী", "কমলগঞ্জ", "শ্রীমঙ্গল", "বড়লেখা"],
  "ঢাকা": ["ধামরাই", "দোহার", "কেরানীগঞ্জ", "নবাবগঞ্জ", "সাভার", "মিরপুর", "মোহাম্মদপুর", "ধানমন্ডি", "গুলশান", "উত্তরা", "মতিঝিল", "পল্টন", "শাহবাগ", "রমনা", "তেজগাঁও"],
  "চট্টগ্রাম": ["চট্টগ্রাম সদর", "পটিয়া", "হাটহাজারী", "সীতাকুণ্ড", "মিরসরাই", "সন্দীপ", "রাউজান", "রাঙ্গুনিয়া", "বোয়ালখালী", "আনোয়ারা", "চন্দনাইশ", "লোহাগাড়া", "সাতকানিয়া", "বাঁশখালী"],
  "বাগেরহাট": ["বাগেরহাট সদর", "ফকিরহাট", "মোল্লাহাট", "চিতলমারী", "কচুয়া", "রামপাল", "মোংলা", "মোরেলগঞ্জ", "শরণখোলা"],
  "বান্দরবান": ["বান্দরবান সদর", "রুমা", "রোয়াংছড়ি", "থানচি", "লামা", "আলীকদম", "নাইক্ষ্যংছড়ি"],
  "বরগুনা": ["বরগুনা সদর", "আমতলী", "তালতলী", "বামনা", "বেতাগী", "পাথরঘাটা"],
  "বরিশাল": ["বরিশাল সদর", "বাকেরগঞ্জ", "বাবুগঞ্জ", "উজিরপুর", "বানারীপাড়া", "গৌরনদী", "আগৈলঝারা", "মুলাদী", "হিজলা", "মেহেন্দিগঞ্জ"],
  "ভোলা": ["ভোলা সদর", "বোরহানউদ্দিন", "দৌলতখান", "লালমোহন", "তজুমুদ্দিন", "মনপুরা", "চরফ্যাশন"],
  "বগুড়া": ["বগুড়া সদর", "শাজাহানপুর", "কাহালু", "নন্দীগ্রাম", "শেরপুর", "ধুনট", "গাবতলী", "সারিয়াকান্দি", "সোনাতলা", "শিবগঞ্জ", "আদমদিঘী", "দুপচাঁচিয়া"],
  "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "আশুগঞ্জ", "সরাইল", "নাসিরনগর", "নবীনগর", "বাঞ্ছারামপুর", "কসবা", "আখাউড়া", "বিজয়নগর"],
  "চাঁদপুর": ["চাঁদপুর সদর", "হাজীগঞ্জ", "শাহরাস্তি", "কচুয়া", "ফরিদগঞ্জ", "হাইমচর", "মতলব উত্তর", "মতলব দক্ষিণ"],
  "চুয়াডাঙ্গা": ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"],
  "কুমিল্লা": ["কুমিল্লা সদর", "কুমিল্লা সদর দক্ষিণ", "চৌদ্দগ্রাম", "লাকসাম", "বরুড়া", "চান্দিনা", "বুড়িচং", "ব্রাহ্মণপাড়া", "দেবিদ্বার", "মুরাদনগর", "দাউদকান্দি", "হোমনা", "মেঘনা", "তিতাস", "মনোহরগঞ্জ", "নাঙ্গলকোট"],
  "কক্সবাজার": ["কক্সবাজার সদর", "চাকোরিয়া", "মহেশখালী", "টেকনাফ", "উখিয়া", "পেকুয়া", "কুতুবদিয়া", "রামু"],
  "দিনাজপুর": ["দিনাজপুর সদর", "বিরল", "বোচাগঞ্জ", "কাহারোল", "বীরগঞ্জ", "খানসামা", "চিরিরবন্দর", "পার্বতীপুর", "ফুলবাড়ী", "নবাবগঞ্জ", "বিরামপুর", "হাকিমপুর", "ঘোড়াঘাট"],
  "ফরিদপুর": ["ফরিদপুর সদর", "মধুখালী", "বোয়ালমারী", "আলফাডাঙ্গা", "সালথা", "নগরকান্দা", "ভাঙ্গা", "সদরপুর", "চরভদ্রাসন"],
  "ফেনী": ["ফেনী সদর", "দাগনভূঁইয়া", "ছাগলনাইয়া", "পরশুরাম", "ফুলগাজী", "সোনাগাজী"],
  "গাইবান্ধা": ["গাইবান্ধা সদর", "সাদুল্লাপুর", "পলাশবাড়ী", "গোবিন্দগঞ্জ", "সুন্দরগঞ্জ", "সাঘাটা", "ফুলছড়ি"],
  "গাজীপুর": ["গাজীপুর সদর", "কালীগঞ্জ", "কালিয়াকৈর", "শ্রীপুর", "কপাসিয়া"],
  "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "টুঙ্গিপাড়া", "কোটালীপাড়া", "কাশিয়ানী", "মুকসুদপুর"],
  "জয়পুরহাট": ["জয়পুরহাট সদর", "পাঁচবিবি", "আক্কেলপুর", "ক্ষেতলাল", "কালাই"],
  "জামালপুর": ["জামালপুর সদর", "মেলান্দহ", "ইসলামপুর", "দেওয়ানগঞ্জ", "বকশীগঞ্জ", "মাদারগঞ্জ", "সরিষাবাড়ী"],
  "যশোর": ["যশোর সদর", "ঝিকরগাছা", "চৌগাছা", "শার্শা", "মণিরামপুর", "কেশবপুর", "বাঘেরপাড়া", "অভয়নগর"],
  "ঝালকাঠি": ["ঝালকাঠি সদর", "নলছিটি", "রাজাপুর", "কাঠালিয়া"],
  "ঝিনাইদহ": ["ঝিনাইদহ সদর", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "শৈলকুপা", "হরিণাকুণ্ডু"],
  "খাগড়াছড়ি": ["খাগড়াছড়ি সদর", "দীঘিনালা", "পানছড়ি", "মহালছড়ি", "মাটিরাঙ্গা", "মানিকছড়ি", "রামগড়", "লক্ষ্মীছড়ি"],
  "খুলনা": ["খুলনা সদর", "দিঘলিয়া", "রূপসা", "তেরখাদা", "ডুমুরিয়া", "বটিয়াঘাটা", "পাইকগাছা", "কয়রা", "ফুলতলা"],
  "কিশোরগঞ্জ": ["কিশোরগঞ্জ সদর", "হোসেনপুর", "কটিয়াদী", "পাকুন্দিয়া", "তাড়াইল", "করিমগঞ্জ", "ইটনা", "মিঠামইন", "অষ্টগ্রাম", "নিকলী", "বাজিতপুর", "কুলিয়ারচর", "ভৈরব"],
  "কুড়িগ্রাম": ["কুড়িগ্রাম সদর", "উলিপুর", "চিলমারী", "রউমারী", "রাজিবপুর", "রাজারহাট", "নাগেশ্বরী", "ভুরুঙ্গামারী", "ফুলবাড়ী"],
  "কুষ্টিয়া": ["কুষ্টিয়া সদর", "কুমারখালী", "খোকসা", "মিরপুর", "ভেড়ামারা", "দৌলতপুর"],
  "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "রায়পুর", "রামগঞ্জ", "রামগতি", "কমলনগর"],
  "লালমনিরহাট": ["লালমনিরহাট সদর", "কালীগঞ্জ", "আদিতমারী", "হাতিবান্ধা", "পাটগ্রাম"],
  "মাদারীপুর": ["মাদারীপুর সদর", "শিবচর", "কালকিনি", "রাজৈর"],
  "মাগুরা": ["মাগুরা সদর", "শ্রীপুর", "মোহাম্মদপুর", "শালিখা"],
  "মানিকগঞ্জ": ["মানিকগঞ্জ সদর", "সিংগাইর", "সাটুরিয়া", "ঘিওর", "দৌলতপুর", "হরিরামপুর", "শিবালয়"],
  "মেহেরপুর": ["মেহেরপুর সদর", "মুজিবনগর", "গাংনী"],
  "মুন্সিগঞ্জ": ["মুন্সিগঞ্জ সদর", "টংগিবাড়ী", "শ্রীনগর", "লৌহজং", "গজারিয়া", "সিরাজদিখান"],
  "ময়মনসিংহ": ["ময়মনসিংহ সদর", "মুক্তাগাছা", "ফুলবাড়িয়া", "ত্রিশাল", "ভালুকা", "গফরগাঁও", "নন্দাইল", "ঈশ্বরগঞ্জ", "গৌরীপুর", "তারাকান্দা", "ফুলপুর", "ধোবাউড়া", "হালুয়াঘাট"],
  "নওগাঁ": ["নওগাঁ সদর", "রানীনগর", "আত্রাই", "বদলগাছী", "মহাদেবপুর", "ধামইরহাট", "পত্নীতলা", "পোরশা", "সাপাহার", "নিয়ামতপুর", "মান্দা"],
  "নড়াইল": ["নড়াইল সদর", "লোহাগড়া", "কালিয়া"],
  "নারায়ণগঞ্জ": ["নারায়ণগঞ্জ সদর", "বন্দর", "সোনারগাঁও", "আড়াইহাজার", "রূপগঞ্জ"],
  "নরসিংদী": ["নরসিংদী সদর", "পলাশ", "শিবপুর", "মনোহরদী", "বেলাবো", "রায়পুরা"],
  "নাটোর": ["নাটোর সদর", "বাগাতিপাড়া", "বড়াইগ্রাম", "লালপুর", "গুরুদাসপুর", "সিংড়া", "নলডাঙ্গা"],
  "নেত্রকোনা": ["নেত্রকোনা সদর", "বারহাট্টা", "কলমাকান্দা", "দুর্গাপুর", "পূর্বধলা", "কেন্দুয়া", "মদন", "খালিয়াজুরী", "মোহনগঞ্জ", "আটপাড়া"],
  "নীলফামারী": ["নীলফামারী সদর", "সৈয়দপুর", "জলঢাকা", "কিশোরগঞ্জ", "ডোম্যার", "ডিমলা"],
  "নোয়াখালী": ["নোয়াখালী সদর", "কোম্পানীগঞ্জ", "বেগমগঞ্জ", "চাটখিল", "সেনবাগ", "হাতিয়া", "সোনাইমুড়ি", "সুবর্ণচর", "কবিরহাট"],
  "পাবনা": ["পাবনা সদর", "ঈশ্বরদী", "আটঘরিয়া", "চাটমোহর", "ভাঙ্গুড়া", "ফরিদপুর", "বেড়া", "সুজানগর", "সাঁথিয়া"],
  "পঞ্চগড়": ["পঞ্চগড় সদর", "বোদা", "দেবীগঞ্জ", "আটোয়ারী", "তেঁতুলিয়া"],
  "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "গলাচিপা", "দশমিনা", "কলাপাড়া", "মির্জাগঞ্জ", "দুমকি", "রাঙ্গাবালী"],
  "রাজবাড়ী": ["রাজবাড়ী সদর", "গোয়ালন্দ", "পাংশা", "বালিয়াকান্দি", "কালুখালী"],
  "রাজশাহী": ["বোয়ালিয়া", "মতিহার", "রাজপাড়া", "শাহ মখদুম", "পবা", "গোদাগাড়ী", "তানোর", "মোহনপুর", "বাগমারা", "দুর্গাপুর", "পুঠিয়া", "চারঘাট", "বাঘা"],
  "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "কাপ্তাই", "কাউখালী", "বাঘাইছড়ি", "লংগদু", "নানিয়ারচর", "রাজস্থলী", "জুরাছড়ি", "বিলাইছড়ি", "বরকল"],
  "রংপুর": ["রংপুর সদর", "মিঠাপুকুর", "পীরগঞ্জ", "পীরগাছা", "কাউনিয়া", "গঙ্গাচড়া", "বদরগঞ্জ", "তপোধন"],
  "সাতক্ষীরা": ["সাতক্ষীরা সদর", "কলারোয়া", "তালা", "দেবহাটা", "কালীগঞ্জ", "শ্যামনগর", "আশাশুনি"],
  "শরীয়তপুর": ["শরীয়তপুর সদর", "দামুড্যা", "নড়িয়া", "জাজিরা", "ভেদরগঞ্জ", "গোসাইরহাট"],
  "শেরপুর": ["শেরপুর সদর", "নালিতাবাড়ী", "ঝিনাইগাতী", "শ্রীবরদী", "নকলা"],
  "সিরাজগঞ্জ": ["সিরাজগঞ্জ সদর", "কাজিপুর", "রায়গঞ্জ", "তাড়াশ", "উল্লাপাড়া", "শাহজাদপুর", "বেলকুচি", "চৌহালী", "কামারখন্দ"],
  "টাঙ্গাইল": ["টাঙ্গাইল সদর", "কালিহাতী", "ঘাটাইল", "বাসাইল", "মির্জাপুর", "নাগরপুর", "মির্জাপুর", "দেলদুয়ার", "গোপালপুর", "ভূঞাপুর", "মধুপুর", "ধনবাড়ী"],
  "ঠাকুরগাঁও": ["ঠাকুরগাঁও সদর", "পীরগঞ্জ", "রানীশংকৈল", "হরিপুর", "বালিয়াডাঙ্গী"],
};

export default function AdmissionFormPage1({ formData, handleChange }) {
  const [uploading, setUploading] = useState(false);
  const [currentThanas, setCurrentThanas] = useState([]);
  const [permanentThanas, setPermanentThanas] = useState([]);

  // ইমেজবিবি (ImgBB) API-তে ছবি আপলোড করার ফাংশন
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      // আপনার ImgBB API Key এখানে বসাবেন (ফ্রি কি)
      const apiKey = "5a4f8c279ddcedf0d73f50444bad88b0"; 
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      
      if (result.success) {
        // মঙ্গো ডিবিতে সেভ করার জন্য মূল অবজেক্টে ইউআরএল পাঠানো হচ্ছে
        handleChange({
          target: { name: "studentImage", value: result.data.url },
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

  // বর্তমান ও স্থায়ী ঠিকানার জেলা পরিবর্তনের সাথে সাথে থানা লোড করার জন্য ইফেক্ট
  useEffect(() => {
    if (formData.currentAddress?.district) {
      setCurrentThanas(bdDistrictsAndThanas[formData.currentAddress.district] || []);
    } else {
      setCurrentThanas([]);
    }
  }, [formData.currentAddress?.district]);

  useEffect(() => {
    if (formData.permanentAddress?.district) {
      setPermanentThanas(bdDistrictsAndThanas[formData.permanentAddress.district] || []);
    } else {
      setPermanentThanas([]);
    }
  }, [formData.permanentAddress?.district]);

  return (
    <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen overflow-x-hidden">
      
      {/* হেডার সেকশন: ক্রমিক নং এবং ছবি সংযুক্তি */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start w-full gap-4 mb-6">
        <div className="space-y-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">ক্রমিক নং :</span>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              className="w-28 border border-gray-400 px-2 py-1 rounded text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          
          {/* ক্যাটাগরি চেকবক্স: নতুন, আবাসিক, অনাবাসিক, ডে-কেয়ার */}
          <div className="flex flex-wrap gap-4 pt-2">
            {["নতুন", "আবাসিক", "অনাবাসিক", "ডে-কেয়ার"].map((type) => (
              <label key={type} className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={type}
                  checked={formData.status === type}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* শিক্ষার্থীর ছবি আপলোডের বক্স (ImgBB ইন্টিগ্রেশন) */}
        <div className="w-32 h-40 border-2 border-dashed border-gray-400 bg-gray-50 flex flex-col items-center justify-center p-2 text-center rounded relative group cursor-pointer overflow-hidden">
          {formData.studentImage ? (
            <img src={formData.studentImage} alt="Student" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-500">{uploading ? "আপলোড হচ্ছে..." : "শিক্ষার্থীর ছবি"}</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* সেকশন ১: শিক্ষার্থীর তথ্য বিবরণী */}
      <div className="w-full mb-6">
        <div className="bg-[#231f20] text-white font-bold px-4 py-1.5 text-sm inline-block rounded-r-md mb-6 transform -skew-x-12">
          <span className="inline-block skew-x-12">শিক্ষार्थियों তথ্য বিবরণী:</span>
        </div>

        <div className="space-y-5">
          {/* নামসমূহ */}
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">নাম (বাংলায়) :</span>
            <input
              type="text"
              name="studentNameBangla"
              value={formData.studentNameBangla}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent font-medium"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">ইংরেজিতে :</span>
            <input
              type="text"
              name="studentNameEnglish"
              value={formData.studentNameEnglish}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent font-medium uppercase"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">আরবিতে :</span>
            <input
              type="text"
              name="studentNameArabic"
              value={formData.studentNameArabic}
              onChange={handleChange}
              className="flex-1 border-b border-dotted border-gray-400 pb-1 text-right focus:outline-none focus:border-orange-500 bg-transparent font-medium"
              dir="rtl"
            />
          </div>

          {/* জন্ম তারিখ, বয়স, লিঙ্গ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">জন্ম তারিখ :</span>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500 text-gray-700 cursor-pointer w-full"
              />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">বয়স :</span>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-1 text-center focus:outline-none focus:border-orange-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">লিঙ্গ :</span>
              {["পুরুষ", "মহিলা"].map((g) => (
                <label key={g} className="flex items-center gap-1.5 font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* জন্মসনদ নং */}
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3">
            <span className="font-bold text-gray-700 whitespace-nowrap">জন্মসনদ পত্র নং :</span>
            <input
              type="text"
              name="birthCertificateNo"
              value={formData.birthCertificateNo}
              onChange={handleChange}
              placeholder="১৭ ডিজিটের নম্বর"
              className="flex-1 border-b border-dotted border-gray-400 pb-1 focus:outline-none focus:border-orange-500 bg-transparent tracking-widest font-mono"
            />
          </div>

          {/* রক্তের গ্রুপ, ওজন, উচ্চতা, জাতীয়তা */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="flex items-center gap-2 w-full">
              <span className="font-bold text-gray-700 whitespace-nowrap">রক্তের গ্রুপ :</span>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="flex-1 border border-gray-400 rounded px-1.5 py-1 text-sm focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="">বাছাই করুন</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2 w-full">
              <span className="font-bold text-gray-700 whitespace-nowrap">ওজন:</span>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="flex-1 min-w-[70px] border-b border-dotted border-gray-400 text-center focus:outline-none" />
            </div>
            <div className="flex items-end gap-2 w-full">
              <span className="font-bold text-gray-700 whitespace-nowrap">উচ্চতা:</span>
              <input type="text" name="height" value={formData.height} onChange={handleChange} className="flex-1 min-w-[70px] border-b border-dotted border-gray-400 text-center focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="font-bold text-gray-700 whitespace-nowrap">জাতীয়তা :</span>
              <select name="nationality" value={formData.nationality} onChange={handleChange} className="flex-1 border border-gray-400 rounded px-1 py-0.5 text-sm focus:outline-none bg-white">
                <option value="বাংলাদেশী">বাংলাদেশী</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>
          </div>

          {/* বর্তমান ঠিকানা */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-gray-700 block">বর্তমান ঠিকানা :</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end pl-0 md:pl-4">
              
              {/* জেলা ড্রপডাউন (সবার আগে) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">জেলা:</span>
                <select name="currentAddress.district" value={formData.currentAddress?.district || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white">
                  <option value="">বাছাই করুন</option>
                  {Object.keys(bdDistrictsAndThanas).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* থানা ড্রপডাউন (ডায়নামিক) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">থানা:</span>
                <select name="currentAddress.thana" value={formData.currentAddress?.thana || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white" disabled={!formData.currentAddress?.district}>
                  <option value="">বাছাই করুন</option>
                  {currentThanas.map((thana) => (
                    <option key={thana} value={thana}>{thana}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">গ্রাম/মহল্লা:</span>
                <input type="text" name="currentAddress.village" value={formData.currentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">ডাকঘর:</span>
                <input type="text" name="currentAddress.postOffice" value={formData.currentAddress?.postOffice || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">বাড়ি নং:</span>
                <input type="text" name="currentAddress.house" value={formData.currentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">রাস্তা নং:</span>
                <input type="text" name="currentAddress.road" value={formData.currentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* স্থায়ী ঠিকানা */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-gray-700 block">স্থায়ী ঠিকানা :</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end pl-0 md:pl-4">
              
              {/* জেলা ড্রপডাউন (সবার আগে) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">জেলা:</span>
                <select name="permanentAddress.district" value={formData.permanentAddress?.district || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white">
                  <option value="">বাছাই করুন</option>
                  {Object.keys(bdDistrictsAndThanas).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* থানা ড্রপডাউন (ডায়নামিক) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">থানা:</span>
                <select name="permanentAddress.thana" value={formData.permanentAddress?.thana || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-0.5 text-sm bg-white" disabled={!formData.permanentAddress?.district}>
                  <option value="">বাছাই করুন</option>
                  {permanentThanas.map((thana) => (
                    <option key={thana} value={thana}>{thana}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">গ্রাম/মহল্লা:</span>
                <input type="text" name="permanentAddress.village" value={formData.permanentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">বাড়ি নং:</span>
                <input type="text" name="permanentAddress.house" value={formData.permanentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">রাস্তা নং:</span>
                <input type="text" name="permanentAddress.road" value={formData.permanentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* এলাকার পরিচিত ব্যক্তি */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">এলাকার পরিচিত ব্যক্তির নাম :</span>
              <input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">মোবাইল :</span>
              <input type="text" name="referenceMobile" value={formData.referenceMobile} onChange={handleChange} placeholder="০১৭XXXXXXXX" className="flex-1 border-b border-dotted border-gray-400 focus:outline-none font-mono" />
            </div>
          </div>
        </div>
      </div>

      {/* সেকশন ২: ভর্তিচ্ছক বিভাগ (ছক) */}
      <div className="w-full mb-6">
        <div className="bg-[#231f20] text-white font-bold px-4 py-1.5 text-sm inline-block rounded-r-md mb-4 transform -skew-x-12">
          <span className="inline-block skew-x-12">ভর্তিচ্ছু বিভাগ:</span>
        </div>

        {/* ছবির টেবিল ফরম্যাট */}
        <div className="overflow-x-auto border border-gray-400 rounded">
          <table className="w-full text-left border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400 font-bold text-gray-700">
                <th className="p-2 border-r border-gray-400 text-center w-12">টিক</th>
                <th className="p-2 border-r border-gray-400">বিভাগ</th>
                <th className="p-2 border-r border-gray-400">ধরণ</th>
                <th className="p-2">শ্রেণি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {/* রো ১: প্রি-হিফজ */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionPreHifz.active" checked={formData.divisionPreHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">প্রি-হিফজ</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionPreHifz.type" value={formData.divisionPreHifz?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                    <option value="কায়দা/آمپارہ/ناظرہ/حفظ">কায়দা/আমপারা/নাজেরা/হুফ</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionPreHifz.class" value={formData.divisionPreHifz?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ২: হিফজ */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionHifz.active" checked={formData.divisionHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">হিফজ</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionHifz.type" value={formData.divisionHifz?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionHifz.class" value={formData.divisionHifz?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ৩: একাডেমিক */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionAcademic.active" checked={formData.divisionAcademic?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">একাডেমিক</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionAcademic.type" value={formData.divisionAcademic?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionAcademic.class" value={formData.divisionAcademic?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
              {/* রো ৪: আরবি ভাষা শিক্ষা কোর্স */}
              <tr>
                <td className="p-2 border-r border-gray-400 text-center">
                  <input type="checkbox" name="divisionArabicCourse.active" checked={formData.divisionArabicCourse?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600" />
                </td>
                <td className="p-2 border-r border-gray-400 font-bold text-gray-700">আরবি ভাষা শিক্ষা কোর্স</td>
                <td className="p-2 border-r border-gray-400">
                  <select name="divisionArabicCourse.type" value={formData.divisionArabicCourse?.type || ""} onChange={handleChange} className="border border-gray-300 rounded p-0.5 text-xs bg-white w-full">
                    <option value="">বাছাই করুন</option>
                    <option value="আবাসিক">আবাসিক</option>
                    <option value="অনাবাসিক">অনাবাসিক</option>
                    <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" name="divisionArabicCourse.class" value={formData.divisionArabicCourse?.class || ""} onChange={handleChange} className="w-full border-b border-gray-300 focus:outline-none px-1 text-xs" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* সেকশন ৩: পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম */}
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-bold text-gray-700 whitespace-nowrap">পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম :</span>
            <input type="text" name="prevInstituteName" value={formData.prevInstituteName} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">ঠিকানা :</span>
              <input type="text" name="prevInstituteAddress" value={formData.prevInstituteAddress} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">প্রিন্সিপালের মোবাইল :</span>
              <input type="text" name="prevPrincipalMobile" value={formData.prevPrincipalMobile} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none font-mono" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <span className="font-bold text-gray-700 whitespace-nowrap">পূর্ব প্রতিষ্ঠান ছাড়ার কারণ :</span>
            <input type="text" name="prevInstituteLeaveReason" value={formData.prevInstituteLeaveReason} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">অধ্যয়নকৃত শ্রেণি :</span>
              <input type="text" name="prevClass" value={formData.prevClass} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">ছাড়পত্র নং :</span>
              <input type="text" name="prevTransferCertificateNo" value={formData.prevTransferCertificateNo} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">তারিখ :</span>
              <input type="date" name="prevTcDate" value={formData.prevTcDate} onChange={handleChange} className="border border-gray-400 rounded px-1.5 py-0.5 text-sm focus:outline-none cursor-pointer text-gray-700 w-full" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
