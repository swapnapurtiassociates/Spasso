import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
      console.log("RAW URI:");
      console.log(JSON.stringify(process.env.MONGODB_URI));
    const conn = await mongoose.connect(uri, {
      dbName: "swapnapurti",
      family: 4,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    throw error;
  }
}