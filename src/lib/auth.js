
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("aimhabiganj");

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
        defaultValue: "parent"
      },
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //   },
  // },

  // databaseHooks: {
  //   user: {
  //     create: {
  //       before: async (user) => {

  //         if (!user.password) {
  //           return {
  //             data: {
  //               ...user,
  //               role: "parent",
  //             },
  //           };
  //         }
  //         return { data: user };
  //       },
  //     },
  //   },
  // },
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     strategy: "jwt",
  //     maxAge: 60 * 24 * 30,
  //   }
  // },
  // plugins: [
  //   jwt()
  // ]
});
