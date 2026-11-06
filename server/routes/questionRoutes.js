
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

console.log("QUESTION ROUTER FILE LOADED");

router.use((req, res, next) => {
  console.log("QUESTION ROUTER RECEIVED:", req.method, req.originalUrl);
  next();
});

router.get("/test", (req, res) => {
  res.send("Question routes are working!");
});

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().select("-correctAnswer");

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);

    res.status(500).json({
      success: false,
      message: "Could not retrieve questions.",
    });
  }
});

module.exports = router;
