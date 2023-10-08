import React from "react";
import "./SignIn.css";

const Register = () => {
  return (
    <div className="register-container">
      <div className="container">
        <div className="register-card">
          <div
            className="register-left"
            
          >
            <h1 className="title">Welcome</h1>
            <p className="subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              suspendisse aliquam varius rutrum purus maecenas ac
            </p>
          </div>
          <div className="register-right">
            <h2 className="title">Register</h2>
            <p className="subtitle">
              Create your account. It's free and only take a minute
            </p>
            <form action="#">
              <div className="input-row">
                <input type="text" placeholder="Firstname" className="input" />
                <input type="text" placeholder="Surname" className="input" />
              </div>
              <input type="text" placeholder="Email" className="input" />
              <input type="password" placeholder="Password" className="input" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input"
              />
              <div className="checkbox-row">
                <input type="checkbox" />
                <span>
                  I accept the <a href="#">Terms of Use</a> &{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </div>
              <button className="button">Register Now</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
