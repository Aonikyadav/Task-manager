import { Router } from "express";
import Task from "../models/Task.js";

const router = Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId required" });
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const { userId, title, description, priority, status, dueDate } = req.body;
  if (!userId || !title) return res.status(400).json({ message: "userId and title required" });
  const task = await Task.create({
    userId,
    title,
    description: description ?? "",
    priority: priority ?? "medium",
    status: status ?? "todo",
    dueDate: dueDate ? new Date(dueDate) : null
  });
  res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = {};
  const fields = ["title", "description", "priority", "status", "dueDate"];
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates[f] = f === "dueDate" ? (req.body[f] ? new Date(req.body[f]) : null) : req.body[f];
    }
  }
  const task = await Task.findByIdAndUpdate(id, updates, { new: true });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
