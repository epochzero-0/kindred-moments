import { motion } from "framer-motion";
import { Clock, MapPin, Users } from "lucide-react";

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
    ? "from-sakura-light to-sakura/20"
    : "from-pandan-light to-pandan/20";

  const buttonClass = variant === "sakura"
    ? "bg-sakura text-primary-foreground hover:bg-sakura/90"
    : "bg-pandan text-secondary-foreground hover:bg-pandan/90";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-6 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:shadow-lg hover:shadow-foreground/5`}
      >
        <div className="absolute -right-4 -top-4 text-6xl opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
          {emoji}
        </div>

        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {name}
          </h3>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {distance}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {peopleGoing} going
            </span>
          </div>

          <button
            className={`${buttonClass} mt-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.97]`}
          >
            join for a bit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
