'use client';

import React from 'react';

export default function StudentIdCard({ student }) {
  // ছবির মতো ডামি বা ব্যাকএন্ড থেকে আসা ডাটা
  const data = student || {
    name: 'Asadullah An Nur',
    fatherName: 'Md Arshad Ali',
    session: '2026',
    division: 'Pre-Primary',
    dob: '27-07-2022',
    mobile: '01734408082',
    bloodGroup: '',
    idNo: 'AIM 0 4332',
    photoUrl: '/student-photo.jpg', // আপনার ছবি অনুযায়ী পাথ দিন
    logoUrl: '/logo.png', // মাদরাসার লোগো
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* আইডি কার্ড এর মেইন কন্টেইনার (A4 গ্রিড ও ডায়মেনশন রেডি) */}
      <div 
        className="w-[340px] h-[520px] bg-white rounded-2xl p-[6px] relative shadow-xl overflow-hidden print:break-inside-avoid"
        style={{
          border: '12px solid #0022C8', // বাইরের থিক ব্লু বর্ডার
          boxSizing: 'border-box'
        }}
      >
        {/* ইনার লাইট ব্লু বর্ডার কন্টেইনার */}
        <div 
          className="w-full h-full bg-white rounded-lg flex flex-col justify-between relative overflow-hidden"
          style={{ border: '2px solid #1E40AF' }}
        >
          
          {/* ================= ১. হেডার সেকশন ================= */}
          <div className="w-full pt-2 px-2 pb-1 border-b-2 border-[#0022C8] flex items-center gap-1">
            {/* লোগো */}
            <div className="w-14 h-14 rounded-full border border-blue-900 p-0.5 flex-shrink-0 flex items-center justify-center bg-white">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-900 text-center">
                  LOGO
                </div>
              )}
            </div>

            {/* হেডার টেক্সটসমূহ */}
            <div className="flex-1 text-center">
              <h2 className="text-[13px] font-extrabold text-blue-950 font-serif leading-none tracking-tight">
                مدرسة السلام النموذجية
              </h2>
              <h1 className="text-[14px] font-extrabold text-black font-sans leading-tight mt-0.5">
                আস-সালাম আইডিয়াল মাদ্রাসা <span className="text-xs font-semibold">(এইম)</span>
              </h1>
              <h3 className="text-[13px] font-black text-[#D00000] leading-none font-sans">
                As-Salam Ideal Madrasah
              </h3>
              <p className="text-[8px] font-extrabold text-[#008080] tracking-tighter mt-0.5">
                A&amp;M For Ultimate Success
              </p>
            </div>
          </div>

          {/* ================= ২. মিডল সেকশন (ছবি, আইডি নম্বর ও বারকোড) ================= */}
          <div className="flex justify-between items-center px-2 pt-2 relative">
            
            {/* ছাত্রের প্রোফাইল পিকচার */}
            <div className="w-[155px] h-[155px] rounded-full border-4 border-[#38BDF8] overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner ml-1">
              {data.photoUrl ? (
                <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>

            {/* ভার্টিক্যাল আইডি টেক্সট ও বারকোড ব্লক */}
            <div className="flex items-center gap-1.5 pr-1">
              
              {/* ID CARD এবং ID NO (৯০ ডিগ্রি ঘোরানো) */}
              <div className="flex flex-col items-center justify-center transform -rotate-90 origin-center whitespace-nowrap -mr-3">
                <span className="text-[18px] font-black text-[#B00070] tracking-wider">
                  ID CARD
                </span>
                <span className="text-[13px] font-black text-[#0022C8] tracking-tight">
                  ID NO-{data.idNo}
                </span>
              </div>

              {/* সিএসএস উইথিন বারকোড প্রিভিউ */}
              <div className="w-8 h-36 bg-white flex flex-col justify-between p-1 items-center border border-gray-200">
                {/* ডাইনামিক ফিল্ড ছাড়া হুবহু বারকোড ইমেজের মতো লাইন স্ট্রিপ */}
                <div className="w-full h-[2px] bg-black"></div>
                <div className="w-full h-[4px] bg-black"></div>
                <div className="w-full h-[1px] bg-black"></div>
                <div className="w-full h-[3px] bg-black"></div>
                <div className="w-full h-[5px] bg-black"></div>
                <div className="w-full h-[1px] bg-black"></div>
                <div className="w-full h-[3px] bg-black"></div>
                <div className="w-full h-[2px] bg-black"></div>
                <div className="w-full h-[6px] bg-black"></div>
                <div className="w-full h-[1px] bg-black"></div>
                <div className="w-full h-[4px] bg-black"></div>
                <div className="w-full h-[2px] bg-black"></div>
                <div className="w-full h-[3px] bg-black"></div>
                <div className="w-full h-[5px] bg-black"></div>
                <div className="w-full h-[1px] bg-black"></div>
                <div className="w-full h-[4px] bg-black"></div>
                <div className="w-full h-[2px] bg-black"></div>
              </div>

            </div>
          </div>

          {/* ================= ৩. ইনফরমেশন সেকশন ================= */}
          <div className="px-3 pt-1 pb-2 flex-1 flex flex-col justify-around">
            
            {/* ছাত্রের নাম */}
            <h2 className="text-[20px] font-black text-black font-serif tracking-normal leading-tight">
              {data.name}
            </h2>

            {/* ফিল্ড লিস্ট */}
            <div className="space-y-[2px] text-[15px] font-serif">
              
              {/* Father */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">Father</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1 truncate">{data.fatherName}</span>
              </div>

              {/* Ad.Session */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">Ad.Session</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1">{data.session}</span>
              </div>

              {/* Division */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">Division</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1">{data.division}</span>
              </div>

              {/* D.O.B */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">D.O.B</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1">{data.dob}</span>
              </div>

              {/* Mobile */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">Mobile</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1">{data.mobile}</span>
              </div>

              {/* Blood Group */}
              <div className="flex items-center">
                <span className="w-[100px] font-bold text-[#A0006D]">Blood Group</span>
                <span className="font-bold text-[#A0006D] mr-2">:</span>
                <span className="font-semibold text-black flex-1">{data.bloodGroup}</span>
              </div>

            </div>
          </div>

          {/* ================= ৪. ফুটার ও স্বাক্ষর সেকশন ================= */}
          <div className="w-full relative mt-auto">
            
            {/* প্রিন্সিপাল স্বাক্ষর প্রিভিউ */}
            <div className="absolute right-3 -top-6 text-right z-10">
              {/* হাতের সাইনের স্টাইলিশ কাল্পনিক টেক্সট/SVG */}
              <span className="font-serif italic text-xs font-bold text-black border-b border-black px-1 block transform -rotate-6">
                Principal
              </span>
            </div>

            {/* ব্লু ফুটার বার */}
            <div className="bg-[#0022C8] text-white text-right px-3 py-0.5">
              <p className="text-[10px] font-sans font-medium tracking-wide">
                Authorized Signature
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
