"use client";

export default function TopHeader() {
  return (
    <div className="w-full bg-slate-900 text-white relative overflow-hidden transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* ** মাদ্রাসার ব্যাকগ্রাউন্ড ইমেজ (আপাতত ডামি ইমেজ যুক্ত করা হয়েছে) ** */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590075865003-e48277afd558?q=80&w=1200&auto=format&fit=crop" 
          alt="মাদ্রাসার ব্যাকগ্রাউন্ড"
          className="w-full h-full object-cover opacity-25" 
        />
        {/* ছবির উপর ডার্ক ওভারলে গ্র্যাডিয়েন্ট যাতে লেখাগুলো স্পষ্টভাবে ফুটে ওঠে */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 opacity-80"></div>
      </div>

      {/* ব্যাকগ্রাউন্ড জলছাপ/মেহরাব ইফেক্ট (Luxury Islamic Custom SVG Pattern) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <path
            d="M50 0 L100 50 L50 100 L0 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
           strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left relative z-10 px-6 py-6 md:py-8 space-y-4 md:space-y-0">
        
        {/* লোগো সেকশন - বাম পাশে (আপাতত একটি ডামি লোগো যুক্ত করা হয়েছে) */}
        <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-8 bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
          <img
            src="https://api.dicebear.com/7.x/identicon/svg?seed=madrasah" 
            alt="মাদ্রাসার লোগো"
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </div>

        {/* ৩ ভাষায় মাদ্রাসার নাম - ডান পাশে/মাঝখানে */}
        <div className="flex-grow flex flex-col items-center md:items-start space-y-2 md:space-y-1">
          
          {/* ১. ঐতিহ্যবাহী আরবি নাম - ক্যালিগ্রাফি স্টাইল */}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-serif text-amber-300 dark:text-emerald-300 tracking-wider font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            dir="rtl"
            style={{ fontFamily: "'Reem Kufi', 'Amiri', serif" }}
          >
            مدرسة السلام النموذجية، حبيغنج
          </h1>

          {/* ২. বাংলা নাম (আধুনিক স্লিম ফন্ট বান্ধব) */}
          <p className="text-xl md:text-2xl font-bold text-emerald-50 tracking-normal dark:text-slate-200 drop-shadow-sm">
            আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ
          </p>

          {/* ৩. ইংরেজি নাম (Title Case) */}
          <h2 className="text-lg md:text-2xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans">
            As-Salam Ideal Madrasah
          </h2>
        </div>
      </div>
    </div>
  );
}
