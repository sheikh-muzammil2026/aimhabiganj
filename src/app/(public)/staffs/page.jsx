// app/(public)/staffs/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Search,
  Eye,
  ChevronRight,
  Home,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";

export default function StaffsPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchStaff() {
      try {
        setLoading(true);
        const res = await fetch("/api/staff", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch staff");
        const json = await res.json();
        if (isMounted && json?.success && Array.isArray(json?.data)) {
          setStaffList(json.data);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStaff();
    return () => {
      isMounted = false;
    };
  }, []);

  // বের করে আনা ইউনিক ডেসিগনেশন/রোল
  const roles = useMemo(() => {
    const set = new Set();
    staffList.forEach((s) => {
      const role = s.designation || s.role;
      if (role && role.trim()) {
        set.add(role.trim());
      }
    });
    return Array.from(set);
  }, [staffList]);

  // ফিল্টার করা তালিকা
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        s.name?.toLowerCase().includes(query) ||
        s.fullName?.toLowerCase().includes(query) ||
        s.designation?.toLowerCase().includes(query) ||
        s.role?.toLowerCase().includes(query) ||
        s.staffId?.toLowerCase().includes(query) ||
        s.phone?.includes(query);

      const r = s.designation || s.role || "";
      const matchRole = selectedRole === "all" || r.trim() === selectedRole;

      return matchSearch && matchRole;
    });
  }, [staffList, search, selectedRole]);

  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 pb-16">
      {/* ব্যানার ও ব্রেডক্রাম্ব */}
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs text-emerald-200/90 mb-4">
            <Link href="/" className="hover:text-amber-300 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
            <Link href="/about" className="hover:text-amber-300">
              আমাদের সম্পর্কে
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
            <span className="text-amber-300 font-semibold">কর্মকর্তা ও কর্মচারী</span>
          </nav>

          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>AIM Staff Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              আমাদের কর্মকর্তা ও কর্মচারীবৃন্দ
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl">
              মাদরাসার প্রশাসনিক, আর্থিক ও সার্বিক ব্যবস্থাপনায় নিয়োজিত দক্ষ ও দায়িত্বশীল টিম
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* সার্চ ও ফিল্টার বার */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* সার্চ ইনপুট */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, পদবী, বা স্টাফ আইডি খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* ফিল্টার চিপস */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedRole("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRole === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                সকল ({staffList.length})
              </button>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRole === r
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* কনটেন্ট সেকশন */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={`skel-s-${n}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 animate-pulse flex items-start gap-4"
              >
                <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
              কোনো স্টাফ খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              অনুগ্রহ করে অন্য কি-ওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedRole("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff, index) => (
              <StaffCard
                key={staff.id || staff.email || index}
                staff={staff}
                index={index}
                onSelect={handleOpenModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* বিস্তারিত তথ্য মডেল */}
      <PersonDetailsModal
        person={selectedStaff}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="staff"
      />
    </div>
  );
}

function StaffCard({ staff, index, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const photo = staff.profileImage || staff.image;

  return (
    <div className="bg-white dark:bg-slate-800 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 group">
      <div className="flex items-start gap-4">
        {/* অবতার / ছবি */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-slate-700 border-2 border-emerald-600/30 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs relative">
          {photo && !imgError ? (
            <img
              src={photo}
              alt={staff.fullName || staff.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
              <span className="text-xs font-bold font-shalda">স্টাফ</span>
              <span className="text-[9px] text-amber-300 font-mono">0{index + 1}</span>
            </div>
          )}
        </div>

        {/* বিস্তারিত তথ্য */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className="text-base font-bold text-emerald-950 dark:text-emerald-300 truncate"
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
          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-slate-700 text-amber-900 dark:text-amber-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors border border-amber-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
