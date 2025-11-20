import React from "react";
import Layout from "../ui/Layout";
import PostCard from "../ui/PostCard";

const BOOKMARKED_POSTS = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "S",
    },
    timestamp: "2 hours ago",
    content:
      "Just launched our new design system! So excited about the possibilities this opens up for our team. 🎨✨",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    },
    stats: {
      likes: 1203,
      comments: 124,
      shares: 45,
    },
  },
  {
    id: "3",
    author: {
      name: "Emma Davis",
      username: "emmadavis",
      avatar: "E",
    },
    timestamp: "6 hours ago",
    content:
      "Design tip: Always consider accessibility from the start. It's not an afterthought—it's part of good design.",
    stats: {
      likes: 2341,
      comments: 201,
      shares: 89,
    },
  },
];

const Bookmarks = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto border-l border-r border-border min-h-screen">
        
        {/* Header */}
        <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-4 sm:px-6 py-6">
          <h2 className="text-2xl font-bold">Bookmarks</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {BOOKMARKED_POSTS.length} saved posts
          </p>
        </div>

        {/* Posts */}
        <div className="divide-y divide-border">
          {BOOKMARKED_POSTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-4">📑</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No bookmarks yet
              </h2>
              <p className="text-muted-foreground text-center">
                Save posts you want to read later. They'll appear here.
              </p>
            </div>
          ) : (
            BOOKMARKED_POSTS.map((post) => (
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
      </div>
    </Layout>
  );
};

export default Bookmarks;








//  import React from "react";
// // import Layout from "../components/Layout";
// // import PostCard from "../components/ui/PostCard";

// const BOOKMARKED_POSTS = [
//   {
//     id: "1",
//     author: {
//       name: "Sarah Johnson",
//       username: "sarahj",
//       avatar: "S",
//     },
//     timestamp: "2 hours ago",
//     content:
//       "Just launched our new design system! So excited about the possibilities this opens up for our team. 🎨✨",
//     media: {
//       type: "image",
//       src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
//     },
//     stats: {
//       likes: 1203,
//       comments: 124,
//       shares: 45,
//     },
//   },
//   {
//     id: "3",
//     author: {
//       name: "Emma Davis",
//       username: "emmadavis",
//       avatar: "E",
//     },
//     timestamp: "6 hours ago",
//     content:
//       "Design tip: Always consider accessibility from the start. It's not an afterthought—it's part of good design.",
//     stats: {
//       likes: 2341,
//       comments: 201,
//       shares: 89,
//     },
//   },
// ];

// const Bookmarks = () => {
//   return (
//       <div className="max-w-2xl mx-auto border-l border-r border-border min-h-screen">

//         {/* Header */}
//         <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-4 sm:px-6 py-6">
//           <h2 className="text-2xl font-bold">Bookmarks</h2>
//           <p className="text-muted-foreground text-sm mt-1">
//             {BOOKMARKED_POSTS.length} saved posts
//           </p>
//         </div>

//         {/* Posts */}
//         <div className="divide-y divide-border">
//           {BOOKMARKED_POSTS.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 px-4">
//               <div className="text-6xl mb-4">📑</div>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 No bookmarks yet
//               </h2>
//               <p className="text-muted-foreground text-center">
//                 Save posts you want to read later. They'll appear here.
//               </p>
//             </div>
//           ) 
//           : ( ""
//             // BOOKMARKED_POSTS.map((post) => (
//             //   <PostCard
//             //     key={post.id}
//             //     author={post.author}
//             //     timestamp={post.timestamp}
//             //     content={post.content}
//             //     media={post.media}
//             //     stats={post.stats}
//             //   />
//             // )) 
//           )
//           }
//         </div>
//       </div>
   
//   );
// };

// export default Bookmarks;
