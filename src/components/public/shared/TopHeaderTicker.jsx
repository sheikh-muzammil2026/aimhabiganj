"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ExternalLink, X, ChevronRight } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function TopHeaderTicker() {
  const [tickerNotices, setTickerNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicker = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notices/ticker`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.tickerNotices && data.tickerNotices.length > 0) {
        setTickerNotices(data.tickerNotices);
      } else if (data.latestNotice) {
        setTickerNotices([data.latestNotice]);
      } else {
        setTickerNotices([]);
      }
    } catch (err) {
      console.warn("Ticker fetch error, using fallback if available:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicker();
    // Poll every 60 seconds for live updates
    const interval = setInterval(fetchTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && tickerNotices.length === 0) {
    return null;
  }

  // If no notices are returned, provide default school marquee
  const items =
    tickerNotices.length > 0
      ? tickerNotices
      : [
          {
            _id: "default-1",
            title: "ভর্তি সংক্রান্ত জরুরি বিজ্ঞপ্তি",
            description:
              "আস-সালাম আইডিয়াল মাদরাসায় নতুন শিক্ষাবর্ষে নূরানী, নাজেরা ও হিফজ বিভাগে ভর্তি কার্যক্রম চলমান। আসন সংখ্যা সীমিত, বিস্তারিত জানতে যোগাযোগ করুন।",
          },
        ];

  // Calculate dynamic speed based on text length (comfortable ~12-20s pace)
  const totalTextLength = items.reduce(
    (acc, n) => acc + (n.description || n.title || "").length,
    0
  );
  const dynamicDuration = Math.max(12, Math.min(22, Math.round(totalTextLength * 0.08) + 10));

  return (
    <>
      <div className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-medium py-1.5 px-3 shadow-inner flex items-center overflow-hidden border-t border-amber-600/30 transition-colors duration-300 relative z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          {/* Ticker Label Badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 md:py-1 rounded-md text-xs font-bold uppercase tracking-wider mr-3 shadow-sm select-none z-10 transition-colors">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
            <span className="whitespace-nowrap">সর্বশেষ নোটিশ</span>
          </div>

          {/* Marquee Content */}
          <div className="relative w-full overflow-hidden flex items-center select-none group">
            <div
              style={{ animationDuration: `${dynamicDuration}s` }}
              className="animate-ticker text-xs md:text-sm font-semibold tracking-wide items-center gap-8 py-0.5 cursor-pointer group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]"
            >
              {items.map((notice, idx) => (
                <span
                  key={notice._id || idx}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 hover:text-red-800 transition-colors"
                >
                  <span className="text-red-600 font-bold">❖</span>
                  <span className="font-medium tracking-wide">
                    {notice.description || notice.title}
                  </span>
                  {notice.publishDate && (
                    <span className="text-[11px] bg-amber-600/20 text-slate-900 px-2 py-0.5 rounded font-normal whitespace-nowrap">
                      ({new Date(notice.publishDate).toLocaleDateString("bn-BD")})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* All Notices Link */}
          <div className="flex-shrink-0 ml-2 z-10 hidden sm:block">
            <Link
              href="/notices"
              className="text-[11px] font-bold text-slate-800 hover:text-red-700 underline flex items-center gap-0.5 whitespace-nowrap bg-amber-300/60 hover:bg-amber-300 px-2 py-0.5 rounded transition-all"
            >
              <span>সকল নোটিশ</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notice Quick Preview Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>জরুরি নোটিশ বিবরণ</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug pr-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              {selectedNotice.title}
            </h3>

            {selectedNotice.publishDate && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                প্রকাশের তারিখ:{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  {new Date(selectedNotice.publishDate).toLocaleDateString("bn-BD")}
                </strong>
              </p>
            )}

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                পূর্ণাঙ্গ বার্তা:
              </p>
              {selectedNotice.description || selectedNotice.title || "বিস্তারিত বিবরণের জন্য সংশ্লিষ্ট অফিসে যোগাযোগ করুন।"}
            </div>

            <div className="flex items-center justify-between pt-2">
              {selectedNotice.attachmentUrl ? (
                <a
                  href={selectedNotice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  সংযুক্ত ফাইল দেখুন
                </a>
              ) : (
                <Link
                  href="/notices"
                  onClick={() => setSelectedNotice(null)}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  নোটিশ বোর্ডে যান
                </Link>
              )}

              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
