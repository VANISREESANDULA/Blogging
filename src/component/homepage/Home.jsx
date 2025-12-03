import React, { useEffect, useState } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import ComposerModal from "../ui/ComposerModal";
import CreateButton from "../ui/CreateButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../redux/authslice";
import { getArticles } from "../redux/authslice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user ,token} = useSelector((state) => state.auth);

  const { articles = [], loading = false } = useSelector(
    (state) => state.articles
  );

  console.log(articles);
  
  const [isComposerOpen, setIsComposerOpen] = useState(false);

useEffect(() => {
  if (token) {
    dispatch(getArticles());
  }
}, [dispatch, token]);

  useEffect(() => {
    console.log("📌 Articles Response Data:", articles);  
  }, [articles]);
 

  // Create post
  const handleNewPost = (postData) => {
    dispatch(
      createArticle({
        title: postData.title,
        content: postData.content,
        author:user._id,
      })
    );
    setIsComposerOpen(false);
  };
  const handleLike = () => {
  setIsLiked(!isLiked);

  dispatch(likeArticle(_id))
    .unwrap()
    .then(() => {
      dispatch(getArticles());
    })
    .catch((err) => {
      console.error("Like failed:", err);
      setIsLiked(isLiked);
    });
};


  // 🔥 Filter OUT logged-in user's own posts from Home
  const homePosts = user
    ? articles.filter((post) => post.author?._id !== user._id)
    : articles;

  return (
    <Layout>
      {/* Hero UI */}
      <div className="w-full h-60 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
            filter: "brightness(0.9)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/0 via-background/30 to-background/80" />

        <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 py-6 sm:py-8 max-w-5xl text-amber-50 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Discover what's new from the community ✨
          </p>
        </div>
      </div>

      {/* Home Posts */}
      <div className="max-w-5xl mx-auto min-h-screen mt-2">
        <div className="px-2">
          {loading ? (
            <div className="text-center py-12">Loading posts...</div>
          ) : homePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No posts from others yet
              </h2>
              <p className="text-muted-foreground text-center">
                Your posts will appear in your profile!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {homePosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
                >
                  <PostCard
                    _id={post._id}
                    user={post.user}
                    onLike={() => handleLike(post._id)}
                    author={{
                      name: post.user?.name ||post.author?.username ||post.author?.fullname||post.user.email||'Unknown',
                              username: post.author?.username||'unknown',
                              profilePhoto: post.author?.profilePhoto||post.user.profilePhoto||null
                       
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
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateButton onClick={() => setIsComposerOpen(true)} />
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPost={handleNewPost}
      />
    </Layout>
  );
};

export default Home;

// ---------------------------------------------------------------------------------



 