import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Heart, Moon, Sun, Play, Pause, X, Timer, Sparkles } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  pattern: string;
  icon: typeof Wind;
  gradient: string;
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
    gradient: "from-cyan-500 to-blue-500",
    steps: ["Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 4 seconds", "Hold for 4 seconds"],
  },
  {
    id: "478",
    name: "4-7-8 Relaxation",
    duration: 5,
    description: "Perfect for falling asleep",
    pattern: "4-7-8",
    icon: Moon,
    gradient: "from-violet-500 to-purple-500",
    steps: ["Breathe in for 4 seconds", "Hold for 7 seconds", "Breathe out for 8 seconds"],
  },
  {
    id: "energize",
    name: "Energizing Breath",
    duration: 3,
    description: "Wake up and feel alert",
    pattern: "Quick cycles",
    icon: Sun,
    gradient: "from-amber-500 to-orange-500",
    steps: ["Quick inhale", "Quick exhale", "Repeat 10 times", "Rest and repeat"],
  },
  {
    id: "calm",
    name: "Deep Calm",
    duration: 6,
    description: "For moments of stress or anxiety",
    pattern: "6-2-8",
    icon: Heart,
    gradient: "from-rose-500 to-pink-500",
    steps: ["Breathe in slowly for 6 seconds", "Hold gently for 2 seconds", "Exhale slowly for 8 seconds"],
  },
];

const meditations = [
  { id: "morning", name: "Morning Intention", duration: 5, emoji: "🌅", desc: "Start your day with clarity" },
  { id: "focus", name: "Focus Session", duration: 10, emoji: "🎯", desc: "Sharpen your concentration" },
  { id: "gratitude", name: "Gratitude Practice", duration: 7, emoji: "🙏", desc: "Cultivate appreciation" },
  { id: "sleep", name: "Sleep Story", duration: 15, emoji: "🌙", desc: "Drift into peaceful rest" },
  { id: "stress", name: "Stress Relief", duration: 8, emoji: "🧘", desc: "Release tension and worry" },
  { id: "walk", name: "Walking Meditation", duration: 10, emoji: "🚶", desc: "Mindful movement practice" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const WellnessPage = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setIsPlaying(true);
    setBreathPhase(0);
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
    setBreathPhase(0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />

        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-violet-600">Wellness</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Take a moment for yourself
            </h1>
            <p className="text-muted-foreground">Breathing exercises and guided meditations</p>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Quick stats */}
        <motion.div {...fade(0.1)} className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">7</p>
            <p className="text-sm text-muted-foreground">Day streak</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">45</p>
            <p className="text-sm text-muted-foreground">Minutes this week</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Sessions completed</p>
          </div>
        </motion.div>

        {/* Breathing Exercises */}
        <motion.div {...fade(0.15)} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Breathing exercises</h2>
            <span className="text-sm text-muted-foreground">Tap to start</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exercises.map((exercise, i) => (
              <motion.button
                key={exercise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                onClick={() => startExercise(exercise)}
                className="bg-white rounded-2xl shadow-elevated p-6 text-left transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-1"
              >
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${exercise.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <exercise.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{exercise.duration} min</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-foreground">{exercise.pattern}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Guided Meditations */}
        <motion.div {...fade(0.25)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Guided meditations</h2>
            <button className="text-sm text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditations.map((meditation, i) => (
              <motion.div
                key={meditation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                className="group bg-white rounded-2xl shadow-elevated p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-elevated-lg cursor-pointer"
              >
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-3xl shrink-0">
                  {meditation.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{meditation.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{meditation.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{meditation.duration} min</p>
                </div>
                <button className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-4 w-4 ml-0.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily mindfulness tip */}
        <motion.div {...fade(0.4)} className="mt-8">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                💡
              </div>
              <div>
                <h3 className="font-bold mb-2">Daily mindfulness tip</h3>
                <p className="text-sm opacity-90">
                  Take three deep breaths before checking your phone in the morning. This simple practice
                  helps you start the day with intention rather than reaction.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={closeExercise}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="text-center">
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${activeExercise.gradient} flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <activeExercise.icon className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">{activeExercise.name}</h2>
                <p className="text-muted-foreground mb-8">{activeExercise.description}</p>

                {/* Breathing animation circle */}
                <div className="relative h-48 w-48 mx-auto mb-8">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.3, 1.3, 1] } : {}}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeExercise.gradient} opacity-30`}
                  />
                  <motion.div
                    animate={isPlaying ? { scale: [0.8, 1.1, 1.1, 0.8] } : {}}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-4 rounded-full bg-gradient-to-br ${activeExercise.gradient} opacity-50`}
                  />
                  <motion.div
                    animate={isPlaying ? { scale: [0.6, 0.9, 0.9, 0.6] } : {}}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-8 rounded-full bg-gradient-to-br ${activeExercise.gradient} flex items-center justify-center`}
                  >
                    <span className="text-white text-lg font-semibold">
                      {isPlaying ? "Breathe" : "Ready"}
                    </span>
                  </motion.div>
                </div>

                {/* Steps */}
                <div className="text-left bg-muted/50 rounded-xl p-4 mb-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Pattern</p>
                  <ol className="space-y-1">
                    {activeExercise.steps.map((step, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
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
                  className={`h-14 w-14 rounded-full bg-gradient-to-br ${activeExercise.gradient} flex items-center justify-center mx-auto shadow-lg transition-transform hover:scale-105`}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white ml-1" />
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
