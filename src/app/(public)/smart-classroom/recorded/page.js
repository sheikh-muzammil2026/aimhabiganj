// app/smart-classroom/recorded/page.js
"use client";

export default function RecordedClassPage() {
  const videos = [
    { id: 1, title: "হিদায়াতুন্নাহু - প্রথম পাঠ (কালেমা ও প্রকারভেদ)", duration: "২৫:১৪", date: "০৯ জুলাই, ২০২৬" },
    { id: 2, title: "কাফিয়া - আল-ইসমু আল-মুরাব আলোচনা", duration: "৩৫:১০", date: "০৮ জুলাই, ২০২৬" },
    { id: 3, title: "নূরুল আনওয়ার - কিতাবুল্লাহ অধ্যায়", duration: "৪০:০৫", date: "০৬ জুলাই, ২০২৬" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">🎥 রেকর্ডেড ক্লাস আর্কাইভ</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">যেকোনো সময় পূর্বের ক্লাসগুলো পুনরায় দেখে নিন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-gray-100 dark:border-slate-700/60 shadow-sm group hover:shadow-md transition-all">
              <div className="w-full h-40 bg-slate-900 rounded-xl flex items-center justify-center text-white relative cursor-pointer">
                <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform">▶</div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-[10px] font-mono px-2 py-0.5 rounded text-white">⏱️ {vid.duration}</span>
              </div>
              <div className="pt-3 px-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2">{vid.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1">📅 আপলোড: {vid.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
