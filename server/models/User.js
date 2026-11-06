
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
        bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    learningPreferences: {
      difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
      },
      topics: {
        type: [String],
        default: [],
      },
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    resetTokenHash: {
      type: String,
      default: undefined,
      select: false,
    },

    resetTokenExpiry: {
      type: Date,
      default: undefined,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
