"use client";

import { useState } from "react";
import { Phone, Mail, BookOpen, Eye } from "lucide-react";

export default function TeacherCard({
  teacher,
  onSelect,
  variant = "grid", // "grid" | "marquee"
}) {
  const [imageError, setImageError] = useState(false);
  const photo = teacher.profileImage || teacher.image;
  const isMarquee = variant === "marquee";

  return (
    <div
      className={`${
        isMarquee
          ? "w-[280px] sm:w-[320px] shrink-0 border-emerald-100/80 shadow-md"
          : "border-gray-100 shadow-xs"
      } bg-white dark:bg-slate-800 border dark:border-slate-700/80 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 flex flex-col justify-between`}
    >
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-900/10 to-transparent dark:from-emerald-950/40 pointer-events-none" />

      <div>
        {/* প্রোফাইল অবতার */}
        <div
          className={`${
            isMarquee ? "w-24 h-24 sm:w-28 sm:h-28" : "w-24 h-24"
          } rounded-full mx-auto p-1.5 border-4 border-emerald-800 dark:border-emerald-600 bg-white dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-md relative z-10 mb-4 transition-transform duration-300 group-hover:scale-105`}
        >
          {photo && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={teacher.name || teacher.fullName || "Teacher"}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
              <span
                className={`${
                  isMarquee ? "text-xl sm:text-2xl" : "text-xl"
                } font-bold font-shalda`}
              >
                উস্তাদ
              </span>
              <span
                className={`text-[10px] text-amber-300 font-medium ${
                  isMarquee ? "tracking-wider" : ""
                }`}
              >
                AIM
              </span>
            </div>
          )}
        </div>

        {/* নাম ও পদবী */}
        <div className="relative z-10 space-y-1.5">
          <h3
            className={`${
              isMarquee ? "text-base sm:text-lg" : "text-base"
            } font-bold text-emerald-950 dark:text-emerald-300 line-clamp-1`}
            title={teacher.name || teacher.fullName}
          >
            {teacher.name || teacher.fullName}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span
              className={`text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 ${
                isMarquee ? "px-3 py-1" : "px-3 py-0.5"
              } rounded-full inline-block border border-amber-200 dark:border-amber-900/40 shadow-2xs`}
            >
              {teacher.designation || "শিক্ষক"}
            </span>

            {teacher.department &&
              teacher.department !== teacher.designation && (
                <span
                  className={`text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 ${
                    isMarquee ? "px-2.5 py-0.5" : "px-2 py-0.5"
                  } rounded-full inline-flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/30`}
                >
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  {teacher.department}
                </span>
              )}
          </div>

          {/* শিক্ষাগত যোগ্যতা */}
          <p
            className="text-xs text-gray-600 dark:text-gray-300 pt-2.5 border-t border-gray-100 dark:border-slate-700/60 mt-2.5 truncate"
            title={teacher.education}
          >
            🎓 {teacher.education || "উচ্চতর ইসলামী ও সাধারণ শিক্ষা"}
          </p>

          {/* যোগাযোগ */}
          {(teacher.phone || teacher.email) && (
            <div className="pt-2 border-t border-dashed border-gray-100 dark:border-slate-700/50 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  title={teacher.phone}
                >
                  <Phone
                    className={`${
                      isMarquee ? "w-3.5 h-3.5" : "w-3 h-3"
                    } text-emerald-600`}
                  />
                  <span className="font-mono text-[11px]">{teacher.phone}</span>
                </a>
              )}
              {teacher.phone && teacher.email && (
                <span className="text-gray-300 dark:text-gray-600">•</span>
              )}
              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="inline-flex items-center gap-1 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  title={teacher.email}
                >
                  <Mail
                    className={`${
                      isMarquee ? "w-3.5 h-3.5" : "w-3 h-3"
                    } text-amber-600`}
                  />
                  <span
                    className={`truncate ${
                      isMarquee ? "max-w-[110px]" : "max-w-[100px]"
                    } text-[11px]`}
                  >
                    {teacher.email.split("@")[0]}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* বিস্তারিত দেখুন বাটন */}
      <div className="relative z-10 pt-4 mt-3 border-t border-gray-100 dark:border-slate-700/60">
        <button
          type="button"
          onClick={(e) => {
            if (isMarquee) e.stopPropagation();
            onSelect?.(teacher);
          }}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-slate-700/80 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-800 hover:text-white dark:hover:bg-emerald-600 transition-colors border border-emerald-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:border-emerald-300"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
