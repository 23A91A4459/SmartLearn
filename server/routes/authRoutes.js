const crypto = require("crypto");

const { sendPasswordResetEmail } = require("../emailService");

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanEmail.length > 254 ||
      !emailPattern.test(cleanEmail)
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 characters.",
      });
    }

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Never store the original password
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle duplicate email races safely
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account right now.",
    });
  }
});

const jwt = require("jsonwebtoken");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Include passwordHash because the User model hides it by default
    const user = await User.findOne({
      email: cleanEmail,
    }).select("+passwordHash");

    // Use the same message for an unknown email and wrong password
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from the server environment.");

      return res.status(500).json({
        message: "Login is temporarily unavailable.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in right now.",
    });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    const genericMessage =
      "If an account exists for that email, a password-reset link will be sent.";

    if (!email || email.length > 254) {
      return res.status(200).json({ message: genericMessage });
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

      await user.save();

      const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetLink =
        `${frontendUrl}/reset-password?token=${resetToken}`;

      try {
        await sendPasswordResetEmail(user.email, resetLink);
      } catch (emailError) {
        user.resetTokenHash = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        console.error("Password-reset email failed:", emailError.message);
        return res.status(500).json({
          message: "Unable to send the reset email. Please try again later.",
        });
      }
    }

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot-password error:", error.message);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/i.test(token) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message: "Invalid or expired reset link, or password is invalid.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+resetTokenHash +resetTokenExpiry +passwordHash");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link.",
      });
    }

    user.passwordHash = await require("bcryptjs").hash(password, 12);
    user.resetTokenHash = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset-password error:", error.message);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
});
// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "name email bio learningPreferences createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        learningPreferences: user.learningPreferences || {
          difficulty: "Medium",
          topics: [],
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load profile.",
    });
  }
});

 // PUT /api/auth/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
   const { name, email, bio, learningPreferences } = req.body;

    const updates = {};
    if (email !== undefined) {
  if (typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be text.",
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    cleanEmail.length > 254 ||
    !emailPattern.test(cleanEmail)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  const existingUser = await User.findOne({
    email: cleanEmail,
    _id: { $ne: req.user.userId },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "This email address is already registered.",
    });
  }

  updates.email = cleanEmail;
}
    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Name must be text.",
        });
      }

      const cleanName = name.trim();

      if (cleanName.length < 2 || cleanName.length > 80) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 80 characters.",
        });
      }

      updates.name = cleanName;
    }

    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.trim().length > 250) {
        return res.status(400).json({
          success: false,
          message: "Bio must be text with at most 250 characters.",
        });
      }

      updates.bio = bio.trim();
    }

    if (learningPreferences !== undefined) {
      if (
        !learningPreferences ||
        typeof learningPreferences !== "object" ||
        Array.isArray(learningPreferences)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid learning preferences.",
        });
      }

      const { difficulty, topics } = learningPreferences;

      if (difficulty !== undefined) {
        if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
          return res.status(400).json({
            success: false,
            message: "Choose Easy, Medium, or Hard difficulty.",
          });
        }

        updates["learningPreferences.difficulty"] = difficulty;
      }

      if (topics !== undefined) {
        const allowedTopics = [
          "Python",
          "Java",
          "JavaScript",
          "React",
          "SQL",
          "Data Structures",
          "Mathematics",
          "Aptitude",
        ];

        if (
          !Array.isArray(topics) ||
          topics.some(
            (topic) =>
              typeof topic !== "string" ||
              !allowedTopics.includes(topic)
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "One or more learning topics are invalid.",
          });
        }

        updates["learningPreferences.topics"] = [...new Set(topics)];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile changes were provided.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email bio learningPreferences createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        learningPreferences: user.learningPreferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile right now.",
    });
  }
});

/* DELETE /api/auth/account */
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;

    if (typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password to confirm account deletion.",
      });
    }

    // Find the authenticated user's account and password hash
    const user = await User.findById(req.user.userId).select("+passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Verify the current password before deleting anything
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Your account has not been deleted.",
      });
    }

    // Delete this user's quiz history, not shared questions
    await QuizAttempt.deleteMany({ userId: user._id });

    // Delete the account
    await User.deleteOne({ _id: user._id });

    return res.status(200).json({
      success: true,
      message: "Your account and quiz history have been deleted.",
    });
  } catch (error) {
    console.error("Delete account error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete your account right now.",
    });
  }
});

module.exports = router;
