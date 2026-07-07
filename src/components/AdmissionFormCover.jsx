// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full aspect-[1/1.414] md:w-[8.27in] md:h-[11.69in] bg-[#fafafa] p-6 sm:p-14 flex flex-col justify-between box-border relative font-bengali print:w-full print:h-screen print:p-14 overflow-hidden select-none shadow-sm">
      
      {/* ================= TOP GEOMETRIC BORDER (নিখুঁত ডাবল ত্রিভুজ ও মাঝখানের ফাঁকা জায়গা) ================= */}
      <div className="absolute top-[8px] left-0 right-0 h-36 sm:h-48 pointer-events-none z-0">
        {/* --- ১ম ত্রিভুজ (ডান থেকে এসে মাঝখানে তৈরি হওয়া বড় ত্রিভুজ) --- */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(100% 0, 100% 15%, 45% 15%, 32% 55%, 19% 15%, 15% 15%, 29% 60%, 47% 15%)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(100% 15%, 100% 27%, 48% 27%, 32% 75%, 16% 27%, 12% 27%, 29% 80%, 50% 27%)" }}
        ></div>

        {/* --- ২য় ত্রিভুজ (একদম বামের কর্নারে তৈরি হওয়া ২য় ত্রিভুজটি) --- */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(0 0, 0 20%, 11% 55%, 14% 45%, 4% 15%, 10% 15%, 0 0)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(0 20%, 0 35%, 10% 70%, 14% 55%, 11% 55%)" }}
        ></div>
      </div>

      {/* ================= BOTTOM GEOMETRIC BORDER (নিখুঁত ডাবল ত্রিভুজ ও মাঝখানের ফাঁকা জায়গা) ================= */}
      <div className="absolute bottom-[8px] left-0 right-0 h-36 sm:h-48 pointer-events-none z-0">
        {/* --- ১ম ত্রিভুজ (বাম থেকে এসে ডান-মাঝখানের বড় ত্রিভুজ) --- */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(0 100%, 0 85%, 55% 85%, 68% 45%, 81% 85%, 85% 85%, 71% 40%, 53% 85%)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(0 85%, 0 73%, 52% 73%, 68% 25%, 84% 73%, 88% 73%, 71% 20%, 50% 73%)" }}
        ></div>

        {/* --- ২য় ত্রিভুজ (একদম ডানের কর্নারে তৈরি হওয়া ২য় ত্রিভুজটি) --- */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(100% 100%, 100% 80%, 89% 45%, 86% 55%, 96% 85%, 90% 85%, 100% 100%)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(100% 80%, 100% 65%, 90% 30%, 86% 45%, 89% 45%)" }}
        ></div>
      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-6 sm:py-10 text-center">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col items-center text-center w-full mt-16 sm:mt-24">
          {/* মনোগ্রাম লোগো ফ্রেম */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-[3px] border-[#1b2d56] rounded-full flex items-center justify-center bg-white mb-4 p-1 shadow-sm">
            <div className="w-full h-full rounded-full border border-dashed border-[#e36d27] flex flex-col items-center justify-center p-1">
              <span className="text-[10px] sm:text-[12px] font-black text-[#1b2d56] tracking-tight leading-none">AIM</span>
              <span className="text-[7px] sm:text-[9px] text-[#e36d27] font-mono mt-0.5">Founded 2018</span>
            </div>
          </div>

          {/* আরবী নাম */}
          <h3 className="text-xl sm:text-[27px] font-medium text-[#1b2d56] tracking-wide mb-1.5 antialiased" style={{ fontFamily: "serif" }}>
            مدرسة السلام النموذجية
          </h3>
          {/* বাংলা নাম */}
          <h1 className="text-2xl sm:text-[38px] font-extrabold text-[#cc1e29] tracking-normal mb-1 drop-shadow-sm">
            আস-সালাম আইডিয়াল মাদরাসা <span className="text-base sm:text-2xl font-bold">(এইম)</span>
          </h1>
          {/* ইংরেজি নাম */}
          <h2 className="text-xl sm:text-[29px] font-black text-[#231f20] font-sans tracking-tight mb-1">
            As-Salam Ideal Madrasah
          </h2>
          
          {/* স্লোগান সেকশন: AİM For Ultimate Success */}
          <p className="text-[12px] sm:text-[16px] font-black text-[#006cb7] font-sans tracking-wide flex items-center justify-center gap-0.5">
            <span>A</span>
            <span className="relative inline-block text-[#cc1e29] font-serif not-italic font-black mx-[2px] pr-[2px]">
              I
              {/* কাস্টম চোখের পানির ফোঁটার ডিজাইন */}
              <span className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[6px] h-[8px] bg-[#cc1e29] rounded-b-full rounded-tl-full rotate-45"></span>
            </span>
            <span>M For Ultimate Success</span>
          </p>
        </div>

        {/* ভর্তি ফরম টাইটেল */}
        <div className="my-8 text-center w-full flex justify-center">
          <div className="relative px-12 py-2 sm:px-16 sm:py-3.5 text-white font-black text-2xl sm:text-4xl tracking-widest select-none">
            <span className="relative z-10 drop-shadow-md">ভর্তি ফরম</span>
            <div className="absolute inset-0 bg-[#1b509f] transform -skew-x-12 rounded-[4px] shadow-sm"></div>
            <div className="absolute -inset-1 border border-[#1b509f]/20 transform -skew-x-12 rounded-[6px]"></div>
          </div>
        </div>

        {/* ইনপুট ডাটা ফিল্ডসমূহ */}
        <div className="w-full max-w-xl px-6 sm:px-10 space-y-6 sm:space-y-8 text-left my-4">
          <div className="flex items-end gap-3 text-base sm:text-xl">
            <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">শিক্ষार्थियों নাম :</span>
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

        {/* ফুটোর সেকশন */}
        <div className="w-full text-center mt-4 sm:mt-8 px-6 mb-8 sm:mb-12">
          <h4 className="text-base sm:text-xl font-extrabold text-[#cc1e29] tracking-wide mb-1">
            এইম ক্যাম্পাস, দক্ষিণ শ্যামলী আ/এ, হবিগঞ্জ-৩৩০০
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
