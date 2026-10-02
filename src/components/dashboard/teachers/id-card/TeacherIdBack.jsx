"use client";

import React from "react";
import { Globe, Mail } from "lucide-react";
import { BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

/**
 * TeacherIdBack
 * Pure JSX component for the Back side of Teacher ID Card
 * Standard CR80 landscape card: 85.6mm x 53.98mm (3.375in x 2.125in)
 */
export default function TeacherIdBack({ scale = 1 }) {
  return (
    <div
      className="teacher-id-card-back relative bg-white overflow-hidden rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:m-0 select-none box-border p-[4px]"
      style={{
        width: "3.375in",
        height: "2.125in",
        minWidth: "3.375in",
        minHeight: "2.125in",
        maxWidth: "3.375in",
        maxHeight: "2.125in",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Inner Rounded Rectangular Border */}
      <div className="w-full h-full border-[1.5px] border-black rounded-lg p-2 flex flex-col justify-between items-center text-center bg-white">
        {/* ================= 1. RULES & NOTICE PARAGRAPHS ================= */}
        <div className="w-full space-y-[2px]">
          <p className="text-[7.5px] font-medium text-slate-800 leading-tight">
            This card remains the property of
          </p>
          <p className="text-[8.5px] font-extrabold text-black leading-tight">
            As Salam Ideal Madrasah (AIM)
          </p>
          <p className="text-[7.5px] font-extrabold text-black leading-tight pt-0.5">
            Not Transferable
          </p>
          <p className="text-[7px] font-medium text-slate-800 leading-tight pt-0.5">
            This card identifies you as an employee of
          </p>
          <p className="text-[8px] font-extrabold text-black leading-tight">
            As Salam Ideal Madrasah (AIM)
          </p>
          <p className="text-[6.5px] font-medium text-slate-700 leading-tight pt-0.5">
            You must produce this card on demand. If you leave the job
          </p>
          <p className="text-[6.5px] font-medium text-slate-700 leading-tight">
            you must return this card to the office of AIM.
          </p>
        </div>

        {/* ================= 2. RETURN PILL BADGE & MADRASAH INFO ================= */}
        <div className="w-full my-auto flex flex-col items-center">
          {/* Highlighted Return Pill */}
          <div
            className="px-2.5 py-[2px] rounded-full border border-[#0D7E75] bg-[#E6F7F5] shadow-2xs mb-1"
            style={{
              backgroundColor: "#E6F7F5",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <p className="text-[7.5px] font-bold text-[#DC2626] leading-none tracking-tight">
              If found Please Return to the Office of
            </p>
          </div>

          {/* Institution Name */}
          <h3 className="text-[9.5px] font-black text-black leading-tight tracking-tight uppercase">
            AS Salam Ideal Madrasah (AIM)
          </h3>

          {/* Address */}
          <p className="text-[7.5px] font-bold text-slate-800 leading-tight mt-0.5">
            Rajnagar (Judge Bari), Habiganj
          </p>

          {/* Contact Phone */}
          <p className="text-[8px] font-black text-black leading-tight font-mono mt-0.5">
            Please Call : 01316209201 (office)
          </p>
        </div>

        {/* ================= 3. SOCIAL MEDIA & WEB FOOTER ================= */}
        <div className="w-full pt-1 border-t border-slate-300 flex items-center justify-between text-[6px] text-slate-800 px-0.5">
          {/* Website */}
          <div className="flex items-center gap-0.5">
            <Globe className="w-2.5 h-2.5 text-[#0891B2] shrink-0" />
            <span className="font-semibold truncate">
              https://aimhabiganj.com
            </span>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-0.5">
            <BsYoutube className="w-2.5 h-2.5 text-[#DC2626] shrink-0" />
            <span className="font-semibold">aimhabiganj</span>
          </div>

          {/* Facebook */}
          <div className="flex items-center gap-0.5">
            <FaFacebook className="w-2.5 h-2.5 text-[#2563EB] shrink-0" />
            <span className="font-semibold">aimhabiganj</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-0.5">
            <Mail className="w-2.5 h-2.5 text-[#0D7E75] shrink-0" />
            <span className="font-semibold truncate">
              aimhabiganj@gmail.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
