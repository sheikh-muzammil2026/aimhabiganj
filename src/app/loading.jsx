"use contrast";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-6 transition-colors duration-300 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">

                {/* আউটার জ্যামিতিক রোটেটিং রিং (Luxury Islamic Rotating Ring) */}
                <div className="w-16 h-16 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-emerald-800 border-l-transparent animate-spin dark:border-b-emerald-400"></div>

                {/* ইনার পালসিং কোর লোগো প্লেসহোল্ডার */}
                <div className="absolute top-3 bg-white text-emerald-950 font-black text-xs w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-pulse border border-emerald-100 dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700">
                    AS
                </div>

                {/* লোডিং টেক্সট - আধুনিক বাংলা ফন্ট স্টাইল */}
                <p className="mt-5 text-sm font-bold text-emerald-950 tracking-wide dark:text-emerald-400 animate-pulse">
                    অনুগ্রহ করে অপেক্ষা করুন...
                </p>
                <span className="text-[10px] text-gray-400 mt-1 uppercase font-serif tracking-widest dark:text-slate-500">
                    Loading Assets
                </span>
            </div>
        </div>
    );
}