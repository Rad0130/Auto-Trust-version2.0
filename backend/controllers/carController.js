const Car = require("../models/car");

exports.createCar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const newCar = new Car({
      ...req.body,
      seller: req.user.id,
      image: req.file.path // Cloudinary URL
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      message: "Failed to create car",
      error: err.message 
    });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("seller", "name email");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cars", error: err });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("seller", "name email");
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Error fetching car" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting car" });
  }
};


exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Verify the user owns the car
    if (car.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this car" });
    }

    const { seller, ...updateData } = req.body; // Remove seller from update data
    
    // Handle image update if new file is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      updateData, // Only include fields that should be updated
      { new: true, runValidators: true }
    ).populate("seller", "name email");

    res.json(updatedCar);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      message: "Error updating car", 
      error: err.message 
    });
  }
};