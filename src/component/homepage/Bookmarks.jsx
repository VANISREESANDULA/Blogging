// import Layout from "../ui/Layout";
// import PostCard from "../ui/PostCard";

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
//     <Layout>
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
//           ) : (
//             BOOKMARKED_POSTS.map((post) => (
//               <PostCard
//                 key={post.id}
//                 author={post.author}
//                 timestamp={post.timestamp}
//                 content={post.content}
//                 media={post.media}
//                 stats={post.stats}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Bookmarks;







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
      <div className="max-w-2xl mx-auto border-l border-r border-border min-h-screen px-0 sm:px-0 md:px-0 lg:px-0">
        
        {/* Header - RESPONSIVE */}
        <div className="sticky top-16 z-30 border-b border-border bg-background/75 backdrop-blur px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Bookmarks
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
            {BOOKMARKED_POSTS.length} saved {BOOKMARKED_POSTS.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {/* Posts Container - RESPONSIVE */}
        <div className="divide-y divide-border">
          {BOOKMARKED_POSTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 md:mb-5">📑</div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2 md:mb-3 text-center">
                No bookmarks yet
              </h2>
              <p className="text-muted-foreground text-center text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-md">
                Save posts you want to read later. They'll appear here.
              </p>
            </div>
          ) : (
            BOOKMARKED_POSTS.map((post) => (
              <div key={post.id} className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5">
                <PostCard
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
                  media={post.media}
                  stats={post.stats}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bookmarks;
 
