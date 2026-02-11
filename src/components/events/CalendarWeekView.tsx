import { motion } from "framer-motion";
import { Event } from "@/types";
import { EventCard } from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarWeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (eventId: string) => void;
  onNavigateWeek: (direction: number) => void;
}

export const CalendarWeekView = ({ currentDate, events, onEventClick, onNavigateWeek }: CalendarWeekViewProps) => {
  // Get the week starting from Sunday
  const getWeekDays = (date: Date) => {
    const week = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day; // Adjust to Sunday

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(current);
      weekDay.setDate(diff + i);
      week.push(weekDay);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);
  const today = new Date();

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString("en-SG", { weekday: "short" });
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getWeekLabel = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.toLocaleDateString("en-SG", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-SG", { month: "short", day: "numeric" })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6"
    >
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigateWeek(-1)}
          className="h-10 w-10 rounded-xl glass-calendar hover:bg-white/40 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-foreground">
          {getWeekLabel()}
        </h3>
        <button
          onClick={() => onNavigateWeek(1)}
          className="h-10 w-10 rounded-xl glass-calendar hover:bg-white/40 flex items-center justify-center transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Horizontal scrolling day cards */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
        {weekDays.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isTodayCard = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: dayIdx * 0.05 }}
              className="min-w-[280px] snap-center flex-shrink-0"
            >
              <div
                className={`glass-calendar rounded-2xl p-4 h-[450px] flex flex-col transition-all ${isTodayCard
                    ? "ring-2 ring-primary ring-opacity-50"
                    : ""
                  }`}
              >
                {/* Day header */}
                <div className="mb-3 pb-3 border-b border-white/20">
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${isTodayCard ? "text-primary" : "text-foreground"
                      }`}>
                      {day.getDate()}
                    </p>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isTodayCard ? "text-primary" : "text-foreground"
                        }`}>
                        {formatWeekday(day)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {day.toLocaleDateString("en-SG", { month: "short" })}
                      </p>
                    </div>
                    {isTodayCard && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                  </div>
                </div>

                {/* Events for this day */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayIdx * 0.05 + idx * 0.03 }}
                      >
                        <EventCard
                          event={event}
                          onClick={() => onEventClick(event.id)}
                          compact={true}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-xs text-muted-foreground">No events</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${isToday(day)
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted"
              }`}
          />
        ))}
      </div>

      {/* Week summary */}
      <div className="mt-6 glass-calendar rounded-2xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Week Overview</h4>
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-muted-foreground">Total Events</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {weekDays.reduce((acc, day) => acc + getEventsForDay(day).length, 0)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Busiest Day</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {(() => {
                const counts = weekDays.map(day => getEventsForDay(day).length);
                const maxCount = Math.max(...counts);
                const busiestIdx = counts.indexOf(maxCount);
                return maxCount > 0 ? formatWeekday(weekDays[busiestIdx]) : "-";
              })()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Free Days</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {weekDays.filter(day => getEventsForDay(day).length === 0).length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
