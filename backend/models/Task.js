import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium", index: true },
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo", index: true },
    dueDate: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
