import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const exists = await User.findOne({ email });
  const isAdmin = ADMIN_EMAIL && email === ADMIN_EMAIL;
  if (exists) {
    if (!isAdmin) return res.status(409).json({ message: "Email already registered" });
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD || "", 10);
    const updated = await User.findByIdAndUpdate(exists._id, {
      $set: {
        name: ADMIN_NAME,
        role: "admin",
        emailVerified: true,
        password: adminHash
      }
    }, { new: true });
    const token = jwt.sign({ sub: updated._id.toString(), email: updated.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
    return res.status(200).json({
      token,
      user: {
        id: updated._id.toString(),
        email: updated.email,
        name: updated.name || "",
        role: updated.role,
        emailVerified: updated.emailVerified ?? false
      }
    });
  }
  const passwordSource = isAdmin && ADMIN_PASSWORD ? ADMIN_PASSWORD : password;
  const hash = await bcrypt.hash(passwordSource, 10);
  const user = await User.create({
    email,
    password: hash,
    name: isAdmin ? ADMIN_NAME : name,
    role: isAdmin ? "admin" : "user",
    emailVerified: isAdmin ? true : false
  });
  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name || "",
      role: user.role,
      emailVerified: user.emailVerified ?? false
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const isAdminEmail = ADMIN_EMAIL && email === ADMIN_EMAIL;
  let user = await User.findOne({ email });
  if (!user && isAdminEmail) {
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD || "", 10);
    user = await User.create({
      email: ADMIN_EMAIL,
      password: adminHash,
      name: ADMIN_NAME,
      role: "admin",
      emailVerified: true
    });
  }
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (isAdminEmail) {
    if (password !== (ADMIN_PASSWORD || "")) return res.status(401).json({ message: "Invalid credentials" });
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD || "", 10);
    if (user.role !== "admin" || !(await bcrypt.compare(ADMIN_PASSWORD || "", user.password))) {
      await User.findByIdAndUpdate(user._id, {
        $set: { role: "admin", emailVerified: true, password: adminHash }
      });
      user = await User.findById(user._id);
    }
  } else {
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  }
  await User.findByIdAndUpdate(user._id, { $set: { lastLoginAt: new Date() } });
  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name || "",
      role: user.role,
      emailVerified: user.emailVerified ?? false,
      lastLoginAt: new Date().toISOString()
    }
  });
});

export default router;
