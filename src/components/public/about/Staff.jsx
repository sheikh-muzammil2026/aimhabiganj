// components/about/Staff.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import PersonDetailsModal from "@/components/public/shared/PersonDetailsModal";
import StaffCard from "@/components/public/shared/StaffCard";

const API_BASE =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000";

export default function Staff({ data, onLoaded }) {
  const fallbackData = {
    title: "কর্মকর্তা ও কর্মচারী",
    subtitle: "মাদরাসার প্রশাসনিক ও সার্বিক ব্যবস্থাপনায় নিয়োজিত টিম",
  };

  const hasPropData = Boolean(data?.list && data.list.length > 0);
  const [staffList, setStaffList] = useState(hasPropData ? data.list : null);
  const [loading, setLoading] = useState(!hasPropData);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (hasPropData) {
      onLoaded?.("staff");
      return;
    }

    let isMounted = true;
    async function fetchStaff() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/staffs`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch staff: ${res.status}`);
        }

        const json = await res.json();
        if (isMounted) {
          if (json?.success && Array.isArray(json?.data)) {
            setStaffList(json.data);
          } else {
            setStaffList([]);
          }
        }
      } catch (err) {
        console.warn("Staff fetch error:", err.message);
        if (isMounted) {
          setStaffList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          onLoaded?.("staff");
        }
      }
    }

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [data, onLoaded, hasPropData]);

  const activeTitle = data?.title || fallbackData.title;
  const activeSubtitle = data?.subtitle || fallbackData.subtitle;

  // অবিচ্ছিন্ন লুপের জন্য মিনিমাম ৮টি আইটেম নিশ্চিত করা
  const trackItems = useMemo(() => {
    const source = staffList && staffList.length > 0 ? staffList : [];
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
                  variant="marquee"
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
                  variant="marquee"
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
