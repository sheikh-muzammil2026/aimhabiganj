import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Convert English to Bengali and Bengali to English helper
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

/**
 * GET /api/seat-plan?hallNo=1&semester=২য় সাময়িক পরীক্ষা
 * Returns active & approved students allocated to the specified hall
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hallNo = searchParams.get("hallNo");
    const semester = searchParams.get("semester") || "২য় সাময়িক পরীক্ষা";

    if (!hallNo) {
      return NextResponse.json(
        { success: false, message: "Hall number is required" },
        { status: 400 }
      );
    }

    const cleanHall = extractDigits(hallNo);
    const bnHall = enToBn(cleanHall);

    const db = getDatabase();
    const studentsCollection = db.collection("students");

    // Fetch active & approved students allocated to this hall
    const students = await studentsCollection
      .find({
        status: { $regex: /^approved$/i },
        activity: { $regex: /^active$/i },
        $or: [
          { hallNo: cleanHall },
          { hallNo: Number(cleanHall) },
          { hallNo: bnHall },
          { hallNo: { $regex: new RegExp(`(হল|hall)?\\s*[-—]?\\s*(${cleanHall}|${bnHall})`, "i") } },
          { "seatPlan.hallNo": cleanHall },
          { "seatPlan.hallNo": Number(cleanHall) },
          { "seatPlan.hallNo": bnHall },
          { "seatPlan.hallNo": { $regex: new RegExp(`(হল|hall)?\\s*[-—]?\\s*(${cleanHall}|${bnHall})`, "i") } },
        ],
      })
      .toArray();

    const data = students
      .map((student) => {
        let classVal = "N/A";
        let divisionName = "N/A";
        if (student.divisionPreHifz?.active) {
          classVal = student.divisionPreHifz.class || "N/A";
          divisionName = "প্রি-হিফজ";
        } else if (student.divisionHifz?.active) {
          classVal = student.divisionHifz.class || "N/A";
          divisionName = "হিফজ বিভাগ";
        } else if (student.divisionAcademy?.active) {
          classVal = student.divisionAcademy.class || "N/A";
          divisionName = "একাডেমিক";
        } else {
          classVal = student.officeUse?.recommendedClass || "N/A";
        }

        const currentSeatPlan = student.seatPlan || {};
        const rawSeatNo = student.seatNo || currentSeatPlan.seatNo || "";
        const seatDigits = extractDigits(rawSeatNo);
        const actualSeatNo = parseInt(seatDigits, 10) || 0;

        const rawBenchNo = student.benchNo || currentSeatPlan.benchNo || "";
        const benchDigits = extractDigits(rawBenchNo);

        return {
          _id: student._id.toString(),
          hallNo: Number(cleanHall) || 1,
          seatNo: actualSeatNo,
          benchNo: benchDigits ? Number(benchDigits) : (actualSeatNo > 0 ? Math.ceil(actualSeatNo / 2) : ""),
          class: classVal,
          divisionName,
          name:
            student.studentNameBangla ||
            student.studentNameEnglish ||
            student.name ||
            "নাম নেই",
          studentId: student.studentId || "",
          roll:
            student.roll ||
            student.officeUse?.rollNumber ||
            student.studentId ||
            "",
          studentImage:
            student.studentImage ||
            student.profilePhoto ||
            student.photoUrl ||
            student.profileImage ||
            student.image ||
            student.avatar ||
            "",
          semester,
        };
      })
      .filter((s) => s.seatNo > 0)
      .sort((a, b) => a.seatNo - b.seatNo);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Next.js Seat Plan API Error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সিট প্ল্যানের তথ্য পেতে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
