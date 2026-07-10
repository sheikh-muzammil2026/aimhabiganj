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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {policyData.title}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{policyData.subtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>
      </div>

      <div className="space-y-4">
        {policyData.rules?.map((rule, index) => (
          <div key={rule.id || index} className="bg-white dark:bg-slate-800 border border-emerald-100/60 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:border-emerald-800 dark:hover:border-emerald-500 transition-colors">
            <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-400 flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {rule.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify pl-5">
              {rule.detail || rule.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
