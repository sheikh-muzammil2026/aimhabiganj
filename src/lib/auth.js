import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aimhabiganj";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});
const db = client.db("aimhabiganj");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "build-time-secret-placeholder-minimum-32-characters-long",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URI ||
    "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
      },
      permissions: {
        type: "string[]",
        defaultValue: [],
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
    },
  },
});
