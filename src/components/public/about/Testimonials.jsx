// components/about/Testimonials.jsx
"use client";

export default function Testimonials({ data }) {
  const fallbackData = {
    title: "متامত (শিক্ষার্থী ও উলামা)",
    subtitle: "আমাদের প্রতিষ্ঠান সম্পর্কে বিশিষ্ট গুণীজন ও অভিভাবকদের অনুভূতি",
    list: [
      { id: 1, name: "আল্লামা শফীকুল ইসলাম", identity: "খতিব ও গবেষক", msg: "এখানকার শিক্ষা পদ্ধতি এবং সুন্নাহর আমলি পরিবেশ সত্যিই প্রশংসনীয়। সাধারণ শিক্ষার অনন্য সমন্বয় শিক্ষার্থীদেরকে বিভ্রান্তি থেকে বাঁচাবে।" },
      { id: 2, name: "মো: আরিফুর রহমান", identity: "অভিভাবক", msg: "আমার ছেলে এখানে ১ বছর যাবত পড়ছে। তার আচার-ব্যবহার এবং আখলাকে যে পরিবর্তন লক্ষ্য করেছি, তাতে আমি একজন অভিভাবক হিসেবে অত্যন্ত সন্তুষ্ট।" }
    ]
  };

  const testimonialData = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {testimonialData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{testimonialData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonialData.list?.map((item, index) => (
          <div key={item.id || index} className="bg-emerald-900 text-white dark:bg-slate-800 dark:border dark:border-emerald-800/30 p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <span className="absolute right-6 top-2 text-6xl text-emerald-800/40 dark:text-slate-700 select-none">”</span>
            <p className="text-emerald-100 dark:text-gray-300 italic mb-6 leading-relaxed text-justify relative z-10">
              "{item.msg}"
            </p>
            <div className="border-t border-emerald-800/60 pt-4 flex items-center gap-3">
              <div>
                <h5 className="font-bold text-amber-400 text-base">{item.name}</h5>
                <p className="text-xs text-emerald-200/80 dark:text-gray-400">{item.identity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
