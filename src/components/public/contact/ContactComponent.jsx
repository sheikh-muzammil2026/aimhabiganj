// components/public/contact/ContactComponent.jsx
"use client";

import { useState } from "react";
import { Phone, Mail, Clock, Send, MapPin } from "lucide-react";
import siteConfig from "@/config/siteConfig";

export default function ContactComponent() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("অভিযোগ ও পরামর্শ ডেটা:", formData);
    alert("আপনার মূল্যবান বার্তাটি সফলভাবে গৃহীত হয়েছে। জাজাকাল্লাহু খাইরান!");
    setFormData({ name: "", mobile: "", subject: "", message: "" });
  };

  return (
    <div className="site-container py-12 sm:py-16">
      {/* হেডার সেকশন */}
      <div className="text-center mb-12 space-y-3">
        <h2 className="heading-primary flex items-center justify-center gap-2">
          <span className="text-[#2196F3]">❖</span> আমাদের সাথে যোগাযোগ করুন <span className="text-[#2196F3]">❖</span>
        </h2>
        <p className="text-sm text-[#1E293B] max-w-xl mx-auto leading-relaxed">
          যেকোনো জিজ্ঞাসা, তথ্য বা পরামর্শের জন্য আমাদের লিখুন অথবা সরাসরি আমাদের ক্যাম্পাসে চলে আসুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* বাম পাশ: প্রাতিষ্ঠানিক যোগাযোগের তথ্য কার্ড */}
        <div className="lg:col-span-5 bg-[#0D47A1] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#90CAF9]/40 space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#90CAF9]" />
              <span>প্রধান ক্যাম্পাস ও কার্যালয়</span>
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#E3F2FD]/90 font-medium">
              {siteConfig.name.fullBn}<br />
              {siteConfig.address.bn}
            </p>
          </div>

          <hr className="border-[#90CAF9]/30" />

          <div className="space-y-4 text-xs sm:text-sm font-medium">
            <p className="flex items-center gap-3 text-[#E3F2FD]">
              <Phone className="w-4 h-4 text-[#90CAF9] flex-shrink-0" />
              <span>{siteConfig.contacts.phoneBn.join(", ")}</span>
            </p>
            <p className="flex items-center gap-3 text-[#E3F2FD]">
              <Mail className="w-4 h-4 text-[#90CAF9] flex-shrink-0" />
              <span>{siteConfig.contacts.email}</span>
            </p>
            <p className="flex items-start gap-3 text-[#E3F2FD]">
              <Clock className="w-4 h-4 text-[#90CAF9] flex-shrink-0 mt-0.5" />
              <span>{siteConfig.officeHours.bn}</span>
            </p>
          </div>

          <hr className="border-[#90CAF9]/30" />

          {/* সোশ্যাল মিডিয়া লিংক */}
          <div>
            <h4 className="text-xs font-bold text-[#90CAF9] uppercase tracking-wider mb-3">
              সোশ্যাল মিডিয়া
            </h4>
            <div className="flex gap-3 text-sm">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-[#2196F3] text-white px-3.5 py-2 rounded-lg border border-[#90CAF9]/40 transition-all cursor-pointer"
              >
                {/* <FaFacebookF className="w-4 h-4" /> */}
                <span>Facebook</span>
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-[#2196F3] text-white px-3.5 py-2 rounded-lg border border-[#90CAF9]/40 transition-all cursor-pointer"
              >
                {/* <FaYoutube className="w-4 h-4" /> */}
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* ডান পাশ: অভিযোগ ও পরামর্শ ফর্ম (#feedback) */}
        <div
          id="feedback"
          className="lg:col-span-7 bg-white border border-[#90CAF9] p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-24"
        >
          <h3 className="text-lg font-bold text-[#0D47A1] mb-1 flex items-center gap-2">
            <span>✉️</span> অভিযোগ ও পরামর্শ বক্স
          </h3>
          <p className="text-xs text-[#1E293B] mb-6">
            প্রতিষ্ঠানের মানোন্নয়নে আপনার যেকোনো গঠনমূলক পরামর্শ বা অভিযোগ আমাদের অবগত করুন।
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="উদা: আবদুল্লাহ"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-institutional"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
                  মোবাইল নাম্বার
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  placeholder="উদা: ০১৭XXXXXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-institutional"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
                বিষয়
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="উদা: শিক্ষা ব্যবস্থা সংক্রান্ত পরামর্শ"
                value={formData.subject}
                onChange={handleChange}
                className="input-institutional"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D47A1] mb-1.5">
                বিস্তারিত বিবরণ
              </label>
              <textarea
                name="message"
                required
                rows="4"
                placeholder="আপনার বার্তাটি এখানে লিখুন..."
                value={formData.message}
                onChange={handleChange}
                className="input-institutional resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
