import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../../lib/utils";


const PostCard = ({ author, timestamp, content, media, stats }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  return (
    <div className="border-b border-border hover:bg-secondary/30 transition-colors duration-200 py-4 sm:py-6 px-4 sm:px-6">
      <div className="flex gap-3 sm:gap-4">
        
        {/* Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
          {author.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <h3 className="font-bold text-foreground hover:underline cursor-pointer text-sm sm:text-base">
                  {author.name}
                </h3>

                <span className="text-muted-foreground text-xs sm:text-sm">
                  @{author.username}
                </span>

                <span className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">·</span>

                <span className="text-muted-foreground text-xs sm:text-sm hover:underline cursor-pointer">
                  {timestamp}
                </span>
              </div>
            </div>

            {/* More Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1 sm:p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-primary"
              >
                <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-2 first:rounded-t-lg"
                  >
                    <Share2 size={16} />
                    Share
                  </button>

                  <button
                    onClick={() => {
                      setIsSaved(!isSaved);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-2 last:rounded-b-lg"
                  >
                    <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <p className="text-foreground text-sm sm:text-base mb-3 whitespace-pre-wrap break-words">
            {content}
          </p>

          {/* Interaction Buttons */}
          <div className="flex justify-between text-muted-foreground text-xs sm:text-sm">
            <div className="flex gap-4 sm:gap-8 py-2 sm:py-3">

              {/* Comments */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 sm:gap-2 group hover:text-primary transition-colors"
              >
                <span className="p-1 sm:p-2 group-hover:bg-primary/10 rounded-full">
                  <MessageCircle size={16} />
                </span>
                <span className="group-hover:underline hidden sm:inline text-xs">
                  {stats.comments}
                </span>
              </button>

              {/* Likes */}
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 group transition-colors duration-200",
                  isLiked ? "text-accent" : "hover:text-accent"
                )}
              >
                <span
                  className={cn(
                    "p-1 sm:p-2 rounded-full transition-all",
                    isLiked ? "bg-accent/20" : "group-hover:bg-accent/10"
                  )}
                >
                  <Heart size={16} className={isLiked ? "fill-current" : ""} />
                </span>
                <span className="group-hover:underline hidden sm:inline text-xs">
                  {likes}
                </span>
              </button>

            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  Y
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">You</p>
                  <p className="text-sm text-foreground mt-1">Add a comment...</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostCard;
