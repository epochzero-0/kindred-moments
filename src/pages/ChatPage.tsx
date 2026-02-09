import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, Shield, Users, ChevronLeft } from "lucide-react";
import { useClans, useClanMembers, useCurrentUser } from "@/hooks/use-data";

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
  emoji: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  members: number;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: "c1",
    name: "Jurong Foodies",
    type: "clan",
    emoji: "🍜",
    lastMessage: "Anyone up for laksa later?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unread: 3,
    members: 8,
  },
  {
    id: "c2",
    name: "Morning Walk Trio",
    type: "trio",
    emoji: "🌅",
    lastMessage: "See you at 6:30am!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unread: 0,
    members: 3,
  },
  {
    id: "c3",
    name: "Bedok Buddies",
    type: "clan",
    emoji: "👥",
    lastMessage: "Great session today everyone!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
    members: 6,
  },
  {
    id: "c4",
    name: "Ravi Kumar",
    type: "direct",
    emoji: "👤",
    lastMessage: "Thanks for the kopi recommendation!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
    members: 2,
  },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "u002",
    senderName: "Wei Lin",
    content: "Hey everyone! Anyone free for kopi this afternoon?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isMe: false,
  },
  {
    id: "m2",
    senderId: "u003",
    senderName: "Aiman",
    content: "I'm in! What time are you thinking?",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    isMe: false,
  },
  {
    id: "m3",
    senderId: "u001",
    senderName: "Sarah",
    content: "Count me in too! Maybe around 3pm?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    isMe: true,
  },
  {
    id: "m4",
    senderId: "u002",
    senderName: "Wei Lin",
    content: "Perfect! Let's meet at the usual kopitiam near Blk 78",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isMe: false,
  },
  {
    id: "m5",
    senderId: "u004",
    senderName: "Priya",
    content: "I'll join you all! Been meaning to check out that place 🙌",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isMe: false,
  },
  {
    id: "m6",
    senderId: "u001",
    senderName: "Sarah",
    content: "Great! See everyone at 3pm then ☕",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isMe: true,
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useCurrentUser();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name.split(" ")[0],
      content: newMessage,
      timestamp: new Date(),
      isMe: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {selectedRoom ? (
        // Chat view
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-8 py-4 bg-white border-b border-border flex items-center gap-4">
            <button
              onClick={() => setSelectedRoom(null)}
              className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedRoom(null)}
              className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors hidden lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl">
              {selectedRoom.emoji}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">{selectedRoom.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedRoom.members} members · Active now
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                <Video className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {/* Safety notice */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pandan/10 text-pandan text-sm">
                <Shield className="h-4 w-4" />
                <span>All members are Singpass verified</span>
              </div>
            </div>

            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${message.isMe ? "order-2" : ""}`}>
                  {!message.isMe && (
                    <p className="text-xs font-medium text-muted-foreground mb-1 ml-3">
                      {message.senderName}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isMe
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white rounded-br-md"
                        : "bg-white shadow-elevated rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${message.isMe ? "text-right mr-3" : "ml-3"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 bg-white border-t border-border">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Chat list view
        <>
          {/* Hero Header */}
          <div className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative px-8 lg:px-12 pt-12 pb-6">
              <motion.div {...fade(0)}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-600">Messages</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Stay connected
                </h1>
                <p className="text-muted-foreground">Chat with your clans and connections</p>
              </motion.div>
            </div>
          </div>

          {/* Search */}
          <div className="px-8 lg:px-12 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-elevated border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="px-8 lg:px-12 pb-12 flex-1">
            <motion.div {...fade(0.1)} className="space-y-3">
              {mockChatRooms.map((room, i) => (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                  onClick={() => setSelectedRoom(room)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-elevated text-left transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-0.5"
                >
                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-2xl">
                      {room.emoji}
                    </div>
                    {room.unread > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {room.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{room.name}</h3>
                      <span className="text-xs text-muted-foreground">{formatTime(room.lastMessageTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.type === "clan" && <Users className="h-3 w-3 text-muted-foreground" />}
                      <p className="text-sm text-muted-foreground truncate">{room.lastMessage}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Start new chat */}
            <motion.div {...fade(0.3)} className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Start a new conversation</span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
