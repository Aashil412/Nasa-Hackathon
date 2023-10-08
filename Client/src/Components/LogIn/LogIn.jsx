import React, { useState } from "react";
import './LogIn.css'; 
import { Link } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="container">
      <h1 className="page-title">Welcome Back</h1>
      <p className="subheading">Welcome back! Please enter your details.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="checkbox-container">
          <button className="forgot-password">Forgot password</button>
        </div>
        <div className="button-container">
          <button className="primary-button">Sign in</button>
        </div>
      </form>
      <div className="signup-link-container">
        <p className="signup-link-text">Don't have an account?</p>
        <Link to="/signin" className="signup-button">Sign up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
