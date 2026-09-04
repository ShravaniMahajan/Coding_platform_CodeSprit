import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

function AuthPage({ initialTab = "login", onLoginSuccess, onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const endpoint = activeTab === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Safely parse — backend may return empty body on error
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);

      if (activeTab === "signup") {
        setSuccess("Account created! Please sign in.");
        setActiveTab("login");
        setFormData({ username: "", email: "", password: "" });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username: data.username, email: data.email, role: data.role }));
        onLoginSuccess(data.role.toLowerCase());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Back Button */}
      <button className="auth-back-btn" onClick={onBack} title="Back to Home">
        <ArrowLeft size={22} />
      </button>

      <div className="auth-page-container">
        {/* Left Side — Illustration Panel */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            <div className="auth-logo">
              Code<span className="auth-logo-accent">Sphere</span>
            </div>
            <div className="auth-illustration-card">
              {activeTab === "login" ? (
                <img src="/src/assets/login_illustration.png" alt="Login" className="auth-illustration-img" onError={(e) => e.target.style.display='none'} />
              ) : (
                <img src="/src/assets/register_illustration.png" alt="Register" className="auth-illustration-img" onError={(e) => e.target.style.display='none'} />
              )}
              <h2 className="auth-illustration-title">
                {activeTab === "login" ? "Welcome Back!" : "Join Us Today!"}
              </h2>
              <p className="auth-illustration-subtitle">
                {activeTab === "login" 
                  ? "Login to continue your coding journey" 
                  : "Create an account and start coding"}
              </p>
            </div>

            {/* Decorative shapes */}
            <div className="auth-deco auth-deco-1" />
            <div className="auth-deco auth-deco-2" />
            <div className="auth-deco auth-deco-3" />
          </div>
        </div>

        {/* Right Side — Form Panel */}
        <div className="auth-right-panel">
          <div className="auth-form-wrapper">
            {/* Tab Switcher */}
            <div className="auth-tab-switcher">
              <button 
                className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
                onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => { setActiveTab("signup"); setError(""); setSuccess(""); }}
              >
                Sign Up
              </button>
            </div>

            <h3 className="auth-form-title">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="auth-form-subtitle">
              {activeTab === "login" ? "Enter your credentials to access your account" : "Fill in your details to get started"}
            </p>

            {error && (
              <div className="auth-alert auth-alert-error">
                <span>⚠</span> {error}
              </div>
            )}
            {success && (
              <div className="auth-alert auth-alert-success">
                <span>✓</span> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {activeTab === "signup" && (
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className="auth-input"
                  />
                </div>
              )}
              
              <div className="auth-field">
                <label className="auth-label">{activeTab === "login" ? "Email / Username" : "Username"}</label>
                <input
                  type="text" name="username" value={formData.username} onChange={handleChange} required
                  placeholder={activeTab === "login" ? "Enter email or username" : "Choose a username"}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                    placeholder="••••••••"
                    className="auth-input"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-eye-btn">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading && <Loader2 size={18} className="auth-spinner" />}
                {activeTab === "login" ? "Sign In" : "Create Account"}
              </button>

              <p className="auth-switch-text">
                {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => { setActiveTab(activeTab === "login" ? "signup" : "login"); setError(""); setSuccess(""); }} className="auth-switch-link">
                  {activeTab === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
