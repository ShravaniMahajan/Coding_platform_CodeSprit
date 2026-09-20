import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Monitor, Bell, BellOff, User, Lock, Shield,
  Globe, Code2, CheckCircle2, Save, Eye, EyeOff, Palette,
  ToggleLeft, ToggleRight, AlertCircle
} from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({ title, icon: Icon, iconColor, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 ${iconColor} bg-opacity-5`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconColor.replace("text-", "bg-").replace("-600","-50")} border ${iconColor.replace("text-","border-").replace("-600","-200")}`}>
          <Icon size={16} className={iconColor} />
        </div>
        <h2 className="font-bold text-slate-900 text-sm">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SettingsPanel({ theme, onThemeChange, onLogout, user, initialSection, onSettingsSaved }) {
  const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");

  const [activeSection, setActiveSection] = useState(initialSection || "appearance");
  const [notifications, setNotifications] = useState({
    emailAlerts: savedSettings.emailAlerts ?? true,
    submissionResults: savedSettings.submissionResults ?? true,
    weeklyDigest: savedSettings.weeklyDigest ?? false,
    contestReminders: savedSettings.contestReminders ?? true,
    systemAnnouncements: savedSettings.systemAnnouncements ?? true,
  });
  const [preferences, setPreferences] = useState({
    editorFontSize: savedSettings.editorFontSize ?? "14",
    defaultLanguage: savedSettings.defaultLanguage ?? "JAVA",
    showLineNumbers: savedSettings.showLineNumbers ?? true,
    autoSave: savedSettings.autoSave ?? true,
    soundEffects: savedSettings.soundEffects ?? false,
    compactMode: savedSettings.compactMode ?? false,
  });
  const [profile, setProfile] = useState({
    displayName: savedSettings.displayName || user?.displayName || user?.username || "",
    bio: savedSettings.bio || "",
    github: savedSettings.github || "",
    linkedin: savedSettings.linkedin || "",
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
  });
  const [saved, setSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSave = () => {
    const settings = { ...notifications, ...preferences, ...profile };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    if (onSettingsSaved) onSettingsSaved();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (security.newPassword !== security.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (security.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: security.currentPassword, newPassword: security.newPassword }),
      });
      if (res.ok) {
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "", showCurrent: false, showNew: false });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setPasswordError("Failed to update password. Check your current password.");
      }
    } catch {
      setPasswordError("Network error. Try again.");
    }
  };

  const sections = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "editor", label: "Editor & Code", icon: Code2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your account, preferences, and appearance</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left Nav */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-5">

          {/* ── APPEARANCE ── */}
          {activeSection === "appearance" && (
            <SectionCard title="Appearance" icon={Palette} iconColor="text-violet-600">
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-3">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun, bg: "bg-white border-slate-200", preview: "bg-slate-50" },
                    { value: "dark", label: "Dark", icon: Moon, bg: "bg-slate-900 border-slate-700", preview: "bg-slate-800" },
                    { value: "system", label: "System", icon: Monitor, bg: "bg-gradient-to-br from-white to-slate-900 border-slate-400", preview: "bg-gradient-to-br from-slate-50 to-slate-800" },
                  ].map(({ value, label, icon: Icon, bg, preview }) => (
                    <button
                      key={value}
                      onClick={() => onThemeChange(value)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        theme === value
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-full h-12 rounded-xl ${preview} border border-slate-200 flex items-center justify-center`}>
                        <Icon size={20} className={value === "dark" ? "text-slate-300" : "text-slate-600"} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{label}</span>
                      {theme === value && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout">
                  <Toggle checked={preferences.compactMode} onChange={(v) => setPreferences({ ...preferences, compactMode: v })} />
                </SettingRow>
              </div>
            </SectionCard>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === "notifications" && (
            <SectionCard title="Notifications" icon={Bell} iconColor="text-amber-600">
              <SettingRow label="Email Alerts" description="Receive important account alerts by email">
                <Toggle checked={notifications.emailAlerts} onChange={(v) => setNotifications({ ...notifications, emailAlerts: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Submission Results" description="Get notified when your code submission is judged">
                <Toggle checked={notifications.submissionResults} onChange={(v) => setNotifications({ ...notifications, submissionResults: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Weekly Digest" description="A weekly summary of your progress and platform updates">
                <Toggle checked={notifications.weeklyDigest} onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Contest Reminders" description="Reminders before upcoming contests and assessments">
                <Toggle checked={notifications.contestReminders} onChange={(v) => setNotifications({ ...notifications, contestReminders: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="System Announcements" description="Platform news, maintenance, and new feature notices">
                <Toggle checked={notifications.systemAnnouncements} onChange={(v) => setNotifications({ ...notifications, systemAnnouncements: v })} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── EDITOR & CODE ── */}
          {activeSection === "editor" && (
            <SectionCard title="Editor & Code Preferences" icon={Code2} iconColor="text-blue-600">
              <SettingRow label="Default Language" description="Language pre-selected when opening a problem">
                <select
                  value={preferences.defaultLanguage}
                  onChange={(e) => setPreferences({ ...preferences, defaultLanguage: e.target.value })}
                  className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="JAVA">Java</option>
                  <option value="PYTHON">Python</option>
                  <option value="CPP">C++</option>
                  <option value="JAVASCRIPT">JavaScript</option>
                  <option value="C">C</option>
                </select>
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Editor Font Size" description="Font size in the code editor (px)">
                <select
                  value={preferences.editorFontSize}
                  onChange={(e) => setPreferences({ ...preferences, editorFontSize: e.target.value })}
                  className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {["12","13","14","15","16","18","20"].map(s => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Show Line Numbers" description="Display line numbers in the code editor">
                <Toggle checked={preferences.showLineNumbers} onChange={(v) => setPreferences({ ...preferences, showLineNumbers: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Auto Save" description="Automatically save your code while typing">
                <Toggle checked={preferences.autoSave} onChange={(v) => setPreferences({ ...preferences, autoSave: v })} />
              </SettingRow>
              <div className="border-t border-slate-100" />
              <SettingRow label="Sound Effects" description="Play sounds on submission results">
                <Toggle checked={preferences.soundEffects} onChange={(v) => setPreferences({ ...preferences, soundEffects: v })} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── PROFILE ── */}
          {activeSection === "profile" && (
            <SectionCard title="Public Profile" icon={User} iconColor="text-emerald-600">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-black text-2xl">{profile.displayName?.[0]?.toUpperCase() || "U"}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{profile.displayName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{user?.email || "No email"}</div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">Member</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Display Name</label>
                  <input
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Short Bio</label>
                  <textarea
                    rows={2}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell others a bit about yourself..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">GitHub Username</label>
                    <input
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      placeholder="e.g. octocat"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">LinkedIn URL</label>
                    <input
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── SECURITY ── */}
          {activeSection === "security" && (
            <SectionCard title="Security & Password" icon={Shield} iconColor="text-rose-600">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={security.showCurrent ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setSecurity({ ...security, showCurrent: !security.showCurrent })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {security.showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={security.showNew ? "text" : "password"}
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setSecurity({ ...security, showNew: !security.showNew })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {security.showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                    <AlertCircle size={14} /> {passwordError}
                  </div>
                )}

                <button
                  onClick={handlePasswordChange}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                >
                  Update Password
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div>
                    <div className="font-bold text-rose-800 text-sm">Sign Out of Account</div>
                    <div className="text-xs text-rose-600 mt-0.5">You will be logged out from all sessions</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
