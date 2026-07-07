// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full aspect-[1/1.414] md:w-[8.27in] md:h-[11.69in] bg-[#fafafa] p-6 sm:p-14 flex flex-col justify-between box-border relative font-bengali print:w-full print:h-screen print:p-14 overflow-hidden select-none shadow-sm">
      
      {/* ================= TOP PERFECT GEOMETRIC RIBBON BORDER (ছবি অনুযায়ী হুবহু ২/৩ অংশ ও ত্রিভুজ ভাঁজ) ================= */}
      <div className="absolute top-0 left-0 right-0 h-28 sm:h-40 pointer-events-none z-0">
        {/* মেইন ডার্ক চকোলেট/ব্ল্যাক বার: ডান থেকে ২/৩ অংশ সোজা এসে বামে উল্টো ত্রিভুজ হয়ে কোণায় উঠেছে */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(100% 0, 100% 28%, 35% 28%, 20% 70%, 0 24%, 0 0)" }}
        ></div>
        
        {/* মেইন উজ্জ্বল কমলা বার: ঠিক কালো বারের সমান্তরালে নিচে নিচে চলেছে */}
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(100% 27%, 100% 48%, 37% 48%, 21% 92%, 0 45%, 0 23%)" }}
        ></div>

        {/* বামের কোণায় যে এক্সট্রা ট্রায়াঙ্গেল বর্ডার স্ট্রাইপ তৈরি হয়েছে */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(0 44%, 18% 82%, 23% 82%, 0 35%)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(0 34%, 14% 64%, 18% 64%, 0 25%)" }}
        ></div>
      </div>

      {/* ================= BOTTOM PERFECT GEOMETRIC RIBBON BORDER (বাম থেকে ২/৩ অংশ ও ডানের ত্রিভুজ ভাঁজ) ================= */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-40 pointer-events-none z-0">
        {/* মেইন ডার্ক চকোলেট/ব্ল্যাক বার: বাম থেকে ২/৩ অংশ সোজা এসে ডানে উল্টো ত্রিভুজ হয়ে কোণায় নেমেছে */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(0 100%, 0 72%, 65% 72%, 80% 30%, 100% 76%, 100% 100%)" }}
        ></div>
        
        {/* মেইন উজ্জ্বল কমলা বার: ঠিক কালো বারের সমান্তরালে উপরে উপরে চলেছে */}
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(0 73%, 0 52%, 63% 52%, 79% 8%, 100% 55%, 100% 77%)" }}
        ></div>

        {/* ডানের কোণায় যে এক্সট্রা ট্রায়াঙ্গেল বর্ডার স্ট্রাইপ তৈরি হয়েছে */}
        <div 
          className="absolute inset-0 bg-[#231f20]" 
          style={{ clipPath: "polygon(100% 56%, 82% 18%, 77% 18%, 100% 65%)" }}
        ></div>
        <div 
          className="absolute inset-0 bg-[#e36d27]" 
          style={{ clipPath: "polygon(100% 66%, 86% 36%, 82% 36%, 100% 75%)" }}
        ></div>
      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-6 sm:py-10 text-center">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col items-center text-center w-full mt-12 sm:mt-20">
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
          
          {/* স্লোগান সেকশন: Aİ M (আই-এর মাথায় পানির ফোঁটার মতো কাস্টম ডিজাইন ড্রপ) */}
          <p className="text-[11px] sm:text-[15px] font-black text-[#006cb7] font-sans italic tracking-wide flex items-center justify-center gap-0.5">
            <span>A</span>
            <span className="relative inline-block text-[#cc1e29] font-serif not-italic font-black mx-[1px]">
              I
              {/* পানির ফোঁটার মতো ডট ইফেক্ট */}
              <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[7px] bg-[#cc1e29] rounded-b-full rounded-tl-full rotate-45"></span>
            </span>
            <span>M For Ultimate Success</span>
          </p>
        </div>

        {/* ভর্তি ফরম টাইটেল (মিডল সেকশন) */}
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

        {/* ফুটোর সেকশন (ঠিকানা ও সোশ্যাল মিডিয়া লিংক) */}
        <div className="w-full text-center mt-4 sm:mt-8 px-6 mb-8 sm:mb-12">
          <h4 className="text-base sm:text-xl font-extrabold text-[#cc1e29] tracking-wide mb-1">
            এইম ক্যাম্পাস, দক্ষিণ শ্যামলী আ/এ, হবিগঞ্জ-৩৩০০
          </h4>
          <p className="text-sm sm:text-lg font-black text-[#1b2d56] font-mono mb-3 tracking-wide">
            মোবাইল (অফিস): ০১৩১৬ ২০১ ২০১, ০১৭৪৮ Ramadan ৮৬৮ ১৬১
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
