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

        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col bg-background/95 backdrop-blur-sm ${selectedChat ? "hidden md:flex" : "flex"}`}>
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border bg-background/80">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Messages
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-sm backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border hover:scrollbar-thumb-border/80">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full p-3 sm:p-4 border-b border-border/50 hover:bg-secondary/50 transition-all duration-200 text-left group ${
                  selectedChat === conversation.id 
                    ? "bg-gradient-to-r from-primary/10 to-accent/5 border-l-4 border-l-primary" 
                    : ""
                }`}
              >
                <div className="flex gap-2 sm:gap-3 items-start">
                  
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background shadow-sm" />
                    )}
                  </div>

                  {/* Name + Last Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-foreground text-sm sm:text-base truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {conversation.lastSeen}
                      </span>
                    </div>
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
        <div className={`flex-1 flex flex-col bg-background/95 backdrop-blur-sm ${selectedChat ? "flex" : "hidden md:flex"}`}>
          
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-border/50 bg-background/80">
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Back Button (mobile only) */}
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
                    >
                      ←
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm shadow-lg">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.avatar}
                      </div>
                      {CONVERSATIONS.find((c) => c.id === selectedChat)?.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>

                    {/* Name + Online Status */}
                    <div>
                      <p className="font-bold text-sm sm:text-base">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CONVERSATIONS.find((c) => c.id === selectedChat)?.online
                          ? "Active now"
                          : `Last seen ${CONVERSATIONS.find((c) => c.id === selectedChat)?.lastSeen}`}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200">
                      <MoreVertical size={18} className="text-muted-foreground" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border hover:scrollbar-thumb-border/80 bg-gradient-to-b from-background to-secondary/20">
                {messages[selectedChat]?.length > 0 ? (
                  messages[selectedChat].map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl relative group ${
                          message.sender === "me"
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-md shadow-lg"
                            : "bg-secondary text-foreground rounded-bl-md border border-border/50 shadow-sm"
                        }`}
                      >
                        <p className="text-sm sm:text-base">{message.text}</p>
                        <span
                          className={`text-xs mt-1 block text-right ${
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
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-muted-foreground">Start a conversation!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 sm:p-4 border-t border-border/50 bg-background/80">
                <div className="flex gap-2 sm:gap-3">
                  {/* Attachment Button */}
                  <button className="p-2 sm:p-3 rounded-full bg-secondary hover:bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground transition-all duration-200 flex-shrink-0">
                    <Paperclip size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2.5 sm:py-3 rounded-full bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 text-sm pr-20 backdrop-blur-sm"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <button className="p-1.5 hover:bg-background/50 rounded-full transition-colors duration-200">
                        <Smile size={18} className="text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-background/50 rounded-full transition-colors duration-200">
                        <Mic size={18} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground hover:shadow-lg transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <Send size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-background to-secondary/10">
              <div className="text-5xl sm:text-6xl mb-4">✉️</div>
              <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Select a conversation
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
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