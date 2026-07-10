// components/public/academics/RoutineSection.jsx
"use client";

export default function RoutineSection({ title, subtitle, type }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 rounded-2xl max-w-2xl mx-auto text-center shadow-md">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
          📅
        </div>
        <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">চলতি শিক্ষাবর্ষের সর্বশেষ {title}</h4>
        <p className="text-xs text-gray-400 mt-1">সর্বশেষ আপডেট: জুলাই ২০২৬</p>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm">
            👁 রুটিন দেখুন (PDF)
          </button>
          <button className="border border-emerald-800 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all">
            📥 ডাউনলোড করুন
          </button>
        </div>
      </div>
    </div>
  );
}
