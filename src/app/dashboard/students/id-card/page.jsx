'use client';

import { IdCardBack } from '@/components/dashboard/IdCardBack';
import React, { useState, useEffect } from 'react';
import BarcodeSVG from 'react-barcode';

export default function IdCardGenerator() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedAcademyType, setSelectedAcademyType] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFeeCategory, setSelectedFeeCategory] = useState('all');

  // পেজিনেশন স্টেটসমূহ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(10);

  // ১. Backend থেকে স্টুডেন্ট ডাটা ফেচ করা (পেজিনেটেড)
  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, selectedSession, selectedDivision, selectedAcademyType, selectedClass, selectedType, selectedFeeCategory]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        status: 'Approved',
        page: currentPage,
        limit: limit
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSession !== 'all') params.append("sessionYear", selectedSession);
      if (selectedDivision !== 'all') params.append("division", selectedDivision);
      if (selectedAcademyType !== 'all') params.append("academyType", selectedAcademyType);
      if (selectedClass !== 'all') params.append("class", selectedClass);
      if (selectedType !== 'all') params.append("type", selectedType);
      if (selectedFeeCategory !== 'all') params.append("feeCategory", selectedFeeCategory);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setStudents(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalStudents(result.total || result.totalCount || 0);
      } else {
        setError(result.message || 'শিক্ষার্থীদের তথ্য লোড করা যায়নি।');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

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

  // বিভাগ অনুযায়ী ক্লাসের ড্রপডাউন অপশন ডায়নামিকভাবে তৈরি করা
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

  // ডায়নামিক ফিল্টারিং লজিক (ব্যাকএন্ড দ্বারা নিয়ন্ত্রিত)
  const filteredStudents = students;

  const sessionYears = [
    '২০২৬',
    '২০২৫',
    '২০২৪',
    '২০২৩',
    '২০২২',
    '২০২১',
    '২০২০',
    '২০১৯',
    '২০১৮',
  ];

  const uniqueFeeCategories = ["General", "Orphan", "Poor Fund", "Scholarship", "Staff Child"];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) => {
        const nextIds = [...prev];
        currentPageIds.forEach(id => {
          if (!nextIds.includes(id)) nextIds.push(id);
        });
        return nextIds;
      });
    } else {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) => prev.filter(id => !currentPageIds.includes(id)));
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
        <svg className="w-full h-full" viewBox="0 0 300 24" preserveAspectRatio="none">
          <text
            x="0"
            y="18"
            fontSize="18"
            fontWeight={fontWeight}
            fill={fill}
            fontFamily="sans-serif"
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
    <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6">
      {/* প্রিন্ট সিএসএস ফিক্স (ব্যাকগ্রাউন্ড কালার ঠিক রাখার জন্য) */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ----------------- ১. এডমিন কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden max-w-7xl mx-auto bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#043e30] dark:text-emerald-450 mb-4 sm:mb-6 border-b dark:border-slate-850 pb-2">
          আইডি কার্ড জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/20 text-red-750 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              খুঁজুন (নাম/আইডি/মোবাইল)
            </label>
            <input
              type="text"
              placeholder="নাম, আইডি, রোল বা ফোন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              শিক্ষাবর্ষ / সেশন
            </label>
            <select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              বিভাগ (Division)
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedAcademyType('all');
                setSelectedClass('all');
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল বিভাগ</option>
              <option value="preHifz">প্রি-হিফজ</option>
              <option value="hifz">হিফজ</option>
              <option value="academy">একাডেমিক</option>
            </select>
          </div>

          {selectedDivision === 'academy' && (
            <div>
              <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
                একাডেমি টাইপ
              </label>
              <select
                value={selectedAcademyType}
                onChange={(e) => {
                  setSelectedAcademyType(e.target.value);
                  setSelectedClass('all');
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              শ্রেণি / জামাত
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              disabled={selectedDivision === 'all'}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-800/40 disabled:opacity-50"
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
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              আবাসিক স্ট্যাটাস
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল টাইপ</option>
              <option value="আবাসিক">আবাসিক</option>
              <option value="অনাবাসিক">অনাবাসিক</option>
              <option value="ডে-কেয়ার">ডে-কেয়ার</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-650 dark:text-gray-400 mb-1">
              ফি ক্যাটাগরি
            </label>
            <select
              value={selectedFeeCategory}
              onChange={(e) => {
                setSelectedFeeCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t dark:border-slate-800 pt-4 mb-4">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center sm:text-left">
            মোট স্টুডেন্ট: {totalStudents} জন | সিলেক্ট করা হয়েছে: {selectedIds.length} জন
          </span>
          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-md font-bold text-sm sm:text-base text-white transition ${selectedIds.length === 0
              ? 'bg-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'
              }`}
          >
            🖨️ সিলেক্টেড আইডি কার্ড প্রিন্ট করুন ({selectedIds.length})
          </button>
        </div>

        {/* ----------------- রেসপন্সিভ স্টুডেন্ট ডাটা ভিউ ----------------- */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-[#0f172a]">
          {/* ১. মোবাইল ভিউ (কার্ড ফরম্যাট - md স্ক্রিনের নিচে) */}
          <div className="block md:hidden">
            {/* মোবাইল সিলেক্ট অল বার */}
            <div className="p-3 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-250">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredStudents.length > 0 &&
                    filteredStudents.every(s => selectedIds.includes(s._id))
                  }
                  className="rounded border-gray-300"
                />
                <span>সবাইকে সিলেক্ট করুন</span>
              </label>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-slate-800">
              {loading ? (
                <div className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">ডাটা লোড হচ্ছে...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">কোনো শিক্ষার্থী পাওয়া যায়নি!</div>
              ) : (
                filteredStudents.map((student) => {
                  const details = getStudentClassDetails(student);
                  const isSelected = selectedIds.includes(student._id);
                  return (
                    <div
                      key={student._id}
                      onClick={() => handleSelectStudent(student._id)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition ${isSelected ? 'bg-blue-50/70 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-slate-900/40'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => { }} // হ্যান্ডেল করা হচ্ছে প্যারেন্ট div ক্লিক দিয়ে
                        className="mt-1 rounded border-gray-300"
                      />
                      <img
                        src={student.studentImage || student.photoUrl || '/default-avatar.png'}
                        alt={student.studentNameEnglish || 'Student'}
                        className="w-12 h-12 rounded-full object-cover border dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <p className="font-bold text-gray-900 dark:text-gray-205 dark:text-gray-200 text-sm truncate">
                            {student.studentNameBangla || student.studentNameEnglish || 'N/A'}
                          </p>
                          {!(student.studentImage || student.photoUrl) ? (
                            <span className="text-[10px] bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded shrink-0">
                              ছবি মিসিং
                            </span>
                          ) : (
                            <span className="text-[10px] bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded shrink-0">
                              ওকে
                            </span>
                          )}
                        </div>
                        <p className="text-gray-650 dark:text-gray-400 font-medium">
                          আইডি/রোল: <span className="text-gray-900 dark:text-gray-200 font-semibold">{student.studentId || student.roll || 'N/A'}</span>
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {details.divisionName}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">{details.className}</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-450">
                          মোবাইল: {student.fatherMobile || student.guardianMobile || 'N/A'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ২. ডেস্কটপ ও ট্যাবলেট ভিউ (টেবিল ফরম্যাট - md স্ক্রিন ও তার উপরে) */}
          <div className="hidden md:block overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-slate-900 sticky top-0 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        filteredStudents.length > 0 &&
                        filteredStudents.every(s => selectedIds.includes(s._id))
                      }
                    />
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">ছবি</th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">আইডি / রোল</th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">নাম</th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">বিভাগ ও শ্রেণি</th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">মোবাইল</th>
                  <th className="p-3 text-slate-700 dark:text-slate-250">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-slate-500 dark:text-slate-400">
                      ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-slate-500 dark:text-slate-400">
                      কোনো শিক্ষার্থী পাওয়া যায়নি!
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const details = getStudentClassDetails(student);
                    return (
                      <tr key={student._id} className="border-b border-gray-250 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/60">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </td>
                        <td className="p-3">
                          <img
                            src={student.studentImage || student.photoUrl || '/default-avatar.png'}
                            alt={student.studentNameEnglish || 'Student'}
                            className="w-8 h-8 rounded-full object-cover border dark:border-slate-700"
                          />
                        </td>
                        <td className="p-3 font-medium text-gray-700 dark:text-gray-300">
                          {student.studentId || student.roll || 'N/A'}
                        </td>
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                          {student.studentNameBangla || student.studentNameEnglish || 'N/A'}
                        </td>
                        <td className="p-3">
                          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">
                            {details.divisionName}
                          </span>
                          {details.className}
                        </td>
                        <td className="p-3">
                          {student.fatherMobile || student.guardianMobile || 'N/A'}
                        </td>
                        <td className="p-3">
                          {!(student.studentImage || student.photoUrl) ? (
                            <span className="text-xs bg-red-100 dark:bg-red-950/30 text-red-650 dark:text-red-400 px-2 py-1 rounded">
                              ছবি মিসিং
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 dark:bg-green-950/30 text-green-650 dark:text-green-400 px-2 py-1 rounded">
                              ওকে
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ৫. পেজিনেশন কন্ট্রোলস */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#0f172a] p-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 rounded-b-lg">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              পেজ {currentPage} এর {totalPages} (মোট {totalStudents} জন শিক্ষার্থী)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-355 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

        </div>
      </div>

      {/* ----------------- ২. কার্ড প্রিভিউ এবং প্রিন্ট জোন ----------------- */}
      <div className="max-w-6xl mx-auto">
        <h2 className="print:hidden text-lg sm:text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          আইডি কার্ডের প্রিভিউ
        </h2>

        {studentsToPrint.length === 0 ? (
          <div className="print:hidden text-center py-8 sm:py-12 bg-white dark:bg-[#0f172a] rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-800 p-4">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-450 font-medium">
              প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox Select) করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-1 sm:gap-6 print:gap-4 print:mt-3 justify-items-center">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:block gap-4 sm:gap-6 print:mt-3"> */}
            {studentsToPrint.map((student) => {
              const details = getStudentClassDetails(student);

              // ১) সেশন থেকে শুধুমাত্র প্রথম ৪ ডিজিট (যেমন: ২০২৬) নেওয়া
              const sessionOnlyYear = (student.sessionYear || '').split(/[-–/]/)[0].trim() || 'N/A';

              // ২) বারকোডের জন্য সমস্ত ডাইনামিক ডাটা স্ট্রিং আকারে প্যাক করা
              const barcodePayload = String(student.studentId || student.roll || '');

              return (
                <div
                  key={student._id}
                  className="w-[2.125in] h-[3.375in] bg-white rounded-xl p-[3px] relative shadow-xl overflow-hidden mx-auto print:shadow-none print:break-inside-avoid shrink-0"
                  style={{
                    border: '6px solid #0022C8',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    className="w-full h-full bg-white rounded-lg flex flex-col justify-between relative overflow-hidden"
                    style={{ border: '2px solid #1E40AF' }}
                  >
                    {/* ================= ১. হেডার সেকশন ================= */}

                    <div className="w-full  border-b-2 border-[#0022C8] flex items-center justify-center">
                      {/* লোগোর সেকশন */}
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white">
                        <img
                          src="/aimlogo1.png"
                          alt="AIM Logo"
                          className="w-full h-full object-cover scale-[1.06] rounded-full"
                        />
                      </div>

                      {/* মাদ্রাসার নামের ব্যানার/ছবি */}
                      <div className="flex-1 flex items-center h-11">
                        <img
                          src="/banner.jpeg"
                          alt="As-Salam Ideal Madrasah  (AIM) Name and Slogan"
                          className="h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* ================= ২. মিডল সেকশন (ছবি, আইডি নম্বর ও বারকোড) ================= */}
                    <div className="flex justify-between items-center px-2 pt-1 mb-2 relative">
                      <div className="w-[75px] h-[75px] rounded-full border-2 border-[#38BDF8] overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                        {student.studentImage? (
                          <img
                            src={student.studentImage}
                            alt={student.studentNameEnglish || 'Student'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="flex flex-col items-center justify-center transform -rotate-90 origin-center whitespace-nowrap -mr-2">
                          <span className="text-[10px] font-black text-[#B00070] tracking-wider">
                            ID CARD
                          </span>
                          <span className="text-[8px] font-black text-[#0022C8] tracking-tight">
                            ID NO-{student.studentId || student.roll || student._id?.slice(-6)}
                          </span>
                        </div>

                        {/* ডাইনামিক বারকোড রেন্ডারিং */}
                        <div className="w-6 h-20 bg-white flex items-center justify-center overflow-hidden">
                          <div className="transform rotate-90 origin-center scale-90">
                            {/* ✅ নতুন কোড: */}
                            <BarcodeSVG
                              value={barcodePayload || '0000'}
                              format="CODE128"
                              width={1.2}              // লাইনগুলো একটু মোটা করা হয়েছে যেন সহজে স্ক্যান হয়
                              height={28}             // বারকোডের উচ্চতা বাড়ানো হয়েছে
                              displayValue={false}    // শুধু বারকোড দেখাবে, কোনো টেক্সট বা আইডি বারকোডের নিচে দেখাবে না
                              margin={0}
                              background="transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ================= ৩. ইনফরমেশন সেকশন ================= */}
                    <div className="px-2 pt-0.5 pb-1 flex-1 flex flex-col space-y-1">
                      {/* স্টুডেন্টের নাম - অটো ছোট হয়ে জায়গা মত বসবে */}
                      <div className="w-full">
                        <AutoScaledText
                          text={student.studentNameBangla || student.studentNameEnglish || 'N/A'}
                          fill="#000"
                          fontWeight="bold"
                        />
                      </div>

                      <div className="space-y-1 text-[9px] font-serif">
                        {/* পিতা */}
                        <div className="flex items-center">
                          <span className="w-[55px] font-bold text-[#A0006D] shrink-0">Father</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <div className="flex-1 overflow-hidden">
                            <AutoScaledText
                              text={student.fatherNameBangla || student.fatherNameEnglish || 'N/A'}
                              fill="#000"
                              fontWeight="normal"
                            />
                          </div>
                        </div>

                        {/* এডমিশন সেশন */}
                        <div className="flex items-center">
                          <span className="w-[55px] font-bold text-[#A0006D] shrink-0">Ad.Session</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <span className="font-semibold text-black flex-1">
                            {sessionOnlyYear}
                          </span>
                        </div>

                        {/* বিভাগ (হিফজ/একাডেমিক) */}
                        <div className="flex items-center">
                          <span className="w-[55px] font-bold text-[#A0006D] shrink-0">Division</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <span className="font-semibold text-black flex-1">
                            {details.divisionName}
                          </span>
                        </div>

                        {/* জন্ম তারিখ */}
                        <div className="flex items-center">
                          <span className="w-[55px] font-bold text-[#A0006D] shrink-0">D.O.B</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <span className="font-semibold text-black flex-1 font-mono text-[8px]">
                            {student.dateOfBirth || student.dob || 'N/A'}
                          </span>
                        </div>

                        {/* মোবাইল নম্বর (সুন্দর ও সোজা ফন্ট) */}
                        <div className="flex items-center">
                          <span className="w-[55px] font-bold text-[#A0006D] shrink-0">Mobile</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <span className="font-semibold text-black flex-1 font-mono text-[8px]">
                            {student.fatherMobile || student.guardianMobile || 'N/A'}
                          </span>
                        </div>

                        {/* ব্ল্যাড গ্রুপ */}
                        <div className="flex  items-center">
                          <span className="w-[55px] font-bold text-[8px]  text-[#A0006D] shrink-0">Blood Group</span>
                          <span className="font-bold text-[#A0006D] mr-1">:</span>
                          <span className="font-semibold text-black flex-1">
                            {student.bloodGroup || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>


                    <div
                      className="bg-[#047857] text-white text-right px-3 py-1 relative flex flex-col items-end justify-end border-t border-amber-500"
                      style={{
                        backgroundColor: '#047857', // ইমারাল্ড গ্রিন
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact'
                      }}
                    >
                      {/* সিগনেচার ইমেজ */}
                      <img
                        src="/principle's_signature.jpg"
                        alt="Authorized Signature"
                        className="absolute -top-9 -right-2 h-10 w-18 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                      />

                      <p className="text-[8px] font-sans font-medium tracking-wide relative z-10 text-amber-300">
                        Authorized Signature
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <IdCardBack />
          </div>

        )}

      </div>
    </div>
  );
}
