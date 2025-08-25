const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const { 
  toggleCarExclusiveStatus, 
  getAllUsers, 
  verifyUser 
} = require("../controllers/adminController");

// Admin only routes
router.patch("/cars/:id/exclusive", verifyToken, verifyAdmin, toggleCarExclusiveStatus);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.patch("/users/:id/verify", verifyToken, verifyAdmin, verifyUser);

module.exports = router;