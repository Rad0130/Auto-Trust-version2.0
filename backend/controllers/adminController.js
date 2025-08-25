const Car = require("../models/car");
const User = require("../models/user");

exports.toggleCarExclusiveStatus = async (req, res) => {
 try {
   const car = await Car.findById(req.params.id);
   if (!car) {
     return res.status(404).json({ message: "Car not found" });
   }
   car.isExclusiveOffer = !car.isExclusiveOffer; // Toggle the status
   await car.save();
   res.json({ message: "Car exclusive status updated successfully", car });
 } catch (err) {
   console.error("Error toggling exclusive status:", err);
   res.status(500).json({ message: "Error updating exclusive status" });
 }
};

exports.getAllUsers = async (req, res) => {
 try {
   const users = await User.find().select('-password'); // Exclude passwords
   res.json(users);
 } catch (err) {
   console.error("Error fetching users:", err);
   res.status(500).json({ message: "Error fetching users" });
 }
};

exports.verifyUser = async (req, res) => {
 try {
   const user = await User.findById(req.params.id);
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   user.isVerified = true;
   await user.save();
   res.json({ message: "User verified successfully", user });
 } catch (err) {
   console.error("Error verifying user:", err);
   res.status(500).json({ message: "Error verifying user" });
 }
};
