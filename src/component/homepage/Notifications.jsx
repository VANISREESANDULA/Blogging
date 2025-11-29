import React, { useState, useEffect, useRef } from "react";
import Layout from "../ui/Layout";
import { Heart, MessageCircle, UserPlus, Share2, AtSign, MoreHorizontal, UserCheck, Reply, ThumbsUp, Bookmark, X, Smile, Send, FileText, Calendar, ExternalLink, Undo2, Bell, Check, Star, Mail, Search } from "lucide-react";
import { useSelector } from "react-redux";

// Enhanced notifications data for blog-only application (no images)
const NOTIFICATIONS_DATA = [
  {
    id: "1",
    type: "like",
    user: { 
      name: "Sarah Johnson", 
      username: "sarahj", 
      avatar: "SJ",
      isFollowing: true,
      isVerified: true
    },
    action: "liked your blog",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isRead: false,
    post: {
      id: "post1",
      content: "Just launched my new portfolio website! 🚀 So excited to share my latest work with everyone.",
      title: "Building a Modern Portfolio Website",
      excerpt: "Learn how I built my portfolio using React and Tailwind CSS with best practices for performance and SEO.",
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      url: "/blogs/post1",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      readTime: "5 min read"
    }
  },
  {
    id: "2",
    type: "comment",
    user: { 
      name: "Alex Chen", 
      username: "alexchen", 
      avatar: "AC",
      isFollowing: false,
      isVerified: false
    },
    action: "commented on your blog",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
    content: "This is amazing! Love the design and attention to detail. 🔥",
    post: {
      id: "post2",
      content: "My latest UI design for a fitness app. What do you think?",
      title: "UI Design Patterns for Fitness Apps",
      excerpt: "Exploring the best UI practices and user experience patterns for health and fitness applications.",
      likes: 42,
      comments: 12,
      shares: 5,
      isLiked: true,
      isBookmarked: false,
      url: "/blogs/post2",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      readTime: "8 min read"
    }
  },
  {
    id: "3",
    type: "follow",
    user: { 
      name: "Emma Davis", 
      username: "emmadavis", 
      avatar: "ED",
      isFollowing: false,
      isVerified: true
    },
    action: "started following you",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: true,
  },
  {
    id: "4",
    type: "mention",
    user: { 
      name: "Marcus Wilson", 
      username: "marcusw", 
      avatar: "MW",
      isFollowing: true,
      isVerified: false
    },
    action: "mentioned you in a blog",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    content: "@yourname check out this amazing design inspiration!",
    post: {
      id: "post3",
      content: "Great design resources shared by @yourname in the community!",
      title: "Essential Design Resources for Developers",
      excerpt: "A curated list of tools, libraries, and resources that every developer should know about.",
      likes: 15,
      comments: 3,
      shares: 1,
      isLiked: false,
      isBookmarked: true,
      url: "/blogs/post3",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      readTime: "6 min read"
    }
  },
  {
    id: "5",
    type: "share",
    user: { 
      name: "Lisa Park", 
      username: "lisap", 
      avatar: "LP",
      isFollowing: true,
      isVerified: false
    },
    action: "shared your blog",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
    post: {
      id: "post4",
      content: "The complete guide to modern React patterns and best practices.",
      title: "Modern React Patterns and Best Practices",
      excerpt: "Deep dive into advanced React patterns, hooks optimization, and performance best practices.",
      likes: 89,
      comments: 23,
      shares: 15,
      isLiked: true,
      isBookmarked: false,
      url: "/blogs/post4",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      readTime: "12 min read"
    }
  }
];

const getNotificationIcon = (type, isDark) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center";
  
  switch (type) {
    case "like":
      return (
        <div className={`${baseClasses} ${isDark ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
          <Heart size={16} className={isDark ? "text-pink-400" : "text-pink-600"} />
        </div>
      );
    case "comment":
      return (
        <div className={`${baseClasses} ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <MessageCircle size={16} className={isDark ? "text-blue-400" : "text-blue-600"} />
        </div>
      );
    case "follow":
      return (
        <div className={`${baseClasses} ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <UserPlus size={16} className={isDark ? "text-green-400" : "text-green-600"} />
        </div>
      );
    case "share":
      return (
        <div className={`${baseClasses} ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
          <Share2 size={16} className={isDark ? "text-purple-400" : "text-purple-600"} />
        </div>
      );
    case "mention":
      return (
        <div className={`${baseClasses} ${isDark ? 'bg-cyan-900/30' : 'bg-cyan-50'}`}>
          <AtSign size={16} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
        </div>
      );
    default:
      return null;
  }
};

// Format timestamp to relative time
const formatTime = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "Just now";
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [viewingPost, setViewingPost] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const isDark = useSelector((state) => state.theme.isDark);
  
  // Refs for touch tracking
  const touchTimers = useRef({});
  const longPressDuration = 500; // milliseconds

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter notifications based on active filter and search
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === "all" || notification.type === activeFilter;
    const matchesSearch = searchQuery === "" || 
      notification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Handle touch start for long press
  const handleTouchStart = (notificationId, event) => {
    event.preventDefault();
    touchTimers.current[notificationId] = setTimeout(() => {
      setSelectionMode(true);
      toggleSelection(notificationId);
    }, longPressDuration);
  };

  // Handle touch end
  const handleTouchEnd = (notificationId, event) => {
    event.preventDefault();
    if (touchTimers.current[notificationId]) {
      clearTimeout(touchTimers.current[notificationId]);
      delete touchTimers.current[notificationId];
    }
  };

  // Handle touch move (cancel long press if user moves finger)
  const handleTouchMove = (notificationId, event) => {
    if (touchTimers.current[notificationId]) {
      clearTimeout(touchTimers.current[notificationId]);
      delete touchTimers.current[notificationId];
    }
  };

  // Handle mouse down for long press (desktop)
  const handleMouseDown = (notificationId, event) => {
    event.preventDefault();
    touchTimers.current[notificationId] = setTimeout(() => {
      setSelectionMode(true);
      toggleSelection(notificationId);
    }, longPressDuration);
  };

  // Handle mouse up
  const handleMouseUp = (notificationId, event) => {
    event.preventDefault();
    if (touchTimers.current[notificationId]) {
      clearTimeout(touchTimers.current[notificationId]);
      delete touchTimers.current[notificationId];
    }
  };

  // Handle mouse leave (cancel long press if mouse leaves element)
  const handleMouseLeave = (notificationId, event) => {
    if (touchTimers.current[notificationId]) {
      clearTimeout(touchTimers.current[notificationId]);
      delete touchTimers.current[notificationId];
    }
  };

  // Toggle notification selection
  const toggleSelection = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  // Mark selected as read
  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(notif =>
        selectedNotifications.has(notif.id) ? { ...notif, isRead: true } : notif
      )
    );
    setSelectedNotifications(new Set());
    setSelectionMode(false);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    setSelectedNotifications(new Set());
  };

  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.has(notif.id)));
    setSelectedNotifications(new Set());
    setSelectionMode(false);
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  // Handle view blog
  const handleViewBlog = (notification, event) => {
    event?.stopPropagation();
    if (notification.post?.url) {
      console.log(`Navigating to blog: ${notification.post.url}`);
      setViewingPost(notification);
    }
  };

  // Close blog view
  const handleCloseBlogView = () => {
    setViewingPost(null);
  };

  // Handle like action
  const handleLike = (notificationId, event) => {
    event?.stopPropagation();
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === notificationId && notif.post) {
          const newLikes = notif.post.isLiked ? notif.post.likes - 1 : notif.post.likes + 1;
          return {
            ...notif,
            post: {
              ...notif.post,
              likes: newLikes,
              isLiked: !notif.post.isLiked
            }
          };
        }
        return notif;
      })
    );
  };

  // Handle comment action
  const handleComment = (notificationId, event) => {
    event?.stopPropagation();
    setShowCommentModal(notificationId);
    setNewComment("");
  };

  // Handle follow action
  const handleFollow = (notificationId, event) => {
    event?.stopPropagation();
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { 
              ...notif, 
              user: { ...notif.user, isFollowing: !notif.user.isFollowing } 
            }
          : notif
      )
    );
  };

  // Submit comment
  const submitComment = (notificationId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: { name: "You", username: "yourname", avatar: "Y" },
      content: newComment,
      timestamp: new Date(),
      likes: 0
    };

    setPostComments(prev => ({
      ...prev,
      [notificationId]: [...(prev[notificationId] || []), comment]
    }));

    // Update comment count
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === notificationId && notif.post) {
          return {
            ...notif,
            post: {
              ...notif.post,
              comments: notif.post.comments + 1
            }
          };
        }
        return notif;
      })
    );

    setNewComment("");
    setShowCommentModal(null);
  };

  // Blog preview thumbnail component
  const BlogThumbnail = ({ post }) => (
    <div className={`w-12 h-12 ${isDark ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-lg border flex items-center justify-center group-hover:shadow-sm transition-all`}>
      <FileText size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
    </div>
  );

  // User avatar component (using initials)
  const UserAvatar = ({ user }) => (
    <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500' : 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500'} text-white flex items-center justify-center font-bold text-sm border`}>
      {user.avatar}
    </div>
  );

  // Instagram-like notification item component
  const NotificationItem = ({ notification }) => (
    <div
      className={`flex items-start gap-3 p-4 transition-colors cursor-pointer ${
        !notification.isRead && !selectionMode 
          ? isDark ? "bg-blue-900/20" : "bg-blue-50"
          : isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
      } ${selectionMode ? isDark ? "bg-gray-800" : "bg-white" : ""}`}
      onClick={() => {
        if (selectionMode) {
          toggleSelection(notification.id);
        } else if (!notification.isRead) {
          setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
          );
        }
      }}
      onTouchStart={(e) => handleTouchStart(notification.id, e)}
      onTouchEnd={(e) => handleTouchEnd(notification.id, e)}
      onTouchMove={(e) => handleTouchMove(notification.id, e)}
      onMouseDown={(e) => handleMouseDown(notification.id, e)}
      onMouseUp={(e) => handleMouseUp(notification.id, e)}
      onMouseLeave={(e) => handleMouseLeave(notification.id, e)}
    >
      {/* Selection Checkbox - Only shown in selection mode */}
      {selectionMode && (
        <div className="flex items-start pt-2 flex-shrink-0">
          <input
            type="checkbox"
            checked={selectedNotifications.has(notification.id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelection(notification.id);
            }}
            className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
          />
        </div>
      )}

      {/* Notification Icon */}
      <div className="flex-shrink-0">
        {getNotificationIcon(notification.type, isDark)}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <UserAvatar user={notification.user} />
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {notification.user.name}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {notification.action}
                </p>
              </div>
            </div>
            
            {notification.content && (
              <p className={`text-sm mt-2 p-2 rounded-lg border ${isDark ? 'text-gray-300 bg-gray-800 border-gray-700' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                "{notification.content}"
              </p>
            )}

            {/* Blog Preview - Show title and excerpt when available */}
            {notification.post && !selectionMode && (
              <div className={`mt-2 p-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <BlogThumbnail post={notification.post} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {notification.post.title}
                    </p>
                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {notification.post.excerpt}
                    </p>
                    <div className={`flex items-center gap-2 mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{notification.post.readTime}</span>
                      <span>•</span>
                      <span>{formatTime(notification.post.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timestamp and Action Button */}
          {!selectionMode && (
            <div className="flex flex-col items-end gap-2 ml-3">
              <p className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(notification.timestamp)}
              </p>
              
              {notification.type === "follow" && (
                <button
                  onClick={(e) => handleFollow(notification.id, e)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    notification.user.isFollowing
                      ? isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {notification.user.isFollowing ? "Following" : "Follow"}
                </button>
              )}

              {notification.post && (
                <button
                  onClick={(e) => handleViewBlog(notification, e)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <ExternalLink size={12} />
                  View Blog
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons for Blog Interactions - Hidden in selection mode */}
        {!selectionMode && (notification.type === "like" || notification.type === "comment" || notification.type === "mention") && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleLike(notification.id, e)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                notification.post.isLiked
                  ? isDark ? "bg-pink-900/20 text-pink-400 border border-pink-700" : "bg-pink-50 text-pink-600 border border-pink-200"
                  : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart size={14} className={notification.post.isLiked ? "fill-current" : ""} />
              {notification.post.isLiked ? "Liked" : "Like"}
            </button>
            <button
              onClick={(e) => handleComment(notification.id, e)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <MessageCircle size={14} />
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      {/* UPDATED: Same container structure as SettingsPage */}
      <div className={`w-full min-h-screen transition-colors duration-300 flex justify-center p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-4xl rounded-2xl shadow-md overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
          
          {/* Header */}
          <div className={`sticky top-0 z-40 border-b px-6 py-4 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {selectionMode ? `${selectedNotifications.size} Selected` : "Notifications"}
              </h1>
              <div className="flex items-center gap-2">
                {selectionMode ? (
                  <>
                    <button
                      onClick={exitSelectionMode}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={markSelectedAsRead}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Mark read
                    </button>
                    <button
                      onClick={deleteSelected}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    {selectedNotifications.size > 0 && (
                      <>
                        <button
                          onClick={markSelectedAsRead}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'}`}
                        >
                          Mark read
                        </button>
                        <button
                          onClick={deleteSelected}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={markAllAsRead}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Mark all as read
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar - Hidden in selection mode */}
            {!selectionMode && (
              <>
                <div className="relative mb-3">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white focus:bg-gray-750' : 'bg-gray-100 text-black focus:bg-white'}`}
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {[
                    { key: "all", label: "All", icon: <Bell size={16} /> },
                    { key: "like", label: "Likes", icon: <Heart size={16} /> },
                    { key: "comment", label: "Comments", icon: <MessageCircle size={16} /> },
                    { key: "follow", label: "Follows", icon: <UserPlus size={16} /> },
                    { key: "mention", label: "Mentions", icon: <AtSign size={16} /> },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        activeFilter === filter.key
                          ? isDark ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
                          : isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {filter.icon}
                      {filter.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification List */}
          <div className={`divide-y transition-colors duration-300 ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Bell size={24} className={isDark ? "text-gray-600" : "text-gray-400"} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  No notifications
                </h3>
                <p className={`text-sm max-w-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchQuery ? "No notifications match your search." : "When you get notifications, they'll appear here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>

          {/* Comment Modal */}
          {showCommentModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl transition-colors duration-300 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
                <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <h3 className={`font-semibold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Add a comment</h3>
                  <button
                    onClick={() => setShowCommentModal(null)}
                    className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold`}>
                      Y
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>You</p>
                      <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Posting as yourself</p>
                    </div>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className={`w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <Smile size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => submitComment(showCommentModal)}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog View Modal */}
          {viewingPost && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transition-colors duration-300 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
                <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold`}>
                      Y
                    </div>
                    <div>
                      <p className={`font-semibold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Your Blog</p>
                      <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Posted {formatTime(viewingPost.post.timestamp)} • {viewingPost.post.readTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseBlogView}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className={`p-6 space-y-4 overflow-y-auto max-h-[70vh] transition-colors duration-300`}>
                  <div className="space-y-4">
                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {viewingPost.post.title}
                    </h2>
                    <p className={`text-lg leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {viewingPost.post.content}
                    </p>
                    
                    <div className={`flex items-center justify-between pt-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                      <div className={`flex items-center gap-6 text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-2">
                          <Heart size={16} className="text-red-500" />
                          <span>{viewingPost.post.likes} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={16} className="text-blue-500" />
                          <span>{viewingPost.post.comments} comments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 size={16} className="text-purple-500" />
                          <span>{viewingPost.post.shares} shares</span>
                        </div>
                      </div>
                    </div>

                    {/* Notification Context */}
                    <div className={`rounded-lg p-4 border transition-colors duration-300 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Notification Context</h4>
                      <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        <strong>{viewingPost.user.name}</strong> {viewingPost.action.toLowerCase()} 
                        {viewingPost.content && (
                          <span> with: "{viewingPost.content}"</span>
                        )}
                      </p>
                      <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTime(viewingPost.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;