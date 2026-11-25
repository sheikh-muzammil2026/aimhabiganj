/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  ArrowLeft,
  Loader2,
  Users,
  Eye,
  EyeOff,
  LayoutGrid,
  SlidersHorizontal,
  Globe,
  RotateCcw,
} from "lucide-react";
import { toBengaliDigits } from "@/lib/studentUtils";
import { formatAcademicYear } from "@/lib/academicYear";
import siteConfig from "@/config/siteConfig";

const DEFAULT_ACADEMIC_YEAR = toBengaliDigits(
  formatAcademicYear(
    siteConfig.academicSession?.currentBn ||
      siteConfig.academicSession?.currentEn ||
      "২০২৬"
  ) || "২০২৬"
);

const normalizeYearDisplay = (val) => {
  if (!val || typeof val === "object") return "";
  const cleaned = formatAcademicYear(val);
  return cleaned ? toBengaliDigits(cleaned) : "";
};

export const FALLBACK_AVATAR_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='36' r='20'/><path d='M20 86c0-16.5 13.5-30 30-30s30 13.5 30 30z'/></svg>";

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "[object Object]"
  ) {
    return false;
  }
  return /^(https?:\/\/|\/|data:image\/)/i.test(trimmed);
};

// Bengali to English digit mapping and digit extractor helpers
export const bnToEnDigits = (str) => {
  if (!str && str !== 0) return "";
  const bnDigits = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return String(str).replace(/[০-৯]/g, (d) => bnDigits[d] || d);
};

export const parseSeatNumber = (seat) => {
  if (!seat && seat !== 0) return 0;
  const enStr = bnToEnDigits(seat);
  const match = enStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const parseHallNumber = (hall) => {
  if (!hall && hall !== 0) return 0;
  const enStr = bnToEnDigits(hall);
  const match = enStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const clampPositiveInt = (val, fallback = 1, max = 500) => {
  const cleaned = bnToEnDigits(val);
  const parsed = parseInt(cleaned, 10);
  if (isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(max, parsed);
};

const SEATS_PER_TABLE_PRESETS = [2, 3, 4, 5];
const STUDENTS_PER_HALL_PRESETS = [16, 24, 32, 44];

// হলের কনফিগারেশন এবং অবস্থান
export const HALL_CONFIGS = {
  1: {
    hallNo: 1,
    name: "হল নং ১",
    location: "নিচ তলার নার্সারির রুম",
    fullTitle: "হল নং ১ — নিচ তলার নার্সারির রুম",
    shortTitle: "নিচ তলা (নার্সারি)",
    floor: "নিচ তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  2: {
    hallNo: 2,
    name: "হল নং ২",
    location: "২য় তলার থ্রির রুম",
    fullTitle: "হল নং ২ — ২য় তলার থ্রির রুম",
    shortTitle: "২য় তলা (ক্লাস থ্রি)",
    floor: "২য় তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  3: {
    hallNo: 3,
    name: "হল নং ৩",
    location: "২য় তলার ক্লাস টু এর রুম",
    fullTitle: "হল নং ৩ — ২য় তলার ক্লাস টু এর রুম",
    shortTitle: "২য় তলা (ক্লাস টু)",
    floor: "২য় তলা",
    capacity: 16,
    deskCount: 8,
    rows: 4,
  },
  4: {
    hallNo: 4,
    name: "হল নং ৪",
    location: "৩য় তলায় হিফজ বিভাগের ক্লাস রুম",
    fullTitle: "হল নং ৪ — ৩য় তলায় হিফজ বিভাগের ক্লাস রুম",
    shortTitle: "৩য় তলা (হিফজ বিভাগ)",
    floor: "৩য় তলা",
    capacity: 44,
    deskCount: 22,
    rows: 11,
  },
};

const ORDERED_HALL_NUMS = Object.keys(HALL_CONFIGS)
  .map(Number)
  .sort((a, b) => a - b);

const createDefaultHallSettings = () => {
  const initial = {};
  ORDERED_HALL_NUMS.forEach((hNo) => {
    initial[hNo] = {
      seatsPerTable: 2,
      studentsPerHall: HALL_CONFIGS[hNo].capacity,
    };
  });
  return initial;
};

const getSeatPositionLabel = (index, totalPerTable) => {
  if (totalPerTable === 1) return "একক";
  if (totalPerTable === 2) return index === 0 ? "বাম আসন" : "ডান আসন";
  if (totalPerTable === 3) {
    if (index === 0) return "বাম";
    if (index === 1) return "মাঝ";
    return "ডান";
  }
  return `স্লট ${toBengaliDigits(index + 1)}`;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:5000"
).replace(/\/$/, "");

export default function ExamHallMapPage() {
  const printAreaRef = useRef(null);
  const requestSeqRef = useRef(0);

  // স্টেটসমূহ
  const [selectedHall, setSelectedHall] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("বার্ষিক পরীক্ষা");
  const [examList, setExamList] = useState([
    "১ম সাময়িক পরীক্ষা",
    "২য় সাময়িক পরীক্ষা",
    "বার্ষিক পরীক্ষা",
  ]);
  const [examYear, setExamYear] = useState(DEFAULT_ACADEMIC_YEAR);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([DEFAULT_ACADEMIC_YEAR]);
  const [showPhotos, setShowPhotos] = useState(true);

  // ডাইনামিক হল কনফিগারেশন স্টেট (প্রতি হল আলাদা অথবা সব হলে গ্লোবালি প্রয়োগ)
  const [hallSettings, setHallSettings] = useState(createDefaultHallSettings);
  const [applyGlobally, setApplyGlobally] = useState(false);

  const activeSetting = hallSettings[selectedHall] || {
    seatsPerTable: 2,
    studentsPerHall: HALL_CONFIGS[selectedHall]?.capacity || 16,
  };
  const seatsPerTable = Math.max(1, activeSetting.seatsPerTable || 2);
  const studentsPerHall = Math.max(1, activeSetting.studentsPerHall || 16);

  // কাস্টম ইনপুট ড্রাফট স্টেট (যাতে ইউজার সংখ্যা টাইপ বা মুছে লিখতে পারেন)
  const [customSeatsInput, setCustomSeatsInput] = useState(String(seatsPerTable));
  const [customCapacityInput, setCustomCapacityInput] = useState(
    String(studentsPerHall)
  );

  // সক্রিয় শিক্ষার্থীর তালিকা (aim-server থেকে লোড)
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // নির্বাচিত হল বা কনফিগ পরিবর্তনে কাস্টম ইনপুট সিঙ্ক
  const syncInputsForHall = useCallback((hallNo, settingsObj) => {
    const cfg = settingsObj[hallNo] || { seatsPerTable: 2, studentsPerHall: 16 };
    setCustomSeatsInput(String(cfg.seatsPerTable));
    setCustomCapacityInput(String(cfg.studentsPerHall));
  }, []);

  const handleSelectHall = (hallNo) => {
    setSelectedHall(hallNo);
    syncInputsForHall(hallNo, hallSettings);
  };

  // প্রতি টেবিলে আসন আপডেট (একক হল অথবা গ্লোবাল)
  const updateSeatsPerTable = useCallback(
    (nextVal) => {
      const safeVal = clampPositiveInt(nextVal, 2, 12);
      setCustomSeatsInput(String(safeVal));
      setHallSettings((prev) => {
        if (applyGlobally) {
          const updated = {};
          ORDERED_HALL_NUMS.forEach((hNo) => {
            updated[hNo] = { ...prev[hNo], seatsPerTable: safeVal };
          });
          return updated;
        }
        return {
          ...prev,
          [selectedHall]: { ...prev[selectedHall], seatsPerTable: safeVal },
        };
      });
    },
    [applyGlobally, selectedHall]
  );

  // প্রতি হলে শিক্ষার্থী/ধারণক্ষমতা আপডেট (একক হল অথবা গ্লোবাল)
  const updateStudentsPerHall = useCallback(
    (nextVal) => {
      const safeVal = clampPositiveInt(nextVal, 16, 300);
      setCustomCapacityInput(String(safeVal));
      setHallSettings((prev) => {
        if (applyGlobally) {
          const updated = {};
          ORDERED_HALL_NUMS.forEach((hNo) => {
            updated[hNo] = { ...prev[hNo], studentsPerHall: safeVal };
          });
          return updated;
        }
        return {
          ...prev,
          [selectedHall]: { ...prev[selectedHall], studentsPerHall: safeVal },
        };
      });
    },
    [applyGlobally, selectedHall]
  );

  // বর্তমান হলের সেটিংস এক ক্লিকে সব হলে প্রয়োগ করা
  const handleApplyCurrentToAllHalls = () => {
    setHallSettings((prev) => {
      const updated = {};
      ORDERED_HALL_NUMS.forEach((hNo) => {
        updated[hNo] = {
          ...prev[hNo],
          seatsPerTable,
          studentsPerHall,
        };
      });
      return updated;
    });
    toast.success(
      `সব হলে ${toBengaliDigits(seatsPerTable)} আসন/টেবিল এবং ${toBengaliDigits(
        studentsPerHall
      )} জন ধারণক্ষমতা প্রয়োগ করা হয়েছে।`
    );
  };

  // ডিফল্ট কনফিগারেশনে রিসেট করা
  const handleResetConfigs = () => {
    const defaults = createDefaultHallSettings();
    setHallSettings(defaults);
    setApplyGlobally(false);
    syncInputsForHall(selectedHall, defaults);
    toast.info("সকল হলের আসন কনফিগারেশন ডিফল্টে রিসেট করা হয়েছে।");
  };

  // পরীক্ষার তালিকা লাইভ লোড (aim-server)
  useEffect(() => {
    let isMounted = true;
    const fetchExams = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admit-cards/exams`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (
          isMounted &&
          data?.success &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setExamList(data.data);
          setSelectedSemester((prev) =>
            data.data.includes(prev) ? prev : data.data[0]
          );
        }
      } catch (err) {
        console.warn("Could not fetch exam list, using defaults:", err);
      }
    };
    fetchExams();
    return () => {
      isMounted = false;
    };
  }, []);

  // aim-server থেকে সকল সক্রিয় ও অনুমোদিত শিক্ষার্থী লোড (hallNo=all)
  const fetchHallData = useCallback(async () => {
    const requestId = ++requestSeqRef.current;
    try {
      setLoading(true);
      setError(null);

<<<<<<< HEAD
      let studentList = [];

      // ১. নির্দিষ্ট হলের সিট প্ল্যান ডাটা লোড
      const currentYearVal = String(selectedYear || examYear || "");
      const queryParams = new URLSearchParams({
        hallNo: String(selectedHall),
        academicYear: currentYearVal,
        examName: String(selectedSemester || ""),
        semester: String(selectedSemester || ""),
        year: currentYearVal,
=======
      const queryParams = new URLSearchParams({
        hallNo: "all",
        semester: selectedSemester,
>>>>>>> 306de04006955912fed5cdfda8df39bd8cb056b0
      });

      const res = await fetch(
        `${API_BASE_URL}/api/seat-plan?${queryParams.toString()}`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }
      );

      if (!res.ok) {
        throw new Error(`aim-server returned ${res.status}`);
      }

      const data = await res.json();
      if (requestId !== requestSeqRef.current) return;

      if (data?.success) {
        const serverYears = Array.isArray(data.years)
          ? Array.from(
              new Set(data.years.map(normalizeYearDisplay).filter(Boolean))
            )
          : [];
        const serverAcademicYear =
          normalizeYearDisplay(data.academicYear) ||
          serverYears[0] ||
          DEFAULT_ACADEMIC_YEAR;

        const mergedYears =
          serverYears.length > 0
            ? serverYears.includes(serverAcademicYear)
              ? serverYears
              : [serverAcademicYear, ...serverYears]
            : [serverAcademicYear];

        setAvailableYears(mergedYears);
        setExamYear(selectedYear || serverAcademicYear);

        const normalizedList = Array.isArray(data.data)
          ? data.data.map((s) => ({
              ...s,
              seatNo: parseSeatNumber(s.seatNo),
              hallNo: parseHallNumber(s.hallNo),
            }))
          : [];

        setAllStudents(normalizedList);
      } else {
        throw new Error(data?.message || "সিট প্ল্যান ডাটা পাওয়া যায়নি।");
      }
<<<<<<< HEAD

      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        studentList = data.data
          .map((s) => ({
            ...s,
            seatNo: parseSeatNumber(s.seatNo),
            hallNo: parseHallNumber(s.hallNo),
          }))
          .filter((s) => s.hallNo === Number(selectedHall) && s.seatNo > 0);
      } else if (!selectedYear) {
        // ফলব্যাক ২: যদি /api/seat-plan খালি থাকে (এবং নির্দিষ্ট বছর ফিল্টার না থাকে), মূল /api/students থেকে ওই হলের একটিভ শিক্ষার্থীদের ফিল্টার
        let fallbackData = null;
        try {
          const fallbackRes = await fetch(
            `${API_BASE_URL}/api/students?status=Approved&activity=active&limit=1000`,
            { cache: "no-store" }
          );
          if (fallbackRes.ok) {
            fallbackData = await fallbackRes.json();
          }
        } catch (e) {
          console.warn("External students fallback failed:", e);
        }

        if (requestId !== requestSeqRef.current) return;

        if (fallbackData?.success && Array.isArray(fallbackData.data)) {
          const derivedYears = Array.from(
            new Set(
              fallbackData.data
                .map((s) => normalizeYearDisplay(s.sessionYear))
                .filter(Boolean)
            )
          ).sort((a, b) => Number(bnToEnDigits(b)) - Number(bnToEnDigits(a)));

          if (derivedYears.length > 0) {
            setAvailableYears((prev) =>
              Array.from(new Set([...derivedYears, ...prev]))
            );
            if (!data?.academicYear) {
              setExamYear(derivedYears[0]);
            }
          }

          studentList = fallbackData.data
            .filter((s) => {
              const h = s.seatPlan?.hallNo || s.hallNo;
              const studentHallNo = parseHallNumber(h);
              return studentHallNo === Number(selectedHall);
            })
            .map((s) => {
              const details = getStudentClassDetails(s);
              const seatNum = parseSeatNumber(s.seatPlan?.seatNo || s.seatNo);
              return {
                _id: s._id?.$oid || s._id || s.studentId,
                hallNo: Number(selectedHall),
                seatNo: seatNum,
                benchNo: s.seatPlan?.benchNo || s.benchNo || (seatNum > 0 ? Math.ceil(seatNum / 2) : ""),
                class: details.className || "N/A",
                divisionName: details.divisionName,
                name: s.studentNameBangla || s.studentNameEnglish || s.name || "নাম নেই",
                studentId: s.studentId || "",
                roll: s.roll || s.officeUse?.rollNumber || "",
                studentImage:
                  s.studentImage ||
                  s.profilePhoto ||
                  s.photoUrl ||
                  s.profileImage ||
                  s.image ||
                  s.avatar ||
                  "",
              };
            })
            .filter((s) => s.seatNo > 0);
        }
      }

      if (requestId !== requestSeqRef.current) return;
      setStudents(studentList);
=======
>>>>>>> 306de04006955912fed5cdfda8df39bd8cb056b0
    } catch (err) {
      if (requestId !== requestSeqRef.current) return;
      console.error("Error loading hall map data:", err);
      setError("সার্ভার থেকে হল ম্যাপ ডাটা লোড করতে সমস্যা হয়েছে।");
      toast.error("সিট প্ল্যান লোড করা যায়নি!");
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [selectedSemester, selectedYear]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHallData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHallData]);

<<<<<<< HEAD
  // সিট নম্বর অনুযায়ী স্টুডেন্টদের ম্যাপ তৈরি (strictly match BOTH seat.hallNo === selectedHall AND seat.seatNo === slotNumber)
  const studentMapBySeatNo = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const studentHall = parseHallNumber(s.hallNo);
      const seat = parseSeatNumber(s.seatNo);
      if (
        studentHall === Number(selectedHall) &&
        seat &&
        !isNaN(seat) &&
        seat > 0
      ) {
        map[seat] = s;
      }
    });
    return map;
  }, [students, selectedHall]);
=======
  // প্রতিটি হলের studentsPerHall সীমা অনুযায়ী সক্রিয় শিক্ষার্থীদের ডাইনামিক স্লাইস ও বণ্টন
  const distributedByHall = useMemo(() => {
    const byHall = {};
    let cursor = 0;

    ORDERED_HALL_NUMS.forEach((hNo) => {
      const cfg = hallSettings[hNo] || {
        seatsPerTable: 2,
        studentsPerHall: HALL_CONFIGS[hNo].capacity,
      };
      const limit = Math.max(1, cfg.studentsPerHall || 1);
      const slice = allStudents.slice(cursor, cursor + limit);
      cursor += limit;

      byHall[hNo] = {
        students: slice,
        capacity: limit,
        seatsPerTable: Math.max(1, cfg.seatsPerTable || 2),
        totalTables: Math.max(1, Math.ceil(limit / Math.max(1, cfg.seatsPerTable || 2))),
      };
    });
>>>>>>> 306de04006955912fed5cdfda8df39bd8cb056b0

    const unassignedStudents = allStudents.slice(cursor);
    const totalCapacityAllHalls = ORDERED_HALL_NUMS.reduce(
      (sum, hNo) => sum + (byHall[hNo]?.capacity || 0),
      0
    );

<<<<<<< HEAD
    const getSeatStudent = (slotNumber) => {
      const candidate = studentMapBySeatNo[slotNumber];
      if (
        candidate &&
        parseHallNumber(candidate.hallNo) === Number(selectedHall) &&
        parseSeatNumber(candidate.seatNo) === slotNumber
      ) {
        return candidate;
      }
      return null;
    };

    for (let r = 0; r < totalRows; r++) {
      // বামের বেঞ্চ (Left Desk)
      const leftSeat1No = currentSeatNo;
      const leftSeat2No = currentSeatNo + 1;
      const leftDesk = {
        benchNo: benchNumber++,
        label: `বেঞ্চ ${toBengaliDigits(benchNumber - 1)}`,
        seatRange: `আসন ${toBengaliDigits(leftSeat1No)} ও ${toBengaliDigits(leftSeat2No)}`,
        leftSeat: {
          seatNo: leftSeat1No,
          student: getSeatStudent(leftSeat1No),
        },
        rightSeat: {
          seatNo: leftSeat2No,
          student: getSeatStudent(leftSeat2No),
        },
      };
      currentSeatNo += 2;

      // ডানের বেঞ্চ (Right Desk)
      const rightSeat1No = currentSeatNo;
      const rightSeat2No = currentSeatNo + 1;
      const rightDesk = {
        benchNo: benchNumber++,
        label: `বেঞ্চ ${toBengaliDigits(benchNumber - 1)}`,
        seatRange: `আসন ${toBengaliDigits(rightSeat1No)} ও ${toBengaliDigits(rightSeat2No)}`,
        leftSeat: {
          seatNo: rightSeat1No,
          student: getSeatStudent(rightSeat1No),
        },
        rightSeat: {
          seatNo: rightSeat2No,
          student: getSeatStudent(rightSeat2No),
        },
      };
      currentSeatNo += 2;
=======
    return {
      byHall,
      unassignedStudents,
      totalCapacityAllHalls,
    };
  }, [allStudents, hallSettings]);

  const currentHallAllocation = useMemo(
    () =>
      distributedByHall.byHall[selectedHall] || {
        students: [],
        capacity: studentsPerHall,
        seatsPerTable,
        totalTables: Math.max(1, Math.ceil(studentsPerHall / seatsPerTable)),
      },
    [distributedByHall.byHall, selectedHall, studentsPerHall, seatsPerTable]
  );
>>>>>>> 306de04006955912fed5cdfda8df39bd8cb056b0

  const activeHallConfig = useMemo(() => {
    const base = HALL_CONFIGS[selectedHall] || HALL_CONFIGS[1];
    const totalTables = Math.max(1, Math.ceil(studentsPerHall / seatsPerTable));
    return {
      ...base,
      seatsPerTable,
      capacity: studentsPerHall,
      deskCount: totalTables,
      rows: seatsPerTable >= 4 ? totalTables : Math.ceil(totalTables / 2),
    };
  }, [selectedHall, seatsPerTable, studentsPerHall]);

  // ডাইনামিক টেবিল চাঙ্কিং (Math.ceil(studentsPerHall / seatsPerTable))
  // এবং বিভাজ্য না হলে শেষ টেবিলে সারিবদ্ধ খালি প্লেসহোল্ডার স্লট যুক্ত করা
  const { tables, deskRows } = useMemo(() => {
    const perTable = Math.max(1, seatsPerTable);
    const hallCap = Math.max(1, studentsPerHall);
    const totalTables = Math.max(1, Math.ceil(hallCap / perTable));
    const hallStudents = currentHallAllocation.students || [];

    const builtTables = [];
    for (let tIdx = 0; tIdx < totalTables; tIdx++) {
      const startSeat = tIdx * perTable + 1;
      const actualEndSeat = Math.min(startSeat + perTable - 1, hallCap);
      const seats = [];

      for (let sOffset = 0; sOffset < perTable; sOffset++) {
        const seatNo = startSeat + sOffset;
        const isPlaceholder = seatNo > hallCap;
        const studentIdx = seatNo - 1;
        seats.push({
          seatNo,
          isPlaceholder,
          positionLabel: getSeatPositionLabel(sOffset, perTable),
          student: isPlaceholder ? null : hallStudents[studentIdx] || null,
        });
      }

      builtTables.push({
        benchNo: tIdx + 1,
        label: `টেবিল ${toBengaliDigits(tIdx + 1)}`,
        seatRange:
          startSeat === actualEndSeat
            ? `আসন ${toBengaliDigits(startSeat)}`
            : perTable === 2
              ? `আসন ${toBengaliDigits(startSeat)} ও ${toBengaliDigits(actualEndSeat)}`
              : `আসন ${toBengaliDigits(startSeat)}–${toBengaliDigits(actualEndSeat)}`,
        seats,
      });
    }

<<<<<<< HEAD
    return rows;
  }, [activeHallConfig, studentMapBySeatNo, selectedHall]);

  // মোট বরাদ্দকৃত সিট এবং ফাঁকা সিটের পরিসংখ্যান
  const stats = useMemo(() => {
    let occupied = 0;
    const capacity = activeHallConfig.capacity;
    for (let i = 1; i <= capacity; i++) {
      const candidate = studentMapBySeatNo[i];
      if (
        candidate &&
        parseHallNumber(candidate.hallNo) === Number(selectedHall) &&
        parseSeatNumber(candidate.seatNo) === i
      ) {
        occupied++;
      }
    }
    const matchingStudents = students.filter(
      (s) => parseHallNumber(s.hallNo) === Number(selectedHall) && parseSeatNumber(s.seatNo) > 0
    );
    return {
      capacity,
      occupied,
      vacant: capacity - occupied,
      totalStudentsFound: matchingStudents.length,
    };
  }, [activeHallConfig, studentMapBySeatNo, students, selectedHall]);
=======
    // ২ বা ৩ আসনের জন্য বাম/ডান ২-কলাম রো, ৪+ আসনের জন্য পূর্ণ-প্রস্থ একক-কলাম রো
    const pairedRows = [];
    if (perTable >= 4) {
      builtTables.forEach((desk, idx) => {
        pairedRows.push({
          rowIdx: idx + 1,
          rowLabel: `সারি ${toBengaliDigits(idx + 1)}`,
          singleDesk: desk,
        });
      });
    } else {
      for (let i = 0; i < builtTables.length; i += 2) {
        pairedRows.push({
          rowIdx: Math.floor(i / 2) + 1,
          rowLabel: `সারি ${toBengaliDigits(Math.floor(i / 2) + 1)}`,
          leftDesk: builtTables[i],
          rightDesk: builtTables[i + 1] || null,
        });
      }
    }

    return { tables: builtTables, deskRows: pairedRows };
  }, [seatsPerTable, studentsPerHall, currentHallAllocation]);

  // হলের পরিসংখ্যান
  const stats = useMemo(() => {
    const occupied = currentHallAllocation.students.length;
    const capacity = activeHallConfig.capacity;
    return {
      capacity,
      occupied,
      vacant: Math.max(0, capacity - occupied),
      totalTables: tables.length,
      seatsPerTable,
      totalActiveAllHalls: allStudents.length,
      unassignedAllHalls: distributedByHall.unassignedStudents.length,
    };
  }, [
    currentHallAllocation,
    activeHallConfig,
    tables.length,
    seatsPerTable,
    allStudents.length,
    distributedByHall.unassignedStudents.length,
  ]);
>>>>>>> 306de04006955912fed5cdfda8df39bd8cb056b0

  // প্রিন্ট হ্যান্ডলার (react-to-print)
  const reactToPrintFn = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Exam-Hall-Map-${activeHallConfig.name}-${seatsPerTable}x${tables.length}-${selectedSemester}-${examYear}`,
    suppressErrors: true,
    onPrintError: (errorLocation, err) => {
      console.warn("Print error suppressed:", errorLocation, err);
      setIsPrinting(false);
    },
    onBeforePrint: async () => {
      setIsPrinting(true);
      if (printAreaRef.current) {
        const images = Array.from(printAreaRef.current.querySelectorAll("img"));
        await Promise.all(
          images.map((img) => {
            if (img.complete && img.naturalWidth > 0) {
              return typeof img.decode === "function"
                ? img.decode().catch(() => {})
                : Promise.resolve();
            }
            return new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            });
          })
        );
      }
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    if (!printAreaRef.current || isPrinting) return;
    reactToPrintFn();
  };

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-slate-50 min-h-screen space-y-5 font-bornomala text-slate-800">
      {/* ----------------- ১. পেজ হেডার ও নেভিগেশন বার ----------------- */}
      <div className="print:hidden bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-entry"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সিট প্ল্যান এন্ট্রি</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/seat-stickers"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
            >
              <span>আসন স্টিকার</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <Link
              href="/dashboard/shared/academics/exam-results/exam/seat-plan/Hall&Class-wise-summary"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
            >
              <span>হল সামারি</span>
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">হল ম্যাপ</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#043e30] tracking-tight flex flex-wrap items-center gap-2">
            <span>পরীক্ষার হল ম্যাপ ও আসন বিন্যাস</span>
            <span className="bg-emerald-100 text-[#043e30] text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              Dynamic Floor Plan
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {toBengaliDigits(seatsPerTable)}-সিটার টেবিল, মোট{" "}
            {toBengaliDigits(stats.totalTables)} টি টেবিল ও{" "}
            {toBengaliDigits(stats.capacity)} জন ধারণক্ষমতা সংবলিত ডাইনামিক শ্রেণিকক্ষ আসন বিন্যাস।
          </p>
        </div>

        {/* প্রিন্ট বাটন এবং ছবি টগল */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowPhotos((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showPhotos
                ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
                : "bg-slate-100 text-slate-600 border-slate-300"
            }`}
          >
            {showPhotos ? (
              <>
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>ছবি দৃশ্যমান</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>ছবি লুকানো</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || isPrinting}
            className="inline-flex items-center gap-2 bg-[#043e30] hover:bg-[#065341] text-amber-300 hover:text-amber-200 font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>
                  প্রিন্ট হল ম্যাপ ({seatsPerTable >= 3 ? "A4 Landscape" : "A4 Portrait"})
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ----------------- ২. ডাইনামিক কনফিগারেশন ও হল নির্বাচন কন্ট্রোল বার ----------------- */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* ২.১ হল নির্বাচন ট্যাবসমূহ */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
              হল ও কক্ষ নির্বাচন করুন:
            </label>
            <span className="text-[11px] font-bold text-slate-500 font-ubuntu">
              সক্রিয় মোট শিক্ষার্থী: {toBengaliDigits(stats.totalActiveAllHalls)} জন
              {stats.unassignedAllHalls > 0 && (
                <span className="ml-2 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  অবশিষ্ট (হল সীমার বাইরে): {toBengaliDigits(stats.unassignedAllHalls)} জন
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ORDERED_HALL_NUMS.map((hNo) => {
              const hall = HALL_CONFIGS[hNo];
              const alloc = distributedByHall.byHall[hNo];
              const isSelected = selectedHall === hNo;
              return (
                <button
                  key={hNo}
                  type="button"
                  onClick={() => handleSelectHall(hNo)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? "bg-[#043e30] text-white border-[#043e30] shadow-sm ring-2 ring-emerald-600/30"
                      : "bg-slate-50 hover:bg-emerald-50/50 text-slate-700 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-amber-300 text-slate-900"
                          : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {hall.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-ubuntu ${
                        isSelected ? "text-amber-200" : "text-emerald-800"
                      }`}
                    >
                      {toBengaliDigits(alloc?.students.length || 0)}/
                      {toBengaliDigits(alloc?.capacity || hall.capacity)} জন
                    </span>
                  </div>
                  <h4
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {hall.location}
                  </h4>
                  <div
                    className={`text-[10px] font-bold font-ubuntu flex items-center justify-between ${
                      isSelected ? "text-emerald-200" : "text-slate-500"
                    }`}
                  >
                    <span>{toBengaliDigits(alloc?.totalTables || 1)} টেবিল</span>
                    <span>•</span>
                    <span>
                      {toBengaliDigits(alloc?.seatsPerTable || 2)} আসন/টেবিল
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ২.২ ডাইনামিক টেবিল আসন ও হলের ধারণক্ষমতা কন্ট্রোল প্যানেল */}
        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200/60">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#043e30]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                ডাইনামিক আসন কনফিগারেশন (
                {applyGlobally ? "সকল হল" : activeHallConfig.name})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {/* একক হল বনাম গ্লোবাল মোড টগল */}
              <div
                role="radiogroup"
                aria-label="Configuration Scope"
                className="inline-flex items-center bg-white p-0.5 rounded-lg border border-slate-300"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={!applyGlobally}
                  onClick={() => setApplyGlobally(false)}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    !applyGlobally
                      ? "bg-[#043e30] text-amber-300"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  শুধু এই হল
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={applyGlobally}
                  onClick={() => setApplyGlobally(true)}
                  className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    applyGlobally
                      ? "bg-[#043e30] text-amber-300"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>সব হল (Global)</span>
                </button>
              </div>

              {!applyGlobally && (
                <button
                  type="button"
                  onClick={handleApplyCurrentToAllHalls}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold transition-colors cursor-pointer"
                  title="বর্তমান হলের সেটিংস সব হলে প্রয়োগ করুন"
                >
                  <Globe className="w-3 h-3" />
                  <span>সব হলে প্রয়োগ করুন</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetConfigs}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-bold transition-colors cursor-pointer"
                title="ডিফল্ট সেটিংসে ফিরিয়ে নিন"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
            {/* ক) প্রতি টেবিলে আসন (Seats per Table) */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-slate-700 flex items-center gap-1 shrink-0">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                প্রতি টেবিলে আসন:
              </span>
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {SEATS_PER_TABLE_PRESETS.map((count) => {
                  const active = seatsPerTable === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateSeatsPerTable(count)}
                      className={`px-2.5 py-1 rounded-md font-bold font-ubuntu transition-all cursor-pointer ${
                        active
                          ? "bg-[#043e30] text-amber-300 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {toBengaliDigits(count)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <label
                  htmlFor="custom-seats-per-table"
                  className="text-[11px] font-bold text-slate-500"
                >
                  কাস্টম:
                </label>
                <input
                  id="custom-seats-per-table"
                  type="number"
                  min={1}
                  max={12}
                  value={customSeatsInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setCustomSeatsInput(raw);
                    const parsed = parseInt(raw, 10);
                    if (!isNaN(parsed) && parsed >= 1) {
                      updateSeatsPerTable(parsed);
                    }
                  }}
                  onBlur={() => {
                    const safe = clampPositiveInt(customSeatsInput, seatsPerTable, 12);
                    updateSeatsPerTable(safe);
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 font-bold font-ubuntu text-center text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* খ) প্রতি হলে শিক্ষার্থী / ধারণক্ষমতা (Students per Hall) */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-slate-700 flex items-center gap-1 shrink-0">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
                হলের ধারণক্ষমতা:
              </span>
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {STUDENTS_PER_HALL_PRESETS.map((cap) => {
                  const active = studentsPerHall === cap;
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => updateStudentsPerHall(cap)}
                      className={`px-2.5 py-1 rounded-md font-bold font-ubuntu transition-all cursor-pointer ${
                        active
                          ? "bg-[#043e30] text-amber-300 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {toBengaliDigits(cap)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <label
                  htmlFor="custom-students-per-hall"
                  className="text-[11px] font-bold text-slate-500"
                >
                  কাস্টম:
                </label>
                <input
                  id="custom-students-per-hall"
                  type="number"
                  min={1}
                  max={300}
                  value={customCapacityInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setCustomCapacityInput(raw);
                    const parsed = parseInt(raw, 10);
                    if (!isNaN(parsed) && parsed >= 1) {
                      updateStudentsPerHall(parsed);
                    }
                  }}
                  onBlur={() => {
                    const safe = clampPositiveInt(
                      customCapacityInput,
                      studentsPerHall,
                      300
                    );
                    updateStudentsPerHall(safe);
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 font-bold font-ubuntu text-center text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ২.৩ পরীক্ষা, শিক্ষাবর্ষ ও লাইভ সামারি ব্যাজ */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">পরীক্ষা:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 focus:outline-emerald-600 cursor-pointer"
              >
                {examList.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">শিক্ষাবর্ষ:</span>
              <select
                value={selectedYear || examYear}
                onChange={(e) => {
                  const nextYear = e.target.value;
                  setSelectedYear(nextYear);
                  setExamYear(nextYear);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 font-ubuntu focus:outline-emerald-600 cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {toBengaliDigits(yr)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* লাইভ স্ট্যাটাস কাউন্ট */}
          <div className="flex flex-wrap items-center gap-2 font-ubuntu">
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              মোট শিক্ষার্থী:{" "}
              <strong className="text-emerald-950 font-black">
                {toBengaliDigits(stats.occupied)}
              </strong>
              /{toBengaliDigits(stats.capacity)}
            </span>
            <span className="bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-1 rounded-lg font-bold">
              মোট টেবিল:{" "}
              <strong className="text-sky-950 font-black">
                {toBengaliDigits(stats.totalTables)}
              </strong>{" "}
              ({toBengaliDigits(stats.seatsPerTable)} আসন/টেবিল)
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
              ফাঁকা আসন:{" "}
              <strong className="text-amber-950 font-black">
                {toBengaliDigits(stats.vacant)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ----------------- ৩. অন-স্ক্রিন ক্লাসরুম ফ্লোর প্ল্যান ভিউ ----------------- */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            <p className="font-bold text-sm">হল ম্যাপ ও শ্রেণিকক্ষ সাজানো হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchHallData}
              className="text-xs font-bold underline cursor-pointer text-rose-700"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* রুম ইনফো টাইটেল ব্যানার */}
            <div className="bg-gradient-to-r from-[#043e30] to-[#085a47] text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                  পরীক্ষার হল ও আসন ম্যাপ
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-black text-amber-200">
                  {activeHallConfig.fullTitle}
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {selectedSemester} - {toBengaliDigits(examYear)} শিক্ষাবর্ষ • মোট শিক্ষার্থী:{" "}
                  {toBengaliDigits(stats.occupied)}/{toBengaliDigits(stats.capacity)} জন
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-center shrink-0">
                <span className="text-[10px] text-emerald-200 block font-semibold">
                  ডাইনামিক বিন্যাস ({toBengaliDigits(stats.totalTables)} টেবিল)
                </span>
                <span className="text-sm font-black text-white">
                  প্রতি টেবিলে {toBengaliDigits(seatsPerTable)} আসন •{" "}
                  {seatsPerTable >= 4 ? "পূর্ণ সারি" : "২ কলাম ও আইল"}
                </span>
              </div>
            </div>

            {/* সম্মুখভাগ নির্দেশক (Whiteboard & Invigilator Desk) */}
            <div className="bg-slate-800 text-white border-2 border-slate-700 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪑</span>
                <div>
                  <span className="text-xs font-black text-amber-300 block">
                    শিক্ষক টেবিল ও ডায়াস (সম্মুখভাগ)
                  </span>
                  <span className="text-[10px] text-slate-300">
                    Invigilator Desk • সম্মুখ দিক
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-1 text-center hidden sm:block">
                <span className="text-xs font-black text-emerald-300 tracking-wide">
                  📋 হোয়াইটবোর্ড এলাকা (Whiteboard)
                </span>
              </div>

              <div className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700 shrink-0">
                প্রবেশদ্বার 🚪
              </div>
            </div>

            {/* ক্লাসরুম গ্রিড */}
            <div className="space-y-4">
              {deskRows.map((row) =>
                row.singleDesk ? (
                  <div key={`row-${row.rowIdx}`} className="w-full">
                    <DeskContainer
                      desk={row.singleDesk}
                      seatsPerTable={seatsPerTable}
                      showPhoto={showPhotos}
                    />
                  </div>
                ) : (
                  <div
                    key={`row-${row.rowIdx}`}
                    className={`grid gap-2.5 sm:gap-3 items-stretch ${
                      seatsPerTable === 3
                        ? "grid-cols-1 xl:grid-cols-[1fr_auto_1fr]"
                        : "grid-cols-1 md:grid-cols-[1fr_auto_1fr]"
                    }`}
                  >
                    {/* বাম পাশের টেবিল */}
                    <DeskContainer
                      desk={row.leftDesk}
                      seatsPerTable={seatsPerTable}
                      showPhoto={showPhotos}
                    />

                    {/* কেন্দ্রীয় হাঁটার পথ (Central Walking Aisle) */}
                    <div
                      className={`${
                        seatsPerTable === 3 ? "hidden xl:flex" : "hidden md:flex"
                      } w-10 sm:w-12 flex-col items-center justify-center border-x-2 border-dashed border-slate-300 bg-slate-100/70 rounded-md select-none py-2 text-center`}
                    >
                      <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
                        হাঁটার পথ (AISLE)
                      </span>
                    </div>

                    {/* ডান পাশের টেবিল (বিজোড় সংখ্যক টেবিল হলে সারিবদ্ধ খালি স্পেসার) */}
                    {row.rightDesk ? (
                      <DeskContainer
                        desk={row.rightDesk}
                        seatsPerTable={seatsPerTable}
                        showPhoto={showPhotos}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="hidden md:flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200/70 bg-slate-50/40 text-[11px] font-bold text-slate-300"
                      >
                        খালি স্থান
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* ক্লাসরুম পেছনের সীমানা নির্দেশক */}
            <div className="text-center py-2 border-t-2 border-dashed border-slate-300 text-xs font-bold text-slate-400">
              শ্রেণিকক্ষের শেষ প্রান্ত (Back of Classroom)
            </div>
          </div>
        )}
      </div>

      {/* ----------------- ৪. অফ-স্ক্রিন প্রিন্ট এলিমেন্ট (A4 Print View via react-to-print) ----------------- */}
      <div
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden pointer-events-none"
      >
        <div
          ref={printAreaRef}
          style={{ width: seatsPerTable >= 3 ? "297mm" : "210mm" }}
        >
          <HallMapPrintTemplate
            hallConfig={activeHallConfig}
            semester={selectedSemester}
            year={examYear}
            deskRows={deskRows}
            stats={stats}
            seatsPerTable={seatsPerTable}
            showPhoto={showPhotos}
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ডাইনামিক টেবিল/বেঞ্চ কন্টেইনার কম্পোনেন্ট (Desk Container)
// -------------------------------------------------------------
function DeskContainer({ desk, seatsPerTable = 2, showPhoto = true, isPrint = false }) {
  const isDense = seatsPerTable >= 3;
  const isUltraDense = seatsPerTable >= 5;

  // অন-স্ক্রিন রেসপন্সিভ গ্রিড (যাতে ২, ৩, ৪, ৫ বা কাস্টম N আসন কখনো ওভারফ্লো না করে)
  const getScreenGridClass = () => {
    if (seatsPerTable === 1) return "grid-cols-1";
    if (seatsPerTable === 2) return "grid-cols-1 sm:grid-cols-2";
    if (seatsPerTable === 3) return "grid-cols-1 sm:grid-cols-3";
    if (seatsPerTable === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (seatsPerTable === 5) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const useCustomInlineCols = isPrint || seatsPerTable > 5;
  const inlineGridStyle = useCustomInlineCols
    ? {
        gridTemplateColumns: `repeat(${seatsPerTable}, minmax(${
          isPrint ? "0" : "150px"
        }, 1fr))`,
      }
    : undefined;

  return (
    <div
      className={`bg-white border-2 border-slate-300 rounded-xl shadow-2xs flex flex-col justify-between min-w-0 ${
        isPrint
          ? isDense
            ? "print-desk-box p-1.5"
            : "print-desk-box p-2"
          : "p-2 sm:p-2.5"
      }`}
    >
      {/* টেবিলের পরিচিতি হেডার */}
      <div className="flex items-center justify-between gap-1 border-b border-slate-200 pb-1 mb-1.5 text-[9px] sm:text-[10px] text-slate-600 font-bold">
        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-ubuntu font-bold border border-slate-200 shrink-0">
          {desk.label}
        </span>
        <span className="text-slate-500 font-ubuntu truncate">{desk.seatRange}</span>
      </div>

      {/* ডাইনামিক আসন গ্রিড */}
      <div className={!isPrint && seatsPerTable > 5 ? "overflow-x-auto pb-1" : ""}>
        <div
          style={inlineGridStyle}
          className={`grid items-stretch flex-1 ${
            isPrint
              ? isUltraDense
                ? "gap-1"
                : "gap-1.5"
              : useCustomInlineCols
                ? "gap-1.5"
                : `${getScreenGridClass()} gap-1.5 sm:gap-2`
          }`}
        >
          {(desk.seats || []).map((slot) => (
            <StudentSeatCard
              key={slot.seatNo}
              slot={slot}
              positionLabel={slot.positionLabel}
              seatsPerTable={seatsPerTable}
              showPhoto={showPhoto}
              isPrint={isPrint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// একক শিক্ষার্থীর আসন কার্ড কম্পোনেন্ট (Student Seat Card)
// -------------------------------------------------------------
function StudentSeatCard({
  slot,
  positionLabel,
  seatsPerTable = 2,
  showPhoto = true,
  isPrint = false,
}) {
  const { seatNo, student, isPlaceholder } = slot;
  const isOccupied = Boolean(student);
  const isDense = seatsPerTable >= 3;
  const isUltraDense = seatsPerTable >= 5;

  // বিভাজ্য না হলে শেষ টেবিলের সারিবদ্ধতা রক্ষার জন্য অতিরিক্ত প্লেসহোল্ডার স্লট
  if (isPlaceholder) {
    return (
      <div
        className={`border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center bg-slate-50/30 text-slate-300 min-w-0 ${
          isPrint
            ? isUltraDense
              ? "h-[22mm] p-1"
              : isDense
                ? "h-[24mm] p-1"
                : "h-[34mm] p-2"
            : isDense
              ? "min-h-[80px] p-1.5"
              : "min-h-[85px] p-2"
        }`}
      >
        <span className="text-[8px] font-bold">খালি স্লট</span>
      </div>
    );
  }

  if (!isOccupied) {
    return (
      <div
        className={`border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-between text-center bg-slate-50/50 text-slate-400 min-w-0 ${
          isPrint
            ? isUltraDense
              ? "h-[22mm] p-1"
              : isDense
                ? "h-[24mm] p-1"
                : "h-[34mm] p-2"
            : isDense
              ? "min-h-[80px] p-1.5"
              : "min-h-[85px] p-2"
        }`}
      >
        <div className="flex items-center justify-between w-full gap-0.5">
          <span className="bg-slate-200 text-slate-600 font-bold text-[8.5px] px-1 py-0.2 rounded font-ubuntu shrink-0">
            আসন {toBengaliDigits(seatNo)}
          </span>
          <span className="text-[7.5px] text-slate-400 truncate">
            {positionLabel}
          </span>
        </div>
        <div className="my-auto">
          <span
            className={`${
              isDense && isPrint ? "text-xs" : "text-sm"
            } block opacity-40`}
          >
            🪑
          </span>
          <span
            className={`${
              isDense ? "text-[8.5px]" : "text-[9.5px]"
            } font-bold text-slate-400`}
          >
            ফাঁকা আসন
          </span>
        </div>
        <span className="text-[7px] text-slate-400">অবরাদ্দকৃত</span>
      </div>
    );
  }

  const studentClass = student.class || "প্রযোজ্য নয়";
  const rollDisplay = student.roll ? toBengaliDigits(student.roll) : "—";
  const idDisplay = student.studentId ? toBengaliDigits(student.studentId) : "—";

  return (
    <div
      className={`bg-white border border-slate-300 rounded-lg flex flex-col justify-between transition-all relative overflow-hidden shadow-2xs min-w-0 ${
        isPrint
          ? isUltraDense
            ? "h-[22mm] p-1"
            : isDense
              ? "h-[24mm] p-1"
              : "h-[34mm] p-1.5"
          : isDense
            ? "min-h-[80px] p-1.5"
            : "min-h-[85px] p-1.5 sm:p-2"
      }`}
    >
      {/* ১. টপ বার: হাই-কন্ট্রাস্ট আসন ব্যাজ ও শ্রেণি */}
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span
          className={`bg-[#043e30] text-amber-300 font-black px-1.5 py-0.2 rounded font-ubuntu leading-tight shrink-0 shadow-2xs ${
            isUltraDense
              ? "text-[8px]"
              : isDense
                ? "text-[9px]"
                : "text-[10px] sm:text-[10.5px]"
          }`}
        >
          আসন {toBengaliDigits(seatNo)}
        </span>
        <span
          className={`bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold px-1 py-0.2 rounded truncate ${
            isUltraDense
              ? "text-[7.5px] max-w-[52px]"
              : isDense
                ? "text-[8px] max-w-[65px]"
                : "text-[8.5px] sm:text-[9px] max-w-[85px]"
          }`}
        >
          {studentClass}
        </span>
      </div>

      {/* ২. মূল বডি: ছবি + নাম ও রোল */}
      <div
        className={`flex items-center my-auto min-w-0 ${
          isDense ? "gap-1" : "gap-1.5 sm:gap-2"
        }`}
      >
        {showPhoto && (
          <div
            className={`rounded-full border border-slate-300 overflow-hidden relative bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs ${
              isUltraDense
                ? isPrint
                  ? "w-5 h-5"
                  : "w-6 h-6"
                : isDense
                  ? isPrint
                    ? "w-6 h-6"
                    : "w-7 h-7"
                  : "w-8 h-8 sm:w-9 sm:h-9"
            }`}
          >
            {isValidImageUrl(student.studentImage) ? (
              <img
                src={student.studentImage.trim()}
                alt={student.name}
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                }}
              />
            ) : (
              <span className="text-[10px] sm:text-xs text-slate-400">👤</span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4
            className={`font-black text-slate-900 leading-tight truncate ${
              isUltraDense
                ? isPrint
                  ? "text-[8.5px]"
                  : "text-[9.5px]"
                : isDense
                  ? isPrint
                    ? "text-[9px]"
                    : "text-[10.5px]"
                  : "text-[11px] sm:text-[11.5px]"
            }`}
          >
            {student.name}
          </h4>
          <div
            className={`text-slate-600 font-ubuntu font-bold flex items-center gap-1 mt-0.5 truncate ${
              isUltraDense
                ? isPrint
                  ? "text-[6.5px]"
                  : "text-[7.5px]"
                : isDense
                  ? isPrint
                    ? "text-[7px]"
                    : "text-[8px]"
                  : "text-[8.5px] sm:text-[9px]"
            }`}
          >
            <span>রোল: {rollDisplay}</span>
            <span>•</span>
            <span className="text-slate-500 truncate">আইডি: {idDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// A4 ডাইনামিক প্রিন্ট টেমপ্লেট কম্পোনেন্ট (react-to-print)
// -------------------------------------------------------------
function HallMapPrintTemplate({
  hallConfig,
  semester,
  year,
  deskRows,
  stats,
  seatsPerTable = 2,
  showPhoto = true,
}) {
  const isLandscape = seatsPerTable >= 3;
  const isSingleColumn = seatsPerTable >= 4;
  const rowsPerPage = seatsPerTable >= 5 ? 5 : isSingleColumn ? 4 : isLandscape ? 4 : 6;

  const pages = [];
  for (let i = 0; i < deskRows.length; i += rowsPerPage) {
    pages.push(deskRows.slice(i, i + rowsPerPage));
  }
  if (pages.length === 0) {
    pages.push([]);
  }
  const isMultiPage = pages.length > 1;

  return (
    <div className="font-bornomala text-slate-900 bg-white">
      {/* প্রিন্ট স্টাইল ইনজেকশন */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 ${isLandscape ? "landscape" : "portrait"};
              margin: 8mm;
            }
            @media print {
              html, body {
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                color: #000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: 'Bornomala', 'Ubuntu Sans', sans-serif !important;
              }
              .no-print {
                display: none !important;
              }
              .hall-print-sheet {
                width: ${isLandscape ? "281mm" : "194mm"} !important;
                min-height: ${isLandscape ? "190mm" : "275mm"} !important;
                max-height: ${isLandscape ? "194mm" : "281mm"} !important;
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                overflow: hidden !important;
              }
              .hall-print-sheet:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
              }
              .print-desk-box {
                box-sizing: border-box !important;
                border: 1.5px solid #94a3b8 !important;
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
        }}
      />

      {pages.map((pageRows, pageIdx) => (
        <div
          key={`page-${pageIdx}`}
          className={`hall-print-sheet ${
            isLandscape ? "w-[281mm] h-[192mm]" : "w-[194mm] h-[278mm]"
          } mx-auto p-0 flex flex-col justify-between overflow-hidden bg-white`}
        >
          {/* ১. প্রাতিষ্ঠানিক প্রিন্ট হেডার */}
          <div className="border-b-2 border-[#043e30] pb-1.5 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              {/* লোগো */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-emerald-900/30">
                <img
                  src={siteConfig.assets.logo}
                  alt={`${siteConfig.name.short} Logo`}
                  width={48}
                  height={48}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.05]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                  }}
                />
              </div>

              {/* মাদ্রাসার নাম ও হলের টাইটেল */}
              <div className="flex-1 text-center min-w-0">
                <h2 className="text-lg font-black text-[#043e30] tracking-tight leading-tight">
                  {siteConfig.name.bn}
                </h2>
                <p className="text-[9.5px] text-slate-600 font-bold">
                  {siteConfig.address.bn}
                </p>
                <div className="inline-block bg-[#043e30] text-amber-300 font-black text-[11px] px-3 py-0.5 rounded-full mt-0.5 font-ubuntu shadow-2xs">
                  {hallConfig.fullTitle} • {toBengaliDigits(stats.totalTables)} টেবিল ×{" "}
                  {toBengaliDigits(seatsPerTable)} আসন
                </div>
              </div>

              {/* পরীক্ষার তথ্য ও পৃষ্ঠা নম্বর */}
              <div className="text-right shrink-0 space-y-0.5 text-[9px] text-slate-700">
                <div className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-emerald-950">
                  {semester}
                </div>
                <div className="font-ubuntu font-bold">
                  শিক্ষাবর্ষ: {toBengaliDigits(year)}
                </div>
                {isMultiPage && (
                  <div className="text-[8px] text-slate-500 font-bold">
                    পৃষ্ঠা {toBengaliDigits(pageIdx + 1)}/
                    {toBengaliDigits(pages.length)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ২. সম্মুখভাগ নির্দেশক (Whiteboard & Front Indicator) */}
          <div className="bg-slate-900 text-white rounded-lg px-3 py-1 flex items-center justify-between text-[10px] font-bold my-1 flex-shrink-0 border border-slate-700">
            <span className="text-amber-300">
              🪑 সম্মুখভাগ: শিক্ষক টেবিল ও ইনভিজিলেটর ডায়াস
            </span>
            <span className="bg-slate-800 px-3 py-0.5 rounded text-emerald-300 border border-slate-600">
              📋 হোয়াইটবোর্ড
            </span>
            <span className="text-slate-300">প্রবেশ পথ 🚪</span>
          </div>

          {/* ৩. মূল ক্লাসরুম টেবিল গ্রিড */}
          <div className="flex-1 flex flex-col justify-around py-0.5">
            {pageRows.map((row) =>
              row.singleDesk ? (
                <div key={`print-row-${row.rowIdx}`} className="w-full my-0.5">
                  <DeskContainer
                    desk={row.singleDesk}
                    seatsPerTable={seatsPerTable}
                    showPhoto={showPhoto}
                    isPrint={true}
                  />
                </div>
              ) : (
                <div
                  key={`print-row-${row.rowIdx}`}
                  className={`grid gap-x-1 items-stretch my-0.5 ${
                    isLandscape
                      ? "grid-cols-[134mm_11mm_134mm]"
                      : "grid-cols-[89mm_12mm_89mm]"
                  }`}
                >
                  {/* বাম পাশের টেবিল */}
                  <DeskContainer
                    desk={row.leftDesk}
                    seatsPerTable={seatsPerTable}
                    showPhoto={showPhoto}
                    isPrint={true}
                  />

                  {/* হাঁটার পথ (Central Aisle) */}
                  <div className="flex flex-col items-center justify-around border-x border-dashed border-slate-300 bg-slate-50 rounded select-none py-1 text-center">
                    <span className="text-[7px] font-black text-slate-400 tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
                      আইল
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <span className="text-[7px] font-black text-slate-400 tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
                      আইল
                    </span>
                  </div>

                  {/* ডান পাশের টেবিল */}
                  {row.rightDesk ? (
                    <DeskContainer
                      desk={row.rightDesk}
                      seatsPerTable={seatsPerTable}
                      showPhoto={showPhoto}
                      isPrint={true}
                    />
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40" />
                  )}
                </div>
              )
            )}
          </div>

          {/* ৪. প্রিন্ট ফুটার (স্বাক্ষর ও পরিসংখ্যান) */}
          <div className="border-t border-slate-300 pt-1.5 flex items-end justify-between text-[9px] text-slate-600 flex-shrink-0">
            <div className="font-ubuntu space-y-0.5">
              <div>
                ধারণক্ষমতা: <strong>{toBengaliDigits(stats.capacity)}</strong> জন |
                মোট টেবিল: <strong>{toBengaliDigits(stats.totalTables)}</strong> টি |
                প্রতি টেবিলে: <strong>{toBengaliDigits(seatsPerTable)}</strong> আসন |
                উপস্থিত শিক্ষার্থী:{" "}
                <strong>{toBengaliDigits(stats.occupied)}</strong> জন
              </div>
              <div className="text-[7.5px] text-slate-400">
                মুদ্রণ তারিখ: {toBengaliDigits(new Date().toLocaleDateString("bn-BD"))}
              </div>
            </div>

            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
                <span className="text-[8px] font-bold text-slate-700">
                  হল পরিদর্শক স্বাক্ষর
                </span>
              </div>
              <div>
                <div className="w-24 border-b border-dashed border-slate-400 mb-0.5"></div>
                <span className="text-[8px] font-bold text-slate-700">
                  পরীক্ষা নিয়ন্ত্রক / অধ্যক্ষ
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
