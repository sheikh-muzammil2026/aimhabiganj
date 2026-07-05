"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
    // স্লাইডারের জন্য স্টেট
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselImages = [
        {
            url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200",
            title: "দ্বীনি শিক্ষার এক অনন্য নির্ভরযোগ্য প্রতিষ্ঠান",
            subtitle: "জ্ঞানের আলোয় আলোকিত হোক আগামী প্রজন্ম",
        },
        {
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
            title: "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থা",
            subtitle: "ছাত্রদের মননশীল ও নৈতিক বিকাশে আমরা অঙ্গীকারাবদ্ধ",
        },
        {
            url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200",
            title: "হিফজ ও একাডেমিক শিক্ষার চমৎকার সমন্বয়",
            subtitle: "অভিজ্ঞ উলামা ও দক্ষ শিক্ষক মণ্ডলী দ্বারা পরিচালিত",
        },
    ];

    // অটোমেটিক স্লাইডার চেঞ্জ হওয়ার ইফেক্ট
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselImages.length]);

    return (
        <div className="bg-slate-50 min-h-screen text-gray-800 font-sans">

            {/* ১. নোটিশবোর্ড স্ক্রোলার (Notice Ticker) */}
            <div className="bg-amber-500 text-slate-900 font-medium py-2 px-4 shadow-sm flex items-center overflow-hidden border-b border-amber-600">
                <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider z-10 whitespace-nowrap mr-3 animate-pulse">
                    জরুরী নোটিশ:
                </div>
                <div className="relative w-full overflow-hidden flex items-center">
                    <p className="animate-marquee whitespace-nowrap text-sm md:text-base font-semibold">
                        📢 আস-সালাম আইডিয়াল মাদ্রাসা (AIM)-এ ২০২৬ শিক্ষাবর্ষে হিফজ ও একাডেমিক বিভাগে ভর্তি চলছে! আসন সংখ্যা সীমিত। বিস্তারিত জানতে ভর্তি মেনু ভিজিট করুন। 🌟 আগামী ১৫ই জুলাই থেকে প্রথম সাময়িক পরীক্ষা শুরু হতে যাচ্ছে। সকল ছাত্রদের যথাসময়ে উপস্থিত থাকার নির্দেশ দেওয়া হলো।
                    </p>
                </div>
            </div>

            {/* ২. ব্যানার ক্যারোসল (Hero Banner Carousel) */}
            <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden bg-slate-900">
                {carouselImages.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0 invisible"
                            }`}
                    >
                        {/* ব্যাকগ্রাউন্ড ইমেজ ম্লান করার জন্য ওভারলে */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent z-10" />
                        <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[5000ms]"
                        />
                        {/* স্লাইড টেক্সট */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 z-20 max-w-3xl text-white">
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-emerald-400 drop-shadow">
                                {slide.title}
                            </h1>
                            <p className="text-base md:text-xl text-slate-200 mb-8 font-light">
                                {slide.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/admission/apply"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-md shadow transition transform hover:-translate-y-0.5 text-sm md:text-base"
                                >
                                    অনলাইন ভর্তি ফরম
                                </Link>
                                <Link
                                    href="/about"
                                    className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-semibold px-6 py-3 rounded-md transition text-sm md:text-base"
                                >
                                    আমাদের সম্পর্কে জানুন
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* স্লাইডার ডট ইন্ডিকেটর */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3 w-3 rounded-full transition-all ${index === currentSlide ? "bg-amber-500 w-6" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ৩. এক নজরে পুরো মাদ্রাসা (At a Glance Matrix) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 border-b-4 border-emerald-600 pb-3 inline-block">
                        এক নজরে aimhabiganj
                    </h2>
                    <p className="text-gray-600 mt-4 text-sm md:text-base">
                        মাদ্রাসার সামগ্রিক অবকাঠামো, জনবল ও শিক্ষার্থীদের একটি সংক্ষিপ্ত পরিসংখ্যান।
                    </p>
                </div>

                {/* স্ট্যাট গ্রিড */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-emerald-600 text-center transition hover:shadow-lg">
                        <div className="bg-emerald-100 text-emerald-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            🎓
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">৩০০</h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base">মোট শিক্ষার্থী</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-600 text-center transition hover:shadow-lg">
                        <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            🕌
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">২৫</h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base">শিক্ষক ও উলামা</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-amber-500 text-center transition hover:shadow-lg">
                        <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            🏢
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">০২</h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base">প্রধান অনুষদ/বিভাগ</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-600 text-center transition hover:shadow-lg">
                        <div className="bg-purple-100 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            ❤️
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">১০০%</h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base">প্রবাসী ও দাতা অনুদান স্বচ্ছতা</p>
                    </div>
                </div>
            </section>

            {/* ৪. কুইক অ্যাকশন গেটওয়ে (Quick Portals) */}
            <section className="bg-emerald-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-amber-400 mb-2">আপনি কি একজন অভিভাবক?</h3>
                        <p className="text-emerald-100 text-sm">আপনার সন্তানের দৈনিক উপস্থিতি, পরীক্ষার রেজাল্ট এবং মাদ্রাসার ফি সংক্রান্ত যাবতীয় ট্র্যাকিং করুন সহজে।</p>
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-4 md:justify-end">
                        <Link
                            href="/login"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-md shadow transition"
                        >
                            অভিভাবক লগইন প্যানেল
                        </Link>
                        <Link
                            href="/admission"
                            className="bg-transparent hover:bg-white/10 text-white border border-white font-medium px-6 py-3 rounded-md transition"
                        >
                            নতুন ভর্তি নির্দেশিকা
                        </Link>
                        <Link
                            href="/contact?type=donation"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md shadow transition"
                        >
                            🤝 প্রবাসী ফান্ড ও ডনেশন
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}