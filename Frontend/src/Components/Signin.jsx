import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    alert("Sign In clicked!");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Sign In</h2>
        <form className="signin-form" onSubmit={handleSignIn}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <div className="signin-footer">
          <p>
            Don't have an account? <Link to="/signuppage">Sign Up</Link>
          </p>
          <button className="back-btn" onClick={handleBack}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
