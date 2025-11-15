import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../component/redux/globalSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { followers, following, notifications } = useSelector(
    (state) => state.global
  );

  return (
    <div className="min-h-screen bg-gray-100 flex" >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold text-purple-700">EveryTale</h1>
        </div>
        <div className="p-4 flex flex-col gap-4 text-gray-700">
          <button className="flex items-center gap-2 hover:text-purple-600">
            <span>🏠</span> Home
          </button>
          <button className="flex items-center gap-2 hover:text-purple-600">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-500 p-4 flex items-center justify-between h-50.5 text-black bg-cover bg-centerbg-no-repeat" style={{
    backgroundImage: 'url("/Screenshot 2025-11-13 232324.png")',
    filter: 'brightness(0.6)' 
  }}>
          <div className="flex items-center gap-3">
            <img
              src="/Profile Icon.png"
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="font-bold">Raju Kumar</h2>
              <p className="text-sm opacity-80">
                {followers} Followers    {following} Following
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search..." 
              className="w-full px-3 py-2 border rounded-full text-black focus:outline-none"
            />
          </div>

          {/* Icons with Notification */}
          <div className="flex items-center gap-6 text-xl relative">
            <div className="relative">
              <i className="fa-regular fa-bell cursor-pointer"></i>
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
            <i className="fa-regular fa-envelope cursor-pointer"></i>
            <i className="fa-regular fa-user cursor-pointer"></i>
          </div>
        </div>

        {/* Notification Test Button */}
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

        {/* Posts Section */}
        <div className="p-8 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none"
              placeholder="What's on your mind?"
            ></textarea>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2">
              Post
            </button>
          </div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/Profile Icon.png"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">Deva Patel</h4>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="mt-2">Just finished this Naruto anime...!</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Home;
