// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    /* কন্টেইনার: মোবাইল স্ক্রিনে স্বাভাবিক উচ্চতা (aspect-ratio), প্রিন্ট ও ডেক্সটপে ফিক্সড A4 সাইজ */
    <div className="w-full aspect-[1/1.414] md:w-[8.27in] md:h-[11.69in] bg-white p-6 sm:p-12 flex flex-col justify-between box-border text-gray-800 relative font-bengali print:w-full print:h-screen print:p-12 print:shadow-none">
      
      {/* ছবির মতো নিখুঁত ডাবল বর্ডার (মোবাইলেও কাটবে না) */}
      <div className="absolute inset-3 sm:inset-6 border-4 border-double border-[#231f20]/60 pointer-events-none rounded-sm p-0.5 sm:p-1">
        <div className="w-full h-full border border-gray-200"></div>
      </div>

      {/* কভার পেজের ভেতরের মূল কন্টেন্ট */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-2 sm:py-6 text-center">
        
        {/* টপ সেকশন: সিরিয়াল ও ফরম নং (রেসপনসিভ গ্রিড) */}
        <div className="w-full flex justify-between items-center text-xs sm:text-sm px-2 sm:px-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#231f20]">ফরম নং:</span>
            <input 
              type="text" 
              name="formNo" 
              value={formData.formNo || ""} 
              onChange={handleChange} 
              className="w-16 sm:w-24 border-b border-gray-400 font-mono text-center focus:outline-none focus:border-orange-500 tracking-widest font-bold bg-transparent" 
              placeholder="0000" 
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#231f20]">আইডি নং (অফিস):</span>
            <input 
              type="text" 
              name="studentIdOffice" 
              value={formData.officeUse?.studentIdOffice || ""} 
              onChange={(e) => handleChange(e, "officeUse")} 
              className="w-20 sm:w-28 border-b border-gray-400 font-mono text-center focus:outline-none focus:border-orange-500 tracking-wider bg-transparent" 
              placeholder="--------" 
            />
          </div>
        </div>

        {/* মিডল সেকশন ১: লোগো এবং মাদরাসার নাম (কালার এবং শ্যাডো ইমেজের মতো) */}
        <div className="flex flex-col items-center text-center mt-3 sm:mt-6 w-full px-2">
          {/* লোগো প্লেসহোল্ডার */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-[#231f20]/30 rounded-full flex items-center justify-center bg-gray-50 mb-2 sm:mb-4 p-2 shadow-inner">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 text-center">মাদরাসার লোগো</span>
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 tracking-wide mb-0.5 sm:mb-1">
            বিসমিল্লাহির রাহমানির রাহিম
          </h1>
          <h2 className="text-xl sm:text-3xl font-black text-[#231f20] leading-tight mb-1 sm:mb-2">
            আপনার প্রতিষ্ঠানের নাম এখানে দিন
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-600 max-w-md font-medium">
            প্রতিষ্ঠানের ঠিকানা, রোড নম্বর, থানা ও জেলা এখানে সুন্দর করে বসিয়ে দিন
          </p>
        </div>

        {/* মিডল সেকশন ২: ছবির মতো আসল কালার কম্বিনেশনের "ভর্তি ফরম" টাইটেল */}
        <div className="my-4 sm:my-8 text-center w-full max-w-xs sm:max-w-md px-4">
          {/* ব্যাকগ্রাউন্ড কালার হুবহু ছবির ডার্ক গ্রে/ব্ল্যাক কালার টোন #231f20 */}
          <div className="bg-[#231f20] text-white py-2 sm:py-3.5 px-4 sm:px-8 rounded-lg shadow-xl tracking-wide flex flex-col gap-0.5 sm:gap-1 items-center justify-center transform hover:scale-[1.01] transition-transform">
            <span className="text-lg sm:text-2xl font-black tracking-widest text-white">ভর্তি আবেদন ফরম</span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-normal text-orange-400 mt-0.5 sm:mt-1">
              <span className="font-semibold">শিক্ষাবর্ষ / সেশন:</span>
              <input 
                type="text" 
                name="sessionYear" 
                value={formData.sessionYear || "২০২৬-২০২৭"} 
                onChange={handleChange} 
                className="bg-transparent border-b border-orange-400 text-center w-20 sm:w-24 focus:outline-none font-bold text-white text-xs sm:text-sm" 
              />
            </div>
          </div>
        </div>

        {/* মিডল সেকশন ৩: ছবির লেআউট অনুযায়ী সাধারণ তথ্যাবলী */}
        <div className="w-full max-w-lg border border-gray-300 rounded-xl p-4 sm:p-6 bg-gray-50/50 my-2 sm:my-4 space-y-3 sm:space-y-5 text-left shadow-sm">
          <div className="flex items-end gap-2 text-sm sm:text-base">
            <span className="font-bold text-[#231f20] whitespace-nowrap">১. শিক্ষার্থীর নাম (বাংলায়):</span>
            <input 
              type="text" 
              name="studentNameBangla" 
              value={formData.studentNameBangla || ""} 
              onChange={handleChange} 
              className="flex-1 border-b border-dotted border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent font-semibold text-gray-800" 
            />
          </div>

          <div className="flex items-end gap-2 text-sm sm:text-base">
            <span className="font-bold text-[#231f20] whitespace-nowrap">২. শিক্ষার্থীর নাম (English):</span>
            <input 
              type="text" 
              name="studentNameEnglish" 
              value={formData.studentNameEnglish || ""} 
              onChange={handleChange} 
              className="flex-1 border-b border-dotted border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent uppercase font-semibold tracking-wide text-gray-800" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
            <div className="flex items-end gap-2">
              <span className="font-bold text-[#231f20] whitespace-nowrap">৩. যে শ্রেণীতে ভর্তি ইচ্ছুক:</span>
              <input 
                type="text" 
                name="desiredClass" 
                value={formData.desiredClass || ""} 
                onChange={handleChange} 
                className="flex-1 border-b border-dotted border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent text-gray-800" 
              />
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-[#231f20] whitespace-nowrap">৪. বিভাগ / শাখা:</span>
              <input 
                type="text" 
                name="desiredSection" 
                value={formData.desiredSection || ""} 
                onChange={handleChange} 
                className="flex-1 border-b border-dotted border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent text-gray-800" 
              />
            </div>
          </div>

          <div className="flex items-end gap-2 text-sm sm:text-base">
            <span className="font-bold text-[#231f20] whitespace-nowrap">৫. অভিভাবকের মোবাইল নং:</span>
            <input 
              type="text" 
              name="guardianMobilePrimary" 
              value={formData.fatherMobile || formData.guardianMobile || ""} 
              readOnly 
              className="flex-1 border-b border-dotted border-gray-400 focus:outline-none bg-transparent font-mono tracking-wider text-gray-600" 
              placeholder="২য় পেজে পূরণকৃত নম্বরটি এখানে দেখাবে" 
            />
          </div>
        </div>

        {/* বটম সেকশন: ফুটনোট */}
        <div className="w-full text-center mt-3 sm:mt-6 border-t border-gray-200 pt-3 max-w-xs sm:max-w-md">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            * ফরমটি সঠিকভাবে পূরণ করে প্রয়োজনীয় কাগজপত্রসহ অফিসে জমা দিন।
          </p>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
            © {new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত - আপনার প্রতিষ্ঠান কর্তৃপক্ষ।
          </p>
        </div>

      </div>

    </div>
  );
}
