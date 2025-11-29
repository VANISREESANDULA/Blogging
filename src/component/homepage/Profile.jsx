import React, { useState, useRef } from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";
import { MapPin, Calendar, X, Upload, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

const USER_POSTS = [
  {
    id: "1",
    author: {
      name: "Your Name",
      username: "yourname",
      avatar: "Y",
    },
    timestamp: "2 hours ago",
    content: "Just launched our new design system! 🎨",
    media: {
      type: "image",
      src: "https://th.bing.com/th/id/OIP.DMp_AOnNy76EtRHZhXTdzwHaNK?w=115&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    stats: {
      likes: 1203,
      comments: 124,
      shares: 45,
    },
  },
];

const FOLLOWERS = [
  { id: 1, name: "Sarah Johnson", username: "sarahj", avatar: "S", isFollowing: true },
  { id: 2, name: "Alex Chen", username: "alexchen", avatar: "A", isFollowing: false },
  { id: 3, name: "Emma Davis", username: "emmadavis", avatar: "E", isFollowing: true },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' or 'background'
  const [croppedProfileImage, setCroppedProfileImage] = useState(null);
  const [croppedBackgroundImage, setCroppedBackgroundImage] = useState(null);
  
  const cropperRef = useRef(null);
  
  // Get user data from auth reducer
  const { user } = useSelector((state) => state.auth);
  
  // Local state for profile data that can be updated
  const [localProfileData, setLocalProfileData] = useState({
    name: user?.username || "Your Name",
    username: user?.username || "yourname",
    avatar: user?.profilePhoto || null,
    bio: user?.bio || "Designer & Developer | Creating beautiful digital experiences | Coffee enthusiast ☕",
    location: user?.location || "San Francisco, CA",
    joinDate: user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : "Joined March 2023",
    followers: user?.followersCount || 2543,
    following: user?.followingCount || 1204,
    posts: user?.postsCount || 342,
    background: user?.backgroundPhoto || "/Screenshot 2025-11-13 232324.png.jpg",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
    location: ""
  });

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "media", label: "Media" },
    { id: "tagged", label: "Tagged" },
    { id: "saved", label: "Saved" },
  ];

  // Function to display profile photo
  const renderAvatar = () => {
    if (localProfileData.avatar && localProfileData.avatar !== "/Profile Icon.png") {
      return (
        <img 
          src={localProfileData.avatar} 
          alt={localProfileData.name}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full object-cover -mt-8 sm:-mt-12 md:-mt-16 border-4 border-white"
          onError={(e) => {
            console.error("Failed to load profile image:", localProfileData.avatar);
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl sm:text-4xl md:text-6xl -mt-8 sm:-mt-12 md:-mt-16 border-4 border-white">
        {localProfileData.name?.charAt(0)?.toUpperCase() || "Y"}
      </div>
    );
  };

  // Handle edit dialog open
  const handleEditClick = () => {
    setEditFormData({
      name: localProfileData.name,
      bio: localProfileData.bio,
      location: localProfileData.location
    });
    setShowEditDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropType('profile');
    };
    reader.readAsDataURL(file);
  };

  // Handle background photo upload
  const handleBackgroundPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropType('background');
    };
    reader.readAsDataURL(file);
  };

  // Handle crop save
  const handleCropSave = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            
            if (cropType === 'profile') {
              setCroppedProfileImage(imageUrl);
            } else if (cropType === 'background') {
              setCroppedBackgroundImage(imageUrl);
            }
            
            alert(`${cropType.charAt(0).toUpperCase() + cropType.slice(1)} photo updated!`);
          }
        }, "image/png");
      }
    }
    setImageToCrop(null);
    setCropType(null);
  };

  // Handle form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Update local profile data with form data and cropped images
    const updatedProfileData = {
      ...localProfileData,
      name: editFormData.name,
      bio: editFormData.bio,
      location: editFormData.location,
      // Use cropped images if available, otherwise keep existing ones
      avatar: croppedProfileImage || localProfileData.avatar,
      background: croppedBackgroundImage || localProfileData.background,
    };

    // Update local state
    setLocalProfileData(updatedProfileData);

    // For demonstration, we'll just update the local state and show success message
    console.log("Updated profile data:", updatedProfileData);
    
    // Reset cropped images after saving
    setCroppedProfileImage(null);
    setCroppedBackgroundImage(null);
    
    alert("Profile updated successfully!");
    setShowEditDialog(false);
  };

  return (
    <Layout>
      {/* Wrap entire profile content in white background */}
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto bg-white">

          {/* Profile Header */}
          <div className="border-b border-gray-200 bg-white">

            {/* Cover Photo - Use updated background from localProfileData */}
            <div className="h-48 sm:h-48 md:h-64 bg-gradient-to-r from-blue-300 to-purple-400 relative" 
            style={{
              backgroundImage: `url("${localProfileData.background}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            </div>

            {/* Profile Info */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 relative bg-white">
              <div className="flex items-start justify-between gap-4">

                {/* Left Section */}
                <div className="flex-1 min-w-0">

                  {/* Avatar */}
                  <div className="flex items-end gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {renderAvatar()}
                  </div>

                  {/* Name + Username */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {localProfileData.name}
                  </h1>
                  <p className="text-sm text-gray-600">@{localProfileData.username}</p>

                  {/* Bio */}
                  <p className="text-sm md:text-base text-gray-800 mt-2 sm:mt-4 max-w-lg">
                    {localProfileData.bio}
                  </p>

                  {/* Meta - Removed website */}
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-700 mt-2 sm:mt-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-600" />
                      <span className="hidden sm:inline">{localProfileData.location}</span>
                      <span className="sm:hidden">{localProfileData.location.split(",")[0]}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Calendar size={16} className="text-gray-600" />
                      {localProfileData.joinDate}
                    </div>
                  </div>

                  {/* Followers / Following */}
                  <div className="flex gap-6 mt-4 sm:mt-6 text-sm">
                    <button
                      onClick={() => setShowFollowingModal(true)}
                      className="hover:underline"
                    >
                      <span className="font-bold text-gray-900">
                        {localProfileData.following}
                      </span>{" "}
                      <span className="text-gray-600">Following</span>
                    </button>

                    <button
                      onClick={() => setShowFollowersModal(true)}
                      className="hover:underline"
                    >
                      <span className="font-bold text-gray-900">
                        {localProfileData.followers}
                      </span>{" "}
                      <span className="text-gray-600">Followers</span>
                    </button>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button 
                    onClick={handleEditClick}
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-full font-semibold border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-4 sm:px-6 bg-white">
            <div className="flex gap-4 sm:gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 font-semibold border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="border-l border-r border-gray-200 bg-white">
            {activeTab === "posts" && (
              <div className="divide-y divide-gray-200">
                {USER_POSTS.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="text-6xl mb-4 text-gray-400">📝</div>
                    <h3 className="font-bold text-lg text-gray-900">No posts yet</h3>
                    <p className="text-gray-600 mt-2">Start sharing your thoughts!</p>
                  </div>
                ) : (
                  USER_POSTS.map((post) => (
                    <PostCard
                      key={post.id}
                      author={post.author}
                      timestamp={post.timestamp}
                      content={post.content}
                      media={post.media}
                      stats={post.stats}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-1 p-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            {activeTab === "tagged" && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-4xl mb-2 text-gray-400">🏷️</div>
                <p className="text-gray-600">No tagged posts</p>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-4xl mb-2 text-gray-400">💾</div>
                <p className="text-gray-600">No saved posts</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Dialog */}
        {showEditDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEditDialog(false)}
            />
            <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-6">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  
                  {/* Profile Photo Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-4 border-white overflow-hidden">
                        {croppedProfileImage || localProfileData.avatar ? (
                          <img 
                            src={croppedProfileImage || localProfileData.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          localProfileData.name?.charAt(0)?.toUpperCase() || "Y"
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="profilePhoto"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="profilePhoto"
                          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Upload size={16} />
                          Change Photo
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Recommended: Square image, at least 400x400 pixels
                        </p>
                      </div>
                    </div>
                    {croppedProfileImage && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          ✓ New profile photo ready to save
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Background Photo Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Background Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="backgroundPhoto"
                        accept="image/*"
                        onChange={handleBackgroundPhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="backgroundPhoto"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Camera size={24} className="text-gray-500" />
                        <span className="text-sm text-gray-900">Upload Background Photo</span>
                        <span className="text-xs text-gray-600">
                          Recommended: 1500x500 pixels
                        </span>
                      </label>
                    </div>
                    {croppedBackgroundImage && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          ✓ New background photo ready to save
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Bio Field */}
                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-900">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editFormData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="Where are you based?"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDialog(false);
                        setCroppedProfileImage(null);
                        setCroppedBackgroundImage(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Cropper Modal */}
        {imageToCrop && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setImageToCrop(null);
                setCropType(null);
              }}
            />
            <div className="relative bg-white p-4 rounded-lg shadow-xl w-[90vw] max-w-2xl h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Crop {cropType === 'profile' ? 'Profile' : 'Background'} Photo
                </h3>
                <button
                  onClick={() => {
                    setImageToCrop(null);
                    setCropType(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden rounded-md">
                <Cropper
                  ref={cropperRef}
                  src={imageToCrop}
                  className="w-full h-full"
                  stencilProps={{
                    aspectRatio: cropType === 'profile' ? 1 : 3, // Square for profile, wide for background
                    movable: true,
                    resizable: true,
                    lines: true,
                    handlers: true,
                  }}
                  stencilSize={{
                    width: cropType === 'profile' ? '70%' : '80%',
                    height: cropType === 'profile' ? '70%' : '40%',
                  }}
                  imageRestriction="fit-area"
                />
              </div>
              
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setImageToCrop(null);
                    setCropType(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save Cropped Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFollowersModal(false)}
            />
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl animate-scale-in max-h-96 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Followers</h2>
                <button
                  onClick={() => setShowFollowersModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {FOLLOWERS.map((follower) => (
                  <div
                    key={follower.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white border-2 flex items-center justify-center font-bold">
                        {follower.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{follower.name}</p>
                        <p className="text-xs text-gray-600">@{follower.username}</p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        follower.isFollowing
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {follower.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFollowingModal(false)}
            />
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl animate-scale-in max-h-96 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Following</h2>
                <button
                  onClick={() => setShowFollowingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {FOLLOWERS.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white border-2 flex items-center justify-center font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">@{user.username}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800">
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Profile;