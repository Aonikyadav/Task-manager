import jwt from "jsonwebtoken";

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Token verification failed" });
  }
};

/**
 * Middleware to verify user owns the resource
 */
export const verifyOwnership = (req, res, next) => {
  const { userId } = req.query;
  const { id } = req.params;
  const taskUserId = req.body?.userId;

  // Check if the userId in request matches the authenticated user
  const requestedUserId = userId || taskUserId || id;
  
  if (requestedUserId && req.user.id !== requestedUserId) {
    return res.status(403).json({ message: "Access denied: You can only access your own resources" });
  }

  next();
};
