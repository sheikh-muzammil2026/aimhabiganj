// src/app/(public)/fatwa/page.jsx
"use client";

import React, { useState } from "react";
import FatwaSearchBar from "@/components/public/fatwa/FatwaSearchBar";
import FatwaSourcesBadge from "@/components/public/fatwa/FatwaSourcesBadge";
import FatwaDisclaimer from "@/components/public/fatwa/FatwaDisclaimer";
import FatwaAnswerCard from "@/components/public/fatwa/FatwaAnswerCard";
import { BookOpen, Sparkles, HelpCircle } from "lucide-react";

export default function FatwaPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (queryText) => {
    if (!queryText || isLoading) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/fatwa-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(
          json.error ||
          "ফতোয়া অনুসন্ধানে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        );
      } else {
        setData(json.data);
      }
    } catch (err) {
      console.error("Fatwa search error:", err);
      setError(
        "নেটওয়ার্ক বা সার্ভার জনিত ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="site-container py-10 sm:py-14">
        {/* Header / Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Bismillah calligraphy styling */}
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] text-xs sm:text-sm font-semibold kufi-custom">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h1 className="heading-primary mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#2196F3]" />
            <span>ফাতওয়া জিজ্ঞাসা</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1E293B] leading-relaxed">
            অনুমোদিত ও নির্ভরযোগ্য ফতোয়া ওয়েবসাইটসমূহ হতে সরাসরি তথ্য ও সঠিক
            দলীল সমৃদ্ধ ইসলামী প্রশ্নোত্তর অনুসন্ধান
          </p>
        </div>

        {/* Search Bar with Chips */}
        <FatwaSearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Verified Domains Badge Showcase */}

        {/* Madrasah Disclaimer Notice */}
        <FatwaDisclaimer />

        {/* Formatted Answer Card / Fallback / Skeleton */}
        <FatwaAnswerCard data={data} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
