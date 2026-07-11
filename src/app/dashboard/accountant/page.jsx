"use client";

export default function AccountantDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6 text-slate-800">
      {/* হেডার */}
      <div className="bg-[#043e30] text-white p-6 rounded-2xl shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400">অর্থ ও হিসাব মডিউল 💰</h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">দায়িত্বে: প্রধান হিসাবরক্ষক কর্মকর্তা</p>
        </div>
        <button className="bg-amber-400 hover:bg-amber-500 text-[#043e30] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all">
          + নতুন রশিদ তৈরি
        </button>
      </div>

      {/* ফাইন্যান্সিয়াল কার্ডসমূহ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-emerald-600 font-bold text-xs uppercase">চলতি মাসের মোট আয়</p>
          <p className="text-2xl font-black text-slate-900 mt-1">৳ ৪,৫০,০০০</p>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium mt-2 inline-block">↑ ১২% বৃদ্ধি</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-rose-600 font-bold text-xs uppercase">চলতি মাসের মোট ব্যয়</p>
          <p className="text-2xl font-black text-slate-900 mt-1">৳ ১,২০,০০০</p>
          <span className="text-[11px] text-slate-500 mt-2 inline-block">ভাউচার অনুমোদিত: ১৫টি</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-amber-600 font-bold text-xs uppercase">মোট বকেয়া ফি</p>
          <p className="text-2xl font-black text-slate-900 mt-1">৳ ৮৫,০০০</p>
          <span className="text-[11px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md font-medium mt-2 inline-block">নোটিশ পাঠানো হয়েছে</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-blue-600 font-bold text-xs uppercase">লিল্লাহ ও জাকাত তহবিল</p>
          <p className="text-2xl font-black text-slate-900 mt-1">৳ ৩,১০,০০০</p>
          <span className="text-[11px] text-slate-500 mt-2 inline-block">সুরক্ষিত ও ডেডিকেটেড ফান্ড</span>
        </div>
      </div>

      {/* সাম্প্রতিক ট্রানজেকশন টেবিল */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">🔄 সাম্প্রতিক লেনদেনসমূহ</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-semibold">রশিদ নং</th>
                <th className="p-3 font-semibold">শিক্ষার্থী/বিবরণ</th>
                <th className="p-3 font-semibold">খাত</th>
                <th className="p-3 font-semibold">পরিমাণ</th>
                <th className="p-3 font-semibold">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium text-slate-500">#TR-১০৯২</td>
                <td className="p-3 font-bold text-slate-800">মাহমুদ হাসান (রোল ০২)</td>
                <td className="p-3 text-slate-600">মাসিক টিউশন ফি</td>
                <td className="p-3 font-bold text-slate-900">৳ ৩,০০০</td>
                <td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">পেইড</span></td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-500">#VN-৪৫৩১</td>
                <td className="p-3 font-bold text-slate-800">অফিস খাতা ও স্টেশনারি</td>
                <td className="p-3 text-slate-600">মাদরাসা খরচ</td>
                <td className="p-3 font-bold text-slate-900">৳ ৪,৫০০</td>
                <td className="p-3"><span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">অনুমোদিত</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
