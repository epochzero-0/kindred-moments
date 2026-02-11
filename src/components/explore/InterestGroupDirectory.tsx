import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Globe, Sparkles, Check, X, Send,
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Dumbbell, Footprints, Film, Music,
  Camera, BookOpen, Monitor, HandHeart, LucideIcon, MessageCircle,
  UserPlus, ArrowRight, Clock, Leaf, TreePine, Heart
} from "lucide-react";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import type { User } from "@/types";

export interface InterestGroupDirectoryProps {
  allUsers: User[];
  currentUserInterests: string[];
  initialSearch?: string;
}

// Simulated member names for group chat messages
const chatMembers = [
  "Sarah", "James", "Aiman", "Chloe", "Daniel", "Farah", "Marcus", "Nisha",
  "Hui Min", "Amirah", "Suresh", "Priya", "Nurul", "Kelvin", "Arjun",
  "Mei Ling", "Zara", "Alicia", "Lakshmi", "Wei Jie"
];

// Generate group chat messages based on theme
const generateGroupMessages = (theme: string, groupName: string) => {
  const shuffledMembers = [...chatMembers].sort(() => Math.random() - 0.5);
  
  const messageTemplates: Record<string, string[]> = {
    fitness: [
      "Just finished a 5K run this morning! 🏃‍♂️ Anyone want to join tomorrow?",
      "Great session at the park today. The weather was perfect!",
      "Who's up for yoga this Saturday? Found a nice spot near the waterway.",
      "My legs are still sore from yesterday 😂 but totally worth it",
      "There's a free outdoor bootcamp happening next week. Should we go as a group?",
      "Welcome to anyone new here! We usually meet on weekends 💪",
    ],
    tech: [
      "Anyone tried the new VS Code update? The AI features are 🔥",
      "Just deployed my first app! Thanks for the help everyone",
      "There's a tech meetup at NUS this Saturday. Who's going?",
      "Can someone help me debug this React issue? I'll share a screenshot",
      "Thinking of starting a weekend coding session at the library. Interested?",
      "Welcome new members! We love talking tech here 🤓",
    ],
    study: [
      "Library session tomorrow at 2pm? I've booked a room at the CC",
      "Just aced my exam thanks to the study group! 📚",
      "Anyone have notes for the data structures module?",
      "Found a great Coursera course on ML. Free this month!",
      "Study buddy needed for this weekend. Anyone free?",
      "Welcome! We help each other learn and grow 🎓",
    ],
    food: [
      "Found an amazing mee goreng stall at the hawker centre! Must try 🍜",
      "Anyone want to try that new Thai place in the mall?",
      "Just made laksa from scratch. Will share the recipe!",
      "Food hunt this Saturday anyone? Thinking of hitting Jalan Besar",
      "The uncle's kopi at Blk 203 is seriously the best ☕",
      "Welcome foodies! We eat, we share, we explore 🤤",
    ],
    games: [
      "Settlers of Catan this Friday evening? I'll bring snacks!",
      "Just got the new Wingspan expansion. Who wants to play?",
      "Game night was SO fun. Rematch next week?",
      "Anyone into cooperative games? Pandemic is amazing",
      "Bringing my Switch tomorrow for some Mario Kart 🎮",
      "Welcome! We're a friendly bunch of board game enthusiasts 🎲",
    ],
    creative: [
      "Watercolor session at the park was amazing today! 🎨",
      "Sharing my latest sketch - feedback welcome!",
      "Found a free online workshop on digital illustration",
      "Anyone want to try pottery together? There's a class nearby",
      "The sunset from East Coast was perfect for photography 📸",
      "Welcome creatives! All skill levels are welcome here ✨",
    ],
    pets: [
      "Doggo playdate at the park this weekend! 🐕",
      "My cat just learned a new trick 😂 will share the video",
      "Anyone know a good pet groomer near Punggol?",
      "Adopted a kitten from the shelter! Meet Luna 🐱",
      "Pet-friendly café just opened. Checking it out tomorrow!",
      "Welcome fellow pet parents! Share your fur babies 🐾",
    ],
    default: [
      "Hey everyone! Great to be part of this group 👋",
      "Anyone free this weekend for a meetup?",
      "Just joined and already loving the vibes here!",
      "Should we plan something for next week?",
      "There's a community event happening nearby. Who's in?",
      "Welcome! Feel free to introduce yourselves 😊",
    ],
  };

  const themeKey = Object.keys(messageTemplates).find(key => 
    theme.toLowerCase().includes(key) || key.includes(theme.toLowerCase())
  ) || "default";

  const messages = messageTemplates[themeKey];
  const now = new Date();
  
  return messages.map((text, i) => ({
    id: `msg-${i}`,
    sender: shuffledMembers[i % shuffledMembers.length],
    text,
    time: new Date(now.getTime() - (messages.length - i) * (3 + Math.random() * 10) * 60000),
    isUser: false,
  }));
};

// Generate auto-replies when user sends a message
const generateAutoReplies = (userMessage: string, theme: string) => {
  const shuffledMembers = [...chatMembers].sort(() => Math.random() - 0.5);
  
  const replyTemplates: Record<string, string[][]> = {
    fitness: [
      ["Nice! See you at the next session! 💪", "That's awesome, welcome aboard!", "Great to have you! Let's crush it together 🔥"],
      ["Count me in!", "Sounds like a plan 🙌", "Yes! Finally someone with energy!"],
    ],
    tech: [
      ["Welcome to the gang! 🤓", "Awesome! Let's build something cool together", "Great to have another techie here!"],
      ["That's a great idea!", "Totally agree! Let's discuss more", "Looking forward to collaborating!"],
    ],
    food: [
      ["Yesss another foodie! 🤤", "Welcome! You'll fit right in", "Can't wait to explore new eats with you!"],
      ["Omg that sounds delicious!", "We should go try that together!", "Adding that to my list! 📝"],
    ],
    default: [
      ["Welcome! You're going to love it here 😊", "Great to have you!", "Hey! So glad you joined us!"],
      ["Sounds great!", "Count me in! 🙌", "That's awesome, let's do it!"],
    ],
  };

  const themeKey = Object.keys(replyTemplates).find(key =>
    theme.toLowerCase().includes(key) || key.includes(theme.toLowerCase())
  ) || "default";

  const templates = replyTemplates[themeKey];
  const selected = templates[Math.floor(Math.random() * templates.length)];
  
  return selected.map((text, i) => ({
    id: `reply-${Date.now()}-${i}`,
    sender: shuffledMembers[i],
    text,
    time: new Date(Date.now() + (i + 1) * (2000 + Math.random() * 3000)),
    isUser: false,
  }));
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// All interest-based groups — built from the 20 interests in the system
// Each interest maps to a friendly group name, icon, description, and a theme for chat messages
const interestGroupCatalog: {
  interestId: string;
  name: string;
  icon: LucideIcon;
  chatTheme: string;
  description: string;
  tags: string[];
}[] = [
  { interestId: "art", name: "Art & Creativity Corner", icon: Palette, chatTheme: "creative", description: "Sketching, painting, crafts & creative jams", tags: ["art", "creative", "drawing"] },
  { interestId: "badminton", name: "Badminton SG", icon: CircleDot, chatTheme: "fitness", description: "Find rallies, courts & doubles partners", tags: ["badminton", "sports", "fitness"] },
  { interestId: "board games", name: "Board Game Nights", icon: Gamepad2, chatTheme: "games", description: "Catan, Wingspan, Codenames & more", tags: ["board games", "games", "tabletop"] },
  { interestId: "bubble tea", name: "Bubble Tea Hunters 🧋", icon: Coffee, chatTheme: "food", description: "Rate, review & discover the best BBT spots", tags: ["bubble tea", "food", "drinks"] },
  { interestId: "cats", name: "Cat Parents SG 🐱", icon: Cat, chatTheme: "pets", description: "Cat care tips, play dates & cute photo dumps", tags: ["cats", "pets", "animals"] },
  { interestId: "cooking", name: "Home Cooks United", icon: UtensilsCrossed, chatTheme: "food", description: "Recipes, meal prep ideas & cook-alongs", tags: ["cooking", "food", "recipes"] },
  { interestId: "cycling", name: "Cycling Routes SG", icon: Bike, chatTheme: "fitness", description: "Group rides, PCN routes & bike talk", tags: ["cycling", "fitness", "outdoors"] },
  { interestId: "dogs", name: "Dog Lovers SG 🐕", icon: Dog, chatTheme: "pets", description: "Dog parks, vet tips & weekend walks", tags: ["dogs", "pets", "animals"] },
  { interestId: "evening walks", name: "Sunset Walkers", icon: Sunset, chatTheme: "fitness", description: "Chill evening strolls around the neighbourhood", tags: ["evening walks", "walking", "wellness"] },
  { interestId: "food hunt", name: "Hawker & Hidden Gems", icon: Soup, chatTheme: "food", description: "Uncover the best eats across Singapore", tags: ["food hunt", "food", "hawker"] },
  { interestId: "gardening", name: "Green Thumbs SG", icon: Flower2, chatTheme: "default", description: "Gardening tips, plant swaps & community plots", tags: ["gardening", "plants", "nature"] },
  { interestId: "gym light", name: "Gym Buddies", icon: Dumbbell, chatTheme: "fitness", description: "Light workouts, accountability & gym tips", tags: ["gym light", "fitness", "workout"] },
  { interestId: "jogging", name: "Jogging Kakis", icon: Footprints, chatTheme: "fitness", description: "Morning runs, 5K plans & parkrun crew", tags: ["jogging", "running", "fitness"] },
  { interestId: "kopi", name: "Kopi & Conversations ☕", icon: Coffee, chatTheme: "food", description: "Best kopi spots, café hangs & chill chats", tags: ["kopi", "coffee", "food"] },
  { interestId: "movies", name: "Movie Buffs SG", icon: Film, chatTheme: "default", description: "Reviews, watch-alongs & cinema meetups", tags: ["movies", "film", "entertainment"] },
  { interestId: "music", name: "Music Makers & Listeners", icon: Music, chatTheme: "default", description: "Jam sessions, playlists & gig buddies", tags: ["music", "instruments", "concerts"] },
  { interestId: "photography", name: "Shutterbugs SG 📸", icon: Camera, chatTheme: "creative", description: "Photo walks, editing tips & gear talk", tags: ["photography", "creative", "camera"] },
  { interestId: "study", name: "Study Buddies SG", icon: BookOpen, chatTheme: "study", description: "Focused sessions, note sharing & motivation", tags: ["study", "learning", "education"] },
  { interestId: "tech", name: "Tech & Code SG", icon: Monitor, chatTheme: "tech", description: "Coding, side projects & tech meetups", tags: ["tech", "coding", "programming"] },
  { interestId: "volunteering", name: "Volunteer Hearts 💛", icon: HandHeart, chatTheme: "default", description: "Give back together — events & causes", tags: ["volunteering", "community", "volunteer"] },
];

// Extra groups the user might find interesting (not tied to a specific interest but appealing broadly)
const exploratoryGroups: typeof interestGroupCatalog = [
  { interestId: "wellness", name: "Mindfulness & Wellness", icon: Leaf, chatTheme: "default", description: "Meditation, journaling & mental health support", tags: ["wellness", "mindfulness", "health"] },
  { interestId: "nature", name: "Nature Explorers SG", icon: TreePine, chatTheme: "default", description: "Hiking trails, nature reserves & outdoor adventures", tags: ["nature", "hiking", "outdoors"] },
  { interestId: "kindness", name: "Random Acts of Kindness", icon: Heart, chatTheme: "default", description: "Spread positivity in your neighbourhood", tags: ["kindness", "community", "social"] },
  { interestId: "neighbourhood", name: "Neighbourhood Watch", icon: Globe, chatTheme: "default", description: "Local updates, lost & found, and area news", tags: ["neighbourhood", "community", "local"] },
];

// Color palette for sender name/bubble in modal (matches ChatPage)
const senderColorPalette = [
  { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" },
  { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400" },
  { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
  { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400" },
  { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-400" },
  { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400" },
  { bg: "bg-lime-100 dark:bg-lime-900/30", text: "text-lime-700 dark:text-lime-400" },
];
const senderColorMap: Record<string, typeof senderColorPalette[0]> = {};
const getSenderColor = (name: string) => {
  if (!senderColorMap[name]) {
    const idx = Object.keys(senderColorMap).length % senderColorPalette.length;
    senderColorMap[name] = senderColorPalette[idx];
  }
  return senderColorMap[name];
};

interface GroupChatMessage {
  id: string;
  sender: string;
  text: string;
  time: Date;
  isUser: boolean;
}

interface InterestGroup {
  id: string;
  name: string;
  icon: LucideIcon;
  chatTheme: string;
  description: string;
  tags: string[];
  memberCount: number;
}

const InterestGroupDirectory = ({ allUsers, currentUserInterests, initialSearch = "" }: InterestGroupDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const navigate = useNavigate();
  const { isGroupJoined, joinGroup } = useChatConnections();
  const { profile: storedProfile } = useUserProfile();

  // Modal state
  const [selectedGroup, setSelectedGroup] = useState<InterestGroup | null>(null);
  const [joinStep, setJoinStep] = useState<"preview" | "joined">("preview");
  const [chatMessages, setChatMessages] = useState<GroupChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [hasReplied, setHasReplied] = useState(false);
  const [pendingReplies, setPendingReplies] = useState<GroupChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get user interests from stored profile or props
  const userInterests = storedProfile?.interests?.length 
    ? storedProfile.interests 
    : currentUserInterests;

  // Build groups with real member counts from users.json
  const { recommendedGroups, exploreGroups: exploreSectionGroups } = useMemo(() => {
    // Count how many users share each interest
    const interestCounts: Record<string, number> = {};
    allUsers.forEach(u => {
      u.interests.forEach(interest => {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      });
    });

    // Build the full group list from the catalog with real member counts
    const allGroups: InterestGroup[] = interestGroupCatalog.map(g => ({
      id: g.interestId,
      name: g.name,
      icon: g.icon,
      chatTheme: g.chatTheme,
      description: g.description,
      tags: g.tags,
      memberCount: interestCounts[g.interestId] || Math.floor(Math.random() * 20 + 5),
    }));

    // Build exploratory groups (bonus groups not tied to a specific user interest)
    const extraGroups: InterestGroup[] = exploratoryGroups.map(g => ({
      id: g.interestId,
      name: g.name,
      icon: g.icon,
      chatTheme: g.chatTheme,
      description: g.description,
      tags: g.tags,
      memberCount: Math.floor(Math.random() * 30 + 10),
    }));

    // "Based on your interests" — groups whose interestId matches any of the user's interests
    const recommended = allGroups
      .filter(g => userInterests.some(ui => 
        ui.toLowerCase() === g.id.toLowerCase() ||
        g.tags.some(tag => tag.toLowerCase() === ui.toLowerCase())
      ))
      .sort((a, b) => b.memberCount - a.memberCount);

    // "Groups you might explore" — everything else + the exploratory groups
    const nonMatched = allGroups
      .filter(g => !userInterests.some(ui => 
        ui.toLowerCase() === g.id.toLowerCase() ||
        g.tags.some(tag => tag.toLowerCase() === ui.toLowerCase())
      ));

    const explore = [...nonMatched, ...extraGroups].sort((a, b) => b.memberCount - a.memberCount);

    return { recommendedGroups: recommended, exploreGroups: explore };
  }, [allUsers, userInterests]);

  // Update search query if initialSearch prop changes
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Filter by search
  const filterBySearch = (groups: InterestGroup[]) => {
    if (!searchQuery) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(g => 
      g.name.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags.some(tag => tag.includes(q))
    );
  };

  const filteredRecommended = filterBySearch(recommendedGroups);
  const filteredExplore = filterBySearch(exploreSectionGroups);

  const handleGroupClick = (group: InterestGroup) => {
    if (isGroupJoined(group.id)) {
      // Already joined — go to chat
      navigate(`/chat?roomId=group-${group.id}&roomName=${encodeURIComponent(group.name)}`);
    } else {
      // Show join modal
      setSelectedGroup(group);
      setJoinStep("preview");
      setChatMessages(generateGroupMessages(group.chatTheme, group.name));
      setUserInput("");
      setHasReplied(false);
      setPendingReplies([]);
    }
  };

  const handleJoin = () => {
    if (!selectedGroup) return;
    joinGroup(selectedGroup.id, selectedGroup.name);
    setJoinStep("joined");
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !selectedGroup || hasReplied) return;

    const userMsg: GroupChatMessage = {
      id: `user-${Date.now()}`,
      sender: "You",
      text: userInput.trim(),
      time: new Date(),
      isUser: true,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setHasReplied(true);

    // Generate auto-replies with staggered timing
    const replies = generateAutoReplies(userInput, selectedGroup.chatTheme);
    replies.forEach((reply, i) => {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          ...reply,
          time: new Date(),
        }]);
      }, (i + 1) * (1200 + Math.random() * 800));
    });
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setJoinStep("preview");
    setChatMessages([]);
    setUserInput("");
    setHasReplied(false);
    setPendingReplies([]);
  };

  // Render a group card
  const renderGroupCard = (group: InterestGroup, index: number, variant: "recommended" | "explore") => {
    const joined = isGroupJoined(group.id);
    const isRec = variant === "recommended";

    return (
      <motion.div
        key={group.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        onClick={() => handleGroupClick(group)}
        className={`rounded-2xl p-4 transition-all cursor-pointer border group ${
          joined
            ? "bg-pandan/5 border-pandan/20 hover:border-pandan/40"
            : isRec
              ? "bg-card border-border/30 hover:border-pandan/30 hover:shadow-md"
              : "bg-card border-border/30 hover:border-primary/30 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
            joined
              ? "bg-pandan/15"
              : isRec
                ? "bg-gradient-to-br from-pandan/15 to-emerald-100 dark:to-emerald-900/30"
                : "bg-gradient-to-br from-primary/10 to-sakura/10"
          }`}>
            <group.icon className={`h-5 w-5 ${
              joined ? "text-pandan" : isRec ? "text-pandan" : "text-primary"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm">{group.name}</h4>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-1">{group.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users className="h-3 w-3" />
                {group.memberCount} members
              </span>
            </div>
          </div>
          {joined ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pandan/10 text-pandan text-xs font-semibold">
              <Check className="h-3.5 w-3.5" />
              Joined
            </span>
          ) : (
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isRec 
                ? "bg-pandan/10 text-pandan group-hover:bg-pandan group-hover:text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            }`}>
              <UserPlus className="h-3.5 w-3.5" />
              Join
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20">
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interest groups..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </div>
      </div>

      {/* Based on your interests */}
      {filteredRecommended.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-pandan" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Based on your interests</h3>
              <p className="text-[10px] text-muted-foreground">
                {userInterests.slice(0, 3).join(", ")}{userInterests.length > 3 ? ` +${userInterests.length - 3} more` : ""}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {filteredRecommended.map((group, i) => renderGroupCard(group, i, "recommended"))}
          </div>
        </div>
      )}

      {/* Groups you might explore */}
      {filteredExplore.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Groups you might explore</h3>
              <p className="text-[10px] text-muted-foreground">Discover something new</p>
            </div>
          </div>
          <div className="space-y-2">
            {filteredExplore.map((group, i) => renderGroupCard(group, i, "explore"))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredRecommended.length === 0 && filteredExplore.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No groups found for "{searchQuery}"</p>
        </div>
      )}

      {/* ===== JOIN MODAL ===== */}
      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/75 dark:bg-zinc-900/80 backdrop-blur-2xl backdrop-saturate-150"
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>

              {/* Group header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pandan/20 to-emerald-100 flex items-center justify-center">
                    <selectedGroup.icon className="h-6 w-6 text-pandan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{selectedGroup.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {selectedGroup.memberCount} members · Active now
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat preview area */}
              <div className="px-4 h-72 overflow-y-auto border-t border-border/20">
                <div className="py-3 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={msg.isUser ? { opacity: 0, y: 5 } : (i >= 6 ? { opacity: 0, y: 10 } : { opacity: 1 })}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i >= 6 ? 0.1 : 0 }}
                      className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] ${msg.isUser ? "order-2" : ""}`}>
                        {!msg.isUser && (
                          <p className={`text-[10px] font-medium mb-0.5 ml-3 ${getSenderColor(msg.sender).text}`}>{msg.sender}</p>
                        )}
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.isUser
                            ? "bg-primary text-white rounded-br-md"
                            : `${getSenderColor(msg.sender).bg} shadow-sm rounded-bl-md`
                        }`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] text-muted-foreground mt-0.5 ${msg.isUser ? "text-right mr-3" : "ml-3"}`}>
                          {formatTime(msg.time)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Bottom action area */}
              <div className="px-4 py-4 border-t border-border/20">
                {joinStep === "preview" ? (
                  /* Join / Maybe Later buttons */
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-2xl bg-black/5 text-foreground text-sm font-medium hover:bg-black/10 transition-colors"
                    >
                      Maybe Later
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleJoin}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pandan to-emerald-400 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <UserPlus className="h-4 w-4" />
                      Join Group
                    </motion.button>
                  </div>
                ) : (
                  /* Chat input after joining */
                  <div>
                    {!hasReplied && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-center text-pandan font-medium mb-2"
                      >
                        🎉 You've joined! Say hello to the group
                      </motion.p>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={hasReplied ? "Message sent!" : "Type a message..."}
                        disabled={hasReplied}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-white/10 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pandan/20 disabled:opacity-50"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || hasReplied}
                        className="h-10 w-10 rounded-xl bg-gradient-to-br from-pandan to-emerald-400 text-white flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-all"
                      >
                        <Send className="h-4 w-4" />
                      </motion.button>
                    </div>
                    {hasReplied && (
                      <motion.button
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4.5 }}
                        onClick={() => {
                          // Save messages to sessionStorage so ChatPage can pick them up
                          try {
                            const messagesForChat = chatMessages.map(msg => ({
                              id: msg.id,
                              senderId: msg.isUser ? "me" : `sender-${msg.sender}`,
                              senderName: msg.sender,
                              content: msg.text,
                              timestamp: msg.time.toISOString(),
                              isMe: msg.isUser,
                            }));
                            sessionStorage.setItem(
                              `kindred-group-chat-${selectedGroup.id}`,
                              JSON.stringify(messagesForChat)
                            );
                          } catch { /* ignore */ }
                          closeModal();
                          navigate(`/chat?roomId=group-${selectedGroup.id}&roomName=${encodeURIComponent(selectedGroup.name)}`);
                        }}
                        className="w-full mt-3 py-2.5 rounded-2xl bg-primary/10 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                      >
                        Open Full Chat
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterestGroupDirectory;
