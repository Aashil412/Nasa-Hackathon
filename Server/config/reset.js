import "./dotenv.js"
import { pool } from "./database.js"


const createUsersTable = async () => {
    const createTableQuery = `
   
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        email TEXT NOT NULL
      )
    `;
  
    try {
      const res = await pool.query(createTableQuery);
      console.log("🎉 Users table created successfully");
    } catch (err) {
      console.error("⚠️ Error creating users table", err);
    }
  };
  
createUsersTable();
  
  const createSkillsTable = async () => {
    const createTableQuery = `
  
  
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        skill_name TEXT NOT NULL
      )
    `;
  
    try {
      const res = await pool.query(createTableQuery);
      console.log("🎉 Skills table created successfully");
    } catch (err) {
      console.error("⚠️ Error creating skills table", err);
    }
  };
  
createSkillsTable();
  
const createProjectsTable = async () => {
    const createTableQuery = `
  
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_name TEXT NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL
      )
    `;
  
    try {
      const res = await pool.query(createTableQuery);
      console.log("🎉 Projects table created successfully");
    } catch (err) {
      console.error("⚠️ Error creating projects table", err);
    }
  };
  
  createProjectsTable();