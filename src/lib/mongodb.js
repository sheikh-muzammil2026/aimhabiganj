import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

function createClientPromise() {
  const client = new MongoClient(uri, options);
  const promise = client.connect();
  promise.catch(() => {
    if (global._mongoClientPromise === promise) {
      global._mongoClientPromise = null;
    }
  });
  return promise;
}

let clientPromise;

if (uri) {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  clientPromise = global._mongoClientPromise;
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
  let connectedClient;
  try {
    connectedClient = await (global._mongoClientPromise || clientPromise);
    if (
      connectedClient.s?.hasBeenClosed ||
      (connectedClient.topology &&
        (connectedClient.topology.isClosed?.() ||
          connectedClient.topology.s?.state === "closed"))
    ) {
      global._mongoClientPromise = createClientPromise();
      connectedClient = await global._mongoClientPromise;
    }
  } catch (err) {
    global._mongoClientPromise = null;
    throw err;
  }
  return connectedClient.db(dbName);
}
