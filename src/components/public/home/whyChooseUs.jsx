"use client";

export default function WhyChooseUs() {
    const features = [
        {
            icon: "🕌",
            title: "সহীহ আকিদা ও আমল",
            description: "কুরআন ও সুন্নাহর সঠিক নির্দেশনায় শিক্ষার্থীদের আত্মশুদ্ধি এবং সুন্নতি জিন্দেগি গঠনে সার্বক্ষণিক তদারকি।",
        },
        {
            icon: "🖥️",
            title: "স্মার্ট ক্লাসরুম ও মাল্টিমিডিয়া",
            description: "আধুনিক প্রজেক্টর, লাইভ ক্লাস, ই-বুক এবং ডিজিটাল প্রযুক্তির মাধ্যমে পড়ালেখাকে সহজ ও আকর্ষণীয় করা।",
        },
        {
            icon: "🇬🇧",
            title: "আরবি ও ইংরেজি ভাষা শিক্ষা",
            description: "দ্বীনি শিক্ষার পাশাপাশি আন্তর্জাতিক ভাষা হিসেবে আরবি ও ইংরেজিতে অনর্গল কথা বলা ও লেখার বিশেষ প্রশিক্ষণ।",
        },
        {
            icon: "🛌",
            title: "উন্নত আবাসিক ও নিরাপদ পরিবেশ",
            description: "সিসিটিভি ক্যামেরায় নিয়ন্ত্রিত ক্যাম্পাস, পুষ্টিকর খাবার এবং অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে মনোরম হোস্টেল ব্যবস্থা।",
        },
        {
            icon: "👨‍🏫",
            title: "দক্ষ ও মায়াবিপন্ন উলামায়ে কেরাম",
            description: "দেশ-বিদেশের স্বনামধন্য বিশ্ববিদ্যালয় ও বড় মাদ্রাসা থেকে পাস করা একঝাঁক আন্তরিক ও অভিজ্ঞ শিক্ষক মণ্ডলী।",
        },
        {
            icon: "📈",
            title: "ব্যক্তিগত প্রতিভা বিকাশ",
            description: "বক্তৃতা, ক্যালিগ্রাফি, কুইজ এবং বিভিন্ন সহ-শিক্ষা কার্যক্রমের মাধ্যমে প্রতিটি শিশুর সুপ্ত প্রতিভা প্রকাশ।",
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* সেকশন হেডার */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-emerald-700 dark:text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                        আমাদের বৈশিষ্ট্য
                    </h2>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        কেন আপনার সন্তানের জন্য <br className="hidden sm:inline" /> আস-সালাম মাদ্রাসা নির্বাচন করবেন?
                    </p>
                    <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
                </div>

                {/* বৈশিষ্ট্য গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1"
                        >
                            {/* আইকন বক্স - লাইট মোডে হালকা ব্যাকগ্রাউন্ড, ডার্ক মোডে সলিড */}
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-950 text-emerald-700 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner group-hover:bg-emerald-700 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-slate-950 transition-all duration-300 mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-gray-100 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}