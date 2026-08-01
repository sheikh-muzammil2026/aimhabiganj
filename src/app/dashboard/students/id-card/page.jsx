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
    '২০২০-২০২১',
    '২০১৯-২০২০',
    '২০১৮-২০১৯',
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
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
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
      <div className="print:hidden max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
          আইডি কার্ড জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

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
              : 'bg-green-600 hover:bg-green-700 shadow-lg'
              }`}
          >
            🖨️ সিলেক্টেড আইডি কার্ড প্রিন্ট করুন ({selectedIds.length})
          </button>
        </div>

        <div className="overflow-x-auto max-h-72 border rounded-lg">
          <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
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
                <th className="p-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    ডাটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
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
                          src={student.photoUrl || '/default-avatar.png'}
                          alt={student.studentNameEnglish || 'Student'}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      </td>
                      <td className="p-3 font-medium text-gray-700">
                        {student.studentId || student.roll || 'N/A'}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {student.studentNameBangla || student.studentNameEnglish || 'N/A'}
                      </td>
                      <td className="p-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-1">
                          {details.divisionName}
                        </span>
                        {details.className}
                      </td>
                      <td className="p-3">
                        {student.fatherMobile || student.guardianMobile || 'N/A'}
                      </td>
                      <td className="p-3">
                        {!student.photoUrl ? (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            ছবি মিসিং
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
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
      </div>

      {/* ----------------- ২. কার্ড প্রিভিউ এবং প্রিন্ট জোন ----------------- */}
      <div className="max-w-6xl mx-auto">
        <h2 className="print:hidden text-lg sm:text-xl font-bold mb-4 text-gray-700">
          আইডি কার্ডের প্রিভিউ
        </h2>

        {studentsToPrint.length === 0 ? (
          <div className="print:hidden text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 p-4">
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox Select) করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-4 sm:gap-6 print:gap-2 print:mt-2 justify-items-center">
            {studentsToPrint.map((student) => {
              const details = getStudentClassDetails(student);

              // ১) সেশন থেকে শুধুমাত্র প্রথম ৪ ডিজিট (যেমন: ২০২৬) নেওয়া
              const sessionOnlyYear = student.sessionYear ? student.sessionYear.split('-')[0] : 'N/A';

              // ২) বারকোডের জন্য সমস্ত ডাইনামিক ডাটা স্ট্রিং আকারে প্যাক করা
              const barcodePayload = JSON.stringify({
                id: student.studentId || '',
              });

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
                          alt="As-Salam Ideal Madrasah Name and Slogan"
                          className="h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* ================= ২. মিডল সেকশন (ছবি, আইডি নম্বর ও বারকোড) ================= */}
                    <div className="flex justify-between items-center px-2 pt-1 mb-2 relative">
                      <div className="w-[75px] h-[75px] rounded-full border-2 border-[#38BDF8] overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
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
                            <BarcodeSVG
                              value={barcodePayload}
                              width={0.8}
                              height={18}
                              fontSize={0}
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

                    <div className="relative px-3 py-1 flex flex-col items-end justify-end bg-white">
                      {/* টপ অ্যান্ড রাইট প্রিমিয়াম অ্যাক্সেন্ট লাইন */}
                      <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#047857] via-[#D97706] to-transparent"></div>

                      {/* সিগনেচার ইমেজ */}
                      <img
                        src="/principle's_signature.jpg"
                        alt="Authorized Signature"
                        className="absolute -top-9 -right-3 h-10 w-18 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                      />

                      <div className="border-b-2 border-[#047857] pb-0.5 relative z-10">
                        <p className="text-[8px] font-serif font-bold tracking-wide text-[#047857]">
                          Authorized Signature
                        </p>
                      </div>
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
