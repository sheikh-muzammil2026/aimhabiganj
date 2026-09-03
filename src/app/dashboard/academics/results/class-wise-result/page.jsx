'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API;

export default function ClassResultView() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [examType, setExamType] = useState('term1');
    const [year, setYear] = useState('২০২৬-২০২৭');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // ক্লাসের ফলাফল ডাটা ফেচ করা
    const fetchClassResults = async () => {
        if (!selectedClass) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                class: selectedClass,
                year: year,
                term: examType
            });

            const res = await fetch(`${API_BASE_URL}/api/results/class?${queryParams}`);
            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                setResults(data.data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Fetch Class Results Error:", error);
            toast.error("ফলাফলের তথ্য লোড করতে সমস্যা হয়েছে!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassResults();
    }, [selectedClass, examType, year]);

    // মোট নম্বর গণনার হেল্পার ফাংশন
    const calculateTotalMark = (subjects) => {
        if (!Array.isArray(subjects)) return 0;
        return subjects.reduce((sum, item) => {
            const termData = item[examType] || {};
            // অনুপস্থিত বা 'A' / 'Abs' থাকলে ০ নম্বর হিসাব করা হবে
            if (termData.isAbsent || termData.exam === 'A' || termData.exam === 'Abs') return sum;
            const ct = parseFloat(termData.ct) || 0;
            const exam = parseFloat(termData.exam) || 0;
            return sum + ct + exam;
        }, 0);
    };

    // শিক্ষার্থী কোনো বিষয়ে ফেল করেছে কি না (৩৯ বা তার নিচে পেলে অথবা 'A'/'Abs' পেলে ফেল)
    const checkIfFailed = (subjects) => {
        if (!Array.isArray(subjects)) return false;
        return subjects.some((sub) => {
            const termData = sub[examType] || {};
            if (termData.isAbsent || termData.exam === 'A' || termData.exam === 'Abs') return true; // 'A' বা অনুপস্থিত থাকলেও ফেল
            const ct = parseFloat(termData.ct) || 0;
            const exam = parseFloat(termData.exam) || 0;
            const subTotal = ct + exam;
            return subTotal <= 39; // ৩৯ বা তার নিচে পেলে ফেল
        });
    };

    // ডুপ্লিকেট/সমান মার্কস চিহ্নিত করার জন্য মার্ক ফ্রিকোয়েন্সি গণনা
    const marksCount = {};
    results.forEach(student => {
        const total = calculateTotalMark(student.allSubjects);
        marksCount[total] = (marksCount[total] || 0) + 1;
    });

    // সকল ডাইনামিক সাবজেক্টের ইউনিক লিস্ট
    const allSubjectsList = Array.from(
        new Set(
            results.flatMap(student => student.allSubjects?.map(s => s.subject) || [])
        )
    );

    // প্রিন্ট হ্যান্ডলার
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* প্রিন্ট এর জন্য CSS স্টাইল */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 12mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    .print-container {
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    .watermark {
                        position: absolute !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                        width: 350px !important;
                        opacity: 0.08 !important;
                        z-index: 0 !important;
                        pointer-events: none !important;
                    }
                    table {
                        font-size: 11px !important;
                        border-collapse: collapse !important;
                    }
                    th, td {
                        border: 1px solid #94a3b8 !important;
                        padding: 6px 4px !important;
                    }
                    thead th {
                        background-color: #043e30 !important;
                        color: #fde047 !important;
                    }
                    /* সমান মার্কস রো (সবুজ) */
                    tr.same-mark-row {
                        background-color: #d1fae5 !important; 
                    }
                    /* ফেল করা রো (লাল/গোলাপি) */
                    tr.fail-row {
                        background-color: #fecdd3 !important; 
                    }
                }
                .watermark-web {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 320px;
                    opacity: 0.05;
                    pointer-events: none;
                    z-index: 0;
                }
            `}</style>

            <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 relative print-container">

                    {/* ব্যাকগ্রাউন্ড জলছাপ */}
                    <img
                        src="/aimlogo1.png"
                        alt="Watermark Logo"
                        className="watermark watermark-web"
                    />

                    {/* হেডার (ওয়েব ভিউ) */}
                    <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                                শ্রেণিভিত্তিক ফলাফল ও মেরিট তালিকা
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                শ্রেণি, পরীক্ষার ধরন এবং শিক্ষাবর্ষ অনুযায়ী সম্পূর্ণ ক্লাসের ফলাফল এক নজরে দেখুন।
                            </p>
                        </div>
                        {results.length > 0 && (
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center justify-center gap-2 bg-[#043e30] hover:bg-[#065c47] text-amber-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                                🖨️ প্রিন্ট করুন
                            </button>
                        )}
                    </div>

                    {/* প্রিন্ট হেডার */}
                    <div className="hidden print-only text-center mb-6 border-b-2 border-[#043e30] pb-3">
                        <div className="flex items-center justify-center gap-0 mb-2 border-b-4 border-double border-gray-800 pb-1 pl-2">
                            <div className="w-35 h-35 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3">
                                <Image
                                    src={"/aimlogo1.png"}
                                    alt="Institution Logo"
                                    width={200}
                                    height={200}
                                    quality={100}
                                    priority
                                    className="w-full h-full object-cover scale-[1.05] transform-gpu"
                                />
                            </div>
                            <div className="flex-grow text-center">
                                <Image
                                    src={"/banner_routine.png"}
                                    alt="Institution Banner"
                                    width={2000}
                                    height={400}
                                    quality={100}
                                    priority
                                    className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                                />
                            </div>
                        </div>

                        <h2 className="text-base font-bold text-slate-800">
                            শ্রেণিভিত্তিক ফলাফল - {year.split('-')[0]}
                        </h2>
                    </div>

                    {/* ফিল্টার সেকশন */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6 no-print">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণি</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            >
                                <option value="প্লে">প্লে</option>
                                <option value="নার্সারি">নার্সারি</option>
                                <option value="প্রথম">প্রথম</option>
                                <option value="দ্বিতীয়">দ্বিতীয়</option>
                                <option value="তৃতীয়">তৃতীয়</option>
                                <option value="চতুর্থ">চতুর্থ</option>
                                <option value="পঞ্চম">পঞ্চম</option>
                                <option value="ষষ্ঠ">ষষ্ঠ</option>
                                <option value="সপ্তম">সপ্তম</option>
                                <option value="অষ্টম">অষ্টম</option>
                                <option value="নবম">নবম</option>
                                <option value="দশম">দশম</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার ধরন</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            >
                                <option value="term1">১ম সাময়িক</option>
                                <option value="term2">২য় সাময়িক</option>
                                <option value="annual">বার্ষিক পরীক্ষা</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">শিক্ষাবর্ষ</label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* রেজাল্ট টেবিল */}
                    {loading ? (
                        <div className="py-12 text-center text-slate-500 text-sm">
                            ফলাফল প্রস্তুত করা হচ্ছে...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                            এই শ্রেণিতে কোনো ফলাফলের রেকর্ড পাওয়া যায়নি।
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm relative z-10">

                            {/* মোবাইল ভিউ */}
                            <div className="block sm:hidden divide-y divide-slate-200 bg-white/90 no-print">
                                {results.map((student) => {
                                    const total = calculateTotalMark(student.allSubjects);
                                    const hasFailed = checkIfFailed(student.allSubjects);
                                    const isDuplicateMark = marksCount[total] > 1;

                                    return (
                                        <div
                                            key={student.studentId}
                                            className={`p-4 space-y-3 transition-colors ${hasFailed
                                                ? 'bg-rose-100/90'
                                                : isDuplicateMark
                                                    ? 'bg-emerald-100/80'
                                                    : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-center bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#043e30] text-amber-300 font-bold px-2 py-0.5 rounded text-xs">
                                                        রোল: {student.roll || student.rollnumber || 'N/A'}
                                                    </span>
                                                    <span className="font-mono font-bold text-emerald-800 text-xs">
                                                        ID: {student.studentId}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-slate-500 block leading-tight">মোট নম্বর</span>
                                                    <span className="font-extrabold text-emerald-900 text-sm">
                                                        {total}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 block">শিক্ষার্থীর নাম</span>
                                                <h4 className="font-bold text-slate-800 text-sm">{student.studentName || 'N/A'}</h4>
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">বিষয়ভিত্তিক মার্কস</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {student.allSubjects?.map((sub, idx) => {
                                                        const termData = sub[examType] || {};

                                                        // অনুপস্থিত বা 'A' / 'Abs' থাকলে 
                                                        if (termData.isAbsent || termData.exam === 'A' || termData.exam === 'Abs') {
                                                            const displayVal = termData.exam === 'A' ? 'A' : 'Abs';
                                                            return (
                                                                <span key={idx} className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs border border-red-200">
                                                                    <span className="font-semibold">{sub.subject}:</span>
                                                                    <span className="font-bold">{displayVal}</span>
                                                                </span>
                                                            );
                                                        }

                                                        const ct = parseFloat(termData.ct) || 0;
                                                        const exam = parseFloat(termData.exam) || 0;
                                                        const subTotal = ct + exam;
                                                        const isSubFail = subTotal <= 39;

                                                        return (
                                                            <span key={idx} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${isSubFail ? 'bg-red-100 text-red-800 border-red-200 font-bold' : 'bg-slate-100 text-slate-700 border-slate-200/60'
                                                                }`}>
                                                                <span className="font-semibold">{sub.subject}:</span>
                                                                <span>{subTotal}</span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ডেস্কটপ ও প্রিন্ট ভিউ */}
                            <div className="hidden sm:block print-only overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                    <thead>
                                        <tr className="bg-[#043e30] text-amber-300">
                                            <th className="p-3 border border-emerald-800 font-bold text-center w-14">রোল</th>
                                            <th className="p-3 border border-emerald-800 font-bold w-24">আইডি</th>
                                            <th className="p-3 border border-emerald-800 font-bold min-w-[150px]">শিক্ষার্থীর নাম</th>

                                            {allSubjectsList.map((subjectName, i) => (
                                                <th key={i} className="p-2 border border-emerald-800 font-bold text-center">
                                                    {subjectName}
                                                </th>
                                            ))}

                                            <th className="p-3 border border-emerald-800 font-bold text-center w-24">মোট নম্বর</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white/90">
                                        {results.map((student) => {
                                            const total = calculateTotalMark(student.allSubjects);
                                            const hasFailed = checkIfFailed(student.allSubjects);
                                            const isDuplicateMark = marksCount[total] > 1;

                                            // ফেল করলে লাল, মার্কস সমান হলে সবুজ, বাকিগুলো সাধারণ
                                            let rowStyleClass = 'hover:bg-slate-50';
                                            if (hasFailed) {
                                                rowStyleClass = 'fail-row bg-rose-100 hover:bg-rose-200/80';
                                            } else if (isDuplicateMark) {
                                                rowStyleClass = 'same-mark-row bg-emerald-100/80 hover:bg-emerald-200/80';
                                            }

                                            return (
                                                <tr key={student.studentId} className={`transition-colors ${rowStyleClass}`}>
                                                    <td className="p-3 border border-slate-200 font-bold text-slate-600 text-center">
                                                        {student.roll || student.rollnumber || 'N/A'}
                                                    </td>
                                                    <td className="p-3 border border-slate-200 font-mono font-bold text-emerald-800">
                                                        {student.studentId}
                                                    </td>
                                                    <td className="p-3 border border-slate-200 font-bold text-slate-800">
                                                        {student.studentName || 'N/A'}
                                                    </td>

                                                    {/* বিষয়ভিত্তিক মার্কস কলাম */}
                                                    {allSubjectsList.map((subjName, idx) => {
                                                        const matchedSub = student.allSubjects?.find(s => s.subject === subjName);
                                                        if (matchedSub) {
                                                            const termData = matchedSub[examType] || {};

                                                            // 'A' বা 'Abs' বা অনুপস্থিত থাকলে 'A'/'Abs' লাল রঙে দেখাবে
                                                            if (termData.isAbsent || termData.exam === 'A' || termData.exam === 'Abs') {
                                                                const displayVal = termData.exam === 'A' ? 'A' : 'Abs';
                                                                return (
                                                                    <td key={idx} className="p-2 border border-slate-200 text-center font-bold text-red-600">
                                                                        {displayVal}
                                                                    </td>
                                                                );
                                                            }

                                                            const ct = parseFloat(termData.ct) || 0;
                                                            const exam = parseFloat(termData.exam) || 0;
                                                            const subTotal = ct + exam;
                                                            const isSubFail = subTotal <= 39;

                                                            return (
                                                                <td key={idx} className={`p-2 border border-slate-200 text-center ${isSubFail ? 'font-bold text-red-600' : ''}`}>
                                                                    {subTotal}
                                                                </td>
                                                            );
                                                        }

                                                        return (
                                                            <td key={idx} className="p-2 border border-slate-200 text-center text-slate-400">
                                                                -
                                                            </td>
                                                        );
                                                    })}

                                                    <td className="p-3 border border-slate-200 text-center font-extrabold text-emerald-900">
                                                        {total}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}