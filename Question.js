
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return options.length === 4;
        },
        message: "A question must have exactly four options.",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
