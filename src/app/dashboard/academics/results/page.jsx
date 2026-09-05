'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:5000';

export default function ClassResultView() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [examType, setExamType] = useState('term1');
    const [year, setYear] = useState('২০২৬');

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
            const ct = parseFloat(termData.ct) || 0;
            const exam = parseFloat(termData.exam) || 0;
            return sum + ct + exam;
        }, 0);
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">

                {/* হেডার */}
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                        শ্রেণিভিত্তিক ফলাফল ও মেরিট তালিকা
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        শ্রেণি, পরীক্ষার ধরন এবং শিক্ষাবর্ষ অনুযায়ী সম্পূর্ণ ক্লাসের ফলাফল এক নজরে দেখুন।
                    </p>
                </div>

                {/* ফিল্টার সেকশন */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
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
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#043e30] text-amber-300">
                                    <th className="p-3 border border-emerald-800 font-bold text-center w-16">রোল</th>
                                    <th className="p-3 border border-emerald-800 font-bold w-28">আইডি</th>
                                    <th className="p-3 border border-emerald-800 font-bold">শিক্ষার্থীর নাম</th>
                                    <th className="p-3 border border-emerald-800 font-bold">বিষয়ভিত্তিক মার্কস</th>
                                    <th className="p-3 border border-emerald-800 font-bold text-center w-28">মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {results.map((student) => {
                                    const total = calculateTotalMark(student.allSubjects);

                                    return (
                                        <tr key={student.studentId} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 border border-slate-100 font-bold text-slate-600 text-center">
                                                {student.rollNumber || 'N/A'}
                                            </td>
                                            <td className="p-3 border border-slate-100 font-mono font-bold text-emerald-800">
                                                {student.studentId}
                                            </td>
                                            <td className="p-3 border border-slate-100 font-bold text-slate-800">
                                                {student.studentName || 'N/A'}
                                            </td>
                                            <td className="p-3 border border-slate-100">
                                                <div className="flex flex-wrap gap-2">
                                                    {student.allSubjects?.map((sub, idx) => {
                                                        const termData = sub[examType] || {};
                                                        const ct = parseFloat(termData.ct) || 0;
                                                        const exam = parseFloat(termData.exam) || 0;
                                                        const subTotal = ct + exam;

                                                        return (
                                                            <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                                                                <span className="font-semibold">{sub.subject}:</span>
                                                                <span className="text-emerald-700 font-bold">{subTotal}</span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-3 border border-slate-100 text-center font-extrabold text-emerald-900 text-sm">
                                                {total}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}