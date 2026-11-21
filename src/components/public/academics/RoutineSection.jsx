// components/public/academics/RoutineSection.jsx
"use client";

export default function RoutineSection({ title, subtitle, type }) {
  return (
    <div className="site-container">
      <div className="text-center mb-8 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      </div>

      <div className="bg-white border border-[#90CAF9] p-6 rounded-2xl max-w-2xl mx-auto text-center shadow-md">
        <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto text-3xl mb-4 border border-[#90CAF9]">
          📅
        </div>
        <h4 className="text-base font-bold text-[#0D47A1]">চলতি শিক্ষাবর্ষের সর্বশেষ {title}</h4>
        <p className="text-xs text-slate-500 mt-1">সর্বশেষ আপডেট: জুলাই ২০২৬</p>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button className="btn-primary text-xs py-2.5 px-5">
            👁 রুটিন দেখুন (PDF)
          </button>
          <button className="border border-[#90CAF9] text-[#0D47A1] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#E3F2FD] transition-all cursor-pointer">
            📥 ডাউনলোড করুন
          </button>
        </div>
      </div>
    </div>
  );
}
