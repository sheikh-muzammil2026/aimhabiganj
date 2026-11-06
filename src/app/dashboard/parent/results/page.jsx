'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { authClient } from '@/lib/auth-client';

function StudentResultSearchContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { data: session } = authClient.useSession();
    const user = session?.user;
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const [searchId, setSearchId] = useState('');
    const [year, setYear] = useState('২০২৬');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [copiedLink, setCopiedLink] = useState(false);

    const requestIdRef = useRef(0);
    const lastExecutedQueryRef = useRef('');

    const executeSearch = useCallback(async (targetId, targetYear, syncUrl = true) => {
        const trimmedId = (targetId || '').trim();
        if (!trimmedId) return;

        const currentReqId = ++requestIdRef.current;
        setLoading(true);
        setErrorMsg('');
        setResult(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/results/student/${trimmedId}?year=${encodeURIComponent(targetYear)}`, {
                headers: {
                    'x-user-email': userRef.current?.email || '',
                    'x-user-role': userRef.current?.role || '',
                }
            });
            const data = await res.json();
            if (currentReqId !== requestIdRef.current) return;

            if (data.success) {
                setResult(data);
                if (syncUrl) {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('studentId');
                    params.delete('id');
                    params.set('roll', trimmedId);
                    if (targetYear) {
                        params.set('year', targetYear);
                    }
                    const nextQs = params.toString();
                    if (nextQs !== searchParams.toString()) {
                        router.replace(`${pathname}?${nextQs}`, { scroll: false });
                    }
                }
            } else {
                setResult(null);
                setErrorMsg(data.message || 'শিক্ষার্থীর কোনো রেজাল্ট তথ্য পাওয়া যায়নি।');
            }
        } catch (err) {
            if (currentReqId !== requestIdRef.current) return;
            console.error("Student Result Fetch Error:", err);
            setErrorMsg('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
        } finally {
            if (currentReqId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [pathname, router, searchParams]);

    useEffect(() => {
        const urlRoll = (
            searchParams.get('roll') ||
            searchParams.get('studentId') ||
            searchParams.get('id') ||
            ''
        ).trim();
        const urlYear = (searchParams.get('year') || '২০২৬').trim();

        if (!urlRoll) return;

        const queryKey = `${urlRoll}|${urlYear}`;
        if (lastExecutedQueryRef.current === queryKey) return;

        lastExecutedQueryRef.current = queryKey;
        setSearchId(urlRoll);
        setYear(urlYear);
        executeSearch(urlRoll, urlYear, true);
    }, [searchParams, executeSearch]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedId = searchId.trim();
        if (!trimmedId) return;

        const queryKey = `${trimmedId}|${year}`;
        lastExecutedQueryRef.current = queryKey;
        await executeSearch(trimmedId, year, true);
    };

    const handleCopyLink = async () => {
        if (typeof window === 'undefined') return;
        try {
            const params = new URLSearchParams();
            const resolvedId = String(result?.student?.studentId || searchId.trim() || '').trim();
            if (resolvedId) params.set('roll', resolvedId);
            if (year) params.set('year', year);
            const qs = params.toString();
            const shareUrl = `${window.location.origin}${pathname}${qs ? `?${qs}` : ''}`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedLink(true);
            toast.success('ফলাফলের লিংক কপি করা হয়েছে! (Copied!)');
            setTimeout(() => setCopiedLink(false), 2500);
        } catch (err) {
            console.error('Copy link error:', err);
            toast.error('লিংক কপি করা সম্ভব হয়নি।');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* সার্চ ফিল্টার কার্ড - প্রিন্টের সময় লুকানো থাকবে */}
                <div className="print:hidden bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <h2 className="text-lg font-black text-[#043e30] mb-4">ব্যক্তিগত ফলাফল ও নম্বরপত্র অনুসন্ধান</h2>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="শিক্ষার্থী আইডি (যেমন: 04337)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="w-full sm:w-36">
                            <input
                                type="text"
                                placeholder="শিক্ষাবর্ষ"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#043e30] text-amber-400 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-emerald-900 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'খোঁজা হচ্ছে...' : 'রেজাল্ট দেখুন'}
                        </button>
                    </form>
                    {errorMsg && <p className="text-xs text-rose-600 font-bold mt-3">{errorMsg}</p>}
                </div>

                {/* রেজাল্ট মার্কশিট (Print Friendly) */}
                {result && (
                    <div id="mark-sheet" className="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0">
                        {/* মাদরাসা হেডার */}
                        <div className="text-center border-b-2 border-emerald-900 pb-5 mb-6">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <img src="/aimlogo1.png" alt="Logo" className="w-14 h-14 object-contain" />
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h1>
                                    <p className="text-xs font-semibold text-emerald-800">হবিগঞ্জ, বাংলাদেশ</p>
                                </div>
                            </div>
                            <span className="inline-block bg-amber-400 text-[#043e30] font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest mt-1">
                                একাডেমিক মার্কশিট - {result.year ? String(result.year).split(/[-–/]/)[0].trim() : ''}
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
                                    <tr className="bg-[#043e30] text-amber-300 print:bg-slate-100 print:text-slate-800 text-center font-bold">
                                        <th className="border border-slate-300 p-3 text-left w-1/4">বিষয় (Subject)</th>
                                        <th className="border border-slate-300 p-3 w-1/4">1st Term (১ম সাময়িক)</th>
                                        <th className="border border-slate-300 p-3 w-1/4">2nd Term (২য় সাময়িক)</th>
                                        <th className="border border-slate-300 p-3 w-1/4">Annual (বার্ষিক)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-center">
                                    {(() => {
                                        const uniqueSubjects = Array.from(
                                            new Map(
                                                (result.results || []).map((item, idx) => [
                                                    String(
                                                        item?.subjectCode ||
                                                            item?.subjectId ||
                                                            item?.subjectName ||
                                                            item?.subject ||
                                                            `subject-${idx}`
                                                    ).trim(),
                                                    item,
                                                ])
                                            ).values()
                                        );
                                        if (uniqueSubjects.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan="4" className="p-4 text-slate-500">কোনো বিষয়ের নম্বর এখনও ইনপুট দেওয়া হয়নি।</td>
                                                </tr>
                                            );
                                        }
                                        return uniqueSubjects.map((item, idx) => {
                                            const renderMarkCell = (term, isAnnual = false) => {
                                                if (!term || (term.ct === undefined && term.exam === undefined)) {
                                                    return <span className="text-slate-400 font-semibold">-</span>;
                                                }
                                                const ct = term.ct || 0;
                                                const exam = term.exam || 0;
                                                const total = ct + exam;
                                                
                                                return (
                                                    <div className={`flex flex-col items-center justify-center py-1 ${isAnnual ? 'bg-emerald-50/10' : ''}`}>
                                                        <span className={`text-sm sm:text-base font-extrabold ${isAnnual ? 'text-emerald-900' : 'text-slate-800'}`}>{total}</span>
                                                        <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                                            isAnnual 
                                                                ? 'text-emerald-700 bg-emerald-100/50 border-emerald-200/30' 
                                                                : 'text-slate-500 bg-slate-100/80 border-slate-200/50'
                                                        }`}>
                                                            CT: {ct} + Exam: {exam}
                                                        </span>
                                                    </div>
                                                );
                                            };

                                            return (
                                                <tr
                                                    key={String(
                                                        item.subjectCode ||
                                                            item.subjectId ||
                                                            item.subjectName ||
                                                            item.subject ||
                                                            idx
                                                    ).trim()}
                                                    className="hover:bg-slate-50"
                                                >
                                                    <td className="border border-slate-300 p-2.5 text-left font-bold text-slate-800">{item.subject}</td>
                                                    <td className="border border-slate-300 p-2.5">{renderMarkCell(item.term1)}</td>
                                                    <td className="border border-slate-300 p-2.5">{renderMarkCell(item.term2)}</td>
                                                    <td className="border border-slate-300 p-2.5">{renderMarkCell(item.annual, true)}</td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>

                        {/* স্বাক্ষর এলাকা */}
                        <div className="mt-16 pt-6 flex justify-between text-xs text-slate-700 font-bold border-t border-slate-200">
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-28 sm:w-32">শ্রেণী শিক্ষকের স্বাক্ষর</p></div>
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-28 sm:w-32">অভিভাবকের স্বাক্ষর</p></div>
                            <div className="text-center"><p className="border-t border-slate-400 pt-1 w-28 sm:w-32">অধ্যক্ষ / মুহতামিম</p></div>
                        </div>

                        {/* প্রিন্ট ও লিংক কপি বাটন */}
                        <div className="print:hidden mt-8 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                aria-label="Copy shareable result link"
                                className="bg-[#043e30] hover:bg-emerald-900 text-amber-300 font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer"
                            >
                                {copiedLink ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Copied! (কপি হয়েছে)</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy Link / শেয়ার</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors text-xs sm:text-sm cursor-pointer"
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

export default function StudentResultSearch() {
    return (
        <Suspense
            fallback={
                <div className="p-6 text-center text-slate-500 font-bold">
                    লোড হচ্ছে...
                </div>
            }
        >
            <StudentResultSearchContent />
        </Suspense>
    );
}
