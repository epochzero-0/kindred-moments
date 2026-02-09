import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Heart, Moon, Sun, Play, Pause, X, Timer, Flame, Clock, Sparkles, Sunrise, Target, type LucideIcon } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  pattern: string;
  icon: LucideIcon;
  steps: string[];
}

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

interface Meditation {
  id: string;
  name: string;
  duration: number;
  icon: LucideIcon;
  desc: string;
}

const meditations: Meditation[] = [
  { id: "morning", name: "Morning Intention", duration: 5, icon: Sunrise, desc: "Start your day with clarity" },
  { id: "focus", name: "Focus Session", duration: 10, icon: Target, desc: "Sharpen your concentration" },
  { id: "gratitude", name: "Gratitude Practice", duration: 7, icon: Heart, desc: "Cultivate appreciation" },
  { id: "sleep", name: "Sleep Story", duration: 15, icon: Moon, desc: "Drift into peaceful rest" },
];

const WellnessPage = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setIsPlaying(true);
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen px-8 py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm mb-1">Wellness</p>
        <h1 className="text-3xl text-foreground">Take a moment for yourself</h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">7 day streak</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-lavender" />
          </div>
          <span className="text-muted-foreground">45 min this week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-pandan" />
          </div>
          <span className="text-muted-foreground">12 sessions</span>
        </div>
      </motion.div>

      {/* Breathing Exercises */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-foreground">Breathing exercises</h2>
          <span className="text-xs text-muted-foreground">Tap to start</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {exercises.map((exercise, i) => (
            <motion.button
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              onClick={() => startExercise(exercise)}
              className="bg-white rounded-2xl shadow-soft p-5 text-left card-hover"
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
      </motion.div>

      {/* Guided Meditations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-10"
      >
        <h2 className="font-serif text-xl text-foreground mb-4">Guided meditations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {meditations.map((meditation, i) => (
            <motion.div
              key={meditation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              className="group bg-white rounded-2xl shadow-soft p-5 card-hover cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <meditation.icon className="h-5 w-5 text-primary" />
                </div>
                <button className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">{meditation.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{meditation.desc}</p>
              <p className="text-[10px] text-muted-foreground">{meditation.duration} min</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-lavender/10 rounded-2xl p-5"
      >
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

                {/* Breathing animation */}
                <div className="relative h-36 w-36 mx-auto mb-6">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-primary/10"
                  />
                  <motion.div
                    animate={isPlaying ? { scale: [0.8, 1.1, 0.8] } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-primary/20"
                  />
                  <motion.div
                    animate={isPlaying ? { scale: [0.6, 0.9, 0.6] } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-8 rounded-full bg-primary/40 flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium">
                      {isPlaying ? "Breathe" : "Ready"}
                    </span>
                  </motion.div>
                </div>

                {/* Steps */}
                <div className="text-left bg-muted/50 rounded-xl p-4 mb-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Pattern</p>
                  <ol className="space-y-1">
                    {activeExercise.steps.map((step, i) => (
                      <li key={i} className="text-xs text-foreground flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-medium">
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

export default WellnessPage;
