import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAuthenticatedTeacher } from "@/lib/attendance-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const user = await getAuthenticatedTeacher(request, {
      teacherEmail: emailParam,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই।" },
        { status: 401 }
      );
    }

    const db = await getDb();
    const history = await db
      .collection("teacherattendance")
      .find({ teacherEmail: user.email })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { success: false, message: "হিস্ট্রি লোড করতে ব্যর্থ হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
