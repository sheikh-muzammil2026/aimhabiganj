"use client";

export default function ParentDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6 text-slate-800">
      {/* হেডার */}
      <div className="bg-[#043e30] text-white p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400">অভিভাবক পোর্টাল (Parent Corner) 👨‍👩‍👦</h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">সন্তান: সালমান ফারসি | শ্রেণী: নাজেরা বিভাগ</p>
        </div>
        <button className="bg-amber-400 hover:bg-amber-500 text-[#043e30] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all w-full sm:w-auto">
          💳 অনলাইন ফি পেমেন্ট করুন
        </button>
      </div>

      {/* ট্র্যাকিং মডিউল */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* বাচ্চার পড়া ট্র্যাকিং */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs md:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-2">📖 দৈনিক সবক ও আমল রিপোর্ট</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">আজকের পড়া (সবক)</p>
                <p className="text-sm font-bold text-slate-800">প্যারা: ০৩, পৃষ্ঠা: ১২</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">উত্তম</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">আগের পড়া (সবকী)</p>
                <p className="text-sm font-bold text-slate-800">সূরা আল-ইমরান (১-২০ আয়াত)</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md">ভালো (শোনাতে হবে)</span>
            </div>
          </div>
        </div>

        {/* পেমেন্ট স্ট্যাটাস */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-2">💰 পেমেন্ট স্ট্যাটাস</h3>
          <div className="text-center py-2">
            <p className="text-xs text-slate-500">চলতি মাসের বকেয়া</p>
            <p className="text-3xl font-black text-rose-600 mt-1">৳ ২,৫00</p>
          </div>
          <div className="text-xs text-slate-500 text-center bg-rose-50 text-rose-800 p-2.5 rounded-xl font-medium">
            পরিশোধের শেষ তারিখ: ১৫ই জুলাই, ২০২৬
          </div>
        </div>
      </div>

      {/* হাজিরার গ্রাফ ও শিক্ষকদের নোটিশ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">📅 সন্তানের উপস্থিতি</h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-emerald-600">৯৬%</div>
            <p className="text-xs text-slate-500">এই মাসে সালমান মাত্র ১ দিন অনুপস্থিত ছিল। মাদরাসার নিয়ম মেনে চলায় ধন্যবাদ।</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">💬 উস্তাদের বার্তা</h3>
          <p className="text-xs text-slate-700 italic bg-amber-50/60 p-3 rounded-xl border-l-2 border-amber-400">
            "সালমান পড়ালেখায় খুব মনোযোগী। তবে বাসায় যেন মাখরাজগুলো আরেকটু বেশি রিভিশন দেয়, সেদিকে খেয়াল রাখবেন।" <br />
            <span className="block mt-2 text-right font-bold text-slate-600-— মাওলানা হাবিবুর রহমান</span>
          </p>
        </div>
      </div>
    </div>
  );
}
