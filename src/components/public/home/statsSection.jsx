"use client";

export default function StatsSection() {
    const stats = [
        {
            number: "১,২০০+",
            label: "মোট শিক্ষার্থী",
            desc: "হিফজ ও একাডেমিক বিভাগ মিলিয়ে",
            icon: "👨‍🎓",
        },
        {
            number: "৪৫+",
            label: "বিজ্ঞ শিক্ষক ও উলামা",
            desc: "সার্বক্ষণিক মায়া ও যত্নে নিয়োজিত",
            icon: "👨‍🏫",
        },
        {
            number: "১৫+",
            label: "স্মার্ট ও ডিজিটাল ক্লাসরুম",
            desc: "আধুনিক মাল্টিমিডিয়া প্রজেক্টর সমৃদ্ধ",
            icon: "🖥️",
        },
        {
            number: "১০০%",
            label: "পরীক্ষায় সফলতার হার",
            desc: "বিগত বছরের বোর্ড ও মাদ্রাসা ফলাফল",
            icon: "🏆",
        },
    ];

    return (
        <section className="py-16 bg-emerald-900 dark:bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
            {/* ব্যাকগ্রাউন্ড ডেকোরেশন প্যাটার্ন */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white blur-2xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-emerald-950/40 dark:bg-slate-950/40 p-6 rounded-xl border border-emerald-800 dark:border-slate-800 text-center transform hover:-translate-y-1 transition-all duration-300 shadow-lg group"
                        >
                            {/* আইকন */}
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 select-none">
                                {stat.icon}
                            </div>
                            {/* সংখ্যা */}
                            <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-wide mb-1 font-sans">
                                {stat.number}
                            </p>
                            {/* টাইটেল */}
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                                {stat.label}
                            </h3>
                            {/* ছোট ডেসক্রিপশন */}
                            <p className="text-xs text-emerald-200/70 dark:text-gray-400">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}