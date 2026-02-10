import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Users,
  Clock,
  MessageCircle,
  Trophy,
  X,
  DollarSign,
  Languages,
  Repeat,
  Filter,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-data";
import { useEvents } from "@/hooks/use-events";
import { useLocation } from "react-router-dom";
import { Event, EventType } from "@/types";

// Mock data moved to use-events hook

const eventTypeColors: Record<EventType, { bg: string; text: string; dot: string }> = {
  neighbourhood: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  clan: { bg: "bg-sakura/10", text: "text-sakura", dot: "bg-sakura" },
  competition: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  wellness: { bg: "bg-pandan/10", text: "text-pandan", dot: "bg-pandan" },
};

const EventsPage = () => {
  const currentUser = useCurrentUser();
  const { events, addEvent } = useEvents();
  const location = useLocation();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draftData, setDraftData] = useState<Record<string, unknown> | null>(null);
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  // Open create modal if navigated with openCreate state
  useEffect(() => {
    const state = location.state as { openCreate?: boolean; draftData?: Record<string, unknown> };
    if (state?.openCreate) {
      if (state.draftData) {
        setDraftData(state.draftData);
      }
      setShowCreateModal(true);
      // Clear the state so it doesn't reopen on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredEvents = filterType === "all"
    ? events
    : events.filter(e => e.type === filterType);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="min-h-screen pb-24">
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
          <button
            onClick={() => { setDraftData(null); setShowCreateModal(true); }}
            className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-soft hover:shadow-elevated transition-shadow"
          >
            <Plus className="h-5 w-5" />
          </button>
        </motion.div>
      </div>

      {/* View Toggle & Filters */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${view === v ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventType | "all")}
              className="text-xs bg-transparent text-muted-foreground focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="neighbourhood">Neighbourhood</option>
              <option value="clan">Interest Group</option>
              <option value="competition">Competitions</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 mb-4">
        <div className="flex flex-wrap gap-3">
          {Object.entries(eventTypeColors).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
              <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {currentDate.toLocaleDateString("en-SG", { month: "long", year: "numeric" })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === "month" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6"
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px]" />
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={`min-h-[80px] rounded-xl p-1.5 flex flex-col transition-all border-2 ${isToday
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/30"
                    }`}
                >
                  <span className={`text-xs font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                      {dayEvents.slice(0, 2).map((event) => {
                        const colors = eventTypeColors[event.type];
                        return (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`${colors.bg} ${colors.text} text-[9px] font-medium px-1.5 py-0.5 rounded truncate text-left hover:opacity-80 transition-opacity`}
                          >
                            {event.title.length > 12 ? event.title.slice(0, 10) + "…" : event.title}
                          </button>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <button
                          onClick={() => setSelectedEvent(dayEvents[2])}
                          className="text-[9px] text-primary font-medium pl-1 text-left hover:underline"
                        >
                          +{dayEvents.length - 2} more
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Upcoming Events List */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Upcoming</h3>
        <div className="space-y-3">
          {filteredEvents
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)
            .map((event, i) => {
              const colors = eventTypeColors[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Date block */}
                    <div className={`h-12 w-12 rounded-xl ${colors.bg} flex flex-col items-center justify-center`}>
                      <span className={`text-lg font-bold ${colors.text}`}>
                        {event.date.getDate()}
                      </span>
                      <span className={`text-[10px] ${colors.text} uppercase`}>
                        {event.date.toLocaleDateString("en-SG", { month: "short" })}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                        {event.recurring && <Repeat className="h-3 w-3 text-muted-foreground" />}
                        {event.type === "competition" && <Trophy className="h-3 w-3 text-amber-500" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-pandan">
                          <Users className="h-3 w-3" />
                          {event.attendees}{event.capacity && `/${event.capacity}`}
                        </span>
                        {event.hasChat && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            Chat
                          </span>
                        )}
                        {event.expenses && (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <DollarSign className="h-3 w-3" />
                            ${event.expenses.perPerson.toFixed(2)}/pax
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEventModal
            onClose={() => { setShowCreateModal(false); setDraftData(null); }}
            initialData={draftData}
            onSave={(data) => addEvent(data)}
          />
        )}
      </AnimatePresence>



      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm pb-20"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[75vh] overflow-y-auto mx-4 shadow-2xl"
            >
              <div className="p-6">
                <div className="w-12 h-1 rounded-full bg-muted mx-auto mb-4" />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${eventTypeColors[selectedEvent.type].bg} ${eventTypeColors[selectedEvent.type].text}`}>{selectedEvent.type}</span>
                      {selectedEvent.recurring && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Repeat className="h-3 w-3" /> Recurring</span>}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">{selectedEvent.title}</h2>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedEvent.date.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{formatTime(selectedEvent.date)}{selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}</span></div>
                  <div className="flex items-center gap-3 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedEvent.location}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedEvent.attendees} attending{selectedEvent.capacity && ` (${selectedEvent.capacity - selectedEvent.attendees} spots left)`}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Languages className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedEvent.languages.map(l => l.toUpperCase()).join(", ")}</span></div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">RSVP</button>
                  <button className="px-4 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/70 transition-colors"><MessageCircle className="h-5 w-5" /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Updated Create Event Modal
const CreateEventModal = ({ onClose, initialData, onSave }: { onClose: () => void, initialData?: Record<string, unknown>, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    type: "neighbourhood" as EventType,
    languages: ["en"],
    recurring: false,
    openToAll: true,
  });

  // Pre-fill form if initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: (initialData.title as string) || prev.title,
        date: (initialData.date as string) || prev.date,
        time: (initialData.time as string) || prev.time,
        location: (initialData.location as string) || prev.location,
        capacity: (initialData.capacity as string) || prev.capacity,
        type: (initialData.type as EventType) || prev.type,
        languages: initialData.languages ? (initialData.languages as string).split(',').map((l: string) => l.trim()) : prev.languages,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...formData,
      attendees: 1, // Auto-join creator
      date: new Date(formData.date + 'T' + formData.time), // Basic date construction
      hasChat: true
    });
    alert(`Event "${formData.title}" created successfully!`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {initialData ? "Edit Draft Event" : "Create Event"}
            </h2>
            <button type="button" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Morning Joggers Meetup"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Punggol Park"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Capacity (optional)</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Max attendees"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["neighbourhood", "clan", "wellness"] as EventType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${formData.type === type
                      ? `${eventTypeColors[type].bg} ${eventTypeColors[type].text}`
                      : "bg-muted/50 text-muted-foreground"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Host Languages</label>
              <div className="flex flex-wrap gap-2">
                {["en", "zh", "ms", "ta"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      const newLangs = formData.languages.includes(lang)
                        ? formData.languages.filter((l) => l !== lang)
                        : [...formData.languages, lang];
                      setFormData({ ...formData, languages: newLangs });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all ${formData.languages.includes(lang)
                      ? "bg-primary text-white"
                      : "bg-muted/50 text-muted-foreground"
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Recurring event</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, recurring: !formData.recurring })}
                  className={`h-6 w-11 rounded-full transition-colors ${formData.recurring ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <motion.div
                    animate={{ x: formData.recurring ? 20 : 2 }}
                    className="h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Open to all neighbourhoods</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, openToAll: !formData.openToAll })}
                  className={`h-6 w-11 rounded-full transition-colors ${formData.openToAll ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <motion.div
                    animate={{ x: formData.openToAll ? 20 : 2 }}
                    className="h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            {initialData ? "Publish Draft" : "Create Event"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventsPage;
