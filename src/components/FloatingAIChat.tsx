import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Shield, Calendar, Users, Heart, Search, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "event-created" | "groups-found" | "mindfulness" | "people-found";
  metadata?: Record<string, unknown>;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm your Kindred companion. I can help you create events, find people with similar interests, guide you through mindfulness exercises, or answer questions. What would you like to do?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const quickActions: QuickAction[] = [
    { label: "Create Event", icon: <Calendar className="h-3 w-3" />, prompt: "Help me create a new event" },
    { label: "Find People", icon: <Users className="h-3 w-3" />, prompt: "Find people near me with similar interests" },
    { label: "Mindfulness", icon: <Heart className="h-3 w-3" />, prompt: "I need a quick mindfulness exercise" },
    { label: "Find Groups", icon: <Search className="h-3 w-3" />, prompt: "Help me find interest groups to join" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectIntent = (text: string): { intent: string; entities: Record<string, string> } => {
    const lowerText = text.toLowerCase();
    
    // Event creation patterns
    if (lowerText.includes("create") || lowerText.includes("make") || lowerText.includes("schedule") || lowerText.includes("plan")) {
      if (lowerText.includes("event") || lowerText.includes("session") || lowerText.includes("meetup") || lowerText.includes("gathering")) {
        const dayMatch = lowerText.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|next week)\b/);
        const activityMatch = lowerText.match(/\b(badminton|tennis|yoga|hiking|cooking|reading|movie|dinner|lunch|breakfast|coffee|tea|walk|run|swim|gym|dance|paint|draw|music|game|board game|mahjong)\b/);
        return {
          intent: "create_event",
          entities: {
            day: dayMatch?.[0] || "",
            activity: activityMatch?.[0] || "",
          },
        };
      }
    }

    // Mindfulness patterns
    if (lowerText.includes("mindful") || lowerText.includes("stress") || lowerText.includes("anxious") || lowerText.includes("calm") || lowerText.includes("breathe") || lowerText.includes("relax") || lowerText.includes("meditation")) {
      return { intent: "mindfulness", entities: {} };
    }

    // Find people patterns
    if ((lowerText.includes("find") || lowerText.includes("meet") || lowerText.includes("connect")) && (lowerText.includes("people") || lowerText.includes("someone") || lowerText.includes("neighbours") || lowerText.includes("neighbors"))) {
      const interestMatch = lowerText.match(/\b(photography|cooking|hiking|reading|music|art|travel|fitness|yoga|gaming|movies|books)\b/);
      return { intent: "find_people", entities: { interest: interestMatch?.[0] || "" } };
    }

    // Find groups patterns
    if ((lowerText.includes("find") || lowerText.includes("join") || lowerText.includes("discover")) && (lowerText.includes("group") || lowerText.includes("clan") || lowerText.includes("community"))) {
      const categoryMatch = lowerText.match(/\b(sports|arts|food|wellness|social|outdoor|indoor|creative)\b/);
      return { intent: "find_groups", entities: { category: categoryMatch?.[0] || "" } };
    }

    return { intent: "general", entities: {} };
  };

  const generateResponse = (userText: string): Message => {
    const { intent, entities } = detectIntent(userText);

    switch (intent) {
      case "create_event":
        const activity = entities.activity || "activity";
        const day = entities.day || "this weekend";
        return {
          id: `ai-${Date.now()}`,
          content: `Great! I'll help you set up a ${activity} session for ${day}. 🎯\n\nI've pre-filled an event:\n• Activity: ${activity.charAt(0).toUpperCase() + activity.slice(1)}\n• When: ${day.charAt(0).toUpperCase() + day.slice(1)}\n• Open to: Your neighbourhood\n\nWould you like me to:\n1. Post this to your neighbourhood chat\n2. Add a date/time poll\n3. Open the full event creator`,
          isUser: false,
          timestamp: new Date(),
          type: "event-created",
          metadata: { activity, day },
        };

      case "mindfulness":
        return {
          id: `ai-${Date.now()}`,
          content: `I'm here for you. Let's take a moment together. 🌿\n\n**Quick 2-Minute Calm:**\n\n1. Close your eyes gently\n2. Take 3 slow breaths:\n   • Inhale for 4 counts\n   • Hold for 4 counts\n   • Exhale for 6 counts\n3. Notice your feet on the ground\n4. Open your eyes when ready\n\nRemember: It's okay to take breaks. Would you like a longer guided session or some wellness resources?`,
          isUser: false,
          timestamp: new Date(),
          type: "mindfulness",
        };

      case "find_people":
        const interest = entities.interest || "similar interests";
        return {
          id: `ai-${Date.now()}`,
          content: `I found 5 neighbours who share your interest in ${interest}! 👋\n\n• **Sarah T.** - 2 min away, also loves ${interest}\n• **James L.** - 5 min away, active member\n• **Mei Lin** - Same block, new to area\n• **Raj K.** - 3 min away, 50+ connections\n• **Anna W.** - 4 min away, event organizer\n\nWould you like me to suggest icebreaker messages, or shall I show their full profiles?`,
          isUser: false,
          timestamp: new Date(),
          type: "people-found",
          metadata: { interest },
        };

      case "find_groups":
        const category = entities.category || "your interests";
        return {
          id: `ai-${Date.now()}`,
          content: `Here are popular groups matching ${category} in your area: 🎯\n\n• **Sunrise Joggers** - 234 members, 3 events/week\n• **Toa Payoh Foodies** - 156 members, restaurant hops\n• **Weekend Photographers** - 89 members, photo walks\n• **Board Game Knights** - 67 members, weekly meetups\n\nAll groups are verified and moderated. Tap any to preview or join instantly!`,
          isUser: false,
          timestamp: new Date(),
          type: "groups-found",
          metadata: { category },
        };

      default:
        const generalResponses = [
          "I can help you with that! Would you like me to find relevant events, connect you with people, or explore interest groups?",
          "That's a great question! Based on your neighbourhood, I'd suggest checking out the upcoming community events this weekend.",
          "I'm here to help! You can ask me to create events, find people nearby, guide you through breathing exercises, or discover new groups.",
          "Let me look into that for you. In the meantime, did you know there are 3 new members in your neighbourhood this week?",
        ];
        return {
          id: `ai-${Date.now()}`,
          content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
          isUser: false,
          timestamp: new Date(),
        };
    }
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const aiMessage = generateResponse(messageText);
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-sakura shadow-elevated flex items-center justify-center text-white ${isOpen ? "hidden" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-[32rem] bg-white rounded-2xl shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header with moderation indicator */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-gradient-to-r from-primary/5 to-sakura/5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Kindred AI</p>
                  <div className="flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5 text-pandan" />
                    <p className="text-[10px] text-pandan">Safe & Moderated</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 border-b border-border/20 bg-muted/30">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.prompt)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      message.isUser
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-muted flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Create event, find people, breathe..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChat;
