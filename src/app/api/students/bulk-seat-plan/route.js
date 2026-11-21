import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

/**
 * POST /api/students/bulk-seat-plan
 * Bulk updates multiple students' seat plans
 */
export async function POST(req) {
  try {
    const { updates } = await req.json();
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No updates provided" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const studentsCollection = db.collection("students");

    const bulkOps = updates.map((u) => {
      let filter;
      try {
        filter = { _id: new ObjectId(u.id) };
      } catch {
        filter = { studentId: String(u.id) };
      }

      const cleanHallNo = extractDigits(u.hallNo);
      const cleanBenchNo = extractDigits(u.benchNo);
      const cleanSeatNo = extractDigits(u.seatNo);

      return {
        updateOne: {
          filter,
          update: {
            $set: {
              "seatPlan.hallNo": cleanHallNo,
              "seatPlan.benchNo": cleanBenchNo,
              "seatPlan.seatNo": cleanSeatNo,
              hallNo: cleanHallNo,
              benchNo: cleanBenchNo,
              seatNo: cleanSeatNo,
              updatedAt: new Date(),
            },
          },
        },
      };
    });

    const bulkResult = await studentsCollection.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: "সকল সিট প্ল্যান সফলভাবে আপডেট করা হয়েছে।",
      modifiedCount: bulkResult.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk Seat Plan API Error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে বাল্ক সিট প্ল্যান আপডেট করতে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
