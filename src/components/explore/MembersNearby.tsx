import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import {
  Users, MapPin, Heart, X, MessageCircle, Sparkles, Languages, Clock, Star,
  Moon, Sun, CloudSun, PartyPopper, Wand2, Send, RotateCcw, LucideIcon,
  ChevronDown, Flame, ArrowRight, Zap
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-data";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useNavigate, createSearchParams } from "react-router-dom";
import type { User } from "@/types";

export interface MembersNearbyProps {
  users: User[];
  currentUserInterests: string[];
  neighbourhood: string;
}

// Generate consistent avatar URL from user name using DiceBear
const getAvatarUrl = (userId: string, userName: string) => {
  const seed = encodeURIComponent(userName || userId);
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e8e0db,d1ebe6,dce5f5,f5e6d0,f0d9e3`;
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
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const navigate = useNavigate();
  const { contactUser } = useChatConnections();
  const currentUser = useCurrentUser();

  const dragX = useMotionValue(0);
  const rotateCard = useTransform(dragX, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(dragX, [0, 100], [0, 1]);
  const passOpacity = useTransform(dragX, [-100, 0], [1, 0]);

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

  // Hide swipe hint after first swipe
  useEffect(() => {
    if (currentIndex > 0) setShowSwipeHint(false);
  }, [currentIndex]);

  const currentProfile = sortedUsers[currentIndex];
  const nextProfile = sortedUsers[currentIndex + 1];

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
      dragX.set(0);
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
        {/* Confetti-style celebration header */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mb-8 relative"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 -top-8 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-pandan/20 via-primary/10 to-sakura/20 blur-3xl"
            />
          </div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-pandan via-emerald-400 to-pandan flex items-center justify-center mb-4 mx-auto shadow-lg">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {showAll ? `All caught up!` : "Top matches reviewed!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Here's your session in {neighbourhood}</p>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 mb-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-pandan/10 to-emerald-50 dark:to-emerald-950/30 rounded-2xl p-4 border border-pandan/10"
            >
              <Heart className="h-5 w-5 text-pandan mx-auto mb-1" />
              <p className="text-2xl font-bold text-pandan">{likeCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Liked</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/30"
            >
              <X className="h-5 w-5 text-rose-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-rose-400">{dislikeCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Passed</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-primary/10 to-amber-50 dark:to-amber-950/30 rounded-2xl p-4 border border-primary/10"
            >
              <Sparkles className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{matches.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Matches</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Liked users list */}
        {likedUsers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">Start a conversation</h4>
                <p className="text-[10px] text-muted-foreground">Reach out to people you liked</p>
              </div>
            </div>

            <div className="space-y-3">
              {likedUsers.map((user, index) => {
                const sharedInterests = user.interests.filter(i => currentUserInterests.includes(i));
                const isMatch = matches.includes(user.id);
                const matchPct = getMatchPercentage(user.interests);
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.08 }}
                    className={`rounded-2xl overflow-hidden border transition-all ${
                      isMatch 
                        ? "border-pandan/30 bg-gradient-to-r from-pandan/5 to-emerald-50/50 dark:to-emerald-950/20 shadow-sm" 
                        : "border-border/50 bg-card shadow-soft"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <img 
                            src={getAvatarUrl(user.id, user.name)} 
                            alt={user.name}
                            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-background shadow-sm"
                          />
                          {isMatch && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.8 + index * 0.08 }}
                              className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-gradient-to-br from-pandan to-emerald-400 flex items-center justify-center shadow-md"
                            >
                              <Zap className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-foreground">{user.name}</h5>
                            {isMatch && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pandan/15 text-pandan font-semibold">
                                Matched!
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {user.neighbourhood}
                            {matchPct > 0 && (
                              <span className="ml-1 text-pandan">· {matchPct}% match</span>
                            )}
                          </p>
                          {sharedInterests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {sharedInterests.slice(0, 3).map(interest => (
                                <span key={interest} className="text-[10px] px-1.5 py-0.5 rounded-md bg-pandan/10 text-pandan">
                                  {interest}
                                </span>
                              ))}
                              {sharedInterests.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">+{sharedInterests.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            contactUser(user.id, user.name);
                            navigate({
                              pathname: "/chat",
                              search: createSearchParams({ userId: user.id }).toString()
                            });
                          }}
                          className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white hover:shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>

                      {/* AI Message Suggestion */}
                      <div className="bg-muted/40 rounded-xl p-3 border border-border/30">
                        {!aiMessages[user.id] && generatingMessage !== user.id ? (
                          <button
                            onClick={() => generateAiMessage(user)}
                            className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-1 group"
                          >
                            <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            <span>Generate conversation starter</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            <p className="text-sm text-foreground leading-relaxed italic">"{aiMessages[user.id]}"</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSendAiMessage(user, aiMessages[user.id])}
                                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
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
                                className="py-2 px-3 rounded-lg bg-card border border-border/50 text-muted-foreground text-xs font-medium hover:bg-muted transition-colors"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8 bg-muted/30 rounded-2xl border border-border/30"
          >
            <Heart className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">You haven't liked anyone yet</p>
            <p className="text-xs text-muted-foreground/70">Try swiping right on profiles you're interested in!</p>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          {!showAll && hasMoreUsers && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => {
                setShowAll(true);
                setCurrentIndex(5);
                setHasCompletedSwipe(false);
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pandan to-emerald-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              See {allSortedUsers.length - 5} more neighbors
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
            className={`${!showAll && hasMoreUsers ? 'flex-1' : 'w-full'} py-3.5 rounded-2xl bg-muted/60 text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors active:scale-[0.98]`}
          >
            <RotateCcw className="h-4 w-4" />
            Start over
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const sharedInterests = getSharedInterests(currentProfile?.interests || []);
  const matchPercent = currentProfile ? getMatchPercentage(currentProfile.interests) : 0;
  const ComfortIcon = currentProfile ? getComfortIcon(currentProfile.comfort_level) : Sparkles;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-28">
      {/* Header info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {showAll ? (
              <><span className="font-semibold text-foreground">{allSortedUsers.length}</span> neighbours in {neighbourhood}</>
            ) : (
              <>Top <span className="font-semibold text-foreground">5</span> matches{hasMoreUsers && ` of ${allSortedUsers.length}`}</>
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{currentIndex + 1}</span>
          <span>/</span>
          <span>{sortedUsers.length}</span>
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative h-[24rem] flex items-center justify-center mb-5">
        {/* Ambient glow behind card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ 
              background: [
                "radial-gradient(circle, rgba(var(--pandan-rgb, 72,187,120), 0.08) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(var(--sakura-rgb, 237,100,166), 0.08) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(var(--pandan-rgb, 72,187,120), 0.08) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(72,187,120,0.08) 0%, transparent 70%)" }}
          />
        </div>

        {/* Background card (next profile preview) */}
        {nextProfile && (
          <div className="absolute w-[calc(100%-2rem)] max-w-[calc(24rem-1rem)] h-[22rem]">
            <div className="w-full h-full bg-card rounded-3xl shadow-sm border border-border/30 overflow-hidden opacity-50 scale-[0.94] translate-y-3">
              <div className="h-36 bg-gradient-to-br from-muted to-muted/50">
                <img 
                  src={getAvatarUrl(nextProfile.id, nextProfile.name)}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main swipeable card */}
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: direction === "left" ? -400 : direction === "right" ? 400 : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                ...(direction && { duration: 0.3, type: "tween" })
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x: dragX, rotate: rotateCard }}
              className="absolute w-full max-w-sm bg-card rounded-3xl shadow-elevated overflow-hidden cursor-grab active:cursor-grabbing border border-border/20"
            >
              {/* Like/Pass overlay indicators */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute inset-0 z-20 bg-gradient-to-br from-pandan/20 to-transparent pointer-events-none flex items-center justify-center rounded-3xl"
              >
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-pandan text-white font-bold text-lg rotate-[-12deg] border-2 border-white/30">
                  LIKE
                </div>
              </motion.div>
              <motion.div
                style={{ opacity: passOpacity }}
                className="absolute inset-0 z-20 bg-gradient-to-bl from-rose-500/20 to-transparent pointer-events-none flex items-center justify-center rounded-3xl"
              >
                <div className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-lg rotate-[12deg] border-2 border-white/30">
                  PASS
                </div>
              </motion.div>

              {/* Match badge - floating */}
              {matchPercent > 0 && (
                <motion.div
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute top-4 right-4 z-10"
                >
                  <div className={`px-3 py-1.5 rounded-full text-white text-sm font-bold flex items-center gap-1.5 shadow-lg ${
                    matchPercent >= 50 
                      ? "bg-gradient-to-r from-pandan to-emerald-400" 
                      : "bg-gradient-to-r from-primary to-amber-500"
                  }`}>
                    {matchPercent >= 50 ? <Flame className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                    {matchPercent}% match
                  </div>
                </motion.div>
              )}

              {/* Profile image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={getAvatarUrl(currentProfile.id, currentProfile.name)}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Name + location overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {currentProfile.name.split(' ')[0]}<span className="font-normal text-white/80">, {currentProfile.age}</span>
                      </h3>
                      <p className="text-sm text-white/80 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {currentProfile.neighbourhood}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs border border-white/10">
                      <ComfortIcon className="h-3.5 w-3.5" />
                      {currentProfile.comfort_level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="p-5 space-y-4">
                {/* Languages & Free time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1.5">
                      {currentProfile.languages.map((lang) => (
                        <span key={lang} className="px-2 py-0.5 rounded-md bg-muted/80 text-xs text-muted-foreground font-medium">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  {currentProfile.free_slots?.[0] && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                      <Clock className="h-3.5 w-3.5" />
                      Free {currentProfile.free_slots[0]}
                    </div>
                  )}
                </div>

                {/* Shared interests */}
                {sharedInterests.length > 0 && (
                  <div>
                    <p className="text-xs text-pandan font-semibold mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      {sharedInterests.length} shared interest{sharedInterests.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sharedInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full bg-pandan/10 text-pandan text-xs font-medium border border-pandan/15"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other interests */}
                {currentProfile.interests.filter(i => !sharedInterests.includes(i)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.interests
                      .filter((i) => !sharedInterests.includes(i))
                      .map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full bg-muted/60 text-muted-foreground text-xs border border-border/30"
                        >
                          {interest}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe hint */}
        {showSwipeHint && currentIndex === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60 flex items-center gap-1"
          >
            <motion.div animate={{ x: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity }}>
              ← swipe →
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5 mb-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleSwipe("left")}
          className="h-14 w-14 rounded-2xl bg-card shadow-soft border border-border/30 flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:border-rose-200 hover:shadow-md transition-all"
        >
          <X className="h-6 w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleSwipe("right")}
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pandan to-emerald-400 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all"
        >
          <Heart className="h-7 w-7" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleChat}
          className="h-14 w-14 rounded-2xl bg-card shadow-soft border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-md transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Progress bar */}
      <div className="mt-5 px-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / sortedUsers.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary via-pandan to-emerald-400 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MembersNearby;
