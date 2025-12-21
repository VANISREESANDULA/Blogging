import React, { useEffect, useState } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import ComposerModal from "../ui/ComposerModal";
import CreateButton from "../ui/CreateButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../redux/authslice";
import { getArticles } from "../redux/authslice";
import { PenTool, Users, BookOpen, Sparkles, ArrowRight} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { articles = [], loading = false } = useSelector(
    (state) => state.articles
  );

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [stats, setStats] = useState({ stories: 0, writers: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCommunityPosts, setShowCommunityPosts] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getArticles());
    }
    
    // Animate stats counter
    const timer = setTimeout(() => {
      setStats({ 
        stories: articles.length, 
        writers: new Set(articles.map(a => a.author?._id || a.user?._id)).size 
      });
      setIsAnimating(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, token, articles.length]);

  // Filter OUT logged-in user's own posts from Home
  const homePosts = React.useMemo(() => {
    if (!user || !user._id) return articles;
    
    return articles.filter((post) => {
      const postAuthorId = 
        post.author?._id || 
        post.user?._id || 
        post.author || 
        post.user;
      
      return postAuthorId !== user._id;
    });
  }, [articles, user]);

  // Create post
  const handleNewPost = (postData) => {
    dispatch(
      createArticle({
        title: postData.title,
        content: postData.content,
        author: user._id,
      })
    );
    setIsComposerOpen(false);
  };

  const handleLike = (postId) => {
    // Your like logic here
  };

  const handleExploreCommunity = () => {
    setShowCommunityPosts(true);
    // Scroll to community posts
    setTimeout(() => {
      document.getElementById('community-posts').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Layout>
      {/* Landing Page Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-xl mb-8 min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-rose-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative   z-10 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
            <div className="text-center">
              {/* Welcome Badge - Only show for logged in users */}
              {user && (
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse">
                  <Sparkles size={16} className="text-white mr-2" />
                  <span className="text-sm font-medium text-white">
                    Welcome back, {user.name || user.username}!
                  </span>
                </div>
              )}
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
                Drift your words
                <span className="block text-amber-200 mt-4">to the world</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Share your thoughts, stories, and ideas with a community of passionate writers
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => setIsComposerOpen(true)}
                className="group inline-flex items-center px-8 py-4 bg-white text-amber-700 font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-lg mb-12"
              >
                <PenTool size={20} className="mr-3" />
                Start Writing Now
                <ArrowRight size={20} className="ml-3 opacity-0 group-hover:opacity-100 group-hover:ml-4 transition-all" />
              </button>
              
              {/* Explore Community Button - Only show when there are posts */}
              {homePosts.length > 0 && !showCommunityPosts && (
                <div className="mt-6">
                  <button
                    onClick={handleExploreCommunity}
                    className="inline-flex items-center text-white/90 hover:text-white border-2 border-white/40 hover:border-white/80 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <Users size={18} className="mr-2" />
                    Explore community stories
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              )}
              
            
             
            </div>
          </div>
        </div>
        
        {/* Wave Divider - Only show at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
      </div>

      {/* Community Posts Section - Conditionally shown */}
      {(showCommunityPosts || homePosts.length === 0) && (
        <div id="community-posts" className="max-w-5xl mx-auto mt-8 sm:mt-12">
          <div className="px-4 sm:px-6 md:px-8">
            {loading ? (
              <div className="text-center py-12 text-lg">Loading posts...</div>
            ) : homePosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-6xl mb-6">🤝</div>
                <h2 className="text-2xl font-bold text-foreground mb-3 text-center">
                  No community posts yet
                </h2>
                <p className="text-muted-foreground text-center max-w-md mb-8">
                  Be the first to create a post and inspire others!
                </p>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all"
                >
                  <PenTool size={18} className="mr-2" />
                  Create First Post
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Latest from the community</h2>
                  <div className="text-sm text-gray-600">
                    {homePosts.length} stories • {stats.writers} writers
                  </div>
                </div>
                <div className="space-y-6">
                  {homePosts.map((post) => {
                    const authorName = 
                      post.user?.name || 
                      post.author?.username || 
                      post.author?.fullname || 
                      post.author?.name ||
                      post.user?.email || 
                      'Unknown User';
                    
                    const authorUsername = 
                      post.author?.username || 
                      'unknown';
                    
                    const profilePhoto = 
                      post.author?.profilePhoto || 
                      post.user?.profilePhoto || 
                      null;

                    return (
                      <div key={post._id}>
                        <PostCard
                          _id={post._id}
                          onLike={() => handleLike(post._id)}
                          author={{
                            name: authorName,
                            username: authorUsername,
                            profilePhoto: profilePhoto
                          }}
                          createdAt={post.createdAt}
                          title={post.title}
                          content={post.content}
                          stats={{
                            likes: post.likes?.length || post.likeCount || 0,
                            comments: post.comments?.length || 0,
                            shares: 0,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Create Button - Always visible */}
      <div className="fixed bottom-8 right-8 z-40">
        <CreateButton onClick={() => setIsComposerOpen(true)} />
      </div>
      
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPost={handleNewPost}
      />
    </Layout>
  );
};

export default Home;