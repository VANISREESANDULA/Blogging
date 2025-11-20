import React from "react";
import Layout from "../ui/Layout";
import { Search } from "lucide-react";

const TRENDING_TOPICS = [
  { topic: "#DesignTrends", posts: "45.2K" },
  { topic: "#WebDevelopment", posts: "32.8K" },
  { topic: "#ReactJS", posts: "28.5K" },
  { topic: "#UXDesign", posts: "19.3K" },
];

const TOP_CREATORS = [
  { name: "Sarah Johnson", username: "sarahj", followers: "125K" },
  { name: "Alex Chen", username: "alexchen", followers: "98K" },
  { name: "Emma Davis", username: "emmadavis", followers: "87K" },
  { name: "Marcus Wilson", username: "marcusw", followers: "76K" },
];

const Explore = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search people, posts, hashtags..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Trending Topics */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Trending</h2>

            <div className="space-y-4">
              {TRENDING_TOPICS.map((item) => (
                <button
                  key={item.topic}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <p className="font-bold text-foreground text-sm sm:text-base">
                    {item.topic}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.posts} posts
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          {/* <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Top Creators
            </h2>

            <div className="space-y-4">
              {TOP_CREATORS.map((creator) => (
                <div
                  key={creator.username}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
                      {creator.username[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">
                        {creator.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {creator.followers} followers
                      </p>
                    </div>
                  </div>

                  <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:shadow-lg transition-shadow ml-2 shrink-0">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div> */}

          {/* Popular Posts Section */}
          {/* <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Popular</h2>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <p className="text-xs text-muted-foreground mt-3">
                    2.5K interactions
                  </p>
                </div>
              ))}
            </div>
          </div> */}

        </div>
      </div>
    </Layout>
  );
};

export default Explore;
