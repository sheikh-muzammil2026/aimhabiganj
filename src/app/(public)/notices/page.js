// app/notices/page.js
"use client";
import NoticeList from "@/components/public/notices/NoticeList";

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16">
      <NoticeList data={null} />
    </div>
  );
}
