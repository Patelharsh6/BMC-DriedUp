import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignInPage.css";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3021/api/signin", { email, password });
      
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login Successful!");
        localStorage.setItem('fullname', res.data.user.fullname);
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('address', res.data.user.address);
        navigate("/homepage"); 
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
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
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
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
