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

   const io = req.app.get('socketio');
   if (io) {
     io.emit('newCarPosted', { 
       title: savedCar.title, 
       userName: req.user.name 
     });
   }

   res.status(201).json(savedCar);
 } catch (err) {
   console.error("Upload error:", err);
   res.status(500).json({
     message: "Failed to create car",
     error: err.message
   });
 }
};

// MODIFIED: Only fetches approved cars for public view and handles search
exports.getAllCars = async (req, res) => {
   try {
       const { search } = req.query;
       let query = { isApproved: true };

       if (search) {
           const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
           query.$or = [
               { brand: searchRegex },
               { model: searchRegex },
               { title: searchRegex }
           ];
       }

       const cars = await Car.find(query).populate("seller", "name email");
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

   if (car.seller.toString() !== req.user.id) {
     return res.status(403).json({ message: "Not authorized to update this car" });
   }

   const { seller, ...updateData } = req.body;
  
   if (req.file) {
     updateData.image = req.file.path;
   }

   const updatedCar = await Car.findByIdAndUpdate(
     req.params.id,
     updateData,
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

exports.approveCar = async (req, res) => {
   try {
       const car = await Car.findById(req.params.id);
       if (!car) {
           return res.status(404).json({ message: "Car not found" });
       }
       car.isApproved = true;
       await car.save();

       const io = req.app.get('socketio');
       if (io) {
         io.emit('newCarApproved', { 
           id: car._id, 
           title: car.title, 
           brand: car.brand, 
           model: car.model 
         });
       }

       res.json({ message: "Car approved successfully", car });
   } catch (err) {
       res.status(500).json({ message: "Error approving car" });
   }
};

exports.getPendingCars = async (req, res) => {
   try {
       console.log("Attempting to find pending cars...");
       const pendingCars = await Car.find({ isApproved: false }).populate("seller", "name email");
       console.log("Successfully found and populated pending cars:", pendingCars.length);
       res.json(pendingCars);
   } catch (err) {
       console.error("Error during database query in getPendingCars:", err.message);
       res.status(500).json({ message: "Failed to fetch pending cars" });
   }
};
