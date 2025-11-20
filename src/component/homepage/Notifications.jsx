import React from "react";
import Layout from "../ui/Layout";
import { Heart, MessageCircle, UserPlus, Share2, AtSign } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    user: { name: "Sarah Johnson", username: "sarahj", avatar: "S" },
    action: "liked your post",
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    user: { name: "Alex Chen", username: "alexchen", avatar: "A" },
    action: "commented on your post",
    timestamp: "15 minutes ago",
    isRead: false,
    content: "This is amazing! Love it! 🔥",
  },
  {
    id: "3",
    type: "follow",
    user: { name: "Emma Davis", username: "emmadavis", avatar: "E" },
    action: "started following you",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "mention",
    user: { name: "Marcus Wilson", username: "marcusw", avatar: "M" },
    action: "mentioned you in a post",
    timestamp: "3 hours ago",
    isRead: true,
    content: "@yourname check this out!",
  },
  {
    id: "5",
    type: "share",
    user: { name: "Lisa Park", username: "lisap", avatar: "L" },
    action: "shared your post",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: "6",
    type: "like",
    user: { name: "James Smith", username: "jsmith", avatar: "J" },
    action: "liked your post",
    timestamp: "8 hours ago",
    isRead: true,
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return (
        <div className="p-3 bg-accent/20 rounded-full">
          <Heart size={20} className="text-accent fill-current" />
        </div>
      );
    case "comment":
      return (
        <div className="p-3 bg-primary/20 rounded-full">
          <MessageCircle size={20} className="text-primary" />
        </div>
      );
    case "follow":
      return (
        <div className="p-3 bg-success/20 rounded-full">
          <UserPlus size={20} className="text-success" />
        </div>
      );
    case "share":
      return (
        <div className="p-3 bg-warning/20 rounded-full">
          <Share2 size={20} className="text-warning" />
        </div>
      );
    case "mention":
      return (
        <div className="p-3 bg-primary/20 rounded-full">
          <AtSign size={20} className="text-primary" />
        </div>
      );
    default:
      return null;
  }
};

const Notifications = () => {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto border-l border-r border-border min-h-screen">

        {/* Header */}
        <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Notifications</h2>

            {unreadCount > 0 && (
              <span className="px-2 sm:px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs sm:text-sm font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:shadow-lg transition-shadow whitespace-nowrap">
              All
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-secondary hover:bg-secondary/80 transition-colors whitespace-nowrap">
              Mentions
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-secondary hover:bg-secondary/80 transition-colors whitespace-nowrap">
              Replies
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-border">
          {NOTIFICATIONS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                All caught up!
              </h2>
              <p className="text-muted-foreground text-center">
                No new notifications. Check back later!
              </p>
            </div>
          ) : (
            NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 sm:p-6 hover:bg-secondary/30 transition-colors cursor-pointer border-l-4 ${
                  notification.isRead ? "border-l-transparent" : "border-l-primary"
                }`}
              >
                <div className="flex gap-3 sm:gap-4">

                  {/* Icon (Desktop Only) */}
                  <div className="flex-shrink-0 hidden sm:block">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">

                    {/* User + Action */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                        {notification.user.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground hover:underline text-sm sm:text-base">
                          {notification.user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {notification.action}
                        </p>
                      </div>
                    </div>

                    {/* Optional Content */}
                    {notification.content && (
                      <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-secondary rounded-lg">
                        <p className="text-xs sm:text-sm text-foreground">
                          {notification.content}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.timestamp}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}

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
