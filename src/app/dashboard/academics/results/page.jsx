'use client';

import { useState } from 'react';

export default function ClassWiseResult() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [year, setYear] = useState('২০২৬-২০২৭');
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleFetchClassResults = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/results/class?class=${encodeURIComponent(selectedClass)}&year=${encodeURIComponent(year)}`);
            const data = await res.json();

            if (data.success) {
                setClassData(data.data);
            } else {
                setClassData([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">শ্রেণীভিত্তিক সম্পূর্ণ ফলাফল</h1>
                    <p className="text-xs text-slate-500 mt-1">পুরো ক্লাসের শিক্ষার্থীর বিষয়ভিত্তিক নম্বর ও সামারি এক সাথে পর্যালোচনা করুন</p>
                </div>

                {/* সার্চ কন্ট্রোল */}
                <div className="flex flex-col sm:flex-row items-end gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
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

                    <div className="w-full sm:w-48">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">শিক্ষাবর্ষ</label>
                        <input 
                            type="text" 
                            value={year} 
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handleFetchClassResults}
                        disabled={loading}
                        className="w-full sm:w-auto bg-[#043e30] hover:bg-emerald-900 text-amber-400 font-extrabold px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 text-xs sm:text-sm"
                    >
                        {loading ? 'লোড হচ্ছে...' : 'ফলাফল দেখুন'}
                    </button>
                </div>

                {/* ডাটা টেবিল */}
                {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">শ্রেণীভিত্তিক ফলাফল তথ্য আনা হচ্ছে...</div>
                ) : searched && classData.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                        এই শ্রেণীর কোনো পরীক্ষার ফলাফল ডাটাবেজে পাওয়া যায়নি।
                    </div>
                ) : classData.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-[#043e30] text-amber-300">
                                    <th className="p-3 border-b border-emerald-800 font-bold w-28">আইডি</th>
                                    <th className="p-3 border-b border-emerald-800 font-bold">শিক্ষার্থীর নাম</th>
                                    <th className="p-3 border-b border-emerald-800 font-bold text-center">মোট বিষয়</th>
                                    <th className="p-3 border-b border-emerald-800 font-bold">বিষয়ভিত্তিক বার্ষিক মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {classData.map((student, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-3 font-mono font-bold text-emerald-800">{student.studentId}</td>
                                        <td className="p-3 font-bold text-slate-800">{student.studentName || 'N/A'}</td>
                                        <td className="p-3 text-center font-bold text-slate-600">{student.allSubjects.length} টি</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {student.allSubjects.map((sub, sIdx) => {
                                                    const annualTotal = (sub.annual?.ct || 0) + (sub.annual?.exam || 0);
                                                    return (
                                                        <span key={sIdx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                                                            <span>{sub.subject}:</span>
                                                            <strong className="text-emerald-800">{annualTotal}</strong>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
