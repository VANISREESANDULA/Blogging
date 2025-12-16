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
  const { user } = useSelector((state) => state.auth);
  
  const avatarSrc = user?.profilePhoto
    ? user.profilePhoto.startsWith("data:")
      ? user.profilePhoto
      : `data:image/png;base64,${user.profilePhoto}`
    : null;

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
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2 font-bold text-2xl text-primary"
          >
            <div className="w-16 h-16 rounded-full bg-gray-300 border-2 flex items-center justify-center overflow-hidden">
              <img src="public/logo.png" alt="logo" className="h-16 w-16 object-cover" />
            </div>
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
                      : "text-blue-600 bg-blue-50"
                    : isDark
                    ? "text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
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
            {/* Profile Avatar - ALWAYS VISIBLE ON ALL SCREENS */}
            <Link
              to="/profile"
              className={`flex w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full items-center justify-center overflow-hidden font-bold text-lg sm:text-xl hover:shadow-lg transition-shadow border-2 ${isDark ? "border-gray-600" : "border-gray-300"}`}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  isDark ? "bg-gray-700 text-white" : "bg-red-300 text-black"
                }`}>
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
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
                        : "text-blue-600 bg-blue-50"
                      : isDark
                      ? "text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
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