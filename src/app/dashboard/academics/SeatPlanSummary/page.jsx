'use client';

import React, { useState } from 'react';

export default function SeatPlanSummary() {
    // সিট প্ল্যানের শিরোনাম ও সাল
    const [year, setYear] = useState('২০২৬');
    const [hallName, setHallName] = useState('হল নং - ১');
    const [printDate, setPrintDate] = useState('22-08-2026 07:26:53pm');

    // শ্রেণি অনুযায়ী মোট পরীক্ষার্থীর ডাটা তালিকা
    const [seatData, setSeatData] = useState([
        { id: 1, class: 'প্রথম', totalStudents: '৫', remarks: '' },
        { id: 2, class: 'দ্বিতীয়', totalStudents: '৭', remarks: '' },
        { id: 3, class: 'তৃতীয়', totalStudents: '৩', remarks: '' },
        { id: 4, class: 'চতুর্থ', totalStudents: '১', remarks: '' },
        { id: 5, class: 'পঞ্চম', totalStudents: '০', remarks: '' },
        { id: 6, class: 'ষষ্ঠ', totalStudents: '০', remarks: '' },
        { id: 7, class: 'সপ্তম', totalStudents: '০', remarks: '' },
        { id: 8, class: 'অষ্টম', totalStudents: '০', remarks: '' },
        { id: 9, class: 'প্লে', totalStudents: '০', remarks: '' },
        { id: 10, class: 'নার্সারি', totalStudents: '০', remarks: '' },
    ]);

    // প্রিন্ট ফাংশন
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-slate-100 min-h-screen p-2 sm:p-6 flex flex-col items-center">

            {/* Print Style Injector */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: portrait;
                        margin: 10mm;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>

            {/* Action Buttons Bar (প্রিন্ট করার সময় প্রদর্শিত হবে না) */}
            <div className="print:hidden w-full max-w-[1100px] mb-4 bg-white p-4 rounded-xl shadow-md flex justify-between items-center gap-4">
                <div className="text-sm font-semibold text-slate-700">
                    সিট প্ল্যান সামারি
                </div>
                <div>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow flex items-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        প্রিন্ট করুন
                    </button>
                </div>
            </div>

            {/* Main Printable Container */}
            <div className="bg-white text-black p-6 rounded-sm shadow-xl w-full max-w-[1150px] border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">

                {/* Header Section (Logo + Banner) */}
                <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                    {/* Logo on Left */}
                    <div className="w-[130px] h-[100px] relative flex-shrink-0">
                        <img
                            src="/aimlogo1.png"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Banner / Institution Info on Right */}
                    <div className="flex-grow flex justify-end items-center">
                        <img
                            src="/banner.png"
                            alt="Institution Banner"
                            className="max-h-[100px] object-contain"
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center font-bold text-xl sm:text-2xl mt-4 mb-2 text-black">
                    সিট প্ল্যান - {year}
                </h2>

                {/* Print Timestamp on Right */}
                <div className="text-right text-[11px] sm:text-xs text-gray-700 mb-1">
                    {printDate}
                </div>

                {/* Main Table Structure */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black text-xs sm:text-sm text-black">
                        <thead>
                            {/* Hall Name Row */}
                            <tr className="bg-gray-200 print:bg-gray-200">
                                <th colSpan={3} className="border border-black p-2 text-center font-bold text-sm sm:text-base">
                                    {hallName}
                                </th>
                            </tr>
                            {/* Sub Headers */}
                            <tr className="bg-gray-100 print:bg-gray-100">
                                <th className="border border-black p-1.5 w-1/4 text-center font-bold">শ্রেণি</th>
                                <th className="border border-black p-1.5 w-2/5 text-center font-bold">মোট পরীক্ষার্থী</th>

                            </tr>
                        </thead>

                        <tbody>
                            {seatData.map((row) => (
                                <tr key={row.id} className="h-8">
                                    {/* Class Name */}
                                    <td className="border border-black px-2 text-center font-semibold">
                                        {row.class}
                                    </td>

                                    {/* Total Students */}
                                    <td className="border border-black px-2 text-center font-medium">
                                        {row.totalStudents}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}