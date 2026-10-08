import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getDhakaTime } from "@/lib/attendance-config";
import { getAuthenticatedTeacher } from "@/lib/attendance-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const statusFilter = searchParams.get("status") || "all";

    // Selected date or today in Bangladesh time
    const { dateStr: todayStr } = getDhakaTime();
    const targetDate = dateParam || todayStr;

    const db = await getDb();
    const attendanceCollection = db.collection("teacherattendance");

    // 1. Fetch teachers from 'user' / 'users' collection who have role === 'teacher'
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

    // Optional profile enrichment from 'teachers' collection
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

    const totalTeachersCount = teacherUsers.length;

    // 2. Fetch all attendance logs for the target date
    const attendanceLogs = await attendanceCollection
      .find({ date: targetDate })
      .toArray();

    // 3. Compute summary metrics as requested:
    // - Total Teachers: Fetch count dynamically from users collection (role: 'teacher')
    // - Present Today: Count of unique teachers who checked in today
    // - Absent Today: (Total Teachers - Present Today)
    // - On Time Today: Count of teachers with checkInStatus === 'On Time'
    // - Late Today: Count of teachers with checkInStatus === 'Late'
    const presentTeachers = attendanceLogs.filter((log) => !!log.checkInTime);
    const presentCount = presentTeachers.length;
    // Ensure absent count is not negative if present exceeds registered teachers
    const absentCount = Math.max(0, totalTeachersCount - presentCount);

    const onTimeCount = attendanceLogs.filter(
      (log) => log.checkInStatus === "On Time"
    ).length;

    const lateCount = attendanceLogs.filter(
      (log) => log.checkInStatus === "Late"
    ).length;

    // 4. Build unified attendance table rows
    // Map attendance logs by email for quick lookup
    const attendanceByEmail = new Map();
    attendanceLogs.forEach((log) => {
      if (log.teacherEmail) {
        attendanceByEmail.set(log.teacherEmail.toLowerCase(), log);
      }
    });

    const unifiedList = [];
    const processedEmails = new Set();

    // First, process all teachers from 'user' / 'users' collection
    for (const teacher of teacherUsers) {
      const emailLower = (teacher.email || "").toLowerCase();
      processedEmails.add(emailLower);

      const profile = teacherProfileByEmail.get(emailLower);
      const attendance = attendanceByEmail.get(emailLower);

      unifiedList.push({
        teacherId: teacher._id.toString(),
        teacherName: teacher.name || profile?.fullName || profile?.name || "নাম পাওয়া যায়নি",
        teacherEmail: teacher.email || "",
        designation: profile?.designation || teacher.designation || "শিক্ষক",
        phone: profile?.phone || teacher.phone || "",
        profileImage: teacher.image || profile?.profileImage || "",
        date: targetDate,
        hasCheckedIn: !!attendance?.checkInTime,
        checkInTime: attendance?.checkInTime || null,
        checkInStatus: attendance?.checkInStatus || "Absent",
        checkInLocation: attendance?.checkInLocation || null,
        checkInComment: attendance?.checkInComment || null,
        hasCheckedOut: !!attendance?.checkOutTime,
        checkOutTime: attendance?.checkOutTime || null,
        checkOutStatus: attendance?.checkOutStatus || null,
        checkOutLocation: attendance?.checkOutLocation || null,
        checkOutComment: attendance?.checkOutComment || null,
        attendanceId: attendance?._id?.toString() || null,
      });
    }

    // Second, process any attendance records for teachers not yet in 'users' collection
    for (const attendance of attendanceLogs) {
      const emailLower = (attendance.teacherEmail || "").toLowerCase();
      if (!processedEmails.has(emailLower)) {
        unifiedList.push({
          teacherId: attendance.teacherId || attendance._id.toString(),
          teacherName: attendance.teacherName || attendance.teacherEmail,
          teacherEmail: attendance.teacherEmail,
          designation: "শিক্ষক",
          phone: "",
          profileImage: "",
          date: targetDate,
          hasCheckedIn: !!attendance.checkInTime,
          checkInTime: attendance.checkInTime || null,
          checkInStatus: attendance.checkInStatus || "On Time",
          checkInLocation: attendance.checkInLocation || null,
          checkInComment: attendance.checkInComment || null,
          hasCheckedOut: !!attendance.checkOutTime,
          checkOutTime: attendance.checkOutTime || null,
          checkOutStatus: attendance.checkOutStatus || null,
          checkOutLocation: attendance.checkOutLocation || null,
          checkOutComment: attendance.checkOutComment || null,
          attendanceId: attendance._id.toString(),
        });
      }
    }

    // 5. Apply filters
    let filteredList = unifiedList;

    // Search query filter (name, email, designation)
    if (search) {
      filteredList = filteredList.filter(
        (item) =>
          item.teacherName.toLowerCase().includes(search) ||
          item.teacherEmail.toLowerCase().includes(search) ||
          item.designation.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter === "present") {
      filteredList = filteredList.filter((item) => item.hasCheckedIn);
    } else if (statusFilter === "absent") {
      filteredList = filteredList.filter((item) => !item.hasCheckedIn);
    } else if (statusFilter === "onTime") {
      filteredList = filteredList.filter(
        (item) => item.checkInStatus === "On Time"
      );
    } else if (statusFilter === "late") {
      filteredList = filteredList.filter(
        (item) => item.checkInStatus === "Late"
      );
    }

    return NextResponse.json({
      success: true,
      date: targetDate,
      isToday: targetDate === todayStr,
      metrics: {
        totalTeachers: totalTeachersCount,
        presentToday: presentCount,
        absentToday: absentCount,
        onTimeToday: onTimeCount,
        lateToday: lateCount,
      },
      attendanceList: filteredList,
    });
  } catch (error) {
    console.error("Admin teachers attendance error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "শিক্ষক হাজিরা তথ্য লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
