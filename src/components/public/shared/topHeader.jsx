"use client";

export default function TopHeader() {
    return (
        <div className="w-full bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 text-white py-4 px-4 border-b border-amber-500/30 relative overflow-hidden transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-emerald-800">

            {/* ব্যাকগ্রাউন্ড জলছাপ/মেহরাব ইফেক্ট (Luxury Islamic Custom SVG Pattern) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* ৩ ভাষায় মাদ্রাসার নাম - ইউনিফর্ম হেডিং ও রেসপনসিভ স্পেসিং */}
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center relative z-10 space-y-1">
                {/* ১. ইংরেজি নাম (Title Case) */}
                <h1 className="text-xl md:text-3xl font-black tracking-wide text-amber-400 dark:text-emerald-400 capitalize drop-shadow-sm font-sans">
                    As-Salam Ideal Madrasah
                </h1>

                {/* ২. বাংলা নাম (আধুনিক স্লিম ফন্ট বান্ধব) */}
                <p className="text-base md:text-xl font-bold text-emerald-50 tracking-normal dark:text-slate-200">
                    আস-সালাম আইডিয়াল মাদ্রাসা, হবিগঞ্জ
                </p>

                {/* ৩. ঐতিহ্যবাহী আরবি নাম */}
                <p className="text-sm md:text-base font-serif text-emerald-200/90 tracking-wider pt-0.5 dark:text-slate-400" dir="rtl">
                    مدرسة السلام النموذجية، حبيغنج
                </p>
            </div>
        </div>
    );
}