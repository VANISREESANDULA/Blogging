import React, { useState, useEffect } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import { Search, Filter, Clock, Globe, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getArticles } from "../redux/authslice";

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
    if (activeFilter === "recent") {
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

  // Background colors for light/dark mode - ONLY CHANGED THIS
  const bgColor = isDark ? "bg-gray-950" : "bg-orange-50";
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
                placeholder="Search posts Here ......."
                className={`w-full pl-12 pr-24 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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
                  className={`absolute right-10 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Clear
                </button>
              )}
             
            </div>
            
            {searchQuery && (
              <div className={`mt-2 text-sm ${textMutedColor}`}>
                Found <span className="font-semibold text-orange-500">{filteredPosts.length}</span> results for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Main Content Area - Full Width Posts */}
            <div>
              {/* Filters and Header */}
              <div className={`rounded-xl border ${borderColor} p-4 mb-6 ${bgCardColor}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-bold  text-orange-500 ${textColor} mb-1`}>
                      {searchQuery ? `Results for "${searchQuery}"` : "Explore Community Posts"}
                    </h2>
                    <p className={`text-sm ${textMutedColor}`}>
                      {filteredPosts.length} posts • Sorted by relevance
                    </p>
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