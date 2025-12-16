import React from "react";
import { Plus } from "lucide-react";

const CreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-md z-40"
      title="Create a new post"
      aria-label="Create a new post"
    >
      <Plus className="relative z-10" />
    </button>
  );
};

export default CreateButton;
