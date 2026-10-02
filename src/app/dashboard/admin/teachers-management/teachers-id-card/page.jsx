"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  CreditCard,
  UserCheck,
  Search,
  RefreshCw,
  Printer,
  Download,
  Eye,
  Edit3,
  Check,
  X,
  Layers,
  Sparkles,
  Users,
  Shield,
  Save,
  CheckSquare,
  Square,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import TeacherIdFront from "@/components/dashboard/teachers/id-card/TeacherIdFront";
import TeacherIdBack from "@/components/dashboard/teachers/id-card/TeacherIdBack";
import TeacherIdPdfDocument from "@/components/dashboard/teachers/id-card/TeacherIdPdfDocument";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-slate-500">
        পিডিএফ ভিউয়ার লোড হচ্ছে...
      </div>
    ),
  },
);

export default function teacherIdCardManagePage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Print & Preview Options
  const [printSide, setPrintSide] = useState("both"); // "both", "front", "back"
  const [activePreviewTeacher, setActivePreviewTeacher] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Edit Teacher Modal
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    designation: "",
    dateOfBirth: "",
    phone: "",
    bloodGroup: "",
    teacherId: "",
    profileImage: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch Teachers Data from API
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/admin/teachers?${params.toString()}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "শিক্ষকদের তালিকা লোড করতে সমস্যা হয়েছে।",
        );
      }

      const list = result.data || [];
      setTeachers(list);

      // Default select all if no selection yet
      setSelectedIds((prev) => {
        if (prev.length === 0 && list.length > 0) {
          return list.map((t) => t._id);
        }
        return prev;
      });

      setActivePreviewTeacher(
        (prev) => prev || (list.length > 0 ? list[0] : null),
      );
    } catch (err) {
      console.error("Fetch teachers error:", err);
      setError(err.message || "সার্ভারে সংযোগ করা যাচ্ছে না।");
      toast.error("শিক্ষকদের তথ্য আনতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTeachers]);

  // Selected teachers list for printing
  const selectedTeachers = useMemo(() => {
    return teachers.filter((t) => selectedIds.includes(t._id));
  }, [teachers, selectedIds]);

  // Toggle Single Selection
  const toggleSelectTeacher = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Select / Deselect All
  const toggleSelectAll = () => {
    if (selectedIds.length === teachers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(teachers.map((t) => t._id));
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditFormData({
      fullName: teacher.fullName || "",
      designation: teacher.designation || "",
      dateOfBirth: teacher.dateOfBirth || "",
      phone: teacher.phone || "",
      bloodGroup: teacher.bloodGroup || "",
      teacherId: teacher.teacherId || "",
      profileImage: teacher.profileImage || "",
    });
  };

  // Save Teacher ID Card Details to MongoDB
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      setSavingEdit(true);
      const res = await fetch("/api/admin/teachers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTeacher._id,
          ...editFormData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "তথ্য সংরক্ষণ ব্যর্থ হয়েছে।");
      }

      toast.success("শিক্ষকের আইডি কার্ডের তথ্য সফলভাবে আপডেট হয়েছে!");
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error("Save edit error:", err);
      toast.error(err.message || "সংরক্ষণ করতে সমস্যা হয়েছে!");
    } finally {
      setSavingEdit(false);
    }
  };

  // Instant Browser Print
  const handleBrowserPrint = () => {
    if (selectedTeachers.length === 0) {
      toast.warn("অনুগ্রহ করে অন্তত একজন শিক্ষক নির্বাচন করুন!");
      return;
    }
    window.print();
  };

  // Download Vector PDF with @react-pdf/renderer
  const handleDownloadPdf = async (mode = "a4") => {
    if (selectedTeachers.length === 0) {
      toast.warn("অনুগ্রহ করে অন্তত একজন শিক্ষক নির্বাচন করুন!");
      return;
    }

    try {
      setGeneratingPdf(true);
      toast.info("পিডিএফ তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...");

      const { pdf } = await import("@react-pdf/renderer");
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const blob = await pdf(
        <TeacherIdPdfDocument
          teachers={selectedTeachers}
          mode={mode}
          printSide={printSide}
          origin={origin}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `teachers-id-cards-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("পিডিএফ সফলভাবে ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("Download PDF Error:", err);
      toast.error("পিডিএফ জেনারেট করতে সমস্যা হয়েছে!");
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ================= 1. TOP NAVIGATION TABS ================= */}
      <div className="print:hidden flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700/60">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-600">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>শিক্ষক আইডি কার্ড তৈরি (ID Card Generator)</span>
        </span>
        <Link
          href="/dashboard/admin/teachers-management/attendance"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>শিক্ষক হাজিরা (Attendance)</span>
        </Link>
      </div>

      {/* ================= 2. PAGE HEADER ================= */}
      <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            শিক্ষক ব্যবস্থাপনা ও পরিচয়পত্র পোর্টাল
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            শিক্ষক আইডি কার্ড জেনারেটর ও প্রিন্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            মাদরাসার সকল শিক্ষকের প্রফেশনাল ল্যান্ডস্কেপ আইডি কার্ড তৈরি,
            প্রিভিউ, এডিট এবং প্রিন্ট করুন।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Browser Print */}
          <button
            onClick={handleBrowserPrint}
            disabled={selectedTeachers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            title="সরাসরি প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
            <span>সরাসরি প্রিন্ট ({selectedTeachers.length})</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={() => handleDownloadPdf("a4")}
            disabled={generatingPdf || selectedTeachers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="A4 শিট ফরম্যাটে PDF ডাউনলোড করুন"
          >
            <Download
              className={`w-4 h-4 ${generatingPdf ? "animate-bounce" : ""}`}
            />
            <span>PDF ডাউনলোড</span>
          </button>

          {/* PDF Live Preview Modal */}
          <button
            onClick={() => setShowPdfModal(true)}
            disabled={selectedTeachers.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs sm:text-sm font-bold transition-all disabled:opacity-50"
            title="পিডিএফ ভিউয়ারে প্রিভিউ দেখুন"
          >
            <Eye className="w-4 h-4" />
            <span>পিডিএফ প্রিভিউ</span>
          </button>

          {/* Refresh */}
          <button
            onClick={fetchTeachers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ================= 3. LIVE CARD PREVIEW SECTION ================= */}
      {activePreviewTeacher && (
        <div className="print:hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-750">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>লাইভ কার্ড প্রিভিউ:</span>
                  <span className="text-emerald-400">
                    {activePreviewTeacher.fullName}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  CR80 ল্যান্ডস্কেপ ফরম্যাট (৮৫.৬ মিমি × ৫৩.৯৮ মিমি / ৩.৩৭৫
                  ইঞ্চি × ২.১২৫ ইঞ্চি)
                </p>
              </div>
            </div>

            {/* Print Side Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setPrintSide("both")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printSide === "both"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                উভয় পাশ (Both)
              </button>
              <button
                onClick={() => setPrintSide("front")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printSide === "front"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                সামনের পাশ (Front)
              </button>
              <button
                onClick={() => setPrintSide("back")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printSide === "back"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                পেছনের পাশ (Back)
              </button>
            </div>
          </div>

          {/* Cards Display Grid */}
          <div className="pt-6 pb-2 flex flex-wrap items-center justify-center gap-8">
            {/* Front Card */}
            {(printSide === "both" || printSide === "front") && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  সামনের দিক (Front Side)
                </span>
                <div className="transition-transform hover:scale-105 duration-200">
                  <TeacherIdFront teacher={activePreviewTeacher} />
                </div>
              </div>
            )}

            {/* Back Card */}
            {(printSide === "both" || printSide === "back") && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  পেছনের দিক (Back Side)
                </span>
                <div className="transition-transform hover:scale-105 duration-200">
                  <TeacherIdBack />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. CONTROLS, SEARCH & BATCH SELECTION ================= */}
      <div className="print:hidden bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Selection Metrics & Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            {selectedIds.length === teachers.length && teachers.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedIds.length === teachers.length
                ? "সবগুলো বাতিল করুন"
                : "সবগুলো নির্বাচন করুন"}
            </span>
          </button>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            নির্বাচিত:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              {selectedIds.length}
            </span>{" "}
            / {teachers.length} জন
          </span>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="শিক্ষকের নাম, পদবি, ফোন বা আইডি দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ================= 5. TEACHERS TABLE ================= */}
      <div className="print:hidden bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>শিক্ষকদের তথ্য ও আইডি কার্ড তালিকা</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            মোট শিক্ষক: {teachers.length} জন
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span>ডাটাবেস থেকে শিক্ষকদের তথ্য লোড করা হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-rose-500 text-sm">
            ত্রুটি: {error}
          </div>
        ) : teachers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            কোনো শিক্ষকের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/40">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === teachers.length &&
                        teachers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 font-bold">শিক্ষক পরিচিতি</th>
                  <th className="py-3.5 px-4 font-bold">আইডি নম্বর (ID No)</th>
                  <th className="py-3.5 px-4 font-bold">পদবি (Designation)</th>
                  <th className="py-3.5 px-4 font-bold">মোবাইল (Mobile)</th>
                  <th className="py-3.5 px-4 font-bold">
                    রক্তের গ্রুপ (Blood)
                  </th>
                  <th className="py-3.5 px-4 font-bold">জন্ম তারিখ (D.O.B)</th>
                  <th className="py-3.5 px-4 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {teachers.map((teacher) => {
                  const isSelected = selectedIds.includes(teacher._id);
                  const isPreviewing =
                    activePreviewTeacher?._id === teacher._id;

                  return (
                    <tr
                      key={teacher._id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors ${
                        isPreviewing
                          ? "bg-emerald-50/40 dark:bg-emerald-950/20"
                          : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTeacher(teacher._id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Photo & Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                teacher.profileImage || "/default-avatar.png"
                              }
                              alt={teacher.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/default-avatar.png";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {teacher.fullName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {teacher.email || "ইমেইল অনুপস্থিত"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ID No */}
                      <td className="py-4 px-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {teacher.teacherId || (
                          <span className="text-amber-600">অনুপস্থিত</span>
                        )}
                      </td>

                      {/* Designation */}
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {teacher.designation || "শিক্ষক"}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {teacher.phone || (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      {/* Blood Group */}
                      <td className="py-4 px-4 text-xs font-black text-rose-600">
                        {teacher.bloodGroup || (
                          <span className="text-slate-400 font-normal">--</span>
                        )}
                      </td>

                      {/* Date of Birth */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {teacher.dateOfBirth || (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Live Preview Button */}
                          <button
                            onClick={() => setActivePreviewTeacher(teacher)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              isPreviewing
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                            }`}
                            title="কার্ড প্রিভিউ দেখুন"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => handleOpenEdit(teacher)}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-all"
                            title="আইডি কার্ডের তথ্য সম্পাদনা করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 6. EDIT TEACHER ID CARD MODAL ================= */}
      {editingTeacher && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  আইডি কার্ডের তথ্য সম্পাদনা
                </h3>
              </div>
              <button
                onClick={() => setEditingTeacher(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিক্ষকের পুরো নাম (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Designation & ID No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পদবি (Designation)
                  </label>
                  <input
                    type="text"
                    value={editFormData.designation}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        designation: e.target.value,
                      })
                    }
                    placeholder="e.g. Arabic Teacher"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আইডি নম্বর (ID No)
                  </label>
                  <input
                    type="text"
                    value={editFormData.teacherId}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        teacherId: e.target.value,
                      })
                    }
                    placeholder="e.g. ID NO-AIM 0 235"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* DOB & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    জন্ম তারিখ (Date of Birth)
                  </label>
                  <input
                    type="text"
                    value={editFormData.dateOfBirth}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    placeholder="DD/MM/YYYY (e.g. 13/12/1998)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    রক্তের গ্রুপ (Blood Group)
                  </label>
                  <select
                    value={editFormData.bloodGroup}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        bloodGroup: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="A (+)">A (+)</option>
                    <option value="A (-)">A (-)</option>
                    <option value="B (+)">B (+)</option>
                    <option value="B (-)">B (-)</option>
                    <option value="AB (+)">AB (+)</option>
                    <option value="AB (-)">AB (-)</option>
                    <option value="O (+)">O (+)</option>
                    <option value="O (-)">O (-)</option>
                  </select>
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর (Mobile)
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিক্ষকের ছবির URL (Profile Image URL)
                </label>
                <input
                  type="text"
                  value={editFormData.profileImage}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      profileImage: e.target.value,
                    })
                  }
                  placeholder="https://i.ibb.co/..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {savingEdit ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 7. PDF VIEWER MODAL ================= */}
      {showPdfModal && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  পিডিএফ লাইভ প্রিভিউ ({selectedTeachers.length} জন শিক্ষক)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf("a4")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড PDF</span>
                </button>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 w-full h-full bg-slate-100 dark:bg-slate-950">
              <PDFViewer width="100%" height="100%" showToolbar={true}>
                <TeacherIdPdfDocument
                  teachers={selectedTeachers}
                  mode="a4"
                  printSide={printSide}
                  origin={
                    typeof window !== "undefined" ? window.location.origin : ""
                  }
                />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. PRINT ONLY VIEW CONTAINER (@media print) ================= */}
      {/* This container only renders during browser window.print() */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0">
        <style jsx global>{`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              background: #ffffff !important;
              color: #000000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .teacher-id-print-grid {
              display: flex !important;
              flex-direction: row !important;
              flex-wrap: wrap !important;
              gap: 16px !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .teacher-id-print-pair {
              display: flex !important;
              flex-direction: row !important;
              gap: 12px !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 16px !important;
            }
          }
        `}</style>

        <div className="teacher-id-print-grid">
          {selectedTeachers.map((teacher) => (
            <div key={teacher._id} className="teacher-id-print-pair">
              {(printSide === "both" || printSide === "front") && (
                <TeacherIdFront teacher={teacher} />
              )}
              {(printSide === "both" || printSide === "back") && (
                <TeacherIdBack />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
