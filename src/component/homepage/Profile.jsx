import React, { useState } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import { MapPin, Link, Calendar, Heart, MessageCircle } from "lucide-react";
// import { PostCard } from '@/components/PostCard';

const PROFILE_DATA = {
  name: "Your Name",
  username: "yourname",
  avatar: "Y",
  bio: "Designer & Developer | Creating beautiful digital experiences | Coffee enthusiast ☕",
  location: "San Francisco, CA",
  website: "yourwebsite.com",
  joinDate: "Joined March 2023",
  followers: 2543,
  following: 1204,
  posts: 342,
};

const USER_POSTS = [
  {
    id: "1",
    author: {
      name: "Your Name",
      username: "yourname",
      avatar: "Y",
    },
    timestamp: "2 hours ago",
    content: "Just launched our new design system! 🎨",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    },
    stats: {
      likes: 1203,
      comments: 124,
      shares: 45,
    },
  },
];

const FOLLOWERS = [
  { id: 1, name: "Sarah Johnson", username: "sarahj", avatar: "S", isFollowing: true },
  { id: 2, name: "Alex Chen", username: "alexchen", avatar: "A", isFollowing: false },
  { id: 3, name: "Emma Davis", username: "emmadavis", avatar: "E", isFollowing: true },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "media", label: "Media" },
    { id: "tagged", label: "Tagged" },
    { id: "saved", label: "Saved" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="border-b border-border">

          {/* Cover Photo */}
          <div className="h-32 sm:h-48 md:h-64 bg-gradient-to-r from-primary/30 to-accent/30" />

          {/* Profile Info */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 relative">
            <div className="flex items-start justify-between gap-4">

              {/* Left Section */}
              <div className="flex-1 min-w-0">

                {/* Avatar */}
                <div className="flex items-end gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-2xl sm:text-4xl md:text-6xl -mt-8 sm:-mt-12 md:-mt-16 border-4 border-background">
                    {PROFILE_DATA.avatar}
                  </div>
                </div>

                {/* Name + Username */}
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground">
                  {PROFILE_DATA.name}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">@{PROFILE_DATA.username}</p>

                {/* Bio */}
                <p className="text-xs sm:text-sm md:text-base text-foreground mt-2 sm:mt-4 max-w-lg">
                  {PROFILE_DATA.bio}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{PROFILE_DATA.location}</span>
                    <span className="sm:hidden">{PROFILE_DATA.location.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link size={14} className="sm:w-4 sm:h-4" />
                    {PROFILE_DATA.website}
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    {PROFILE_DATA.joinDate}
                  </div>
                </div>

                {/* Followers / Following */}
                <div className="flex gap-3 sm:gap-6 mt-3 sm:mt-6 text-xs sm:text-sm">
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className="hover:underline"
                  >
                    <span className="font-bold text-foreground">
                      {PROFILE_DATA.following}
                    </span>{" "}
                    <span className="text-muted-foreground">Following</span>
                  </button>

                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="hover:underline"
                  >
                    <span className="font-bold text-foreground">
                      {PROFILE_DATA.followers}
                    </span>{" "}
                    <span className="text-muted-foreground">Followers</span>
                  </button>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold border-2 border-primary text-primary hover:bg-primary/10 transition-colors text-xs sm:text-base">
                  Edit
                </button>
                <button className="p-2 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-shadow">
                  <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4 sm:px-6">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 font-semibold border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="border-l border-r border-border">
          {activeTab === "posts" && (
            <div className="divide-y divide-border">
              {USER_POSTS.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="font-bold text-lg">No posts yet</h3>
                </div>
              ) : (
                USER_POSTS.map((post) => (
                  <PostCard
                    key={post.id}
                    author={post.author}
                    timestamp={post.timestamp}
                    content={post.content}
                    media={post.media}
                    stats={post.stats}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="grid grid-cols-3 gap-1 p-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}

          {activeTab === "tagged" && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-4xl mb-2">🏷️</div>
              <p className="text-muted-foreground">No tagged posts</p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-4xl mb-2">💾</div>
              <p className="text-muted-foreground">No saved posts</p>
            </div>
          )}
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card shadow-2xl animate-scale-in max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold">Followers</h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {FOLLOWERS.map((follower) => (
                <div
                  key={follower.id}
                  className="p-4 border-b border-border hover:bg-secondary/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold">
                      {follower.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{follower.name}</p>
                      <p className="text-xs text-muted-foreground">@{follower.username}</p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      follower.isFollowing
                        ? "bg-secondary text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {follower.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFollowingModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card shadow-2xl animate-scale-in max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold">Following</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {FOLLOWERS.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-b border-border hover:bg-secondary/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1 rounded-full text-sm font-semibold bg-secondary text-foreground">
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Profile;
