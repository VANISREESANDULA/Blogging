import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Home,
  Compass,
  Mail,
  Heart,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  const navItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/messages", label: "Messages", icon: Mail },
    { path: "/notifications", label: "Notifications", icon: Heart },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-zinc-100 text-black'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-900/95' : 'border-border bg-background/95'} backdrop-blur`}>
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2 font-bold text-2xl text-primary"
          >
            <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
              {/* S */}
            </div>
            <span className="hidden sm:inline">Social</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive(path)
                    ? isDark
                      ? "text-blue-400 bg-blue-900/20"
                      : "text-primary bg-primary/10"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title={label}
              >
                <Icon size={20} />
                <span className="text-sm font-medium hidden lg:inline">
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Profile Avatar */}
            <Link
              to="/profile"
              className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center font-bold text-sm hover:shadow-lg transition-shadow ${isDark ? 'bg-gray-700 text-white' : 'bg-zinc-300 text-black'}`}
            >
              U
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-secondary'}`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-border bg-background'}`}>
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive(path)
                      ? isDark
                        ? "text-blue-400 bg-blue-900/20"
                        : "text-primary bg-primary/10"
                      : isDark
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;


 


