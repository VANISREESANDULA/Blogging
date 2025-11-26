import React, { useState, useEffect, useRef } from "react";
import Layout from "../ui/Layout";
import { Heart, MessageCircle, UserPlus, Share2, AtSign, MoreHorizontal, UserCheck, Reply, ThumbsUp, Bookmark, X, Smile, Send, Image, Video, MapPin, Calendar, ExternalLink, Undo2, Bell, Check, Star, Mail } from "lucide-react";

// Enhanced notifications data with more realistic structure
const NOTIFICATIONS_DATA = [
  {
    id: "1",
    type: "like",
    user: { 
      name: "Sarah Johnson", 
      username: "sarahj", 
      avatar: "S",
      isFollowing: true,
      isVerified: true
    },
    action: "liked your post",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isRead: false,
    priority: "high",
    post: {
      id: "post1",
      content: "Just launched my new portfolio website! 🚀 So excited to share my latest work with everyone.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      url: "/posts/post1",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    id: "2",
    type: "comment",
    user: { 
      name: "Alex Chen", 
      username: "alexchen", 
      avatar: "A",
      isFollowing: false,
      isVerified: false
    },
    action: "commented on your post",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
    priority: "medium",
    content: "This is amazing! Love the design and attention to detail. 🔥",
    post: {
      id: "post2",
      content: "My latest UI design for a fitness app. What do you think?",
      likes: 42,
      comments: 12,
      shares: 5,
      isLiked: true,
      isBookmarked: false,
      url: "/posts/post2",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  },
  {
    id: "3",
    type: "follow",
    user: { 
      name: "Emma Davis", 
      username: "emmadavis", 
      avatar: "E",
      isFollowing: false,
      isVerified: true
    },
    action: "started following you",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: true,
    priority: "medium",
  },
  {
    id: "4",
    type: "mention",
    user: { 
      name: "Marcus Wilson", 
      username: "marcusw", 
      avatar: "M",
      isFollowing: true,
      isVerified: false
    },
    action: "mentioned you in a post",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    priority: "low",
    content: "@yourname check out this amazing design inspiration!",
    post: {
      id: "post3",
      content: "Great design resources shared by @yourname in the community!",
      likes: 15,
      comments: 3,
      shares: 1,
      isLiked: false,
      isBookmarked: true,
      url: "/posts/post3",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  },
  {
    id: "5",
    type: "share",
    user: { 
      name: "Lisa Park", 
      username: "lisap", 
      avatar: "L",
      isFollowing: true,
      isVerified: false
    },
    action: "shared your post",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
    priority: "low",
    post: {
      id: "post4",
      content: "The complete guide to modern React patterns and best practices.",
      likes: 89,
      comments: 23,
      shares: 15,
      isLiked: true,
      isBookmarked: false,
      url: "/posts/post4",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  }
];

const getNotificationIcon = (type) => {
  const baseClasses = "p-2 rounded-full group-hover:scale-105 transition-all duration-300";
  
  switch (type) {
    case "like":
      return (
        <div className={`${baseClasses} bg-red-50 group-hover:bg-red-100 border border-red-200`}>
          <Heart size={16} className="text-red-600 fill-current" />
        </div>
      );
    case "comment":
      return (
        <div className={`${baseClasses} bg-blue-50 group-hover:bg-blue-100 border border-blue-200`}>
          <MessageCircle size={16} className="text-blue-600" />
        </div>
      );
    case "follow":
      return (
        <div className={`${baseClasses} bg-green-50 group-hover:bg-green-100 border border-green-200`}>
          <UserPlus size={16} className="text-green-600" />
        </div>
      );
    case "share":
      return (
        <div className={`${baseClasses} bg-purple-50 group-hover:bg-purple-100 border border-purple-200`}>
          <Share2 size={16} className="text-purple-600" />
        </div>
      );
    case "mention":
      return (
        <div className={`${baseClasses} bg-cyan-50 group-hover:bg-cyan-100 border border-cyan-200`}>
          <AtSign size={16} className="text-cyan-600" />
        </div>
      );
    default:
      return null;
  }
};

const getPriorityBadge = (notification) => {
  const priorities = {
    high: { color: "bg-red-100 text-red-800 border border-red-200", label: "Important", icon: <Star size={12} /> },
    medium: { color: "bg-blue-100 text-blue-800 border border-blue-200", label: "Normal", icon: <Bell size={12} /> },
    low: { color: "bg-gray-100 text-gray-800 border border-gray-200", label: "Low", icon: <Mail size={12} /> }
  };
  
  const priority = notification.priority || "medium";
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 ${priorities[priority].color} text-xs rounded-full font-medium`}>
      {priorities[priority].icon}
      {priorities[priority].label}
    </span>
  );
};

// Play a short beep using Web Audio API
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 150);
  } catch (e) {
    // ignore audio errors (e.g., autoplay restrictions)
  }
};

// Show native browser notification (if allowed)
const showNativeNotification = (notif) => {
  try {
    if (window.Notification && Notification.permission === 'granted') {
      const title = notif.user?.name || 'Notification';
      const body = `${notif.action}` + (notif.post ? ` — ${notif.post.content.slice(0, 80)}` : '');
      const notification = new Notification(title, {
        body,
        icon: undefined,
        tag: notif.id
      });
      notification.onclick = () => window.focus();
    }
  } catch (e) {
    // ignore
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [viewingPost, setViewingPost] = useState(null);
  const [swipedNotification, setSwipedNotification] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showUndo, setShowUndo] = useState(false);
  const [removedNotification, setRemovedNotification] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const commentInputRefs = useRef({});
  const swipeStartX = useRef(0);
  const currentSwipeId = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Calculate notification insights
  const todayCount = notifications.filter(n => 
    new Date(n.timestamp).toDateString() === new Date().toDateString()
  ).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() > 0.7 && isOnline) {
        const newNotif = {
          id: Date.now().toString(),
          type: ["like", "comment", "follow"][Math.floor(Math.random() * 3)],
          user: {
            name: ["Taylor Swift", "John Doe", "Alice Cooper", "Bob Smith"][Math.floor(Math.random() * 4)],
            username: ["taylorswift", "johndoe", "alicecooper", "bobsmith"][Math.floor(Math.random() * 4)],
            avatar: ["T", "J", "A", "B"][Math.floor(Math.random() * 4)],
            isFollowing: Math.random() > 0.5,
            isVerified: Math.random() > 0.7
          },
          action: `${["liked", "commented on", "started following"][Math.floor(Math.random() * 3)]} your ${["post", "photo", "story"][Math.floor(Math.random() * 3)]}`,
          timestamp: new Date(),
          isRead: false,
          priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
          post: {
            id: `post${Date.now()}`,
            content: "Check out my latest update!",
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
            isLiked: false,
            isBookmarked: false,
            url: `/posts/post${Date.now()}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000))
          }
        };

        // Insert into main notifications list so it's persistent
        setNotifications(prev => [newNotif, ...prev].slice(0, 50));

        // Play audio and show native notification when available
        playBeep();
        showNativeNotification(newNotif);

        // Also show transient toast in the UI
        setLiveNotifications(prev => [newNotif, ...prev.slice(0, 4)]);

        // Remove transient toast after a while
        setTimeout(() => {
          setLiveNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 5000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  // Persist notifications to localStorage when they change
  useEffect(() => {
    try {
      const serializable = notifications.map(n => ({
        ...n,
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp,
        post: n.post ? {
          ...n.post,
          timestamp: n.post.timestamp instanceof Date ? n.post.timestamp.toISOString() : n.post.timestamp
        } : n.post
      }));
      localStorage.setItem('notifications', JSON.stringify(serializable));
    } catch (e) {
      // ignore storage errors
    }
  }, [notifications]);

  // Load notifications from localStorage on mount and request notification permission
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notifications');
      if (raw) {
        const parsed = JSON.parse(raw).map(n => ({
          ...n,
          timestamp: n.timestamp ? new Date(n.timestamp) : new Date(),
          post: n.post ? {
            ...n.post,
            timestamp: n.post.timestamp ? new Date(n.post.timestamp) : new Date()
          } : n.post
        }));
        setNotifications(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }

    if (window.Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "mentions") return notification.type === "mention";
    if (activeFilter === "replies") return notification.type === "comment";
    if (activeFilter === "important") return notification.priority === "high";
    return notification.type === activeFilter;
  });

  // Handle swipe gestures
  const handleSwipeStart = (notificationId, clientX) => {
    swipeStartX.current = clientX;
    currentSwipeId.current = notificationId;
    setSwipedNotification(notificationId);
  };

  const handleSwipeMove = (clientX) => {
    if (!currentSwipeId.current) return;
    
    const deltaX = clientX - swipeStartX.current;
    // Only allow right swipe (positive deltaX)
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, 120)); // Limit swipe to 120px
    }
  };

  const handleSwipeEnd = () => {
    if (swipeOffset > 80) { // Threshold for undo action
      const notificationToRemove = notifications.find(n => n.id === currentSwipeId.current);
      if (notificationToRemove) {
        setRemovedNotification(notificationToRemove);
        setNotifications(prev => prev.filter(n => n.id !== currentSwipeId.current));
        setShowUndo(true);
        
        // Auto hide undo after 5 seconds
        setTimeout(() => {
          if (showUndo) {
            setShowUndo(false);
            setRemovedNotification(null);
          }
        }, 5000);
      }
    }
    
    // Reset swipe state
    setSwipeOffset(0);
    setSwipedNotification(null);
    currentSwipeId.current = null;
  };

  // Handle undo action
  const handleUndo = () => {
    if (removedNotification) {
      setNotifications(prev => [removedNotification, ...prev]);
      setShowUndo(false);
      setRemovedNotification(null);
    }
  };

  // Touch event handlers
  const handleTouchStart = (notificationId, e) => {
    handleSwipeStart(notificationId, e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleSwipeMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleSwipeEnd();
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (notificationId, e) => {
    handleSwipeStart(notificationId, e.clientX);
  };

  const handleMouseMove = (e) => {
    if (currentSwipeId.current) {
      handleSwipeMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (currentSwipeId.current) {
      handleSwipeEnd();
    }
  };

  // Add global mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Toggle notification expansion
  const toggleExpansion = (notificationId) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
      // mark as read when expanding
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    }
    setExpandedNotifications(newExpanded);
  };

  // Handle view post - navigate to actual post
  const handleViewPost = (notification, event) => {
    event?.stopPropagation();
    if (notification.post?.url) {
      // In a real app, you would use react-router or window.location
      console.log(`Navigating to post: ${notification.post.url}`);
      // For demo purposes, we'll show a modal with post details
      setViewingPost(notification);
      
      // Simulate navigation delay
      setTimeout(() => {
        // This would be your actual navigation logic
        // navigate(notification.post.url);
      }, 300);
    }
  };

  // Close post view
  const handleClosePostView = () => {
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
    playBeep();
  };

  // Handle comment action
  const handleComment = (notificationId, event) => {
    event?.stopPropagation();
    setShowCommentModal(notificationId);
    setNewComment("");
  };

  // Handle share action
  const handleShare = (notificationId, event) => {
    event?.stopPropagation();
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === notificationId && notif.post) {
          return {
            ...notif,
            post: {
              ...notif.post,
              shares: notif.post.shares + 1
            }
          };
        }
        return notif;
      })
    );

    // Simulate native share dialog
    if (navigator.share) {
      navigator.share({
        title: 'Check this out!',
        text: 'Amazing content from this post',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

  // Handle bookmark action
  const handleBookmark = (notificationId, event) => {
    event?.stopPropagation();
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === notificationId && notif.post) {
          return {
            ...notif,
            post: {
              ...notif.post,
              isBookmarked: !notif.post.isBookmarked
            }
          };
        }
        return notif;
      })
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

  // Like a comment
  const likeComment = (notificationId, commentId) => {
    setPostComments(prev => ({
      ...prev,
      [notificationId]: prev[notificationId].map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1, isLiked: true }
          : comment
      )
    }));
  };

  // Get action buttons based on notification type
  const getActionButtons = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleLike(notification.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                notification.post.isLiked
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp size={14} className={notification.post.isLiked ? "fill-current" : ""} />
              {notification.post.isLiked ? "Liked" : "Like Back"}
            </button>
            <button
              onClick={(e) => handleComment(notification.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <Reply size={14} />
              Comment
            </button>
          </div>
        );
      case "comment":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleComment(notification.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <Reply size={14} />
              Reply
            </button>
            <button
              onClick={(e) => handleLike(notification.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                notification.post.isLiked
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp size={14} className={notification.post.isLiked ? "fill-current" : ""} />
              {notification.post.isLiked ? "Liked" : "Like"}
            </button>
          </div>
        );
      case "follow":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleFollow(notification.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                notification.user.isFollowing
                  ? "bg-white text-gray-700 border-gray-300"
                  : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              }`}
            >
              <UserCheck size={14} />
              {notification.user.isFollowing ? "Following" : "Follow Back"}
            </button>
            <button
              onClick={(e) => handleShare(notification.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        );
      case "mention":
      case "share":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => handleLike(notification.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                notification.post.isLiked
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp size={14} className={notification.post.isLiked ? "fill-current" : ""} />
              {notification.post.isLiked ? "Liked" : "Like"}
            </button>
            <button
              onClick={(e) => handleShare(notification.id, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Compact Notification Insights Component
  const NotificationInsights = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 mb-4">
      <h3 className="font-semibold text-gray-800 text-sm mb-2">Today's Activity</h3>
      <div className="grid grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-lg font-bold text-gray-800">{todayCount}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-600">
            {notifications.filter(n => n.type === 'like').length}
          </p>
          <p className="text-xs text-gray-600">Likes</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">
            {notifications.filter(n => n.type === 'comment').length}
          </p>
          <p className="text-xs text-gray-600">Comments</p>
        </div>
        <div>
          <p className="text-lg font-bold text-green-600">
            {notifications.filter(n => n.type === 'follow').length}
          </p>
          <p className="text-xs text-gray-600">Follows</p>
        </div>
      </div>
    </div>
  );

  // Enhanced Empty State
  const EnhancedEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mx-4 my-4 border border-blue-200 shadow-sm">
      <div className="w-24 h-24 mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full animate-pulse"></div>
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
          <Bell size={32} className="text-blue-500" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        All caught up! 🎉
      </h2>
      <p className="text-gray-600 max-w-sm text-sm">
        You're all up to date. New notifications will appear here.
      </p>
    </div>
  );

  return (
    <Layout>
      {/* Main container with professional gradient background */}
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative">

        {/* Live Notification Toast */}
        {liveNotifications.map((notification) => (
          <div
            key={notification.id}
            className="fixed top-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-sm animate-in slide-in-from-right-5 duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm">
                {notification.user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.user.name}
                </p>
                <p className="text-xs text-gray-600">
                  {notification.action}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Undo Snackbar */}
        {showUndo && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
            <Undo2 size={18} />
            <span>Notification removed</span>
            <button
              onClick={handleUndo}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Undo
            </button>
          </div>
        )}

        {/* Comment Modal */}
        {showCommentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-300 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="font-semibold text-gray-900">Add a comment</h3>
                <button
                  onClick={() => setShowCommentModal(null)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4 space-y-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold">
                    Y
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">You</p>
                    <p className="text-sm text-gray-600">Posting as yourself</p>
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={18} className="text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => submitComment(showCommentModal)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post View Modal */}
        {viewingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold">
                    Y
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your Post</p>
                    <p className="text-sm text-gray-600">
                      Posted {formatTime(viewingPost.post.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClosePostView}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                {viewingPost.post.image && (
                  <img 
                    src={viewingPost.post.image} 
                    alt="Post" 
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                )}
                
                <div className="space-y-4">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {viewingPost.post.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ThumbsUp size={16} className="text-red-500" />
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
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          handleLike(viewingPost.id, e);
                          handleClosePostView();
                        }}
                        className={`p-2 rounded-lg transition-colors border ${
                          viewingPost.post.isLiked 
                            ? "bg-red-600 text-white border-red-600" 
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <ThumbsUp size={16} className={viewingPost.post.isLiked ? "fill-current" : ""} />
                      </button>
                      <button
                        onClick={(e) => {
                          handleComment(viewingPost.id, e);
                          handleClosePostView();
                        }}
                        className="p-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          handleBookmark(viewingPost.id, e);
                          handleClosePostView();
                        }}
                        className={`p-2 rounded-lg transition-colors border ${
                          viewingPost.post.isBookmarked 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Bookmark size={16} className={viewingPost.post.isBookmarked ? "fill-current" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Notification Context */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Notification Context</h4>
                    <p className="text-gray-800 text-sm">
                      <strong>{viewingPost.user.name}</strong> {viewingPost.action.toLowerCase()} 
                      {viewingPost.content && (
                        <span> with: "{viewingPost.content}"</span>
                      )}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {formatTime(viewingPost.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Header Section */}
        <div className="sticky top-16 z-30 border-b border-gray-300 bg-white/95 backdrop-blur-xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-semibold animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Removed sound and native notification toggles and mark all read button */}
          </div>

          {/* Compact Notification Insights */}
          <NotificationInsights />

          {/* Compact Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { key: "all", label: "All", count: notifications.length },
              { key: "mentions", label: "Mentions", count: notifications.filter(n => n.type === "mention").length },
              { key: "replies", label: "Replies", count: notifications.filter(n => n.type === "comment").length },
              { key: "like", label: "Likes", count: notifications.filter(n => n.type === "like").length },
              { key: "follow", label: "Follows", count: notifications.filter(n => n.type === "follow").length },
              { key: "important", label: "Important", count: notifications.filter(n => n.priority === "high").length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap border ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeFilter === filter.key 
                      ? "bg-white/20 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="w-full divide-y divide-gray-300/60">
          {filteredNotifications.length === 0 ? (
            <EnhancedEmptyState />
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative overflow-hidden ${
                  swipedNotification === notification.id ? "cursor-grabbing" : "cursor-pointer"
                }`}
              >
                {/* Swipe background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-end pr-6 transition-opacity duration-200"
                  style={{
                    opacity: swipedNotification === notification.id ? (swipeOffset / 120) * 0.8 : 0
                  }}
                >
                  <div className="flex items-center gap-2 text-white">
                    <Undo2 size={18} />
                    <span className="font-medium text-sm">Swipe to remove</span>
                  </div>
                </div>

                {/* Notification content */}
                <div
                  onClick={() => toggleExpansion(notification.id)}
                  onTouchStart={(e) => handleTouchStart(notification.id, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => handleMouseDown(notification.id, e)}
                  style={{
                    transform: swipedNotification === notification.id ? `translateX(${swipeOffset}px)` : 'translateX(0)',
                    transition: swipedNotification === notification.id ? 'none' : 'transform 0.2s ease-out'
                  }}
                  className={`w-full p-4 transition-all duration-200 border-l-4 group relative ${
                    notification.isRead 
                      ? "border-l-transparent bg-white hover:bg-blue-50/30" 
                      : "border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 hover:from-blue-50 hover:to-indigo-50"
                  } ${expandedNotifications.has(notification.id) ? "bg-blue-50/50 shadow-inner" : ""} shadow-sm hover:shadow-md border-b border-gray-200`}
                >
                  {/* Quick Actions - Removed the checkmark button */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => handleComment(notification.id, e)}
                      className="p-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                    >
                      <Reply size={14} />
                    </button>
                  </div>

                  {/* Main Content */}
                  <div className="flex gap-3">
                    
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between mb-2 w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow border border-blue-500">
                              {notification.user.avatar}
                            </div>
                            {notification.user.isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-gray-900 hover:underline text-sm truncate">
                                {notification.user.name}
                              </p>
                              <span className="text-xs text-gray-600 hidden sm:inline">
                                @{notification.user.username}
                              </span>
                              {getPriorityBadge(notification)}
                            </div>
                            <p className="text-xs text-gray-700">
                              {notification.action}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(notification.timestamp)}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Optional Content */}
                      {notification.content && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-gray-300 w-full shadow-sm">
                          <p className="text-xs text-gray-800">
                            {notification.content}
                          </p>
                        </div>
                      )}

                      {/* Post Preview */}
                      {notification.post && expandedNotifications.has(notification.id) && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-300 space-y-3 w-full shadow-md">
                          {/* Post Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs border border-blue-500">
                                Y
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">You</p>
                                <p className="text-xs text-gray-500">
                                  Posted {formatTime(notification.post.timestamp)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleViewPost(notification, e)}
                              className="flex items-center gap-1 px-2 py-1 bg-white text-gray-600 rounded text-xs font-medium hover:bg-gray-50 transition-colors border border-gray-300"
                            >
                              <ExternalLink size={10} />
                              View Post
                            </button>
                          </div>

                          {notification.post.image && (
                            <img 
                              src={notification.post.image} 
                              alt="Post preview" 
                              className="w-full h-32 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {notification.post.content}
                          </p>
                          
                          {/* Post Stats */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <button 
                                onClick={(e) => handleLike(notification.id, e)}
                                className={`flex items-center gap-1 transition-colors ${
                                  notification.post.isLiked ? "text-red-500" : "hover:text-red-500"
                                }`}
                              >
                                <ThumbsUp size={12} className={notification.post.isLiked ? "fill-current" : ""} />
                                <span>{notification.post.likes}</span>
                              </button>
                              <button 
                                onClick={(e) => handleComment(notification.id, e)}
                                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle size={12} />
                                <span>{notification.post.comments}</span>
                              </button>
                              <button 
                                onClick={(e) => handleShare(notification.id, e)}
                                className="flex items-center gap-1 hover:text-purple-500 transition-colors"
                              >
                                <Share2 size={12} />
                                <span>{notification.post.shares}</span>
                              </button>
                            </div>
                            <button 
                              onClick={(e) => handleBookmark(notification.id, e)}
                              className={`flex items-center gap-1 transition-colors ${
                                notification.post.isBookmarked ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                              }`}
                            >
                              <Bookmark size={12} className={notification.post.isBookmarked ? "fill-current" : ""} />
                            </button>
                          </div>

                          {/* Comments Section */}
                          {postComments[notification.id] && (
                            <div className="mt-3 space-y-2 w-full">
                              <div className="border-t border-gray-300 pt-2">
                                <h4 className="text-xs font-semibold text-gray-700 mb-1">Comments</h4>
                                {postComments[notification.id].map((comment) => (
                                  <div key={comment.id} className="flex items-start gap-2 p-2 bg-blue-50/50 rounded w-full border border-blue-200">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs border border-blue-500">
                                      {comment.user.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <p className="text-xs font-semibold text-gray-800">{comment.user.name}</p>
                                        <p className="text-xs text-gray-500">{formatTime(comment.timestamp)}</p>
                                      </div>
                                      <p className="text-xs text-gray-700 mt-0.5">{comment.content}</p>
                                      <button 
                                        onClick={() => likeComment(notification.id, comment.id)}
                                        className="text-xs text-gray-500 hover:text-red-500 mt-0.5 flex items-center gap-0.5 transition-colors"
                                      >
                                        <ThumbsUp size={10} />
                                        {comment.likes > 0 && comment.likes}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {getActionButtons(notification)}

                      {/* Expand/Collapse Hint */}
                      {notification.post && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                            expandedNotifications.has(notification.id) 
                              ? "bg-blue-600" 
                              : "bg-gray-400"
                          }`} />
                          <p className="text-xs text-gray-500">
                            {expandedNotifications.has(notification.id) ? "Click to collapse" : "Click to view post"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Notifications;