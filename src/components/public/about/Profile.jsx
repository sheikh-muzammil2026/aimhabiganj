// components/about/Profile.jsx
"use client";

import siteConfig from "@/config/siteConfig";

export default function Profile({ data }) {
  // ডাটাবেজ থেকে ডাটা না আসা পর্যন্ত দেখানোর জন্য ডামি ডাটা (Fallback Data)
  const fallbackData = {
    bismillahText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    title: "প্রতিষ্ঠান পরিচিতি",
    subtitle: `${siteConfig.slogan.bn}—একটি আদর্শ কুরআনপ্রেমী ও সুশিক্ষিত প্রজন্ম গড়ে তোলার লক্ষ্যে আমাদের এই পথচলা।`,
    description: `ঐতিহ্যবাহী ${siteConfig.name.fullBn} অত্যন্ত সুনামের সাথে পবিত্র কুরআনুল কারীমের হিফজ এবং জেনারেল শিক্ষার এক অপূর্ব সমন্বয় ঘটিয়ে আসছে। আমরা বিশ্বাস করি, একজন শিক্ষার্থীকে কেবল প্রাতিষ্ঠানিক শিক্ষায় শিক্ষিত করলেই চলবে না, বরং তাকে নৈতিকতা, তাকওয়া এবং সুন্নাহর আলোয় আলোকিত মানুষ হিসেবে গড়ে তুলতে হবে।`,
    hadithQuote: "তোমাদের মধ্যে সেই ব্যক্তি সর্বোত্তম, যিনি নিজে কুরআন শিক্ষা করে এবং অন্যকে তা শিক্ষা দেয়। — আল হাদিস",
    quickFactsTitle: `🌙 এক নজরে ${siteConfig.name.short}`,
    facts: [
      { label: "প্রতিষ্ঠা সাল", value: siteConfig.establishedYear.displayBn },
      { label: "শিক্ষাক্রম", value: "হিফজুল কুরআন ও জেনারেল সমন্বিত" },
      { label: "মোট শিক্ষার্থী", value: "১২০০+ জন" },
      { label: "ক্যাম্পাস পরিবেশ", value: "সম্পূর্ণ আবাসিক ও সিসিটিভি নিয়ন্ত্রিত" },
    ],
  };

  // ডাটাবেজের ডাটা থাকলে সেটা ব্যবহার হবে, না থাকলে ডামি ডাটা
  const profile = data || fallbackData;

  return (
    <div className="site-container py-12">
      {/* হেডিং সেকশন */}
      <div className="text-center mb-12">
        {profile.bismillahText && (
          <span className="text-[#2196F3] font-semibold tracking-wider uppercase text-sm block mb-2 font-mono">
            {profile.bismillahText}
          </span>
        )}
        <h2 className="heading-primary flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
          {profile.title}
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
        </h2>
        <div className="w-24 h-1 bg-[#2196F3] mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#0D47A1] rotate-45 border border-[#90CAF9]"></div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* বাম পাশের টেক্সট কন্টেন্ট */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-lg font-semibold text-[#0D47A1] leading-relaxed">
            {profile.subtitle}
          </p>
          <p className="text-[#1E293B] leading-relaxed text-justify whitespace-pre-line text-sm sm:text-base">
            {profile.description}
          </p>

          {profile.hadithQuote && (
            <div className="border-l-4 border-[#2196F3] bg-[#E3F2FD] p-4 rounded-r-xl">
              <p className="italic text-[#0D47A1] font-medium text-sm sm:text-base">
                &ldquo;{profile.hadithQuote}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* ডান পাশের স্টাইলিশ ইনফো কার্ড */}
        <div className="lg:col-span-5">
          <div className="bg-[#0D47A1] text-white p-8 rounded-2xl shadow-xl border border-[#90CAF9]/40 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white border-b border-[#90CAF9]/30 pb-3 mb-4 flex items-center gap-2">
              {profile.quickFactsTitle}
            </h3>

            <ul className="space-y-4 text-sm text-[#E3F2FD]">
              {profile.facts?.map((fact, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b border-[#90CAF9]/20 pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-medium text-[#E3F2FD]/90">{fact.label}:</span>
                  <span className="text-white font-bold">{fact.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
