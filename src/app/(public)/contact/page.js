// app/contact/page.js
"use client";
import ContactComponent from "@/components/public/contact/ContactComponent";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 flex items-center justify-center">
      <div className="w-full">
        <ContactComponent />
      </div>
    </div>
  );
}
