import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Users, Search, MapPin, Globe, Heart, X, MessageCircle,
  Filter, ChevronRight, Trophy, Sparkles, Languages
} from "lucide-react";
import { useUsers, useClans, usePulseData, useCurrentUser } from "@/hooks/use-data";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";

type ExploreTab = "members" | "groups" | "neighbourhoods" | "globe";

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  
  // Initialize state directly from URL to prevent tab mismatch on load
  const [activeTab, setActiveTab] = useState<ExploreTab>(() => {
    const tabParam = searchParams.get("tab") as ExploreTab;
    return (tabParam && ["members", "groups", "neighbourhoods", "globe"].includes(tabParam)) 
      ? tabParam 
      : "members";
  });

  const currentUser = useCurrentUser();
  const allUsers = useUsers();
  const clans = useClans();
  const pulseData = usePulseData();

  // Listen for URL changes (e.g. back button) to update the tab
  useEffect(() => {
    const tabParam = searchParams.get("tab") as ExploreTab;
    if (tabParam && ["members", "groups", "neighbourhoods", "globe"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Filter out current user and get nearby users
  const nearbyUsers = allUsers.filter(
    (u) => u.id !== currentUser?.id && u.neighbourhood === currentUser?.neighbourhood
  );

  const tabs = [
    { id: "members" as const, label: "Members", icon: Users },
    { id: "groups" as const, label: "Groups", icon: Sparkles },
    { id: "neighbourhoods" as const, label: "Areas", icon: MapPin },
    { id: "globe" as const, label: "Globe", icon: Globe },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-sm mb-1">Explore</p>
          <h1 className="text-2xl font-semibold text-foreground">Discover your community</h1>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === "members" && (
            <MembersNearby key="members" users={nearbyUsers} currentUserInterests={currentUser?.interests || []} />
          )}
          {activeTab === "groups" && (
            <InterestGroupDirectory 
              key="groups" 
              clans={clans} 
              initialSearch={searchParams.get("q") || ""} 
            />
          )}
          {activeTab === "neighbourhoods" && (
            <NeighbourhoodDirectory key="neighbourhoods" pulseData={pulseData} />
          )}
          {activeTab === "globe" && (
            <GlobeVisualization key="globe" pulseData={pulseData} clans={clans} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Members Nearby - Tinder-style swipe cards
interface MembersNearbyProps {
  users: ReturnType<typeof useUsers>;
  currentUserInterests: string[];
}

const MembersNearby = ({ users, currentUserInterests }: MembersNearbyProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const navigate = useNavigate();

  // Sort users by number of shared interests
  const sortedUsers = [...users].sort((a, b) => {
    const aShared = a.interests.filter(i => currentUserInterests.includes(i)).length;
    const bShared = b.interests.filter(i => currentUserInterests.includes(i)).length;
    return bShared - aShared;
  });

  const currentProfile = sortedUsers[currentIndex];

  const handleSwipe = (swipeDirection: "left" | "right") => {
    setDirection(swipeDirection);
    if (swipeDirection === "right" && currentProfile) {
      // Simulate match (30% chance)
      if (Math.random() > 0.7) {
        setMatches((prev) => [...prev, currentProfile.id]);
      }
    }
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      handleSwipe("left");
    }
  };

  const getSharedInterests = (userInterests: string[]) => {
    return userInterests.filter((i) => currentUserInterests.includes(i));
  };

  const handleChat = () => {
    if (currentProfile) {
      navigate({
        pathname: "/chat",
        search: createSearchParams({ userId: currentProfile.id }).toString()
      });
    }
  };

  if (currentIndex >= sortedUsers.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">You've seen everyone!</h3>
        <p className="text-sm text-muted-foreground mb-4">Check back later for new neighbours</p>
        {matches.length > 0 && (
          <p className="text-sm text-pandan font-medium">🎉 {matches.length} new connections made!</p>
        )}
        <button
          onClick={() => setCurrentIndex(0)}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
        >
          Start over
        </button>
      </motion.div>
    );
  }

  const sharedInterests = getSharedInterests(currentProfile?.interests || []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
      <div className="relative h-[28rem] flex items-center justify-center">
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                rotate: direction === "left" ? -20 : direction === "right" ? 20 : 0,
              }}
              exit={{ opacity: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute w-full max-w-sm bg-white rounded-3xl shadow-elevated overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {/* Profile header */}
              <div className="h-48 bg-gradient-to-br from-primary/20 via-sakura/20 to-lavender/20 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center text-3xl font-semibold text-white">
                  {currentProfile.name.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>

              {/* Profile info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{currentProfile.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {currentProfile.neighbourhood}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-lg font-medium text-foreground">{currentProfile.age}</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {currentProfile.languages.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shared interests */}
                {sharedInterests.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-pandan font-medium mb-1.5">
                      {sharedInterests.length} shared interest{sharedInterests.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sharedInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2.5 py-1 rounded-full bg-pandan/10 text-pandan text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All interests */}
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.interests
                    .filter((i) => !sharedInterests.includes(i))
                    .map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe("left")}
          className="h-14 w-14 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:shadow-elevated transition-all"
        >
          <X className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-pandan to-emerald-400 shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          <Heart className="h-7 w-7" />
        </button>
        <button
          onClick={handleChat}
          className="h-14 w-14 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-elevated transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1 mt-6">
        {sortedUsers.slice(0, 10).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-primary" : i < currentIndex ? "w-1.5 bg-pandan" : "w-1.5 bg-muted"
              }`}
          />
        ))}
        {sortedUsers.length > 10 && <span className="text-xs text-muted-foreground ml-1">+{sortedUsers.length - 10}</span>}
      </div>
    </motion.div>
  );
};

// Interest Group Directory
interface InterestGroupDirectoryProps {
  clans: ReturnType<typeof useClans>;
  initialSearch?: string;
}

const InterestGroupDirectory = ({ clans, initialSearch = "" }: InterestGroupDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filter, setFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  // Update search query if initialSearch prop changes (e.g. navigation from bot)
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Show all clans
  const themes = [...new Set(clans.map((c) => c.theme))];

  const filteredClans = clans.filter((clan) => {
    const matchesSearch = clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clan.theme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filter || clan.theme === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Search and filter */}
      <div className="flex gap-3 mb-5">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-white border border-border/40 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Theme filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!filter ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          All
        </button>
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setFilter(theme)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${filter === theme ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Groups list */}
      <div className="space-y-3">
        {filteredClans.map((clan, i) => (
          <motion.div
            key={clan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/chat?roomId=${clan.id}`)}
            className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-sakura/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{clan.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {clan.members.length} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {clan.neighbourhood}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground capitalize">
                  {clan.theme}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Neighbourhood Directory
interface NeighbourhoodDirectoryProps {
  pulseData: ReturnType<typeof usePulseData>;
}

const NeighbourhoodDirectory = ({ pulseData }: NeighbourhoodDirectoryProps) => {
  const sortedNeighbourhoods = [...pulseData].sort((a, b) => b.active_today - a.active_today);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Leaderboard header */}
      <div className="bg-gradient-to-br from-primary/10 to-sakura/10 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Neighbourhood Leaderboard</h3>
        </div>
        <p className="text-xs text-muted-foreground">Ranked by community activity and engagement</p>
      </div>

      {/* Neighbourhoods list */}
      <div className="space-y-3">
        {sortedNeighbourhoods.map((neighbourhood, i) => (
          <motion.div
            key={neighbourhood.neighbourhood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center font-semibold ${i === 0
                  ? "bg-yellow-100 text-yellow-600"
                  : i === 1
                    ? "bg-gray-100 text-gray-500"
                    : i === 2
                      ? "bg-orange-100 text-orange-600"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{neighbourhood.neighbourhood}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{neighbourhood.active_today} active today</span>
                  <span>Mood: {neighbourhood.avg_mood.toFixed(1)}/5</span>
                </div>
              </div>

              {/* Top interests */}
              <div className="hidden sm:flex gap-1">
                {neighbourhood.top_interests.slice(0, 2).map((interest) => (
                  <span key={interest} className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                    {interest}
                  </span>
                ))}
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Globe Visualization (3D-like node network)
interface GlobeVisualizationProps {
  pulseData: ReturnType<typeof usePulseData>;
  clans: ReturnType<typeof useClans>;
}

const GlobeVisualization = ({ pulseData, clans }: GlobeVisualizationProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate node positions in a circular pattern
  const neighbourhoodNodes = pulseData.map((p, i) => {
    const angle = (i / pulseData.length) * Math.PI * 2;
    const radius = 120;
    return {
      id: p.neighbourhood,
      type: "neighbourhood" as const,
      x: 50 + Math.cos(angle) * 35,
      y: 50 + Math.sin(angle) * 35,
      size: Math.max(20, p.active_today),
      data: p,
    };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden" style={{ height: "28rem" }}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {neighbourhoodNodes.slice(0, -1).map((node, i) => {
            const nextNode = neighbourhoodNodes[(i + 1) % neighbourhoodNodes.length];
            return (
              <motion.line
                key={`${node.id}-${nextNode.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Neighbourhood nodes */}
        {neighbourhoodNodes.map((node, i) => (
          <motion.button
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          >
            <div
              className={`rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center transition-all ${selectedNode === node.id ? "ring-4 ring-white/40" : "group-hover:ring-2 group-hover:ring-white/20"
                }`}
              style={{
                width: `${Math.max(24, node.size / 2)}px`,
                height: `${Math.max(24, node.size / 2)}px`,
              }}
            >
              <span className="text-[8px] font-bold text-white">{node.data.active_today}</span>
            </div>
            <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-white/60 whitespace-nowrap">
              {node.id}
            </p>
          </motion.button>
        ))}

        {/* Center info */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-sakura/30 backdrop-blur-sm flex items-center justify-center mb-2">
            <Globe className="h-10 w-10 text-white/80" />
          </div>
          <p className="text-white/60 text-xs">
            {pulseData.reduce((sum, p) => sum + p.active_today, 0)} active
          </p>
        </div>

        {/* Selected node info */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4"
            >
              {(() => {
                const nodeData = pulseData.find((p) => p.neighbourhood === selectedNode);
                if (!nodeData) return null;
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{nodeData.neighbourhood}</h4>
                      <p className="text-xs text-white/60">
                        {nodeData.active_today} active · Mood {nodeData.avg_mood.toFixed(1)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {nodeData.top_interests.map((interest) => (
                        <span key={interest} className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-primary to-sakura" />
          <span>Neighbourhoods</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 bg-muted-foreground/30" />
          <span>Connections</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExplorePage;