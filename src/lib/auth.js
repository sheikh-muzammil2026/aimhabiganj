import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("aimhabiganj");

export const auth = betterAuth({
  // ১. ডাটাবেজ অ্যাডাপ্টারের সঠিক সিনট্যাক্স
  database: mongodbAdapter({
    db: db,
    client: client
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // রেজিস্ট্রেশনের পর সরাসরি লগইন হবে না, ভেরিফিকেশনের জন্য ভালো
  },

  // ২. কাস্টম রোল ফিল্ড অ্যাড করার সঠিক ও আধুনিক নিয়ম (মাদ্রাসার জন্য "student" ডিফল্ট)
  user: {
    modelName: "user",
    fields: {
      role: {
        type: "string",
        defaultValue: "student", // "tenant" থেকে পরিবর্তন করে "student" করা হলো
        required: false,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  // ৩. সোশ্যাল লগইন (যেমন Google) দিয়ে ঢুকলে পাসওয়ার্ড থাকে না। 
  // তাদের জন্যও যেন ডিফল্ট "student" রোল সেট হয়, সেজন্য নিচের হুকটি আন-কমেন্ট করে দেওয়া হলো:
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role || "student", 
            },
          };
        },
      },
    },
  },
});
