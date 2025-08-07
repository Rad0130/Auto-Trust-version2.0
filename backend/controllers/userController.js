const User = require("../models/user");
const Car = require("../models/car");
const bcrypt = require("bcryptjs");

// Get all cars listed by the user
exports.getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ seller: req.user.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your cars" });
  }
};

// Get user profile (without sensitive data)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Validate email uniqueness (if changed)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Prepare updates
    const updates = {
      name: name || user.name,
      email: email || user.email
    };

    // Handle password change if new password provided
    if (newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Hash new password
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// Delete user account (and their cars)
exports.deleteUser = async (req, res) => {
  try {
    // Delete all user's cars first
    await Car.deleteMany({ seller: req.user.id });
    
    // Then delete the user
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Account deletion failed" });
  }
};