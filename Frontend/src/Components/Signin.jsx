import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import eyeOpen from "../assets/eye_open.png";
import eyeClose from "../assets/eye-close.svg";
import "./SignInPage.css";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3021/api/signin", { email, password });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("email", res.data.user.email);
        alert("Login Successful!");
        navigate("/homepage");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Sign In</h2>

        <form className="signin-form" onSubmit={handleSignIn}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <img
                src={passwordVisible ? eyeOpen : eyeClose}
                alt={passwordVisible ? "Hide" : "Show"}
              />
            </span>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            Don't have an account? <Link to="/signuppage">Sign Up</Link>
          </p>
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
