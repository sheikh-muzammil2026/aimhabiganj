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
          ? "w-[280px] sm:w-[320px] shrink-0 border-[#90CAF9] shadow-md"
          : "border-[#90CAF9] shadow-xs"
      } bg-white border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 flex flex-col justify-between`}
    >
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0D47A1]/10 to-transparent pointer-events-none" />

      <div>
        {/* প্রোফাইল অবতার */}
        <div
          className={`${
            isMarquee ? "w-24 h-24 sm:w-28 sm:h-28" : "w-24 h-24"
          } rounded-full mx-auto p-1.5 border-4 border-[#0D47A1] bg-white flex items-center justify-center overflow-hidden shadow-md relative z-10 mb-4 transition-transform duration-300 group-hover:scale-105`}
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
            <div className="w-full h-full rounded-full bg-[#0D47A1] flex flex-col items-center justify-center text-white select-none">
              <span
                className={`${
                  isMarquee ? "text-xl sm:text-2xl" : "text-xl"
                } font-bold font-shalda`}
              >
                উস্তাদ
              </span>
              <span
                className={`text-[10px] text-[#90CAF9] font-medium ${
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
            } font-bold text-[#0D47A1] line-clamp-1`}
            title={teacher.name || teacher.fullName}
          >
            {teacher.name || teacher.fullName}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span
              className={`text-xs font-semibold text-[#0D47A1] bg-[#E3F2FD] ${
                isMarquee ? "px-3 py-1" : "px-3 py-0.5"
              } rounded-full inline-block border border-[#90CAF9] shadow-2xs`}
            >
              {teacher.designation || "শিক্ষক"}
            </span>

            {teacher.department &&
              teacher.department !== teacher.designation && (
                <span
                  className={`text-[11px] font-medium text-[#2196F3] bg-[#E3F2FD]/50 ${
                    isMarquee ? "px-2.5 py-0.5" : "px-2 py-0.5"
                  } rounded-full inline-flex items-center gap-1 border border-[#90CAF9]/60`}
                >
                  <BookOpen className="w-3 h-3 text-[#2196F3]" />
                  {teacher.department}
                </span>
              )}
          </div>

          {/* শিক্ষাগত যোগ্যতা */}
          <p
            className="text-xs text-[#1E293B] pt-2.5 border-t border-[#90CAF9]/30 mt-2.5 truncate"
            title={teacher.education}
          >
            🎓 {teacher.education || "উচ্চতর ইসলামী ও সাধারণ শিক্ষা"}
          </p>

          {/* যোগাযোগ */}
          {(teacher.phone || teacher.email) && (
            <div className="pt-2 border-t border-dashed border-[#90CAF9]/40 flex items-center justify-center gap-3 text-xs text-slate-500">
              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="inline-flex items-center gap-1 hover:text-[#2196F3] transition-colors"
                  title={teacher.phone}
                >
                  <Phone
                    className={`${
                      isMarquee ? "w-3.5 h-3.5" : "w-3 h-3"
                    } text-[#2196F3]`}
                  />
                  <span className="font-mono text-[11px]">{teacher.phone}</span>
                </a>
              )}
              {teacher.phone && teacher.email && (
                <span className="text-slate-300">•</span>
              )}
              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="inline-flex items-center gap-1 hover:text-[#2196F3] transition-colors"
                  title={teacher.email}
                >
                  <Mail
                    className={`${
                      isMarquee ? "w-3.5 h-3.5" : "w-3 h-3"
                    } text-[#2196F3]`}
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
      <div className="relative z-10 pt-4 mt-3 border-t border-[#90CAF9]/30">
        <button
          type="button"
          onClick={(e) => {
            if (isMarquee) e.stopPropagation();
            onSelect?.(teacher);
          }}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#0D47A1] hover:text-white transition-colors border border-[#90CAF9] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:border-[#2196F3]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
