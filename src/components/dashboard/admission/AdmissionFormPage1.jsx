"use client";

import React, { useState, useEffect } from "react";

// বাংলাদেশের জেলা এবং তাদের থানার লিস্ট ডেটা
const bdDistrictsAndThanas = {
  "হবিগঞ্জ": ["হবিগঞ্জ সদর", "নবীগঞ্জ", "বাহুবল", "চুনারুঘাট", "মাধবপুর", "লাখাই", "বানিয়াচং", "আজমিরীগঞ্জ", "শায়েস্তাগঞ্জ"],
  "সিলেট": ["সিলেট সদর", "দক্ষিণ সুরমা", "বিশ্বনাথ", "ওসমানীনগর", "বালাগঞ্জ", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "বিয়ানীবাজার", "জকিগঞ্জ", "কানাইঘাট", "জৈنتাপুর", "গোয়াইনঘাট", "কোম্পানীগঞ্জ"],
  "সুনামগঞ্জ": ["সুনামগঞ্জ সদর", "দক্ষিণ সুনামগঞ্জ", "দোয়ারাবাজার", "ছাতক", "জগন্নাথপুর", "দিরাই", "শাল্লা", "জামালগঞ্জ", "তাহিরপুর", "বিশ্বম্ভরপুর", "ধর্মপাশা"],
  "মৌলভীবাজার": ["মৌলভীবাজার সদর", "রাজনগর", "কুلاউড়া", "জুড়ী", "কমলগঞ্জ", "শ্রীমঙ্গল", "বড়লেখা"],
  "ঢাকা": ["ধামরাই", "দোহার", "কেরানীগঞ্জ", "নবাবগঞ্জ", "সাভার", "মিরপুর", "মোহাম্মদপুর", "ধানমন্ডি", "গুলশান", "উত্তরা", "মতিঝিল", "পল্টন", "শাহবাগ", "রমনা", "তেজগাঁও"],
  "চট্টগ্রাম": ["চট্টগ্রাম সদর", "পটিয়া", "হাটহাজারী", "সীতাকুণ্ড", "মিরসরাই", "সন্দীপ", "রাউজান", "রাঙ্গুনিয়া", "বোয়ালখালী", "আনোয়ারা", "চন্দনাইশ", "লোহাগাড়া", "সাতকানিয়া", "বাঁشখালী"],
  "বাগেরহাট": ["বাগেরহাট সদর", "ফকিরহাট", "মোল্লাহাট", "চিতলমারী", "কচুয়া", "রামপাল", "মোংলা", "মোরেলগঞ্জ", "শরণখোলা"],
  "বান্দরবান": ["বান্দরবান সদর", "রুমা", "রোয়াংছড়ি", "থানচি", "লামা", "আলীকদম", "নাইক্ষ্যংছড়ি"],
  "বরগুনা": ["বরগুনা সদর", "আমতলী", "তালতলী", "বামনা", "বেতাগী", "পাথরঘাটা"],
  "বরিশাল": ["বরিশাল সদর", "বাকেরগঞ্জ", "বাবুগঞ্জ", "উজিরপুর", "বানারীপাড়া", "গৌরনদী", "আগৈলঝারা", "মুলাদী", "হিজলা", "মেহেন্দিগঞ্জ"],
  "ভোলা": ["ভোলা সদর", "বোরহানউদ্দিন", "দৌলতখান", "লালমোহন", "তজুমুদ্দিন", "মনপুরা", "চরফ্যাশন"],
  "বগুড়া": ["বগুড়া সদর", "শাজাহানপুর", "کাহালু", "নন্দীগ্রাম", "শেরপুর", "ধুনট", "গাবতলী", "সারিয়াকান্দি", "সোনাতলা", "শিবগঞ্জ", "আদমদিঘী", "দুপচাঁচিয়া"],
  "ব্রাহ্মণবাড়িয়া": ["ব্রাহ্মণবাড়িয়া সদর", "আশুগঞ্জ", "সরাইল", "নাসিরনগর", "নবীনগর", "বাঞ্ছারামপুর", "কসবা", "আখাউড়া", "বিজয়নগর"],
  "চাঁদপুর": ["চাঁদপুর সদর", "হাজীগঞ্জ", "শাহরাস্তি", "কচুয়া", "ফریدগঞ্জ", "হাইমচর", "মতলব উত্তর", "মতলব দক্ষিণ"],
  "চুয়াডাঙ্গা": ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"],
  "কুমিল্লা": ["কুমিল্লা সদর", "কুমিল্লা সদর দক্ষিণ", "চৌদ্দগ্রাম", "লাকসাম", "বরুড়া", "চান্দিনা", "বুড়িচং", "ব্রাহ্মণপাড়া", "দেবিদ্বার", "মুরাদনগর", "দাউদকান্দি", "হোমনা", "মেঘনা", "তিতাস", "মনোহরগঞ্জ", "নাঙ্গলকোট"],
  "কক্সবাজার": ["কক্সবাজার সদর", "চাকোরিয়া", "মহেশখালী", "টেকনাফ", "উখিয়া", "পেকুয়া", "কুতুবদিয়া", "রামু"],
  "দিনাজপুর": ["দিনাজপুর সদর", "বিরল", "বোচাগঞ্জ", "কাহারোল", "বীরগঞ্জ", "খানসামা", "চিরিরবন্দর", "পার্বতীপুর", "ফুলবাড়ী", "নবাবগঞ্জ", "বিরামপুর", "হাকিমপুর", "ঘোড়াঘাট"],
  "ফریدপুর": ["ফریدপুর সদর", "মধুখালী", "বোয়ালমারী", "আলফাডাঙ্গা", "সালথা", "নগরকান্দা", "ভাঙ্গা", "সدرপুর", "চরভদ্রাসন"],
  "ফেনী": ["ফেনী সদর", "দাগনভূঁইয়া", "ছাগলনাইয়া", "পরশুরাম", "ফুলগাজী", "সোনাগাজী"],
  "গাইবান্ধা": ["গাইবান্ধা সদর", "সাদুল্লাপুর", "পلاশবাড়ী", "গোবিন্দগঞ্জ", "সুন্দরগঞ্জ", "সাঘাটা", "ফুলছড়ি"],
  "গাজীপুর": ["গাজীপুর সদর", "কালীগঞ্জ", "কালিয়াকৈর", "শ্রীপুর", "কপাসিয়া"],
  "গোপালগঞ্জ": ["গোপালগঞ্জ সদর", "টুঙ্গিপাড়া", "কোটালীপাড়া", "কাশিয়ানী", "مুকসুদপুর"],
  "জয়পুরহাট": ["জয়পুরহাট সদর", "পাঁচবিবি", "আক্কেলপুর", "ক্ষেতলাল", "কালাই"],
  "জামালপুর": ["জামালপুর সদর", "মেলান্দহ", "ইসলামপুর", "দেওয়ানগঞ্জ", "বকশীগঞ্জ", "মাদারগঞ্জ", "সরিষাবাড়ী"],
  "যশোর": ["যশোর সদর", "ঝিকরগাছা", "চৌগাছা", "শার্শা", "মণিরামপুর", "কেশবপুর", "বাঘেরপাড়া", "অভয়নগর"],
  "ঝালকাঠি": ["ঝালকাঠি সদর", "নলছিটি", "রাজাপুর", "কাঠালিয়া"],
  "ঝিনাইদহ": ["ঝিনাইদহ সদর", "কালীগঞ্জ", "কোটচাঁদপুর", "মহেশপুর", "শৈলকুপা", "হরিণাকুণ্ডু"],
  "খাগড়াছড়ি": ["খাগড়াছড়ি সদর", "দীঘিনালা", "পানছড়ি", "মহালছড়ি", "মাটিরাঙ্গা", "মানিকছড়ি", "রামগড়", "লক্ষ্মীছড়ি"],
  "খুলনা": ["খুলনা সদর", "دیঘলিয়া", "রূপসা", "তেরখাদা", "ডুমুরিয়া", "بটিয়াঘাটা", "পাইকগাছা", "কয়রা", "ফুলতলা"],
  "কিশোরগঞ্জ": ["কিশোরগঞ্জ সদর", "হোসেনপুর", "কটিয়াদী", "পাকুন্দিয়া", "তাড়াইল", "করিমগঞ্জ", "ইটনা", "মিঠামইন", "অষ্টগ্রাম", "নিকলী", "বাজিতপুর", "কুলিয়ারচর", "ভৈরব"],
  "কুড়িগ্রাম": ["কুড়িগ্রাম সদর", "উলিপুর", "চিলমারী", "রউমারী", "রাজিবপুর", "রাজারহাট", "নাগেশ্বরী", "ভুরুঙ্গামারী", "ফুলবাড়ী"],
  "কুষ্টিয়া": ["কুষ্টিয়া সদর", "কুমারখালী", "খোকসা", "মিরপুর", "ভেড়ামারা", "দৌলতপুর"],
  "লক্ষ্মীপুর": ["লক্ষ্মীপুর সদর", "রায়পুর", "রামগঞ্জ", "রামগতি", "কমলনগর"],
  "লালমনিরহাট": ["লালমনিরহাট সদর", "কালীগঞ্জ", "আদিতমারী", "হাতিবান্ধা", "পাটগ্রাম"],
  "মাদারীপুর": ["মাদারীপুর সদর", "শিবচর", "কালকিনি", "রাজৈর"],
  "মাগুরা": ["মাগুরা সদর", "শ্রীপুর", "মোহাম্মদপুর", "শালিখা"],
  "মানিকগঞ্জ": ["মানিকগঞ্জ সদর", "সিংগাইর", "সাটুরিয়া", "ঘিওর", "দৌলতপুর", "হরিরামপুর", "শিবালয়"],
  "মেহেরপুর": ["মেহেরপুর সদর", "মুজিবনগর", "গাংনী"],
  "মুন্সিগঞ্জ": ["মুন্সিগঞ্জ সদর", "টংগিবাড়ী", "শ্রীনগর", "লৌহজং", "গজারিয়া", "সিরাজদিখান"],
  "ময়মনসিংহ": ["ময়মনসিংহ সদর", "মুক্তাগাছা", "ফুলবাড়িয়া", "ত্রিশাল", "ভালুকা", "গফরগাঁও", "নন্দাইল", "ঈশ্বরগঞ্জ", "গৌরীপুর", "তারাকান্দা", "ফুলপুর", "ধোবাউড়া", "হালুয়াঘাট"],
  "নওগাঁ": ["নওগাঁ সদর", "রানীনগর", "আত্রাই", "بদলাগাজী", "মহাদেবপুর", "ধামইরহাট", "পত্নীতলা", "পোরশা", "সাপাহার", "নিয়ামতপুর", "মান্দা"],
  "নড়াইল": ["নড়াইল সদর", "লোহাগড়া", "কালিয়া"],
  "নারায়ণগঞ্জ": ["নারায়ণগঞ্জ সদর", "বন্দর", "সোনারগাঁও", "আড়াইহাজার", "রূপগঞ্জ"],
  "নরসিংদী": ["নরসিংদী সদর", "পলাশ", "শিবপুর", "মনোহরদী", "বেলাবো", "রায়পুরা"],
  "নাটোর": ["নাটোর সদর", "বাগাতিপাড়া", "বড়াইগ্রাম", "লালপুর", "গুরুদাসপুর", "সিংড়া", "নলডাঙ্গা"],
  "নেত্রকোনা": ["নেত্রকোনা সদর", "বারহাট্টা", "কলমাকান্দা", "দুর্গাপুর", "পূর্বধলা", "কেন্দুয়া", "মদন", "খালিয়াজুরী", "মোহনগঞ্জ", "আটপাড়া"],
  "নীলফামারী": ["নীলফামারী সদর", "সৈয়দপুর", "জলঢাকা", "কিশোরগঞ্জ", "ডোম্যার", "ডিমলা"],
  "নোয়াখালী": ["নোয়াখালী সদর", "কোম্পানীগঞ্জ", "বেগমগঞ্জ", "চাটখিল", "সেনবাগ", "হাতিয়া", "সোনাইমুড়ি", "সুবর্ণচর", "কবিরহাট"],
  "পাবনা": ["পাবনা সদর", "ঈশ্বরদী", "আটঘরিয়া", "চাটমোহর", "ভাঙ্গুড়া", "ফریدপুর", "বেড়া", "সুজানগর", "সাঁথিয়া"],
  "পঞ্চগড়": ["পঞ্চগড় সদর", "বোদা", "দেবীগঞ্জ", "আটোয়ারী", "তেঁতুলিয়া"],
  "পটুয়াখালী": ["পটুয়াখালী সদর", "বাউফল", "গলাচিপা", "দশমিনা", "কলাপাড়া", "মির্জাগঞ্জ", "দুমকি", "রাঙ্গাবালী"],
  "রাজবাড়ী": ["রাজবাড়ী সদর", "গোয়ালন্দ", "পাংশা", "বালিয়াকান্দি", "কালুখালী"],
  "রাজশাহী": ["বোয়ালিয়া", "মতিহার", "রাজপাড়া", "شاہ মখদুম", "পবা", "গোদাগাড়ী", "তানোর", "মোহনপুর", "বাগমারা", "দুর্গাপুর", "পুঠিয়া", "চারঘাট", "বাঘা"],
  "রাঙ্গামাটি": ["রাঙ্গামাটি সদর", "কাপ্তাই", "কাউখালী", "বাঘাইছড়ি", "লংগদু", "নানিয়ারচর", "রাজস্থলী", "جুরাছড়ি", "বিলাইছড়ি", "বরকল"],
  "রংপুর": ["রংপুর সদর", "মিঠাপুকুর", "পীরগঞ্জ", "পীরগাছা", "কাউনিয়া", "গঙ্গাচড়া", "বদরগঞ্জ", "তপোধন"],
  "সাতক্ষীরা": ["সাতক্ষীরা সদর", "কলারোয়া", "তালা", "দেবহাটা", "কালীগঞ্জ", "শ্যামনগর", "আশাশুনি"],
  "শরীয়তপুর": ["শরীয়তপুর সদর", "দামুড্যা", "নড়িয়া", "جাজিরা", "ভেদরগঞ্জ", "গোসাইরহাট"],
  "শেরপুর": ["শেরপুর সদর", "নালিতাবাড়ী", "ঝিনাইগাতী", "শ্রীবরদী", "নকলা"],
  "সিরাজগঞ্জ": ["সিরাজগঞ্জ সদর", "কাজিপুর", "রায়গঞ্জ", "তাড়াশ", "উল্লাপাড়া", "شاہजাদপুর", "বেলকুচি", "চৌহালী", "কামারখন্দ"],
  "টাঙ্গাইল": ["টাঙ্গাইল সদর", "কালিহাতী", "ঘাটাইল", "বাসাইল", "মির্জাপুর", "ناগরপুর", "دেলদুয়ার", "গোপালপুর", "ভূঞাপুর", "মধুপুর", "ধনবাড়ী"],
  "ঠাকুরগাঁও": ["ঠাকুরগাঁও সদর", "পীরগঞ্জ", "রানীশংকৈল", "হরিপুর", "বালিয়াডাঙ্গী"],
};

export default function AdmissionFormPage1({ formData, handleChange }) {
  const [uploading, setUploading] = useState(false);
  const [currentThanas, setCurrentThanas] = useState([]);
  const [permanentThanas, setPermanentThanas] = useState([]);
  const [isSameAddress, setIsSameAddress] = useState(false);

  // একাডেমিক সেকশনের জন্য ডাইনামিক বিভাগ স্টেট
  const [selectedAcademyType, setSelectedAcademyType] = useState(formData.divisionAcademy?.academyType || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const apiKey = "5a4f8c279ddcedf0d73f50444bad88b0";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        handleChange({
          target: { name: "studentImage", value: result.data.url },
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

  // বর্তমান ঠিকানা পরিবর্তনের সাথে সাথে যদি চেকবক্স টিক দেওয়া থাকে, তবে স্থায়ী ঠিকানাও স্বয়ংক্রিয় সিঙ্ক হবে
  useEffect(() => {
    if (isSameAddress && formData.currentAddress) {
      const fields = ["district", "thana", "postOffice", "village", "house", "road"];
      fields.forEach((key) => {
        if (formData.permanentAddress?.[key] !== formData.currentAddress[key]) {
          handleChange({
            target: { name: `permanentAddress.${key}`, value: formData.currentAddress[key] || "" },
          });
        }
      });
    }
  }, [formData.currentAddress, isSameAddress]);

  // চেকবক্স হ্যান্ডলার যা টিক দেওয়া মাত্রই ইনস্ট্যান্ট সিঙ্ক করে দেয়
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);

    if (checked && formData.currentAddress) {
      const fields = ["district", "thana", "postOffice", "village", "house", "road"];
      fields.forEach((key) => {
        handleChange({
          target: { name: `permanentAddress.${key}`, value: formData.currentAddress[key] || "" },
        });
      });
    } else if (!checked) {
      const fields = ["district", "thana", "postOffice", "village", "house", "road"];
      fields.forEach((key) => {
        handleChange({
          target: { name: `permanentAddress.${key}`, value: "" },
        });
      });
    }
  };

  // একাডেমি চেকবক্স টগল হ্যান্ডলার
  const handleAcademyActiveToggle = (e) => {
    const checked = e.target.checked;
    handleChange(e); // প্যারেন্ট স্টেট আপডেট
    if (!checked) {
      setSelectedAcademyType("");
      handleChange({ target: { name: "divisionAcademy.academyType", value: "" } });
      handleChange({ target: { name: "divisionAcademy.class", value: "" } });
      handleChange({ target: { name: "divisionAcademy.type", value: "" } });
    }
  };

  // একাডেমি টাইপ (বিভাগ) চেঞ্জ হ্যান্ডলার
  const handleAcademyTypeChange = (e) => {
    const value = e.target.value;
    setSelectedAcademyType(value);
    handleChange({ target: { name: "divisionAcademy.academyType", value } });
    handleChange({ target: { name: "divisionAcademy.class", value: "" } });
  };

  // একাডেমি টাইপ অনুযায়ী ক্লাস লিস্ট জেনারেট করা
  const getAcademyClasses = () => {
    if (selectedAcademyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
    if (selectedAcademyType === "প্রাথমিক") return ["১ম শ্রেণি", "২য় শ্রেণি", "৩য় শ্রেণি", "৪র্থ শ্রেণি", "৫ম শ্রেণি"];
    if (selectedAcademyType === "মাধ্যমিক") return ["৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি", "নবম শ্রেণি", "দশম শ্রেণি"];
    if (selectedAcademyType === "উচ্চমাধ্যমিক") return ["১১শ শ্রেণি", "১২শ শ্রেণি"];
    return [];
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.4in;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          select {
            appearance: none;
            -webkit-appearance: none;
            border: none !important;
            border-bottom: 1px dotted #9ca3af !important;
            padding: 0 !important;
            background: transparent !important;
          }
          input[type="text"], input[type="date"] {
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* মূল কন্টেইনার ক্লাস */}
      <div className="w-full min-h-[11.69in] bg-white p-4 md:p-10 flex flex-col justify-between box-border text-gray-800 relative font-bengali overflow-x-hidden print:min-h-0 print:h-full print:p-0 print:overflow-hidden">

        {/* ছবি আপলোড ও হেড অংশ */}
        <div className="flex justify-between items-start w-full mb-4 print:mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 print:text-lg">ভর্তি ফরম</h2>
            <p className="text-xs text-gray-500 print:hidden">অনুগ্রহ করে নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন।</p>
          </div>
          <div className="w-32 h-40 border-2 border-dashed border-gray-400 bg-gray-50 flex flex-col items-center justify-center p-2 text-center rounded relative group cursor-pointer overflow-hidden print:w-24 print:h-28 print:border print:border-solid">
            {formData.studentImage ? (
              <img src={formData.studentImage} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-gray-500 print:text-[10px]">{uploading ? "আপলোড হচ্ছে..." : "শিক্ষার্থীর ছবি"}</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer print:hidden"
            />
          </div>
        </div>

        {/* সেকশন ১: শিক্ষার্থীর তথ্য বিবরণী */}
        <div className="w-full mb-4 print:mb-2">
          <div className="bg-[#231f20] text-white font-bold px-4 py-1 text-sm inline-block rounded-r-md mb-4 transform -skew-x-12 print:mb-2 print:py-0.5 print:text-xs">
            <span className="inline-block skew-x-12">শিক্ষার্থীর তথ্য বিবরণী:</span>
          </div>

          <div className="space-y-4 print:space-y-2.5">
            {/* নামসমূহ */}
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">নাম (বাংলায়) :</span>
              <input
                type="text"
                name="studentNameBangla"
                value={formData.studentNameBangla || ""}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent font-medium text-sm print:text-xs"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">ইংরেজিতে :</span>
              <input
                type="text"
                name="studentNameEnglish"
                value={formData.studentNameEnglish || ""}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent font-medium uppercase text-sm print:text-xs"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">আরবিতে :</span>
              <input
                type="text"
                name="studentNameArabic"
                value={formData.studentNameArabic || ""}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-0.5 text-right focus:outline-none focus:border-orange-500 bg-transparent font-medium text-sm print:text-xs"
                dir="rtl"
              />
            </div>

            {/* জন্ম তারিখ, বয়স, লিঙ্গ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end print:grid-cols-3 print:gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">জন্ম তারিখ :</span>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="border border-gray-400 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-orange-500 text-gray-700 cursor-pointer w-full print:border-none print:border-b print:border-dotted print:px-0 print:text-xs"
                />
              </div>
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">বয়স :</span>
                <input
                  type="text"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  className="flex-1 border-b border-dotted border-gray-400 pb-0.5 text-center focus:outline-none bg-transparent text-sm print:text-xs"
                />
              </div>
              <div className="flex items-center gap-4 print:gap-2 w-full">
                <span className="font-bold text-gray-700 text-sm print:text-xs">লিঙ্গ :</span>
                {["পুরুষ", "মহিলা"].map((g) => (
                  <label key={g} className="flex items-center gap-1.5 font-semibold text-gray-700 cursor-pointer text-sm print:text-xs">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="accent-orange-600 print:w-3 print:h-3"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* জন্মসনদ নং */}
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">জন্মসনদ পত্র নং :</span>
              <input
                type="text"
                name="birthCertificateNo"
                value={formData.birthCertificateNo || ""}
                onChange={handleChange}
                className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent tracking-widest font-mono text-sm print:text-xs print:placeholder-transparent"
                placeholder="১৭ ডিজিটের নম্বর"
              />
            </div>

            {/* রক্তের গ্রুপ, ওজন, উচ্চতা, জাতীয়তা */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end print:grid-cols-4 print:gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">রক্তের গ্রুপ :</span>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  className="flex-1 border border-gray-400 rounded px-1.5 py-1 text-sm focus:outline-none focus:border-orange-500 bg-white print:text-xs print:py-0"
                >
                  <option value="">বাছাই করুন</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">ওজন:</span>
                <input type="text" name="weight" value={formData.weight || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 pb-0.5 text-center focus:outline-none text-sm print:text-xs" />
              </div>
              <div className="flex items-end gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">উচ্চতা:</span>
                <input type="text" name="height" value={formData.height || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 pb-0.5 text-center focus:outline-none text-sm print:text-xs" />
              </div>
              <div className="flex items-center gap-2 w-full">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">জাতীয়তা :</span>
                <select name="nationality" value={formData.nationality || "বাংলাদেশী"} onChange={handleChange} className="flex-1 border border-gray-400 rounded px-1 py-1 text-sm focus:outline-none bg-white print:text-xs print:py-0">
                  <option value="বাংলাদেশী">বাংলাদেশী</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* বর্তমান ঠিকানা */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-gray-700 block text-sm print:text-xs">বর্তমান ঠিকানা :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pl-0 sm:pl-4 print:grid-cols-3 print:gap-2 print:pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">জেলা:</span>
                  <select name="currentAddress.district" value={formData.currentAddress?.district || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-1 text-sm bg-white print:text-xs print:p-0.5">
                    <option value="">বাছাই করুন</option>
                    {Object.keys(bdDistrictsAndThanas).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">থানা:</span>
                  <select name="currentAddress.thana" value={formData.currentAddress?.thana || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-1 text-sm bg-white print:text-xs print:p-0.5" disabled={!formData.currentAddress?.district}>
                    <option value="">বাছাই করুন</option>
                    {currentThanas.map((thana) => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">ডাকঘর:</span>
                  <input type="text" name="currentAddress.postOffice" value={formData.currentAddress?.postOffice || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">গ্রাম/মহল্লা:</span>
                  <input type="text" name="currentAddress.village" value={formData.currentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">বাড়ি নং:</span>
                  <input type="text" name="currentAddress.house" value={formData.currentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">রাস্তা নং:</span>
                  <input type="text" name="currentAddress.road" value={formData.currentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" />
                </div>
              </div>
            </div>

            {/* চেকবক্স */}
            <div className="pl-0 sm:pl-4 print:pl-2 pt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="sameAddressCheck"
                checked={isSameAddress}
                onChange={handleSameAddressChange}
                className="w-4 h-4 accent-orange-600 print:w-3 print:h-3 cursor-pointer"
              />
              <label htmlFor="sameAddressCheck" className="text-sm font-semibold text-gray-700 print:text-xs cursor-pointer">
                বর্তমান ঠিকানা ও স্থায়ী ঠিকানা একই হলে এখানে টিক চিহ্ন দিন।
              </label>
            </div>

            {/* স্থায়ী ঠিকানা */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-gray-700 block text-sm print:text-xs">স্থায়ী ঠিকানা :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pl-0 sm:pl-4 print:grid-cols-3 print:gap-2 print:pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">জেলা:</span>
                  <select name="permanentAddress.district" value={formData.permanentAddress?.district || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-1 text-sm bg-white print:text-xs print:p-0.5" disabled={isSameAddress}>
                    <option value="">বাছাই করুন</option>
                    {Object.keys(bdDistrictsAndThanas).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">থানা:</span>
                  <select name="permanentAddress.thana" value={formData.permanentAddress?.thana || ""} onChange={handleChange} className="flex-1 border border-gray-400 rounded p-1 text-sm bg-white print:text-xs print:p-0.5" disabled={isSameAddress || !formData.permanentAddress?.district}>
                    <option value="">বাছাই করুন</option>
                    {permanentThanas.map((thana) => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">ডাকঘর:</span>
                  <input type="text" name="permanentAddress.postOffice" value={formData.permanentAddress?.postOffice || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" disabled={isSameAddress} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">গ্রাম/মহল্লা:</span>
                  <input type="text" name="permanentAddress.village" value={formData.permanentAddress?.village || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" disabled={isSameAddress} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">বাড়ি নং:</span>
                  <input type="text" name="permanentAddress.house" value={formData.permanentAddress?.house || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" disabled={isSameAddress} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap print:text-xs">রাস্তা নং:</span>
                  <input type="text" name="permanentAddress.road" value={formData.permanentAddress?.road || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" disabled={isSameAddress} />
                </div>
              </div>
            </div>

            {/* এলাকার পরিচিত ব্যক্তি */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1 print:grid-cols-2 print:gap-2">
              <div className="flex flex-row items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">এلاকার পরিচিত ব্যক্তির নাম :</span>
                <input type="text" name="referenceName" value={formData.referenceName || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none text-sm print:text-xs" />
              </div>
              <div className="flex flex-row items-end gap-2">
                <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">মোবাইল :</span>
                <input type="text" name="referenceMobile" value={formData.referenceMobile || ""} onChange={handleChange} placeholder="০১৭XXXXXXXX" className="flex-1 border-b border-dotted border-gray-400 focus:outline-none font-mono text-sm print:text-xs print:placeholder-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* সেকশন ২: ভর্তিচ্ছু বিভাগ */}
        <div className="w-full mb-4 print:mb-2">
          <div className="bg-[#231f20] text-white font-bold px-4 py-1 text-sm inline-block rounded-r-md mb-3 transform -skew-x-12 print:mb-1.5 print:py-0.5 print:text-xs">
            <span className="inline-block skew-x-12">ভর্তিচ্ছু বিভাগ:</span>
          </div>

          <div className="border border-gray-400 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-sm print:text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-400 font-bold text-gray-700">
                  <th className="p-2 border-r border-gray-400 text-center w-12 print:p-1">টিক</th>
                  <th className="p-2 border-r border-gray-400 print:p-1 w-1/3">বিভাগ</th>
                  <th className="p-2 border-r border-gray-400 print:p-1 w-1/3">শ্রেণি</th>
                  <th className="p-2 print:p-1 w-1/3">ধরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400">
                {/* রো ১: প্রি-হিফজ */}
                <tr>
                  <td className="p-2 border-r border-gray-400 text-center print:p-1">
                    <input type="checkbox" name="divisionPreHifz.active" checked={formData.divisionPreHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600 print:w-3 print:h-3 cursor-pointer" />
                  </td>
                  <td className="p-2 border-r border-gray-400 font-bold text-gray-700 print:p-1">প্রি-হিফজ</td>
                  <td className="p-2 border-r border-gray-400 print:p-1">
                    <select name="divisionPreHifz.class" value={formData.divisionPreHifz?.class || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none" disabled={!formData.divisionPreHifz?.active}>
                      <option value="">বাছাই করুন</option>
                      <option value="নার্সারি">নার্সারি</option>
                      <option value="কেজি">কেজি</option>
                    </select>
                  </td>
                  <td className="p-2 print:p-1">
                    <input type="text" name="divisionPreHifz.type" value={formData.divisionPreHifz?.type || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none" placeholder="যেমন: আবাসিক/অনাবাসিক" disabled={!formData.divisionPreHifz?.active} />
                  </td>
                </tr>

                {/* রো ২: হিফজ বিভাগ */}
                <tr>
                  <td className="p-2 border-r border-gray-400 text-center print:p-1">
                    <input type="checkbox" name="divisionHifz.active" checked={formData.divisionHifz?.active || false} onChange={handleChange} className="w-4 h-4 accent-orange-600 print:w-3 print:h-3 cursor-pointer" />
                  </td>
                  <td className="p-2 border-r border-gray-400 font-bold text-gray-700 print:p-1">হিফজ বিভাগ</td>
                  <td className="p-2 border-r border-gray-400 print:p-1">
                    <input type="text" name="divisionHifz.class" value={formData.divisionHifz?.class || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none" placeholder="যেমন: ১-৫ পারা" disabled={!formData.divisionHifz?.active} />
                  </td>
                  <td className="p-2 print:p-1">
                    <input type="text" name="divisionHifz.type" value={formData.divisionHifz?.type || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none" placeholder="যেমন: নূরানী/নাজেরা" disabled={!formData.divisionHifz?.active} />
                  </td>
                </tr>

                {/* রো ৩: একাডেমিক জেনারেল বিভাগ */}
                <tr>
                  <td className="p-2 border-r border-gray-400 text-center print:p-1">
                    <input type="checkbox" name="divisionAcademic.active" checked={formData.divisionAcademy?.active || false} onChange={handleAcademyActiveToggle} className="w-4 h-4 accent-orange-600 print:w-3 print:h-3 cursor-pointer" />
                  </td>
                  <td className="p-2 border-r border-gray-400 font-bold text-gray-700 print:p-1">একাডেমিক বিভাগ</td>
                  <td className="p-2 border-r border-gray-400 print:p-1">
                    <div className="flex flex-col gap-1">
                      <select value={selectedAcademyType} onChange={handleAcademyTypeChange} className="w-full bg-transparent focus:outline-none text-xs text-gray-500 font-semibold" disabled={!formData.divisionAcademic?.active}>
                        <option value="">বিভাগ বাছাই করুন</option>
                        <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
                        <option value="প্রাথমিক">প্রাথমিক</option>
                        <option value="মাধ্যমিক">মাধ্যমিক</option>
                        <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
                      </select>
                      {selectedAcademyType && (
                        <select name="divisionAcademy.class" value={formData.divisionAcademy?.class || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none mt-1 font-bold" disabled={!formData.divisionAcademic?.active}>
                          <option value="">শ্রেণি বাছাই করুন</option>
                          {getAcademyClasses().map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="p-2 print:p-1">
                    <input type="text" name="divisionAcademic.type" value={formData.divisionAcademy?.type || ""} onChange={handleChange} className="w-full bg-transparent focus:outline-none" placeholder="যেমন: বিজ্ঞান/মানবিক" disabled={!formData.divisionAcademic?.active} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* নতুন ফিল্ডসমূহ: ছবি অনুযায়ী পূর্বে অধ্যয়নরত প্রতিষ্ঠানের তথ্যাদি */}
<div className="space-y-4 print:space-y-2.5 pt-2 border-t border-gray-300">
  {/* ১. পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম */}
  <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
    <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">পূর্বে অধ্যয়নরত প্রতিষ্ঠানের নাম :</span>
    <input
      type="text"
      name="previousInstitutionName"
      value={formData.previousInstitutionName || ""}
      onChange={handleChange}
      className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent text-sm print:text-xs"
    />
  </div>

  {/* ২. ঠিকানা এবং ৩. প্রিন্সিপালের মোবাইল */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:grid-cols-3 print:gap-2">
    <div className="flex items-end gap-2 md:col-span-2 w-full">
      <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">ঠিকানা :</span>
      <input
        type="text"
        name="previousInstitutionAddress"
        value={formData.previousInstitutionAddress || ""}
        onChange={handleChange}
        className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent text-sm print:text-xs"
      />
    </div>
    <div className="flex items-end gap-2 w-full">
      <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">প্রিন্সিপালের মোবাইল :</span>
      <input
        type="text"
        name="previousInstitutionPrincipalMobile"
        value={formData.previousInstitutionPrincipalMobile || ""}
        onChange={handleChange}
        placeholder="০১৭XXXXXXXX"
        className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent font-mono text-sm print:text-xs print:placeholder-transparent"
      />
    </div>
  </div>

  {/* ৪. পূর্ব প্রতিষ্ঠান ছাড়ার কারণ */}
  <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 print:flex-row print:items-end print:gap-2">
    <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">পূর্ব প্রতিষ্ঠান ছাড়ার কারণ :</span>
    <input
      type="text"
      name="reasonForLeaving"
      value={formData.reasonForLeaving || ""}
      onChange={handleChange}
      className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent text-sm print:text-xs"
    />
  </div>

  {/* ৫. অধ্যয়নকৃত শ্রেণি ও ছাড়পত্র নং এবং６. তারিখ */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end print:grid-cols-3 print:gap-2">
    <div className="flex items-end gap-2 w-full">
      <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">অধ্যয়নকৃত শ্রেণি :</span>
      <input
        type="text"
        name="previousClass"
        value={formData.previousClass || ""}
        onChange={handleChange}
        className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent text-sm print:text-xs"
      />
    </div>
    <div className="flex items-end gap-2 w-full">
      <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">ছাড়পত্র নং :</span>
      <input
        type="text"
        name="transferCertificateNo"
        value={formData.transferCertificateNo || ""}
        onChange={handleChange}
        className="flex-1 border-b border-dotted border-gray-400 pb-0.5 focus:outline-none focus:border-orange-500 bg-transparent text-sm print:text-xs"
      />
    </div>
    <div className="flex items-center gap-2 w-full">
      <span className="font-bold text-gray-700 whitespace-nowrap text-sm print:text-xs">তারিখ :</span>
      <input
        type="date"
        name="leavingDate"
        value={formData.leavingDate || ""}
        onChange={handleChange}
        className="border border-gray-400 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-orange-500 text-gray-700 cursor-pointer w-full print:border-none print:border-b print:border-dotted print:px-0 print:text-xs"
      />
    </div>
  </div>
</div>
        </div>

      </div>
    </>
  );
}
