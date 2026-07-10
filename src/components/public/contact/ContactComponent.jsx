// components/public/contact/ContactComponent.jsx
"use client";
import { useState } from "react";

export default function ContactComponent() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("অভিযোগ ও পরামর্শ ডেটা:", formData);
    alert("আপনার মূল্যবান পরামর্শটি কনসোলে সাবমিট হয়েছে। জাজাকাল্লাহু খাইরান!");
    setFormData({ name: "", mobile: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* হেডার সেকশন */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-2">
          <span className="text-amber-500">❖</span> আমাদের সাথে যোগাযোগ করুন <span className="text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">যেকোনো জিজ্ঞাসা, তথ্য বা পরামর্শের জন্য আমাদের লিখুন অথবা সরাসরি চলে আসুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশ: যোগাযোগের তথ্য কার্ড */}
        <div className="lg:col-span-5 bg-emerald-900 text-emerald-50 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-400 mb-2">প্রধান কার্যালয়</h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
              জামিয়া ইসলামিয়া মাদরাসা ক্যাম্পাস<br />
              প্রধান সড়ক, ব্লক-সি, সেক্টর-২,<br />
              ঢাকা - ১২২৯, বাংলাদেশ।
            </p>
          </div>

          <hr className="border-emerald-800" />

          <div className="space-y-3 text-xs sm:text-sm font-medium">
            <p className="flex items-center gap-3">
              <span>📞</span> 
              <span>+৮৮০১৭১২-৩৪৫৬৭৮, +৮৮০১৯৮৭-৬৫৪৩২১</span>
            </p>
            <p className="flex items-center gap-3">
              <span>✉️</span> 
              <span>info@jamiamadrasa.edu.bd</span>
            </p>
            <p className="flex items-center gap-3">
              <span>⏱️</span> 
              <span>শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৫:০০</span>
            </p>
          </div>

          <hr className="border-emerald-800" />

          {/* সোশ্যাল মিডিয়া লিংক প্লেসহোল্ডার */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-3 text-sm">
              <span className="bg-emerald-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">Facebook</span>
              <span className="bg-emerald-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">YouTube</span>
            </div>
          </div>
        </div>

        {/* ডান পাশ: অভিযোগ ও পরামর্শ ফর্ম (#feedback) */}
        <div id="feedback" className="lg:col-span-7 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-1 flex items-center gap-2">
            ✉️ অভিযোগ ও পরামর্শ বক্স
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">মাদরাসার মানোন্নয়নে আপনার যেকোনো গঠনমূলক পরামর্শ বা অভিযোগ আমাদের অবগত করুন।</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">আপনার নাম</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="উদা: আবদুল্লাহ"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">মোবাইল নাম্বার</label>
                <input
                  type="text"
                  name="mobile"
                  required
                  placeholder="উদা: ০১৭XXXXXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">বিষয়</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="উদা: শিক্ষা ব্যবস্থা সংক্রান্ত পরামর্শ"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">বিস্তারিত বিবরণ</label>
              <textarea
                name="message"
                required
                rows="4"
                placeholder="আপনার বার্তাটি এখানে লিখুন..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-emerald-800 font-medium resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm p-3.5 rounded-xl transition-all shadow-sm"
            >
              🚀 বার্তা পাঠান
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
