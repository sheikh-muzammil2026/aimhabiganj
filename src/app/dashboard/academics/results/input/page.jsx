'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// শ্রেণিভিত্তিক বিষয় তালিকা
const CLASS_SUBJECTS = {
    "কায়দা/আমপারা": ["কুরআন", "ইংরেজি", "বাংলা", "গণিত"],
    "নাজেরা": ["কুরআন", "ইংরেজি", "বাংলা", "গণিত"],
    "প্লে": ["কুরআন", "ইংরেজি", "বাংলা", "গণিত"],
    "নার্সারি": ["কুরআন", "ইংরেজি", "বাংলা", "গণিত"],
    "প্রথম": ["কুরআন", "আরবি", "আকিদাহ ও ফিকহ", "ইংরেজি", "বাংলা", "গণিত", "সাধারণ জ্ঞান"],
    "দ্বিতীয়": ["কুরআন ও তাজবীদ", "আরবি", "আকিদাহ ও ফিকহ", "ইংরেজি", "বাংলা", "গণিত", "সাধারণ জ্ঞান"],
    "তৃতীয়": ["হিফজুল কুরআন", "আরবি", "আদব ও দোয়া", "আকিদাহ ও ফিকহ", "ইংরেজি", "বাংলা", "গণিত", "সাধারণ জ্ঞান/বা ও বি", "বিজ্ঞান", "হাতের লেখা"],
    "চতুর্থ": ["হিফজুল কুরআন ও তাজবীদ", "আরবি", "আকিদাহ ও ফিকহ", "ইংরেজি", "বাংলা", "গণিত", "বিজ্ঞান/বাংলাদেশ ও বিশ্ব পরিচয়", "আদাব ও দোয়া", "এসো তামরিন"],
    "পঞ্চম": ["হিফজুল কুরআন ও তাজবীদ", "আরবি", "তামরিন", "সরফ", "আকিদাহ ও ফিকহ", "ইংরেজি", "বাংলা", "গণিত", "বিজ্ঞান"],
    "ষষ্ঠ": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ ও ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "সপ্তম": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "আরবি সাহিত্য", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "অষ্টম": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "উসুলুল হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "বিজ্ঞান"],
    "নবম": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "ইতিহাস", "উসুলুল হাদিস"],
    "দশম": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "ইতিহাস", "উসুলুল হাদিস"],
    "১১শ শ্রেণি": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "ইতিহাস"],
    "১২ শ্রেণি": ["হিফজুল কুরআন", "কুরআন অনুবাদ", "হাদিস", "আরবি", "সরফ", "নাহু", "তাওহিদ", "ফিকহ", "ইংরেজি ১ম ও ২য়", "বাংলা ১ম ও ২য়", "গণিত", "ইতিহাস"]
};

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:5000';

export default function TeacherMarkInput() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examType, setExamType] = useState('term1');
    const [year, setYear] = useState('২০২৬');

    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [studentsMarksList, setStudentsMarksList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ১. শ্রেণি পরিবর্তন হলে বিষয় ড্রপডাউন ডাইনামিকালি আপডেট
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

    // ২. শ্রেণি, বিষয়, পরীক্ষা ও বছর পরিবর্তন হলে শিক্ষার্থীদের তথ্য ও পূর্বের নম্বর ফেচ করা
    useEffect(() => {
        const fetchClassData = async () => {
            if (!selectedClass) return;

            setLoading(true);
            try {
                // ১ম ধাপ: ব্যাকএন্ড থেকে Approved শিক্ষার্থীদের তালিকা নিয়ে আসা
                const studentRes = await fetch(`${API_BASE_URL}/api/students?class=${encodeURIComponent(selectedClass)}&status=approved`);
                const studentData = await studentRes.json();

                let rawStudents = [];
                if (studentData.success && Array.isArray(studentData.data)) {
                    rawStudents = studentData.data;
                }

                // যদি কোনো বিষয় সিলেক্ট করা না থাকে
                if (!selectedSubject) {
                    const initialList = rawStudents.map(student => ({
                        studentId: student.studentId || '',
                        studentName: student.studentNameBangla || student.studentNameEnglish || 'N/A',
                        rollNumber: student.officeUse?.rollNumber || '',
                        ctMark: '',
                        examMark: ''
                    }));
                    setStudentsMarksList(initialList);
                    setLoading(false);
                    return;
                }

                // ২য় ধাপ: এই শ্রেণির উক্ত বিষয় ও টার্মের জন্য পূর্বে দেওয়া কোনো মার্কস ডেটা আছে কিনা ফেচ করা
                const markQueryParams = new URLSearchParams({
                    class: selectedClass,
                    subject: selectedSubject,
                    year: year,
                    term: examType
                });

                const marksRes = await fetch(`${API_BASE_URL}/api/results/class?${markQueryParams}`);
                const marksResult = await marksRes.json();

                let existingMarksMap = {};

                if (marksResult.success && Array.isArray(marksResult.data)) {
                    marksResult.data.forEach(item => {
                        const targetSubject = (item.allSubjects || []).find(s => s.subject === selectedSubject);
                        const termData = targetSubject?.[examType] || {};

                        existingMarksMap[item.studentId] = {
                            ctMark: termData.ct !== undefined && termData.ct !== null ? termData.ct : '',
                            examMark: termData.exam !== undefined && termData.exam !== null ? termData.exam : ''
                        };
                    });
                }

                // ৩য় ধাপ: শিক্ষার্থীদের ব্যাকএন্ড স্ট্রাকচার অনুযায়ী মার্জ করা (যদি আগে মার্কস থাকে তবে সেটা বসবে, না থাকলে ফাঁকা থাকবে)
                const mergedList = rawStudents.map(student => {
                    const id = student.studentId;
                    const existing = existingMarksMap[id];

                    return {
                        studentId: id,
                        studentName: student.studentNameBangla || student.studentNameEnglish || 'N/A',
                        rollNumber: student.officeUse?.rollNumber || 'N/A',
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
    }, [selectedClass, selectedSubject, examType, year]);

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
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">

                {/* হেডার */}
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">
                        শ্রেণিভিত্তিক মার্কস ইনপুট ও আপডেট
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        শ্রেণি ও বিষয় নির্বাচন করুন। পূর্বে ইনপুট করা নম্বর থাকলে তা দেখা যাবে, অন্যথায় খালি থাকবে।
                    </p>
                </div>

                {/* ফিল্টার বক্স */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">

                    {/* শ্রেণি সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণি নির্বাচন করুন *</label>
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
                                <option value="১২ শ্রেণি">১২ শ্রেণি</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* বিষয় সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">বিষয় নির্বাচন করুন *</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!availableSubjects.length}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none disabled:bg-slate-100"
                        >
                            {availableSubjects.length === 0 ? (
                                <option value="">বিষয় পাওয়া যায়নি</option>
                            ) : (
                                availableSubjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* টার্ম/পরীক্ষা সিলেক্ট */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার ধরন *</label>
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

                    {/* শিক্ষাবর্ষ */}
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

                {/* টেবিল লিস্ট */}
                {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">
                        শিক্ষার্থীদের তথ্য লোড হচ্ছে...
                    </div>
                ) : studentsMarksList.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                        এই শ্রেণির কোনো অনুমোদিত (Approved) শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                    </div>
                ) : (
                    <form onSubmit={handleSubmitAllMarks}>
                        <div className="mb-6 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                {/* ডেক্সটপ ও ট্যাবলেটের জন্য হেডার */}
                                <thead className="hidden sm:table-header-group">
                                    <tr className="bg-[#043e30] text-amber-300">
                                        <th className="p-3 border border-emerald-800 font-bold w-16 text-center">রোল</th>
                                        <th className="p-3 border border-emerald-800 font-bold w-28">আইডি</th>
                                        <th className="p-3 border border-emerald-800 font-bold">শিক্ষার্থীর নাম</th>
                                        <th className="p-3 border border-emerald-800 font-bold text-center w-36">সিটি</th>
                                        <th className="p-3 border border-emerald-800 font-bold text-center w-36">প্রধান পরীক্ষা</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 bg-white sm:divide-slate-100">
                                    {studentsMarksList.map((student, idx) => (
                                        <tr
                                            key={student.studentId || idx}
                                            className="flex flex-col p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors sm:table-row sm:p-0 sm:border-none"
                                        >
                                            {/* রোল */}
                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 font-bold text-slate-600 text-left sm:text-center flex justify-between items-center sm:table-cell before:content-['রোল:'] before:font-bold before:text-slate-400 sm:before:content-none">
                                                <span>{student.rollNumber}</span>
                                            </td>

                                            {/* আইডি */}
                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 font-mono font-bold text-emerald-800 flex justify-between items-center sm:table-cell before:content-['আইডি:'] before:font-bold before:text-slate-400 sm:before:content-none">
                                                <span>{student.studentId}</span>
                                            </td>

                                            {/* শিক্ষার্থীর নাম */}
                                            <td className="p-1 sm:p-3 border-none sm:border sm:border-slate-100 font-bold text-slate-800 flex justify-between items-center sm:table-cell before:content-['শিক্ষার্থীর_নাম:'] before:font-bold before:text-slate-400 sm:before:content-none">
                                                <span>{student.studentName}</span>
                                            </td>

                                            {/* সিটি */}
                                            <td className="p-1 sm:p-2 border-none sm:border sm:border-slate-100 text-center flex justify-between items-center sm:table-cell before:content-['সিটি:'] before:font-bold before:text-slate-400 sm:before:content-none mt-2 sm:mt-0">
                                                <input
                                                    type="number"
                                                    value={student.ctMark}
                                                    onChange={(e) => handleMarkChange(idx, 'ctMark', e.target.value)}
                                                    placeholder="ফাঁকা"
                                                    className="w-28 sm:w-full p-2 text-center border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                                />
                                            </td>

                                            {/* প্রধান পরীক্ষা */}
                                            <td className="p-1 sm:p-2 border-none sm:border sm:border-slate-100 text-center flex justify-between items-center sm:table-cell before:content-['প্রধান_পরীক্ষা:'] before:font-bold before:text-slate-400 sm:before:content-none mt-2 sm:mt-0">
                                                <input
                                                    type="number"
                                                    value={student.examMark}
                                                    onChange={(e) => handleMarkChange(idx, 'examMark', e.target.value)}
                                                    placeholder="ফাঁকা"
                                                    className="w-28 sm:w-full p-2 text-center border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* সেভ বাটন */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto bg-[#043e30] hover:bg-emerald-900 text-amber-400 font-extrabold px-8 py-3 rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-50"
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
