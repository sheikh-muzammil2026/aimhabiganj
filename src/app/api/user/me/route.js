import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient.db("aimhabiganj");
}

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user._id;
    const db = await getDb();

    // Query user collection directly for the latest live permissions and role
    const filter = ObjectId.isValid(userId)
      ? { $or: [{ _id: new ObjectId(userId) }, { _id: String(userId) }, { id: String(userId) }] }
      : { $or: [{ _id: String(userId) }, { id: String(userId) }] };

    let dbUser = await db.collection("user").findOne(filter).catch(() => null);
    if (!dbUser) {
      dbUser = await db.collection("users").findOne(filter).catch(() => null);
    }

    const role = (dbUser?.role || session.user.role || "student").toLowerCase();
    const permissions = Array.isArray(dbUser?.permissions)
      ? dbUser.permissions
      : Array.isArray(session.user.permissions)
      ? session.user.permissions
      : [];
    const isBanned = Boolean(dbUser?.isBanned || dbUser?.status === "banned" || session.user.isBanned);
    const status = isBanned ? "banned" : "active";

    return Response.json({
      success: true,
      user: {
        id: String(userId),
        name: dbUser?.name || session.user.name || "User",
        email: dbUser?.email || session.user.email || "",
        image: dbUser?.image || session.user.image || "",
        role,
        permissions,
        isBanned,
        status,
      },
    });
  } catch (error) {
    console.error("GET /api/user/me error:", error);
    return Response.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
