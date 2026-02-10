import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Shield, Calendar, Users, Heart, Search, Loader2 } from "lucide-react";
import { useNavigate, createSearchParams } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "event-created" | "groups-found" | "mindfulness" | "people-found";
  metadata?: Record<string, any>;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const FloatingAIChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm your Kindred companion. I can help you create events, find people with similar interests, or guide you through mindfulness exercises.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const quickActions: QuickAction[] = [
    { label: "Create Event", icon: <Calendar className="h-3 w-3" />, prompt: "I want to organize a community event" },
    { label: "Find People", icon: <Users className="h-3 w-3" />, prompt: "Find people near me" },
    { label: "Mindfulness", icon: <Heart className="h-3 w-3" />, prompt: "I need a quick mindfulness exercise" },
    { label: "Find Groups", icon: <Search className="h-3 w-3" />, prompt: "Help me find interest groups" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- OpenAI Configuration ---

  const SYSTEM_PROMPT = `
    You are Kindred, a local community companion app assistant.
    
    TOOLS:
    - create_event: Extract ALL event details provided.
    - find_people: Call this immediately when user wants to find people. DO NOT ask for interest.
    - find_groups: Search for clans/groups.
    - start_mindfulness: Start wellness session.

    RULES:
    1. For 'create_event', try to extract: activity, date, time, location, capacity, event_type, languages.
    2. For 'find_people', do NOT ask for an interest. Just call the tool.
    3. Keep responses warm and concise.
  `;

  const TOOLS = [
    {
      type: "function",
      function: {
        name: "create_event",
        description: "Draft a new community event card",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            date: { type: "string" },
            time: { type: "string" },
            location: { type: "string" },
            capacity: { type: "string" },
            type: { type: "string", enum: ["neighbourhood", "clan", "competition", "wellness"] },
            languages: { type: "string" }
          },
          required: ["title"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "find_people",
        description: "Find neighbours",
        parameters: {
          type: "object",
          properties: {
            interest: { type: "string", description: "Optional interest filter" }
          },
        }
      }
    },
    {
      type: "function",
      function: {
        name: "find_groups",
        description: "Find interest groups",
        parameters: {
          type: "object",
          properties: {
            category: { type: "string" }
          },
          required: ["category"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "start_mindfulness",
        description: "Start wellness session",
        parameters: { type: "object", properties: {} }
      }
    }
  ];

  const callOpenAI = async (userText: string, messageHistory: Message[]) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn("No OpenAI API Key. Using mock response.");
      return mockFallbackResponse(userText);
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messageHistory.slice(-6).map(m => ({
        role: m.isUser ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: userText }
    ];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", 
          messages: apiMessages,
          tools: TOOLS,
          tool_choice: "auto"
        })
      });

      const data = await response.json();
      const choice = data.choices[0];
      const message = choice.message;

      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        if (fnName === "create_event") {
          return {
            content: `I've drafted your event: "${args.title}". Review and publish it below.`,
            type: "event-created" as const,
            metadata: args 
          };
        }
        
        if (fnName === "find_people") {
          return {
            content: `Connect with your neighbours! Click below to start matching.`,
            type: "people-found" as const,
            metadata: { interest: args.interest || "all" }
          };
        }

        if (fnName === "find_groups") {
          return {
            content: `Here are some ${args.category || 'community'} groups you might like.`,
            type: "groups-found" as const,
            metadata: { category: args.category }
          };
        }

        if (fnName === "start_mindfulness") {
          return {
            content: "Ready for a break? Click below to start.",
            type: "mindfulness" as const,
            metadata: {}
          };
        }
      }

      return { content: message.content, type: "text" as const };

    } catch (error) {
      console.error("OpenAI Error", error);
      return { content: "I'm having trouble connecting right now.", type: "text" as const };
    }
  };

  const mockFallbackResponse = (text: string) => {
    const lower = text.toLowerCase();
    
    if (lower.includes("event")) {
        return {
            content: "I've drafted your event.",
            type: "event-created" as const,
            metadata: { title: "New Event" }
        };
    }
    
    if (lower.includes("find people") || lower.includes("neighbours")) {
        return {
            content: "Connect with your neighbours!",
            type: "people-found" as const,
            metadata: {}
        };
    }

    if (lower.includes("groups")) {
        return {
            content: "Browse interest groups.",
            type: "groups-found" as const,
            metadata: { category: "General" }
        };
    }

    return { content: "I can help with events, people, and groups.", type: "text" as const };
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const response = await callOpenAI(messageText, messages);

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: response.content || "I didn't catch that.",
      isUser: false,
      timestamp: new Date(),
      type: response.type as any,
      metadata: response.metadata
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleEditDraft = (metadata: any) => {
    setIsOpen(false);
    navigate("/events", { 
      state: { openCreate: true, draftData: metadata } 
    });
  };

  const handleFindGroups = (category?: string) => {
    setIsOpen(false);
    navigate({
      pathname: "/explore",
      search: createSearchParams({
        tab: "groups",
        ...(category ? { q: category } : {})
      }).toString()
    });
  };

  const handleFindPeople = () => {
    setIsOpen(false);
    // Navigate to default Explore page (Members tab)
    navigate("/explore");
  };

  const handleStartMindfulness = () => {
    setIsOpen(false);
    navigate("/wellness");
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-sakura shadow-elevated flex items-center justify-center text-white ${isOpen ? "hidden" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-[32rem] bg-white rounded-2xl shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-gradient-to-r from-primary/5 to-sakura/5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Kindred AI</p>
                  <p className="text-[10px] text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Quick Actions Bar */}
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
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    message.isUser ? "bg-primary text-white rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {message.content}

                    {message.type === "event-created" && message.metadata && (
                      <div className="mt-3 p-3 bg-white rounded-xl shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                          <Calendar className="h-4 w-4" />
                          <span>Event Draft</span>
                        </div>
                        <p className="font-semibold text-foreground text-xs">{message.metadata.title}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                            {message.metadata.date || 'Date TBD'} • {message.metadata.location || 'Location TBD'}
                        </p>
                        <button 
                          onClick={() => handleEditDraft(message.metadata)}
                          className="w-full py-2 bg-primary text-white text-xs rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          Edit & Publish
                        </button>
                      </div>
                    )}

                    {message.type === "groups-found" && (
                      <button 
                        onClick={() => handleFindGroups(message.metadata?.category)}
                        className="mt-3 w-full py-2 bg-white border border-border/50 text-foreground text-xs rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="h-3 w-3" /> Browse Groups
                      </button>
                    )}

                    {message.type === "people-found" && (
                      <button 
                        onClick={handleFindPeople}
                        className="mt-3 w-full py-2 bg-white border border-border/50 text-foreground text-xs rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                      >
                        <Users className="h-3 w-3" /> Find Neighbours
                      </button>
                    )}

                    {message.type === "mindfulness" && (
                      <button 
                        onClick={handleStartMindfulness}
                        className="mt-3 w-full py-2 bg-lavender text-white text-xs rounded-lg font-medium hover:bg-lavender/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Heart className="h-3 w-3" /> Start Session
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-muted flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  </div>
                </div>
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
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40"
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