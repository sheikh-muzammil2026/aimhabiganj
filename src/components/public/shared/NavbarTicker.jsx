"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ExternalLink, X, ChevronRight, Sparkles } from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000"
).replace(/\/$/, "");

export default function NavbarTicker() {
  const [tickerNotices, setTickerNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTicker = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notices/ticker`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch ticker: ${res.status}`);
        }
        const data = await res.json();
        if (!isMounted) return;
        if (data?.success && data.tickerNotices && data.tickerNotices.length > 0) {
          setTickerNotices(data.tickerNotices);
        } else if (data?.latestNotice) {
          setTickerNotices([data.latestNotice]);
        } else {
          setTickerNotices([]);
        }
      } catch (err) {
        console.warn("Ticker fetch error, using fallback if available:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading && tickerNotices.length === 0) {
    return null;
  }

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

  const totalTextLength = items.reduce(
    (acc, n) => acc + (n.description || n.title || "").length,
    0
  );
  const dynamicDuration = Math.max(
    14,
    Math.min(24, Math.round(totalTextLength * 0.08) + 10)
  );

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#01160e] via-[#032619] to-[#01160e] dark:from-[#010604] dark:via-[#02140d] dark:to-[#010604] text-emerald-50 font-medium py-1.5 px-3 sm:px-5 lg:px-6 flex items-center overflow-hidden border-b border-amber-400/15 dark:border-amber-400/20 transition-colors duration-300 relative z-20 print:hidden shadow-sm">
        <div className="max-w-[1440px] mx-auto w-full flex items-center gap-2.5">
          {/* Ticker Label Badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/35 text-amber-300 px-2.5 py-0.5 md:py-1 rounded-lg text-[11px] md:text-xs font-bold uppercase tracking-wider select-none z-10 shadow-[0_0_12px_rgba(245,158,11,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <Megaphone className="w-3.5 h-3.5 text-amber-300" />
            <span className="whitespace-nowrap">সর্বশেষ নোটিশ</span>
          </div>

          {/* Marquee Content with Soft Edge Mask */}
          <div className="relative flex-1 overflow-hidden flex items-center select-none group">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#01160e] dark:from-[#010604] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#01160e] dark:from-[#010604] to-transparent z-10" />

            <div
              style={{ animationDuration: `${dynamicDuration}s` }}
              className="animate-ticker text-xs md:text-[13px] font-medium tracking-wide items-center gap-10 py-0.5 cursor-pointer group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]"
            >
              {items.map((notice, idx) => (
                <span
                  key={notice._id || idx}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 text-emerald-50/90 hover:text-amber-300 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-medium tracking-wide">
                    {notice.description || notice.title}
                  </span>
                  {notice.publishDate && (
                    <span className="text-[10.5px] bg-emerald-950/90 text-amber-200/90 border border-amber-400/25 px-2 py-0.5 rounded-md font-normal whitespace-nowrap">
                      ({new Date(notice.publishDate).toLocaleDateString("bn-BD")})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* All Notices Link */}
          <div className="flex-shrink-0 z-10 hidden sm:block">
            <Link
              href="/notices"
              className="text-[11px] font-semibold text-emerald-100 hover:text-amber-300 flex items-center gap-1 whitespace-nowrap bg-white/[0.06] hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/35 px-2.5 py-1 rounded-lg transition-all duration-200"
            >
              <span>সকল নোটিশ</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notice Quick Preview Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />
            <div className="p-6 space-y-4">
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5" />
                <span>জরুরি নোটিশ বিবরণ</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug pr-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                {selectedNotice.title}
              </h3>

              {selectedNotice.publishDate && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  প্রকাশের তারিখ:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {new Date(selectedNotice.publishDate).toLocaleDateString(
                      "bn-BD"
                    )}
                  </strong>
                </p>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
                <p className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  পূর্ণাঙ্গ বার্তা:
                </p>
                {selectedNotice.description ||
                  selectedNotice.title ||
                  "বিস্তারিত বিবরণের জন্য সংশ্লিষ্ট অফিসে যোগাযোগ করুন।"}
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
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    নোটিশ বোর্ডে যান →
                  </Link>
                )}

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
