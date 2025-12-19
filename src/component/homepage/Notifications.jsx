import React, { useState } from "react";
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

  const filteredNotifications = notifications.filter((n) => {
    const matchSearch =
      searchQuery === "" ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase());

    // Follows tab must show all follow types
    const isFollowType = [
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

const handleAcceptFollow = (notif) => {
  dispatch(
    acceptFollowRequest({
      followerId: notif.fromId, // sender id
      from: notif.from          // sender name
    })
  );
};



  // ---------------------------------------------------------------
  // RENDER FOLLOW REQUEST UI
  // ---------------------------------------------------------------
  const FollowRequestItem = ({ notif }) => {
    const isIncoming = notif.type === "followRequestIncoming";
    const isSent = notif.type === "followRequestSent";
    const isAccepted = notif.type === "followRequestAccepted";
    const isRejected = notif.type === "followRequestRejected";

    return (
      <div
        className={`p-4 rounded-lg mb-3 transition-all duration-300 hover:shadow-md ${isDark
            ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
            : "bg-white border border-gray-200 hover:bg-gray-50"
          }`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar/Icon */}
          <div
            className={`p-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
          >
            {getIcon(notif.type)}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                >
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              {isIncoming ? (
                <div className="flex gap-2">

                  <button
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all duration-200"
                    onClick={() => handleAcceptFollow(notif)}
                  >
                    <Check size={14} />
                    Accept
                  </button>

                  <button
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all duration-200"
                    onClick={() => dispatch(rejectFollowRequest(notif.fromId))}
                  >
                    <X size={14} />
                    Decline
                  </button>
                </div>
              ) : isSent ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                      ? "bg-yellow-900/30 text-yellow-400"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  <Clock size={12} className="inline mr-1" />
                  Pending
                </span>
              ) : isAccepted ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-800"
                    }`}
                >
                  <Check size={12} className="inline mr-1" />
                  Accepted
                </span>
              ) : isRejected ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                      ? "bg-red-900/30 text-red-400"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  <X size={12} className="inline mr-1" />
                  Declined
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tab configuration
  const tabs = [
    { key: "all", label: "All", icon: <Bell size={16} /> },
    { key: "like", label: "Likes", icon: <Heart size={16} /> },
    { key: "comment", label: "Comments", icon: <MessageCircle size={16} /> },
    { key: "follow", label: "Follows", icon: <UserPlus size={16} /> },
    { key: "mention", label: "Mentions", icon: <AtSign size={16} /> },
  ];

  return (
    <Layout>
      <div
        className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-gray-50"
          }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  Notifications
                </h1>
                <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Stay updated with your social activity
                </p>
              </div>

              {/* Notification Stats */}
              <div className="flex items-center gap-4">
                <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="font-semibold">{notifications.length}</span> total notifications
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}
          >
            {/* Search and Tabs Section */}
            <div
              className={`p-4 sm:p-6 border-b ${isDark ? "border-gray-800" : "border-gray-200"
                }`}
            >
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search
                  size={18}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <input
                  className={`w-full pl-12 pr-4 py-3 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                      ? "bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700"
                      : "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300"
                    }`}
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto pb-2 -mx-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex-shrink-0 px-4 py-2.5 mx-1 rounded-lg flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${activeFilter === tab.key
                        ? isDark
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-blue-600 text-white shadow-md"
                        : isDark
                          ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                    {activeFilter === tab.key && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-white/80"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6">
              {/* Follow Tab Content */}
              {activeFilter === "follow" && (
                <div className="mb-8">
                  {/* Send Follow Request Card */}
                  <div
                    className={`p-5 rounded-xl mb-8 ${isDark
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                      }`}
                  >
                    <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                      <UserPlus size={18} className="inline mr-2" />
                      Send Follow Request
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          className={`w-full px-4 py-3 rounded-lg text-sm ${isDark
                              ? "bg-gray-700 text-gray-200 placeholder-gray-500 border border-gray-600"
                              : "bg-white text-gray-900 placeholder-gray-500 border border-gray-300"
                            }`}
                          placeholder="Enter username..."
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={() => {
                          dispatch(sendFollowRequest(username));
                          setUsername("");
                        }}
                      >
                        Send Request
                      </button>
                    </div>
                  </div>

                  {/* Follow Sections */}
                  <div className="space-y-6">
                    {[
                      { title: "Incoming Requests", data: incoming, emptyText: "No incoming requests" },
                      { title: "Sent Requests", data: sent, emptyText: "No sent requests" },
                      { title: "Accepted Requests", data: accepted, emptyText: "No accepted requests" },
                      { title: "Rejected Requests", data: rejected, emptyText: "No rejected requests" },
                    ].map((section) => (
                      <div key={section.title}>
                        <h3
                          className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-900"
                            }`}
                        >
                          {section.title}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {section.data.length}
                          </span>
                        </h3>

                        {section.data.length === 0 ? (
                          <div
                            className={`p-6 text-center rounded-lg ${isDark ? "bg-gray-800/50 text-gray-500" : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {section.emptyText}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {section.data.map((notif, i) => (
                              <FollowRequestItem key={i} notif={notif} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Tabs Content */}
              {activeFilter !== "follow" && (
                <div>
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"
                          }`}
                      >
                        <Bell size={24} className={isDark ? "text-gray-600" : "text-gray-400"} />
                      </div>
                      <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                        No notifications found
                      </h3>
                      <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                        {searchQuery
                          ? "Try a different search term"
                          : "You're all caught up!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredNotifications.map((n, index) => (
                        <div
                          key={index}
                          className={`group p-4 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${isDark
                              ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
                              : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                          onClick={() => {
                            // Handle notification click (view related content)
                            console.log("Notification clicked:", n);
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon with badge */}
                            <div className="relative">
                              <div
                                className={`p-2.5 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"
                                  }`}
                              >
                                {getIcon(n.type)}
                              </div>
                              {n.unread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"
                                  }`}
                              >
                                {n.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"
                                      }`}
                                  >
                                    <Clock size={12} />
                                    {formatTime(n.createdAt)}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs capitalize ${isDark
                                        ? "bg-gray-700 text-gray-400"
                                        : "bg-gray-100 text-gray-600"
                                      }`}
                                  >
                                    {n.type}
                                  </span>
                                </div>
                                <ExternalLink
                                  size={14}
                                  className={`opacity-0 group-hover:opacity-70 transition-opacity ${isDark ? "text-gray-500" : "text-gray-400"
                                    }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {(activeFilter === "follow" || filteredNotifications.length > 0) && (
              <div
                className={`p-4 border-t ${isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    {activeFilter === "follow"
                      ? `Showing ${incoming.length + sent.length + accepted.length + rejected.length} follow requests`
                      : `Showing ${filteredNotifications.length} of ${notifications.length} notifications`}
                  </span>
                  <button
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isDark
                        ? "text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                        : "text-blue-600 hover:text-blue-700 hover:bg-gray-100"
                      }`}
                    onClick={() => {
                      // Mark all as read or clear notifications
                      console.log("Clear all clicked");
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}