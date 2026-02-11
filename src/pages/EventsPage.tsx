import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-data";
import { useEvents } from "@/hooks/use-events";
import { useEventAI } from "@/hooks/use-event-ai";
import { useLocation } from "react-router-dom";
import { Event, EventType } from "@/types";
import { CalendarDayView, CalendarWeekView, EventCard } from "@/components/events";


const eventTypeColors: Record<EventType, { bg: string; text: string; dot: string }> = {
  neighbourhood: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  clan: { bg: "bg-sakura/10", text: "text-sakura", dot: "bg-sakura" },
  competition: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  wellness: { bg: "bg-pandan/10", text: "text-pandan", dot: "bg-pandan" },
};

const EventsPageNew = () => {
  const currentUser = useCurrentUser();
  const { events, filteredEvents, filters, setFilters, rsvpEvent, addEvent } = useEvents();
  const { getSuggestedEvents, isConfigured: aiConfigured } = useEventAI();

  const location = useLocation();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Open create modal if navigated with openCreate state
  useEffect(() => {
    const state = location.state as { openCreate?: boolean };
    if (state?.openCreate) {
      setShowCreateModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Load AI suggestions
  useEffect(() => {
    if (aiConfigured && currentUser) {
      const loadSuggestions = async () => {
        const suggestions = await getSuggestedEvents(currentUser, events);
        setAiSuggestions(suggestions.slice(0, 3));
      };
      loadSuggestions();
    }
  }, [aiConfigured, currentUser, events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const getEventsForDay = (day: number) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pearl via-white to-sakura-light/20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-muted-foreground text-sm mb-1">Events</p>
            <h1 className="text-2xl font-semibold text-foreground">Your Calendar</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 w-10 rounded-xl glass-calendar flex items-center justify-center shadow-soft hover:shadow-elevated transition-all ${showFilters ? "ring-2 ring-primary/30" : ""
                }`}
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-soft hover:shadow-elevated transition-shadow"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>



      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mb-4 overflow-hidden"
          >
            <div className="glass-calendar rounded-2xl p-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-event-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Type filters */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilters({ ...filters, type: "all" })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.type === "all"
                    ? "bg-primary text-white"
                    : "glass-event-card text-muted-foreground"
                    }`}
                >
                  All Events
                </button>
                {Object.entries(eventTypeColors).map(([type, colors]) => (
                  <button
                    key={type}
                    onClick={() => setFilters({ ...filters, type: type as EventType })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filters.type === type
                      ? `${colors.bg} ${colors.text}`
                      : "glass-event-card text-muted-foreground"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Attending toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.attendingOnly}
                  onChange={(e) => setFilters({ ...filters, attendingOnly: e.target.checked })}
                  className="rounded text-primary"
                />
                <span className="text-sm text-foreground">Show only my events</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Toggle */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 glass-calendar rounded-lg">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-md text-xs font-medium capitalize transition-all ${view === v
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>

          {view === "month" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="h-8 w-8 rounded-lg glass-calendar hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-sm font-semibold min-w-[140px] text-center">
                {currentDate.toLocaleDateString("en-SG", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="h-8 w-8 rounded-lg glass-calendar hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Views */}
      <AnimatePresence mode="wait">
        {view === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Month View with 3D Layer */}
            <div className="relative">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
                {/* Empty cells */}
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[120px]" />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === today.getDate() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getFullYear() === today.getFullYear();

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                      className={`min-h-[120px] rounded-xl p-2 flex flex-col transition-all glass-calendar group relative overflow-hidden border border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${isToday ? "ring-2 ring-primary ring-opacity-50" : "hover:bg-white/40"
                        }`}
                      onClick={() => {
                        // Optional: clicking empty space could open create modal for that day
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full ${isToday ? "bg-primary text-white" : "text-foreground group-hover:bg-white/50"
                          }`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide flex-1">
                        {dayEvents.slice(0, 4).map((event) => {
                          const colors = eventTypeColors[event.type];
                          return (
                            <button
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventId(event.id);
                              }}
                              className={`w-full text-left px-2 py-1 rounded-md text-[10px] font-medium transition-all truncate border-l-2 ${colors.bg} ${colors.text} ${colors.dot.replace("bg-", "border-")} hover:brightness-95`}
                            >
                              {event.title}
                            </button>
                          );
                        })}
                        {dayEvents.length > 4 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setView("day");
                              setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                            }}
                            className="text-[10px] text-muted-foreground font-medium pl-1 hover:text-primary text-left"
                          >
                            +{dayEvents.length - 4} more...
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {view === "week" && (
          <CalendarWeekView
            key="week"
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={setSelectedEventId}
            onNavigateWeek={navigateWeek}
          />
        )}

        {view === "day" && (
          <CalendarDayView
            key="day"
            selectedDate={selectedDate}
            events={filteredEvents}
            onEventClick={setSelectedEventId}
          />
        )}
      </AnimatePresence>

      {/* Upcoming Events */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Upcoming Events</h3>
        <div className="space-y-3">
          {filteredEvents
            .filter(e => new Date(e.date) > new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)
            .map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard event={event} onClick={() => setSelectedEventId(event.id)} />
              </motion.div>
            ))}
        </div>
      </div>

      {/* AI Suggestions (Bottom) */}
      {aiSuggestions.length > 0 && (
        <div className="px-6 mt-8 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Events you might like</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x">
            {aiSuggestions.map((suggestion, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="min-w-[260px] max-w-[260px] snap-center"
              >
                <div
                  className="glass-calendar rounded-2xl p-3 h-full flex flex-col cursor-pointer border border-white/20 shadow-sm hover:shadow-elevated transition-all"
                  onClick={() => {
                    const event = events.find(e => e.id === suggestion.eventId);
                    if (event) setSelectedEventId(event.id);
                  }}
                >
                  <p className="font-medium text-xs text-foreground line-clamp-1 mb-1">{suggestion.eventTitle}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
                    {suggestion.reason}
                  </p>
                  <div className="mt-auto pt-2 border-t border-black/5 flex justify-between items-center">
                    <span className="text-[9px] font-semibold text-primary">Recommended</span>
                    <span className="text-[9px] text-muted-foreground">Tap to view & RSVP →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-xl font-semibold text-foreground">Host an Event</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-black/5 rounded-full">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Gather the community!</p>
              </div>

              <div className="p-6 space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Basic form handling would go here. For now we just close it and simulate add.
                    // In a real implementation we'd capture form values.
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);

                    addEvent({
                      title: formData.get("title") as string,
                      date: new Date(`${formData.get("date")}T${formData.get("time")}`),
                      location: formData.get("location") as string,
                      type: formData.get("type") as EventType,
                      description: formData.get("description") as string,
                      attendees: 1,
                      languages: ["en"],
                      recurring: false,
                      hasChat: true,
                      tags: [],
                    });
                    setShowCreateModal(false);
                  }}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Event Title</label>
                      <input name="title" required className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm font-medium" placeholder="e.g. Weekend Badminton" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
                        <input name="date" type="date" required className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Time</label>
                        <input name="time" type="time" required className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Location</label>
                      <input name="location" required className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm" placeholder="e.g. Community Centre" />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Type</label>
                      <select name="type" className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm">
                        <option value="neighbourhood">Neighbourhood</option>
                        <option value="wellness">Wellness</option>
                        <option value="competition">Competition</option>
                        <option value="clan">Clan Activity</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
                      <textarea name="description" rows={3} className="w-full p-2.5 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/20 outline-none transition-all text-sm resize-none" placeholder="What's the plan?" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 mt-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Create Event
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm pb-20"
            onClick={() => setSelectedEventId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-t-3xl w-full max-w-lg max-h-[75vh] overflow-y-auto mx-4 shadow-2xl"
            >
              <div className="p-6">
                <div className="w-12 h-1 rounded-full bg-muted mx-auto mb-4" />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${eventTypeColors[selectedEvent.type].bg} ${eventTypeColors[selectedEvent.type].text}`}>
                      {selectedEvent.type}
                    </span>
                    <h2 className="text-xl font-semibold text-foreground mt-2">{selectedEvent.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedEventId(null)}
                    className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-5 text-sm text-muted-foreground">
                  <p>📅 {selectedEvent.date.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}</p>
                  <p>🕐 {selectedEvent.date.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                  <p>📍 {selectedEvent.location}</p>
                  <p>👥 {selectedEvent.attendees} attending{selectedEvent.capacity && ` (${selectedEvent.capacity - selectedEvent.attendees} spots left)`}</p>
                </div>

                <button
                  onClick={() => {
                    if (selectedEvent) {
                      rsvpEvent(selectedEvent.id, !selectedEvent.isUserAttending);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${selectedEvent.isUserAttending
                    ? "glass-calendar text-foreground"
                    : "bg-primary text-white hover:bg-primary/90"
                    }`}
                >
                  {selectedEvent.isUserAttending ? "Going ✓" : "RSVP"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPageNew;
