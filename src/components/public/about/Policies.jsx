// components/about/Policies.jsx
"use client";

export default function Policies({ data }) {
  const fallbackData = {
    title: "আমাদের নীতিমালা",
    subtitle: "মাদরাসার শৃঙ্খলা বজায় রাখতে ছাত্র ও অভিভাবকদের জন্য পালনীয় সাধারণ নিয়মাবলী",
    rules: [
      { id: 1, title: "উপস্থিতি ও ছুটি", detail: "অসুস্থতা ব্যতিরেকে কোনো শিক্ষার্থী ক্লাসে অনুপস্থিত থাকতে পারবে না। যেকোনো ছুটির জন্য অভিভাবককে সরাসরি অফিসে এসে লিখিত আবেদন করতে হবে।" },
      { id: 2, title: "পোশাক ও পরিচ্ছন্নতা", desc: "সর্বদা সুন্নাহ সম্মত সাদা জুব্বা ও টুপি পরিধান করতে হবে এবং চুল সর্বদা ইসলামি কাটিং এ সমান রাখতে হবে।" },
      { id: 3, title: "স্মার্টফোন ও গ্যাজেট নিষেধাজ্ঞা", detail: "আবাসিক কোনো শিক্ষার্থী মাদরাসায় কোনো প্রকার স্মার্টফোন, ক্যাসেট প্লেয়ার বা ইলেকট্রনিক ডিভাইস রাখতে পারবে না। ধরা পড়লে তা চিরতরে বাজেয়াপ্ত করা হবে।" }
    ]
  };

  const policyData = data || fallbackData;

  return (
    <div className="site-container">
      <div className="text-center mb-12">
        <h2 className="heading-primary flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
          {policyData.title}
          <span className="hidden sm:inline text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] mt-2">{policyData.subtitle}</p>
        <div className="w-24 h-1 bg-[#2196F3] mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#0D47A1] rotate-45 border border-[#90CAF9]"></div>
        </div>
      </div>

      <div className="space-y-4">
        {policyData.rules?.map((rule, index) => (
          <div key={rule.id || index} className="bg-white border border-[#90CAF9] rounded-xl p-6 shadow-sm hover:border-[#2196F3] transition-colors">
            <h4 className="text-lg font-bold text-[#0D47A1] flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2196F3]"></span>
              {rule.title}
            </h4>
            <p className="text-sm text-[#1E293B] leading-relaxed text-justify pl-5">
              {rule.detail || rule.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
