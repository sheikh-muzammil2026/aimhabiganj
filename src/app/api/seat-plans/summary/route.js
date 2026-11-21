import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

const bnToEn = (str) => {
  if (!str && str !== 0) return "";
  const bnDigits = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };
  return String(str).replace(/[০-৯]/g, (d) => bnDigits[d] || d);
};

const extractDigits = (val) => {
  if (!val && val !== 0) return "";
  const enStr = bnToEn(val);
  const match = enStr.match(/\d+/);
  return match ? match[0] : String(val).trim();
};

const normalizeClassName = (name) => {
  if (!name) return "N/A";
  return String(name).normalize("NFC").trim();
};

/**
 * GET /api/seat-plans/summary
 * Returns grouped student counts by hall and class strictly ordered from Play to Hifz
 */
export async function GET() {
  try {
    const db = getDatabase();
    const studentsCollection = db.collection("students");

    // Fetch only active and approved students
    const students = await studentsCollection
      .find({
        status: { $regex: /^approved$/i },
        activity: { $regex: /^active$/i },
      })
      .sort({ roll: 1, studentId: 1 })
      .toArray();

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
