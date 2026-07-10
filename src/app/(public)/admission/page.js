// app/admission/page.js
"use client";
import Link from "next/link";

export default function AdmissionInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* হেডার */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
            <span className="text-amber-500">❖</span> ভর্তি নির্দেশিকা ও তথ্যাবলী <span className="text-amber-500">❖</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">নতুন শিক্ষাবর্ষে ভর্তির যাবতীয় নিয়ম ও সময়সূচী</p>
        </div>

        {/* ১. ভর্তির সময় (Timeline) */}
        <section id="timeline" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">📅 ভর্তির সময়সূচী</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
            <li className="flex justify-between border-b border-gray-100 dark:border-slate-700/50 pb-2"><span>ভর্তি ফরম বিতরণ শুরু:</span> <span className="text-amber-600">০১ শাওয়াল থেকে</span></li>
            <li className="flex justify-between border-b border-gray-100 dark:border-slate-700/50 pb-2"><span>ভর্তি পরীক্ষার তারিখ:</span> <span className="text-amber-600">১০ শাওয়াল, সকাল ৯:০০ টা</span></li>
            <li className="flex justify-between pb-1"><span>ক্লাস শুরু:</span> <span className="text-emerald-600 font-bold">১৫ শাওয়াল থেকে ইনশাআল্লাহ</span></li>
          </ul>
        </section>

        {/* ২. ভর্তি পরীক্ষা (Test) */}
        <section id="test" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">📝 ভর্তি পরীক্ষা সংক্রান্ত</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            হিফজ ও কিতাব বিভাগের শিক্ষার্থীদের জন্য মৌখিক (তিলাওয়াত ও ইস্তেমাল) এবং সাধারণ লিখিত পরীক্ষা নেওয়া হবে। নূরানী ও নাজেরা বিভাগের জন্য শুধুমাত্র মৌখিক ও উচ্চারণ যোগ্যতা যাচাই করা হবে।
          </p>
        </section>

        {/* ৩. ভর্তি প্রক্রিয়া (Process) */}
        <section id="process" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">⚡ ভর্তি প্রক্রিয়া</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>অনলাইন বা অফিস থেকে ভর্তি ফরম সংগ্রহ করে সঠিক তথ্য দিয়ে পূরণ করুন।</li>
            <li>প্রয়োজনীয় কাগজপত্রাদি সংযুক্ত করে অফিসে জমা দিন বা অনলাইনে সাবমিট করুন।</li>
            <li>নির্দিষ্ট তারিখে ভর্তি পরীক্ষায় অংশগ্রহণ করে উত্তীর্ণ তালিকায় স্থান নিশ্চিত করুন।</li>
          </ol>
        </section>

        {/* ৪. ভর্তি ফি (Fees) */}
        <section id="fees" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">💵 ভর্তি ও মাসিক ফি</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 font-bold text-emerald-900 dark:text-emerald-400">
                  <th className="pb-2">বিভাগ</th>
                  <th className="pb-2 text-center">ভর্তি ফি</th>
                  <th className="pb-2 text-right">মাসিক প্রদেয়</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                <tr className="border-b border-gray-100 dark:border-slate-700/40"><td className="py-2.5">নূরানী ও নাজেরা</td><td className="text-center">১,৫০০/-</td><td className="text-right">৫००/-</td></tr>
                <tr className="border-b border-gray-100 dark:border-slate-700/40"><td className="py-2.5">হিফজ বিভাগ (আবাসিক)</td><td className="text-center">৩,০০০/-</td><td className="text-right">৩,৫০০/-</td></tr>
                <tr><td className="py-2.5">কিতাব বিভাগ</td><td className="text-center">২,৫০০/-</td><td className="text-right">৮০০/-</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ৫. ভর্তির শর্তাবলী (Terms) */}
        <section id="terms" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">📜 ভর্তির শর্তাবলী</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>শিক্ষার্থীকে অবশ্যই সদাচারী এবং মাদরাসার নিয়ম-কানুন মানতে বাধ্য থাকতে হবে।</li>
            <li>আবাসিক ছাত্রদের ক্ষেত্রে নির্দিষ্ট সময়ে বোর্ডিংয়ের নিয়ম অনুধাবন করতে হবে।</li>
            <li>ভর্তির সময় জন্ম নিবন্ধন এবং অভিভাবকের জাতীয় পরিচয়পত্রের কপি জমা দেওয়া বাধ্যতামূলক।</li>
          </ul>
        </section>

        {/* ফরম পূরণের অ্যাকশন বাটন */}
        <div className="text-center pt-4">
          <Link 
            href="/admission/form"
            className="inline-flex items-center gap-2 bg-gradient-to-r cursor-pointer from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-md transition-all active:scale-95 animate-pulse"
          >
            ✍️ অনলাইন ভর্তি ফরম পূরণ করুন
          </Link>
        </div>

      </div>
    </div>
  );
}
