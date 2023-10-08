const { Pool } = require('pg');
require('dotenv').config();

// Define the pool with configuration from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Define the query function using the pool
const query = (text, params) => {
  console.log("QUERY:", text, params || "");
  return pool.query(text, params);
};

// Define the createTableQuery and related functionality
const createTableQuery = `
    
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        profile_picture BYTEA,
        bio TEXT,
        username VARCHAR(100) UNIQUE,
        hashed_password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP,
        deleted_at DATE
    );
`;

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

createTable();


const createProjectQuery = `
  
  CREATE TABLE IF NOT EXISTS projects(
    project_id SERIAL PRIMARY KEY,
    user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users (user_id),
    project_name VARCHAR(100) NOT NULL,
    description TEXT,
    project_url VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(100) DEFAULT 'ongoing'

  );
`;
const createProjectTable = async () => {
  try {
    await pool.query(createProjectQuery);
    console.log('Project Table created successfully');
  }
  catch (err) {
    console.error('Error executing query', err.stack);
  }
}
createProjectTable();

const createSkillsQuery = `
    
    CREATE TABLE IF NOT EXISTS skills(
        skills_id SERIAL PRIMARY KEY,
        skills_name VARCHAR(100) UNIQUE
    );
`;

const createSkillsTable = async () => {
  try {
    await pool.query(createSkillsQuery);
    console.log('Skills Table created successfully');
  }
  catch (err) {
    console.error('Error executing query', err.stack);
  }
}
createSkillsTable();


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
    await pool.query(createProjectSkillsQuery);
    console.log('Project Skills Table created successfully');
  }
  catch (err) {
    console.error('Error executing query', err.stack);
  }
}
createProjectSkillsTable();

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
    await pool.query(createProjectSkillsQuery);
    console.log('User Skills Table created successfully');
  }
  catch (err) {
    console.error('Error executing query', err.stack);
  }
}
createProjectSkillsTable();
// Export the query function and pool for use in other modules
module.exports = {
  query,
  pool
};
