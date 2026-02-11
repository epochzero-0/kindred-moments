import { motion } from "framer-motion";
import { Clock, MapPin, Users, Repeat, Trophy, DollarSign, Languages as LanguagesIcon } from "lucide-react";
import { Event, EventType } from "@/types";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}

const eventTypeColors: Record<EventType, { bg: string; text: string; dot: string; glass: string }> = {
  neighbourhood: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    glass: "glass-neighbourhood"
  },
  clan: {
    bg: "bg-sakura/10",
    text: "text-sakura",
    dot: "bg-sakura",
    glass: "glass-clan"
  },
  competition: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
    glass: "glass-competition"
  },
  wellness: {
    bg: "bg-pandan/10",
    text: "text-pandan",
    dot: "bg-pandan",
    glass: "glass-wellness"
  },
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short" });
};

export const EventCard = ({ event, onClick, compact = false, className = "" }: EventCardProps) => {
  const colors = eventTypeColors[event.type];

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={onClick}
        className={`glass-event-card rounded-xl p-3 cursor-pointer relative overflow-hidden group ${className}`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                <h4 className="font-medium text-sm text-foreground truncate">{event.title}</h4>
              </div>
            </div>
            {event.recurring && <Repeat className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(event.date)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      onClick={onClick}
      className={`glass-event-card rounded-2xl p-5 cursor-pointer relative overflow-hidden group shadow-soft hover:shadow-elevated transition-all ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          {/* Date block */}
          <div className={`h-14 w-14 rounded-xl ${colors.bg} flex flex-col items-center justify-center flex-shrink-0`}>
            <span className={`text-xl font-bold ${colors.text}`}>
              {event.date.getDate()}
            </span>
            <span className={`text-[10px] ${colors.text} uppercase`}>
              {event.date.toLocaleDateString("en-SG", { month: "short" })}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-base text-foreground truncate">{event.title}</h4>
              {event.recurring && <Repeat className="h-4 w-4 text-muted-foreground" />}
              {event.type === "competition" && <Trophy className="h-4 w-4 text-amber-500" />}
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${colors.bg} ${colors.text}`}>
              {event.type}
            </span>
          </div>
        </div>

        {/* Event details */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(event.date)}{event.endDate && ` - ${formatTime(event.endDate)}`}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-pandan">
              <Users className="h-4 w-4" />
              <span>{event.attendees}{event.capacity && `/${event.capacity}`}</span>
            </div>

            {event.expenses && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <DollarSign className="h-4 w-4" />
                <span>${event.expenses.perPerson.toFixed(2)}/pax</span>
              </div>
            )}

            {event.languages && event.languages.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LanguagesIcon className="h-4 w-4" />
                <span className="text-xs">{event.languages.map(l => l.toUpperCase()).join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* RSVP indicator */}
        {event.isUserAttending && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <span className="text-xs font-medium text-primary">✓ You're attending</span>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white/50 rounded-full text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
