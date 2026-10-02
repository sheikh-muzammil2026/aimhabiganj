"use client";

import React, { useEffect, useState } from "react";
import NoticeList from "@/components/public/notices/NoticeList";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function NoticesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch(`${API_BASE}/api/notices?status=active&limit=50`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success && json.notices && json.notices.length > 0) {
          const formattedList = json.notices.map((n) => ({
            id: n._id,
            type: n.category || "general",
            title: n.title,
            description: n.description,
            date: n.publishDate
              ? new Date(n.publishDate).toLocaleDateString("bn-BD")
              : "তারিখ বিহীন",
            size: n.attachmentUrl ? "ডকুমেন্ট ফাইল" : "টেক্সট নোটিশ",
            attachmentUrl: n.attachmentUrl,
            priority: n.priority,
          }));

          setData({
            title: "মাদরাসা নোটিশ বোর্ড",
            subtitle:
              "গুরুত্বপূর্ণ ঘোষণা, ভর্তি, পরীক্ষা ও ছুটি সংক্রান্ত সর্বশেষ আপডেট",
            categories: [
              { id: "all", label: "সকল নোটিশ" },
              { id: "exam", label: "পরীক্ষা সংক্রান্ত" },
              { id: "holiday", label: "ছুটির নোটিশ" },
              { id: "admission", label: "ভর্তি সংক্রান্ত" },
              { id: "general", label: "সাধারণ" },
              { id: "urgent", label: "জরুরি ঘোষণা" },
            ],
            list: formattedList,
          });
        }
      } catch (err) {
        console.error("Notices page load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16">
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>নোটিশ লোড হচ্ছে...</p>
        </div>
      ) : (
        <NoticeList data={data} />
      )}
    </div>
  );
}
