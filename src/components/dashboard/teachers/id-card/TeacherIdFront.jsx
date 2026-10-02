"use client";

import React from "react";
import BarcodeSVG from "react-barcode";

/**
 * TeacherIdFront
 * Pure JSX component for the Front side of Teacher ID Card
 * Standard CR80 landscape card: 85.6mm x 53.98mm (3.375in x 2.125in)
 */
export default function TeacherIdFront({ teacher = {}, scale = 1 }) {
  const name = teacher.fullName || teacher.name || "Sheikh Muzammil";
  const designation = teacher.designation || "Assistant Teacher";
  const dob = teacher.dateOfBirth || teacher.dob || "13/12/1998";
  const mobile = teacher.phone || teacher.mobile || "01836376174";
  const bloodGroup = teacher.bloodGroup || teacher.blood || "A (-)";
  const idNo = teacher.teacherId || teacher.idNo || "ID NO-AIM 0 235";
  const photo = teacher.profileImage || teacher.image || "/default-avatar.png";

  return (
    <div
      className="teacher-id-card-front relative bg-white overflow-hidden rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:m-0 select-none box-border"
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
      <div className="relative w-full h-[52px] bg-gradient-to-r from-[#087F77] via-[#0D7E75] to-[#087F77] text-white overflow-hidden">
        {/* Decorative subtle polygon shape overlay */}
        <div
          className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none"
          style={{ clipPath: "ellipse(50% 50% at 50% 50%)" }}
        />

        <div className="relative z-10 w-full h-full flex items-center px-2">
          {/* Madrasah Logo in Circular Badge */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-[42px] h-[42px] rounded-full bg-white p-[2px] shadow-sm border border-emerald-100 flex items-center justify-center overflow-hidden">
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
            {/* Arabic Title */}
            <p className="text-[9.5px] font-bold tracking-wider leading-none text-white drop-shadow-xs font-serif">
              مدرسة السلام النموذجية
            </p>

            {/* Bangla Title */}
            <p className="text-[8px] font-bold text-emerald-100 leading-tight mt-0.5 tracking-tight">
              আস-সালাম আইডিয়াল মাদরাসা (এইম)
            </p>

            {/* English Title (Bold Red with White Backdrop Pill) */}
            <div className="mt-0.5 px-2 py-[1px] bg-white rounded-full shadow-2xs">
              <h1 className="text-[9px] font-black tracking-tight leading-none text-[#C02626] uppercase">
                As-Salam Ideal Madrasah
              </h1>
            </div>

            {/* Motto */}
            <p className="text-[6px] font-black italic tracking-wider leading-tight text-cyan-200 mt-0.5 drop-shadow-xs">
              ✦ AIM For Ultimate Success ✦
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN BODY SECTION ================= */}
      <div className="relative w-full h-[126px] px-2.5 pt-1.5 pb-0 flex items-start justify-between">
        {/* Left Column: Teacher Photo */}
        <div className="shrink-0 pt-0.5">
          <div className="w-[66px] h-[78px] rounded-md bg-slate-100 border-[1.5px] border-[#0D7E75] shadow-xs overflow-hidden flex items-center justify-center bg-white p-[1px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover rounded-[3px]"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>
        </div>

        {/* Center Column: Teacher Information Details */}
        <div className="flex-1 pl-2.5 pr-1 flex flex-col justify-start">
          {/* Teacher Name */}
          <h2 className="text-[11.5px] font-black text-slate-900 leading-tight tracking-tight uppercase line-clamp-1">
            {name}
          </h2>

          {/* Information Rows */}
          <div className="mt-1 space-y-[2.5px] text-[7.8px] leading-tight">
            {/* Designation */}
            <div className="flex items-center">
              <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                Designation
              </span>
              <span className="font-bold text-[#0D7E75] mr-1">:</span>
              <span className="font-bold text-slate-800 truncate flex-1">
                {designation}
              </span>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center">
              <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                Date of Birth
              </span>
              <span className="font-bold text-[#0D7E75] mr-1">:</span>
              <span className="font-bold text-slate-800 font-mono">
                {dob}
              </span>
            </div>

            {/* Mobile Number */}
            <div className="flex items-center">
              <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                Mobile
              </span>
              <span className="font-bold text-[#0D7E75] mr-1">:</span>
              <span className="font-bold text-slate-800 font-mono">
                {mobile}
              </span>
            </div>

            {/* Blood Group */}
            <div className="flex items-center">
              <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                Blood Group
              </span>
              <span className="font-bold text-[#0D7E75] mr-1">:</span>
              <span className="font-black text-[#DC2626] text-[8.5px]">
                {bloodGroup}
              </span>
            </div>
          </div>

          {/* Principal Signature Area */}
          <div className="mt-1 flex flex-col items-end pr-1">
            <div className="relative h-6 w-16 flex items-center justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/principle's_signature.jpg"
                alt="Authorized Signature"
                className="max-h-6 max-w-full object-contain mix-blend-multiply contrast-[400%]"
              />
            </div>
            <p className="text-[6.5px] font-bold text-[#0D7E75] leading-none tracking-tight">
              Authorized Signature
            </p>
          </div>
        </div>

        {/* Right Column: Vertical ID Badge */}
        <div className="shrink-0 flex flex-col items-center justify-start h-[92px] w-[20px] rounded-sm overflow-hidden border border-[#0D7E75] bg-white shadow-2xs">
          {/* Top Teal Block: "ID Card" */}
          <div className="w-full bg-[#0D7E75] py-1 flex items-center justify-center">
            <span
              className="text-[7px] font-black text-white tracking-widest leading-none whitespace-nowrap uppercase"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              ID Card
            </span>
          </div>

          {/* Bottom White Block: ID NO */}
          <div className="w-full flex-1 bg-white py-1 flex items-center justify-center">
            <span
              className="text-[7.5px] font-black text-[#0B2545] font-mono tracking-wider leading-none whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {idNo}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. BOTTOM FOOTER STRIP ================= */}
      <div className="absolute bottom-0 left-0 right-0 h-[26px] bg-[#087F77] px-2 flex items-center justify-between">
        {/* Left: Barcode Container */}
        <div className="h-[21px] bg-white px-1.5 py-[2px] rounded-xs shadow-xs flex items-center justify-center overflow-hidden">
          <BarcodeSVG
            value={idNo ? idNo.replace(/\s+/g, "") : "AIM0235"}
            format="CODE128"
            width={0.9}
            height={16}
            displayValue={false}
            margin={0}
            background="transparent"
          />
        </div>

        {/* Right: Credits / Branding */}
        <div className="text-right">
          <p className="text-[5.5px] font-medium text-emerald-100 tracking-wider">
            Design & Developed By GreenBangla21
          </p>
        </div>
      </div>
    </div>
  );
}
