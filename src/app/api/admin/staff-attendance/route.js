import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getDhakaTime } from "@/lib/attendance-config";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/staff-attendance
 * Fetch attendance logs and metrics for staff members
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const statusFilter = searchParams.get("status") || "all";
    const monthParam = searchParams.get("month");

    const { dateStr: todayStr } = getDhakaTime();
    const targetDate = dateParam || todayStr;

    const db = await getDb();
    const staffCollection = db.collection("staff");
    const staffAttendanceCollection = db.collection("staffattendance");

    // Fetch staff list
    const staffList = await staffCollection.find({}).sort({ createdAt: 1 }).toArray();
    const totalStaffCount = staffList.length;

    // Monthly Summary requested
    if (monthParam) {
      const logs = await staffAttendanceCollection
        .find({ date: { $regex: `^${monthParam}` } })
        .toArray();

      const distinctDates = Array.from(new Set(logs.map((l) => l.date))).sort();
      const totalWorkingDays = distinctDates.length || 1;

      const logsByStaffId = new Map();
      logs.forEach((l) => {
        const key = l.staffId || l.staffEmail || "";
        if (!logsByStaffId.has(key)) logsByStaffId.set(key, []);
        logsByStaffId.get(key).push(l);
      });

      const summary = staffList.map((staff) => {
        const staffLogs = logsByStaffId.get(staff.staffId) || logsByStaffId.get(staff.email) || [];
        const presentDays = staffLogs.filter((l) => !!l.checkInTime).length;
        const onTimeDays = staffLogs.filter((l) => l.checkInStatus === "On Time").length;
        const lateDays = staffLogs.filter((l) => l.checkInStatus === "Late").length;
        const earlyExitDays = staffLogs.filter((l) => l.checkOutStatus === "Early").length;
        const absentDays = Math.max(0, totalWorkingDays - presentDays);
        const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

        return {
          staffId: staff.staffId,
          fullName: staff.fullName,
          designation: staff.designation,
          phone: staff.phone,
          presentDays,
          onTimeDays,
          lateDays,
          earlyExitDays,
          absentDays,
          attendanceRate,
          lateComments: staffLogs.filter((l) => l.checkInComment).map((l) => ({ date: l.date, comment: l.checkInComment })),
        };
      });

      return NextResponse.json({
        success: true,
        month: monthParam,
        totalStaff: totalStaffCount,
        totalWorkingDays,
        summary,
      });
    }

    // Daily Attendance
    const attendanceLogs = await staffAttendanceCollection
      .find({ date: targetDate })
      .toArray();

    const presentStaff = attendanceLogs.filter((log) => !!log.checkInTime);
    const presentCount = presentStaff.length;
    const absentCount = Math.max(0, totalStaffCount - presentCount);
    const onTimeCount = attendanceLogs.filter((log) => log.checkInStatus === "On Time").length;
    const lateCount = attendanceLogs.filter((log) => log.checkInStatus === "Late").length;

    const attendanceMap = new Map();
    attendanceLogs.forEach((log) => {
      if (log.staffId) attendanceMap.set(log.staffId, log);
      if (log.staffEmail) attendanceMap.set(log.staffEmail.toLowerCase(), log);
    });

    const unifiedList = staffList.map((staff) => {
      const attendance = attendanceMap.get(staff.staffId) || (staff.email ? attendanceMap.get(staff.email.toLowerCase()) : null);

      return {
        staffId: staff.staffId,
        _id: staff._id.toString(),
        fullName: staff.fullName,
        designation: staff.designation,
        phone: staff.phone,
        email: staff.email,
        profileImage: staff.profileImage,
        date: targetDate,
        hasCheckedIn: !!attendance?.checkInTime,
        checkInTime: attendance?.checkInTime || null,
        checkInStatus: attendance?.checkInStatus || "Absent",
        checkInComment: attendance?.checkInComment || null,
        hasCheckedOut: !!attendance?.checkOutTime,
        checkOutTime: attendance?.checkOutTime || null,
        checkOutStatus: attendance?.checkOutStatus || null,
        checkOutComment: attendance?.checkOutComment || null,
        checkInLocation: attendance?.checkInLocation || null,
      };
    });

    let filteredList = unifiedList;
    if (search) {
      filteredList = filteredList.filter(
        (s) =>
          s.fullName.toLowerCase().includes(search) ||
          s.designation.toLowerCase().includes(search) ||
          (s.email && s.email.toLowerCase().includes(search)) ||
          s.staffId.toLowerCase().includes(search)
      );
    }

    if (statusFilter === "present") {
      filteredList = filteredList.filter((s) => s.hasCheckedIn);
    } else if (statusFilter === "absent") {
      filteredList = filteredList.filter((s) => !s.hasCheckedIn);
    } else if (statusFilter === "onTime") {
      filteredList = filteredList.filter((s) => s.checkInStatus === "On Time");
    } else if (statusFilter === "late") {
      filteredList = filteredList.filter((s) => s.checkInStatus === "Late");
    }

    return NextResponse.json({
      success: true,
      date: targetDate,
      isToday: targetDate === todayStr,
      metrics: {
        totalStaff: totalStaffCount,
        presentToday: presentCount,
        absentToday: absentCount,
        onTimeToday: onTimeCount,
        lateToday: lateCount,
      },
      attendanceList: filteredList,
    });
  } catch (error) {
    console.error("GET /api/admin/staff-attendance error:", error);
    return NextResponse.json(
      { success: false, message: "স্টাফ হাজিরা তথ্য লোড করতে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/staff-attendance
 * Record or toggle staff attendance from admin panel
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { staffId, date, checkInStatus, checkInComment, checkOutStatus, checkOutComment } = body;

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: "স্টাফ আইডি দেওয়া হয়নি।" },
        { status: 400 }
      );
    }

    const { dateStr: todayStr } = getDhakaTime();
    const targetDate = date || todayStr;
    const now = new Date();

    const db = await getDb();
    const staffAttendanceCollection = db.collection("staffattendance");

    const existing = await staffAttendanceCollection.findOne({
      staffId,
      date: targetDate,
    });

    if (existing) {
      const updateDoc = {
        updatedAt: now,
      };
      if (checkInStatus) updateDoc.checkInStatus = checkInStatus;
      if (checkInComment !== undefined) updateDoc.checkInComment = checkInComment;
      if (checkOutStatus) {
        updateDoc.checkOutStatus = checkOutStatus;
        updateDoc.checkOutTime = now.toISOString();
      }
      if (checkOutComment !== undefined) updateDoc.checkOutComment = checkOutComment;

      await staffAttendanceCollection.updateOne(
        { _id: existing._id },
        { $set: updateDoc }
      );
    } else {
      const newDoc = {
        staffId,
        staffName: body.staffName || "",
        staffEmail: body.staffEmail || "",
        date: targetDate,
        checkInTime: now.toISOString(),
        checkInStatus: checkInStatus || "On Time",
        checkInComment: checkInComment || null,
        checkOutTime: null,
        checkOutStatus: null,
        checkOutComment: null,
        createdAt: now,
        updatedAt: now,
      };

      await staffAttendanceCollection.insertOne(newDoc);
    }

    return NextResponse.json({
      success: true,
      message: "স্টাফ হাজিরা সফলভাবে সংরক্ষিত হয়েছে!",
    });
  } catch (error) {
    console.error("POST /api/admin/staff-attendance error:", error);
    return NextResponse.json(
      { success: false, message: "স্টাফ হাজিরা সংরক্ষণ ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
