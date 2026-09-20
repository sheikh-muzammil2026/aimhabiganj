// src/components/fatwa/FatwaSourcesBadge.jsx
"use client";

import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { WHITELISTED_DOMAINS } from "@/lib/fatwa/whitelist";

export default function FatwaSourcesBadge() {
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300">
          অনুমোদিত ও বিশ্বস্ত ফতোয়া উৎসসমূহ (Strictly Whitelisted)
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {WHITELISTED_DOMAINS.map(source => (
          <div
            key={source.id}
            title={source.fullName}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-2xs transition-all duration-200 hover:scale-105 ${source.badgeColor}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{source.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
