
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

console.log("TOPIC ROUTES FILE LOADED");

// All topics supported by SmartLearn
const TOPIC_LIST = [
  "JavaScript Basics",
  "Python",
  "Java",
  "Data Structures",
  "Mathematics",
  "Aptitude",
];

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("Topic routes are working!");
});

// Get all topics with actual question counts from MongoDB
router.get("/", async (req, res) => {
  try {
    const topicStats = await Question.aggregate([
      {
        $group: {
          _id: "$topic",
          questionCount: { $sum: 1 },
          difficulties: { $addToSet: "$difficulty" },
        },
      },
    ]);

    // Match database results to the six supported topics
    const topics = TOPIC_LIST.map((topicName) => {
      const existingTopic = topicStats.find(
        (item) =>
          item._id &&
          item._id.toLowerCase() === topicName.toLowerCase()
      );

      return {
        topic: topicName,
        questionCount: existingTopic
          ? existingTopic.questionCount
          : 0,
        difficulties: existingTopic
          ? existingTopic.difficulties
          : [],
        available: existingTopic
          ? existingTopic.questionCount > 0
          : false,
      };
    });

    res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);

    res.status(500).json({
      success: false,
      message: "Could not retrieve topics.",
    });
  }
});

module.exports = router;
