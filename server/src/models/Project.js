import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed", "On Hold"],
      default: "Planned",
    },
    clientName: { type: String, default: "" },
    customer: { type: Schema.Types.ObjectId, ref: "User", default: null },
    projectValue: { type: String, default: "" },
    completionYear: { type: Number },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tags: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },

    // Marketing-site fields
    areaCovered: { type: String, default: "" },
    keyFeatures: { type: [String], default: [] },
    startDate: { type: Date },
    completionDate: { type: Date },
    featured: { type: Boolean, default: false, index: true },

    assignedEngineers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
