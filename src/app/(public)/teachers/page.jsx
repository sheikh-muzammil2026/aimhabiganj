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
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";
import TeacherCard from "@/components/public/shared/TeacherCard";

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
            <span className="text-amber-300 font-semibold">শিক্ষকমণ্ডলী</span>
          </nav>

          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-amber-300 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>AIM Faculty Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              আমাদের সম্মানিত শিক্ষকমণ্ডলী
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl">
              দ্বীন ও আধুনিক শিক্ষার সমন্বয়ে আদর্শ জাতি গঠনে নিবেদিতপ্রাণ ও অভিজ্ঞ শিক্ষকবৃন্দ
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
                placeholder="শিক্ষকের নাম, বিষয় বা পদবী খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* ডিপার্টমেন্ট ফিল্টার চিপস */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedDept("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDept === "all"
                    ? "bg-emerald-800 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                সকল ({teachers.length})
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? "bg-emerald-800 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
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
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 animate-pulse text-center space-y-3"
              >
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 mx-auto" />
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-amber-100 dark:bg-amber-950/40 rounded-full w-1/2 mx-auto" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6 mx-auto" />
                <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-xl w-full pt-2" />
              </div>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
              কোনো শিক্ষক খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              অনুগ্রহ করে অন্য কি-ওয়ার্ড বা ফিল্টার দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedDept("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 transition-colors"
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
