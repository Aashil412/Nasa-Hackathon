// src/components/CreateProject.js

import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../../api/apiClient';
import './CreateProject.css';
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
      
      const response = await apiClient.post(`/projects`, projectData, { withCredentials: true });
      if (response.data && response.data.message) {
        alert('a');
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
      alert(error);
    }
  };

  return (
    <div className="create-project-container">
      <h2 className="create-project-title">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="create-project-form-group">
          <label className="create-project-label">Project Name:</label>
          <input
            type="text"
            value={projectData.project_name}
            onChange={(e) => setProjectData({ ...projectData, project_name: e.target.value })}
            className="create-project-input"
          />
        </div>
        <div className="create-project-form-group">
          <label className="create-project-label">Description:</label>
          <textarea
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            className="create-project-textarea"
          />
        </div>
        <div className="create-project-form-group">
          <label className="create-project-label">Project URL:</label>
          <input
            type="url"
            value={projectData.project_url}
            onChange={(e) => setProjectData({ ...projectData, project_url: e.target.value })}
            className="create-project-input"
          />
        </div>
        <div className="create-project-form-group">
          <label className="create-project-label">Status:</label>
          <input
            type="text"
            value={projectData.status}
            onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
            className="create-project-input"
          />
        </div>
        <div className="create-project-form-group">
          <label className="create-project-label">Skills (comma-separated):</label>
          <input
            type="text"
            value={projectData.skills.join(', ')}
            onChange={(e) => setProjectData({ ...projectData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
            className="create-project-input"
          />
        </div>
        <div>
          <button type="submit" className="create-project-button">Create Project</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
