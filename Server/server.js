const express = require("express");
const app = express();
const port = 4000;
const { query } = require('./database');
app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// List all users
app.get("/users", (req, res) => {
  // This will eventually return a list of all jobs
});

// Get a specific job
app.get("/users/:id", (req, res) => {
  // This will eventually return a specific job
});

// Create a new user
app.post("/users", (req, res) => {
  
});

// Update a specific job
app.patch("/users/:id", (req, res) => {
  // This will eventually update a specific job
});

// Delete a specific job
app.delete("/users/:id", (req, res) => {
  // This will eventually delete a specific job
});