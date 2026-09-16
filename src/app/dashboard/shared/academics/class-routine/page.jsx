"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function ClassRoutinePage() {
  const [activeTab, setActiveTab] = useState("form");
  const [selectedClass, setSelectedClass] = useState("পঞ্চম");
  const [section, setSection] = useState("ক (আবু বকর রা.)");
  const [academicYear, setAcademicYear] = useState("২০২৬");
  const [hijriYear, setHijriYear] = useState("১৪৪৭-৪৮ হিজরী");
  const [shift, setShift] = useState("সকাল");
  const [note, setNote] = useState(
    "ক্লাস শুরুর ৫ মিনিট পূর্বে শিক্ষার্থীদের উপস্থিত থাকা আবশ্যক। জোহরের নামাজের পর ছুটি।",
  );

  // Periods / Time slots
  const [periods, setPeriods] = useState([
    { id: "p1", name: "১ম পিরিয়ড", time: "০৮:০০ - ০8:৪৫" },
    { id: "p2", name: "২য় পিরিয়ড", time: "০৮:৪৫ - ০৯:৩০" },
    { id: "p3", name: "৩য় পিরিয়ড", time: "০৯:৩০ - ১০:১৫" },
    { id: "tiffin", name: "টিফিন / নাস্তা", time: "১০:১৫ - ১০:৪৫" },
    { id: "p4", name: "৪র্থ পিরিয়ড", time: "১০:৪৫ - ১১:৩০" },
    { id: "p5", name: "৫ম পিরিয়ড", time: "১১:৩০ - ১২:১৫" },
    { id: "p6", name: "৬ষ্ঠ পিরিয়ড", time: "১২:১৫ - ০১:০০" },
  ]);

  // Working Days
  const [days, setDays] = useState([
    "শনিবার",
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
  ]);

  // Structured Dummy Routine Matrix: [day][periodId] = { subject, teacher }
  const [routineMatrix, setRoutineMatrix] = useState({
    শনিবার: {
      p1: { subject: "আল-কুরআন", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "তাজবীদ", teacher: "মাওলানা আব্দুল্লাহ" },
      p3: { subject: "বাংলা", teacher: "মিজানুর রহমান" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "গণিত", teacher: "মোস্তফা কামাল" },
      p5: { subject: "ইংরেজি", teacher: "নাজমুল হুদা" },
      p6: { subject: "দ্বীনিয়্যাত", teacher: "মুফতি আব্দুর রহমান" },
    },
    রবিবার: {
      p1: { subject: "আল-কুরআন", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "আরবি ব্যাকরণ", teacher: "মাওলানা মাহদী হাসান" },
      p3: { subject: "গণিত", teacher: "মোস্তফা কামাল" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "বাংলা", teacher: "মিজানুর রহমান" },
      p5: { subject: "বিজ্ঞান", teacher: "মো. রফিকুল ইসলাম" },
      p6: { subject: "আকাইদ", teacher: "মুফতি আব্দুর রহমান" },
    },
    সোমবার: {
      p1: { subject: "আল-কুরআন", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "ইংরেজি", teacher: "নাজমুল হুদা" },
      p3: { subject: "গণিত", teacher: "মোস্তফা কামাল" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "আরবি সাহিত্য", teacher: "মাওলানা মাহদী হাসান" },
      p5: { subject: "সমাজ ও পরিবেশ", teacher: "মিজানুর রহমান" },
      p6: { subject: "ফিক্বহ", teacher: "মুফতি আব্দুর রহমান" },
    },
    মঙ্গলবার: {
      p1: { subject: "আল-কুরআন", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "বাংলা ২য় পত্র", teacher: "মিজানুর রহমান" },
      p3: { subject: "ইংরেজি", teacher: "নাজমুল হুদা" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "গণিত", teacher: "মোস্তফা কামাল" },
      p5: { subject: "হাদিস শরিফ", teacher: "মাওলানা আব্দুল্লাহ" },
      p6: { subject: "কম্পিউটার", teacher: "মো. নাঈম ইসলাম" },
    },
    বুধবার: {
      p1: { subject: "আল-কুরআন", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "গণিত", teacher: "মোস্তফা কামাল" },
      p3: { subject: "ইংরেজি গ্রামার", teacher: "নাজমুল হুদা" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "আরবি সাহিত্য", teacher: "মাওলানা মাহদী হাসান" },
      p5: { subject: "বিজ্ঞান", teacher: "মো. রফিকুল ইসলাম" },
      p6: { subject: "ইসলামের ইতিহাস", teacher: "মুফতি আব্দুর রহমান" },
    },
    বৃহস্পতিবার: {
      p1: { subject: "আল-কুরআন শুনানি", teacher: "মাওলানা আব্দুল্লাহ" },
      p2: { subject: "হাতের লেখা ও ক্যালিগ্রাফি", teacher: "মাওলানা মাহদী" },
      p3: { subject: "সাধারণ জ্ঞান ও কুইজ", teacher: "মিজানুর রহমান" },
      tiffin: { subject: "বিরতি ও নাস্তা", teacher: "দায়িত্বপ্রাপ্ত শিক্ষক" },
      p4: { subject: "ইংরেজি স্পোকেন", teacher: "নাজমুল হুদা" },
      p5: { subject: "দোয়া ও শিষ্টাচার", teacher: "মুফতি আব্দুর রহমান" },
      p6: { subject: "সাপ্তাহিক তারবিয়াত", teacher: "অধ্যক্ষ মহোদয়" },
    },
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCellChange = (day, periodId, field, value) => {
    setRoutineMatrix((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [periodId]: {
          ...(prev[day]?.[periodId] || { subject: "", teacher: "" }),
          [field]: value,
        },
      },
    }));
  };

  const addPeriod = () => {
    const newId = `p_${Date.now()}`;
    setPeriods((prev) => [
      ...prev,
      { id: newId, name: `পিরিয়ড ${prev.length + 1}`, time: "০১:০০ - ০১:৪৫" },
    ]);
  };

  const removePeriod = (id) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const classList = [
    "প্লে",
    "নার্সারি",
    "প্রথম",
    "দ্বিতীয়",
    "তৃতীয়",
    "চতুর্থ",
    "পঞ্চম",
    "ষষ্ঠ",
    "সপ্তম",
    "অষ্টম",
    "কায়দা/আমপারা",
    "নাজেরা",
    "হিফজ",
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#043e30] via-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>দৈনিক পাঠ পরিকল্পনা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              ক্লাস রুটিন ব্যবস্থাপনা (Class Routine)
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm">
              শ্রেণি ও সেকশনভিত্তিক সাপ্তাহিক পিরিয়ড, বিষয় এবং শিক্ষক সমন্বয়
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === "form" ? "preview" : "form")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{activeTab === "form" ? "প্রিন্ট প্রিভিউ দেখুন" : "এডিটর মোড"}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#043e30] font-black text-xs shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>রুটিন সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>ক্লাস রুটিনের তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <button
          onClick={() => setActiveTab("form")}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
            activeTab === "form"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          📝 রুটিন ইনপুট ফরম
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
            activeTab === "preview"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          👁️ প্রিভিউ ও প্রিন্ট
        </button>
      </div>

      {activeTab === "form" ? (
        <div className="space-y-6">
          {/* Metadata Filter Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              শ্রেণি ও রুটিন পরিচিতি
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শ্রেণি:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শাখা / সেকশন:
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিক্ষাবর্ষ (ঈসায়ী):
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  হিজরী সন:
                </label>
                <input
                  type="text"
                  value={hijriYear}
                  onChange={(e) => setHijriYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিশেষ দ্রষ্টব্য / নির্দেশিকা:
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Periods Timing Config */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>দৈনিক পিরিয়ড ও সময়সূচি</span>
              </h2>
              <button
                onClick={addPeriod}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন পিরিয়ড</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {periods.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 relative group"
                >
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    কলাম {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPeriods((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, name: val } : item,
                        ),
                      );
                    }}
                    className="w-full text-xs font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 mb-1 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={p.time}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPeriods((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, time: val } : item,
                        ),
                      );
                    }}
                    className="w-full text-[11px] text-slate-500 dark:text-slate-400 bg-transparent focus:outline-hidden"
                  />
                  {periods.length > 1 && (
                    <button
                      onClick={() => removePeriod(p.id)}
                      className="absolute top-2 right-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Routine Grid Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-emerald-900 text-white text-xs">
                  <th className="p-3 text-left w-28 border-r border-emerald-800">
                    বার (Day)
                  </th>
                  {periods.map((p) => (
                    <th
                      key={p.id}
                      className="p-3 text-center border-r border-emerald-800 last:border-r-0"
                    >
                      <span className="block font-bold">{p.name}</span>
                      <span className="block text-[10px] text-emerald-200 font-normal">
                        {p.time}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {days.map((day) => (
                  <tr
                    key={day}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                      {day}
                    </td>
                    {periods.map((p) => {
                      const cell = routineMatrix[day]?.[p.id] || {
                        subject: "",
                        teacher: "",
                      };
                      const isTiffin = p.id === "tiffin";

                      return (
                        <td
                          key={p.id}
                          className={`p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                            isTiffin
                              ? "bg-amber-50/50 dark:bg-amber-950/20 text-center"
                              : ""
                          }`}
                        >
                          <input
                            type="text"
                            placeholder="বিষয়..."
                            value={cell.subject}
                            onChange={(e) =>
                              handleCellChange(
                                day,
                                p.id,
                                "subject",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white mb-1 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                          />
                          <input
                            type="text"
                            placeholder="শিক্ষক..."
                            value={cell.teacher}
                            onChange={(e) =>
                              handleCellChange(
                                day,
                                p.id,
                                "teacher",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 focus:outline-hidden"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Preview & Printable Sheet */
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-slate-900 print:p-0 print:shadow-none print:border-none">
          {/* Printable Top Header */}
          <div className="text-center space-y-1 pb-6 border-b-2 border-emerald-900">
            <h2 className="text-2xl font-black text-emerald-900">
              আস-সালাম আইডিয়াল মাদরাসা (এইম)
            </h2>
            <p className="text-xs text-slate-600">
              হবিগঞ্জ সদর, হবিগঞ্জ | মোবাইল: ০১৭১১-০০০০০০
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-sm mt-2">
              সাপ্তাহিক শ্রেণি পাঠপরিকল্পনা ও রুটিন - {academicYear}
            </div>
            <div className="flex justify-center gap-6 text-xs font-bold text-slate-700 pt-2">
              <span>শ্রেণি: {selectedClass}</span>
              <span>শাখা: {section}</span>
              <span>হিজরী সন: {hijriYear}</span>
            </div>
          </div>

          {/* Printable Table */}
          <table className="w-full border-collapse border border-slate-900 my-6 text-xs">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-slate-900 p-2 w-24">বার</th>
                {periods.map((p) => (
                  <th key={p.id} className="border border-slate-900 p-2">
                    <div>{p.name}</div>
                    <div className="text-[10px] font-normal text-slate-600">
                      {p.time}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="text-center">
                  <td className="border border-slate-900 p-2 font-bold bg-slate-50">
                    {day}
                  </td>
                  {periods.map((p) => {
                    const cell = routineMatrix[day]?.[p.id] || {
                      subject: "",
                      teacher: "",
                    };
                    return (
                      <td
                        key={p.id}
                        className="border border-slate-900 p-2 align-middle"
                      >
                        <div className="font-bold text-slate-900">
                          {cell.subject || "-"}
                        </div>
                        {cell.teacher && (
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            ({cell.teacher})
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-slate-600 italic mb-8">
            * দ্রষ্টব্য: {note}
          </div>

          {/* Signature section */}
          <div className="flex justify-between pt-12 text-xs font-bold text-slate-700">
            <div className="text-center">
              <div className="border-t border-slate-500 w-36 mb-1" />
              <span>শ্রেণি শিক্ষক</span>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-500 w-36 mb-1" />
              <span>নাযেমে তালিমাত</span>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-500 w-36 mb-1" />
              <span>মুহতামিম / অধ্যক্ষ</span>
            </div>
          </div>

          {/* Print button on screen */}
          <div className="text-center pt-8 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
