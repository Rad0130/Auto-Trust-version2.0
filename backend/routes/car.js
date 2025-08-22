const express = require("express");
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  deleteCar,
  updateCar,
  approveCar,
  getPendingCars
} = require("../controllers/carController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const verifyAdmin = require("../middleware/adminMiddleware");

// Public route to get all approved cars
router.get("/", getAllCars);

// Admin-only route to get pending cars for approval
router.get("/pending", verifyToken, verifyAdmin, getPendingCars);

// Other public and protected routes
router.get("/:id", getCarById);
router.post("/", verifyToken, upload.single("image"), createCar);
router.patch("/:id/approve", verifyToken, verifyAdmin, approveCar);
router.put("/:id", verifyToken, upload.single("image"), updateCar);
router.delete("/:id", verifyToken, deleteCar);

module.exports = router;