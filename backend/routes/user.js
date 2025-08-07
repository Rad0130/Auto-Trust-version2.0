const express = require("express");
const router = express.Router();
const { 
  getUserProfile,
  getUserCars, 
  updateUser, 
  deleteUser 
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, getUserProfile);
router.get("/my-cars", verifyToken, getUserCars);
router.put("/", verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser);

module.exports = router;