"use client";

export default function ReviewsTestimonial() {
    const reviews = [
        {
            name: "মাওলানা মাহমুদুল হাসান",
            role: "বিশিষ্ট আলেম ও শিক্ষাবিদ",
            rating: "⭐⭐⭐⭐⭐",
            comment: "আস-সালাম মাদ্রাসার দ্বীনি ও আধুনিক শিক্ষার সমন্বয়টি চমৎকার। বিশেষ করে শিক্ষার্থীদের আখলাক এবং সুন্নতি জিন্দেগি গঠনের প্রতি শিক্ষকদের আন্তরিকতা সত্যিই প্রশংসনীয়।"
        },
        {
            name: "প্রকৌশলী আনিসুর রহমান",
            role: "অভিভাবক (৫ম শ্রেণী)",
            rating: "⭐⭐⭐⭐⭐",
            comment: "আমার সন্তান এখানে ৩ বছর ধরে পড়ছে। মাদ্রাসার ডিজিটাল ক্লাসরুম এবং চমৎকার হোস্টেল ম্যানেজমেন্টের কারণে আমি পড়াশোনা ও নিরাপত্তা নিয়ে সম্পূর্ণ নিশ্চিন্ত থাকি।"
        },
        {
            name: "ডা. আমিনা বেগম",
            role: "অভিভাবক (হিফজ বিভাগ)",
            rating: "⭐⭐⭐⭐⭐",
            comment: "হিফজ বিভাগের শিক্ষকদের কোমল ব্যবহার ও মানসিক চাপহীন ট্র্যাকিং সিস্টেম বাচ্চার হিফজ সম্পন্ন করা সহজ করে দিয়েছে। আল্লাহ প্রতিষ্ঠানটিকে কবুল করুন।"
        },
        {
            name: "মুহাম্মদ জাহিদুল ইসলাম",
            role: "ব্যবসায়ী ও অভিভাবক",
            rating: "⭐⭐⭐⭐⭐",
            comment: "মাদ্রাসার ভেতর কোনো রকমের মোবাইল বা ক্ষতিকর ডিভাইস ব্যবহারের সুযোগ নেই এবং শিক্ষকদের কড়া নজরদারি রয়েছে যা এই যুগে বাচ্চার নৈতিকতা সুরক্ষায় ভীষণ দরকার।"
        }
    ];

    // মার্কি অ্যানিমেশনের জন্য ডাটা ডুপ্লিকেট করা হয়েছে যাতে নিরবচ্ছিন্নভাবে স্ক্রল লুপ চলতে থাকে
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">

                {/* সেকশন হেডার */}
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-emerald-700 dark:text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                        মতামত ও পর্যালোচনা
                    </h2>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        অভিভাবক ও সুধীমহলের বাণী
                    </p>
                    <div className="w-12 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
                </div>
            </div>

            {/* অ্যানিমেশন কন্টেইনার জোন - Right to Left */}
            <div className="relative w-full flex overflow-x-hidden pt-4 pb-8 group">

                {/* CSS Animation injected via standard JSX style tag */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-left {
            display: flex;
            gap: 2rem;
            animation: marquee 25s linear infinite;
          }
          .group:hover .animate-marquee-left {
            animation-play-state: paused;
          }
        `}} />

                <div className="animate-marquee-left flex whitespace-nowrap">
                    {duplicatedReviews.map((review, index) => (
                        <div
                            key={index}
                            className="w-[300px] sm:w-[400px] bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between relative whitespace-normal flex-shrink-0"
                        >
                            {/* ব্যাকগ্রাউন্ড উদ্ধৃতি চিহ্ন */}
                            <div className="absolute right-6 top-4 text-5xl text-emerald-200/40 dark:text-slate-800/40 pointer-events-none select-none font-serif">
                                “
                            </div>

                            <div>
                                <div className="text-xs mb-3 select-none">
                                    {review.rating}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 italic leading-relaxed mb-6">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            </div>

                            {/* প্রোফাইল প্যানেল */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-amber-400 font-bold flex items-center justify-center text-xs border border-emerald-200 dark:border-slate-700 flex-shrink-0">
                                    {review.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-gray-100 truncate">
                                        {review.name}
                                    </h4>
                                    <p className="text-[11px] text-emerald-700 dark:text-gray-400 truncate">
                                        {review.role}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}