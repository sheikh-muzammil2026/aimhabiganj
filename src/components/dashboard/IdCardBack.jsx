"use client";
import React from 'react';

export const IdCardBack = () => {
    return (
        <div
            className="w-[2.125in] h-[3.375in] bg-white rounded-xl p-[3px] relative shadow-xl overflow-hidden mx-auto print:shadow-none print:break-inside-avoid"
            style={{
                border: '6px solid #0022C8', // মূল বাইরের নীল বর্ডার
                boxSizing: 'border-box',
            }}
        >
            <div className="w-full h-full bg-white rounded-lg flex flex-col justify-between relative overflow-hidden text-center border border-emerald-800/20">

                {/* ================= ১. মডার্ন প্রিমিয়াম হেডার (সেন্টার্ড গোল্ডেন ডিভাইডার) ================= */}
                <div className="w-full pt-2.5 pb-1 px-3 flex items-center justify-center gap-1.5">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#047857] to-[#D97706]"></div>
                    <span className="text-[#D97706] text-[8px] leading-none">☪</span>
                    <span className="text-[7.5px] font-bold tracking-widest text-[#047857] uppercase font-serif">
                        Rules & Notice
                    </span>
                    <span className="text-[#D97706] text-[8px] leading-none">☪</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#047857] to-[#D97706]"></div>
                </div>

                {/* ================= ২. মেইন টার্মস অ্যান্ড কন্ডিশনস ================= */}
                <div className="px-1.5 py-0.5 flex-1 flex flex-col justify-center space-y-1">
                    <p className="text-[7.5px] leading-tight font-serif font-normal text-black">
                        This card remains the property of
                    </p>
                    <p className="text-[8.5px] font-bold font-serif text-black leading-tight">
                        As-Salam Ideal Madrasah (AIM)
                    </p>
                    <p className="text-[7.5px] font-serif leading-tight font-normal text-black">
                        Not Transferable
                    </p>
                    <p className="text-[7px] leading-tight font-serif font-normal px-1 text-black">
                        This card identifies you as a student of
                    </p>
                    <p className="text-[8px] font-bold font-serif text-black leading-tight">
                        As-Salam Ideal Madrasah (AIM)
                    </p>
                    <p className="text-[7px] leading-tight font-serif font-normal text-black">
                        You must produce this card on demand
                    </p>
                    <p className="text-[7px] leading-tight font-serif font-normal text-black">
                        If you leave the institute you must return this card to the office of AIM
                    </p>

                    {/* হাইলাইটেড রিকোভারি নোটিশ */}
                    <div
                        className="mt-0.5 py-0.5 px-1 rounded text-[7.5px] font-bold text-red-600 border border-emerald-200"
                        style={{
                            backgroundColor: '#ECFDF5',
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact',
                        }}
                    >
                        If Found, Please Return to the Office of
                    </div>

                    <p className="text-[8.5px] font-bold font-serif text-black leading-none mt-0.5">
                        As-Salam Ideal Madrasah (AIM)
                    </p>

                    {/* ঠিকানা ও যোগাযোগ */}
                    <div className="text-[7.5px] font-serif leading-snug text-black mt-0.5">
                        <p className="font-normal text-gray-900">Holding No: 4577-03</p>
                        <p className="font-normal text-gray-900">South Shaymoli R/A</p>
                        <p className="font-normal text-gray-900">Habiganj-3300</p>
                        <p className="font-bold tracking-wider font-mono text-[8px] mt-0.5 text-black">
                            01316-209-201
                        </p>
                        <p className="font-bold tracking-wider font-mono text-[8px] text-black">
                            01748-868-161
                        </p>
                    </div>

                    {/* সোশ্যাল মিডিয়া ও ওয়েব ফুটলাইন লিংক (ডার্কার অ্যান্ড ক্লিয়ার টেক্সট) */}
                    <div className="pt-1 border-t border-gray-300 grid grid-cols-2 gap-x-1 gap-y-0.5 font-sans w-full px-0.5">
                        <div className="flex items-center justify-center gap-0.5 text-[6.5px]">
                            <span className="text-blue-600 font-bold">f</span>
                            <span className="truncate font-medium">aimhabiganj</span>
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-[6.5px]">
                            <span className="text-red-600 font-bold">▶</span>
                            <span className="truncate font-medium">aimhabiganj</span>
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-[6.5px]">
                            <span className="text-emerald-600 font-bold">🌐</span>
                            <span className="truncate font-medium">www.aimhabiganj.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-[5.5px] leading-tight">
                            <span className="text-red-500 font-bold text-[6.5px]">✉</span>
                            <span className="break-all font-medium">aimhabiganj@gmail.com</span>
                        </div>
                    </div>
                </div>

                {/* ================= ৩. মিনিমাল ইমারাল্ড ও গোল্ড ফুটলাইন ================= */}
                <div
                    className="w-full h-2.5 flex items-center justify-center relative overflow-hidden"
                    style={{
                        backgroundColor: '#047857',
                        borderTop: '1.5px solid #D97706',
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact',
                    }}
                >
                    <div className="w-10 h-[1px] bg-amber-300 opacity-90 rounded-full"></div>
                </div>

            </div>
        </div>
    );
};