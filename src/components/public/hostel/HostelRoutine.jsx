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
    <div className="site-container">
      <div className="text-center mb-10 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> {currentData.title} <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">{currentData.subtitle}</p>
      </div>

      <div className="relative border-l border-[#90CAF9] pl-6 space-y-6 max-w-2xl mx-auto">
        {currentData.schedule?.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* টাইমলাইন ডট */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#2196F3] border-4 border-white group-hover:scale-125 transition-transform"></div>
            
            <div className="bg-white border border-[#90CAF9] p-4 rounded-xl shadow-sm">
              <span className="text-xs font-mono font-bold text-[#0D47A1] block mb-1">
                ⏱ {item.time}
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
