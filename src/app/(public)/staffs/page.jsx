// app/(public)/staffs/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Home,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import PersonDetailsModal from "@/components/shared/PersonDetailsModal";
import StaffCard from "@/components/shared/StaffCard";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

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
        const res = await fetch(`${API_BASE}/api/staffs`, { cache: "no-store" });
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
    <div className="page-wrapper pb-16">
      {/* ব্যানার ও ব্রেডক্রাম্ব */}
      <div className="bg-gradient-to-b from-[#0D47A1] via-[#0A3880] to-[#0D47A1] text-white py-12 relative overflow-hidden border-b border-[#90CAF9]/40">
        <div className="site-container relative z-10">
          <nav className="flex items-center gap-2 text-xs text-[#90CAF9] mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#90CAF9]/60" />
            <Link href="/about" className="hover:text-white">
              আমাদের সম্পর্কে
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#90CAF9]/60" />
            <span className="text-white font-semibold">কর্মকর্তা ও কর্মচারী</span>
          </nav>

          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2196F3]/30 border border-[#90CAF9]/40 text-[#E3F2FD] text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>AIM Staff Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              আমাদের কর্মকর্তা ও কর্মচারীবৃন্দ
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#E3F2FD]/90 max-w-2xl">
              মাদরাসার প্রশাসনিক, আর্থিক ও সার্বিক ব্যবস্থাপনায় নিয়োজিত দক্ষ ও দায়িত্বশীল টিম
            </p>
          </div>
        </div>
      </div>

      <div className="site-container -mt-6 relative z-20">
        {/* সার্চ ও ফিল্টার বার */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#90CAF9] p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* সার্চ ইনপুট */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, পদবী, বা স্টাফ আইডি খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-[#1E293B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2196F3] transition-all"
              />
            </div>

            {/* ফিল্টার চিপস */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedRole("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${selectedRole === "all"
                  ? "bg-[#2196F3] text-white border-[#2196F3]"
                  : "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]/40 hover:bg-[#90CAF9]/20"
                  }`}
              >
                সকল ({staffList.length})
              </button>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${selectedRole === r
                    ? "bg-[#2196F3] text-white border-[#2196F3]"
                    : "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]/40 hover:bg-[#90CAF9]/20"
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
                className="bg-white rounded-2xl p-5 border border-[#90CAF9] animate-pulse flex items-start gap-4"
              >
                <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                  <div className="h-8 bg-slate-200 rounded-lg w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#90CAF9] p-12 text-center">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0D47A1]">
              কোনো স্টাফ খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-sm text-[#1E293B] mt-1">
              অনুগ্রহ করে অন্য কি-ওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedRole("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D47A1] text-white hover:bg-[#0A3880] transition-colors cursor-pointer"
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
