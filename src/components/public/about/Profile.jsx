// components/about/Profile.jsx
"use client";

export default function Profile({ data }) {
  // ডাটাবেজ থেকে ডাটা না আসা পর্যন্ত দেখানোর জন্য ডামি ডাটা (Fallback Data)
  const fallbackData = {
    bismillahText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    title: "প্রতিষ্ঠান পরিচিতি",
    subtitle: "দ্বীনি শিক্ষার আলো ছড়িয়ে দিতে এবং একটি আদর্শ কুরআনপ্রেমী প্রজন্ম গড়ে তোলার লক্ষ্যে আমাদের এই পথচলা।",
    description: "ঐতিহ্যবাহী এই দ্বীনি শিক্ষাপ্রতিষ্ঠানটি সুদীর্ঘ সময় ধরে অত্যন্ত সুনামের সাথে পবিত্র কুরআনুল কারীমের হিফজ এবং জেনারেল শিক্ষার এক অপূর্ব সমন্বয় ঘটিয়ে আসছে। আমরা বিশ্বাস করি, একজন শিক্ষার্থীকে কেবল প্রাতিষ্ঠানিক শিক্ষায় শিক্ষিত করলেই চলবে না, বরং তাকে নৈতিকতা, তাকওয়া এবং সুন্নাহর আলোয় আলোকিত মানুষ হিসেবে গড়ে তুলতে হবে।",
    hadithQuote: "तोमादेर मध्ये सेइ ब्यक्ति सर्बोत्तम, जिनि निजे कुरआन शिक्खा करे एबं अन्यके ता शिक्खा देय़। — आल हादीस",
    quickFactsTitle: "🌙 এক নজরে আমাদের মাদরাসা",
    facts: [
      { label: "প্রতিষ্ঠা সাল", value: "২০১৮ খ্রিষ্টাব্দ" },
      { label: "শিক্ষাক্রম", value: "হিফজুল কুরআন ও জেনারেল সমন্বিত" },
      { label: "মোট শিক্ষার্থী", value: "৫০০+ জন" },
      { label: "ক্যাম্পাস পরিবেশ", value: "সম্পূর্ণ আবাসিক ও সিসিটিভি নিয়ন্ত্রিত" }
    ]
  };

  // ডাটাবেজের ডাটা থাকলে সেটা ব্যবহার হবে, না থাকলে ডামি ডাটা
  const profile = data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* হেডিং সেকশন */}
      <div className="text-center mb-12">
        {profile.bismillahText && (
          <span className="text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase text-sm block mb-2">
            {profile.bismillahText}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {profile.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* বাম পাশের টেক্সট কন্টেন্ট */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-lg font-medium text-emerald-950 dark:text-emerald-300 leading-relaxed">
            {profile.subtitle}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
            {profile.description}
          </p>
          
          {profile.hadithQuote && (
            <div className="border-l-4 border-amber-500 bg-emerald-50/50 dark:bg-slate-800/50 p-4 rounded-r-xl">
              <p className="italic text-emerald-900 dark:text-emerald-400 font-medium">
                "{profile.hadithQuote}"
              </p>
            </div>
          )}
        </div>

        {/* ডান পাশের স্টাইলিশ ইনফো কার্ড */}
        <div className="lg:col-span-5">
          <div className="bg-emerald-900 text-white dark:bg-slate-800 dark:border dark:border-emerald-800/40 p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <h3 className="text-xl font-bold text-amber-400 border-b border-emerald-700 pb-3 mb-4 flex items-center gap-2">
              {profile.quickFactsTitle}
            </h3>
            
            <ul className="space-y-4 text-sm text-emerald-100 dark:text-gray-200">
              {profile.facts?.map((fact, index) => (
                <li key={index} className="flex justify-between border-b border-emerald-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{fact.label}:</span>
                  <span className="text-amber-300 font-semibold">{fact.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
