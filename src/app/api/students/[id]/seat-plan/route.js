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
 * PATCH /api/students/:id/seat-plan
 * Updates a student's hallNo, benchNo, seatNo in native MongoDB
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { hallNo, benchNo, seatNo } = body;

    const cleanHallNo = extractDigits(hallNo);
    const cleanBenchNo = extractDigits(benchNo);
    const cleanSeatNo = extractDigits(seatNo);

    const db = getDatabase();
    const studentsCollection = db.collection("students");

    let filter;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { studentId: String(id) };
    }

    const updateDoc = {
      $set: {
        "seatPlan.hallNo": cleanHallNo,
        "seatPlan.benchNo": cleanBenchNo,
        "seatPlan.seatNo": cleanSeatNo,
        hallNo: cleanHallNo,
        benchNo: cleanBenchNo,
        seatNo: cleanSeatNo,
        updatedAt: new Date(),
      },
    };

    const result = await studentsCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "শিক্ষার্থী পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "সিট প্ল্যান সফলভাবে আপডেট করা হয়েছে।",
      data: {
        hallNo: cleanHallNo,
        benchNo: cleanBenchNo,
        seatNo: cleanSeatNo,
      },
    });
  } catch (error) {
    console.error("Update Seat Plan API Error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সিট প্ল্যান আপডেট করতে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
