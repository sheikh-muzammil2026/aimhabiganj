// components/about/Staff.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Phone, Mail, Eye, ArrowRight, Pause, Play, Users } from "lucide-react";
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";

export default function Staff({ data }) {
  const fallbackData = {
    title: "কর্মকর্তা ও কর্মচারী",
    subtitle: "মাদরাসার প্রশাসনিক ও সার্বিক ব্যবস্থাপনায় নিয়োজিত টিম",
    list: [
      { id: 1, name: "জনাব হাফেজ মো: নোমান", role: "অফিস সহকারী ও হিসাবরক্ষক", contact: "017XXXXXXXX" },
      { id: 2, name: "জনাব মো: আব্দুল করিম", role: "আবাসিক তত্ত্বাবধায়ক (নাযেম-এ-লিল্লাহ)", contact: "018XXXXXXXX" },
      { id: 3, name: "জনাব মো: সোলায়মান", role: "প্রধান বাবুর্চি", contact: "নন-পাবলিক" },
    ],
  };

  const [staffList, setStaffList] = useState(data?.list || null);
  const [loading, setLoading] = useState(!data?.list);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (data?.list && data.list.length > 0) {
      setStaffList(data.list);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchStaff() {
      try {
        setLoading(true);
        const res = await fetch("/api/staff", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch staff: ${res.status}`);
        }

        const json = await res.json();
        if (isMounted) {
          if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
            setStaffList(json.data);
          } else {
            setStaffList(fallbackData.list);
          }
        }
      } catch (err) {
        console.warn("Staff fetch error, using fallback:", err.message);
        if (isMounted) {
          setStaffList(fallbackData.list);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [data]);

  const activeTitle = data?.title || fallbackData.title;
  const activeSubtitle = data?.subtitle || fallbackData.subtitle;

  // অবিচ্ছিন্ন লুপের জন্য মিনিমাম ৮টি আইটেম নিশ্চিত করা
  const trackItems = useMemo(() => {
    const source = staffList && staffList.length > 0 ? staffList : fallbackData.list;
    if (!source || source.length === 0) return [];
    let items = [...source];
    while (items.length < 8) {
      items = [...items, ...source];
    }
    return items;
  }, [staffList]);

  const handleOpenDetails = (staff) => {
    setSelectedStaff(staff);
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{activeSubtitle}</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full relative">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-800 rotate-45 border border-amber-400"></div>
        </div>

        {/* ইন্টারঅ্যাক্টিভ কন্ট্রোল ও ভিউ অল বাটন */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 text-xs text-gray-500 dark:text-gray-400">
          <Link
            href="/staffs"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm group cursor-pointer"
          >
            <span>সকল কর্মকর্তা-কর্মচারী দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {!loading && trackItems.length > 0 && (
            <>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-slate-800/80 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                মাউস রাখলে স্ক্রলিং স্থগিত থাকবে
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-slate-700/60 hover:text-amber-800 dark:hover:text-amber-300 transition-all cursor-pointer shadow-2xs"
                title={isPaused ? "স্ক্রলিং শুরু করুন" : "স্ক্রলিং বিরতি দিন"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-amber-600 fill-amber-600" />
                    <span>চালু করুন</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    <span>বিরতি</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* লোডিং স্কেলিটন */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={`staff-skel-${n}`}
              className="bg-white dark:bg-slate-800 border-l-4 border-amber-400 p-5 rounded-r-2xl shadow-sm flex items-start gap-4 animate-pulse"
            >
              <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded-lg w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : trackItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-amber-200 dark:border-slate-700 p-8">
          <p className="text-gray-500 dark:text-gray-400">
            বর্তমানে কোনো কর্মকর্তা বা কর্মচারীর তথ্য পাওয়া যায়নি। শীঘ্রই আপডেট করা হবে।
          </p>
        </div>
      ) : (
        /* অটো-স্ক্রলিং মারকি কনটেইনার (বাম থেকে ডানে / Left to Right) */
        <div className="relative w-full overflow-hidden py-4 group-marquee">
          {/* দুই পাশের গ্রেডিয়েন্ট ফেইড ইফেক্ট */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent z-10" />

          {/* অবিচ্ছিন্ন ডুয়াল-ট্র্যাক মারকি কন্টেইনার (Left to Right) */}
          <div
            className="flex w-max gap-6"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {/* ট্র্যাক ১ */}
            <div
              className="flex shrink-0 gap-6 animate-marquee-reverse"
              style={{
                animationPlayState: isPaused ? "paused" : undefined,
              }}
            >
              {trackItems.map((staff, index) => (
                <StaffCard
                  key={`staff-track1-${staff.id || staff.email || index}-${index}`}
                  staff={staff}
                  index={index}
                  onSelect={handleOpenDetails}
                />
              ))}
            </div>

            {/* ট্র্যাক ২ (অবিচ্ছিন্ন লুপের জন্য ডুপ্লিকেট ট্র্যাক) */}
            <div
              className="flex shrink-0 gap-6 animate-marquee-reverse"
              aria-hidden="true"
              style={{
                animationPlayState: isPaused ? "paused" : undefined,
              }}
            >
              {trackItems.map((staff, index) => (
                <StaffCard
                  key={`staff-track2-${staff.id || staff.email || index}-${index}`}
                  staff={staff}
                  index={index}
                  onSelect={handleOpenDetails}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* স্টাফ বিস্তারিত তথ্য মডেল */}
      <PersonDetailsModal
        person={selectedStaff}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="staff"
      />
    </div>
  );
}

/**
 * স্টাফ কার্ড সাব-কম্পোনেন্ট (মারকি ট্র্যাকে ব্যবহারের উপযোগী ফিক্সড-উইডথ কার্ড)
 */
function StaffCard({ staff, index, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const photo = staff.profileImage || staff.image;

  return (
    <div className="w-[290px] sm:w-[330px] shrink-0 bg-white dark:bg-slate-800 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 group">
      <div className="flex items-start gap-3.5">
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
          <div className="flex items-start justify-between gap-1.5">
            <h4
              className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-300 truncate"
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
          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-slate-700 text-amber-900 dark:text-amber-300 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors border border-amber-200/60 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>বিস্তারিত দেখুন</span>
        </button>
      </div>
    </div>
  );
}
