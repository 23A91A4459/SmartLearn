
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Import route files
const questionRoutes = require("./routes/questionRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
// Register API routes
app.use("/api/questions", questionRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/auth", authRoutes);
// Startup confirmation messages
console.log("Question routes file:", require.resolve("./routes/questionRoutes"));
console.log("Topic routes file:", require.resolve("./routes/topicRoutes"));
console.log("Question routes registered!");
console.log("Topic routes registered!");

// Home route
app.get("/", (req, res) => {
  res.send("SmartLearn backend is running!");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

// Connect to MongoDB and start server
mongoose
  .connect("mongodb://127.0.0.1:27017/smartlearn")
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
