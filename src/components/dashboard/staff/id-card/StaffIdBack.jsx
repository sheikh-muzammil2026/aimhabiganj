"use client";

import React from "react";
import { Globe, Mail } from "lucide-react";
import { BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

/**
 * StaffIdBack
 * Pure JSX component for the Back side of Staff ID Card
 * Standard CR80 landscape card: 85.6mm x 53.98mm (3.375in x 2.125in)
 */
export default function StaffIdBack({ scale = 1 }) {
  return (
    <div
      className="staff-id-card-back relative bg-white overflow-hidden rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:m-0 select-none box-border p-[4px]"
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
        {/* ================= 1. RULES & NOTICE ================= */}
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
            This card identifies you as a staff employee of
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
          <div
            className="bg-[#087F77] text-white font-extrabold text-[8px] uppercase tracking-wider px-3 py-[2px] rounded-full shadow-xs"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            If Found, Please Return To
          </div>

          <div className="mt-1 space-y-[1px]">
            <p className="text-[9.5px] font-black text-black tracking-tight leading-tight uppercase font-sans">
              As Salam Ideal Madrasah (AIM)
            </p>
            <p className="text-[6.8px] font-bold text-slate-900 leading-tight">
              Kachua Road, Habiganj Sadar, Habiganj.
            </p>
            <p className="text-[7.2px] font-black text-slate-900 font-mono leading-tight">
              Phone: 01836-376174, 01711-000000
            </p>
          </div>
        </div>

        {/* ================= 3. FOOTER ICONS & CHANNELS ================= */}
        <div className="w-full pt-1 border-t border-slate-300 flex items-center justify-between text-[6.5px] text-slate-800 font-semibold px-0.5">
          <div className="flex items-center gap-0.5 truncate">
            <Globe className="w-2.5 h-2.5 text-teal-700 shrink-0" />
            <span className="truncate">aimhabiganj.edu.bd</span>
          </div>

          <div className="flex items-center gap-0.5 truncate">
            <Mail className="w-2.5 h-2.5 text-rose-600 shrink-0" />
            <span className="truncate">info@aimhabiganj.edu.bd</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <FaFacebook className="w-2.5 h-2.5 text-[#1877F2]" />
            <BsYoutube className="w-2.5 h-2.5 text-[#FF0000]" />
          </div>
        </div>
      </div>
    </div>
  );
}
