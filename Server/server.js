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
app.patch("/users/:id", async (req, res) => {

  const userId = parseInt(req.params.id, 10);
  const user = await query("SELECT * FROM users WHERE user_id = $1", [userId]);
  user.name = req.body.name;
  user.email = req.body.email;
  user.profile_picture = req.body.profile_picture;
  user.bio = req.body.bio;
  user.username = req.body.username;
  await user.save();
  res.send("Updated Successfully");
});

// Delete a specific user
app.delete("/users/:id", async(req, res) => {

    const userId = parseInt(req.params.id, 10);
    const user = await query("SELECT * FROM users WHERE user_id = $1", [userId]);
  try {
    if (user.rowCount.length) {
      await query("DELETE FROM users WHERE user_id = $1", [userId]);
      return res.status(200).send({ message: "User deleted successfully." });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    }
});


//PROJECT

app.get("/projects", async(req, res) => {
  try {
    const project = await query("SELECT * FROM projects");
    return res.status(200).json(project.rows);
  } catch (err) {
    console.log(err)
  }
})
app.get("/projects:id", async (req, res) => {
  const project_id = parseInt(req.params.project_idm, 10);
  try {
    const project = await query("SELECT * FROM projects WHERE project_id = $1", [project_id]);
    if (project.rows.length) {
      return res.status(201).send(project.rows[0])
    } else {
      return res.status(404).send("Could not find the project");
    }
  } catch (err) {
    console.log(err);
  }

})
app.post("/projects", async (req, res) => {
  const {project_id, creator_id,project_name,description,project_url,created_at,status} = req.body;
  try {
    const project = await query(
      "INSERT INTO projects (project_id, creator_id,project_name,description,project_url,created_at,status) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [project_id, creator_id,project_name,description,project_url,created_at,status]
    )
    return res.status(201).json(project.rows[0]);
  } catch (err) {
    console.log("Error at projects post req", err);
    res.status(500).json({ error: err.message || "Internal Error" })
  }
})

app.patch("/projects/:id", async (req, res) => {
  const project_id = parseInt(req.params.project_id, 10);
  const project = await query("SELECT * FROM projects WHERE project_id = $1", [project_id]);
  project.project_name = req.body.project_name;
  project.description = req.body.description;
  project.status = req.body.status;
  await project.save()
  res.send("Updated Successfully");
})

app.delete("/projects/:id", async (req, res) => {
  const project_id = parseInt(req.params.project_id, 10);
  const project = await query("SELECT * FROM projects WHERE project_id = $1", [project_id]);
  try {
    if (project.rows.length) {
      await query("DELETE FROM projects WHERE project_id = $1", [project_id])
      return res.status(200).send({ message: "User deleted successfully." });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    }
})

//SKILLS
router.get('/skills', async (req, res) => {
  try {
    const skills = await query("SELECT * FROM projects");
    return res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/skills/:id', async (req, res) => {
  const skills_id = req.params.skills_id;

  try {
    const skills = await query("SELECT * FROM skills WHERE skills_id = $1",[skills_id]);

    if (!skills) {
      res.status(404).json({ error: 'Programming language not found' });
    }
    return res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/skills', async (req, res) => {
  const { skills_id, skill_name } = req.body;
  try {
    const skills = await await query(
      "INSERT INTO projects (project_id, creator_id,project_name,description,project_url,created_at,status) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [project_id, creator_id,project_name,description,project_url,created_at,status]
    )

    res.status(201).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


});

app.patch('/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const programmingLanguage = await ProgrammingLanguage.findByPk(id);

    if (!programmingLanguage) {
      res.status(404).json({ error: 'Programming language not found' });
    }

    if (name) {
      programmingLanguage.name = name;
    }

    if (description) {
      programmingLanguage.description = description;
    }

    await programmingLanguage.save();

    res.status(200).json(programmingLanguage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const programmingLanguage = await ProgrammingLanguage.findByPk(id);

    if (!programmingLanguage) {
      res.status(404).json({ error: 'Programming language not found' });
    }

    await programmingLanguage.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});