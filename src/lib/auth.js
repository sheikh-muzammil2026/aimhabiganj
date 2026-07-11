import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("StayNest");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "tenant"
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // যদি ইউজার সোশ্যাল অ্যাকাউন্ট (Google) দিয়ে সাইন-আপ করে
          // Better-Auth-এ সোশ্যাল সাইন-আপের সময় সাধারণত পাসওয়ার্ড থাকে না বা ইউজার অবজেক্টে নির্দিষ্ট ফ্ল্যাগ থাকে
          if (!user.password) {
            return {
              data: {
                ...user,
                role: "tenant",
              },
            };
          }
          return { data: user };
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30,
    }
  },
  plugins: [
    jwt()
  ]
});
