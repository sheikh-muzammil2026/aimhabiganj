import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

const bnToEn = (str) => {
  if (!str && str !== 0) return "";
  const bnDigits = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };
  return String(str).replace(/[০-৯]/g, (d) => bnDigits[d] || d);
};

const enToBn = (str) => {
  if (!str && str !== 0) return "";
  const enDigits = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return String(str).replace(/[0-9]/g, (d) => enDigits[d] || d);
};

const extractDigits = (val) => {
  if (!val && val !== 0) return "";
  const enStr = bnToEn(val);
  const match = enStr.match(/\d+/);
  return match ? match[0] : String(val).trim();
};

const normalizeYearBn = (raw) => {
  const clean = String(raw || "").split(/[-–/]/)[0].trim();
  if (!clean) return "";
  const enDigits = bnToEn(clean).match(/\d{4}/)?.[0];
  return enDigits ? enToBn(enDigits) : "";
};

const normalizeClassName = (name) => {
  if (!name) return "N/A";
  return String(name).normalize("NFC").trim();
};

/**
 * GET /api/seat-plans/summary
 * Returns grouped student counts by hall and class strictly ordered from Play to Hifz
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedYearParam = (
      searchParams.get("year") ||
      searchParams.get("sessionYear") ||
      ""
    ).trim();
    const requestedYearBn =
      requestedYearParam && requestedYearParam.toLowerCase() !== "all"
        ? normalizeYearBn(requestedYearParam)
        : "";

    const db = getDatabase();
    const studentsCollection = db.collection("students");
    const routinesCollection = db.collection("routines");

    // Fetch only active and approved students
    const allActiveStudents = await studentsCollection
      .find({
        status: { $regex: /^approved$/i },
        activity: { $regex: /^active$/i },
      })
      .sort({ roll: 1, studentId: 1 })
      .toArray();

    const yearSet = new Set();
    allActiveStudents.forEach((s) => {
      const y = normalizeYearBn(s.sessionYear);
      if (y) yearSet.add(y);
    });
    try {
      const routineYears = await routinesCollection.distinct("gregorianYear");
      routineYears.forEach((ry) => {
        const y = normalizeYearBn(ry);
        if (y) yearSet.add(y);
      });
    } catch (yrErr) {
      console.warn("Could not fetch routine years for local summary:", yrErr);
    }

    if (requestedYearBn) {
      yearSet.add(requestedYearBn);
    }

    const years = Array.from(yearSet).sort(
      (a, b) => Number(bnToEn(b)) - Number(bnToEn(a))
    );
    const academicYear = requestedYearBn || years[0] || "২০২৬";
    if (!years.includes(academicYear)) {
      years.unshift(academicYear);
    }

    const students = requestedYearBn
      ? allActiveStudents.filter(
          (s) => normalizeYearBn(s.sessionYear) === requestedYearBn
        )
      : allActiveStudents;

    const groupedData = {};

    students.forEach((student) => {
      let rawClass = "N/A";
      if (student.divisionPreHifz?.active) {
        rawClass = student.divisionPreHifz.class || "N/A";
      } else if (student.divisionHifz?.active) {
        rawClass = student.divisionHifz.class || "N/A";
      } else if (student.divisionAcademy?.active) {
        rawClass = student.divisionAcademy.class || "N/A";
      } else {
        rawClass = student.officeUse?.recommendedClass || "N/A";
      }

      const className = normalizeClassName(rawClass);

      const rawHall = student.seatPlan?.hallNo || student.hallNo || "";
      const rawSeat = student.seatPlan?.seatNo || student.seatNo || "";

      const cleanHall = extractDigits(rawHall);
      const cleanSeat = extractDigits(rawSeat);

      if (cleanHall && cleanSeat && cleanHall !== "" && cleanSeat !== "") {
        if (!groupedData[cleanHall]) {
          groupedData[cleanHall] = {};
        }
        groupedData[cleanHall][className] = (groupedData[cleanHall][className] || 0) + 1;
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: groupedData,
        academicYear,
        years,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Seat Plan Summary API Error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সিট প্ল্যান সারসংক্ষেপ পেতে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
