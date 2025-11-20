import React from "react";
import { Plus } from "lucide-react";

const CreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-14 h-14 rounded-full bg-linear-to-br from-primary via-accent to-primary flex items-center justify-center text-black bg-orange-100 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group z-40"
      style={{
        backgroundSize: "200% 200%",
      }}
      title="Create a new post"
      aria-label="Create a new post"
    >
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary via-accent to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      <Plus size={24} className="relative z-10" strokeWidth={2.5} />
    </button>
  );
};

export default CreateButton;
