// components/public/results/ResultSearch.jsx
"use client";
import { useState } from "react";

export default function ResultSearch() {
  const [examType, setExamType] = useState("");
  const [roll, setRoll] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`পরীক্ষা: ${examType}, রোল: ${roll} এর ফলাফল খোঁজা হচ্ছে... (এপিআই ইন্টিগ্রেশন বাকি)`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> অনলাইন পরীক্ষা ফলাফল <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">সহজেই মাদরাসার অভ্যন্তরীণ ও কেন্দ্রীয় পরীক্ষার ফলাফল সংগ্রহ করুন</p>
      </div>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">পরীক্ষার নাম নির্বাচন করুন</label>
            <select
              required
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium"
            >
              <option value="">-- নির্বাচন করুন --</option>
              <option value="first-term">প্রথম সাময়িক পরীক্ষা</option>
              <option value="annual">বার্ষিক পরীক্ষা</option>
              <option value="befaq">কেন্দ্রীয় বেফাক পরীক্ষা (মক)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">শিক্ষার্থীর রোল / আইডি নাম্বার</label>
            <input
              type="text"
              required
              placeholder="উদা: ১২৩৪"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm p-3.5 rounded-xl transition-all shadow-sm mt-2"
          >
            🔍 ফলাফল খুঁজুন
          </button>
        </form>
      </div>
    </div>
  );
}
