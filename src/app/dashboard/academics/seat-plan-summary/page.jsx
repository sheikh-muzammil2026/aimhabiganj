'use client';

import React, { useState, useEffect } from 'react';

export default function SeatPlanSummary() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedData, setGroupedData] = useState({});
    const [selectedHall, setSelectedHall] = useState('');
    const [year, setYear] = useState('২০২৬');
    const [printDate, setPrintDate] = useState('');

    // শ্রেণি অনুযায়ী ডাটা তালিকা
    const classesList = [
        'প্রথম',
        'দ্বিতীয়',
        'তৃতীয়',
        'চতুর্থ',
        'পঞ্চম',
        'ষষ্ঠ',
        'সপ্তম',
        'অষ্টম',
        'প্লে',
        'নার্সারি',
        'কায়দা/আমপারা',
        'নাজেরা',
        'সবক',
        'শুনানি'
    ];

    // প্রিন্ট ডেট ফরম্যাট করার হেলপার
    const formatPrintDate = () => {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // hour '0' matches '12'
        const strTime = `${hours}:${minutes}:${seconds}${ampm}`;
        return `${day}-${month}-${year} ${strTime}`;
    };

    // হল নাম ফরম্যাট করার হেলপার (১ -> হল নং - ১)
    const formatHallName = (name) => {
        if (!name) return "হল নাম বিহীন";
        const bengaliDigits = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
        if (/^\d+$/.test(name)) {
            const bnNum = name.split('').map(d => bengaliDigits[d] || d).join('');
            return `হল নং - ${bnNum}`;
        }
        return name;
    };

    // বানানের তারতম্য সত্ত্বেও শ্রেণির সংখ্যা ম্যাচ করার হেলপার
    const getCountForClass = (classCounts, className) => {
        if (!classCounts) return 0;
        if (classCounts[className] !== undefined) {
            return classCounts[className];
        }
        // বানান নরমালাইজ করা (যেমন: দ্বিতীয় বনাম দ্বিতীয়)
        const normalize = (str) => str.replace(/ী/g, 'ি').replace(/তৃ/g, 'তৃ');
        const normalizedName = normalize(className);
        for (const key of Object.keys(classCounts)) {
            if (normalize(key) === normalizedName) {
                return classCounts[key];
            }
        }
        return 0;
    };

    useEffect(() => {
        setPrintDate(formatPrintDate());
        fetchSeatPlanSummary();
    }, []);

    const fetchSeatPlanSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/seat-plans/summary`);
            const result = await response.json();

            if (result.success && result.data) {
                setGroupedData(result.data);
                const halls = Object.keys(result.data).sort((a, b) => {
                    const numA = parseInt(a, 10);
                    const numB = parseInt(b, 10);
                    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                    return a.localeCompare(b);
                });
                if (halls.length > 0) {
                    setSelectedHall(halls[0]);
                }
            } else {
                setError(result.message || 'সিট প্ল্যানের তথ্য পাওয়া যায়নি।');
            }
        } catch (err) {
            console.error('Error fetching seat plan summary:', err);
            setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
        } finally {
            setLoading(false);
        }
    };

    // প্রিন্ট ফাংশন
    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-slate-700 font-semibold">তথ্য লোড হচ্ছে...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
                    <span className="text-red-500 text-4xl">⚠️</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">ত্রুটি ঘটেছে</h3>
                    <p className="text-slate-600 mt-1">{error}</p>
                    <button
                        onClick={fetchSeatPlanSummary}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        আবার চেষ্টা করুন
                    </button>
                </div>
            </div>
        );
    }

    const halls = Object.keys(groupedData).sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });

    if (halls.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
                    <span className="text-amber-500 text-4xl">📭</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">কোনো ডাটা নেই</h3>
                    <p className="text-slate-600 mt-1">বর্তমানে কোনো শিক্ষার্থীর সিট প্ল্যান বরাদ্দ করা নেই।</p>
                </div>
            </div>
        );
    }

    const activeCounts = groupedData[selectedHall] || {};
    const formattedHallNameStr = formatHallName(selectedHall);

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
            <div className="print:hidden w-full max-w-[1100px] mb-4 bg-white p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-slate-700">
                        সিট প্ল্যান সামারি
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block">হল নির্বাচন করুন:</label>
                        <select
                            value={selectedHall}
                            onChange={(e) => setSelectedHall(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium cursor-pointer"
                        >
                            {halls.map((hall) => (
                                <option key={hall} value={hall}>
                                    {formatHallName(hall)}
                                </option>
                            ))}
                        </select>
                    </div>
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
                                <th colSpan={2} className="border border-black p-2 text-center font-bold text-sm sm:text-base">
                                    {formattedHallNameStr}
                                </th>
                            </tr>
                            {/* Sub Headers */}
                            <tr className="bg-gray-100 print:bg-gray-100">
                                <th className="border border-black p-1.5 w-1/2 text-center font-bold">শ্রেণি</th>
                                <th className="border border-black p-1.5 w-1/2 text-center font-bold">মোট পরীক্ষার্থী</th>
                            </tr>
                        </thead>

                        <tbody>
                            {classesList.map((cls, idx) => {
                                const totalCount = getCountForClass(activeCounts, cls);
                                return (
                                    <tr key={idx} className="h-8">
                                        {/* Class Name */}
                                        <td className="border border-black px-2 text-center font-semibold">
                                            {cls}
                                        </td>

                                        {/* Total Students */}
                                        <td className="border border-black px-2 text-center font-medium">
                                            {totalCount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
