import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings, BookOpen, HelpCircle, PenSquare, Home, Compass, Mail, Heart, Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authslice";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  // Use global theme state so Layout follows the app-wide dark mode
  const darkMode = useSelector((state) => state.theme.isDark);
  
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  

  const notifications = useSelector(
  (state) => state.notifications.all || []
);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  // Keyboard navigation for dropdown
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isDropdownOpen && event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);
  
  const avatarSrc = user?.profilePhoto
    ? user.profilePhoto.startsWith("data:")
      ? user.profilePhoto
      : `data:image/png;base64,${user.profilePhoto}`
    : null;

    const unreadNotificationCount = notifications.filter((n) => {
  // must be unread
  if (n.isRead === true) return false;

  // must be logged-in user
  if (!user?._id) return false;

  // 1️⃣ Incoming follow request (receiver only)
  if (
    n.type === "followRequestIncoming" &&
    (n.toId === user._id || n.receiverId === user._id)
  ) {
    return true;
  }

  // 2️⃣ Like / Comment on YOUR post
  if (
    (n.type === "like" || n.type === "comment") &&
    n.postOwnerId === user._id
  ) {
    return true;
  }

  return false;
}).length;

  const navItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/messages", label: "Messages", icon: Mail },
    { path: "/notifications", label: "Notifications", icon: Bell },
  ];

  const dropdownItems = [
    { path: "/profile", label: "My Profile", icon: User, color: "text-amber-500 dark:text-amber-400" },
    { path: "/settings", label: "Settings", icon: Settings, color: darkMode ? "text-gray-300" : "text-gray-500" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
    setIsDropdownOpen(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logout()); // Remove user from redux & localStorage
    setShowLogoutDialog(false);
    navigate("/login"); // Redirect to login page
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleCompose = () => {
    // This will be handled by the CreateButton component
    // We'll just close the mobile menu if it's open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode 
      ? 'bg-black text-gray-100' 
      : 'bg-orange-50 text-gray-900'}`}>
      
      {/* Decorative background elements - Orange theme */}
      {!darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl bg-gradient-to-r from-orange-100/30 to-amber-100/30"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-l from-orange-200/20 to-amber-200/20"></div>
          <div className="absolute top-1/2 left-10 w-48 h-48 rounded-full blur-3xl bg-gradient-to-r from-amber-100/20 to-yellow-100/20"></div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCancelLogout}
          />
          
          {/* Dialog box */}
          <div className={`relative mx-4 p-6 rounded-xl w-full max-w-md shadow-2xl ${
            darkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900 border border-orange-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Logout Confirmation
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to logout from your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-900 hover:bg-gray-800 text-gray-200' 
                    : 'bg-orange-100 hover:bg-orange-200 text-amber-800 border border-orange-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        darkMode 
          ? 'border-gray-800 bg-black/95 shadow-lg shadow-black/20' 
          : 'border-orange-200/50 bg-white/90 shadow-sm'
      }`}>
        
        <div className="flex items-center justify-between px-4 py-3 md:px-8 max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
               <img src="public\logo.png" alt="D" className="size{24}" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Driftly
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-1">
  {navItems.slice(0, 4).map(({ path, label, icon: Icon }) => (
    <Link
      key={path}
      to={path}
      className={cn(
        "flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 group",
        isActive(path)
          ? darkMode 
            ? "text-amber-300 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50"
            : "text-amber-800 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 shadow-sm"
          : darkMode
            ? "text-gray-300 hover:text-amber-300 hover:bg-black/50 border border-transparent"
            : "text-amber-800/80 hover:text-amber-900 hover:bg-white/80"
      )}
      title={label}
    >
      <div className="relative">
        <Icon size={20} />

        {label === "Notifications" && unreadNotificationCount > 0 && (
          <span
            className="
              absolute -top-2 -right-2
              min-w-[18px] h-[18px]
              px-1
              rounded-full
              bg-red-500
              text-white
              text-xs
              font-bold
              flex items-center justify-center
            "
          >
            {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
          </span>
        )}
      </div>

      <span className="text-xs font-medium mt-1">
        {label}
      </span>
    </Link>
  ))}
</nav>

          {/* <nav className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 4).map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 group",
                  isActive(path)
                    ? darkMode 
                      ? "text-amber-300 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50"
                      : "text-amber-800 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 shadow-sm"
                    : darkMode
                      ? "text-gray-300 hover:text-amber-300 hover:bg-black/50 border border-transparent"
                      : "text-amber-800/80 hover:text-amber-900 hover:bg-white/80"
                )}
                title={label}
              >
                <Icon size={20} />
                <span className="text-xs font-medium mt-1">
                  {label}
                </span>
              </Link>
            ))}
          </nav> */}

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">

            

            {/* Profile Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={avatarRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className={`flex items-center gap-2 p-1 rounded-xl transition-all duration-300 group ${
                  darkMode
                    ? 'hover:bg-black/80 border border-transparent hover:border-gray-700'
                    : 'hover:bg-white/80 border border-transparent hover:border-orange-200'
                }`}
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                <div className={`flex w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center overflow-hidden font-bold text-lg hover:shadow-lg transition-all duration-300 border-2 ${
                  isDropdownOpen 
                    ? 'border-orange-500'
                    : darkMode 
                      ? 'border-amber-700 hover:border-amber-500'
                      : 'border-orange-300 hover:border-orange-500'
                }`}>
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user?.username || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${
                    darkMode ? 'text-gray-300' : 'text-amber-800'
                  }`}
                />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 top-16 w-64 z-50"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className={`relative rounded-xl shadow-xl overflow-hidden border ${
                    darkMode 
                      ? 'bg-black border-gray-800' 
                      : 'bg-white border-orange-200'
                  }`}>
                    
                    {/* User Info Section */}
                    <div className={`p-4 border-b ${
                      darkMode ? 'border-gray-800' : 'border-orange-100'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500">
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={user?.username || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-white text-xl font-bold">
                              {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {user?.name || user?.username}
                          </p>
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-amber-800/70'}`}>
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dropdown Items */}
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {dropdownItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleDropdownItemClick(item.path)}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${
                            darkMode
                              ? 'hover:bg-gray-900 text-gray-200 hover:text-amber-300'
                              : 'hover:bg-orange-50 text-amber-800 hover:text-amber-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-900' : 'bg-orange-100'
                          }`}>
                            <item.icon size={18} className={item.color} />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Logout Section */}
                    <div className={`p-4 border-t ${
                      darkMode 
                        ? 'border-gray-800 bg-black/50' 
                        : 'border-orange-100 bg-orange-50/50'
                    }`}>
                      <button
                        onClick={handleLogoutClick}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium transition-colors border ${
                          darkMode
                            ? 'bg-black border-gray-800 hover:border-red-700 text-gray-300 hover:text-red-400'
                            : 'bg-white border-orange-200 hover:border-orange-300 text-amber-800 hover:text-amber-900'
                        }`}
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                    
                    {/* Arrow pointing to avatar */}
                    <div className="absolute -top-2 right-4 w-4 h-4">
                      <div className={`w-4 h-4 rotate-45 border-t border-l ${
                        darkMode 
                          ? 'bg-black border-gray-800' 
                          : 'bg-white border-orange-200'
                      }`}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-all duration-300 ${
                darkMode
                  ? 'bg-black/80 hover:bg-black border-gray-800 text-gray-300'
                  : 'bg-white hover:bg-white border-orange-200 text-amber-800 hover:border-orange-300'
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t backdrop-blur-lg ${
            darkMode 
              ? 'border-gray-800 bg-black/95' 
              : 'border-orange-100 bg-white/95'
          }`}>
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                    isActive(path)
                      ? darkMode
                        ? "text-amber-300 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700"
                        : "text-amber-800 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 shadow-sm"
                      : darkMode
                        ? "text-gray-300 hover:text-amber-300 hover:bg-black border border-transparent"
                        : "text-amber-800/80 hover:text-amber-900 hover:bg-white/80"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              <div className={`px-4 py-3 rounded-xl mt-2 ${
                darkMode ? 'bg-black' : 'bg-orange-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={user?.username || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-lg font-bold">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {user?.name || user?.username}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-800/70'}`}>
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Profile Links */}
              {dropdownItems.slice(0, 3).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-amber-300 hover:bg-gray-900' 
                      : 'text-amber-800/80 hover:text-amber-900 hover:bg-orange-50'
                  }`}
                >
                  <item.icon size={20} className={item.color} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Logout */}
              <button
                onClick={handleLogoutClick}
                className={`flex items-center gap-4 px-4 py-3 mt-4 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-red-400 hover:bg-black' 
                    : 'text-amber-800/80 hover:text-amber-900 hover:bg-orange-50'
                }`}
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;