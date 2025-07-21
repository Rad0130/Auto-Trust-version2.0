const Car = require("../models/car");


exports.createCar = async (req, res) => {
  try {
    // const newCar = new Car({ ...req.body, seller: req.user.id });
    const newCar = new Car({
  ...req.body,
  seller: req.user.id,
  image: req.file?.path // Save Cloudinary URL
});

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ message: "Failed to create car", error: err });
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
