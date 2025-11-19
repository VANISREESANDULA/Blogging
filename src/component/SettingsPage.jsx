import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function Settings() {
      const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    shares: true,
    messages: true,
  });

  const [privacy, setPrivacy] = useState({
    isPublic: true,
    allowMessages: true,
    showActivity: true,
    allowTagging: true,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">

          <aside><div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold text-purple-700">EveryTale</h1>
        </div>

        <div className="p-4 flex flex-col gap-4 text-gray-700">
          <button className="flex items-center gap-2 hover:text-purple-600" onClick={() => navigate("/home")}>
            <span>🏠</span> Home
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600" onClick={() => navigate("/SettingsPage")}>
            <span>👥</span> Add Friends
          </button>
        </div>
      </div></aside>
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="py-6 border-b">
        <h3 className="text-lg font-bold mb-4">Appearance</h3>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <div>
              <p className="font-semibold">Dark Mode</p>
              <p className="text-xs text-gray-500">
                {darkMode ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full flex items-center p-1 transition-all ${
              darkMode ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="py-6 border-b">
        <h3 className="text-lg font-bold mb-4">Notifications</h3>

        {Object.entries(notifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-3"
          >
            <div>
              <p className="font-semibold capitalize">{key}</p>
            </div>

            <button
              onClick={() => toggleNotification(key)}
              className={`w-12 h-7 rounded-full flex items-center p-1 transition-all ${
                value ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Privacy */}
      <div className="py-6 border-b">
        <h3 className="text-lg font-bold mb-4">Privacy & Security</h3>

        {Object.entries(privacy).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-3"
          >
            <p className="font-semibold capitalize">{key}</p>

            <button
              onClick={() => togglePrivacy(key)}
              className={`w-12 h-7 rounded-full flex items-center p-1 transition-all ${
                value ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}

        <button className="w-full mt-5 flex items-center justify-between p-4 border rounded-lg">
          <span>Change Password</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Account */}
      <div className="py-6 border-b">
        <h3 className="text-lg font-bold mb-4">Account</h3>

        <button className="w-full p-4 border rounded-lg flex justify-between mb-3">
          <span>Download Your Data</span>
          <ChevronRight size={18} />
        </button>

        <button className="w-full p-4 border rounded-lg flex justify-between">
          <span>Deactivate Account</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Logout */}
      <div className="py-6">
        <button className="w-full p-4 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2">
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          You can always sign back in anytime.
        </p>
      </div>
    </div>
  );
}

