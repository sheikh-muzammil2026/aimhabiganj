// components/public/academics/SyllabusAndCoCurricular.jsx
"use client";

// ১. সিলেবাস কম্পোনেন্ট
export function Syllabus({ data }) {
  const fallbackData = {
    title: "শিক্ষাক্রম ও পাঠ্যক্রম (Syllabus)",
    subtitle: "বেফাকুল মাদারিসিল আরাবিয়া এবং আধুনিক জেনারেল বিষয়ের সমন্বিত পাঠ্যসূচী",
    books: [
      { dept: "আরবী ও ইসলামিয়াত", items: ["তাফসীরে জালালাইন", "সহীহুল বুখারী", "হেদায়া (ফিকহ)", "নাহব-সরফ (ব্যাকরণ)"] },
      { dept: "জেনারেল বিষয়সমূহ", items: ["বাংলা সাহিত্য", "ইংরেজি ভাষা ও গ্রামার", "সাধারণ গণিত", "ইতিহাস ও ভূগোল"] }
    ]
  };
  const currentData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentData.books?.map((box, idx) => (
          <div key={idx} className="bg-emerald-50/40 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 p-6 rounded-2xl">
            <h4 className="text-base font-bold text-emerald-900 dark:text-amber-400 border-b border-emerald-200/60 dark:border-slate-700 pb-2 mb-4">
              📚 {box.dept}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {box.items.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded border border-gray-100 dark:border-slate-800">
                  <span className="text-emerald-600">✔</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ২. সহ-পাঠ্যক্রম কম্পোনেন্ট
export function CoCurricular({ data }) {
  const fallbackData = {
    title: "সহ-পাঠ্যক্রম কার্যক্রম",
    subtitle: "শিক্ষার্থীদের মানসিক বিকাশ ও সুপ্ত প্রতিভা অন্বেষণে আমাদের সাপ্তাহিক আয়োজন",
    activities: ["সাপ্তাহিক বক্তৃতা ও সাহিত্য মজলিস", "আরবী, বাংলা ও ইংরেজি হাতের লেখা প্রতিযোগিতা", "ইসলামিক কুইজ ও ইনডোর গেমস", "বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা"]
  };
  const currentData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.activities?.map((act, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-dashed border-emerald-300 dark:border-slate-700 text-center flex flex-col justify-center shadow-sm">
            <span className="text-2xl mb-2">✨</span>
            <p className="text-xs font-bold text-emerald-950 dark:text-emerald-300">{act}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
