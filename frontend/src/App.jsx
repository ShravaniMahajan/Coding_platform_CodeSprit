import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import SkillProblems from "./components/SkillProblems";
import Workspace from "./components/Workspace";
import "./index.css";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // landing, auth, dashboard, admin, skill-problems, workspace
  const [authTab, setAuthTab] = useState("login");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedSkillName, setSelectedSkillName] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const handleOpenAuth = (tab = "login") => {
    setAuthTab(tab);
    setCurrentPage("auth");
  };

  // After login → route directly based on role
  const handleLoginSuccess = (role) => {
    if (role === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page); // 'dashboard' | 'admin'
  };

  const handleSelectSkill = (skillId, skillName) => {
    setSelectedSkill(skillId);
    setSelectedSkillName(skillName);
    setCurrentPage("skill-problems");
  };

  const handleSelectProblem = (problemId) => {
    // Only allow if logged in, otherwise go to auth
    const token = localStorage.getItem("token");
    if (!token) {
      handleOpenAuth("login");
      return;
    }
    setSelectedProblem(problemId);
    setCurrentPage("workspace");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentPage("landing");
  };

  return (
    <div>
      {currentPage === "landing" && (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onNavigate={handleNavigate}
          onSelectSkill={handleSelectSkill}
        />
      )}
      {currentPage === "auth" && (
        <AuthPage
          initialTab={authTab}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentPage("landing")}
        />
      )}
      {currentPage === "dashboard" && (
        <Dashboard onLogout={handleLogout} onSelectSkill={handleSelectSkill} />
      )}
      {currentPage === "admin" && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {currentPage === "skill-problems" && (
        <SkillProblems 
          skillId={selectedSkill} 
          skillName={selectedSkillName}
          onBack={() => {
            const token = localStorage.getItem("token");
            if (token) setCurrentPage("dashboard");
            else setCurrentPage("landing");
          }}
          onSelectProblem={handleSelectProblem}
        />
      )}
      {currentPage === "workspace" && (
        <Workspace 
          problemId={selectedProblem}
          onBack={() => setCurrentPage("skill-problems")}
        />
      )}
    </div>
  );
}

export default App;