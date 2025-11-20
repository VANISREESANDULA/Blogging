import React, { useState } from "react";
import Layout from "../ui/Layout";

import {
  ChevronDown,
  Search,
  Lock,
  Bell,
  Eye,
  LogOut,
  HelpCircle,
  Info,
  Plus,
  Moon,
  Sun,
  Settings as SettingsIcon,
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState(["account-details"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const accountSections = [
    {
      id: "account-details",
      title: "Your Account Details",
      items: [
        { id: "passwords", label: "Passwords · Personal Details and Accounts" },
        { id: "saved-info", label: "Saved Info" },
        { id: "archive", label: "Archive" },
        { id: "privacy", label: "Account Privacy" },
        { id: "blocked", label: "Blocked Accounts" },
      ],
    },
    {
      id: "support",
      title: "More Information and Support",
      items: [
        { id: "help", label: "Help Section" },
        { id: "about", label: "About" },
      ],
    },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">

        {/* Header with Search */}
        <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-4 sm:px-6 py-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search here for more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 py-6 space-y-6">

          {/* Dark Mode */}
          <div className="bg-secondary/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon size={20} className="text-accent" />
                ) : (
                  <Sun size={20} className="text-warning" />
                )}
                <h3 className="font-semibold text-foreground">Dark Mode</h3>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`w-12 h-7 rounded-full transition-all flex items-center p-1 ${
                  darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Collapsible Sections */}
          {accountSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);

            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="font-semibold text-foreground">{section.title}</span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && section.items && (
                  <div className="mt-2 space-y-2 ml-2 border-l-2 border-border pl-4">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground flex items-center justify-between group"
                      >
                        <span className="text-sm">{item.label}</span>
                        <ChevronDown
                          size={16}
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -rotate-90"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bookmarks */}
          <div>
            <button
              onClick={() => toggleSection("bookmarks")}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors text-left"
            >
              <span className="font-semibold text-foreground">Bookmarks</span>
              <ChevronDown
                size={20}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.includes("bookmarks") ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.includes("bookmarks") && (
              <div className="mt-2 ml-2 border-l-2 border-border pl-4">
                <div className="flex items-center justify-between px-4 py-8 text-center">
                  <div className="text-center w-full">
                    <div className="text-4xl mb-2">📑</div>
                    <p className="text-muted-foreground text-sm">
                      No bookmarked posts yet. Save posts you want to read later!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Login Details */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Login Details</h3>

            <div className="space-y-3">

              <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-primary font-semibold">
                <Plus size={18} />
                Add Account
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-destructive font-semibold">
                <LogOut size={18} />
                Logout
              </button>

              <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-destructive font-semibold">
                <LogOut size={18} />
                Logout All Accounts
              </button>

            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
