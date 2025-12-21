// import React, { useState, useMemo } from "react";
// import Layout from "../ui/Layout";
// import { Heart, MessageCircle,UserPlus,AtSign,Bell,Search, Check,X,Clock,User,ExternalLink,Filter,
//   MoreVertical, UserCheck, UserX,Send, Users,ThumbsUp,MessageSquare,Hash, AlertCircle,} from "lucide-react";

// import { useSelector, useDispatch } from "react-redux";
// import {
//   sendFollowRequest,
//   acceptFollowRequest,
//   rejectFollowRequest,
// } from "../redux/authslice";

// // ---------------------------------------------------------------
// // TIME FORMATTER
// // ---------------------------------------------------------------
// const formatTime = (timestamp) => {
//   const diff = Date.now() - new Date(timestamp);
//   const mins = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);
//   if (days > 0) return `${days}d ago`;
//   if (hours > 0) return `${hours}h ago`;
//   if (mins > 0) return `${mins}m ago`;
//   return "Just now";
// };

// // ---------------------------------------------------------------
// // ICONS FOR NOTIFICATION TYPE
// // ---------------------------------------------------------------
// const getIcon = (type) => {
//   switch (type) {
//     case "like":
//       return <Heart size={18} className="text-pink-500" />;
//     case "comment":
//       return <MessageCircle size={18} className="text-blue-500" />;
//     case "mention":
//       return <AtSign size={18} className="text-cyan-500" />;
//     case "followRequestIncoming":
//     case "followRequestSent":
//     case "followRequestAccepted":
//     case "followRequestRejected":
//       return <UserPlus size={18} className="text-green-500" />;
//     default:
//       return <Bell size={18} className="text-purple-500" />;
//   }
// };

// // ---------------------------------------------------------------
// // NOTIFICATION ITEM COMPONENT
// // ---------------------------------------------------------------
// const NotificationItem = ({ n, isDark, onAction }) => {
//   const getIcon = (type) => {
//     switch (type) {
//       case "like":
//         return { icon: <ThumbsUp size={16} />, color: "bg-gradient-to-r from-pink-500 to-rose-500", textColor: "text-pink-600" };
//       case "comment":
//         return { icon: <MessageSquare size={16} />, color: "bg-gradient-to-r from-blue-500 to-cyan-500", textColor: "text-blue-600" };
//       case "mention":
//         return { icon: <Hash size={16} />, color: "bg-gradient-to-r from-cyan-500 to-teal-500", textColor: "text-cyan-600" };
//       case "followRequestIncoming":
//         return { icon: <UserPlus size={16} />, color: "bg-gradient-to-r from-green-500 to-emerald-500", textColor: "text-green-600" };
//       case "followRequestSent":
//         return { icon: <Send size={16} />, color: "bg-gradient-to-r from-orange-500 to-amber-500", textColor: "text-orange-600" };
//       case "followRequestAccepted":
//         return { icon: <UserCheck size={16} />, color: "bg-gradient-to-r from-emerald-500 to-green-500", textColor: "text-emerald-600" };
//       case "followRequestRejected":
//         return { icon: <UserX size={16} />, color: "bg-gradient-to-r from-red-500 to-rose-500", textColor: "text-red-600" };
//       default:
//         return { icon: <Bell size={16} />, color: "bg-gradient-to-r from-purple-500 to-violet-500", textColor: "text-purple-600" };
//     }
//   };

//   const iconConfig = getIcon(n.type);
//   const avatarLetter = n.username?.charAt(0)?.toUpperCase() || "U";

//   return (
//     <div
//       className={`p-4 rounded-xl mb-3 transition-all duration-300 hover:scale-[1.02] ${
//         isDark
//           ? "bg-gray-800 border border-gray-700 hover:border-gray-600"
//           : "bg-white border border-orange-200 hover:border-orange-300 shadow-sm"
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         {/* Avatar with Icon */}
//         <div className="relative shrink-0">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${iconConfig.color}`}>
//             {avatarLetter}
//           </div>
//           <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${isDark ? "border-gray-800" : "border-white"} ${iconConfig.color} flex items-center justify-center`}>
//             {iconConfig.icon}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div className="flex-1">
//               <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"} mb-1`}>
//                 {n.message}
//               </p>
//               <div className="flex items-center gap-3">
//                 <span className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-400" : "text-orange-600"}`}>
//                   <Clock size={12} />
//                   {formatTime(n.createdAt)}
//                 </span>
//                 <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-orange-100 text-orange-700"}`}>
//                   {n.type.replace('followRequest', '').replace(/([A-Z])/g, ' $1').trim() || n.type}
//                 </span>
//               </div>
//             </div>

//             {/* Actions */}
//             {n.type === "followRequestIncoming" && (
//               <div className="flex gap-2 shrink-0">
//                 <button
//                   className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
//                   onClick={() => onAction('accept', n)}
//                   title="Accept"
//                 >
//                   <Check size={16} />
//                 </button>
//                 <button
//                   className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
//                   onClick={() => onAction('reject', n)}
//                   title="Reject"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
            
//             {/* View Action for other notifications */}
//             {n.type !== "followRequestIncoming" && (
//               <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}>
//                 <ExternalLink size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------------
// // MAIN COMPONENT
// // ---------------------------------------------------------------
// export default function Notifications() {
//   const dispatch = useDispatch();
//   const isDark = useSelector((s) => s.theme?.isDark);

//   // REAL notifications from Redux:
//   const notifications = useSelector((s) => s.notifications.all);

//   // FOLLOW SECTION FROM REDUX
//   const follows = useSelector((s) => s.notifications.follows);
//   const incoming = follows.followRequestIncoming || [];
//   const sent = follows.followRequestSent || [];
//   const accepted = follows.followRequestAccepted || [];
//   const rejected = follows.followRequestRejected || [];

//   // Get user data for username resolution
//   const currentUser = useSelector((s) => s.auth.user);
//   const followers = useSelector((s) => s.auth.followers) || [];
//   const following = useSelector((s) => s.auth.following) || [];

//   const [activeFilter, setActiveFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [username, setUsername] = useState("");
//   const [viewMode, setViewMode] = useState("list"); // list or grid

//   // Function to get username from ID
//   const getUsernameFromId = (userId) => {
//     if (!userId) return "Unknown User";
    
//     // Check in followers
//     const follower = followers.find(f => f.id === userId || f._id === userId);
//     if (follower) return follower.username || follower.name || "User";
    
//     // Check in following
//     const followingUser = following.find(f => f.id === userId || f._id === userId);
//     if (followingUser) return followingUser.username || followingUser.name || "User";
    
//     // Check if it's the current user
//     if (currentUser && (currentUser.id === userId || currentUser._id === userId)) {
//       return currentUser.username || currentUser.name || "You";
//     }
    
//     // Return default
//     return "User";
//   };

//   // Process notifications to replace IDs with usernames
//   const processedNotifications = useMemo(() => {
//     return notifications.map(notification => {
//       const username = getUsernameFromId(notification.fromId || notification.senderId || notification.userId);
      
//       // Create a processed message
//       let processedMessage = notification.message || "";
      
//       // Replace IDs with usernames in the message
//       if (notification.fromId) {
//         const userIdRegex = new RegExp(notification.fromId, 'g');
//         processedMessage = processedMessage.replace(userIdRegex, username);
//       }
      
//       // For like/comment notifications, create a user-friendly message
//       if (!processedMessage && notification.type === 'like') {
//         processedMessage = `${username} liked your post`;
//       } else if (!processedMessage && notification.type === 'comment') {
//         processedMessage = `${username} commented on your post`;
//       } else if (!processedMessage && notification.type === 'mention') {
//         processedMessage = `${username} mentioned you in a post`;
//       }
      
//       return {
//         ...notification,
//         message: processedMessage,
//         username: username // Add username field for easy access
//       };
//     });
//   }, [notifications, followers, following, currentUser]);

//   // Process follow requests to ensure they have proper usernames
//   const processedIncoming = useMemo(() => {
//     return incoming.map(req => {
//       const username = getUsernameFromId(req.fromId || req.senderId);
//       return {
//         ...req,
//         type: "followRequestIncoming",
//         // message: req.message || `${username} wants to follow you`,
//         username: username,
//         from: username // Ensure 'from' field has username
//       };
//     });
//   }, [incoming, followers, following, currentUser]);

//   const processedSent = useMemo(() => {
//     return sent.map(req => {
//       const username = getUsernameFromId(req.toId || req.receiverId);
//       return {
//         ...req,
//         type: "followRequestSent",
//         // message: req.message || `Follow request sent to ${username}`,
//         username: username,
//         to: username
//       };
//     });
//   }, [sent, followers, following, currentUser]);

//   const processedAccepted = useMemo(() => {
//     return accepted.map(req => {
//       const username = getUsernameFromId(req.fromId || req.senderId);
//       return {
//         ...req,
//         type: "followRequestAccepted",
//         // message: req.message || `${username} accepted your follow request`,
//         username: username,
//         from: username
//       };
//     });
//   }, [accepted, followers, following, currentUser]);

//   const processedRejected = useMemo(() => {
//     return rejected.map(req => {
//       const username = getUsernameFromId(req.fromId || req.senderId);
//       return {
//         ...req,
//         type: "followRequestRejected",
//         // message: req.message || `${username} declined your follow request`,
//         username: username,
//         from: username
//       };
//     });
//   }, [rejected, followers, following, currentUser]);

//   // Combine all notifications for the "All" tab
//   // const allNotifications = useMemo(() => [
//   //   ...processedIncoming,
//   //   ...processedSent,
//   //   ...processedAccepted,
//   //   ...processedRejected,
//   //   ...processedNotifications,
//   // ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [
//   //   processedIncoming, processedSent, processedAccepted, processedRejected, processedNotifications
//   // ]);
//   const allNotifications = useMemo(() => {
//   return processedNotifications.sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );
// }, [processedNotifications]);


//   // Filter notifications based on active tab and search query
//   // const filteredNotifications = useMemo(() => {
//   //   let filtered = allNotifications;
    
//   //   // Filter by tab
//   //   if (activeFilter === "follow") {
//   //     filtered = filtered.filter(n => [
//   //       "followRequestIncoming",
//   //       "followRequestSent",
//   //       "followRequestAccepted",
//   //       "followRequestRejected"
//   //     ].includes(n.type));
//   //   } else if (activeFilter !== "all") {
//   //     filtered = filtered.filter(n => n.type === activeFilter);
//   //   }
    
//   //   // Filter by search query
//   //   if (searchQuery.trim()) {
//   //     const query = searchQuery.toLowerCase();
//   //     filtered = filtered.filter(n => 
//   //       n.message?.toLowerCase().includes(query) ||
//   //       n.username?.toLowerCase().includes(query)
//   //     );
//   //   }
    
//   //   return filtered;
//   // }, [allNotifications, activeFilter, searchQuery]);
//   const filteredNotifications = useMemo(() => {
//   let filtered = processedNotifications;

//   if (activeFilter === "follow") {
//     filtered = filtered.filter(n =>
//       n.type.startsWith("followRequest")
//     );
//   } else if (activeFilter !== "all") {
//     filtered = filtered.filter(n => n.type === activeFilter);
//   }

//   if (searchQuery.trim()) {
//     const q = searchQuery.toLowerCase();
//     filtered = filtered.filter(n =>
//       n.message?.toLowerCase().includes(q) ||
//       n.username?.toLowerCase().includes(q)
//     );
//   }

//   return filtered;
// }, [processedNotifications, activeFilter, searchQuery]);


//   const handleNotificationAction = (action, notification) => {
//     switch(action) {
//       case 'accept':
//         dispatch(
//           acceptFollowRequest({
//             followerId: notification.fromId || notification.senderId,
//             // from: notification.username || notification.from
//           })
//         );
//         break;
//       case 'reject':
//         dispatch(rejectFollowRequest(notification.fromId || notification.senderId));
//         break;
//       default:
//         break;
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { key: "all", label: "All", icon: <Bell size={16} />, color: "from-purple-500 to-violet-500" },
//     { key: "like", label: "Likes", icon: <Heart size={16} />, color: "from-pink-500 to-rose-500" },
//     { key: "comment", label: "Comments", icon: <MessageCircle size={16} />, color: "from-blue-500 to-cyan-500" },
//     { key: "follow", label: "Follows", icon: <UserPlus size={16} />, color: "from-green-500 to-emerald-500" },
//     { key: "mention", label: "Mentions", icon: <AtSign size={16} />, color: "from-cyan-500 to-teal-500" },
//   ];

//   // const getNotificationStats = () => {
//   //   const stats = {
//   //     all: allNotifications.length,
//   //     like: processedNotifications.filter(n => n.type === 'like').length,
//   //     comment: processedNotifications.filter(n => n.type === 'comment').length,
//   //     mention: processedNotifications.filter(n => n.type === 'mention').length,
//   //     follow: processedIncoming.length + processedSent.length + processedAccepted.length + processedRejected.length
//   //   };
//   //   return stats;
//   // };
// const getNotificationStats = () => ({
//   all: processedNotifications.length,
//   like: processedNotifications.filter(n => n.type === "like").length,
//   comment: processedNotifications.filter(n => n.type === "comment").length,
//   mention: processedNotifications.filter(n => n.type === "mention").length,
//   follow: processedNotifications.filter(n =>
//     n.type.startsWith("followRequest")
//   ).length,
// });

//   const stats = getNotificationStats();

//   return (
//     <Layout>
//       <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-orange-50"}`}>
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
//               <div>
//                 <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
//                   Notifications
//                 </h1>
//                 <p className={`text-base ${isDark ? "text-gray-400" : "text-orange-800/70"}`}>
//                   Stay updated with your social activity and connections
//                 </p>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 {/* View Toggle */}
//                 <div className={`p-1 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-orange-200"}`}>
//                   <button
//                     onClick={() => setViewMode("list")}
//                     className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
//                       viewMode === "list" 
//                         ? isDark ? "bg-gray-700 text-white" : "bg-orange-100 text-orange-700"
//                         : isDark ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     List
//                   </button>
//                   <button
//                     onClick={() => setViewMode("grid")}
//                     className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
//                       viewMode === "grid" 
//                         ? isDark ? "bg-gray-700 text-white" : "bg-orange-100 text-orange-700"
//                         : isDark ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     Grid
//                   </button>
//                 </div>
                
//                 {/* Mark All as Read */}
//                 <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-50 text-gray-700 border border-orange-200"}`}>
//                   Mark all as read
//                 </button>
//               </div>
//             </div>

//             {/* Stats Overview */}
//             <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 mb-8`}>
//               {tabs.map(tab => (
//                 <div 
//                   key={tab.key}
//                   onClick={() => setActiveFilter(tab.key)}
//                   className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
//                     activeFilter === tab.key
//                       ? isDark ? "border-gray-600 bg-gray-800" : "border-orange-300 bg-white shadow-lg"
//                       : isDark ? "border-gray-700 bg-gray-800/50 hover:bg-gray-800" : "border-orange-200 bg-white/50 hover:bg-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tab.color} flex items-center justify-center`}>
//                       {tab.icon}
//                     </div>
//                     <span className={`text-2xl font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                       {stats[tab.key] || 0}
//                     </span>
//                   </div>
//                   <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                     {tab.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="grid lg:grid-cols-3 gap-6">
//             {/* Left Column - Filters and Send Request */}
//             <div className="lg:col-span-1">
//               {/* Search Bar */}
//               <div className={`p-4 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"} mb-4`}>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     placeholder="Search notifications..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className={`w-full pl-10 pr-4 py-3 rounded-lg ${
//                       isDark 
//                         ? "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500" 
//                         : "bg-gray-50 text-gray-900 border-orange-200 focus:border-orange-500"
//                     } border focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200`}
//                   />
//                 </div>
//               </div>

//               {/* Send Follow Request Card */}
//               <div className={`p-5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"} mb-6`}>
//                 <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                   <UserPlus className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-orange-600"}`} />
//                   Send Follow Request
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <input
//                       className={`w-full px-4 py-3 rounded-lg ${
//                         isDark 
//                           ? "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500" 
//                           : "bg-gray-50 text-gray-900 border-orange-200 focus:border-orange-500"
//                       } border focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200`}
//                       placeholder="Enter username..."
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                     />
//                   </div>
//                   <button
//                     className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
//                     onClick={() => {
//                       dispatch(sendFollowRequest(username));
//                       setUsername("");
//                     }}
//                   >
//                     Send Request
//                   </button>
//                 </div>
//               </div>

//               {/* Follow Stats */}
//               {/* <div className={`p-5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"}`}>
//                 <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                   Follow Statistics
//                 </h3>
//                 <div className="space-y-3">
//                   {[
//                     { label: "Followers", value: followers.length, icon: <Users size={16} />, color: "from-blue-500 to-cyan-500" },
//                     { label: "Following", value: following.length, icon: <UserPlus size={16} />, color: "from-green-500 to-emerald-500" },
//                     { label: "Pending Requests", value: processedSent.length, icon: <Clock size={16} />, color: "from-orange-500 to-amber-500" },
//                     { label: "New Requests", value: processedIncoming.length, icon: <Bell size={16} />, color: "from-purple-500 to-violet-500" },
//                   ].map((stat, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
//                           <div className="text-white">{stat.icon}</div>
//                         </div>
//                         <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
//                           {stat.label}
//                         </span>
//                       </div>
//                       <span className={`text-lg font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                         {stat.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div> */}
//             </div>

//             {/* Right Column - Notifications List */}
//             <div className="lg:col-span-2">
//               <div className={`rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"}`}>
//                 {/* Header */}
//                 <div className={`p-5 border-b ${isDark ? "border-gray-700" : "border-orange-200"}`}>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h2 className={`text-xl font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                         {activeFilter === "all" ? "All Notifications" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
//                       </h2>
//                       <p className={`text-sm ${isDark ? "text-gray-400" : "text-orange-700/70"}`}>
//                         {filteredNotifications.length} of {allNotifications.length} notifications
//                       </p>
//                     </div>
//                     <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}>
//                       <Filter size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
//                     </button>
//                   </div>

//                   {/* Tabs */}
//                   <div className="flex overflow-x-auto pb-2">
//                     {tabs.map((tab) => (
//                       <button
//                         key={tab.key}
//                         onClick={() => setActiveFilter(tab.key)}
//                         className={`flex items-center gap-2 px-4 py-2.5 mx-1 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
//                           activeFilter === tab.key
//                             ? isDark
//                               ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
//                               : `bg-gradient-to-r ${tab.color} text-white shadow-lg`
//                             : isDark
//                             ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
//                             : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//                         }`}
//                       >
//                         {tab.icon}
//                         <span>{tab.label}</span>
//                         {stats[tab.key] > 0 && (
//                           <span className={`px-1.5 py-0.5 rounded-full text-xs ${
//                             activeFilter === tab.key 
//                               ? "bg-white/20" 
//                               : isDark ? "bg-gray-700" : "bg-gray-200"
//                           }`}>
//                             {stats[tab.key]}
//                           </span>
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Notifications Content */}
//                 <div className="p-4">
//                   {filteredNotifications.length === 0 ? (
//                     <div className="py-12 text-center">
//                       <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
//                         isDark ? "bg-gray-700" : "bg-orange-100"
//                       }`}>
//                         <AlertCircle size={40} className={isDark ? "text-gray-500" : "text-orange-400"} />
//                       </div>
//                       <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
//                         No notifications found
//                       </h3>
//                       <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} max-w-sm mx-auto`}>
//                         {searchQuery
//                           ? "Try a different search term"
//                           : "You're all caught up! No notifications at the moment."}
//                       </p>
//                     </div>
//                   ) : (
//                     <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-3"}>
//                       {filteredNotifications.map((notification, index) => (
//                         <NotificationItem
//                           key={index}
//                           n={notification}
//                           isDark={isDark}
//                           onAction={handleNotificationAction}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }








import React, { useState, useMemo } from "react";
import Layout from "../ui/Layout";
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Bell,
  Search,
  Check,
  X,
  Clock,
  User,
  ExternalLink,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Send,
  Users,
  ThumbsUp,
  MessageSquare,
  Hash,
  AlertCircle,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../redux/authslice";

// ---------------------------------------------------------------
// TIME FORMATTER
// ---------------------------------------------------------------
const formatTime = (timestamp) => {
  const diff = Date.now() - new Date(timestamp);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
};

// ---------------------------------------------------------------
// ICONS FOR NOTIFICATION TYPE
// ---------------------------------------------------------------
const getIcon = (type) => {
  switch (type) {
    case "like":
      return <Heart size={18} className="text-pink-500" />;
    case "comment":
      return <MessageCircle size={18} className="text-blue-500" />;
    case "mention":
      return <AtSign size={18} className="text-cyan-500" />;
    case "followRequestIncoming":
    case "followRequestSent":
    case "followRequestAccepted":
    case "followRequestRejected":
      return <UserPlus size={18} className="text-green-500" />;
    default:
      return <Bell size={18} className="text-purple-500" />;
  }
};

// ---------------------------------------------------------------
// NOTIFICATION ITEM COMPONENT
// ---------------------------------------------------------------
const NotificationItem = ({ n, isDark, onAction }) => {
  const getIcon = (type) => {
    switch (type) {
      case "like":
        return { icon: <ThumbsUp size={16} />, color: "bg-gradient-to-r from-pink-500 to-rose-500", textColor: "text-pink-600" };
      case "comment":
        return { icon: <MessageSquare size={16} />, color: "bg-gradient-to-r from-blue-500 to-cyan-500", textColor: "text-blue-600" };
      case "mention":
        return { icon: <Hash size={16} />, color: "bg-gradient-to-r from-cyan-500 to-teal-500", textColor: "text-cyan-600" };
      case "followRequestIncoming":
        return { icon: <UserPlus size={16} />, color: "bg-gradient-to-r from-green-500 to-emerald-500", textColor: "text-green-600" };
      case "followRequestSent":
        return { icon: <Send size={16} />, color: "bg-gradient-to-r from-orange-500 to-amber-500", textColor: "text-orange-600" };
      case "followRequestAccepted":
        return { icon: <UserCheck size={16} />, color: "bg-gradient-to-r from-emerald-500 to-green-500", textColor: "text-emerald-600" };
      case "followRequestRejected":
        return { icon: <UserX size={16} />, color: "bg-gradient-to-r from-red-500 to-rose-500", textColor: "text-red-600" };
      default:
        return { icon: <Bell size={16} />, color: "bg-gradient-to-r from-purple-500 to-violet-500", textColor: "text-purple-600" };
    }
  };

  const iconConfig = getIcon(n.type);
  const avatarLetter = n.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className={`p-4 rounded-xl mb-3 transition-all duration-300 hover:scale-[1.02] ${
        isDark
          ? "bg-gray-800 border border-gray-700 hover:border-gray-600"
          : "bg-white border border-orange-200 hover:border-orange-300 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with Icon */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${iconConfig.color}`}>
            {avatarLetter}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${isDark ? "border-gray-800" : "border-white"} ${iconConfig.color} flex items-center justify-center`}>
            {iconConfig.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"} mb-1`}>
                {n.message}
              </p>
              <div className="flex items-center gap-3">
                <span className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-400" : "text-orange-600"}`}>
                  <Clock size={12} />
                  {formatTime(n.createdAt)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-orange-100 text-orange-700"}`}>
                  {n.type.replace('followRequest', '').replace(/([A-Z])/g, ' $1').trim() || n.type}
                </span>
              </div>
            </div>

            {/* Actions */}
            {n.type === "followRequestIncoming" && (
              <div className="flex gap-2 shrink-0">
                <button
                  className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => onAction('accept', n)}
                  title="Accept"
                >
                  <Check size={16} />
                </button>
                <button
                  className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => onAction('reject', n)}
                  title="Reject"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {/* View Action for other notifications */}
            {n.type !== "followRequestIncoming" && (
              <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}>
                <ExternalLink size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------
export default function Notifications() {
  const dispatch = useDispatch();
  const isDark = useSelector((s) => s.theme?.isDark);

  // REAL notifications from Redux:
  const notifications = useSelector((s) => s.notifications.all);

  // FOLLOW SECTION FROM REDUX
  const follows = useSelector((s) => s.notifications.follows);
  const incoming = follows.followRequestIncoming || [];
  const sent = follows.followRequestSent || [];
  const accepted = follows.followRequestAccepted || [];
  const rejected = follows.followRequestRejected || [];

  // Get user data for username resolution
  const currentUser = useSelector((s) => s.auth.user);
  const followers = useSelector((s) => s.auth.followers) || [];
  const following = useSelector((s) => s.auth.following) || [];

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or grid

  // Function to get username from ID
  const getUsernameFromId = (userId) => {
    if (!userId) return "Unknown User";
    
    // Check in followers
    const follower = followers.find(f => f.id === userId || f._id === userId);
    if (follower) return follower.username || follower.name || "User";
    
    // Check in following
    const followingUser = following.find(f => f.id === userId || f._id === userId);
    if (followingUser) return followingUser.username || followingUser.name || "User";
    
    // Check if it's the current user
    if (currentUser && (currentUser.id === userId || currentUser._id === userId)) {
      return currentUser.username || currentUser.name || "You";
    }
    
    // Return default
    return "User";
  };

  // Process notifications to replace IDs with usernames
  const processedNotifications = useMemo(() => {
    return notifications.map(notification => {
      const username = getUsernameFromId(notification.fromId || notification.senderId || notification.userId);
      
      // Create a processed message
      let processedMessage = notification.message || "";
      
      // Replace IDs with usernames in the message
      if (notification.fromId) {
        const userIdRegex = new RegExp(notification.fromId, 'g');
        processedMessage = processedMessage.replace(userIdRegex, username);
      }
      
      // For like/comment notifications, create a user-friendly message
      if (!processedMessage && notification.type === 'like') {
        processedMessage = `${username} liked your post`;
      } else if (!processedMessage && notification.type === 'comment') {
        processedMessage = `${username} commented on your post`;
      } else if (!processedMessage && notification.type === 'mention') {
        processedMessage = `${username} mentioned you in a post`;
      }
      
      return {
        ...notification,
        message: processedMessage,
        username: username // Add username field for easy access
      };
    });
  }, [notifications, followers, following, currentUser]);

  // Process follow requests to ensure they have proper usernames
  const processedIncoming = useMemo(() => {
    return incoming.map(req => {
      const username = getUsernameFromId(req.fromId || req.senderId);
      return {
        ...req,
        type: "followRequestIncoming",
        // message: req.message || `${username} wants to follow you`,
        username: username,
        from: username // Ensure 'from' field has username
      };
    });
  }, [incoming, followers, following, currentUser]);

  const processedSent = useMemo(() => {
    return sent.map(req => {
      const username = getUsernameFromId(req.toId || req.receiverId);
      return {
        ...req,
        type: "followRequestSent",
        // message: req.message || `Follow request sent to ${username}`,
        username: username,
        to: username
      };
    });
  }, [sent, followers, following, currentUser]);

  const processedAccepted = useMemo(() => {
    return accepted.map(req => {
      const username = getUsernameFromId(req.fromId || req.senderId);
      return {
        ...req,
        type: "followRequestAccepted",
        // message: req.message || `${username} accepted your follow request`,
        username: username,
        from: username
      };
    });
  }, [accepted, followers, following, currentUser]);

  const processedRejected = useMemo(() => {
    return rejected.map(req => {
      const username = getUsernameFromId(req.fromId || req.senderId);
      return {
        ...req,
        type: "followRequestRejected",
        // message: req.message || `${username} declined your follow request`,
        username: username,
        from: username
      };
    });
  }, [rejected, followers, following, currentUser]);

  // Combine all notifications for the "All" tab
  // const allNotifications = useMemo(() => [
  //   ...processedIncoming,
  //   ...processedSent,
  //   ...processedAccepted,
  //   ...processedRejected,
  //   ...processedNotifications,
  // ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [
  //   processedIncoming, processedSent, processedAccepted, processedRejected, processedNotifications
  // ]);
  const allNotifications = useMemo(() => {
  return processedNotifications.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}, [processedNotifications]);


  // Filter notifications based on active tab and search query
  // const filteredNotifications = useMemo(() => {
  //   let filtered = allNotifications;
    
  //   // Filter by tab
  //   if (activeFilter === "follow") {
  //     filtered = filtered.filter(n => [
  //       "followRequestIncoming",
  //       "followRequestSent",
  //       "followRequestAccepted",
  //       "followRequestRejected"
  //     ].includes(n.type));
  //   } else if (activeFilter !== "all") {
  //     filtered = filtered.filter(n => n.type === activeFilter);
  //   }
    
  //   // Filter by search query
  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(n => 
  //       n.message?.toLowerCase().includes(query) ||
  //       n.username?.toLowerCase().includes(query)
  //     );
  //   }
    
  //   return filtered;
  // }, [allNotifications, activeFilter, searchQuery]);
  const filteredNotifications = useMemo(() => {
  let filtered = processedNotifications;

  if (activeFilter === "follow") {
    filtered = filtered.filter(n =>
      n.type.startsWith("followRequest")
    );
  } else if (activeFilter !== "all") {
    filtered = filtered.filter(n => n.type === activeFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(n =>
      n.message?.toLowerCase().includes(q) ||
      n.username?.toLowerCase().includes(q)
    );
  }

  return filtered;
}, [processedNotifications, activeFilter, searchQuery]);


  const handleNotificationAction = (action, notification) => {
    switch(action) {
      case 'accept':
        dispatch(
          acceptFollowRequest({
            followerId: notification.fromId || notification.senderId,
            // from: notification.username || notification.from
          })
        );
        break;
      case 'reject':
        dispatch(rejectFollowRequest(notification.fromId || notification.senderId));
        break;
      default:
        break;
    }
  };

  // Tab configuration
  const tabs = [
    { key: "all", label: "All", icon: <Bell size={16} />, color: "from-purple-500 to-violet-500" },
    { key: "like", label: "Likes", icon: <Heart size={16} />, color: "from-pink-500 to-rose-500" },
    { key: "comment", label: "Comments", icon: <MessageCircle size={16} />, color: "from-blue-500 to-cyan-500" },
    { key: "follow", label: "Follows", icon: <UserPlus size={16} />, color: "from-green-500 to-emerald-500" },
    { key: "mention", label: "Mentions", icon: <AtSign size={16} />, color: "from-cyan-500 to-teal-500" },
  ];

  // const getNotificationStats = () => {
  //   const stats = {
  //     all: allNotifications.length,
  //     like: processedNotifications.filter(n => n.type === 'like').length,
  //     comment: processedNotifications.filter(n => n.type === 'comment').length,
  //     mention: processedNotifications.filter(n => n.type === 'mention').length,
  //     follow: processedIncoming.length + processedSent.length + processedAccepted.length + processedRejected.length
  //   };
  //   return stats;
  // };
const getNotificationStats = () => ({
  all: processedNotifications.length,
  like: processedNotifications.filter(n => n.type === "like").length,
  comment: processedNotifications.filter(n => n.type === "comment").length,
  mention: processedNotifications.filter(n => n.type === "mention").length,
  follow: processedNotifications.filter(n =>
    n.type.startsWith("followRequest")
  ).length,
});

  const stats = getNotificationStats();

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-orange-50"}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                  Notifications
                </h1>
                <p className={`text-base ${isDark ? "text-gray-400" : "text-orange-800/70"}`}>
                  Stay updated with your social activity and connections
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className={`p-1 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-orange-200"}`}>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === "list" 
                        ? isDark ? "bg-gray-700 text-white" : "bg-orange-100 text-orange-700"
                        : isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === "grid" 
                        ? isDark ? "bg-gray-700 text-white" : "bg-orange-100 text-orange-700"
                        : isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Grid
                  </button>
                </div>
                
                {/* Mark All as Read */}
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-50 text-gray-700 border border-orange-200"}`}>
                  Mark all as read
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 mb-8`}>
              {tabs.map(tab => (
                <div 
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                    activeFilter === tab.key
                      ? isDark ? "border-gray-600 bg-gray-800" : "border-orange-300 bg-white shadow-lg"
                      : isDark ? "border-gray-700 bg-gray-800/50 hover:bg-gray-800" : "border-orange-200 bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tab.color} flex items-center justify-center`}>
                      {tab.icon}
                    </div>
                    <span className={`text-2xl font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                      {stats[tab.key] || 0}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {tab.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Filters and Send Request */}
            <div className="lg:col-span-1">
              {/* Search Bar */}
              <div className={`p-4 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"} mb-4`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      isDark 
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500" 
                        : "bg-gray-50 text-gray-900 border-orange-200 focus:border-orange-500"
                    } border focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Send Follow Request Card */}
              <div className={`p-5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"} mb-6`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                  <UserPlus className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-orange-600"}`} />
                  Send Follow Request
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark 
                          ? "bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500" 
                          : "bg-gray-50 text-gray-900 border-orange-200 focus:border-orange-500"
                      } border focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200`}
                      placeholder="Enter username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                    onClick={() => {
                      dispatch(sendFollowRequest(username));
                      setUsername("");
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </div>

              {/* Follow Stats */}
              {/* <div className={`p-5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                  Follow Statistics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Followers", value: followers.length, icon: <Users size={16} />, color: "from-blue-500 to-cyan-500" },
                    { label: "Following", value: following.length, icon: <UserPlus size={16} />, color: "from-green-500 to-emerald-500" },
                    { label: "Pending Requests", value: processedSent.length, icon: <Clock size={16} />, color: "from-orange-500 to-amber-500" },
                    { label: "New Requests", value: processedIncoming.length, icon: <Bell size={16} />, color: "from-purple-500 to-violet-500" },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <div className="text-white">{stat.icon}</div>
                        </div>
                        <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {stat.label}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Right Column - Notifications List */}
            <div className="lg:col-span-2">
              <div className={`rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-orange-200 bg-white"}`}>
                {/* Header */}
                <div className={`p-5 border-b ${isDark ? "border-gray-700" : "border-orange-200"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={`text-xl font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {activeFilter === "all" ? "All Notifications" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
                      </h2>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-orange-700/70"}`}>
                        {filteredNotifications.length} of {allNotifications.length} notifications
                      </p>
                    </div>
                    <button className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}>
                      <Filter size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 mx-1 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          activeFilter === tab.key
                            ? isDark
                              ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                              : `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                            : isDark
                            ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {stats[tab.key] > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            activeFilter === tab.key 
                              ? "bg-white/20" 
                              : isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}>
                            {stats[tab.key]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications Content */}
                <div className="p-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        isDark ? "bg-gray-700" : "bg-orange-100"
                      }`}>
                        <AlertCircle size={40} className={isDark ? "text-gray-500" : "text-orange-400"} />
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        No notifications found
                      </h3>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} max-w-sm mx-auto`}>
                        {searchQuery
                          ? "Try a different search term"
                          : "You're all caught up! No notifications at the moment."}
                      </p>
                    </div>
                  ) : (
                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-3"}>
                      {filteredNotifications.map((notification, index) => (
                        <NotificationItem
                          key={index}
                          n={notification}
                          isDark={isDark}
                          onAction={handleNotificationAction}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}