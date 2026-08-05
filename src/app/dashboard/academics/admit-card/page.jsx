'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function AdmitCardGenerator() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // পরীক্ষার তথ্য স্টেটসমূহ (Admit Card Customization)
    const [examName, setExamName] = useState('প্রথম সাময়িক পরীক্ষা');
    const [examTime, setExamTime] = useState('সকাল ৯:০০ টা হইতে দুপুর ১২:০০ টা পর্যন্ত');

    // ফিল্টারিং স্টেটসমূহ
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSession, setSelectedSession] = useState('all');
    const [selectedDivision, setSelectedDivision] = useState('all');
    const [selectedAcademyType, setSelectedAcademyType] = useState('all');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedFeeCategory, setSelectedFeeCategory] = useState('all');

    // ১. Backend থেকে স্টুডেন্ট ডাটা ফেচ করা
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?status=Approved`
            );
            const result = await response.json();

            if (result.success) {
                setStudents(result.data || []);
            } else {
                setError(result.message || 'শিক্ষার্থীদের তথ্য লোড করা যায়নি।');
            }
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
        }
        finally {
            setLoading(false);
        }
    };

    // একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
    const getAcademyClasses = (academyType) => {
        if (academyType === 'প্রাক-প্রাথমিক') return ['প্লে', 'নার্সারি'];
        if (academyType === 'প্রাথমিক')
            return ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম'];
        if (academyType === 'মাধ্যমিক')
            return ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'];
        if (academyType === 'উচ্চমাধ্যমিক') return ['১১শ শ্রেণি', '১২ব শ্রেণি'];
        return [];
    };

    // বিভাগ অনুযায়ী ক্লাসের ড্রপডাউন অপশন
    const getClassOptions = () => {
        if (selectedDivision === 'preHifz') {
            return ['কায়দা/আমপারা', 'নাজেরা'];
        }
        if (selectedDivision === 'hifz') {
            return ['সবক', 'শুনানি'];
        }
        if (selectedDivision === 'academy') {
            if (selectedAcademyType !== 'all') {
                return getAcademyClasses(selectedAcademyType);
            }
            return [
                'প্লে',
                'নার্সারি',
                'প্রথম',
                'দ্বিতীয়',
                'তৃতীয়',
                'চতুর্থ',
                'পঞ্চম',
                'ষষ্ঠ',
                'সপ্তম',
                'অষ্টম',
                'নবম',
                'দশম',
                '১১শ শ্রেণি',
                '১২ব শ্রেণি',
            ];
        }
        return [];
    };

    // শিক্ষার্থীর একটিভ বিভাগ, ক্লাস ও টাইপ বের করার হেলপার ফাংশন
    const getStudentClassDetails = (student) => {
        if (student?.divisionPreHifz?.active) {
            return {
                divisionKey: 'preHifz',
                divisionName: 'প্রি-হিফজ',
                className: student.divisionPreHifz.class || 'N/A',
                type: student.divisionPreHifz.type || 'N/A',
                academyType: '',
            };
        }
        if (student?.divisionHifz?.active) {
            return {
                divisionKey: 'hifz',
                divisionName: 'হিফজ',
                className: student.divisionHifz.class || 'N/A',
                type: student.divisionHifz.type || 'N/A',
                academyType: '',
            };
        }
        if (student?.divisionAcademy?.active) {
            return {
                divisionKey: 'academy',
                divisionName: 'একাডেমিক',
                className: student.divisionAcademy.class || 'N/A',
                type: student.divisionAcademy.type || 'N/A',
                academyType: student.divisionAcademy.academyType || '',
            };
        }
        return {
            divisionKey: 'none',
            divisionName: 'অন্যান্য',
            className: student?.officeUse?.recommendedClass || 'N/A',
            type: 'N/A',
            academyType: '',
        };
    };

    // ডায়নামিক ফিল্টারিং লজিক
    const filteredStudents = students.filter((student) => {
        const details = getStudentClassDetails(student);

        const matchesSearch =
            !searchTerm ||
            student.studentNameBangla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentNameEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toString().includes(searchTerm) ||
            student.fatherNameBangla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.fatherMobile?.includes(searchTerm) ||
            student.guardianMobile?.includes(searchTerm) ||
            student.currentAddress?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.permanentAddress?.district?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSession =
            selectedSession === 'all' || student.sessionYear === selectedSession;

        const matchesDivision =
            selectedDivision === 'all' || details.divisionKey === selectedDivision;

        const matchesAcademyType =
            selectedAcademyType === 'all' || details.academyType === selectedAcademyType;

        const matchesClass =
            selectedClass === 'all' || details.className === selectedClass;

        const matchesType =
            selectedType === 'all' || details.type === selectedType;

        const matchesFeeCategory =
            selectedFeeCategory === 'all' ||
            (student.officeUse?.feeCategory || '') === selectedFeeCategory;

        return (
            matchesSearch &&
            matchesSession &&
            matchesDivision &&
            matchesAcademyType &&
            matchesClass &&
            matchesType &&
            matchesFeeCategory
        );
    });

    const sessionYears = [
        '২০২৬-২০২৭',
        '২০২৫-২০২৬',
        '২০২৪-২০২৫',
        '২০২৩-২০২৪',
        '২০২২-২০২৩',
        '২০২১-২০২২',
    ];

    const uniqueFeeCategories = [
        ...new Set(students.map((s) => s.officeUse?.feeCategory).filter(Boolean)),
    ];

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = filteredStudents.map((s) => s._id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectStudent = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const studentsToPrint = students.filter((s) => selectedIds.includes(s._id));

    return (
        <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
            {/* প্রিন্ট সিএসএস ফিক্স */}
            <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

            {/* ----------------- ১. এডমিন কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
            <div className="print:hidden max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
                    এডমিট কার্ড জেনারেটর ড্যাশবোর্ড
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* পরীক্ষা কনফিগারেশন সেকশন (ড্রপডাউন সহ) */}
                <div className="bg-sky-50 p-3 rounded-md mb-4 border border-sky-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            পরীক্ষার নাম সিলেক্ট করুন
                        </label>
                        <select
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                            <option value="প্রথম সাময়িক পরীক্ষা">প্রথম সাময়িক পরীক্ষা</option>
                            <option value="দ্বিতীয় সাময়িক পরীক্ষা">দ্বিতীয় সাময়িক পরীক্ষা</option>
                            <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            পরীক্ষার সময়
                        </label>
                        <input
                            type="text"
                            value={examTime}
                            onChange={(e) => setExamTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
                            placeholder="যেমন: সকাল ৯:০০ টা হইতে দুপুর ১২:০০ টা পর্যন্ত"
                        />
                    </div>
                </div>

                {/* ফিল্টারিং অপশনসমূহ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            খুঁজুন (নাম/আইডি/মোবাইল)
                        </label>
                        <input
                            type="text"
                            placeholder="নাম, আইডি, রোল বা ফোন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            শিক্ষাবর্ষ / সেশন
                        </label>
                        <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">সকল সেশন</option>
                            {sessionYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            বিভাগ (Division)
                        </label>
                        <select
                            value={selectedDivision}
                            onChange={(e) => {
                                setSelectedDivision(e.target.value);
                                setSelectedAcademyType('all');
                                setSelectedClass('all');
                            }}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">সকল বিভাগ</option>
                            <option value="preHifz">প্রি-হিফজ</option>
                            <option value="hifz">হিফজ</option>
                            <option value="academy">একাডেমিক</option>
                        </select>
                    </div>

                    {selectedDivision === 'academy' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                একাডেমি টাইপ
                            </label>
                            <select
                                value={selectedAcademyType}
                                onChange={(e) => {
                                    setSelectedAcademyType(e.target.value);
                                    setSelectedClass('all');
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">সকল টাইপ</option>
                                <option value="প্রাক-প্রাথমিক">প্রাক-প্রাথমিক</option>
                                <option value="প্রাথমিক">প্রাথমিক</option>
                                <option value="মাধ্যমিক">মাধ্যমিক</option>
                                <option value="উচ্চমাধ্যমিক">উচ্চমাধ্যমিক</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            শ্রেণি / জামাত
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            disabled={selectedDivision === 'all'}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="all">সকল শ্রেণি</option>
                            {getClassOptions().map((cls) => (
                                <option key={cls} value={cls}>
                                    {cls}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            আবাসিক স্ট্যাটাস
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">সকল টাইপ</option>
                            <option value="আবাসিক">আবাসিক</option>
                            <option value="অনাবাসিক">অনাবাসিক</option>
                            <option value="ডে-কেয়ার">ডে-কেয়ার</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            ফি ক্যাটাগরি
                        </label>
                        <select
                            value={selectedFeeCategory}
                            onChange={(e) => setSelectedFeeCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">সকল ফি ক্যাটাগরি</option>
                            {uniqueFeeCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t pt-4 mb-4">
                    <span className="text-xs sm:text-sm text-gray-600 font-semibold text-center sm:text-left">
                        মোট স্টুডেন্ট: {filteredStudents.length} জন | সিলেক্ট করা হয়েছে: {selectedIds.length} জন
                    </span>
                    <button
                        onClick={handlePrint}
                        disabled={selectedIds.length === 0}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-md font-bold text-sm sm:text-base text-white transition ${selectedIds.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 shadow-lg'
                            }`}
                    >
                        🖨️ সিলেক্টেড এডমিট কার্ড প্রিন্ট করুন ({selectedIds.length})
                    </button>
                </div>

                {/* ----------------- স্টুডেন্ট লিস্ট টেবিল ----------------- */}
                <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="overflow-x-auto max-h-72">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-100 sticky top-0 border-b">
                                <tr>
                                    <th className="p-3">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={
                                                filteredStudents.length > 0 &&
                                                selectedIds.length === filteredStudents.length
                                            }
                                        />
                                    </th>
                                    <th className="p-3">ছবি</th>
                                    <th className="p-3">আইডি / রোল</th>
                                    <th className="p-3">নাম</th>
                                    <th className="p-3">বিভাগ ও শ্রেণি</th>
                                    <th className="p-3">মোবাইল</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            ডাটা লোড হচ্ছে...
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            কোনো শিক্ষার্থী পাওয়া যায়নি!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const details = getStudentClassDetails(student);
                                        return (
                                            <tr key={student._id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(student._id)}
                                                        onChange={() => handleSelectStudent(student._id)}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <img
                                                        src={student.photoUrl || '/placeholder-student.jpg'}
                                                        alt={student.studentNameEnglish || 'Student'}
                                                        className="w-8 h-8 rounded-full object-cover border"
                                                    />
                                                </td>
                                                <td className="p-3 font-medium text-gray-700">
                                                    {student.studentId || student.roll || 'N/A'}
                                                </td>
                                                <td className="p-3 font-medium text-gray-800">
                                                    {student.studentNameBangla || student.studentNameEnglish}
                                                </td>
                                                <td className="p-3">
                                                    {details.divisionName} - {details.className}
                                                </td>
                                                <td className="p-3">
                                                    {student.fatherMobile || student.guardianMobile || 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ----------------- ২. এডমিট কার্ড ভিউ (প্রিন্টের সময় শো করবে) ----------------- */}
            {selectedIds.length === 0 ? (
                <div className="print:hidden text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 max-w-7xl mx-auto">
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                        প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox Select) করুন।
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8">
                    {studentsToPrint.map((student) => {
                        const details = getStudentClassDetails(student);
                        return (
                            <div
                                key={student._id}
                                className="page-break w-[210mm] bg-white border-2 border-gray-400 p-6 relative font-sans text-gray-800 shadow-lg print:shadow-none print:m-0 print:border-2"
                            >
                                {/* ১. ওয়াটারমার্ক */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
                                    <img
                                        src="/aimlogo1.png"
                                        alt="Watermark Logo"
                                        className="w-[340px] h-[340px] object-contain"
                                    />
                                </div>

                                {/* ২. হেডার সেকশন */}
                                <div className="flex justify-between items-center border-b pb-3 relative z-10">
                                    {/* <div className="w-24 flex justify-start">
                                        <img
                                            src="/logo.png"
                                            alt="Madrasah Logo"
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div> */}
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-200">
                                        <Image
                                            src="/aimlogo1.png"
                                            alt="AIM Logo"
                                            width={56}
                                            height={56}
                                            quality={100}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="text-center flex-1 px-2">
                                        <h1 className="text-2xl font-bold text-indigo-950 tracking-wide font-serif">
                                            مدرسة السلام النموذجية
                                        </h1>
                                        <h2 className="text-2xl font-black text-red-600 leading-tight">
                                            আস-সালাম আইডিয়াল মাদ্রাসা (AIM)
                                        </h2>
                                        <h3 className="text-xl font-bold text-red-600">
                                            As-Salam Ideal Madrasah
                                        </h3>
                                        <p className="text-xs font-semibold text-sky-600 tracking-wider mt-0.5">
                                            <span className="text-cyan-500 font-bold">AiM</span> For Ultimate Success
                                        </p>
                                    </div>

                                    <div className="w-24 flex justify-end">
                                        <img
                                            src={student.photoUrl || '/placeholder-student.jpg'}
                                            alt="Student Photo"
                                            className="w-24 h-28 object-cover border-2 border-green-500 p-0.5"
                                        />
                                    </div>
                                </div>

                                {/* ৩. এডমিট কার্ড ব্যাজ ও পরীক্ষার সাল */}
                                <div className="relative z-10 my-3 text-center">
                                    <span className="bg-cyan-100 text-cyan-900 text-sm font-bold px-4 py-1 rounded-md border border-cyan-300 inline-block">
                                        এডমিট কার্ড
                                    </span>
                                    <p className="text-xs font-semibold mt-2 text-gray-800">
                                        ({examName} {student.sessionYear || ''})
                                    </p>
                                    <p className="text-base font-bold mt-1 text-gray-900">
                                        শ্রেণি: {details.className}
                                    </p>
                                </div>

                                {/* ৪. পরীক্ষার্থীর বিস্তারিত তথ্য গ্রিড */}
                                <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-2 my-4 text-sm font-semibold border-t border-b py-3 px-2">
                                    <div className="flex">
                                        <span className="w-32 text-gray-700">পরীক্ষার্থীর নাম:</span>
                                        <span className="font-bold text-gray-900">
                                            {student.studentNameBangla || student.studentNameEnglish || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-700">আইডি:</span>
                                        <span className="font-bold text-gray-900">{student.studentId || 'N/A'}</span>
                                    </div>

                                    <div className="flex">
                                        <span className="w-32 text-gray-700">পিতার নাম:</span>
                                        <span className="font-bold text-gray-900">{student.fatherNameBangla || 'N/A'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-700">রোল নং:</span>
                                        <span className="font-bold text-gray-900">{student.roll || 'N/A'}</span>
                                    </div>

                                    <div className="flex">
                                        <span className="w-32 text-gray-700">উপজেলা/থানা:</span>
                                        <span className="font-bold text-gray-900">
                                            {student.currentAddress?.upazila || student.permanentAddress?.upazila || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-700">হল নং:</span>
                                        <span className="font-bold text-gray-900">{student.hallNo || 'N/A'}</span>
                                    </div>

                                    <div className="flex">
                                        <span className="w-32 text-gray-700">জেলা:</span>
                                        <span className="font-bold text-gray-900">
                                            {student.currentAddress?.district || student.permanentAddress?.district || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-700">সিট নং:</span>
                                        <span className="font-bold text-gray-900">{student.seatNo || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* ৫. স্বাক্ষর সেকশন */}
                                <div className="relative z-10 flex justify-between items-end my-6 px-8 text-xs font-bold">
                                    <div className="text-center">
                                        <div className="h-7 flex items-end justify-center"></div>
                                        <p className="border-t border-gray-600 pt-1 text-gray-800">
                                            পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="h-7 flex items-end justify-center"></div>
                                        <p className="border-t border-gray-600 pt-1 text-gray-800">
                                            প্রিন্সিপাল এর স্বাক্ষর
                                        </p>
                                    </div>
                                </div>

                                {/* ৬. পরীক্ষার রুটিন */}
                                <div className="relative z-10 mt-4">
                                    <h4 className="text-center font-bold text-base mb-2 text-gray-900">
                                        পরীক্ষার রুটিন
                                    </h4>
                                    <table className="w-full border-collapse border border-gray-300 text-xs text-center">
                                        <thead>
                                            <tr className="bg-gray-100 font-bold">
                                                <th className="border border-gray-300 p-1.5 w-1/4">তারিখ</th>
                                                <th className="border border-gray-300 p-1.5 w-1/4">বার</th>
                                                <th className="border border-gray-300 p-1.5 w-2/4">বিষয়</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.routine && student.routine.length > 0 ? (
                                                student.routine.map((item, index) => (
                                                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                        <td className="border border-gray-300 p-1.5">{item.date}</td>
                                                        <td className="border border-gray-300 p-1.5">{item.day}</td>
                                                        <td className="border border-gray-300 p-1.5 font-medium">{item.subject}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="border border-gray-300 p-2 text-gray-500">
                                                        রুটিন নির্ধারণ করা হয়নি
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ৭. বিশেষ নির্দেশাবলী ও ফুটার */}
                                <div className="relative z-10 mt-4 text-[11px] leading-relaxed text-gray-800">
                                    <p className="font-bold">
                                        দৃষ্টি আকর্ষণ: <span className="font-bold ml-4">বি: দ্র: সকল বিভাগের পরীক্ষার সময় {examTime}</span>
                                    </p>

                                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-900 font-medium">
                                        <li>পরীক্ষা শুরু হওয়ার ২০ মিনিট পূর্বে পরীক্ষা কক্ষে প্রবেশ করে নিজ আসনে বসতে হবে</li>
                                        <li>এডমিট কার্ড, আইডি কার্ড সাথে নিয়ে আসতে হবে</li>
                                        <li>মাদরাসার ড্রেস পরে আসতে হবে</li>
                                        <li>কলম/পেন্সিল, রাবারসহ প্রয়োজনীয় জিনিস সঙ্গে আনতে হবে</li>
                                    </ul>

                                    <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-gray-700 font-medium">
                                        <span>Contact: 01316-209201, 01748-868161</span>
                                        <span>🌐 www.aimhabiganj.com</span>
                                        <span>✉️ aimhabiganj@gmail.com</span>
                                    </div>


                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}