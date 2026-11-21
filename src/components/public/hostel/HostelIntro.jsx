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
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>
      <div className="max-w-3xl mx-auto bg-white border border-[#90CAF9] p-6 md:p-8 rounded-2xl shadow-sm text-center">
        <p className="text-sm md:text-base text-[#1E293B] leading-relaxed font-medium">
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
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {currentData.stats?.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#90CAF9] p-5 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-[#1E293B] block mb-1">{stat.label}</span>
            <span className="text-xl md:text-2xl font-black text-[#0D47A1]">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
