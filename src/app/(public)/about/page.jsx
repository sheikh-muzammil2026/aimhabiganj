// app/about/page.js
"use client";

import { useEffect, useState } from "react";
import Profile from "@/components/public/about/Profile";
import Founder from "@/components/public/about/Founder";
import Vision from "@/components/public/about/Vision";
import Committee from "@/components/public/about/Committee";
import Features from "@/components/public/about/Features";
import Roadmap from "@/components/public/about/Roadmap";
import Testimonials from "@/components/public/about/Testimonials";
import Policies from "@/components/public/about/Policies";
// নতুন কম্পোনেন্টগুলোর ইম্পোর্ট পাথ ঠিক করে দেওয়া হলো
import Faculty from "@/components/public/about/Faculty";
import Staff from "@/components/public/about/Staff";
import Roster from "@/components/public/about/Roster";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAboutData() {
      try {
        // এপিআই কানেকশন চালু হলে এখানে ডাটা সেট হবে
        setAboutData({
          profile: null,
          founder: null,
          vision: null,
          committee: null,
          features: null,
          roadmap: null,
          testimonials: null,
          policies: null,
          faculty: null,
          staff: null,
          roster: null,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-800"></div>
      </div>
    );
  }

  return (
    <div className="scroll-smooth min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* প্রতিটি সেকশনে scroll-mt-24 ক্লাসটি যুক্ত করা হয়েছে */}
      <section id="profile" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Profile data={aboutData?.profile} />
      </section>

      <section id="founder" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <Founder data={aboutData?.founder} />
      </section>

      <section id="vision" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Vision data={aboutData?.vision} />
      </section>

      <section id="committee" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <Committee data={aboutData?.committee} />
      </section>

      <section id="features" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Features data={aboutData?.features} />
      </section>

      <section id="roadmap" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <Roadmap data={aboutData?.roadmap} />
      </section>

      <section id="testimonials" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Testimonials data={aboutData?.testimonials} />
      </section>

      <section id="policies" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <Policies data={aboutData?.policies} />
      </section>

      {/* নতুন ৩টি সেকশন যুক্ত করা হলো */}
      <section id="faculty" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60">
        <Faculty data={aboutData?.faculty} />
      </section>

      <section id="staff" className="py-16 scroll-mt-24 border-b border-gray-100 dark:border-slate-800/60 bg-emerald-50/10 dark:bg-slate-900/40">
        <Staff data={aboutData?.staff} />
      </section>

      <section id="roster" className="py-16 scroll-mt-24">
        <Roster data={aboutData?.roster} />
      </section>
    </div>
  );
}
