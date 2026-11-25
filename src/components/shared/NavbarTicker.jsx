"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import siteConfig from "@/config/siteConfig";
import {
  Megaphone,
  ExternalLink,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

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
        if (
          data?.success &&
          data.tickerNotices &&
          data.tickerNotices.length > 0
        ) {
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
            siteConfig.admissionConfig.urgentNoticeBn ||
            "নতুন শিক্ষাবর্ষে নূরানী, নাজেরা ও হিফজ বিভাগে ভর্তি কার্যক্রম চলমান। আসন সংখ্যা সীমিত, বিস্তারিত জানতে যোগাযোগ করুন।",
        },
      ];

  const totalTextLength = items.reduce(
    (acc, n) => acc + (n.description || n.title || "").length,
    0,
  );
  const dynamicDuration = Math.max(
    14,
    Math.min(24, Math.round(totalTextLength * 0.08) + 10),
  );

  return (
    <>
      {/* Notice / Announcement Bar: #E3F2FD banner framed with a #90CAF9 border and a #2196F3 badge/icon */}
      <div className="w-full bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] font-medium py-2 px-3 sm:px-5 lg:px-6 rounded-xl flex items-center overflow-hidden shadow-xs transition-colors duration-300 relative z-10 print:hidden">
        <div className="mx-auto w-full flex items-center gap-3">
          {/* Ticker Label Badge: #2196F3 with white text and icon */}
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#2196F3] text-white px-2.5 py-1 rounded-md text-[11px] md:text-xs font-bold uppercase tracking-wider select-none z-10 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <Megaphone className="w-3.5 h-3.5 text-white" />
            <span className="whitespace-nowrap font-bold">নোটিশ</span>
          </div>

          {/* Marquee Content with Soft Edge Mask */}
          <div className="relative flex-1 overflow-hidden flex items-center select-none group">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#E3F2FD] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#E3F2FD] to-transparent z-10" />

            <div
              style={{ animationDuration: `${dynamicDuration}s` }}
              className="animate-ticker text-xs md:text-[13px] font-medium tracking-wide items-center gap-10 py-0.5 cursor-pointer group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]"
            >
              {items.map((notice, idx) => (
                <span
                  key={notice._id || idx}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 text-[#0D47A1] hover:text-[#2196F3] transition-colors"
                >

                  <span className="font-semibold tracking-wide">
                    {notice.description || notice.title}
                  </span>
                  {notice.publishDate && (
                    <span className="text-[10.5px] bg-white text-[#0D47A1] border border-[#90CAF9] px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                      (
                      {new Date(notice.publishDate).toLocaleDateString("bn-BD")}
                      )
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
              className="text-[11px] font-bold text-[#0D47A1] hover:text-[#2196F3] flex items-center gap-1 whitespace-nowrap bg-white hover:bg-[#E3F2FD] border border-[#90CAF9] px-3 py-1 rounded-md transition-all duration-200 shadow-2xs"
            >
              <span>সকল নোটিশ</span>
              <ChevronRight className="w-3 h-3 text-[#2196F3]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notice Quick Preview Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D47A1]/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#90CAF9] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="h-1.5 w-full bg-[#2196F3]" />
            <div className="p-6 space-y-4">
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0D47A1] p-1.5 rounded-full hover:bg-[#E3F2FD] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>জরুরি নোটিশ বিবরণ</span>
              </div>

              <h3 className="text-lg font-bold text-[#0D47A1] leading-snug pr-6 border-b border-[#90CAF9]/40 pb-3">
                {selectedNotice.title}
              </h3>

              {selectedNotice.publishDate && (
                <p className="text-xs text-slate-500">
                  প্রকাশের তারিখ:{" "}
                  <strong className="text-[#0D47A1]">
                    {new Date(selectedNotice.publishDate).toLocaleDateString(
                      "bn-BD",
                    )}
                  </strong>
                </p>
              )}

              <div className="bg-[#E3F2FD] p-4 rounded-xl border border-[#90CAF9] text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
                <p className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-[#0D47A1]">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2196F3] hover:text-[#0D47A1] underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    সংযুক্ত ফাইল দেখুন
                  </a>
                ) : (
                  <Link
                    href="/notices"
                    onClick={() => setSelectedNotice(null)}
                    className="text-xs font-bold text-[#2196F3] hover:text-[#0D47A1] hover:underline"
                  >
                    নোটিশ বোর্ডে যান →
                  </Link>
                )}

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-semibold rounded-md shadow-md transition-all cursor-pointer"
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
