
import React, { useState, useRef, useEffect } from "react";
import { addComment, toggleLikeArticle, deleteArticle, optimisticToggleLike, getArticles } from "../redux/authslice";
import { useDispatch, useSelector } from "react-redux";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import { cn } from "../../lib/utils";

const ThreadPostCard = ({
  _id,
  user,
  content,
  createdAt,
  likedBy = [],
  likedByCurrentUser,
  isProfilePost = false,
}) => {
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  /* ✅ GET UPDATED ARTICLE DIRECTLY FROM REDUX */
  const updatedArticle = useSelector((state) =>
    state.articles.articles.find((a) => a._id === _id)
  );

  /* If Redux hasn't updated yet, fallback to props */
  const finalLikedBy = updatedArticle?.likedBy || likedBy;
  const finalLikedByCurrentUser =
    updatedArticle?.likedByCurrentUser ?? likedByCurrentUser;

  const finalContent = updatedArticle?.content || content;
  // support both 'author' and legacy 'user' keys
  // const finalUser = updatedArticle?.author || updatedArticle?.user || user;
  const finalCreatedAt = updatedArticle?.createdAt || createdAt;

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id;

  /* ❗ NO local like state — use Redux values */
  const isLiked = !!finalLikedByCurrentUser;
  const likes = finalLikedBy.length || 0;

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showCommentsBox, setShowCommentsBox] = useState(false);

  /* LIKE HANDLER — optimistic UI update */
  const handleLike = async () => {
    const currentUserIdLocal = currentUser?._id || currentUser?.id;
    try {
      // 1) optimistic UI update immediately
      if (currentUserIdLocal) {
        dispatch(optimisticToggleLike({ articleId: _id, currentUserId: currentUserIdLocal }));
      }

      // 2) send request to server (reconciliation happens in fulfilled reducer)
      await dispatch(toggleLikeArticle(_id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // On failure, re-fetch articles to reconcile state
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
  useEffect(() => {
  console.log("[ThreadPostCard debug] updatedArticle:", updatedArticle);
  console.log("[ThreadPostCard debug] props user:", user);
  console.log("[ThreadPostCard debug] currentUser:", currentUser);
}, [updatedArticle, user, currentUser]);


// Prefer an author object if available, otherwise fallback to legacy user prop or the currently logged in user
// Correct user object selection
const finalUser =
  (updatedArticle?.user && typeof updatedArticle.user === "object"
    ? updatedArticle.user
    : updatedArticle?.author && typeof updatedArticle.author === "object"
    ? updatedArticle.author
    : user || currentUser || null
  );

// Robust author/email fallback (handles username/ email differences)
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
const authorInitial = (authorEmail && String(authorEmail).charAt(0).toUpperCase()) || "U";
const authorHandle = `@${(authorEmail || "unknown").split("@")[0]}`;

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

              {isProfilePost && currentUserId === finalUser?._id && (
                <button
                  className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2"
                  onClick={() => handleDeletePost(_id)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <p className="text-gray-900 text-base whitespace-pre-line mb-4">
        {finalContent}
      </p>

      {/* Timestamp */}
      <time className="block text-xs text-gray-400 mb-4">
        {new Date(finalCreatedAt).toLocaleString()}
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
          {updatedArticle?.comments?.length || 0}
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

          {/* Show ALL COMMENTS ONLY when comment box is open */}
          {updatedArticle?.comments?.length > 0 && (
            <div className="mt-4 border-t pt-3">
              {updatedArticle.comments.map((c, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
                  <p className="text-sm text-gray-900">{c.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ThreadPostCard;




// import React, { useState, useRef, useEffect } from "react";
// import { addComment, toggleLikeArticle, deleteArticle } from "../redux/authslice";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   Heart,
//   MessageCircle,
//   MoreHorizontal,
//   Bookmark,
// } from "lucide-react";
// import { cn } from "../../lib/utils";

// const ThreadPostCard = ({
//   _id,
//   user,
//   content,
//   createdAt,
//   likedBy = [],
//   likedByCurrentUser,
//   isProfilePost = false,
// }) => {
//   const dispatch = useDispatch();
//   const menuRef = useRef(null);
  

//   /* ✅ GET UPDATED ARTICLE DIRECTLY FROM REDUX */
//   const updatedArticle = useSelector((state) =>
//     state.articles.articles.find((a) => a._id === _id)
//   );

//   /* If Redux hasn't updated yet, fallback to props */
//   const finalLikedBy = updatedArticle?.likedBy || likedBy;
//   const finalLikedByCurrentUser =
//     updatedArticle?.likedByCurrentUser ?? likedByCurrentUser;

//   const finalContent = updatedArticle?.content || content;
//   const finalUser = updatedArticle?.user || user;
//   const finalCreatedAt = updatedArticle?.createdAt || createdAt;

//   const currentUser = useSelector((state) => state.auth.user);
//   const currentUserId = currentUser?.id || currentUser?._id;

//   /* ❗ FIX: NO local like state — use Redux values */
//   const isLiked = !!finalLikedByCurrentUser;
//   const likes = finalLikedBy.length;

//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   const [commentInput, setCommentInput] = useState("");
//   const [showCommentsBox, setShowCommentsBox] = useState(false);

//   /* LIKE HANDLER (NO local state) */
//   const handleLike = async () => {
//     try {
//       await dispatch(toggleLikeArticle(_id)).unwrap();
//     } catch (error) {
//       console.error("Failed to toggle like:", error);
//     }
//   };

//   const handleDeletePost = async (id) => {
//     try {
//       await dispatch(deleteArticle(id)).unwrap();
//       console.log("Post deleted successfully");
//     } catch (err) {
//       console.error("Post delete failed:", err);
//     }
//   };

//   const handleAddComment = () => {
//     if (!commentInput.trim()) return;
//     dispatch(addComment({ articleId: _id, text: commentInput }));
//     setCommentInput("");
//     setShowCommentsBox(false);
//   };

//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setShowMoreMenu(false);
//     }
//   };

//   useEffect(() => {
//     if (showMoreMenu) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () =>
//         document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [showMoreMenu]);

//   const authorEmail = finalUser?.email || "unknown@gmail.com";
//  const authorProfilePhoto =
//   typeof finalUser?.profilePhoto === "string"
//     ? finalUser.profilePhoto
//     : null;
//   const authorInitial = authorEmail.charAt(0).toUpperCase();
//   const authorHandle = `@${authorEmail.split("@")[0]}`;

//   return (
//     <article className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 box-border">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
//             {authorProfilePhoto ? (
//               <img
//                 src={
//                   authorProfilePhoto.startsWith("http") ||
//                   authorProfilePhoto.startsWith("data:")
//                     ? authorProfilePhoto
//                     : `data:image/png;base64,${authorProfilePhoto}`
//                 }
//                 alt={authorEmail}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-lg font-semibold text-gray-600">
//                 {authorInitial}
//               </span>
//             )}
//           </div>

//           {/* Author Info */}
//           <div className="flex flex-col leading-tight">
//             <span className="font-semibold text-gray-900 truncate max-w-xs">
//               {authorEmail}
//             </span>
//             <span className="text-gray-500 text-sm truncate max-w-xs">
//               {authorHandle}
//             </span>
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

//               {isProfilePost && currentUserId === finalUser?._id && (
//                 <button
//                   className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2"
//                   onClick={() => handleDeletePost(_id)}
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Content */}
//       <p className="text-gray-900 text-base whitespace-pre-line mb-4">
//         {finalContent}
//       </p>

//       {/* Timestamp */}
//       <time className="block text-xs text-gray-400 mb-4">
//         {new Date(finalCreatedAt).toLocaleString()}
//       </time>

//       {/* Footer Actions */}
//       <footer className="flex items-center gap-6">
//         <button
//           onClick={handleLike}
//           className={cn(
//             "flex items-center gap-1 text-sm font-medium transition-colors",
//             isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
//           )}
//         >
//           <Heart
//             size={18}
//             className={isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}
//           />
//           <span>{likes}</span>
//         </button>

//         <button
//           onClick={() => setShowCommentsBox(!showCommentsBox)}
//           className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
//         >
//           <MessageCircle size={18} />
//           {updatedArticle?.comments?.length || 0}
//         </button>
//       </footer>

//       {/* Comment Box */}
//       {/* {showCommentsBox && (
//         <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border">
//           <input
//             type="text"
//             placeholder="Write a comment..."
//             className="border rounded-lg px-3 py-2 w-full"
//             value={commentInput}
//             onChange={(e) => setCommentInput(e.target.value)}
//           />

//           <div className="flex justify-end gap-3">
//             <button
//               className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm"
//               onClick={() => {
//                 setShowCommentsBox(false);
//                 setCommentInput("");
//               }}
//             >
//               Cancel
//             </button>

//             <button
//               className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
//               onClick={handleAddComment}
//             >
//               Post
//             </button>
//           </div>
//         </div>
//       )} */}
//       {/* Comment Box */}
// {showCommentsBox && (
//   <div className="mt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border">
//     <input
//       type="text"
//       placeholder="Write a comment..."
//       className="border rounded-lg px-3 py-2 w-full"
//       value={commentInput}
//       onChange={(e) => setCommentInput(e.target.value)}
//     />

//     <div className="flex justify-end gap-3">
//       <button
//         className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm"
//         onClick={() => {
//           setShowCommentsBox(false);
//           setCommentInput("");
//         }}
//       >
//         Cancel
//       </button>

//       <button
//         className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
//         onClick={handleAddComment}
//       >
//         Post
//       </button>
//     </div>

//     {/* Show ALL COMMENTS ONLY when comment box is open */}
//     {updatedArticle?.comments?.length > 0 && (
//       <div className="mt-4 border-t pt-3">
//         {updatedArticle.comments.map((c, index) => (
//           <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
//             <p className="text-sm text-gray-900">{c.text}</p>
//             <span className="text-xs text-gray-500">
//               {new Date(c.createdAt).toLocaleString()}
//             </span>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// )}

//     {/* {updatedArticle?.comments?.length > 0 && (
//   <div className="mt-4 border-t pt-3">
//     {updatedArticle.comments.map((c, index) => (
//       <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
//         <p className="text-sm text-gray-900">{c.text}</p>
//         <span className="text-xs text-gray-500">
//           {new Date(c.createdAt).toLocaleString()}
//         </span>
//       </div>
//     ))}
//   </div>
// )} */}

//     </article>
//   );
// };

// export default ThreadPostCard;

 
 


 








 


 







