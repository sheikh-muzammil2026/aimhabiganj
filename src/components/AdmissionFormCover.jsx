// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full aspect-[1/1.414] md:w-[8.27in] md:h-[11.69in] bg-[#fafafa] p-6 sm:p-14 flex flex-col justify-between box-border relative font-bengali print:w-full print:h-screen print:p-14 overflow-hidden select-none shadow-sm">
      
      {/* ================= TOP MODERN GEOMETRIC RIBBON BORDER ================= */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-36 pointer-events-none z-0">
        {/* ডার্ক চকোলেট/ব্ল্যাক মেইন টপ বার */}
        <div className="absolute top-0 left-0 w-full h-[35%] bg-[#231f20]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%, 0 35%)" }}></div>
        {/* অরেঞ্জ সেকেন্ডারি বার */}
        <div className="absolute top-[34%] left-0 w-full h-[25%] bg-[#e36d27]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 26% 100%, 4.5% 0)" }}></div>
        {/* বামের ইন্টারলকিং জ্যামিতিক ওভারল্যাপ "V" স্ট্রিপসমূহ */}
        <div className="absolute top-0 left-0 w-[30%] h-full bg-[#231f20]" style={{ clipPath: "polygon(0 0, 4% 0, 24% 100%, 15% 100%, 0 25%)" }}></div>
        <div className="absolute top-0 left-0 w-[30%] h-full bg-[#e36d27]" style={{ clipPath: "polygon(4.5% 0, 10.5% 0, 28.5% 100%, 24.5% 100%)" }}></div>
        <div className="absolute top-0 left-0 w-[35%] h-full bg-[#231f20]" style={{ clipPath: "polygon(14% 0, 19% 0, 36% 100%, 29% 100%)" }}></div>
      </div>

      {/* ================= BOTTOM MODERN GEOMETRIC RIBBON BORDER ================= */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 pointer-events-none z-0">
        {/* ডার্ক চকোলেট/ব্ল্যাক মেইন বটম বার */}
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-[#231f20]" style={{ clipPath: "polygon(0 0, 78% 0, 100% 65%, 100% 100%, 0 100%)" }}></div>
        {/* অরেঞ্জ সেকেন্ডারি বার */}
        <div className="absolute bottom-[34%] left-0 w-full h-[25%] bg-[#e36d27]" style={{ clipPath: "polygon(74% 0, 95.5% 100%, 100% 100%, 100% 0)" }}></div>
        {/* ডানের ইন্টারলকিং জ্যামিতিক ওভারল্যাপ "V" স্ট্রিপসমূহ */}
        <div className="absolute bottom-0 right-0 w-[30%] h-full bg-[#231f20]" style={{ clipPath: "polygon(96% 100%, 0 0, 9% 0, 100% 75%, 100% 100%)" }}></div>
        <div className="absolute bottom-0 right-0 w-[30%] h-full bg-[#e36d27]" style={{ clipPath: "polygon(89.5% 100%, 0 0, 4% 0, 95.5% 100%)" }}></div >
        <div className="absolute bottom-0 right-0 w-[35%] h-full bg-[#231f20]" style={{ clipPath: "polygon(86% 100%, 0 0, 7% 0, 91% 100%)" }}></div>
      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-6 sm:py-10 text-center">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col items-center text-center w-full mt-10 sm:mt-16">
          {/* মনোগ্রাম লোগো ফ্রেম */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-[3px] border-[#1b2d56] rounded-full flex items-center justify-center bg-white mb-4 p-1 shadow-sm">
            <div className="w-full h-full rounded-full border border-dashed border-[#e36d27] flex flex-col items-center justify-center p-1">
              <span className="text-[10px] sm:text-[12px] font-black text-[#1b2d56] tracking-tight leading-none">AIM</span>
              <span className="text-[7px] sm:text-[9px] text-[#e36d27] font-mono mt-0.5">Founded 2018</span>
            </div>
          </div>

          {/* আরবী নাম (মেটালিক নেভি ব্লু) */}
          <h3 className="text-xl sm:text-[27px] font-medium text-[#1b2d56] tracking-wide mb-1.5 antialiased" style={{ fontFamily: "serif" }}>
            مدرسة السلام النموذجية
          </h3>
          {/* বাংলা নাম (গাঢ় লাল-মেরুন) */}
          <h1 className="text-2xl sm:text-[38px] font-extrabold text-[#cc1e29] tracking-normal mb-1 drop-shadow-sm">
            আস-সালাম আইডিয়াল মাদরাসা <span className="text-base sm:text-2xl font-bold">(এইম)</span>
          </h1>
          {/* ইংরেজি নাম */}
          <h2 className="text-xl sm:text-[29px] font-black text-[#231f20] font-sans tracking-tight mb-1">
            As-Salam Ideal Madrasah
          </h2>
          {/* স্লোগান */}
          <p className="text-[11px] sm:text-fbase font-extrabold text-[#006cb7] font-sans italic tracking-wide">
            A<span className="text-[#cc1e29]">&</span>M For Ultimate Success
          </p>
        </div>

        {/* ভর্তি ফরম টাইটেল (মিডল সেকশন) */}
        <div className="my-8 text-center w-full flex justify-center">
          <div className="relative px-12 py-2 sm:px-16 sm:py-3.5 text-white font-black text-2xl sm:text-4xl tracking-widest select-none">
            {/* ব্যাকগ্রাউন্ড রিফাইনড সলিড ব্যানার (যা ব্রাশ ইফেক্টের বিকল্প হিসেবে স্ট্যান্ডার্ড লুক দেয়) */}
            <span className="relative z-10 drop-shadow-md">ভর্তি ফরম</span>
            <div className="absolute inset-0 bg-[#1b509f] transform -skew-x-12 rounded-[4px] shadow-sm"></div>
            <div className="absolute -inset-1 border border-[#1b509f]/20 transform -skew-x-12 rounded-[6px]"></div>
          </div>
        </div>

        {/* ইনপুট ডাটা ফিল্ডসমূহ */}
        <div className="w-full max-w-xl px-6 sm:px-10 space-y-6 sm:space-y-8 text-left my-4">
          <div className="flex items-end gap-3 text-base sm:text-xl">
            <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">শিক্ষার্থীর নাম :</span>
            <input 
              type="text" 
              name="studentNameBangla" 
              value={formData.studentNameBangla || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-700 focus:outline-none focus:border-[#1b509f] bg-transparent font-bold text-gray-800 px-1 pb-0.5 tracking-wide" 
            />
          </div>

          <div className="flex items-end gap-3 text-base sm:text-xl">
            <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">অভিভাবকের নাম :</span>
            <input 
              type="text" 
              name="guardianNameCover" 
              value={formData.guardianNameCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-700 focus:outline-none focus:border-[#1b509f] bg-transparent font-bold text-gray-800 px-1 pb-0.5 tracking-wide" 
            />
          </div>

          <div className="flex items-end gap-3 text-base sm:text-xl">
            <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">আইডি নম্বর :</span>
            <input 
              type="text" 
              name="idNumberCover" 
              value={formData.idNumberCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-700 focus:outline-none focus:border-[#1b509f] bg-transparent font-mono font-bold text-gray-800 px-1 pb-0.5" 
            />
          </div>

          <div className="flex items-end gap-3 text-base sm:text-xl">
            <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">মোবাইল নম্বর :</span>
            <input 
              type="text" 
              name="mobileNumberCover" 
              value={formData.mobileNumberCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-700 focus:outline-none focus:border-[#1b509f] bg-transparent font-mono font-bold tracking-[0.2em] text-gray-800 px-1 pb-0.5" 
            />
          </div>
        </div>

        {/* ফুটো সেকশন (ঠিকানা ও সোশ্যাল মিডিয়া লিংক) */}
        <div className="w-full text-center mt-4 sm:mt-8 px-6 mb-8 sm:mb-12">
          <h4 className="text-base sm:text-xl font-extrabold text-[#cc1e29] tracking-wide mb-1">
            এইম ক্যাম্পাস, দক্ষিণ श्यामলী আ/এ, হবিগঞ্জ-৩৩০০
          </h4>
          <p className="text-sm sm:text-lg font-black text-[#1b2d56] font-mono mb-3 tracking-wide">
            মোবাইল (অফিস): ০১৩১৬ ২০১ ২০১, ০১৭৪৮ ৮৬৮ ১৬১
          </p>

          {/* সোশ্যাল বার */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1.5 text-[10px] sm:text-[13px] text-gray-600 font-bold pt-3 border-t border-gray-300/70 w-full max-w-lg mx-auto">
            <span className="flex items-center gap-1">🌐 www.aimhabiganj.com</span>
            <span className="flex items-center gap-1">✉️ aimhabiganj@gmail.com</span>
            <span className="flex items-center gap-1">🔷 aim habiganj</span>
            <span className="flex items-center gap-1">🔺 aimhabiganj</span>
          </div>
        </div>

      </div>

    </div>
  );
}
