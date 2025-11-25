// import React, { useState } from "react";
// import Layout from "../ui/Layout";

// import {
//   ChevronDown,
//   Search,
//   Lock,
//   Bell,
//   Eye,
//   LogOut,
//   HelpCircle,
//   Info,
//   Plus,
//   Moon,
//   Sun,
//   Settings as SettingsIcon,
// } from "lucide-react";

// const Settings = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [expandedSections, setExpandedSections] = useState(["account-details"]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//   const toggleSection = (sectionId) => {
//     setExpandedSections((prev) =>
//       prev.includes(sectionId)
//         ? prev.filter((id) => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   const accountSections = [
//     {
//       id: "account-details",
//       title: "Your Account Details",
//       items: [
//         { id: "passwords", label: "Passwords · Personal Details and Accounts" },
//         { id: "saved-info", label: "Saved Info" },
//         { id: "archive", label: "Archive" },
//         { id: "privacy", label: "Account Privacy" },
//         { id: "blocked", label: "Blocked Accounts" },
//       ],
//     },
//     {
//       id: "support",
//       title: "More Information and Support",
//       items: [
//         { id: "help", label: "Help Section" },
//         { id: "about", label: "About" },
//       ],
//     },
//   ];

//   return (
//     <Layout>
//       <div className="max-w-2xl mx-auto">

//         {/* Header with Search */}
//         <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-4 sm:px-6 py-6">
//           <div className="relative">
//             <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
//             <input
//               type="text"
//               placeholder="Search here for more"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
//             />
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="px-4 sm:px-6 py-6 space-y-6">

//           {/* Dark Mode */}
//           <div className="bg-secondary/50 rounded-2xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 {darkMode ? (
//                   <Moon size={20} className="text-accent" />
//                 ) : (
//                   <Sun size={20} className="text-warning" />
//                 )}
//                 <h3 className="font-semibold text-foreground">Dark Mode</h3>
//               </div>

//               <button
//                 onClick={toggleDarkMode}
//                 className={`w-12 h-7 rounded-full transition-all flex items-center p-1 ${
//                   darkMode ? "bg-primary" : "bg-muted"
//                 }`}
//               >
//                 <div
//                   className={`w-5 h-5 rounded-full bg-white transition-transform ${
//                     darkMode ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Collapsible Sections */}
//           {accountSections.map((section) => {
//             const isExpanded = expandedSections.includes(section.id);

//             return (
//               <div key={section.id}>
//                 <button
//                   onClick={() => toggleSection(section.id)}
//                   className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors text-left"
//                 >
//                   <span className="font-semibold text-foreground">{section.title}</span>
//                   <ChevronDown
//                     size={20}
//                     className={`text-muted-foreground transition-transform ${
//                       isExpanded ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {isExpanded && section.items && (
//                   <div className="mt-2 space-y-2 ml-2 border-l-2 border-border pl-4">
//                     {section.items.map((item) => (
//                       <button
//                         key={item.id}
//                         className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground flex items-center justify-between group"
//                       >
//                         <span className="text-sm">{item.label}</span>
//                         <ChevronDown
//                           size={16}
//                           className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -rotate-90"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Bookmarks */}
//           <div>
//             <button
//               onClick={() => toggleSection("bookmarks")}
//               className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors text-left"
//             >
//               <span className="font-semibold text-foreground">Bookmarks</span>
//               <ChevronDown
//                 size={20}
//                 className={`text-muted-foreground transition-transform ${
//                   expandedSections.includes("bookmarks") ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {expandedSections.includes("bookmarks") && (
//               <div className="mt-2 ml-2 border-l-2 border-border pl-4">
//                 <div className="flex items-center justify-between px-4 py-8 text-center">
//                   <div className="text-center w-full">
//                     <div className="text-4xl mb-2">📑</div>
//                     <p className="text-muted-foreground text-sm">
//                       No bookmarked posts yet. Save posts you want to read later!
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Login Details */}
//           <div className="border-t border-border pt-6">
//             <h3 className="font-semibold text-foreground mb-4 text-sm">Login Details</h3>

//             <div className="space-y-3">

//               <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-primary font-semibold">
//                 <Plus size={18} />
//                 Add Account
//               </button>

//               <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-destructive font-semibold">
//                 <LogOut size={18} />
//                 Logout
//               </button>

//               <button className="w-full px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left flex items-center gap-2 text-destructive font-semibold">
//                 <LogOut size={18} />
//                 Logout All Accounts
//               </button>

//             </div>
//           </div>

//           <div className="h-8" />
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Settings;


import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Layout from "../ui/Layout";

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

  const toggle = (key) => {
    setOpen({ ...open, [key]: !open[key] });
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
            icon="ℹ️"
            open={open.about}
            onClick={() => toggle("about")}
          />
        </div>

        {/* Login Details */}
        <h2 className="text-gray-500 text-sm mt-6 mb-2">Login Details</h2>
        <div className="bg-gray-100 rounded-xl p-6 space-y-4">

          <p className="text-blue-600 cursor-pointer hover:underline">Add Account</p>
          <p className="text-red-600 cursor-pointer hover:underline">Logout</p>
          <p className="text-red-600 cursor-pointer hover:underline">
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
