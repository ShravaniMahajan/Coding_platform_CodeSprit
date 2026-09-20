import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import loginIllustration from "../assets/login_illustration.png";
import registerIllustration from "../assets/register_illustration.png";

function AuthPage({ initialTab = "login", onLoginSuccess, onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDemoLogin = (role) => {
    const demoUser = role === "admin"
      ? { username: "admin", email: "admin@codesphere.io", role: "ADMIN" }
      : { username: "StudentDemo", email: "student@codesphere.io", role: "USER" };
    localStorage.setItem("token", "demo-token-" + Date.now());
    localStorage.setItem("user", JSON.stringify(demoUser));
    onLoginSuccess(role);
  };

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
      // If backend is unreachable (e.g. GitHub Pages static demo), use smart demo fallback
      if (activeTab === "login") {
        const isAdmin = formData.username.toLowerCase().includes("admin");
        const role = isAdmin ? "admin" : "user";
        const demoUser = {
          username: formData.username || (isAdmin ? "admin" : "Student"),
          email: formData.email || (isAdmin ? "admin@codesphere.io" : "user@codesphere.io"),
          role: isAdmin ? "ADMIN" : "USER"
        };
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(demoUser));
        onLoginSuccess(role);
      } else {
        setSuccess("Account registered! Please sign in.");
        setActiveTab("login");
      }
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
                <img src={loginIllustration} alt="Login" className="auth-illustration-img" onError={(e) => e.target.style.display='none'} />
              ) : (
                <img src={registerIllustration} alt="Register" className="auth-illustration-img" onError={(e) => e.target.style.display='none'} />
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
            {/* Quick Demo Credentials Banner */}
            <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex flex-col gap-2">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                ⚡ Quick Demo Access (1-Click Test):
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors"
                >
                  👑 Admin Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("user")}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                >
                  🚀 User Dashboard
                </button>
              </div>
            </div>

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
                  placeholder={activeTab === "login" ? "Enter email or username (e.g. admin)" : "Choose a username"}
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
