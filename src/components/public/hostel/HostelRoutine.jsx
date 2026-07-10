// components/public/hostel/HostelRoutine.jsx
"use client";

export default function HostelRoutine({ data }) {
  const fallbackData = {
    title: "দৈনিক আবাসিক কার্যসূচি (Daily Routine)",
    subtitle: "ছাত্রাবাসের ২৪ ঘন্টার নিয়মতান্ত্রিক সময়সূচী বিবরণী",
    schedule: [
      { time: "০৪:১৫ AM - ০৫:০০ AM", task: "ঘুম থেকে জাগরণ, তাহাজ্জুদ ও ফজরের প্রাক-প্রস্তুতি" },
      { time: "ফজর নামাযের পর", task: "কুরআন তিলাওয়াত, ইশরাক ও সকালের যিকর" },
      { time: "০৭:৩০ AM - ০৮:১৫ AM", task: "সকালের নাস্তা ও মাদরাসার ক্লাসের প্রস্তুতি" },
      { time: "০১:৩০ PM - ০২:৩০ PM", task: "যোহরের নামায, দুপুরের খাবার ও কায়লুলা (বিশ্রাম)" },
      { time: "আসর থেকে মাগরিব", task: "বিশ্রাম, খেলাধুলা বা ব্যক্তিগত কাজ এবং মাগরিবের প্রস্তুতি" },
      { time: "এশার নামাযের পর", task: "রাতের খাবার ও মুতালাআ (রাতের পাঠাভ্যাস)" },
      { time: "১০:০০ PM", task: "লাইট অফ ও বাধ্যতামূলক শয়ন" }
    ]
  };

  const currentData = data || fallbackData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> {currentData.title} <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentData.subtitle}</p>
      </div>

      <div className="relative border-l border-emerald-200 dark:border-slate-700 pl-6 space-y-6 max-w-2xl mx-auto">
        {currentData.schedule?.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* টাইমলাইন ডট */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition-transform"></div>
            
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-4 rounded-xl shadow-sm">
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-amber-400 block mb-1">
                ⏱ {item.time}
              </span>
              <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
