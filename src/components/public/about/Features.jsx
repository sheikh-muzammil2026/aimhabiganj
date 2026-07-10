// components/about/Features.jsx
"use client";

export default function Features({ data }) {
  const fallbackData = {
    title: "আমাদের বৈশিষ্ট্য",
    subtitle: "অন্যান্য সাধারণ শিক্ষাপ্রতিষ্ঠানের চেয়ে আমরা কেন অনন্য?",
    items: [
      { id: 1, icon: "🕌", title: "সুন্নাহর সার্বক্ষণিক অনুশীলন", desc: "শিক্ষার্থীদের দৈনন্দিন জীবনে সুন্নাহ ও ইসলামী আদব বাস্তবায়নে বিশেষ গুরুত্ব দেওয়া হয়।" },
      { id: 2, icon: "💻", title: "স্মার্ট ক্লাসরুম ব্যবস্থা", desc: "আধুনিক প্রযুক্তির সমন্বয়ে ই-বুক, লেকচার শিট ও মাল্টিমিডিয়া প্রজেক্টরের মাধ্যমে ক্লাস।" },
      { id: 3, icon: "🛡️", title: "নিরাপদ আবাসিক পরিবেশ", desc: "সম্পূর্ণ ক্যাম্পাস সিসিটিভি ক্যামেরা দ্বারা নিয়ন্ত্রিত এবং সার্বক্ষণিক কেয়ারটেকার নিয়োজিত।" },
      { id: 4, icon: "🩺", title: "ফ্রি চিকিৎসা ও স্বাস্থ্যসেবা", desc: "আবাসিক শিক্ষার্থীদের জন্য নিয়মিত অভিজ্ঞ ডাক্তার দ্বারা ফ্রি স্বাস্থ্য পরীক্ষা।" }
    ]
  };

  const featureData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {featureData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{featureData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureData.items?.map((item, index) => (
          <div key={item.id || index} className="bg-white dark:bg-slate-800 border-t-4 border-emerald-800 dark:border-emerald-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4 bg-emerald-50 dark:bg-slate-700 w-14 h-14 rounded-full flex items-center justify-center border border-emerald-100 dark:border-slate-600">
              {item.icon}
            </div>
            <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-300 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
