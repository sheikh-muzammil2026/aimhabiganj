"use client";

import React from "react";
import Image from "next/image";
import { MdEmail, MdInstallMobile } from "react-icons/md";
import siteConfig from "@/config/siteConfig";

export function resolveVoucherParty(tx, parsePayerName) {
  const isIncome = tx?.type !== "expense";
  const isStudent =
    tx?.payerType === "student" ||
    Boolean(tx?.studentId) ||
    Boolean(tx?.studentName) ||
    Boolean(tx?.payerName && tx.payerName.includes(" / "));

  const parsed = parsePayerName
    ? parsePayerName(tx?.payerName)
    : {
        donorName: tx?.donorName || tx?.payerName || "N/A",
        studentId: tx?.studentId || "",
      };

  const displayName = isStudent
    ? tx?.studentName || parsed.donorName || "N/A"
    : tx?.donorName || parsed.donorName || "N/A";

  const subInfo = isStudent
    ? `${tx?.studentId || parsed.studentId || "N/A"} (${tx?.className || "N/A"})`
    : "দাতা / অনুদানকারী";

  return {
    isIncome,
    isStudent,
    parsed,
    displayName,
    subInfo,
  };
}

export function VoucherHeader({
  showRightLogo = false,
  showContactRow = false,
  bannerClassName = "w-auto object-fill mx-auto max-h-45",
  className = "flex items-center justify-between gap-2 border-b-2 border-[#C5A059] pb-2",
}) {
  return (
    <div className={className}>
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50 border border-[#C5A059]">
        <Image
          src={siteConfig.assets.logo}
          alt={`${siteConfig.name.short} Logo`}
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      <div className="flex-1 text-center min-w-0 px-1">
        <div className="w-full flex justify-center">
          <Image
            src={siteConfig.assets.banner}
            alt={`${siteConfig.name.short} Banner`}
            width={280}
            height={40}
            className={bannerClassName}
            priority
          />
        </div>
        <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
          {siteConfig.address.bn}
        </p>
        {showContactRow && (
          <div className="flex items-center justify-center gap-2 text-[8.5px] text-emerald-800 font-medium">
            <span className="flex items-center gap-0.5">
              <MdInstallMobile className="text-[10px] shrink-0" /> {siteConfig.contacts.phone}
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-0.5">
              <MdEmail className="text-[10px] shrink-0" /> {siteConfig.contacts.email}
            </span>
          </div>
        )}
      </div>

      {showRightLogo && (
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50 border border-[#C5A059]">
          <Image
            src={siteConfig.assets.logo}
            alt={`${siteConfig.name.short} Logo`}
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
