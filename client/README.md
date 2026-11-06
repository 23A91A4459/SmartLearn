# SmartLearn – Adaptive Quiz and Personalized Learning Platform

## 1. Project Description

SmartLearn is a full-stack web application designed to help students practise quiz questions, track their learning progress, and improve their understanding of different topics.

The application provides multiple-choice quizzes, evaluates student answers, adjusts quiz difficulty based on performance, and offers personalized learning recommendations. It stores questions, user information, quiz responses, and attempt history in MongoDB.

SmartLearn aims to make learning more interactive by adapting quiz difficulty to student performance and helping students identify topics that need additional practice.

## 2. Technologies Used

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | bcryptjs, JSON Web Token (JWT) |
| Other libraries | CORS, dotenv, Nodemailer |
| Development tools | npm, Git, GitHub |

## 3. Project Structure

```text
SmartLearn/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Auth.jsx
│   │   ├── index.css
│   │   ├── LandingPage.jsx
│   │   ├── LandingPage.css
│   │   ├── ResetPassword.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Question.js
│   │   ├── QuizAttempt.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   └── topicRoutes.js
│   ├── scripts/
│   │   ├── seedQuestions.js
│   │   ├── seedAdditionalQuestions.js
│   │   └── addMissingQuestions.js
│   ├── emailService.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 4. Prerequisites

Before running the application, ensure that the following are installed:

- Node.js and npm
- MongoDB Community Server
- A modern web browser
- Git (optional, for cloning the repository)

## 5. Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/23A91A4459/SmartLearn.git
cd SmartLearn
```

Alternatively, download the repository ZIP from GitHub and extract it.

### Step 2: Start MongoDB

The current backend connects to a local MongoDB instance using the following connection string:

```text
mongodb://127.0.0.1:27017/smartlearn
```

Ensure that MongoDB is installed and running on your computer.

The database name is `smartlearn`. Mongoose uses the application's schemas to manage the database collections.

### Step 3: Install backend dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

### Step 4: Prepare the database

The project contains scripts for adding initial quiz questions in the `server/scripts/` directory.

Inspect `seedQuestions.js` and run it if it is the appropriate initial seeding script for your database:

```bash
node scripts/seedQuestions.js
```

Run the seeding process only as needed. Check the script first to avoid inserting duplicate questions.

### Step 5: Start the backend

From the `server/` directory, run:

```bash
npm run dev
```

The Express backend connects to MongoDB and starts on port `5000`.

Backend URL:

```text
http://localhost:5000
```

The root endpoint displays a confirmation message when the backend is running.

### Step 6: Install frontend dependencies

Open a second terminal from the project root and run:

```bash
cd client
npm install
```

### Step 7: Start the frontend

From the `client/` directory, run:

```bash
npm run dev
```

Vite displays the local frontend URL in the terminal. Open that URL in a browser to access SmartLearn. The default Vite URL is commonly `http://localhost:5173`, but use the address shown in your terminal.

### Step 8: Backend API routes

The backend registers the following API route prefixes:

| API route | Purpose |
|---|---|
| `/api/questions` | Question-related operations |
| `/api/topics` | Topic-related operations |
| `/api/quizzes` | Quiz and attempt operations |
| `/api/auth` | Authentication-related operations |

The specific endpoints and request formats are defined in the route files under `server/routes/`.

## 6. Feature Completion Status

### Level 1 – Basic Full-Stack Quiz Application: Completed

SmartLearn provides the foundation of a database-backed quiz application.

- Multiple-choice questions with four answer options.
- Question statements, correct answers, explanations, topics, and difficulty levels.
- MongoDB storage for quiz questions.
- Backend routes for question and quiz operations.
- Quiz answer evaluation and score tracking.
- Quiz attempt records for storing student responses and progress.

### Level 2 – Adaptive Quiz Engine: Completed

SmartLearn adjusts quiz difficulty based on student performance.

- Questions are organised into Easy, Medium, and Hard difficulty levels.
- The backend tracks consecutive correct and incorrect answers.
- Difficulty increases after two consecutive correct answers.
- Difficulty decreases after two consecutive incorrect answers.
- The current difficulty and consecutive-answer counters are stored in quiz attempt records.
- Questions are selected from the MongoDB question bank according to the current difficulty.

The adaptive engine aims to provide questions that better match the student's demonstrated performance.

### Level 3 – Personalized Learning: Completed

SmartLearn includes personalized learning features designed to help students understand their progress and identify areas for improvement.

- Topic-wise performance analysis.
- Identification of strong and weak topics based on quiz performance.
- Learning recommendations based on student performance.
- Tracking of quiz attempts and learning history.
- Use of stored performance data to support personalized learning.

These features help students focus their practice on topics where further learning may be beneficial.

### Level 4 – Advanced AI/ML Features: Not Attempted

Level 4 is optional. An additional advanced AI/ML feature beyond the functionality of Levels 1–3 has not been included in this submission.

## 7. Adaptive Algorithm

SmartLearn uses a rule-based adaptive algorithm to adjust quiz difficulty.

1. A quiz attempt starts at its configured initial difficulty.
2. The backend evaluates the student's selected answer.
3. The consecutive-correct and consecutive-incorrect counters are updated.
4. After two consecutive correct answers, the difficulty increases by one level, when a higher level is available.
5. After two consecutive incorrect answers, the difficulty decreases by one level, when a lower level is available.
6. If neither threshold is reached, the current difficulty is maintained.
7. The backend selects a question from MongoDB at the current difficulty.

The difficulty progression is:

```text
Easy → Medium → Hard
```

Difficulty remains within the supported levels. When no suitable questions are available at the selected difficulty, the application should handle the situation gracefully.

The `QuizAttempt` model contains the following fields to support adaptive behaviour:

- `currentDifficulty`
- `consecutiveCorrect`
- `consecutiveIncorrect`

These values allow the backend to maintain the adaptive state for an individual quiz attempt.

## 8. Database Design

SmartLearn uses MongoDB with Mongoose schemas. The main models are `Question`, `User`, and `QuizAttempt`.

### 8.1 Question Model

The `Question` model stores the quiz question bank.

| Field | Description |
|---|---|
| `questionText` | The question statement |
| `options` | Four answer options |
| `correctAnswer` | The correct answer |
| `explanation` | Explanation for the answer |
| `topic` | Topic associated with the question |
| `difficulty` | Easy, Medium, or Hard |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Record update timestamp |

The schema requires the main question fields, validates that there are exactly four options, and restricts difficulty to Easy, Medium, or Hard.

### 8.2 User Model

The `User` model stores account details and learning preferences.

| Field | Description |
|---|---|
| `name` | User's name |
| `email` | Unique email address |
| `bio` | Optional profile description |
| `learningPreferences.difficulty` | Preferred difficulty |
| `learningPreferences.topics` | Preferred topics |
| `passwordHash` | Hashed password |
| `resetTokenHash` | Password-reset token hash |
| `resetTokenExpiry` | Password-reset token expiry |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Record update timestamp |

Passwords are represented by a hash rather than a plain-text password. Sensitive password-related fields are excluded from normal query results.

### 8.3 QuizAttempt Model

The `QuizAttempt` model stores a user's quiz activity and adaptive progress.

| Field | Description |
|---|---|
| `userId` | Reference to the user |
| `attemptId` | Unique quiz attempt identifier |
| `topic` | Topic of the quiz |
| `answers` | Selected answers and correctness information |
| `currentQuestionId` | Reference to the current question |
| `score` | Current quiz score |
| `totalQuestions` | Total questions in the attempt |
| `currentDifficulty` | Current adaptive difficulty |
| `consecutiveCorrect` | Consecutive correct-answer counter |
| `consecutiveIncorrect` | Consecutive incorrect-answer counter |
| `completed` | Whether the attempt is complete |
| `startedAt` | Attempt start time |
| `completedAt` | Attempt completion time |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Record update timestamp |

Each answer stores a question reference, selected answer, correctness status, and difficulty level.

### 8.4 Relationships

- A quiz attempt references a user through `userId`.
- Each answer within an attempt references a question through `questionId`.
- Questions are stored separately from quiz attempts.
- User learning preferences are stored within the user document.

Mongoose manages these schemas and interacts with the MongoDB database.

## 9. Assumptions and Limitations

- The documented setup assumes MongoDB is running locally on `127.0.0.1:27017`.
- The current backend uses a hardcoded MongoDB connection string. A hosted deployment would require appropriate database configuration.
- Initial quiz questions must be seeded if the database does not already contain them.
- The adaptive algorithm depends on suitable questions being available at each difficulty level.
- The recommendation quality depends on the available quiz attempt and topic-performance data.
- Level 4 has not been attempted.
- The project should be tested with a fresh database and after restarting the backend to confirm data persistence.
- Any additional limitations or unfinished functionality discovered during testing should be documented before submission.



## 10. GitHub Repository

Repository: https://github.com/23A91A4459/SmartLearn
