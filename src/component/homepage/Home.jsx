// import React, { useEffect, useState } from "react";
// import Layout from "../ui/Layout";
// import PostCard from "../ui/PostCard";
// import ComposerModal from "../ui/ComposerModal";
// import CreateButton from "../ui/CreateButton";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { createArticle } from "../redux/authslice";
// import { getArticles } from "../redux/authslice";

// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, token } = useSelector((state) => state.auth);
//   const { articles = [], loading = false } = useSelector(
//     (state) => state.articles
//   );

//   console.log("All articles:", articles);
//   console.log("Current user:", user);

//   const [isComposerOpen, setIsComposerOpen] = useState(false);

//   useEffect(() => {
//     if (token) {
//       dispatch(getArticles());
//     }
//   }, [dispatch, token]);

//   // Filter OUT logged-in user's own posts from Home
//   const homePosts = React.useMemo(() => {
//     if (!user || !user._id) return articles;
    
//     return articles.filter((post) => {
//       // Try multiple possible paths to author ID
//       const postAuthorId = 
//         post.author?._id || 
//         post.user?._id || 
//         post.author || 
//         post.user;
      
//       console.log("Post author ID:", postAuthorId, "User ID:", user._id);
//       console.log("Should exclude?", postAuthorId === user._id);
      
//       return postAuthorId !== user._id;
//     });
//   }, [articles, user]);

//   console.log("Filtered posts (excluding mine):", homePosts);

//   // Create post
//   const handleNewPost = (postData) => {
//     dispatch(
//       createArticle({
//         title: postData.title,
//         content: postData.content,
//         author: user._id,
//       })
//     );
//     setIsComposerOpen(false);
//   };

//   const handleLike = (postId) => {
//     // Your like logic here
//   };

//   return (
//     <Layout>
//       {/* Hero UI - RESPONSIVE */}
//       <div className="w-full h-48 sm:h-52 md:h-60 relative overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
//             filter: "brightness(0.9)",
//           }}
//         />
//         <div className="absolute inset-0 bg-black/20" />

//         <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto text-amber-50">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2">
//             Welcome Back!
//           </h1>
//           <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
//              Drift your words to the world 🌀
//           </p>
//         </div>
//       </div>

//       {/* Home Posts - RESPONSIVE */}
//       <div className="max-w-5xl mx-auto min-h-screen mt-1 sm:mt-2">
//         <div className="px-2 sm:px-4 md:px-6">
//           {loading ? (
//             <div className="text-center py-8 sm:py-10 md:py-12 text-sm sm:text-base">
//               Loading posts...
//             </div>
//           ) : homePosts.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4">
//               <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🤝</div>
//               <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-foreground mb-1 sm:mb-2 text-center">
//                 {articles.length > 0 ? "Only your posts available" : "No posts yet"}
//               </h2>
//               <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md">
//                 {articles.length > 0 
//                   ? "Other users haven't posted anything yet!" 
//                   : "Be the first to create a post!"}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4 sm:space-y-5 md:space-y-6">
//               {homePosts.map((post) => {
//                 // Determine author name from various possible data structures
//                 const authorName = 
//                   post.user?.name || 
//                   post.author?.username || 
//                   post.author?.fullname || 
//                   post.author?.name ||
//                   post.user?.email || 
//                   'Unknown User';
                
//                 const authorUsername = 
//                   post.author?.username || 
//                   'unknown';
                
//                 const profilePhoto = 
//                   post.author?.profilePhoto || 
//                   post.user?.profilePhoto || 
//                   null;

//                 return (
//                   <PostCard
//                     key={post._id}
//                     _id={post._id}
//                     onLike={() => handleLike(post._id)}
//                     author={{
//                       name: authorName,
//                       username: authorUsername,
//                       profilePhoto: profilePhoto
//                     }}
//                     createdAt={post.createdAt}
//                     title={post.title}
//                     content={post.content}
//                     stats={{
//                       likes: post.likes?.length || post.likeCount || 0,
//                       comments: post.comments?.length || 0,
//                       shares: 0,
//                     }}
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <CreateButton onClick={() => setIsComposerOpen(true)} />
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
import { createArticle } from "../redux/authslice";
import { getArticles } from "../redux/authslice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { articles = [], loading = false } = useSelector(
    (state) => state.articles
  );

  console.log("All articles:", articles);
  console.log("Current user:", user);

  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getArticles());
    }
  }, [dispatch, token]);

  // Filter OUT logged-in user's own posts from Home
  const homePosts = React.useMemo(() => {
    if (!user || !user._id) return articles;
    
    return articles.filter((post) => {
      // Try multiple possible paths to author ID
      const postAuthorId = 
        post.author?._id || 
        post.user?._id || 
        post.author || 
        post.user;
      
      console.log("Post author ID:", postAuthorId, "User ID:", user._id);
      console.log("Should exclude?", postAuthorId === user._id);
      
      return postAuthorId !== user._id;
    });
  }, [articles, user]);

  console.log("Filtered posts (excluding mine):", homePosts);

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

  return (
    <Layout>
      {/* Hero UI - RESPONSIVE */}
      <div className="w-full h-40 sm:h-48 md:h-52 lg:h-60 relative overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
            filter: "brightness(0.9)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative h-full flex flex-col justify-end px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-6 lg:py-8 max-w-5xl mx-auto text-amber-50">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-1 sm:mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Drift your words to the world 🌀
          </p>
        </div>
      </div>
        {/* Home Posts - RESPONSIVE */}
        <div className="max-w-5xl mx-auto min-h-screen mt-1 sm:mt-2 md:mt-3 lg:mt-4">
          <div className="px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6">
          {loading ? (
            <div className="text-center py-8 sm:py-10 md:py-12 text-sm sm:text-base md:text-lg">Loading posts...</div>
          ) : homePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-5">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 sm:mb-3 md:mb-4">🤝</div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 sm:mb-2 text-center">
                {articles.length > 0 ? "Only your posts available" : "No posts yet"}
              </h2>
              <p className="text-muted-foreground text-center text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-lg">
                {articles.length > 0 
                  ? "Other users haven't posted anything yet!" 
                  : "Be the first to create a post!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {homePosts.map((post) => {
                // Determine author name from various possible data structures
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
                  <div key={post._id} className="px-0 sm:px-0 md:px-0">
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