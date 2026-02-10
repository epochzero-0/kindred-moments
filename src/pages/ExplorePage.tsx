import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Users, Search, MapPin, Globe, Heart, X, MessageCircle,
  Filter, ChevronRight, Trophy, Sparkles, Languages, Clock, Star,
  Moon, Sun, CloudSun, PartyPopper, Wand2, Send, RotateCcw, Check,
  // Interest group icons
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Dumbbell, Footprints, Film, Music,
  Camera, BookOpen, Monitor, HandHeart, LucideIcon
} from "lucide-react";
import { useUsers, useClans, usePulseData, useCurrentUser } from "@/hooks/use-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import type { User } from "@/types";

// Neighbourhood labels for filtering
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

type ExploreTab = "members" | "groups" | "neighbourhoods" | "globe";

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const { profile: storedProfile } = useUserProfile();
  
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

  // Get user's neighborhood from stored profile, convert to match users.json format
  const userNeighbourhood = storedProfile?.neighbourhoods?.[0];
  const neighbourhoodDisplayName = userNeighbourhood 
    ? neighbourhoodLabels[userNeighbourhood] || userNeighbourhood
    : currentUser?.neighbourhood || 'Punggol';

  // Get user interests from stored profile or current user
  const userInterests = storedProfile?.interests || currentUser?.interests || [];

  // Filter users by same neighborhood (matching display name)
  const nearbyUsers = allUsers.filter(
    (u) => u.id !== currentUser?.id && 
    u.neighbourhood.toLowerCase() === neighbourhoodDisplayName.toLowerCase()
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
      <div className="px-6 pt-6 pb-3">
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
      <div className="px-6 mb-4">
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
            <MembersNearby 
              key="members" 
              users={nearbyUsers} 
              currentUserInterests={userInterests}
              neighbourhood={neighbourhoodDisplayName}
            />
          )}
          {activeTab === "groups" && (
            <InterestGroupDirectory 
              key="groups" 
              clans={clans}
              allUsers={allUsers}
              currentUserInterests={userInterests}
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
  neighbourhood: string;
}

// Generate consistent avatar URL from user id
const getAvatarUrl = (userId: string) => {
  const num = parseInt(userId.replace(/\D/g, ''), 10) || 1;
  return `https://i.pravatar.cc/200?img=${(num % 70) + 1}`;
};

// Get comfort level icon
const getComfortIcon = (level: string): LucideIcon => {
  switch (level) {
    case 'introvert': return Moon;
    case 'extrovert': return Sun;
    case 'ambivert': return CloudSun;
    default: return Sparkles;
  }
};

const MembersNearby = ({ users, currentUserInterests, neighbourhood }: MembersNearbyProps) => {
  // Load persisted swipe state from sessionStorage
  const loadPersistedState = () => {
    try {
      const saved = sessionStorage.getItem("swipe-state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  };
  
  const persistedState = loadPersistedState();
  
  const [hasCompletedSwipe, setHasCompletedSwipe] = useState(() => persistedState?.hasCompletedSwipe || false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [matches, setMatches] = useState<string[]>(() => persistedState?.matches || []);
  const [showAll, setShowAll] = useState(() => persistedState?.showAll || false);
  const [likeCount, setLikeCount] = useState(() => persistedState?.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(() => persistedState?.dislikeCount || 0);
  const [likedUsers, setLikedUsers] = useState<User[]>(() => persistedState?.likedUsers || []);
  const [generatingMessage, setGeneratingMessage] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<Record<string, string>>(() => persistedState?.aiMessages || {});
  const navigate = useNavigate();
  const { contactUser } = useChatConnections();
  const currentUser = useCurrentUser();

  // Sort users by number of shared interests (descending)
  const allSortedUsers = [...users].sort((a, b) => {
    const aShared = a.interests.filter(i => currentUserInterests.includes(i)).length;
    const bShared = b.interests.filter(i => currentUserInterests.includes(i)).length;
    return bShared - aShared;
  });

  // Show only top 5 unless "See more" is clicked
  const sortedUsers = showAll ? allSortedUsers : allSortedUsers.slice(0, 5);
  const hasMoreUsers = allSortedUsers.length > 5;

  // Persist swipe state to sessionStorage
  useEffect(() => {
    if (hasCompletedSwipe) {
      sessionStorage.setItem("swipe-state", JSON.stringify({
        hasCompletedSwipe,
        matches,
        showAll,
        likeCount,
        dislikeCount,
        likedUsers,
        aiMessages,
      }));
    }
  }, [hasCompletedSwipe, matches, showAll, likeCount, dislikeCount, likedUsers, aiMessages]);

  // Set currentIndex to trigger completion view if user already completed swiping
  useEffect(() => {
    if (hasCompletedSwipe && sortedUsers.length > 0) {
      setCurrentIndex(sortedUsers.length);
    }
  }, [hasCompletedSwipe, sortedUsers.length]);

  const currentProfile = sortedUsers[currentIndex];

  // Calculate match percentage
  const getMatchPercentage = (userInterests: string[]) => {
    if (currentUserInterests.length === 0) return 0;
    const shared = userInterests.filter(i => currentUserInterests.includes(i)).length;
    return Math.round((shared / Math.max(currentUserInterests.length, userInterests.length)) * 100);
  };

  const handleSwipe = (swipeDirection: "left" | "right") => {
    setDirection(swipeDirection);
    if (swipeDirection === "right" && currentProfile) {
      setLikeCount(prev => prev + 1);
      setLikedUsers(prev => [...prev, currentProfile]);
      // Simulate match (30% chance)
      if (Math.random() > 0.7) {
        setMatches((prev) => [...prev, currentProfile.id]);
      }
    } else if (swipeDirection === "left") {
      setDislikeCount(prev => prev + 1);
    }
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setDirection(null);
      // Mark as completed when last card is swiped
      if (nextIndex >= sortedUsers.length) {
        setHasCompletedSwipe(true);
      }
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
      // Track that user initiated contact with this member
      contactUser(currentProfile.id, currentProfile.name);
      navigate({
        pathname: "/chat",
        search: createSearchParams({ userId: currentProfile.id }).toString()
      });
    }
  };

  // Handle case when no users in neighborhood
  if (sortedUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No neighbours in {neighbourhood} yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Be the first to connect or check other areas!</p>
      </motion.div>
    );
  }

  // Generate AI message based on shared interests and free time
  const generateAiMessage = (user: User) => {
    if (aiMessages[user.id] || generatingMessage === user.id) return;
    
    setGeneratingMessage(user.id);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const sharedInterests = user.interests.filter(i => currentUserInterests.includes(i));
      const userFreeSlots = user.free_slots || [];
      const myFreeSlots = currentUser?.free_slots || [];
      const overlappingSlots = userFreeSlots.filter(s => myFreeSlots.includes(s));
      
      let message = "";
      
      // Build personalized message
      if (sharedInterests.length > 0 && overlappingSlots.length > 0) {
        const interest = sharedInterests[Math.floor(Math.random() * sharedInterests.length)];
        const slot = overlappingSlots[0];
        const greetings = ["Hey", "Hi", "Hello"];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        message = `${greeting} ${user.name.split(' ')[0]}! I noticed we're both into ${interest}. I'm usually free on ${slot} - would you like to hang out sometime?`;
      } else if (sharedInterests.length > 0) {
        const interest1 = sharedInterests[0];
        const interest2 = sharedInterests.length > 1 ? sharedInterests[1] : null;
        if (interest2) {
          message = `Hi ${user.name.split(' ')[0]}! Great to connect - I see we both enjoy ${interest1} and ${interest2}. Would love to chat about it sometime!`;
        } else {
          message = `Hey ${user.name.split(' ')[0]}! I'm also really into ${interest1}. Any favorite spots in the neighbourhood for it?`;
        }
      } else if (overlappingSlots.length > 0) {
        message = `Hi ${user.name.split(' ')[0]}! We seem to have similar schedules. Would you be up for grabbing kopi on ${overlappingSlots[0]}?`;
      } else {
        message = `Hey ${user.name.split(' ')[0]}! Great to be neighbours. Let me know if you'd like to explore the area together sometime!`;
      }
      
      setAiMessages(prev => ({ ...prev, [user.id]: message }));
      setGeneratingMessage(null);
    }, 800 + Math.random() * 400);
  };

  // Handle sending AI message
  const handleSendAiMessage = (user: User, message: string) => {
    contactUser(user.id, user.name);
    // Navigate to chat with the pre-filled message idea (they can edit before sending)
    navigate({
      pathname: "/chat",
      search: createSearchParams({ 
        userId: user.id,
        draft: message 
      }).toString()
    });
  };

  if (currentIndex >= sortedUsers.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-8"
      >
        {/* Header with stats */}
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-full bg-pandan/10 flex items-center justify-center mb-3 mx-auto">
            <Heart className="h-7 w-7 text-pandan" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {showAll ? `You've seen everyone in ${neighbourhood}!` : "You've seen your top matches!"}
          </h3>
          
          {/* Like/Dislike stats */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="h-4 w-4 text-pandan" />
              <span className="text-pandan font-medium">{likeCount} liked</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <X className="h-4 w-4 text-rose-400" />
              <span className="text-rose-400 font-medium">{dislikeCount} passed</span>
            </div>
          </div>

          {matches.length > 0 && (
            <p className="text-sm text-pandan font-medium flex items-center justify-center gap-1.5">
              <PartyPopper className="h-4 w-4" />
              {matches.length} mutual connection{matches.length > 1 ? 's' : ''}!
            </p>
          )}
        </div>

        {/* Liked users list */}
        {likedUsers.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">Say hello to your likes</h4>
            </div>

            {likedUsers.map((user, index) => {
              const sharedInterests = user.interests.filter(i => currentUserInterests.includes(i));
              const isMatch = matches.includes(user.id);
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img 
                        src={getAvatarUrl(user.id)} 
                        alt={user.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      {isMatch && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pandan flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-foreground">{user.name}</h5>
                        {isMatch && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pandan/10 text-pandan font-medium">
                            Match!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {sharedInterests.length > 0 
                          ? `${sharedInterests.slice(0, 3).join(", ")}${sharedInterests.length > 3 ? ` +${sharedInterests.length - 3}` : ""}`
                          : "Neighbour"
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        contactUser(user.id, user.name);
                        navigate({
                          pathname: "/chat",
                          search: createSearchParams({ userId: user.id }).toString()
                        });
                      }}
                      className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  {/* AI Message Suggestion */}
                  <div className="bg-muted/50 rounded-xl p-3">
                    {!aiMessages[user.id] && generatingMessage !== user.id ? (
                      <button
                        onClick={() => generateAiMessage(user)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-1"
                      >
                        <Wand2 className="h-4 w-4" />
                        <span>Generate conversation starter</span>
                      </button>
                    ) : generatingMessage === user.id ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Wand2 className="h-4 w-4" />
                        </motion.div>
                        <span>Crafting the perfect message...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-foreground leading-relaxed">"{aiMessages[user.id]}"</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendAiMessage(user, aiMessages[user.id])}
                            className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                          >
                            <Send className="h-3 w-3" />
                            Use this message
                          </button>
                          <button
                            onClick={() => {
                              setAiMessages(prev => {
                                const newMessages = { ...prev };
                                delete newMessages[user.id];
                                return newMessages;
                              });
                              setTimeout(() => generateAiMessage(user), 100);
                            }}
                            className="py-2 px-3 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">You haven't liked anyone yet. Try swiping right on profiles you're interested in!</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          {!showAll && hasMoreUsers && (
            <button
              onClick={() => {
                setShowAll(true);
                setCurrentIndex(5);
                setHasCompletedSwipe(false);
              }}
              className="flex-1 py-3 rounded-xl bg-pandan text-white text-sm font-medium"
            >
              See {allSortedUsers.length - 5} more
            </button>
          )}
          <button
            onClick={() => {
              setCurrentIndex(0);
              setShowAll(false);
              setLikeCount(0);
              setDislikeCount(0);
              setMatches([]);
              setLikedUsers([]);
              setAiMessages({});
              setHasCompletedSwipe(false);
              sessionStorage.removeItem("swipe-state");
            }}
            className={`${!showAll && hasMoreUsers ? 'flex-1' : 'w-full'} py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium flex items-center justify-center gap-2`}
          >
            <RotateCcw className="h-4 w-4" />
            Start over
          </button>
        </div>
      </motion.div>
    );
  }

  const sharedInterests = getSharedInterests(currentProfile?.interests || []);
  const matchPercent = currentProfile ? getMatchPercentage(currentProfile.interests) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-16">
      {/* Header info */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {showAll ? (
              <><span className="font-medium text-foreground">{allSortedUsers.length}</span> neighbours in {neighbourhood}</>
            ) : (
              <>Top <span className="font-medium text-foreground">5</span> matches{hasMoreUsers && ` of ${allSortedUsers.length}`}</>
            )}
          </p>
          {/* Like/Dislike counter */}
          {(likeCount > 0 || dislikeCount > 0) && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-pandan flex items-center gap-1">
                <Heart className="h-3 w-3" /> {likeCount}
              </span>
              <span className="text-xs text-rose-400 flex items-center gap-1">
                <X className="h-3 w-3" /> {dislikeCount}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {currentIndex + 1} / {sortedUsers.length}
        </p>
      </div>

      <div className="relative h-[22rem] flex items-center justify-center">
        {/* Decorative background elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-sakura/10 to-lavender/10 blur-3xl" />
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-pandan/5 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
        </div>
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
              {/* Match percentage badge */}
              {matchPercent > 0 && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-pandan text-white text-sm font-semibold flex items-center gap-1 shadow-md">
                  <Star className="h-3.5 w-3.5" />
                  {matchPercent}% match
                </div>
              )}

              {/* Profile header with avatar */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 via-sakura/20 to-lavender/20">
                <img 
                  src={getAvatarUrl(currentProfile.id)}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {currentProfile.name.split(' ')[0]}, {currentProfile.age}
                      </h3>
                      <p className="text-sm text-white/90 flex items-center gap-1 drop-shadow">
                        <MapPin className="h-3.5 w-3.5" />
                        {currentProfile.neighbourhood}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                      {(() => { const ComfortIcon = getComfortIcon(currentProfile.comfort_level); return <ComfortIcon className="h-3 w-3" />; })()}
                      {currentProfile.comfort_level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile info */}
              <div className="p-4">
                {/* Languages & Free time */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1">
                      {currentProfile.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  {currentProfile.free_slots?.[0] && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Free {currentProfile.free_slots[0]}
                    </div>
                  )}
                </div>

                {/* Shared interests */}
                {sharedInterests.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-pandan font-medium mb-1.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
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

                {/* Other interests */}
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
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={() => handleSwipe("left")}
          className="h-12 w-12 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:shadow-elevated transition-all"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-pandan to-emerald-400 shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          <Heart className="h-6 w-6" />
        </button>
        <button
          onClick={handleChat}
          className="h-12 w-12 rounded-full bg-white shadow-soft flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-elevated transition-all"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1 mt-3">
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
  allUsers: ReturnType<typeof useUsers>;
  currentUserInterests: string[];
  initialSearch?: string;
}

// Top interest-based groups
const interestGroups: { id: string; name: string; icon: LucideIcon; theme: string }[] = [
  { id: "art", name: "Art & Creativity", icon: Palette, theme: "creative" },
  { id: "badminton", name: "Badminton Players", icon: CircleDot, theme: "sports" },
  { id: "board games", name: "Board Game Nights", icon: Gamepad2, theme: "games" },
  { id: "bubble tea", name: "Bubble Tea Lovers", icon: Coffee, theme: "food" },
  { id: "cats", name: "Cat Parents", icon: Cat, theme: "pets" },
  { id: "cooking", name: "Home Cooks", icon: UtensilsCrossed, theme: "food" },
  { id: "cycling", name: "Cycling Squad", icon: Bike, theme: "fitness" },
  { id: "dogs", name: "Dog Lovers", icon: Dog, theme: "pets" },
  { id: "evening walks", name: "Evening Walkers", icon: Sunset, theme: "wellness" },
  { id: "food hunt", name: "Food Hunters", icon: Soup, theme: "food" },
  { id: "gardening", name: "Green Thumbs", icon: Flower2, theme: "hobby" },
  { id: "gym light", name: "Gym Buddies", icon: Dumbbell, theme: "fitness" },
  { id: "jogging", name: "Jogging Club", icon: Footprints, theme: "fitness" },
  { id: "kopi", name: "Kopi Kakis", icon: Coffee, theme: "food" },
  { id: "movies", name: "Movie Buffs", icon: Film, theme: "entertainment" },
  { id: "music", name: "Music Enthusiasts", icon: Music, theme: "entertainment" },
  { id: "photography", name: "Photography Club", icon: Camera, theme: "creative" },
  { id: "study", name: "Study Buddies", icon: BookOpen, theme: "learning" },
  { id: "tech", name: "Tech Explorers", icon: Monitor, theme: "tech" },
  { id: "volunteering", name: "Volunteers United", icon: HandHeart, theme: "community" },
];

const InterestGroupDirectory = ({ clans, allUsers, currentUserInterests, initialSearch = "" }: InterestGroupDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const navigate = useNavigate();
  const { isGroupJoined } = useChatConnections();

  // Update search query if initialSearch prop changes (e.g. navigation from bot)
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Count members per interest group
  const getGroupMemberCount = (interestId: string) => {
    return allUsers.filter(u => u.interests.includes(interestId)).length;
  };

  // Split groups into recommended (matching user interests) and explore (others)
  const recommendedGroups = interestGroups
    .filter(g => currentUserInterests.includes(g.id))
    .map(g => ({ ...g, memberCount: getGroupMemberCount(g.id) }))
    .sort((a, b) => b.memberCount - a.memberCount);

  const exploreGroups = interestGroups
    .filter(g => !currentUserInterests.includes(g.id))
    .map(g => ({ ...g, memberCount: getGroupMemberCount(g.id) }))
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 10); // Top 10 to explore

  // Filter by search
  const filterBySearch = (groups: typeof recommendedGroups) => {
    if (!searchQuery) return groups;
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.theme.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredRecommended = filterBySearch(recommendedGroups);
  const filteredExplore = filterBySearch(exploreGroups);

  const handleGroupClick = (groupId: string, groupName: string) => {
    navigate(`/chat?roomId=group-${groupId}&roomName=${encodeURIComponent(groupName)}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20">
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interest groups..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Recommended for you */}
      {filteredRecommended.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-pandan" />
            <h3 className="font-semibold text-foreground text-sm">Recommended for you</h3>
          </div>
          <div className="space-y-2">
            {filteredRecommended.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(group.id, group.name)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer border-2 border-transparent hover:border-pandan/30"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pandan/20 to-emerald-100 flex items-center justify-center">
                    <group.icon className="h-6 w-6 text-pandan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount} members
                      </span>
                      {isGroupJoined(group.id) ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-medium">
                          <Check className="h-2.5 w-2.5" />
                          Joined
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-pandan/10 text-pandan text-[10px] font-medium">
                          Matches your interest
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Explore more */}
      {filteredExplore.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Explore more</h3>
          </div>
          <div className="space-y-2">
            {filteredExplore.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(group.id, group.name)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-sakura/10 flex items-center justify-center">
                    <group.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount} members
                      </span>
                      {isGroupJoined(group.id) ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-medium">
                          <Check className="h-2.5 w-2.5" />
                          Joined
                        </span>
                      ) : (
                        <span className="capitalize text-muted-foreground/70">{group.theme}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
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