// app/admission/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdmissionInfoPage() {
  // গাইডলাইন এবং সেটিংস স্টেট
  const [settings, setSettings] = useState({});
  // ভর্তি আবেদনপত্রের তালিকা স্টেট (অ্যাডমিন প্যানেলের জন্য)
  const [admissions, setAdmissions] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingAdmissions, setLoadingAdmissions] = useState(true);

  // ১. ব্যাকএন্ড থেকে ভর্তি নির্দেশিকা/সেটিংস ডাটা নিয়ে আসা (পাবলিক পেজের ফি ও টাইমের জন্য)
  useEffect(() => {
    fetch("http://localhost:8000/api/admission-settings")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSettings(resData.data);
        }
        setLoadingSettings(false);
      })
      .catch((err) => {
        console.error("Settings load error:", err);
        setLoadingSettings(false);
      });

    // ২. সমস্ত ভর্তি আবেদনপত্রের তালিকা নিয়ে আসা
    fetchAdmissions();
  }, []);

  // আবেদনপত্র লোড করার কমন ফাংশন
  const fetchAdmissions = () => {
    setLoadingAdmissions(true);
    fetch("http://localhost:8000/api/admissions")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setAdmissions(resData.data);
        }
        setLoadingAdmissions(false);
      })
      .catch((err) => {
        console.error("Admissions load error:", err);
        setLoadingAdmissions(false);
      });
  };

  // স্ট্যাটাস পরিবর্তন করার ফাংশন (Approve / Reject)
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAdmissions(); // তালিকা রিফ্রেশ করুন
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // চিরতরে আবেদন মুছে ফেলার ফাংশন (DELETE API)
  const handleDeleteAdmission = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই আবেদনটি চিরতরে মুছে ফেলতে চান?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/admissions/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message);
          // স্টেট থেকে সরাসরি ফিল্টার করে রিয়েলটাইম রিমুভ প্রদর্শন
          setAdmissions(admissions.filter((app) => app._id !== id));
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("আবেদনটি মুছতে সার্ভারে সমস্যা হয়েছে।");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* হেডার */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
            <span className="text-amber-500">❖</span> ভর্তি নির্দেশিকা ও তথ্যাবলী <span className="text-amber-500">❖</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">নতুন শিক্ষাবর্ষে ভর্তির যাবতীয় নিয়ম ও সময়সূচী</p>
        </div>

        {/* ১. ভর্তির সময় (Timeline) */}
        <section id="timeline" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">📅 ভর্তির সময়সূচী</h3>
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
            হিফজ ও কিতাব বিভাগের শিক্ষার্থীদের জন্য মৌখিক (তিলাওয়াত ও ইস্তেমাল) এবং সাধারণ লিখিত পরীক্ষা নেওয়া হবে। নূরানী ও নাজেরা বিভাগের জন্য শুধুমাত্র মৌখিক ও উচ্চারণ যোগ্যতা যাচাই করা হবে।
          </p>
        </section>

        {/* ৩. ভর্তি প্রক্রিয়া (Process) */}
        <section id="process" className="scroll-mt-24 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">⚡ ভর্তি প্রক্রিয়া</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>অনলাইন বা অফিস থেকে ভর্তি ফরম সংগ্রহ করে সঠিক তথ্য দিয়ে পূরণ করুন।</li>
            <li>প্রয়োজনীয় কাগজপত্রাদি সংযুক্ত করে অফিসে জমা দিন বা অনলাইনে সাবমিট করুন।</li>
            <li>নির্দিষ্ট তারিখে ভর্তি পরীক্ষায় অংশগ্রহণ করে উত্তীর্ণ তালিকায় স্থান নিশ্চিত করুন।</li>
          </</ol>
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
                <tr className="border-b border-gray-100 dark:border-slate-700/40"><td className="py-2.5">নূরানী ও নাজেরা</td><td className="text-center">১,৫০০/-</td><td className="text-right">৫০০/-</td></tr>
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
            <li>विद्याর্থীকে অবশ্যই সদাচারী এবং মাদরাসার নিয়ম-কানুন মানতে বাধ্য থাকতে হবে।</li>
            <li>আবাসিক ছাত্রদের ক্ষেত্রে নির্দিষ্ট সময়ে বোর্ডিংয়ের নিয়ম অনুধাবন করতে হবে।</li>
            <li>ভর্তির সময় জন্ম নিবন্ধন এবং অভিভাবকের জাতীয় পরিচয়পত্রের কপি জমা দেওয়া বাধ্যতামূলক।</li>
          </ul>
        </section>

        {/* ফরম পূরণের অ্যাকশন বাটন */}
        <div className="text-center pt-4">
          <Link 
            href="/admission/form"
            className="inline-flex items-center gap-2 bg-gradient-to-r cursor-pointer from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            ✍️ অনলাইন ভর্তি ফরম পূরণ করুন
          </Link>
        </div>


        {/* ======================================================== */}
        {/* 📋 অ্যাডমিন সেকশন: অনলাইন ভর্তি আবেদনপত্র ব্যবস্থাপনা */}
        {/* ======================================================== */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-emerald-400 flex items-center gap-2">
              🛠️ ভর্তি আবেদনপত্র কন্ট্রোল প্যানেল (Admin)
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
              মোট আবেদন: {admissions.length}টি
            </span>
          </div>

          {loadingAdmissions ? (
            <div className="text-center py-6 text-sm text-gray-500">আবেদনপত্র লোড হচ্ছে...</div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">কোনো ভর্তি আবেদন পাওয়া যায়নি।</div>
          ) : (
            <div className="space-y-4">
              {admissions.map((app) => (
                <div 
                  key={app._id} 
                  className="p-4 rounded-xl border border-gray-200 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* আবেদনকারীর বেসিক তথ্য */}
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                      {app.studentName || "নাম বিহীন শিক্ষার্থী"}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      বিভাগ: <span className="font-semibold text-slate-700 dark:text-slate-300">{app.department || "N/A"}</span> | 
                      মোবাইল: <span className="font-semibold text-slate-700 dark:text-slate-300">{app.phone || "N/A"}</span>
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === "Approved" ? "bg-green-100 text-green-800" :
                        app.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {app.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* 🛠️ অ্যাকশন বাটন গ্রুপ (Approve, Reject, Delete) */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Approve বাটন */}
                    <button
                      onClick={() => handleStatusChange(app._id, "Approved")}
                      disabled={app.status === "Approved"}
                      className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                        app.status === "Approved" 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      }`}
                    >
                      ✓ Approve
                    </button>

                    {/* Reject বাটন */}
                    <button
                      onClick={() => handleStatusChange(app._id, "Rejected")}
                      disabled={app.status === "Rejected"}
                      className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                        app.status === "Rejected" 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                      }`}
                    >
                      ✕ Reject
                    </button>

                    {/* 🗑️ নতুন সংযোজিত: Delete বাটন */}
                    <button
                      onClick={() => handleDeleteAdmission(app._id)}
                      className="text-xs font-bold bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
