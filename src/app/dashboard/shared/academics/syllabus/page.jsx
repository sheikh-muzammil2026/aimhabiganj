"use client";

import { useState } from "react";
import {
  BookOpen,
  Download,
  Plus,
  Search,
  Filter,
  FileText,
  Sparkles,
  Calendar,
  GraduationCap,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function SyllabusPage() {
  const [selectedClass, setSelectedClass] = useState("পঞ্চম");
  const [selectedTerm, setSelectedTerm] = useState("১ম সাময়িক");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New subject entry form state
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
    teacherName: "",
    bookName: "",
    totalMarks: 100,
    topics: "",
  });

  // Initial structured syllabus data
  const [syllabusList, setSyllabusList] = useState([
    {
      id: 1,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "আল-কুরআনুল কারীম ও তাজবীদ",
      subjectCode: "ISL-501",
      teacherName: "মাওলানা আব্দুল্লাহ আল-মামুন",
      bookName: "তাজবীদুল কুরআন (৫ম শ্রেণি)",
      totalMarks: 100,
      weeklyClasses: 5,
      chapters: [
        "সূরা আল-মুযযাম্মিল (১-২০ আয়াত মুখস্থ ও অনুবাদ)",
        "মাদ্দ ও ক্বলক্বলার বিস্তারিত নিয়মাবলী",
        "ওয়াকফ এর নিয়ম ও চিহ্নসমূহ",
        "সূরা আল-ফাতিহা ও সূরা আন-নাস থেকে আদ-দুহা মাশক্ব",
      ],
      lastUpdated: "২০২৬-০১-১০",
    },
    {
      id: 2,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "আকাইদ ও ফিক্বহ",
      subjectCode: "ISL-502",
      teacherName: "মুফতি আব্দুর রহমান",
      bookName: "আস-সালাম দ্বীনিয়্যাত (ফিকহ ও আকাইদ)",
      totalMarks: 100,
      weeklyClasses: 4,
      chapters: [
        "ঈমানে মুফাসসাল ও এর বিশ্লেষণ",
        "আল্লাহ তায়ালার সিফাতি নামসমূহ ও তাৎপর্য",
        "তাহারাত ও অযুর ওয়াজিবাত এবং ফারায়েয",
        "নামাজের আরকান ও আহকাম বিস্তারিত",
      ],
      lastUpdated: "২০২৬-০১-১২",
    },
    {
      id: 3,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "আরবি সাহিত্য ও ব্যাকরণ (আল-লুগাতুল আরাবিয়া)",
      subjectCode: "ARB-503",
      teacherName: "মাওলানা মাহদী হাসান",
      bookName: "আল-ক্বিরাআতুর রাশিদাহ (১ম খণ্ড)",
      totalMarks: 100,
      weeklyClasses: 6,
      chapters: [
        "দরস ১ থেকে দরস ৮ (অর্থ ও শব্দার্থ)",
        "ইসম, ফে'ল ও হারফ এর পরিচয় ও প্রয়োগ",
        "মেরেব ও মাবনি এর প্রাথমিক ধারণা",
        "আরবি বাক্য রচনা ও বাক্য পরিবর্তন অনুশীলন",
      ],
      lastUpdated: "২০২৬-০১-১৫",
    },
    {
      id: 4,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "বাংলা ভাষা ও সাহিত্য",
      subjectCode: "BNG-504",
      teacherName: "মুহাম্মদ মিজানুর রহমান",
      bookName: "আমার বাংলা বই (এনসিটিবি)",
      totalMarks: 100,
      weeklyClasses: 5,
      chapters: [
        "গদ্য: এই দেশ এই মানুষ, শখের মৃৎশিল্প, স্মরণীয় যারা চিরদিন",
        "পদ্য: সংকল্প, ঘাসফুল, ফেব্রুয়ারির গান",
        "ব্যাকরণ: সন্ধি, সমার্থক ও বিপরীতার্থক শব্দ, বিরামচিহ্ন",
        "রচনাবলী: সত্যবাদিতা, ছাত্রজীবনের দায়িত্ব, আস-সালাম মাদরাসা",
      ],
      lastUpdated: "২০২৬-০১-১৮",
    },
    {
      id: 5,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "গণিত",
      subjectCode: "MTH-505",
      teacherName: "ইঞ্জিনিয়ার মোস্তফা কামাল",
      bookName: "প্রাথমিক গণিত (৫ম শ্রেণি)",
      totalMarks: 100,
      weeklyClasses: 6,
      chapters: [
        "অধ্যায় ১: গুণ ও ভাগ সম্পর্কিত চার প্রক্রিয়া",
        "অধ্যায় ২: গসাগু ও লসাগু এর ব্যবহারিক সমস্যা",
        "অধ্যায় ৩: সাধারণ ভগ্নাংশ ও দশমিক ভগ্নাংশ",
        "জ্যামিতি: কোণ, ত্রিভুজ ও চতুর্ভুজের বৈশিষ্ট্য ও অঙ্কন",
      ],
      lastUpdated: "২০২৬-০১-২০",
    },
    {
      id: 6,
      class: "পঞ্চম",
      term: "১ম সাময়িক",
      subjectName: "ইংরেজি (English for Today)",
      subjectCode: "ENG-506",
      teacherName: "মো. নাজমুল হুদা",
      bookName: "English for Today (Class 5)",
      totalMarks: 100,
      weeklyClasses: 5,
      chapters: [
        "Unit 1-6: Hello!, See You, Saikat's Family, Leisure",
        "Grammar: Tenses (Present & Past), Prepositions, WH-questions",
        "Guided Writing: Writing short compositions & informal letters",
      ],
      lastUpdated: "২০২৬-০১-২২",
    },
  ]);

  const classOptions = [
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

  const termOptions = ["১ম সাময়িক", "২য় সাময়িক", "বার্ষিক পরীক্ষা"];

  const filteredSyllabus = syllabusList.filter((item) => {
    const matchesClass = selectedClass ? item.class === selectedClass : true;
    const matchesTerm = selectedTerm ? item.term === selectedTerm : true;
    const matchesSearch = searchQuery
      ? item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesClass && matchesTerm && matchesSearch;
  });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.subjectName.trim()) return;

    const newEntry = {
      id: Date.now(),
      class: selectedClass,
      term: selectedTerm,
      subjectName: newSubject.subjectName,
      subjectCode: newSubject.subjectCode || "SUB-00",
      teacherName: newSubject.teacherName || "মাদরাসা শিক্ষক",
      bookName: newSubject.bookName || "নির্ধারিত পাঠ্যবই",
      totalMarks: Number(newSubject.totalMarks) || 100,
      weeklyClasses: 5,
      chapters: newSubject.topics
        ? newSubject.topics.split("\n").filter((t) => t.trim())
        : ["অধ্যায় ১: সূচনা ও মূল পাঠ"],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setSyllabusList([newEntry, ...syllabusList]);
    setNewSubject({
      subjectName: "",
      subjectCode: "",
      teacherName: "",
      bookName: "",
      totalMarks: 100,
      topics: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#043e30] via-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>একাডেমিক পাঠ্যক্রম</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              সিলেবাস ব্যবস্থাপনা (Syllabus)
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm">
              সকল শ্রেণির টার্মভিত্তিক বিষয় ও অধ্যায়সমূহের পূর্ণাঙ্গ সিলেবাস পরিচালনা
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#043e30] font-black text-xs shadow-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বিষয় সিলেবাস যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              শ্রেণি:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              টার্ম/পরীক্ষা:
            </span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              {termOptions.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিষয়, কোড বা শিক্ষকের নাম..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Syllabus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSyllabus.length > 0 ? (
          filteredSyllabus.map((subject) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-900/10 dark:border-emerald-950/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {subject.subjectCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {subject.subjectName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                      {subject.totalMarks} নম্বর
                    </span>
                    <span className="text-[10px] text-slate-400">
                      সাপ্তাহিক {subject.weeklyClasses} ক্লাস
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{subject.bookName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    শিক্ষক: <span className="font-semibold">{subject.teacherName}</span>
                  </div>
                </div>

                {/* Topics List */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    সিলেবাসের পাঠ্যসূচি:
                  </span>
                  <ul className="space-y-1">
                    {subject.chapters.map((chapter, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{chapter}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  আপডেট: {subject.lastUpdated}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alert(`'${subject.subjectName}' এর সিলেবাস পিডিএফ জেনারেট হচ্ছে...`)
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              কোনো সিলেবাস পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {selectedClass} শ্রেণির {selectedTerm} এর জন্য সিলেবাস যুক্ত করতে উপরের
              বাটনে ক্লিক করুন।
            </p>
          </div>
        )}
      </div>

      {/* Add Syllabus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-900/20 dark:border-emerald-950/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>নতুন বিষয় সিলেবাস যুক্ত করুন ({selectedClass} শ্রেণি)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিষয়ের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: আকাঈদ ও ফিক্বহ"
                  value={newSubject.subjectName}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, subjectName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিষয় কোড
                  </label>
                  <input
                    type="text"
                    placeholder="ISL-501"
                    value={newSubject.subjectCode}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, subjectCode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পূর্ণমান
                  </label>
                  <input
                    type="number"
                    value={newSubject.totalMarks}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, totalMarks: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শিক্ষকের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="মাওলানা আব্দুল্লাহ"
                    value={newSubject.teacherName}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, teacherName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পাঠ্যবইয়ের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="বইয়ের নাম..."
                    value={newSubject.bookName}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, bookName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অধ্যায় / পাঠ্যসূচি (প্রতি লাইনে একটি অধ্যায়)
                </label>
                <textarea
                  rows={4}
                  placeholder={`অধ্যায় ১: সূচনা ও প্রাথমিক জ্ঞান\nঅধ্যায় ২: মূল বিষয়বস্তু`}
                  value={newSubject.topics}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, topics: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
