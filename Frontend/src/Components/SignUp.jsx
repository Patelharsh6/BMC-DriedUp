import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eyeOpen from '../assets/eye_open.png';
import eyeClose from '../assets/eye-close.svg';
import "./SignUpPage.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPasswordValid((prev) => ({
      ...prev,
      match: formData.password === formData.confirmPassword && formData.password.length > 0,
    }));
  }, [formData.password, formData.confirmPassword]);

  const handlePasswordChange = (value) => {
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordValid({
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
      match: value === formData.confirmPassword,
    });
  };

  const handleConfirmPasswordChange = (value) => {
    setFormData((prev) => ({ ...prev, confirmPassword: value }));
    setPasswordValid((prev) => ({ ...prev, match: value === formData.password }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid.match) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    // Call your backend API to create the user
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
      navigate("/signinpage");
    }, 2000);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="password-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
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

          <div className="password-rules">
            <p className={passwordValid.length ? "valid" : "invalid"}>• Minimum 8 characters</p>
            <p className={passwordValid.upper ? "valid" : "invalid"}>• Uppercase letter</p>
            <p className={passwordValid.lower ? "valid" : "invalid"}>• Lowercase letter</p>
            <p className={passwordValid.number ? "valid" : "invalid"}>• Number</p>
            <p className={passwordValid.special ? "valid" : "invalid"}>• Special character (!@#$%^&*)</p>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            required
          />
          <div className="password-rules">
            <p className={passwordValid.match ? "valid" : "invalid"}>• Passwords match</p>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-switch-text">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signinpage")}>
            Sign In
          </span>
        </p>
        <p className="switch-text-back">
          <span onClick={() => navigate("/")}>Back to home</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
