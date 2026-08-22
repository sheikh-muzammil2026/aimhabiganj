'use client';

import React, { useState, useEffect } from 'react';

export default function ExamAttendanceSheet() {
    // নির্বাচন করার জন্য স্টেটসমূহ
    const [classes, setClasses] = useState([
        'প্লে',
        'নার্সারি',
        'প্রথম',
        'দ্বিতীয়',
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
        englishYear: '২০২৬-২০২৬',
        hijriYear: '১৪৪৭ - ১৪৪৮',
    });
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // প্রথমে পরীক্ষার তালিকা নিয়ে আসা
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/exams/list`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setExams(result.data);
                    // ডিফল্টভাবে প্রথম পরীক্ষা সিলেক্ট করা
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

    // ক্লাস বা পরীক্ষা পরিবর্তন হলে ডাটা লোড করা
    useEffect(() => {
        if (selectedExam && selectedClass) {
            fetchAttendanceData();
        }
    }, [selectedExam, selectedClass]);

    const fetchAttendanceData = async () => {
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
                    englishYear: '২০২৬-২০২৬',
                    hijriYear: '১৪৪৭ - ১৪৪৮'
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
    };

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
            <div className="print:hidden w-full max-w-[1150px] mb-4 bg-white p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm font-semibold text-slate-700">
                        উপস্থিতি স্বাক্ষরপত্র শিট
                    </div>
                    
                    {/* শ্রেণি ড্রপডাউন */}
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

                    {/* পরীক্ষা ড্রপডাউন */}
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
                        className={`text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow flex items-center gap-2 cursor-pointer ${
                            students.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
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
                
                {/* loading & error view within printable area wrapper to avoid blank print */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
                        <span className="ml-3 text-slate-700 font-semibold">তথ্য লোড হচ্ছে...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 font-semibold">
                        ⚠️ {error}
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 font-semibold">
                        📭 এই শ্রেণিতে কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                    </div>
                ) : (
                    <>
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

                                        {/* Dynamic Subject Headers */}
                                        {subjects.length > 0 ? (
                                            subjects.map((sub) => (
                                                <th key={sub.id} className="border border-black p-1.5 text-center font-normal min-w-[140px]">
                                                    <div className="font-bold text-[13px]">{sub.name}</div>
                                                    <div className="text-[11px] text-gray-800">{sub.date}</div>
                                                </th>
                                            ))
                                        ) : (
                                            // Fallback header columns if no subjects found in routine
                                            <th className="border border-black p-1.5 text-center font-bold min-w-[200px]">
                                                বিষয় ও তারিখ (রুটিন পাওয়া যায়নি)
                                            </th>
                                        )}
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
                                            {subjects.length > 0 ? (
                                                subjects.map((sub) => (
                                                    <td
                                                        key={sub.id}
                                                        className="border border-black text-center bg-white"
                                                    >
                                                        {/* Blank Area for Signature */}
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
                    </>
                )}

            </div>
        </div>
    );
}
