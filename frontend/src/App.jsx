import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import SkillProblems from "./components/SkillProblems";
import Workspace from "./components/Workspace";
import "./index.css";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [authTab, setAuthTab] = useState("login");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedSkillName, setSelectedSkillName] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [pendingProblemId, setPendingProblemId] = useState(null);

  const handleOpenAuth = (tab = "login", problemId = null) => {
    setAuthTab(tab);
    if (problemId) setPendingProblemId(problemId);
    setCurrentPage("auth");
  };

  // After login → route by role
  const handleLoginSuccess = (role) => {
    // If user was trying to solve a problem before login, go straight to workspace
    if (pendingProblemId) {
      setSelectedProblem(pendingProblemId);
      setPendingProblemId(null);
      setCurrentPage("workspace");
      return;
    }
    if (role === "admin" || role === "ADMIN") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSelectSkill = (skillId, skillName) => {
    setSelectedSkill(skillId);
    setSelectedSkillName(skillName);
    setCurrentPage("skill-problems");
  };

  const handleSelectProblem = (problemId) => {
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
          onSelectProblem={handleSelectProblem}
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
        <Dashboard
          onLogout={handleLogout}
          onSelectSkill={handleSelectSkill}
          onSelectProblem={handleSelectProblem}
          onNavigate={handleNavigate}
        />
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
          onBack={() => {
            if (selectedSkill) setCurrentPage("skill-problems");
            else setCurrentPage("dashboard");
          }}
        />
      )}
    </div>
  );
}

export default App;