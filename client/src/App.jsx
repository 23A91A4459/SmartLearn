import { useEffect, useState, useCallback } from "react";
import "./App.css";
import Auth from "./Auth";
import ResetPassword from "./ResetPassword";
import LandingPage from "./LandingPage";
const API_URL = "http://localhost:5000";

const topicLogos = {
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "react.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  html5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  css3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mongodb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "javascript basics": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
"data structures": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/thealgorithms/thealgorithms-original.svg",
"mathematics": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
"aptitude": "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/brain.svg",
};

const EMPTY_STATS = {
  quizzesCompleted: 0,
  questionsAttempted: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  accuracy: 0,
};

function App() {
  const [authData, setAuthData] = useState(() => {
  const savedAuth = localStorage.getItem("smartlearnAuth");
  
  try {
    return savedAuth ? JSON.parse(savedAuth) : null;
  } catch {
    localStorage.removeItem("smartlearnAuth");
    return null;
  }
});
const [profileBio, setProfileBio] = useState("");
const [learningDifficulty, setLearningDifficulty] = useState(
  authData?.user?.learningPreferences?.difficulty || ""
);const [selectedTopics, setSelectedTopics] = useState([]);
const [profileSaving, setProfileSaving] = useState(false);
const [profileMessage, setProfileMessage] = useState("");
const [profileError, setProfileError] = useState("");
const [showDeleteAccount, setShowDeleteAccount] = useState(false);
const [deletePassword, setDeletePassword] = useState("");
const [deleteAccountError, setDeleteAccountError] = useState("");
const [deletingAccount, setDeletingAccount] = useState(false);
const fetchProfile = useCallback(async () => {
  if (!authData?.token) return;

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load your profile.");
    }

    const user = data.user;

    // Load the saved profile values into the form.
    setEditedName(user.name || "Student");
    setEditedEmail(user.email || "");
    setProfileBio(user.bio || "");
    setLearningDifficulty(
  authData?.user?.learningPreferences?.difficulty || ""
);
    setSelectedTopics(user.learningPreferences?.topics || []);

    // Keep the latest user information in app state and local storage.
    setAuthData((previous) => {
      if (!previous) return previous;

      const updated = {
        ...previous,
        user: {
          ...(previous.user || {}),
          ...user,
        },
      };

      localStorage.setItem("smartlearnAuth", JSON.stringify(updated));
      return updated;
    });
  } catch (err) {
    setProfileError(err.message || "Unable to load your profile.");
  }
}, [authData?.token]);

// Load the saved profile from the backend.
useEffect(() => {
  if (authData?.token) {
    fetchProfile();
  }
}, [authData?.token, fetchProfile]);

const saveProfile = async () => {
  setProfileSaving(true);
  setProfileMessage("");
  setProfileError("");

  const trimmedName = editedName.trim();
  const trimmedEmail = editedEmail.trim();
  const trimmedBio = profileBio.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    setProfileError("Name must be between 2 and 80 characters.");
    setProfileSaving(false);
    return;
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    setProfileError("Please enter a valid email address.");
    setProfileSaving(false);
    return;
  }

  if (trimmedBio.length > 250) {
    setProfileError("Bio cannot exceed 250 characters.");
    setProfileSaving(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      
body: JSON.stringify({
  topic,
  difficulty: quizSettings.difficulty || "Easy",
  questionCount: Number(quizSettings.questionCount) || 10,
}),

    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to save your profile.");
    }

    const user = data.user || {};

    const updatedAuth = {
      ...authData,
      ...user,
      user: {
        ...(authData.user || {}),
        ...user,
        name: user.name || trimmedName,
        email: user.email || trimmedEmail,
      },
    };

    localStorage.setItem("smartlearnAuth", JSON.stringify(updatedAuth));
    setAuthData(updatedAuth);
    setEditedName(user.name || trimmedName);
    setEditedEmail(user.email || trimmedEmail);
    setProfileMessage("Profile and learning preferences saved successfully!");
    setEditingPersonalInfo(false);
setEditingPreferences(false);
setEditingEmail(false);
  } catch (err) {
    setProfileError(err.message || "Unable to save your profile.");
  } finally {
    setProfileSaving(false);
  }
};

const deleteAccount = async () => {
  if (!deletePassword || deletingAccount) {
    setDeleteAccountError("Please enter your current password.");
    return;
  }

  setDeletingAccount(true);
  setDeleteAccountError("");

  try {
    const response = await fetch(`${API_URL}/api/auth/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({ password: deletePassword }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to delete your account.");
    }

    localStorage.removeItem("smartlearnAuth");
    setAuthData(null);
    setShowDeleteAccount(false);
    setDeletePassword("");
    window.history.replaceState({}, "", "/");
    setCurrentPath("/");
    setScreen("dashboard");
  } catch (error) {
    setDeleteAccountError(
      error.message || "Unable to delete your account. Please try again."
    );
  } finally {
    setDeletingAccount(false);
  }
};

const saveEmail = async () => {
  const previousEmail =
    authData?.user?.email || authData?.email || "";

  const newEmail = editedEmail.trim();

  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    setProfileError("Please enter a valid email address.");
    return;
  }

  setProfileSaving(true);
  setProfileMessage("");
  setProfileError("");

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        name: authData?.user?.name || authData?.name || editedName,
        email: newEmail,
        bio: profileBio,
        learningPreferences: {
          difficulty: learningDifficulty,
          topics: selectedTopics,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to save email.");
    }

    const user = data.user || {};
    const updatedAuth = {
      ...authData,
      user: {
        ...(authData.user || {}),
        ...user,
        email: user.email || newEmail,
      },
    };

    localStorage.setItem("smartlearnAuth", JSON.stringify(updatedAuth));
    setAuthData(updatedAuth);
    setEditedEmail(user.email || newEmail);
    setEditingEmail(false);
    setProfileMessage("Email saved successfully!");
  } catch (err) {
    setEditedEmail(newEmail);
    setProfileError(err.message || "Unable to save email.");
  } finally {
    setProfileSaving(false);
  }
};

const savePersonalInfo = async () => {
  const newName = editedName.trim();
  const newBio = profileBio.trim();

  if (newName.length < 2 || newName.length > 80) {
    setProfileError("Name must be between 2 and 80 characters.");
    return;
  }

  if (newBio.length > 250) {
    setProfileError("Bio cannot exceed 250 characters.");
    return;
  }

  setProfileSaving(true);
  setProfileMessage("");
  setProfileError("");

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        name: newName,
        email: authData?.user?.email || authData?.email || editedEmail,
        bio: newBio,
        learningPreferences: {
          difficulty: learningDifficulty,
          topics: selectedTopics,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to save personal information.");
    }

    const user = data.user || {};
    const updatedAuth = {
      ...authData,
      user: {
        ...(authData.user || {}),
        ...user,
        name: user.name || newName,
      },
    };

    localStorage.setItem("smartlearnAuth", JSON.stringify(updatedAuth));
    setAuthData(updatedAuth);
    setEditedName(user.name || newName);
    setProfileBio(user.bio ?? newBio);
    setEditingPersonalInfo(false);
    setProfileMessage("Personal information saved successfully!");
  } catch (err) {
    setProfileError(err.message || "Unable to save personal information.");
  } finally {
    setProfileSaving(false);
  }
};

const savePreferences = async () => {
  setProfileSaving(true);
  setProfileMessage("");
  setProfileError("");

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        name: authData?.user?.name || authData?.name || editedName,
        email: authData?.user?.email || authData?.email || editedEmail,
        bio: profileBio,
        learningPreferences: {
          difficulty: learningDifficulty,
          topics: selectedTopics,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to save learning preferences.");
    }

    const user = data.user || {};
    const updatedAuth = {
      ...authData,
      user: {
        ...(authData.user || {}),
        ...user,
      },
    };

    localStorage.setItem("smartlearnAuth", JSON.stringify(updatedAuth));
    setAuthData(updatedAuth);
    setLearningDifficulty(
      user.learningPreferences?.difficulty || learningDifficulty
    );
    setSelectedTopics(
      user.learningPreferences?.topics || selectedTopics
    );
    setEditingPreferences(false);
    setProfileMessage("Learning preferences saved successfully!");
  } catch (err) {
    setProfileError(err.message || "Unable to save learning preferences.");
  } finally {
    setProfileSaving(false);
  }
};

const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
const [editingPreferences, setEditingPreferences] = useState(false);

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(EMPTY_STATS);
  const [personalizedData, setPersonalizedData] = useState(null);
const [personalizedLoading, setPersonalizedLoading] = useState(false);
const [personalizedError, setPersonalizedError] = useState("");
const [quizHistory, setQuizHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(false);
const [historyError, setHistoryError] = useState("");
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [screen, setScreen] = useState("dashboard");
  const [isExploreTopic, setIsExploreTopic] = useState(false);
  const [progressRange, setProgressRange] = useState("7days");
  
const progressAttempts = [...(quizHistory || [])]
  .filter((quiz) => quiz.completedAt)
  .sort(
    (a, b) =>
      new Date(a.completedAt).getTime() -
      new Date(b.completedAt).getTime()
  );

const progressCutoff = new Date();

if (progressRange === "7days") {
  progressCutoff.setDate(progressCutoff.getDate() - 6);
} else if (progressRange === "30days") {
  progressCutoff.setDate(progressCutoff.getDate() - 29);
} else {
  progressCutoff.setTime(0);
}

const filteredProgressAttempts = progressAttempts.filter(
  (quiz) => new Date(quiz.completedAt) >= progressCutoff
);

const strongAreas = personalizedData?.strongTopics || [];
const weakAreas = personalizedData?.weakTopics || [];

const [quizSettings, setQuizSettings] = useState({
  topic: "",
  difficulty: "",
  questionCount: "",
  questionType: "",
});
const [theme, setTheme] = useState(
  () => localStorage.getItem("smartlearnTheme") || "dark"
);

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("smartlearnTheme", theme);
}, [theme]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);

const [editedName, setEditedName] = useState(
  authData?.user?.name ||
    authData?.name ||
    authData?.user?.username ||
    "Student"
);
const [editedEmail, setEditedEmail] = useState("");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

const navigateTo = (path) => {
  window.history.pushState({}, "", path);
  setCurrentPath(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
useEffect(() => {
  const handlePopState = () => {
    setCurrentPath(window.location.pathname);
  };

  window.addEventListener("popstate", handlePopState);
  
  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);
  const [attemptId, setAttemptId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  // Load topics from the backend.
  const fetchTopics = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/topics`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load topics.");
      }

      setTopics(data.topics || []);
      setError("");
    } catch (err) {
      setError(
        err.message ||
          "Could not load topics. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load real statistics from MongoDB through the backend.
const fetchStats = useCallback(async () => {
  setStatsLoading(true);
  setStatsError("");

  try {
    const response = await fetch(`${API_URL}/api/quizzes/stats`, {
      headers: {
        Authorization: `Bearer ${authData?.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load learning statistics."
      );
    }

    setStats({
      ...EMPTY_STATS,
      ...data.stats,
    });
  } catch (err) {
    setStatsError(
      err.message || "Could not load your learning statistics."
    );
  } finally {
    setStatsLoading(false);
  }
}, [authData?.token]);
const fetchPersonalizedData = useCallback(async () => {
  if (!authData?.token) return;

  setPersonalizedLoading(true);
  setPersonalizedError("");

  try {
    const response = await fetch(`${API_URL}/api/quizzes/personalized`, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load personalized learning data.");
    }

    setPersonalizedData(data);
  } catch (error) {
    setPersonalizedError(error.message);
  } finally {
    setPersonalizedLoading(false);
  }
}, [authData?.token]);

const fetchQuizHistory = useCallback(async () => {
  if (!authData?.token) return;

  setHistoryLoading(true);
  setHistoryError("");

  try {
    const response = await fetch(`${API_URL}/api/quizzes/history`, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load quiz history.");
    }

    setQuizHistory(data.history || []);
  } catch (error) {
    setHistoryError(error.message || "Could not load quiz history.");
  } finally {
    setHistoryLoading(false);
  }
}, [authData?.token]);

  // Load topics and statistics when the application opens.
 // Load topics when the app opens.
useEffect(() => {
  fetchTopics();
}, [fetchTopics]);

// Load statistics only after the user has logged in.
useEffect(() => {
  if (authData?.token) {
    fetchStats();
    fetchPersonalizedData();
    fetchQuizHistory();
  }
}, [
  authData?.token,
  fetchStats,
  fetchPersonalizedData,
  fetchQuizHistory,
]);
  // Start a new quiz.
  async function startQuiz(topic) {
  setIsExploreTopic(false);
  setQuizError("");
  setSelectedAnswer("");
  setQuizResults(null);
  setShowAnswerReview(false);
  setSubmitting(false);
  setCurrentQuestion(null);

  try {
    const response = await fetch(`${API_URL}/api/quizzes/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.token}`,
      },
     body: JSON.stringify({
  topic,
  difficulty: quizSettings.difficulty,
  questionCount: Number(quizSettings.questionCount) || 10,
}),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not start the quiz.");
    }

    setAttemptId(data.attemptId);
    setTopicName(data.topic);
    setTotalQuestions(data.totalQuestions);
    setAnsweredQuestions(0);
    setCurrentQuestion(data.question);
    setScreen("quiz");
  } catch (err) {
    setQuizError(err.message || "Could not start the quiz.");
  }
}

async function startExploreTopic(topic) {
  setIsExploreTopic(true);
  setQuizError("");
  setSelectedAnswer("");
  setQuizResults(null);
  setShowAnswerReview(false);
  setSubmitting(false);
  setCurrentQuestion(null);
  setAnswerFeedback(null);

  try {
    const response = await fetch(`${API_URL}/api/quizzes/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.token}`,
      },
      body: JSON.stringify({
  topic,
  difficulty: "Easy",
  questionCount: 10,
  flow: "explore",
}),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not start topic practice.");
    }

    setAttemptId(data.attemptId);
    setTopicName(data.topic);
    setTotalQuestions(data.totalQuestions);
    setAnsweredQuestions(0);
    setCurrentQuestion(data.question);
    setScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    setQuizError(err.message || "Could not start topic practice.");
  }
}

  // Start the next-level practice quiz without repeating used questions.
  async function startPracticeNextLevel() {
    setQuizError("");
    setSelectedAnswer("");
    setQuizResults(null);
    setShowAnswerReview(false);
    setSubmitting(false);
    setCurrentQuestion(null);
    setAnswerFeedback(null);

    try {
      const response = await fetch(
        `${API_URL}/api/quizzes/practice-next`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
          body: JSON.stringify({
  attemptId,
  flow: isExploreTopic ? "explore" : "setup",
  questionCount: isExploreTopic
    ? 10
    : Number(quizSettings.questionCount) || 10,
}),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not start next-level practice."
        );
      }

      setAttemptId(data.attemptId);
      setTopicName(data.topic);
      setTotalQuestions(data.totalQuestions);
      setAnsweredQuestions(0);
      setCurrentQuestion(data.question);
      setScreen("quiz");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setQuizError(
        err.message || "Could not start next-level practice."
      );
    }
  }

  // Submit an answer without revealing the correct answer.
 
async function submitAnswer() {
  if (
    !selectedAnswer ||
    submitting ||
    !currentQuestion ||
    answerFeedback
  ) {
    return;
  }

  setSubmitting(true);
  setQuizError("");

  try {
    const response = await fetch(`${API_URL}/api/quizzes/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.token}`,
      },
      body: JSON.stringify({
        attemptId,
        questionId: currentQuestion._id,
        selectedAnswer,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not submit your answer.");
    }

    setAnsweredQuestions(data.answeredQuestions);

    if (!data.feedback) {
      throw new Error("Answer feedback was not returned by the server.");
    }

    // Show feedback and wait for the student to continue.
    setAnswerFeedback({
      ...data.feedback,
      nextQuestion: data.nextQuestion,
      completed: data.completed,
      results: data.results,
    });
  } catch (err) {
    setQuizError(err.message || "Could not submit your answer.");
  } finally {
    setSubmitting(false);
  }
}

async function goToNextQuestion() {
  if (!answerFeedback) return;

  if (answerFeedback.completed) {
    setQuizResults(answerFeedback.results);
    setShowAnswerReview(false);
    setCurrentQuestion(null);
    setSelectedAnswer("");
    setAnswerFeedback(null);
    setScreen("results");

await fetchStats();
await fetchPersonalizedData();
return;
  }

  if (!answerFeedback.nextQuestion) {
    setQuizError("The next question could not be loaded.");
    return;
  }

  setCurrentQuestion(answerFeedback.nextQuestion);
  setSelectedAnswer("");
  setAnswerFeedback(null);
}


  // Return to the dashboard and refresh real statistics.
  async function returnToDashboard() {
    setScreen("dashboard");
    setCurrentQuestion(null);
    setSelectedAnswer("");
    setQuizResults(null);
    setShowAnswerReview(false);
    setQuizError("");
    setAnswerFeedback(null);
    await Promise.all([fetchTopics(), fetchStats()]);
  }

  // Navigate to the topics section.
  // Navigate to the My Topics screen.
function goToTopics() {
  setScreen("topics");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  // Navigate to the progress section.
  function goToProgress() {
  setScreen("progress");
  fetchPersonalizedData();
  fetchQuizHistory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
  // Choose a recommended topic for the dashboard.
  const recommendedTopicName =
    personalizedData?.recommendation?.topic ||
    topics.find((topic) => topic.available)?.topic ||
    "";

  const recommendedTopicDetails = topics.find(
    (topic) => topic.topic === recommendedTopicName
  );

  const recommendedTopicPerformance =
    personalizedData?.topicPerformance?.find(
      (topic) => topic.topic === recommendedTopicName
    );

  const recommendedTopicProgress = Math.min(
    100,
    Math.max(
      0,
      Number(recommendedTopicPerformance?.accuracy) || 0
    )
  );      
// Show the password-reset page when the email link is opened.
  const isResetPasswordPage =
    window.location.pathname === "/reset-password";

  if (isResetPasswordPage) {
    return (
      <ResetPassword
        onBackToLogin={() => {
          window.history.replaceState({}, "", "/");
          window.location.reload();
        }}
      />
    );
  }

  // Show the landing page, login, or signup to logged-out visitors.
if (!authData?.token) {
  if (currentPath === "/login" || currentPath === "/signup") {
    return (
      <Auth
        onLogin={(data) => {
          localStorage.setItem("smartlearnAuth", JSON.stringify(data));
          setAuthData(data);
          navigateTo("/");
        }}
      />
    );
  }

  return (
    <LandingPage
      onLogin={() => navigateTo("/login")}
      onSignup={() => navigateTo("/signup")}
    />
  );
}

  
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">
          SmartLearn<span>.</span>
        </h2>

        
<nav className="sidebar-nav">
  <a
    className={`nav-item ${screen === "dashboard" ? "active" : ""}`}
    href="#dashboard"
    onClick={(event) => {
      event.preventDefault();
      setScreen("dashboard");
      fetchTopics();
      fetchStats();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
    <span>Dashboard</span>
    <span className="nav-arrow">›</span>
  </a>

  <a
  className={`nav-item ${
    screen === "topics" ||
    (screen === "quiz" && isExploreTopic)
      ? "active"
      : ""
  }`}
  href="#topics"
    onClick={(event) => {
      event.preventDefault();
      goToTopics();
    }}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
      <path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20" />
      <path d="M8 7h8M8 10h6" />
    </svg>
    <span>Topics</span>
    <span className="nav-arrow">›</span>
  </a>

  <a
    className={`nav-item ${
  (screen === "quiz" && !isExploreTopic) ||
  screen === "quizSetup" ||
  (screen === "results" && !isExploreTopic)
    ? "active"
    : ""
}`}
    href="#quiz"
    onClick={(event) => {
  event.preventDefault();

  if (screen === "results") {
    setScreen("results");
  } else if (currentQuestion) {
    setScreen("quiz");
  } else {
    const preferences =
      authData?.user?.learningPreferences;

    const savedTopics = preferences?.topics || [];

    setQuizSettings((previous) => ({
      ...previous,
      topic: savedTopics.includes(previous.topic)
        ? previous.topic
        : savedTopics[0] || previous.topic,
      difficulty: "",
    }));

    setScreen("quizSetup");
  }
}}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h3M8 16h5" />
      <path d="m14 15 1.5 1.5L19 13" />
    </svg>
    <span>Take a Quiz</span>
    <span className="nav-arrow">›</span>
  </a>

  <a
    className={`nav-item ${screen === "progress" ? "active" : ""}`}
    href="#progress"
    onClick={(event) => {
      event.preventDefault();
      goToProgress();
    }}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 6-7" />
    </svg>
    <span>My Progress</span>
    <span className="nav-arrow">›</span>
  </a>
</nav>

        <div className="sidebar-bottom">
  <div className="avatar">
    {(authData?.user?.name ||
      authData?.name ||
      authData?.user?.username ||
      "Student")
      .charAt(0)
      .toUpperCase()}
  </div>
  <div>
    <strong>
      {authData?.user?.name ||
        authData?.name ||
        authData?.user?.username ||
        "Student"}
    </strong>
    <p>Learning account</p>
  </div>
</div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
  <div className="topbar-left">
    <span className="topbar-brand">
      <img
  src="/smartlearn-logo.svg"
  alt="SmartLearn logo"
  className="brand-logo"
/>
      SmartLearn
    </span>

    
  </div>

  <div className="topbar-right">
    <span className="status">
      <i /> Learning space
    </span>

    <div className="profile-menu-container">
  <button
    type="button"
    className="topbar-student profile-trigger"
    aria-expanded={profileOpen}
    aria-haspopup="true"
    onClick={() => setProfileOpen((previous) => !previous)}
  >
    <div className="topbar-avatar">
  {(authData?.user?.name ||
    authData?.name ||
    authData?.user?.username ||
    "Student")
    .charAt(0)
    .toUpperCase()}
</div>

    <div className="topbar-student-info">
  <strong>
    {authData?.user?.name ||
      authData?.name ||
      authData?.user?.username ||
      "Student"}
  </strong>
  <span>Learning account</span>
</div>

    <span className="profile-chevron">
      {profileOpen ? "▲" : "▼"}
    </span>
  </button>

  
{profileOpen && (
  <div className="profile-dropdown">
    <div className="profile-dropdown-heading">
      <div className="dropdown-avatar">
        {(authData?.user?.name ||
          authData?.name ||
          authData?.user?.username ||
          "Student")
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="dropdown-user-info">
        <strong>
          {authData?.user?.name ||
            authData?.name ||
            authData?.user?.username ||
            "Student"}
        </strong>
        <span>Student account</span>
      </div>
    </div>

    <div className="profile-dropdown-divider" />

    <button
      type="button"
      onClick={() => {
        setProfileOpen(false);
        setScreen("profile");
      }}
    >
      <span className="dropdown-icon">♙</span>
      <span>My Profile</span>
    </button>

    <button
      type="button"
      onClick={() => {
        setProfileOpen(false);
        setScreen("settings");
      }}
    >
      <span className="dropdown-icon">⚙</span>
      <span>Settings</span>
    </button>

    <div className="profile-dropdown-divider" />

    <button
      type="button"
      className="profile-logout"
      onClick={() => {
        localStorage.removeItem("smartlearnAuth");
        setAuthData(null);
        setProfileOpen(false);
        window.history.replaceState({}, "", "/");
        setCurrentPath("/");
        setScreen("dashboard");
      }}
    >
      <span className="dropdown-icon">↪</span>
      <span>Logout</span>
    </button>
  </div>
)}

</div>
  </div>
</header>


{/* PROFILE SCREEN */}
{screen === "profile" && (
  <section className="profile-page">
    <button
      type="button"
      className="text-button"
      onClick={() => {
        setScreen("dashboard");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      ← Back to Dashboard
    </button>

    <section className="profile-page-heading">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1>My Profile</h1>
      <p>Manage your personal details and learning preferences.</p>
    </section>

    <div className="profile-layout">
      {/* LEFT COLUMN */}
      <div className="profile-left-column">
        <section className="profile-details-card">
          <div className="profile-cover" />

          <div className="profile-details-content">
            <div className="profile-large-avatar">
              {(authData?.user?.name ||
                authData?.name ||
                authData?.user?.username ||
                "Student")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-identity">
              <div className="profile-name-row">
                {editingName ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(event) =>
                      setEditedName(event.target.value)
                    }
                    placeholder="Enter your name"
                    maxLength={80}
                  />
                ) : (
                  <h2>
                    {authData?.user?.name ||
                      authData?.name ||
                      authData?.user?.username ||
                      "Student"}
                  </h2>
                )}

                
              </div>

              <p>SmartLearn Student</p>

              <span className="profile-account-badge">
                ✓ Active Account
              </span>
            </div>
          </div>

          <div className="profile-information">
            
<div className="profile-info-item">
  <div className="profile-email-heading">
  <label htmlFor="profileEmail">EMAIL ADDRESS</label>

  {editingEmail ? (
    <>
      <button
        type="button"
        className="profile-section-edit"
        onClick={saveEmail}
        disabled={profileSaving}
      >
        {profileSaving ? "Saving..." : "Save"}
      </button>

      <button
        type="button"
        className="profile-section-edit"
        onClick={() => {
          setEditedEmail(authData?.user?.email || authData?.email || "");
          setEditingEmail(false);
          setProfileMessage("");
          setProfileError("");
        }}
      >
        Cancel
      </button>
    </>
  ) : (
    <button
      type="button"
      className="profile-section-edit"
      onClick={() => {
        setEditedEmail(authData?.user?.email || authData?.email || "");
        setProfileMessage("");
        setProfileError("");
        setEditingEmail(true);
      }}
    >
      Edit ✎
    </button>
  )}
</div>

  <input
    id="profileEmail"
    type="email"
    value={editedEmail}
    onChange={(event) => setEditedEmail(event.target.value)}
    placeholder="Enter your email address"
    disabled={!editingEmail}
    className={`profile-email-input ${editingEmail ? "is-editing" : ""}`}
  />
</div>


            <div className="profile-info-item">
              <span>ACCOUNT TYPE</span>
              <strong>Student</strong>
            </div>
          </div>
        </section>

        <section className="profile-stats-card">
          <div className="profile-section-heading">
            <div>
              <h2>Learning Overview</h2>
              <p>Your activity on SmartLearn</p>
            </div>
          </div>

          <div className="profile-stat-row">
            <span className="profile-stat-icon">✓</span>
            <div>
              <span className="profile-stat-label">
                Quizzes completed
              </span>
              <strong className="profile-stat-value">
                {statsLoading ? "Loading..." : stats.quizzesCompleted}
              </strong>
            </div>
          </div>

          <div className="profile-stat-row">
            <span className="profile-stat-icon">◎</span>
            <div>
              <span className="profile-stat-label">
                Questions attempted
              </span>
              <strong className="profile-stat-value">
                {statsLoading ? "Loading..." : stats.questionsAttempted}
              </strong>
            </div>
          </div>

          <div className="profile-stat-row">
            <span className="profile-stat-icon">✦</span>
            <div>
              <span className="profile-stat-label">
                Overall accuracy
              </span>
              <strong className="profile-stat-value">
                {statsLoading ? "Loading..." : `${stats.accuracy}%`}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="profile-right-column">
        <section className="profile-section-card">
          

<div className="profile-section-heading">
  <div>
    <h2>Personal Information</h2>
    <p>Update your name and profile description.</p>
  </div>

  <div className="profile-section-actions">
    {editingPersonalInfo ? (
      <>
        <button
          type="button"
          className="profile-section-edit"
          onClick={savePersonalInfo}
          disabled={profileSaving}
        >
          {profileSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="profile-section-edit"
          onClick={() => {
            setEditedName(
              authData?.user?.name ||
                authData?.name ||
                authData?.user?.username ||
                "Student"
            );
            setProfileBio(authData?.user?.bio || "");
            setEditingPersonalInfo(false);
            setProfileMessage("");
            setProfileError("");
          }}
          disabled={profileSaving}
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        type="button"
        className="profile-section-edit"
        onClick={() => {
          setEditedName(
            authData?.user?.name ||
              authData?.name ||
              authData?.user?.username ||
              "Student"
          );
          setProfileBio(authData?.user?.bio || "");
          setProfileMessage("");
          setProfileError("");
          setEditingPersonalInfo(true);
        }}
      >
        Edit ✎
      </button>
    )}
  </div>
</div>



          <div className="profile-form-field">
            <label htmlFor="profileName">Full name</label>
            <input
  id="profileName"
  type="text"
  value={editedName}
  onChange={(event) => setEditedName(event.target.value)}
  placeholder="Enter your full name"
  maxLength={80}
  disabled={!editingPersonalInfo}
/>
          </div>

          <div className="profile-bio-field">
            <label htmlFor="profileBio">About Me</label>
            <textarea
  id="profileBio"
  value={profileBio}
  onChange={(event) => setProfileBio(event.target.value)}
  placeholder="Tell us a little about yourself..."
  maxLength={250}
  rows={3}
  disabled={!editingPersonalInfo}
/>
            <small>{profileBio.length}/250 characters</small>
          </div>
        </section>

        <section className="profile-section-card">
         

<div className="profile-section-heading">
  <div>
    <h2>Learning Preferences</h2>
    <p>Personalize your learning experience.</p>
  </div>

  <div className="profile-section-actions">
    {editingPreferences ? (
      <>
        <button
          type="button"
          className="profile-section-edit"
          onClick={savePreferences}
          disabled={profileSaving}
        >
          {profileSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="profile-section-edit"
          onClick={() => {
            setLearningDifficulty(
              authData?.user?.learningPreferences?.difficulty || "Medium"
            );
            setSelectedTopics(
              authData?.user?.learningPreferences?.topics || []
            );
            setEditingPreferences(false);
            setProfileMessage("");
            setProfileError("");
          }}
          disabled={profileSaving}
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        type="button"
        className="profile-section-edit"
        onClick={() => {
          setLearningDifficulty(
            authData?.user?.learningPreferences?.difficulty || "Medium"
          );
          setSelectedTopics(
            authData?.user?.learningPreferences?.topics || []
          );
          setProfileMessage("");
          setProfileError("");
          setEditingPreferences(true);
        }}
      >
        Edit ✎
      </button>
    )}
  </div>
</div>



          <div className="profile-form-field">
            <label>Preferred difficulty</label>
            <div className="profile-difficulty-options">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`profile-difficulty-option ${
                    learningDifficulty === level ? "selected" : ""
                  }`}
                  aria-pressed={learningDifficulty === level}
                  disabled={!editingPreferences}
                  onClick={() => setLearningDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-form-field">
            <label>Topics of interest</label>
            <div className="profile-topic-chips">
              {topics.map((topicItem) => {
  const topic =
    typeof topicItem === "string"
      ? topicItem
      : topicItem.name || topicItem.topic || topicItem.title;

  if (typeof topic !== "string") return null;
                const isSelected = selectedTopics.some(
                  (selectedTopic) =>
                    selectedTopic.toLowerCase() === topic.toLowerCase()
                );

                return (
                  <button
                    key={topic}
                    type="button"
                    className={`profile-topic-chip ${
                      isSelected ? "selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    disabled={!editingPreferences}
                    onClick={() => {
                      setSelectedTopics((previous) =>
                        isSelected
                          ? previous.filter(
                              (item) =>
                                item.toLowerCase() !== topic.toLowerCase()
                            )
                          : [...previous, topic]
                      );
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="profile-section-card account-settings-link-card">
  <div className="profile-section-heading">
    <div>
      <h2>Account Settings</h2>
      <p>Manage your account, security, and appearance.</p>
    </div>
  </div>

  <button
    type="button"
    className="settings-action-button"
    onClick={() => {
      setScreen("settings");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  >
    ⚙️ Open Account Settings →
  </button>
</section>

        <div className="profile-save-area">
  {profileMessage && (
    <p className="success-message" role="status">
      {profileMessage}
    </p>
  )}

  {profileError && (
    <p className="error-message" role="alert">
      {profileError}
    </p>
  )}
</div>
      </div>
    </div>
  </section>
)}


{/* ACCOUNT SETTINGS SCREEN */}
{screen === "settings" && (
  <section className="profile-page settings-page">
    <button
      type="button"
      className="text-button"
      onClick={() => {
        setScreen("profile");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      ← Back to Profile
    </button>

    <section className="profile-page-heading">
      <p className="eyebrow">PREFERENCES & SECURITY</p>
      <h1>Account Settings</h1>
      <p>Manage your SmartLearn experience and preferences.</p>
    </section>

    <div className="settings-list">
      

      <article className="settings-card">
        <div className="settings-card-icon">🔒</div>
        <div className="settings-card-content">
          <h2>Security & Password</h2>
          <p>Keep your SmartLearn account secure.</p>
          <button
            type="button"
            className="settings-action-button"
            onClick={() => navigateTo("/reset-password")}
          >
            Open password reset →
          </button>
          <p className="settings-note">
  Reset your password securely to keep your SmartLearn account protected.
</p>
        </div>
      </article>

      
<article className="settings-card">
  <div className="settings-card-icon">🎨</div>

  <div className="settings-card-content">
    <h2>Appearance</h2>
    <p>Customize how SmartLearn looks on your device.</p>

    <div className="theme-switch-row">
      <div>
        <strong>
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </strong>
        <span>
          {theme === "dark"
            ? "Easy on the eyes"
            : "Bright and clean"}
        </span>
      </div>

      <button
        type="button"
        className={`theme-switch ${theme === "light" ? "is-light" : ""}`}
        role="switch"
        aria-checked={theme === "light"}
        aria-label="Toggle light and dark mode"
        onClick={() =>
          setTheme((previous) =>
            previous === "dark" ? "light" : "dark"
          )
        }
      >
        <span className="theme-switch-knob">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>
    </div>
  </div>
</article>


<article className="settings-card delete-account-card">
  <div className="settings-card-icon">⚠️</div>

  <div className="settings-card-content">
    <h2>Delete Account</h2>
    <p>
      Permanently delete your SmartLearn account and associated quiz history.
      This action cannot be undone.
    </p>

    <button
      type="button"
      className="delete-account-button"
      onClick={() => {
        setDeletePassword("");
        setDeleteAccountError("");
        setShowDeleteAccount(true);
      }}
    >
      Delete My Account
    </button>
  </div>
</article>

     
    </div>

    <button
      type="button"
      className="text-button settings-back-button"
      onClick={() => {
        setScreen("dashboard");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      ← Back to Dashboard
    </button>
    
{showDeleteAccount && (
  <div className="delete-account-overlay">
    <section
      className="delete-account-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <h2 id="delete-account-title">Delete your account?</h2>

      <p>
        This permanently deletes your account and quiz history.
        You cannot undo this action.
      </p>

      <label htmlFor="deleteAccountPassword">
        Enter your current password
      </label>

      <input
        id="deleteAccountPassword"
        type="password"
        autoComplete="current-password"
        value={deletePassword}
        onChange={(event) => setDeletePassword(event.target.value)}
        placeholder="Current password"
        disabled={deletingAccount}
      />

      {deleteAccountError && (
        <p className="error-message" role="alert">
          {deleteAccountError}
        </p>
      )}

      <div className="delete-account-actions">
        <button
          type="button"
          className="text-button"
          disabled={deletingAccount}
          onClick={() => {
            setShowDeleteAccount(false);
            setDeletePassword("");
            setDeleteAccountError("");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-account-button"
          disabled={deletingAccount || !deletePassword}
          onClick={deleteAccount}
        >
          {deletingAccount ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    </section>
  </div>
)}

  </section>
  
)}



        {/* DASHBOARD */}
        {screen === "dashboard" && (
          
          <>
            <section className="welcome">
              <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
              <h1>
  Welcome,{" "}
  {authData?.user?.name ||
    authData?.name ||
    authData?.user?.username ||
    "Student"} 👋
</h1>
              <p>Learn at your own pace. Improve with every question.</p>
            </section>

            {/* DASHBOARD OVERVIEW CARDS */}
<section className="stats">
 <div
  className="stat-card"
  role="button"
  tabIndex={0}
  onClick={() => setScreen("quizSetup")}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToTopics();
    }
  }}
>
    <span className="stat-icon">▤</span>
    <p>Available Subjects</p>
    <h2>{loading ? "…" : topics.length}</h2>
    <small>Subjects available to explore</small>
  </div>

  <div
  className="stat-card"
  role="button"
  tabIndex={0}
  onClick={goToProgress}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToProgress();
    }
  }}
>
    <span className="stat-icon">◎</span>
    <p>Learning Progress</p>
    <h2>
      {statsLoading
        ? "…"
        : `${Math.min(
            100,
            Math.round(
              (stats.quizzesCompleted /
                Math.max(topics.length, 1)) *
                100
            )
          )}%`}
    </h2>
    <small>Based on quizzes completed</small>
  </div>

  <div
  className="stat-card"
  role="button"
  tabIndex={0}
  onClick={goToProgress}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToProgress();
    }
  }}
>
  <span className="stat-icon">✦</span>
  <p>Study Streak</p>
<h2>
  {statsLoading ? "…" : `${personalizedData?.studyStreak ?? 0} days`}
</h2>
<small>Consecutive days of studying</small>
</div>
</section>

{/* RECOMMENDED TOPIC + RECENT ACTIVITY */}
<section className="dashboard-feature-row">
  <article className="recommended-topic-card">
    <div className="recommended-card-heading">
  <span className="recommended-heading-icon">💡</span>
  <h2>Recommended Topic</h2>
</div>

    {recommendedTopicName ? (
      <>
        <div className="recommended-topic-content">
  <div className="recommended-topic-icon">
    {recommendedTopicName.toLowerCase().includes("python") ? (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
        alt="Python logo"
        className="recommended-topic-logo"
      />
    ) : (
      recommendedTopicName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    )}
  </div>

  <div className="recommended-topic-info">
    <h3>
      {recommendedTopicDetails?.topic || recommendedTopicName}
    </h3>

    <span className="recommended-difficulty">
      {recommendedTopicDetails?.difficulties?.[0] || "Practice"}
    </span>

    
  </div>
</div>

        {recommendedTopicPerformance &&
  Number(recommendedTopicPerformance.attempted) > 0 && (
    <div className="recommended-progress">
  <div className="recommended-progress-label">
    <span>Current accuracy</span>
  </div>

  <div className="recommended-progress-row">
    <div className="recommended-progress-track">
      <div
        className="recommended-progress-fill"
        style={{ width: `${recommendedTopicProgress}%` }}
      />
    </div>

    <strong className="recommended-progress-percentage">
      {recommendedTopicProgress}%
    </strong>
  </div>
</div>
  )}

        <button
          type="button"
          className="recommended-start-button"
          disabled={!recommendedTopicDetails?.available}
          onClick={() => startQuiz(recommendedTopicName)}
        >
          Start Learning <span aria-hidden="true">→</span>
        </button>
        <div className="recommended-why-topic">
  <h4>Why this topic?</h4>
  <p>
    JavaScript Basics is a great next step for strengthening your
    programming fundamentals.
  </p>
  <p>
    Focus on variables, data types, and operators to build confidence
    one quiz at a time.
  </p>
</div>
      </>
    ) : (
      <p>
        {loading
          ? "Finding a topic for you..."
          : "No topics are currently available. Please check back later."}
      </p>
    )}
  </article>

  <article className="recent-activity-card">
    <div className="recent-activity-heading">
      <div>
        <h2>Recent Activity</h2>
        <p>Your latest completed quizzes</p>
      </div>
      <button
  type="button"
  className="refresh-button"
  onClick={() => window.location.reload()}
>
  ↻ Refresh
</button>
      <button
        type="button"
        className="recent-view-all"
        onClick={goToProgress}
      >
        View all →
      </button>
    </div>

    {historyLoading ? (
      <p className="recent-activity-message">
        Loading your activity...
      </p>
    ) : historyError ? (
      <div className="recent-activity-message">
        <p>Could not load recent activity.</p>
        <button
          type="button"
          className="recent-view-all"
          onClick={fetchQuizHistory}
        >
          Retry
        </button>
      </div>
    ) : quizHistory.length === 0 ? (
      <div className="recent-activity-empty">
        <span>📚</span>
        <h3>No activity yet</h3>
        <p>Complete your first quiz to see your results here.</p>
        <button
          type="button"
          className="recommended-start-button"
          onClick={goToTopics}
        >
          Take Your First Quiz →
        </button>
      </div>
    ) : (
      <div className="recent-activity-list">
        {quizHistory.slice(0, 4).map((quiz, index) => (
          <div
            className="recent-activity-item"
            key={quiz.attemptId || `${quiz.topic}-${index}`}
          >
            <span
              className={`recent-activity-icon activity-color-${index % 4}`}
            >
              {quiz.accuracy >= 80
                ? "✓"
                : quiz.accuracy >= 50
                  ? "◎"
                  : "↗"}
            </span>

            <div className="recent-activity-details">
              <strong>{quiz.topic}</strong>
              <span>
                {quiz.completedAt
                  ? new Date(quiz.completedAt).toLocaleDateString()
                  : "Date unavailable"}
              </span>
            </div>

            <div className="recent-activity-score">
              <strong>{quiz.accuracy}%</strong>
              <span>
                {quiz.correctAnswers}/{quiz.totalQuestions} correct
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </article>
</section>

{/* SECTION 6 — LEARNING TIP */}
<section className="learning-tip-card">
  <div className="learning-tip-icon">💡</div>

  <div className="learning-tip-content">
    <span className="learning-tip-label">YOUR LEARNING TIP</span>
    <h2>Small steps lead to big progress</h2>
    <p>
      Practice a few questions every day. Review the concepts
      you find difficult before moving on to harder topics.
      Consistent practice helps you build confidence.
    </p>
  </div>
</section>


            {statsError && (
              <p className="quiz-error" role="alert">
                Could not load statistics: {statsError}
                <button
                  type="button"
                  className="text-button"
                  onClick={fetchStats}
                >
                  Retry
                </button>
              </p>
            )}
           
              {quizError && (
  <p className="quiz-error" role="alert">
    {quizError}
  </p>
)}
            

            
          </>
        )}
        
        
{/* MY TOPICS SCREEN */}
{screen === "topics" && (
  <>
    <button
      type="button"
      className="text-button"
      onClick={returnToDashboard}
    >
      ← Back to Dashboard
    </button>

    <section className="section-heading topics-page-heading" id="topics">
  <div className="topics-heading-left">
    <div className="topics-heading-icon">📖</div>

    <div>
      <h2>Explore Topics</h2>
      <p>
        Choose a subject, pick a difficulty level, and start your quiz.
      </p>
    </div>
  </div>
</section>

    <section className="topic-grid">
      {loading && <p>Loading topics from your database…</p>}

      {!loading && error && (
        <p role="alert">
          {error}{" "}
          <button
            type="button"
            className="text-button"
            onClick={fetchTopics}
          >
            Retry
          </button>
        </p>
      )}

      {!loading && !error && topics.length === 0 && (
        <p>No topics found. Add questions to your database to get started.</p>
      )}

      {!loading && !error &&
        topics.map((topic, index) => (
          <article className="topic-card" key={topic.topic}>
            <div className="topic-top">
              
<span
  className={`topic-symbol ${
    index % 2 === 1 ? "green" : ""
  }`}
>
  {topicLogos[topic.topic.trim().toLowerCase()] ? (
    <img
      src={topicLogos[topic.topic.trim().toLowerCase()]}
      alt={`${topic.topic} logo`}
      className="technology-logo"
    />
  ) : (
    topic.topic
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  )}
</span>


              <span className="difficulty">
                {topic.difficulties?.length
                  ? `${topic.difficulties.length} difficulty levels`
                  : "Practice"}
              </span>
            </div>

            <h3>{topic.topic}</h3>

            <p>
              Practise questions, check your answers, and improve your
              understanding of {topic.topic}.
            </p>

            <div className="topic-footer">
              <span>{topic.questionCount} practice questions</span>

              {(() => {
  const performance = (personalizedData?.topicPerformance || []).find(
    (item) =>
      item.topic?.trim().toLowerCase() ===
      topic.topic.trim().toLowerCase()
  );

  const accuracy = Number(performance?.accuracy) || 0;
  const attempted = Number(performance?.attempted) || 0;
  const completed = attempted > 0 && accuracy >= 70;

  if (!topic.available) {
    return (
      <button type="button" className="text-button" disabled>
        Coming soon
      </button>
    );
  }

  if (completed) {
    return (
      <div className="topic-action-group">
        <span className="topic-completed-label">
          ✓ Topic Completed ({accuracy}%)
        </span>

        <button
          type="button"
          className="text-button"
          onClick={() => startExploreTopic(topic.topic)}
          title={`Practise ${topic.topic} again`}
        >
          Practise Again ↻
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="text-button"
      onClick={() => startExploreTopic(topic.topic)}
      title={`Explore ${topic.topic}`}
    >
      Explore topic →
    </button>
  );
})()}
            </div>
          </article>
        ))}
    </section>

    {quizError && <p role="alert">{quizError}</p>}
  </>
)}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && currentQuestion && (
          <section className="quiz-panel" id="quiz">
            <button
              type="button"
              className="text-button"
              onClick={returnToDashboard}
            >
              ← Back to dashboard
            </button>

            <p className="eyebrow">PRACTICE SESSION</p>
            <h1>{topicName}</h1>

            <p>
              Question {answeredQuestions + 1} of {totalQuestions}
            </p>

            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${
                    (answeredQuestions / totalQuestions) * 100
                  }%`,
                }}
              />
            </div>

            <div className="quiz-question-card">
              <div className="topic-top">
                <span className="difficulty">
                  {currentQuestion.difficulty} difficulty
                </span>

                <span className="difficulty">
                  {answeredQuestions} answered
                </span>
              </div>

              <h2>{currentQuestion.questionText}</h2>

              <div className="quiz-options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    type="button"
                    key={option}
                    disabled={submitting || !!answerFeedback}
                    className={`quiz-option ${
  selectedAnswer === option ? "selected" : ""
} ${
  answerFeedback && option === answerFeedback.correctAnswer
    ? "answer-correct"
    : ""
} ${
  answerFeedback &&
  option === answerFeedback.selectedAnswer &&
  !answerFeedback.isCorrect
    ? "answer-incorrect"
    : ""
}`}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

{answerFeedback && (
  <div
    className={`answer-feedback ${
      answerFeedback.isCorrect ? "correct" : "incorrect"
    }`}
    role="status"
  >
    <h3>
      {answerFeedback.isCorrect
        ? "✓ Correct answer!"
        : "✗ Incorrect answer"}
    </h3>

    {!answerFeedback.isCorrect && (
      <p>
        <strong>Correct answer:</strong>{" "}
        {answerFeedback.correctAnswer}
      </p>
    )}

    <p>
      <strong>Explanation:</strong>{" "}
      {answerFeedback.explanation}
    </p>

    <button
      type="button"
      className="primary-button"
      onClick={goToNextQuestion}
    >
      {answerFeedback.completed
        ? "View Final Results →"
        : "Next Question →"}
    </button>
  </div>
)}
              
              
{!answerFeedback && (
  <button
    type="button"
    className="primary-button"
    disabled={!selectedAnswer || submitting}
    onClick={submitAnswer}
  >
    {submitting
      ? "Submitting answer…"
      : answeredQuestions + 1 === totalQuestions
        ? "Submit and view results"
        : "Submit and continue →"}
  </button>
)}


              <p className="quiz-hint">
                Your answers and explanations will be shown after you finish
                the quiz.
              </p>
            </div>

            {quizError && (
              <p className="quiz-error" role="alert">
                {quizError}
              </p>
            )}
          </section>
        )}
        
{screen === "quizSetup" && (
  <div className="quiz-setup-page">
    <div className="quiz-setup-header">
      <button
        type="button"
        className="quiz-setup-back"
        onClick={() => setScreen("dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h1>Set Up Your Quiz</h1>
      <p>Choose your preferences and start practising.</p>
    </div>
  <div className="quiz-preferences-notice">
  🔔 Your preferred topics:{" "}
  {(authData?.user?.learningPreferences?.topics || [])
    .map((topic) =>
      typeof topic === "string"
        ? topic
        : topic.name || topic.topic || topic.title
    )
    .filter(Boolean)
    .join(", ") || "None selected"}
  {" | "}
  Difficulty:{" "}
  {quizSettings.difficulty || "Select difficulty"}
</div>
    <div className="quiz-setup-card">
      <div className="quiz-setup-field">
        <label htmlFor="quiz-topic">Choose Topic</label>
        <select
          id="quiz-topic"
          value={quizSettings.topic}
          onChange={(e) =>
            setQuizSettings({
              ...quizSettings,
              topic: e.target.value,
            })
          }
        >
          <option value="">Select a topic</option>
          {topics.map((topic, index) => {
            const topicName =
              typeof topic === "string" ? topic : topic.name || topic.topic;

            return topicName ? (
              <option key={topic.id || topicName || index} value={topicName}>
                {topicName}
              </option>
            ) : null;
          })}
        </select>
      </div>

      <div className="quiz-setup-field">
        <label htmlFor="quiz-difficulty">Difficulty</label>
        <select
  id="quiz-difficulty"
  value={quizSettings.difficulty}
  onChange={(e) =>
    setQuizSettings({
      ...quizSettings,
      difficulty: e.target.value,
    })
  }
>
  <option value="">Select difficulty</option>
  <option value="Easy">Easy</option>
  <option value="Medium">Medium</option>
  <option value="Hard">Hard</option>
</select>
      </div>

      <div className="quiz-setup-field">
        <label htmlFor="quiz-question-count">Number of Questions</label>
        <select
          id="quiz-question-count"
          value={quizSettings.questionCount}
          onChange={(e) =>
            setQuizSettings({
              ...quizSettings,
              questionCount: Number(e.target.value),
            })
          }
        >
          <option value="">Select number of questions</option>
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={20}>20 Questions</option>
        </select>
      </div>

      <div className="quiz-setup-field">
        <label htmlFor="quiz-question-type">Question Type</label>
        <select
          id="quiz-question-type"
          value={quizSettings.questionType}
          onChange={(e) =>
            setQuizSettings({
              ...quizSettings,
              questionType: e.target.value,
            })
          }
        >
          <option value="">Select question type</option>
          <option value="Multiple choice">Multiple Choice (MCQ)</option>
          <option value="Mixed">Mixed Question Types</option>
        </select>
      </div>

     <button
  type="button"
  className="quiz-setup-start"
  disabled={
    !quizSettings.topic ||
    !quizSettings.difficulty ||
    !quizSettings.questionCount ||
    !quizSettings.questionType
  }
  onClick={() => startQuiz(quizSettings.topic)}
>
  Start Quiz →
</button>

      {!quizSettings.topic && (
        <p className="quiz-setup-hint">
          Select a topic to continue.
        </p>
      )}
    </div>
  </div>
)}

        
{/* MY PROGRESS SCREEN */}
{screen === "progress" && (
  <section className="progress-dashboard">
    <button
      type="button"
      className="text-button"
      onClick={returnToDashboard}
    >
      ← Back to Dashboard
    </button>

    
<div className="progress-page-heading">
  <div className="progress-heading-title">
    <span className="progress-heading-icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="25"
        height="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 6-7" />
        <path d="M15 6h5v5" />
      </svg>
    </span>

    <div>
      <h1>My Progress</h1>
      <p>
        Track your performance and identify opportunities to improve.
      </p>
    </div>
  </div>
</div>


    {personalizedLoading || historyLoading ? (
      <p className="progress-empty">Loading your learning progress...</p>
    ) : personalizedError || historyError ? (
      <div className="progress-empty">
        <p>{personalizedError || historyError}</p>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            fetchPersonalizedData();
            fetchQuizHistory();
          }}
        >
          Try again
        </button>
      </div>
    ) : (
      <>
        {/* SUMMARY CARDS */}
        <div className="progress-summary-grid">
          <article className="progress-summary-card">
            <div className="progress-card-icon purple-icon">◉</div>
            <p>Overall Accuracy</p>
            <h2>{personalizedData?.overall?.accuracy ?? 0}%</h2>
            <span>Your correct-answer percentage</span>
          </article>

          <article className="progress-summary-card">
            <div className="progress-card-icon blue-icon">✓</div>
            <p>Quizzes Completed</p>
            <h2>{personalizedData?.overall?.quizzesCompleted ?? 0}</h2>
            <span>Completed practice sessions</span>
          </article>

          <article className="progress-summary-card">
            <div className="progress-card-icon pink-icon">▤</div>
            <p>Questions Answered</p>
            <h2>{personalizedData?.overall?.questionsAttempted ?? 0}</h2>
            <span>Total questions attempted</span>
          </article>
        </div>

        
{/* CHARTS */}
<div className="progress-analytics-grid">
  <article className="progress-panel">
    <div className="progress-panel-heading">
      <div>
        <h2>Score Trend</h2>
        <p>Your quiz accuracy over time</p>
      </div>

      <select
        className="progress-range-select"
        value={progressRange}
        onChange={(event) => setProgressRange(event.target.value)}
        aria-label="Score trend date range"
      >
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="all">All Time</option>
      </select>
    </div>

    {filteredProgressAttempts.length === 0 ? (
      <div className="progress-empty">
        Complete a quiz in this period to see your score trend.
      </div>
    ) : (
      <>
        <div className="progress-chart">
          <svg
            viewBox="0 0 600 240"
            role="img"
            aria-label="Quiz accuracy trend"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="progressLineGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#d8b4fe" />
              </linearGradient>

              <filter
                id="progressLineGlow"
                x="-20%"
                y="-50%"
                width="140%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient
                id="progressAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#b47aff"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="#b47aff"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((value) => {
              const y = 190 - value * 1.6;

              return (
                <g key={value}>
                  <line
                    x1="48"
                    y1={y}
                    x2="580"
                    y2={y}
                    className="progress-chart-gridline"
                  />
                  <text
                    x="38"
                    y={y + 4}
                    textAnchor="end"
                    className="progress-chart-label"
                  >
                    {value}%
                  </text>
                </g>
              );
            })}

            {(() => {
              const attempts = filteredProgressAttempts;
              const points = attempts.map((quiz, index) => {
                const x =
                  attempts.length === 1
                    ? 314
                    : 48 + (index * 532) / (attempts.length - 1);

                const accuracy = Math.max(
                  0,
                  Math.min(100, Number(quiz.accuracy) || 0)
                );

                return {
                  x,
                  y: 190 - accuracy * 1.6,
                  accuracy,
                  quiz,
                };
              });

              const linePoints = points
                .map((point) => `${point.x},${point.y}`)
                .join(" ");

              const areaPoints =
                points.length > 1
                  ? `${points[0].x},190 ${linePoints} ${points[points.length - 1].x},190`
                  : "";

              return (
                <>
                  {points.length > 1 && (
                    <>
                      <polygon
                        points={areaPoints}
                        fill="url(#progressAreaGradient)"
                      />

                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="url(#progressLineGradient)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#progressLineGlow)"
                      />
                    </>
                  )}

                  {points.map((point, index) => {
                    const date = point.quiz.completedAt
                      ? new Date(point.quiz.completedAt)
                      : null;

                    const dateLabel =
                      date && !Number.isNaN(date.getTime())
                        ? date.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Date unavailable";

                    return (
                      <g key={point.quiz.attemptId || index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="7"
                          fill="#b47aff"
                          opacity="0.18"
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          className="progress-chart-point"
                        >
                          <title>
                            {`${point.quiz.topic} — ${point.accuracy}% accuracy — ${dateLabel}`}
                          </title>
                        </circle>

                        {(points.length <= 7 ||
                          index === 0 ||
                          index === points.length - 1) && (
                          <text
                            x={point.x}
                            y="218"
                            textAnchor="middle"
                            className="progress-chart-label progress-chart-date"
                          >
                            {dateLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>

        <div className="progress-chart-footer">
          <span>
            {filteredProgressAttempts.length} completed quiz
            {filteredProgressAttempts.length === 1 ? "" : "zes"}
          </span>
          <span>
            Latest:{" "}
            {Number(
              filteredProgressAttempts[
                filteredProgressAttempts.length - 1
              ].accuracy
            ) || 0}
            %
          </span>
        </div>
      </>
    )}
  </article>

  <article className="progress-panel">
  <div className="progress-panel-heading">
    <h2>Topic-wise Performance</h2>

    <button
      type="button"
      className="refresh-button"
      onClick={() => window.location.reload()}
    >
      ↻ Refresh
    </button>
  </div>

  <p>Compare accuracy across topics</p>

  <div className="progress-topic-bars">
    {[...(personalizedData?.topicPerformance || [])]
      .filter((topic) => Number(topic.attempted) > 0)
      .sort(
        (a, b) =>
          Number(b.accuracy || 0) - Number(a.accuracy || 0)
      )
      .slice(0, 6)
      .map((topic) => {
        const accuracy = Math.max(
          0,
          Math.min(100, Number(topic.accuracy) || 0)
        );

        return (
          <div className="progress-topic-row" key={topic.topic}>
            <div className="progress-topic-label">
              <span>{topic.topic}</span>
              <strong>{accuracy}%</strong>
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        );
      })}

    {!(personalizedData?.topicPerformance || []).some(
      (topic) => Number(topic.attempted) > 0
    ) && (
      <div className="progress-empty">
        Your topic analysis will appear after you complete a quiz.
      </div>
    )}
  </div>
</article>
</div>

        {/* STRENGTHS, WEAK AREAS, AND HISTORY */}
        <div className="progress-bottom-grid">
          <article className="progress-panel progress-area-panel">
            <h2>💪 Strong Areas</h2>
            <p>Topics where you are performing well</p>

            {strongAreas.length > 0 ? (
              strongAreas.slice(0, 5).map((topic, index) => (
                <div
                  className="progress-area-item"
                  key={topic.topic || topic.name || index}
                >
                  <span>{topic.topic || topic.name || topic}</span>
                  <span className="progress-area-badge strong-badge">
                    Strong
                  </span>
                </div>
              ))
            ) : (
              <div className="progress-empty">
                Keep practising. Strong areas appear when enough results are
                available.
              </div>
            )}
          </article>

          <article className="progress-panel progress-area-panel">
            <h2>🎯 Areas to Improve</h2>
            <p>Topics that may need more practice</p>

            {weakAreas.length > 0 ? (
              weakAreas.slice(0, 5).map((topic, index) => (
                <div
                  className="progress-area-item"
                  key={topic.topic || topic.name || index}
                >
                  <span>{topic.topic || topic.name || topic}</span>
                  <span className="progress-area-badge improve-badge">
                    Practise
                  </span>
                </div>
              ))
            ) : (
              <div className="progress-empty">
                No topics need extra attention yet, or there is not enough
                data to classify them.
              </div>
            )}
          </article>

          <article className="progress-panel progress-history-panel">
            <h2>🕒 Recent Quiz History</h2>
            <p>Your latest completed quizzes</p>

            {quizHistory.length > 0 ? (
              quizHistory.slice(0, 5).map((quiz, index) => (
                <div
                  className="progress-history-item"
                  key={quiz.attemptId || index}
                >
                  <div className="progress-history-info">
                    <strong>{quiz.topic}</strong>
                    <span>
                      {quiz.completedAt
                        ? new Date(quiz.completedAt).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                  </div>
                  <div className="progress-history-score">
                    <strong>{quiz.accuracy ?? 0}%</strong>
                    <span>
                      {quiz.correctAnswers ?? quiz.score ?? 0}/
                      {quiz.totalQuestions ?? 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="progress-empty">
                Your completed quizzes will appear here.
              </div>
            )}
          </article>
        </div>

        {/* KEEP PERSONALIZED RECOMMENDATIONS */}
        {personalizedData?.recommendation && (
          <article className="progress-panel progress-recommendation">
            <div>
              <p className="progress-eyebrow">RECOMMENDED FOR YOU</p>
              <h2>
                {personalizedData.recommendation.title || "Keep learning"}
              </h2>
              <p>
                {personalizedData.recommendation.reason ||
                  personalizedData.recommendation.message}
              </p>
            </div>

            {personalizedData.recommendation.topic && (
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  startQuiz(personalizedData.recommendation.topic)
                }
              >
                Start Practice →
              </button>
            )}
          </article>
        )}
      </>
    )}
  </section>
)}

        
{/* FINAL RESULTS SCREEN */}
{screen === "results" && quizResults && (() => {
  const total = Math.max(0, Number(quizResults.totalQuestions) || 0);
  const correct = Math.max(
    0,
    Math.min(total, Number(quizResults.correctAnswers) || 0)
  );
  const incorrect = Math.max(0, total - correct);
  const accuracy = total > 0
    ? Math.round((correct / total) * 100)
    : 0;

  return (
    <section className="results-dashboard">

      {/* COMPLETION HEADER */}
      <header className="results-completion-header">
        <div className="results-celebration-icon" aria-hidden="true">
          🏆
        </div>

        <h1>Quiz completed!</h1>

        
<p>
  {isExploreTopic &&
  quizResults.finalLevelReached &&
  accuracy >= 70
    ? `Congratulations! 🎉 You achieved the final Hard level in ${topicName}!`
    : `Great effort! Here are your ${topicName || "quiz"} results.`}
</p>


        <span className="results-completion-badge">
          ✓ Session completed
        </span>
      </header>

      {/* UNIFIED SCORE SUMMARY */}
      <section className="results-score-card">
        <p className="results-card-eyebrow">YOUR PERFORMANCE</p>

        <div className="results-score-metrics">
          <div className="results-score-metric">
            <span>Final score</span>
            <strong>
              {correct}<small> / {total}</small>
            </strong>
          </div>

          <div className="results-metric-divider" />

          <div className="results-score-metric">
            <span>Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>
        </div>

        <div
          className="results-score-progress"
          role="progressbar"
          aria-label="Quiz accuracy"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={accuracy}
        >
          <div
            className="results-score-progress-fill"
            style={{ width: `${accuracy}%` }}
          />
        </div>

        <p className="results-score-caption">
          You answered {correct} out of {total} questions correctly.
        </p>
      </section>

      {/* PERFORMANCE BREAKDOWN */}
      <section className="results-breakdown-card">
        <h2>Performance breakdown</h2>

        <div className="results-breakdown-row">
          <span className="results-breakdown-icon correct-color">
            ✓
          </span>
          <span>Correct answers</span>
          <strong>{correct}</strong>
        </div>

        <div className="results-breakdown-row">
          <span className="results-breakdown-icon incorrect-color">
            ×
          </span>
          <span>Incorrect answers</span>
          <strong>{incorrect}</strong>
        </div>

        <div
          className="results-segmented-bar"
          role="img"
          aria-label={`${correct} correct and ${incorrect} incorrect out of ${total} questions`}
        >
          <div
            className="results-segment-correct"
            style={{
              width: total > 0 ? `${(correct / total) * 100}%` : "0%",
            }}
          />
          <div
            className="results-segment-incorrect"
            style={{
              width: total > 0 ? `${(incorrect / total) * 100}%` : "0%",
            }}
          />
        </div>

        {total === 0 && (
          <p className="results-empty-note">
            No questions were recorded for this quiz.
          </p>
        )}
      </section>

      {/* ANSWER REVIEW */}
      <section className="results-review-panel">
        <div className="results-review-heading">
          <div className="results-review-icon" aria-hidden="true">
            ☷
          </div>

          <div>
            <h2>Review your answers</h2>
            <p>Learn from mistakes and understand every answer.</p>
          </div>
        </div>

        <button
          type="button"
          className="results-review-toggle"
          aria-expanded={showAnswerReview}
          onClick={() =>
            setShowAnswerReview((previous) => !previous)
          }
        >
          <span>
            Review all {quizResults.answerReview?.length ?? total} questions
          </span>
          <span aria-hidden="true">
            {showAnswerReview ? "⌃" : "⌄"}
          </span>
        </button>

        {showAnswerReview && (
          <div className="answer-review-list">
            {(quizResults.answerReview || []).map((item, index) => (
              <article
                className={`review-card ${
                  item.isCorrect
                    ? "review-correct"
                    : "review-incorrect"
                }`}
                key={item.questionId || item.questionNumber || index}
              >
                <div className="review-card-top">
                  <span className="review-question-number">
                    Question {item.questionNumber || index + 1}
                  </span>

                  <span
                    className={`review-status ${
                      item.isCorrect
                        ? "status-correct"
                        : "status-incorrect"
                    }`}
                  >
                    {item.isCorrect ? "✓ Correct" : "× Incorrect"}
                  </span>
                </div>

                <h3>{item.questionText}</h3>

                <p>
                  <strong>Your answer:</strong>{" "}
                  {item.selectedAnswer || "Not recorded"}
                </p>

                <p>
                  <strong>Correct answer:</strong>{" "}
                  {item.correctAnswer || "Not available"}
                </p>

                {item.explanation && (
                  <div className="review-explanation">
                    <strong>Explanation</strong>
                    <p>{item.explanation}</p>
                  </div>
                )}

                {item.difficulty && (
                  <span className="difficulty review-difficulty">
                    {item.difficulty} difficulty
                  </span>
                )}
              </article>
            ))}

            {(!quizResults.answerReview ||
              quizResults.answerReview.length === 0) && (
              <p className="results-empty-note">
                Answer review data is not available for this attempt.
              </p>
            )}
          </div>
        )}
      </section>

     
<div className="results-actions">
  <button
    type="button"
    className="results-dashboard-button"
    onClick={returnToDashboard}
  >
    <span aria-hidden="true">⌂</span>
    Dashboard
  </button>

  

{isExploreTopic ? (
  accuracy >= 70 && quizResults.finalLevelReached ? (
    (() => {
      const nextTopic = topics.find(
        (item) =>
          item.available &&
          item.topic !== topicName &&
          item.questionCount >= 10
      );

      return nextTopic ? (
        <button
          type="button"
          className="results-retry-button"
          onClick={() => startExploreTopic(nextTopic.topic)}
        >
          <span aria-hidden="true">📚</span>
          Explore Next Topic: {nextTopic.topic}
        </button>
      ) : (
        <p role="status">
          🎉 You completed the final level! No other topic with 10 available
          questions was found.
        </p>
      );
    })()
  ) : accuracy >= 70 ? (
    <button
      type="button"
      className="results-retry-button"
      onClick={startPracticeNextLevel}
    >
      <span aria-hidden="true">🚀</span>
      Practice Next Level
    </button>
  ) : (
    <button
      type="button"
      className="results-retry-button"
     onClick={() => startExploreTopic(topicName)}
    >
      <span aria-hidden="true">↻</span>
      Practise Again
    </button>
  )
) : (
  Number(quizResults.accuracy) > 70 ? (
    <button
      type="button"
      className="results-retry-button"
    onClick={() => startExploreTopic(topicName)}
    >
      <span aria-hidden="true">🚀</span>
      Practice Next Level
    </button>
  ) : (
    <button
      type="button"
      className="results-retry-button"
      onClick={() => startQuiz(topicName)}
    >
      <span aria-hidden="true">↻</span>
      Practise Again
    </button>
  )
)}


</div>

    </section>
  );
})()}


        <footer>
          SmartLearn © 2026 · Learn smarter, one question at a time.
        </footer>
      </main>
    </div>
  );
}

export default App;
