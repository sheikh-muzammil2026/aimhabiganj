import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 print:hidden text-gray-300 transition-colors duration-300 border-t-4 border-amber-500 dark:bg-slate-950 dark:border-emerald-600">
      {/* প্রধান ফুটার কন্টেইনার - py-16 ব্যালেন্সড স্পেসিং */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ১. মাদরাসা পরিচিতি ও লোগো সেকশন */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-white text-emerald-950 font-black p-2 rounded-full w-11 h-11 flex items-center justify-center shadow-md flex-shrink-0 border border-emerald-100 dark:bg-emerald-800 dark:text-white dark:border-emerald-700">
                AS
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-amber-400 tracking-wide leading-none capitalize">
                  As-Salam Ideal
                </span>
                <span className="text-xs font-semibold text-emerald-100 mt-1 dark:text-emerald-400">
                  আস-সালাম আইডিয়াল মাদরাসা
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-normal dark:text-slate-400">
              দ্বীনি ও আধুনিক শিক্ষার এক অপূর্ব সমন্বয়। অভিজ্ঞ উলামায়ে কেরাম ও দক্ষ শিক্ষকমণ্ডলী দ্বারা পরিচালিত হবিগঞ্জের একটি নির্ভরযোগ্য দ্বীনি শিক্ষা প্রতিষ্ঠান।
            </p>
            
            {/* সোশ্যাল মিডিয়া ও ওয়েবসাইট আইকন লিংক */}
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://facebook.com" // আপনার মাদরাসার অরিজিনাল ফেসবুক লিংক এখানে বসবে
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-emerald-900/50 text-emerald-200 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all duration-200 dark:bg-slate-900 dark:hover:bg-emerald-600 dark:hover:text-white font-bold text-xs"
                title="ফেসবুক পেজ"
              >
                FB
              </a>
              <a 
                href="https://youtube.com" // আপনার মাদরাসার অরিজিনাল ইউটিউব লিংক এখানে বসবে
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-emerald-900/50 text-emerald-200 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all duration-200 dark:bg-slate-900 dark:hover:bg-emerald-600 dark:hover:text-white font-bold text-xs"
                title="ইউটিউব চ্যানেল"
              >
                YT
              </a>
              <a 
                href="https://example.com" // মাদরাসার অন্য ওয়েবসাইটের লিংকটি এখানে বসবে
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-emerald-900/50 text-emerald-200 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-all duration-200 dark:bg-slate-900 dark:hover:bg-emerald-600 dark:hover:text-white font-bold text-xs"
                title="অন্যান্য ওয়েবসাইট"
              >
                WEB
              </a>
            </div>
          </div>

          {/* ২. গুরুত্বপূর্ণ লিংকসমূহ */}
          <div>
            <h3 className="text-base font-black text-amber-400 border-b border-emerald-800/60 pb-2 mb-4 tracking-wide dark:text-emerald-400 dark:border-slate-800">
              গুরুত্বপূর্ণ লিংক
            </h3>
            <ul className="space-y-3 text-sm font-normal text-gray-400 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">নোটিশ বোর্ড</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">মিডিয়া গ্যালারি</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">পরীক্ষার ফলাফল</Link>
              </li>
              <li>
                <Link href="/contact#feedback" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">অভিযোগ ও পরামর্শ</Link>
              </li>
            </ul>
          </div>

          {/* ৩. শিক্ষা ও ভর্তি কার্যক্রম */}
          <div>
            <h3 className="text-base font-black text-amber-400 border-b border-emerald-800/60 pb-2 mb-4 tracking-wide dark:text-emerald-400 dark:border-slate-800">
              শিক্ষা ও ভর্তি
            </h3>
            <ul className="space-y-3 text-sm font-normal text-gray-400 dark:text-slate-400">
              <li>
                <Link href="/admission#process" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">ভর্তি প্রক্রিয়া</Link>
              </li>
              <li>
                <Link href="/admission#fees" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">ভর্তি ও মাসিক ফি</Link>
              </li>
              <li>
                <Link href="/admission/form" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors duration-150 dark:text-emerald-500">✍️ অনলাইন ভর্তি ফরম</Link>
              </li>
              <li>
                <Link href="/smart-classroom/live" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">স্মার্ট লাইভ ক্লাস</Link>
              </li>
              <li>
                <Link href="/hostel#routine" className="hover:text-amber-400 dark:hover:text-white transition-colors duration-150">আবাসিক কার্যসূচি</Link>
              </li>
            </ul>
          </div>

          {/* ৪. যোগাযোগ ও ঠিকানা */}
          <div>
            <h3 className="text-base font-black text-amber-400 border-b border-emerald-800/60 pb-2 mb-4 tracking-wide dark:text-emerald-400 dark:border-slate-800">
              যোগাযোগ করুন
            </h3>
            <ul className="space-y-3.5 text-sm font-normal text-gray-400 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">📍</span>
                <span className="leading-relaxed">হবিগঞ্জ সদর,<br />হবিগঞ্জ, সিলেট, বাংলাদেশ।<br /></span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-amber-400 flex-shrink-0">📞</span>
                <span>+৮৮০১৮৩৬-৩৭৬১৭৪</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-amber-400 flex-shrink-0">✉️</span>
                <span className="break-all">info@assalammadrasah.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* কপিরাইট ও আরবি নাম অংশ */}
      <div className="bg-emerald-950 border-t border-emerald-900/60 text-xs py-5 px-4 dark:bg-slate-950 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-gray-400 font-medium dark:text-slate-500">
            &copy; ২০২৬ আস-সালাম আইডিয়াল মাদরাসা, হবিগঞ্জ। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-emerald-300/70 font-serif tracking-wide text-sm sm:text-base dark:text-slate-600" dir="rtl">
            مدرسة السلام النموذجية، حبيغنج
          </p>
        </div>
      </div>
    </footer>
  );
}
