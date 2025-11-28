// import React, { useState } from "react";
// import Layout from "../ui/Layout";
// import PostCard from "../ui/PostCard";
// import ComposerModal from "../ui/ComposerModal";
// import CreateButton from "../ui/CreateButton";
// import { useNavigate } from "react-router-dom";
// import { fetchArticles } from "../redux/articlesSlice";

// const SAMPLE_POSTS = [
//   {
//     id: "1",
//     author: { name: "Sarah Johnson", username: "sarahj", avatar: "S" },
//     timestamp: "2 hours ago",
//     content:
//       "Just launched our new design system! So excited about the possibilities this opens up for our team. 🎨✨\n\nThe colors, spacing, and typography are now all unified across our products. This is going to make development so much faster.",
//     stats: { likes: 1203, comments: 124, shares: 45 },
//   },
//   {
//     id: "2",
//     author: { name: "Alex Chen", username: "alexchen", avatar: "A" },
//     timestamp: "4 hours ago",
//     content:
//       "Coffee, code, and creativity. That's the perfect combo for a productive Friday morning ☕💻\n\nWorking on something cool that I can't wait to share with everyone!",
//     stats: { likes: 892, comments: 87, shares: 23 },
//   },
//   {
//     id: "3",
//     author: { name: "Emma Davis", username: "emmadavis", avatar: "E" },
//     timestamp: "6 hours ago",
//     content:
//       "Design tip: Always consider accessibility from the start. It's not an afterthought—it's part of good design.\n\nHere are some principles we follow:\n1. Contrast ratios matter\n2. Typography should be legible\n3. Navigation should be intuitive\n4. Test with real users",
//     stats: { likes: 2341, comments: 201, shares: 89 },
//   },
//   {
//     id: "4",
//     author: { name: "Marcus Wilson", username: "marcusw", avatar: "M" },
//     timestamp: "8 hours ago",
//     content:
//       "Just finished reading an amazing article on modern frontend architecture. The insights about component composition really changed how I think about building scalable apps.",
//     stats: { likes: 567, comments: 43, shares: 12 },
//   },
//   {
//     id: "5",
//     author: { name: "Lisa Park", username: "lisap", avatar: "L" },
//     timestamp: "10 hours ago",
//     content:
//       "Reminder: Your mental health is just as important as your physical health. Take breaks, step away from the screen, and do something that makes you happy today. 🌿💚",
//     stats: { likes: 3456, comments: 234, shares: 156 },
//   },
// ];

// const Home = () => {
//   const [posts, setPosts] = useState(SAMPLE_POSTS);
//   const [isComposerOpen, setIsComposerOpen] = useState(false);
//   const navigate=useNavigate()
//   const dispatch = useDispatch();
//   const handleNewPost = (postData) => {
//     const newPost = {
//       id: Date.now().toString(),
//       author: { name: "Your Name", username: "yourname", avatar: "Y" },
//       timestamp: "now",
//       content: postData.content,
//       stats: { likes: 0, comments: 0, shares: 0 },
//     };

//     setPosts([newPost, ...posts]);
//   };

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <div className="w-full h-60 relative overflow-hidden">
//         {/* sm:h-64 md:h-80 */}
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat "
//           style={{
//            backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
//             filter: "brightness(0.9)",
//           }}
//         />
//         <div className="absolute inset-0 bg-linear-to-br from-background/0 via-background/30 to-background/80" />

//         <div className="relative h-full flex flex-col justify-end px-4 pl-0 sm:px-6 py-6 sm:py-8 max-w-5xl  text-amber-50 mx-auto">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground  mb-2">
//             Welcome Back!
//           </h1>
//           <p className="text-muted-foreground text-sm sm:text-base">
//             Share your thoughts and connect with the community
//           </p>
//         </div>
//       </div>

//       {/* Posts Section */}
//       <div className="max-w-5xl mx-auto  min-h-screen  mt-2">
//         <div className="px-2">
//           {posts.length === 0 ? (
//     <div className="flex flex-col items-center justify-center py-12 px-4">
//       <div className="text-6xl mb-4">📝</div>
//       <h2 className="text-2xl font-bold text-foreground mb-2">
//         No posts yet
//       </h2>
//       <p className="text-muted-foreground text-center">
//         Be the first to create a post! Click the button below to get started.
//       </p>
//     </div>
//   ) :  (
//             <div className="space-y-6">
//       {posts.map((post) => (
//         <div
//           key={post.id}
//           className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
//         >
//           <PostCard
//             author={post.author}
//             timestamp={post.timestamp}
//             content={post.content}
//             media={post.media}
//             stats={post.stats}
//           />
//         </div>
//       ))}
//     </div>
//           )}
//         </div>
//       </div>

//       {/* Create Post Button */}
//       <CreateButton onClick={() => setIsComposerOpen(true)} />

//       {/* Composer Modal */}
//       <ComposerModal
//         isOpen={isComposerOpen}
//         onClose={() => setIsComposerOpen(false)}
//         onPost={handleNewPost}
//       />
//     </Layout>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import ComposerModal from "../ui/ComposerModal";
import CreateButton from "../ui/CreateButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, createArticle } from "../redux/authslice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Get articles + loading from Redux store
  const { list: articles, loading } = useSelector((state) => state.articles);

  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Fetch articles when Home loads
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Handle creating new article
  const handleNewPost = (postData) => {
    dispatch(createArticle({ content: postData.content }));
    setIsComposerOpen(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full h-60 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
            filter: "brightness(0.9)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/0 via-background/30 to-background/80" />

        <div className="relative h-full flex flex-col justify-end px-4 pl-0 sm:px-6 py-6 sm:py-8 max-w-5xl text-amber-50 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Share your thoughts and connect with the community
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-5xl mx-auto min-h-screen mt-2">
        <div className="px-2">
          {loading ? (
            <div className="text-center py-12">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No articles yet
              </h2>
              <p className="text-muted-foreground text-center">
                Be the first to create a post!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
                >
                  <PostCard
                    author={{
                      name: post.author?.name || "Unknown",
                      username: post.author?.username || "unknown",
                      avatar: post.author?.name?.[0] || "U",
                    }}
                    timestamp={post.createdAt}
                    content={post.content}
                    stats={{
                      likes: post.likes?.length || 0,
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

      {/* Create Post Button */}
      <CreateButton onClick={() => setIsComposerOpen(true)} />

      {/* Composer Modal */}
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPost={handleNewPost}
      />
    </Layout>
  );
};

export default Home;
