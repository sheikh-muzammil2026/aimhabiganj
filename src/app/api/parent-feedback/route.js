import { NextResponse } from "next/server";
import { auth, getDatabase } from "@/lib/auth";
import {
  getStudentClassDetails,
  toBengaliDigits,
  toEnglishDigits,
} from "@/lib/studentUtils";

export const dynamic = "force-dynamic";

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getSyllabusData(db) {
  const syllabusCollection = db.collection("syllabus");
  const allSyllabus = await syllabusCollection
    .find({})
    .sort({ order: 1 })
    .toArray();

  const classes = [];
  const classSubjects = {};

  allSyllabus.forEach((item) => {
    if (item.class) {
      if (!classes.includes(item.class)) {
        classes.push(item.class);
      }
      classSubjects[item.class] = Array.isArray(item.subjects)
        ? item.subjects
        : [];
    }
  });

  return { classes, classSubjects };
}

/**
 * GET /api/parent-feedback
 * - ?mode=meta -> Public: returns dynamic classes and class-wise subjects from `syllabus` collection
 * - ?mode=lookup&q=... -> Public: controlled student lookup from `students` collection + class subjects from `syllabus`
 * - Default (no public mode) -> STRICT ADMIN-ONLY: returns submitted parent feedbacks from `parent_feedbacks` collection
 */
export async function GET(request) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    // 1. Public Mode: Fetch Classes & Class-wise Subjects from `syllabus` collection
    if (mode === "meta") {
      const { classes, classSubjects } = await getSyllabusData(db);
      return NextResponse.json({
        success: true,
        classes,
        classSubjects,
      });
    }

    // 2. Public Mode: Controlled Student Lookup by Student ID / Roll / Name from `students` collection
    if (mode === "lookup") {
      const rawQuery = (searchParams.get("q") || "").trim();
      const filterClass = (searchParams.get("className") || "").trim();

      if (!rawQuery) {
        return NextResponse.json(
          {
            success: false,
            message: "অনুগ্রহ করে শিক্ষার্থীর আইডি, রোল অথবা নাম লিখুন।",
            students: [],
          },
          { status: 400 },
        );
      }

      const qEn = toEnglishDigits(rawQuery);
      const qBn = toBengaliDigits(rawQuery);
      const safeRaw = escapeRegex(rawQuery);
      const safeEn = escapeRegex(qEn);
      const safeBn = escapeRegex(qBn);

      const orConditions = [
        { studentId: { $regex: new RegExp(safeRaw, "i") } },
        { studentId: { $regex: new RegExp(safeEn, "i") } },
        { studentId: { $regex: new RegExp(safeBn, "i") } },
        { studentNameBangla: { $regex: new RegExp(safeRaw, "i") } },
        { studentNameEnglish: { $regex: new RegExp(safeRaw, "i") } },
        { roll: rawQuery },
        { roll: qEn },
        { roll: qBn },
        { "officeUse.rollNumber": rawQuery },
        { "officeUse.rollNumber": qEn },
        { "officeUse.rollNumber": qBn },
      ];

      const numRoll = parseInt(qEn, 10);
      if (!isNaN(numRoll)) {
        orConditions.push({ roll: numRoll });
      }

      const andClauses = [
        { status: { $ne: "Deleted" } },
        {
          $or: [{ activity: "active" }, { activity: { $exists: false } }],
        },
        { $or: orConditions },
      ];

      if (filterClass && filterClass !== "all") {
        andClauses.push({
          $or: [
            { "divisionAcademy.class": filterClass },
            { "divisionHifz.class": filterClass },
            { "divisionPreHifz.class": filterClass },
            { "officeUse.recommendedClass": filterClass },
          ],
        });
      }

      const studentsCollection = db.collection("students");
      const matchedStudents = await studentsCollection
        .find({ $and: andClauses })
        .limit(15)
        .toArray();

      const { classSubjects } = await getSyllabusData(db);

      const formattedStudents = matchedStudents.map((st) => {
        const details = getStudentClassDetails(st);
        const className =
          details.className && details.className !== "N/A"
            ? details.className
            : st.className || st.previousClass || "";

        return {
          _id: st._id,
          studentId: st.studentId || "",
          roll: st.roll || st.officeUse?.rollNumber || "",
          studentNameBangla: st.studentNameBangla || "",
          studentNameEnglish: st.studentNameEnglish || "",
          studentName: st.studentNameBangla || st.studentNameEnglish || "",
          fatherNameBangla: st.fatherNameBangla || "",
          className,
          divisionName: details.divisionName || "",
          subjects: classSubjects[className] || [],
        };
      });

      return NextResponse.json({
        success: true,
        students: formattedStudents,
      });
    }

    // 3. STRICT ADMIN-ONLY RBAC CHECK FOR VIEWING SUBMITTED FEEDBACKS
    let isAuthorizedAdmin = false;

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      const sessionUser = session?.user;
      if (sessionUser?.email) {
        // Also check live user role in MongoDB `user` collection
        const dbUser = await db.collection("user").findOne({
          email: { $regex: new RegExp(`^${escapeRegex(sessionUser.email)}$`, "i") },
        });
        const effectiveRole = (
          dbUser?.role ||
          sessionUser.role ||
          ""
        ).toLowerCase();

        if (
          effectiveRole === "admin" ||
          effectiveRole === "superadmin" ||
          effectiveRole === "administrator"
        ) {
          isAuthorizedAdmin = true;
        }
      }
    } catch (authErr) {
      console.error("Session verification error in parent-feedback API:", authErr);
    }

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "অ্যাক্সেস অনুমোদিত নয়। শুধুমাত্র অ্যাডমিন এই মতামতসমূহ দেখতে পারবেন।",
        },
        { status: 403 },
      );
    }

    const className = searchParams.get("className");
    const subject = searchParams.get("subject");
    const academicYear = searchParams.get("academicYear");
    const search = searchParams.get("search");

    const andClauses = [];

    if (academicYear && academicYear !== "all") {
      const yEn = toEnglishDigits(academicYear);
      const yBn = toBengaliDigits(academicYear);
      andClauses.push({
        academicYear: { $in: [academicYear, yEn, yBn] },
      });
    }

    if (className && className !== "all") {
      andClauses.push({ className });
    }

    if (subject && subject !== "all") {
      andClauses.push({
        $or: [
          { q10_selectedSubject: subject },
          { "q10_subjectFeedbacks.subject": subject },
        ],
      });
    }

    if (search && search.trim()) {
      const sRaw = escapeRegex(search.trim());
      const sEn = escapeRegex(toEnglishDigits(search.trim()));
      const sBn = escapeRegex(toBengaliDigits(search.trim()));
      andClauses.push({
        $or: [
          { studentName: { $regex: new RegExp(sRaw, "i") } },
          { studentId: { $regex: new RegExp(sRaw, "i") } },
          { studentId: { $regex: new RegExp(sEn, "i") } },
          { studentId: { $regex: new RegExp(sBn, "i") } },
          { studentRoll: { $regex: new RegExp(sRaw, "i") } },
          { q10_teacherComment: { $regex: new RegExp(sRaw, "i") } },
          { "q10_subjectFeedbacks.comment": { $regex: new RegExp(sRaw, "i") } },
          { q11_suggestionsOrComplaints: { $regex: new RegExp(sRaw, "i") } },
        ],
      });
    }

    const filter = andClauses.length > 0 ? { $and: andClauses } : {};
    const parentFeedbacksCollection = db.collection("parent_feedbacks");

    const feedbacks = await parentFeedbacksCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const { classes, classSubjects } = await getSyllabusData(db);

    return NextResponse.json({
      success: true,
      total: feedbacks.length,
      data: feedbacks,
      classes,
      classSubjects,
    });
  } catch (error) {
    console.error("GET /api/parent-feedback error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/parent-feedback
 * Public endpoint for submitting the Annual Parents Feedback Form – 2026
 */
export async function POST(request) {
  try {
    const db = getDatabase();
    const body = await request.json();

    const studentName = String(body.studentName || "").trim();
    const className = String(body.className || "").trim();

    if (!studentName || !className) {
      return NextResponse.json(
        {
          success: false,
          message: "শিক্ষার্থীর নাম এবং শ্রেণি প্রদান করা আবশ্যক।",
        },
        { status: 400 },
      );
    }

    const requiredMcqs = [
      "q3_overallProgress",
      "q4_islamicEducation",
      "q5_teachingCare",
      "q6_disciplineManagement",
      "q7_moralBehavioralChange",
      "q8_overallSatisfaction",
    ];

    for (const key of requiredMcqs) {
      if (!body[key] || !String(body[key]).trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "অনুগ্রহ করে ৩ থেকে ৮ নম্বর পর্যন্ত সকল প্রশ্নের উত্তর নির্বাচন করুন।",
          },
          { status: 400 },
        );
      }
    }

    // Normalize subject-wise teacher comments (Subject Name ONLY — no teacher names)
    let subjectFeedbacks = [];
    if (Array.isArray(body.q10_subjectFeedbacks)) {
      subjectFeedbacks = body.q10_subjectFeedbacks
        .filter(
          (item) =>
            item &&
            String(item.subject || "").trim() &&
            String(item.comment || "").trim(),
        )
        .map((item) => ({
          subject: String(item.subject).trim(),
          comment: String(item.comment).trim(),
        }));
    }

    const selectedSubject = String(body.q10_selectedSubject || "").trim();
    const teacherComment = String(body.q10_teacherComment || "").trim();

    if (
      selectedSubject &&
      teacherComment &&
      !subjectFeedbacks.some((sf) => sf.subject === selectedSubject)
    ) {
      subjectFeedbacks.unshift({
        subject: selectedSubject,
        comment: teacherComment,
      });
    }

    const doc = {
      academicYear: String(body.academicYear || "2026").trim(),
      studentId: String(body.studentId || "").trim(),
      studentRoll: String(body.studentRoll || "").trim(),
      studentName,
      className,
      q3_overallProgress: String(body.q3_overallProgress).trim(),
      q4_islamicEducation: String(body.q4_islamicEducation).trim(),
      q5_teachingCare: String(body.q5_teachingCare).trim(),
      q6_disciplineManagement: String(body.q6_disciplineManagement).trim(),
      q7_moralBehavioralChange: String(body.q7_moralBehavioralChange).trim(),
      q8_overallSatisfaction: String(body.q8_overallSatisfaction).trim(),
      q9_improvementAreas: Array.isArray(body.q9_improvementAreas)
        ? body.q9_improvementAreas
            .map((i) => String(i).trim())
            .filter(Boolean)
        : [],
      q10_selectedSubject:
        selectedSubject || (subjectFeedbacks[0]?.subject ?? ""),
      q10_teacherComment:
        teacherComment || (subjectFeedbacks[0]?.comment ?? ""),
      q10_subjectFeedbacks: subjectFeedbacks,
      q11_suggestionsOrComplaints: String(
        body.q11_suggestionsOrComplaints || "",
      ).trim(),
      createdAt: new Date(),
    };

    const parentFeedbacksCollection = db.collection("parent_feedbacks");
    const result = await parentFeedbacksCollection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message:
          "আপনার মূল্যবান মতামত সফলভাবে সংরক্ষিত হয়েছে। আপনাকে আন্তরিক ধন্যবাদ!",
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/parent-feedback error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "মতামত সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      { status: 500 },
    );
  }
}
