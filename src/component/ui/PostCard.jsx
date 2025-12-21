import React, { useState, useRef, useEffect } from "react";
import {
  addComment,
  toggleLikeArticle,
  deleteArticle,
  optimisticToggleLike,
  getArticles,
} from "../redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "../../lib/utils";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  // Just now
  if (seconds < 60) return "Just now";

  // Minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;

  // Hours
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  // Days
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  // Fallback: show date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getUserInfoFromComment = (comment) => {
  // Check multiple possible field names where user data might be stored
  if (comment.user && typeof comment.user === 'object') {
    return comment.user;
  }
  if (comment.author && typeof comment.author === 'object') {
    return comment.author;
  }
  if (comment.commentedBy && typeof comment.commentedBy === 'object') {
    return comment.commentedBy;
  }
  if (comment.userId && typeof comment.userId === 'object') {
    return comment.userId;
  }
  
  // If none of the above, check if the comment has direct user properties
  if (comment.username || comment.email) {
    return {
      username: comment.username,
      email: comment.email,
      profilePhoto: comment.profilePhoto
    };
  }
  
  return null;
};

// Helper function to extract username/email
const getUsernameFromUser = (user) => {
  if (!user) return 'Anonymous';
  
  // Try multiple possible field names
  return user.username || user.email || user.name || 
         (user.userId && (user.userId.username || user.userId.email)) || 
         'Anonymous';
};

// Helper function to get profile photo
const getProfilePhoto = (user) => {
  if (user?.profilePhoto && typeof user.profilePhoto === 'string') {
    return user.profilePhoto;
  }
  return null;
};

// Helper function to get user initial
const getUserInitial = (user) => {
  const username = getUsernameFromUser(user);
  return username.charAt(0).toUpperCase();
};

const ThreadPostCard = ({
  _id,
  user,
  content,
  title,
  createdAt,
  likedBy = [],
  likedByCurrentUser,
  isProfilePost = false,
}) => {
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const contentRef = useRef(null);

  // Get dark mode state
  const isDark = useSelector((state) => state.theme.isDark);

  const updatedArticle = useSelector((state) =>
    state.articles.articles.find((a) => a._id === _id)
  );

  const finalLikedBy = updatedArticle?.likedBy || likedBy;
  const finalLikedByCurrentUser =
    updatedArticle?.likedByCurrentUser ?? likedByCurrentUser;
  const finalContent = updatedArticle?.content || content;
  const finalTitle = updatedArticle?.title || title;
  const finalCreatedAt = updatedArticle?.createdAt || createdAt;

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id;

  const isLiked = !!finalLikedByCurrentUser;
  const likes = finalLikedBy.length || 0;

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showCommentsBox, setShowCommentsBox] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isContentTruncated, setIsContentTruncated] = useState(false);

  // Comments per page limit
  const COMMENTS_PER_PAGE = 5;
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);

  // ================== CHECK CONTENT LENGTH ==================
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = 24; // Approximate line height in pixels
      const maxHeight = lineHeight * 5; // 5 lines
      const contentHeight = contentRef.current.scrollHeight;

      // Check if content exceeds max height
      setIsContentTruncated(contentHeight > maxHeight);
    }
  }, [finalContent, showFullContent]);

  // ================== RESET VISIBLE COMMENTS WHEN COMMENTS CHANGE ==================
  useEffect(() => {
    if (updatedArticle?.comments) {
      setVisibleComments(COMMENTS_PER_PAGE);
    }
  }, [updatedArticle?.comments]);

  const handleLike = async () => {
    const currentUserIdLocal = currentUser?._id || currentUser?.id;
    try {
      if (currentUserIdLocal) {
        dispatch(
          optimisticToggleLike({
            articleId: _id,
            currentUserId: currentUserIdLocal,
          })
        );
      }
      await dispatch(toggleLikeArticle(_id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      try {
        dispatch(getArticles());
      } catch (e) {
        console.error("Failed to refetch articles after like error", e);
      }
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await dispatch(deleteArticle(id)).unwrap();
      console.log("Post deleted successfully");
    } catch (err) {
      console.error("Post delete failed:", err);
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    dispatch(addComment({ articleId: _id, text: commentInput }));
    setCommentInput("");
    setShowCommentsBox(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMoreMenu(false);
    }
  };

  useEffect(() => {
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  const finalUser =
    (updatedArticle?.user && typeof updatedArticle.user === "object"
      ? updatedArticle.user
      : updatedArticle?.author && typeof updatedArticle.author === "object"
      ? updatedArticle.author
      : user || currentUser || null);

  const authorEmail =
    finalUser?.email ||
    finalUser?.username ||
    currentUser?.email ||
    currentUser?.username ||
    "unknown@gmail.com";

  const authorProfilePhoto =
    typeof finalUser?.profilePhoto === "string"
      ? finalUser.profilePhoto
      : null;

  const authorInitial =
    (authorEmail && String(authorEmail).charAt(0).toUpperCase()) || "U";

  const authorHandle = `@${(authorEmail || "unknown").split("@")[0]}`;

  // Get comments sorted by newest first
  const comments = updatedArticle?.comments || [];
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const displayedComments = sortedComments.slice(
    0,
    showAllComments ? comments.length : visibleComments
  );
  const hasMoreComments =
    sortedComments.length > visibleComments && !showAllComments;

  return (
    <article
      className={`w-full mb-6 rounded-xl xs:rounded-2xl border p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 box-border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header - RESPONSIVE */}
      <header className="flex items-center justify-between mb-3 xs:mb-4">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
          {/* Avatar - RESPONSIVE */}
          <div
            className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            {authorProfilePhoto ? (
              <img
                src={
                  authorProfilePhoto.startsWith("http") ||
                  authorProfilePhoto.startsWith("data:")
                    ? authorProfilePhoto
                    : `data:image/png;base64,${authorProfilePhoto}`
                }
                alt={authorEmail}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className={`text-sm xs:text-base sm:text-lg font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {authorInitial}
              </span>
            )}
          </div>

          <div className="flex flex-col leading-tight min-w-0">
            <span
              className={`font-semibold truncate max-w-[120px] xs:max-w-[150px] sm:max-w-xs text-sm xs:text-base ${
                isDark ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {authorEmail}
            </span>
            <span
              className={`text-xs xs:text-sm truncate max-w-[100px] xs:max-w-[130px] sm:max-w-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {authorHandle}
            </span>
          </div>
        </div>

        {/* TIMESTAMP AND SETTINGS BUTTON GROUP */}
        <div className="flex items-center gap-3">
          {/* Timestamp - Now placed beside settings button */}
          <time
            className={`text-xs xs:text-sm whitespace-nowrap ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatTimeAgo(finalCreatedAt)}
          </time>

          {/* More Button - RESPONSIVE */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              aria-label="More options"
              className={`p-1 xs:p-1.5 sm:p-2 rounded-full transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-orange-200"
              }`}
            >
              <MoreHorizontal
                size={16}
                className={`xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </button>

            {showMoreMenu && (
              <div
                className={`absolute right-0 top-full mt-1 xs:mt-2 w-32 xs:w-36 border rounded-lg xs:rounded-xl shadow-lg z-10 ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <button
                  className={`w-full px-3 xs:px-4 py-1.5 xs:py-2 text-left flex items-center gap-1 xs:gap-2 text-xs xs:text-sm ${
                    isDark
                      ? "hover:bg-orange-600 text-gray-200"
                      : "hover:bg-orange-600 text-gray-900"
                  }`}
                >
                  Share
                </button>

                {isProfilePost && currentUserId === finalUser?._id && (
                  <button
                    className={`w-full px-3 xs:px-4 py-1.5 xs:py-2 text-left flex items-center gap-1 xs:gap-2 text-xs xs:text-sm ${
                      isDark
                        ? "hover:bg-gray-700 text-red-400"
                        : "hover:bg-orange-100 text-orange-600"
                    }`}
                    onClick={() => handleDeletePost(_id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Title - Added this section - RESPONSIVE */}
      {finalTitle && (
        <div className="mb-2 xs:mb-3 sm:mb-4">
          <h3
            className={`text-base xs:text-lg sm:text-xl font-bold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {finalTitle}
          </h3>
        </div>
      )}

      {/* Content with Read More/Show Less functionality - RESPONSIVE */}
      <div className="relative">
        <div
          ref={contentRef}
          className={`text-sm xs:text-base whitespace-pre-line mb-3 xs:mb-4 break-all ${
            isDark ? "text-gray-300" : "text-gray-900"
          } ${
            !showFullContent && isContentTruncated
              ? "max-h-[100px] xs:max-h-[120px] overflow-hidden" // 5 lines * 24px line height
              : ""
          }`}
        >
          {finalContent}
        </div>

        {/* Read More/Show Less Button - Show when content is truncated */}
        {isContentTruncated && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="flex items-center gap-1 text-orange-600 hover:text-orange-800 font-medium text-xs xs:text-sm mb-3 xs:mb-4 transition-colors"
          >
            {showFullContent ? (
              <>
                Show Less
                <ChevronUp size={14} className="xs:w-4 xs:h-4" />
              </>
            ) : (
              <>
                Read More
                <ChevronDown size={14} className="xs:w-4 xs:h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer Actions - RESPONSIVE: grid on mobile, centered flex on sm+ */}
      <footer className="w-full grid grid-cols-3 gap-4 px-3 sm:flex sm:items-center sm:justify-center sm:gap-16 md:gap-24 lg:gap-32 xl:gap-70">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center justify-center gap-1 text-sm font-medium transition-colors w-full",
            isLiked
              ? "text-red-500"
              : isDark
              ? "text-gray-400 hover:text-red-500"
              : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart
            size={22}
            className="xs:w-6 xs:h-6 sm:w-7 sm:h-7"
            class={
              isLiked
                ? "fill-red-500 text-red-500"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }
          />
          <span className={`text-xs xs:text-sm ${isDark ? "text-gray-300" : ""}`}>
            {likes}
          </span>
        </button>

        <button
          onClick={() => setShowCommentsBox(!showCommentsBox)}
          className={`flex items-center justify-center gap-1 text-sm font-medium transition-colors w-full ${
            isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageCircle
            size={22}
            className={`xs:w-6 xs:h-6 sm:w-7 sm:h-7 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span className={`text-xs xs:text-sm ${isDark ? "text-gray-300" : ""}`}>
            {comments.length}
          </span>
        </button>

        {/* UPDATED Bookmark button to match other icons - RESPONSIVE */}
        <button
          className={`flex items-center justify-center gap-1 text-sm font-medium transition-colors w-full ${
            isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bookmark
            size={22}
            className={`xs:w-6 xs:h-6 sm:w-7 sm:h-7 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span className={`text-xs xs:text-sm ${isDark ? "text-gray-300" : ""}`}>
            Save
          </span>
        </button>
      </footer>

      {/* Comment Box - RESPONSIVE */}
      {showCommentsBox && (
        <div
          className={`mt-2 xs:mt-3 flex flex-col gap-2 p-2 xs:p-3 rounded-lg xs:rounded-xl border ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-300"
          }`}
        >
          <textarea
            type="text"
            placeholder="Write a comment..."
            className={`border rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 w-full text-sm xs:text-base ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 xs:gap-3">
            <button
              className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-lg text-xs xs:text-sm ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-900"
              }`}
              onClick={() => {
                setShowCommentsBox(false);
                setCommentInput("");
              }}
            >
              Cancel
            </button>

            <button
              className="px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-xs xs:text-sm"
              onClick={handleAddComment}
            >
              Post
            </button>
          </div>

          {/* UPDATED COMMENTS SECTION WITH USER INFO AND TIMESTAMP - RESPONSIVE */}
          {comments.length > 0 && (
            <div
              className={`mt-2 xs:mt-3 border-t pt-2 xs:pt-3 space-y-2 xs:space-y-3 ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              {/* Display latest comments up to visibleComments */}
              {displayedComments.map((comment, index) => {
                const commentUser = getUserInfoFromComment(comment);
                const username = getUsernameFromUser(commentUser);
                const profilePhoto = getProfilePhoto(commentUser);
                const userInitial = getUserInitial(commentUser);
                const userHandle = `@${username.split('@')[0]}`;

                return (
                  <div
                    key={index}
                    className={`p-2 xs:p-3 rounded-lg border ${
                      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    {/* User Info Row */}
                    <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                      {/* User Avatar */}
                      <div
                        className={`w-6 h-6 xs:w-8 xs:h-8 rounded-full flex items-center justify-center overflow-hidden ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {profilePhoto ? (
                          <img
                            src={
                              profilePhoto.startsWith("http") ||
                              profilePhoto.startsWith("data:")
                                ? profilePhoto
                                : `data:image/png;base64,${profilePhoto}`
                            }
                            alt={username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span
                            className={`text-xs xs:text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {userInitial}
                          </span>
                        )}
                      </div>

                      {/* User Name and Handle */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                          <span
                            className={`font-medium truncate max-w-[100px] xs:max-w-[120px] text-xs xs:text-sm ${
                              isDark ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {username}
                          </span>
                          <span
                            className={`text-xs truncate max-w-[80px] xs:max-w-[100px] ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {userHandle}
                          </span>
                        </div>
                      </div>

                      {/* Timestamp aligned to the right */}
                      <span
                        className={`text-xs whitespace-nowrap ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>

                    {/* Comment Text */}
                    <div className="ml-8 xs:ml-10 pl-0 xs:pl-1">
                      <p
                        className={`text-xs xs:text-sm break-words ${
                          isDark ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Show More / Show Less buttons - RESPONSIVE */}
              {comments.length > COMMENTS_PER_PAGE && (
                <div className="flex justify-center pt-1 xs:pt-2">
                  <button
                    className="text-blue-600 text-xs xs:text-sm font-medium hover:text-blue-800 transition-colors"
                    onClick={() => {
                      if (showAllComments) {
                        setShowAllComments(false);
                        setVisibleComments(COMMENTS_PER_PAGE);
                      } else if (hasMoreComments) {
                        setVisibleComments((prev) => prev + COMMENTS_PER_PAGE);
                      } else {
                        setShowAllComments(true);
                      }
                    }}
                  >
                    {showAllComments
                      ? "Show Less"
                      : hasMoreComments
                      ? `Show More (${sortedComments.length - visibleComments} more)`
                      : "Show All Comments"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ThreadPostCard;