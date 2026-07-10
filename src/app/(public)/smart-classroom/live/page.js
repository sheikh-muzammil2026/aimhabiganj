// app/smart-classroom/live/page.js
"use client";

export default function LiveClassPage() {
  const liveClasses = [
    { id: 1, subject: "মিশকাতুল মাসাবীহ (কিতাবুল ঈমান)", teacher: "মুফতি মাওলানা মাহমুদুল হাসান", time: "চলছে (সকাল ৯:০০ - ১০:৩০)", isLive: true, link: "#" },
    { id: 2, subject: "নাহবেমীর (আমেল আলোচনা)", teacher: "মাওলানা আবু বকর", time: "আজ দুপুর ২:০০ টা", isLive: false, link: "#" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
            🔴 লাইভ ক্লাসরুম
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">সরাসরি অনলাইন দরসে যুক্ত হোন</p>
        </div>

        <div className="space-y-4">
          {liveClasses.map((cls) => (
            <div key={cls.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{cls.teacher}</span>
                  {cls.isLive && (
                    <span className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> লাইভ
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{cls.subject}</h3>
                <p className="text-[11px] text-gray-400 mt-1">🕒 সময়: {cls.time}</p>
              </div>
              <button 
                disabled={!cls.isLive}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all self-start sm:self-center ${
                  cls.isLive 
                    ? "bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm cursor-pointer" 
                    : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {cls.isLive ? "➡️ ক্লাসে যুক্ত হোন" : "অপেক্ষা করুন"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
