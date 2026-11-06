
const mongoose = require("mongoose");
const Question = require("../models/Question");

const questions = [
  // ==================== PYTHON (10) ====================
  {
    questionText: "Which keyword is used to define a function in Python?",
    options: ["func", "def", "function", "define"],
    correctAnswer: "def",
    explanation: "The def keyword is used to define a function in Python.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which symbol is used for a single-line comment in Python?",
    options: ["//", "#", "/*", "--"],
    correctAnswer: "#",
    explanation: "Python uses the # symbol to begin a single-line comment.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which data type stores True or False values in Python?",
    options: ["int", "str", "bool", "list"],
    correctAnswer: "bool",
    explanation: "The bool type represents the Boolean values True and False.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which method adds an item to the end of a Python list?",
    options: ["add()", "append()", "insertEnd()", "push()"],
    correctAnswer: "append()",
    explanation: "The append() method adds an item to the end of a list.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "What does len([10, 20, 30]) return?",
    options: ["2", "3", "10", "30"],
    correctAnswer: "3",
    explanation: "The len() function returns the number of elements in the list.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "Which Python collection stores key-value pairs?",
    options: ["List", "Tuple", "Dictionary", "Set"],
    correctAnswer: "Dictionary",
    explanation: "A dictionary stores data as key-value pairs.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "What is the result of [1, 2, 3][1]?",
    options: ["1", "2", "3", "An error"],
    correctAnswer: "2",
    explanation: "Python uses zero-based indexing, so index 1 refers to the second element.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "What is the main purpose of a Python decorator?",
    options: [
      "To delete a function",
      "To modify or extend a function's behavior",
      "To create a list",
      "To stop a program",
    ],
    correctAnswer: "To modify or extend a function's behavior",
    explanation: "A decorator wraps a function or class to extend its behavior without directly changing its original code.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "Which keyword is used to create a generator that yields values one at a time?",
    options: ["return", "yield", "async", "lambda"],
    correctAnswer: "yield",
    explanation: "The yield keyword produces values from a generator while preserving its execution state.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "What is the average time complexity of dictionary lookup by key in Python?",
    options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Dictionary lookup is O(1) on average, although collisions can affect performance.",
    topic: "Python",
    difficulty: "Hard",
  },

  // ==================== JAVA (10) ====================
  {
    questionText: "Which keyword is used to create an object in Java?",
    options: ["class", "this", "new", "static"],
    correctAnswer: "new",
    explanation: "The new keyword creates an object and invokes its constructor.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which method is the usual entry point of a Java application?",
    options: ["start()", "main()", "run()", "init()"],
    correctAnswer: "main()",
    explanation: "A standard Java application begins execution through its main method.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which primitive type stores a whole number in Java?",
    options: ["String", "boolean", "int", "char[]"],
    correctAnswer: "int",
    explanation: "The int primitive type stores signed 32-bit integer values.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which keyword prevents a class from being subclassed?",
    options: ["static", "final", "private", "abstract"],
    correctAnswer: "final",
    explanation: "A final class cannot be extended by another class.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which collection normally stores unique elements?",
    options: ["ArrayList", "HashSet", "LinkedList", "Vector"],
    correctAnswer: "HashSet",
    explanation: "HashSet stores unique elements and does not guarantee iteration order.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "What is method overloading in Java?",
    options: [
      "Defining methods with the same name but different parameter lists",
      "Defining two classes with the same name",
      "Calling a method repeatedly",
      "Making every method static",
    ],
    correctAnswer: "Defining methods with the same name but different parameter lists",
    explanation: "Overloaded methods share a name but have different parameter lists.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which exception category includes IOException?",
    options: [
      "Checked exception",
      "Unchecked exception",
      "Error only",
      "Compile-time warning",
    ],
    correctAnswer: "Checked exception",
    explanation: "IOException is checked, so Java requires it to be caught or declared.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which statement about Java HashMap is correct?",
    options: [
      "It always sorts keys",
      "It allows duplicate keys",
      "It allows one null key",
      "It stores only integers",
    ],
    correctAnswer: "It allows one null key",
    explanation: "HashMap allows one null key and multiple null values; keys must be unique.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What is the main purpose of the volatile keyword in Java?",
    options: [
      "To make a variable immutable",
      "To provide visibility of updates to a variable across threads",
      "To make a method private",
      "To prevent object creation",
    ],
    correctAnswer: "To provide visibility of updates to a variable across threads",
    explanation: "Volatile provides visibility and ordering guarantees for reads and writes to a variable, but does not make compound operations atomic.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What is the worst-case time complexity of searching an unbalanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(n)",
    explanation: "An unbalanced binary search tree can become like a linked list, requiring a linear search.",
    topic: "Java",
    difficulty: "Hard",
  },

  // ==================== DATA STRUCTURES (10) ====================
  {
    questionText: "Which data structure follows Last In, First Out (LIFO)?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctAnswer: "Stack",
    explanation: "A stack removes the most recently added item first.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which data structure follows First In, First Out (FIFO)?",
    options: ["Stack", "Queue", "Heap", "Tree"],
    correctAnswer: "Queue",
    explanation: "A queue removes items in the order they were added.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which data structure stores elements in linked nodes?",
    options: ["Linked list", "Array only", "Hash table only", "Matrix only"],
    correctAnswer: "Linked list",
    explanation: "A linked list connects nodes using references or pointers.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which traversal of a binary search tree visits keys in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    correctAnswer: "Inorder",
    explanation: "Inorder traversal visits the left subtree, node, and right subtree, producing sorted keys in a binary search tree.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "What is the time complexity of accessing an array element by index?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "An array index provides direct access to an element in constant time.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which algorithm finds the shortest paths from a source in a graph with non-negative edge weights?",
    options: ["Binary search", "Dijkstra's algorithm", "Bubble sort", "DFS only"],
    correctAnswer: "Dijkstra's algorithm",
    explanation: "Dijkstra's algorithm computes shortest paths from a source when edge weights are non-negative.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which data structure is commonly used to implement a priority queue efficiently?",
    options: ["Heap", "Stack only", "Unsorted string", "Simple variable"],
    correctAnswer: "Heap",
    explanation: "A binary heap supports efficient insertion and removal of the highest- or lowest-priority element.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "What is the worst-case time complexity of quicksort?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    correctAnswer: "O(n²)",
    explanation: "Poor pivot choices can produce highly unbalanced partitions and quadratic time.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "Which algorithm finds a minimum spanning tree using edges in increasing weight order?",
    options: ["Kruskal's algorithm", "Binary search", "Floyd-Warshall", "Linear search"],
    correctAnswer: "Kruskal's algorithm",
    explanation: "Kruskal's algorithm sorts edges by weight and adds edges that do not create a cycle.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "What is the worst-case time complexity of searching for a key in a hash table?",
    options: ["Always O(1)", "O(log n)", "O(n)", "O(n² log n)"],
    correctAnswer: "O(n)",
    explanation: "In the worst case, many keys can collide and a search may examine a linear number of entries.",
    topic: "Data Structures",
    difficulty: "Hard",
  },

  // ==================== MATHEMATICS (10) ====================
  {
    questionText: "What is 15% of 200?",
    options: ["15", "20", "30", "40"],
    correctAnswer: "30",
    explanation: "15% of 200 is 0.15 × 200 = 30.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the value of 7 × 8?",
    options: ["48", "54", "56", "64"],
    correctAnswer: "56",
    explanation: "Seven multiplied by eight equals fifty-six.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    correctAnswer: "12",
    explanation: "12 × 12 = 144.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "Solve: x + 9 = 17.",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    explanation: "Subtracting 9 from both sides gives x = 8.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the average of 10, 20 and 30?",
    options: ["15", "20", "25", "30"],
    correctAnswer: "20",
    explanation: "The average is (10 + 20 + 30) / 3 = 20.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "A triangle has angles of 50° and 60°. What is the third angle?",
    options: ["60°", "70°", "80°", "90°"],
    correctAnswer: "70°",
    explanation: "The angles of a triangle add up to 180°, so 180° − 50° − 60° = 70°.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "What is the simple interest on ₹1,000 at 5% per year for 2 years?",
    options: ["₹50", "₹100", "₹150", "₹200"],
    correctAnswer: "₹100",
    explanation: "Simple interest = principal × rate × time / 100 = 1000 × 5 × 2 / 100 = ₹100.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "If x² − 5x + 6 = 0, what are its roots?",
    options: [
      "1 and 6",
      "2 and 3",
      "-2 and -3",
      "0 and 5",
    ],
    correctAnswer: "2 and 3",
    explanation: "The expression factors as (x − 2)(x − 3) = 0, so the roots are 2 and 3.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "What is the probability of rolling an even number on a fair six-sided die?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctAnswer: "1/2",
    explanation: "Three of the six outcomes are even, so the probability is 3/6 = 1/2.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x³", "2"],
    correctAnswer: "2x",
    explanation: "By the power rule, the derivative of xⁿ is n × xⁿ⁻¹.",
    topic: "Mathematics",
    difficulty: "Hard",
  },

  // ==================== APTITUDE (10) ====================
  {
    questionText: "A person travels 60 km in 2 hours. What is the average speed?",
    options: ["20 km/h", "30 km/h", "40 km/h", "60 km/h"],
    correctAnswer: "30 km/h",
    explanation: "Average speed = distance / time = 60 / 2 = 30 km/h.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "Find the next number: 2, 4, 6, 8, __.",
    options: ["9", "10", "11", "12"],
    correctAnswer: "10",
    explanation: "Each number increases by 2, so the next number is 10.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "If 5 pens cost ₹50, what is the cost of one pen?",
    options: ["₹5", "₹10", "₹15", "₹20"],
    correctAnswer: "₹10",
    explanation: "The cost of one pen is ₹50 divided by 5, which equals ₹10.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "A class has 20 students, and 5 are absent. How many are present?",
    options: ["5", "10", "15", "25"],
    correctAnswer: "15",
    explanation: "Students present = 20 − 5 = 15.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "A product costs ₹800 and is discounted by 10%. What is the sale price?",
    options: ["₹700", "₹720", "₹780", "₹790"],
    correctAnswer: "₹720",
    explanation: "The discount is ₹80, so the sale price is ₹800 − ₹80 = ₹720.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "The ratio of two numbers is 2:3 and their sum is 25. What is the smaller number?",
    options: ["5", "10", "15", "20"],
    correctAnswer: "10",
    explanation: "There are 5 total ratio parts. Each part is 25 / 5 = 5, so the smaller number is 2 × 5 = 10.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "A can complete a job in 6 days. At a constant rate, what fraction of the job does A complete in 2 days?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctAnswer: "1/3",
    explanation: "A completes 1/6 of the job per day, so in 2 days A completes 2/6 = 1/3.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "A train 120 metres long passes a pole in 6 seconds. What is its speed?",
    options: ["20 m/s", "60 m/s", "72 m/s", "120 m/s"],
    correctAnswer: "20 m/s",
    explanation: "Speed = 120 / 6 = 20 m/s, which is 72 km/h.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A bag contains 3 red and 2 blue balls. What is the probability of selecting two red balls consecutively without replacement?",
    options: ["1/5", "3/10", "2/5", "3/5"],
    correctAnswer: "3/10",
    explanation: "The probability is (3/5) × (2/4) = 6/20 = 3/10.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A sum doubles in 5 years at simple interest. What is the annual interest rate?",
    options: ["10%", "15%", "20%", "25%"],
    correctAnswer: "20%",
    explanation: "If the sum doubles, the interest earned equals the principal. Thus P × r × 5 / 100 = P, giving r = 20%.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
];

async function seedAdditionalQuestions() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/smartlearn");
    console.log("Connected to the smartlearn database.");

    let added = 0;
    let skipped = 0;

    for (const question of questions) {
      const existing = await Question.findOne({
        topic: question.topic,
        questionText: question.questionText,
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Question.create(question);
      added++;
    }

    console.log(`Finished! Added: ${added}, skipped existing: ${skipped}`);

    const topics = [
      "JavaScript Basics",
      "Python",
      "Java",
      "Data Structures",
      "Mathematics",
      "Aptitude",
    ];

    console.log("\nQuestion counts by topic:");

    for (const topic of topics) {
      const count = await Question.countDocuments({ topic });
      const easy = await Question.countDocuments({ topic, difficulty: "Easy" });
      const medium = await Question.countDocuments({ topic, difficulty: "Medium" });
      const hard = await Question.countDocuments({ topic, difficulty: "Hard" });

      console.log(
        `${topic}: ${count} total (Easy: ${easy}, Medium: ${medium}, Hard: ${hard})`
      );
    }
  } catch (error) {
    console.error("Could not seed additional questions:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdditionalQuestions();
