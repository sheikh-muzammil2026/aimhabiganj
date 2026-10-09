// components/about/Faculty.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { GraduationCap, Phone, Mail, Pause, Play, BookOpen, Eye, ArrowRight } from "lucide-react";
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";

export default function Faculty({ data }) {
  const fallbackData = {
    title: "আমাদের শিক্ষকমণ্ডলী",
    subtitle: "দ্বীন ও আধুনিক শিক্ষার সমন্বয়ে শিক্ষার্থীদের গড়ে তুলছেন যাঁরা",
    list: [
      {
        id: 1,
        name: "মাওলানা কারী ওবায়দুল্লাহ",
        designation: "প্রধান শিক্ষক (হিফজ বিভাগ)",
        department: "হিফজ বিভাগ",
        education: "হাফেজ, ক্বারী, দাওরায়ে হাদীস",
        image: "",
      },
      {
        id: 2,
        name: "মুফতি তারিক জামিল",
        designation: "সিনিয়র শিক্ষক (কিতাব বিভাগ)",
        department: "কিতাব বিভাগ",
        education: "ইফতা (উচ্চতর ফিকহ), এম.এ",
        image: "",
      },
      {
        id: 3,
        name: "জনাব আশরাফুল ইসলাম",
        designation: "সহকারী শিক্ষক (জেনারেল বিভাগ)",
        department: "জেনারেল বিভাগ",
        education: "বি.এস.সি (গণিত), ঢাবি",
        image: "",
      },
    ],
  };

  const [facultyList, setFacultyList] = useState(data?.list || null);
  const [loading, setLoading] = useState(!data?.list);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // If data was already supplied via props, use it
    if (data?.list && data.list.length > 0) {
      setFacultyList(data.list);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchFaculty() {
      try {
        setLoading(true);
        const res = await fetch("/api/faculty", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch faculty: ${res.status}`);
        }

        const json = await res.json();
        if (isMounted) {
          if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
            setFacultyList(json.data);
          } else {
            // Graceful fallback if empty
            setFacultyList(fallbackData.list);
          }
        }
      } catch (err) {
        console.warn("Faculty fetch error, using fallback:", err.message);
        if (isMounted) {
          setFacultyList(fallbackData.list);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFaculty();

    return () => {
      isMounted = false;
    };
  }, [data]);

  const activeTitle = data?.title || fallbackData.title;
  const activeSubtitle = data?.subtitle || fallbackData.subtitle;

  // Build a seamless looping list: ensure at least 8 items before duplicating for infinite track
  const trackItems = useMemo(() => {
    const source = facultyList && facultyList.length > 0 ? facultyList : fallbackData.list;
    if (!source || source.length === 0) return [];
    let items = [...source];
    while (items.length < 8) {
      items = [...items, ...source];
    }
    return items;
  }, [facultyList]);

  const handleOpenDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* হেডার সেকশন */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-400 flex items-center justify-center gap-3">
          <span className="hidden sm:inline text-amber-500">❖</span>
          {activeTitle}
          <span className="hidden sm:inline text-amber-500">❖</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {activeSubtitle}
        </p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>

        {/* ইন্টারঅ্যাক্টিভ কন্ট্রোল ও ভিউ অল বাটন */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 text-xs text-gray-500 dark:text-gray-400">
          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white transition-all shadow-sm group"
          >
            <span>সকল শিক্ষক দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {!loading && trackItems.length > 0 && (
            <>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-slate-800/80 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-100 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                মাউস রাখলে স্ক্রলিং স্থগিত থাকবে
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-700/60 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all cursor-pointer shadow-2xs"
                title={isPaused ? "স্ক্রলিং শুরু করুন" : "স্ক্রলিং বিরতি দিন"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    <span>চালু করুন</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>বিরতি</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* লোডিং স্কেলিটন স্টেট */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={`skel-${n}`}
              className="bg-white dark:bg-slate-800 border border-emerald-100/70 dark:border-slate-700 rounded-2xl p-6 text-center shadow-md animate-pulse space-y-4"
            >
              <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 dark:bg-slate-700 border-4 border-emerald-100 dark:border-slate-600"></div>
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-md w-3/4 mx-auto"></div>
              <div className="h-4 bg-amber-100 dark:bg-amber-950/40 rounded-full w-1/2 mx-auto"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-5/6 mx-auto pt-2 border-t border-gray-100 dark:border-slate-700"></div>
            </div>
          ))}
        </div>
      ) : trackItems.length === 0 ? (
        /* খালি বা ফলব্যাক এরর স্টেট */
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-emerald-200 dark:border-slate-700 p-8">
          <p className="text-gray-500 dark:text-gray-400">
            বর্তমানে কোনো শিক্ষকের তথ্য পাওয়া যায়নি। শীঘ্রই আপডেট করা হবে।
          </p>
        </div>
      ) : (
        /* অটো-স্ক্রলিং মারকি কনটেইনার */
        <div className="relative w-full overflow-hidden py-4 group-marquee">
          {/* দুই পাশের গ্রেডিয়েন্ট ফেইড ইফেক্ট (ডান ও বামে মসৃণ ট্রানজিশনের জন্য) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent z-10" />

          {/* অবিচ্ছিন্ন ডুয়াল-ট্র্যাক মারকি কন্টেইনার */}
          <div
            className="flex w-max gap-6"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {/* ট্র্যাক ১ */}
            <div
              className="flex shrink-0 gap-6 animate-marquee"
              style={{
                animationPlayState: isPaused ? "paused" : undefined,
              }}
            >
              {trackItems.map((teacher, index) => (
                <TeacherCard
                  key={`track1-${teacher.id || teacher.email || index}-${index}`}
                  teacher={teacher}
                  onSelect={handleOpenDetails}
                />
              ))}
            </div>

            {/* ট্র্যাক ২ (অবিচ্ছিন্ন লুপের জন্য ডুপ্লিকেট ট্র্যাক) */}
            <div
              className="flex shrink-0 gap-6 animate-marquee"
              aria-hidden="true"
              style={{
                animationPlayState: isPaused ? "paused" : undefined,
              }}
            >
              {trackItems.map((teacher, index) => (
                <TeacherCard
                  key={`track2-${teacher.id || teacher.email || index}-${index}`}
                  teacher={teacher}
                  onSelect={handleOpenDetails}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* শিক্ষক বিস্তারিত তথ্য মডেল */}
      <PersonDetailsModal
        person={selectedTeacher}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="teacher"
      />
    </div>
  );
}

/**
 * শিক্ষক পরিচিতি কার্ড সাব-কম্পোনেন্ট
 */
function TeacherCard({ teacher, onSelect }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-slate-800 border border-emerald-100/80 dark:border-slate-700/80 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 flex flex-col justify-between">
      {/* কার্ডের উপরের মৃদু গ্রেডিয়েন্ট ডেকোরেশন */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-900/10 to-transparent dark:from-emerald-950/40 pointer-events-none"></div>

      <div>
        {/* প্রোফাইল ছবি / অবতার */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto p-1.5 border-4 border-emerald-800 dark:border-emerald-600 bg-white dark:bg-slate-700 flex items-center justify-center overflow-hidden shadow-md relative z-10 mb-4 transition-transform duration-300 group-hover:scale-105">
          {teacher.image && !imageError ? (
            <img
              src={teacher.image}
              alt={teacher.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex flex-col items-center justify-center text-white select-none">
              <span className="text-xl sm:text-2xl font-bold font-shalda">উস্তাদ</span>
              <span className="text-[10px] text-amber-300 font-medium tracking-wider">AIM</span>
            </div>
          )}
        </div>

        {/* নাম ও পদবী */}
        <div className="relative z-10 space-y-1.5">
          <h3
            className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-300 line-clamp-1"
            title={teacher.name}
          >
            {teacher.name}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full inline-block border border-amber-200 dark:border-amber-900/40 shadow-2xs">
              {teacher.designation || "শিক্ষক"}
            </span>

            {teacher.department && teacher.department !== teacher.designation && (
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-100 dark:border-emerald-900/30">
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

          {/* যোগাযোগ তথ্য (যদি থাকে) */}
          {(teacher.phone || teacher.email) && (
            <div className="pt-2 border-t border-dashed border-gray-100 dark:border-slate-700/50 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  title={teacher.phone}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
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
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate max-w-[110px] text-[11px]">
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
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(teacher);
          }}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-slate-700/80 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-800 hover:text-white dark:hover:bg-emerald-600 transition-colors border border-emerald-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:border-emerald-300"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
