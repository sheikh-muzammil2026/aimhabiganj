'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function AdmitCardGenerator() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // এডমিট কার্ডের জন্য ডায়নামিক ডাটা ও স্টেটসমূহ
    const [admitCards, setAdmitCards] = useState([]);
    const [loadingAdmitCards, setLoadingAdmitCards] = useState(false);
    const [admitCardsError, setAdmitCardsError] = useState(null);

    // পরীক্ষার তথ্য স্টেটসমূহ (Admit Card Customization)
    const [examName, setExamName] = useState('');
    const [examList, setExamList] = useState([]);
    const [examTime, setExamTime] = useState('');

    // ফিল্টারিং স্টেটসমূহ
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSession, setSelectedSession] = useState('all');
    const [selectedDivision, setSelectedDivision] = useState('all');
    const [selectedAcademyType, setSelectedAcademyType] = useState('all');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedFeeCategory, setSelectedFeeCategory] = useState('all');

    // ১. Backend থেকে স্টুডেন্ট ও পরীক্ষার তালিকা ফেচ করা
    useEffect(() => {
        fetchStudents();
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/admit-cards/exams`
            );
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                setExamList(result.data);
                setExamName(result.data[0]);
            }
        } catch (err) {
            console.error('Error fetching exams list:', err);
        }
    };

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

    // ২. সিলেক্টেড স্টুডেন্ট ও পরীক্ষার তথ্যের ভিত্তিতে ব্যাকএন্ড থেকে এডমিট কার্ডের ডাটা ফেচ করা
    useEffect(() => {
        const fetchAdmitCards = async () => {
            if (selectedIds.length === 0) {
                setAdmitCards([]);
                return;
            }
            try {
                setLoadingAdmitCards(true);
                setAdmitCardsError(null);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_API}/api/admit-cards?studentIds=${selectedIds.join(',')}&examName=${encodeURIComponent(examName)}`
                );
                const result = await response.json();
                if (result.success) {
                    setAdmitCards(result.data || []);
                } else {
                    setAdmitCardsError(result.message || 'এডমিট কার্ডের তথ্য লোড করা যায়নি।');
                }
            } catch (err) {
                console.error('Error fetching admit cards:', err);
                setAdmitCardsError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
            } finally {
                setLoadingAdmitCards(false);
            }
        };

        fetchAdmitCards();
    }, [selectedIds, examName]);

    // একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
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
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    @page {
      size: 148mm 210mm;
      margin: 0;
    }
    /* Hide non-printable elements by visibility */
    body * {
      visibility: hidden;
    }
    .print-area-container,
    .print-area-container * {
      visibility: visible;
    }
    .print-area-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 148mm;
      margin: 0 !important;
      padding: 0 !important;
    }
    .page-break {
      visibility: visible !important;
      page-break-after: always !important;
      break-after: page !important;
      width: 148mm !important;
      height: 210mm !important;
      min-height: 210mm !important;
      max-height: 210mm !important;
      margin: 0 !important;
      padding: 10px 14px !important;
      border: 6px double #C5A059 !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: white !important;
      position: relative !important;
      overflow: hidden !important;
    }

    /* A5 scaling overrides */
    .print-logo-container {
      width: 52px !important;
      height: 52px !important;
    }
    .print-banner-container {
      max-height: 40px !important;
    }
    .print-photo-container {
      width: 60px !important;
      height: 70px !important;
    }
    .print-title {
      font-size: 16px !important;
      line-height: 1.1 !important;
    }
    .print-subtitle {
      font-size: 10px !important;
      margin-top: 1px !important;
    }
    .print-class-info {
      font-size: 12px !important;
      margin-top: 1px !important;
    }
    .print-details-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 4px 10px !important;
      margin: 6px 0 !important;
      font-size: 10px !important;
      padding: 0 4px !important;
    }
    .print-details-grid span {
      font-size: 10px !important;
    }
    .print-label {
      width: 72px !important;
    }
    .print-label-right {
      width: 50px !important;
    }
    .print-signature-section {
      margin: 8px 0 2px 0 !important;
      padding: 0 10px !important;
      display: flex !important;
      justify-content: space-between !important;
      position: relative !important;
    }
    .print-signature-box {
      width: 100px !important;
      position: relative !important;
      text-align: center !important;
    }
    .print-signature-line {
      width: 90px !important;
      border-top: 1px solid #000 !important;
      margin: 0 auto 2px auto !important;
    }
    .print-signature-text {
      font-size: 8px !important;
    }
    .print-signature-img {
      height: 24px !important;
      width: 48px !important;
      position: absolute !important;
      bottom: 15px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      object-fit: contain !important;
    }
    .print-routine-section {
      margin: 4px 0 !important;
    }
    .print-routine-title {
      font-size: 11px !important;
      margin-bottom: 2px !important;
    }
    .print-routine-table th,
    .print-routine-table td {
      font-size: 9px !important;
      padding: 2px 6px !important;
    }
    .print-instructions-section {
      margin: 4px 0 !important;
      font-size: 8px !important;
      line-height: 1.2 !important;
    }
    .print-instructions-title {
      font-size: 9px !important;
    }
    .print-footer {
      font-size: 8px !important;
      padding-top: 3px !important;
      margin-top: auto !important;
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
                            পরীক্ষার সময়
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
            ) : loadingAdmitCards ? (
                <div className="print:hidden text-center py-8 sm:py-12 bg-white rounded-lg border p-4 max-w-7xl mx-auto flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                        এডমিট কার্ডের তথ্য লোড করা হচ্ছে...
                    </p>
                </div>
            ) : admitCardsError ? (
                <div className="print:hidden text-center py-8 sm:py-12 bg-red-50 text-red-600 rounded-lg border border-red-200 p-4 max-w-7xl mx-auto">
                    <p className="text-sm sm:text-base font-semibold">
                        ত্রুটি: {admitCardsError}
                    </p>
                </div>
            ) : admitCards.length === 0 ? (
                <div className="print:hidden text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 max-w-7xl mx-auto">
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                        কোনো এডমিট কার্ডের তথ্য পাওয়া যায়নি।
                    </p>
                </div>
            ) : (
                <div className="print-area-container flex flex-col items-center gap-8">
                    {admitCards.map((card) => {
                        return (
                            <div
                                key={card._id || card.studentId}
                                className="page-break w-[210mm] min-h-[297mm] bg-white border-[10px] border-double border-[#C5A059] p-8 relative font-sans text-gray-800 shadow-2xl print:shadow-none print:m-0 print:border-[8px] box-border flex flex-col justify-between"
                            >
                                {/* ওয়াটারমার্ক (Watermark) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.05]">
                                    <Image
                                        src="/aimlogo1.png"
                                        alt="Watermark Logo"
                                        width={400}
                                        height={400}
                                        className="object-contain"
                                    />
                                </div>

                                <div className="relative z-10">
                                    {/* ১. হেডার সেকশন: Logo + Optimized Banner + Student Photo */}
                                    <div className="flex justify-between items-center pb-2 relative">
                                        {/* মাদ্রাসার লোগো */}
                                        <div className="print-logo-container w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center">
                                            <Image
                                                src={"/aimlogo1.png"}
                                                alt="Institution Logo"
                                                width={200}
                                                height={200}
                                                quality={100}
                                                priority
                                                className="w-full h-full object-cover scale-[1.05] transform-gpu"
                                            />
                                        </div>

                                        {/* লোগো ও ছবির মাঝখানে ব্যানার */}
                                        <div className="print-banner-container flex-1 px-4 text-center">
                                            <div className="flex-grow text-center ">
                                                <Image
                                                    src={"/banner_routine.png"}
                                                    alt="Institution Banner"
                                                    width={2000}
                                                    height={400}
                                                    quality={100}
                                                    priority
                                                    className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                                                />
                                            </div>
                                        </div>

                                        {/* স্টুডেন্ট ফটো (গোল্ডেন ফ্রেমসহ) */}
                                        <div className="print-photo-container w-24 h-28 border-2 border-[#C5A059] rounded-xl bg-white p-1 shadow-md relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {card.studentImage || card.photoUrl ? (
                                                <Image
                                                    src={card.studentImage || card.photoUrl}
                                                    alt={card.studentNameEnglish || "Student Photo"}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-center p-1">
                                                    <span className="text-[11px] font-semibold text-[#8B6B23]">
                                                        N/A
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ২. অ্যাডমিট কার্ড টাইটেল ও সেশন */}
                                    <div className="text-center mt-2 mb-4">
                                        <h2 className="print-title text-2xl font-bold text-[#8B6B23] tracking-wide">
                                            এডমিট কার্ড
                                        </h2>
                                        <p className="print-subtitle text-sm font-semibold text-gray-700 mt-1">
                                            ({card.examName || "পরীক্ষা"} - {card.sessionYear || "২০২৬"})
                                        </p>
                                        <p className="print-class-info text-lg font-bold text-gray-900 mt-1">
                                            শ্রেণি: {card.className || "N/A"}
                                        </p>
                                    </div>

                                    {/* ৩. শিক্ষার্থীর তথ্যাবলী (২ কলামে গ্রিড লেআউট) */}
                                    <div className="print-details-grid grid grid-cols-2 gap-x-8 gap-y-3 my-6 text-base font-semibold px-4">
                                        {/* বাম কলাম */}
                                        <div className="space-y-3">
                                            <div className="flex items-baseline">
                                                <span className="print-label w-32 text-gray-800">পরীক্ষার্থীর নাম:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.studentNameBangla || card.studentNameEnglish || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label w-32 text-gray-800">পিতার নাম:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.fatherNameBangla || card.fatherNameEnglish || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label w-32 text-gray-800">উপজেলা/থানা:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.upazila || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label w-32 text-gray-800">জেলা:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.district || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ডান কলাম */}
                                        <div className="space-y-3">
                                            <div className="flex items-baseline">
                                                <span className="print-label-right w-24 text-gray-800">আইডি:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.studentId || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label-right w-24 text-gray-800">রোল নং:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.roll || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label-right w-24 text-gray-800">হল নং:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.hallNo || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline">
                                                <span className="print-label-right w-24 text-gray-800">সিট নং:</span>
                                                <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5">
                                                    {card.seatNo || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    {/* ৪. স্বাক্ষর সেকশন */}
                                    <div className="print-signature-section flex justify-between items-end my-8 mt-14 px-8">
                                        {/* পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর */}
                                        <div className="print-signature-box text-center flex flex-col items-center">
                                            <div className="relative w-48">
                                                <Image
                                                    src={card.signatures?.controller || "/principle's_signature.jpg"}
                                                    alt="Controller Signature"
                                                    width={150}
                                                    height={60}
                                                    unoptimized
                                                    className="print-signature-img absolute -top-8 right-14 h-9 w-17 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                                                />
                                            </div>
                                            <div className="print-signature-line w-36 border-b border-gray-800 mb-1"></div>
                                            <span className="print-signature-text text-xs font-bold text-gray-800">
                                                পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর
                                            </span>
                                        </div>

                                        {/* প্রিন্সিপাল এর স্বাক্ষর */}
                                        <div className="print-signature-box text-center flex flex-col items-center">
                                            <div className="relative w-48">
                                                <Image
                                                    src={card.signatures?.principal || "/principle's_signature.jpg"}
                                                    alt="Principal Signature"
                                                    width={150}
                                                    height={60}
                                                    unoptimized
                                                    className="print-signature-img absolute -top-8 right-14 h-9 w-17 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                                                />
                                            </div>
                                            <div className="print-signature-line w-36 border-b border-gray-800 mb-1"></div>
                                            <span className="print-signature-text text-xs font-bold text-gray-800">
                                                প্রিন্সিপাল এর স্বাক্ষর
                                            </span>
                                        </div>
                                    </div>

                                    {/* ৫. পরীক্ষার রুটিন (Table) */}
                                    <div className="print-routine-section my-6 mt-8">
                                        <h3 className="print-routine-title text-center text-lg font-bold text-gray-900 mb-2">
                                            পরীক্ষার রুটিন
                                        </h3>
                                        <table className="print-routine-table w-full border-collapse border border-[#C5A059] text-sm bg-[#FDFBF7]">
                                            <thead>
                                                <tr className="bg-[#E6D7B8] text-gray-900">
                                                    <th className="border border-[#C5A059] px-3 py-1.5 text-left font-bold w-1/3">তারিখ</th>
                                                    <th className="border border-[#C5A059] px-3 py-1.5 text-left font-bold w-1/3">বার</th>
                                                    <th className="border border-[#C5A059] px-3 py-1.5 text-left font-bold w-1/3">বিষয়</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(!card.routine || card.routine.length === 0) ? (
                                                    <tr>
                                                        <td colSpan="3" className="border border-[#C5A059] px-3 py-2 text-center text-gray-500 font-medium">
                                                            রুটিন পাওয়া যায়নি
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    card.routine.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-[#F5EEDC]/50">
                                                            <td className="border border-[#C5A059] px-3 py-1 text-gray-800">{row.date || "N/A"}</td>
                                                            <td className="border border-[#C5A059] px-3 py-1 text-gray-800">{row.day || "N/A"}</td>
                                                            <td className="border border-[#C5A059] px-3 py-1 text-gray-800 font-medium">{row.subject || "N/A"}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ৬. দৃষ্টি আকর্ষণ ও বিশেষ নির্দেশাবলী */}
                                    <div className="print-instructions-section my-4 text-xs text-gray-800 space-y-2 mt-8">
                                        <p className="print-instructions-title font-bold text-sm text-gray-900">
                                            দৃষ্টি আকর্ষণ: <span className="font-semibold">বি: দ্র: সকল বিভাগের পরীক্ষার সময় {card.examTime || "N/A"}</span>
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 font-medium pl-1">
                                            {(!card.instructions || card.instructions.length === 0) ? (
                                                <li className="text-gray-500">কোনো নির্দেশাবলী পাওয়া যায়নি</li>
                                            ) : (
                                                card.instructions.map((inst, index) => (
                                                    <li key={index}>{inst}</li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ৭. ফুটারে কন্টাক্ট ইনফো ও সোর্স ক্রেডিট */}
                                <div className="print-footer relative z-10 mt-auto pt-4 border-t border-gray-300">
                                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs font-semibold text-gray-800">
                                        <span>Contact: 01316-209201, 01748-886161</span>
                                        <span>•</span>
                                        <span>www.aimhabiganj.com</span>
                                        <span>•</span>
                                        <span>aimhabiganj@gmail.com</span>
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