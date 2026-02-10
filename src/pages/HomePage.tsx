import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, MapPin, Users, Calendar, Wind, Footprints, 
  ChevronRight, Clock, Target, Plus, Bell, Heart
} from "lucide-react";
import { useCurrentUser, useActivities, useClans, usePulseData, useUsers } from "@/hooks/use-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Link, useNavigate } from "react-router-dom";
import StatusFeed from "@/components/StatusFeed";

// Mock data for neighbourhood goals
const neighbourhoodGoals = [
  { id: "g1", title: "Community Volunteer Hours", current: 127, target: 200, unit: "hours" },
  { id: "g2", title: "Neighbourhood Clean-up", current: 45, target: 50, unit: "participants" },
  { id: "g3", title: "Community Garden Project", current: 8, target: 15, unit: "plots" },
];

// Mock data for upcoming events
const upcomingEvents = [
  { id: "e1", title: "Morning Tai Chi", time: "Tomorrow 7:00 AM", location: "Punggol Park", attendees: 12 },
  { id: "e2", title: "Board Game Night", time: "Sat 7:30 PM", location: "RC Hall", attendees: 8 },
  { id: "e3", title: "Photography Walk", time: "Sun 5:00 PM", location: "Waterway", attendees: 6 },
];

// Mock live status data
const liveStatuses = [
  { id: "ls1", userName: "Ravi", activity: "heading for kopi", time: "2m ago" },
  { id: "ls2", userName: "Mei Lin", activity: "at the gym", time: "5m ago" },
  { id: "ls3", userName: "Ahmad", activity: "walking at park", time: "8m ago" },
  { id: "ls4", userName: "Priya", activity: "free to chat", time: "12m ago" },
];

const HomePage = () => {
  const currentUser = useCurrentUser();
  const { profile: storedProfile } = useUserProfile();
  const activities = useActivities();
  const clans = useClans();
  const pulseData = usePulseData();
  const users = useUsers();
  const navigate = useNavigate();
  
  const [quickStatus, setQuickStatus] = useState("");
  const [showQuickStatus, setShowQuickStatus] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [postedStatus, setPostedStatus] = useState<{ content: string; timestamp: number } | null>(null);
  
  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

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

  const handlePostStatus = () => {
    if (!quickStatus.trim()) return;
    // Post status and show it in the Updates section
    setPostedStatus({ content: quickStatus, timestamp: Date.now() });
    setQuickStatus("");
    setShowQuickStatus(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-sm mb-1">{greeting}</p>
          <h1 className="text-2xl font-semibold text-foreground">
            {firstName}, <span className="text-gradient">what's happening?</span>
          </h1>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mt-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pandan/10">
            <Users className="h-3.5 w-3.5 text-pandan" />
            <span className="text-xs font-medium text-pandan">{totalPeopleActive} active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">{userNeighbourhood?.neighbourhood || 'Your area'}</span>
          </div>
        </motion.div>
      </div>

      {/* Live Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="px-6 mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-pandan animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Live now</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {liveStatuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-soft whitespace-nowrap"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/70 to-sakura/70 flex items-center justify-center text-[10px] font-semibold text-white">
                {status.userName[0]}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{status.userName}</p>
                <p className="text-[10px] text-muted-foreground">{status.activity}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-sakura flex items-center justify-center text-sm font-semibold text-white">
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            {!showQuickStatus ? (
              <button
                onClick={() => setShowQuickStatus(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                What are you up to?
              </button>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostStatus()}
                  placeholder="e.g., Heading for kopi in 10 min..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <button
                  onClick={handlePostStatus}
                  disabled={!quickStatus.trim()}
                  className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {showQuickStatus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Your groups will be notified when you post</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Neighbourhood Goals */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Neighbourhood Goals
              </h2>
              <Link to="/goals" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {neighbourhoodGoals.map((goal, i) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-white rounded-xl p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{goal.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Upcoming Events Carousel */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Events
              </h2>
              <Link to="/events" className="text-xs text-primary hover:underline flex items-center gap-1">
                See all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="min-w-[200px] bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
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
                className="min-w-[100px] bg-muted/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add event</span>
              </motion.button>
            </div>
          </motion.section>

          {/* Daily Mindfulness Nudge */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <div className="bg-gradient-to-br from-lavender/20 to-sakura/10 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Wind className="h-6 w-6 text-lavender" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Daily Nudge</p>
                  <h3 className="font-medium text-foreground mb-1">Take a breathing break</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    A 2-minute box breathing exercise to reset your focus
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/wellness"
                      className="px-4 py-2 rounded-xl bg-lavender text-white text-xs font-medium hover:bg-lavender/90 transition-colors"
                    >
                      Start now
                    </Link>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Remind me later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Step Challenge Alternative */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-pandan/10 to-emerald-50 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Footprints className="h-6 w-6 text-pandan" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Step Challenge</p>
                    <span className="text-xs font-medium text-pandan">3,240 / 5,000</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You're 65% there! Join the evening walk group at 6pm to hit your goal.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Sidebar - Activity Feed */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <StatusFeed compact newStatus={postedStatus} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
