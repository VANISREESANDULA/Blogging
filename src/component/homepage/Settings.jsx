import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Layout from "../ui/Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../redux/themeSlice";
import { setFont, setFontSize, getFontOptions, getFontSizeOptions } from "../redux/fontSlice";
import { logout } from "../redux/authslice";

export default function Settings() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = useSelector((state) => state.theme.isDark);
  const currentFont = useSelector((state) => state.font.currentFont);
  const currentFontSize = useSelector((state) => state.font.currentFontSize);
  const fontOptions = getFontOptions();
  const fontSizeOptions = getFontSizeOptions();

  // Get current user from auth state
  const currentUser = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState({
    appearance: false,
    passwords: false,
    saved: false,
    archive: false,
    privacy: false,
    blocked: false,
    help: false,
    about: false,
  });

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showAddAccountOptions, setShowAddAccountOptions] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  // Mock saved accounts - In real app, this would come from backend/storage
  const [savedAccounts] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com', avatar: '👤' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', avatar: '👩' },
    { id: 3, username: 'alex_jones', email: 'alex@example.com', avatar: '🧑' },
  ]);

  const toggle = (key) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());      // remove user from redux & localStorage
    setShowLogoutDialog(false);
    navigate("/login");      // redirect to login page
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleAddAccount = () => {
    setShowAddAccountOptions(!showAddAccountOptions);
  };

  const handleSwitchAccount = () => {
    setShowSwitchAccount(!showSwitchAccount);
  };

  const handleSelectAccount = (username) => {
    // In a real app, this would switch to that account
    alert(`Switched to account: ${username}`);
    setShowSwitchAccount(false);
  };

  const handleRemoveAccount = (username) => {
    // In a real app, this would remove the account from saved accounts
    alert(`Removed account: ${username}`);
  };

  const handleLoginToExisting = () => {
    navigate('/login');
  };

  const handleCreateNewAccount = () => {
    navigate('/register');
  };

  const handleThemeChange = (mode) => {
    dispatch(setThemeMode(mode));
  };

  const handleFontChange = (fontId) => {
    dispatch(setFont(fontId));
  };

  const handleFontSizeChange = (sizeId) => {
    dispatch(setFontSize(sizeId));
  };

  const settingsData = useMemo(() => [
    {
      id: "appearance",
      title: "Appearance Settings",
      icon: "🎨",
      category: "Appearance",
      keywords: ["appearance", "theme", "dark mode", "light mode", "font", "font size", "display", "look", "style"]
    },
    {
      id: "passwords",
      title: "Passwords, Personal Details and Accounts",
      icon: "👤",
      category: "Your Account Details",
      keywords: ["password", "security", "account", "personal", "details", "login", "credentials"]
    },
    {
      id: "saved",
      title: "Saved Info",
      icon: "📁",
      category: "Your Account Details",
      keywords: ["saved", "bookmarks", "favorites", "storage", "data", "information"]
    },
    {
      id: "archive",
      title: "Archive",
      icon: "⏳",
      category: "Your Account Details",
      keywords: ["archive", "history", "old", "past", "storage", "backup"]
    },
    {
      id: "privacy",
      title: "Account Privacy",
      icon: "🔒",
      category: "Your Account Details",
      keywords: ["privacy", "private", "security", "settings", "protection", "visibility"]
    },
    {
      id: "blocked",
      title: "Blocked Accounts",
      icon: "🚫",
      category: "Your Account Details",
      keywords: ["blocked", "block", "restrict", "ban", "users", "accounts"]
    },
    {
      id: "help",
      title: "Help Section",
      icon: "🧑‍💻",
      category: "More Information and Support",
      keywords: ["help", "support", "faq", "questions", "assistance", "guide"]
    },
    {
      id: "about",
      title: "About",
      icon: "ℹ️",
      category: "More Information and Support",
      keywords: ["about", "information", "version", "app", "details", "info"]
    }
  ], []);

  // Filter settings based on search query
  const filteredSettings = useMemo(() => {
    if (!searchQuery.trim()) return settingsData;

    const query = searchQuery.toLowerCase().trim();
    return settingsData.filter(setting => 
      setting.title.toLowerCase().includes(query) ||
      setting.keywords.some(keyword => keyword.includes(query)) ||
      setting.category.toLowerCase().includes(query)
    );
  }, [searchQuery, settingsData]);

  // Group filtered settings by category
  const groupedSettings = useMemo(() => {
    const groups = {};
    filteredSettings.forEach(setting => {
      if (!groups[setting.category]) {
        groups[setting.category] = [];
      }
      groups[setting.category].push(setting);
    });
    return groups;
  }, [filteredSettings]);

  return (
    <Layout>
      <div className={`w-full min-h-screen transition-colors duration-300 flex justify-center p-4 sm:p-6 ${isDark ? 'bg-black' : 'bg-orange-50'} relative ${showLogoutDialog ? 'overflow-hidden' : ''}`}>
        
        {/* Logout Confirmation Dialog - Positioned over the settings page */}
        {showLogoutDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop - settings page still visible behind */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={handleCancelLogout}
            />
            
            {/* Dialog box */}
            <div className={`relative mx-4 p-4 sm:p-6 rounded-xl w-full max-w-md transition-all duration-300 transform ${isDark ? 'bg-gray-900' : 'bg-orange-100'} shadow-2xl border ${isDark ? 'border-gray-700' : 'border-orange-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Logout Confirmation
              </h3>
              <p className={`mb-4 sm:mb-6 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to logout from your account?
              </p>
              <div className="flex justify-end gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                <button
                  onClick={handleCancelLogout}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none hover:bg-orange-500 hover:text-white ${
                    isDark 
                      ? 'bg-gray-800 text-gray-200' 
                      : 'bg-orange-100 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none hover:bg-red-600 ${
                    isDark 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Page Content */}
        <div className={`w-full max-w-4xl p-4 sm:p-6 rounded-2xl shadow-md transition-colors duration-300 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-orange-100'}`}>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search here for more"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-full border transition-colors duration-300 focus:outline-none text-sm sm:text-base hover:border-orange-500 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' 
                  : 'bg-white border-orange-300 text-black focus:border-orange-500'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className={`text-xs sm:text-sm mt-2 px-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Found {filteredSettings.length} result{filteredSettings.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Show message if no results found */}
          {searchQuery && filteredSettings.length === 0 && (
            <div className={`text-center py-6 sm:py-8 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'} text-sm sm:text-base`}>
              No settings found for "{searchQuery}"
            </div>
          )}

          {/* Appearance Section */}
          {groupedSettings["Appearance"] && (
            <>
              <h2 className={`text-xs sm:text-sm mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Appearance</h2>
              <div className={`rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-orange-100'}`}>
                {groupedSettings["Appearance"].map((setting) => (
                  <div key={setting.id}>
                    <AccordionItem
                      title={setting.title}
                      icon={setting.icon}
                      open={open[setting.id]}
                      onClick={() => toggle(setting.id)}
                      isDark={isDark}
                    />
                    
                    {/* Appearance Options - shown when accordion is open */}
                    {open[setting.id] && setting.id === "appearance" && (
                      <div className="ml-4 sm:ml-10 space-y-4 sm:space-y-6 animate-fadeIn mt-4">
                        {/* Theme Selection */}
                        <div className="space-y-3">
                          <h3 className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Theme</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <ThemeOption 
                              title="Light Mode" 
                              icon="☀️" 
                              description="Bright and clean"
                              isSelected={themeMode === "light"}
                              onClick={() => handleThemeChange("light")}
                              isDark={isDark}
                            />
                            <ThemeOption 
                              title="Dark Mode" 
                              icon="🌙" 
                              description="Easy on the eyes"
                              isSelected={themeMode === "dark"}
                              onClick={() => handleThemeChange("dark")}
                              isDark={isDark}
                            />
                            <ThemeOption 
                              title="System Default" 
                              icon="⚙️" 
                              description="Follow device setting"
                              isSelected={themeMode === "system"}
                              onClick={() => handleThemeChange("system")}
                              isDark={isDark}
                            />
                          </div>
                          <div className={`text-xs sm:text-sm px-2 py-1 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-orange-100 text-gray-600'}`}>
                            <span className="font-medium">Current:</span> {themeMode === "light" ? "Light Mode" : themeMode === "dark" ? "Dark Mode" : "System Default"}
                          </div>
                        </div>

                        {/* Font Selection */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Font Family</h3>
                          <div className={`rounded-lg border p-3 sm:p-4 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-orange-100 border-orange-300'}`}>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                              {fontOptions.map((font) => (
                                <div
                                  key={font.id}
                                  onClick={() => handleFontChange(font.id)}
                                  className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                    currentFont === font.id
                                      ? isDark
                                        ? 'bg-gray-600 border border-gray-500 hover:bg-orange-500 hover:text-white'
                                        : 'bg-orange-300 border border-orange-500 hover:bg-orange-500 hover:text-white'
                                      : isDark
                                      ? 'hover:bg-orange-500 hover:text-white border border-transparent'
                                      : 'hover:bg-orange-500 hover:text-white border border-transparent'
                                  }`}
                                  style={{ fontFamily: font.cssVariable }}
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div>
                                      <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {font.name}
                                      </p>
                                      <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        The quick brown fox jumps
                                      </p>
                                    </div>
                                  </div>
                                  {currentFont === font.id && (
                                    <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-orange-600 text-gray-200 hover:bg-orange-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                                      Active
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Font Size</h3>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                              {fontSizeOptions.map((size) => (
                                <button
                                  key={size.id}
                                  onClick={() => handleFontSizeChange(size.id)}
                                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[80px] sm:min-h-[90px] flex flex-col items-center justify-center ${
                                    currentFontSize === size.id
                                      ? isDark
                                        ? 'bg-gray-600 border-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-600'
                                        : 'bg-orange-300 border-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-600'
                                      : isDark
                                      ? 'bg-gray-700 border-gray-600 hover:border-orange-500 hover:bg-orange-500 hover:text-white'
                                      : 'bg-orange-200 border-orange-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white'
                                  }`}
                                >
                                  <p className={`text-xs font-medium transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {size.label}
                                  </p>
                                  <p className={`text-xl sm:text-2xl transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} style={{ fontSize: `${size.value * 1.5}rem` }}>
                                    Aa
                                  </p>
                                </button>
                              ))}
                            </div>
                            <div className={`text-xs sm:text-sm px-3 py-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-orange-100 text-gray-600'}`}>
                              <span className="font-medium">Current:</span> {fontSizeOptions.find(s => s.id === currentFontSize)?.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Account Details Section */}
          {groupedSettings["Your Account Details"] && (
            <>
              <h2 className={`text-xs sm:text-sm mt-4 sm:mt-6 mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Your Account Details</h2>
              <div className={`rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-orange-100'}`}>
                {groupedSettings["Your Account Details"].map((setting) => (
                  <div key={setting.id}>
                    <AccordionItem
                      title={setting.title}
                      icon={setting.icon}
                      open={open[setting.id]}
                      onClick={() => toggle(setting.id)}
                      isDark={isDark}
                    />
                    
                    {/* Passwords, Personal Details and Accounts Content */}
                    {open[setting.id] && setting.id === "passwords" && (
                      <div className="ml-4 sm:ml-10 mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fadeIn">
                        <div className={`space-y-3 sm:space-y-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {/* Password Settings */}
                          <div className="space-y-2 sm:space-y-3">
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Password Management</h3>
                            
                            <div className={`p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3 transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Keep your account secure by using a strong password. Change your password regularly to protect your account.
                              </p>
                              <button className={`w-full px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base hover:bg-orange-600 hover:text-white ${
                                isDark 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-orange-500 text-white'
                              }`}>
                                🔐 Change Password
                              </button>
                            </div>
                          </div>

                          {/* Personal Details */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Personal Details</h3>
                            
                            <div className={`space-y-2 sm:space-y-3 transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer`}>
                                <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>FULL NAME</p>
                                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {currentUser?.name || 'John Doe'}
                                </p>
                              </div>
                              
                              <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer`}>
                                <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>EMAIL ADDRESS</p>
                                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {currentUser?.email || 'john@example.com'}
                                </p>
                              </div>
                              
                              <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer`}>
                                <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>USERNAME</p>
                                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {currentUser?.username || 'john_doe'}
                                </p>
                              </div>
                              
                              <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer`}>
                                <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>PHONE NUMBER</p>
                                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {currentUser?.phone || '+1 (555) 123-4567'}
                                </p>
                              </div>
                              
                              <button className={`w-full px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base hover:bg-orange-600 hover:text-white ${
                                isDark 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-orange-500 text-white'
                              }`}>
                                ✏️ Edit Personal Details
                              </button>
                            </div>
                          </div>

                          {/* Linked Accounts */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Linked Accounts</h3>
                            
                            <div className={`space-y-2 transition-colors duration-300`}>
                              <div className={`p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">📱</span>
                                  <div>
                                    <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Google Account</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Connected</p>
                                  </div>
                                </div>
                                <button className={`text-xs px-2 sm:px-3 py-1 rounded transition-all duration-200 w-fit hover:bg-orange-600 hover:text-white ${
                                  isDark 
                                    ? 'bg-gray-600 text-gray-200' 
                                    : 'bg-orange-300 text-gray-900'
                                }`}>
                                  Disconnect
                                </button>
                              </div>
                              
                              <div className={`p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">📘</span>
                                  <div>
                                    <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Facebook Account</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Not Connected</p>
                                  </div>
                                </div>
                                <button className={`text-xs px-2 sm:px-3 py-1 rounded transition-all duration-200 w-fit hover:bg-orange-600 hover:text-white ${
                                  isDark 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-orange-500 text-white'
                                }`}>
                                  Connect
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Two-Factor Authentication */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Two-Factor Authentication</h3>
                            
                            <div className={`p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <div>
                                <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Enable 2FA</p>
                                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Add an extra layer of security to your account</p>
                              </div>
                              <div className="w-fit">
                                <ToggleSwitch 
                                  isOn={false}
                                  onToggle={() => alert("2FA settings would open here")}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Sessions */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Active Sessions</h3>
                            
                            <div className={`space-y-2 transition-colors duration-300`}>
                              <div className={`p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">💻</span>
                                  <div>
                                    <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Chrome on Windows</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Current session · Last active 2 min ago</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className={`p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">📱</span>
                                  <div>
                                    <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Safari on iPhone</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Last active 5 hours ago</p>
                                  </div>
                                </div>
                                <button className={`text-xs px-2 sm:px-3 py-1 rounded transition-all duration-200 w-fit hover:bg-orange-600 hover:text-white ${
                                  isDark 
                                    ? 'bg-gray-600 text-gray-200' 
                                    : 'bg-orange-300 text-gray-900'
                                }`}>
                                  Logout
                                </button>
                              </div>
                            </div>
                            
                            <button className={`w-full px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base text-red-500 border border-red-500 hover:bg-red-500 hover:text-white`}>
                              🚪 Logout All Other Sessions
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Account Privacy Content - shown when accordion is open */}
                    {open[setting.id] && setting.id === "privacy" && (
                      <div className="ml-4 sm:ml-10 space-y-4 sm:space-y-6 animate-fadeIn mt-4">
                        <h2 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Account privacy</h2>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-3 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">
                            <h3 className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Private account</h3>
                            <ToggleSwitch 
                              isOn={isPrivateAccount}
                              onToggle={() => setIsPrivateAccount(!isPrivateAccount)}
                            />
                          </div>
                          
                          <div className={`space-y-2 text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <p>
                              When your account is public, your profile and posts can be seen by anyone, 
                              on or off Instagram, even if they don't have an Instagram account.
                            </p>
                            <p>
                              When your account is private, only the followers that you approve can see what you share, 
                              including your photos or videos on hashtag and location pages, and your followers and 
                              following lists. Certain info on your profile, such as your profile picture and username, 
                              is visible to everyone on and off Instagram.{" "}
                              <span className="text-orange-600 cursor-pointer hover:text-orange-700">Learn more</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* More Info Section */}
          {groupedSettings["More Information and Support"] && (
            <>
              <h2 className={`text-xs sm:text-sm mt-4 sm:mt-6 mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>More Information and Support</h2>
              <div className={`rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-orange-100'}`}>
                {groupedSettings["More Information and Support"].map((setting) => (
                  <div key={setting.id}>
                    <AccordionItem
                      title={setting.title}
                      icon={setting.icon}
                      open={open[setting.id]}
                      onClick={() => toggle(setting.id)}
                      isDark={isDark}
                    />
                    
                    {/* Help Section Content */}
                    {open[setting.id] && setting.id === "help" && (
                      <div className="ml-4 sm:ml-10 mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fadeIn">
                        <div className={`space-y-3 sm:space-y-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {/* FAQ Section */}
                          <div className="space-y-2 sm:space-y-3">
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Frequently Asked Questions</h3>
                            
                            <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`font-medium text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>How do I create a post?</p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Click the "Create" button on the home page, add your content, images, or text, and publish. Your post will be visible to your followers based on your account privacy settings.
                              </p>
                            </div>
                            
                            <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`font-medium text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>How do I change my theme?</p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Go to Settings → Appearance Settings. Select between Light Mode, Dark Mode, or System Default theme. Your preference will be saved automatically.
                              </p>
                            </div>
                            
                            <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`font-medium text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Can I customize fonts?</p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Yes! Go to Settings → Appearance Settings. Choose from 15 different Google Fonts and adjust the font size from 5 predefined options to suit your preference.
                              </p>
                            </div>

                            <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`font-medium text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>How do I bookmark posts?</p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Click the bookmark icon on any post to save it to your Bookmarks. You can access all your saved posts from the Bookmarks section in the navigation menu.
                              </p>
                            </div>

                            <div className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              <p className={`font-medium text-sm sm:text-base mb-1 sm:mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>How do I manage my privacy?</p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Go to Settings → Account Privacy. Choose between a public account (visible to everyone) or private account (only followers can see your posts).
                              </p>
                            </div>
                          </div>

                          {/* Support Resources */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Need More Help?</h3>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                ✉️ <span className="font-medium">Email Support:</span> support@bloggingapp.com
                              </p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                📱 <span className="font-medium">Twitter:</span> @BloggingApp
                              </p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                🔗 <span className="font-medium">Website:</span> www.bloggingapp.com/help
                              </p>
                            </div>
                          </div>

                          {/* Tips & Tricks */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Quick Tips</h3>
                            
                            <ul className={`text-xs sm:text-sm space-y-1 sm:space-y-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">💡 Use hashtags to make your posts discoverable</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">💡 Reply to comments to engage with your community</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">💡 Check Notifications regularly to stay updated</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">💡 Explore trending posts to discover new creators</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">💡 Message friends using the Messages section</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Section Content */}
                    {open[setting.id] && setting.id === "about" && (
                      <div className="ml-4 sm:ml-10 mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fadeIn">
                        <div className={`space-y-3 sm:space-y-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {/* App Information */}
                          <div className="space-y-2 sm:space-y-3">
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>About Blogging App</h3>
                            
                            <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Welcome to Blogging App, your ultimate platform for sharing your thoughts, stories, and ideas with the world. 
                              Connect with like-minded creators, discover inspiring content, and build your community.
                            </p>
                          </div>

                          {/* Version Info */}
                          <div className={`p-3 sm:p-4 rounded-lg transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                            <div className="space-y-1 sm:space-y-2">
                              <div className="flex justify-between">
                                <span className={`font-medium text-sm transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>App Version</span>
                                <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>1.0.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`font-medium text-sm transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Build</span>
                                <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>2025.11.29</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`font-medium text-sm transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Status</span>
                                <span className={`text-green-500 text-sm`}>Active</span>
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Key Features</h3>
                            
                            <ul className={`text-xs sm:text-sm space-y-1 sm:space-y-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Create and share unlimited posts</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Customize your profile and appearance</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Engage with community through likes and comments</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Bookmark your favorite posts</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Private messaging with friends</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Explore trending content and creators</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Personalized notifications</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ 15+ Font options and 5 size adjustments</li>
                              <li className="p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer">✨ Dark and Light theme support</li>
                            </ul>
                          </div>

                          {/* Technology Stack */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Built With</h3>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                🚀 <span className="font-medium">Frontend:</span> React 19 + Redux Toolkit + Tailwind CSS
                              </p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                🎨 <span className="font-medium">UI Components:</span> Lucide React Icons
                              </p>
                              <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                📱 <span className="font-medium">Fonts:</span> Google Fonts Integration
                              </p>
                            </div>
                          </div>

                          {/* Legal & Links */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Legal & Resources</h3>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <p className={`text-xs sm:text-sm cursor-pointer hover:text-orange-500 transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                📋 <span className="font-medium">Terms of Service</span>
                              </p>
                              <p className={`text-xs sm:text-sm cursor-pointer hover:text-orange-500 transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                🔒 <span className="font-medium">Privacy Policy</span>
                              </p>
                              <p className={`text-xs sm:text-sm cursor-pointer hover:text-orange-500 transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                ⚖️ <span className="font-medium">Community Guidelines</span>
                              </p>
                            </div>
                          </div>

                          {/* Credits */}
                          <div className="space-y-2 sm:space-y-3 pt-2 border-t" style={{borderColor: isDark ? '#4B5563' : '#FDBA74'}}>
                            <h3 className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Credits</h3>
                            
                            <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Blogging App © 2025. All rights reserved.
                            </p>
                            <p className={`text-xs sm:text-sm transition-colors duration-300 p-2 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Made with ❤️ by the Blogging App Team
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Login Details - Always show this section */}
          <h2 className={`text-xs sm:text-sm mt-4 sm:mt-6 mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Login Details</h2>
          <div className={`rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-orange-100'}`}>
            {/* Current Account */}
            <div>
              <p className={`text-xs font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>CURRENT ACCOUNT</p>
              <div className={`p-2 sm:p-3 rounded-lg flex items-center justify-between transition-colors duration-300 hover:bg-orange-500 hover:text-white cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-orange-100'}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">👤</span>
                  <div>
                    <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {currentUser?.username || 'john_doe'}
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentUser?.email || 'john@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Account */}
            <div>
              <p 
                className={`text-orange-600 cursor-pointer mb-2 flex items-center gap-2 text-sm sm:text-base p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 ${
                  isDark ? 'hover:bg-orange-500 hover:text-white' : ''
                }`}
                onClick={handleAddAccount}
              >
                <span>➕</span>
                Add Account
              </p>
              
              {/* Add Account Options - shown when Add Account is clicked */}
              {showAddAccountOptions && (
                <div className={`ml-3 sm:ml-4 space-y-2 sm:space-y-3 animate-fadeIn border-l-2 pl-3 sm:pl-4 py-2 transition-colors duration-300 ${isDark ? 'border-gray-600' : 'border-orange-300'}`}>
                  <p 
                    className="text-orange-600 cursor-pointer hover:text-orange-700 flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                    onClick={handleLoginToExisting}
                  >
                    <span>🔑</span>
                    Log into existing account
                  </p>
                  <p 
                    className="text-orange-600 cursor-pointer hover:text-orange-700 flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                    onClick={handleCreateNewAccount}
                  >
                    <span>✨</span>
                    Create new account
                  </p>
                </div>
              )}
            </div>
            
            <p 
              className={`text-red-600 cursor-pointer flex items-center gap-2 text-sm sm:text-base p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ${
                isDark ? 'hover:bg-red-500 hover:text-white' : ''
              }`} 
              onClick={handleLogoutClick}
            >
              <span>🚪</span>
              Logout
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AccordionItem({ title, icon, open, onClick, isDark }) {
  return (
    <div 
      className={`flex justify-between items-center cursor-pointer transition-all duration-300 rounded-lg p-2 sm:p-3 ${
        isDark 
          ? 'text-gray-300 hover:bg-orange-500 hover:text-white' 
          : 'text-gray-700 hover:bg-orange-500 hover:text-white'
      }`} 
      onClick={onClick}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="text-sm sm:text-lg">{title}</span>
      </div>
      {open ? <ChevronUp size={18} className="sm:w-5 sm:h-5" /> : <ChevronDown size={18} className="sm:w-5 sm:h-5" />}
    </div>
  );
}

function ThemeOption({ title, icon, description, isSelected, onClick, isDark }) {
  return (
    <div 
      onClick={onClick}
      className={`text-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] ${
        isSelected 
          ? isDark
            ? 'border-orange-500 bg-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-600'
            : 'border-orange-500 bg-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-600'
          : isDark
          ? 'border-gray-600 hover:border-orange-500 hover:bg-orange-500 hover:text-white'
          : 'border-orange-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white'
      }`}
    >
      <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
      <h4 className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
        isSelected && !isDark ? 'text-gray-800' : isDark ? 'text-gray-200' : 'text-gray-800'
      }`}>{title}</h4>
      <p className={`text-xs sm:text-sm mt-1 transition-colors duration-300 ${
        isSelected && !isDark ? 'text-gray-600' : isDark ? 'text-gray-300' : 'text-gray-500'
      }`}>{description}</p>
      {isSelected && (
        <div className="mt-2 text-xs px-2 py-1 rounded-full bg-orange-500 text-white">
          Selected
        </div>
      )}
    </div>
  );
}

// Toggle Switch Component for Private Account
function ToggleSwitch({ isOn, onToggle }) {
  return (
    <div
      className={`w-10 sm:w-12 h-5 sm:h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors hover:bg-orange-600 ${
        isOn ? 'bg-orange-500' : 'bg-gray-300'
      }`}
      onClick={onToggle}
    >
      <div
        className={`bg-white w-3 sm:w-4 h-3 sm:h-4 rounded-full shadow-md transform transition-transform ${
          isOn ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
}