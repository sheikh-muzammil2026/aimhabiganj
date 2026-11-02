"use client";

import React from "react";
import BarcodeSVG from "react-barcode";

/**
 * EmployeeIdFront
 * Shared pure JSX component for the Front side of Teacher & Staff CR80 landscape ID Cards
 * Standard CR80 landscape card: 85.6mm x 53.98mm (3.375in x 2.125in)
 */
export default function EmployeeIdFront({
  person = {},
  variant = "teacher", // "teacher" | "staff"
  scale = 1,
}) {
  const isStaff = variant === "staff";
  const name = isStaff
    ? person?.nameEnglish || person?.fullName || person?.name || "—"
    : person?.fullName || person?.name || "—";
  const designation = person?.designation || (isStaff ? "—" : "শিক্ষক");
  const dob = person?.dateOfBirth || person?.dob || "—";
  const mobile = person?.phone || person?.mobile || "—";
  const bloodGroup = person?.bloodGroup || person?.blood || "—";
  const idNo = isStaff
    ? person?.staffId || person?.idNo || "—"
    : person?.teacherId || person?.idNo || "—";
  const photo =
    person?.profileImage || person?.image || "/default-avatar.png";

  const barcodeValue = isStaff
    ? idNo || "AIM-STAFF"
    : idNo && idNo !== "—"
      ? String(idNo).replace(/\s+/g, "")
      : String(person?._id || "AIM").slice(-8);

  return (
    <div
      className={`${
        isStaff ? "staff-id-card-front" : "teacher-id-card-front"
      } relative bg-white overflow-hidden rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:m-0 select-none box-border`}
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
      <div
        className={`relative w-full h-[52px] bg-gradient-to-r ${
          isStaff
            ? "from-[#0B5E6B] via-[#0D7E75] to-[#0B5E6B]"
            : "from-[#087F77] via-[#0D7E75] to-[#087F77]"
        } text-white overflow-hidden`}
      >
        <div
          className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none"
          style={{ clipPath: "ellipse(50% 50% at 50% 50%)" }}
        />

        <div className="relative z-10 w-full h-full flex items-center px-2">
          {/* Madrasah Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <div
              className={`w-[42px] h-[42px] rounded-full bg-white p-[2px] shadow-sm border ${
                isStaff ? "border-teal-100" : "border-emerald-100"
              } flex items-center justify-center overflow-hidden`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aimlogo1.png"
                alt="AIM Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Institutional Typography */}
          {isStaff ? (
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
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center pl-1 pr-1">
              <p className="text-[9.5px] font-bold tracking-wider leading-none text-white drop-shadow-xs font-serif">
                مدرسة السلام النموذجية
              </p>
              <p className="text-[8px] font-bold text-emerald-100 leading-tight mt-0.5 tracking-tight">
                আস-সালাম আইডিয়াল মাদরাসা (এইম)
              </p>
              <div className="mt-0.5 px-2 py-[1px] bg-white rounded-full shadow-2xs">
                <h1 className="text-[9px] font-black tracking-tight leading-none text-[#C02626] uppercase">
                  As-Salam Ideal Madrasah
                </h1>
              </div>
              <p className="text-[6px] font-black italic tracking-wider leading-tight text-cyan-200 mt-0.5 drop-shadow-xs">
                ✦ AIM For Ultimate Success ✦
              </p>
            </div>
          )}
        </div>
      </div>

      {isStaff ? (
        <>
          {/* ================= 2. STAFF TITLE RIBBON ================= */}
          <div className="w-full bg-[#1e293b] py-[2px] flex items-center justify-center border-t border-b border-teal-800">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
              STAFF ID CARD
            </span>
          </div>

          {/* ================= 3. STAFF BODY SECTION ================= */}
          <div className="relative w-full px-2.5 pt-1.5 pb-1 flex items-start justify-between">
            <div className="flex-1 pr-1.5 space-y-[2.5px] text-[8.5px] text-slate-800 font-sans">
              <div className="flex items-baseline">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Name
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-black text-slate-950 uppercase tracking-tight text-[9px] truncate">
                  {name}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Post
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-bold text-teal-800 tracking-tight text-[8px] truncate">
                  {designation}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Date of Birth
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-semibold text-slate-800 text-[8px]">
                  {dob}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Mobile
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-bold text-slate-900 font-mono text-[8px]">
                  {mobile}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Blood Group
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-black text-rose-700 text-[8.5px]">
                  {bloodGroup}
                </span>
              </div>

              <div className="flex items-baseline pt-0.5">
                <span className="w-[46px] font-extrabold text-slate-900 shrink-0">
                  Staff ID
                </span>
                <span className="w-[6px] text-slate-600 font-bold shrink-0">
                  :
                </span>
                <span className="font-black text-slate-900 font-mono text-[8.5px] tracking-tight">
                  {idNo}
                </span>
              </div>
            </div>

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

          {/* ================= 4. STAFF BOTTOM BARCODE ================= */}
          <div className="absolute bottom-0 left-0 w-full h-[18px] bg-slate-50 border-t border-slate-200 flex items-center justify-center px-4 overflow-hidden">
            <BarcodeSVG
              value={barcodeValue}
              height={12}
              width={1.1}
              displayValue={false}
              margin={0}
              background="transparent"
            />
          </div>
        </>
      ) : (
        <>
          {/* ================= 2. TEACHER MAIN BODY SECTION ================= */}
          <div className="relative w-full h-[126px] px-2.5 pt-1.5 pb-0 flex items-start justify-between">
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

            <div className="flex-1 pl-2.5 pr-1 flex flex-col justify-start">
              <h2 className="text-[11.5px] font-black text-slate-900 leading-tight tracking-tight uppercase line-clamp-1">
                {name}
              </h2>

              <div className="mt-1 space-y-[2.5px] text-[7.8px] leading-tight">
                <div className="flex items-center">
                  <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                    Designation
                  </span>
                  <span className="font-bold text-[#0D7E75] mr-1">:</span>
                  <span className="font-bold text-slate-800 truncate flex-1">
                    {designation}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                    Date of Birth
                  </span>
                  <span className="font-bold text-[#0D7E75] mr-1">:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {dob}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-bold text-[#0D7E75] w-[56px] shrink-0">
                    Mobile
                  </span>
                  <span className="font-bold text-[#0D7E75] mr-1">:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {mobile}
                  </span>
                </div>

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

            <div className="shrink-0 flex flex-col items-center justify-start h-[92px] w-[20px] rounded-sm overflow-hidden border border-[#0D7E75] bg-white shadow-2xs">
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

          {/* ================= 3. TEACHER BOTTOM FOOTER STRIP ================= */}
          <div className="absolute bottom-0 left-0 right-0 h-[26px] bg-[#087F77] px-2 flex items-center justify-between">
            <div className="h-[21px] bg-white px-1.5 py-[2px] rounded-xs shadow-xs flex items-center justify-center overflow-hidden">
              <BarcodeSVG
                value={barcodeValue}
                format="CODE128"
                width={0.9}
                height={16}
                displayValue={false}
                margin={0}
                background="transparent"
              />
            </div>

            <div className="text-right">
              <p className="text-[5.5px] font-medium text-emerald-100 tracking-wider">
                Design & Developed By GreenBangla21
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
