
const express = require("express");
const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const router = express.Router();

const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const authMiddleware = require("../middleware/authMiddleware");

const TOTAL_QUESTIONS = 10;
const LEVELS = ["Easy", "Medium", "Hard"];
const STARTING_DIFFICULTY = "Medium";
const MIN_ATTEMPTS_FOR_CLASSIFICATION = 3;

// --------------------------------------------------
// COMMON HELPERS
// --------------------------------------------------

// Never send the correct answer or explanation during an active quiz.
function safeQuestion(question) {
  return {
    _id: question._id,
    questionText: question.questionText,
    options: question.options,
    topic: question.topic,
    difficulty: question.difficulty,
  };
}

function calculateAccuracy(correct, attempted) {
  return attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
}

function classifyPerformance(attempted, accuracy) {
  if (attempted < MIN_ATTEMPTS_FOR_CLASSIFICATION) {
    return "Not Enough Data";
  }

  if (accuracy < 50) {
    return "Needs Improvement";
  }

  if (accuracy < 80) {
    return "Developing";
  }

  return "Strong";
}

// Generate understandable, rule-based learning recommendations.
function createRecommendation(topicPerformance) {
  if (!topicPerformance.length) {
    return {
      topic: null,
      title: "Start your learning journey",
      activity: "Complete a quiz in any available topic.",
      reason: "Your performance history is not available yet.",
      priority: "Getting Started",
    };
  }

  const eligibleTopics = topicPerformance.filter(
    (topic) => topic.attempted >= MIN_ATTEMPTS_FOR_CLASSIFICATION
  );

  const weakTopics = eligibleTopics
    .filter((topic) => topic.status === "Needs Improvement")
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy || b.attempted - a.attempted
    );

  if (weakTopics.length) {
    const topic = weakTopics[0];

    return {
      topic: topic.topic,
      title: `Revise ${topic.topic}`,
      activity: `Review the fundamentals of ${topic.topic}, then practise an Easy-level quiz if available.`,
      reason: `Your accuracy in ${topic.topic} is ${topic.accuracy}% across ${topic.attempted} answered questions.`,
      priority: "High",
    };
  }

  const developingTopics = eligibleTopics
    .filter((topic) => topic.status === "Developing")
    .sort(
      (a, b) =>
        a.accuracy - b.accuracy || b.attempted - a.attempted
    );

  if (developingTopics.length) {
    const topic = developingTopics[0];

    return {
      topic: topic.topic,
      title: `Strengthen ${topic.topic}`,
      activity: `Review mistakes and practise another quiz in ${topic.topic}.`,
      reason: `Your accuracy is ${topic.accuracy}%. More practice may help you reach 80%.`,
      priority: "Medium",
    };
  }

  const unclassifiedTopics = topicPerformance
    .filter((topic) => topic.attempted < MIN_ATTEMPTS_FOR_CLASSIFICATION)
    .sort((a, b) => a.attempted - b.attempted);

  if (unclassifiedTopics.length) {
    const topic = unclassifiedTopics[0];

    return {
      topic: topic.topic,
      title: `Explore ${topic.topic}`,
      activity: `Answer more questions in ${topic.topic} to build a reliable performance record.`,
      reason: `Only ${topic.attempted} questions have been answered in this topic. At least ${MIN_ATTEMPTS_FOR_CLASSIFICATION} are needed for classification.`,
      priority: "Build Evidence",
    };
  }

  return {
    topic: null,
    title: "Challenge yourself",
    activity: "Try a Hard-level quiz in a topic you have mastered, if available.",
    reason: "Your eligible topics currently have at least 80% accuracy.",
    priority: "Advanced Practice",
  };
}

// Choose an unused question at the current adaptive difficulty.
// If no questions remain at that level, choose the closest available level.

async function chooseNextQuestion(attempt) {
  const answeredIds = attempt.answers.map((answer) =>
    answer.questionId.toString()
  );

  // Match topic names without case sensitivity.
  const topicRegex = new RegExp(
    `^${attempt.topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    "i"
  );

  // First prefer questions not used in previous attempts.
  const previousAttempts = await QuizAttempt.find({
    userId: attempt.userId,
    topic: { $regex: topicRegex },
    _id: { $ne: attempt._id },
  })
    .select("answers.questionId")
    .lean();

  const previouslyUsedIds = previousAttempts.flatMap((item) =>
    item.answers.map((answer) => answer.questionId.toString())
  );

  let questions = await Question.find({
    topic: { $regex: topicRegex },
    _id: { $nin: [...new Set([...answeredIds, ...previouslyUsedIds])] },
    difficulty: { $in: LEVELS },
  });

  // If all questions were previously attempted, reuse existing questions.
  if (questions.length === 0) {
    questions = await Question.find({
      topic: { $regex: topicRegex },
      _id: { $nin: answeredIds },
      difficulty: { $in: LEVELS },
    });
  }

  // If this attempt has exhausted its allowed questions, allow reuse.
  if (questions.length === 0) {
    questions = await Question.find({
      topic: { $regex: topicRegex },
    });
  }

  if (questions.length === 0) {
    console.error("No questions found for topic:", attempt.topic);
    return null;
  }

  // Prefer the current adaptive difficulty when available.
  const sameDifficulty = questions.filter(
    (question) => question.difficulty === attempt.currentDifficulty
  );

  const pool = sameDifficulty.length > 0 ? sameDifficulty : questions;

  return pool[Math.floor(Math.random() * pool.length)];
}


// --------------------------------------------------
// DASHBOARD STATISTICS
// GET /api/quizzes/stats
// --------------------------------------------------

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await QuizAttempt.aggregate([
      {
        $match: {
          userId,
          completed: true,
        },
      },
      {
        $group: {
          _id: null,
          quizzesCompleted: { $sum: 1 },
          questionsAttempted: { $sum: { $size: "$answers" } },
          correctAnswers: { $sum: "$score" },
        },
      },
    ]);

    const data = stats[0] || {
      quizzesCompleted: 0,
      questionsAttempted: 0,
      correctAnswers: 0,
    };

    const incorrectAnswers =
      data.questionsAttempted - data.correctAnswers;

    const accuracy = calculateAccuracy(
      data.correctAnswers,
      data.questionsAttempted
    );

    return res.status(200).json({
      success: true,
      stats: {
        quizzesCompleted: data.quizzesCompleted,
        questionsAttempted: data.questionsAttempted,
        correctAnswers: data.correctAnswers,
        incorrectAnswers,
        accuracy,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz statistics:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve quiz statistics.",
    });
  }
});

// --------------------------------------------------
// TOPIC-WISE PERFORMANCE AND PERSONALIZATION
// GET /api/quizzes/personalized
// --------------------------------------------------

router.get("/personalized", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Only completed attempts belonging to this student.
    const attempts = await QuizAttempt.find({
      userId,
      completed: true,
    })
      .select("topic answers score totalQuestions startedAt completedAt createdAt")
      .sort({ completedAt: -1 });

    const topicMap = new Map();

    for (const attempt of attempts) {
      if (!topicMap.has(attempt.topic)) {
        topicMap.set(attempt.topic, {
          topic: attempt.topic,
          attempted: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          quizzesCompleted: 0,
          latestCompletedAt: attempt.completedAt || null,
        });
      }

      const topicData = topicMap.get(attempt.topic);
      topicData.quizzesCompleted += 1;

      for (const answer of attempt.answers) {
        topicData.attempted += 1;

        if (answer.isCorrect) {
          topicData.correctAnswers += 1;
        } else {
          topicData.incorrectAnswers += 1;
        }
      }
    }

    // Include available topics even if the student has not tried them.
    const availableTopics = await Question.distinct("topic");

    for (const topic of availableTopics) {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          topic,
          attempted: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          quizzesCompleted: 0,
          latestCompletedAt: null,
        });
      }
    }

    const topicPerformance = Array.from(topicMap.values())
      .map((topic) => {
        const accuracy = calculateAccuracy(
          topic.correctAnswers,
          topic.attempted
        );

        return {
          ...topic,
          accuracy,
          status: classifyPerformance(topic.attempted, accuracy),
        };
      })
      .sort((a, b) => a.topic.localeCompare(b.topic));

    const totalAttempted = topicPerformance.reduce(
      (sum, topic) => sum + topic.attempted,
      0
    );

    const totalCorrect = topicPerformance.reduce(
      (sum, topic) => sum + topic.correctAnswers,
      0
    );

    const strongTopics = topicPerformance.filter(
      (topic) => topic.status === "Strong"
    );

    const weakTopics = topicPerformance.filter(
      (topic) => topic.status === "Needs Improvement"
    );

    const recommendation = createRecommendation(topicPerformance);
// Calculate consecutive study days from completed quiz attempts.
const studyDates = new Set(
  attempts
    .map((attempt) => attempt.completedAt || attempt.createdAt)
    .filter(Boolean)
    .map((date) =>
      new Date(date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      })
    )
);

const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Kolkata",
});

const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

const yesterday = yesterdayDate.toLocaleDateString("en-CA", {
  timeZone: "Asia/Kolkata",
});

let studyStreak = 0;
const currentDate = new Date();

if (studyDates.has(today) || studyDates.has(yesterday)) {
  if (!studyDates.has(today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateKey = currentDate.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    if (!studyDates.has(dateKey)) break;

    studyStreak += 1;
    currentDate.setDate(currentDate.getDate() - 1);
  }
}
    return res.status(200).json({
  success: true,
  studyStreak,
  overall: {
        questionsAttempted: totalAttempted,
        correctAnswers: totalCorrect,
        incorrectAnswers: totalAttempted - totalCorrect,
        accuracy: calculateAccuracy(totalCorrect, totalAttempted),
        quizzesCompleted: attempts.length,
      },
      topicPerformance,
      strongTopics,
      weakTopics,
      recommendation,
      classificationRules: {
        minimumAttempts: MIN_ATTEMPTS_FOR_CLASSIFICATION,
        needsImprovement: "Below 50%",
        developing: "50% to below 80%",
        strong: "80% or above",
      },
    });
  } catch (error) {
    console.error("Error fetching personalized learning data:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve personalized learning data.",
    });
  }
});

// --------------------------------------------------
// PREVIOUS QUIZ RESULTS
// GET /api/quizzes/history
// --------------------------------------------------

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.user.userId,
      completed: true,
    })
      .select("attemptId topic score totalQuestions answers startedAt completedAt createdAt")
      .sort({ completedAt: -1 })
      .limit(50)
      .lean();

    const history = attempts.map((attempt) => {
      const attempted = attempt.answers.length;

      return {
        attemptId: attempt.attemptId,
        topic: attempt.topic,
        score: attempt.score,
        totalQuestions: attempted,
        correctAnswers: attempt.score,
        incorrectAnswers: attempted - attempt.score,
        accuracy: calculateAccuracy(attempt.score, attempted),
        completedAt: attempt.completedAt,
      };
    });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching quiz history:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve quiz history.",
    });
  }
});

// --------------------------------------------------
// START QUIZ
// POST /api/quizzes/start
// --------------------------------------------------

router.post("/start", authMiddleware, async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      questionCount = 10,
      flow = "setup",
    } = req.body;

    if (typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid topic.",
      });
    }

    const startingDifficulty = difficulty || STARTING_DIFFICULTY;

    if (!LEVELS.includes(startingDifficulty)) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be Easy, Medium, or Hard.",
      });
    }

    const parsedQuestionCount = Number(questionCount);

    if (
      flow !== "explore" &&
      ![5, 10, 20].includes(parsedQuestionCount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Question count must be 5, 10, or 20.",
      });
    }

    const normalizeTopic = (value) =>
      value.toLowerCase().replace(/[^a-z0-9]/g, "");

    const requestedTopic = normalizeTopic(topic);
    const isJavaScriptTopic = [
      "javascript",
      "javascriptbasics",
      "js",
    ].includes(requestedTopic);

    const allQuestions = await Question.find({
      difficulty: { $in: LEVELS },
    });

    const matchingQuestions = allQuestions.filter((question) => {
      const storedTopic = normalizeTopic(question.topic);

      if (isJavaScriptTopic) {
        return [
          "javascript",
          "javascriptbasics",
          "js",
        ].includes(storedTopic);
      }

      return storedTopic === requestedTopic;
    });
console.log("Explore topic debug:", {
  requestedTopic: topic,
  matchingQuestions: matchingQuestions.length,
  matchedTopicNames: [
    ...new Set(matchingQuestions.map((q) => q.topic)),
  ],
});
    if (matchingQuestions.length === 0) {
      console.error("Explore topic lookup failed:", {
        requestedTopic: topic,
        availableTopics: [...new Set(allQuestions.map((q) => q.topic))],
      });

      return res.status(404).json({
        success: false,
        message: "No questions were found for this topic.",
      });
    }

    // Save the exact topic spelling used by the existing questions.
    const actualTopic = matchingQuestions[0].topic;

    const attempt = await QuizAttempt.create({
      userId: req.user.userId,
      attemptId: randomUUID(),
      topic: actualTopic,
      totalQuestions:
        flow === "explore"
          ? 10
          : Math.min(parsedQuestionCount, matchingQuestions.length),
      currentDifficulty: startingDifficulty,
      answers: [],
      score: 0,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      completed: false,
    });

    const currentDifficultyQuestions = matchingQuestions.filter(
      (question) => question.difficulty === startingDifficulty
    );

    const questionPool =
      currentDifficultyQuestions.length > 0
        ? currentDifficultyQuestions
        : matchingQuestions;

    const firstQuestion =
      questionPool[Math.floor(Math.random() * questionPool.length)];

    attempt.currentQuestionId = firstQuestion._id;
    await attempt.save();

    return res.status(201).json({
      success: true,
      message: "Quiz started successfully.",
      attemptId: attempt.attemptId,
      topic: attempt.topic,
      totalQuestions: attempt.totalQuestions,
      currentDifficulty: firstQuestion.difficulty,
      question: safeQuestion(firstQuestion),
    });
  } catch (error) {
    console.error("Error starting quiz:", error);

    return res.status(500).json({
      success: false,
      message: "Could not start the quiz.",
    });
  }
});



/* --------------------------------------------------
   PRACTICE NEXT LEVEL
   POST /api/quizzes/practice-next
-------------------------------------------------- */

router.post("/practice-next", authMiddleware, async (req, res) => {
  try {
    const {
      attemptId,
      questionCount = TOTAL_QUESTIONS,
      flow = "setup",
    } = req.body;

    if (typeof attemptId !== "string" || !attemptId.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid previous attemptId is required.",
      });
    }

    if (!["explore", "setup"].includes(flow)) {
      return res.status(400).json({
        success: false,
        message: "Invalid practice flow.",
      });
    }

    const parsedQuestionCount =
      flow === "explore" ? 10 : Number(questionCount);

    if (
      flow === "setup" &&
      ![5, 10, 20].includes(parsedQuestionCount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Question count must be 5, 10, or 20.",
      });
    }

    const previousAttempt = await QuizAttempt.findOne({
      attemptId: attemptId.trim(),
      userId: req.user.userId,
      completed: true,
    });

    if (!previousAttempt) {
      return res.status(404).json({
        success: false,
        message: "Completed previous quiz not found.",
      });
    }

    // Exclude questions already answered in any attempt for this topic.
    const previousAttempts = await QuizAttempt.find({
      userId: req.user.userId,
      topic: previousAttempt.topic,
    })
      .select("answers.questionId")
      .lean();

    const usedIds = [
      ...new Set(
        previousAttempts.flatMap((item) =>
          item.answers.map((answer) => answer.questionId.toString())
        )
      ),
    ];

    const availableCount = await Question.countDocuments({
      topic: previousAttempt.topic,
      _id: { $nin: usedIds },
      difficulty: { $in: LEVELS },
    });

    // Explore Topic must always have a full set of 10 unused questions.
    

   

    const totalQuestions =
      flow === "explore"
        ? 10
        : Math.min(parsedQuestionCount, availableCount);

    // Continue from the adaptive difficulty reached in the previous round.
    const attempt = await QuizAttempt.create({
      userId: req.user.userId,
      attemptId: randomUUID(),
      topic: previousAttempt.topic,
      totalQuestions,
      currentDifficulty: previousAttempt.currentDifficulty,
      answers: [],
      score: 0,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      completed: false,
    });

    const firstQuestion = await chooseNextQuestion(attempt);

    if (!firstQuestion) {
      await QuizAttempt.findByIdAndDelete(attempt._id);

      return res.status(400).json({
        success: false,
        message: "No unused questions are available for this topic.",
      });
    }

    attempt.currentQuestionId = firstQuestion._id;
    await attempt.save();

    return res.status(201).json({
      success: true,
      message: "Practice session started successfully.",
      attemptId: attempt.attemptId,
      topic: attempt.topic,
      totalQuestions: attempt.totalQuestions,
      currentDifficulty: attempt.currentDifficulty,
      question: safeQuestion(firstQuestion),
    });
  } catch (error) {
    console.error("Error starting next-level practice:", error);

    return res.status(500).json({
      success: false,
      message: "Could not start next-level practice.",
    });
  }
});

// --------------------------------------------------
// SUBMIT ANSWER
// POST /api/quizzes/answer
// --------------------------------------------------

router.post("/answer", authMiddleware, async (req, res) => {
  try {
    const { attemptId, questionId, selectedAnswer } = req.body;

    if (
      typeof attemptId !== "string" ||
      !attemptId.trim() ||
      typeof questionId !== "string" ||
      !mongoose.isValidObjectId(questionId) ||
      typeof selectedAnswer !== "string" ||
      !selectedAnswer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid attemptId, questionId, and selectedAnswer are required.",
      });
    }

    // The attempt must belong to the authenticated student.
    const attempt = await QuizAttempt.findOne({
      attemptId: attemptId.trim(),
      userId: req.user.userId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found.",
      });
    }

    if (attempt.completed) {
      return res.status(400).json({
        success: false,
        message: "This quiz has already been completed.",
      });
    }

    if (
      !attempt.currentQuestionId ||
      attempt.currentQuestionId.toString() !== questionId
    ) {
      return res.status(400).json({
        success: false,
        message: "This is not the current question for your quiz.",
      });
    }

    const question = await Question.findOne({
      _id: questionId,
      topic: attempt.topic,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (!question.options.includes(selectedAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid option.",
      });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    attempt.answers.push({
      questionId: question._id,
      selectedAnswer,
      isCorrect,
      difficulty: question.difficulty,
    });

    if (isCorrect) {
      attempt.score += 1;
      attempt.consecutiveCorrect += 1;
      attempt.consecutiveIncorrect = 0;
    } else {
      attempt.consecutiveIncorrect += 1;
      attempt.consecutiveCorrect = 0;
    }

    const previousDifficulty = attempt.currentDifficulty;

    if (attempt.consecutiveCorrect >= 2) {
  const index = LEVELS.indexOf(attempt.currentDifficulty);

  if (index < LEVELS.length - 1) {
    attempt.currentDifficulty = LEVELS[index + 1];
    attempt.consecutiveCorrect = 0;
  }
} else if (attempt.consecutiveIncorrect >= 2) {
  const index = LEVELS.indexOf(attempt.currentDifficulty);

  if (index > 0) {
    attempt.currentDifficulty = LEVELS[index - 1];
    attempt.consecutiveIncorrect = 0;
  }
}

    const difficultyChanged =
      previousDifficulty !== attempt.currentDifficulty;

    let nextQuestion = null;

    if (attempt.answers.length >= attempt.totalQuestions) {
      attempt.completed = true;
      attempt.completedAt = new Date();
      attempt.currentQuestionId = null;
    } else {
      nextQuestion = await chooseNextQuestion(attempt);

      if (nextQuestion) {
        attempt.currentQuestionId = nextQuestion._id;
      } else {
        attempt.totalQuestions = attempt.answers.length;
        attempt.completed = true;
        attempt.completedAt = new Date();
        attempt.currentQuestionId = null;
      }
    }

    
await attempt.save();

// Feedback for the answer that was just submitted
const answerFeedback = {
  questionId: question._id,
  selectedAnswer,
  correctAnswer: question.correctAnswer,
  isCorrect,
  explanation:
    question.explanation || "No explanation is available.",
};

if (!attempt.completed) {

      return res.status(200).json({
        success: true,
        
        answeredQuestions: attempt.answers.length,
        totalQuestions: attempt.totalQuestions,
        currentDifficulty: attempt.currentDifficulty,
        difficultyChanged,
        consecutiveCorrect: attempt.consecutiveCorrect,
        consecutiveIncorrect: attempt.consecutiveIncorrect,
        completed: false,
        feedback: answerFeedback,
        nextQuestion: nextQuestion ? safeQuestion(nextQuestion) : null,
      });
    }

    const questionIds = attempt.answers.map(
      (answer) => answer.questionId
    );

    const questions = await Question.find({
      _id: { $in: questionIds },
    });

    const questionMap = new Map(
      questions.map((item) => [item._id.toString(), item])
    );

    const answerReview = attempt.answers.map((answer, index) => {
      const reviewedQuestion = questionMap.get(
        answer.questionId.toString()
      );

      if (!reviewedQuestion) {
        return {
          questionNumber: index + 1,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          difficulty: answer.difficulty,
          questionText: "Question details are unavailable.",
          options: [],
          correctAnswer: "Unavailable",
          explanation: "No explanation is available.",
        };
      }

      return {
        questionNumber: index + 1,
        questionId: answer.questionId,
        questionText: reviewedQuestion.questionText,
        options: reviewedQuestion.options,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: reviewedQuestion.correctAnswer,
        isCorrect: answer.isCorrect,
        explanation: reviewedQuestion.explanation,
        difficulty: answer.difficulty,
      };
    });

    const totalAnswered = attempt.answers.length;
    const correctAnswers = attempt.score;
    const incorrectAnswers = totalAnswered - correctAnswers;
    const accuracy = calculateAccuracy(correctAnswers, totalAnswered);

    return res.status(200).json({
      success: true,
      answeredQuestions: totalAnswered,
      totalQuestions: totalAnswered,
      currentDifficulty: attempt.currentDifficulty,
      difficultyChanged,
      completed: true,
      feedback: answerFeedback,
      nextQuestion: null,
      
results: {
  score: correctAnswers,
  totalQuestions: totalAnswered,
  correctAnswers,
  incorrectAnswers,
  accuracy,
  answerReview,
  finalLevelReached: attempt.currentDifficulty === "Hard",
},

    });
  } catch (error) {
    console.error("Error submitting answer:", error);

    return res.status(500).json({
      success: false,
      message: "Could not submit the answer.",
    });
  }
});

module.exports = router;
