const express = require("express");
const app = express();
const port = 4001;
const { query } = require('./database');

app.use(express.json()); // Adding body parsing middleware

app.get("/", (req, res) => {
    res.send("Welcome to the Job Application Tracker API!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// List all users
app.get("/users",async (req, res) => {
    try{
      const allUsers= await query("SELECT * FROM users")
      return res.status(200).json(allUsers.rows)
    }catch(err){
      console.log(err)
    }
});

// Get a specific user
app.get("/users/:id", async(req, res) => {
  const userId= parseInt(req.params.id,10) 
    try{
      
      const specificUser= await query("SELECT * FROM users WHERE user_id = $1 ",[userId])
      if(specificUser.rows.length>0){
      return res.status(200).json(specificUser.rows[0])
      }else{
        res.status(404).send({message:"user not found"})
      }
    }catch(err){
      console.log(err)
    }
});

// Create a new user
app.post("/users", async (req, res) => {
    const { name, email, bio, username, hashed_password } = req.body;
    try {
        const newUser = await query(
            "INSERT INTO users (name, email, bio, username, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, email, bio, username, hashed_password]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});

// Update a specific user
app.patch("/users/:id", (req, res) => {
    // Placeholder response
    res.send("Endpoint to update a specific user not yet implemented.");
});

// Delete a specific user
app.delete("/users/:id", (req, res) => {
    // Placeholder response
    res.send("Endpoint to delete a specific user not yet implemented.");
});
