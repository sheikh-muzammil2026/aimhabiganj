// components/about/Roster.jsx
"use client";

export default function Roster({ data }) {
  const fallbackData = {
    title: "কর্মক্ষেত্র ও দায়িত্ব (Roster)",
    subtitle: "মাদরাসার অভ্যন্তরীণ শৃঙ্খলা ও প্রশাসনিক দায়িত্ব বন্টন বিবরণী",
    headers: ["বিভাগ/কর্মক্ষেত্র", "প্রধান দায়িত্বপ্রাপ্ত", "সহকারী/সহযোগী", "মূল ফোকাস"],
    rows: [
      { dept: "শিক্ষা ও পাঠ্যক্রম", head: "মুফতি তারিক জামিল", assistant: "মাওলানা উবায়দুল্লাহ", focus: "সিলেবাস বাস্তবায়ন ও পরীক্ষা নিয়ন্ত্রণ" },
      { dept: "আবাসন ও শৃঙ্খলা", head: "মাওলানা আব্দুল করিম", assistant: "হাফেz নোমান", focus: "ছাত্রাবাস পরিচালনা ও খাবার তদারকি" },
      { dept: "স্মার্ট ক্লাসরুম ও আইটি", head: "জনাব আশরাফুল ইসলাম", assistant: "অফিস সহকারী", focus: "অনলাইন ক্লাস, এক্সাম ও ওয়েবসাইট আপডেট" }
    ]
  };

  const rosterData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {rosterData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{rosterData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      {/* রেসপনসিভ টেবিল কন্টেইনার */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-md">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-emerald-900 text-white dark:bg-slate-800 border-b border-emerald-800 dark:border-slate-700 text-right sm:text-left">
              {rosterData.headers?.map((header, idx) => (
                <th key={idx} className="p-4 font-bold text-amber-400 tracking-wide text-xs sm:text-sm">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 bg-white dark:bg-slate-900">
            {rosterData.rows?.map((row, index) => (
              <tr key={index} className="hover:bg-emerald-50/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold text-emerald-950 dark:text-emerald-300">{row.dept}</td>
                <td className="p-4 font-medium text-gray-700 dark:text-gray-200">{row.head}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{row.assistant}</td>
                <td className="p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50/40 dark:bg-slate-800/20">{row.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
