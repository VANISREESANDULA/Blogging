import React, { useState, useRef, useEffect } from "react";
import Layout from "../ui/Layout";
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Bell,
  ExternalLink,
  Search,
  X
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../redux/authslice";
import { socket } from "../../socket";
import {
  addNotification
} from "../redux/notificationsSlice";

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
      return <Bell size={18} />;
  }
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
  const incoming = follows.followRequestIncoming;
  const sent = follows.followRequestSent;
  const accepted = follows.followRequestAccepted;
  const rejected = follows.followRequestRejected || [];

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [username, setUsername] = useState("");
  const user = useSelector((s) => s.auth.user);

  const filteredNotifications = notifications.filter((n) => {
    const matchSearch =
      searchQuery === "" ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase());

    // Follows tab must show all follow types
    const isFollowType =
      [
        "followRequestIncoming",
        "followRequestSent",
        "followRequestAccepted",
        "followRequestRejected",
      ].includes(n.type);

    const matchTab =
      activeFilter === "all" ||
      n.type === activeFilter ||
      (activeFilter === "follow" && isFollowType);

    return matchTab && matchSearch;
  });

  // ---------------------------------------------------------------
  // RENDER FOLLOW REQUEST UI
  // ---------------------------------------------------------------
  const FollowRequestItem = ({ notif }) => (
    <div
      className={`p-4 flex justify-between items-center border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
    >
      <div>
        <p className="font-semibold">{notif.message}</p>
        <p className="text-xs opacity-60">{formatTime(notif.createdAt)}</p>
      </div>

      {/* ACCEPT / REJECT BUTTONS */}
      {notif.type === "followRequestIncoming" && (
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg"
            onClick={() => dispatch(acceptFollowRequest(notif.fromId))}
          >
            Accept
          </button>
          <button
            className="px-3 py-1.5 bg-red-300 rounded-lg"
            onClick={() => dispatch(rejectFollowRequest(notif.fromId))}
          >
            Reject
          </button>

        </div>
      )}

      {notif.type === "followRequestSent" && (
        <span className="text-xs opacity-70">Pending</span>
      )}

      {notif.type === "followRequestAccepted" && (
        <span className="text-green-500 text-sm font-semibold">
          Accepted
        </span>
      )}

      {notif.type === "followRequestRejected" && (
        <span className="text-red-500 text-sm font-semibold">
          Rejected
        </span>
      )}
    </div>
  );
//   const FollowRequestItem = ({ notif }) => {
//   const isIncoming = notif.type === "followRequestIncoming";
//   const isSent = notif.type === "followRequestSent";
//   const isAccepted = notif.type === "followRequestAccepted";
//   const isRejected = notif.type === "followRequestRejected";

//   return (
//     <div
//       className={`p-4 flex justify-between items-center border-b ${
//         isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
//       }`}
//     >
//       <div>
//         <p className="font-semibold">{notif.message}</p>
//         <p className="text-xs opacity-60">{formatTime(notif.createdAt)}</p>
//       </div>

//       {/* Incoming → show Accept/Reject */}
//       {isIncoming && (
//         <div className="flex gap-2">
//           <button
//             className="px-3 py-1.5 bg-blue-600 text-white rounded-lg"
//             onClick={() => dispatch(acceptFollowRequest(notif.fromId))}
//           >
//             Accept
//           </button>

//           <button
//             className="px-3 py-1.5 bg-red-400 text-white rounded-lg"
//             onClick={() => dispatch(rejectFollowRequest(notif.fromId))}
//           >
//             Reject
//           </button>
//         </div>
//       )}

//       {/* Sent → show Pending */}
//       {isSent && <span className="text-xs opacity-70">Pending</span>}

//       {/* Accepted */}
//       {isAccepted && (
//         <span className="text-green-500 text-sm font-semibold">Accepted</span>
//       )}

//       {/* Rejected */}
//       {isRejected && (
//         <span className="text-red-500 text-sm font-semibold">Rejected</span>
//       )}
//     </div>
//   );
// };


  // ---------------------------------------------------------------
  // MAIN RETURN JSX
  // ---------------------------------------------------------------
  return (
    <Layout>
      {/* REALTIME DEBUG NOTIFICATIONS */}
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded mb-4">
        <h3 className="font-bold mb-2">Realtime Events (Debug)</h3>
        <ul className="text-sm">
          {notifications.map((n, i) => (
            <li key={i}>
              {n.message} — {new Date(n.createdAt).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`w-full min-h-screen p-6 flex justify-center ${isDark ? "bg-gray-950" : "bg-gray-100"
          }`}
      >
        <div
          className={`w-full max-w-3xl shadow-lg rounded-xl overflow-hidden ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"
            }`}
        >
          {/* HEADER */}
          <div
            className={`p-5 border-b ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200"
              }`}
          >
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                className={`w-full pl-10 py-2 rounded-lg ${isDark ? "bg-gray-800 text-white" : "bg-gray-100"
                  }`}
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-auto">
              {[
                { key: "all", label: "All", icon: <Bell size={16} /> },
                { key: "like", label: "Likes", icon: <Heart size={16} /> },
                {
                  key: "comment",
                  label: "Comments",
                  icon: <MessageCircle size={16} />,
                },
                { key: "follow", label: "Follows", icon: <UserPlus size={16} /> },
                { key: "mention", label: "Mentions", icon: <AtSign size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeFilter === tab.key
                      ? isDark
                        ? "bg-gray-700 text-white"
                        : "bg-gray-900 text-white"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* FOLLOWS TAB SPECIAL UI */}
          {/* ----------------------------------------------------- */}
          {activeFilter === "follow" && (
            <div
              className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"
                }`}
            >
              <h2 className="font-semibold mb-2">Send Follow Request</h2>

              <div className="flex gap-2">
                <input
                  className={`flex-1 px-3 py-2 rounded-lg ${isDark ? "bg-gray-800 text-white" : "bg-gray-100"
                    }`}
                  placeholder="Enter username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => {
                    dispatch(sendFollowRequest(username));
                    setUsername("");
                  }}
                >
                  Send
                </button>
              </div>

              {/* Follow Sections */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Incoming</h3>
                {incoming.length === 0 ? (
                  <p className="text-sm opacity-60">No incoming requests</p>
                ) : (
                  incoming.map((n, i) => (
                    <FollowRequestItem notif={n} key={i} />
                  ))
                )}

                <h3 className="font-semibold mt-6 mb-2">Sent</h3>
                {sent.length === 0 ? (
                  <p className="text-sm opacity-60">No sent requests</p>
                ) : (
                  sent.map((n, i) => <FollowRequestItem notif={n} key={i} />)
                )}

                <h3 className="font-semibold mt-6 mb-2">Accepted</h3>
                {accepted.length === 0 ? (
                  <p className="text-sm opacity-60">None</p>
                ) : (
                  accepted.map((n, i) => <FollowRequestItem notif={n} key={i} />)
                )}

                <h3 className="font-semibold mt-6 mb-2">Rejected</h3>
                {rejected.length === 0 ? (
                  <p className="text-sm opacity-60">None</p>
                ) : (
                  rejected.map((n, i) => <FollowRequestItem notif={n} key={i} />)
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* NOTIFICATION LIST (for all other tabs) */}
          {/* ----------------------------------------------------- */}
          <div>
            {activeFilter !== "follow" &&
              (filteredNotifications.length === 0 ? (
                <div className="py-12 text-center opacity-70">
                  No notifications found
                </div>
              ) : (
                filteredNotifications.map((n, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"
                      }`}
                  >
                    {getIcon(n.type)}
                    <div>
                      <p>{n.message}</p>
                      <p className="text-xs opacity-60">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

