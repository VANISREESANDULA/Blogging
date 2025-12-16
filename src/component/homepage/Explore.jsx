import React, { useState, useEffect } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import { Search, TrendingUp, Filter, Hash, Users, Zap, Globe, Clock, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getArticles } from "../redux/authslice";

const TRENDING_TOPICS = [
  { topic: "Design Trends", hashtag: "#DesignTrends", posts: "45.2K", trending: true },
  { topic: "Web Development", hashtag: "#WebDevelopment", posts: "32.8K", trending: true },
  { topic: "ReactJS", hashtag: "#ReactJS", posts: "28.5K", trending: true },
  { topic: "UX Design", hashtag: "#UXDesign", posts: "19.3K", trending: false },
  { topic: "AI & ML", hashtag: "#ArtificialIntelligence", posts: "15.7K", trending: true },
  { topic: "Startup Culture", hashtag: "#StartupLife", posts: "12.4K", trending: false },
];

const SUGGESTED_PEOPLE = [
  { name: "Alex Chen", followers: "12.5K", verified: true },
  { name: "Maria Garcia", followers: "8.7K", verified: true },
  { name: "David Kim", followers: "5.3K", verified: false },
  { name: "Sarah Johnson", followers: "3.9K", verified: true },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const dispatch = useDispatch();
  
  const { articles = [], loading = false } = useSelector((state) => state.articles);
  const { user, token } = useSelector((state) => state.auth);
  const isDark = useSelector((state) => state.theme.isDark);

  // Fetch articles when component mounts
  useEffect(() => {
    if (token) {
      dispatch(getArticles());
    }
  }, [dispatch, token]);

  // Filter posts based on search query
  useEffect(() => {
    let result = articles;
    
    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => {
        if (post.title?.toLowerCase().includes(query)) return true;
        if (post.content?.toLowerCase().includes(query)) return true;
        const authorName = post.author?.username || post.author?.email || '';
        if (authorName.toLowerCase().includes(query)) return true;
        if (post.author?.email?.toLowerCase().includes(query)) return true;
        if (post.user?.name?.toLowerCase().includes(query)) return true;
        return false;
      });
    }
    
    // Apply type filter
    if (activeFilter === "trending") {
      result = result.filter(post => post.likes?.length > 10 || post.comments?.length > 5);
    } else if (activeFilter === "recent") {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredPosts(result);
  }, [searchQuery, articles, activeFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Background colors for light/dark mode
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const bgCardColor = isDark ? "bg-gray-900" : "bg-white";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const textMutedColor = isDark ? "text-gray-400" : "text-gray-600";
  const hoverBgColor = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const activeBgColor = isDark ? "bg-gray-800" : "bg-blue-50";

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-300 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`}>
                  Discover Amazing Content
                </h1>
                <p className={`text-sm sm:text-base ${textMutedColor}`}>
                  Explore posts, topics, and creators from around the community
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className={`text-sm ${textMutedColor}`}>
                  <span className="font-semibold text-lg">{articles.length}</span> posts available
                </div>
                <div className={`text-sm ${textMutedColor}`}>
                  <span className="font-semibold text-lg">{TRENDING_TOPICS.length}</span> trending topics
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts, topics, people, or hashtags..."
                className={`w-full pl-12 pr-24 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-900 text-gray-200 placeholder-gray-500 border border-gray-800"
                    : "bg-white text-gray-900 placeholder-gray-500 border border-gray-300 shadow-sm"
                }`}
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-16 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Clear
                </button>
              )}
              <span
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded ${
                  isDark
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                ⌘K
              </span>
            </div>
            
            {searchQuery && (
              <div className={`mt-2 text-sm ${textMutedColor}`}>
                Found <span className="font-semibold text-blue-500">{filteredPosts.length}</span> results for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trending Topics Card */}
              <div
                className={`rounded-xl border ${borderColor} overflow-hidden transition-all duration-300 ${bgCardColor}`}
              >
                <div
                  className={`px-4 py-3 border-b ${borderColor} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className={isDark ? "text-yellow-500" : "text-yellow-600"} />
                    <h3 className={`font-semibold ${textColor}`}>Trending Topics</h3>
                  </div>
                  <Globe size={16} className={textMutedColor} />
                </div>
                
                <div className="p-4 space-y-3">
                  {TRENDING_TOPICS.map((topic) => (
                    <button
                      key={topic.hashtag}
                      onClick={() => setSearchQuery(topic.hashtag)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-300 group ${hoverBgColor}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Hash size={14} className={isDark ? "text-blue-400" : "text-blue-600"} />
                            <span className={`font-medium text-sm ${textColor}`}>
                              {topic.hashtag}
                            </span>
                            {topic.trending && (
                              <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className={`text-xs ${textMutedColor}`}>{topic.topic}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                            {topic.posts}
                          </span>
                          <span className={`text-xs ${textMutedColor}`}>posts</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className={`px-4 py-3 border-t ${borderColor}`}>
                  <button
                    className={`w-full text-center text-sm font-medium py-1.5 rounded-lg transition-colors ${
                      isDark
                        ? "text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                        : "text-blue-600 hover:text-blue-700 hover:bg-gray-100"
                    }`}
                  >
                    View all topics →
                  </button>
                </div>
              </div>

              {/* Suggested People Card */}
              <div
                className={`rounded-xl border ${borderColor} overflow-hidden ${bgCardColor}`}
              >
                <div className={`px-4 py-3 border-b ${borderColor}`}>
                  <div className="flex items-center gap-2">
                    <Users size={18} className={isDark ? "text-purple-500" : "text-purple-600"} />
                    <h3 className={`font-semibold ${textColor}`}>Suggested Creators</h3>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {SUGGESTED_PEOPLE.map((person) => (
                    <div
                      key={person.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`font-medium text-sm truncate ${textColor}`}>
                            {person.name}
                          </span>
                          {person.verified && (
                            <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-[8px] text-white">✓</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-xs ${textMutedColor}`}>{person.followers} followers</p>
                      </div>
                      <button
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area - Full Width Posts */}
            <div className="lg:col-span-3">
              {/* Filters and Header */}
              <div className={`rounded-xl border ${borderColor} p-4 mb-6 ${bgCardColor}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-bold ${textColor} mb-1`}>
                      {searchQuery ? `Results for "${searchQuery}"` : "Explore Community Posts"}
                    </h2>
                    <p className={`text-sm ${textMutedColor}`}>
                      {filteredPosts.length} posts • Sorted by relevance
                    </p>
                  </div>
                  
                  {/* Filter Buttons */}
                  <div className="flex items-center gap-2">
                    <Filter size={16} className={textMutedColor} />
                    <div className="flex overflow-x-auto pb-2">
                      {[
                        { key: "all", label: "All Posts", icon: <Globe size={14} /> },
                        { key: "trending", label: "Trending", icon: <TrendingUp size={14} /> },
                        { key: "recent", label: "Recent", icon: <Clock size={14} /> },
                      ].map((filter) => (
                        <button
                          key={filter.key}
                          onClick={() => setActiveFilter(filter.key)}
                          className={`flex-shrink-0 px-3 py-1.5 mx-1 rounded-lg flex items-center gap-1.5 text-sm transition-all duration-300 ${
                            activeFilter === filter.key
                              ? isDark
                                ? "bg-blue-600 text-white"
                                : "bg-blue-600 text-white"
                              : isDark
                              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {filter.icon}
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Posts List */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                    <p className={`text-lg font-medium ${textColor} mb-1`}>Loading Posts</p>
                    <p className={`text-sm ${textMutedColor}`}>Fetching the latest content...</p>
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div
                  className={`rounded-xl border ${borderColor} p-8 sm:p-12 text-center ${bgCardColor}`}
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <Search size={32} className={isDark ? "text-gray-600" : "text-gray-400"} />
                  </div>
                  <h3 className={`text-xl font-bold ${textColor} mb-2`}>
                    {searchQuery ? "No matching posts found" : "No posts available"}
                  </h3>
                  <p className={`max-w-md mx-auto text-sm ${textMutedColor} mb-6`}>
                    {searchQuery
                      ? `We couldn't find any posts matching "${searchQuery}". Try searching with different keywords or explore trending topics.`
                      : "Be the first to create a post and inspire the community!"}
                  </p>
                  {searchQuery ? (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={clearSearch}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          isDark
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        }`}
                      >
                        Clear Search
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        Browse All Posts
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Full Width Posts List (Single Column) */}
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <PostCard
                        key={post._id}
                          _id={post._id}
                          user={post.user}
                          author={{
                            name: post.author?.username || post.user?.name || post.user?.email?.split('@')[0] || 'Unknown',
                            username: post.author?.username || post.user?.username || 'unknown',
                            profilePhoto: post.author?.profilePhoto || post.user?.profilePhoto || null
                          }}
                          timestamp={post.createdAt}
                          title={post.title}
                          content={post.content}
                          stats={{
                            likes: post.likes?.length || post.likeCount || 0,
                            comments: post.comments?.length || 0,
                            shares: 0,
                          }}
                        />
                       
                    ))}
                  </div>

                  {/* Load More / Pagination */}
                  {filteredPosts.length > 0 && (
                    <div className="mt-8 flex justify-center">
                      <button
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isDark
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        }`}
                      >
                        Load More Posts
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;