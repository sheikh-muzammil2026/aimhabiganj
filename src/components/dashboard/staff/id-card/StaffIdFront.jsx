"use client";

import React from "react";
import BarcodeSVG from "react-barcode";

/**
 * StaffIdFront
 * Pure JSX component for the Front side of Staff ID Card
 * Standard CR80 landscape card: 85.6mm x 53.98mm (3.375in x 2.125in)
 */
export default function StaffIdFront({ staff = {}, scale = 1 }) {
  const name = staff.fullName || staff.name || "Md. Abdullah";
  const designation = staff.designation || "Office Assistant";
  const dob = staff.dateOfBirth || staff.dob || "15/05/1992";
  const mobile = staff.phone || staff.mobile || "01712345678";
  const bloodGroup = staff.bloodGroup || staff.blood || "A (+)";
  const idNo = staff.staffId || staff.idNo || "ID NO-AIM ST-001";
  const photo = staff.profileImage || staff.image || "/default-avatar.png";

  return (
    <div
      className="staff-id-card-front relative bg-white overflow-hidden rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:m-0 select-none box-border"
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
      {/* ================= 1. TOP HEADER SECTION ================= */}
      <div className="relative w-full h-[52px] bg-gradient-to-r from-[#0B5E6B] via-[#0D7E75] to-[#0B5E6B] text-white overflow-hidden">
        <div
          className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none"
          style={{ clipPath: "ellipse(50% 50% at 50% 50%)" }}
        />

        <div className="relative z-10 w-full h-full flex items-center px-2">
          {/* Madrasah Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-[42px] h-[42px] rounded-full bg-white p-[2px] shadow-sm border border-teal-100 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aimlogo1.png"
                alt="AIM Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Institutional Typography */}
          <div className="flex-1 flex flex-col items-center justify-center text-center pl-1 pr-1">
            <p className="text-[9.5px] font-bold tracking-wider leading-none text-white drop-shadow-xs font-serif">
              المدرسة الإسلامية النموذجية
            </p>
            <h1 className="text-[11.5px] font-black tracking-normal leading-tight uppercase font-sans text-white drop-shadow-sm mt-[1px]">
              AS SALAM IDEAL MADRASAH
            </h1>
            <p className="text-[6.8px] font-semibold text-emerald-100 leading-none tracking-tight">
              Kachua Road, Habiganj Sadar, Habiganj. EIIN: 139589
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. TITLE RIBBON ================= */}
      <div className="w-full bg-[#1e293b] py-[2px] flex items-center justify-center border-t border-b border-teal-800">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
          STAFF ID CARD
        </span>
      </div>

      {/* ================= 3. BODY SECTION ================= */}
      <div className="relative w-full px-2.5 pt-1.5 pb-1 flex items-start justify-between">
        {/* Left Column: Staff Details */}
        <div className="flex-1 pr-1.5 space-y-[2.5px] text-[8.5px] text-slate-800 font-sans">
          <div className="flex items-baseline">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Name</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-black text-slate-950 uppercase tracking-tight text-[9px] truncate">
              {name}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Post</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-bold text-teal-800 tracking-tight text-[8px] truncate">
              {designation}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Date of Birth</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-semibold text-slate-800 text-[8px]">{dob}</span>
          </div>

          <div className="flex items-baseline">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Mobile</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-bold text-slate-900 font-mono text-[8px]">{mobile}</span>
          </div>

          <div className="flex items-baseline">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Blood Group</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-black text-rose-700 text-[8.5px]">{bloodGroup}</span>
          </div>

          <div className="flex items-baseline pt-0.5">
            <span className="w-[46px] font-extrabold text-slate-900 shrink-0">Staff ID</span>
            <span className="w-[6px] text-slate-600 font-bold shrink-0">:</span>
            <span className="font-black text-slate-900 font-mono text-[8.5px] tracking-tight">
              {idNo}
            </span>
          </div>
        </div>

        {/* Right Column: Photo & Signature */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-[52px] h-[58px] rounded-md border-[1.5px] border-teal-700 p-[1px] bg-white shadow-xs overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo || "/default-avatar.png"}
              alt={name}
              className="w-full h-full object-cover rounded-[3px]"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>

          <div className="w-[54px] flex flex-col items-center pt-0.5 mt-0.5 border-t border-slate-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/principle's_signature.jpg"
              alt="Signature"
              className="h-[12px] object-contain opacity-85"
            />
            <span className="text-[5.5px] font-bold text-slate-700 tracking-tight leading-none">
              Authorized Signature
            </span>
          </div>
        </div>
      </div>

      {/* ================= 4. BOTTOM BARCODE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[18px] bg-slate-50 border-t border-slate-200 flex items-center justify-center px-4 overflow-hidden">
        <BarcodeSVG
          value={idNo || "AIM-STAFF"}
          height={12}
          width={1.1}
          displayValue={false}
          margin={0}
          background="transparent"
        />
      </div>
    </div>
  );
}
