// import React, { useState, useRef, useEffect } from "react";
// import {
//   Heart,
//   MessageCircle,
//   MoreHorizontal,
//   Bookmark,
// } from "lucide-react";
// import { cn } from "../../lib/utils";


// const ThreadPostCard = ({ author, timestamp, content, stats }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [likes, setLikes] = useState(stats?.likes || 0);
//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   const menuRef = useRef(null);

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//     setLikes(isLiked ? likes - 1 : likes + 1);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMoreMenu(false);
//       }
//     };
//     if (showMoreMenu) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [showMoreMenu]);

//   const authorName = author?.name || author?.fullname || "Unknown User";
//   const authorHandle = `@${author?.username || "unknown"}`;
//   const authorInitial = authorName.charAt(0).toUpperCase();

//   return (
//     <article className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 box-border">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
//               {author?.profilePhoto ? (
//                 <img
//                   src={
//                     author.profilePhoto.startsWith("http") ||
//                     author.profilePhoto.startsWith("data:")
//                       ? author.profilePhoto
//                       : `data:image/png;base64,${author.profilePhoto}`
//                   }
//                   alt={authorName}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-lg font-semibold text-gray-600">{authorInitial}</span>
//               )}

//           </div>
//           {/* Author Info */}
//           <div className="flex flex-col leading-tight">
//             <span className="font-semibold text-gray-900 truncate max-w-xs">{authorName}</span>
//             <span className="text-gray-500 text-sm truncate max-w-xs">{authorHandle}</span>
//           </div>
//         </div>

//         {/* More Button */}
//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={() => setShowMoreMenu(!showMoreMenu)}
//             aria-label="More options"
//             className="p-2 rounded-full hover:bg-gray-200 transition-colors"
//           >
//             <MoreHorizontal size={20} className="text-gray-600" />
//           </button>

//           {showMoreMenu && (
//             <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
//               <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
//                 <Bookmark size={16} /> Save
//               </button>
//               <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
//                 Share
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Content */}
//       <p className="text-gray-900 text-base whitespace-pre-line mb-4">{content}</p>

//       {/* Timestamp */}
//       <time className="block text-xs text-gray-400 mb-4" dateTime={timestamp}>
//         {timestamp ? new Date(timestamp).toLocaleString() : "Just now"}
//       </time>

//       {/* Interactions */}
//       <footer className="flex items-center gap-6">
//         <button
//           onClick={handleLike}
//           aria-label={isLiked ? "Unlike post" : "Like post"}
//           className={cn(
//             "flex items-center gap-1 text-sm font-medium transition-colors",
//             isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
//           )}
//         >
//           <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
//           {likes}
//         </button>
//         <button
//           aria-label="View comments"
//           className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
//         >
//           <MessageCircle size={18} />
//           {stats?.comments || 0}
//         </button>
//       </footer>
//     </article>
//   );
// };

// export default ThreadPostCard;


 





// //----------------------------------------------------------

import React, { useState, useRef, useEffect } from "react";
import { addComment, toggleLikeArticle,deleteArticle } from "../redux/authslice";
import { useDispatch, useSelector } from "react-redux";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import { cn } from "../../lib/utils";

const ThreadPostCard = ({ _id, user, content, createdAt, likedBy = [], likedByCurrentUser ,isProfilePost = false,}) => {
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;

  const [isLiked, setIsLiked] = useState(!!likedByCurrentUser);
  const [likes, setLikes] = useState(likedBy.length);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showCommentsBox, setShowCommentsBox] = useState(false);

  useEffect(() => {
    setIsLiked(!!likedByCurrentUser);
    setLikes(likedBy.length);
  }, [likedBy, likedByCurrentUser]);

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevLikes = likes;

    setIsLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      await dispatch(toggleLikeArticle(_id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsLiked(prevLiked);
      setLikes(prevLikes);
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

  const authorEmail = user?.email || "unknown@gmail.com";
  const authorProfilePhoto = user?.profilePhoto || null;
  const authorInitial = authorEmail.charAt(0).toUpperCase();
  const authorHandle = `@${authorEmail.split("@")[0]}`;

  return (
    <article className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 box-border">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
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
              <span className="text-lg font-semibold text-gray-600">
                {authorInitial}
              </span>
            )}
          </div>

          {/* Author Info */}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-900 truncate max-w-xs">
              {authorEmail}
            </span>
            <span className="text-gray-500 text-sm truncate max-w-xs">
              {authorHandle}
            </span>
          </div>
        </div>

        {/* More Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-label="More options"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                <Bookmark size={16} /> Save
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                Share
              </button>
            {/* Show delete only in profile page AND only for current user's own post */}
  {isProfilePost && currentUserId === user?._id && (
    <button
      className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2"
      onClick={() => handleDeletePost(_id)}>
      Delete
    </button>
          )}
        </div>
          )}
        </div>
      </header>

      {/* Content */}
      <p className="text-gray-900 text-base whitespace-pre-line mb-4">{content}</p>

      {/* Timestamp */}
      <time className="block text-xs text-gray-400 mb-4">
        {new Date(createdAt).toLocaleString()}
      </time>

      {/* Footer Actions */}
      <footer className="flex items-center gap-6">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors",
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart
            size={18}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => setShowCommentsBox(!showCommentsBox)}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <MessageCircle size={18} />
          {0}
        </button>
      </footer>

      {/* Comment Box */}
      {showCommentsBox && (
        <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border">
          <input
            type="text"
            placeholder="Write a comment..."
            className="border rounded-lg px-3 py-2 w-full"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm"
              onClick={() => {
                setShowCommentsBox(false);
                setCommentInput("");
              }}
            >
              Cancel
            </button>

            <button
              className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
              onClick={handleAddComment}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default ThreadPostCard;


 
 


 








 


 







