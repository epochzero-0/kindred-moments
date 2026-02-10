import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Shield, Users, ChevronLeft, Search, UtensilsCrossed, Sunrise, User, Laptop, BookOpen, Palette, Paperclip, Camera, type LucideIcon } from "lucide-react";
import { useCurrentUser, useUsers, useClans } from "@/hooks/use-data";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: "clan" | "trio" | "direct";
  icon: LucideIcon;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  members: number;
  isNew?: boolean;
  suggestedStarters?: string[];
}

const mockDirectRooms: ChatRoom[] = [
  {
    id: "mwt-1",
    name: "Morning Walk Trio",
    type: "trio",
    icon: Sunrise,
    lastMessage: "See you at 6:30am!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: 0,
    members: 3
  },
  {
    id: "uid-ravi",
    name: "Ravi Kumar",
    type: "direct",
    icon: User,
    lastMessage: "Thanks for the recommendation!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 0,
    members: 2
  },
];

const mockMessagesByRoom: Record<string, Message[]> = {
  "c01": [
    { id: "m1-1", senderId: "u034", senderName: "Wei Lin", content: "Hey guys, the tech meetup was awesome yesterday!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isMe: false },
    { id: "m1-2", senderId: "u023", senderName: "Raj", content: "Totally! The AI workshop was mind-blowing.", timestamp: new Date(Date.now() - 1000 * 60 * 55), isMe: false },
    { id: "m1-3", senderId: "u001", senderName: "You", content: "Did anyone take photos of the slides?", timestamp: new Date(Date.now() - 1000 * 60 * 10), isMe: true },
    { id: "m1-4", senderId: "u047", senderName: "Sarah", content: "I got a few! Let me share them.", timestamp: new Date(Date.now() - 1000 * 60 * 5), isMe: false },
    { id: "m1-5", senderId: "u047", senderName: "Sarah", content: "Uploading the photos now... give me a sec", timestamp: new Date(), isMe: false },
  ],
  "c02": [
    { id: "m2-1", senderId: "u022", senderName: "Aiman", content: "How's everyone doing with the reading list?", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "m2-2", senderId: "u017", senderName: "Priya", content: "Just finished the first book. It's intense.", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
    { id: "m2-3", senderId: "u001", senderName: "You", content: "I'm struggling a bit with the second part.", timestamp: new Date(Date.now() - 1000 * 60 * 20), isMe: true },
    { id: "m2-4", senderId: "u032", senderName: "Ken", content: "Chapter 4 needs some review tbh, let's discuss it next meet.", timestamp: new Date(Date.now() - 1000 * 60 * 15), isMe: false },
  ],
  "c03": [
    { id: "m3-1", senderId: "u039", senderName: "Li Wei", content: "I'll be at the library from 2pm.", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "m3-2", senderId: "u032", senderName: "Ken", content: "On my way!", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
  ],
  "c04": [
    { id: "m4-1", senderId: "u044", senderName: "Hui Min", content: "Lunch tomorrow?", timestamp: new Date(Date.now() - 1000 * 60 * 300), isMe: false },
    { id: "m4-2", senderId: "u009", senderName: "John", content: "I'm craving Laksa.", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "m4-3", senderId: "u003", senderName: "Farah", content: "That laksa place is closed on Mondays! We should try the new chicken rice stall instead.", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
  ],
  "c05": [
    { id: "m5-1", senderId: "u001", senderName: "You", content: "6:30am works for everyone?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), isMe: true },
    { id: "m5-2", senderId: "u099", senderName: "Uncle Lim", content: "Can, see you at the park entrance.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), isMe: false },
    { id: "m5-3", senderId: "u098", senderName: "Auntie Rose", content: "See you at 6:30am!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), isMe: false },
  ],
  "uid-ravi": [
    { id: "m6-1", senderId: "u001", senderName: "You", content: "Hey Ravi, where was that coffee place you mentioned?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), isMe: true },
    { id: "m6-2", senderId: "u055", senderName: "Ravi", content: "It's called 'Nanyang Old Coffee' in Chinatown.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), isMe: false },
    { id: "m6-3", senderId: "u001", senderName: "You", content: "Thanks for the recommendation!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isMe: true },
  ]
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const currentUser = useCurrentUser();
  const users = useUsers();
  const clans = useClans();

  // Combine real clans with mock direct chats
  const allRooms: ChatRoom[] = [
    // Transform clans to chat rooms
    ...clans.map(clan => {
      // Determine icon based on theme
      let Icon = Users;
      if (clan.theme === 'tech') Icon = Laptop;
      if (clan.theme === 'study') Icon = BookOpen;
      if (clan.theme === 'food') Icon = UtensilsCrossed;
      if (clan.theme === 'art') Icon = Palette;

      return {
        id: clan.id,
        name: clan.name,
        type: 'clan' as const,
        icon: Icon,
        lastMessage: "Tap to view conversation", // Default text
        lastMessageTime: new Date(), // Default time
        unread: 0,
        members: clan.members.length
      };
    }),
    ...mockDirectRooms
  ];

  // Check for roomId or userId in URL
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    const userId = searchParams.get("userId");

    if (roomId) {
      const room = allRooms.find(r => r.id === roomId);
      if (room) {
        setSelectedRoom(room);
        return;
      }
    }

    if (userId) {
      // Check existing direct chat
      const existingRoom = allRooms.find(r => r.type === 'direct' && r.name.includes('Ravi') && userId.includes('002'));

      if (existingRoom) {
        setSelectedRoom(existingRoom);
        return;
      }

      // Create temp room for new DM
      const targetUser = users.find(u => u.id === userId);
      if (targetUser && currentUser) {
        // Find shared interests
        const sharedInterests = targetUser.interests.filter(i => currentUser.interests.includes(i));
        const starters = sharedInterests.map(i => `Hi! I saw you're also into ${i}.`);
        if (starters.length === 0) starters.push("Hi! I'm from the same neighbourhood.");

        const newRoom: ChatRoom = {
          id: `new-${userId}`,
          name: targetUser.name,
          type: "direct",
          icon: User,
          lastMessage: "Start a conversation",
          lastMessageTime: new Date(),
          unread: 0,
          members: 2,
          isNew: true,
          suggestedStarters: starters
        };
        setSelectedRoom(newRoom);
      }
    }
  }, [searchParams, users, currentUser]);

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      setMessages(mockMessagesByRoom[selectedRoom.id] || []);
    }
  }, [selectedRoom]);

  const handleSendMessage = (msgContent?: string) => {
    const content = typeof msgContent === 'string' ? msgContent : newMessage;
    if (!content.trim() || !currentUser) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name.split(" ")[0],
      content: content,
      timestamp: new Date(),
      isMe: true,
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/50 flex items-center gap-3 w-full justify-between z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  // clear query param
                  window.history.pushState({}, "", "/chat");
                }}
                className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <selectedRoom.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-foreground text-sm">{selectedRoom.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedRoom.members} members</p>
              </div>
            </div>
          </div>

          {/* Active Status Bar */}
          <AnimatePresence>
            {isCameraActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-primary/5 px-6 py-2 flex items-center justify-center text-xs text-primary font-medium border-b border-primary/10"
              >
                <Camera className="h-3 w-3 mr-2 animate-pulse" />
                You are taking a photo...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pandan/10 text-pandan text-xs">
                <Shield className="h-3 w-3" />
                <span>All members verified</span>
              </div>
            </div>

            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] ${message.isMe ? "order-2" : ""}`}>
                  {!message.isMe && (
                    <p className="text-[10px] text-muted-foreground mb-0.5 ml-3">{message.senderName}</p>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl ${message.isMe
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white shadow-soft rounded-bl-md"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-0.5 ${message.isMe ? "text-right mr-3" : "ml-3"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-border/50">
            <div className="flex items-end gap-2">
              <div className="flex gap-1 mb-1">
                <button
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleCamera}
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isCameraActive
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  title="Take photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 bg-muted rounded-xl flex items-center px-4 py-2.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!newMessage.trim()}
                className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft disabled:opacity-50 hover:opacity-90 transition-opacity mb-0.5"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-8 py-10 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-muted-foreground text-sm mb-1">Messages</p>
              <h1 className="text-3xl text-foreground mb-6">Stay connected</h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white shadow-soft border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          </div>

          {/* Chat list */}
          <div className="px-8 pb-12 flex-1 scrollbar-hide">
            <div className="space-y-2">
              {allRooms.map((room, i) => (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => setSelectedRoom(room)}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft text-left card-hover"
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <room.icon className="h-5 w-5 text-primary" />
                    </div>
                    {room.unread > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {room.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-foreground text-sm">{room.name}</h3>
                      <span className="text-[10px] text-muted-foreground">{formatTime(room.lastMessageTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {room.type === "clan" && <Users className="h-3 w-3 text-muted-foreground" />}
                      <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
