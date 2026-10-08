import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

const INITIAL_STAFF_MEMBERS = [
  {
    fullName: "মুহাম্মদ আব্দুল্লাহ",
    designation: "অফিস সহকারী (Office Assistant)",
    dateOfBirth: "15/05/1992",
    phone: "01712345678",
    email: "abdullah.office@aimhabiganj.edu.bd",
    bloodGroup: "A (+)",
    staffId: "ID NO-AIM ST-001",
    profileImage: "",
    address: "হবিগঞ্জ সদর, হবিগঞ্জ",
    joiningDate: "01/01/2023",
  },
  {
    fullName: "মোঃ রফিকুল ইসলাম",
    designation: "হিসাব কর্মকর্তা (Accountant)",
    dateOfBirth: "10/08/1990",
    phone: "01812345678",
    email: "rafiq.accounts@aimhabiganj.edu.bd",
    bloodGroup: "B (+)",
    staffId: "ID NO-AIM ST-002",
    profileImage: "",
    address: "বানিয়াচং, হবিগঞ্জ",
    joiningDate: "15/03/2022",
  },
  {
    fullName: "মাওলানা হাবিবুর রহমান",
    designation: "গ্রন্থাগারিক (Librarian)",
    dateOfBirth: "20/11/1988",
    phone: "01912345678",
    email: "habibur.lib@aimhabiganj.edu.bd",
    bloodGroup: "O (+)",
    staffId: "ID NO-AIM ST-003",
    profileImage: "",
    address: "নবীগঞ্জ, হবিগঞ্জ",
    joiningDate: "01/06/2021",
  },
  {
    fullName: "মোঃ নূরুল আমিন",
    designation: "নিরাপত্তা প্রহরী (Security Guard)",
    dateOfBirth: "05/01/1985",
    phone: "01612345678",
    email: "nurul.security@aimhabiganj.edu.bd",
    bloodGroup: "AB (+)",
    staffId: "ID NO-AIM ST-004",
    profileImage: "",
    address: "চুনারুঘাট, হবিগঞ্জ",
    joiningDate: "10/02/2020",
  },
  {
    fullName: "মোঃ শামসুল হক",
    designation: "বাবুর্চি ও ডাইনিং সহকারী (Chef)",
    dateOfBirth: "12/09/1987",
    phone: "01512345678",
    email: "shamsul.chef@aimhabiganj.edu.bd",
    bloodGroup: "O (+)",
    staffId: "ID NO-AIM ST-005",
    profileImage: "",
    address: "মাধবপুর, হবিগঞ্জ",
    joiningDate: "01/08/2021",
  },
];

/**
 * GET /api/admin/staff
 * Fetch all staff from MongoDB 'staff' collection (seeds initial demo list if empty)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();

    const db = await getDb();
    const staffCollection = db.collection("staff");

    // Check count and seed if empty
    const totalCount = await staffCollection.countDocuments();
    if (totalCount === 0) {
      const now = new Date();
      const docsToInsert = INITIAL_STAFF_MEMBERS.map((s) => ({
        ...s,
        createdAt: now,
        updatedAt: now,
      }));
      await staffCollection.insertMany(docsToInsert);
    }

    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { fullName: searchRegex },
        { name: searchRegex },
        { designation: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { staffId: searchRegex },
      ];
    }

    const rawStaff = await staffCollection
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    const staffList = rawStaff.map((s, index) => {
      const idStr = s._id ? s._id.toString() : `staff-${index + 1}`;
      const fallbackStaffId = `ID NO-AIM ST-${String(index + 1).padStart(3, "0")}`;

      return {
        _id: idStr,
        id: idStr,
        fullName: s.fullName || s.name || "নামহীন কর্মচারী",
        designation: s.designation || "স্টাফ",
        dateOfBirth: s.dateOfBirth || s.dob || "",
        phone: s.phone || s.mobile || "",
        bloodGroup: s.bloodGroup || s.blood || "",
        staffId: s.staffId || s.idNo || fallbackStaffId,
        email: s.email || "",
        profileImage: s.profileImage || s.image || "",
        address: s.address || "",
        joiningDate: s.joiningDate || "",
        createdAt: s.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: staffList,
      total: staffList.length,
    });
  } catch (error) {
    console.error("GET /api/admin/staff error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "স্টাফদের তালিকা লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/staff
 * Add a new staff member
 */
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.fullName || !body.designation) {
      return NextResponse.json(
        { success: false, message: "স্টাফের পূর্ণ নাম ও পদবি আবশ্যক।" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const staffCollection = db.collection("staff");

    const count = await staffCollection.countDocuments();
    const staffId =
      body.staffId || `ID NO-AIM ST-${String(count + 1).padStart(3, "0")}`;

    const newDoc = {
      fullName: body.fullName.trim(),
      designation: body.designation.trim(),
      dateOfBirth: (body.dateOfBirth || "").trim(),
      phone: (body.phone || "").trim(),
      email: (body.email || "").trim(),
      bloodGroup: (body.bloodGroup || "").trim(),
      staffId: staffId.trim(),
      profileImage: (body.profileImage || "").trim(),
      address: (body.address || "").trim(),
      joiningDate: (body.joiningDate || "").trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await staffCollection.insertOne(newDoc);

    return NextResponse.json({
      success: true,
      message: "নতুন স্টাফ সফলভাবে যুক্ত হয়েছে!",
      data: {
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
        ...newDoc,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: "স্টাফ সংরক্ষণে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/staff
 * Update an existing staff member
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, _id, ...updateFields } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "স্টাফের আইডি দেওয়া হয়নি।" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const staffCollection = db.collection("staff");

    let filter = {};
    if (ObjectId.isValid(targetId)) {
      filter = { _id: new ObjectId(targetId) };
    } else {
      filter = { staffId: targetId };
    }

    updateFields.updatedAt = new Date();

    const updateRes = await staffCollection.updateOne(filter, {
      $set: updateFields,
    });

    if (updateRes.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "স্টাফের রেকর্ড খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "স্টাফের তথ্য সফলভাবে আপডেট হয়েছে!",
    });
  } catch (error) {
    console.error("PATCH /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: "স্টাফ আপডেট করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/staff
 * Remove a staff member
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "আইডি দেওয়া হয়নি।" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const staffCollection = db.collection("staff");

    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { staffId: id };

    await staffCollection.deleteOne(filter);

    return NextResponse.json({
      success: true,
      message: "স্টাফ সফলভাবে ডিলিট করা হয়েছে!",
    });
  } catch (error) {
    console.error("DELETE /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: "স্টাফ ডিলিট করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
