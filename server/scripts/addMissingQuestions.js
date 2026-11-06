
const mongoose = require("mongoose");
const Question = require("../models/Question");

const MONGO_URI = "mongodb://127.0.0.1:27017/smartlearn";

const topics = [
  "JavaScript Basics",
  "Python",
  "Java",
  "Data Structures",
  "Mathematics",
  "Aptitude",
];

// We will add only missing, unique questions here.

const questions = [
  // JavaScript Basics — Easy (5)
  {
    questionText: "Which keyword declares a variable whose value can be reassigned?",
    options: ["const", "let", "static", "final"],
    correctAnswer: "let",
    explanation: "The let keyword declares a block-scoped variable that can be reassigned.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which operator checks both value and type equality?",
    options: ["=", "==", "===", "!="],
    correctAnswer: "===",
    explanation: "The strict equality operator compares values without converting their types.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which method converts a JSON string into a JavaScript value?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.read()"],
    correctAnswer: "JSON.parse()",
    explanation: "JSON.parse() parses a JSON string and returns the corresponding JavaScript value.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which array method adds an element to the beginning?",
    options: ["push()", "pop()", "unshift()", "shift()"],
    correctAnswer: "unshift()",
    explanation: "unshift() inserts one or more elements at the beginning of an array.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which value represents an intentionally empty object?",
    options: ["{}", "[]", "()", "null[]"],
    correctAnswer: "{}",
    explanation: "Curly braces create an empty object literal in JavaScript.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },

  // JavaScript Basics — Medium (7)
  {
    questionText: "Which array method creates a new array containing elements that pass a test?",
    options: ["map()", "filter()", "reduce()", "forEach()"],
    correctAnswer: "filter()",
    explanation: "filter() returns a new array containing elements for which the callback returns true.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "What does the spread syntax do when used with an array?",
    options: [
      "Deletes all elements",
      "Expands iterable elements",
      "Sorts elements automatically",
      "Converts elements to strings",
    ],
    correctAnswer: "Expands iterable elements",
    explanation: "Spread syntax expands an iterable into individual elements in a suitable context.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "Which method runs a callback once for each array element without creating a result array?",
    options: ["map()", "filter()", "forEach()", "reduce()"],
    correctAnswer: "forEach()",
    explanation: "forEach() executes a callback for each element and does not build a new result array.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "What does Promise.all() do if one input promise rejects?",
    options: [
      "Waits forever",
      "Rejects the combined promise",
      "Converts rejection to null",
      "Retries every promise",
    ],
    correctAnswer: "Rejects the combined promise",
    explanation: "Promise.all() rejects when an input promise rejects.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "Which feature lets a function remember variables from its outer lexical scope?",
    options: ["Closure", "Prototype", "Hoisting", "Destructuring"],
    correctAnswer: "Closure",
    explanation: "A closure retains access to variables from its surrounding lexical environment.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "Which syntax extracts properties from an object into variables?",
    options: ["Object mapping", "Destructuring", "Type casting", "Concatenation"],
    correctAnswer: "Destructuring",
    explanation: "Object destructuring assigns selected object properties to variables.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },
  {
    questionText: "What does the optional chaining operator ?. help prevent?",
    options: [
      "All syntax errors",
      "Errors from accessing properties on nullish values",
      "All asynchronous errors",
      "Duplicate object keys",
    ],
    correctAnswer: "Errors from accessing properties on nullish values",
    explanation: "Optional chaining short-circuits with undefined when the accessed base is null or undefined.",
    topic: "JavaScript Basics",
    difficulty: "Medium",
  },

  // JavaScript Basics — Hard (8)
  {
    questionText: "What is the main purpose of the JavaScript event loop?",
    options: [
      "To compile all code into machine code",
      "To coordinate queued callbacks with the call stack",
      "To create a separate thread for every function",
      "To convert objects into JSON",
    ],
    correctAnswer: "To coordinate queued callbacks with the call stack",
    explanation: "The event loop coordinates execution of queued tasks when the call stack is available.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "Which statement about Object.freeze() is correct?",
    options: [
      "It recursively freezes every nested object",
      "It prevents changes to an object's own properties at the top level",
      "It deletes all object properties",
      "It converts an object into an immutable string",
    ],
    correctAnswer: "It prevents changes to an object's own properties at the top level",
    explanation: "Object.freeze() is shallow; nested objects may still be mutable unless frozen separately.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "What does a generator function yield when it is first called?",
    options: [
      "Its final return value immediately",
      "A Promise",
      "A generator object",
      "An array of all yielded values",
    ],
    correctAnswer: "A generator object",
    explanation: "Calling a generator function returns a generator object; execution advances through next().",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "Which mechanism determines where a variable name can be accessed in JavaScript?",
    options: ["Lexical scope", "Garbage collection", "JSON serialization", "Event bubbling"],
    correctAnswer: "Lexical scope",
    explanation: "Lexical scope is determined by the location of declarations in the source code.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "What is a key difference between microtasks and timer callbacks in browsers?",
    options: [
      "Microtasks are never asynchronous",
      "Microtasks are generally processed before the next task begins",
      "Timer callbacks always run before promise callbacks",
      "Microtasks run only in Web Workers",
    ],
    correctAnswer: "Microtasks are generally processed before the next task begins",
    explanation: "The microtask queue is generally drained after the current stack finishes and before the next task.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "What does a WeakMap use for its keys?",
    options: [
      "Only strings",
      "Only numeric values",
      "Objects and non-registered symbols where supported",
      "Only arrays",
    ],
    correctAnswer: "Objects and non-registered symbols where supported",
    explanation: "WeakMap keys are objects or, in modern JavaScript, non-registered symbols.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "Why can mutating a shared object cause unexpected behavior in JavaScript?",
    options: [
      "Objects cannot be passed to functions",
      "Multiple references can point to the same object",
      "Every object is copied automatically",
      "Objects are always frozen",
    ],
    correctAnswer: "Multiple references can point to the same object",
    explanation: "When references share an object, mutation through one reference is visible through the others.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },
  {
    questionText: "What does the finally block in a try-catch-finally construct normally provide?",
    options: [
      "Code that runs after the try/catch flow, even when an exception occurs",
      "A guarantee that the try block cannot fail",
      "Automatic rollback of every change",
      "A replacement for every return statement",
    ],
    correctAnswer: "Code that runs after the try/catch flow, even when an exception occurs",
    explanation: "The finally block normally runs whether or not the try block throws, subject to abrupt termination.",
    topic: "JavaScript Basics",
    difficulty: "Hard",
  },

  // Python — Easy (6)
  {
    questionText: "Which built-in function converts a numeric string to an integer?",
    options: ["str()", "int()", "float()", "bool()"],
    correctAnswer: "int()",
    explanation: "int() converts a valid numeric string to an integer.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which keyword is used to define a function in Python?",
    options: ["function", "define", "def", "fun"],
    correctAnswer: "def",
    explanation: "The def keyword starts a function definition.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which collection stores unique elements?",
    options: ["list", "tuple", "set", "string"],
    correctAnswer: "set",
    explanation: "A set stores distinct elements and removes duplicates.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which operator calculates the remainder of a division?",
    options: ["/", "//", "%", "**"],
    correctAnswer: "%",
    explanation: "The modulo operator % returns the remainder.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which method adds one element to the end of a list?",
    options: ["append()", "extend()", "insert()", "remove()"],
    correctAnswer: "append()",
    explanation: "append() adds a single element to the end of a list.",
    topic: "Python",
    difficulty: "Easy",
  },
  {
    questionText: "Which value represents the absence of a value in Python?",
    options: ["undefined", "None", "void", "empty"],
    correctAnswer: "None",
    explanation: "None is Python's special value representing no value.",
    topic: "Python",
    difficulty: "Easy",
  },

  // Python — Medium (7)
  {
    questionText: "Which list comprehension selects even numbers from nums?",
    options: [
      "[n for n in nums if n % 2 == 0]",
      "[n if n % 2 for n in nums]",
      "[if n % 2 == 0 for n in nums]",
      "[n for n in nums while n % 2 == 0]",
    ],
    correctAnswer: "[n for n in nums if n % 2 == 0]",
    explanation: "The if condition filters the elements before they are included.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "What does enumerate(items) provide during iteration?",
    options: [
      "Only the last element",
      "Index-value pairs",
      "A sorted copy",
      "Only the indices",
    ],
    correctAnswer: "Index-value pairs",
    explanation: "enumerate() yields an index and its corresponding item.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "Which statement correctly handles an exception named ValueError?",
    options: [
      "except ValueError:",
      "catch ValueError:",
      "handle ValueError:",
      "error ValueError:",
    ],
    correctAnswer: "except ValueError:",
    explanation: "Python uses except to handle a specified exception type.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "What is the purpose of the __init__ method in a class?",
    options: [
      "To delete an object",
      "To initialize a new instance",
      "To import a module",
      "To terminate a loop",
    ],
    correctAnswer: "To initialize a new instance",
    explanation: "__init__ initializes instance attributes after an object is created.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "Which expression creates a shallow copy of a list named items?",
    options: ["items.copy()", "copy(items, deep=True)", "items.clone()", "items = None"],
    correctAnswer: "items.copy()",
    explanation: "The list copy() method creates a shallow copy of the list.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "What does zip([1, 2], ['a', 'b']) produce when converted to a list?",
    options: [
      "[(1, 'a'), (2, 'b')]",
      "[(1, 2), ('a', 'b')]",
      "[1, 2, 'a', 'b']",
      "{1: 'a', 2: 'b'}",
    ],
    correctAnswer: "[(1, 'a'), (2, 'b')]",
    explanation: "zip() pairs elements at matching positions into tuples.",
    topic: "Python",
    difficulty: "Medium",
  },
  {
    questionText: "Which keyword allows a function to refer to a module-level variable for assignment?",
    options: ["nonlocal", "global", "static", "public"],
    correctAnswer: "global",
    explanation: "global declares that an assignment refers to a module-level variable.",
    topic: "Python",
    difficulty: "Medium",
  },

  // Python — Hard (7)
  {
    questionText: "What is a key benefit of using a generator instead of building a large list?",
    options: [
      "It always sorts the data",
      "It can produce values lazily",
      "It automatically parallelizes execution",
      "It stores every result permanently",
    ],
    correctAnswer: "It can produce values lazily",
    explanation: "Generators produce values on demand, often reducing memory use.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "What does a context manager help manage in Python?",
    options: [
      "Resource setup and cleanup",
      "Variable naming rules",
      "Class inheritance order",
      "Package version numbering",
    ],
    correctAnswer: "Resource setup and cleanup",
    explanation: "Context managers commonly ensure resources are released after use.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "What is the usual effect of applying a decorator to a function?",
    options: [
      "It deletes the function",
      "It wraps or modifies the function's behavior",
      "It converts the function into a class",
      "It automatically runs the function forever",
    ],
    correctAnswer: "It wraps or modifies the function's behavior",
    explanation: "A decorator takes a callable and returns a callable, often adding behavior.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "Why can a mutable default argument cause bugs in Python functions?",
    options: [
      "It is recreated on every call",
      "It may be shared across calls",
      "It cannot contain elements",
      "It becomes a global variable automatically",
    ],
    correctAnswer: "It may be shared across calls",
    explanation: "Default argument objects are created when the function is defined and can persist between calls.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "Which statement about Python's Global Interpreter Lock applies to standard CPython builds with the GIL enabled?",
    options: [
      "It allows only one thread to execute Python bytecode at a time",
      "It prevents all I/O concurrency",
      "It guarantees every thread runs on a separate CPU",
      "It disables multiprocessing",
    ],
    correctAnswer: "It allows only one thread to execute Python bytecode at a time",
    explanation: "In standard GIL-enabled CPython, the GIL limits simultaneous execution of Python bytecode by threads.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "What is the main purpose of Python's __slots__ in a class?",
    options: [
      "To define permitted instance attributes and potentially reduce memory use",
      "To make every attribute private",
      "To enable multiple inheritance automatically",
      "To convert all attributes into constants",
    ],
    correctAnswer: "To define permitted instance attributes and potentially reduce memory use",
    explanation: "__slots__ can restrict instance attributes and may reduce per-instance memory overhead.",
    topic: "Python",
    difficulty: "Hard",
  },
  {
    questionText: "What does functools.lru_cache primarily do?",
    options: [
      "Caches function results for repeated calls",
      "Runs functions on separate machines",
      "Validates every function argument's type",
      "Automatically retries failed functions",
    ],
    correctAnswer: "Caches function results for repeated calls",
    explanation: "lru_cache stores results based on arguments and reuses them for eligible repeated calls.",
    topic: "Python",
    difficulty: "Hard",
  },

  // Java — Easy (6)
  {
    questionText: "Which keyword creates a new object in Java?",
    options: ["class", "new", "this", "void"],
    correctAnswer: "new",
    explanation: "The new keyword creates an object and invokes its constructor.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which type stores a single true or false value in Java?",
    options: ["int", "String", "boolean", "char"],
    correctAnswer: "boolean",
    explanation: "The boolean primitive type stores either true or false.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which method is the usual entry point of a standalone Java application?",
    options: ["start()", "run()", "main()", "init()"],
    correctAnswer: "main()",
    explanation: "The standard entry point is public static void main(String[] args).",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which package contains the Scanner class?",
    options: ["java.io", "java.util", "java.net", "java.sql"],
    correctAnswer: "java.util",
    explanation: "Scanner is available in the java.util package.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which access modifier allows access from anywhere, subject to module and class visibility?",
    options: ["private", "protected", "public", "default"],
    correctAnswer: "public",
    explanation: "Public members can be accessed wherever their enclosing type is accessible.",
    topic: "Java",
    difficulty: "Easy",
  },
  {
    questionText: "Which loop checks its condition before executing the body?",
    options: ["do-while", "while", "Both always execute once", "Neither checks a condition"],
    correctAnswer: "while",
    explanation: "A while loop checks its condition before each iteration.",
    topic: "Java",
    difficulty: "Easy",
  },

  // Java — Medium (7)
  {
    questionText: "What is method overloading in Java?",
    options: [
      "Defining methods with the same name but different parameter lists",
      "Replacing a parent method in a subclass",
      "Declaring two classes with the same name in one package",
      "Calling a method without an object",
    ],
    correctAnswer: "Defining methods with the same name but different parameter lists",
    explanation: "Overloaded methods share a name but differ in their parameter lists.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which collection preserves insertion order and allows duplicate elements?",
    options: ["HashSet", "ArrayList", "TreeSet", "HashMap"],
    correctAnswer: "ArrayList",
    explanation: "ArrayList maintains element order and permits duplicates.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "What does the final keyword mean when applied to a variable?",
    options: [
      "The variable must be public",
      "The variable can be assigned only once",
      "The variable is automatically static",
      "The variable is deleted after use",
    ],
    correctAnswer: "The variable can be assigned only once",
    explanation: "A final variable can be assigned once; for references, the referenced object may still be mutable.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which block is used to execute cleanup code after try-catch processing?",
    options: ["throws", "finally", "final", "cleanup"],
    correctAnswer: "finally",
    explanation: "A finally block normally runs after try-catch processing, even when an exception occurs.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which interface must a class implement to define its natural ordering?",
    options: ["Comparator", "Comparable", "Iterable", "Serializable"],
    correctAnswer: "Comparable",
    explanation: "Comparable defines compareTo() for a class's natural ordering.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which keyword prevents a class from being subclassed?",
    options: ["static", "abstract", "final", "private"],
    correctAnswer: "final",
    explanation: "A final class cannot be extended by another class.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "What is the result of integer division 7 / 2 in Java?",
    options: ["3", "3.5", "4", "2"],
    correctAnswer: "3",
    explanation: "When both operands are integers, division discards the fractional part.",
    topic: "Java",
    difficulty: "Medium",
  },

  // Java — Hard (7)
  {
    questionText: "What is the main purpose of the volatile keyword in Java?",
    options: [
      "To make compound operations atomic",
      "To ensure visibility of updates to a variable across threads",
      "To prevent a variable from changing",
      "To create a new thread automatically",
    ],
    correctAnswer: "To ensure visibility of updates to a variable across threads",
    explanation: "Volatile provides visibility and ordering guarantees, but does not make compound operations atomic.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What does the diamond operator <> help reduce in Java?",
    options: [
      "Explicit generic type arguments during object construction",
      "The number of class constructors",
      "The need for exception handling",
      "The number of interface methods",
    ],
    correctAnswer: "Explicit generic type arguments during object construction",
    explanation: "The compiler can infer generic type arguments from the surrounding context.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "Which statement about Java's HashMap is correct?",
    options: [
      "It guarantees keys remain sorted",
      "It allows one null key in typical implementations",
      "It rejects every duplicate key",
      "It preserves insertion order by definition",
    ],
    correctAnswer: "It allows one null key in typical implementations",
    explanation: "HashMap permits one null key; inserting an existing key replaces its associated value.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What is the purpose of a ReentrantLock?",
    options: [
      "To coordinate exclusive access to shared resources",
      "To convert checked exceptions into unchecked exceptions",
      "To sort threads by their names",
      "To prevent object creation",
    ],
    correctAnswer: "To coordinate exclusive access to shared resources",
    explanation: "ReentrantLock provides explicit locking and unlocking for thread coordination.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What does the Stream API's intermediate operation usually return?",
    options: [
      "A new stream for further processing",
      "A completed database transaction",
      "A new thread for every element",
      "A primitive value in every case",
    ],
    correctAnswer: "A new stream for further processing",
    explanation: "Intermediate operations build a stream pipeline and are generally lazy.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "Which statement about Java checked exceptions is correct?",
    options: [
      "They must be caught or declared, subject to language rules",
      "They can never be thrown by application code",
      "They are always subclasses of RuntimeException",
      "They are ignored by the compiler",
    ],
    correctAnswer: "They must be caught or declared, subject to language rules",
    explanation: "Checked exceptions generally must be caught or declared using throws.",
    topic: "Java",
    difficulty: "Hard",
  },
  {
    questionText: "What is a key property of an immutable object?",
    options: [
      "Its observable state cannot change after construction",
      "It cannot contain any fields",
      "It must be stored in a database",
      "It must be declared as an interface",
    ],
    correctAnswer: "Its observable state cannot change after construction",
    explanation: "An immutable object does not expose operations that change its observable state.",
    topic: "Java",
    difficulty: "Hard",
  },

  // Data Structures — Easy (6)
  {
    questionText: "Which data structure follows the Last In, First Out principle?",
    options: ["Queue", "Stack", "Graph", "Tree"],
    correctAnswer: "Stack",
    explanation: "A stack removes the most recently inserted element first.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which data structure follows the First In, First Out principle?",
    options: ["Stack", "Heap", "Queue", "Graph"],
    correctAnswer: "Queue",
    explanation: "A queue removes elements in the order they were inserted.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which data structure stores elements as key-value pairs?",
    options: ["Stack", "Hash table", "Linked list", "Queue"],
    correctAnswer: "Hash table",
    explanation: "A hash table stores values associated with keys.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "In a singly linked list, what does each node typically contain?",
    options: [
      "Only an array index",
      "Data and a link to the next node",
      "Only a memory address",
      "A graph and a tree",
    ],
    correctAnswer: "Data and a link to the next node",
    explanation: "A singly linked-list node stores data and a reference to the next node.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which traversal visits the root before its subtrees?",
    options: ["Inorder", "Postorder", "Preorder", "Level order only"],
    correctAnswer: "Preorder",
    explanation: "Preorder traversal visits the root before recursively visiting its subtrees.",
    topic: "Data Structures",
    difficulty: "Easy",
  },
  {
    questionText: "Which structure is commonly used to represent hierarchical data?",
    options: ["Queue", "Tree", "Stack", "Hash table"],
    correctAnswer: "Tree",
    explanation: "Trees represent parent-child relationships in hierarchical data.",
    topic: "Data Structures",
    difficulty: "Easy",
  },

  // Data Structures — Medium (7)
  {
    questionText: "What is the average lookup time in a well-distributed hash table?",
    options: ["O(1)", "O(log n)", "O(n log n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Hash-table lookup is expected O(1) when hashing distributes keys well.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which traversal of a binary search tree visits keys in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Reverse level order"],
    correctAnswer: "Inorder",
    explanation: "Inorder traversal visits the left subtree, node, then right subtree.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which data structure is commonly used for breadth-first search?",
    options: ["Stack", "Queue", "Binary search tree", "Disjoint set"],
    correctAnswer: "Queue",
    explanation: "BFS uses a queue to process vertices in increasing distance from the source.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "What is the worst-case time complexity of searching an unsorted linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(n)",
    explanation: "In the worst case, every node must be examined.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which data structure efficiently supports access to the maximum-priority element?",
    options: ["Priority queue", "Unsorted linked list only", "Circular queue only", "Adjacency matrix"],
    correctAnswer: "Priority queue",
    explanation: "A priority queue exposes the element with the highest priority according to its ordering.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "What is the main purpose of a circular queue?",
    options: [
      "To reuse freed positions in a fixed-size array",
      "To keep every element sorted",
      "To remove the need for front and rear indices",
      "To support only one element",
    ],
    correctAnswer: "To reuse freed positions in a fixed-size array",
    explanation: "A circular queue wraps indices around to reuse array positions.",
    topic: "Data Structures",
    difficulty: "Medium",
  },
  {
    questionText: "Which structure is useful for tracking connected components in a graph?",
    options: ["Disjoint-set union", "Stack only", "Circular queue only", "Binary heap only"],
    correctAnswer: "Disjoint-set union",
    explanation: "Disjoint-set union maintains groups and efficiently merges or checks their membership.",
    topic: "Data Structures",
    difficulty: "Medium",
  },

  // Data Structures — Hard (7)
  {
    questionText: "What is the amortized time complexity of appending to a dynamic array?",
    options: ["O(1)", "O(log n)", "O(n) for every append", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Occasional resizing costs O(n), but the amortized cost per append is O(1).",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "Which property defines a min-heap?",
    options: [
      "Every parent is no greater than its children",
      "Every node is smaller than every node in the left subtree",
      "All leaves are sorted",
      "The root is always the largest element",
    ],
    correctAnswer: "Every parent is no greater than its children",
    explanation: "A min-heap maintains the parent-to-child ordering property.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "What is the expected time complexity of search in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(log n)",
    explanation: "A balanced tree has logarithmic height, so search follows a logarithmic-length path.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "Which technique helps detect a cycle in a linked list using constant extra space?",
    options: [
      "Floyd's slow-and-fast pointer algorithm",
      "Binary search",
      "Merge sort",
      "Counting sort",
    ],
    correctAnswer: "Floyd's slow-and-fast pointer algorithm",
    explanation: "Two pointers moving at different speeds will meet if a cycle exists.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "What is the time complexity of building a binary heap from an unsorted array using bottom-up heapification?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    correctAnswer: "O(n)",
    explanation: "Bottom-up heap construction takes linear time because most nodes require little or no sifting.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "Which data structure is commonly used to implement a trie?",
    options: [
      "Nodes with links indexed by characters or symbols",
      "A single sorted integer array only",
      "A stack with no links",
      "A queue containing only priorities",
    ],
    correctAnswer: "Nodes with links indexed by characters or symbols",
    explanation: "Trie nodes connect to children representing successive characters or symbols.",
    topic: "Data Structures",
    difficulty: "Hard",
  },
  {
    questionText: "Which operation does path compression optimize in a disjoint-set data structure?",
    options: [
      "Finding the representative of a set",
      "Sorting all set members",
      "Deleting the entire structure",
      "Finding the shortest path in a weighted graph",
    ],
    correctAnswer: "Finding the representative of a set",
    explanation: "Path compression shortens parent chains during find operations.",
    topic: "Data Structures",
    difficulty: "Hard",
  },

  // Mathematics — Easy (6)
  {
    questionText: "What is the value of 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswer: "30",
    explanation: "15% of 200 is 0.15 × 200 = 30.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "Solve for x: x + 9 = 17.",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    explanation: "Subtracting 9 from both sides gives x = 8.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the area of a rectangle with length 8 and width 5?",
    options: ["13", "26", "40", "80"],
    correctAnswer: "40",
    explanation: "Rectangle area equals length × width, so 8 × 5 = 40.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the average of 6, 10, and 14?",
    options: ["8", "10", "12", "14"],
    correctAnswer: "10",
    explanation: "The mean is (6 + 10 + 14) / 3 = 10.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "What is the square of 13?",
    options: ["26", "156", "169", "196"],
    correctAnswer: "169",
    explanation: "13 squared is 13 × 13 = 169.",
    topic: "Mathematics",
    difficulty: "Easy",
  },
  {
    questionText: "A triangle has angles 50° and 60°. What is its third angle?",
    options: ["60°", "70°", "80°", "90°"],
    correctAnswer: "70°",
    explanation: "Triangle angles total 180°, so the third angle is 180° − 110° = 70°.",
    topic: "Mathematics",
    difficulty: "Easy",
  },

  // Mathematics — Medium (7)
  {
    questionText: "Solve: 3x − 7 = 20.",
    options: ["7", "8", "9", "10"],
    correctAnswer: "9",
    explanation: "Adding 7 gives 3x = 27, so x = 9.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "What is the probability of rolling an even number on a fair six-sided die?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctAnswer: "1/2",
    explanation: "Three of the six outcomes are even, giving probability 3/6 = 1/2.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "What is the slope of the line through (2, 3) and (6, 11)?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation: "The slope is (11 − 3) / (6 − 2) = 8/4 = 2.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "A quantity increases from 80 to 100. What is the percentage increase?",
    options: ["20%", "25%", "30%", "40%"],
    correctAnswer: "25%",
    explanation: "The increase is 20; 20/80 × 100 = 25%.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "What is the median of 3, 7, 9, 12, and 20?",
    options: ["7", "9", "10", "12"],
    correctAnswer: "9",
    explanation: "The middle value in the ordered list is 9.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "If x² = 49 and x is positive, what is x?",
    options: ["−7", "0", "7", "49"],
    correctAnswer: "7",
    explanation: "The positive square root of 49 is 7.",
    topic: "Mathematics",
    difficulty: "Medium",
  },
  {
    questionText: "Two angles of a triangle are 35° and 85°. What is the third angle?",
    options: ["50°", "60°", "70°", "80°"],
    correctAnswer: "60°",
    explanation: "The third angle is 180° − 35° − 85° = 60°.",
    topic: "Mathematics",
    difficulty: "Medium",
  },

  // Mathematics — Hard (7)
  {
    questionText: "Solve the system: x + y = 10 and x − y = 4. What is x?",
    options: ["3", "5", "7", "10"],
    correctAnswer: "7",
    explanation: "Adding the equations gives 2x = 14, so x = 7.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "What is the derivative of f(x) = 3x² − 4x + 7?",
    options: ["6x − 4", "3x − 4", "6x + 7", "3x² − 4"],
    correctAnswer: "6x − 4",
    explanation: "Applying the power rule gives derivative 6x − 4.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "Evaluate the definite integral of 2x from x = 0 to x = 3.",
    options: ["3", "6", "9", "12"],
    correctAnswer: "9",
    explanation: "An antiderivative is x²; evaluating gives 3² − 0² = 9.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "What is the determinant of the matrix [[2, 3], [1, 4]]?",
    options: ["5", "8", "11", "14"],
    correctAnswer: "5",
    explanation: "The determinant is (2 × 4) − (3 × 1) = 5.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "A geometric sequence starts at 3 and has common ratio 2. What is its sixth term?",
    options: ["48", "64", "96", "192"],
    correctAnswer: "96",
    explanation: "The sixth term is 3 × 2⁵ = 96.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "What are the roots of x² − 5x + 6 = 0?",
    options: [
      "1 and 6",
      "2 and 3",
      "−2 and −3",
      "−1 and −6",
    ],
    correctAnswer: "2 and 3",
    explanation: "The polynomial factors as (x − 2)(x − 3) = 0.",
    topic: "Mathematics",
    difficulty: "Hard",
  },
  {
    questionText: "If log₂(x) = 5, what is x?",
    options: ["10", "16", "25", "32"],
    correctAnswer: "32",
    explanation: "log₂(x) = 5 means x = 2⁵ = 32.",
    topic: "Mathematics",
    difficulty: "Hard",
  },

  // Aptitude — Easy (6)
  {
    questionText: "A notebook costs ₹40. What is the cost of 3 notebooks?",
    options: ["₹80", "₹100", "₹120", "₹140"],
    correctAnswer: "₹120",
    explanation: "The total cost is 40 × 3 = ₹120.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "Find the next number: 5, 10, 15, 20, __.",
    options: ["22", "24", "25", "30"],
    correctAnswer: "25",
    explanation: "Each number increases by 5.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "A person travels 60 km in 2 hours. What is the average speed?",
    options: ["20 km/h", "30 km/h", "40 km/h", "60 km/h"],
    correctAnswer: "30 km/h",
    explanation: "Average speed is distance divided by time: 60 / 2 = 30 km/h.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "What is the ratio of 12 to 18 in simplest form?",
    options: ["2:3", "3:2", "4:5", "6:9"],
    correctAnswer: "2:3",
    explanation: "Dividing both terms by 6 gives the ratio 2:3.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "A class has 20 students, and 5 are absent. How many are present?",
    options: ["10", "12", "15", "18"],
    correctAnswer: "15",
    explanation: "Present students = 20 − 5 = 15.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "A fair coin is tossed once. What is the probability of getting heads?",
    options: ["0", "1/4", "1/2", "1"],
    correctAnswer: "1/2",
    explanation: "There are two equally likely outcomes, and one is heads.",
    topic: "Aptitude",
    difficulty: "Easy",
  },

  // Aptitude — Medium (7)
  {
    questionText: "A product costs ₹800 and is discounted by 15%. What is its selling price?",
    options: ["₹620", "₹660", "₹680", "₹700"],
    correctAnswer: "₹680",
    explanation: "The discount is ₹120, so the selling price is ₹800 − ₹120 = ₹680.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "The average of 5 numbers is 18. What is their total?",
    options: ["72", "80", "90", "100"],
    correctAnswer: "90",
    explanation: "Total = average × count = 18 × 5 = 90.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "If 8 workers finish a job in 12 days, how many days would 4 workers take at the same rate?",
    options: ["6 days", "12 days", "18 days", "24 days"],
    correctAnswer: "24 days",
    explanation: "The total work is 8 × 12 = 96 worker-days; 96 / 4 = 24 days.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "A train travels 150 km in 2.5 hours. What is its average speed?",
    options: ["50 km/h", "60 km/h", "65 km/h", "75 km/h"],
    correctAnswer: "60 km/h",
    explanation: "Average speed = 150 / 2.5 = 60 km/h.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "A sum of ₹2,000 earns simple interest at 5% per year for 3 years. What is the interest?",
    options: ["₹200", "₹250", "₹300", "₹350"],
    correctAnswer: "₹300",
    explanation: "Simple interest = principal × rate × time / 100 = ₹300.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "Find the next number: 2, 6, 12, 20, 30, __.",
    options: ["36", "40", "42", "44"],
    correctAnswer: "42",
    explanation: "The differences are 4, 6, 8, and 10; the next difference is 12.",
    topic: "Aptitude",
    difficulty: "Medium",
  },
  {
    questionText: "A bag contains 4 red and 6 blue balls. What is the probability of selecting a red ball at random?",
    options: ["2/5", "3/5", "1/2", "2/3"],
    correctAnswer: "2/5",
    explanation: "The probability is 4 / (4 + 6) = 4/10 = 2/5.",
    topic: "Aptitude",
    difficulty: "Medium",
  },

  // Aptitude — Hard (7)
  {
    questionText: "A can complete a job in 12 days and B in 18 days. How long will they take working together?",
    options: ["6 days", "7.2 days", "8 days", "15 days"],
    correctAnswer: "7.2 days",
    explanation: "Their combined daily rate is 1/12 + 1/18 = 5/36, so the time is 36/5 = 7.2 days.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A shopkeeper marks an item 25% above cost and gives a 10% discount on the marked price. What is the profit percentage?",
    options: ["10%", "12.5%", "15%", "17.5%"],
    correctAnswer: "12.5%",
    explanation: "For a cost of 100, the marked price is 125 and selling price is 112.5, giving 12.5% profit.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A 180-metre train passes a pole in 12 seconds. What is its speed in km/h?",
    options: ["45 km/h", "48 km/h", "54 km/h", "60 km/h"],
    correctAnswer: "54 km/h",
    explanation: "Speed = 180/12 = 15 m/s; multiplying by 3.6 gives 54 km/h.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "The ratio of two numbers is 3:5 and their sum is 64. What is the larger number?",
    options: ["24", "32", "40", "48"],
    correctAnswer: "40",
    explanation: "There are 8 total parts, so each part is 64/8 = 8; the larger number is 5 × 8 = 40.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A person's salary increases by 20% and then decreases by 20%. What is the net percentage change?",
    options: ["No change", "4% increase", "4% decrease", "2% decrease"],
    correctAnswer: "4% decrease",
    explanation: "Starting from 100, the value becomes 120 and then 96, a 4% decrease.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "Two fair dice are rolled. What is the probability that their sum is 8?",
    options: ["5/36", "1/6", "7/36", "1/4"],
    correctAnswer: "5/36",
    explanation: "Five outcomes give a sum of 8 out of 36 equally likely ordered outcomes.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  {
    questionText: "A mixture contains milk and water in the ratio 5:2. If the mixture is 28 litres, how much water does it contain?",
    options: ["6 litres", "8 litres", "10 litres", "20 litres"],
    correctAnswer: "8 litres",
    explanation: "There are 7 total parts, so each part is 28/7 = 4 litres; water is 2 × 4 = 8 litres.",
    topic: "Aptitude",
    difficulty: "Hard",
  },
  // Missing questions — JavaScript Basics (Easy: 2)
  {
    questionText: "Which keyword is used to declare a block-scoped constant?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "const",
    explanation: "const declares a block-scoped binding that cannot be reassigned.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },
  {
    questionText: "Which method removes the last element from an array?",
    options: ["shift()", "pop()", "unshift()", "slice()"],
    correctAnswer: "pop()",
    explanation: "pop() removes and returns the last element of an array.",
    topic: "JavaScript Basics",
    difficulty: "Easy",
  },

  // Missing question — Python (Easy: 1)
  {
    questionText: "Which symbol starts a single-line comment in Python?",
    options: ["//", "#", "/*", "--"],
    correctAnswer: "#",
    explanation: "Python uses the hash symbol to begin a single-line comment.",
    topic: "Python",
    difficulty: "Easy",
  },

  // Missing questions — Java (Medium: 2, Hard: 1)
  {
    questionText: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: "extends",
    explanation: "A class uses extends to inherit from another class.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "Which interface allows an object to be used directly in an enhanced for loop?",
    options: ["Runnable", "Comparable", "Iterable", "Serializable"],
    correctAnswer: "Iterable",
    explanation: "Iterable provides an iterator that supports enhanced for-loop traversal.",
    topic: "Java",
    difficulty: "Medium",
  },
  {
    questionText: "What does the happens-before relationship guarantee in Java concurrency?",
    options: [
      "Every thread runs at the same speed",
      "Certain memory operations are visible and ordered across threads",
      "All methods become synchronized automatically",
      "Threads cannot be interrupted"
    ],
    correctAnswer: "Certain memory operations are visible and ordered across threads",
    explanation: "The Java Memory Model uses happens-before relationships to define visibility and ordering guarantees.",
    topic: "Java",
    difficulty: "Hard",
  },

  // Missing question — Data Structures (Medium: 1)
  {
    questionText: "Which graph representation stores a list of neighbors for each vertex?",
    options: [
      "Adjacency list",
      "Adjacency matrix",
      "Stack representation",
      "Binary heap"
    ],
    correctAnswer: "Adjacency list",
    explanation: "An adjacency list stores the neighboring vertices for each vertex.",
    topic: "Data Structures",
    difficulty: "Medium",
  },

  // Missing question — Mathematics (Medium: 1)
  {
    questionText: "Solve the quadratic equation x² − 9 = 0 for its positive root.",
    options: ["−9", "3", "6", "9"],
    correctAnswer: "3",
    explanation: "x² = 9 gives roots −3 and 3, so the positive root is 3.",
    topic: "Mathematics",
    difficulty: "Medium",
  },

  // Missing questions — Aptitude (Easy: 2)
  {
    questionText: "A pen costs ₹12. What is the cost of 5 pens?",
    options: ["₹48", "₹50", "₹60", "₹72"],
    correctAnswer: "₹60",
    explanation: "The total cost is 12 × 5 = ₹60.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
  {
    questionText: "Find the next number: 3, 6, 9, 12, __.",
    options: ["13", "14", "15", "18"],
    correctAnswer: "15",
    explanation: "The sequence increases by 3 each time.",
    topic: "Aptitude",
    difficulty: "Easy",
  },
];







async function addMissingQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to SmartLearn database.");

    let added = 0;
    let skipped = 0;
    const seen = new Set();

    for (const question of questions) {
      const key = `${question.topic}|${question.difficulty}|${question.questionText.trim().toLowerCase()}`;

      // Prevent duplicate questions in this script.
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);

      // Keep each topic and difficulty at 10 questions maximum.
      const currentCount = await Question.countDocuments({
        topic: question.topic,
        difficulty: question.difficulty,
      });

      if (currentCount >= 10) {
        skipped++;
        continue;
      }

      // Prevent inserting a question already in MongoDB.
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

      console.log(
        `Added: ${question.topic} | ${question.difficulty} | ${question.questionText}`
      );
    }

    console.log(`\nFinished! Added: ${added}, skipped: ${skipped}`);
    console.log("\nFinal question counts:");

    for (const topic of topics) {
      console.log(`\n${topic}`);

      for (const difficulty of ["Easy", "Medium", "Hard"]) {
        const count = await Question.countDocuments({ topic, difficulty });
        console.log(`${difficulty}: ${count}`);
      }
    }
  } catch (error) {
    console.error("Error adding questions:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addMissingQuestions();
