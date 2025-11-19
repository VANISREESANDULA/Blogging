// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Moon, Sun, Menu, X } from "lucide-react";
// import {
//   Home,
//   Compass,
//   Mail,
//   Heart,
//   Bookmark,
//   User,
//   Settings as SettingsIcon,
// } from "lucide-react";

// const Layout = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//   const navItems = [
//   { path: "/home", label: "Home", icon: Home },
//     { path: "/explore", label: "Explore", icon: Compass },
//     { path: "/messages", label: "Messages", icon: Mail },
//     { path: "/notifications", label: "Notifications", icon: Heart },
//     { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
//     { path: "/profile", label: "Profile", icon: User },
//     { path: "/settings", label: "Settings", icon: SettingsIcon },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className={darkMode ? "dark" : ""}>
//       <div className="min-h-screen bg-background text-foreground">

//         {/* Header */}
//         <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
//           <div className="flex items-center justify-between px-4 py-3 md:px-6">

//             {/* Logo */}
//             <Link to="/home" className="flex items-center gap-2 font-bold text-2xl text-primary">
//               <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
//                 S
//               </div>
//               <span className="hidden sm:inline">Social</span>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-8">
//               {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
//                 <Link
//                   key={path}
//                   to={path}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
//                     isActive(path)
//                       ? "text-primary bg-primary/10"
//                       : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                   }`}
//                   title={label}
//                 >
//                   <Icon size={20} />
//                   <span className="text-sm font-medium">{label}</span>
//                 </Link>
//               ))}
//             </div>

//             {/* Right Actions */}
//             <div className="flex items-center gap-2 md:gap-4">

//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={toggleDarkMode}
//                 className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
//                 aria-label="Toggle dark mode"
//               >
//                 {darkMode ? (
//                   <Sun size={20} className="text-accent" />
//                 ) : (
//                   <Moon size={20} className="text-muted-foreground" />
//                 )}
//               </button>

//               {/* Profile Icon */}
//               <Link
//                 to="/profile"
//                 className="hidden sm:block w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow"
//               >
//                 U
//               </Link>

//               {/* Mobile Menu Toggle */}
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
//               >
//                 {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//               </button>

//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           {mobileMenuOpen && (
//             <div className="md:hidden border-t border-border bg-background">
//               <nav className="flex flex-col p-4 gap-2">
//                 {navItems.map(({ path, label, icon: Icon }) => (
//                   <Link
//                     key={path}
//                     to={path}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                       isActive(path)
//                         ? "text-primary bg-primary/10"
//                         : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                     }`}
//                   >
//                     <Icon size={20} />
//                     <span className="font-medium">{label}</span>
//                   </Link>
//                 ))}
//               </nav>
//             </div>
//           )}
//         </header>

//         {/* Main Content */}
//         <main className="min-h-[calc(100vh-64px)]">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
