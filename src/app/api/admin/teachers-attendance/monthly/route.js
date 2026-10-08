import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getDhakaTime } from "@/lib/attendance-config";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { dateStr } = getDhakaTime();
    const currentMonth = dateStr.slice(0, 7); // "YYYY-MM"
    const month = searchParams.get("month") || currentMonth;

    const db = await getDb();
    const attendanceCollection = db.collection("teacherattendance");

    // 1. Fetch all teachers from 'user' / 'users' collection where role === 'teacher'
    let teacherUsers = await db
      .collection("user")
      .find({ role: { $regex: /^teacher$/i } })
      .toArray()
      .catch(() => []);

    if (!teacherUsers.length) {
      teacherUsers = await db
        .collection("users")
        .find({ role: { $regex: /^teacher$/i } })
        .toArray()
        .catch(() => []);
    }

    // Teacher profile enrichment
    const teachersProfileList = await db
      .collection("teachers")
      .find({})
      .toArray()
      .catch(() => []);

    const teacherProfileByEmail = new Map();
    teachersProfileList.forEach((t) => {
      if (t.email) {
        teacherProfileByEmail.set(t.email.toLowerCase(), t);
      }
    });

    // 2. Fetch all attendance logs for the requested month
    const attendanceLogs = await attendanceCollection
      .find({ date: { $regex: `^${month}` } })
      .sort({ date: 1 })
      .toArray();

    // Distinct dates in this month that had attendance activity
    const distinctDates = Array.from(new Set(attendanceLogs.map((l) => l.date))).sort();
    const totalWorkingDays = distinctDates.length > 0 ? distinctDates.length : 1;

    // Group logs by teacher email
    const logsByEmail = new Map();
    attendanceLogs.forEach((log) => {
      if (!log.teacherEmail) return;
      const emailLower = log.teacherEmail.toLowerCase();
      if (!logsByEmail.has(emailLower)) {
        logsByEmail.set(emailLower, []);
      }
      logsByEmail.get(emailLower).push(log);
    });

    const teacherSummaries = [];
    const processedEmails = new Set();

    for (const teacher of teacherUsers) {
      const emailLower = (teacher.email || "").toLowerCase();
      processedEmails.add(emailLower);

      const profile = teacherProfileByEmail.get(emailLower);
      const logs = logsByEmail.get(emailLower) || [];

      const presentLogs = logs.filter((l) => !!l.checkInTime);
      const presentDays = presentLogs.length;
      const onTimeDays = logs.filter((l) => l.checkInStatus === "On Time").length;
      const lateDays = logs.filter((l) => l.checkInStatus === "Late").length;
      const earlyExitDays = logs.filter((l) => l.checkOutStatus === "Early").length;
      const absentDays = Math.max(0, totalWorkingDays - presentDays);
      const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

      const lateComments = logs
        .filter((l) => l.checkInComment)
        .map((l) => ({ date: l.date, comment: l.checkInComment }));
      const earlyComments = logs
        .filter((l) => l.checkOutComment)
        .map((l) => ({ date: l.date, comment: l.checkOutComment }));

      teacherSummaries.push({
        teacherId: teacher._id.toString(),
        teacherName: teacher.name || profile?.fullName || profile?.name || "নাম পাওয়া যায়নি",
        teacherEmail: teacher.email || "",
        designation: profile?.designation || teacher.designation || "শিক্ষক",
        phone: profile?.phone || teacher.phone || "",
        presentDays,
        onTimeDays,
        lateDays,
        earlyExitDays,
        absentDays,
        attendanceRate,
        lateComments,
        earlyComments,
      });
    }

    // Process any teachers who have attendance logs but weren't in user query
    for (const [emailLower, logs] of logsByEmail.entries()) {
      if (!processedEmails.has(emailLower)) {
        const firstLog = logs[0];
        const presentLogs = logs.filter((l) => !!l.checkInTime);
        const presentDays = presentLogs.length;
        const onTimeDays = logs.filter((l) => l.checkInStatus === "On Time").length;
        const lateDays = logs.filter((l) => l.checkInStatus === "Late").length;
        const earlyExitDays = logs.filter((l) => l.checkOutStatus === "Early").length;
        const absentDays = Math.max(0, totalWorkingDays - presentDays);
        const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

        teacherSummaries.push({
          teacherId: firstLog.teacherId || emailLower,
          teacherName: firstLog.teacherName || emailLower,
          teacherEmail: firstLog.teacherEmail,
          designation: "শিক্ষক",
          phone: "",
          presentDays,
          onTimeDays,
          lateDays,
          earlyExitDays,
          absentDays,
          attendanceRate,
          lateComments: logs.filter((l) => l.checkInComment).map((l) => ({ date: l.date, comment: l.checkInComment })),
          earlyComments: logs.filter((l) => l.checkOutComment).map((l) => ({ date: l.date, comment: l.checkOutComment })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      month,
      totalTeachers: teacherSummaries.length,
      totalWorkingDays,
      distinctDates,
      teachersSummary: teacherSummaries,
    });
  } catch (error) {
    console.error("Monthly teachers attendance error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "মাসিক শিক্ষক হাজিরা লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
