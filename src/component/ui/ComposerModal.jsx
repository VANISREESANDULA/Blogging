import React, { useState } from "react";
import { X, Loader } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";

const ComposerModal = ({ isOpen, onClose, onPost }) => {
  const [title, setTitle] = useState(""); // <-- NEW
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isPosting, setIsPosting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const isDark = useSelector((state) => state.theme.isDark);

  const avatarSrc = user?.profilePhoto
    ? user.profilePhoto.startsWith("data:")
      ? user.profilePhoto
      : `data:image/png;base64,${user.profilePhoto}`
    : null;

  const displayName = user?.username || "Your Name";
  const displayInitial = displayName.charAt(0).toUpperCase() || "U";

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsPosting(true);

    try {
      await onPost({ title, content }); // Wait for backend response
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error("Post failed:", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-2`}>

        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Create Post
          </h2>
          <button onClick={onClose} className={`p-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-full transition-colors`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="flex gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold border-2 overflow-hidden shadow-md ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-300'}`}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className={isDark ? 'text-gray-300' : 'text-white'}>
                  {displayInitial}
                </span>
              )}
            </div>

            <div className="flex-1">
              <p className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{displayName}</p>
              <div className="mt-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className={`text-sm px-3 py-2 rounded-full border cursor-pointer ${isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  <option value="public" className={isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}>🌐 Public</option>
                  <option value="friends" className={isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}>👥 Friends Only</option>
                  <option value="private" className={isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}>🔒 Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            className={`w-full px-4 py-2 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            autoFocus
            className={`w-full min-h-40 resize-none rounded-2xl px-4 py-3 border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
          />
        </div>

        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {content.length} / 5000
          </span>
          <button
            onClick={handlePost}
            disabled={!content.trim() || !title.trim() || isPosting}
            className={cn(
              "px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors",
              content.trim() && title.trim() && !isPosting
                ? isDark 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                : isDark 
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isPosting && <Loader size={16} className="animate-spin" />}
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposerModal;