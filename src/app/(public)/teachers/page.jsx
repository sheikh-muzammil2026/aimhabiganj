// app/(public)/teachers/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Home,
  Users,
  RotateCcw,
} from "lucide-react";
import PersonDetailsModal from "@/components/shared/PersonDetailsModal";
import TeacherCard from "@/components/shared/TeacherCard";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchTeachers() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/teachers`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch teachers");
        const json = await res.json();
        if (isMounted && json?.success && Array.isArray(json?.data)) {
          setTeachers(json.data);
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTeachers();
    return () => {
      isMounted = false;
    };
  }, []);

  // বের করে আনা সকল ডিপার্টমেন্ট/বিষয় তালিকা
  const departments = useMemo(() => {
    const set = new Set();
    teachers.forEach((t) => {
      const dept = t.department || t.subject;
      if (dept && dept.trim()) {
        set.add(dept.trim());
      }
    });
    return Array.from(set);
  }, [teachers]);

  // ফিল্টার করা শিক্ষকের তালিকা
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        t.name?.toLowerCase().includes(query) ||
        t.fullName?.toLowerCase().includes(query) ||
        t.designation?.toLowerCase().includes(query) ||
        t.department?.toLowerCase().includes(query) ||
        t.subject?.toLowerCase().includes(query) ||
        t.education?.toLowerCase().includes(query) ||
        t.phone?.includes(query);

      const dept = t.department || t.subject || "";
      const matchDept = selectedDept === "all" || dept.trim() === selectedDept;

      return matchSearch && matchDept;
    });
  }, [teachers, search, selectedDept]);

  const handleOpenModal = (teacher) => {
    setSelectedTeacher(teacher);
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
            <span className="text-white font-semibold">শিক্ষকমণ্ডলী</span>
          </nav>

          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2196F3]/30 border border-[#90CAF9]/40 text-[#E3F2FD] text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>AIM Faculty Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              আমাদের সম্মানিত শিক্ষকমণ্ডলী
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#E3F2FD]/90 max-w-2xl">
              দ্বীন ও আধুনিক শিক্ষার সমন্বয়ে আদর্শ জাতি গঠনে নিবেদিতপ্রাণ ও অভিজ্ঞ শিক্ষকবৃন্দ
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
                placeholder="শিক্ষকের নাম, বিষয় বা পদবী খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-[#1E293B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2196F3] transition-all"
              />
            </div>

            {/* ডিপার্টমেন্ট ফিল্টার চিপস */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedDept("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${selectedDept === "all"
                  ? "bg-[#2196F3] text-white border-[#2196F3]"
                  : "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]/40 hover:bg-[#90CAF9]/20"
                  }`}
              >
                সকল ({teachers.length})
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${selectedDept === dept
                    ? "bg-[#2196F3] text-white border-[#2196F3]"
                    : "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]/40 hover:bg-[#90CAF9]/20"
                    }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* কনটেন্ট সেকশন */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={`skel-t-${n}`}
                className="bg-white rounded-2xl p-6 border border-[#90CAF9] animate-pulse text-center space-y-3"
              >
                <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto" />
                <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-[#E3F2FD] rounded-full w-1/2 mx-auto" />
                <div className="h-3 bg-slate-200 rounded w-5/6 mx-auto" />
                <div className="h-9 bg-slate-200 rounded-xl w-full pt-2" />
              </div>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#90CAF9] p-12 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0D47A1]">
              কোনো শিক্ষক খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-sm text-[#1E293B] mt-1">
              অনুগ্রহ করে অন্য কি-ওয়ার্ড বা ফিল্টার দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedDept("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D47A1] text-white hover:bg-[#0A3880] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher, index) => (
              <TeacherCard
                key={teacher.id || teacher.email || index}
                teacher={teacher}
                onSelect={handleOpenModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* বিস্তারিত তথ্য মডেল */}
      <PersonDetailsModal
        person={selectedTeacher}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="teacher"
      />
    </div>
  );
}
