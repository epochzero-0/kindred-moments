import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, Calendar, Wind, Footprints,
  ChevronRight, Clock, Plus, Sun, Cloud, MessageCircle, Heart, Sparkles, Coffee, Camera
} from "lucide-react";
import { useCurrentUser, useActivities, useClans, usePulseData, useUsers } from "@/hooks/use-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import StatusFeed from "@/components/StatusFeed";

// Neighbourhood labels for display
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

// Mock data for upcoming events
const upcomingEvents = [
  { id: "e1", title: "Morning Tai Chi", time: "Tomorrow 7:00 AM", location: "Punggol Park", attendees: 12 },
  { id: "e2", title: "Board Game Night", time: "Sat 7:30 PM", location: "RC Hall", attendees: 8 },
  { id: "e3", title: "Photography Walk", time: "Sun 5:00 PM", location: "Waterway", attendees: 6 },
];

// Mock live status data with avatars
const initialLiveStatuses = [
  { id: "ls1", userId: "u002", userName: "Ravi", activity: "heading for kopi", time: "2m ago", avatar: "https://i.pravatar.cc/100?img=11", isOnline: true },
  { id: "ls2", userId: "u019", userName: "Mei Ling", activity: "at the gym", time: "5m ago", avatar: "https://i.pravatar.cc/100?img=5", isOnline: true },
  { id: "ls3", userId: "u003", userName: "Aiman", activity: "walking at park", time: "8m ago", avatar: "https://i.pravatar.cc/100?img=12", isOnline: true },
  { id: "ls4", userId: "u014", userName: "Priya", activity: "free to chat", time: "12m ago", avatar: "https://i.pravatar.cc/100?img=9", isOnline: false },
];

// Featured community moment
const featuredMoment = {
  id: "fm1",
  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
  title: "Morning Tai Chi at Punggol Park",
  description: "12 neighbours joined Uncle Tan's session today!",
  likes: 24,
  comments: 8,
};

const HomePage = () => {
  const currentUser = useCurrentUser();
  const { profile: storedProfile } = useUserProfile();
  const activities = useActivities();
  const clans = useClans();
  const pulseData = usePulseData();
  const users = useUsers();
  const navigate = useNavigate();

  const [liveStatuses, setLiveStatuses] = useState(initialLiveStatuses);
  const [greeting, setGreeting] = useState("");
  const [nudgePostponed, setNudgePostponed] = useState(false);
  const [happeningNearby, setHappeningNearby] = useState("5 neighbours are walking right now 🚶");
  const [showInvite, setShowInvite] = useState(true);
  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

  // Rotate "happening nearby" messages
  useEffect(() => {
    const messages = [
      "5 neighbours are walking right now 🚶",
      "3 people at the kopitiam nearby ☕",
      "Evening yoga starting in 30 mins 🧘",
      "Board game night has 2 spots left 🎲",
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setHappeningNearby(messages[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get neighbourhood display name from session storage profile
  const primaryNeighbourhood = storedProfile?.neighbourhoods?.[0];
  const neighbourhoodDisplayName = primaryNeighbourhood 
    ? neighbourhoodLabels[primaryNeighbourhood] || primaryNeighbourhood
    : userNeighbourhood?.neighbourhood || 'Your area';

  // Update greeting based on real time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateGreeting();
    // Update every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Use stored profile name, fallback to current user, then 'there'
  const displayName = storedProfile?.displayName || currentUser?.name || '';
  const firstName = displayName?.split(' ')[0] || 'there';

  const handleAddEvent = () => {
    // Mock functionality
    alert("Event creation feature coming soon!");
  };

  return (
    <div className="h-screen pb-20 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <p className="text-muted-foreground text-sm mb-1">{greeting}</p>
            <h1 className="text-2xl font-semibold text-foreground">
              {firstName}, <span className="text-gradient">what's happening?</span>
            </h1>
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-end gap-1"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100/50">
              <div className="flex items-center gap-1">
                <Sun className="h-6 w-6 text-amber-400" />
                <Cloud className="h-5 w-5 text-sky-400 -ml-3" />
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">28°</p>
                <p className="text-[10px] text-muted-foreground">Partly cloudy</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Great weather for an evening walk!
            </p>
          </motion.div>
        </div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mt-2"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pandan/10">
            <Users className="h-3.5 w-3.5 text-pandan" />
            <span className="text-xs font-medium text-pandan">{totalPeopleActive} active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">{neighbourhoodDisplayName}</span>
          </div>
          {/* Happening Nearby - rotating message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={happeningNearby}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">{happeningNearby}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Personalization Callout */}
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 bg-gradient-to-r from-primary/10 via-sakura/10 to-lavender/10 rounded-xl p-3 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pravatar.cc/100?img=11" 
                  alt="Ravi" 
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <Coffee className="h-3.5 w-3.5 inline mr-1 text-amber-600" />
                    Ravi invited you to kopi!
                  </p>
                  <p className="text-xs text-muted-foreground">Kopitiam @ Blk 123 · Starting now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate({ pathname: "/chat", search: createSearchParams({ userId: "u002" }).toString() })}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Join
                </button>
                <button 
                  onClick={() => setShowInvite(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Live Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="px-6 mb-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-pandan animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Live now</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {liveStatuses.map((status, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              key={status.id}
              onClick={() => navigate({
                pathname: "/chat",
                search: createSearchParams({ userId: status.userId }).toString()
              })}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white shadow-soft whitespace-nowrap flex-shrink-0 cursor-pointer hover:shadow-elevated transition-all"
            >
              <div className="relative">
                <img 
                  src={status.avatar} 
                  alt={status.userName}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                />
                {status.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-pandan border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{status.userName}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {status.activity}
                  <span className="text-[9px] text-muted-foreground/60">· {status.time}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Upcoming Events Carousel */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Events
              </h2>
              <Link to="/events" className="text-xs text-primary hover:underline flex items-center gap-1">
                See all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="min-w-[220px] bg-white rounded-xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
                >
                  <h3 className="font-medium text-foreground text-sm mb-2">{event.title}</h3>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                    <p className="text-xs text-pandan flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {event.attendees} going
                    </p>
                  </div>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
                onClick={() => navigate("/events", { state: { openCreate: true } })}
                className="min-w-[100px] bg-muted/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add event</span>
              </motion.button>
            </div>
          </motion.section>

          {/* Featured Community Moment */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Camera className="h-4 w-4 text-sakura" />
                Community Moment
              </h2>
              <Link to="/explore" className="text-xs text-primary hover:underline flex items-center gap-1">
                See more <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-soft cursor-pointer group"
            >
              <div className="relative h-36 overflow-hidden">
                <img 
                  src={featuredMoment.image}
                  alt={featuredMoment.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-medium text-sm mb-1">{featuredMoment.title}</h3>
                  <p className="text-white/80 text-xs">{featuredMoment.description}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-sakura transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{featuredMoment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{featuredMoment.comments}</span>
                  </button>
                </div>
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/32?img=1" className="h-6 w-6 rounded-full ring-2 ring-white" alt="" />
                  <img src="https://i.pravatar.cc/32?img=2" className="h-6 w-6 rounded-full ring-2 ring-white" alt="" />
                  <img src="https://i.pravatar.cc/32?img=3" className="h-6 w-6 rounded-full ring-2 ring-white" alt="" />
                  <div className="h-6 w-6 rounded-full bg-muted ring-2 ring-white flex items-center justify-center text-[9px] font-medium text-muted-foreground">+9</div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Daily Mindfulness Nudge - shown here when not postponed */}
          {!nudgePostponed && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
            <div className="bg-gradient-to-br from-lavender/20 to-sakura/10 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Wind className="h-5 w-5 text-lavender" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily Nudge</p>
                  <h3 className="font-medium text-foreground text-sm">Take a breathing break</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                      A 2-minute box breathing exercise to reset your focus
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        to="/wellness"
                        className="px-4 py-2 rounded-xl bg-lavender text-white text-xs font-medium hover:bg-lavender/90 transition-colors"
                      >
                        Start now
                      </Link>
                      <button 
                        onClick={() => setNudgePostponed(true)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Remind me later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Step Challenge Alternative */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-pandan/10 to-emerald-50 rounded-xl p-3 relative overflow-hidden">
              {/* Subtle animated background */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-32 h-32 rounded-full bg-pandan/10 blur-2xl -mr-10 -mt-10"
              />
              <div className="flex items-start gap-3 relative">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0"
                >
                  <Footprints className="h-5 w-5 text-pandan" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Step Challenge</p>
                    <motion.span 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs font-medium text-pandan"
                    >
                      3,240 / 5,000
                    </motion.span>
                  </div>
                  <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-2 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full relative"
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    </motion.div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You're 65% there! Join the evening walk group at 6pm to hit your goal.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Daily Mindfulness Nudge - shown here when postponed */}
          {nudgePostponed && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-gradient-to-br from-lavender/20 to-sakura/10 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                    <Wind className="h-5 w-5 text-lavender" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily Nudge</p>
                    <h3 className="font-medium text-foreground text-sm">Take a breathing break</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      A 2-minute box breathing exercise to reset your focus
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        to="/wellness"
                        className="px-4 py-2 rounded-xl bg-lavender text-white text-xs font-medium hover:bg-lavender/90 transition-colors"
                      >
                        Start now
                      </Link>
                      <button 
                        onClick={() => setNudgePostponed(false)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Move back up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </div>

        {/* Sidebar - Activity Feed */}
        <div className="lg:col-span-1 min-w-[350px] pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="max-h-[calc(100vh-280px)] overflow-y-auto"
          >
            <StatusFeed compact />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
