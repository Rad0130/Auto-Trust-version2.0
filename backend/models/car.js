const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  paymentType: { type: String, enum: ["cash", "installment"], required: true },
  image: { type: String }, // optional for now
  description: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
