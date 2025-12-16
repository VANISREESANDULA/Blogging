import React, { useState, useRef, useEffect } from "react";
import Layout from "../ui/Layout";
import { Search, Send, Paperclip, Mic, Smile, MoreVertical } from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "Sarah Johnson", avatar: "S", lastMessage: "That sounds great!", online: true, lastSeen: "2 min ago" },
  { id: 2, name: "Alex Chen", avatar: "A", lastMessage: "See you tomorrow!", online: false, lastSeen: "1 hour ago" },
  { id: 3, name: "Emma Davis", avatar: "E", lastMessage: "Thanks for the update", online: true, lastSeen: "5 min ago" },
  { id: 4, name: "Marcus Wilson", avatar: "M", lastMessage: "Perfect, let's proceed", online: false, lastSeen: "3 hours ago" },
];

// Sample messages for each conversation
const SAMPLE_MESSAGES = {
  1: [
    { id: 1, text: "Hey there! How are you doing?", sender: "them", time: "10:30 AM" },
    { id: 2, text: "I'm good! Just working on the project.", sender: "me", time: "10:31 AM" },
    { id: 3, text: "That sounds great! Let me know if you need any help.", sender: "them", time: "10:32 AM" },
  ],
  2: [
    { id: 1, text: "Meeting tomorrow at 3 PM?", sender: "them", time: "Yesterday" },
    { id: 2, text: "Yes, that works for me!", sender: "me", time: "Yesterday" },
    { id: 3, text: "See you tomorrow!", sender: "them", time: "Yesterday" },
  ],
  3: [
    { id: 1, text: "The documents have been updated.", sender: "them", time: "2 hours ago" },
    { id: 2, text: "Thanks for the update! I'll review them.", sender: "me", time: "1 hour ago" },
  ],
  4: [
    { id: 1, text: "We should proceed with the initial plan.", sender: "me", time: "4 hours ago" },
    { id: 2, text: "Perfect, let's proceed accordingly.", sender: "them", time: "3 hours ago" },
  ],
};

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Filter conversations based on search
  const filteredConversations = CONVERSATIONS.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize messages when component mounts
  useEffect(() => {
    setMessages(SAMPLE_MESSAGES);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    // Update last message in CONVERSATIONS (in a real app, this would update in your backend)
    const updatedConversations = CONVERSATIONS.map(conv => 
      conv.id === selectedChat 
        ? { ...conv, lastMessage: messageInput.length > 30 ? messageInput.substring(0, 30) + "..." : messageInput }
        : conv
    );
    
    // In a real app, you would set this back to your conversations state
    console.log("Updated conversations:", updatedConversations);

    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] max-w-7xl mx-auto overflow-hidden bg-background">

        {/* Sidebar - RESPONSIVE */}
        <div className={`w-full sm:w-80 border-r border-border flex flex-col bg-background/95 backdrop-blur-sm ${selectedChat ? "hidden sm:flex" : "flex"}`}>
          
          {/* Header - RESPONSIVE */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-border bg-background/80">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Messages</h2>

            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Conversation List - RESPONSIVE */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border hover:scrollbar-thumb-border/80">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full p-2 sm:p-3 md:p-4 border-b border-border/50 hover:bg-secondary/50 transition-all duration-200 text-left group ${
                  selectedChat === conversation.id 
                    ? "bg-gray-100 border-l-3 sm:border-l-4 border-l-blue-500" 
                    : ""
                }`}
              >
                <div className="flex gap-2 sm:gap-3 items-start">
                  
                  {/* Avatar - RESPONSIVE */}
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-success rounded-full border-2 border-background shadow-sm" />
                    )}
                  </div>

                  {/* Name + Last Message - RESPONSIVE */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <p className="font-bold text-foreground text-xs sm:text-sm md:text-base truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-1 sm:ml-2">
                        {conversation.lastSeen}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Main Chat Area - RESPONSIVE */}
        <div className={`flex-1 flex flex-col bg-background/95 backdrop-blur-sm ${selectedChat ? "flex" : "hidden sm:flex"}`}>
          
          {selectedChat ? (
            <>
              {/* Chat Header - RESPONSIVE */}
              <div className="p-2 sm:p-3 md:p-4 border-b border-border/50 bg-background/80">
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    {/* Back Button (mobile only) */}
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="sm:hidden p-1.5 hover:bg-secondary rounded-lg transition-colors duration-200 mr-1"
                    >
                      ←
                    </button>

                    {/* Avatar - RESPONSIVE */}
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm md:text-base shadow">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.avatar}
                      </div>
                      {CONVERSATIONS.find((c) => c.id === selectedChat)?.online && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>

                    {/* Name + Online Status - RESPONSIVE */}
                    <div>
                      <p className="font-bold text-xs sm:text-sm md:text-base">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.online
                          ? "Active now"
                          : `Last seen ${CONVERSATIONS.find((c) => c.id === selectedChat)?.lastSeen}`}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions - RESPONSIVE */}
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 sm:p-2 hover:bg-secondary rounded-lg transition-colors duration-200">
                      <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Message Area - RESPONSIVE */}
              <div className="flex-1 p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border hover:scrollbar-thumb-border/80 bg-white">
                {messages[selectedChat]?.length > 0 ? (
                  messages[selectedChat].map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] xs:max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl relative group ${
                          message.sender === "me"
                            ? "bg-blue-100 text-black rounded-br-md shadow"
                            : "bg-gray-100 text-foreground rounded-bl-md border border-border/50 shadow-sm"
                        }`}
                      >
                        <p className="text-xs sm:text-sm md:text-base wrap-break-word">{message.text}</p>
                        <span
                          className={`text-xs mt-0.5 sm:mt-1 block text-right ${
                            message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">💬</div>
                      <p className="text-sm sm:text-base text-muted-foreground">Start a conversation!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box - RESPONSIVE */}
              <div className="p-2 sm:p-3 md:p-4 border-t border-border/50 bg-background/80">
                <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-center w-full">
                  {/* Attachment Button - RESPONSIVE */}
                  <button className="p-1.5 sm:p-2 md:p-3 rounded-full bg-secondary hover:bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground transition-all duration-200 shrink-0">
                    <Paperclip size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                  </button>

                  {/* Message Input - RESPONSIVE */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-xs sm:text-sm pr-16 sm:pr-20 backdrop-blur-sm"
                    />
                    <div className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
                      <button className="p-1 hover:bg-background/50 rounded-full transition-colors duration-200">
                        <Smile size={14} className="sm:w-[16px] sm:h-[16px] text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-background/50 rounded-full transition-colors duration-200">
                        <Mic size={14} className="sm:w-[16px] sm:h-[16px] text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Send Button - RESPONSIVE */}
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-1.5 sm:p-2 md:p-3 rounded-full bg-blue-600 text-white hover:shadow-lg transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-5 bg-background">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4">✉️</div>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                Select a conversation
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm md:max-w-md">
                Choose a conversation from the list to start messaging or search for existing conversations
              </p>
            </div>
          )}

        </div>

      </div>
      
    </Layout>
  );
};

export default Messages;