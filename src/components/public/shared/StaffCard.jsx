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
      } bg-white dark:bg-slate-800 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 group`}
    >
      <div className={`flex items-start ${isMarquee ? "gap-3.5" : "gap-4"}`}>
        {/* অবতার / ছবি */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-slate-700 border-2 border-emerald-600/30 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs relative">
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
            <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
              <span className="text-xs font-bold font-shalda">স্টাফ</span>
              <span className="text-[9px] text-amber-300 font-mono">
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
              } font-bold text-emerald-950 dark:text-emerald-300 truncate`}
              title={staff.fullName || staff.name}
            >
              {staff.fullName || staff.name}
            </h4>
            {staff.bloodGroup && (
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/40 flex-shrink-0">
                🩸 {staff.bloodGroup}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5 truncate">
            {staff.designation || staff.role || "স্টাফ"}
          </p>

          {staff.staffId && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <span className="font-mono bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300">
                {staff.staffId}
              </span>
            </p>
          )}

          {/* যোগাযোগ */}
          <div className="mt-2 space-y-1">
            {(staff.phone || staff.contact) && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href={`tel:${staff.phone || staff.contact}`}
                  className="hover:underline truncate"
                >
                  {staff.phone || staff.contact}
                </a>
              </p>
            )}
            {staff.email && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
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
      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-700/60">
        <button
          type="button"
          onClick={() => onSelect?.(staff)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-slate-700 text-amber-900 dark:text-amber-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors border border-amber-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer ${
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
