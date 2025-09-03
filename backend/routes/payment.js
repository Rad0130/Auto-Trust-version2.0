const express = require("express");
const router = express.Router();
const {
  createPayment,
  processPayment,
  confirmPayment,
  getPaymentStatus,
  getUserPayments
} = require("../controllers/paymentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createPayment);
router.get("/user", verifyToken, getUserPayments);
router.get("/:id", verifyToken, getPaymentStatus);
router.post("/:id/process", verifyToken, processPayment);
router.post("/:id/confirm", verifyToken, confirmPayment);

module.exports = router;