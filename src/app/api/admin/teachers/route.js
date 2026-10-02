import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/teachers
 * Fetch all teachers from MongoDB 'teachers' collection
 * Query Params: ?search=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();

    const db = await getDb();
    const teachersCollection = db.collection("teachers");

    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { fullName: searchRegex },
        { name: searchRegex },
        { designation: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { mobile: searchRegex },
        { teacherId: searchRegex },
      ];
    }

    const rawTeachers = await teachersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Map and normalize fields for consistent usage
    const teachers = rawTeachers.map((t, index) => {
      const idStr = t._id ? t._id.toString() : `t-${index + 1}`;
      // Generate clean ID code if not present, e.g., "ID NO-AIM 0 235"
      const fallbackIdNo = `ID NO-AIM ${String(index + 1).padStart(3, "0")}`;

      return {
        _id: idStr,
        id: idStr,
        fullName: t.fullName || t.name || "নামহীন শিক্ষক",
        designation: t.designation || "শিক্ষক",
        dateOfBirth: t.dateOfBirth || t.dob || "",
        phone: t.phone || t.mobile || "",
        bloodGroup: t.bloodGroup || t.blood || "",
        teacherId: t.teacherId || t.idNo || fallbackIdNo,
        email: t.email || "",
        profileImage: t.profileImage || t.image || t.photo || "",
        address: t.address || "",
        bio: t.bio || "",
        academic: t.academic || [],
        experience: t.experience || [],
        createdAt: t.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: teachers,
      total: teachers.length,
    });
  } catch (error) {
    console.error("GET /api/admin/teachers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "শিক্ষকদের তালিকা লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/teachers
 * Update a teacher's ID card details in MongoDB
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, _id, ...updateFields } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "শিক্ষকের আইডি দেওয়া হয়নি।" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const teachersCollection = db.collection("teachers");

    let filter = {};
    if (ObjectId.isValid(targetId)) {
      try {
        filter = { $or: [{ _id: new ObjectId(targetId) }, { _id: targetId }] };
      } catch {
        filter = { _id: targetId };
      }
    } else {
      filter = { _id: targetId };
    }

    delete updateFields._id;
    delete updateFields.id;
    updateFields.updatedAt = new Date().toISOString();

    const result = await teachersCollection.updateOne(filter, {
      $set: updateFields,
    });

    return NextResponse.json({
      success: true,
      message: "শিক্ষকের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /api/admin/teachers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
