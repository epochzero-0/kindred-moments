import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  Calendar,
  Users,
  Heart,
  Search,
  Loader2,
  Mic,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useNavigate, createSearchParams } from "react-router-dom";

type MessageType = "text" | "event-created" | "groups-found" | "mindfulness" | "people-found";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: MessageType;
  metadata?: Record<string, unknown>;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

interface AssistantResponse {
  content: string;
  type: MessageType;
  metadata?: Record<string, unknown>;
}

const OPENAI_BASE_URL = "https://api.openai.com/v1";

const SYSTEM_PROMPT = `
You are Kindred, an assistant for a community app.

Main jobs:
- Help users create events
- Help users find people nearby
- Help users find groups by interest
- Help users start mindfulness sessions

Tool routing:
- create_event: call when user wants to host or organize something
- find_people: call when user wants to meet, connect, or find neighbors
- find_groups: call when user asks for clubs, clans, circles, or communities
- start_mindfulness: call when user asks for calm, stress relief, breathing, grounding, meditation

Response style:
- Keep replies warm, concise, and practical.
- After calling a tool, give one short actionable sentence.
- For create_event, extract as many details as possible: title, date, time, location, capacity, type, languages (languages are optional).
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
          languages: { type: "string" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_people",
      description: "Find nearby members and neighbors",
      parameters: {
        type: "object",
        properties: {
          interest: { type: "string", description: "Optional interest filter" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_groups",
      description: "Find interest groups or clans",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_mindfulness",
      description: "Start a mindfulness or wellness session",
      parameters: { type: "object", properties: {} },
    },
  },
];

const FloatingAIChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm your Kindred companion. I can help you create events, find people, discover groups, and guide mindfulness sessions.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const quickActions: QuickAction[] = [
    { label: "Create Event", icon: <Calendar className="h-3 w-3" />, prompt: "I want to organize a community event" },
    { label: "Find People", icon: <Users className="h-3 w-3" />, prompt: "Find people near me" },
    { label: "Mindfulness", icon: <Heart className="h-3 w-3" />, prompt: "I need a quick mindfulness exercise" },
    { label: "Find Groups", icon: <Search className="h-3 w-3" />, prompt: "Help me find interest groups" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isTranscribing]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const mockFallbackResponse = (text: string): AssistantResponse => {
    const lower = text.toLowerCase();

    if (lower.includes("event")) {
      return {
        content: "I drafted an event card for you. Tap Edit and publish when ready.",
        type: "event-created",
        metadata: { title: "Community Meetup" },
      };
    }

    if (lower.includes("find people") || lower.includes("neighbours") || lower.includes("neighbors")) {
      return {
        content: "I can help you connect with nearby members right away.",
        type: "people-found",
      };
    }

    if (lower.includes("group") || lower.includes("clan")) {
      return {
        content: "I found groups you can explore now.",
        type: "groups-found",
        metadata: { category: "General" },
      };
    }

    if (lower.includes("mindful") || lower.includes("stress") || lower.includes("calm")) {
      return {
        content: "Let's start a short mindfulness session now.",
        type: "mindfulness",
      };
    }

    return {
      content: "I can help with events, nearby people, groups, and mindfulness.",
      type: "text",
    };
  };

  const callOpenAI = async (userText: string, messageHistory: Message[]): Promise<AssistantResponse> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return {
        content: "OpenAI key is missing. Add VITE_OPENAI_API_KEY in your .env file.",
        type: "text",
      };
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messageHistory.slice(-8).map((message) => ({
        role: message.isUser ? "user" : "assistant",
        content: message.content,
      })),
      { role: "user", content: userText },
    ];

    try {
      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: apiMessages,
          tools: TOOLS,
          tool_choice: "auto",
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat request failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const message = data?.choices?.[0]?.message;
      if (!message) {
        return { content: "I could not generate a response.", type: "text" };
      }

      if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        const fnName = toolCall?.function?.name as string;
        let args: Record<string, unknown> = {};

        try {
          args = JSON.parse(toolCall?.function?.arguments ?? "{}");
        } catch {
          args = {};
        }

        if (fnName === "create_event") {
          return {
            content: `I drafted your event "${String(args.title ?? "New Event")}". Review and publish below.`,
            type: "event-created",
            metadata: args,
          };
        }

        if (fnName === "find_people") {
          return {
            content: "Great, I can take you to nearby members now.",
            type: "people-found",
            metadata: { interest: String(args.interest ?? "all") },
          };
        }

        if (fnName === "find_groups") {
          return {
            content: `I found groups${args.category ? ` for ${String(args.category)}` : ""}.`,
            type: "groups-found",
            metadata: { category: args.category ? String(args.category) : "" },
          };
        }

        if (fnName === "start_mindfulness") {
          return {
            content: "Ready. I can start your mindfulness session now.",
            type: "mindfulness",
          };
        }
      }

      return { content: String(message.content ?? "I did not catch that."), type: "text" };
    } catch (error) {
      console.error("OpenAI error:", error);
      return mockFallbackResponse(userText);
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled || !text.trim()) return;
    if (isRecording || isTranscribing) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsSpeaking(false);
      }

      setIsSpeaking(true);
      const response = await fetch(`${OPENAI_BASE_URL}/audio/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          input: text.slice(0, 4000),
          format: "mp3",
        }),
      });

      if (!response.ok) {
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return "";

    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("file", audioBlob, "recording.webm");

    const response = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed with ${response.status}`);
    }

    const data = await response.json();
    return String(data?.text ?? "").trim();
  };

  const startRecording = async () => {
    if (isRecording || isTranscribing || isTyping) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recordingChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const audioBlob = new Blob(recordingChunksRef.current, { type: "audio/webm" });
        if (!audioBlob.size) return;

        setIsTranscribing(true);
        try {
          const transcript = await transcribeAudio(audioBlob);
          if (transcript) {
            setInput(transcript);
            await handleSend(transcript);
          }
        } catch (error) {
          console.error("Voice transcription error:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              content: "I could not transcribe that recording. Please try again.",
              isUser: false,
              timestamp: new Date(),
              type: "text",
            },
          ]);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: "Microphone access is blocked. Please allow microphone permission and try again.",
          isUser: false,
          timestamp: new Date(),
          type: "text",
        },
      ]);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    mediaRecorderRef.current.stop();
  };

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isTyping || isTranscribing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageText,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    const historyForModel = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const assistantResponse = await callOpenAI(messageText, historyForModel);
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: assistantResponse.content || "I did not catch that.",
      isUser: false,
      timestamp: new Date(),
      type: assistantResponse.type,
      metadata: assistantResponse.metadata,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);

    if (assistantResponse.content) {
      void speakText(assistantResponse.content);
    }
  };

  const handleEditDraft = (metadata: Record<string, unknown>) => {
    setIsOpen(false);
    navigate("/events", {
      state: { openCreate: true, draftData: metadata },
    });
  };

  const handleFindGroups = (category?: string) => {
    setIsOpen(false);
    navigate({
      pathname: "/explore",
      search: createSearchParams({
        tab: "groups",
        ...(category ? { q: category } : {}),
      }).toString(),
    });
  };

  const handleFindPeople = () => {
    setIsOpen(false);
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
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-3 py-2 border-b border-border/20 bg-muted/30">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => void handleSend(action.prompt)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

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
                      message.isUser ? "bg-primary text-white rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.content}

                    {message.type === "event-created" && message.metadata && (
                      <div className="mt-3 p-3 bg-white rounded-xl shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                          <Calendar className="h-4 w-4" />
                          <span>Event Draft</span>
                        </div>
                        <p className="font-semibold text-foreground text-xs">{String(message.metadata.title ?? "New Event")}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {String(message.metadata.date ?? "Date TBD")} - {String(message.metadata.location ?? "Location TBD")}
                        </p>
                        <button
                          onClick={() => handleEditDraft(message.metadata as Record<string, unknown>)}
                          className="w-full py-2 bg-primary text-white text-xs rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          Edit & Publish
                        </button>
                      </div>
                    )}

                    {message.type === "groups-found" && (
                      <button
                        onClick={() => handleFindGroups(String(message.metadata?.category ?? ""))}
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

              {(isTyping || isTranscribing) && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-muted flex items-center gap-1 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    {isTranscribing ? "Transcribing voice..." : "Thinking..."}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && void handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  onClick={() => setVoiceEnabled((prev) => !prev)}
                  title={voiceEnabled ? "Voice reply on" : "Voice reply off"}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                    voiceEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isTyping || isTranscribing}
                  className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={isRecording ? stopRecording : () => void startRecording()}
                  disabled={isTyping || isTranscribing}
                  className={`h-9 px-3 rounded-xl text-xs font-medium flex items-center gap-2 disabled:opacity-40 ${
                    isRecording
                      ? "bg-red-500 text-white"
                      : "bg-muted text-foreground hover:bg-muted/70 transition-colors"
                  }`}
                >
                  {isRecording ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  {isRecording ? "Stop recording" : "Talk to AI"}
                </button>
                <span className="text-[10px] text-muted-foreground">
                  {isRecording ? "Listening..." : isSpeaking ? "Speaking..." : "Voice ready"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChat;
