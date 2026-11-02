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
