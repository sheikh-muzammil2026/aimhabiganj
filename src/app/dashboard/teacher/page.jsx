"use client";

export default function TeacherDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6 text-slate-800">
      {/* হেডার */}
      <div className="bg-[#043e30] text-white p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-400">উস্তাদ ড্যাশবোর্ড (Teacher Corner) 🕌</h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">মাওলানা কারী ইউসুফ আল-হাসানি | সিনিয়র শিক্ষক</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-emerald-600 transition-all">
            Daily Attendance
          </button>
          <button className="bg-amber-400 hover:bg-amber-500 text-[#043e30] font-bold text-xs px-3 py-2 rounded-xl shadow-md transition-all">
            নম্বর ইনপুট করুন
          </button>
        </div>
      </div>

      {/* দায়িত্বপ্রাপ্ত ক্লাসের তথ্য */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">প্রধান দায়িত্বপ্রাপ্ত ক্লাস</p>
          <p className="text-xl font-bold text-slate-900 mt-1">হিফজ (শাখা-ক)</p>
          <p className="text-xs text-slate-400 mt-1">মোট শিক্ষার্থী: ২৫ জন</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-emerald-600 font-bold text-xs uppercase tracking-wider">আজকের গড় উপস্থিতি</p>
          <p className="text-xl font-bold text-slate-900 mt-1">২৪ / ২৫ জন</p>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm font-bold mt-1 inline-block">১ জন অনুপস্থিত</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">পরবর্তী পিরিয়ড / ক্লাস</p>
          <p className="text-xl font-bold text-slate-900 mt-1">১০:১৫ AM - তাজবিদ</p>
          <p className="text-xs text-slate-400 mt-1">রুম নং: ৩০২ (২য় তলা)</p>
        </div>
      </div>

      {/* টু-ডু এবং একশন এরিয়া */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* আজকের ক্লাস রুটিন */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-2">📅 আজকের রুটিন ও সিডিউল</h3>
          <div className="divide-y divide-slate-100">
            <div className="flex justify-between py-3 items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">১ম পিরিয়ড: কিতাব বিভাগ</p>
                <p className="text-xs text-slate-400">সময়: ০৭:৩০ AM - ০৮:৩০ AM</p>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">সম্পন্ন</span>
            </div>
            <div className="flex justify-between py-3 items-center">
              <div>
                <p className="text-sm font-bold text-emerald-950">২য় পিরিয়ড: হিফজ রিভিশন (সবকী)</p>
                <p className="text-xs text-emerald-600 font-medium">সময়: ০৮:৪৫ AM - ১০:০০ AM</p>
              </div>
              <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-md font-bold animate-pulse">চলমান</span>
            </div>
          </div>
        </div>

        {/* কুইক অ্যাকশন বা নোটিশ টাস্ক */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-2">📝 জরুরি নোটিশ সাবমিশন</h3>
          <p className="text-xs text-slate-500">অভিভাবকদের উদ্দেশ্যে কোনো জরুরি নোটিশ বা ডায়েরি মেসেজ পাঠাতে নিচের ফিল্ডটি ব্যবহার করুন।</p>
          <textarea 
            placeholder="মেসেজটি এখানে লিখুন..." 
            className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-hidden resize-none bg-slate-50"
          ></textarea>
          <button className="w-full bg-[#043e30] hover:bg-emerald-950 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs">
            সবাইকে ব্রডকাস্ট করুন 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
