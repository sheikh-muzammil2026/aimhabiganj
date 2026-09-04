'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CLASS_SUBJECTS = {
    "প্লে": ["আরবি-০১", "ইংরেজি", "বাংলা", "গণিত"],
    "নার্সারি": ["আরবি-০২", "ইংরেজি", "বাংলা", "গণিত"],
    "প্রথম": ["কুরআন ও তাজভীদ-০১", "আরবি", "তাওহীদ ও ফিকহ-১", "ইংরেজি", "বাংলা", "গণিত", "সাধারণ জ্ঞান"],
    "দ্বিতীয়": ["কুরআন ও তাজভীদ-০২", "আরবি", "তাওহীদ ও ফিকহ-২", "ইংরেজি", "বাংলা", "গণিত", "সাধারণ জ্ঞান"],
    "তৃতীয়": ["কুরআন ও তাজভীদ-০৩", "আরবি", "আদব ও দোয়া", "তাওহীদ ও ফিকহ-৩", "ইংরেজি", "বাংলা", "গণিত", "বাংলাদেশ ও বিশ্বপরিচয়", "বিজ্ঞান", "হাতের লেখা"],
    "চতুর্থ": ["কুরআন ও তাজভীদ-০৪", "এসো আরবি শিখি", "এসো তামরিন শিখি", "আদাব ও দোয়া", "তাওহীদ ও ফিকহ-৪", "ইংরেজি", "বাংলা", "গণিত", "বাংলাদেশ ও বিশ্ব পরিচয়"],
    "পঞ্চম": ["কুরআন ও তাজভীদ-০৫", "এসো আরবি শিখি", "এসো তামরিন শিখি", "সরফ", "তাওহীদ ও ফিকহ-৫", "ইংরেজি", "বাংলা", "গণিত", "বিজ্ঞান"],
    "ষষ্ঠ": ["হিফজুল কুরআন ও তাজভীদ-০১", "কুরআন অনুবাদ-০১", "হাদিস আরবাঈন", "আরবি", "সরফ", "নাহু", "তাওহীদ ও ফিকহ-৫", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "সপ্তম": ["হিফজুল কুরআন ও তাজভীদ-০২", "কুরআন অনুবাদ-০২", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহীদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "অষ্টম": ["হিফজুল কুরআন ও তাজভীদ-০৩", "কুরআন অনুবাদ-০৩", "হাদিস", "উসুলুল হাদিস", "আরবি", "সরফ", "নাহু", "তাওহীদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "কায়দা/আমপারা": ["কুরআন", "তাজভীদ ও দোয়া", "আরবি", "ইংরেজি", "বাংলা", "গণিত"],
    "নাজেরা": ["কুরআন", "তাজভীদ ও দোয়া", "আরবি", "ইংরেজি", "বাংলা", "গণিত"],
    "সবক": ["কুরআন", "তাজভীদ ও দোয়া"],
    "শুনানি": ["কুরআন", "তাজভীদ ও দোয়া"],
};

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_API
export default function TeacherMarkInput() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examType, setExamType] = useState('term1');
    const [year, setYear] = useState('২০২৬-২০২৭');

    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [studentsMarksList, setStudentsMarksList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // পেজিনেশন স্টেটসমূহ
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [limit] = useState(10);

    // ফিল্টার চেঞ্জ হলে কারেন্ট পেজ ১ এ রি-সেট করা
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedClass, selectedSubject, examType, year]);

    // ১. শ্রেণি পরিবর্তন হলে বিষয় ড্রপডাউন ডাইনামিকালি আপডেট
    useEffect(() => {
        if (selectedClass && CLASS_SUBJECTS[selectedClass]) {
            const subjects = CLASS_SUBJECTS[selectedClass];
            setAvailableSubjects(subjects);
            setSelectedSubject(subjects[0] || '');
        } else {
            setAvailableSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedClass]);

    // ২. শ্রেণি, বিষয়, পরীক্ষা ও বছর পরিবর্তন হলে শিক্ষার্থীদের তথ্য ও পূর্বের নম্বর ফেচ করা (পেজিনেটেড)
    useEffect(() => {
        const fetchClassData = async () => {
            if (!selectedClass) return;

            setLoading(true);
            try {
                // ১ম ধাপ: ব্যাকএন্ড থেকে Approved শিক্ষার্থীদের তালিকা নিয়ে আসা (পেজিনেটেড)
                const params = new URLSearchParams({
                    class: selectedClass,
                    status: 'approved',
                    page: currentPage,
                    limit: limit
                });
                const studentRes = await fetch(`${API_BASE_URL}/api/students?${params.toString()}`);
                const studentData = await studentRes.json();

                let rawStudents = [];
                if (studentData.success && Array.isArray(studentData.data)) {
                    rawStudents = studentData.data;
                    setTotalPages(studentData.totalPages || 1);
                    setTotalStudents(studentData.total || studentData.totalCount || 0);
                } else {
                    setTotalPages(1);
                    setTotalStudents(0);
                }

                // যদি কোনো বিষয় সিলেক্ট করা না থাকে
                if (!selectedSubject) {
                    const initialList = rawStudents.map(student => ({
                        studentId: student.studentId || '',
                        studentName: student.studentNameBangla || student.studentNameEnglish || 'N/A',
                        roll: student.roll || 'N/A',
                        ctMark: '',
                        examMark: ''
                    }));
                    setStudentsMarksList(initialList);
                    setLoading(false);
                    return;
                }

                // ২য় ধাপ: /api/marks/get থেকে সরাসরি ওই বিষয় ও ক্লাসের মার্কস আনা
                const markQueryParams = new URLSearchParams({
                    class: selectedClass,
                    subject: selectedSubject,
                    year: year
                });

                const marksRes = await fetch(`${API_BASE_URL}/api/marks/get?${markQueryParams}`);
                const marksResult = await marksRes.json();

                let existingMarksMap = {};

                if (marksResult.success && Array.isArray(marksResult.data)) {
                    marksResult.data.forEach(item => {
                        const termData = item[examType] || {};
                        existingMarksMap[item.studentId] = {
                            ctMark: termData.ct !== undefined && termData.ct !== null ? termData.ct : '',
                            examMark: termData.exam !== undefined && termData.exam !== null ? termData.exam : ''
                        };
                    });
                }

                // ৩য় ধাপ: শিক্ষার্থীদের লিস্ট এবং মার্কস মার্জ করা
                const mergedList = rawStudents.map(student => {
                    const id = student.studentId;
                    const existing = existingMarksMap[id];

                    return {
                        studentId: id,
                        studentName: student.studentNameBangla || student.studentNameEnglish || 'N/A',
                        roll: student.roll || 'N/A',
                        ctMark: existing ? existing.ctMark : '',
                        examMark: existing ? existing.examMark : ''
                    };
                });

                setStudentsMarksList(mergedList);

            } catch (error) {
                console.error("Data fetch error:", error);
                toast.error("শিক্ষার্থীদের তথ্য পেতে সমস্যা হয়েছে!");
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [selectedClass, selectedSubject, examType, year, currentPage, limit]);

    // ইনপুট টাইপ পরিবর্তন হ্যান্ডেল করা
    const handleMarkChange = (index, field, value) => {
        setStudentsMarksList(prevList => {
            const updated = [...prevList];
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    // সকল শিক্ষার্থীর মার্কস একসাথে সাবমিট করা
    const handleSubmitAllMarks = async (e) => {
        e.preventDefault();
        if (studentsMarksList.length === 0) return;

        setSaving(true);
        try {
            const payload = {
                class: selectedClass,
                subject: selectedSubject,
                examType: examType,
                year: year,
                marksData: studentsMarksList
            };

            const response = await fetch(`${API_BASE_URL}/api/marks/input`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || "মার্কস সফলভাবে সংরক্ষণ করা হয়েছে!");
            } else {
                toast.error(result.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে।");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("সার্ভার কানেকশনে সমস্যা হয়েছে!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#09101d] min-h-screen">
            <div className="max-w-6xl mx-auto bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7">

                {/* হেডার */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30] dark:text-emerald-450">
                        শ্রেণিভিত্তিক মার্কস ইনপুট ও আপডেট
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        শ্রেণি ও বিষয় নির্বাচন করুন। পূর্বে ইনপুট করা নম্বর থাকলে তা দেখা যাবে, অন্যথায় খালি থাকবে।
                    </p>
                </div>

                {/* ফিল্টার বক্স */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 mb-6">

                    {/* শ্রেণি সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">শ্রেণি নির্বাচন করুন *</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        >
                            <optgroup label="-- প্রি-হিফজ --" className="dark:bg-slate-900">
                                <option value="কায়দা/আমপারা">কায়দা/আমপারা</option>
                                <option value="নাজেরা">নাজেরা</option>
                            </optgroup>
                            <optgroup label="-- হিফজ --" className="dark:bg-slate-900">
                                <option value="সবক">সবক</option>
                                <option value="শুনানি">শুনানি</option>
                            </optgroup>
                            <optgroup label="-- প্রাক-প্রাথমিক --" className="dark:bg-slate-900">
                                <option value="প্লে">প্লে</option>
                                <option value="নার্সারি">নার্সারি</option>
                            </optgroup>
                            <optgroup label="-- প্রাথমিক --" className="dark:bg-slate-900">
                                <option value="প্রথম">প্রথম</option>
                                <option value="দ্বিতীয়">দ্বিতীয়</option>
                                <option value="তৃতীয়">তৃতীয়</option>
                                <option value="চতুর্থ">চতুর্থ</option>
                                <option value="পঞ্চম">পঞ্চম</option>
                            </optgroup>
                            <optgroup label="-- মাধ্যমিক --" className="dark:bg-slate-900">
                                <option value="ষষ্ঠ">ষষ্ঠ</option>
                                <option value="সপ্তম">সপ্তম</option>
                                <option value="অষ্টম">অষ্টম</option>
                                <option value="নবম">নবম</option>
                                <option value="দশম">দশম</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* বিষয় সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">বিষয় নির্বাচন করুন *</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!availableSubjects.length}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800/40"
                        >
                            {availableSubjects.length === 0 ? (
                                <option value="">বিষয় পাওয়া যায়নি</option>
                            ) : (
                                availableSubjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* টার্ম/পরীক্ষা সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">পরীক্ষার ধরন *</label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        >
                            <option value="term1">প্রথম সাময়িক পরীক্ষা</option>
                            <option value="term2">দ্বিতীয় সাময়িক পরীক্ষা</option>
                            <option value="annual">বার্ষিক পরীক্ষা</option>
                        </select>
                    </div>

                    {/* শিক্ষাবর্ষ */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">শিক্ষাবর্ষ</label>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                    </div>
                </div>

                {/* টেবিল লিস্ট */}
                {loading ? (
                    <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        শিক্ষার্থীদের তথ্য লোড হচ্ছে...
                    </div>
                ) : studentsMarksList.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                        এই শ্রেণির কোনো অনুমোদিত (Approved) শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                    </div>
                ) : (
                    <form onSubmit={handleSubmitAllMarks}>
                        <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead className="hidden sm:table-header-group">
                                    <tr className="bg-[#043e30] dark:bg-emerald-950 text-amber-300 dark:text-amber-450">
                                        <th className="p-3 border border-emerald-800 dark:border-slate-850 font-bold w-16 text-center">রোল</th>
                                        <th className="p-3 border border-emerald-800 dark:border-slate-850 font-bold w-28">আইডি</th>
                                        <th className="p-3 border border-emerald-800 dark:border-slate-850 font-bold">শিক্ষার্থীর নাম</th>
                                        <th className="p-3 border border-emerald-800 dark:border-slate-850 font-bold text-center w-36">সিটি</th>
                                        <th className="p-3 border border-emerald-800 dark:border-slate-850 font-bold text-center w-36">প্রধান পরীক্ষা</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 dark:divide-slate-850 bg-white dark:bg-[#0f172a] sm:divide-slate-100 dark:sm:divide-slate-800">
                                    {studentsMarksList.map((student, idx) => (
                                        <tr
                                            key={student.studentId || idx}
                                            className="flex flex-col p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors sm:table-row sm:p-0 sm:border-none"
                                        >
                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 dark:sm:border-slate-850 font-bold text-slate-600 dark:text-slate-350 text-left sm:text-center flex justify-between items-center sm:table-cell before:content-['রোল:'] before:font-bold before:text-slate-500 sm:before:content-none">
                                                <span>{student.roll}</span>
                                            </td>

                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 dark:sm:border-slate-850 font-mono font-bold text-emerald-800 dark:text-emerald-350 flex justify-between items-center sm:table-cell before:content-['আইডি:'] before:font-bold before:text-slate-500 sm:before:content-none">
                                                <span>{student.studentId}</span>
                                            </td>

                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 dark:sm:border-slate-850 font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center sm:table-cell before:content-['শিক্ষার্থীর_নাম:'] before:font-bold before:text-slate-500 sm:before:content-none">
                                                <span>{student.studentName}</span>
                                            </td>

                                            <td className="p-1 sm:p-2 border-none sm:border sm:border-slate-100 dark:sm:border-slate-850 text-center flex justify-between items-center sm:table-cell before:content-['সিটি:'] before:font-bold before:text-slate-500 sm:before:content-none mt-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    step="any"
                                                    min="0"
                                                    value={student.ctMark}
                                                    onChange={(e) => handleMarkChange(idx, 'ctMark', e.target.value)}
                                                    placeholder="ফাঁকা"
                                                    className="w-28 sm:w-full p-2 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                                />
                                            </td>

                                            <td className="p-1 sm:p-2 border-none sm:border sm:border-slate-100 dark:sm:border-slate-850 text-center flex justify-between items-center sm:table-cell before:content-['প্রধান_পরীক্ষা:'] before:font-bold before:text-slate-500 sm:before:content-none mt-2 sm:mt-0">
                                                <input
                                                    type="text"
                                                    step="any"
                                                    min="0"
                                                    value={student.examMark}
                                                    onChange={(e) => handleMarkChange(idx, 'examMark', e.target.value)}
                                                    placeholder="ফাঁকা"
                                                    className="w-28 sm:w-full p-2 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ৫. পেজিনেশন কন্ট্রোলস */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#0f172a] p-4 border border-slate-200 dark:border-slate-850 mt-2 mb-6 rounded-xl">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                পেজ {currentPage} এর {totalPages} (মোট {totalStudents} জন শিক্ষার্থী)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ◀ পূর্ববর্তী (Previous)
                                </button>
                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    পরবর্তী (Next) ▶
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto bg-[#043e30] hover:bg-emerald-900 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-amber-400 font-extrabold px-8 py-3 rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-50"
                            >
                                {saving ? "সংরক্ষণ হচ্ছে..." : "সকল মার্কস সংরক্ষণ করুন"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}