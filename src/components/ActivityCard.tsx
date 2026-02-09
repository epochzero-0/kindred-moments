import { motion } from "framer-motion";
import { Clock, MapPin, Users, LucideIcon } from "lucide-react";

interface ActivityCardProps {
  name: string;
  duration: string;
  distance: string;
  peopleGoing: number;
  variant: "sakura" | "pandan";
  icon: LucideIcon;
  delay?: number;
}

const ActivityCard = ({ name, duration, distance, peopleGoing, variant, icon: Icon, delay = 0 }: ActivityCardProps) => {
  const accentColor = variant === "sakura" ? "text-sakura" : "text-pandan";
  const accentBg = variant === "sakura" ? "bg-sakura/10" : "bg-pandan/10";
  const dotColor = variant === "sakura" ? "bg-sakura" : "bg-pandan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="group relative bg-white rounded-2xl shadow-soft overflow-hidden card-hover cursor-pointer">
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`h-9 w-9 rounded-xl ${accentBg} flex items-center justify-center`}>
              <Icon className={`h-4.5 w-4.5 ${accentColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${accentBg}`}>
              <Users className="h-3 w-3" />
              <span className={`text-xs font-semibold ${accentColor}`}>{peopleGoing}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {distance}
            </span>
          </div>

          {/* Accent dot */}
          <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${dotColor} opacity-60`} />
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
