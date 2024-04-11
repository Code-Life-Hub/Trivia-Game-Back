const express = require("express");
const mysql = require("mysql2");
const app = express();
const router = express.Router();
const cors = require("cors");

//Enable CORS
app.use(cors());

app.listen(5001, () => {
  console.log(`Server running on http://localhost:5001`);
});

// Use .env file for username and password
require("dotenv").config();

// middleware to parse request bodies, if you expect to receive JSON payloads
app.use(express.json());

// middleware to set Cache-Control headers
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Create MySQL Connection Pool (replace with your connection details)
const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DBusername,
  password: process.env.DBpassword,
  database: process.env.DBname,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Route to get questions by difficulty
router.get("/difficulty/:difficulty", (req, res) => {
  const selectedDifficulty = req.params.difficulty;
  pool.query(
    "SELECT * FROM trivia_questions WHERE difficulty = ?",
    [selectedDifficulty],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.json(results);
    }
  );
});

// Example route to get a random question (you can remove this if not needed)

// Attach the router to the app
app.use("/api/trivia_questions", router);

// Basic route for testing if the server is running
app.get("/", (req, res) => {
  res.send("Trivia API Running");
});
