import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Shield, Users, ChevronLeft, Search, UtensilsCrossed, Sunrise, User, type LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-data";

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
}

const mockChatRooms: ChatRoom[] = [
  { id: "c1", name: "Jurong Foodies", type: "clan", icon: UtensilsCrossed, lastMessage: "Anyone up for laksa later?", lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), unread: 3, members: 8 },
  { id: "c2", name: "Morning Walk Trio", type: "trio", icon: Sunrise, lastMessage: "See you at 6:30am!", lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), unread: 0, members: 3 },
  { id: "c3", name: "Bedok Buddies", type: "clan", icon: Users, lastMessage: "Great session today everyone!", lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), unread: 0, members: 6 },
  { id: "c4", name: "Ravi Kumar", type: "direct", icon: User, lastMessage: "Thanks for the kopi recommendation!", lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), unread: 1, members: 2 },
];

const mockMessages: Message[] = [
  { id: "m1", senderId: "u002", senderName: "Wei Lin", content: "Hey everyone! Anyone free for kopi this afternoon?", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
  { id: "m2", senderId: "u003", senderName: "Aiman", content: "I'm in! What time are you thinking?", timestamp: new Date(Date.now() - 1000 * 60 * 55), isMe: false },
  { id: "m3", senderId: "u001", senderName: "Sarah", content: "Count me in too! Maybe around 3pm?", timestamp: new Date(Date.now() - 1000 * 60 * 50), isMe: true },
  { id: "m4", senderId: "u002", senderName: "Wei Lin", content: "Perfect! Let's meet at the usual kopitiam near Blk 78", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
  { id: "m5", senderId: "u004", senderName: "Priya", content: "I'll join you all! Been meaning to check out that place 🙌", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  { id: "m6", senderId: "u001", senderName: "Sarah", content: "Great! See everyone at 3pm then ☕", timestamp: new Date(Date.now() - 1000 * 60 * 25), isMe: true },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

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
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/50 flex items-center gap-3">
            <button
              onClick={() => setSelectedRoom(null)}
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
                    className={`px-3.5 py-2.5 rounded-2xl ${
                      message.isMe
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft disabled:opacity-50 hover:opacity-90 transition-opacity"
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
          <div className="px-8 pb-12 flex-1">
            <div className="space-y-2">
              {mockChatRooms.map((room, i) => (
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
