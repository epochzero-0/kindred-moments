import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  Wind, Heart, Moon, Sun, Play, Pause, X, Timer, Flame, Clock, Sparkles, 
  Sunrise, Target, Footprints, BookHeart, Phone, AlertCircle, ChevronRight,
  TrendingUp, Calendar, Smile, Meh, Frown, Brain, Rewind, Award
} from "lucide-react";

// Types
interface Exercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  pattern: string;
  icon: typeof Wind;
  steps: string[];
}

interface Meditation {
  id: string;
  name: string;
  duration: number;
  icon: typeof Wind;
  desc: string;
}

interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  content: string;
  prompt?: string;
}

// Data
const exercises: Exercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    duration: 4,
    description: "A calming technique used by Navy SEALs",
    pattern: "4-4-4-4",
    icon: Wind,
    steps: ["Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 4 seconds", "Hold for 4 seconds"],
  },
  {
    id: "478",
    name: "4-7-8 Relaxation",
    duration: 5,
    description: "Perfect for falling asleep",
    pattern: "4-7-8",
    icon: Moon,
    steps: ["Breathe in for 4 seconds", "Hold for 7 seconds", "Breathe out for 8 seconds"],
  },
  {
    id: "energize",
    name: "Energizing Breath",
    duration: 3,
    description: "Wake up and feel alert",
    pattern: "Quick cycles",
    icon: Sun,
    steps: ["Quick inhale", "Quick exhale", "Repeat 10 times", "Rest and repeat"],
  },
  {
    id: "calm",
    name: "Deep Calm",
    duration: 6,
    description: "For moments of stress or anxiety",
    pattern: "6-2-8",
    icon: Heart,
    steps: ["Breathe in slowly for 6 seconds", "Hold gently for 2 seconds", "Exhale slowly for 8 seconds"],
  },
];

const meditations: Meditation[] = [
  { id: "morning", name: "Morning Intention", duration: 5, icon: Sunrise, desc: "Start your day with clarity" },
  { id: "focus", name: "Focus Session", duration: 10, icon: Target, desc: "Sharpen your concentration" },
  { id: "gratitude", name: "Gratitude Practice", duration: 7, icon: Heart, desc: "Cultivate appreciation" },
  { id: "sleep", name: "Sleep Story", duration: 15, icon: Moon, desc: "Drift into peaceful rest" },
];

const journalPrompts = [
  "What's one thing that made you smile today?",
  "Name three things you're grateful for right now.",
  "What's something you learned about yourself this week?",
  "Describe a moment when you felt connected to your community.",
  "What would you tell your younger self?",
  "What's one small act of kindness you witnessed or did today?",
];

const mockJournalEntries: JournalEntry[] = [
  { id: "j1", date: new Date(2026, 1, 9), mood: 4, content: "Had a great time at the morning walk group. Met two new neighbours!", prompt: "Describe a moment when you felt connected to your community." },
  { id: "j2", date: new Date(2026, 1, 8), mood: 3, content: "Busy day at work but managed to take a few breathing breaks.", prompt: "What's one thing that made you smile today?" },
  { id: "j3", date: new Date(2026, 1, 7), mood: 5, content: "Joined my first board game night! Everyone was so welcoming.", prompt: "Name three things you're grateful for right now." },
];

const counsellingResources = [
  { name: "Singapore Association for Mental Health", phone: "1800-283-7019", available: "24/7" },
  { name: "Institute of Mental Health", phone: "6389-2222", available: "24/7" },
  { name: "Samaritans of Singapore", phone: "1800-221-4444", available: "24/7" },
  { name: "Care Corner Counselling", phone: "1800-353-5800", available: "Mon-Fri 10am-10pm" },
];

type WellnessTab = "breathe" | "steps" | "journal" | "resources";

const WellnessPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as WellnessTab) || "breathe";
  const [activeTab, setActiveTab] = useState<WellnessTab>(initialTab);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseSeconds, setExerciseSeconds] = useState<number | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState<number | null>(null);

  // Animation controls for smoother per-phase animations
  const outerControls = useAnimation();
  const middleControls = useAnimation();
  const innerControls = useAnimation();

  // Parse exercise pattern into phases (hoisted function to avoid TDZ)
  function parsePattern(pattern: string): number[] {
    if (!pattern) return [];
    if (pattern.includes("-")) {
      return pattern.split("-").map(p => Number(p.trim())).filter(n => !isNaN(n));
    }
    // For non-numeric patterns like "Quick cycles", return empty to signal fallback
    return [];
  }

  // Determine phase type from step text (hoisted)
  function getPhaseType(stepText: string): "expand" | "hold" | "contract" {
    const lower = (stepText || "").toLowerCase();
    if (lower.includes("breathe in") || lower.includes("inhale")) return "expand";
    if (lower.includes("hold") || lower.includes("retain")) return "hold";
    if (lower.includes("breathe out") || lower.includes("exhale")) return "contract";
    return "expand"; // fallback
  }

  // Derived phase info for current exercise
  const currentPhases = activeExercise ? parsePattern(activeExercise.pattern) : [];
  const phaseDuration = currentPhases.length > 0 ? (currentPhases[phaseIndex] || 1) : (activeExercise?.duration || 1);
  const stepText = activeExercise ? (activeExercise.steps[phaseIndex] || "") : "";
  const phaseType = getPhaseType(stepText);
  const stepsLen = activeExercise ? Math.max(activeExercise.steps.length, 1) : 1;
  const prevIndex = (phaseIndex - 1 + stepsLen) % stepsLen;
  const prevType = activeExercise ? getPhaseType(activeExercise.steps[prevIndex] || "") : "expand";
  const holdScales = {
    outer: prevType === "expand" ? 1.3 : 1,
    middle: prevType === "expand" ? 1.15 : 0.8,
    inner: prevType === "expand" ? 1 : 0.6,
  };

  // Trigger animations when phase changes
  useEffect(() => {
    if (!activeExercise) return;
    if (!isPlaying) return;
    // phaseDuration may be large (minutes) for fallback; cap to reasonable seconds for animation
    const duration = Math.min(12, Math.max(0.2, Number(phaseDuration) || 1));

    const contracted = { outer: 1, middle: 0.8, inner: 0.6 };
    const expanded = { outer: 1.3, middle: 1.15, inner: 1 };

    // For hold, snap to the end size of the previous phase (expanded or contracted)
    if (phaseType === "hold") {
      const snap = prevType === "expand" ? expanded : contracted;
      outerControls.set({ scale: snap.outer });
      middleControls.set({ scale: snap.middle });
      innerControls.set({ scale: snap.inner });
      return;
    }

    if (phaseType === "expand") {
      // start from contracted, animate to expanded
      outerControls.set({ scale: contracted.outer });
      middleControls.set({ scale: contracted.middle });
      innerControls.set({ scale: contracted.inner });

      outerControls.start({ scale: expanded.outer, transition: { duration, ease: "easeInOut" } });
      middleControls.start({ scale: expanded.middle, transition: { duration, ease: "easeInOut" } });
      innerControls.start({ scale: expanded.inner, transition: { duration, ease: "easeInOut" } });
      return;
    }

    // contract: start from expanded, animate to contracted
    outerControls.set({ scale: expanded.outer });
    middleControls.set({ scale: expanded.middle });
    innerControls.set({ scale: expanded.inner });

    outerControls.start({ scale: contracted.outer, transition: { duration, ease: "easeInOut" } });
    middleControls.start({ scale: contracted.middle, transition: { duration, ease: "easeInOut" } });
    innerControls.start({ scale: contracted.inner, transition: { duration, ease: "easeInOut" } });
  }, [phaseIndex, phaseType, phaseDuration, isPlaying, activeExercise]);


  // Keep exercise timer in sync with phases
  useEffect(() => {
    let t: ReturnType<typeof setInterval> | null = null;
    if (activeExercise && isPlaying && exerciseSeconds !== null) {
      const phases = parsePattern(activeExercise.pattern);
      const hasParsedPhases = phases.length > 0;
      
      t = setInterval(() => {
        setExerciseSeconds((s) => {
          if (!s || s <= 1) {
            setIsPlaying(false);
            setPhaseIndex(0);
            setPhaseSeconds(null);
            toast({ title: "Well done!", description: `${activeExercise.name} complete.` });
            return null;
          }
          
          // Decrement phase timer for all exercises
          setPhaseSeconds((ps) => {
            if (ps === null) return null;
            const nextPs = ps - 1;
            if (nextPs <= 0) {
              // Move to next phase
              setPhaseIndex((pi) => {
                const nextPhaseIdx = hasParsedPhases ? (pi + 1) % phases.length : (pi + 1) % Math.max(activeExercise.steps.length, 1);
                setPhaseSeconds(hasParsedPhases ? (phases[nextPhaseIdx] || 1) : 1);
                return nextPhaseIdx;
              });
              return null;
            }
            return nextPs;
          });
          
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [activeExercise, isPlaying, exerciseSeconds]);

  const startExercise = (exercise: Exercise) => {
    const phases = parsePattern(exercise.pattern);
    let totalSeconds = 0;
    
    if (phases.length > 0) {
      totalSeconds = phases.reduce((a, b) => a + b, 0) * 4; // 4 rounds
    } else {
      // For non-numeric patterns, use duration field as fallback (in minutes)
      totalSeconds = exercise.duration * 60;
    }
    
    setActiveExercise(exercise);
    setIsPlaying(true);
    setExerciseSeconds(totalSeconds);
    setPhaseIndex(0);
    setPhaseSeconds(phases[0] || 1); // Use 1 second as fallback for non-numeric patterns
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
    setExerciseSeconds(null);
    setPhaseIndex(0);
    setPhaseSeconds(null);
  };

  const tabs = [
    { id: "breathe" as const, label: "Breathe", icon: Wind },
    { id: "steps" as const, label: "Steps", icon: Footprints },
    { id: "journal" as const, label: "Journal", icon: BookHeart },
    { id: "resources" as const, label: "Help", icon: Heart },
  ];


  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-sm mb-1">Wellness</p>
          <h1 className="text-2xl font-semibold text-foreground">Take care of yourself</h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mt-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">7 day streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lavender/10">
            <Clock className="h-3.5 w-3.5 text-lavender" />
            <span className="text-xs font-medium text-lavender">45 min this week</span>
          </div>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="px-6 mb-5">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
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
          {activeTab === "breathe" && (
            <BreatheTab
              key="breathe"
              exercises={exercises}
              meditations={meditations}
              onStartExercise={startExercise}
            />
          )}
          {activeTab === "steps" && <StepsTab key="steps" />}
          {activeTab === "journal" && <JournalTab key="journal" entries={mockJournalEntries} prompts={journalPrompts} />}
          {activeTab === "resources" && <ResourcesTab key="resources" resources={counsellingResources} />}
        </AnimatePresence>
      </div>

      {/* Rewind Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="px-6 mt-6"
      >
        <div className="bg-gradient-to-br from-primary/10 via-sakura/10 to-lavender/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center">
              <Rewind className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Your 2025 Rewind</h3>
              <p className="text-xs text-muted-foreground">Your community journey in review</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">24</p>
              <p className="text-[10px] text-muted-foreground">Events</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">156</p>
              <p className="text-[10px] text-muted-foreground">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">892K</p>
              <p className="text-[10px] text-muted-foreground">Steps</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">12</p>
              <p className="text-[10px] text-muted-foreground">Goals</p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            Watch Your Rewind
          </button>
        </div>
      </motion.div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-elevated max-w-sm w-full p-6 relative"
            >
              <button
                onClick={closeExercise}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <activeExercise.icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-medium text-foreground mb-1">{activeExercise.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">{activeExercise.description}</p>

                {/* Phase Label */}
                {isPlaying && (
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                    {activeExercise.steps[phaseIndex]?.replace(/for \d+ seconds/i, "").trim() || "Breathing"}
                  </p>
                )}

                {/* Breathing animation with phase-matched durations */}
                <div className="relative h-36 w-36 mx-auto mb-6">
                  {(() => {
                    const phases = parsePattern(activeExercise.pattern);
                    const phaseDuration = phases.length > 0 ? phases[phaseIndex] || 1 : (activeExercise.duration);
                    const stepText = activeExercise.steps[phaseIndex] || "";
                    const phaseType = getPhaseType(stepText);
                    const stepsLen = Math.max(activeExercise.steps.length, 1);
                    const prevIndex = (phaseIndex - 1 + stepsLen) % stepsLen;
                    const prevType = getPhaseType(activeExercise.steps[prevIndex] || "");
                    // hold scales should match the end size of the previous phase
                    const holdScales = {
                      outer: prevType === "expand" ? 1.3 : 1,
                      middle: prevType === "expand" ? 1.15 : 0.8,
                      inner: prevType === "expand" ? 1 : 0.6,
                    };
                    
                    return (
                      <>
                        <motion.div
                          animate={outerControls}
                          className="absolute inset-0 rounded-full bg-primary/10"
                        />
                        <motion.div
                          animate={middleControls}
                          className="absolute inset-4 rounded-full bg-primary/20"
                        />
                        <motion.div
                          animate={innerControls}
                          className="absolute inset-8 rounded-full bg-primary/40 flex items-center justify-center flex-col"
                        >
                          <div className="text-white text-xs font-semibold mb-1">
                            {phaseSeconds !== null ? phaseSeconds : phaseDuration}s
                          </div>
                          <div className="text-white/70 text-[10px] font-medium">
                            {exerciseSeconds !== null ? `${Math.floor(exerciseSeconds / 60)}:${String(exerciseSeconds % 60).padStart(2, "0")}` : ""}
                          </div>
                        </motion.div>
                      </>
                    );
                  })()}
                </div>

                {/* Steps */}
                <div className="text-left bg-muted/50 rounded-xl p-4 mb-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Pattern</p>
                  <ol className="space-y-1">
                    {activeExercise.steps.map((step, i) => (
                      <li key={i} className={`text-xs flex items-center gap-2 ${i === phaseIndex && isPlaying ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                        <span className={`h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-medium ${i === phaseIndex && isPlaying ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Controls */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mx-auto shadow-soft transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Breathe Tab
interface BreatheTabProps {
  exercises: Exercise[];
  meditations: Meditation[];
  onStartExercise: (exercise: Exercise) => void;
}

const BreatheTab = ({ exercises, meditations, onStartExercise }: BreatheTabProps) => {
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [isMedPlaying, setIsMedPlaying] = useState(false);
  const [medSeconds, setMedSeconds] = useState<number | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | null = null;
    if (activeMeditation && isMedPlaying && medSeconds !== null) {
      t = setInterval(() => {
        setMedSeconds((s) => {
          if (!s || s <= 1) {
            setIsMedPlaying(false);
            toast({ title: "Meditation complete", description: `${activeMeditation.name} finished.` });
            return null;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [activeMeditation, isMedPlaying, medSeconds]);

  const startMeditation = (m: Meditation) => {
    setActiveMeditation(m);
    setMedSeconds(m.duration * 60);
    setIsMedPlaying(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Breathing Exercises */}
      <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-foreground">Breathing exercises</h2>
        <span className="text-xs text-muted-foreground">Tap to start</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exercises.map((exercise, i) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onStartExercise(exercise)}
            className="bg-white rounded-2xl shadow-soft p-4 text-left hover:shadow-elevated transition-shadow"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <exercise.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">{exercise.name}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{exercise.description}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Timer className="h-3 w-3" />
              <span>{exercise.duration} min · {exercise.pattern}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>

    {/* Guided Meditations */}
    <div className="mb-6">
      <h2 className="font-semibold text-foreground mb-3">Guided meditations</h2>
      <div className="grid grid-cols-2 gap-3">
        {meditations.map((meditation, i) => (
          <motion.button
            key={meditation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => startMeditation(meditation)}
            className="group bg-white rounded-2xl shadow-soft p-4 hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-lavender/10 flex items-center justify-center">
                <meditation.icon className="h-5 w-5 text-lavender" />
              </div>
              <div className="h-8 w-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center opacity-100 transition-opacity">
                <Play className="h-3.5 w-3.5 ml-0.5" />
              </div>
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">{meditation.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{meditation.desc}</p>
            <p className="text-[10px] text-muted-foreground">{meditation.duration} min</p>
          </motion.button>
        ))}

        {/* Meditation Modal */}
        <AnimatePresence>
          {activeMeditation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-8"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-elevated max-w-sm w-full p-6 relative"
              >
                <button
                  onClick={() => { setActiveMeditation(null); setIsMedPlaying(false); setMedSeconds(null); }}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="text-center">
                  <div className="h-14 w-14 rounded-2xl bg-lavender/10 flex items-center justify-center mx-auto mb-4">
                    <activeMeditation.icon className="h-7 w-7 text-lavender" />
                  </div>
                  <h2 className="text-xl font-medium text-foreground mb-1">{activeMeditation.name}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{activeMeditation.desc}</p>

                  <div className="relative h-24 w-24 mx-auto mb-6 flex items-center justify-center">
                    <div className="text-foreground font-medium text-lg">
                      {isMedPlaying && medSeconds !== null ? `${Math.floor(medSeconds / 60)}:${String(medSeconds % 60).padStart(2, "0")}` : (isMedPlaying ? "..." : `${activeMeditation.duration}:00`)}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMedPlaying(!isMedPlaying)}
                    className="h-12 w-12 rounded-full bg-lavender flex items-center justify-center mx-auto shadow-soft transition-transform hover:scale-105"
                  >
                    {isMedPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-0.5" />}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Daily tip */}
    <div className="bg-lavender/10 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-lavender/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-lavender" />
        </div>
        <div>
          <h3 className="font-medium text-foreground text-sm mb-1">Daily mindfulness tip</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Take three deep breaths before checking your phone in the morning. This simple practice
            helps you start the day with intention rather than reaction.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);};
// Steps Tab
const StepsTab = () => {
  const dailyGoal = 8000;
  const weeklyGoal = 56000;

  const [dailySteps, setDailySteps] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("km_daily_steps");
      if (raw) return Number(raw);
    } catch (e) {}
    return 6847;
  });

  const [weeklySteps, setWeeklySteps] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("km_weekly_steps");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [4200, 7500, 6100, 8200, 5400, 7800, 6847];
  });

  const totalWeeklySteps = weeklySteps.reduce((a, b) => a + b, 0);

  const logSteps = (amount: number) => {
    setDailySteps((d) => {
      const nextDaily = d + amount;
      try { localStorage.setItem("km_daily_steps", String(nextDaily)); } catch (e) {}
      return nextDaily;
    });
    setWeeklySteps((w) => {
      const next = [...w];
      next[next.length - 1] = (next[next.length - 1] || 0) + amount;
      try { localStorage.setItem("km_weekly_steps", JSON.stringify(next)); } catch (e) {}
      return next;
    });
    toast({ title: "Great!", description: `Added ${amount.toLocaleString()} steps.` });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Daily Progress */}
      <div className="bg-white rounded-2xl shadow-soft p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Today</p>
            <p className="text-3xl font-bold text-foreground">{dailySteps.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">of {dailyGoal.toLocaleString()} steps</p>
          </div>
          <div className="h-20 w-20 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-pandan"
                initial={{ strokeDasharray: "0 226" }}
                animate={{ strokeDasharray: `${(dailySteps / dailyGoal) * 226} 226` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Footprints className="h-6 w-6 text-pandan" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-pandan" />
            <span>12% more than yesterday</span>
          </div>
        </div>

        {/* Quick logging controls */}
        <div className="flex items-center gap-2 mt-4">
          <button onClick={() => logSteps(500)} className="py-1.5 px-3 rounded-lg bg-pandan/10 text-pandan text-xs">Log +500</button>
          <button onClick={() => logSteps(1000)} className="py-1.5 px-3 rounded-lg bg-pandan/10 text-pandan text-xs">Log +1000</button>
          <button onClick={() => { localStorage.removeItem('km_daily_steps'); localStorage.removeItem('km_weekly_steps'); setDailySteps(0); setWeeklySteps([0,0,0,0,0,0,0]); toast({ title: 'Reset', description: 'Steps cleared.' }); }} className="py-1.5 px-3 rounded-lg bg-muted text-xs">Reset</button>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-2xl shadow-soft p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">This Week</h3>
          <span className="text-xs text-muted-foreground">
            {totalWeeklySteps.toLocaleString()} / {weeklyGoal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-24 mb-3">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
            const height = (weeklySteps[i] / dailyGoal) * 100;
            const isToday = i === 6;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(height, 100)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`w-full rounded-t-lg ${
                    isToday ? "bg-pandan" : weeklySteps[i] >= dailyGoal ? "bg-pandan/60" : "bg-muted"
                  }`}
                />
                <span className={`text-[10px] ${isToday ? "text-pandan font-medium" : "text-muted-foreground"}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalWeeklySteps / weeklyGoal) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {/* Community Contribution */}
      <div className="bg-pandan/10 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-pandan/20 flex items-center justify-center">
            <Award className="h-5 w-5 text-pandan" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Neighbourhood Goal</h3>
            <p className="text-xs text-muted-foreground">Punggol collective steps</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Community progress</span>
          <span className="font-medium text-pandan">2.4M / 5M steps</span>
        </div>
        <div className="h-2 rounded-full bg-white overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "48%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-pandan rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Journal Tab
interface JournalTabProps {
  entries: JournalEntry[];
  prompts: string[];
}

const JournalTab = ({ entries, prompts }: JournalTabProps) => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  // Persisted entries local to this tab
  const [localEntries, setLocalEntries] = useState<JournalEntry[]>(() => {
    try {
      const raw = localStorage.getItem("km_journal_entries");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
      }
    } catch (e) {
      // ignore
    }
    return entries;
  });

  const saveEntry = () => {
    if (!journalText.trim()) {
      toast({ title: "Write something", description: "Please add some text to your entry." });
      return;
    }
    if (!selectedMood) {
      toast({ title: "Select mood", description: "Please choose how you're feeling." });
      return;
    }

    const newEntry: JournalEntry = {
      id: `j${Date.now()}`,
      date: new Date(),
      mood: selectedMood,
      content: journalText.trim(),
      prompt: currentPrompt,
    };

    const next = [newEntry, ...localEntries];
    setLocalEntries(next);
    localStorage.setItem("km_journal_entries", JSON.stringify(next));
    setShowNewEntry(false);
    setSelectedMood(null);
    setJournalText("");
    toast({ title: "Saved", description: "Your journal entry is saved." });
  };

  const moodIcons = [
    { icon: Frown, label: "Bad", value: 1 },
    { icon: Meh, label: "Meh", value: 2 },
    { icon: Smile, label: "Okay", value: 3 },
    { icon: Smile, label: "Good", value: 4 },
    { icon: Smile, label: "Great", value: 5 },
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return "text-pandan";
    if (mood >= 3) return "text-amber-500";
    return "text-rose-400";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* AI Prompt */}
      <div className="bg-gradient-to-br from-primary/10 to-sakura/10 rounded-2xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Today's prompt</p>
            <p className="text-sm text-foreground font-medium">{currentPrompt}</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Start Writing
        </button>
      </div>

      {/* Mood Tracker Overview */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Mood This Week</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
            const mood = [3, 4, 4, 5, 3, 4, null][i];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    mood ? "bg-muted/50" : "bg-muted/20 border-2 border-dashed border-muted"
                  }`}
                >
                  {mood ? (
                    <Smile className={`h-4 w-4 ${getMoodColor(mood)}`} />
                  ) : (
                    <span className="text-xs text-muted-foreground">?</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Entries */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Recent Entries</h3>
        <div className="space-y-3">
          {localEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {entry.date.toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short" })}
                </span>
                <div className={`flex items-center gap-1 ${getMoodColor(entry.mood)}`}>
                  <Smile className="h-4 w-4" />
                  <span className="text-xs font-medium">{entry.mood}/5</span>
                </div>
              </div>
              {entry.prompt && (
                <p className="text-[10px] text-primary mb-1 italic">"{entry.prompt}"</p>
              )}
              <p className="text-sm text-foreground line-clamp-2">{entry.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="w-12 h-1 rounded-full bg-muted mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-4">New Journal Entry</h2>

              {/* Mood Selection */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">How are you feeling?</p>
                <div className="flex items-center justify-between">
                  {moodIcons.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        selectedMood === mood.value ? "bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      <mood.icon
                        className={`h-6 w-6 ${
                          selectedMood === mood.value ? getMoodColor(mood.value) : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-[10px] text-muted-foreground">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-primary/5 rounded-xl p-3 mb-4">
                <p className="text-xs text-primary font-medium">Prompt</p>
                <p className="text-sm text-foreground">{currentPrompt}</p>
              </div>

              {/* Text Input */}
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full h-32 p-4 rounded-xl bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <button
                onClick={saveEntry}
                disabled={!selectedMood || !journalText.trim()}
                className={`w-full mt-4 py-3 rounded-xl text-white font-medium ${!selectedMood || !journalText.trim() ? "bg-muted/40 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`}
              >
                Save Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Resources Tab
interface ResourcesTabProps {
  resources: typeof counsellingResources;
}

const ResourcesTab = ({ resources }: ResourcesTabProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {/* Crisis Helpline */}
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-rose-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground text-sm mb-1">Need immediate help?</h3>
          <p className="text-xs text-muted-foreground mb-3">
            If you're in crisis or need urgent support, help is available 24/7.
          </p>
          <a
            href="tel:1800-221-4444"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            Call SOS: 1800-221-4444
          </a>
        </div>
      </div>
    </div>

    {/* Resources Directory */}
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-3">Counselling Resources</h3>
      <div className="space-y-3">
        {resources.map((resource, i) => (
          <motion.a
            key={resource.name}
            href={`tel:${resource.phone}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow-soft hover:shadow-elevated transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm truncate">{resource.name}</h4>
              <p className="text-xs text-muted-foreground">{resource.available}</p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <span className="text-sm font-medium text-primary">{resource.phone}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>

    {/* Self-Help */}
    <div className="mt-5 bg-lavender/10 rounded-2xl p-4">
      <h3 className="font-medium text-foreground text-sm mb-2">Self-Help Resources</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Articles, videos, and guided exercises for managing stress, anxiety, and building resilience.
      </p>
      <button className="text-xs font-medium text-lavender hover:underline flex items-center gap-1">
        Explore resources <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  </motion.div>
);

export default WellnessPage;
