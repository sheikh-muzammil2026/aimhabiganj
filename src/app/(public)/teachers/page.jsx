// app/(public)/teachers/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Phone,
  Mail,
  BookOpen,
  Search,
  Eye,
  ChevronRight,
  Home,
  Users,
  RotateCcw,
} from "lucide-react";
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";

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
        const res = await fetch("/api/faculty", { cache: "no-store" });
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

function TeacherCard({ teacher, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const photo = teacher.profileImage || teacher.image;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 rounded-2xl p-6 text-center shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 flex flex-col justify-between">
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-900/10 to-transparent dark:from-emerald-950/40 pointer-events-none" />

      <div>
        {/* প্রোফাইল অবতার */}
        <div className="w-24 h-24 rounded-full mx-auto p-1.5 border-4 border-emerald-800 dark:border-emerald-600 bg-white dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-md relative z-10 mb-4 transition-transform duration-300 group-hover:scale-105">
          {photo && !imageError ? (
            <img
              src={photo}
              alt={teacher.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
              <span className="text-xl font-bold font-shalda">উস্তাদ</span>
              <span className="text-[10px] text-amber-300 font-medium">AIM</span>
            </div>
          )}
        </div>

        {/* নাম ও পদবী */}
        <div className="relative z-10 space-y-1.5">
          <h3
            className="text-base font-bold text-emerald-950 dark:text-emerald-300 line-clamp-1"
            title={teacher.name || teacher.fullName}
          >
            {teacher.name || teacher.fullName}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-0.5 rounded-full inline-block border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              {teacher.designation || "শিক্ষক"}
            </span>

            {teacher.department && teacher.department !== teacher.designation && (
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/30">
                <BookOpen className="w-3 h-3 text-emerald-600" />
                {teacher.department}
              </span>
            )}
          </div>

          {/* শিক্ষাগত যোগ্যতা */}
          <p
            className="text-xs text-gray-600 dark:text-gray-300 pt-2.5 border-t border-gray-100 dark:border-slate-700/60 mt-2.5 truncate"
            title={teacher.education}
          >
            🎓 {teacher.education || "উচ্চতর ইসলামী ও সাধারণ শিক্ষা"}
          </p>

          {/* যোগাযোগ */}
          {(teacher.phone || teacher.email) && (
            <div className="pt-2 border-t border-dashed border-gray-100 dark:border-slate-700/50 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  title={teacher.phone}
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span className="font-mono text-[11px]">{teacher.phone}</span>
                </a>
              )}
              {teacher.phone && teacher.email && (
                <span className="text-gray-300 dark:text-gray-600">•</span>
              )}
              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="inline-flex items-center gap-1 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  title={teacher.email}
                >
                  <Mail className="w-3 h-3 text-amber-600" />
                  <span className="truncate max-w-[100px] text-[11px]">
                    {teacher.email.split("@")[0]}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* বিস্তারিত দেখুন বাটন */}
      <div className="relative z-10 pt-4 mt-3 border-t border-gray-100 dark:border-slate-700/60">
        <button
          type="button"
          onClick={() => onSelect?.(teacher)}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-slate-700/80 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-800 hover:text-white dark:hover:bg-emerald-600 transition-colors border border-emerald-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:border-emerald-300"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
