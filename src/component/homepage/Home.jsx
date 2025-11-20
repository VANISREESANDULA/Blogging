// // import { useState } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// // import { addNotification } from "./redux/globalSlice";
// // import { useNavigate } from "react-router-dom";

// // const Home = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [postText, setPostText] = useState("");
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const [posts, setPosts] = useState([
// //     { id: 1, name: "Deva Patel", time: "2 hours ago", text: "Just finished Naruto anime...!" },
// //     { id: 2, name: "Deva Patel", time: "4 hours ago", text: "Good morning everyone!" },
// //   ]);

// //   const { followers, following, notifications } = useSelector(
// //     (state) => state.global
// //   );

// //   const handlePost = () => {
// //     if (!postText.trim()) return;

// //     const newPost = {
// //       id: Date.now(),
// //       name: "Raju Kumar",
// //       time: "Just now",
// //       text: postText,
// //     };

// //     setPosts([newPost, ...posts]);
// //     setPostText("");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex">

// //       {/* ================= SIDEBAR ================= */}
// //       <div
// //   className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col z-50
// //   transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
// //   transition-transform duration-300 md:translate-x-0`}
// // >

// //         <div className="p-4 border-b flex justify-between items-center">
// //           <h1 className="text-2xl font-semibold text-purple-700">EveryTale</h1>

// //           {/* Close button in mobile */}
// //           <button
// //             className="md:hidden text-xl"
// //             onClick={() => setSidebarOpen(false)}
// //           >
// //             ✖
// //           </button>
// //         </div>

// //         <div className="p-4 flex flex-col gap-4 text-gray-700">
// //           <button
// //             className="flex items-center gap-2 hover:text-purple-600"
// //             onClick={() => navigate("/home")}
// //           >
// //             <span>🏠</span> Home
// //           </button>

// //           <button
// //             className="flex items-center gap-2 hover:text-purple-600"
// //             onClick={() => navigate("/add-friends")}
// //           >
// //             <span>👥</span> Add Friends
// //           </button>

// //           <button className="flex items-center gap-2 hover:text-purple-600">
// //             <span>📰</span> News
// //           </button>

// //           <button className="flex items-center gap-2 hover:text-purple-600">
// //             <span>⚽</span> Sports
// //           </button>

// //           <button className="flex items-center gap-2 hover:text-purple-600">
// //             <span>🎵</span> Music
// //           </button>

// //           <button className="flex items-center gap-2 hover:text-purple-600">
// //             <span>🔍</span> Explore
// //           </button>

// //           <button className="flex items-center gap-2 hover:text-purple-600"
// //           onClick={() => navigate("/SettingsPage")}>
// //             <span>⚙️</span> Settings
// //           </button>
// //         </div>
// //       </div>

// //       {/* ================= MAIN CONTENT ================= */}
// //       <div className="flex-1 flex flex-col md:ml-0 ml-0">

// //         {/* ======= Top Header ======= */}
// //         <div
// //           className="p-4 flex items-center justify-between h-50 bg-cover bg-center relative"
// //           style={{
// //             backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
// //             filter: "brightness(0.8)",
// //           }}
// //         >
// //           {/* Mobile menu button */}
// //           <button
// //             className="md:hidden text-3xl text-white absolute left-4"
// //             onClick={() => setSidebarOpen(true)}
// //           >
// //             ☰
// //           </button>

// //           <div className="flex items-center gap-3 ml-12 md:ml-0">
// //             <img
// //               src="/Profile Icon.png"
// //               alt="Profile"
// //               className="w-20 h-20 rounded-full"
// //             />
// //             <div className="text-white">
// //               <h2 className="font-bold">Raju Kumar</h2>
// //               <p className="text-sm opacity-90">
// //                 {followers} Followers · {following} Following
// //               </p>
// //             </div>
// //           </div>

// //           {/* Search Bar */}
// //           <div className="w-1/3 hidden md:block">
// //             <input
// //               type="text"
// //               placeholder="🔍Search..."
// //               className="w-full px-3 py-2 border-2 rounded-full text-black shadow-[0px_0px_15px_1px_rgba(0,0,0,0.5)]  bg-orange-100/50"
// //             />
// //           </div>

// //           {/* Notification icons */}

// //           <div style={{
// //     backgroundImage: 'url("/notification.png")',
// //     backgroundSize: "cover",

// //     backgroundPosition: "center",
// //     width: "30px",
// //     height: "30px"
// //   }}
// // >


// //           </div>
// //           {/* <div className="flex items-center gap-6 text-xl text-white">
// //             <div className="relative">
// //               <i className="fa-regular fa-bell cursor-pointer"></i>
// //               {notifications.length > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full" style={{
// //     backgroundImage: 'url("/notification.png")',
// //     filter: 'brightness(1)' 
// //   }}>
// //                   {notifications.length}
// //                 </span>
// //               )}
// //             </div>
// //             <i className="fa-regular fa-envelope cursor-pointer"></i>
// //             <i className="fa-regular fa-user cursor-pointer"></i>
// //           </div> */}
// //         </div>

// //         {/* ======= Notification Test Button ======= */}
// //         {/* <div className="p-6">
// //           <button
// //             onClick={() =>
// //               dispatch(addNotification("New comment on your post!"))
// //             }
// //             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
// //           >
// //             Add Notification
// //           </button>
// //         </div> */}

// //         {/* ======= Posts Section ======= */}
// //         <div className="p-6 space-y-6">

// //           {/* Create Post */}
// //           <div className="bg-white p-4 rounded-lg shadow-md">
// //             <textarea
// //               className="w-full p-2 border rounded-lg"
// //               placeholder="What's on your mind?"
// //               value={postText}
// //               onChange={(e) => setPostText(e.target.value)}
// //             ></textarea>
// //             <button
// //               onClick={handlePost}
// //               className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2"
// //             >
// //               Post
// //             </button>
// //           </div>

// //           {/* Render posts */}
// //           {posts.map((post) => (
// //             <div
// //               key={post.id}
// //               className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
// //             >
// //               <div className="flex items-center gap-3">
// //                 <img
// //                   src="/Profile Icon.png"
// //                   alt="User"
// //                   className="w-10 h-10 rounded-full"
// //                 />
// //                 <div>
// //                   <h4 className="font-semibold">{post.name}</h4>
// //                   <p className="text-sm text-gray-500">{post.time}</p>
// //                 </div>
// //               </div>
// //               <p className="mt-2">{post.text}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Home;



import React, { useState } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import ComposerModal from "../ui/ComposerModal";
import CreateButton from "../ui/CreateButton";
import { useNavigate } from "react-router-dom";

const SAMPLE_POSTS = [
  {
    id: "1",
    author: { name: "Sarah Johnson", username: "sarahj", avatar: "S" },
    timestamp: "2 hours ago",
    content:
      "Just launched our new design system! So excited about the possibilities this opens up for our team. 🎨✨\n\nThe colors, spacing, and typography are now all unified across our products. This is going to make development so much faster.",
    stats: { likes: 1203, comments: 124, shares: 45 },
  },
  {
    id: "2",
    author: { name: "Alex Chen", username: "alexchen", avatar: "A" },
    timestamp: "4 hours ago",
    content:
      "Coffee, code, and creativity. That's the perfect combo for a productive Friday morning ☕💻\n\nWorking on something cool that I can't wait to share with everyone!",
    stats: { likes: 892, comments: 87, shares: 23 },
  },
  {
    id: "3",
    author: { name: "Emma Davis", username: "emmadavis", avatar: "E" },
    timestamp: "6 hours ago",
    content:
      "Design tip: Always consider accessibility from the start. It's not an afterthought—it's part of good design.\n\nHere are some principles we follow:\n1. Contrast ratios matter\n2. Typography should be legible\n3. Navigation should be intuitive\n4. Test with real users",
    stats: { likes: 2341, comments: 201, shares: 89 },
  },
  {
    id: "4",
    author: { name: "Marcus Wilson", username: "marcusw", avatar: "M" },
    timestamp: "8 hours ago",
    content:
      "Just finished reading an amazing article on modern frontend architecture. The insights about component composition really changed how I think about building scalable apps.",
    stats: { likes: 567, comments: 43, shares: 12 },
  },
  {
    id: "5",
    author: { name: "Lisa Park", username: "lisap", avatar: "L" },
    timestamp: "10 hours ago",
    content:
      "Reminder: Your mental health is just as important as your physical health. Take breaks, step away from the screen, and do something that makes you happy today. 🌿💚",
    stats: { likes: 3456, comments: 234, shares: 156 },
  },
];

const Home = () => {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const navigate=useNavigate()
  const handleNewPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      author: { name: "Your Name", username: "yourname", avatar: "Y" },
      timestamp: "now",
      content: postData.content,
      stats: { likes: 0, comments: 0, shares: 0 },
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full h-60 relative overflow-hidden">
        {/* sm:h-64 md:h-80 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat "
          style={{
           backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
            filter: "brightness(0.9)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/0 via-background/30 to-background/80" />

        <div className="relative h-full flex flex-col justify-end px-4 pl-0 sm:px-6 py-6 sm:py-8 max-w-5xl  text-amber-50 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground  mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Share your thoughts and connect with the community
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-5xl mx-auto  min-h-screen  mt-2">
        <div className="px-2">
          {posts.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        No posts yet
      </h2>
      <p className="text-muted-foreground text-center">
        Be the first to create a post! Click the button below to get started.
      </p>
    </div>
  ) :  (
            <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
        >
          <PostCard
            author={post.author}
            timestamp={post.timestamp}
            content={post.content}
            media={post.media}
            stats={post.stats}
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
