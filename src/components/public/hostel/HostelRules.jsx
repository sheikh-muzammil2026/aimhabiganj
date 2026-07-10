// components/public/hostel/HostelRules.jsx
"use client";

export default function HostelRules({ data }) {
  const fallbackData = {
    title: "আবাসন প্রাপ্তির নিয়মাবলী ও শর্তসমূহ",
    subtitle: "হোস্টেলে সিট বরাদ্দ পাওয়া এবং বজায় রাখার জন্য প্রয়োজনীয় গাইডলাইন",
    rules: [
      "মাদরাসায় নিয়মিত ভর্তি হওয়ার পর আবাসন ফর্ম সংগ্রহ করে আবেদন করতে হবে।",
      "বিগত শিক্ষাবর্ষের বার্ষিক পরীক্ষায় ন্যূনতম সন্তোষজনক ফলাফল বা জিপিএ থাকতে হবে।",
      "মাদরাসা ও ছাত্রাবাসের অভ্যন্তরীণ সকল আইন ও শৃঙ্খলা কঠোরভাবে মেনে চলার অঙ্গীকারনামা দিতে হবে।",
      "নির্ধারিত সময়ে মাসিক বোর্ডিং ও হোস্টেল ফি পরিশোধ করা বাধ্যতামূলক।",
      "নাযেম সাহেবের অনুমতি ব্যতীত কোনো ছাত্রাবাস ছাড়তে বা রুম পরিবর্তন করতে পারবে না।"
    ]
  };

  const currentData = data || fallbackData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-dashed border-emerald-300 dark:border-slate-700 shadow-sm space-y-3">
        {currentData.rules?.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
            <span className="w-5 h-5 bg-amber-500 text-white font-mono text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
