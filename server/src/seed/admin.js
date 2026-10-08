import "../config/env.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { validatePassword } from "../utils/validation.js";

async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const passwordError = password ? validatePassword(password) : "ADMIN_PASSWORD is required";

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || passwordError) {
    throw new Error(passwordError || "Set a valid ADMIN_EMAIL before provisioning the admin.");
  }

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        firstName: process.env.ADMIN_FIRST_NAME || "Admin",
        lastName: process.env.ADMIN_LAST_NAME || "Owner",
        passwordHash,
        role: "admin",
        isActive: true,
        activeSessionId: null,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  console.log(`[admin:setup] Configured the single allowlisted administrator: ${email}`);
  await mongoose.connection.close();
}

setupAdmin().catch(async (error) => {
  console.error("[admin:setup] Could not provision administrator:", error.message);
  if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
  process.exitCode = 1;
});
