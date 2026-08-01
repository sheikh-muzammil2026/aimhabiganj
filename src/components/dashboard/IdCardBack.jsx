"use client";
import React from 'react';
// import { FaFacebook, FaYoutube, FaGlobe, FaEnvelope } from 'react-icons/fa'; // react-icons না থাকলে সাধারণ SVG বা span ব্যবহার করতে পারেন

export const IdCardBack = () => {
    return (
        <div
            className="w-[2.125in] h-[3.375in] bg-white rounded-xl p-[3px] relative shadow-xl overflow-hidden mx-auto print:shadow-none print:break-inside-avoid"
            style={{
                border: '6px solid #0022C8',
                boxSizing: 'border-box',
            }}
        >
            <div
                className="w-full h-full bg-white rounded-lg flex flex-col justify-between relative overflow-hidden text-center"
                style={{ border: '2px solid #1E40AF' }}
            >
                {/* ================= ১. হেডার ওয়েভ / নীল বার সেকশন ================= */}
                <div
                    className="w-full h-7 bg-[#0022C8] flex flex-col items-center justify-center p-1"
                    style={{
                        backgroundColor: '#0022C8',
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact',
                    }}
                >
                    {/* হেডারের কার্ভ ট্রিপল লাইন (ছবি অনুযায়ী) */}
                    <div className="w-full border-t border-b border-white h-2 flex flex-col justify-between py-[1px]">
                        <div className="w-full border-t border-white opacity-80"></div>
                    </div>
                </div>

                {/* ================= ২. মেইন টার্মস অ্যান্ড কন্ডিশনস ================= */}
                <div className="px-2 py-1 flex-1 flex flex-col justify-center space-y-1 text-gray-800">
                    <p className="text-[7.5px] leading-tight font-serif">
                        This card remains the property of
                    </p>
                    <p className="text-[8.5px] font-bold font-serif text-black leading-tight">
                        As-Salam Ideal Madrasah (AIM)
                    </p>
                    <p className="text-[7.5px] font-semibold font-serif leading-tight">
                        Not Transferable
                    </p>
                    <p className="text-[7px] leading-tight font-serif px-1">
                        This card identifies you as a student of
                    </p>
                    <p className="text-[8px] font-bold font-serif text-black leading-tight">
                        As-Salam Ideal Madrasah (AIM)
                    </p>
                    <p className="text-[7px] leading-tight font-serif">
                        You must produce this card on demand
                    </p>
                    <p className="text-[7px] leading-tight font-serif">
                        If you leave the institute you must return this card to the office of AIM
                    </p>

                    {/* হাইলাইটেড রিকোভারি নোটিশ */}
                    <div
                        className="mt-1 py-0.5 px-1 bg-cyan-100 rounded text-[7.5px] font-bold text-red-600 print:bg-cyan-100"
                        style={{
                            backgroundColor: '#CFFAFE',
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
                    <div className="text-[7.5px] font-serif leading-snug text-gray-900 mt-0.5">
                        <p className="font-medium">Holding No: 4577-03</p>
                        <p className="font-medium">South Shaymoli R/A</p>
                        <p className="font-medium">Habiganj-3300</p>
                        <p className="font-bold tracking-wider font-mono text-[8px] mt-0.5 text-black">
                            01316-209-201
                        </p>
                        <p className="font-bold tracking-wider font-mono text-[8px] text-black">
                            01748-868-161
                        </p>
                    </div>

                    {/* সোশ্যাল মিডিয়া ও ওয়েব ফুটলাইন লিংক */}
                    <div className="pt-1 border-t border-gray-200 grid grid-cols-2 gap-x-1 gap-y-0.5 text-[6.5px] font-sans text-gray-700 items-center justify-center text-left px-1">
                        <div className="flex items-center gap-0.5 truncate">
                            <span className="text-blue-600 font-bold">f</span>
                            <span className="truncate">aimhabiganj</span>
                        </div>
                        <div className="flex items-center gap-0.5 truncate">
                            <span className="text-red-600 font-bold">▶</span>
                            <span className="truncate">aimhabiganj</span>
                        </div>
                        <div className="flex items-center gap-0.5 truncate">
                            <span className="text-blue-500 font-bold">🌐</span>
                            <span className="truncate">www.aimhabiganj.com</span>
                        </div>
                        <div className="flex items-center gap-0.5 truncate">
                            <span className="text-red-500 font-bold">✉</span>
                            <span className="truncate">aimhabiganj@gmail.com</span>
                        </div>
                    </div>
                </div>

                {/* ================= ৩. ফুটলাইন সফটওয়্যার ক্রেডিট ================= */}
                <div
                    className="bg-[#0022C8] text-white text-center py-0.5 px-1"
                    style={{
                        backgroundColor: '#0022C8',
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact',
                    }}
                >
                    <p className="text-[6px] font-sans font-medium tracking-tight">
                        Software developed by: GreenBangla21. Phone: +880 1720 646498
                    </p>
                </div>
            </div>
        </div>
    );
};