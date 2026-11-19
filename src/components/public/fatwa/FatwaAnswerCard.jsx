// src/components/fatwa/FatwaAnswerCard.jsx
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Share2
} from "lucide-react";

export default function FatwaAnswerCard({ data, isLoading, error }) {
  const [copied, setCopied] = useState(false);
  const [isRefsOpen, setIsRefsOpen] = useState(true);

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-600/10 shadow-lg animate-pulse">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="h-6 w-48 bg-emerald-200/50 dark:bg-emerald-950/60 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
        </div>
        <div className="h-20 bg-emerald-50 dark:bg-zinc-800/60 rounded-2xl mb-6" />
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-full" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-4/6" />
        </div>
        <div className="h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-rose-800 dark:text-rose-200">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // 3. Fallback View (Information not found in whitelisted sites)
  if (!data.found) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-zinc-900 border border-amber-300 dark:border-amber-800 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 mb-2">
              অনুমোদিত সূত্রে সুনির্দিষ্ট উত্তর পাওয়া যায়নি
            </h4>
            <p className="text-sm sm:text-base text-amber-900/90 dark:text-amber-200/90 leading-relaxed mb-6 font-medium">
              {data.fallbackMessage ||
                "দুঃখিত, আমাদের অনুমোদিত ফতোয়া ওয়েবসাইটসমূহে আপনার প্রশ্নের সুনির্দিষ্ট উত্তরটি পাওয়া যায়নি। অনুগ্রহ করে সরাসরি বিজ্ঞ কোনো মুফতি সাহেবের সাথে যোগাযোগ করুন।"}
            </p>

            <div className="pt-4 border-t border-amber-200/80 dark:border-amber-900/60 flex flex-wrap gap-3">
              <a
                href="tel:+8801748868161"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>মাদরাসার ফতোয়া বিভাগে কল করুন (+৮৮০ ১৭৪৮-৮৬৮১৬১)</span>
              </a>
              <a
                href="https://wa.me/8801748868161"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 text-xs sm:text-sm font-medium transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Copy to Clipboard Handler
  const handleCopy = () => {
    const textToCopy = `【ফাতওয়া জিজ্ঞাসা - আস-সালাম আইডিয়াল মাদরাসা】\n\n📌 মূল ফতোয়া:\n${data.summary}\n\n📖 বিস্তারিত ব্যাখ্যা:\n${data.detailedExplanation}\n\n📚 রেফারেন্স / কিতাবের দলীল:\n${
      data.references && data.references.length > 0
        ? data.references.map((r, i) => `${i + 1}. ${r}`).join("\n")
        : "মূল আর্টিকেলে দেখুন"
    }\n\n🔗 মূল লেখার লিংক:\n${data.sourceUrl}\n(উৎস: ${data.publisher || "অনুমোদিত ফতোয়া পোর্টাল"})`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 5. Successful Answer Card
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-600/20 dark:border-emerald-600/30 shadow-[0_10px_40px_rgba(4,120,87,0.08)] overflow-hidden transition-all duration-300">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-600/50 border border-emerald-400/30 text-amber-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wide text-emerald-100 block">
              যাচাইকৃত ফতোয়া (Strictly Verified)
            </span>
            <span className="text-xs text-emerald-200/90 font-medium">
              উৎস: {data.publisher || "অনুমোদিত ইসলামিক পোর্টাল"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-medium border border-emerald-600/40 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>কপি সম্পন্ন!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>কপি করুন</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Title */}
        {data.sourceTitle && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug font-serif">
              {data.sourceTitle}
            </h3>
          </div>
        )}

        {/* সারসংক্ষেপ / মূল ফতোয়া (Summary Card) */}
        {data.summary && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border-l-4 border-emerald-600 dark:border-emerald-500 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>সারসংক্ষেপ / মূল হুকুম</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-emerald-950 dark:text-emerald-100 leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {/* বিস্তারিত ব্যাখ্যা (Detailed Explanation) */}
        {data.detailedExplanation && (
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              উৎস অনুযায়ী বিস্তারিত আলোচনা:
            </h4>
            <div className="text-sm sm:text-base text-gray-800 dark:text-zinc-200 leading-relaxed space-y-3 whitespace-pre-line font-normal">
              {data.detailedExplanation}
            </div>
          </div>
        )}

        {/* রেফারেন্স / দলীল (Accordion) */}
        {data.references && data.references.length > 0 && (
          <div className="rounded-2xl border border-emerald-600/20 dark:border-zinc-800 bg-emerald-50/30 dark:bg-zinc-800/40 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsRefsOpen(!isRefsOpen)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-emerald-50/70 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                  মূল কিতাবের রেফারেন্স ও দলীলসমূহ ({data.references.length}টি উদ্ধৃতি)
                </span>
              </div>
              {isRefsOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {isRefsOpen && (
              <div className="p-4 sm:p-5 pt-0 space-y-2 border-t border-emerald-600/10 dark:border-zinc-700/50">
                {data.references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-600/15 dark:border-zinc-700/60 shadow-2xs flex items-start gap-2.5 text-xs sm:text-sm text-gray-800 dark:text-zinc-200 font-mono"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-sans">{ref}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Source Link & Verification Button */}
        {data.sourceUrl && (
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              <span>মূল ফতোয়াটি যাচাই করতে সরাসরি সোর্স ওয়েবসাইট ভিজিট করুন।</span>
            </div>

            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>মূল ফতোয়াটি সরাসরি ওয়েবসাইটে পড়ুন</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
