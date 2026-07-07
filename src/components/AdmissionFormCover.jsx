// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full min-h-[11.69in] bg-white p-12 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:min-h-screen">
      
      {/* চারপাশের নিখুঁত ডাবল বর্ডার (মাদরাসা ফর্মের ঐতিহ্যবাহী স্টাইল) */}
      <div className="absolute inset-6 border-4 border-double border-gray-400 pointer-events-none rounded-sm p-1">
        <div className="w-full h-full border border-gray-200"></div>
      </div>

      {/* কভার পেজের ভেতরের মূল কন্টেন্ট */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-6">
        
        {/* টপ সেকশন: সিরিয়াল ও ফরম নং */}
        <div className="w-full flex justify-between items-center text-sm px-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-700">ফরম নং:</span>
            <input type="text" name="formNo" value={formData.formNo || ""} onChange={handleChange} className="w-24 border-b border-gray-400 font-mono text-center focus:outline-none tracking-widest font-bold" placeholder="0000" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-700">আইডি নং (অফিস):</span>
            <input type="text" name="studentIdOffice" value={formData.officeUse?.studentIdOffice || ""} onChange={(e) => handleChange(e, "officeUse")} className="w-28 border-b border-gray-400 font-mono text-center focus:outline-none tracking-wider" placeholder="--------" />
          </div>
        </div>

        {/* মিডল সেকশন ১: লোগো এবং মাদরাসার নাম (হেডার) */}
        <div className="flex flex-col items-center text-center mt-6">
          {/* লোগো প্লেসহোল্ডার */}
          <div className="w-28 h-28 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 mb-4 p-2 shadow-inner">
            <span className="text-xs font-bold text-gray-400 text-center">মাদরাসার লোগো</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide mb-1">
            বিসমিল্লাহির রাহমানির রাহিম
          </h1>
          <h2 className="text-2xl font-bold text-orange-600 mb-2">
            আপনার প্রতিষ্ঠানের নাম এখানে দিন
          </h2>
          <p className="text-xs text-gray-500 max-w-md italic">
            প্রতিষ্ঠানের ঠিকানা, রোড নম্বর, থানা ও জেলা এখানে সুন্দর করে বসিয়ে দিন
          </p>
        </div>

        {/* মিডল সেকশন ২: বড় করে "ভর্তি ফরম" টাইটেল */}
        <div className="my-8 text-center w-full max-w-md">
          <div className="bg-[#1a1a1a] text-white py-3 px-8 rounded-lg shadow-md transform uppercase tracking-widest text-xl font-black flex flex-col gap-1 items-center justify-center">
            <span>ভর্তি আবেদন ফরম</span>
            <div className="flex items-center gap-2 text-sm font-normal text-orange-400 mt-1">
              <span>শিক্ষাবর্ষ / সেশন:</span>
              <input type="text" name="sessionYear" value={formData.sessionYear || "২০২৬-২০২৭"} onChange={handleChange} className="bg-transparent border-b border-orange-400 text-center w-24 focus:outline-none font-bold text-white" />
            </div>
          </div>
        </div>

        {/* মিডল সেকশন ৩: কভার পেজের সাধারণ তথ্যাবলী (যার জন্য ফর্মটি তোলা হচ্ছে) */}
        <div className="w-full max-w-xl border border-gray-300 rounded-xl p-6 bg-gray-50/50 my-4 space-y-4 shadow-sm">
          <div className="flex items-end gap-2 text-base">
            <span className="font-bold text-gray-700 whitespace-nowrap">১. শিক্ষার্থীর নাম (বাংলায়):</span>
            <input type="text" name="studentNameBangla" value={formData.studentNameBangla || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-semibold" />
          </div>

          <div className="flex items-end gap-2 text-base">
            <span className="font-bold text-gray-700 whitespace-nowrap">২. শিক্ষার্থীর নাম (English):</span>
            <input type="text" name="studentNameEnglish" value={formData.studentNameEnglish || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent uppercase font-semibold tracking-wide" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">৩. যে শ্রেণীতে ভর্তি হতে ইচ্ছুক:</span>
              <input type="text" name="desiredClass" value={formData.desiredClass || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-gray-700 whitespace-nowrap">৪. বিভাগ / শাখা:</span>
              <input type="text" name="desiredSection" value={formData.desiredSection || ""} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent" />
            </div>
          </div>

          <div className="flex items-end gap-2 text-base">
            <span className="font-bold text-gray-700 whitespace-nowrap">৫. অভিভাবকের মোবাইল নম্বর:</span>
            <input type="text" name="guardianMobilePrimary" value={formData.fatherMobile || formData.guardianMobile || ""} readOnly className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono tracking-wider" placeholder="২য় পেজে পূরণকৃত নম্বরটি এখানে দেখাবে" />
          </div>
        </div>

        {/* বটম সেকশন: একটি সুন্দর নির্দেশনামূলক ফুটনোট */}
        <div className="w-full text-center mt-6 border-t border-gray-200 pt-4 max-w-md">
          <p className="text-xs text-gray-400 font-medium">
            * ফরমটি সঠিকভাবে পূরণ করে প্রয়োজনীয় কাগজপত্রসহ অফিসে জমা দিন।
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            © {new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত - আপনার প্রতিষ্ঠান কর্তৃপক্ষ।
          </p>
        </div>

      </div>

    </div>
  );
}
