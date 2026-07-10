// app/gallery/page.js
"use client";
import GalleryTab from "@/components/public/gallery/GalleryTab";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16">
      <GalleryTab />
    </div>
  );
}
