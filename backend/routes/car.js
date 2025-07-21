const express = require("express");
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  deleteCar
} = require("../controllers/carController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getAllCars);
router.get("/:id", getCarById);
router.delete("/:id", verifyToken, deleteCar);
router.post("/", verifyToken, upload.single("image"), createCar);


module.exports = router;
