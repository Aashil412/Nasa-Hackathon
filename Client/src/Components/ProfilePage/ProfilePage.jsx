import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    return (
        <div className="profile-container">
            <ProfileHeader />
            <SkillsSection />
            <ProjectsSection />
        </div>
    );
};

const ProfileHeader = () => {
    return (
        <div className="profile-header">
            <img src="" alt="Profile" className="profile-pic" />
            <div className="profile-info">
                <h2>Username</h2>
                <p className="profile-bio">Bio goes here...</p>
                <button className="edit-profile-btn">Edit Profile</button>
            </div>
        </div>
    );
};

const SkillsSection = () => {
    const skills = ["Science"]; 
    return (
        <div className="skills-section">
            <h3>Skills</h3>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
};

const ProjectsSection = () => {
    const projects = [
        { title: "Project 1", url: "url1",description:"asd" },
        { title: "Project 2", url: "url2",description:"asd" },
        { title: "Project 3", url: "url3",description:"asd" },
    ]; 
    return (
        <div className="projects-section">
            <h3>Projects</h3>
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <p>{project.title}</p>
                        <p>{ project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
