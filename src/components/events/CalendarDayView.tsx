import { motion } from "framer-motion";
import { Event, EventType } from "@/types";
import { EventCard } from "./EventCard";

interface CalendarDayViewProps {
  selectedDate: Date;
  events: Event[];
  onEventClick: (eventId: string) => void;
}

const eventTypeColors: Record<EventType, { bg: string; text: string; dot: string }> = {
  neighbourhood: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  clan: { bg: "bg-sakura/10", text: "text-sakura", dot: "bg-sakura" },
  competition: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  wellness: { bg: "bg-pandan/10", text: "text-pandan", dot: "bg-pandan" },
};

export const CalendarDayView = ({ selectedDate, events, onEventClick }: CalendarDayViewProps) => {
  // Filter events for the selected day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate hours from 6 AM to 11 PM
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const formatHour = (hour: number) => {
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const calculateTopPosition = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    // Each hour is 64px (h-16)
    const baseTop = (hour - 6) * 64;
    const minuteOffset = (minute / 60) * 64;
    return baseTop + minuteOffset;
  };

  const calculateHeight = (startDate: Date, endDate?: Date) => {
    if (!endDate) return 64; // Default 1 hour

    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // hours
    return Math.max(duration * 64, 32); // Minimum 32px height
  };

  const getDayLabel = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (selectedDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return selectedDate.toLocaleDateString("en-SG", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6"
    >
      {/* Day header */}
      <div className="mb-4 glass-calendar rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-foreground">{getDayLabel()}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"} scheduled
        </p>
      </div>

      {/* Timeline grid */}
      <div className="grid grid-cols-[80px_1fr] gap-4 mb-6">
        {/* Time ruler */}
        <div className="space-y-0">
          {hours.map(hour => (
            <div key={hour} className="h-16 flex items-start">
              <span className="text-xs font-medium text-muted-foreground">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        {/* Events timeline */}
        <div className="relative" style={{ minHeight: `${hours.length * 64}px` }}>
          {/* Hour grid lines */}
          {hours.map((hour, idx) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-muted/20"
              style={{ top: `${idx * 64}px` }}
            />
          ))}

          {/* Current time indicator */}
          {(() => {
            const now = new Date();
            const isToday = selectedDate.toDateString() === now.toDateString();
            if (isToday) {
              const currentHour = now.getHours();
              if (currentHour >= 6 && currentHour <= 23) {
                const currentTop = calculateTopPosition(now);
                return (
                  <>
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-primary z-20"
                      style={{ top: `${currentTop}px` }}
                    >
                      <div className="absolute left-0 -top-1.5 h-3 w-3 rounded-full bg-primary" />
                    </div>
                    <div
                      className="absolute left-0 text-xs font-medium text-primary"
                      style={{ top: `${currentTop - 8}px`, left: "-60px" }}
                    >
                      Now
                    </div>
                  </>
                );
              }
            }
            return null;
          })()}

          {/* Events */}
          {dayEvents.length > 0 ? (
            dayEvents.map((event, idx) => {
              const top = calculateTopPosition(event.date);
              const height = calculateHeight(event.date, event.endDate);
              const colors = eventTypeColors[event.type];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onEventClick(event.id)}
                  className="absolute left-0 right-0 cursor-pointer group"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    paddingRight: "8px",
                  }}
                >
                  <div className={`h-full glass-event-card rounded-xl p-3 border-l-4 ${colors.dot.replace("bg-", "border-")} hover:shadow-elevated transition-all overflow-hidden`}>
                    <div className="flex items-start gap-2 h-full">
                      <div className={`h-2 w-2 rounded-full ${colors.dot} flex-shrink-0 mt-1`} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.date.toLocaleTimeString("en-SG", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {event.endDate && ` - ${event.endDate.toLocaleTimeString("en-SG", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}`}
                        </p>
                        {height > 64 && (
                          <>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              📍 {event.location}
                            </p>
                            {event.attendees && (
                              <p className="text-xs text-pandan mt-1">
                                👥 {event.attendees}{event.capacity && `/${event.capacity}`}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-calendar rounded-2xl p-8 text-center max-w-sm">
                <div className="text-4xl mb-3">📅</div>
                <h4 className="font-semibold text-foreground mb-2">No events scheduled</h4>
                <p className="text-sm text-muted-foreground">
                  You have a free day on {selectedDate.toLocaleDateString("en-SG", { month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event list below timeline for easy access */}
      {dayEvents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 px-2">All Events</h4>
          <div className="space-y-3">
            {dayEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <EventCard
                  event={event}
                  onClick={() => onEventClick(event.id)}
                  compact={false}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
