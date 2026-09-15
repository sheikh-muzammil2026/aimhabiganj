'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function ExamAttendanceSheet() {
    // নির্বাচন করার জন্য স্টেটসমূহ
    const [classes, setClasses] = useState([
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
        'কায়দা/আমপারা',
        'নাজেরা',
        'সবক',
        'শুনানি'
    ]);
    const [selectedClass, setSelectedClass] = useState('প্লে');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');

    // লোডিং ও ডেটা স্টেট
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metaData, setMetaData] = useState({
        className: '',
        examName: '',
        englishYear: '২০২৬',
        hijriYear: '১৪৪৭',
    });
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // প্রথমে পরীক্ষার তালিকা নিয়ে আসা
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/exams/list`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setExams(result.data);
                    setSelectedExam(result.data[0]);
                } else {
                    setExams(['প্রথম সাময়িক পরীক্ষা', 'দ্বিতীয় সাময়িক পরীক্ষা', 'বার্ষিক পরীক্ষা']);
                    setSelectedExam('প্রথম সাময়িক পরীক্ষা');
                }
            } catch (err) {
                console.error("Error fetching exams:", err);
                setExams(['প্রথম সাময়িক পরীক্ষা', 'দ্বিতীয় সাময়িক পরীক্ষা', 'বার্ষিক পরীক্ষা']);
                setSelectedExam('প্রথম সাময়িক পরীক্ষা');
            }
        };
        fetchExams();
    }, []);

    const fetchAttendanceData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/exams/attendance-sheet?className=${encodeURIComponent(selectedClass)}&examName=${encodeURIComponent(selectedExam)}`
            );
            const result = await response.json();

            if (result.success) {
                setMetaData(result.metaData || {
                    className: selectedClass,
                    examName: selectedExam,
                    englishYear: '২০২৬',
                    hijriYear: '১৪৪৭'
                });
                setSubjects(result.subjects || []);
                setStudents(result.students || []);
            } else {
                setError(result.message || 'উপস্থিতি স্বাক্ষরপত্র শিটের তথ্য লোড করা যায়নি।');
            }
        } catch (err) {
            console.error("Error fetching attendance data:", err);
            setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
        } finally {
            setLoading(false);
        }
    }, [selectedClass, selectedExam]);

    useEffect(() => {
        if (selectedExam && selectedClass) {
            fetchAttendanceData();
        }
    }, [selectedExam, selectedClass, fetchAttendanceData]);

    const handlePrint = () => {
        window.print();
    };

    const getSubjectStyles = (count) => {
        if (count > 10) {
            return {
                fontSizeClass: 'text-[9px] sm:text-[10px] leading-tight',
                subTitleSizeClass: 'text-[8px] sm:text-[9px]',
                paddingClass: 'p-0.5',
            };
        } else if (count > 7) {
            return {
                fontSizeClass: 'text-[11px] sm:text-[12px] leading-tight',
                subTitleSizeClass: 'text-[9px] sm:text-[10px]',
                paddingClass: 'p-1',
            };
        } else {
            return {
                fontSizeClass: 'text-[13px] sm:text-[14px]',
                subTitleSizeClass: 'text-[11px] sm:text-[12px]',
                paddingClass: 'p-1.5',
            };
        }
    };

    const getStudentNameFontSize = (name, isCompact) => {
        if (!name) return isCompact ? 'text-[10px]' : 'text-xs sm:text-sm';
        const length = name.length;
        if (isCompact) {
            if (length > 25) return 'text-[8px] leading-tight';
            if (length > 18) return 'text-[9px] leading-tight';
            return 'text-[10px] leading-tight';
        } else {
            if (length > 30) return 'text-[9px] leading-tight';
            if (length > 22) return 'text-[10px] leading-tight';
            if (length > 16) return 'text-[11px] leading-tight';
            return 'text-xs sm:text-sm';
        }
    };

    const { fontSizeClass, subTitleSizeClass, paddingClass } = getSubjectStyles(subjects.length);

    // লজিক: ১৪ বা তার বেশি স্টুডেন্ট থাকলে আলাদা পেজ হবে না, সব ১ পেজে ফিট করবে
    const isSinglePageMode = students.length >= 9;

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    // ১৪ জনের কম হলে প্রতি পেজে ১০ জন করে থাকবে
    const studentChunks = isSinglePageMode ? [students] : chunkArray(students, 13);

    return (
        <div className="bg-slate-100 min-h-screen p-2 sm:p-6 flex flex-col items-center print:bg-white print:p-0 print:m-0 print:block print:min-h-0 print:w-full">

            {/* A4 Landscape Print Style Injector */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: ${isSinglePageMode ? '5mm' : '8mm'};
                    }
                    html, body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-page {
                        page-break-before: always !important;
                        break-before: page !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        box-sizing: border-box !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-page:first-child {
                        page-break-before: auto !important;
                        break-before: auto !important;
                    }
                    .print-page:last-child {
                        page-break-after: auto !important;
                        break-after: auto !important;
                    }
                }
            `}</style>

            {/* Action Buttons Bar */}
            <div className="print:hidden w-full max-w-[1150px] mb-4 bg-white p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm font-semibold text-slate-700">
                        উপস্থিতি স্বাক্ষরপত্র শিট
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block">শ্রেণি:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium cursor-pointer"
                        >
                            {classes.map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block">পরীক্ষা:</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium cursor-pointer"
                        >
                            {exams.map((ex) => (
                                <option key={ex} value={ex}>{ex}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <button
                        onClick={handlePrint}
                        disabled={students.length === 0}
                        className={`text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow flex items-center gap-2 cursor-pointer ${students.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        প্রিন্ট করুন
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-[1150px] border border-gray-200 flex justify-center items-center py-20 print:hidden">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
                    <span className="ml-3 text-slate-700 font-semibold">তথ্য লোড হচ্ছে...</span>
                </div>
            ) : error ? (
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-[1150px] border border-gray-200 text-center py-20 text-red-500 font-semibold print:hidden">
                    ⚠️ {error}
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-[1150px] border border-gray-200 text-center py-20 text-slate-500 font-semibold print:hidden">
                    📭 এই শ্রেণিতে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                </div>
            ) : (
                studentChunks.map((chunk, chunkIdx) => (
                    <div
                        key={chunkIdx}
                        className={`print-page bg-white text-black rounded-sm shadow-xl w-full max-w-[1150px] border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full mb-6 ${isSinglePageMode ? 'p-2' : 'p-6'
                            }`}
                    >
                        {/* ১৪ বা তার বেশি স্টুডেন্ট থাকলে Header ও Logo সম্পূর্ণ হাইড থাকবে */}
                        {!isSinglePageMode && (
                            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                                <div className="w-[130px] h-[100px] relative flex-shrink-0">
                                    <img
                                        src="/aimlogo1.png"
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex-grow flex justify-end items-center">
                                    <img
                                        src="/banner.png"
                                        alt="Institution Banner"
                                        className="max-h-[100px] object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Sub Header Meta Info */}
                        <div className={`text-center font-semibold text-gray-900 ${isSinglePageMode ? 'text-xs mb-1' : 'text-[15px] sm:text-[16px] mb-2'
                            }`}>
                            শ্রেণি: <span className="font-bold">{metaData.className}</span> - {metaData.examName} {(metaData.englishYear || '').split(/[-–/]/)[0].trim()} ইং / {(metaData.hijriYear || '').split(/[-–/]/)[0].trim()} হি শিক্ষাবর্ষ
                        </div>

                        {/* Title */}
                        <h2 className={`text-center font-bold text-black underline underline-offset-4 decoration-1 ${isSinglePageMode ? 'text-lg mb-2' : 'text-xl sm:text-2xl mb-4'
                            }`}>
                            উপস্থিতি স্বাক্ষরপত্র
                        </h2>

                        {/* Attendance Grid Table */}
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse border border-black text-xs text-black table-fixed">
                                <thead>
                                    <tr className="bg-gray-200 print:bg-gray-200">
                                        <th className="border border-black p-1 w-10 text-center font-bold">রোল</th>
                                        <th className="border border-black p-1 w-12 sm:w-14 text-center font-bold">আইডি</th>
                                        <th className="border border-black p-1 w-32 sm:w-40 text-center font-bold">পরীক্ষার্থীর নাম</th>

                                        {subjects.length > 0 ? (
                                            subjects.map((sub) => (
                                                <th key={sub.id} className={`border border-black ${paddingClass} text-center font-normal break-words`}>
                                                    <div className={`font-bold ${fontSizeClass}`}>{sub.name}</div>
                                                    <div className={`${subTitleSizeClass} text-gray-800`}>{sub.date}</div>
                                                </th>
                                            ))
                                        ) : (
                                            <th className="border border-black p-1 text-center font-bold">
                                                বিষয় ও তারিখ
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {chunk.map((student, idx) => (
                                        <tr key={idx} className={isSinglePageMode ? 'h-6 sm:h-7' : 'h-9'}>
                                            <td className="border border-black px-1 text-center font-medium">
                                                {student.roll}
                                            </td>

                                            <td className="border border-black px-1 text-center font-medium">
                                                {student.studentId}
                                            </td>

                                            <td className="border border-black px-1 font-semibold text-left align-middle">
                                                <div className={`${getStudentNameFontSize(student.studentName, isSinglePageMode)} break-words leading-tight`}>
                                                    {student.studentName}
                                                </div>
                                            </td>

                                            {subjects.length > 0 ? (
                                                subjects.map((sub) => (
                                                    <td
                                                        key={sub.id}
                                                        className="border border-black text-center bg-white"
                                                    >
                                                    </td>
                                                ))
                                            ) : (
                                                <td className="border border-black text-center bg-white"></td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
