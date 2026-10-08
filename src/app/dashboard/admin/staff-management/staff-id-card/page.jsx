"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
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
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import StaffIdFront from "@/components/dashboard/staff/id-card/StaffIdFront";
import StaffIdBack from "@/components/dashboard/staff/id-card/StaffIdBack";

export default function StaffIdCardManagePage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Print & Preview Options
  const [printSide, setPrintSide] = useState("both"); // "both", "front", "back"
  const [activePreviewStaff, setActivePreviewStaff] = useState(null);

  // Add / Edit Modal states
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    bloodGroup: "",
    staffId: "",
    profileImage: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Staff Data from API
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/admin/staff?${params.toString()}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "স্টাফদের তালিকা লোড করতে সমস্যা হয়েছে।");
      }

      const list = result.data || [];
      setStaffList(list);

      setSelectedIds((prev) => {
        if (prev.length === 0 && list.length > 0) {
          return list.map((s) => s._id);
        }
        return prev;
      });

      setActivePreviewStaff((prev) => prev || (list.length > 0 ? list[0] : null));
    } catch (err) {
      console.error("Fetch staff error:", err);
      setError(err.message || "সার্ভারে সংযোগ করা যাচ্ছে না।");
      toast.error("স্টাফদের তথ্য আনতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStaff();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStaff]);

  // Selected staff list for printing
  const selectedStaffList = useMemo(() => {
    return staffList.filter((s) => selectedIds.includes(s._id));
  }, [staffList, selectedIds]);

  // Toggle Single Selection
  const toggleSelectStaff = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select / Deselect All
  const toggleSelectAll = () => {
    if (selectedIds.length === staffList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(staffList.map((s) => s._id));
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingStaff(null);
    setFormData({
      fullName: "",
      designation: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      bloodGroup: "O (+)",
      staffId: `ID NO-AIM ST-${String(staffList.length + 1).padStart(3, "0")}`,
      profileImage: "",
      address: "",
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (staff) => {
    setModalMode("edit");
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName || "",
      designation: staff.designation || "",
      dateOfBirth: staff.dateOfBirth || "",
      phone: staff.phone || "",
      email: staff.email || "",
      bloodGroup: staff.bloodGroup || "",
      staffId: staff.staffId || "",
      profileImage: staff.profileImage || "",
      address: staff.address || "",
    });
  };

  // Save Add or Edit
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.designation.trim()) {
      toast.error("নাম ও পদবি আবশ্যক!");
      return;
    }

    try {
      setIsSaving(true);
      if (modalMode === "add") {
        const res = await fetch("/api/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        toast.success("নতুন স্টাফ সফলভাবে যুক্ত হয়েছে!");
      } else {
        const res = await fetch("/api/admin/staff", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingStaff._id, ...formData }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message);
        toast.success("স্টাফের তথ্য সফলভাবে আপডেট হয়েছে!");
      }

      setModalMode(null);
      fetchStaff();
    } catch (err) {
      toast.error(err.message || "সংরক্ষণে সমস্যা হয়েছে!");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই স্টাফের তথ্য মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);
      toast.success("স্টাফ সফলভাবে ডিলিট করা হয়েছে!");
      fetchStaff();
    } catch (err) {
      toast.error(err.message || "ডিলিট করতে সমস্যা হয়েছে!");
    }
  };

  // Print Action
  const handlePrint = () => {
    if (selectedStaffList.length === 0) {
      toast.warning("প্রিন্ট করার জন্য অন্তত একজন স্টাফ নির্বাচন করুন!");
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-700/60 print:hidden">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-600">
          <CreditCard className="w-4 h-4 text-teal-600" />
          <span>স্টাফ আইডি কার্ড তৈরি (ID Card)</span>
        </span>
        <Link
          href="/dashboard/admin/staff-management/attendance"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>স্টাফ হাজিরা (Attendance)</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            প্রশাসনিক স্টাফ ব্যবস্থাপনা
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            স্টাফ আইডি কার্ড জেনারেটর
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            কর্মচারীদের প্রফেশনাল ডিজিটাল আইডি কার্ড প্রিন্ট ও কাস্টমাইজ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন স্টাফ যুক্ত করুন</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={selectedStaffList.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন ({selectedStaffList.length})</span>
          </button>

          <button
            onClick={fetchStaff}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Control Table + Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        {/* Table & Controls (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="স্টাফের নাম, পদবি বা আইডি দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              >
                {selectedIds.length === staffList.length ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>সব বাতিল</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>সব নির্বাচন ({staffList.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Staff List Table */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                <span>স্টাফদের তালিকা লোড হচ্ছে...</span>
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                কোনো স্টাফের তথ্য পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-700/40">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            staffList.length > 0 &&
                            selectedIds.length === staffList.length
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4 font-bold">স্টাফ পরিচিতি</th>
                      <th className="py-3 px-4 font-bold">পদবি</th>
                      <th className="py-3 px-4 font-bold">স্টাফ আইডি</th>
                      <th className="py-3 px-4 font-bold">মোবাইল</th>
                      <th className="py-3 px-4 font-bold text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                    {staffList.map((staff) => {
                      const isSelected = selectedIds.includes(staff._id);
                      const isPreviewActive =
                        activePreviewStaff?._id === staff._id;

                      return (
                        <tr
                          key={staff._id}
                          className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors ${
                            isPreviewActive
                              ? "bg-teal-50/50 dark:bg-teal-950/20"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectStaff(staff._id)}
                              className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                                {staff.profileImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={staff.profileImage}
                                    alt={staff.fullName}
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  staff.fullName.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                                  {staff.fullName}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                  {staff.bloodGroup || "রক্তের গ্রুপ নেই"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold text-teal-800 dark:text-teal-400">
                            {staff.designation}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                            {staff.staffId}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                            {staff.phone || "--"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setActivePreviewStaff(staff)}
                                className={`p-1.5 rounded-lg transition ${
                                  isPreviewActive
                                    ? "bg-teal-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                                title="প্রিভিউ দেখুন"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(staff)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="এডিট করুন"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(staff._id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
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
        </div>

        {/* Live Preview Panel (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                লাইভ কার্ড প্রিভিউ
              </h3>
              {/* Print Side Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-[11px] font-bold">
                {[
                  { key: "both", label: "উভয়" },
                  { key: "front", label: "সামনে" },
                  { key: "back", label: "পেছনে" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setPrintSide(s.key)}
                    className={`px-2 py-1 rounded-lg transition ${
                      printSide === s.key
                        ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {activePreviewStaff ? (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4 overflow-hidden">
                {(printSide === "both" || printSide === "front") && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 text-center mb-1 uppercase tracking-wider">
                      Front Side
                    </p>
                    <StaffIdFront staff={activePreviewStaff} scale={1} />
                  </div>
                )}

                {(printSide === "both" || printSide === "back") && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 text-center mb-1 uppercase tracking-wider">
                      Back Side
                    </p>
                    <StaffIdBack scale={1} />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                প্রিভিউ দেখার জন্য কোনো স্টাফ নির্বাচন করুন।
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {modalMode === "add" ? "নতুন স্টাফ যুক্ত করুন" : "স্টাফের তথ্য সংশোধন"}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পদবি (Designation) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="যেমন: অফিস সহকারী / বাবুর্চি"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    স্টাফ আইডি
                  </label>
                  <input
                    type="text"
                    value={formData.staffId}
                    onChange={(e) =>
                      setFormData({ ...formData, staffId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ID NO-AIM ST-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="01712345678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="A (+)">A (+)</option>
                    <option value="A (-)">A (-)</option>
                    <option value="B (+)">B (+)</option>
                    <option value="B (-)">B (-)</option>
                    <option value="O (+)">O (+)</option>
                    <option value="O (-)">O (-)</option>
                    <option value="AB (+)">AB (+)</option>
                    <option value="AB (-)">AB (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    জন্ম তারিখ
                  </label>
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="staff@aimhabiganj.edu.bd"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE BATCH CONTAINER (VISIBLE ONLY IN PRINT) */}
      <div id="printable-staff-cards" className="hidden print:grid">
        {selectedStaffList.map((staff) => (
          <React.Fragment key={staff._id}>
            {(printSide === "both" || printSide === "front") && (
              <div className="inline-block p-1">
                <StaffIdFront staff={staff} scale={1} />
              </div>
            )}
            {(printSide === "both" || printSide === "back") && (
              <div className="inline-block p-1">
                <StaffIdBack scale={1} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          #printable-staff-cards,
          #printable-staff-cards * {
            visibility: visible;
          }
          #printable-staff-cards {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(2, 3.375in) !important;
            gap: 15px !important;
            justify-content: center !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
