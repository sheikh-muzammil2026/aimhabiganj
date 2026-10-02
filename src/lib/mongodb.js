import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient
    // instance is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, reuse global instance across serverless invocations if present
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  }
} else {
  // When building without environment variables present, avoid unhandled rejection
  // to allow Next.js build-time analysis to complete without crashing.
  const rejected = Promise.reject(
    new Error("MONGODB_URI environment variable is not defined.")
  );
  rejected.catch(() => {});
  clientPromise = rejected;
}

export default clientPromise;

export async function getDb(dbName = "aimhabiganj") {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}
