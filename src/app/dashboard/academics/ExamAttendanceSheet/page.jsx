'use client';

import React, { useState } from 'react';

export default function ExamAttendanceSheet() {
    // হেডার ও মেটাডেটা
    const [metaData, setMetaData] = useState({
        className: 'প্লে',
        examName: 'প্রথম সাময়িক পরীক্ষা',
        englishYear: '২০২৬-২০২৬',
        hijriYear: '১৪৪৭ - ১৪৪৮',
    });

    // বিষয় ও পরীক্ষার তারিখ
    const [subjects, setSubjects] = useState([
        { id: 'sub_1', name: 'আরবি', date: '১০-০৫-২০২৬ ইং:' },
        { id: 'sub_2', name: 'ইংরেজি', date: '১৩-০৫-২০২৬ ইং:' },
        { id: 'sub_3', name: 'বাংলা', date: '১৮-০৫-২০২৬ ইং:' },
        { id: 'sub_4', name: 'গণিত', date: '২১-০৫-২০২৬ ইং:' },
    ]);

    // পরীক্ষার্থীদের তালিকা
    const [students, setStudents] = useState([
        { roll: '১', studentId: '৪২৯৬', studentName: 'আকিল বিন শফিক' },
        { roll: '২', studentId: '৪৩০৭', studentName: 'আব্দুল্লাহ বিন হিশাম' },
        { roll: '৩', studentId: '৪৩১৩', studentName: 'ফাতিমা আলেয়া' },
        { roll: '৪', studentId: '৪৩১৫', studentName: 'আব্দুল্লাহ আল গালিব খান' },
        { roll: '৫', studentId: '৪৩১৮', studentName: 'ফাতেমা জান্নাত' },
        { roll: '৬', studentId: '৪৩১৯', studentName: 'ফারহান আহমেদ লাবিদ' },
        { roll: '৭', studentId: '৪৩৩০', studentName: 'আহনাফ বিন আজাদ' },
        { roll: '৮', studentId: '৪৩৩১', studentName: 'মাহাথির রায়িয়ান চৌধুরী' },
        { roll: '৯', studentId: '৪৩৩২', studentName: 'আসাদুল্লাহ আন নূর' },
        { roll: '১০', studentId: '৪৩৩৭', studentName: 'আব্দুল্লাহ ইসলাম সাফওয়ান' },
        { roll: '১১', studentId: '৪৩৪১', studentName: 'মোঃ লাবিব তাহসিন' },
        { roll: '১২', studentId: '৪৩৪২', studentName: 'সুমাইয়া চৌধুরী' },
    ]);

    // প্রিন্ট ফাংশন
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-slate-100 min-h-screen p-2 sm:p-6 flex flex-col items-center">

            {/* Landscape Print Style Injector */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>

            {/* Action Buttons Bar (প্রিন্ট করার সময় এটি আসবে না) */}
            <div className="print:hidden w-full max-w-[1100px] mb-4 bg-white p-4 rounded-xl shadow-md flex justify-between items-center gap-4">
                <div className="text-sm font-semibold text-slate-700">
                    উপস্থিতি স্বাক্ষরপত্র শিট
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

                {/* Sub Header Meta Info */}
                <div className="text-center mb-2 font-semibold text-[15px] sm:text-[16px] tracking-wide text-gray-900">
                    শ্রেণি: <span className="font-bold">{metaData.className}</span> - {metaData.examName} {metaData.englishYear} ইং / {metaData.hijriYear} হি শিক্ষাবর্ষ
                </div>

                {/* Title */}
                <h2 className="text-center font-bold text-xl sm:text-2xl mb-4 text-black underline underline-offset-4 decoration-1">
                    উপস্থিতি স্বাক্ষরপত্র
                </h2>

                {/* Attendance Grid Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black text-xs sm:text-sm text-black">
                        <thead>
                            <tr className="bg-gray-200 print:bg-gray-200">
                                <th className="border border-black p-1.5 w-10 text-center font-bold">রোল</th>
                                <th className="border border-black p-1.5 w-16 text-center font-bold">আইডি</th>
                                <th className="border border-black p-1.5 min-w-[180px] text-center font-bold">পরীক্ষার্থীর নাম</th>

                                {/* Subject Headers */}
                                {subjects.map((sub) => (
                                    <th key={sub.id} className="border border-black p-1.5 text-center font-normal min-w-[140px]">
                                        <div className="font-bold text-[13px]">{sub.name}</div>
                                        <div className="text-[11px] text-gray-800">{sub.date}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={idx} className="h-10">
                                    {/* Roll */}
                                    <td className="border border-black px-1 text-center font-medium">
                                        {student.roll}
                                    </td>

                                    {/* ID */}
                                    <td className="border border-black px-1 text-center font-medium">
                                        {student.studentId}
                                    </td>

                                    {/* Student Name */}
                                    <td className="border border-black px-2 font-semibold text-left">
                                        {student.studentName}
                                    </td>

                                    {/* Blank signature boxes for students to sign manually */}
                                    {subjects.map((sub) => (
                                        <td
                                            key={sub.id}
                                            className="border border-black text-center bg-white"
                                        >
                                            {/* Blank Area for Signature */}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}