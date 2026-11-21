"use client";

import { useState } from "react";
import { Phone, Mail, Eye } from "lucide-react";

export default function StaffCard({
  staff,
  index = 0,
  onSelect,
  variant = "grid", // "grid" | "marquee"
}) {
  const [imgError, setImgError] = useState(false);
  const photo = staff.profileImage || staff.image;
  const isMarquee = variant === "marquee";

  return (
    <div
      className={`${
        isMarquee ? "w-[290px] sm:w-[330px] shrink-0" : ""
      } bg-white border border-[#90CAF9] border-l-4 border-l-[#2196F3] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 group`}
    >
      <div className={`flex items-start ${isMarquee ? "gap-3.5" : "gap-4"}`}>
        {/* অবতার / ছবি */}
        <div className="w-14 h-14 rounded-full bg-[#E3F2FD] border-2 border-[#0D47A1]/40 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs relative">
          {photo && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={staff.fullName || staff.name || "Staff"}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#0D47A1] flex flex-col items-center justify-center text-white select-none">
              <span className="text-xs font-bold font-shalda">স্টাফ</span>
              <span className="text-[9px] text-[#90CAF9] font-mono">
                0{index + 1}
              </span>
            </div>
          )}
        </div>

        {/* বিস্তারিত তথ্য */}
        <div className="flex-1 min-w-0">
          <div
            className={`flex items-start justify-between ${
              isMarquee ? "gap-1.5" : "gap-2"
            }`}
          >
            <h4
              className={`${
                isMarquee ? "text-sm sm:text-base" : "text-base"
              } font-bold text-[#0D47A1] truncate`}
              title={staff.fullName || staff.name}
            >
              {staff.fullName || staff.name}
            </h4>
            {staff.bloodGroup && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 flex-shrink-0">
                🩸 {staff.bloodGroup}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-[#2196F3] mt-0.5 truncate">
            {staff.designation || staff.role || "স্টাফ"}
          </p>

          {staff.staffId && (
            <p className="text-[11px] text-[#1E293B] mt-1 flex items-center gap-1">
              <span className="font-mono bg-[#E3F2FD] px-1.5 py-0.5 rounded text-[10px] text-[#0D47A1] border border-[#90CAF9]/50">
                {staff.staffId}
              </span>
            </p>
          )}

          {/* যোগাযোগ */}
          <div className="mt-2 space-y-1">
            {(staff.phone || staff.contact) && (
              <p className="text-[11px] text-[#0D47A1] font-mono flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#2196F3] shrink-0" />
                <a
                  href={`tel:${staff.phone || staff.contact}`}
                  className="hover:underline truncate"
                >
                  {staff.phone || staff.contact}
                </a>
              </p>
            )}
            {staff.email && (
              <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#2196F3] shrink-0" />
                <a
                  href={`mailto:${staff.email}`}
                  className="hover:underline truncate"
                  title={staff.email}
                >
                  {staff.email}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* বিস্তারিত দেখুন বাটন */}
      <div className="pt-3 mt-3 border-t border-[#90CAF9]/30">
        <button
          type="button"
          onClick={() => onSelect?.(staff)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#2196F3] hover:text-white transition-colors border border-[#90CAF9] flex items-center justify-center gap-1.5 cursor-pointer ${
            isMarquee ? "shadow-2xs" : ""
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
