// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full min-h-[11.69in] md:w-[8.27in] md:h-[11.69in] bg-white p-4 sm:p-14 flex flex-col justify-between box-border relative font-bengali print:w-full print:h-screen print:p-14 overflow-hidden select-none shadow-sm mx-auto">
      
      {/* ================= TOP DESIGN (ইমেজের মতো বাম ও ডান কর্নারের শেপ) ================= */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-0">
        {/* বাম দিকের টপ কর্নার ডিজাইন */}
        <div className="absolute top-0 left-0 w-24 sm:w-32 h-12 sm:h-16 bg-[#e36d27] transform -skew-x-[45deg] origin-top-left -translate-x-8"></div>
        <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-[#231f20] transform -rotate-45 -translate-y-12 -translate-x-12 border-r-[8px] sm:border-r-[12px] border-[#e36d27]"></div>
        
        {/* ডান দিকের টপ কর্নার ডিজাইন */}
        <div className="absolute top-0 right-0 w-32 sm:w-48 h-6 sm:h-8 bg-[#e36d27] transform -skew-x-[45deg] origin-top-right translate-x-12"></div>
        <div className="absolute top-3 sm:top-4 right-0 w-24 sm:w-40 h-4 sm:h-6 bg-[#231f20] transform -skew-x-[45deg] origin-top-right translate-x-4"></div>
      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-4 text-center">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col items-center text-center w-full mt-10 sm:mt-16">
          {/* মনোগ্রাম লোগো ফ্রেম */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 border-[3px] border-[#1b2d56] rounded-full flex items-center justify-center bg-white mb-3 p-1 shadow-sm">
            <div className="w-full h-full rounded-full border border-dashed border-[#e36d27] flex flex-col items-center justify-center p-1">
              <span className="text-[9px] sm:text-[12px] font-black text-[#1b2d56] tracking-tight leading-none">AIM</span>
              <span className="text-[6px] sm:text-[9px] text-[#e36d27] font-mono mt-0.5">Founded 2018</span>
            </div>
          </div>

          {/* আরবী নাম */}
          <h3 className="text-lg sm:text-[24px] font-medium text-[#1b2d56] tracking-wide mb-1 antialiased" style={{ fontFamily: "serif" }}>
            مدرسة السلام النموذجية
          </h3>
          {/* বাংলা নাম */}
          <h1 className="text-xl sm:text-[34px] font-extrabold text-[#cc1e29] tracking-normal mb-1 drop-shadow-sm px-2">
            আস-সালাম আইডিয়াল মাদরাসা <span className="text-sm sm:text-xl font-bold">(এইম)</span>
          </h1>
          {/* ইংরেজি নাম */}
          <h2 className="text-lg sm:text-[26px] font-black text-[#231f20] font-sans tracking-tight mb-1">
            As-Salam Ideal Madrasah
          </h2>
          
          {/* স্লোগান সেকশন */}
          <p className="text-[10px] sm:text-[14px] font-black text-[#006cb7] font-sans tracking-wide flex items-center justify-center gap-0.5">
            <span>A</span>
            <span className="relative inline-block text-[#cc1e29] font-serif not-italic font-black mx-[2px] pr-[2px]">
              I
              <span className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[4px] sm:w-[5px] h-[5px] sm:h-[7px] bg-[#cc1e29] rounded-b-full rounded-tl-full rotate-45"></span>
            </span>
            <span>M For Ultimate Success</span>
          </p>
        </div>

        {/* ভর্তি ফরম টাইটেল */}
        <div className="my-6 text-center w-full flex justify-center">
          <div className="relative px-10 py-1.5 sm:px-16 sm:py-3 text-white font-black text-xl sm:text-3xl tracking-widest select-none bg-[#1b509f] rounded-[4px] shadow-sm before:absolute before:inset-0 before:bg-[#1b509f] before:blur-[2px] before:-z-10">
            <span className="relative z-10 drop-shadow-md">ভর্তি ফরম</span>
          </div>
        </div>

        {/* ইনপুট ডাটা ফিল্ডসমূহ */}
        <div className="w-full max-w-xl px-4 sm:px-10 space-y-4 sm:space-y-6 text-left my-2">
          {[
            { label: "শিক্ষার্থীর নাম", name: "studentNameBangla", type: "text" },
            { label: "অভিভাবকের নাম", name: "guardianNameCover", type: "text" },
            { label: "আইডি নম্বর", name: "idNumberCover", type: "text", isMono: true },
            { label: "মোবাইল নম্বর", name: "mobileNumberCover", type: "text", isMono: true, spacer: true },
          ].map((field) => (
            <div key={field.name} className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2 text-sm sm:text-lg">
              <span className="font-extrabold text-[#231f20] whitespace-nowrap tracking-wide">{field.label} :</span>
              <div className="flex-1 w-full border-b border-dashed border-gray-800 relative pb-0.5">
                <input 
                  type={field.type} 
                  name={field.name} 
                  value={formData[field.name] || ""} 
                  onChange={handleChange} 
                  className={`w-full focus:outline-none bg-transparent font-bold text-gray-800 px-1 ${field.isMono ? 'font-mono' : ''} ${field.spacer ? 'tracking-[0.10em] sm:tracking-[0.15em]' : 'tracking-wide'}`} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* ফুটার সেকশন */}
        <div className="w-full text-center mt-6 px-4 pb-4 relative z-10">
          <h4 className="text-xs sm:text-lg font-extrabold text-[#cc1e29] tracking-wide mb-1 px-2">
            এইম ক্যাম্পাস, দক্ষিণ শ্যামলী আ/এ, হবিগঞ্জ-৩৩০০
          </h4>
          <p className="text-[10px] sm:text-[16px] font-black text-[#1b2d56] font-mono mb-4 tracking-wide">
            মোবাইল (অফিস): ০১৩১৬ ২০১ ২০১, ০১৭৪৮ ৮৬৮ ১৬১
          </p>

          {/* সোশ্যাল বার */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[8px] sm:text-[12px] text-gray-600 font-bold pt-2 border-t border-gray-300/70 w-full max-w-lg mx-auto">
            <span className="flex items-center gap-1 whitespace-nowrap">🌐 www.aimhabiganj.com</span>
            <span className="flex items-center gap-1 whitespace-nowrap">✉️ aimhabiganj@gmail.com</span>
            <span className="flex items-center gap-1 whitespace-nowrap">🔷 aim habiganj</span>
            <span className="flex items-center gap-1 whitespace-nowrap">🔺 aimhabiganj</span>
          </div>
        </div>

      </div>

      {/* ================= BOTTOM DESIGN (ইমেজের মতো নিখুঁত ডাবল জ্যামিতিক ট্রায়াঙ্গেল) ================= */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 pointer-events-none z-0 overflow-hidden">
        {/* ভেতরের বড় ব্ল্যাক ট্রায়াঙ্গেল স্ট্রাইপ */}
        <div className="absolute bottom-0 right-0 w-24 sm:w-36 h-24 sm:h-36 bg-[#231f20] transform rotate-45 translate-x-8 sm:translate-x-12 translate-y-8 sm:translate-y-12 origin-bottom-right"></div>
        {/* মাঝখানের অরেঞ্জ ট্রায়াঙ্গেল স্ট্রাইপ */}
        <div className="absolute bottom-0 right-0 w-28 sm:w-40 h-28 sm:h-40 border-[10px] sm:border-[16px] border-[#e36d27] transform rotate-45 translate-x-6 sm:translate-x-8 translate-y-6 sm:translate-y-8 origin-bottom-right"></div>
        {/* বাইরের ব্ল্যাক চিকন স্ট্রাইপ */}
        <div className="absolute bottom-0 right-0 w-30 sm:w-44 h-30 sm:h-44 border-[4px] sm:border-[6px] border-[#231f20] transform rotate-45 translate-x-3 sm:translate-x-4 translate-y-3 sm:translate-y-4 origin-bottom-right"></div>
      </div>

    </div>
  );
}
