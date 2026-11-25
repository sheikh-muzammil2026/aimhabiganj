import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

const getStudentClassName = (student) => {
  if (!student) return "N/A";
  if (student.divisionPreHifz?.active && student.divisionPreHifz.class) {
    return student.divisionPreHifz.class;
  }
  if (student.divisionHifz?.active && student.divisionHifz.class) {
    return student.divisionHifz.class;
  }
  if (student.divisionAcademy?.active && student.divisionAcademy.class) {
    return student.divisionAcademy.class;
  }
  return student.officeUse?.recommendedClass || student.class || "N/A";
};

const getStudentDisplayName = (student) => {
  if (!student) return "শিক্ষার্থী";
  return (
    student.studentNameBangla ||
    student.studentNameEnglish ||
    student.name ||
    "শিক্ষার্থী"
  );
};

const getStudentRoll = (student) => {
  if (!student) return "N/A";
  return (
    student.roll ||
    student.officeUse?.rollNumber ||
    student.studentId ||
    "N/A"
  );
};

/**
 * POST /api/students/bulk-seat-plan
 * Bulk updates multiple students' seat plans
 */
export async function POST(req) {
  try {
    const { updates, academicYear, examName } = await req.json();
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No updates provided" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const studentsCollection = db.collection("students");

    // ব্যাচের ভেতর অভ্যন্তরীণ ডুপ্লিকেট সিট নির্ধারণ প্রতিরোধ
    const batchSeen = new Map();
    for (const u of updates) {
      const cleanHallNo = extractDigits(u.hallNo);
      const cleanSeatNo = extractDigits(u.seatNo);
      if (cleanHallNo && cleanSeatNo) {
        const key = `${cleanHallNo}-${cleanSeatNo}`;
        if (batchSeen.has(key)) {
          const prev = batchSeen.get(key);
          if (String(prev.id) !== String(u.id)) {
            return NextResponse.json(
              {
                success: false,
                message: `Seat No ${cleanSeatNo} in Hall ${cleanHallNo} is already assigned multiple times in this batch.`,
              },
              { status: 409 }
            );
          }
        }
        batchSeen.set(key, u);
      }
    }

    // প্রতিটি আপডেটের জন্য ডাটাবেজে কনফ্লিক্ট চেক
    for (const u of updates) {
      const cleanHallNo = extractDigits(u.hallNo);
      const cleanSeatNo = extractDigits(u.seatNo);

      if (cleanHallNo && cleanSeatNo) {
        let studentFilter;
        let currentObjectId = null;
        try {
          currentObjectId = new ObjectId(u.id);
          studentFilter = { _id: currentObjectId };
        } catch {
          studentFilter = { studentId: String(u.id) };
        }

        const currentStudent = await studentsCollection.findOne(studentFilter);
        if (currentStudent?._id) currentObjectId = currentStudent._id;

        const rawYear = u.academicYear || academicYear || u.sessionYear || currentStudent?.academicYear || currentStudent?.sessionYear || "";
        const cleanYear = extractDigits(rawYear);
        const bnYear = enToBn(cleanYear);
        const cleanExam = String(u.examName || examName || currentStudent?.seatPlan?.examName || currentStudent?.examName || "").trim();
        const bnHallNo = enToBn(cleanHallNo);
        const bnSeatNo = enToBn(cleanSeatNo);

        const conflictQuery = {
          status: { $regex: /^approved$/i },
          activity: { $regex: /^active$/i },
          $and: [
            {
              $or: [
                { hallNo: cleanHallNo },
                { hallNo: Number(cleanHallNo) },
                { hallNo: bnHallNo },
                { hallNo: { $regex: new RegExp(`^(?:(হল|hall)\\s*(নং|no\\.?)?\\s*[-—]?)?\\s*(${cleanHallNo}|${bnHallNo})$`, "i") } },
                { "seatPlan.hallNo": cleanHallNo },
                { "seatPlan.hallNo": Number(cleanHallNo) },
                { "seatPlan.hallNo": bnHallNo },
                { "seatPlan.hallNo": { $regex: new RegExp(`^(?:(হল|hall)\\s*(নং|no\\.?)?\\s*[-—]?)?\\s*(${cleanHallNo}|${bnHallNo})$`, "i") } },
              ],
            },
            {
              $or: [
                { seatNo: cleanSeatNo },
                { seatNo: Number(cleanSeatNo) },
                { seatNo: bnSeatNo },
                { "seatPlan.seatNo": cleanSeatNo },
                { "seatPlan.seatNo": Number(cleanSeatNo) },
                { "seatPlan.seatNo": bnSeatNo },
              ],
            },
          ],
        };

        const exclude = [];
        if (currentObjectId) exclude.push({ _id: { $ne: currentObjectId } });
        if (currentStudent?.studentId) exclude.push({ studentId: { $ne: String(currentStudent.studentId) } });
        if (currentStudent?.roll) exclude.push({ roll: { $ne: String(currentStudent.roll) } });
        if (exclude.length > 0) conflictQuery.$and.push(...exclude);

        if (cleanYear) {
          conflictQuery.$and.push({
            $or: [
              { sessionYear: cleanYear },
              { sessionYear: bnYear },
              { sessionYear: { $regex: new RegExp(cleanYear, "i") } },
              { academicYear: cleanYear },
              { academicYear: bnYear },
              { "seatPlan.academicYear": cleanYear },
              { "seatPlan.academicYear": bnYear },
              { "seatPlan.sessionYear": cleanYear },
              { "seatPlan.sessionYear": bnYear },
            ],
          });
        }

        const existingOccupant = await studentsCollection.findOne(conflictQuery);
        if (existingOccupant) {
          const occupantName = getStudentDisplayName(existingOccupant);
          const occupantRoll = getStudentRoll(existingOccupant);
          const occupantClass = getStudentClassName(existingOccupant);
          return NextResponse.json(
            {
              success: false,
              message: `Seat No ${cleanSeatNo} in Hall ${cleanHallNo} is already booked for ${occupantName} (Roll: ${occupantRoll}, Class: ${occupantClass}).`,
            },
            { status: 409 }
          );
        }
      }
    }

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
      const rawYear = u.academicYear || academicYear || u.sessionYear || "";
      const cleanExam = String(u.examName || examName || "").trim();

      return {
        updateOne: {
          filter,
          update: {
            $set: {
              "seatPlan.hallNo": cleanHallNo,
              "seatPlan.benchNo": cleanBenchNo,
              "seatPlan.seatNo": cleanSeatNo,
              "seatPlan.academicYear": rawYear || "২০২৬",
              "seatPlan.examName": cleanExam,
              hallNo: cleanHallNo,
              benchNo: cleanBenchNo,
              seatNo: cleanSeatNo,
              academicYear: rawYear || "২০২৬",
              examName: cleanExam,
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
