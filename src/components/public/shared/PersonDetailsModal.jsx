// components/public/shared/PersonDetailsModal.jsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  IdCard,
  Droplets,
  BookOpen,
  User,
  Globe,
  Link2,
} from "lucide-react";

export default function PersonDetailsModal({ person, isOpen, onClose, type = "teacher" }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [person]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !person) return null;

  const isTeacher = type === "teacher";
  const name = person.fullName || person.name || "তথ্য নেই";
  const designation = person.designation || person.role || (isTeacher ? "শিক্ষক" : "স্টাফ");
  const idNo = person.teacherId || person.staffId || "";
  const photo = person.profileImage || person.image || "";
  const phone = person.phone || person.contact || person.mobile || "";
  const email = person.email || "";
  const bloodGroup = person.bloodGroup || person.blood || "";
  const address = person.address || "";
  const dob = person.dateOfBirth || person.dob || "";
  const joiningDate = person.joiningDate || "";
  const department = person.department || person.subject || "";
  const education = person.education || "";
  const bio = person.bio || "";
  const academicList = Array.isArray(person.academic) ? person.academic : [];
  const experienceList = Array.isArray(person.experience) ? person.experience : [];
  const socialLinks = person.socialLinks || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* টপ ব্যানার ও ক্লোজ বাটন */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* প্রোফাইল হেডার কার্ড */}
        <div className="px-6 sm:px-8 pb-4 relative -mt-14 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-4 border-b border-gray-100 dark:border-slate-800">
          {/* অবতার */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex-shrink-0 relative">
            {photo && !imgError ? (
              <img
                src={photo}
                alt={name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
                <span className="text-2xl font-bold font-shalda">
                  {isTeacher ? "উস্তাদ" : "স্টাফ"}
                </span>
                <span className="text-xs text-amber-300 font-mono">AIM</span>
              </div>
            )}
          </div>

          {/* নাম ও টাইটেল */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {isTeacher ? "শিক্ষক পরিচিতি" : "কর্মকর্তা / কর্মচারী"}
              </span>
              {idNo && (
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {idNo}
                </span>
              )}
            </div>
            <h3
              id="person-modal-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5"
            >
              {name}
            </h3>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {designation}
            </p>
          </div>
        </div>

        {/* স্ক্রলেবল কনটেন্ট বডি */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* মৌলিক তথ্য গ্রিড */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {phone && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">মোবাইল নম্বর</p>
                    <a
                      href={`tel:${phone}`}
                      className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 font-mono hover:underline truncate block"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {email && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">ইমেইল</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 hover:underline truncate block"
                      title={email}
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {bloodGroup && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">রক্তের গ্রুপ</p>
                    <p className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">
                      {bloodGroup}
                    </p>
                  </div>
                </div>
              )}

              {department && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">বিভাগ / বিষয়</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {department}
                    </p>
                  </div>
                </div>
              )}

              {joiningDate && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">যোগদানের তারিখ</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {joiningDate}
                    </p>
                  </div>
                </div>
              )}

              {dob && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">জন্ম তারিখ</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {dob}
                    </p>
                  </div>
                </div>
              )}

              {address && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">বর্তমান ঠিকানা</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                      {address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* শিক্ষাগত যোগ্যতা */}
          {(education || academicList.length > 0) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                শিক্ষাগত যোগ্যতা
              </h4>
              {academicList.length > 0 ? (
                <div className="space-y-2">
                  {academicList.map((item, idx) => (
                    <div
                      key={`acad-${idx}`}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm"
                    >
                      <p className="font-bold text-gray-900 dark:text-white">
                        {item.degree || item.title || item.name}
                      </p>
                      {(item.institute || item.year || item.result) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {[item.institute, item.year, item.result].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                  {education}
                </div>
              )}
            </div>
          )}

          {/* কর্মঅভিজ্ঞতা */}
          {experienceList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                কর্মঅভিজ্ঞতা
              </h4>
              <div className="space-y-2">
                {experienceList.map((item, idx) => (
                  <div
                    key={`exp-${idx}`}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm"
                  >
                    <p className="font-bold text-gray-900 dark:text-white">
                      {item.designation || item.role || item.title}
                    </p>
                    {(item.organization || item.duration || item.years) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {[item.organization, item.duration, item.years].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* জীবনবৃত্তান্ত / বায়ো */}
          {bio && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                সংক্ষিপ্ত পরিচিতি
              </h4>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {bio}
              </div>
            </div>
          )}

          {/* সোশ্যাল লিংকস */}
          {(socialLinks.linkedin || socialLinks.website || socialLinks.researchgate) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                ওয়েব ও সামাজিক মাধ্যম
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    ওয়েবসাইট
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    লিঙ্কডইন
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ফুটার বাটন */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/80 border-t border-gray-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
