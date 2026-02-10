import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Wind, Footprints, Sparkles, Coffee, ArrowRight, MessageCircle, Calendar, Users,
  ChevronRight, X, Bot, Compass, Activity, Heart, Lightbulb
} from "lucide-react";
import { useCurrentUser, usePulseData } from "@/hooks/use-data";
import { useEvents } from "@/hooks/use-events";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNavigate, createSearchParams } from "react-router-dom";

// Neighbourhood labels for display
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

// Floating orb component for ambient effect
const FloatingOrb = ({
  size,
  color,
  delay,
  duration,
  x,
  y
}: {
  size: number;
  color: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
}) => (
  <motion.div
    className="absolute rounded-full blur-3xl"
    style={{
      width: size,
      height: size,
      background: color,
      left: x,
      top: y,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 20, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Pulse ring animation
const PulseRing = ({ delay, size }: { delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full border border-primary/20"
    style={{ width: size, height: size }}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{
      scale: [0.8, 1.5],
      opacity: [0.6, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

// Animated counter component
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>{displayValue}{suffix}</span>
  );
};

// Mock data replaced by useEvents hook

// Tour steps configuration - simpler with arrow positioning
interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  // Arrow points to this position
  arrowTo: { x: string; y: string };
  // Tooltip card position
  cardPosition: { x: string; y: string };
  // Arrow curve direction
  arrowCurve: "down-left" | "down-right" | "up-left" | "up-right";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Community Pulse",
    description: "See how many neighbours are active right now.",
    icon: Activity,
    arrowTo: { x: "50%", y: "28%" },
    cardPosition: { x: "50%", y: "52%" },
    arrowCurve: "up-right",
  },
  {
    id: "explore",
    title: "Explore Button",
    description: "Discover neighbours and groups with shared interests.",
    icon: Compass,
    arrowTo: { x: "50%", y: "42%" },
    cardPosition: { x: "50%", y: "58%" },
    arrowCurve: "up-left",
  },
  {
    id: "events",
    title: "Upcoming Events",
    description: "Community activities happening near you.",
    icon: Calendar,
    arrowTo: { x: "30%", y: "58%" },
    cardPosition: { x: "50%", y: "30%" },
    arrowCurve: "down-left",
  },
  {
    id: "actions",
    title: "Quick Actions",
    description: "Steps, wellness, and messages at your fingertips.",
    icon: Heart,
    arrowTo: { x: "50%", y: "78%" },
    cardPosition: { x: "50%", y: "40%" },
    arrowCurve: "down-right",
  },
  {
    id: "assistant",
    title: "AI Assistant",
    description: "Tap the button in the corner to chat with me!",
    icon: Bot,
    arrowTo: { x: "93%", y: "80%" },
    cardPosition: { x: "50%", y: "45%" },
    arrowCurve: "down-right",
  },
];

const HomePage = () => {
  const currentUser = useCurrentUser();
  const { upcomingEvents } = useEvents();
  const { profile: storedProfile } = useUserProfile();
  const pulseData = usePulseData();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("");
  const [nudgePostponed, setNudgePostponed] = useState(false);
  const [showInvite, setShowInvite] = useState(true);

  // Tour state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check if first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("km_tour_completed");
    if (!hasSeenTour) {
      // Small delay for page to render
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = useCallback(() => {
    setTourStep(0);
    setShowTour(true);
  }, []);

  const completeTour = useCallback(() => {
    setShowTour(false);
    localStorage.setItem("km_tour_completed", "true");
  }, []);

  const nextStep = useCallback(() => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [tourStep, completeTour]);

  const currentTourStep = tourSteps[tourStep];

  // Sync with WellnessPageNew steps
  const [dailySteps, setDailySteps] = useState(6847);
  useEffect(() => {
    const loadSteps = () => {
      try {
        const raw = localStorage.getItem("km_daily_steps");
        if (raw) setDailySteps(Number(raw));
      } catch (e) { }
    };
    loadSteps();
    window.addEventListener("storage", loadSteps);
    return () => window.removeEventListener("storage", loadSteps);
  }, []);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

  // Get user's neighbourhood mood (match by lowercase key or display name)
  const userNeighbourhoodMood = useMemo(() => {
    const primaryKey = storedProfile?.neighbourhoods?.[0];
    if (!primaryKey) return null;
    // Match by lowercase key (e.g., "woodlands" -> "Woodlands")
    const displayName = neighbourhoodLabels[primaryKey] || primaryKey;
    return pulseData.find(p => p.neighbourhood.toLowerCase() === primaryKey.toLowerCase() || p.neighbourhood === displayName);
  }, [pulseData, storedProfile]);

  // Get neighbourhood display name from session storage profile
  const primaryNeighbourhood = storedProfile?.neighbourhoods?.[0];
  const neighbourhoodDisplayName = primaryNeighbourhood
    ? neighbourhoodLabels[primaryNeighbourhood] || primaryNeighbourhood
    : userNeighbourhoodMood?.neighbourhood || 'Your area';

  // Update greeting based on real time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Use stored profile name, fallback to current user, then 'there'
  const displayName = storedProfile?.displayName || currentUser?.name || '';
  const firstName = displayName?.split(' ')[0] || 'there';

  return (
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 flex flex-col">
      {/* Tour Overlay */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            {/* Subtle dark backdrop */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Curvy Arrow SVG */}
            <svg
              key={`arrow-${tourStep}`}
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ pointerEvents: "none" }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path
                    d="M 0 0 L 8 4 L 0 8 Z"
                    fill="white"
                  />
                </marker>
              </defs>
              <motion.path
                d={(() => {
                  const cardX = parseFloat(currentTourStep.cardPosition.x);
                  const cardY = parseFloat(currentTourStep.cardPosition.y);
                  const arrowX = parseFloat(currentTourStep.arrowTo.x);
                  const arrowY = parseFloat(currentTourStep.arrowTo.y);

                  // Start from edge of card
                  const startX = cardX;
                  const startY = currentTourStep.arrowCurve.startsWith("down") ? cardY + 8 : cardY - 8;
                  const endX = arrowX;
                  const endY = arrowY;

                  // Control points for smooth bezier curve
                  const midY = (startY + endY) / 2;
                  const curveOffset = currentTourStep.arrowCurve.includes("left") ? -30 : 30;

                  return `M ${startX} ${startY} Q ${startX + curveOffset} ${midY + 10}, ${endX} ${endY}`;
                })()}
                stroke="white"
                strokeWidth="0.4"
                strokeDasharray="1.5 1"
                strokeLinecap="round"
                fill="none"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </svg>

            {/* Tooltip Card */}
            <motion.div
              key={`tooltip-${tourStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-72 pointer-events-auto"
              style={{
                left: currentTourStep.cardPosition.x,
                top: currentTourStep.cardPosition.y,
              }}
            >
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <currentTourStep.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{tourStep + 1}/{tourSteps.length}</p>
                    <h3 className="text-sm font-semibold text-foreground">{currentTourStep.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{currentTourStep.description}</p>

                {/* Progress & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {tourSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all ${i === tourStep ? "w-4 bg-primary" : "w-1 bg-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={completeTour}
                      className="text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Skip
                    </button>
                    <button
                      onClick={nextStep}
                      className="text-[10px] font-medium text-primary flex items-center gap-0.5"
                    >
                      {tourStep === tourSteps.length - 1 ? "Done" : "Next"}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size={300} color="rgba(139, 92, 246, 0.15)" delay={0} duration={8} x="10%" y="5%" />
        <FloatingOrb size={200} color="rgba(236, 72, 153, 0.12)" delay={2} duration={10} x="70%" y="15%" />
        <FloatingOrb size={250} color="rgba(34, 197, 94, 0.1)" delay={4} duration={9} x="20%" y="60%" />
        <FloatingOrb size={180} color="rgba(59, 130, 246, 0.1)" delay={3} duration={7} x="80%" y="70%" />
      </div>

      {/* Header - Clean Greeting */}
      <div className="relative px-6 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-0.5"
          >
            <p className="text-muted-foreground text-sm">{greeting}</p>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              {firstName}
            </h1>
          </motion.div>

          {/* Help button to restart tour */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={startTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors group"
            title="View tutorial"
          >
            <span className="text-sm text-muted-foreground group-hover:text-amber-500 transition-colors">Guide</span>
            <Lightbulb className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Hero - Animated Pulse Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative px-6 mb-4 flex-shrink-0"
      >
        <div className="relative bg-gradient-to-br from-primary/5 via-background to-sakura/5 rounded-2xl p-6 overflow-hidden border border-border/50">
          {/* Pulse rings behind the number */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <PulseRing delay={0} size={150} />
            <PulseRing delay={1} size={150} />
            <PulseRing delay={2} size={150} />
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-1"
            >
              <span className="text-6xl font-light text-foreground tracking-tight">
                <AnimatedNumber value={totalPeopleActive} />
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-4">neighbours active right now</p>

            {/* Quick stats row */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="h-2 w-2 rounded-full bg-pandan animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {userNeighbourhoodMood ? userNeighbourhoodMood.avg_mood.toFixed(1) : "--"} avg mood
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">{neighbourhoodDisplayName}</span>
              </motion.div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/explore?tab=globe")}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore your community</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Invite Card - Compact */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 mb-4 flex-shrink-0"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Coffee className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">James invited you to coffee</p>
                    <p className="text-[11px] text-muted-foreground">Kopitiam @ Blk 123 · Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate({ pathname: "/chat", search: createSearchParams({ userId: "u002", draft: "I'm in!" }).toString() })}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => setShowInvite(false)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* What's Happening - Upcoming Events */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="px-6 mb-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            What's happening
          </p>
          <button
            onClick={() => navigate("/events")}
            className="text-[10px] text-primary hover:underline"
          >
            See all
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {upcomingEvents.slice(0, 3).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => navigate("/events")}
              className="flex-shrink-0 bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-border/50 cursor-pointer hover:bg-white/90 transition-colors min-w-[140px]"
            >
              <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(event.date).toLocaleDateString("en-SG", { weekday: "short", hour: "numeric", minute: "2-digit" })}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-2.5 w-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{event.attendees}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="px-6 flex-1 flex flex-col justify-end pb-32"
      >
        <div className="grid grid-cols-3 gap-3">
          {/* Step Challenge */}
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => navigate("/wellness?tab=steps")}
            className="bg-gradient-to-br from-pandan/10 to-emerald-50/50 rounded-xl p-3 border border-pandan/10 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center mb-2"
            >
              <Footprints className="h-4 w-4 text-pandan" />
            </motion.div>
            <p className="text-[10px] text-muted-foreground">Steps</p>
            <div className="flex items-end gap-0.5">
              <span className="text-lg font-semibold text-foreground">{dailySteps >= 1000 ? `${(dailySteps / 1000).toFixed(1)}k` : dailySteps}</span>
              <span className="text-[10px] text-muted-foreground mb-0.5">/8k</span>
            </div>
          </motion.div>

          {/* Breathing Exercise */}
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => navigate("/wellness")}
            className="bg-gradient-to-br from-lavender/10 to-sakura/5 rounded-xl p-3 border border-lavender/10 cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center mb-2"
            >
              <Wind className="h-4 w-4 text-lavender" />
            </motion.div>
            <p className="text-[10px] text-muted-foreground">Wellness</p>
            <p className="text-sm font-medium text-foreground">Breathe</p>
          </motion.div>

          {/* Chat Shortcut */}
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => navigate("/chat")}
            className="bg-gradient-to-br from-primary/10 to-sky-50/50 rounded-xl p-3 border border-primary/10 cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground">Messages</p>
            <p className="text-sm font-medium text-foreground">3 new</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
