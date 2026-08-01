'use client';

import { useState, useMemo } from 'react';

export default function ClassWiseResult() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [year, setYear] = useState('২০২৬-২০২৭');
    const [selectedTerm, setSelectedTerm] = useState('annual'); // Default: annual
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleFetchClassResults = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/results/class?class=${encodeURIComponent(selectedClass)}&year=${encodeURIComponent(year)}&term=${encodeURIComponent(selectedTerm)}`
            );
            const data = await res.json();

            if (data.success) {
                console.log(data)
                setClassData(data.data || []);
            } else {
                setClassData([]);
            }
        } catch (err) {
            console.error("Class Results Fetch Error:", err);
            setClassData([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // ইউনিক বিষয়সমূহ বের করার মেমোইজড লজিক
    const uniqueSubjects = useMemo(() => {
        return Array.from(
            new Set(
                classData.flatMap(student => (student.allSubjects || []).map(sub => sub.subject))
            )
        );
    }, [classData]);

    const termLabels = {
        term1: '১ম সাময়িক পরীক্ষা',
        term2: '২য় সাময়িক পরীক্ষা',
        annual: 'বার্ষিক পরীক্ষা'
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 print:shadow-none print:border-none print:p-0">

                {/* হেডার */}
                <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                            শ্রেণীভিত্তিক ফলাফল ({termLabels[selectedTerm]})
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            শ্রেণী: <span className="font-bold text-slate-800">{selectedClass}</span> |
                            শিক্ষাবর্ষ: <span className="font-bold text-slate-800">{year}</span> |
                            পরীক্ষা: <span className="font-bold text-emerald-700">{termLabels[selectedTerm]}</span>
                        </p>
                    </div>
                    {classData.length > 0 && (
                        <button
                            onClick={handlePrint}
                            className="print:hidden self-start sm:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                        >
                            🖨️ তালিকা প্রিন্ট করুন
                        </button>
                    )}
                </div>

                {/* সার্চ কন্ট্রোল (প্রিন্টের সময় হাইড থাকবে) */}
                <div className="print:hidden flex flex-col md:flex-row items-end gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
                    {/* শ্রেণী নির্বাচন */}
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণী নির্বাচন করুন</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        >
                            <optgroup label="-- হিফজ --">
                                <option value="কায়দা/আমপারা">কায়দা/আমপারা</option>
                                <option value="নাজেরা">নাজেরা</option>
                            </optgroup>
                            <optgroup label="-- প্রাক-প্রাথমিক --">
                                <option value="প্লে">প্লে</option>
                                <option value="নার্সারি">নার্সারি</option>
                            </optgroup>
                            <optgroup label="-- প্রাথমিক --">
                                <option value="প্রথম">প্রথম</option>
                                <option value="দ্বিতীয়">দ্বিতীয়</option>
                                <option value="তৃতীয়">তৃতীয়</option>
                                <option value="চতুর্থ">চতুর্থ</option>
                                <option value="পঞ্চম">পঞ্চম</option>
                            </optgroup>
                            <optgroup label="-- মাধ্যমিক --">
                                <option value="ষষ্ঠ">ষষ্ঠ</option>
                                <option value="সপ্তম">সপ্তম</option>
                                <option value="অষ্টম">অষ্টম</option>
                                <option value="নবম">নবম</option>
                                <option value="দশম">দশম</option>
                            </optgroup>
                            <optgroup label="-- উচ্চমাধ্যমিক --">
                                <option value="১১শ শ্রেণি">১১শ শ্রেণি</option>
                                <option value="১২শ শ্রেণি">১২শ শ্রেণি</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* টার্ম/পরীক্ষা নির্বাচন */}
                    <div className="w-full md:w-48">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার ধরন (Term)</label>
                        <select
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        >
                            <option value="term1">১ম সাময়িক</option>
                            <option value="term2">২য় সাময়িক</option>
                            <option value="annual">বার্ষিক পরীক্ষা</option>
                        </select>
                    </div>

                    {/* শিক্ষাবর্ষ */}
                    <div className="w-full md:w-40">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">শিক্ষাবর্ষ</label>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                    </div>

                    {/* সাবমিট বাটন */}
                    <button
                        onClick={handleFetchClassResults}
                        disabled={loading}
                        className="w-full md:w-auto bg-[#043e30] hover:bg-emerald-900 text-amber-400 font-extrabold px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 text-xs sm:text-sm disabled:opacity-50"
                    >
                        {loading ? 'লোড হচ্ছে...' : 'ফলাফল দেখুন'}
                    </button>
                </div>

                {/* ফলাফল টেবিল */}
                {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">শ্রেণীভিত্তিক ফলাফল তথ্য আনা হচ্ছে...</div>
                ) : searched && classData.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                        এই শ্রেণীর কোনো পরীক্ষার ফলাফল ডাটাবেজে পাওয়া যায়নি।
                    </div>
                ) : classData.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 print:border-slate-300">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#043e30] text-amber-300 print:bg-slate-100 print:text-slate-800">
                                    <th className="p-3 border border-emerald-800 print:border-slate-300 font-bold w-28">আইডি</th>
                                    <th className="p-3 border border-emerald-800 print:border-slate-300 font-bold">শিক্ষার্থীর নাম</th>
                                    {uniqueSubjects.map((sub, idx) => (
                                        <th key={idx} className="p-3 border border-emerald-800 print:border-slate-300 font-bold text-center">{sub}</th>
                                    ))}
                                    <th className="p-3 border border-emerald-800 print:border-slate-300 font-bold text-center">মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 print:divide-slate-200 bg-white">
                                {classData.map((student, idx) => {
                                    // নির্বাচিত টার্মের ওপর ভিত্তি করে মোট নম্বর হিসাব
                                    const totalMarks = (student.allSubjects || []).reduce((sum, sub) => {
                                        const termData = sub?.[selectedTerm];
                                        const ct = Number(termData?.ct) || 0;
                                        const exam = Number(termData?.exam) || 0;
                                        return sum + ct + exam;
                                    }, 0);

                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-3 border border-slate-100 print:border-slate-200 font-mono font-bold text-emerald-800">
                                                {student.studentId}
                                            </td>
                                            <td className="p-3 border border-slate-100 print:border-slate-200 font-bold text-slate-800">
                                                {student.studentName || 'N/A'}
                                            </td>

                                            {/* বিষয় ভিত্তিক নম্বর প্রদর্শনী */}
                                            {uniqueSubjects.map((subjectName, sIdx) => {
                                                const sub = student.allSubjects?.find(s => s.subject === subjectName);
                                                const termData = sub?.[selectedTerm];

                                                const ct = termData?.ct !== undefined && termData?.ct !== null ? Number(termData.ct) : null;
                                                const exam = termData?.exam !== undefined && termData?.exam !== null ? Number(termData.exam) : null;

                                                const hasMarks = ct !== null || exam !== null;
                                                const totalSubjectMark = (ct || 0) + (exam || 0);

                                                return (
                                                    <td key={sIdx} className="p-3 border border-slate-100 print:border-slate-200 text-center font-semibold text-slate-700">
                                                        {hasMarks ? totalSubjectMark : '-'}
                                                    </td>
                                                );
                                            })}

                                            <td className="p-3 border border-slate-100 print:border-slate-200 text-center font-bold text-emerald-950 bg-emerald-50/30">
                                                {totalMarks}
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