const express = require("express");
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  deleteCar,
  updateCar
} = require("../controllers/carController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getAllCars);
router.get("/:id", getCarById);
router.delete("/:id", verifyToken, deleteCar);
router.post("/", verifyToken, upload.single("image"), createCar);
router.put("/:id", verifyToken, upload.single("image"), updateCar);

module.exports = router;