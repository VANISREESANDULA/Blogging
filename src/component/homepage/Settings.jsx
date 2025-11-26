import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Layout from "../ui/Layout";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Settings() {
  const [open, setOpen] = useState({
    passwords: false,
    saved: false,
    archive: false,
    privacy: false,
    blocked: false,
    help: false,
    about: false,
  });

  const navigate = useNavigate(); // Initialize navigate function

  const toggle = (key) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  // Logout function
  const handleLogout = () => {
    // Add any logout logic here (clear tokens, session, etc.)
    // For example:
    // localStorage.removeItem('authToken');
    // sessionStorage.clear();
    
    // Redirect to login page
    navigate('/login'); // Change '/login' to your actual login route
  };

  // Logout All Accounts function
  const handleLogoutAll = () => {
    // Add logic to logout from all accounts
    // Clear all authentication data
    
    // Redirect to login page
    navigate('/login'); // Change '/login' to your actual login route
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search here for more"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Account Details Section */}
        <h2 className="text-gray-500 text-sm mb-2">Your Account Details</h2>

        <div className="bg-gray-100 rounded-xl p-6 space-y-5">

          {/* Passwords */}
          <AccordionItem
            title="Passwords, Personal Details and Accounts"
            icon="👤"
            open={open.passwords}
            onClick={() => toggle("passwords")}
          />

          {/* Saved Info */}
          <AccordionItem
            title="Saved Info"
            icon="📁"
            open={open.saved}
            onClick={() => toggle("saved")}
          />

          {/* Archive */}
          <AccordionItem
            title="Archieve"
            icon="⏳"
            open={open.archive}
            onClick={() => toggle("archive")}
          />

          {/* Account Privacy */}
          <AccordionItem
            title="Account Privacy"
            icon="📞"
            open={open.privacy}
            onClick={() => toggle("privacy")}
          />

          {/* Blocked Accounts */}
          <AccordionItem
            title="Blocked Accounts"
            icon="🚫"
            open={open.blocked}
            onClick={() => toggle("blocked")}
          />
        </div>

        {/* More Info Section */}
        <h2 className="text-gray-500 text-sm mt-6 mb-2">More Information and Support</h2>
        <div className="bg-gray-100 rounded-xl p-6 space-y-5">

          <AccordionItem
            title="Help Section"
            icon="🧑‍💻"
            open={open.help}
            onClick={() => toggle("help")}
          />

          <AccordionItem
            title="About"
            icon="ℹ"
            open={open.about}
            onClick={() => toggle("about")}
          />
        </div>

        {/* Login Details */}
        <h2 className="text-gray-500 text-sm mt-6 mb-2">Login Details</h2>
        <div className="bg-gray-100 rounded-xl p-6 space-y-4">
          <p className="text-blue-600 cursor-pointer hover:underline">Add Account</p>
          
          {/* Updated logout buttons with onClick handlers */}
          <p 
            className="text-red-600 cursor-pointer hover:underline" 
            onClick={handleLogout}
          >
            Logout
          </p>
          
          <p 
            className="text-red-600 cursor-pointer hover:underline" 
            onClick={handleLogoutAll}
          >
            Logout All Accounts
          </p>
        </div>

      </div>
    </div>
    </Layout>
  );
}

function AccordionItem({ title, icon, open, onClick }) {
  return (
    <div className="flex justify-between items-center cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3 text-gray-700">
        <span className="text-2xl">{icon}</span>
        <span className="text-lg">{title}</span>
      </div>
      {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </div>
  );
}