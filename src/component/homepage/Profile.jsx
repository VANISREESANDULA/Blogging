import React, { useState, useRef, useEffect } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import { MapPin, Calendar, X, Upload, Camera, Edit2, Search, User, Mail, Check, UserPlus, UserMinus, MoreVertical } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { getArticles } from "../redux/authslice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null);
  const [croppedProfileImage, setCroppedProfileImage] = useState(null);
  const [croppedBackgroundImage, setCroppedBackgroundImage] = useState(null);
  const [followUsername, setFollowUsername] = useState("");
  const [showFollowRequest, setShowFollowRequest] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalType, setActiveModalType] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const cropperRef = useRef(null);

  // Fetch articles when profile mounts
  useEffect(() => {
    if (token) {
      dispatch(getArticles());
    }
  }, [dispatch, token]);

  // Redux state
  const isDark = useSelector((state) => state.theme.isDark);
  const { user } = useSelector((state) => state.auth);
  const { articles = [] } = useSelector((state) => state.articles);



  const followers = user?.followers || [];
  const following = user?.following || [];
  // Debug user data
  useEffect(() => {
    if (user) {
      console.log("🔍 USER DATA:", user);
      console.log("📸 PROFILE PHOTO:", user.profilePhoto);
      console.log("👥 Followers Count:", user.followers?.length || 0);
      console.log("👤 Following Count:", user.following?.length || 0);
    }
  }, [user]);

  // Filter posts for current user
  const userPosts = user && Array.isArray(articles)
    ? articles.filter((post) => {
      return (
        (post.author?._id === user._id) ||
        (post.author === user._id) ||
        (post.user?._id === user._id) ||
        (post.author?.username === user.username)
      );
    })
    : [];

  // Local profile data
  const [localProfileData, setLocalProfileData] = useState({
    name: user?.username || "nikhil",
    username: user?.username || "nikhil",
    email: user?.email || "nikhil@gmail.com",
    avatar: user?.profilePhoto || null,
    bio: user?.bio || "Blogger || Traveller",
    location: user?.location || "India",
    joinDate: user?.createdAt
      ? `Joined ${new Date(user.createdAt).getFullYear()}`
      : "Joined 2014",
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0,
    background: user?.backgroundPhoto || null,
  });

  // Update localProfileData when user changes
  useEffect(() => {
    if (user) {
      setLocalProfileData(prev => ({
        ...prev,
        name: user.username || prev.name,
        username: user.username || prev.username,
        email: user.email || prev.email,
        avatar: user.profilePhoto || prev.avatar,
        bio: user.bio || prev.bio,
        location: user.location || prev.location,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
      }));
    }
  }, [user]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
    location: "",
  });

  const tabs = [{ id: "posts", label: "Your Posts" }];

  // Avatar renderer - RESPONSIVE (Fixed to match Layout component)
  const renderAvatar = () => {
    // Use the same logic as in Layout component
    const avatarSrc = croppedProfileImage || user?.profilePhoto || localProfileData.avatar;

    if (avatarSrc) {
      // Format the avatar source exactly like in Layout component
      const formattedSrc = avatarSrc.startsWith("data:")
        ? avatarSrc
        : `data:image/png;base64,${avatarSrc}`;

      return (
        <img
          src={formattedSrc}
          alt={localProfileData.name}
          className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 sm:border-3 md:border-4 border-white"
          onError={(e) => {
            console.error("Failed to load profile image");
            e.target.style.display = "none";
          }}
          onLoad={() => console.log("Profile image loaded successfully")}
        />
      );
    }

    // Fallback to initial
    return (
      <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl border-2 sm:border-3 md:border-4 border-white">
        {localProfileData.name?.charAt(0)?.toUpperCase() || "N"}
      </div>
    );
  };

  // Edit dialog open
  const handleEditClick = () => {
    setEditFormData({
      name: localProfileData.name,
      bio: localProfileData.bio,
      location: localProfileData.location,
    });
    setShowEditDialog(true);
  };

  // Edit form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropType("profile");
    };
    reader.readAsDataURL(file);
  };

  // Background photo upload
  const handleBackgroundPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropType("background");
    };
    reader.readAsDataURL(file);
  };

  // Crop save
  const handleCropSave = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);

              if (cropType === "profile") {
                setCroppedProfileImage(imageUrl);
              } else if (cropType === "background") {
                setCroppedBackgroundImage(imageUrl);
              }

              alert(
                `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} photo updated!`
              );
            }
          },
          "image/png"
        );
      }
    }
    setImageToCrop(null);
    setCropType(null);
  };

  // Edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedProfileData = {
      ...localProfileData,
      name: editFormData.name,
      bio: editFormData.bio,
      location: editFormData.location,
      avatar: croppedProfileImage || localProfileData.avatar,
      background: croppedBackgroundImage || localProfileData.background,
    };

    setLocalProfileData(updatedProfileData);

    setCroppedProfileImage(null);
    setCroppedBackgroundImage(null);

    alert("Profile updated successfully!");
    setShowEditDialog(false);
  };

  const postsCount = userPosts?.length || 0;

  const handleSendFollowRequest = async () => {
    if (!followUsername.trim()) {
      alert("Enter a valid username");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://robo-1-qqhu.onrender.com/api/follow/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUsername: followUsername
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send follow request");
        return;
      }

      alert("Follow request sent!");
      setFollowUsername("");
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  // Open modal
  const openModal = (type) => {
    setActiveModalType(type);
    if (type === "followers") {
      setShowFollowersModal(true);
    } else {
      setShowFollowingModal(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    setSearchQuery("");
  };

  // Filter users based on search
  const getFilteredUsers = () => {
    const users = activeModalType === "followers" ? user?.followers : user?.following;
    if (!users || !Array.isArray(users)) return [];

    return users.filter(userItem => {
      const username = typeof userItem === 'object' ? userItem.username || userItem.email?.split('@')[0] || '' : '';
      const email = typeof userItem === 'object' ? userItem.email || '' : '';
      return username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  // Custom UserCheck icon component
  const UserCheck = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );

  // Render user item for modal
  const renderUserItem = (userItem, index) => {
    const isFollower = activeModalType === "followers";
    const userName = typeof userItem === 'object'
      ? userItem.username || userItem.email?.split('@')[0] || 'Unknown User'
      : `User ${index + 1}`;

    const userEmail = typeof userItem === 'object' ? userItem.email || '' : '';
    // const userAvatar = typeof userItem === 'object' ? userItem.profilePhoto : null;
    const userAvatar =
      typeof userItem === "object" && typeof userItem.profilePhoto === "string"
        ? userItem.profilePhoto
        : null;

    const userId = typeof userItem === 'object' ? userItem._id : index;

    const initial = userName?.charAt(0)?.toUpperCase() || 'U';

    return (
      <div
        key={`${activeModalType}-${userId}`}
        className={`group p-3 xs:p-4   transition-all duration-300 ${isDark
            ? "hover:bg-gray-900/50 border-gray-800"
            : "hover:bg-gray-50 border-gray-200"
          } border-b last:border-b-0`}
      >
        <div className="flex items-center  justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0 ">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {userAvatar ? (
                <img
                  src={
                    userAvatar
                      ? userAvatar.startsWith("data:")
                        ? userAvatar
                        : `data:image/png;base64,${userAvatar}`
                      : undefined
                  }
                  alt={userName}
                  className="w-10 h-10 xs:w-12 xs:h-12 rounded-full object-cover border-2"
                  onError={(e) => {
                    console.error("Failed to load user avatar");
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-10 h-10 xs:w-12 xs:h-12 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'
                      } flex items-center justify-center text-white font-bold text-sm">
                        ${initial}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className={`w-10 h-10 xs:w-12 xs:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-300'
                  }`}>
                  {initial}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-sm xs:text-base truncate ${isDark ? "text-gray-100" : "text-gray-900"
                }`}>
                {userName}
              </h4>
              {userEmail && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Mail size={10} className={isDark ? "text-gray-400" : "text-gray-500"} />
                  <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                    {userEmail}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                  {isFollower ? "Follows you" : "You follow"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-3">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isFollower
                  ? isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                  : isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
                }`}
            >
              {isFollower ? (
                <>
                  <UserPlus size={12} />
                  <span className="hidden xs:inline">Follow Back</span>
                </>
              ) : (
                <>
                  <Check size={12} />
                  <span className="hidden xs:inline">Following</span>
                </>
              )}
            </button>

            <button
              className={`p-1.5 rounded-full transition-colors ${isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                }`}
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-orange-50"}`}>
        {/* RESPONSIVE CONTAINER */}
        <div className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-3 xs:py-4 sm:py-5 md:py-6">

          {/* Profile Header - RESPONSIVE */}
          <div className={`shadow-lg transition-colors duration-300 rounded-xl sm:rounded-2xl md:rounded-3xl ${isDark ? "bg-gray-900 border border-gray-800" : "bg-orange-100"} mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8`}>

            {/* Profile Info Section - RESPONSIVE */}
            <div className={`p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl ${isDark ? "bg-gray-900" : "bg-orange-100"}`}>
              <div className="flex justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                {renderAvatar()}
              </div>

              {/* Name and Email - RESPONSIVE */}
              <div className="text-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                <h1 className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-300 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                  {localProfileData.name}
                </h1>
                <p className={`text-xs xs:text-sm sm:text-base md:text-lg transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"} mt-1 xs:mt-2`}>
                  {localProfileData.email}
                </p>
              </div>

              {/* Stats Row - RESPONSIVE */}
              <div className="flex justify-center gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
                <div className="text-center">
                  <div className={`text-lg xs:text-xl sm:text-2xl font-bold transition-colors duration-300 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {postsCount}
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Posts
                  </div>
                </div>
                <button
                  onClick={() => openModal("followers")}
                  className="text-center cursor-pointer group"
                >
                  <div className={`text-lg xs:text-xl sm:text-2xl font-bold transition-colors duration-300 group-hover:text-orange-600 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {user?.followers?.length || 0}
                  </div>
                  <div className={`text-xs transition-colors duration-300 group-hover:text-orange-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Followers
                  </div>
                </button>
                <button
                  onClick={() => openModal("following")}
                  className="text-center cursor-pointer group"
                >
                  <div className={`text-lg xs:text-xl sm:text-2xl font-bold transition-colors duration-300 group-hover:text-orange-600 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {user?.following?.length || 0}
                  </div>
                  <div className={`text-xs transition-colors duration-300 group-hover:text-orange-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Following
                  </div>
                </button>
              </div>

              {/* Bio - RESPONSIVE */}
              <div className="text-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                <p className={`text-xs xs:text-sm sm:text-base transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"} px-2`}>
                  {localProfileData.bio}
                </p>
              </div>

              {/* Location and Join Date - RESPONSIVE */}
              <div className="flex flex-col xs:flex-row justify-center items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 text-xs">
                <div className={`flex items-center gap-1 transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">{localProfileData.location}</span>
                </div>
                <span className={`hidden xs:inline transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-500"}`}>•</span>
                <div className={`flex items-center gap-1 transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <Calendar size={12} className="shrink-0" />
                  <span>{localProfileData.joinDate}</span>
                </div>
              </div>

              {/* Edit Profile Button - RESPONSIVE */}
              <div className="flex justify-center mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8">
                <button
                  onClick={handleEditClick}
                  className={`flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2 rounded-full font-semibold transition-colors text-xs xs:text-sm sm:text-base ${isDark
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                >
                  <Edit2 size={12} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Follow Request Input - RESPONSIVE */}
              {showFollowRequest && (
                <div className="mt-3 xs:mt-4 sm:mt-5 md:mt-6 text-center">
                  <h3 className={`text-xs xs:text-sm sm:text-base font-semibold mb-1 xs:mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                    Send Follow Request
                  </h3>
                  <div className="flex flex-col xs:flex-row justify-center gap-1 xs:gap-2">
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={followUsername}
                      onChange={(e) => setFollowUsername(e.target.value)}
                      className={`w-full xs:w-48 sm:w-56 md:w-64 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border text-xs xs:text-sm
                        ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-orange-200"}`}
                    />
                    <button
                      onClick={handleSendFollowRequest}
                      className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg font-semibold text-xs xs:text-sm
                        ${isDark ? "bg-orange-600 text-white" : "bg-orange-500 text-white"}`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Posts Tab - RESPONSIVE */}
          <div className={`rounded-lg sm:rounded-xl shadow-lg transition-colors duration-300 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-orange-100"}`}>
            {/* Tab Header - RESPONSIVE */}
            <div className={`border-b transition-colors duration-300 ${isDark ? "border-gray-800" : "border-orange-200"} px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-3 sm:py-4`}>
              <div className="flex gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-1.5 xs:py-2 font-semibold border-b-2 transition-colors text-xs xs:text-sm sm:text-base whitespace-nowrap ${activeTab === tab.id
                      ? `border-orange-500 ${isDark ? "text-orange-300" : "text-orange-600"}`
                      : `border-transparent ${isDark
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                      }`
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Content - RESPONSIVE */}
            <div className="p-3 xs:p-4 sm:p-5 md:p-6">
              {activeTab === "posts" && (
                <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
                  {userPosts && userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        _id={post._id}
                        user={post.user}
                        author={{
                          name: post.user?.name || post.author?.username || post.author?.fullname || post.user.email || 'Unknown',
                          username: post.author?.username || 'unknown',
                          profilePhoto: post.author?.profilePhoto || post.user.profilePhoto || null
                        }}
                        timestamp={post.createdAt}
                        title={post.title}
                        content={post.content}
                        stats={{
                          likes: post.likes?.length || post.likeCount || 0,
                          comments: post.comments?.length || 0,
                          shares: 0,
                        }}
                        isProfilePost={true}
                      />
                    ))
                  ) : (
                    <div className={`flex flex-col items-center justify-center py-6 xs:py-8 sm:py-10 md:py-12 transition-colors duration-300 ${isDark ? "text-gray-300" : ""}`}>
                      <div className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl mb-2 xs:mb-3 sm:mb-4 text-gray-400">📝</div>
                      <h3 className={`font-bold text-sm xs:text-base sm:text-lg md:text-xl ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                        No posts yet
                      </h3>
                      <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base max-w-xs xs:max-w-sm sm:max-w-md`}>
                        Start sharing your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

     
        {/* Edit Profile Dialog - RESPONSIVE */}
{showEditDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-1 xs:p-2 sm:p-3 md:p-4">
    <div
      className={
        isDark
          ? "absolute inset-0 bg-black/70 backdrop-blur-sm"
          : "absolute inset-0 bg-black/40 backdrop-blur-sm"
      }
      onClick={() => setShowEditDialog(false)}
    />
    <div
      className={`relative w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl max-h-[85vh] xs:max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300 ${isDark
        ? "bg-gray-900 border border-gray-800 text-gray-100"
        : "bg-orange-100"
        }`}
    >
      <div
        className={`flex items-center justify-between px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-3 sm:py-4 border-b transition-colors duration-300 ${isDark ? "border-gray-800" : "border-orange-200"
          }`}
      >
        <h2
          className={`text-base  xs:text-lg sm:text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"
            }`}
        >
          Edit Profile
        </h2>
        <button
          onClick={() => setShowEditDialog(false)}
          className={`p-0.5 xs:p-1 transition-colors ${isDark
            ? "text-gray-300 hover:text-gray-100"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <X size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div
        className={`overflow-y-auto flex-1 p-3 xs:p-4 sm:p-5 md:p-6 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-orange-100"
          }`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
          {/* Profile Photo Upload - RESPONSIVE */}
          <div className="space-y-1 xs:space-y-2 sm:space-y-3">
            <label
              className={`block text-xs xs:text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              Profile Photo
            </label>
            <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3 sm:gap-4">
              <div
                className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl border-2 xs:border-3 sm:border-4 overflow-hidden ${isDark ? "border-gray-800" : "border-white"
                  }`}
              >
                {croppedProfileImage || localProfileData.avatar ? (
                  <img
                    src={
                      croppedProfileImage ||
                      (localProfileData.avatar?.startsWith("data:")
                        ? localProfileData.avatar
                        : `data:image/png;base64,${localProfileData.avatar}`)
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load edit dialog profile image");
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  localProfileData.name?.charAt(0)?.toUpperCase() || "Y"
                )}
              </div>
              <div className="text-center xs:text-left">
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className={`cursor-pointer px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg hover:transition-colors flex items-center justify-center gap-1 xs:gap-2 text-xs xs:text-sm ${isDark
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                >
                  <Upload size={12} className="xs:w-3 xs:h-3" />
                  Change Photo
                </label>
                <p
                  className={`text-xs mt-0.5 xs:mt-1 ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Recommended: Square image, at least 400x400 pixels
                </p>
              </div>
            </div>
            {croppedProfileImage && (
              <div
                className={
                  isDark
                    ? "mt-1 xs:mt-2 p-1.5 xs:p-2 bg-green-900 rounded-lg border border-green-700"
                    : "mt-1 xs:mt-2 p-1.5 xs:p-2 bg-green-50 rounded-lg border border-green-200"
                }
              >
                <p
                  className={`text-xs xs:text-sm ${isDark ? "text-green-300" : "text-green-700"
                    }`}
                >
                  ✓ New profile photo ready to save
                </p>
              </div>
            )}
          </div>

          {/* Name Field - RESPONSIVE */}
          <div className="space-y-0.5 xs:space-y-1 sm:space-y-2">
            <label
              htmlFor="name"
              className={`block text-xs xs:text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              className={`w-full px-2 xs:px-3 py-1.5 xs:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs xs:text-sm sm:text-base ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "border border-orange-200 bg-white text-gray-900"
                }`}
              placeholder="Enter your name"
            />
          </div>

          {/* Bio Field - RESPONSIVE */}
          <div className="space-y-0.5 xs:space-y-1 sm:space-y-2">
            <label
              htmlFor="bio"
              className={`block text-xs xs:text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={editFormData.bio}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-2 xs:px-3 py-1.5 xs:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-xs xs:text-sm sm:text-base ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "border border-orange-200 bg-white text-gray-900"
                }`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Location Field - RESPONSIVE */}
          <div className="space-y-0.5 xs:space-y-1 sm:space-y-2">
            <label
              htmlFor="location"
              className={`block text-xs xs:text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={editFormData.location}
              onChange={handleInputChange}
              className={`w-full px-2 xs:px-3 py-1.5 xs:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs xs:text-sm sm:text-base ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "border border-orange-200 bg-white text-gray-900"
                }`}
              placeholder="Where are you based?"
            />
          </div>

          {/* Action Buttons - RESPONSIVE */}
          <div className="flex flex-col xs:flex-row gap-1 xs:gap-2 sm:gap-3 pt-2 xs:pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditDialog(false);
                setCroppedProfileImage(null);
                setCroppedBackgroundImage(null);
              }}
              className={`flex-1 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:transition-colors text-xs xs:text-sm sm:text-base ${isDark
                ? "border border-gray-700 text-gray-200 hover:bg-gray-800"
                : "border border-orange-300 text-gray-700 hover:bg-orange-50"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg transition-colors text-xs xs:text-sm sm:text-base ${isDark
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        {/* Image Cropper Modal - RESPONSIVE */}
        {imageToCrop && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-1 xs:p-2 sm:p-3 md:p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setImageToCrop(null);
                setCropType(null);
              }}
            />
            <div className="relative bg-white p-2 xs:p-3 sm:p-4 rounded-lg shadow-xl w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl h-[60vh] xs:h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">
                  Crop {cropType === "profile" ? "Profile" : "Background"} Photo
                </h3>
                <button
                  onClick={() => {
                    setImageToCrop(null);
                    setCropType(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden rounded-md">
                <Cropper
                  ref={cropperRef}
                  src={imageToCrop}
                  className="w-full h-full"
                  stencilProps={{
                    aspectRatio: cropType === "profile" ? 1 : 3,
                    movable: true,
                    resizable: true,
                    lines: true,
                    handlers: true,
                  }}
                  stencilSize={{
                    width: cropType === "profile" ? "70%" : "80%",
                    height: cropType === "profile" ? "70%" : "40%",
                  }}
                  imageRestriction="fit-area"
                />
              </div>

              <div className="flex flex-col xs:flex-row justify-between items-center gap-1 xs:gap-2 sm:gap-0 pt-2 xs:pt-3 sm:pt-4 mt-2 xs:mt-3 sm:mt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setImageToCrop(null);
                    setCropType(null);
                  }}
                  className="w-full xs:w-auto px-3 xs:px-4 py-1.5 xs:py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-xs xs:text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="w-full xs:w-auto px-3 xs:px-4 py-1.5 xs:py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-xs xs:text-sm sm:text-base"
                >
                  Save Cropped Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Followers/Following Modal */}
        {(showFollowersModal || showFollowingModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4">
            {/* Backdrop */}
            <div
              className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-black/70" : "bg-black/50"} backdrop-blur-sm`}
              onClick={closeModal}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-sm xs:max-w-md sm:max-w-lg mx-auto rounded-xl shadow-2xl max-h-[80vh] xs:max-h-[85vh] overflow-hidden flex flex-col transition-all duration-300 transform ${isDark
                ? "bg-gray-900 border border-gray-800"
                : "bg-orange-100 border border-orange-200"
              }`}>

              {/* Modal Header */}
              <div className={`px-4 xs:px-5 sm:px-6 py-4 border-b ${isDark ? "border-gray-800" : "border-orange-200"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? "bg-gray-800/30" : "bg-orange-200"}`}>
                      <User className={isDark ? "text-orange-400" : "text-orange-500"} size={20} />
                    </div>
                    <div>
                      <h2 className={`text-lg xs:text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                        {activeModalType === "followers" ? "Followers" : "Following"}
                      </h2>
                      <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {getFilteredUsers().length} {getFilteredUsers().length === 1 ? "person" : "people"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className={`p-1.5 rounded-full transition-colors ${isDark
                      ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                      : "hover:bg-orange-200 text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-colors ${isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/30"
                      : "bg-white border-orange-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                      } focus:outline-none focus:ring-2`}
                  />
                </div>
              </div>

              {/* Modal Content - User List */}
              <div className="flex-1 overflow-y-auto">
                {getFilteredUsers().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 xs:py-16">
                    <div className={`p-4 rounded-full ${isDark ? "bg-gray-800" : "bg-orange-200"} mb-4`}>
                      <User className={isDark ? "text-gray-400" : "text-gray-500"} size={32} />
                    </div>
                    <h3 className={`text-base xs:text-lg font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      No {activeModalType} found
                    </h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} max-w-xs text-center px-4`}>
                      {searchQuery ? "Try a different search term" : `No ${activeModalType} yet`}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {getFilteredUsers().map((userItem, index) =>
                      renderUserItem(userItem, index)
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`px-4 xs:px-5 sm:px-6 py-3 border-t ${isDark ? "border-gray-800 bg-gray-900/50" : "border-orange-200 bg-orange-50/50"}`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${isDark
                      ? "bg-gray-800 text-gray-300"
                      : "bg-orange-200 text-gray-700"
                      }`}>
                      Total: {user?.[activeModalType]?.length || 0}
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-orange-200 hover:bg-orange-300 text-gray-700"
                      }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;