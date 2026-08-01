'use client';

import { useState, useEffect } from 'react';

export default function TeacherMarkInput() {
    const [selectedClass, setSelectedClass] = useState('প্রথম');
    const [selectedSubject, setSelectedSubject] = useState('আল-কুরআন');
    const [examType, setExamType] = useState('term1'); // term1, term2, annual
    const [year, setYear] = useState('২০২৬-২০২৭');
    
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { data: session } = authClient.useSession();
    const user = session?.user;
    // ১. নির্বাচিত ক্লাসের স্টুডেন্ট ডাটা লোড করা
   
// ১. নির্বাচিত ক্লাসের স্টুডেন্ট ডাটা লোড করা
useEffect(() => {
    const fetchStudents = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // API কল - স্ট্যাটাস Approved/approved যাই পাঠানো হোক ব্যাকএন্ড হ্যান্ডেল করবে
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/students?class=${encodeURIComponent(selectedClass)}&status=Approved`);
            const data = await res.json();
            
            if (data.success) {
                setStudents(data.data);
                
                // প্রারম্ভিক মার্ক অবজেক্ট সেটআপ
                const initialMarks = {};
                data.data.forEach(std => {
                    if (std.studentId) {
                        initialMarks[std.studentId] = {
                            ctMark: '',
                            examMark: ''
                        };
                    }
                });
                setMarksData(initialMarks);
            } else {
                setStudents([]);
            }
        } catch (err) {
            console.error("Student Fetch Error:", err);
            setMessage({ type: 'error', text: 'শিক্ষার্থীদের তালিকা লোড করতে ব্যর্থ হয়েছে।' });
        } finally {
            setLoading(false);
        }
    };

    if (selectedClass) {
        fetchStudents();
    }
}, [selectedClass]);

    // মার্ক ইনপুট হ্যান্ডলার
    const handleMarkChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    // সকল মার্কস সেভ করা
    const handleSubmitMarks = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });
        const currentTeacherId = user?.id || user?.email || "UNKNOWN-TEACHER";

        try {
            const requests = students.map(student => {
                const markInfo = marksData[student.studentId] || {};
                return fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/marks/input`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: student.studentId,
                        studentName: student.studentNameBangla || student.studentNameEnglish,
                        class: selectedClass,
                        subject: selectedSubject,
                        examType,
                        ctMark: markInfo.ctMark,
                        examMark: markInfo.examMark,
                        year,
                        teacherId: currentTeacherId // ব্যাকএন্ডে সেশন থেকে নেওয়া সম্ভব
                    })
                });
            });

            await Promise.all(requests);
            setMessage({ type: 'success', text: 'সকল শিক্ষার্থীর নম্বর সফলভাবে সংরক্ষিত হয়েছে!' });
        } catch (error) {
            console.error("Submit Error:", error);
            setMessage({ type: 'error', text: 'নম্বর সংরক্ষণ করতে সমস্যা হয়েছে।' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#043e30]">পরীক্ষার নম্বর ইনপুট প্যানেল</h1>
                        <p className="text-xs text-slate-500 mt-1">শিক্ষার্থীদের বিষয়ভিত্তিক নম্বর সহজে এন্ট্রি এবং আপডেট করুন</p>
                    </div>
                    <span className="mt-2 md:mt-0 text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 w-fit">
                        সেশন: {year}
                    </span>
                </div>

                {/* ফিল্টারিং সেকশন */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
                    <div>
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

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">বিষয়</label>
                        <select 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        >
                            <option value="আল-কুরআন">আল-কুরআন</option>
                            <option value="আল-হাদিস">আল-হাদিস</option>
                            <option value="আল-ফিকাহ">আল-ফিকাহ</option>
                            <option value="আরবি">আরবি</option>
                            <option value="বাংলা">বাংলা</option>
                            <option value="ইংরেজি">ইংরেজি</option>
                            <option value="গণিত">গণিত</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার ধরণ</label>
                        <select 
                            value={examType} 
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold text-emerald-900"
                        >
                            <option value="term1">১ম সাময়িক ও CT</option>
                            <option value="term2">২য় সাময়িক ও CT</option>
                            <option value="annual">বার্ষিক পরীক্ষা ও CT</option>
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

                {/* এলার্ট বার্তা */}
                {message.text && (
                    <div className={`p-3.5 mb-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between ${
                        message.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold">✕</button>
                    </div>
                )}

                {/* স্টুডেন্ট মার্কস টেবিল */}
                {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">শিক্ষার্থীদের তালিকা লোড হচ্ছে...</div>
                ) : students.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                        উক্ত শ্রেণীতে কোনো শিক্ষার্থী পাওয়া যায়নি।
                    </div>
                ) : (
                    <form onSubmit={handleSubmitMarks}>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-[#043e30] text-amber-300">
                                        <th className="p-3 border-b border-emerald-800 font-bold w-16 text-center">রোল</th>
                                        <th className="p-3 border-b border-emerald-800 font-bold w-28">আইডি</th>
                                        <th className="p-3 border-b border-emerald-800 font-bold">শিক্ষার্থীর নাম</th>
                                        <th className="p-3 border-b border-emerald-800 font-bold w-36 text-center">CT মার্কস (২০)</th>
                                        <th className="p-3 border-b border-emerald-800 font-bold w-36 text-center">পরীক্ষার মার্কস (৮০)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {students.map((student) => {
                                        const sId = student.studentId;
                                        return (
                                            <tr key={sId} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-3 text-center font-black text-slate-700">
                                                    {student.officeUse?.rollNumber || student.rollNumber || "N/A"}
                                                </td>
                                                <td className="p-3 font-mono font-bold text-emerald-800">{sId}</td>
                                                <td className="p-3 font-bold text-slate-800">
                                                    {student.studentNameBangla || student.studentNameEnglish}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="number"
                                                        max="20"
                                                        min="0"
                                                        placeholder="0"
                                                        value={marksData[sId]?.ctMark || ''}
                                                        onChange={(e) => handleMarkChange(sId, 'ctMark', e.target.value)}
                                                        className="w-20 text-center border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-amber-400 focus:outline-none font-semibold text-slate-800"
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="number"
                                                        max="80"
                                                        min="0"
                                                        placeholder="0"
                                                        value={marksData[sId]?.examMark || ''}
                                                        onChange={(e) => handleMarkChange(sId, 'examMark', e.target.value)}
                                                        className="w-20 text-center border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold text-slate-800"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#043e30] hover:bg-emerald-900 text-amber-400 font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 text-xs sm:text-sm flex items-center gap-2"
                            >
                                {submitting ? 'সংরক্ষণ হচ্ছে...' : '💾 সকল প্রাপ্ত নম্বর সংরক্ষণ করুন'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
