"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  Printer,
  Eye,
  Phone,
  Briefcase,
  Layers,
  Bell,
  Check,
  Edit3,
  Save,
  DollarSign,
  Building,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import StaffIdFront from "@/components/dashboard/staff/id-card/StaffIdFront";
import StaffIdBack from "@/components/dashboard/staff/id-card/StaffIdBack";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const DEPARTMENTS = [
  "সাধারণ প্রশাসন ও অফিস",
  "হিসাব ও অর্থ শাখা",
  "লাইব্রেরি ও বুক ব্যাংক",
  "নিরাপত্তা ও শৃঙ্খলা",
  "খাদ্য ও ডাইনিং",
  "হোস্টেল ও পরিচ্ছন্নতা",
  "চিকিৎসা ও সেবা",
  "অন্যান্য",
];

const DESIGNATIONS = [
  "অফিস সহকারী (Office Assistant)",
  "প্রধান অফিস সহকারী (Head Assistant)",
  "হিসাব কর্মকর্তা (Accountant)",
  "সহকারী হিসাবরক্ষক (Asst. Accountant)",
  "গ্রন্থাগারিক (Librarian)",
  "সহকারী গ্রন্থাগারিক (Asst. Librarian)",
  "নিরাপত্তা প্রহরী (Security Guard)",
  "প্রধান বাবুর্চি (Head Chef)",
  "বাবুর্চি ও ডাইনিং সহকারী (Chef & Dining Assistant)",
  "ড্রাইভার (Madrasah Driver)",
  "পরিচ্ছন্নতাকর্মী (Cleaner / Janitor)",
  "দারোয়ান / কেয়ারটেকার (Caretaker)",
  "অন্যান্য কর্মী (Other Staff)",
];

const BLOOD_GROUPS = ["A (+)", "A (-)", "B (+)", "B (-)", "O (+)", "O (-)", "AB (+)", "AB (-)"];

export default function StaffDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const sessionUser = session?.user;

  // Active View Tab
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "profile"

  // Dashboard & Attendance States
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [shiftPhase, setShiftPhase] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [idCardSide, setIdCardSide] = useState("front"); // "front" | "back"

  // Form State for Profile Editor
  const [formData, setFormData] = useState({
    fullName: "",
    nameEnglish: "",
    staffId: "",
    designation: "অফিস সহকারী (Office Assistant)",
    department: "সাধারণ প্রশাসন ও অফিস",
    phone: "",
    email: "",
    dateOfBirth: "",
    bloodGroup: "O (+)",
    nid: "",
    emergencyContact: "",
    joiningDate: "",
    employmentType: "ফুল-টাইম (Full-time)",
    workShift: "২ টার্ম (সকাল-রাত)",
    salaryDetails: {
      basicSalary: "",
      houseRent: "",
      medicalAllowance: "",
      otherAllowance: "",
      totalSalary: "",
    },
    address: "",
    addressDetails: {
      village: "",
      postOffice: "",
      thana: "",
      district: "",
    },
    bankAccount: {
      bankName: "",
      accountNumber: "",
      branchName: "",
      routingNumber: "",
      accountType: "সঞ্চয়ী (Savings)",
      mobileBanking: "",
      mobileBankingNumber: "",
    },
    profileImage: "",
    bio: "",
  });

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );

      setCurrentDateStr(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(now)
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch staff dashboard & profile data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const email = sessionUser?.email || "";
      const query = email ? `?email=${encodeURIComponent(email)}` : "";

      const [resProfile, resToday] = await Promise.all([
        fetch(`${API_BASE}/api/staff/me${query}`, {
          headers: email ? { "x-user-email": email } : {},
        }),
        fetch(`${API_BASE}/api/staff/attendance/today${query}`, {
          headers: email ? { "x-user-email": email } : {},
        }),
      ]);

      const [dataProfile, dataToday] = await Promise.all([
        resProfile.json(),
        resToday.json(),
      ]);

      if (dataProfile.success && dataProfile.profile) {
        const p = dataProfile.profile;
        setProfileData(p);
        setStats(dataProfile.stats || null);

        // Populate Form
        setFormData({
          fullName: p.fullName || sessionUser?.name || "",
          nameEnglish: p.nameEnglish || "",
          staffId: p.staffId || "",
          designation: p.designation || "অফিস সহকারী (Office Assistant)",
          department: p.department || "সাধারণ প্রশাসন ও অফিস",
          phone: p.phone || "",
          email: p.email || sessionUser?.email || "",
          dateOfBirth: p.dateOfBirth || "",
          bloodGroup: p.bloodGroup || "O (+)",
          nid: p.nid || "",
          emergencyContact: p.emergencyContact || "",
          joiningDate: p.joiningDate || "",
          employmentType: p.employmentType || "ফুল-টাইম (Full-time)",
          workShift: p.workShift || "২ টার্ম (সকাল-রাত)",
          salaryDetails: {
            basicSalary: p.salaryDetails?.basicSalary || "",
            houseRent: p.salaryDetails?.houseRent || "",
            medicalAllowance: p.salaryDetails?.medicalAllowance || "",
            otherAllowance: p.salaryDetails?.otherAllowance || "",
            totalSalary: p.salaryDetails?.totalSalary || "",
          },
          address: p.address || "",
          addressDetails: {
            village: p.addressDetails?.village || "",
            postOffice: p.addressDetails?.postOffice || "",
            thana: p.addressDetails?.thana || "",
            district: p.addressDetails?.district || "",
          },
          bankAccount: {
            bankName: p.bankAccount?.bankName || "",
            accountNumber: p.bankAccount?.accountNumber || "",
            branchName: p.bankAccount?.branchName || "",
            routingNumber: p.bankAccount?.routingNumber || "",
            accountType: p.bankAccount?.accountType || "সঞ্চয়ী (Savings)",
            mobileBanking: p.bankAccount?.mobileBanking || "",
            mobileBankingNumber: p.bankAccount?.mobileBankingNumber || "",
          },
          profileImage: p.profileImage || "",
          bio: p.bio || "",
        });
      } else {
        // Fallback with session user values only, zero dummy data
        setFormData((prev) => ({
          ...prev,
          fullName: sessionUser?.name || "",
          email: sessionUser?.email || "",
        }));
      }

      if (dataToday.success) {
        setTodayAttendance(dataToday.attendance || null);
        setShiftPhase(dataToday.shiftPhase || null);
      }
    } catch (err) {
      console.error("Staff dashboard fetch error:", err);
      toast.error("ড্যাশবোর্ড ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!sessionLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [sessionLoading, fetchData]);

  // Handle Form Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => {
      const updatedNested = { ...prev[parent], [field]: value };
      let updatedAddress = prev.address;

      if (parent === "addressDetails") {
        const parts = [
          updatedNested.village,
          updatedNested.postOffice ? `ডাকঘর: ${updatedNested.postOffice}` : "",
          updatedNested.thana,
          updatedNested.district,
        ]
          .map((s) => (s || "").trim())
          .filter(Boolean);
        if (parts.length > 0) updatedAddress = parts.join(", ");
      }

      return {
        ...prev,
        [parent]: updatedNested,
        ...(parent === "addressDetails" ? { address: updatedAddress } : {}),
      };
    });
  };

  // Profile Save Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("পূর্ণ নাম প্রদান করা আবশ্যক!");
      return;
    }

    try {
      setIsSaving(true);
      const email = sessionUser?.email || formData.email;
      const res = await fetch(`${API_BASE}/api/staff/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": email || "",
        },
        body: JSON.stringify({
          ...formData,
          email,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "সংরক্ষণ ব্যর্থ হয়েছে!");
      }

      toast.success(result.message || "স্টাফ প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      await fetchData();
      setActiveTab("overview");
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error(err.message || "প্রোফাইল সংরক্ষণে সমস্যা হয়েছে!");
    } finally {
      setIsSaving(false);
    }
  };

  const hasCheckedIn = Boolean(todayAttendance?.checkInTime);
  const checkInStatus = todayAttendance?.checkInStatus || null;
  const hasCheckedOut = Boolean(todayAttendance?.checkOutTime);
  const checkOutStatus = todayAttendance?.checkOutStatus || null;

  const formatDhakaTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return "--:--";
    }
  };

  // Resolved dynamic profile object
  const profile = profileData || {
    fullName: sessionUser?.name || "সম্মানিত স্টাফ",
    designation: "স্টাফ কর্মকর্তা",
    staffId: "স্টাফ আইডি অপেক্ষমাণ",
    email: sessionUser?.email || "",
    phone: "তথ্য যোগ করুন",
    bloodGroup: "N/A",
    dateOfBirth: "N/A",
    joiningDate: "N/A",
    address: "ঠিকানা যোগ করুন",
    profileImage: "",
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans pb-16">
      {/* ================= 1. HERO BANNER ================= */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>আস-সালাম আইডিয়াল মাদরাসা • স্টাফ পোর্টাল</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                আসসালামু আলাইকুম, {profile.fullName}!
              </h1>
              <p className="text-emerald-200/90 text-sm sm:text-base mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-semibold text-amber-300">
                  {profile.designation}
                </span>
                <span>•</span>
                <span className="font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-700/50 text-xs">
                  {profile.staffId || "আইডি লোড হচ্ছে"}
                </span>
                <span>•</span>
                <span className="text-xs sm:text-sm">{currentDateStr}</span>
              </p>
            </div>
          </div>

          {/* Right Clock & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                রিয়েল-টাইম সময় (ঢাকা)
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wide">
                {currentTimeStr || "--:--:--"}
              </span>
            </div>

            <div className="flex sm:flex-col gap-2">
              <Link
                href="/dashboard/staff/attendance"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>হাজিরা দিন</span>
              </Link>
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span>আপডেট</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TAB NAVIGATION SWITCHER ================= */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "overview"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-600"
              : "text-slate-600 dark:text-slate-400 hover:text-teal-700"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>ড্যাশবোর্ড ও ডিজিটাল আইডি</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "profile"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-600"
              : "text-slate-600 dark:text-slate-400 hover:text-teal-700"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>স্টাফ প্রোফাইল ও তথ্য ফরম</span>
        </button>
      </div>

      {/* ================= 3. TAB 1: OVERVIEW & ID CARD ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Profile Completeness Alert if missing data */}
          {(!profileData || !profileData.phone || !profileData.staffId) && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xl">
                  ⚠️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    আপনার স্টাফ প্রোফাইল তথ্য এখনো অসম্পূর্ণ!
                  </h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    আইডি কার্ড এবং প্রাতিষ্ঠানিক রেকর্ডের জন্য অনুগ্রহ করে আপনার ব্যক্তিগত, পেশাগত ও ব্যাংক হিসাব তথ্য আপডেট করুন।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>প্রোফাইল পূরণ করুন</span>
              </button>
            </div>
          )}

          {/* TWO-TERM ATTENDANCE ALERT / SCHEDULE STRIP */}
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-emerald-600/30 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950 dark:text-emerald-300">
                    দৈনিক ২ টার্ম হাজিরা নিয়মাবলী
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">
                      ১ম টার্ম (সকালের চেক-ইন):
                    </span>{" "}
                    সর্বশেষ সময় <strong className="text-amber-700 dark:text-amber-400">ভোর ৫:৩০ টা</strong>{" "}
                    (এরপর লেট) •{" "}
                    <span className="font-bold text-teal-800 dark:text-teal-400">
                      ২য় টার্ম (রাতের চেক-আউট):
                    </span>{" "}
                    নির্ধারিত সময় <strong className="text-amber-700 dark:text-amber-400">রাত ১০:০০ টা থেকে ১০:১০ টা</strong>।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href="/dashboard/staff/attendance"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <span>হাজিরা পেজ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 KEY METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Metric 1: Term 1 Status */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ১ম টার্ম (সকালের চেক-ইন)
                </span>
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                    hasCheckedIn
                      ? checkInStatus === "On Time"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {hasCheckedIn ? "✓" : "⏰"}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {hasCheckedIn ? formatDhakaTime(todayAttendance.checkInTime) : "বাকি আছে"}
                </h4>
                <p className="text-xs mt-1 flex items-center gap-1">
                  {hasCheckedIn ? (
                    checkInStatus === "On Time" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> সময়মতো (ভোর ৫:৩০ এর মধ্যে)
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> দেরিতে চেক-ইন (ভোর ৫:৩০ এর পর)
                      </span>
                    )
                  ) : (
                    <span className="text-slate-500 font-medium">
                      শেষ সময় ভোর ৫:৩০ টা
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Metric 2: Term 2 Status */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ২য় টার্ম (রাতের চেক-আউট)
                </span>
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                    hasCheckedOut
                      ? checkOutStatus === "On Time"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {hasCheckedOut ? "✓" : "🌙"}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {hasCheckedOut ? formatDhakaTime(todayAttendance.checkOutTime) : "অপেক্ষমাণ"}
                </h4>
                <p className="text-xs mt-1 flex items-center gap-1">
                  {hasCheckedOut ? (
                    checkOutStatus === "On Time" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> সময়মতো প্রস্থান (রাত ১০:০০-১০:১০)
                      </span>
                    ) : checkOutStatus === "Early" ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> সময়ের পূর্বে প্রস্থান
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> বিলম্বিত প্রস্থান / ওভারটাইম
                      </span>
                    )
                  ) : (
                    <span className="text-slate-500 font-medium">
                      উইন্ডো: রাত ১০:০০ - ১০:১০
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Metric 3: Monthly Present Days */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  চলতি মাসের উপস্থিতি
                </span>
                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center text-sm">
                  📅
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stats?.presentDays ?? 0} দিন
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  উপস্থিতির হার:{" "}
                  <strong className="text-teal-700 dark:text-teal-400">
                    {stats?.onTimeRate ?? 100}%
                  </strong>
                </p>
              </div>
            </div>

            {/* Metric 4: Total Working Hours */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  মোট কর্মঘণ্টা
                </span>
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center text-sm">
                  ⏳
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stats?.totalHoursWorked ?? 0} ঘণ্টা
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  সময়মতো উপস্থিতি:{" "}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {stats?.onTimeDays ?? 0} দিন
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* MAIN GRID: ID CARD & SERVICES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column (7 cols): Staff ID Card Widget */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" />
                    <span>আমার অফিসিয়াল স্টাফ আইডি কার্ড</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    মাদরাসার অনুমোদিত ডিজিটাল পরিচিতিপত্র (লাইভ ডেটাবেজ সিঙ্কড)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setIdCardSide("front")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        idCardSide === "front"
                          ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      সামনের দিক
                    </button>
                    <button
                      onClick={() => setIdCardSide("back")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        idCardSide === "back"
                          ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      পেছনের দিক
                    </button>
                  </div>

                  <Link
                    href="/dashboard/staff/id-card"
                    className="p-2 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-700 dark:text-teal-300 rounded-xl transition-colors"
                    title="পূর্ণাঙ্গ ভিউ ও প্রিন্ট"
                  >
                    <Printer className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Interactive Card Render Container */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 overflow-x-auto">
                <div className="transform sm:scale-105 transition-transform duration-300 drop-shadow-lg">
                  {idCardSide === "front" ? (
                    <StaffIdFront staff={profile} scale={1} />
                  ) : (
                    <StaffIdBack scale={1} />
                  )}
                </div>
              </div>

              {/* Card Details Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    স্টাফ আইডি
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate block">
                    {profile.staffId || "সংরক্ষিত নেই"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    রক্তের গ্রুপ
                  </span>
                  <span className="text-xs font-black text-rose-600 block">
                    {profile.bloodGroup || "N/A"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    যোগদানের তারিখ
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {profile.joiningDate || "অপেক্ষমাণ"}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    ফোন নম্বর
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                    {profile.phone || "অপেক্ষমাণ"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>কার্ডের তথ্য পরিবর্তন করতে প্রোফাইল এডিট করুন</span>
                </button>
                <Link
                  href="/dashboard/staff/id-card"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <span>আইডি কার্ড ডাউনলোড ও প্রিন্ট</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols): Quick Services & Daily Duty Status */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>প্রয়োজনীয় সার্ভিস ও পেজসমূহ</span>
                </h3>

                <div className="space-y-2.5">
                  <Link
                    href="/dashboard/staff/attendance"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center font-bold">
                        📅
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                          ডিজিটাল হাজিরা (২ টার্ম)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          ভোর ৫:৩০ চেক-ইন এবং রাত ১০:০০ চেক-আউট
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-all group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/dashboard/staff/id-card"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center font-bold">
                        🪪
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 transition-colors">
                          স্টাফ আইডি কার্ড জেনারেটর
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          ডিজিটাল আইডি কার্ড ভিউ ও প্রিন্ট
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-all group-hover:translate-x-0.5" />
                  </Link>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200/70 dark:border-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center font-bold">
                        📝
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 transition-colors">
                          আমার প্রোফাইল তথ্য ফরম
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          ব্যক্তিগত ও অফিসিয়াল তথ্য সম্পাদনা
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-all group-hover:translate-x-0.5" />
                  </button>

                  <Link
                    href="/dashboard/profile-settings"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold">
                        ⚙️
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-950 transition-colors">
                          নিরাপত্তা সেটিংস
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          পাসওয়ার্ড ও অ্যাকাউন্ট নিরাপত্তা
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 transition-all group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* Daily Campus Duty Card */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    ক্যাম্পাস ডিউটি গাইডলাইন
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800/80 font-bold border border-emerald-700">
                    সক্রিয় শিফট
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                      ১
                    </span>
                    <p>
                      <strong>সকালের টার্ম:</strong> ফজরের পূর্বে মাদরাসা প্রাঙ্গণে উপস্থিতি নিশ্চিত করে ভোর ৫:৩০ টার মধ্যে ১ম টার্ম হাজিরা সাবমিট করুন।
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                      ২
                    </span>
                    <p>
                      <strong>রাতের টার্ম:</strong> রাতের শিফট ও ক্যাম্পাস গেট লকিং তদারকি শেষে রাত ১০:০০ টা থেকে ১০:১০ টার মধ্যে ২য় টার্ম হাজিরা সম্পন্ন করুন।
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-0.5">
                      ৩
                    </span>
                    <p>
                      জরুরি প্রয়োজনে বা দেরির ক্ষেত্রে মন্তব্য বক্সে কারণ উল্লেখ করুন অথবা প্রশাসনিক কর্মকর্তার অনুমতি গ্রহণ করুন।
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">জরুরি অফিস হেল্পলাইন:</span>
                  <span className="font-mono font-bold text-amber-400">
                    ০১৮০৪৯০৯৫০০
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. TAB 2: FULL STAFF PROFILE FORM ================= */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl">
          {/* Section 1: Header & Identity */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <span>১. ব্যক্তিগত ও পরিচিতি তথ্য (Personal & Identity Details)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নাম, পদবি, স্টাফ আইডি, যোগাযোগ এবং পরিচয় সংক্রান্ত তথ্য
                </p>
              </div>
              <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                ধাপ ১ / ৪
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মুহাম্মদ রফিকুল ইসলাম"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পূর্ণ নাম (ইংরেজিতে / Full Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Md. Rafiqul Islam"
                  value={formData.nameEnglish}
                  onChange={(e) => handleInputChange("nameEnglish", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  স্টাফ আইডি নম্বর (Staff ID)
                </label>
                <input
                  type="text"
                  placeholder="ID NO-AIM ST-001"
                  value={formData.staffId}
                  onChange={(e) => handleInputChange("staffId", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পদবি (Designation) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  বিভাগ / শাখা (Department)
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল নম্বর (Phone)
                </label>
                <input
                  type="tel"
                  placeholder="০১৭১২-৩৪৫৬৭৮"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ইমেইল ঠিকানা (Email)
                </label>
                <input
                  type="email"
                  disabled={Boolean(sessionUser?.email)}
                  placeholder="staff@aimhabiganj.edu.bd"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  জন্ম তারিখ (Date of Birth)
                </label>
                <input
                  type="text"
                  placeholder="দিন/মাস/বছর (যেমন: 15/05/1990)"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  রক্তের গ্রুপ (Blood Group)
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold"
                >
                  <option value="">নির্বাচন করুন</option>
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং (NID)
                </label>
                <input
                  type="text"
                  placeholder="১০ বা ১৭ ডিজিটের NID নম্বর"
                  value={formData.nid}
                  onChange={(e) => handleInputChange("nid", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  জরুরি যোগাযোগ (নাম ও ফোন)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পিতা / ভাই - ০১৭১১..."
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  প্রোফাইল ছবি লিংক (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://i.ibb.co/..."
                  value={formData.profileImage}
                  onChange={(e) => handleInputChange("profileImage", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Official & Employment Details */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-600" />
                  <span>২. চাকরি, শিফট ও বেতন কাঠামো (Employment & Salary Info)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  যোগদানের তারিখ, নিয়োগের ধরন, শিফট এবং প্রাতিষ্ঠানিক বেতন বিবরণী
                </p>
              </div>
              <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                ধাপ ২ / ৪
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মাদরাসায় যোগদানের তারিখ
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 01/01/2023"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  নিয়োগের ধরন (Employment Type)
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange("employmentType", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  <option value="ফুল-টাইম (Full-time)">ফুল-টাইম (Full-time)</option>
                  <option value="পার্ট-টাইম (Part-time)">পার্ট-টাইম (Part-time)</option>
                  <option value="চুক্তিভিত্তিক (Contractual)">চুক্তিভিত্তিক (Contractual)</option>
                  <option value="শিক্ষানবিস (Probationary)">শিক্ষানবিস (Probationary)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  কাজের শিফট (Duty Shift)
                </label>
                <select
                  value={formData.workShift}
                  onChange={(e) => handleInputChange("workShift", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  <option value="২ টার্ম (সকাল-রাত)">২ টার্ম (ভোর ৫:৩০ ও রাত ১০:০০)</option>
                  <option value="দিন শিফট (সকাল ৮টা - বিকাল ৪টা)">দিন শিফট (সকাল ৮টা - বিকাল ৪টা)</option>
                  <option value="নাইট শিফট (রাত ১০টা - সকাল ৬টা)">নাইট শিফট (রাত ১০টা - সকাল ৬টা)</option>
                  <option value="আবাসিক সার্বক্ষণিক (Residential 24/7)">আবাসিক সার্বক্ষণিক (Residential 24/7)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মূল বেতন (Basic Salary)
                </label>
                <input
                  type="number"
                  placeholder="৳ যেমন: ১২০০০"
                  value={formData.salaryDetails.basicSalary}
                  onChange={(e) => handleNestedChange("salaryDetails", "basicSalary", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  বাড়িভাড়া ও চিকিৎসা ভাতা
                </label>
                <input
                  type="number"
                  placeholder="৳ যেমন: ৩০০০"
                  value={formData.salaryDetails.houseRent}
                  onChange={(e) => handleNestedChange("salaryDetails", "houseRent", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  সর্বমোট বেতন (Total Monthly Package)
                </label>
                <input
                  type="number"
                  placeholder="৳ মোট বেতন"
                  value={formData.salaryDetails.totalSalary}
                  onChange={(e) => handleNestedChange("salaryDetails", "totalSalary", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono font-bold text-teal-700 dark:text-teal-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Address Details */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>৩. স্থায়ী ও বর্তমান ঠিকানা (Address Details)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  গ্রাম, ডাকঘর, থানা এবং জেলা সংক্রান্ত বিবরণ
                </p>
              </div>
              <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                ধাপ ৩ / ৪
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  গ্রাম / পাড়া / সড়ক
                </label>
                <input
                  type="text"
                  placeholder="যেমন: দক্ষিণ শ্যামলী"
                  value={formData.addressDetails.village}
                  onChange={(e) => handleNestedChange("addressDetails", "village", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ডাকঘর
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হবিগঞ্জ সদর - ৩৩০০"
                  value={formData.addressDetails.postOffice}
                  onChange={(e) => handleNestedChange("addressDetails", "postOffice", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  থানা / উপজেলা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হবিগঞ্জ সদর"
                  value={formData.addressDetails.thana}
                  onChange={(e) => handleNestedChange("addressDetails", "thana", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  জেলা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হবিগঞ্জ"
                  value={formData.addressDetails.district}
                  onChange={(e) => handleNestedChange("addressDetails", "district", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                সম্পূর্ণ ঠিকানা (এক লাইনে / Full Address)
              </label>
              <input
                type="text"
                placeholder="হবিগঞ্জ সদর, হবিগঞ্জ"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
              />
            </div>
          </div>

          {/* Section 4: Bank & Payment Details */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <span>৪. ব্যাংক ও মোবাইল ব্যাংকিং হিসাব (Payment & Banking Info)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  মাসিক বেতন ও ভাতা প্রাপ্তির জন্য নির্ধারিত ব্যাংক বা মোবাইল অ্যাকাউন্ট
                </p>
              </div>
              <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                ধাপ ৪ / ৪
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ব্যাংকের নাম (Bank Name)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ লি."
                  value={formData.bankAccount.bankName}
                  onChange={(e) => handleNestedChange("bankAccount", "bankName", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  হিসাব নম্বর (Account Number)
                </label>
                <input
                  type="text"
                  placeholder="২০৫০xxxxxxxxxxxxx"
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) => handleNestedChange("bankAccount", "accountNumber", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  শাখা ও রাউটিং নম্বর
                </label>
                <input
                  type="text"
                  placeholder="হবিগঞ্জ শাখা (রাউটিং: ১২৫...)"
                  value={formData.bankAccount.branchName}
                  onChange={(e) => handleNestedChange("bankAccount", "branchName", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল ব্যাংকিং সেবা (MFS)
                </label>
                <select
                  value={formData.bankAccount.mobileBanking}
                  onChange={(e) => handleNestedChange("bankAccount", "mobileBanking", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  <option value="">প্রযোজ্য নয়</option>
                  <option value="বিকাশ (bKash)">বিকাশ (bKash)</option>
                  <option value="নগদ (Nagad)">নগদ (Nagad)</option>
                  <option value="রকেট (Rocket)">রকেট (Rocket)</option>
                  <option value="উপায় (Upay)">উপায় (Upay)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল ব্যাংকিং নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="০১৭১২-৩৪৫৬৭৮"
                  value={formData.bankAccount.mobileBankingNumber}
                  onChange={(e) => handleNestedChange("bankAccount", "mobileBankingNumber", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  হিসাবের ধরন (Account Type)
                </label>
                <select
                  value={formData.bankAccount.accountType}
                  onChange={(e) => handleNestedChange("bankAccount", "accountType", e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                >
                  <option value="সঞ্চয়ী (Savings)">সঞ্চয়ী (Savings)</option>
                  <option value="চলতি (Current)">চলতি (Current)</option>
                  <option value="বেতন হিসাব (Salary)">বেতন হিসাব (Salary)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                সংক্ষিপ্ত মন্তব্য বা অতিরিক্ত তথ্য (Notes / Bio)
              </label>
              <textarea
                rows={2}
                placeholder="প্রয়োজনীয় কোনো বিশেষ দক্ষতা, শারীরিক সুস্থতা বা প্রশাসনিক মন্তব্য..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full p-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              বাতিল / ড্যাশবোর্ডে ফিরুন
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>প্রোফাইল তথ্য সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
