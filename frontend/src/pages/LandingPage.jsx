import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import LanguagesSection from "../components/LanguagesSection";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import CodeModal from "../components/CodeModal";

function LandingPage({ onOpenAuth, onNavigate, onSelectSkill }) {
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const handleOpenSandbox = () => {
    setCodeModalOpen(true);
  };

  return (
    <div className="app-landing-wrapper">
      <Navbar
        onOpenAuth={onOpenAuth}
        onOpenSandbox={handleOpenSandbox}
        onNavigate={onNavigate}
      />

      <main className="main-content">
        <Hero
          onOpenSandbox={handleOpenSandbox}
          onOpenAuth={onOpenAuth}
        />
        <AboutUs />
        <Features />
        <LanguagesSection onSelectSkill={onSelectSkill} />
        <ContactUs />
      </main>

      <Footer onOpenAuth={onOpenAuth} />

      {/* Code Sandbox Modal */}
      <CodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        problem={null}
      />
    </div>
  );
}

export default LandingPage;