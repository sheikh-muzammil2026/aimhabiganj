import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/faculty
 * Public API endpoint to fetch active faculty/teachers for the About page
 */
export async function GET() {
  try {
    const db = await getDb();

    // 1. Fetch teachers from 'user' or 'users' collection where role === 'teacher'
    let teacherUsers = await db
      .collection("user")
      .find({ role: { $regex: /^teacher$/i } })
      .toArray()
      .catch(() => []);

    if (!teacherUsers || teacherUsers.length === 0) {
      teacherUsers = await db
        .collection("users")
        .find({ role: { $regex: /^teacher$/i } })
        .toArray()
        .catch(() => []);
    }

    // 2. Fetch profile data from 'teachers' collection
    const teachersProfiles = await db
      .collection("teachers")
      .find({})
      .toArray()
      .catch(() => []);

    // Create lookup map by lowercase email
    const profileMap = new Map();
    teachersProfiles.forEach((t) => {
      if (t.email) {
        profileMap.set(t.email.trim().toLowerCase(), t);
      }
    });

    // 3. Assemble sanitized public faculty list
    const faculty = [];
    const addedEmails = new Set();

    teacherUsers.forEach((user, index) => {
      const emailKey = (user.email || "").trim().toLowerCase();
      if (emailKey) addedEmails.add(emailKey);

      const profile = emailKey ? profileMap.get(emailKey) : null;

      // Format education qualifications
      let education = "";
      if (typeof profile?.education === "string" && profile.education.trim()) {
        education = profile.education.trim();
      } else if (Array.isArray(profile?.academic) && profile.academic.length > 0) {
        education = profile.academic
          .map((a) => a.degree || a.title || a.name || "")
          .filter(Boolean)
          .join(", ");
      }

      faculty.push({
        id: user._id?.toString() || profile?._id?.toString() || `faculty-${index + 1}`,
        name: profile?.fullName?.trim() || user.name?.trim() || "সম্মানিত শিক্ষক",
        designation: profile?.designation?.trim() || user.designation?.trim() || "শিক্ষক",
        department: profile?.department?.trim() || profile?.subject?.trim() || "",
        subject: profile?.subject?.trim() || profile?.department?.trim() || "",
        education: education || "উচ্চতর ইসলামী ও সাধারণ শিক্ষা",
        image: profile?.profileImage || profile?.image || user.image || "",
        email: user.email || profile?.email || "",
        phone: profile?.phone || profile?.mobile || user.phone || "",
        socialLinks: profile?.socialLinks || {},
        bio: profile?.bio || "",
      });
    });

    // 4. Include any additional teachers in 'teachers' collection not present in 'user'
    teachersProfiles.forEach((profile, index) => {
      const emailKey = (profile.email || "").trim().toLowerCase();
      if (!emailKey || !addedEmails.has(emailKey)) {
        if (profile.fullName || profile.name) {
          let education = "";
          if (typeof profile.education === "string" && profile.education.trim()) {
            education = profile.education.trim();
          } else if (Array.isArray(profile.academic) && profile.academic.length > 0) {
            education = profile.academic
              .map((a) => a.degree || a.title || a.name || "")
              .filter(Boolean)
              .join(", ");
          }

          faculty.push({
            id: profile._id?.toString() || `faculty-ext-${index + 1}`,
            name: profile.fullName?.trim() || profile.name?.trim() || "সম্মানিত শিক্ষক",
            designation: profile.designation?.trim() || "শিক্ষক",
            department: profile.department?.trim() || profile.subject?.trim() || "",
            subject: profile.subject?.trim() || profile.department?.trim() || "",
            education: education || "উচ্চতর ইসলামী ও সাধারণ শিক্ষা",
            image: profile.profileImage || profile.image || "",
            email: profile.email || "",
            phone: profile.phone || profile.mobile || "",
            socialLinks: profile.socialLinks || {},
            bio: profile.bio || "",
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    console.error("GET /api/faculty error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "শিক্ষকমণ্ডলীর তথ্য লোড করতে সমস্যা হয়েছে।",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
