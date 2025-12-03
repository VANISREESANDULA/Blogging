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
        className="absolute inset-0 bg-white/20 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-100 shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col border">

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Create Post
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          <div className="flex gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-black font-bold border-2 overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayInitial
              )}
            </div>

            <div className="flex-1">
              <p className="font-bold text-foreground">{displayName}</p>
              <div className="mt-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-sm bg-secondary px-3 py-2 rounded-full border cursor-pointer"
                >
                  <option value="public">🌐 Public</option>
                  <option value="friends">👥 Friends Only</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* NEW - Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            className="w-full px-4 py-2 rounded-xl border bg-white text-black"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            autoFocus
            className="w-full min-h-40 resize-none bg-secondary rounded-2xl px-4 py-3"
          />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t">
          <span className="text-sm text-muted-foreground">
            {content.length} / 500
          </span>

          <button
            onClick={handlePost}
            disabled={!content.trim() || !title.trim()}
            className={cn(
              "px-6 py-2 rounded-full font-bold flex items-center gap-2",
              content.trim() && title.trim()
                ? "bg-neutral-400 text-black border-2 hover:scale-105 hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
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
