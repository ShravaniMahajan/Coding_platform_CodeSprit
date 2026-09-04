import React, { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Loader2, Code2, AlertCircle, CheckCircle2, X } from "lucide-react";

function AuthModal({ onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
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

      // Safely parse response — backend may return empty body on error
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);

      if (activeTab === "signup") {
        setSuccess("Account created! Please sign in.");
        setActiveTab("login");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Side — Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-600 p-8 flex-col items-center justify-center relative">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-xs flex flex-col items-center relative z-10">
            {activeTab === "login" ? (
              <img src="/src/assets/login_illustration.png" alt="Login" className="w-48 h-auto" onError={(e) => e.target.style.display='none'} />
            ) : (
              <img src="/src/assets/register_illustration.png" alt="Register" className="w-48 h-auto" onError={(e) => e.target.style.display='none'} />
            )}
            <h2 className="text-xl font-bold text-slate-800 mt-4 text-center">
              {activeTab === "login" ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-xs text-slate-500 text-center mt-1">
              {activeTab === "login" ? "Login to continue coding" : "Join CodeSphere today"}
            </p>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-blue-500 rounded-lg rotate-12 opacity-50" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-700 rounded-full opacity-50" />
        </div>

        {/* Right Side — Form */}
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto relative bg-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-sm text-slate-500 mb-8">
            {activeTab === "login" ? "Login to continue coding" : "Join CodeSphere today"}
          </p>

          {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}
          {success && <div className="p-3 mb-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === "signup" && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-0 py-2 border-b-2 border-slate-200 bg-transparent text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm text-slate-600 mb-1">{activeTab === "login" ? "Email / Username" : "Full Name / Username"}</label>
              <input
                type="text" name="username" value={formData.username} onChange={handleChange} required
                className="w-full px-0 py-2 border-b-2 border-slate-200 bg-transparent text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-0 py-2 border-b-2 border-slate-200 bg-transparent text-slate-900 focus:outline-none focus:border-blue-600 transition-colors pr-8"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {activeTab === "login" ? "Login" : "Register"}
            </button>

            <p className="text-center text-sm text-slate-600 mt-6">
              {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setActiveTab(activeTab === "login" ? "signup" : "login"); setError(""); }} className="text-blue-600 font-semibold hover:underline">
                {activeTab === "login" ? "Register" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
