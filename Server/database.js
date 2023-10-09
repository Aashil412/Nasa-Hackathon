const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const query = (text, params) => {
  console.log("QUERY:", text, params || "");
  return pool.query(text, params);
};

//  DROP TABLE IF EXISTS users CASCADE;
//  i removed the name and made username
//  unique. add that query above before create
//  if you want to drop and change table.
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        profile_picture BYTEA,
        bio TEXT,
        username VARCHAR(100) NOT NULL UNIQUE,
        hashed_password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP,
        deleted_at DATE
    );
`;

const createTable = async () => {
  try {
    await query(createTableQuery);
    console.log('Users Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

const createProjectQuery = `
  CREATE TABLE IF NOT EXISTS projects(
    project_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    project_name VARCHAR(100) NOT NULL,
    description TEXT,
    project_url VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(100) DEFAULT 'ongoing'
  );
`;

const createProjectTable = async () => {
  try {
    await query(createProjectQuery);
    console.log('Project Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

const createSkillsQuery = `
    CREATE TABLE IF NOT EXISTS skills(
        skills_id SERIAL PRIMARY KEY,
        skills_name VARCHAR(100) UNIQUE
    );
`;

const createSkillsTable = async () => {
  try {
    await query(createSkillsQuery);
    console.log('Skills Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

const createProjectSkillsQuery = `
  CREATE TABLE IF NOT EXISTS project_skills(
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    skill_id INTEGER REFERENCES skills(skills_id),
    UNIQUE (project_id, skill_id)   
  );
`;

const createProjectSkillsTable = async () => {
  try {
    await query(createProjectSkillsQuery);
    console.log('Project Skills Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

const createUserSkillsQuery = `
  CREATE TABLE IF NOT EXISTS user_skills(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    skill_id INTEGER REFERENCES skills(skills_id),
    UNIQUE (user_id, skill_id)   
  );
`;

const createUserSkillsTable = async () => {
  try {
    await query(createUserSkillsQuery);
    console.log('User Skills Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

// messages table. The sender and recipient are both referenced
// as foreign key.
const createMessagesQuery = `
  CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    recipient_id INTEGER REFERENCES users(user_id),
    message VARCHAR(1000),
    seen BOOLEAN DEFAULT false
  );
`;


const createMessagesTable = async () => {
  try {
    await query(createMessagesQuery);
    console.log('Messages Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};
// Invoke the table creation functions
createTable();
createProjectTable();
createSkillsTable();
createProjectSkillsTable();
createUserSkillsTable();
createMessagesTable();


// Temporary Users.

const hashedPassword = bcrypt.hashSync("defaultPassword", 10); // A default password for all seeded users

const seedUsersQuery = `
      INSERT INTO users (email, username, hashed_password) 
      VALUES 
        ('john@example.com', 'john_doe', $1),
        ('jane@example.com', 'jane_smith', $1),
        ('alice@example.com', 'alice_johnson', $1),
        ('bob@example.com', 'bob_brown', $1)
      ON CONFLICT (email) DO NOTHING;
`;

const seedUsers = async () => {
  try {
    await query(seedUsersQuery, [hashedPassword]);
    console.log('Default users seeded successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

seedUsers();



module.exports = {
  query,
  pool
};
