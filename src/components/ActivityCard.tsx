import { motion } from "framer-motion";
import { Clock, MapPin, Users, ArrowRight } from "lucide-react";

interface ActivityCardProps {
  name: string;
  duration: string;
  distance: string;
  peopleGoing: number;
  variant: "sakura" | "pandan";
  emoji: string;
  delay?: number;
}

const ActivityCard = ({ name, duration, distance, peopleGoing, variant, emoji, delay = 0 }: ActivityCardProps) => {
  const gradientClass = variant === "sakura" 
    ? "from-rose-500 via-pink-500 to-purple-500" 
    : "from-emerald-500 via-teal-500 to-cyan-500";
  
  const lightBg = variant === "sakura" ? "bg-sakura-light" : "bg-pandan-light";
  const accentColor = variant === "sakura" ? "text-sakura" : "text-pandan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <div className="relative bg-white rounded-2xl shadow-elevated overflow-hidden transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-1">
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`} />
        
        <div className="p-6">
          {/* Header with emoji */}
          <div className="flex items-start justify-between mb-4">
            <div className={`h-14 w-14 rounded-2xl ${lightBg} flex items-center justify-center text-2xl`}>
              {emoji}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className={`text-sm font-semibold ${accentColor}`}>{peopleGoing}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {distance}
            </span>
          </div>

          {/* CTA Button */}
          <button className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${gradientClass} text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/10`}>
            Join activity
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
