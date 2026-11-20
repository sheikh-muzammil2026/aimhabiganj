// app/contact/page.js
"use client";
import ContactComponent from "@/components/public/contact/ContactComponent";

export default function ContactPage() {
  return (
    <div className="page-wrapper flex items-center justify-center">
      <div className="w-full">
        <ContactComponent />
      </div>
    </div>
  );
}
