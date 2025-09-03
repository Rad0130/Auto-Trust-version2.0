const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http'); // Import Node.js http module
const { Server } = require("socket.io"); // Import Socket.IO Server class

const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/car");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin"); // New import for admin routes
const paymentRoutes = require("./routes/payment");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server instance using your Express app

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "https://auto-trust-version2-0.vercel.app", // Allow connections from your frontend
    methods: ["GET", "POST"]
  }
});

// Store connected users with their socket IDs
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('🔗 A user connected:', socket.id);

  socket.on('joinUser', (userId) => {
    socket.join(userId);
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} joined their private room.`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    // Remove user from connected users
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

app.set('socketio', io); // Expose io object so other modules can use it to emit events

// ✅ Middleware
app.use(cors({ origin: "https://auto-trust-version2-0.vercel.app", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes); // New admin routes
app.use("/api/payment", paymentRoutes);

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server (using the http server, not the express app directly)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
  console.log(`🚀 Server running on port ${PORT}`);
});