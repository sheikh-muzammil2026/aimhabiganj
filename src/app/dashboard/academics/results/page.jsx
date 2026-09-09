'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { authClient } from '@/lib/auth-client';
import Pagination from '@/components/dashboard/Pagination';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_API ||
    'http://localhost:5000';

function ClassResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // URL search params থেকে page এবং limit সিঙ্ক (ডিফল্ট limit: 20)
    const pageParam = parseInt(searchParams.get("page"), 10);
    const limitParam = parseInt(searchParams.get("limit"), 10);

    const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const currentLimit = [10, 20, 50, 100].includes(limitParam) ? limitParam : 20;

    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [examType, setExamType] = useState('term1');
    const [year, setYear] = useState('২০২৬');

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toggling, setToggling] = useState(false);

    // URL query params আপডেট করার হেলপার ফাংশন
    const updatePaginationParams = useCallback(
        (newPage, newLimit) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(newPage));
            params.set("limit", String(newLimit || currentLimit));
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, currentLimit, pathname, router]
    );

    // ফিল্টার পরিবর্তন হলে পেজ নম্বর ১-এ রিসেট করার হেলপার
    const resetPageToFirst = useCallback(() => {
        if (currentPage !== 1) {
            updatePaginationParams(1, currentLimit);
        }
    }, [currentPage, currentLimit, updatePaginationParams]);

    // ক্লাসের ফলাফল ও পাবলিশ স্ট্যাটাস ডাটা ফেচ করা
    const fetchClassResults = useCallback(async () => {
        if (!selectedClass) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                class: selectedClass,
                year: year,
                term: examType,
                page: String(currentPage),
                limit: String(currentLimit),
            });

            const res = await fetch(`${API_BASE_URL}/api/results/class?${queryParams.toString()}`, {
                headers: {
                    'x-user-email': user?.email || '',
                    'x-user-role': user?.role || '',
                }
            });
            const data = await res.json();

            if (res.status === 403) {
                setResults([]);
                setIsPublished(false);
                setTotalPages(1);
                setTotalResults(0);
                return;
            }

            if (data.success && Array.isArray(data.data)) {
                setResults(data.data);
                setIsPublished(Boolean(data.isPublished));
                setTotalPages(data.totalPages || 1);
                setTotalResults(data.total !== undefined ? data.total : data.totalCount || data.data.length);
            } else {
                setResults([]);
                setIsPublished(Boolean(data.isPublished));
                setTotalPages(1);
                setTotalResults(0);
            }
        } catch (error) {
            console.error("Fetch Class Results Error:", error);
            toast.error("ফলাফলের তথ্য লোড করতে সমস্যা হয়েছে!");
        } finally {
            setLoading(false);
        }
    }, [selectedClass, year, examType, currentPage, currentLimit, user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClassResults();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchClassResults]);

    // অ্যাডমিন দ্বারা ফলাফল প্রকাশ / অপ্রকাশিত টগল হ্যান্ডলার
    const handleTogglePublish = async () => {
        if (!isAdmin) {
            toast.error("শুধুমাত্র অ্যাডমিন ফলাফল প্রকাশ বা অপ্রকাশিত করতে পারেন।");
            return;
        }

        setToggling(true);
        try {
            const nextStatus = !isPublished;
            const res = await fetch(`${API_BASE_URL}/api/results/publish`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': user?.email || '',
                    'x-user-role': user?.role || '',
                },
                body: JSON.stringify({
                    class: selectedClass,
                    examType: examType,
                    year: year,
                    isPublished: nextStatus
                })
            });

            const data = await res.json();
            if (data.success) {
                setIsPublished(nextStatus);
                toast.success(
                    data.message ||
                    (nextStatus
                        ? "ফলাফল সফলভাবে প্রকাশিত হয়েছে!"
                        : "ফলাফল সফলভাবে অপ্রকাশিত করা হয়েছে!")
                );
                fetchClassResults();
            } else {
                toast.error(data.message || "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।");
            }
        } catch (error) {
            console.error("Publish toggle error:", error);
            toast.error("সার্ভারে সমস্যা হয়েছে!");
        } finally {
            setToggling(false);
        }
    };

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

                {/* হেডার এবং পাবলিশ কন্ট্রোলস */}
                <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                                শ্রেণিভিত্তিক ফলাফল ও মেরিট তালিকা
                            </h1>
                            {/* পাবলিকেশন স্ট্যাটাস ব্যাজ */}
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                    isPublished
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                        : "bg-rose-50 text-rose-700 border-rose-300"
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isPublished ? "bg-emerald-500" : "bg-rose-500"
                                    }`}
                                ></span>
                                {isPublished ? "প্রকাশিত (Published)" : "অপ্রকাশিত (Unpublished)"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            শ্রেণি, পরীক্ষার ধরন এবং শিক্ষাবর্ষ অনুযায়ী সম্পূর্ণ ক্লাসের ফলাফল এক নজরে দেখুন।
                        </p>
                    </div>

                    {/* শুধুমাত্র অ্যাডমিনের জন্য পাবলিশ/আনপাবলিশ টগল বাটন */}
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleTogglePublish}
                                disabled={toggling || loading}
                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                                    isPublished
                                        ? "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700"
                                        : "bg-[#043e30] hover:bg-emerald-900 text-amber-300 border border-emerald-950"
                                }`}
                            >
                                {toggling ? (
                                    <>
                                        <span className="inline-block animate-spin">⏳</span>
                                        আপডেট হচ্ছে...
                                    </>
                                ) : isPublished ? (
                                    <>
                                        <span>🚫</span>
                                        ফলাফল অপ্রকাশিত করুন
                                    </>
                                ) : (
                                    <>
                                        <span>📢</span>
                                        ফলাফল প্রকাশ করুন
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* ফিল্টার সেকশন */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণি</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                resetPageToFirst();
                            }}
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
                            onChange={(e) => {
                                setExamType(e.target.value);
                                resetPageToFirst();
                            }}
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
                            onChange={(e) => {
                                setYear(e.target.value);
                                resetPageToFirst();
                            }}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                    </div>
                </div>

                {/* নন-অ্যাডমিন এবং ফলাফল অপ্রকাশিত থাকলে অ্যাক্সেস লক ভিউ */}
                {!isAdmin && !isPublished && !loading ? (
                    <div className="py-16 px-6 text-center bg-amber-50/60 rounded-2xl border border-amber-200 text-slate-700 max-w-xl mx-auto my-8 shadow-sm">
                        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            🔒
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">
                            ফলাফল এখনো প্রকাশ করা হয়নি
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {selectedClass} শ্রেণির {examType === "term1" ? "১ম সাময়িক" : examType === "term2" ? "২য় সাময়িক" : "বার্ষিক"} পরীক্ষার ফলাফল কর্তৃপক্ষ কর্তৃক আনুষ্ঠানিকভাবে এখনো প্রকাশিত হয়নি। ফলাফল প্রকাশিত হলে এখানে দেখা যাবে।
                        </p>
                    </div>
                ) : loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">
                        ফলাফল প্রস্তুত করা হচ্ছে...
                    </div>
                ) : results.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                        এই শ্রেণিতে কোনো ফলাফলের রেকর্ড পাওয়া যায়নি।
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        {/* অ্যাডমিন প্রিভিউ নোটিশ যদি অপ্রকাশিত অবস্থায় অ্যাডমিন দেখে */}
                        {isAdmin && !isPublished && (
                            <div className="bg-amber-100/70 border-b border-amber-300 p-3 text-xs text-amber-900 font-bold flex items-center gap-2">
                                <span>⚠️</span>
                                এটি একটি অপ্রকাশিত ফলাফল। অ্যাডমিন প্রিভিউ হিসেবে আপনি এটি দেখতে পাচ্ছেন। প্রকাশ করতে উপরের বাটনে চাপুন।
                            </div>
                        )}
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
                                                {student.roll || student.rollNumber || 'N/A'}
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

                    {/* পেজিনেশন কন্ট্রোলস */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalResults}
                        limit={currentLimit}
                        limitOptions={[10, 20, 50, 100]}
                        onPageChange={(newPage) => updatePaginationParams(newPage, currentLimit)}
                        onLimitChange={(newLimit) => updatePaginationParams(1, newLimit)}
                        itemName="items"
                    />
                </>
                )}
            </div>
        </div>
    );
}

export default function ClassResultView() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">লোড হচ্ছে...</div>}>
            <ClassResultContent />
        </Suspense>
    );
}