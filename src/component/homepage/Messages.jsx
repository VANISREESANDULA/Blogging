import React, { useState } from "react";
import Layout from "../ui/Layout";
import { Search, Send } from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "Sarah Johnson", avatar: "S", lastMessage: "That sounds great!", online: true },
  { id: 2, name: "Alex Chen", avatar: "A", lastMessage: "See you tomorrow!", online: false },
  { id: 3, name: "Emma Davis", avatar: "E", lastMessage: "Thanks for the update", online: true },
  { id: 4, name: "Marcus Wilson", avatar: "M", lastMessage: "Perfect, let's proceed", online: false },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] max-w-7xl mx-auto overflow-hidden">

        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col bg-background ${selectedChat ? "hidden md:flex" : ""}`}>
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Messages</h2>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} bg/>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full p-3 sm:p-4 border-b border-border hover:bg-secondary transition-colors text-left ${
                  selectedChat === conversation.id ? "bg-secondary" : ""
                }`}
              >
                <div className="flex gap-2 sm:gap-3 items-start">
                  
                  {/* Avatar */}
                  <div className="relative shrink-0 bg-amber-50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm sm:text-base">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>

                  {/* Name + Last Message */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {conversation.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-background ${selectedChat ? "flex md:flex" : "hidden md:flex"}`}>
          
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-border">
                <div className="flex items-center gap-2 sm:gap-3">

                  {/* Back Button (mobile only) */}
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    ←
                  </button>

                  {/* Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm">
                    {CONVERSATIONS.find((c) => c.id === selectedChat)?.avatar}
                  </div>

                  {/* Name + Online Status */}
                  <div>
                    <p className="font-bold text-sm sm:text-base">
                      {CONVERSATIONS.find((c) => c.id === selectedChat)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {CONVERSATIONS.find((c) => c.id === selectedChat)?.online
                        ? "Active now"
                        : "Offline"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-muted-foreground">Start a conversation!</p>
                  </div>
                </div>
              </div>

              {/* Input Box */}
              <div className="p-3 sm:p-4 border-t border-border">
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <button className="p-2 sm:p-3 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-shadow flex-shrink-0">
                    <Send size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="text-5xl sm:text-6xl mb-4">✉️</div>
              <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Select a conversation
              </p>
              <p className="text-sm text-muted-foreground">
                Choose someone to start messaging
              </p>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default Messages;
