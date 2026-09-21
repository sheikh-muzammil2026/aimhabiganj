import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getDhakaTime, MADRASA_LOCATION, ATTENDANCE_RULES } from "@/lib/attendance-config";
import { getAuthenticatedTeacher } from "@/lib/attendance-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const user = await getAuthenticatedTeacher(request, {
      teacherEmail: emailParam,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { dateStr } = getDhakaTime();
    const db = await getDb();

    // Query today's attendance document for this teacher
    const attendanceRecord = await db.collection("teacherattendance").findOne({
      teacherEmail: user.email,
      date: dateStr,
    });

    return NextResponse.json({
      success: true,
      today: dateStr,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation || "শিক্ষক",
        profileImage: user.profileImage || "",
      },
      attendance: attendanceRecord || null,
      madrasaLocation: MADRASA_LOCATION,
      rules: ATTENDANCE_RULES,
    });
  } catch (error) {
    console.error("Error fetching today attendance:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভারে সমস্যা হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
