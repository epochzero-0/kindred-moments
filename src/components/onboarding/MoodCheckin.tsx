import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Users, Clock, Heart, Eye } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MoodCheckinProps {
  userName: string;
  onComplete: (mood: string | null) => void;
  onBack: () => void;
  onSkip: () => void;
}

interface MoodOption {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const moods: MoodOption[] = [
  { 
    id: "curious", 
    icon: Sparkles, 
    label: "Curious to explore",
    description: "See what's happening nearby",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  { 
    id: "social", 
    icon: Users, 
    label: "Ready to connect",
    description: "Meet neighbours & make friends",
    gradient: "from-pandan/20 to-pandan/5",
    iconColor: "text-pandan"
  },
  { 
    id: "cautious", 
    icon: Clock, 
    label: "Taking it slow",
    description: "Ease in at my own pace",
    gradient: "from-honey/20 to-honey/5",
    iconColor: "text-honey"
  },
  { 
    id: "lonely", 
    icon: Heart, 
    label: "Seeking community",
    description: "Find my people",
    gradient: "from-sakura/20 to-sakura/5",
    iconColor: "text-sakura"
  },
  { 
    id: "browsing", 
    icon: Eye, 
    label: "Just browsing",
    description: "Checking things out",
    gradient: "from-lavender/20 to-lavender/5",
    iconColor: "text-lavender"
  },
];

const MoodCheckin = ({ userName, onComplete, onBack, onSkip }: MoodCheckinProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleContinue = () => {
    onComplete(selectedMood);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, hsl(350 75% 60% / 0.4) 0%, transparent 70%)",
            filter: "blur(70px)",
            top: "-10%",
            left: "-20%",
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            x: ["0%", "5%", "0%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, hsl(155 55% 42% / 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
            bottom: "-15%",
            right: "-15%",
          }}
          animate={{ 
            scale: [1, 1.08, 1],
            y: ["0%", "-5%", "0%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 py-4 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">Step 2 of 3</span>
        <button
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Hey {userName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            What brings you to Kindred Heart?
          </p>
        </motion.div>

        {/* Mood Options */}
        <div className="space-y-3 flex-1">
          {moods.map((mood, index) => {
            const isSelected = selectedMood === mood.id;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedMood(isSelected ? null : mood.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-r ${mood.gradient} border-2 border-current/20 shadow-soft`
                    : "bg-white/50 backdrop-blur-sm border border-border/40 hover:bg-white/70"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected 
                    ? `bg-white/80 shadow-sm` 
                    : "bg-muted/30"
                }`}>
                  <mood.icon className={`w-6 h-6 ${isSelected ? mood.iconColor : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                    {mood.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mood.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-6 h-6 rounded-full ${mood.iconColor.replace('text-', 'bg-')} flex items-center justify-center`}
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-4 mb-2"
        >
          This helps us personalize your experience. It's not stored.
        </motion.p>

        {/* Bottom Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 pb-[env(safe-area-inset-bottom,24px)] mb-6"
        >
          <Button
            onClick={handleContinue}
            className="w-full h-14 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            {selectedMood ? "Continue" : "Skip for now"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodCheckin;
