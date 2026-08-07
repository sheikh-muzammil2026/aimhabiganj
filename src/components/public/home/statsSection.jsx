"use client";

import { useEffect, useState, useRef } from "react";

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার হেলপার ফাংশন
const toBengaliNumber = (num) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
        .toString()
        .replace(/\d/g, (digit) => bengaliDigits[digit])
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// কাউন্টার কম্পোনেন্ট
function AnimatedCounter({ targetNumber, suffix = "" }) {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // যখন কম্পোনেন্টটি স্ক্রিনে দৃশ্যমান হবে এবং আগে এনিমেশন হয়নি
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const duration = 2000; // ২ সেকেন্ড ধরে এনিমেশন চলবে
                    const steps = 60; // ৬০ FPS
                    const stepTime = duration / steps;
                    let currentStep = 0;

                    const timer = setInterval(() => {
                        currentStep++;
                        // Ease-out Effect (শুরুতে দ্রুত, শেষের দিকে হালকা ধীর)
                        const progress = currentStep / steps;
                        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(easeOutProgress * targetNumber);

                        if (currentStep >= steps) {
                            setCount(targetNumber);
                            clearInterval(timer);
                        } else {
                            setCount(currentVal);
                        }
                    }, stepTime);
                }
            },
            { threshold: 0.3 } // ৩০% দৃশ্যমান হলে ট্র্রিগার হবে
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [targetNumber, hasAnimated]);

    return (
        <span ref={elementRef}>
            {toBengaliNumber(count)}{suffix}
        </span>
    );
}

export default function StatsSection() {
    const stats = [
        {
            value: 1200,
            suffix: "+",
            label: "মোট শিক্ষার্থী",
            desc: "হিফজ ও একাডেমিক বিভাগ মিলিয়ে",
            icon: "👨‍🎓",
        },
        {
            value: 45,
            suffix: "+",
            label: "বিজ্ঞ শিক্ষক ও উলামা",
            desc: "সার্বক্ষণিক মায়া ও যত্নে নিয়োজিত",
            icon: "👨‍🏫",
        },
        {
            value: 15,
            suffix: "+",
            label: "স্মার্ট ও ডিজিটাল ক্লাসরুম",
            desc: "আধুনিক মাল্টিমিডিয়া প্রজেক্টর সমৃদ্ধ",
            icon: "🖥️",
        },
        {
            value: 100,
            suffix: "%",
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
                            
                            {/* এনিমেটেড সংখ্যা */}
                            <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-wide mb-1 font-sans">
                                <AnimatedCounter targetNumber={stat.value} suffix={stat.suffix} />
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
