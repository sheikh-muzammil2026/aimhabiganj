import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aimhabiganj";

const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

function isClientClosed(client) {
  if (!client) return true;
  if (client.s?.hasBeenClosed) return true;
  if (
    client.topology &&
    (client.topology.isClosed?.() || client.topology.s?.state === "closed")
  ) {
    return true;
  }
  return false;
}

function getMongoClient() {
  if (isClientClosed(global._betterAuthMongoClient)) {
    global._betterAuthMongoClient = new MongoClient(uri, options);
  }
  return global._betterAuthMongoClient;
}

const clientProxy = new Proxy({}, {
  get(target, prop, receiver) {
    const client = getMongoClient();
    const val = Reflect.get(client, prop, receiver);
    return typeof val === "function" ? val.bind(client) : val;
  },
});

const dbProxy = new Proxy({}, {
  get(target, prop, receiver) {
    const client = getMongoClient();
    const db = client.db("aimhabiganj");
    const val = Reflect.get(db, prop, receiver);
    return typeof val === "function" ? val.bind(db) : val;
  },
});

const isReplicaSet =
  uri.includes("replicaSet") || uri.includes("mongodb+srv");

export const auth = betterAuth({
  database: mongodbAdapter(dbProxy, {
    client: clientProxy,
    transaction: isReplicaSet,
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
