import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Enquiry model — stores project enquiries submitted from the public
 * "Start A Project" / Contact form. This is the single source of truth
 * for the Admin Enquiry Dashboard (Phase 8) and is fully decoupled from
 * the User/auth system, since enquiries can be submitted by anonymous
 * visitors.
 */
const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    company: { type: String, trim: true, default: "", maxlength: 150 },
    projectType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Residential",
        "Commercial",
        "Infrastructure",
        "Industrial",
        "Mixed-Use",
        "Other",
      ],
    },
    budgetRange: {
      type: String,
      trim: true,
      default: "",
      enum: ["", "< 10 Cr", "10-50 Cr", "50-100 Cr", "100-500 Cr", "> 500 Cr"],
    },
    location: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Closed"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
);

// Speeds up the Admin Dashboard's default "most recent first" sort.
enquirySchema.index({ createdAt: -1 });
// Lightweight text index for the dashboard's search box.
enquirySchema.index({ name: "text", email: "text", company: "text", location: "text" });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
