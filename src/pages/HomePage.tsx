import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  MapPin, Wind, Footprints, Sparkles, Coffee, ArrowRight, MessageCircle, Calendar, Users,
  ChevronRight, ChevronDown, X
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

// Ambient radial glow — very subtle, atmospheric
const AmbientGlow = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      filter: "blur(40px)",
    }}
    animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.08, 1] }}
    transition={{ duration: 8 + delay * 2, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Pulse ring — concentric, quiet
const PulseRing = ({ delay, size }: { delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full border border-primary/10"
    style={{ width: size, height: size }}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: [0.8, 1.8], opacity: [0.4, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }}
  />
);

// Animated counter — physics-based number roll
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => Math.round(v));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return controls.stop;
  }, [value, motionVal]);

  return <span>{current}{suffix}</span>;
};

// Stagger animation orchestrator
const stagger = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.045, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  },
  // Delayed variant for secondary sections
  itemSlow: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  },
};

const HomePage = () => {
  const currentUser = useCurrentUser();
  const { upcomingEvents } = useEvents();
  const { profile: storedProfile } = useUserProfile();
  const pulseData = usePulseData();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("");
  const [nudgePostponed, setNudgePostponed] = useState(false);
  const [showInvite, setShowInvite] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  // Track scroll to hide indicator
  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-y-auto relative">
      {/* ─── Page Content ─── */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16 pb-12"
      >

        {/* ═══ Header — quiet, receding ═══ */}
        <motion.header variants={stagger.item} className="pt-6 sm:pt-10 pb-2 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground/70 text-sm tracking-wide">{greeting}</p>
            <h1 className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight mt-1 leading-[1.1]">
              {firstName}
            </h1>
          </div>
        </motion.header>

        {/* ═══ HERO — Atmospheric Presence (desktop-scaled) ═══ */}
        <motion.section variants={stagger.item} className="relative py-10 sm:py-16 mt-2 mb-4">
          {/* Ambient depth — radial glows, wider spread for desktop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AmbientGlow color="hsla(16, 85%, 58%, 0.07)" size={700} x="50%" y="45%" delay={0} />
            <AmbientGlow color="hsla(350, 75%, 60%, 0.04)" size={450} x="15%" y="50%" delay={1.5} />
            <AmbientGlow color="hsla(155, 55%, 42%, 0.035)" size={400} x="85%" y="40%" delay={3} />
          </div>

          {/* Pulse rings — centered behind number */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <PulseRing delay={0} size={280} />
            <PulseRing delay={1.3} size={280} />
            <PulseRing delay={2.6} size={280} />
          </div>

          {/* Central number — dominant focal point */}
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-6xl sm:text-[8.5rem] leading-none font-light text-foreground tracking-tighter font-serif select-none">
                <AnimatedNumber value={totalPeopleActive} />
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm sm:text-lg mt-3 sm:mt-4 tracking-wide font-light">
              neighbours active right now
            </p>

            {/* Meta — mood + location, spaced apart */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-14 mt-5 sm:mt-8">
              <motion.div
                variants={stagger.item}
                className="flex items-center gap-2.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pandan opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pandan" />
                </span>
                <span className="text-[15px] text-muted-foreground font-light">
                  {userNeighbourhoodMood ? userNeighbourhoodMood.avg_mood.toFixed(1) : "—"} avg mood
                </span>
              </motion.div>
              <motion.div
                variants={stagger.item}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-primary/60" />
                <span className="text-[15px] text-muted-foreground font-light">{neighbourhoodDisplayName}</span>
              </motion.div>
            </div>

            {/* CTA — understated elegance */}
            <motion.div variants={stagger.item} className="mt-6 sm:mt-10">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/explore?tab=globe")}
                className="group inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-foreground text-background text-sm sm:text-[15px] font-medium shadow-apple-lg hover:shadow-apple-xl transition-all duration-500"
              >
                <Sparkles className="h-4 w-4 opacity-70" />
                <span className="tracking-wide">Explore your community</span>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══ INVITATION — gentle, inline ═══ */}
        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, y: 16, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 40 }}
              exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-2xl bg-gradient-to-r from-amber-50/80 via-background to-background px-4 sm:px-6 py-4 sm:py-5 overflow-hidden">
                {/* Warm accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-amber-400 to-amber-300" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100/80 flex items-center justify-center">
                      <Coffee className="h-[18px] w-[18px] text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-[15px] font-medium text-foreground leading-snug truncate">James invited you to coffee</p>
                      <p className="text-xs sm:text-sm text-muted-foreground/70 mt-0.5">Kopitiam @ Blk 123 · Now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate({ pathname: "/chat", search: createSearchParams({ userId: "u002", draft: "I'm in!" }).toString() })}
                      className="px-5 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                    >
                      Join
                    </motion.button>
                    <button
                      onClick={() => setShowInvite(false)}
                      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ LOWER — Two-column desktop layout ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT COLUMN — Events (dominant) */}
          <motion.section variants={stagger.item} className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">What's happening</h2>
              <button
                onClick={() => navigate("/events")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                See all
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Featured event — large */}
            {upcomingEvents.slice(0, 1).map((event) => (
              <motion.div
                key={event.id}
                variants={stagger.item}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/events")}
                className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-sakura/[0.03] p-5 sm:p-8 cursor-pointer transition-all duration-500 hover:shadow-apple group mb-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-primary/50" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {new Date(event.date).toLocaleDateString("en-SG", { weekday: "long" })}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                  {new Date(event.date).toLocaleDateString("en-SG", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}
                </p>
                <div className="flex items-center gap-1.5 mt-5 text-muted-foreground/60">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-sm font-light">{event.attendees} going</span>
                </div>
              </motion.div>
            ))}

            {/* Secondary events — horizontal row */}
            <div className="grid grid-cols-2 gap-4">
              {upcomingEvents.slice(1, 3).map((event) => (
                <motion.div
                  key={event.id}
                  variants={stagger.itemSlow}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate("/events")}
                  className="rounded-2xl bg-muted/30 p-5 cursor-pointer transition-all duration-500 hover:bg-muted/50 hover:shadow-apple-sm group"
                >
                  <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider mb-2">
                    {new Date(event.date).toLocaleDateString("en-SG", { weekday: "short" })}
                  </p>
                  <h4 className="text-[15px] font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-3 text-muted-foreground/50">
                    <Users className="h-3 w-3" />
                    <span className="text-xs font-light">{event.attendees}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* RIGHT COLUMN — Your day */}
          <motion.section variants={stagger.item} className="lg:col-span-5">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4 sm:mb-6">Your day</h2>

            {/* Steps — primary card */}
            <motion.div
              variants={stagger.item}
              whileHover={{ y: -3 }}
              onClick={() => navigate("/wellness?tab=steps")}
              className="rounded-2xl bg-gradient-to-br from-pandan/[0.06] to-background p-5 sm:p-7 cursor-pointer transition-all duration-500 hover:shadow-apple group mb-5"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.div
                  animate={{ rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-xl bg-pandan/10 flex items-center justify-center"
                >
                  <Footprints className="h-5 w-5 text-pandan" />
                </motion.div>
                <span className="text-xs text-muted-foreground/50 font-medium uppercase tracking-wider">Steps</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-foreground tracking-tight font-serif">
                  {dailySteps >= 1000 ? `${(dailySteps / 1000).toFixed(1)}k` : dailySteps}
                </span>
                <span className="text-sm text-muted-foreground/40 font-light ml-1">/ 8k</span>
              </div>
              <div className="mt-4 h-1 rounded-full bg-pandan/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-pandan/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((dailySteps / 8000) * 100, 100)}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>

            {/* Wellness + Messages — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={stagger.item}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/wellness")}
                className="rounded-2xl bg-gradient-to-br from-lavender/[0.05] to-background p-4 sm:p-6 cursor-pointer transition-all duration-500 hover:shadow-apple group flex flex-col justify-between min-h-[120px] sm:min-h-[140px]"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-xl bg-lavender/10 flex items-center justify-center"
                >
                  <Wind className="h-5 w-5 text-lavender" />
                </motion.div>
                <div className="mt-auto pt-5">
                  <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-wider mb-1">Wellness</p>
                  <p className="text-lg font-medium text-foreground tracking-tight group-hover:text-lavender transition-colors duration-300">Breathe</p>
                </div>
              </motion.div>

              <motion.div
                variants={stagger.item}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/chat")}
                className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-background p-4 sm:p-6 cursor-pointer transition-all duration-500 hover:shadow-apple group flex flex-col justify-between min-h-[120px] sm:min-h-[140px]"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary/70" />
                </div>
                <div className="mt-auto pt-5">
                  <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-wider mb-1">Messages</p>
                  <p className="text-lg font-medium text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">3 new</p>
                </div>
              </motion.div>
            </div>
          </motion.section>

        </div>

      </motion.div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-1.5 cursor-pointer select-none"
            onClick={() => window.scrollBy({ top: 400, behavior: "smooth" })}
          >
            <span className="text-[11px] text-muted-foreground/60 font-medium tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
