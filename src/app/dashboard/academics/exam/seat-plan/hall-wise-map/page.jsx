'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SeatPlanMap() {
  const [selectedHall, setSelectedHall] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState('দ্বিতীয় সাময়িক');
  const [examYear, setExamYear] = useState(2026);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // হল নং এর জন্য বাংলা সংখ্যা রূপান্তর হেলপার
  const toBengaliNumber = (num) => {
    const digits = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return String(num).split('').map(d => digits[d] || d).join('');
  };

  // ক্লাস অনুসারে কালার কোডিং পাওয়ার হেলপার
  const getClassColor = (className) => {
    const name = String(className).trim();
    if (name.includes('প্রথম') || name.toLowerCase().includes('class 1') || name.toLowerCase().includes('1')) {
      return { bg: 'bg-blue-100', text: 'text-blue-900' };
    }
    if (name.includes('দ্বিতীয়') || name.toLowerCase().includes('class 2') || name.toLowerCase().includes('2')) {
      return { bg: 'bg-purple-100', text: 'text-purple-900' };
    }
    if (name.includes('তৃতীয়') || name.includes('তৃতীয়') || name.toLowerCase().includes('class 3') || name.toLowerCase().includes('3')) {
      return { bg: 'bg-gray-300', text: 'text-gray-900' };
    }
    if (name.includes('চতুর্থ') || name.toLowerCase().includes('class 4') || name.toLowerCase().includes('4')) {
      return { bg: 'bg-rose-200', text: 'text-rose-900' };
    }
    if (name.includes('পঞ্চম') || name.toLowerCase().includes('class 5') || name.toLowerCase().includes('5')) {
      return { bg: 'bg-emerald-100', text: 'text-emerald-900' };
    }
    if (name.includes('ষষ্ঠ') || name.toLowerCase().includes('class 6') || name.toLowerCase().includes('6')) {
      return { bg: 'bg-amber-100', text: 'text-amber-900' };
    }
    if (name.includes('সপ্তম') || name.toLowerCase().includes('class 7') || name.toLowerCase().includes('7')) {
      return { bg: 'bg-cyan-100', text: 'text-cyan-900' };
    }
    if (name.includes('অষ্টম') || name.toLowerCase().includes('class 8') || name.toLowerCase().includes('8')) {
      return { bg: 'bg-teal-100', text: 'text-teal-900' };
    }
    return { bg: 'bg-indigo-100', text: 'text-indigo-900' };
  };

  // ডাটাবেজ থেকে সিট ম্যাপ লোড করা
  useEffect(() => {
    const fetchSeatPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const serverApi = process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000';
        const url = `${serverApi}/api/seat-plan?hallNo=${selectedHall}&semester=${encodeURIComponent(selectedSemester)}`;
        console.log("Fetching seat plan from URL:", url);

        const response = await fetch(url);
        const result = await response.json();

        console.log("Fetched Data:", result);

        if (result.success) {
          setSeats(result.data || []);
        } else {
          setError(result.message || 'সিট প্ল্যানের ডাটা পাওয়া যায়নি।');
        }
      } catch (err) {
        console.error('Error fetching seat plan:', err);
        setError('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };
    fetchSeatPlan();
  }, [selectedHall, selectedSemester]);

  // সিট ডেটা প্রসেসিং ও সর্টিং
  const processedSeats = seats
    .map((seat) => {
      // Handle database field variations safely
      const classGroup = seat.class || seat.className || seat.class_name || seat.classGroup || seat.jamayat || (seat.classBadge ? seat.classBadge.split('-')[0] : 'অন্যান্য');
      const colors = getClassColor(classGroup);

      const rollVal = seat.roll || seat.rollNo || seat.roll_no || seat.studentId || seat.student_id || '';
      const seatNoVal = seat.seatNo || seat.seat_no || seat.seat || '';
      const studentIdVal = seat.studentId || seat.student_id || rollVal || '';

      // Class Name & Student ID formatted badge
      const dynamicClassBadge = studentIdVal ? `${classGroup}-${studentIdVal}` : classGroup;

      return {
        ...seat,
        seatNo: seatNoVal,
        studentId: studentIdVal,
        classGroup,
        classBadge: dynamicClassBadge,
        classColorBg: seat.classColorBg || `${colors.bg} ${colors.text}`,
        name: seat.name || seat.studentName || seat.studentNameBangla || seat.student_name || 'অন্যান্য'
      };
    });

  // Apply array sorting before rendering as a fallback
  processedSeats.sort((a, b) => Number(a.seatNo || a.seat_no) - Number(b.seatNo || b.seat_no));

  // ডাইনামিক সমারী টেবিল তৈরি
  const classCounts = {};
  processedSeats.forEach((seat) => {
    classCounts[seat.classGroup] = (classCounts[seat.classGroup] || 0) + 1;
  });

  const classOrder = ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম', 'ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'];
  const summary = Object.entries(classCounts)
    .map(([classGroup, count]) => {
      const colors = getClassColor(classGroup);
      return {
        classGroup,
        count: toBengaliNumber(count),
        bgColor: colors.bg
      };
    })
    .sort((a, b) => {
      const idxA = classOrder.indexOf(a.classGroup);
      const idxB = classOrder.indexOf(b.classGroup);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.classGroup.localeCompare(b.classGroup);
    });

  // অ্যারে ভাগ করার হেলপার (৩৬টি করে প্রতি পেজের জন্য)
  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const seatPages = chunkArray(processedSeats, 36);

  return (
    <div className="bg-white p-4 max-w-[1300px] mx-auto text-gray-800 font-sans print:p-0">

      {/* Print Style Injector (A4 Portrait & Page Break Rule) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page {
            page-break-after: always;
            break-after: page;
          }
          .print-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
        }
      `}} />

      {/* ----------------- প্রিন্ট এবং ফিল্টার বার (প্রিন্ট করার সময় লুকানো থাকবে) ----------------- */}
      <div className="print:hidden mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* হল ফিল্টার */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-gray-700">হল নির্বাচন করুন:</label>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-medium cursor-pointer shadow-sm animate-none"
            >
              <option value={1}>হল নং - ১</option>
              <option value={2}>হল নং - ২</option>
              <option value={3}>হল নং - ৩</option>
              <option value={4}>হল নং - ৪</option>
            </select>
          </div>

          {/* সেমিস্টার ফিল্টার */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-gray-700">সেমিস্টার নির্বাচন করুন:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-medium cursor-pointer shadow-sm animate-none"
            >
              <option value="প্রথম সাময়িক">প্রথম সাময়িক</option>
              <option value="দ্বিতীয় সাময়িক">দ্বিতীয় সাময়িক</option>
              <option value="বার্ষিক">বার্ষিক</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg text-sm shadow-md transition-colors duration-150 flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          প্রিন্ট সিট প্ল্যান
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-700 font-semibold mt-2">সিট ম্যাপ লোড হচ্ছে...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600 font-bold border border-red-200 rounded-lg bg-red-50">
          ⚠️ {error}
        </div>
      ) : processedSeats.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-bold border border-gray-200 rounded-lg bg-gray-50">
          হল নং- {toBengaliNumber(selectedHall)}-এ বর্তমানে কোনো সিট বরাদ্দ নেই।
        </div>
      ) : (
        /* ৩৬টি করে সিট প্রতি পেজে দেখানোর জন্য পেজিনেশন ম্যাপ */
        seatPages.map((pageSeats, pageIndex) => (
          <div key={pageIndex} className="print-page mb-8 print:mb-0">
            {/* ----------------- হেডার সেকশন ----------------- */}
            <div className="relative mb-3 pb-2 border-b-2 border-red-500 min-h-[110px] flex items-center justify-between">
              {/* লোগো (বামপাশে) */}
              <div className="w-24 h-24 relative flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/aimlogo1.png"
                  alt="Logo"
                  width={96}
                  height={96}
                  priority
                  className="object-contain"
                />
              </div>

              {/* মাঝের টাইটেল */}
              <div className="flex-grow flex justify-center items-center px-4">
                <Image
                  src="/banner.png"
                  alt="Institution Banner"
                  width={800}
                  height={96}
                  priority
                  className="max-h-20 w-auto object-contain mx-auto"
                />
              </div>

              {/* ডানপাশের সামারি টেবিল */}
              <div className="w-44 border border-gray-600 text-[11px] text-center shrink-0 hidden sm:block">
                <div className="grid grid-cols-2 bg-gray-200 font-bold border-b border-gray-600 py-0.5">
                  <div>ক্লাস</div>
                  <div className="border-l border-gray-600">মোট পরীক্ষার্থী</div>
                </div>
                {summary.length === 0 ? (
                  <div className="py-1 text-gray-500 font-medium">কোনো তথ্য নেই</div>
                ) : (
                  summary.map((item, index) => (
                    <div key={index} className={`grid grid-cols-2 border-b last:border-b-0 border-gray-400 ${item.bgColor} py-0.5 font-medium text-gray-900`}>
                      <div>{item.classGroup}</div>
                      <div className="border-l border-gray-400">{item.count}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ----------------- সাব-হেডার ----------------- */}
            <div className="text-center text-base md:text-lg font-extrabold text-gray-800 mb-3">
              হল নং- {toBengaliNumber(selectedHall)} সিট প্লান ম্যাপ - {selectedSemester} পরীক্ষা {toBengaliNumber(examYear)} শিক্ষাবর্ষ {seatPages.length > 1 && `(পৃষ্ঠা: ${toBengaliNumber(pageIndex + 1)}/${toBengaliNumber(seatPages.length)})`}
            </div>

            {/* ----------------- ৬ কলামের সিট প্ল্যান গ্রিড ----------------- */}
            <div className="grid grid-cols-6 border-t border-l border-gray-600">
              {pageSeats.map((seat, index) => (
                <div
                  key={seat._id || `${seat.seatNo}-${index}`}
                  className="border-r border-b border-gray-600 h-[32mm] p-1.5 flex flex-col items-center justify-between text-center bg-white animate-none"
                >
                  {/* সিট নম্বর */}
                  <span className="text-[11px] font-semibold text-gray-800 bg-white border border-gray-400 rounded px-1.5 py-0.5 shadow-sm">
                    Seat-{seat.seatNo}
                  </span>

                  {/* ক্লাস ও রোল ব্যাজ */}
                  {seat.classBadge && (
                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded border border-gray-400 ${seat.classColorBg}`}>
                      {seat.classBadge}
                    </span>
                  )}

                  {/* নাম */}
                  {seat.name && (
                    <span className="text-[10.5px] font-bold text-gray-900 leading-tight">
                      {seat.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}