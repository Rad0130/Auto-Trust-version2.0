const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["bank_transfer", "cash_on_delivery", "installment"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed", "refunded"], 
    default: "pending" 
  },
  installmentPlan: {
    downPayment: Number,
    numberOfInstallments: Number,
    installmentAmount: Number,
    frequency: { type: String, enum: ["monthly", "quarterly"] }
  },
  bankDetails: {
    accountNumber: String,
    accountName: String,
    bankName: String,
    routingNumber: String,
    transactionId: String
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  deliveryDate: Date,
  estimatedDeliveryDate: Date,
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);