// components/public/academics/SyllabusAndCoCurricular.jsx
"use client";

// ১. সিলেবাস কম্পোনেন্ট
export function Syllabus({ data }) {
  const fallbackData = {
    title: "শিক্ষাক্রম ও পাঠ্যক্রম (Syllabus)",
    subtitle: "বেফাকুল মাদারিসিল আরাবিয়া এবং আধুনিক জেনারেল বিষয়ের সমন্বিত পাঠ্যসূচী",
    books: [
      { dept: "আরবী ও ইসলামিয়াত", items: ["তাফসীরে জালালাইন", "সহীহুল বুখারী", "হেদায়া (ফিকহ)", "নাহব-সরফ (ব্যাকরণ)"] },
      { dept: "জেনারেল বিষয়সমূহ", items: ["বাংলা সাহিত্য", "ইংরেজি ভাষা ও গ্রামার", "সাধারণ গণিত", "ইতিহাস ও ভূগোল"] }
    ]
  };
  const currentData = data || fallbackData;

  return (
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentData.books?.map((box, idx) => (
          <div key={idx} className="bg-white border border-[#90CAF9] p-6 rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-[#0D47A1] border-b border-[#90CAF9]/40 pb-2 mb-4">
              📚 {box.dept}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#1E293B]">
              {box.items?.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5 bg-[#E3F2FD]/50 p-2.5 rounded-xl border border-[#90CAF9]/40">
                  <span className="text-[#2196F3] font-bold">✔</span> {item}
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
    subtitle: "শিক্ষার্থীদের মানসিক বিকাশ ও সুপ্ত প্রতিভা অন্বেষণে আমাদের সাপ্তাহিক আয়োজন",
    activities: ["সাপ্তাহিক বক্তৃতা ও সাহিত্য মজলিস", "আরবী, বাংলা ও ইংরেজি হাতের লেখা প্রতিযোগিতা", "ইসলামিক কুইজ ও ইনডোর গেমস", "বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা"]
  };
  const currentData = data || fallbackData;

  return (
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.activities?.map((act, index) => (
          <div key={index} className="bg-white border border-[#90CAF9] p-5 rounded-2xl shadow-sm text-center">
            <span className="w-8 h-8 rounded-full bg-[#E3F2FD] text-[#0D47A1] font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-[#90CAF9]">
              {index + 1}
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#0D47A1] leading-relaxed">
              {act}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}