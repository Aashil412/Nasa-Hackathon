const express = require("express");
const app = express();
const socketIO = require("socket.io")
const http = require("http")
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // or whichever frontend port you're using
    methods: ["GET", "POST"]
  }
});

const port = 4001;

const { query } = require('./database');
const session = require('express-session');
const bcrypt = require("bcryptjs");

app.use(express.json()); // Adding body parsing middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour
  },
}));

app.get("/", (req, res) => {
    res.send("Welcome to the Job Application Tracker API!");
});

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

server.listen(port, () => {
    console.log(`Server is running with Socket.io at http://localhost:${port}`);
});

// Web Socket behavior

// store active users in here, name mapped to socket id.
// allowing users to send message to server with the user
// name in the payload, then server will redirect it to
// the correct user.

let activeUsers = {}; 

// on connection, save user to the activeUsers table.

io.on('connection', (socket) => {
    console.log("A client has connected");

    // user will send username, and it will
    // store user : socket id pair so users can
    // chat.
    socket.on('setUserID', (username) => {
        activeUsers[username] = socket.id;
    });

    // handle message

      socket.on('send message', async (data) => {

        // if its user is in activeUsers then they are online,
        // so send it through websocket.

        const targetSocketID = activeUsers[data.to];
        // if socket exists / user online, send message.
        if (targetSocketID) {
            io.to(targetSocketID).emit('receive message', data.message);
        }

       // save message to message history. 
        try {
          // query for the recipient. 
          const recipientResult = await query('SELECT user_id FROM users WHERE username = $1', [data.to]);
          // query for the sender.
          const senderResult = await query('SELECT user_id FROM users WHERE username = $1', [data.from]);
          if (recipientResult.rows.length == 1) {

              const recipient = recipientResult.rows[0];
              const sender = senderResult.rows[0];
              // save the message using the users primary key.
              const insertQuery = `INSERT INTO messages (sender_id, recipient_id, message) VALUES ($1, $2, $3)`
              const insert = await query(insertQuery, [sender.user_id, recipient.user_id, data.message])

          } else {
              return false;
          }
        } catch (err) {
            console.error('Error querying the database', err);
            return false;
        }
    });

    // When the client disconnects
    socket.on('disconnect', () => {
        console.log("A client has disconnected");
    });
});


//AUTHENTICATION-------------


app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const insertUserQuery = `
      INSERT INTO users (name, email, hashed_password) 
      VALUES ($1, $2, $3) 
      RETURNING user_id, name, email;
  `;

  try {
      const result = await query(insertUserQuery, [req.body.name, req.body.email, hashedPassword]);
      
      const user = result.rows[0];

      // Send a response to the client informing them that the user was successfully created
      res.status(201).json({
          message: "User created!",
          user: {
              user_id: user.user_id,
              name: user.name,
              email: user.email,
          },
      });
  } catch (error) {
      // Handle errors (like unique constraint violations, etc.)
      if (error.code === "23505") { // unique violation
          return res.status(422).json({ message: "Email already exists." });
      }

      res.status(500).json({
          message: "Error occurred while creating user",
          error: error.message,
      });
  }
});


//login
app.post('/login', async (req, res) => {
  try {
    // First, find the user by their email address
    const userQuery = `
        SELECT user_id, name, email, hashed_password 
        FROM users 
        WHERE email = $1;
    `;
    const result = await query(userQuery, [req.body.email]);

    // If the user isn't found in the database, return an 'incorrect credentials' message
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Incorrect credentials',
      });
    }

    const user = result.rows[0];

    // Use bcrypt to check if the password in the request matches the hashed password in the database
    bcrypt.compare(req.body.password, user.hashed_password, (error, isMatch) => {
      if (error) {
        return res.status(500).json({ message: 'Error during password comparison' });
      }

      if (isMatch) {
        // Passwords match
        req.session.userId = user.user_id;

        res.status(200).json({
          message: 'Logged in successfully',
          user: {
            name: user.name,
            email: user.email,
          },
        });
      } else {
        // Passwords don't match
        res.status(401).json({ message: 'Incorrect credentials' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during the login process' });
  }
});

// LOGOUT
app.delete('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.sendStatus(500);
      }

      res.clearCookie('connect.sid');
      return res.sendStatus(200);
  });
});


//AUTH FUNCTION
const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'You must be logged in to view this page.' });
  }
  next();
};


app.get("/users_with_skills", async (req, res) => {
    try {
        // Query to fetch all users along with their associated skills
        const usersWithSkillsQuery = `
            SELECT 
                u.user_id, u.name, u.email, s.skills_name
            FROM 
                users u
            LEFT JOIN 
                user_skills us ON u.user_id = us.user_id
            LEFT JOIN 
                skills s ON us.skill_id = s.skills_id
            ORDER BY 
                u.user_id;
        `;

        const result = await query(usersWithSkillsQuery);
        
        // Grouping the result by users
        const users = {};
        result.rows.forEach(row => {
            if (!users[row.user_id]) {
                users[row.user_id] = {
                    user_id: row.user_id,
                    name: row.name,
                    email: row.email,
                    skills: []
                };
            }
            if (row.skills_name) {
                users[row.user_id].skills.push(row.skills_name);
            }
        });

        // Convert users object to array
        const usersArray = Object.values(users);

        res.status(200).json(usersArray);

    } catch (err) {
        console.error("Error fetching users with skills", err);
        res.status(500).json({ error: "Internal server error" });
    }
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
app.post("/users", authenticateUser,async (req, res) => {
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
app.patch("/users/:id", authenticateUser, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Ensure users can only edit their own profile (unless they're admins)
  if (req.session.userId !== userId /* && !req.session.isAdmin */ ) {  // Uncomment and adjust the admin check if needed.
      return res.status(403).json({ message: "Unauthorized" });
  }

  const fieldNames = [
      "name",
      "email",  // Depending on your use-case, you might want to exclude email from direct updates.
      "bio",
      "username",  // Depending on your use-case, you might want to exclude username from direct updates.
      "hashed_password"
  ].filter((name) => req.body[name]);

  // If updating password, hash it first
  if (req.body.hashed_password) {
      req.body.hashed_password = await bcrypt.hash(req.body.hashed_password, 10);
  }

  let updatedValues = fieldNames.map(name => req.body[name]);
  const setValuesSQL = fieldNames.map((name, i) => {
      return `${name} = $${i + 1}`;
  }).join(', ');

  try {
      const updatedUser = await query(
          `UPDATE users SET ${setValuesSQL} WHERE user_id = $${fieldNames.length + 1} RETURNING *`,
          [...updatedValues, userId]
      );
      
      if (updatedUser.rows.length > 0) {
          res.status(200).json(updatedUser.rows[0]);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
  }
});




// Delete a specific user
app.delete("/users/:id",authenticateUser, async(req, res) => {

    const userId = parseInt(req.params.id, 10);
    const user = await query("SELECT * FROM users WHERE user_id = $1", [userId]);
  try {
    if (user.rowCount>0) {
      await query("DELETE FROM users WHERE user_id = $1", [userId]);
      return res.status(200).send({ message: "User deleted successfully." });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    }
});


// //PROJECT

// ... your imports and initializations ...

app.get("/projects", async(req, res) => {
  try {
    const project = await query("SELECT * FROM projects");
    return res.status(200).json(project.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching projects.");
  }
});

app.get("/projects/:id", async (req, res) => {
  const project_id = parseInt(req.params.id, 10);
  try {
    const project = await query("SELECT * FROM projects WHERE project_id = $1", [project_id]);
    if (project.rows.length) {
      return res.status(201).json(project.rows[0]);
    } else {
      return res.status(404).send("Could not find the project");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching the project.");
  }
});

app.post("/projects", authenticateUser, async (req, res) => {
  const { project_name, description, project_url, created_at, status, skills } = req.body;
  const user_id = req.session.userId;  // Fetch user_id from session
  
  try {
    const project = await query(
      "INSERT INTO projects (user_id, project_name, description, project_url, created_at, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING project_id",
      [user_id, project_name, description, project_url, created_at, status]
    );
    
    const projectId = project.rows[0].project_id;

    for (let skill of skills) {
      // Check if skill exists
      let result = await query("SELECT skills_id FROM skills WHERE skills_name = $1", [skill]);
      
      let skillId;
      if (result.rows.length) {
        skillId = result.rows[0].skills_id;
      } else {
        // If not, insert the skill
        let insertedSkill = await query("INSERT INTO skills (skills_name) VALUES ($1) RETURNING skills_id", [skill]);
        skillId = insertedSkill.rows[0].skills_id;
      }
      
      // Associate the skill with the project
      await query("INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2)", [projectId, skillId]);
    }

    return res.status(201).json({ project_id: projectId, message: "Project and associated skills added successfully." });

  } catch (err) {
    console.log("Error at projects post req", err);
    res.status(500).json({ error: err.message || "Internal Error" });
  }
});

//PROJECTS WITH SKILLS
app.get("/projects_with_skills", async (req, res) => {
  try {
      // Query to fetch all projects along with their associated skills
      const projectsWithSkillsQuery = `
          SELECT 
              p.project_id, p.project_name, p.description, p.project_url, p.created_at, p.status, s.skills_name
          FROM 
              projects p
          LEFT JOIN 
              project_skills ps ON p.project_id = ps.project_id
          LEFT JOIN 
              skills s ON ps.skill_id = s.skills_id
          ORDER BY 
              p.project_id;
      `;

      const result = await query(projectsWithSkillsQuery);
      
      // Grouping the result by projects
      const projects = {};
      result.rows.forEach(row => {
          if (!projects[row.project_id]) {
              projects[row.project_id] = {
                  project_id: row.project_id,
                  project_name: row.project_name,
                  description: row.description,
                  project_url: row.project_url,
                  created_at: row.created_at,
                  status: row.status,
                  skills: []
              };
          }
          if (row.skills_name) {
              projects[row.project_id].skills.push(row.skills_name);
          }
      });

      // Convert projects object to array
      const projectsArray = Object.values(projects);

      res.status(200).json(projectsArray);

  } catch (err) {
      console.error("Error fetching projects with skills", err);
      res.status(500).json({ error: "Internal server error" });
  }
});


app.patch("/projects/:id",authenticateUser, async (req, res) => {
  const project_id = parseInt(req.params.id, 10);
  try {
    await query("UPDATE projects SET project_name = $1, description = $2, status = $3 WHERE project_id = $4", 
                [req.body.project_name, req.body.description, req.body.status, project_id]);
    res.send("Updated Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update project.");
  }
});

app.delete("/projects/:id",authenticateUser, async (req, res) => {
  const project_id = parseInt(req.params.id, 10);
  try {
    const result = await query("DELETE FROM projects WHERE project_id = $1", [project_id]);
    if (result.rowCount) {
      return res.status(200).send({ message: "Project deleted successfully." });
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting the project.");
  }
});

// Skills routes ...

app.get('/skills', async (req, res) => {
  try {
    const skills = await query("SELECT * FROM skills");
    return res.status(200).json(skills.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/skills/:id', async (req, res) => {
  const skills_id = parseInt(req.params.id, 10);
  try {
    const skills = await query("SELECT * FROM skills WHERE skills_id = $1", [skills_id]);
    if (skills.rows.length) {
      return res.status(200).json(skills.rows[0]);
    } else {
      res.status(404).send("Skill not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching the skill.");
  }
});

app.post('/skills', authenticateUser,async (req, res) => {
  const { skill_name } = req.body;
  try {
    const skills = await query(
      "INSERT INTO skills (skill_name) VALUES ($1) RETURNING *",
      [skill_name]
    );
    return res.status(201).json(skills.rows[0]);
  } catch (err) {
    console.log("Error at skills post req", err);
    res.status(500).json({ error: err.message || "Internal Error" });
  }
});

app.delete('/skills/:id', authenticateUser,async (req, res) => {
  const skills_id = parseInt(req.params.id, 10);
  try {
    const result = await query("DELETE FROM skills WHERE skills_id = $1", [skills_id]);
    if (result.rowCount) {
      return res.status(200).send({ message: "Skill deleted successfully." });
    } else {
      res.status(404).send({ message: "Skill not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting the skill.");
  }
});




