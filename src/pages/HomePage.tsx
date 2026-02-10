import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Users, Calendar, Wind, Footprints,
  ChevronRight, Clock, Plus, Sun, Cloud, CloudRain, Thermometer
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

// Mock live status data (moved inside component as initial state)
const initialLiveStatuses = [
  { id: "ls1", userId: "u002", userName: "Ravi", activity: "heading for kopi", time: "2m ago" },
  { id: "ls2", userId: "u019", userName: "Mei Ling", activity: "at the gym", time: "5m ago" },
  { id: "ls3", userId: "u003", userName: "Aiman", activity: "walking at park", time: "8m ago" },
  { id: "ls4", userId: "u014", userName: "Priya", activity: "free to chat", time: "12m ago" },
];

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
  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

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
        </motion.div>
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
          {liveStatuses.map((status) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              key={status.id}
              onClick={() => navigate({
                pathname: "/chat",
                search: createSearchParams({ userId: status.userId }).toString()
              })}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-soft whitespace-nowrap flex-shrink-0 cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/70 to-sakura/70 flex items-center justify-center text-[10px] font-semibold text-white">
                {status.userName[0]}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{status.userName}</p>
                <p className="text-[10px] text-muted-foreground">{status.activity}</p>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="min-w-[220px] bg-white rounded-xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
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
            <div className="bg-gradient-to-br from-pandan/10 to-emerald-50 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Footprints className="h-5 w-5 text-pandan" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Step Challenge</p>
                    <span className="text-xs font-medium text-pandan">3,240 / 5,000</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/60 overflow-hidden mb-2">
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
