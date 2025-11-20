import React, { useState } from "react";
import { X, Loader } from "lucide-react";
import { cn } from "../../lib/utils";

const ComposerModal = ({ isOpen, onClose, onPost }) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;

    setIsPosting(true);

    setTimeout(() => {
      onPost({
        content,
        visibility,
      });

      setContent("");
      setVisibility("public");
      setIsPosting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/10 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-card shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col border">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-linear-to-r from-primary/10 to-accent/10">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Create Post
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors ml-auto"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* User Avatar */}
          <div className="flex gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold">
              U
            </div>

            {/* Visibility */}
            <div className="flex-1">
              <p className="font-bold text-foreground">Your Name</p>
              <div className="mt-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-sm bg-secondary px-3 py-2 rounded-full border border-border cursor-pointer hover:border-primary transition-colors focus:ring-2 focus:ring-primary/50"
                >
                  <option value="public">🌐 Public</option>
                  <option value="friends">👥 Friends Only</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            autoFocus
            className="w-full min-h-40 resize-none bg-secondary rounded-2xl px-4 py-3 text-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">{content.length} / 500</span>

          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className={cn(
              "px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all",
              content.trim()
                ? "bg-gradient-to-r from-primary to-accent text-white hover:scale-105 hover:shadow-lg"
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
