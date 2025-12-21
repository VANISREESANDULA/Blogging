import React, { useState, useRef, useEffect } from "react";
import Layout from "../ui/Layout";
import { Search, Send, Paperclip, Mic, Smile, MoreVertical, Phone, Video, Info, ArrowLeft, Filter, Check, UserPlus, Archive, Delete, Pin } from "lucide-react";
import { useSelector } from "react-redux";

const CONVERSATIONS = [
  { id: 1, name: "Sarah Johnson", avatar: "S", lastMessage: "That sounds great!", online: true, lastSeen: "2 min ago", unread: 3 },
  { id: 2, name: "Alex Chen", avatar: "A", lastMessage: "See you tomorrow!", online: false, lastSeen: "1 hour ago", unread: 0 },
  { id: 3, name: "Emma Davis", avatar: "E", lastMessage: "Thanks for the update", online: true, lastSeen: "5 min ago", unread: 1 },
  { id: 4, name: "Marcus Wilson", avatar: "M", lastMessage: "Perfect, let's proceed", online: false, lastSeen: "3 hours ago", unread: 0 },
  { id: 5, name: "Michael Brown", avatar: "M", lastMessage: "Let's catch up next week", online: false, lastSeen: "2 days ago", unread: 0 },
];

// Sample messages for each conversation
const SAMPLE_MESSAGES = {
  1: [
    { id: 1, text: "Hey there! How are you doing?", sender: "them", time: "10:30 AM", read: true },
    { id: 2, text: "I'm good! Just working on the project.", sender: "me", time: "10:31 AM", read: true },
    { id: 3, text: "That sounds great! Let me know if you need any help.", sender: "them", time: "10:32 AM", read: true },
    { id: 4, text: "Actually, could you review the latest design mockups?", sender: "me", time: "10:33 AM", read: true },
    { id: 5, text: "Sure, send them over. I'll take a look today.", sender: "them", time: "10:35 AM", read: false },
  ],
  2: [
    { id: 1, text: "Meeting tomorrow at 3 PM?", sender: "them", time: "Yesterday", read: true },
    { id: 2, text: "Yes, that works for me!", sender: "me", time: "Yesterday", read: true },
    { id: 3, text: "See you tomorrow!", sender: "them", time: "Yesterday", read: true },
  ],
  3: [
    { id: 1, text: "The documents have been updated.", sender: "them", time: "2 hours ago", read: true },
    { id: 2, text: "Thanks for the update! I'll review them.", sender: "me", time: "1 hour ago", read: true },
  ],
  4: [
    { id: 1, text: "We should proceed with the initial plan.", sender: "me", time: "4 hours ago", read: true },
    { id: 2, text: "Perfect, let's proceed accordingly.", sender: "them", time: "3 hours ago", read: true },
  ],
  5: [
    { id: 1, text: "Team meeting notes attached", sender: "Sarah Johnson", time: "Yesterday", read: true },
    { id: 2, text: "Great work everyone!", sender: "Alex Chen", time: "Yesterday", read: true },
    { id: 3, text: "Thanks team! Let's keep this momentum.", sender: "me", time: "Yesterday", read: true },
  ],
  6: [
    { id: 1, text: "Let's catch up next week", sender: "them", time: "2 days ago", read: true },
    { id: 2, text: "Sounds good, how about Wednesday?", sender: "me", time: "1 day ago", read: true },
  ],
  7: [
    { id: 1, text: "Deadline extended to Friday", sender: "Manager", time: "2 days ago", read: true },
    { id: 2, text: "Thanks for the update", sender: "Emma Davis", time: "2 days ago", read: true },
    { id: 3, text: "We should use this time to polish the details", sender: "me", time: "1 day ago", read: true },
  ],
};

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const messagesEndRef = useRef(null);
  
  // Get dark mode state from Redux
  const isDark = useSelector((state) => state.theme.isDark);

  // Filter conversations based on search and tab
  const filteredConversations = CONVERSATIONS.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "unread") return matchesSearch && conversation.unread > 0;
    if (activeTab === "groups") return matchesSearch && conversation.group;
    return matchesSearch;
  });

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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    // Clear unread count for this conversation
    CONVERSATIONS.forEach(conv => {
      if (conv.id === selectedChat) {
        conv.unread = 0;
      }
    });

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

  const getSelectedChatInfo = () => {
    return CONVERSATIONS.find((c) => c.id === selectedChat);
  };

  return (
    <Layout>
      <div className={`flex h-[calc(100vh-64px)] max-w-full mx-auto overflow-hidden ${isDark ? 'bg-black' : ''}`}>
        
        {/* Left Sidebar - Conversations */}
        <div className={`w-full sm:w-96 border-r flex flex-col ${selectedChat ? "hidden sm:flex" : "flex"} ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
          
          {/* Sidebar Header */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Messages</h2>
              <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                <UserPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 ${
                  isDark 
                    ? 'bg-gray-900 border border-gray-800 text-gray-100' 
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2">
              {["all", "unread", "groups"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-orange-600 text-white"
                      : isDark
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full p-4 border-b transition-all duration-200 text-left group ${
                  selectedChat === conversation.id 
                    ? isDark
                      ? "bg-gradient-to-r from-gray-900 to-gray-800 border-l-4 border-orange-500"
                      : "bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500"
                    : isDark
                    ? "border-gray-800 hover:bg-gray-900"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow ${
                      conversation.group 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                        : "bg-gradient-to-br from-orange-500 to-amber-500"
                    }`}>
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          {conversation.name}
                        </p>
                        {conversation.group && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            Group
                          </span>
                        )}
                      </div>
                      <span className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {conversation.lastSeen}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conversation.unread > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden sm:flex"} ${isDark ? 'bg-black' : 'bg-white'}`}>
          
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 border-b ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Back Button (mobile only) */}
                    <button
                      onClick={() => setSelectedChat(null)}
                      className={`sm:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Chat Partner Info */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow ${
                        getSelectedChatInfo()?.group 
                          ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                          : "bg-gradient-to-br from-orange-500 to-amber-500"
                      }`}>
                        {getSelectedChatInfo()?.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {getSelectedChatInfo()?.name}
                          </h3>
                          {getSelectedChatInfo()?.verified && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getSelectedChatInfo()?.online
                            ? "Active now"
                            : `Last seen ${getSelectedChatInfo()?.lastSeen}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                      <Video className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                      <Info className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className={`flex-1 p-4 md:p-6 space-y-4 overflow-y-auto ${
                isDark 
                  ? 'bg-gradient-to-b from-gray-900 to-black' 
                  : 'bg-gradient-to-b from-gray-50/50 to-white'
              }`}>
                {messages[selectedChat]?.length > 0 ? (
                  <div className="space-y-4">
                    {/* Date Separator */}
                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                        isDark 
                          ? 'text-gray-400 bg-gray-900' 
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        Today
                      </span>
                    </div>

                    {/* Messages */}
                    {messages[selectedChat].map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] lg:max-w-[60%] ${
                          message.sender === "me" ? "ml-auto" : ""
                        }`}>
                          {/* Sender name for group chats */}
                          {message.sender !== "me" && getSelectedChatInfo()?.group && (
                            <p className={`text-xs font-medium mb-1 ml-1 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {message.sender}
                            </p>
                          )}
                          
                          {/* Message Bubble */}
                          <div
                            className={`rounded-2xl px-4 py-3 relative ${
                              message.sender === "me"
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none shadow-lg"
                                : isDark
                                ? "bg-gray-900 text-gray-100 rounded-bl-none border border-gray-800 shadow-sm"
                                : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-sm"
                            }`}
                          >
                            <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-2 ${
                              message.sender === "me" 
                                ? "text-amber-100" 
                                : isDark 
                                  ? "text-gray-500" 
                                  : "text-gray-500"
                            }`}>
                              <span className="text-xs">{message.time}</span>
                              {message.sender === "me" && (
                                <span className="text-xs">
                                  {message.read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      isDark 
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                        : 'bg-gradient-to-r from-orange-100 to-amber-100'
                    }`}>
                      <div className="text-3xl">👋</div>
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Start a conversation
                    </h3>
                    <p className={`max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Send your first message to begin chatting with {getSelectedChatInfo()?.name}
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  {/* Attachment Button */}
                  <button className={`p-3 rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}>
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className={`w-full px-4 py-3 pr-24 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 ${
                        isDark 
                          ? 'bg-gray-900 border border-gray-800 text-gray-100' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <button className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-800 text-gray-500 hover:text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}>
                        <Smile className="w-5 h-5" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-800 text-gray-500 hover:text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}>
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      messageInput.trim()
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:scale-105"
                        : isDark
                        ? "bg-gray-900 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 ${
              isDark ? 'text-gray-100' : ''
            }`}>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                isDark 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
                  : 'bg-gradient-to-r from-orange-100 to-amber-100'
              }`}>
                <div className="text-5xl">💬</div>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Your Messages
              </h2>
              <p className={`max-w-md mb-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Select a conversation from the list to start messaging, or create a new conversation to connect with others.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:shadow-lg transition-all duration-200">
                  New Conversation
                </button>
                <button className={`px-6 py-3 rounded-xl font-medium hover:transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-900 text-gray-300 hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Browse Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;