"use client";

export default function StudentDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6 text-slate-800">
      {/* ওয়েলকাম হেডার */}
      <div className="bg-[#043e30] text-white p-6 rounded-2xl shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400">আস-সালামু আলাইকুম, আব্দুল্লাহ! 👋</h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">শ্রেণী: হিফজ বিভাগ | রোল: ০৫</p>
        </div>
        <span className="text-3xl hidden sm:block">📚</span>
      </div>

      {/* কুইক স্ট্যাটস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-emerald-600 font-bold text-xs uppercase tracking-wider">চলতি মাসের হাজিরা</div>
          <div className="text-2xl font-black mt-1 text-slate-900">৯২%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[92%]"></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-amber-600 font-bold text-xs uppercase tracking-wider">আজকের সবক (পড়া)</div>
          <div className="text-lg font-bold mt-1 text-slate-900">সূরা আল-বাকারাহ (রুকু ৫)</div>
          <p className="text-xs text-slate-500 mt-2">উস্তাদ: মাওলানা কারী ইউসুফ</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-blue-600 font-bold text-xs uppercase tracking-wider">সর্বশেষ পরীক্ষার ফলাফল</div>
          <div className="text-2xl font-black mt-1 text-slate-900">A+ <span className="text-xs font-normal text-slate-500">(৯৫/১০০)</span></div>
          <p className="text-xs text-slate-500 mt-2">মাসিক মূল্যায়ন পরীক্ষা - জুন</p>
        </div>
      </div>

      {/* ক্লাসরুম ও নোটিশ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold border-b pb-2 text-slate-900">💻 স্মার্ট ক্লাসরুম লিংক</h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-emerald-50 rounded-xl gap-3">
            <div>
              <p className="font-bold text-sm text-emerald-950">তাজবিদ ও কিরাত লাইভ ক্লাস</p>
              <p className="text-xs text-emerald-700">সময়: সকাল ০৮:৩০ টা</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-xs transition-colors">
              ক্লাসে জয়েন করুন ➜
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-base font-bold border-b pb-2 text-slate-900">🔔 নোটিশ বোর্ড</h3>
          <div className="p-3 bg-amber-50 rounded-xl border-l-4 border-amber-500">
            <p className="text-xs font-bold text-amber-950">আসন্ন সাময়িক পরীক্ষার রুটিন</p>
            <p className="text-[11px] text-slate-600 mt-1">আগামী ১৫ তারিখ থেকে অর্ধবার্ষিক পরীক্ষা শুরু হবে।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
