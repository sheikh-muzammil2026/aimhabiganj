import Link from "next/link";

export default function WorkInProgressPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-100">
        {/* Animated Visual Icon */}
        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-emerald-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full">
            উন্নয়ন কাজ চলমান
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
            পেজটি প্রস্তুত করা হচ্ছে
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            আপনাকে সেরা অভিজ্ঞতা দিতে আমরা এই পেজটির নকশা ও ফিচার নিয়ে কাজ করছি।
            খুব শীঘ্রই এটি উন্মুক্ত করা হবে।
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Action Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-slate-400">
          ধৈর্য ধরে সাথে থাকার জন্য আপনাকে ধন্যবাদ।
        </p>
      </div>
    </div>
  );
}
