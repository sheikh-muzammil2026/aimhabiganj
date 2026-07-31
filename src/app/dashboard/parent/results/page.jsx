'use client';

import { useState } from 'react';

export default function StudentResultSearch() {
    const [searchId, setSearchId] = useState('');
    const [year, setYear] = useState('২০২৬-২০২৭');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/results/student/${searchId}?year=${encodeURIComponent(year)}`);
            const data = await res.json();

            if (data.success) {
                setResult(data);
            } else {
                setResult(null);
                setErrorMsg(data.message || 'শিক্ষার্থীর কোনো রেজাল্ট তথ্য পাওয়া যায়নি।');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* সার্চ ফিল্টার কার্ড - প্রিন্টের সময় এটি লুকানো থাকবে */}
                <div className="print:hidden bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <h2 className="text-lg font-black text-[#043e30] mb-4">ব্যক্তিগত ফলাফল ও নম্বরপত্র অনুসন্ধান</h2>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="শিক্ষার্থী আইডি (যেমন: 0401)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#043e30] text-amber-400 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-emerald-900 transition-colors"
                        >
                            {loading ? 'খোঁজা হচ্ছে...' : 'রেজাল্ট দেখুন'}
                        </button>
                    </form>
                    {errorMsg && <p className="text-xs text-rose-600 font-bold mt-3">{errorMsg}</p>}
                </div>

                {/* রেজাল্ট মার্কশিট (Print Friendly) */}
                {result && (
                    <div id="mark-sheet" className="bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0">
                        {/* মাদরাসা হেডার */}
                        <div className="text-center border-b-2 border-emerald-900 pb-5 mb-6">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <img src="/aimlogo1.png" alt="Logo" className="w-14 h-14 object-contain" />
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">আস-সালাম আইডিয়াল মাদরাসা</h1>
                                    <p className="text-xs font-semibold text-emerald-800">হবিগঞ্জ, বাংলাদেশ</p>
                                </div>
                            </div>
                            <span className="inline-block bg-amber-400 text-[#043e30] font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest mt-1">
                                একাডেমিক মার্কশিট - {result.year}
                            </span>
                        </div>

                        {/* শিক্ষার্থী প্রোফাইল সামারি */}
                        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                            <div>
                                <p className="text-slate-600">শিক্ষার্থীর নাম: <strong className="text-slate-900 font-bold">{result.student.name}</strong></p>
                                <p className="text-slate-600 mt-1">আইডি নম্বর: <strong className="text-emerald-800 font-mono font-bold">{result.student.studentId}</strong></p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-600">শ্রেণী: <strong className="text-slate-900 font-bold">{result.student.class}</strong></p>
                                <p className="text-slate-600 mt-1">রোল নম্বর: <strong className="text-slate-900 font-bold">{result.student.roll || 'N/A'}</strong></p>
                            </div>
                        </div>

                        {/* নম্বর টেবিল */}
                        <div className="overflow-x-auto mb-8">
                            <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-800 text-center font-bold">
                                        <th className="border border-slate-300 p-2.5 text-left">বিষয়</th>
                                        <th className="border border-slate-300 p-2.5">১ম সাময়িক (CT+Exam)</th>
                                        <th className="border border-slate-300 p-2.5">২য় সাময়িক (CT+Exam)</th>
                                        <th className="border border-slate-300 p-2.5">বার্ষিক (CT+Exam)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-center">
                                    {result.results.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-slate-500">কোনো বিষয়ের নম্বর এখনও ইনপুট দেওয়া হয়নি।</td>
                                        </tr>
                                    ) : (
                                        result.results.map((item, idx) => {
                                            const t1Total = (item.term1?.ct || 0) + (item.term1?.exam || 0);
                                            const t2Total = (item.term2?.ct || 0) + (item.term2?.exam || 0);
                                            const annualTotal = (item.annual?.ct || 0) + (item.annual?.exam || 0);

                                            return (
                                                <tr key={idx} className="hover:bg-slate-50">
                                                    <td className="border border-slate-300 p-2.5 text-left font-bold text-slate-800">{item.subject}</td>
                                                    <td className="border border-slate-300 p-2.5 font-semibold">{t1Total || '-'}</td>
                                                    <td className="border border-slate-300 p-2.5 font-semibold">{t2Total || '-'}</td>
                                                    <td className="border border-slate-300 p-2.5 font-semibold text-emerald-900">{annualTotal || '-'}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* স্বাক্ষর এলাকা */}
                        <div className="mt-16 pt-6 flex justify-between text-xs text-slate-700 font-bold border-t border-slate-200">
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-32">শ্রেণী শিক্ষকের স্বাক্ষর</p></div>
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-32">অভিভাবকের স্বাক্ষর</p></div>
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-32">অধ্যক্ষ / মুহতামিম</p></div>
                        </div>

                        {/* প্রিন্ট বাটন - প্রিন্টের সময় হাইড থাকবে */}
                        <div className="print:hidden mt-8 text-center">
                            <button
                                onClick={handlePrint}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors text-xs sm:text-sm"
                            >
                                🖨️ মার্কশিট প্রিন্ট / পিডিএফ ডাউনলোড
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
