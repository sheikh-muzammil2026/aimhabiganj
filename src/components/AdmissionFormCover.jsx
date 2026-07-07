// components/AdmissionFormCover.jsx
"use client";

import React from "react";

export default function AdmissionFormCover({ formData, handleChange }) {
  return (
    <div className="w-full aspect-[1/1.414] md:w-[8.27in] md:h-[11.69in] bg-[#fdfdfd] p-6 sm:p-12 flex flex-col justify-between box-border relative font-bengali print:w-full print:h-screen print:p-12 overflow-hidden select-none">
      
      {/* ================= BACKGROUND GEOMETRIC SHAPES (ছবি অনুযায়ী কাস্টম ডিজাইন) ================= */}
      {/* শীর্ষ বামের কোণার ডিজাইন */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[25%] bg-[#221f20] transform -rotate-45 origin-top-left"></div>
        <div className="absolute top-4 left-0 w-full h-[20%] bg-[#d96b27] transform -rotate-45 origin-top-left"></div>
        <div className="absolute top-10 left-0 w-full h-[10%] bg-[#221f20] transform -rotate-45 origin-top-left"></div>
      </div>

      {/* নিচের ডানের কোণার ডিজাইন */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 pointer-events-none z-0">
        <div className="absolute bottom-0 right-0 w-full h-[25%] bg-[#221f20] transform rotate-45 origin-bottom-right"></div>
        <div className="absolute bottom-4 right-0 w-full h-[20%] bg-[#d96b27] transform rotate-45 origin-bottom-right"></div>
        <div className="absolute bottom-10 right-0 w-full h-[10%] bg-[#221f20] transform rotate-45 origin-bottom-right"></div>
      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="z-10 flex flex-col items-center justify-between h-full flex-1 py-4">
        
        {/* লোগো এবং মাদরাসার নাম (হেডার সেকশন) */}
        <div className="flex flex-col items-center text-center w-full mt-4 sm:mt-6">
          {/* বৃত্তাকার মনোগ্রাম/লোগো বর্ডার */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#1d2b59] rounded-full flex items-center justify-center bg-white mb-3 p-1 shadow-md relative">
            <div className="w-full h-full rounded-full border border-dashed border-[#d96b27] flex flex-col items-center justify-center p-1">
              {/* লোগো টেক্সট রিপ্রেজেন্টেশন (এখানে আসল ইমেজ ইমপোর্ট করতে পারেন) */}
              <span className="text-[9px] sm:text-[11px] font-bold text-[#1d2b59] leading-tight">AIM</span>
              <span className="text-[7px] sm:text-[9px] text-[#d96b27] font-mono">Founded 2018</span>
            </div>
          </div>

          {/* আরবী নাম */}
          <h3 className="text-lg sm:text-2xl font-semibold text-[#1d2b59] tracking-wide font-serif mb-1">
            مدرسة السلام النموذجية
          </h3>
          {/* বাংলা নাম (গাঢ় লাল/মেরুন শেড) */}
          <h1 className="text-xl sm:text-3xl font-bold text-[#b62029] tracking-wide mb-1">
            আস-সালাম আইডিয়াল মাদরাসা <span className="text-sm sm:text-lg font-normal">(এইম)</span>
          </h1>
          {/* ইংরেজি নাম */}
          <h2 className="text-lg sm:text-2xl font-black text-[#221f20] font-sans tracking-tight mb-1">
            As-Salam Ideal Madrasah
          </h2>
          {/* মটো/স্লোগান */}
          <p className="text-[10px] sm:text-sm font-bold text-[#0070b8] font-sans italic tracking-wide">
            A<span className="text-[#b62029]">&</span>M For Ultimate Success
          </p>
        </div>

        {/* ভর্তি ফরম টাইটেল (ছবিতে থাকা গ্রাঞ্জি ব্রাশ আর্ট ইফেক্ট টেক্সট) */}
        <div className="my-6 sm:my-10 text-center w-full flex justify-center">
          <div className="relative px-8 py-2 sm:px-12 sm:py-3 bg-[#1c55a2] text-white font-bold text-xl sm:text-3xl rounded-md shadow-md tracking-wider">
            {/* ব্রাশ ইফেক্ট এর বিকল্প সিএসএস ফিল */}
            <span className="relative z-10 font-black tracking-widest px-2 drop-shadow-md">ভর্তি ফরম</span>
            <div className="absolute inset-0 bg-[#1c55a2] transform -skew-x-12 rounded-sm -z-0"></div>
            <div className="absolute -inset-1 border border-[#1c55a2]/30 rounded-md -z-1"></div>
          </div>
        </div>

        {/* ইনপুট ডাটা ফিল্ডসমূহ (ডটেড লাইন রেডিমেড লেআউট) */}
        <div className="w-full max-w-xl px-4 sm:px-8 space-y-4 sm:space-y-6 text-left">
          <div className="flex items-end gap-2 text-sm sm:text-lg">
            <span className="font-bold text-[#221f20] whitespace-nowrap">শিক্ষার্থীর নাম :</span>
            <input 
              type="text" 
              name="studentNameBangla" 
              value={formData.studentNameBangla || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-600 focus:outline-none focus:border-[#1c55a2] bg-transparent font-semibold text-gray-800 px-2 pb-0.5" 
            />
          </div>

          <div className="flex items-end gap-2 text-sm sm:text-lg">
            <span className="font-bold text-[#221f20] whitespace-nowrap">অভিভাবকের নাম :</span>
            <input 
              type="text" 
              name="guardianNameCover" 
              value={formData.guardianNameCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-600 focus:outline-none focus:border-[#1c55a2] bg-transparent font-semibold text-gray-800 px-2 pb-0.5" 
            />
          </div>

          <div className="flex items-end gap-2 text-sm sm:text-lg">
            <span className="font-bold text-[#221f20] whitespace-nowrap">আইডি নম্বর :</span>
            <input 
              type="text" 
              name="idNumberCover" 
              value={formData.idNumberCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-600 focus:outline-none focus:border-[#1c55a2] bg-transparent font-mono text-gray-800 px-2 pb-0.5" 
            />
          </div>

          <div className="flex items-end gap-2 text-sm sm:text-lg">
            <span className="font-bold text-[#221f20] whitespace-nowrap">মোবাইল নম্বর :</span>
            <input 
              type="text" 
              name="mobileNumberCover" 
              value={formData.mobileNumberCover || ""} 
              onChange={handleChange} 
              className="flex-1 border-b-2 border-dotted border-gray-600 focus:outline-none focus:border-[#1c55a2] bg-transparent font-mono tracking-widest text-gray-800 px-2 pb-0.5" 
            />
          </div>
        </div>

        {/* বটম সেকশন: মূল ঠিকানা ও যোগাযোগের বিস্তারিত */}
        <div className="w-full text-center mt-6 px-4">
          {/* গাঢ় লাল ঠিকানার টেক্সট */}
          <h4 className="text-sm sm:text-lg font-bold text-[#b62029] mb-1">
            এইম ক্যাম্পাস, দক্ষিণ শ্যামলী আ/এ, হবিগঞ্জ-৩৩০০
          </h4>
          {/* গাঢ় নীল ফোন নম্বর */}
          <p className="text-xs sm:text-base font-bold text-[#1d2b59] font-mono mb-2">
            মোবাইল (অফিস): ০১৩১৬ ২০১ ২০১, ০১৭৪৮ ৮৬৮ ১৬১
          </p>

          {/* সোশ্যাল ও ওয়েব আইকন ইনফো গ্রিড */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1 text-[10px] sm:text-xs text-gray-700 font-medium pt-2 border-t border-gray-200 w-full max-w-md mx-auto">
            <span className="flex items-center gap-1">🌐 www.aimhabiganj.com</span>
            <span className="flex items-center gap-1">✉️ aimhabiganj@gmail.com</span>
            <span className="flex items-center gap-1"> Facebook: aim habiganj</span>
            <span className="flex items-center gap-1"> YouTube: aimhabiganj</span>
          </div>
        </div>

      </div>

    </div>
  );
}
