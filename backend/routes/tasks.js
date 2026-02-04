import { Router } from "express";
import Task from "../models/Task.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

/**
 * GET /api/tasks
 * Get all tasks for the authenticated user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate priority
    const validPriorities = ["high", "medium", "low"];
    const taskPriority = priority && validPriorities.includes(priority) ? priority : "medium";

    // Validate status
    const validStatuses = ["todo", "in-progress", "completed"];
    const taskStatus = status && validStatuses.includes(status) ? status : "todo";

    const task = await Task.create({
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() ?? "",
      priority: taskPriority,
      status: taskStatus,
      dueDate: dueDate ? new Date(dueDate) : null
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task (only if owned by authenticated user)
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied: You can only update your own tasks" });
    }

    const updates = {};
    const fields = ["title", "description", "priority", "status", "dueDate"];
    
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        if (f === "dueDate") {
          updates[f] = req.body[f] ? new Date(req.body[f]) : null;
        } else if (f === "title" && req.body[f]?.trim() === "") {
          return res.status(400).json({ message: "Title cannot be empty" });
        } else {
          updates[f] = req.body[f];
        }
      }
    }

    // Validate priority if provided
    if (updates.priority) {
      const validPriorities = ["high", "medium", "low"];
      if (!validPriorities.includes(updates.priority)) {
        return res.status(400).json({ message: "Invalid priority value" });
      }
    }

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ["todo", "in-progress", "completed"];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Failed to update task" });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task (only if owned by authenticated user)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied: You can only delete your own tasks" });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
