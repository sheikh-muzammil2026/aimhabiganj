"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
    // স্লাইডারের জন্য স্টেট
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselImages = [
        {
            url: "/deenishikka.png",
            title: "দ্বীনি শিক্ষার এক অনন্য নির্ভরযোগ্য প্রতিষ্ঠান",
            subtitle: "জ্ঞানের আলোয় আলোকিত হোক আগামী প্রজন্ম",
        },
        {
            url: "/hero2.png",
            title: "আধুনিক ও সুশৃঙ্খল আবাসন ব্যবস্থা",
            subtitle: "ছাত্রদের মননশীল ও নৈতিক বিকাশে আমরা অঙ্গীকারাবদ্ধ",
        },
        {
            url: "/hero3.png",
            title: "হিফজ ও একাডেমিক শিক্ষার চমৎকার সমন্বয়",
            subtitle: "অভিজ্ঞ উলামা ও দক্ষ শিক্ষক মণ্ডলী দ্বারা পরিচালিত",
        },
    ];

    // অটোমেটিক স্লাইডার চেঞ্জ হওয়ার ইফেক্ট
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselImages.length]);

    return (
        <div className="w-full select-none">

            {/* ১. নোটিশবোর্ড স্ক্রোলার (Notice Ticker) */}
            <div className="bg-amber-500 dark:bg-amber-400 text-slate-900 font-medium py-2 px-4 shadow-sm flex items-center overflow-hidden border-b border-amber-600 dark:border-amber-500 transition-colors duration-300">
                <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider z-10 whitespace-nowrap mr-3 animate-pulse">
                    জরুরী নোটিশ:
                </div>
                <div className="relative w-full overflow-hidden flex items-center">
                    <p className="animate-marquee whitespace-nowrap text-sm md:text-base font-semibold">
                        📢 আস-সালাম আইডিয়াল মাদ্রাসা (AIM)-এ ২০২৬ শিক্ষাবর্ষে হিফজ ও একাডেমিক বিভাগে ভর্তি চলছে! আসন সংখ্যা সীমিত। বিস্তারিত জানতে ভর্তি মেনু ভিজিট করুন। 🌟 আগামী ২৩ আগস্ট থেকে দ্বিতীয় সাময়িক পরীক্ষা শুরু হতে যাচ্ছে। সকল ছাত্রদের যথাসময়ে উপস্থিত থাকার নির্দেশ দেওয়া হলো।
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
                        {/* ব্যাকগ্রাউন্ড ওভারলে - যা লাইট/ডার্ক মুডে টেক্সটকে ফুটিয়ে তুলবে */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent z-10" />

                        <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[5000ms]"
                        />

                        {/* স্লাইড টেক্সট */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 z-20 max-w-3xl text-white">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-emerald-400 dark:text-amber-400 drop-shadow-md transition-colors duration-300">
                                {slide.title}
                            </h1>
                            <p className="text-sm sm:text-base md:text-xl text-slate-200 mb-8 font-light">
                                {slide.subtitle}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/admission"
                                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm md:text-base"
                                >
                                    অনলাইন ভর্তি ফরম
                                </Link>
                                <Link
                                    href="/about"
                                    className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-semibold px-6 py-3 rounded-xl transition text-sm md:text-base"
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
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-amber-500 w-6" : "bg-white/50 w-2.5"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
