// src/components/CreateProject.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    project_name: '',
    description: '',
    project_url: '',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format: YYYY-MM-DD HH:MM:SS
    status: '',
    skills: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4001/projects', projectData);
      if (response.data && response.data.message) {
        alert(response.data.message);
        // reset the form or navigate to another page
        setProjectData({
          project_name: '',
          description: '',
          project_url: '',
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          status: '',
          skills: []
        });
      }
    } catch (error) {
      alert('Error creating project.');
    }
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input 
            type="text"
            value={projectData.project_name}
            onChange={(e) => setProjectData({ ...projectData, project_name: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
          />
        </div>
        <div>
          <label>Project URL:</label>
          <input 
            type="url"
            value={projectData.project_url}
            onChange={(e) => setProjectData({ ...projectData, project_url: e.target.value })}
          />
        </div>
        <div>
          <label>Status:</label>
          <input 
            type="text"
            value={projectData.status}
            onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
          />
        </div>
        <div>
          <label>Skills (comma-separated):</label>
          <input 
            type="text"
            value={projectData.skills.join(', ')}
            onChange={(e) => setProjectData({ ...projectData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
          />
        </div>
        <div>
          <button type="submit">Create Project</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
