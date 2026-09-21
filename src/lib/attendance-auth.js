import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

/**
 * Resolves current user from Better Auth session or fallback for testing
 * @param {Request} request
 * @param {object|null} fallbackData
 * @returns {Promise<{ id: string, name: string, email: string, role: string, teacherDoc?: object } | null>}
 */
export async function getAuthenticatedTeacher(request, fallbackData = null) {
  let user = null;

  // 1. Try Better Auth session
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (session?.user) {
      user = {
        id: session.user.id || session.user._id?.toString(),
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || "teacher",
      };
    }
  } catch (error) {
    console.warn("Better Auth getSession failed:", error.message);
  }

  // 2. If no session, check fallback (e.g., passed in query or body during testing/dev)
  if (!user && fallbackData?.teacherEmail) {
    const db = await getDb();
    const userDoc = await db
      .collection("user")
      .findOne({ email: fallbackData.teacherEmail });

    if (userDoc) {
      user = {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role || "teacher",
      };
    } else {
      user = {
        id: fallbackData.teacherId || "dev-teacher-id",
        name: fallbackData.teacherName || fallbackData.teacherEmail.split("@")[0],
        email: fallbackData.teacherEmail,
        role: "teacher",
      };
    }
  }

  if (!user) {
    return null;
  }

  // 3. Enrich with teacher profile info from 'teachers' collection if available
  try {
    const db = await getDb();
    const teacherProfile = await db
      .collection("teachers")
      .findOne({ email: user.email });

    if (teacherProfile) {
      if (teacherProfile.fullName) user.name = teacherProfile.fullName;
      user.designation = teacherProfile.designation || "শিক্ষক";
      user.profileImage = teacherProfile.profileImage || "";
      user.teacherProfile = teacherProfile;
    }
  } catch (err) {
    console.error("Failed to query teacher profile:", err);
  }

  return user;
}
