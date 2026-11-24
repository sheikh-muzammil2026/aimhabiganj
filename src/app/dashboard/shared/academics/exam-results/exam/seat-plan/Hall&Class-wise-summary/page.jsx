/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import siteConfig from '@/config/siteConfig';
import { toBengaliDigits } from '@/lib/studentUtils';
import { formatAcademicYear } from '@/lib/academicYear';

const SUMMARY_PAGE_STYLE = `
    @media print {
        @page {
            size: A4 portrait;
            margin: 10mm;
        }
        html, body {
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: 'Bornomala', 'Ubuntu Sans', sans-serif !important;
        }
        .summary-print-area {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
        }
        table {
            width: 100% !important;
            border-collapse: collapse !important;
        }
        tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
    }
`;

const API_BASE_URL = (
    process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:5000'
).replace(/\/$/, '');

const DEFAULT_ACADEMIC_YEAR = toBengaliDigits(
    formatAcademicYear(
        siteConfig.academicSession?.currentBn ||
        siteConfig.academicSession?.currentEn ||
        '২০২৬'
    ) || '২০২৬'
);

const normalizeYearDisplay = (val) => {
    if (!val || typeof val === 'object') return '';
    const cleaned = formatAcademicYear(val);
    return cleaned ? toBengaliDigits(cleaned) : '';
};

// শ্রেণি অনুযায়ী ডাটা তালিকা (প্লে থেকে হিফজ পর্যন্ত নিখুঁত ক্রম)
const CLASSES_LIST = [
    'প্লে',
    'নার্সারি',
    'প্রথম',
    'দ্বিতীয়',
    'তৃতীয়',
    'চতুর্থ',
    'পঞ্চম',
    'ষষ্ঠ',
    'সপ্তম',
    'অষ্টম',
    'নবম',
    'দশম',
    'কায়দা/আমপারা',
    'নাজেরা',
    'সবক',
    'হিফজ',
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
    hours = hours ? hours : 12;
    const strTime = `${hours}:${minutes}:${seconds}${ampm}`;
    return `${day}-${month}-${year} ${strTime}`;
};

// হল নাম ফরম্যাট করার হেলপার (১ -> হল নং ১ — নিচ তলার নার্সারির রুম)
const formatHallName = (name) => {
    if (!name && name !== 0) return "হল নাম বিহীন";
    const str = String(name).trim();
    if (str === '1') return "হল নং ১ — নিচ তলার নার্সারির রুম (Ground Floor, Nursery Room)";
    if (str === '2') return "হল নং ২ — ২য় তলার থ্রির রুম (2nd Floor, Class Three Room)";
    if (str === '3') return "হল নং ৩ — ২য় তলার ক্লাস টু এর রুম (2nd Floor, Class Two Room)";
    if (str === '4') return "হল নং ৪ — ৩য় তলায় হিফজ বিভাগের ক্লাস রুম (3rd Floor, Hifz Room)";
    if (/^\d+$/.test(str)) {
        return `হল নং - ${toBengaliDigits(str)}`;
    }
    return str;
};

// ড্রপডাউনের জন্য সংক্ষিপ্ত নাম
const formatHallOption = (name) => {
    if (!name && name !== 0) return "হল নাম বিহীন";
    const str = String(name).trim();
    if (str === '1') return "হল নং ১ (নিচ তলা - নার্সারি)";
    if (str === '2') return "হল নং ২ (২য় তলা - ক্লাস থ্রি)";
    if (str === '3') return "হল নং ৩ (২য় তলা - ক্লাস টু)";
    if (str === '4') return "হল নং ৪ (৩য় তলা - হিফজ বিভাগ)";
    return `হল নং ${toBengaliDigits(str)}`;
};

// বানানের তারতম্য সত্ত্বেও শ্রেণির সংখ্যা ম্যাচ করার হেলপার
const getCountForClass = (classCounts, className) => {
    if (!classCounts) return 0;

    const normalize = (str) => {
        if (!str) return '';
        return String(str)
            .normalize('NFC')
            .replace(/ী/g, 'ি')
            .replace(/ূ/g, 'ু')
            .replace(/তৃ/g, 'তৃ')
            .replace(/\s+/g, '')
            .trim();
    };

    const normalizedName = normalize(className);
    for (const key of Object.keys(classCounts)) {
        if (normalize(key) === normalizedName) {
            return Number(classCounts[key]) || 0;
        }
    }
    return 0;
};

export default function SeatPlanSummary() {
    const printAreaRef = useRef(null);
    const requestSeqRef = useRef(0);
    const [isPrinting, setIsPrinting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedData, setGroupedData] = useState({});
    const [selectedHall, setSelectedHall] = useState('');
    const [year, setYear] = useState(DEFAULT_ACADEMIC_YEAR);
    const [selectedYear, setSelectedYear] = useState('');
    const [availableYears, setAvailableYears] = useState([DEFAULT_ACADEMIC_YEAR]);
    const [printDate] = useState(formatPrintDate);

    const fetchSeatPlanSummary = useCallback(async () => {
        const requestId = ++requestSeqRef.current;
        try {
            setLoading(true);
            setError(null);

            const queryStr = selectedYear
                ? `?year=${encodeURIComponent(selectedYear)}`
                : '';

            // aim-server API থেকে হল ও শ্রেণিভিত্তিক সামারি লোড
            const response = await fetch(`${API_BASE_URL}/api/seat-plans/summary${queryStr}`, {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache" }
            });
            const result = response.ok ? await response.json() : null;

            if (requestId !== requestSeqRef.current) return;

            if (result && result.success && result.data) {
                const serverYears = Array.isArray(result.years)
                    ? Array.from(
                        new Set(result.years.map(normalizeYearDisplay).filter(Boolean))
                    )
                    : [];
                const serverAcademicYear =
                    normalizeYearDisplay(result.academicYear) ||
                    serverYears[0] ||
                    DEFAULT_ACADEMIC_YEAR;

                const mergedYears = serverYears.length > 0
                    ? (serverYears.includes(serverAcademicYear) ? serverYears : [serverAcademicYear, ...serverYears])
                    : [serverAcademicYear];

                setAvailableYears(mergedYears);
                setYear(selectedYear || serverAcademicYear);

                setGroupedData(result.data);
                const hallsList = Object.keys(result.data).sort((a, b) => {
                    const numA = parseInt(a, 10);
                    const numB = parseInt(b, 10);
                    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                    return a.localeCompare(b);
                });
                setSelectedHall((prev) =>
                    prev && hallsList.includes(prev) ? prev : (hallsList[0] || '')
                );
            } else {
                setError(result?.message || 'সিট প্ল্যানের তথ্য পাওয়া যায়নি।');
            }
        } catch (err) {
            if (requestId !== requestSeqRef.current) return;
            console.error('Error fetching seat plan summary:', err);
            setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
        } finally {
            if (requestId === requestSeqRef.current) {
                setLoading(false);
            }
        }
    }, [selectedYear]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSeatPlanSummary();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchSeatPlanSummary]);

    const halls = useMemo(() => {
        return Object.keys(groupedData).sort((a, b) => {
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });
    }, [groupedData]);

    const activeCounts = useMemo(() => groupedData[selectedHall] || {}, [groupedData, selectedHall]);
    const formattedHallNameStr = formatHallName(selectedHall);

    // সর্বমোট পরীক্ষার্থী হিসাব
    const grandTotal = useMemo(() => {
        let sum = 0;
        CLASSES_LIST.forEach((cls) => {
            sum += getCountForClass(activeCounts, cls);
        });
        return sum;
    }, [activeCounts]);

    // প্রিন্ট ফাংশন (react-to-print)
    const reactToPrintFn = useReactToPrint({
        contentRef: printAreaRef,
        documentTitle: `Seat-Plan-Summary-Hall-${selectedHall || 'All'}-${year}`,
        pageStyle: SUMMARY_PAGE_STYLE,
        onBeforePrint: async () => {
            setIsPrinting(true);
            if (printAreaRef.current) {
                const images = Array.from(printAreaRef.current.querySelectorAll('img'));
                await Promise.all(
                    images.map((img) => {
                        if (img.complete && img.naturalWidth > 0) {
                            return typeof img.decode === 'function'
                                ? img.decode().catch(() => {})
                                : Promise.resolve();
                        }
                        return new Promise((resolve) => {
                            img.addEventListener('load', resolve, { once: true });
                            img.addEventListener('error', resolve, { once: true });
                        });
                    })
                );
            }
        },
        onAfterPrint: () => {
            setIsPrinting(false);
        },
        onPrintError: () => {
            setIsPrinting(false);
        },
    });

    const handlePrint = () => {
        if (!printAreaRef.current || isPrinting) return;
        reactToPrintFn();
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
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                        আবার চেষ্টা করুন
                    </button>
                </div>
            </div>
        );
    }

    if (halls.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md space-y-3">
                    <span className="text-amber-500 text-4xl">📭</span>
                    <h3 className="text-lg font-bold text-slate-800">কোনো ডাটা নেই</h3>
                    <p className="text-slate-600">
                        {selectedYear
                            ? `${toBengaliDigits(selectedYear)} শিক্ষাবর্ষে কোনো শিক্ষার্থীর সিট প্ল্যান বরাদ্দ করা নেই।`
                            : 'বর্তমানে কোনো শিক্ষার্থীর সিট প্ল্যান বরাদ্দ করা নেই।'}
                    </p>
                    {selectedYear && (
                        <button
                            onClick={() => setSelectedYear('')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            সকল সক্রিয় শিক্ষাবর্ষ দেখুন
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen p-2 sm:p-6 flex flex-col items-center">

            {/* Action Buttons Bar (প্রিন্ট করার সময় প্রদর্শিত হবে না) */}
            <div className="print:hidden w-full max-w-[1100px] mb-4 bg-white p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
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
                                    {formatHallOption(hall)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block">শিক্ষাবর্ষ:</label>
                        <select
                            value={selectedYear || year}
                            onChange={(e) => {
                                const nextYear = e.target.value;
                                setSelectedYear(nextYear);
                                setYear(nextYear);
                            }}
                            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium cursor-pointer"
                        >
                            {availableYears.map((yr) => (
                                <option key={yr} value={yr}>
                                    {toBengaliDigits(yr)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className={`text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow flex items-center gap-2 cursor-pointer ${isPrinting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        {isPrinting ? 'প্রিন্ট প্রস্তুত হচ্ছে...' : 'প্রিন্ট করুন'}
                    </button>
                </div>
            </div>

            {/* Main Printable Container */}
            <div
                ref={printAreaRef}
                className="summary-print-area font-bornomala bg-white text-black p-6 rounded-sm shadow-xl w-full max-w-[1150px] border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full"
            >

                {/* Header Section (Logo + Banner) */}
                <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                    {/* Logo on Left */}
                    <div className="w-22 h-22 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        <img
                            src={siteConfig.assets.logo}
                            alt={`${siteConfig.name.short} Logo`}
                            loading="eager"
                            className="w-full h-full object-cover scale-[1.05] transform-gpu"
                        />

                    </div>

                    {/* Banner / Institution Info on Right */}
                    <div className="flex-grow flex justify-end items-center">
                        <img
                            src={siteConfig.assets.banner}
                            alt={`${siteConfig.name.short} Banner`}
                            loading="eager"
                            className="max-h-[100px] object-contain"
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center font-bold text-xl sm:text-2xl mt-4 mb-2 text-black">
                    সিট প্ল্যান - {toBengaliDigits(year)}
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
                            {CLASSES_LIST.map((cls, idx) => {
                                const totalCount = getCountForClass(activeCounts, cls);
                                return (
                                    <tr key={idx} className="h-8 hover:bg-slate-50 transition-colors">
                                        {/* Class Name */}
                                        <td className="border border-black px-2 text-center font-semibold">
                                            {cls}
                                        </td>

                                        {/* Total Students */}
                                        <td className="border border-black px-2 text-center font-bold">
                                            {toBengaliDigits(totalCount)}
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* সর্বমোট পরীক্ষার্থী */}
                            <tr className="bg-gray-200 print:bg-gray-200 h-9 font-black">
                                <td className="border border-black px-2 text-center text-sm font-black">
                                    সর্বমোট পরীক্ষার্থী
                                </td>
                                <td className="border border-black px-2 text-center text-sm font-black">
                                    {toBengaliDigits(grandTotal)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
