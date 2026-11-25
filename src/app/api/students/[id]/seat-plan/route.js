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
 * PATCH /api/students/:id/seat-plan
 * Updates a student's hallNo, benchNo, seatNo in native MongoDB
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { hallNo, benchNo, seatNo, academicYear, examName, year, semester, sessionYear } = body;

    const cleanHallNo = extractDigits(hallNo);
    const cleanBenchNo = extractDigits(benchNo);
    const cleanSeatNo = extractDigits(seatNo);

    const db = getDatabase();
    const studentsCollection = db.collection("students");

    let filter;
    let currentObjectId = null;
    try {
      currentObjectId = new ObjectId(id);
      filter = { _id: currentObjectId };
    } catch {
      filter = { studentId: String(id) };
    }

    const currentStudent = await studentsCollection.findOne(filter);
    if (!currentStudent) {
      return NextResponse.json(
        { success: false, message: "শিক্ষার্থী পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    if (currentStudent._id) currentObjectId = currentStudent._id;

    const rawYear = academicYear || year || sessionYear || currentStudent.academicYear || currentStudent.sessionYear || "";
    const cleanYear = extractDigits(rawYear);
    const bnYear = enToBn(cleanYear);
    const cleanExamName = String(examName || semester || currentStudent.seatPlan?.examName || currentStudent.examName || "").trim();

    // ডুপ্লিকেট সিট বুকিং প্রতিরোধ
    if (cleanHallNo && cleanSeatNo) {
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
      if (currentStudent.studentId) exclude.push({ studentId: { $ne: String(currentStudent.studentId) } });
      if (currentStudent.roll) exclude.push({ roll: { $ne: String(currentStudent.roll) } });
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

    const updateDoc = {
      $set: {
        "seatPlan.hallNo": cleanHallNo,
        "seatPlan.benchNo": cleanBenchNo,
        "seatPlan.seatNo": cleanSeatNo,
        "seatPlan.academicYear": rawYear || "২০২৬",
        "seatPlan.examName": cleanExamName,
        hallNo: cleanHallNo,
        benchNo: cleanBenchNo,
        seatNo: cleanSeatNo,
        academicYear: rawYear || "২০২৬",
        examName: cleanExamName,
        updatedAt: new Date(),
      },
    };

    await studentsCollection.updateOne({ _id: currentStudent._id }, updateDoc);

    return NextResponse.json({
      success: true,
      message: "সিট প্ল্যান সফলভাবে আপডেট করা হয়েছে।",
      data: {
        hallNo: cleanHallNo,
        benchNo: cleanBenchNo,
        seatNo: cleanSeatNo,
        academicYear: rawYear || "২০২৬",
        examName: cleanExamName,
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
