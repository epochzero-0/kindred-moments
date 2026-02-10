import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Search, Check, Users,
  // Interest icons
  Footprints, Gamepad2, UtensilsCrossed, Flower2, Camera, BookOpen,
  Music, Palette, Dumbbell, Dog, Sparkles, Coffee, Bike, Mountain,
  Film, Mic2, Brush, Heart, Baby, TreePine
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface InterestSelectProps {
  onComplete: (interests: string[]) => void;
  onBack: () => void;
}

interface Interest {
  id: string;
  label: string;
  icon: LucideIcon;
  members: number;
  color: string;
  bgColor: string;
}

const interests: Interest[] = [
  { id: "running", label: "Running", icon: Footprints, members: 89, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  { id: "board-games", label: "Board Games", icon: Gamepad2, members: 156, color: "text-purple-600", bgColor: "bg-purple-100" },
  { id: "cooking", label: "Cooking", icon: UtensilsCrossed, members: 203, color: "text-orange-600", bgColor: "bg-orange-100" },
  { id: "gardening", label: "Gardening", icon: Flower2, members: 67, color: "text-green-600", bgColor: "bg-green-100" },
  { id: "photography", label: "Photography", icon: Camera, members: 124, color: "text-blue-600", bgColor: "bg-blue-100" },
  { id: "reading", label: "Reading", icon: BookOpen, members: 178, color: "text-amber-600", bgColor: "bg-amber-100" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, members: 234, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  { id: "music", label: "Music", icon: Music, members: 145, color: "text-pink-600", bgColor: "bg-pink-100" },
  { id: "art", label: "Art & Crafts", icon: Palette, members: 98, color: "text-rose-600", bgColor: "bg-rose-100" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, members: 187, color: "text-red-600", bgColor: "bg-red-100" },
  { id: "dog-walking", label: "Dog Walking", icon: Dog, members: 76, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { id: "meditation", label: "Meditation", icon: Sparkles, members: 54, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  { id: "coffee", label: "Coffee & Tea", icon: Coffee, members: 167, color: "text-amber-700", bgColor: "bg-amber-100" },
  { id: "cycling", label: "Cycling", icon: Bike, members: 92, color: "text-lime-600", bgColor: "bg-lime-100" },
  { id: "hiking", label: "Hiking", icon: Mountain, members: 78, color: "text-teal-600", bgColor: "bg-teal-100" },
  { id: "movies", label: "Movies", icon: Film, members: 198, color: "text-violet-600", bgColor: "bg-violet-100" },
  { id: "karaoke", label: "Karaoke", icon: Mic2, members: 112, color: "text-fuchsia-600", bgColor: "bg-fuchsia-100" },
  { id: "drawing", label: "Drawing", icon: Brush, members: 65, color: "text-sky-600", bgColor: "bg-sky-100" },
  { id: "volunteering", label: "Volunteering", icon: Heart, members: 87, color: "text-rose-500", bgColor: "bg-rose-100" },
  { id: "parenting", label: "Parenting", icon: Baby, members: 134, color: "text-pink-500", bgColor: "bg-pink-100" },
  { id: "nature", label: "Nature", icon: TreePine, members: 95, color: "text-emerald-500", bgColor: "bg-emerald-100" },
];

const InterestSelect = ({ onComplete, onBack }: InterestSelectProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInterests = useMemo(() => {
    if (!searchQuery.trim()) return interests;
    const query = searchQuery.toLowerCase();
    return interests.filter(interest => 
      interest.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onComplete(selected);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, hsl(280 60% 60% / 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "-15%",
            right: "-20%",
          }}
        />
        <div 
          className="absolute w-[450px] h-[450px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(40 90% 55% / 0.4) 0%, transparent 70%)",
            filter: "blur(70px)",
            bottom: "-10%",
            left: "-15%",
          }}
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
        <span className="text-sm text-muted-foreground">Almost done!</span>
        <div className="w-9" />
      </motion.div>

      {/* Title & Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-5 mb-4"
      >
        <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
          What are you into?
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-4">
          Select interests to find your people. Pick 3 or more!
        </p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white/60 backdrop-blur-sm border-border/40 focus:bg-white/80"
          />
        </div>
      </motion.div>

      {/* Interest Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-48">
        <div className="grid grid-cols-3 gap-2.5">
          <AnimatePresence mode="popLayout">
            {filteredInterests.map((interest, index) => {
              const isSelected = selected.includes(interest.id);
              
              return (
                <motion.button
                  key={interest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? `${interest.bgColor} border-2 border-current/20 shadow-soft`
                      : "bg-white/60 backdrop-blur-sm border border-border/40 hover:bg-white/80"
                  }`}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-background" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? "bg-white/70" : "bg-muted/30"
                  }`}>
                    <interest.icon className={`w-5 h-5 ${isSelected ? interest.color : "text-muted-foreground"}`} />
                  </div>

                  {/* Label */}
                  <span className={`text-xs font-medium text-center line-clamp-1 ${
                    isSelected ? "text-foreground" : "text-foreground/70"
                  }`}>
                    {interest.label}
                  </span>

                  {/* Member Count */}
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-1">
                    <Users className="w-2.5 h-2.5" />
                    {interest.members}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredInterests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p>No interests found for "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-5 pt-4 bg-background border-t border-border/30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
      >
        {/* Selected Count */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Select at least 1 interest</span>
          ) : selected.length < 3 ? (
            <span className="text-sm text-muted-foreground">
              {selected.length} selected · pick {3 - selected.length} more for best matches
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-pandan">
              <Check className="w-4 h-4" />
              {selected.length} interests selected
            </span>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className="w-full h-14 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default InterestSelect;
