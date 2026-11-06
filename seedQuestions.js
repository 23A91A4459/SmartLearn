
const mongoose = require("mongoose");
const Question = require("../models/Question");

const questions = [
  {
    questionText: "Which keyword declares a variable that can be reassigned in JavaScript?",
    options: ["const", "let", "static", "define"],
    correctAnswer: "let",
    explanation: "The let keyword declares a block-scoped variable whose value can be reassigned.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which data type represents true or false?",
    options: ["String", "Number", "Boolean", "Object"],
    correctAnswer: "Boolean",
    explanation: "Boolean values are either true or false.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which operator checks both value and type equality?",
    options: ["=", "==", "===", "!="],
    correctAnswer: "===",
    explanation: "The strict equality operator compares value and type without automatic type conversion.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which method adds an item to the end of an array?",
    options: ["pop()", "shift()", "push()", "unshift()"],
    correctAnswer: "push()",
    explanation: "The push() method adds one or more elements to the end of an array.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which keyword is used to define a function?",
    options: ["function", "method", "func", "create"],
    correctAnswer: "function",
    explanation: "The function keyword declares a JavaScript function.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which array method creates a new array by transforming each element?",
    options: ["forEach()", "map()", "find()", "some()"],
    correctAnswer: "map()",
    explanation: "map() runs a callback on each element and returns a new array of results.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "Which array method returns the first element that matches a condition?",
    options: ["filter()", "reduce()", "find()", "map()"],
    correctAnswer: "find()",
    explanation: "find() returns the first matching element, or undefined if none matches.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "What does a Promise represent in JavaScript?",
    options: [
      "A CSS style",
      "The eventual result of an asynchronous operation",
      "A loop",
      "A database table",
    ],
    correctAnswer: "The eventual result of an asynchronous operation",
    explanation: "A Promise represents the eventual completion or failure of an asynchronous operation.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "Which array method combines elements into a single accumulated result?",
    options: ["map()", "find()", "reduce()", "includes()"],
    correctAnswer: "reduce()",
    explanation: "reduce() applies a callback to accumulate array elements into one result.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "Which method converts a JSON string into a JavaScript value?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.read()",
    ],
    correctAnswer: "JSON.parse()",
    explanation: "JSON.parse() parses a JSON string and returns the corresponding JavaScript value.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
];

async function seedQuestions() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/smartlearn");

    // Avoid inserting the same sample questions repeatedly.
    const existingQuestions = await Question.countDocuments({
      topic: "JavaScript Basics",
    });

    if (existingQuestions > 0) {
      console.log("JavaScript sample questions already exist. No changes made.");
      return;
    }

    await Question.insertMany(questions);
    console.log("Successfully added 10 sample questions!");
  } catch (error) {
    console.error("Could not add questions:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedQuestions();
