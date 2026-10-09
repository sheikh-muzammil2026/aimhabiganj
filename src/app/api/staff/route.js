import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/staff
 * Public API endpoint to fetch active staff members for the About page & staff directory
 */
export async function GET() {
  try {
    const db = await getDb();

    // 1. Fetch staff users from 'user' or 'users' collection where role === 'staff'
    let staffUsers = await db
      .collection("user")
      .find({ role: { $regex: /^staff$/i } })
      .toArray()
      .catch(() => []);

    if (!staffUsers || staffUsers.length === 0) {
      staffUsers = await db
        .collection("users")
        .find({ role: { $regex: /^staff$/i } })
        .toArray()
        .catch(() => []);
    }

    // 2. Fetch profile data from 'staff' collection
    const staffProfiles = await db
      .collection("staff")
      .find({})
      .toArray()
      .catch(() => []);

    // Create lookup map by lowercase email
    const profileMap = new Map();
    staffProfiles.forEach((s) => {
      if (s.email) {
        profileMap.set(s.email.trim().toLowerCase(), s);
      }
    });

    // 3. Assemble sanitized public staff list
    const staffList = [];
    const addedEmails = new Set();

    staffUsers.forEach((user, index) => {
      const emailKey = (user.email || "").trim().toLowerCase();
      if (emailKey) addedEmails.add(emailKey);

      const profile = emailKey ? profileMap.get(emailKey) : null;

      staffList.push({
        id: user._id?.toString() || profile?._id?.toString() || `staff-${index + 1}`,
        name: profile?.fullName?.trim() || user.name?.trim() || "কর্মকর্তা / কর্মচারী",
        fullName: profile?.fullName?.trim() || user.name?.trim() || "কর্মকর্তা / কর্মচারী",
        role: profile?.designation?.trim() || user.designation?.trim() || "স্টাফ",
        designation: profile?.designation?.trim() || user.designation?.trim() || "স্টাফ",
        department: profile?.department?.trim() || "প্রশাসন ও সেবা",
        phone: profile?.phone || profile?.mobile || user.phone || "",
        contact: profile?.phone || profile?.mobile || user.phone || "",
        email: user.email || profile?.email || "",
        staffId: profile?.staffId || "",
        bloodGroup: profile?.bloodGroup || "",
        joiningDate: profile?.joiningDate || "",
        dateOfBirth: profile?.dateOfBirth || "",
        address: profile?.address || "",
        image: profile?.profileImage || profile?.image || user.image || "",
        profileImage: profile?.profileImage || profile?.image || user.image || "",
        bio: profile?.bio || "",
      });
    });

    // 4. Include any staff members in 'staff' collection not present in 'user'
    staffProfiles.forEach((profile, index) => {
      const emailKey = (profile.email || "").trim().toLowerCase();
      if (!emailKey || !addedEmails.has(emailKey)) {
        if (profile.fullName || profile.name) {
          staffList.push({
            id: profile._id?.toString() || `staff-ext-${index + 1}`,
            name: profile.fullName?.trim() || profile.name?.trim() || "কর্মকর্তা / কর্মচারী",
            fullName: profile.fullName?.trim() || profile.name?.trim() || "কর্মকর্তা / কর্মচারী",
            role: profile.designation?.trim() || "স্টাফ",
            designation: profile.designation?.trim() || "স্টাফ",
            department: profile.department?.trim() || "প্রশাসন ও সেবা",
            phone: profile.phone || profile.mobile || "",
            contact: profile.phone || profile.mobile || "",
            email: profile.email || "",
            staffId: profile.staffId || "",
            bloodGroup: profile.bloodGroup || "",
            joiningDate: profile.joiningDate || "",
            dateOfBirth: profile.dateOfBirth || "",
            address: profile.address || "",
            image: profile.profileImage || profile.image || "",
            profileImage: profile.profileImage || profile.image || "",
            bio: profile.bio || "",
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      count: staffList.length,
      data: staffList,
    });
  } catch (error) {
    console.error("GET /api/staff error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "কর্মকর্তা ও কর্মচারীদের তথ্য লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
