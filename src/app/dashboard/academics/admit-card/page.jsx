'use client';

import { Globe, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import { BsWhatsapp, BsYoutube } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';

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

    // অটো-ফিট নাম এবং তথ্যের জন্য SVG টেক্সট কম্পোনেন্ট (ফুল উইডথ নিবে ও অটো ছোট/বড় হবে)
    const AutoScaledText = ({ text, className = "", fontWeight = "bold", fill = "#000" }) => {
        return (
            <div className={`w-full h-4 flex items-center overflow-hidden ${className}`}>
                {/* প্রিন্ট CSS - শুধুমাত্র এই পেজেই কাজ করবে */}
                <style jsx global>{`
                @media print {
                    @page {
                        size: A5 portrait;
                        margin: 0mm !important;
                    }

                    html,
                    body {
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

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
                        width: 100%;
                    }

                    .page-break {
                        width: 148mm !important;
                        height: 209mm !important;
                        margin: 0 auto !important;
                        padding: 6mm !important;
                        box-sizing: border-box !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        overflow: hidden !important;
                    }
                }
            `}</style>

                <svg className="w-full h-full" viewBox="0 0 300 24" preserveAspectRatio="none">
                    <text
                        x="0"
                        y="18"
                        fontSize="18"
                        fontWeight={fontWeight}
                        fill={fill}
                        // fontFamily="sans-serif"
                        textLength="300"
                        lengthAdjust="spacingAndGlyphs"
                    >
                        {text || 'N/A'}
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
            {/* প্রিন্ট সিএসএস ফিক্স */}


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
                            শ্রেণি
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
                                    filteredStudents?.map((student) => {
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
                                                        src={student?.studentImage}
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
                        // রুটিন ৫টির বেশি হলে ২ কলামে ভাগ করার জন্য হেলপার লজিক
                        const routine = card.routine || [];
                        const isMultiColumn = routine.length > 5;
                        const midIndex = Math.ceil(routine.length / 2);
                        const routineColumns = isMultiColumn
                            ? [routine.slice(0, midIndex), routine.slice(midIndex)]
                            : [routine];

                        return (
                            <div
                                key={card._id || card.studentId}
                                className="page-break relative bg-white box-border flex flex-col justify-between"                            >
                                <div className="w-full h-full border-[4px] border-double border-[#C5A059] p-3 flex flex-col justify-between box-border">

                                    {/* ওয়াটারমার্ক (Watermark) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.08]">
                                        <Image
                                            src="/aimlogo1.png"
                                            alt="Watermark Logo"
                                            width={260}
                                            height={260}
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* মেইন কন্টেন্ট এলাকা */}
                                    <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">

                                        {/* ১. হেডার সেকশন: Logo + Banner + Student Photo */}
                                        <div className="flex justify-between items-center relative gap-2 flex-shrink-0 w-full overflow-hidden">
                                            {/* মাদ্রাসার লোগো */}
                                            <div className="w-22 h-22 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                                <Image
                                                    src={"/aimlogo1.png"}
                                                    alt="Institution Logo"
                                                    width={120}
                                                    height={120}
                                                    quality={100}
                                                    priority
                                                    className="w-full h-full object-cover scale-[1.05] transform-gpu"
                                                />
                                            </div>

                                            {/* লোগো ও ছবির মাঝখানে ব্যানার */}
                                            <div className="flex-1 text-center min-w-0">
                                                <div className="w-full text-center">
                                                    <Image
                                                        src={"/banner.png"}
                                                        alt="Institution Banner"
                                                        width={1200}
                                                        height={240}
                                                        quality={100}
                                                        priority
                                                        className="w-full h-auto max-h-24 object-contain mx-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>



                                        <div className='flex justify-between items-center border-t-4 border-double border-[#C5A059] pt-1'>
                                            {/* ১. বামে QR Code */}
                                            <div className="w-16 h-20 border border-[#C5A059] rounded-lg bg-white p-1 shadow-sm flex-shrink-0 flex items-center justify-center mt-1">
                                                <QRCodeSVG
                                                    value={`${process.env.NEXT_PUBLIC_BASE_URI}/dashboard/academics/admit-card?id=${card._id || ''}`}
                                                    size={56}
                                                    level="L"
                                                />
                                            </div>

                                            {/* ২. মাঝখানে টাইটেল ও তথ্য */}
                                            <div className="text-center my-0.5 flex-1 px-2">
                                                <div className="inline-block bg-emerald-800 text-white px-4 py-0.5 rounded-full border-2 border-emerald-600 shadow-sm mb-1">
                                                    <h2 className="text-xs font-bold tracking-wider leading-tight uppercase">
                                                        এডমিট কার্ড
                                                    </h2>
                                                </div>
                                                <p className="text-[11px] font-semibold text-gray-700 leading-tight">
                                                    {card.examName || "পরীক্ষা"} - {card.sessionYear || "২০২৬"} শিক্ষাবর্ষ
                                                </p>
                                                <p className="text-[11px] font-bold text-gray-900 mt-0.5">
                                                    শ্রেণি: {card.className || "N/A"}
                                                </p>
                                            </div>

                                            {/* ৩. ডানে স্টুডেন্ট ফটো */}
                                            <div className="w-16 h-20 border border-[#C5A059] rounded-lg bg-white p-0.5 shadow-sm relative overflow-hidden flex-shrink-0 flex items-center justify-center mt-1">
                                                {card.studentImage ? (
                                                    <Image
                                                        src={card?.studentImage}
                                                        alt={card.studentNameEnglish || "Student Photo"}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-center p-0.5">
                                                        <span className="text-[9px] font-semibold text-[#8B6B23]">
                                                            N/A
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ৩. শিক্ষার্থীর তথ্যাবলী (২ কলামে গ্রিড লেআউট) */}
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 my-1 text-[11px] font-semibold px-1 flex-shrink-0">
                                            {/* বাম কলাম */}
                                            <div className="space-y-1">
                                                <div className="flex items-center">
                                                    <span className="w-22 text-gray-800 flex-shrink-0">পরীক্ষার্থীর নাম:</span>
                                                    <div className="flex-1 border-b border-dotted border-gray-400 pb-0.5 overflow-hidden">
                                                        <AutoScaledText
                                                            text={card.studentNameBangla || card.studentNameEnglish || "N/A"}
                                                            fill="#111827"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="w-22 text-gray-800 flex-shrink-0">পিতার নাম:</span>
                                                    <div className="flex-1 border-b border-dotted border-gray-400 pb-0.5 overflow-hidden">
                                                        <AutoScaledText
                                                            text={card.fatherNameBangla || card.fatherNameEnglish || "N/A"}
                                                            fill="#111827"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <span className="w-22 text-gray-800 flex-shrink-0">উপজেলা/থানা:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.upazila || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <span className="w-22 text-gray-800 flex-shrink-0">জেলা:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.district || "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ডান কলাম */}
                                            <div className="space-y-1">
                                                <div className="flex items-baseline">
                                                    <span className="w-14 text-gray-800 flex-shrink-0">আইডি:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.studentId || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <span className="w-14 text-gray-800 flex-shrink-0">রোল নং:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.roll || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <span className="w-14 text-gray-800 flex-shrink-0">হল নং:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.hallNo || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <span className="w-14 text-gray-800 flex-shrink-0">সিট নং:</span>
                                                    <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                                                        {card.seatNo || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ৫. পরীক্ষার রুটিন (Dynamic 1 or 2 Columns Table) */}
                                        <div className="my-1 flex-shrink-0">
                                            <h3 className="text-center text-[11px] font-bold text-gray-900 mb-0.5">
                                                পরীক্ষার রুটিন
                                            </h3>

                                            <div className={`grid ${isMultiColumn ? 'grid-cols-2 gap-2' : 'grid-cols-1'} w-full`}>
                                                {routineColumns.map((colRoutine, colIdx) => (
                                                    <table key={colIdx} className="w-full border-collapse border border-[#C5A059] text-[10px] bg-[#FDFBF7]/60">
                                                        <thead>
                                                            <tr className="bg-[#C5A059]/10 text-gray-900">
                                                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">তারিখ</th>
                                                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">বার</th>
                                                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">বিষয়</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {colRoutine.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="3" className="border border-[#c59f59c4] px-1 py-0.5 text-center text-gray-500 font-medium">
                                                                        রুটিন পাওয়া যায়নি
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                colRoutine.map((row, idx) => (
                                                                    <tr key={idx} className="hover:bg-[#F5EEDC]/50">
                                                                        <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800">{row.date || "N/A"}</td>
                                                                        <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800">{row.day || "N/A"}</td>
                                                                        <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800 font-medium truncate max-w-[80px]">{row.subject || "N/A"}</td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                ))}
                                            </div>

                                            <p className="text-center text-[10px] mt-0.5 font-medium">
                                                বি: দ্র: <span className="text-red-500">{card.examTime || "N/A"}</span>
                                            </p>
                                        </div>

                                        {/* ৬. দৃষ্টি আকর্ষণ ও বিশেষ নির্দেশাবলী */}
                                        <div className="my-1 text-[9.5px] text-gray-800 space-y-0.5 flex-shrink-0">
                                            <p className="font-bold text-[10.5px] text-gray-900">
                                                দৃষ্টি আকর্ষণ:
                                            </p>
                                            <ul className="list-disc list-inside space-y-0.5 font-medium pl-1">
                                                {(!card.instructions || card.instructions.length === 0) ? (
                                                    <li className="text-gray-500">কোনো নির্দেশাবলী পাওয়া যায়নি</li>
                                                ) : (
                                                    card.instructions.map((inst, index) => (
                                                        <li key={index} className="leading-tight">{inst}</li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>

                                        {/* ৪. স্বাক্ষর সেকশন */}
                                        <div className="flex justify-between items-end my-1 px-4 flex-shrink-0">
                                            {/* পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর */}
                                            <div className="text-center flex flex-col items-center print:mt-auto relative">
                                                <div className="relative w-28 h-5">
                                                    <Image
                                                        src={card.signatures?.controller || "/principle's_signature.jpg"}
                                                        alt="Controller Signature"
                                                        width={100}
                                                        height={40}
                                                        unoptimized
                                                        className="absolute -top-2 right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                                                    />
                                                </div>
                                                <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                                                <span className="text-[9.5px] font-bold text-gray-800">
                                                    পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর
                                                </span>
                                            </div>

                                            {/* প্রিন্সিপাল এর স্বাক্ষর */}
                                            <div className="text-center flex flex-col items-center">
                                                <div className="relative w-28 h-5 print:mt-auto relative">
                                                    <Image
                                                        src={card.signatures?.principal || "/principle's_signature.jpg"}
                                                        alt="Principal Signature"
                                                        width={100}
                                                        height={40}
                                                        unoptimized
                                                        className="absolute -top-2 right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                                                    />
                                                </div>
                                                <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                                                <span className="text-[9.5px] font-bold text-gray-800">
                                                    প্রিন্সিপালের স্বাক্ষর
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    {/* ৭. ফুটারে কন্টাক্ট ইনফো ও সোর্স ক্রেডিট */}

                                    <div className="relative z-10 mt-auto pt-1 border-t border-gray-300 flex-shrink-0">
                                        <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-0.5 text-[8.5px] font-semibold text-gray-800">
                                            <span className="flex items-center gap-0.5">
                                                <Phone className="w-2.5 h-2.5 text-gray-700" />
                                                01316-209201
                                            </span>

                                            <span className="flex items-center gap-0.5">
                                                <BsWhatsapp className="w-2.5 h-2.5 text-green-600" />
                                                01748-886161
                                            </span>

                                            <span className="flex items-center gap-0.5">
                                                <Globe className="w-2.5 h-2.5 text-blue-500" />
                                                www.aimhabiganj.com
                                            </span>

                                            <span className="flex items-center gap-0.5">
                                                <Mail className="w-2.5 h-2.5 text-red-500" />
                                                aimhabiganj@gmail.com
                                            </span>

                                            <span className="flex items-center gap-0.5">
                                                <FaFacebook className="w-2.5 h-2.5 text-blue-600" />
                                                aimhabiganj
                                            </span>

                                            <span className="flex items-center gap-0.5">
                                                <BsYoutube className="w-2.5 h-2.5 text-red-600" />
                                                aimhabiganj
                                            </span>
                                        </div>
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
