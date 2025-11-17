import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "./redux/globalSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [posts, setPosts] = useState([
    { id: 1, name: "Deva Patel", time: "2 hours ago", text: "Just finished Naruto anime...!" },
    { id: 2, name: "Deva Patel", time: "4 hours ago", text: "Good morning everyone!" },
  ]);

  const { followers, following, notifications } = useSelector(
    (state) => state.global
  );

  const handlePost = () => {
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      name: "Raju Kumar",
      time: "Just now",
      text: postText,
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= SIDEBAR ================= */}
      <div
  className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col z-50
  transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
  transition-transform duration-300 md:translate-x-0`}
>

        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-purple-700">EveryTale</h1>

          {/* Close button in mobile */}
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 text-gray-700">
          <button
            className="flex items-center gap-2 hover:text-purple-600"
            onClick={() => navigate("/home")}
          >
            <span>🏠</span> Home
          </button>

          <button
            className="flex items-center gap-2 hover:text-purple-600"
            onClick={() => navigate("/add-friends")}
          >
            <span>👥</span> Add Friends
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>📰</span> News
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>⚽</span> Sports
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>🎵</span> Music
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>🔍</span> Explore
          </button>

          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>⚙️</span> Settings
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col md:ml-0 ml-0">

        {/* ======= Top Header ======= */}
        <div
          className="p-4 flex items-center justify-between h-50 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url("/Screenshot 2025-11-13 232324.png.jpg")',
            filter: "brightness(0.8)",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="md:hidden text-3xl text-white absolute left-4"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="flex items-center gap-3 ml-12 md:ml-0">
            <img
              src="/Profile Icon.png"
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div className="text-white">
              <h2 className="font-bold">Raju Kumar</h2>
              <p className="text-sm opacity-90">
                {followers} Followers · {following} Following
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-1/3 hidden md:block">
            <input
              type="text"
              placeholder="🔍Search..."
              className="w-full px-3 py-2 border-2 rounded-full text-black shadow-[0px_0px_15px_1px_rgba(0,0,0,0.5)]  bg-orange-100/50"
            />
          </div>

          {/* Notification icons */}
          <div className="flex items-center gap-6 text-xl text-white">
            <div className="relative">
              <i className="fa-regular fa-bell cursor-pointer"></i>
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
            <i className="fa-regular fa-envelope cursor-pointer"></i>
            <i className="fa-regular fa-user cursor-pointer"></i>
          </div>
        </div>

        {/* ======= Notification Test Button ======= */}
        <div className="p-6">
          <button
            onClick={() =>
              dispatch(addNotification("New comment on your post!"))
            }
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Add Notification
          </button>
        </div>

        {/* ======= Posts Section ======= */}
        <div className="p-6 space-y-6">

          {/* Create Post */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <textarea
              className="w-full p-2 border rounded-lg"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>
            <button
              onClick={handlePost}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Post
            </button>
          </div>

          {/* Render posts */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/Profile Icon.png"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{post.name}</h4>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
              <p className="mt-2">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
