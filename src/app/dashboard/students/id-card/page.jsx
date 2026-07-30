'use client';

import React, { useState, useEffect } from 'react';

export default function IdCardGenerator() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all'); // preHifz, hifz, academy
  const [selectedAcademyType, setSelectedAcademyType] = useState('all'); // প্রাক-প্রাথমিক, প্রাথমিক, ইত্যাদি
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // আবাসিক, অনাবাসিক, ডে-কেয়ার
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

    // সার্চ ফিল্টার (নাম, আইডি, পিতার নাম, মোবাইল, জেলা)
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

  // সেশন বছরের লিস্ট
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

  // ইউনিক ফি ক্যাটাগরি লিস্ট
  const uniqueFeeCategories = [
    ...new Set(students.map((s) => s.officeUse?.feeCategory).filter(Boolean)),
  ];

  // সিলেক্ট অল লজিক
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredStudents.map((s) => s._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // একক স্টুডেন্ট সিলেক্ট করার লজিক
  const handleSelectStudent = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // প্রিন্ট হ্যান্ডলার
  const handlePrint = () => {
    window.print();
  };

  // প্রিন্টের জন্য সিলেক্ট করা স্টুডেন্ট ফিল্টার
  const studentsToPrint = students.filter((s) => selectedIds.includes(s._id));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ----------------- ১. এডমিন কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          আইডি কার্ড জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* ফিল্টার গ্রুপ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
          {/* সার্চ বক্স */}
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

          {/* সেশন ফিল্টার */}
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

          {/* বিভাগ ফিল্টার */}
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

          {/* একাডেমি টাইপ ফিল্টার (শুধুমাত্র একাডেমিক হলে দৃশ্যমান) */}
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

          {/* শ্রেণি 필্টার */}
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

          {/* আবাসিক/অনাবাসিক টাইপ ফিল্টার */}
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

          {/* ফি ক্যাটাগরি ফিল্টার */}
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

        {/* প্রিন্ট বাটন এবং কাউন্টার সেকশন */}
        <div className="flex items-center justify-between border-t pt-4 mb-4">
          <span className="text-sm text-gray-600 font-semibold">
            মোট স্টুডেন্ট: {filteredStudents.length} জন | সিলেক্ট করা হয়েছে: {selectedIds.length} জন
          </span>
          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0}
            className={`px-6 py-2.5 rounded-md font-bold text-white transition ${selectedIds.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-lg'
              }`}
          >
            🖨️ সিলেক্টেড আইডি কার্ড প্রিন্ট করুন ({selectedIds.length})
          </button>
        </div>

        {/* স্টুডেন্ট লিস্ট টেবিল */}
        <div className="overflow-x-auto max-h-72 border rounded-lg">
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
                    কোনো শিক্ষার্থী পাওয়া যায়নি!
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
        <h2 className="print:hidden text-xl font-bold mb-4 text-gray-700">
          আইডি কার্ডের প্রিভিউ
        </h2>

        {studentsToPrint.length === 0 ? (
          <div className="print:hidden text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox Select) করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-2 print:gap-2 print:m-0">
            {studentsToPrint.map((student) => {
              const details = getStudentClassDetails(student);
              return (
                <div
                  key={student._id}
                  className="w-[2.125in] h-[3.375in] bg-white rounded-xl p-[3px] relative shadow-xl overflow-hidden mx-auto print:shadow-none print:break-inside-avoid"
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
                    <div className="w-full pt-2 px-2 pb-1 border-b-2 border-[#0022C8] flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full border border-blue-900 p-0.5 flex-shrink-0 flex items-center justify-center bg-white">
                        {student.logoUrl ? (
                          <img
                            src={student.logoUrl}
                            alt="Logo"
                            className="w-full h-full object-contain rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-900 text-center">
                            LOGO
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center">
                        <h2 className="text-[10px] font-extrabold text-blue-950 font-serif leading-none tracking-tight">
                          مدرسة السلام النموذجية
                        </h2>
                        <h1 className="text-[11px] font-extrabold text-black font-sans leading-tight mt-0.5">
                          আস-সালাম আইডিয়াল মাদ্রাসা{' '}
                          <span className="text-xs font-semibold">(এইম)</span>
                        </h1>
                        <h3 className="text-[10px] font-black text-[#D00000] leading-none font-sans">
                          As-Salam Ideal Madrasah
                        </h3>
                        <p className="text-[8px] font-extrabold text-[#008080] tracking-tighter mt-0.5">
                          A&amp;M For Ultimate Success
                        </p>
                      </div>
                    </div>

                    {/* ================= ২. মিডল সেকশন (ছবি, আইডি নম্বর ও বারকোড) ================= */}
                    <div className="flex justify-between items-center px-2 pt-2 relative">
                      <div className="w-[85px] h-[85px] rounded-full border-2 border-[#38BDF8] overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner ml-1">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.studentNameEnglish || 'Student'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-20 h-20 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 pr-1">
                        <div className="flex flex-col items-center justify-center transform -rotate-90 origin-center whitespace-nowrap -mr-3">
                          <span className="text-[12px] font-black text-[#B00070] tracking-wider">
                            ID CARD
                          </span>
                          <span className="text-[9px] font-black text-[#0022C8] tracking-tight">
                            ID NO-{student.studentId || student.roll || student._id?.slice(-6)}
                          </span>
                        </div>

                        {/* বারকোড ডিজাইন */}
                        <div className="w-5 h-24 bg-white flex flex-col justify-between p-1 items-center border border-gray-200">
                          <div className="w-full h-[2px] bg-black"></div>
                          <div className="w-full h-[4px] bg-black"></div>
                          <div className="w-full h-[1px] bg-black"></div>
                          <div className="w-full h-[3px] bg-black"></div>
                          <div className="w-full h-[5px] bg-black"></div>
                          <div className="w-full h-[1px] bg-black"></div>
                          <div className="w-full h-[3px] bg-black"></div>
                          <div className="w-full h-[2px] bg-black"></div>
                          <div className="w-full h-[6px] bg-black"></div>
                          <div className="w-full h-[1px] bg-black"></div>
                          <div className="w-full h-[4px] bg-black"></div>
                          <div className="w-full h-[2px] bg-black"></div>
                          <div className="w-full h-[3px] bg-black"></div>
                          <div className="w-full h-[5px] bg-black"></div>
                          <div className="w-full h-[1px] bg-black"></div>
                          <div className="w-full h-[4px] bg-black"></div>
                          <div className="w-full h-[2px] bg-black"></div>
                        </div>
                      </div>
                    </div>

                    {/* ================= ৩. ইনফরমেশন সেকশন ================= */}
                    <div className="px-3 pt-1 pb-2 flex-1 flex flex-col justify-around">
                      <h2 className="text-[12px] font-black text-black font-serif tracking-normal leading-tight truncate">
                        {student.studentNameEnglish || student.studentNameBangla || 'N/A'}
                      </h2>

                      <div className="space-y-[2px] text-[9px] font-serif">
                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            Father
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1 truncate">
                            {student.fatherNameEnglish || student.fatherNameBangla || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            Ad.Session
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1">
                            {student.sessionYear || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            Division
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1 truncate">
                            {details.className} ({details.divisionName})
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            D.O.B
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1">
                            {student.dob || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            Mobile
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1">
                            {student.fatherMobile || student.guardianMobile || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-[65px] font-bold text-[#A0006D]">
                            Blood Group
                          </span>
                          <span className="font-bold text-[#A0006D] mr-2">:</span>
                          <span className="font-semibold text-black flex-1">
                            {student.bloodGroup || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ================= ৪. ফুটার ও স্বাক্ষর সেকশন ================= */}
                    <div className="w-full relative mt-auto">
                      <div className="absolute right-3 -top-6 text-right z-10">
                        <span className="font-serif italic text-xs font-bold text-black border-b border-black px-1 block transform -rotate-6">
                          Principal
                        </span>
                      </div>

                      <div className="bg-[#0022C8] text-white text-right px-3 py-0.5">
                        <p className="text-[10px] font-sans font-medium tracking-wide">
                          Authorized Signature
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}