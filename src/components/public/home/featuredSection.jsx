"use client";

import Link from "next/link";

export default function FeaturedSections() {
    const departments = [
        {
            title: "হিফজুল কুরআন বিভাগ",
            sub: "Hifz Department",
            tag: "তাহফীযুল কুরআন",
            // লাইট মোডে সাদা ব্যাকগ্রাউন্ড উইথ এমারেল্ড বর্ডার, ডার্ক মোডে ডার্ক গ্রাডিয়েন্ট
            cardBg: "bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-850",
            borderStyle: "border-slate-200 dark:border-slate-800/80 hover:border-emerald-600",
            textMain: "text-slate-900 dark:text-white",
            textSub: "text-slate-600 dark:text-gray-300",
            link: "/departments/hifz",
            points: ["নূরানী ও নাজেরা ইবতিদায়ী", "আন্তর্জাতিক মানের তাজবীদ", "হিফজ রিভিশন (দাউর)", "খাস দোয়া ও ইবাদত প্রশিক্ষণ"],
            icon: "🕌"
        },
        {
            title: "একাডেমিক ও জেনারেল বিভাগ",
            sub: "Academic & General Department",
            tag: "আধুনিক শিক্ষা",
            cardBg: "bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-850",
            borderStyle: "border-slate-200 dark:border-slate-800/80 hover:border-emerald-600",
            textMain: "text-slate-900 dark:text-white",
            textSub: "text-slate-600 dark:text-gray-300",
            link: "/departments/academic",
            points: ["প্লে থেকে দশম শ্রেণী", "স্মার্ট মাল্টিমিডিয়া ক্লাস", "ইংরেজি ও গণিতে বিশেষ যত্ন", "কম্পিউটার ও আইটি ল্যাব"],
            icon: "📚"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* সেকশন হেডার */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-emerald-700 dark:text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                        আমাদের কারিকুলাম
                    </h2>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        প্রধান শিক্ষাক্রম ও বিভাগসমূহ
                    </p>
                    <div className="w-12 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
                </div>

                {/* ডিপার্টমেন্ট কার্ডস লেআউট */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {departments.map((dept, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-3xl ${dept.cardBg} p-6 sm:p-10 shadow-md dark:shadow-none border-2 ${dept.borderStyle} flex flex-col justify-between group transition-all duration-300 hover:shadow-xl`}
                        >
                            {/* ব্যাকগ্রাউন্ড ডেকোরেশন আইকন */}
                            <div className="absolute right-6 bottom-6 text-8xl text-slate-100 dark:text-slate-800/20 pointer-events-none font-bold select-none transition-transform duration-500 group-hover:scale-110">
                                {dept.icon}
                            </div>

                            <div>
                                {/* ব্যাজ */}
                                <span className="inline-block bg-emerald-700 dark:bg-amber-500 text-white dark:text-slate-950 text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-5">
                                    {dept.tag}
                                </span>

                                {/* টাইটেল */}
                                <h3 className={`text-xl sm:text-2xl font-black ${dept.textMain}`}>{dept.title}</h3>
                                <p className="text-xs text-emerald-700 dark:text-amber-400/90 mb-5 font-mono font-semibold">{dept.sub}</p>

                                {/* বিবরণ */}
                                <p className={`text-sm ${dept.textSub} leading-relaxed mb-6`}>
                                    {dept.description}
                                </p>

                                {/* মূল আকর্ষণের লিস্ট */}
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {dept.points.map((pt, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-gray-300">
                                            <span className="text-emerald-600 dark:text-amber-400 font-bold">✔</span> {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* অ্যাকশন বাটন */}
                            <div className="pt-2">
                                <Link
                                    href={dept.link}
                                    className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-500 dark:text-white dark:hover:text-slate-950 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all duration-300 shadow-sm"
                                >
                                    বিস্তারিত দেখুন
                                    <span className="text-xs">➔</span>
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}