import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Unified User model for all roles: customer, engineer, admin, ceo.
 * Role-specific fields are kept optional so one collection can serve everyone.
 */
const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple docs without a phone, but unique when present
      index: true,
    },
    countryCode: { type: String, default: "+91", trim: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "engineer", "admin", "ceo"],
      required: true,
      default: "customer",
      index: true,
    },

    // Profile
    profileImageUrl: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },

    // Engineer-specific fields
    specialization: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    available: { type: Boolean, default: true },

    // Admin-specific fields
    department: { type: String, default: "" },

    // Account status / security
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    lastActivity: { type: Date },

    // Online presence (for real-time features)
    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: null },

    // Single active session enforcement: only the most recently issued
    // session token is considered valid. Logging in elsewhere invalidates
    // any previous session for this account.
    activeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.socketId;
    delete ret.activeSessionId;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
