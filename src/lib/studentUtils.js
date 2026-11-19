export const SESSION_YEARS = [
  "২০২৬",
  "২০২৫",
  "২০২৪",
  "২০২৩",
  "২০২২",
  "২০২১",
  "২০২০",
  "২০১৯",
  "২০১৮",
];

export const RECENT_SESSION_YEARS = [
  "২০২৬",
  "২০২৫",
  "২০২৪",
  "২০২৩",
  "২০২২",
  "২০২১",
];

export const FEE_CATEGORIES = [
  "General",
  "Orphan",
  "Poor Fund",
  "Scholarship",
  "Staff Child",
];

export const CLASS_ORDER = [
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
  "নবম",
  "দশম",
  "১১শ শ্রেণি",
  "১২শ শ্রেণি",
  "কায়দা/আমপারা",
  "নাজেরা",
  "সবক",
  "শুনানি",
];

const EN_TO_BN = {
  0: "০",
  1: "১",
  2: "২",
  3: "৩",
  4: "৪",
  5: "৫",
  6: "৬",
  7: "৭",
  8: "৮",
  9: "৯",
};

const BN_TO_EN = {
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

export const toBengaliDigits = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).replace(/[0-9]/g, (d) => EN_TO_BN[d] ?? d);
};

export const toEnglishDigits = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).replace(/[০-৯]/g, (d) => BN_TO_EN[d] ?? d);
};

export const parseRollNumber = (r) => {
  if (!r || r === "N/A") return Infinity;
  const enStr = toEnglishDigits(r);
  const num = parseInt(enStr, 10);
  return isNaN(num) ? Infinity : num;
};

// একাডেমি টাইপ ভিত্তিক ক্লাসের তালিকা পাওয়ার ফাংশন
export const getAcademyClasses = (academyType) => {
  if (academyType === "প্রাক-প্রাথমিক") return ["প্লে", "নার্সারি"];
  if (academyType === "প্রাথমিক")
    return ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম"];
  if (academyType === "মাধ্যমিক")
    return ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
  if (academyType === "উচ্চমাধ্যমিক") return ["১১শ শ্রেণি", "১২শ শ্রেণি"];
  return [];
};

// বিভাগ অনুযায়ী ক্লাসের ড্রপডাউন অপশন ডায়নামিকভাবে তৈরি করা
export const getClassOptions = (
  selectedDivision,
  selectedAcademyType = "all",
  { includeHigherSecondary = true } = {},
) => {
  if (selectedDivision === "preHifz") {
    return ["কায়দা/আমপারা", "নাজেরা"];
  }
  if (selectedDivision === "hifz") {
    return ["সবক", "শুনানি"];
  }
  if (selectedDivision === "academy") {
    if (selectedAcademyType !== "all") {
      return getAcademyClasses(selectedAcademyType);
    }
    const baseClasses = [
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
      "নবম",
      "দশম",
    ];
    return includeHigherSecondary
      ? [...baseClasses, "১১শ শ্রেণি", "১২শ শ্রেণি"]
      : baseClasses;
  }
  return [];
};

// শিক্ষার্থীর একটিভ বিভাগ, ক্লাস ও টাইপ বের করার হেলপার ফাংশন
export const getStudentClassDetails = (
  student,
  { hifzLabel = "হিফজ", fallbackLabel = "অন্যান্য" } = {},
) => {
  if (!student) {
    return {
      divisionKey: "none",
      divisionName: "N/A",
      className: "N/A",
      type: "N/A",
      academyType: "",
    };
  }
  if (student?.divisionPreHifz?.active) {
    return {
      divisionKey: "preHifz",
      divisionName: "প্রি-হিফজ",
      className: student.divisionPreHifz.class || "N/A",
      type: student.divisionPreHifz.type || "N/A",
      academyType: "",
    };
  }
  if (student?.divisionHifz?.active) {
    return {
      divisionKey: "hifz",
      divisionName: hifzLabel,
      className: student.divisionHifz.class || "N/A",
      type: student.divisionHifz.type || "N/A",
      academyType: "",
    };
  }
  if (student?.divisionAcademy?.active) {
    return {
      divisionKey: "academy",
      divisionName: "একাডেমিক",
      className: student.divisionAcademy.class || "N/A",
      type: student.divisionAcademy.type || "N/A",
      academyType: student.divisionAcademy.academyType || "",
    };
  }
  return {
    divisionKey: "none",
    divisionName: fallbackLabel,
    className: student?.officeUse?.recommendedClass || "N/A",
    type: "N/A",
    academyType: "",
  };
};

/**
 * প্রাতিষ্ঠানিক নির্দেশনানুযায়ী শ্রেণির ক্রমভিত্তিক র্যাংক (Class Rank)
 * প্লে (Play) সবার উপরে এবং হিফজ (Hifz) সবার নিচে
 */
export const getClassRank = (clsName, divisionKey) => {
  if (!clsName && !divisionKey) return 999;
  const name = String(clsName || "").trim().toLowerCase();

  // ১. প্লে / Play
  if (name.includes("প্লে") || name === "play") return 10;
  // ২. নার্সারি / Nursery
  if (name.includes("নার্সারি") || name.includes("নার্সারী") || name === "nursery") return 20;
  // ৩. কেজি / KG
  if (name.includes("কেজি") || name.includes("কে.জি") || name === "kg") return 30;
  // ৪. প্রথম / ১ম / Class One / 1
  if (name.includes("প্রথম") || name.includes("১ম") || name === "one" || name === "1") return 40;
  // ৫. দ্বিতীয় / ২য় / Class Two / 2
  if (name.includes("দ্বিতীয়") || name.includes("দ্বীতিয়") || name.includes("২য়") || name === "two" || name === "2") return 50;
  // ৬. তৃতীয় / ৩য় / Class Three / 3
  if (name.includes("তৃতীয়") || name.includes("৩য়") || name === "three" || name === "3") return 60;
  // ৭. চতুর্থ / ৪র্থ / Class Four / 4
  if (name.includes("চতুর্থ") || name.includes("৪র্থ") || name === "four" || name === "4") return 70;
  // ৮. পঞ্চম / ৫ম / Class Five / 5
  if (name.includes("পঞ্চম") || name.includes("৫ম") || name === "five" || name === "5") return 80;
  // ৯. ষষ্ঠ / ৬ষ্ঠ / Class Six / 6
  if (name.includes("ষষ্ঠ") || name.includes("৬ষ্ঠ") || name === "six" || name === "6") return 90;
  // ১০. সপ্তম / ৭ম / Class Seven / 7
  if (name.includes("সপ্তম") || name.includes("৭ম") || name === "seven" || name === "7") return 100;
  // ১১. অষ্টম / ৮ম / Class Eight / 8
  if (name.includes("অষ্টম") || name.includes("৮ম") || name === "eight" || name === "8") return 110;
  // ১২. নবম / ৯ম / Class Nine / 9
  if (name.includes("নবম") || name.includes("৯ম") || name === "nine" || name === "9") return 120;
  // ১৩. দশম / ১০ম / Class Ten / 10
  if (name.includes("দশম") || name.includes("১০ম") || name === "ten" || name === "10") return 130;
  // ১৪. একাদশ / ১১শ শ্রেণি
  if (name.includes("১১") || name.includes("একাদশ")) return 140;
  // ১৫. দ্বাদশ / ১২শ শ্রেণি
  if (name.includes("১২") || name.includes("দ্বাদশ")) return 150;

  // প্রি-হিফজ লেভেলসমূহ (কায়দা/আমপারা, নাজেরা)
  if (name.includes("আমপারা") || name.includes("কায়দা") || name.includes("কায়দা")) return 200;
  if (name.includes("নাজেরা") || name.includes("নাযেরা")) return 210;
  if (divisionKey === "preHifz") return 215;

  // হিফজ লেভেলসমূহ (সবক, শুনানি, হিফজ)
  if (name.includes("সবক")) return 220;
  if (name.includes("শুনানি")) return 230;
  if (name.includes("হিফজ") || divisionKey === "hifz") return 240;

  return 900;
};

/**
 * শিক্ষার্থীকে শ্রেণি অনুযায়ী (Play -> Hifz) এবং শ্রেণিভেদে রোল নম্বর অনুযায়ী সর্টিং করার কমন ফাংশন
 */
export const compareStudentsByClassAndRoll = (a, b) => {
  const detailsA = getStudentClassDetails(a);
  const detailsB = getStudentClassDetails(b);

  const rankA = getClassRank(detailsA.className, detailsA.divisionKey);
  const rankB = getClassRank(detailsB.className, detailsB.divisionKey);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  // একই শ্রেণির ক্ষেত্রে রোল নম্বর অনুযায়ী গাণিতিক সর্ট
  const rollDiff = parseRollNumber(a.roll) - parseRollNumber(b.roll);
  if (rollDiff !== 0) return rollDiff;

  // রোল না থাকলে বা টাই হলে স্টুডেন্ট আইডি অনুযায়ী
  return String(a.studentId || "").localeCompare(
    String(b.studentId || ""),
    undefined,
    { numeric: true }
  );
};
