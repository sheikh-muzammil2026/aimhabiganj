// src/components/fatwa/FatwaDisclaimer.jsx
"use client";

import React from "react";
import { AlertTriangle, Info, BookOpen } from "lucide-react";

export default function FatwaDisclaimer() {
  return (
    <div className="w-full max-w-4xl mx-auto my-5 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
          <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
            <span>সতর্কবার্তা ও ফতোয়া ব্যবহারের নীতিমালা:</span>
          </p>
          <p>
            এই এআই সহকারী শুধুমাত্র আমাদের অনুমোদিত ও নির্ভরযোগ্য ফতোয়া ওয়েবসাইটসমূহ (*মাসিক আলকাউসার*, *দারুল উলূম দেওবন্দ*, *আহলে হক মিডিয়া*, ইত্যাদি) থেকে সরাসরি তথ্য অনুসন্ধান করে উত্তর প্রদান করে। এটি নিজে থেকে কোনো মাসআলা তৈরি বা অনুমান করে না।
          </p>
          <p className="mt-1 text-amber-800 dark:text-amber-300/80 text-[11px] sm:text-xs">
            * পারিবারিক জটিলতা, তালাক, উত্তরাধিকার ও বিরোধপূর্ণ মামলার বিষয়ে কোনো অনলাইন ফতোয়া চূড়ান্ত নয়; এরূপ ক্ষেত্রে সর্বদা বিজ্ঞ মুফতিগণের সাথে সরাসরি সাক্ষাতে পরামর্শ গ্রহণ করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
