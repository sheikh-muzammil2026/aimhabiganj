"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Edit3,
  KeyRound,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Check,
  Plus,
  Lock,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

const AVAILABLE_PERMISSIONS = [
  { id: "manage_users", label: "ইউজার ব্যবস্থাপনা (Manage Users)" },
  { id: "manage_roles", label: "রোল ও পারমিশন (Manage Roles)" },
  { id: "manage_admissions", label: "ভর্তি কার্যক্রম (Admissions)" },
  { id: "manage_finance", label: "হিসাব ও অর্থ (Finance & Accounts)" },
  { id: "manage_academics", label: "পরীক্ষা ও রুটিন (Academics & Exams)" },
  { id: "manage_notices", label: "নোটিশ বোর্ড (Notices)" },
  { id: "view_reports", label: "রিপোর্ট ও অ্যানালিটিক্স (View Reports)" },
];

const ROLES = [
  { value: "all", label: "সকল রোল" },
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "accountant", label: "Accountant" },
  { value: "student", label: "Student" },
];

export default function AdministrationPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modals State
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("student");
  const [permissionModalUser, setPermissionModalUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [customPermission, setCustomPermission] = useState("");
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search: search.trim(),
        role: roleFilter,
        status: statusFilter,
      });

      const res = await fetch(`${API_BASE}/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "ইউজার লোড করতে ব্যর্থ হয়েছে");
      }

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.total || 0);
    } catch (err) {
      console.error(err);
      setError(err.message || "নেটওয়ার্ক ত্রুটি");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showToast = (text, type = "success") => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // 1. Update Role Handler
  const handleUpdateRole = async () => {
    if (!roleModalUser) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${roleModalUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "রোল পরিবর্তন ব্যর্থ হয়েছে");

      setUsers((prev) =>
        prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: selectedRole } : u))
      );
      showToast(data.message || "রোল সফলভাবে পরিবর্তন করা হয়েছে!");
      setRoleModalUser(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Toggle Permission Handler
  const handleTogglePermission = (permId) => {
    setUserPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleAddCustomPermission = (e) => {
    e.preventDefault();
    const trimmed = customPermission.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed) return;
    if (!userPermissions.includes(trimmed)) {
      setUserPermissions((prev) => [...prev, trimmed]);
    }
    setCustomPermission("");
  };

  const handleSavePermissions = async () => {
    if (!permissionModalUser) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${permissionModalUser.id}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: userPermissions }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "পারমিশন আপডেট ব্যর্থ হয়েছে");

      setUsers((prev) =>
        prev.map((u) => (u.id === permissionModalUser.id ? { ...u, permissions: userPermissions } : u))
      );
      showToast(data.message || "পারমিশন সফলভাবে আপডেট করা হয়েছে!");
      setPermissionModalUser(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Status Ban / Unban Toggle Handler
  const handleToggleStatus = async (user) => {
    const nextBanState = !user.isBanned;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: nextBanState }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, isBanned: nextBanState, status: nextBanState ? "banned" : "active" }
            : u
        )
      );
      showToast(
        nextBanState ? "ইউজার সাময়িক নিষিদ্ধ (Banned) করা হয়েছে" : "ইউজার সক্রিয় করা হয়েছে",
        nextBanState ? "warning" : "success"
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Delete User Handler
  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users/${deleteModalUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "ইউজার মুছতে ব্যর্থ হয়েছে");

      setUsers((prev) => prev.filter((u) => u.id !== deleteModalUser.id));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      showToast(data.message || "ইউজার স্থায়ীভাবে মুছে ফেলা হয়েছে!");
      setDeleteModalUser(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper Badge Color for Roles
  const getRoleBadge = (role) => {
    switch ((role || "").toLowerCase()) {
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "teacher":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "accountant":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "student":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                অ্যাডমিনিস্ট্রেশন ও রোল ম্যানেজমেন্ট
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                সকল ব্যবহারকারীর ভূমিকা, এক্সেস পারমিশন এবং অ্যাকাউন্ট স্ট্যাটাস পরিচালনা করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
              মোট ইউজার: {totalUsers}
            </span>
            <button
              onClick={() => fetchUsers()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-800 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              রিফ্রেশ
            </button>
          </div>
        </div>

        {/* Notifications / Toast */}
        {message.text && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between shadow-xs transition-all ${
              message.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : message.type === "warning"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "error" ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : (
                <Check className="w-5 h-5 text-emerald-600" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="নাম অথবা ইমেইল দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="active">Active (সক্রিয়)</option>
              <option value="banned">Banned (নিষিদ্ধ)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">ইউজার / নাম</th>
                  <th className="py-4 px-6">ইমেইল</th>
                  <th className="py-4 px-6">রোল (Role)</th>
                  <th className="py-4 px-6">স্ট্যাটাস</th>
                  <th className="py-4 px-6">পারমিশন</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                        <span>ডাটা লোড হচ্ছে...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-rose-600">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                      <span>{error}</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      কোনো ইউজার খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-emerald-50/30 transition-colors duration-150"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shadow-2xs">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{user.name}</p>
                            <p className="text-[11px] text-slate-400">ID: {user.id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                        {user.email || "N/A"}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {user.role || "student"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Permissions Summary */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-1 max-w-xs">
                          {user.permissions && user.permissions.length > 0 ? (
                            <>
                              {user.permissions.slice(0, 2).map((perm, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-600 rounded border border-slate-200"
                                >
                                  {perm}
                                </span>
                              ))}
                              {user.permissions.length > 2 && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded font-semibold">
                                  +{user.permissions.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">ডিফল্ট</span>
                          )}
                        </div>
                      </td>

                      {/* Action Controls */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Role Switcher Button */}
                          <button
                            title="রোল পরিবর্তন করুন"
                            onClick={() => {
                              setRoleModalUser(user);
                              setSelectedRole(user.role || "student");
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Permissions Manager Button */}
                          <button
                            title="পারমিশন পরিচালনা করুন"
                            onClick={() => {
                              setPermissionModalUser(user);
                              setUserPermissions(user.permissions || []);
                            }}
                            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Ban / Unban Toggle Button */}
                          <button
                            title={user.isBanned ? "আনব্যান করুন (Unban)" : "ব্যান করুন (Ban)"}
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.isBanned
                                ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                                : "text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                            }`}
                          >
                            {user.isBanned ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            title="মুছে ফেলুন (Delete)"
                            onClick={() => setDeleteModalUser(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              পৃষ্ঠা {page} এর {totalPages} (মোট {totalUsers} জন ইউজার)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                আগের
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                পরের
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. ROLE SWITCHER MODAL */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>ইউজার রোল পরিবর্তন</span>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                ব্যবহারকারী: <strong className="text-slate-800">{roleModalUser.name}</strong>
              </p>
              <p>
                ইমেইল: <span className="font-mono">{roleModalUser.email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                নতুন রোল নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["admin", "teacher", "accountant", "student"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border capitalize transition-all ${
                      selectedRole === r
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdateRole}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {actionLoading ? "আপডেট হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERMISSIONS MANAGER MODAL */}
      {permissionModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <span>পারমিশন এক্সেস কন্ট্রোল</span>
              </div>
              <button
                onClick={() => setPermissionModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{permissionModalUser.name}</span> এর জন্য
              নির্দিষ্ট ফিচার এক্সেস রাইটস নির্ধারণ করুন:
            </div>

            {/* Standard Permissions Checkboxes */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isChecked = userPermissions.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? "bg-indigo-50/50 border-indigo-200 text-indigo-950 font-medium"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className={`w-3.5 h-3.5 ${isChecked ? "text-indigo-600" : "text-slate-400"}`} />
                      <span>{perm.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>
                );
              })}

              {/* Dynamic / Custom Permissions Tag List */}
              {userPermissions.filter(
                (p) => !AVAILABLE_PERMISSIONS.some((ap) => ap.id === p)
              ).length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    কাস্টম এক্সেস কি:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {userPermissions
                      .filter((p) => !AVAILABLE_PERMISSIONS.some((ap) => ap.id === p))
                      .map((cp) => (
                        <span
                          key={cp}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-100 text-indigo-800"
                        >
                          {cp}
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(cp)}
                            className="hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Custom Permission Input */}
            <form onSubmit={handleAddCustomPermission} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="নতুন ডায়নামিক পারমিশন কি লিখুন..."
                value={customPermission}
                onChange={(e) => setCustomPermission(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                যুক্ত
              </button>
            </form>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPermissionModalUser(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {actionLoading ? "সংরক্ষণ হচ্ছে..." : "পারমিশন নিশ্চিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">স্থায়ীভাবে মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিত যে <strong className="text-slate-800">{deleteModalUser.name}</strong> (
              <span className="font-mono text-slate-700">{deleteModalUser.email}</span>) এর অ্যাকাউন্টটি
              স্থায়ীভাবে মুছে ফেলতে চান? এই অ্যাকশনটি অপরিবর্তনীয়।
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {actionLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
