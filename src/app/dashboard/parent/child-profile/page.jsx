"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  GraduationCap,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Printer,
  ShieldCheck,
  Award,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  QrCode,
  FileText,
  BadgeCheck,
  ChevronRight,
  Droplet,
  Activity,
  Briefcase,
  Users,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function ChildProfilePage() {
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("academic"); // "academic" | "parents" | "address" | "tarbiyah" | "performance"
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showFullPrintModal, setShowFullPrintModal] = useState(false);

  // Fetch children list for switching
  const fetchChildren = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/parent/children`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success && json.children && json.children.length > 0) {
        setChildren(json.children);
        if (!selectedStudentId) {
          setSelectedStudentId(json.children[0].studentId);
        }
      }
    } catch (err) {
      console.warn("Children fetch error:", err);
    }
  };

  // Fetch full profile for selected child
  const fetchProfile = async (studentId) => {
    try {
      setLoading(true);
      const url = studentId
        ? `${API_BASE}/api/parent/child-profile?studentId=${studentId}`
        : `${API_BASE}/api/parent/child-profile`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData(json.student);
      } else {
        toast.error(json.message || "প্রোফাইল তথ্য পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন সম্ভব হয়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchProfile(selectedStudentId);
  }, [selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  const formatAddress = (addr) => {
    if (!addr) return "তথ্য নেই";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      const parts = [
        addr.house ? `বাড়ি: ${addr.house}` : null,
        addr.road ? `রোড: ${addr.road}` : null,
        addr.village ? `গ্রাম: ${addr.village}` : null,
        addr.postOffice ? `ডাকঘর: ${addr.postOffice}` : null,
        addr.thana ? `থানা: ${addr.thana}` : null,
        addr.district ? `জেলা: ${addr.district}` : null,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "তথ্য নেই";
    }
    return String(addr);
  };

  const student = data || {};
  const father = student.father || {};
  const mother = student.mother || {};
  const guardian = student.guardian || {};
  const tarbiyah = student.tarbiyah || {};
  const summary = student.summary || {};

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 p-3 sm:p-5 md:p-8 font-shalda">
      {/* 🟢 PRINT STYLES FOR INSTITUTIONAL ID CARD & FULL PROFILE */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-profile-container,
          #printable-profile-container * {
            visibility: visible;
          }
          #printable-profile-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/parent"
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-300"
              title="অভিভাবক ড্যাশবোর্ডে ফিরুন"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  শিক্ষার্থী তথ্যপঞ্জি
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  শিক্ষাবর্ষ {student.sessionYear || "২০২৬"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                সন্তানের পূর্ণাঙ্গ প্রোফাইল
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                সন্তানের প্রাতিষ্ঠানিক বায়োডাটা, পারিবারিক তথ্য, তারবিয়াত ও স্বাস্থ্য বিবরণী
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Child Switcher Dropdown */}
            {children.length > 0 && (
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  শিক্ষার্থী:
                </span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent text-xs font-black text-emerald-800 dark:text-emerald-300 focus:outline-none cursor-pointer"
                >
                  {children.map((ch) => (
                    <option
                      key={ch.studentId}
                      value={ch.studentId}
                      className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    >
                      {ch.studentNameBangla || ch.studentNameEnglish} (রোল: {ch.roll || "১"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => fetchProfile(selectedStudentId)}
              disabled={loading}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            <button
              onClick={() => setShowIdCardModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>আইডি কার্ড</span>
            </button>

            <button
              onClick={() => setShowFullPrintModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>বায়োডাটা প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* 2. Hero Student Identity Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-700/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Student Photo */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-neutral-800 relative">
                {student.studentImage ? (
                  <img
                    src={student.studentImage}
                    alt={student.nameBangla || "শিক্ষার্থী"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-300 font-black text-3xl">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white border-2 border-emerald-900 shadow-md flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                <span>সক্রিয়</span>
              </div>
            </div>

            {/* Names & Core Details */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  {student.nameBangla}
                </h2>
                {student.nameArabic && (
                  <span className="text-sm sm:text-base font-bold text-amber-300 font-arabic px-2.5 py-0.5 rounded-lg bg-white/10 backdrop-blur-md">
                    {student.nameArabic}
                  </span>
                )}
              </div>

              {student.nameEnglish && (
                <div className="text-xs sm:text-sm font-semibold text-emerald-200/90 tracking-wide">
                  {student.nameEnglish}
                </div>
              )}

              {/* Badges strip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 font-bold text-emerald-100 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>শ্রেণি: {student.className}</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 font-bold text-emerald-100">
                  রোল: {student.roll}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-400 text-neutral-950 font-black">
                  আইডি: {student.studentId}
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 font-bold text-emerald-100 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-red-400" />
                  <span>রক্তের গ্রুপ: {student.bloodGroup}</span>
                </span>
              </div>
            </div>

            {/* Quick KPI Snapshot Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full md:w-auto shrink-0 pt-3 md:pt-0">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-200">উপস্থিতি হার</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {summary.attendancePercentage || 96}%
                </div>
                <div className="text-[10px] text-emerald-300 font-medium">সন্তোষজনক</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-200">বর্তমান সবক</div>
                <div className="text-base font-black text-amber-300 mt-0.5">
                  প্যারা {summary.sabakStatus?.para || "০৫"}
                </div>
                <div className="text-[10px] text-emerald-200 truncate">
                  {summary.sabakStatus?.surah || "সূরা আন-নিসা"}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-emerald-200">ফি এর অবস্থা</div>
                <div className="text-sm font-black text-emerald-100 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{summary.dueStatus || "পরিশোধিত"}</span>
                </div>
                <div className="text-[10px] text-emerald-300">কোনো বকেয়া নেই</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab("academic")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "academic"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>একাডেমিক তথ্য</span>
          </button>

          <button
            onClick={() => setActiveTab("parents")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "parents"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>পিতামাতা ও অভিভাবক</span>
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "address"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>ঠিকানা ও যোগাযোগ</span>
          </button>

          <button
            onClick={() => setActiveTab("tarbiyah")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tarbiyah"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>জীবনযাপন ও তারবিয়াত</span>
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "performance"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>অগ্রগতি ও সামারি</span>
          </button>
        </div>

        {/* 4. Tab Contents */}
        {loading ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
              প্রোফাইল তথ্য লোড করা হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TAB 1: ACADEMIC CREDENTIALS */}
            {activeTab === "academic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Current Enrolled Program */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      বর্তমান একাডেমিক অবস্থান
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">শ্রেণি:</span>
                      <div className="font-black text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.className}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">শাখা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.section}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">রোল নম্বর:</span>
                      <div className="font-black text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.roll}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">শিক্ষার্থী আইডি:</span>
                      <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                        {student.studentId}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">শিক্ষাবর্ষ:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.sessionYear}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">শিফট:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.shift}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Division & Mentorship */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      শাখা ও শিক্ষক মেন্টরশিপ
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">হিফজ শাখা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {typeof student.divisionHifz === "object"
                          ? student.divisionHifz?.class
                            ? `${student.divisionHifz.type || "হিফজ"} (${student.divisionHifz.class})`
                            : student.divisionHifz?.type || "হিফজুল কুরআন বিভাগ"
                          : student.divisionHifz || "হিফজুল কুরআন বিভাগ"}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">জেনারেল শাখা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {typeof student.divisionAcademy === "object"
                          ? student.divisionAcademy?.class
                            ? `${student.divisionAcademy.type || "জেনারেল"} (${student.divisionAcademy.class})`
                            : student.divisionAcademy?.type || "সাধারণ দ্বীনি শিক্ষা"
                          : student.divisionAcademy || "সাধারণ দ্বীনি শিক্ষা"}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">দায়িত্বপ্রাপ্ত উস্তাদ:</span>
                      <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                        {student.teacherName}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">পরীক্ষা হল ও আসন:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        হল {student.hallNo} (আসন নং {student.seatNo})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal & Vital Metrics */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <User className="w-5 h-5 text-teal-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      ব্যক্তিগত ও জন্ম সংক্রান্ত তথ্য
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">জন্ম তারিখ:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.dateOfBirth}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">বয়স:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.age}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">রক্তের গ্রুপ:</span>
                      <div className="font-black text-red-600 text-sm mt-0.5">
                        {student.bloodGroup}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">জাতীয়তা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.nationality}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 dark:text-neutral-400">জন্ম নিবন্ধন নম্বর:</span>
                      <div className="font-mono font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.birthCertificateNo}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">উচ্চতা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.height}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">ওজন:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.weight}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Education */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      পূর্ববর্তী শিক্ষাপ্রতিষ্ঠানের বিবরণ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">মাদরাসা / স্কুলের নাম:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.previousInstitutionName || "নূরানী তালিমুল কুরআন মাদরাসা"}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">ঠিকানা:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.previousInstitutionAddress || "শায়েস্তাগঞ্জ, হবিগঞ্জ"}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">অধ্যয়নকৃত শ্রেণি:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {student.previousClass || "চতুর্থ শ্রেণি"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PARENTS & GUARDIANS */}
            {activeTab === "parents" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Father's Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-neutral-900 dark:text-white text-base">
                          পিতার তথ্য
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-600">
                          {father.status || "জীবিত"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">পূর্ণ নাম (বাংলা):</span>
                      <div className="font-black text-neutral-900 dark:text-white text-sm mt-0.5">
                        {father.nameBangla}
                      </div>
                    </div>
                    {father.nameEnglish && (
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">নাম (ইংরেজি):</span>
                        <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                          {father.nameEnglish}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">পেশা:</span>
                        <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                          {father.profession}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">মোবাইল নম্বর:</span>
                        <a
                          href={`tel:${father.mobile}`}
                          className="font-black text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{father.mobile}</span>
                        </a>
                      </div>
                    </div>
                    {father.nid && (
                      <div className="pt-1">
                        <span className="text-neutral-500 dark:text-neutral-400">জাতীয় পরিচয়পত্র (NID):</span>
                        <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                          {father.nid}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mother's Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/70 border border-pink-300 dark:border-pink-800 text-pink-800 dark:text-pink-300 flex items-center justify-center font-black">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-neutral-900 dark:text-white text-base">
                          মাতার তথ্য
                        </h3>
                        <span className="text-[11px] font-bold text-pink-600">
                          {mother.status || "জীবিত"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">পূর্ণ নাম (বাংলা):</span>
                      <div className="font-black text-neutral-900 dark:text-white text-sm mt-0.5">
                        {mother.nameBangla}
                      </div>
                    </div>
                    {mother.nameEnglish && (
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">নাম (ইংরেজি):</span>
                        <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                          {mother.nameEnglish}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">পেশা:</span>
                        <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                          {mother.profession}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">মোবাইল নম্বর:</span>
                        <a
                          href={`tel:${mother.mobile}`}
                          className="font-black text-pink-700 dark:text-pink-400 mt-0.5 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{mother.mobile}</span>
                        </a>
                      </div>
                    </div>
                    {mother.nid && (
                      <div className="pt-1">
                        <span className="text-neutral-500 dark:text-neutral-400">জাতীয় পরিচয়পত্র (NID):</span>
                        <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                          {mother.nid}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Local Guardian / Emergency Contact */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      জরুরি অভিভাবক ও যোগাযোগের বিবরণ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">অভিভাবকের নাম:</span>
                      <div className="font-black text-neutral-900 dark:text-white text-sm mt-0.5">
                        {guardian.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">সম্পর্ক:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {guardian.relation}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">জরুরি মোবাইল:</span>
                      <a
                        href={`tel:${guardian.mobile}`}
                        className="font-black text-emerald-700 dark:text-emerald-400 text-sm mt-0.5 flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{guardian.mobile}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ADDRESS & CONTACT */}
            {activeTab === "address" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Current Residence */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      বর্তমান ঠিকানা (বাসস্থান)
                    </h3>
                  </div>

                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {formatAddress(student.currentAddress)}
                  </p>
                  <div className="pt-2 text-xs text-neutral-500">
                    জরুরি চিঠিপত্র বা প্রতিষ্ঠানের যোগাযোগের বর্তমান মাধ্যম হিসেবে এই ঠিকানা সংরক্ষিত।
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <Building className="w-5 h-5 text-teal-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      স্থায়ী ঠিকানা (গ্রামের বাড়ি)
                    </h3>
                  </div>

                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {formatAddress(student.permanentAddress)}
                  </p>
                  <div className="pt-2 text-xs text-neutral-500">
                    পাসপোর্ট ও অফিশিয়াল সার্টিফিকেটে ব্যবহৃত মূল স্থায়ী ঠিকানা।
                  </div>
                </div>

                {/* Reference Person */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <Phone className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      রেফারেন্স ব্যক্তি ও যোগাযোগের মাধ্যম
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">রেফারেন্স প্রদানকারী:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.referenceName}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">রেফারেন্স মোবাইল:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {student.referenceMobile}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ISLAMIC TARBIYAH & HEALTH */}
            {activeTab === "tarbiyah" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Spiritual Habits */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      আমল ও নামাজের অভ্যাস
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">নামাজের অভ্যাস:</span>
                      <p className="font-bold text-neutral-900 dark:text-white text-sm mt-1">
                        {tarbiyah.prayerHabit}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80">
                        <span className="text-neutral-500">ঘুমাবার সময়:</span>
                        <div className="font-black text-neutral-900 dark:text-white mt-1">
                          {tarbiyah.sleepTime}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80">
                        <span className="text-neutral-500">ঘুম থেকে ওঠার সময়:</span>
                        <div className="font-black text-neutral-900 dark:text-white mt-1">
                          {tarbiyah.wakeUpTime}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80">
                      <span className="text-neutral-500">পরিচ্ছন্নতার প্রতি যত্নবান:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {tarbiyah.cleanlinessLover}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dietary & Psychological Wellbeing */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <Activity className="w-5 h-5 text-teal-600" />
                    <h3 className="font-black text-neutral-900 dark:text-white text-base">
                      খাদ্যাভ্যাস ও মনস্তাত্ত্বিক বৈশিষ্ট্য
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">পছন্দের খাবার:</span>
                      <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                        {tarbiyah.favFoodType}
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">অপছন্দ বা অরুচি:</span>
                      <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                        {tarbiyah.foodReluctance}
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">বিশেষ শখ বা ভালো লাগার বিষয়:</span>
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                        {tarbiyah.favThing}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                      <span className="font-bold text-teal-800 dark:text-teal-300">শারীরিক ও স্বাস্থ্য অবস্থা:</span>
                      <div className="font-black text-neutral-900 dark:text-white mt-0.5">
                        {tarbiyah.physicalProblemDetails}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SNAPSHOT PERFORMANCE */}
            {activeTab === "performance" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black mx-auto">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-neutral-500 text-xs">মোট উপস্থিতির হার</h4>
                    <div className="text-3xl font-black text-emerald-600">
                      {summary.attendancePercentage}%
                    </div>
                    <div className="text-xs text-neutral-500">
                      মোট কর্মদিবস: {summary.totalAttendanceDays} দিন
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 flex items-center justify-center font-black mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-neutral-500 text-xs">হিফজুল কুরআন অগ্রগতি</h4>
                    <div className="text-2xl font-black text-neutral-900 dark:text-white">
                      প্যারা {summary.sabakStatus?.para}
                    </div>
                    <div className="text-xs text-emerald-600 font-bold">
                      মান: {summary.sabakStatus?.grade}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 flex items-center justify-center font-black mx-auto">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-neutral-500 text-xs">ফি ও একাউন্টিং ব্যালেন্স</h4>
                    <div className="text-2xl font-black text-emerald-600">
                      ৳০.০০ বকেয়া
                    </div>
                    <div className="text-xs text-neutral-500">
                      সর্বশেষ রসিদ: {summary.lastPayment?.receiptNo}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-black text-emerald-900 dark:text-emerald-100 text-sm">
                        প্রতিষ্ঠান কর্তৃক অনুমোদিত শিক্ষার্থী প্রোফাইল
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        প্রদত্ত সকল তথ্য দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ প্রশাসন রেকর্ড অনুযায়ী সংরক্ষিত।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. STUDENT ID CARD MODAL */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto border border-neutral-200 dark:border-neutral-800">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6 no-print">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-lg">ডিজিটাল স্টুডেন্ট আইডি কার্ড</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>আইডি কার্ড প্রিন্ট</span>
                </button>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable ID Card Container */}
            <div id="printable-profile-container" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* ID Card Front */}
                <div className="w-[320px] h-[480px] bg-gradient-to-b from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-2xl p-4 shadow-xl border-2 border-amber-400/80 flex flex-col justify-between relative overflow-hidden">
                  <div className="text-center space-y-0.5">
                    <div className="text-[9px] uppercase tracking-widest text-amber-300 font-bold">
                      বিসমিল্লাহির রাহমানির রাহিম
                    </div>
                    <h3 className="font-black text-sm tracking-tight leading-tight">
                      দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ
                    </h3>
                    <p className="text-[9px] text-emerald-200">মাদরাসা রোড, সদর, হাবিবগঞ্জ</p>
                    <div className="inline-block mt-1 px-3 py-0.5 bg-amber-400 text-neutral-950 text-[10px] font-black rounded-full shadow-xs">
                      শিক্ষার্থী পরিচয়পত্র
                    </div>
                  </div>

                  {/* Student Photo in ID Card */}
                  <div className="flex flex-col items-center my-auto py-2">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md bg-neutral-900 mb-2">
                      {student.studentImage ? (
                        <img
                          src={student.studentImage}
                          alt={student.nameBangla}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="font-black text-sm text-center text-white">
                      {student.nameBangla}
                    </div>
                    <div className="text-[11px] text-emerald-200 font-medium">
                      {student.nameEnglish}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-[11px] space-y-1 border border-white/10">
                    <div className="flex justify-between">
                      <span className="text-emerald-200">শিক্ষার্থী আইডি:</span>
                      <span className="font-bold text-amber-300">{student.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200">শ্রেণি ও শাখা:</span>
                      <span className="font-bold">{student.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200">রোল নম্বর:</span>
                      <span className="font-bold">{student.roll}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200">রক্তের গ্রুপ:</span>
                      <span className="font-bold text-red-400">{student.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-200">জরুরি যোগাযোগ:</span>
                      <span className="font-bold">{father.mobile || guardian.mobile}</span>
                    </div>
                  </div>

                  {/* Footer Seal */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[9px]">
                    <div className="flex items-center gap-1">
                      <QrCode className="w-5 h-5 text-amber-300" />
                      <span>মেয়াদ: ৩১/১২/{student.sessionYear || "২০২৬"}</span>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-white/60 w-16 mb-0.5"></div>
                      <span>মুহতামিম</span>
                    </div>
                  </div>
                </div>

                {/* ID Card Back */}
                <div className="w-[320px] h-[480px] bg-white text-neutral-900 rounded-2xl p-4 shadow-xl border-2 border-neutral-300 flex flex-col justify-between">
                  <div className="text-center space-y-1 border-b border-neutral-200 pb-2">
                    <h4 className="font-black text-xs text-emerald-800">
                      পরিচয়পত্রের জরুরি নির্দেশনাবলী
                    </h4>
                    <p className="text-[10px] text-neutral-500">
                      এই কার্ডটি দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ-এর সম্পত্তি।
                    </p>
                  </div>

                  <div className="text-[10px] text-neutral-700 space-y-2 py-2">
                    <p>১. প্রতিদিন মাদরাসায় আসার সময় এই পরিচয়পত্র সাথে রাখা বাধ্যতামূলক।</p>
                    <p>২. পরীক্ষা হলে প্রবেশের জন্য এই পরিচয়পত্র প্রদর্শন করতে হবে।</p>
                    <p>৩. কার্ড হারিয়ে গেলে অবিলম্বে মাদরাসা অফিসে রিপোর্ট করতে হবে।</p>
                    <p>৪. কার্ডটি পাওয়া গেলে নিচের ঠিকানায় জমা দেওয়ার অনুরোধ রইল।</p>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-[10px] space-y-1">
                    <div className="font-bold text-neutral-900">মাদরাসা ক্যাম্পাস ঠিকানা:</div>
                    <div className="text-neutral-600">মাদরাসা রোড, সদর, হবিগঞ্জ</div>
                    <div className="text-emerald-700 font-bold">ফোন: ০১৭৫০-২৩৯০০১</div>
                  </div>

                  <div className="text-center pt-2 border-t border-neutral-200">
                    <div className="font-mono text-xs tracking-widest text-neutral-400">
                      * {student.studentId} *
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL PROFILE PRINT PREVIEW MODAL */}
      {showFullPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-neutral-900 w-full max-w-4xl rounded-2xl p-6 sm:p-8 shadow-2xl relative my-auto">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-lg">অফিসিয়াল বায়োডাটা প্রিন্ট প্রিভিউ</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>এখনই প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setShowFullPrintModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-profile-container" className="space-y-6 text-xs">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-3">
                <div className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase">
                  বিসমিল্লাহির রাহমানির রাহিম
                </div>
                <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
                  দারুল উলুম আল-ইসলামিয়া হাবিবগঞ্জ
                </h2>
                <p className="text-xs text-neutral-600">
                  মাদরাসা রোড, সদর, হাবিবগঞ্জ | ফোন: ০১৭৫০-২৩৯০০১ | ওয়েবসাইট: aimhabiganj.edu.bd
                </p>
                <div className="inline-block mt-2 px-4 py-0.5 bg-emerald-800 text-white text-xs font-black rounded-md">
                  শিক্ষার্থীর পূর্ণাঙ্গ প্রাতিষ্ঠানিক তথ্যপঞ্জি (বায়োডাটা)
                </div>
              </div>

              {/* Student Overview Row with Photo */}
              <div className="flex items-start justify-between gap-6 border-b border-neutral-300 pb-4">
                <div className="space-y-1.5 flex-1">
                  <div className="text-base font-black text-neutral-900">
                    {student.nameBangla} ({student.nameEnglish})
                  </div>
                  {student.nameArabic && (
                    <div className="text-sm font-bold text-neutral-700 font-arabic">
                      {student.nameArabic}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-neutral-500">শিক্ষার্থী আইডি:</span>{" "}
                      <span className="font-bold">{student.studentId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">শ্রেণি:</span>{" "}
                      <span className="font-bold">{student.className}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">রোল:</span>{" "}
                      <span className="font-bold">{student.roll}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">জন্ম তারিখ:</span>{" "}
                      <span className="font-bold">{student.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">রক্তের গ্রুপ:</span>{" "}
                      <span className="font-bold text-red-600">{student.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">শিক্ষাবর্ষ:</span>{" "}
                      <span className="font-bold">{student.sessionYear}</span>
                    </div>
                  </div>
                </div>

                <div className="w-24 h-28 border border-neutral-400 rounded-lg overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center">
                  {student.studentImage ? (
                    <img
                      src={student.studentImage}
                      alt={student.nameBangla}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Parents Section */}
              <div className="space-y-2">
                <div className="font-black text-sm text-neutral-900 border-b border-neutral-300 pb-1">
                  ১. পিতা ও মাতার তথ্যাবলী
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-neutral-300 p-2.5 rounded-lg space-y-1">
                    <div className="font-bold text-neutral-800">পিতার বিবরণ:</div>
                    <div>নাম: <span className="font-bold">{father.nameBangla}</span></div>
                    <div>পেশা: {father.profession}</div>
                    <div>মোবাইল: {father.mobile}</div>
                    <div>NID: {father.nid || "—"}</div>
                  </div>
                  <div className="border border-neutral-300 p-2.5 rounded-lg space-y-1">
                    <div className="font-bold text-neutral-800">মাতার বিবরণ:</div>
                    <div>নাম: <span className="font-bold">{mother.nameBangla}</span></div>
                    <div>পেশা: {mother.profession}</div>
                    <div>মোবাইল: {mother.mobile}</div>
                    <div>NID: {mother.nid || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-2">
                <div className="font-black text-sm text-neutral-900 border-b border-neutral-300 pb-1">
                  ২. স্থায়ী ও বর্তমান ঠিকানা
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500">বর্তমান ঠিকানা:</span>
                    <div className="font-bold mt-0.5">{formatAddress(student.currentAddress)}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">স্থায়ী ঠিকানা:</span>
                    <div className="font-bold mt-0.5">{formatAddress(student.permanentAddress)}</div>
                  </div>
                </div>
              </div>

              {/* Islamic Habits & Tarbiyah */}
              <div className="space-y-2">
                <div className="font-black text-sm text-neutral-900 border-b border-neutral-300 pb-1">
                  ৩. জীবনযাপন, স্বাস্থ্য ও তারবিয়াত
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-neutral-500">নামাজের অভ্যাস:</span>
                    <div className="font-bold mt-0.5">{tarbiyah.prayerHabit}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">ঘুম ও জাগরণ:</span>
                    <div className="font-bold mt-0.5">{tarbiyah.sleepTime} - {tarbiyah.wakeUpTime}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">স্বাস্থ্য অবস্থা:</span>
                    <div className="font-bold mt-0.5">{tarbiyah.physicalProblemDetails}</div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-12 flex justify-between items-end text-xs font-bold text-neutral-700">
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">অভিভাবকের স্বাক্ষর</div>
                </div>
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">অফিস ইনচার্জ</div>
                </div>
                <div className="text-center">
                  <div className="w-36 border-t border-neutral-400 pt-1">মুহতামিম / প্রিন্সিপাল</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
