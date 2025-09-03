const Payment = require("../models/payment");
const Car = require("../models/car");
const User = require("../models/user");
const mongoose = require("mongoose");

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { carId, paymentMethod, installmentPlan, bankDetails, deliveryAddress } = req.body;
    
    console.log("Received carId:", carId);
    
    // Validate carId
    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }
    
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    
    // Check if car is already sold
    if (car.isSold) {
      return res.status(400).json({ message: "This car has already been sold" });
    }
    
    const buyer = await User.findById(req.user.id);
    const seller = await User.findById(car.seller);
    
    let installmentDetails = null;
    if (paymentMethod === "installment") {
      if (!installmentPlan) {
        return res.status(400).json({ message: "Installment plan is required" });
      }
      
      // Calculate installment details
      const downPaymentAmount = car.price * (installmentPlan.downPayment / 100);
      const remainingAmount = car.price - downPaymentAmount;
      const installmentAmount = remainingAmount / installmentPlan.numberOfInstallments;
      
      installmentDetails = {
        downPayment: downPaymentAmount,
        numberOfInstallments: installmentPlan.numberOfInstallments,
        installmentAmount: installmentAmount,
        frequency: installmentPlan.frequency
      };
    }
    
    // Calculate estimated delivery date (7 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
    
    const payment = new Payment({
      car: carId,
      buyer: req.user.id,
      seller: car.seller,
      amount: car.price,
      paymentMethod,
      installmentPlan: installmentDetails,
      bankDetails: paymentMethod === "bank_transfer" ? bankDetails : null,
      deliveryAddress,
      estimatedDeliveryDate
    });
    
    await payment.save();
    
    // Emit socket event for new payment
    const io = req.app.get('socketio');
    if (io) {
      io.to(car.seller.toString()).emit('newPayment', {
        message: `New payment initiated for your car: ${car.title}`,
        paymentId: payment._id,
        buyerName: buyer.name
      });
    }
    
    res.status(201).json({ 
      message: "Payment initiated successfully", 
      payment,
      redirectUrl: `/payment/${payment._id}/process`
    });
  } catch (err) {
    console.error("Payment creation error:", err);
    res.status(500).json({ message: "Failed to create payment", error: err.message });
  }
};

// Process payment based on method
exports.processPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("car")
      .populate("buyer")
      .populate("seller");
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    if (payment.buyer._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to process this payment" });
    }
    
    // Different processing based on payment method
    switch (payment.paymentMethod) {
      case "bank_transfer":
        // In a real app, you would integrate with a banking API
        // For demo purposes, we'll simulate bank transfer
        payment.status = "processing";
        payment.bankDetails.transactionId = `TRX${Date.now()}`;
        break;
        
      case "cash_on_delivery":
        payment.status = "pending";
        break;
        
      case "installment":
        payment.status = "processing";
        break;
    }
    
    await payment.save();
    
    res.json({ 
      message: "Payment processed successfully", 
      payment,
      nextStep: payment.paymentMethod === "bank_transfer" ? 
        `/payment/${payment._id}/confirm` : 
        `/payment/${payment._id}/status`
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    res.status(500).json({ message: "Failed to process payment", error: err.message });
  }
};

// Confirm payment completion
exports.confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("car")
      .populate("buyer")
      .populate("seller");
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    if (payment.buyer._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to confirm this payment" });
    }
    
    // Mark payment as completed
    payment.status = "completed";
    payment.transactionDate = new Date();
    
    // Calculate actual delivery date (3-5 days from confirmation)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
    payment.deliveryDate = deliveryDate;
    
    // Mark car as sold
    const car = await Car.findById(payment.car._id);
    car.isSold = true;
    await car.save();
    
    await payment.save();
    
    // Send notifications
    const io = req.app.get('socketio');
    if (io) {
      // Notify buyer
      io.to(payment.buyer._id.toString()).emit('paymentConfirmed', {
        message: `Your payment for ${car.title} has been confirmed!`,
        paymentId: payment._id,
        deliveryDate: payment.deliveryDate
      });
      
      // Notify seller
      io.to(payment.seller._id.toString()).emit('carSold', {
        message: `Your car ${car.title} has been sold!`,
        paymentId: payment._id,
        amount: payment.amount
      });
    }
    
    res.json({ 
      message: "Payment confirmed successfully", 
      payment,
      redirectUrl: `/payment/${payment._id}/success`
    });
  } catch (err) {
    console.error("Payment confirmation error:", err);
    res.status(500).json({ message: "Failed to confirm payment", error: err.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("car")
      .populate("buyer")
      .populate("seller");
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    if (payment.buyer._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this payment" });
    }
    
    res.json(payment);
  } catch (err) {
    console.error("Payment status error:", err);
    res.status(500).json({ message: "Failed to get payment status", error: err.message });
  }
};

// Get user's payment history
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ buyer: req.user.id })
      .populate("car")
      .populate("seller")
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (err) {
    console.error("Get user payments error:", err);
    res.status(500).json({ message: "Failed to get payment history", error: err.message });
  }
};