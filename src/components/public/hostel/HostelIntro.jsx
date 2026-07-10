// components/public/hostel/HostelIntro.jsx
"use client";

// ১. ছাত্রাবাস পরিচিতি কম্পোনেন্ট
export function HostelAbout({ data }) {
  const fallbackData = {
    title: "ছাত্রাবাস পরিচিতি",
    subtitle: "শিক্ষার্থীদের জন্য নিরাপদ, সুশৃঙ্খল ও আধ্যাত্মিক পরিবেশ নিশ্চিতকরণ",
    desc: "আমাদের মাদরাসার আবাসিক হোস্টেল বা দারে জিয়াদাহ শিক্ষার্থীদের জন্য একটি আদর্শ দ্বীনি পরিবেশ প্রদান করে। এখানে ওস্তাদজিদের সার্বক্ষণিক তত্ত্বাবধানে থেকে শিক্ষার্থীরা পড়ালেখার পাশাপাশি তাকওয়া, শৃঙ্খলা এবং সুন্নতি জীবনযাপনে অভ্যস্ত হওয়ার সুযোগ পায়। মনোরম ও কোলাহলমুক্ত পরিবেশে অবস্থিত এই ছাত্রাবাসটি ইসলামি মূল্যবোধের আলোকে গড়ে তোলা হয়েছে।"
  };
  const currentData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700/80 p-6 md:p-8 rounded-2xl shadow-sm text-center">
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
          {currentData.desc}
        </p>
      </div>
    </div>
  );
}

// ২. আবাসন চার্ট কম্পোনেন্ট
export function HostelChart({ data }) {
  const fallbackData = {
    title: "আবাসন চার্ট ও ধারণক্ষমতা",
    subtitle: "বিভিন্ন আবাসিক হল, রুমের সংখ্যা ও সিটের বিন্যাস",
    stats: [
      { label: "মোট আবাসিক হল", value: "০৩ টি" },
      { label: "মোট কক্ষ (রুম)", value: "৪৫ টি" },
      { label: "মোট ধারণক্ষমতা", value: "৩৫০ জন" },
      { label: "বর্তমান খালি সিট", value: "২৪ টি" }
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {currentData.stats?.map((stat, idx) => (
          <div key={idx} className="bg-emerald-50/40 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 p-5 rounded-xl text-center">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{stat.label}</span>
            <span className="text-xl md:text-2xl font-black text-emerald-800 dark:text-amber-400">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
