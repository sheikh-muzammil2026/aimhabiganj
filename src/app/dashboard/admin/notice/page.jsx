"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Radio,
  Edit3,
  Trash2,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Megaphone,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const CATEGORIES = [
  { id: "all", label: "সকল ক্যাটাগরি" },
  {
    id: "exam",
    label: "পরীক্ষা সংক্রান্ত",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "holiday",
    label: "ছুটির নোটিশ",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "admission",
    label: "ভর্তি সংক্রান্ত",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "general",
    label: "সাধারণ নোটিশ",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "urgent",
    label: "জরুরি ঘোষণা",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

export default function AdminNoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    showInTicker: false,
    isActive: true,
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    attachmentUrl: "",
  });

  // Load notices from server
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/notices?limit=100`);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      } else {
        toast.error(data.message || "নোটিশ ডাটা পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Failed to fetch notices:", err);
      toast.error("সার্ভার থেকে নোটিশ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Form reset / open create modal
  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      description: "",
      category: "general",
      showInTicker: false,
      isActive: true,
      publishDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      attachmentUrl: "",
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "general",
      showInTicker: Boolean(notice.showInTicker),
      isActive: notice.isActive !== false,
      publishDate: notice.publishDate
        ? new Date(notice.publishDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      expiryDate: notice.expiryDate
        ? new Date(notice.expiryDate).toISOString().split("T")[0]
        : "",
      attachmentUrl: notice.attachmentUrl || "",
    });
    setIsModalOpen(true);
  };

  // Handle submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warn("অনুগ্রহ করে নোটিশের শিরোনাম প্রদান করুন");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingNotice
        ? `${API_BASE}/api/notices/${editingNotice._id}`
        : `${API_BASE}/api/notices`;

      const method = editingNotice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(
          editingNotice
            ? "নোটিশ সফলভাবে আপডেট হয়েছে!"
            : "নতুন নোটিশ সফলভাবে যুক্ত হয়েছে!",
        );
        setIsModalOpen(false);
        fetchNotices();
      } else {
        toast.error(result.message || "নোটিশ সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Save notice error:", err);
      toast.error("সার্ভারে ত্রুটি হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Ticker Status
  const handleToggleTicker = async (id, currentVal) => {
    try {
      const res = await fetch(`${API_BASE}/api/notices/${id}/ticker`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showInTicker: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setNotices((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, showInTicker: data.showInTicker } : n,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Toggle ticker error:", err);
      toast.error("টিকার স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (id, currentVal) => {
    try {
      const res = await fetch(`${API_BASE}/api/notices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setNotices((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, isActive: data.isActive } : n,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
    }
  };

  // Delete Notice
  const handleDelete = async (id, title) => {
    if (
      !confirm(
        `আপনি কি নিশ্চিত যে "${title}" নোটিশটি স্থায়ীভাবে মুছে ফেলতে চান?`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/notices/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setNotices((prev) => prev.filter((n) => n._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Delete notice error:", err);
      toast.error("নোটিশটি মুছে ফেলা সম্ভব হয়নি");
    }
  };

  // Filtered notices
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      (n.title && n.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.description &&
        n.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || n.category === selectedCategory;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? n.isActive !== false
          : n.isActive === false;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Analytics Stats
  const totalCount = notices.length;
  const activeCount = notices.filter((n) => n.isActive !== false).length;
  const tickerCount = notices.filter(
    (n) => n.showInTicker && n.isActive !== false,
  ).length;
  const urgentCount = notices.filter(
    (n) => n.priority === "urgent" || n.category === "urgent",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1">
              <Megaphone className="w-4 h-4 animate-bounce" />
              <span>নোটিশ ও ঘোষণা ব্যবস্থাপনা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              অ্যাডমিন নোটিশ কন্ট্রোল সেন্টার
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              মাদরাসার সকল অফিশিয়াল নোটিশ পরিচালনা করুন ও পাবলিক টপ হেডারের
              লাইভ টিকারে প্রচার করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotices}
              title="রিফ্রেশ করুন"
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>নতুন নোটিশ লিখুন</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                মোট নোটিশ
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {totalCount}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                সক্রিয় নোটিশ
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {activeCount}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                হেডার টিকারে প্রচার
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {tickerCount}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                জরুরি নোটিশ
              </p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {urgentCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিরোনাম বা কীওয়ার্ড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল অবস্থা</option>
              <option value="active">শুধুমাত্র সক্রিয়</option>
              <option value="inactive">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        {/* Notices Table / List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                নোটিশ ডাটা লোড করা হচ্ছে...
              </p>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                কোনো নোটিশ পাওয়া যায়নি
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                অনুসন্ধান বা ফিল্টার পরিবর্তন করুন অথবা নতুন নোটিশ লিখুন।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">নোটিশের বিবরণ</th>
                    <th className="py-3.5 px-4">ক্যাটাগরি</th>
                    <th className="py-3.5 px-4 text-center">হেডার টিকার</th>
                    <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                  {filteredNotices.map((notice) => {
                    const catObj =
                      CATEGORIES.find((c) => c.id === notice.category) ||
                      CATEGORIES[4];

                    return (
                      <tr
                        key={notice._id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Title & info */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="max-w-md">
                            <h4
                              onClick={() => setViewingNotice(notice)}
                              className="font-bold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors line-clamp-1"
                            >
                              {notice.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {notice.description ||
                                "কোনো বিবরণ প্রদান করা হয়নি"}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {notice.publishDate
                                  ? new Date(
                                      notice.publishDate,
                                    ).toLocaleDateString("bn-BD")
                                  : "তারিখ বিহীন"}
                              </span>
                              {notice.attachmentUrl && (
                                <a
                                  href={notice.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-0.5 text-emerald-600 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  সংযুক্তি
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${
                              catObj.color || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {catObj.label}
                          </span>
                        </td>

                        {/* Ticker Toggle */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleTicker(
                                notice._id,
                                notice.showInTicker,
                              )
                            }
                            title={
                              notice.showInTicker
                                ? "টিকার থেকে বাদ দিন"
                                : "পাবলিক হেডারের টিকারে যোগ করুন"
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              notice.showInTicker
                                ? "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:text-amber-600"
                            }`}
                          >
                            <Radio
                              className={`w-3.5 h-3.5 ${
                                notice.showInTicker ? "animate-pulse" : ""
                              }`}
                            />
                            <span>
                              {notice.showInTicker
                                ? "টিকারে চালু"
                                : "টিকারে বন্ধ"}
                            </span>
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(notice._id, notice.isActive)
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              notice.isActive !== false
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                                : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {notice.isActive !== false ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>সক্রিয়</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>নিষ্ক্রিয়</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingNotice(notice)}
                              title="বিস্তারিত দেখুন"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(notice)}
                              title="সম্পাদনা করুন"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(notice._id, notice.title)
                              }
                              title="মুছে ফেলুন"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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

      {/* Modal: Create / Edit Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {editingNotice
                    ? "নোটিশ সম্পাদনা করুন"
                    : "নতুন নোটিশ প্রকাশ করুন"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  নোটিশের শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ১৪৪৭ হিজরী শিক্ষাবর্ষের সাময়িক পরীক্ষার সময়সূচী প্রকাশ"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="exam">পরীক্ষা সংক্রান্ত</option>
                    <option value="holiday">ছুটির নোটিশ</option>
                    <option value="admission">ভর্তি সংক্রান্ত</option>
                    <option value="general">সাধারণ নোটিশ</option>
                    <option value="urgent">অতীব জরুরি</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    প্রকাশের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    মেয়াদোত্তীর্ণের তারিখ (ঐচ্ছিক)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  বিস্তারিত বিবরণ / বার্তা
                </label>
                <textarea
                  rows={4}
                  placeholder="নোটিশের সম্পূর্ণ বিবরণ এখানে লিখুন..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Attachment URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  ফাইল বা পিডিএফ লিঙ্ক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... অথবা ফাইলের URL"
                  value={formData.attachmentUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, attachmentUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Ticker & Active Toggles */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        পাবলিক টপ হেডারের টিকারে প্রদর্শন করুন
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        সক্রিয় করলে এই নোটিশটি ওয়েবসাইটের প্রধান হেডারে
                        ডানে-বামে স্ক্রল হতে থাকবে।
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showInTicker}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showInTicker: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </label>

                <div className="border-t border-amber-200/60 dark:border-amber-900/40 pt-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        নোটিশটি সক্রিয় রাখুন
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        নিষ্ক্রিয় নোটিশ সাধারণ দর্শকরা দেখতে পাবে না।
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingNotice ? "সংরক্ষণ করুন" : "প্রকাশ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Notice Details */}
      {viewingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mb-2">
                  {CATEGORIES.find((c) => c.id === viewingNotice.category)
                    ?.label || "নোটিশ"}
                </span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-snug">
                  {viewingNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingNotice(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 border-y border-slate-100 dark:border-slate-800 py-2.5">
              <span>
                প্রকাশের তারিখ:{" "}
                <strong className="text-slate-600 dark:text-slate-300">
                  {viewingNotice.publishDate
                    ? new Date(viewingNotice.publishDate).toLocaleDateString(
                        "bn-BD",
                      )
                    : "তারিখ উল্লেখ নেই"}
                </strong>
              </span>
              <span>
                অগ্রাধিকার:{" "}
                <strong className="text-slate-600 dark:text-slate-300">
                  {viewingNotice.priority || "সাধারণ"}
                </strong>
              </span>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
              {viewingNotice.description || "কোনো বিবরণ প্রদান করা হয়নি।"}
            </div>

            {viewingNotice.attachmentUrl && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  সংযুক্ত ডকুমেন্ট পাওয়া গেছে
                </span>
                <a
                  href={viewingNotice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  ওপেন করুন <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingNotice(null)}
                className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
