// app/smart-classroom/ebooks/page.js
"use client";

export default function EbooksPage() {
  const books = [
    { id: 1, name: "সহীহ বুখারী (আরবি-বাংলা) - সম্পূর্ণ খণ্ড", type: "PDF কিতাব", size: "৪৫ MB" },
    { id: 2, name: "কাফিয়া কিতাবের সহজ ও সাবলীল শরাহ", type: "লেকচার শিট", size: "৪.৮ MB" },
    { id: 3, name: "মিশকাতুল মাসাবীহ - দরস নোট (পর্ব ১)", type: "নোট খাতা", size: "১.২ MB" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">📚 ই-বুক ও লেকচার শিট</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">প্রয়োজনীয় কিতাব ও ক্লাসের লেকচার শিট ডাউনলোড করুন</p>
        </div>

        <div className="space-y-3">
          {books.map((book) => (
            <div key={book.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📘</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{book.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">📂 ধরন: {book.type} | 💾 সাইজ: {book.size}</p>
                </div>
              </div>
              <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                📥 ডাউনলোড
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
