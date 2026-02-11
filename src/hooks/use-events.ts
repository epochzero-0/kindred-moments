import { useState, useEffect, useMemo } from "react";
import { Event, EventType, EventReminder, RecurringPattern } from "@/types";

// Helper to create dates relative to today
const getDateFromToday = (daysOffset: number, hours: number = 9, minutes: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Generate realistic mock events
const generateMockEvents = (): Event[] => {
    const events: Event[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Helper to get random item
    const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const locations = [
        "Punggol Park Deck", "Sengkang Sports Hall", "Bedok Reservoir Bistro",
        "Community Centre L2", "Town Square", "Local Cafe @ Blk 302",
        "Roof Garden", "Basketball Court", "Library Meeting Room", "Void Deck @ Blk 105"
    ];

    const eventTemplates = [
        { t: "Morning Yoga Flow", type: "wellness", tags: ["health", "relax"], duration: 90, hour: 8 },
        { t: "Evening Badminton", type: "competition", tags: ["sports", "active"], duration: 120, hour: 19 },
        { t: "Community Food Drive", type: "neighbourhood", tags: ["charity", "volunteer"], duration: 180, hour: 10 },
        { t: "Tech Workshop for Seniors", type: "neighbourhood", tags: ["education", "tech"], duration: 120, hour: 14 },
        { t: "Recycling Drive", type: "neighbourhood", tags: ["eco", "green"], duration: 240, hour: 9 },
        { t: "Meditation Circle", type: "wellness", tags: ["mindfulness", "calm"], duration: 60, hour: 18 },
        { t: "Table Tennis Tournament", type: "competition", tags: ["sports", "fun"], duration: 180, hour: 13 },
        { t: "Book Exchange", type: "neighbourhood", tags: ["social", "books"], duration: 120, hour: 11 },
        { t: "Gardening Workshop", type: "wellness", tags: ["nature", "learn"], duration: 150, hour: 9 },
        { t: "Street Soccer", type: "competition", tags: ["sports", "youth"], duration: 120, hour: 17 },
        { t: "Kopi & Chat", type: "neighbourhood", tags: ["social", "relax"], duration: 90, hour: 15 },
        { t: "Art & Craft Jam", type: "wellness", tags: ["creative", "art"], duration: 120, hour: 14 },
        { t: "Zumba Gold", type: "wellness", tags: ["fitness", "dance"], duration: 60, hour: 10 },
        { t: "Chess Club Meetup", type: "competition", tags: ["strategy", "game"], duration: 180, hour: 16 }
    ];

    // Clan Events (Weekly)
    const clanEvents = [
        { t: "Bedok Barkers Meetup", type: "clan", clanId: "c03", tags: ["social", "dogs"], day: 5, hour: 20 }, // Friday
        { t: "Weekend Warriors", type: "clan", clanId: "c07", tags: ["gym", "fitness"], day: 6, hour: 9 } // Saturday
    ];

    // Generate for next 60 days to ensure full coverage
    for (let i = 0; i < 60; i++) {
        const date = new Date(currentYear, currentMonth, 1);
        date.setDate(date.getDate() + i); // Start from 1st of current month
        const dayOfWeek = date.getDay();

        // 1. Guaranteed Daily Event (Base Layer)
        // Pick a template based on day index to rotate variety
        const dailyTemplate = eventTemplates[i % eventTemplates.length];

        const start1 = new Date(date);
        // Add some random variance to start time
        start1.setHours(dailyTemplate.hour, getRandomInt(0, 3) * 15, 0, 0);
        const end1 = new Date(start1);
        end1.setMinutes(start1.getMinutes() + dailyTemplate.duration);

        events.push({
            id: `evt-daily-${i}`,
            title: dailyTemplate.t,
            date: start1,
            endDate: end1,
            location: getRandom(locations),
            type: dailyTemplate.type as EventType,
            attendees: getRandomInt(5, 40),
            languages: ["en"],
            recurring: false,
            hasChat: true,
            isUserAttending: Math.random() > 0.85,
            tags: dailyTemplate.tags,
            aiSuggestionScore: Math.random() // For AI sorting
        });

        // 2. Secondary Event (50% chance, or Weekends)
        if (dayOfWeek === 0 || dayOfWeek === 6 || Math.random() > 0.5) {
            const secondTemplate = eventTemplates[(i + 7) % eventTemplates.length]; // Offset to avoid same type

            // Should be at a different time
            let hour2 = (dailyTemplate.hour + 6) % 24;
            if (hour2 < 8) hour2 += 12; // Keep it in day time

            const start2 = new Date(date);
            start2.setHours(hour2, 0, 0, 0);
            const end2 = new Date(start2);
            end2.setMinutes(start2.getMinutes() + secondTemplate.duration);

            events.push({
                id: `evt-extra-${i}`,
                title: secondTemplate.t,
                date: start2,
                endDate: end2,
                location: getRandom(locations),
                type: secondTemplate.type as EventType,
                attendees: getRandomInt(3, 25),
                languages: ["en"],
                recurring: false,
                hasChat: true,
                isUserAttending: Math.random() > 0.9,
                tags: secondTemplate.tags,
            });
        }

        // 3. Clan Events (Weekly overrides)
        clanEvents.forEach((ce, idx) => {
            if (dayOfWeek === ce.day) {
                const startC = new Date(date); startC.setHours(ce.hour, 0, 0, 0);
                const endC = new Date(startC); endC.setHours(ce.hour + 2, 0, 0, 0);

                events.push({
                    id: `evt-clan-${idx}-${i}`,
                    title: ce.t,
                    date: startC,
                    endDate: endC,
                    location: getRandom(locations),
                    type: "clan",
                    clanId: ce.clanId,
                    attendees: getRandomInt(10, 30),
                    languages: ["en"],
                    recurring: true,
                    hasChat: true,
                    isUserAttending: true, // User is in these clans
                    tags: ce.tags,
                });
            }
        });
    }

    return events;
};

const initialMockEvents: Event[] = generateMockEvents();

const STORAGE_KEY = "km_events_data_v5";

export interface EventFilters {
    search: string;
    type: EventType | "all";
    dateRange?: { start: Date; end: Date };
    attendingOnly: boolean;
}

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [filters, setFilters] = useState<EventFilters>({
        search: "",
        type: "all",
        attendingOnly: false,
    });

    // Load events from localStorage on mount
    useEffect(() => {
        const loadEvents = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Convert date strings back to Date objects
                    const hydatedEvents = parsed.map((e: any) => ({
                        ...e,
                        date: new Date(e.date),
                        endDate: e.endDate ? new Date(e.endDate) : undefined,
                    }));
                    setEvents(hydatedEvents);
                } else {
                    // Initialize with mock data if no storage
                    setEvents(initialMockEvents);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockEvents));
                }
            } catch (error) {
                console.error("Failed to load events:", error);
                setEvents(initialMockEvents);
            } finally {
                setIsLoaded(true);
            }
        };

        loadEvents();

        // Listen for storage changes to sync across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                loadEvents();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Save events to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        }
    }, [events, isLoaded]);

    const addEvent = (newEvent: Omit<Event, "id">) => {
        const event: Event = {
            ...newEvent,
            id: `ev_${Date.now()}`,
            isUserAttending: true, // Creator attends by default
        };
        setEvents((prev) => [...prev, event]);
        return event;
    };

    const rsvpEvent = (eventId: string, attending: boolean) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                // If status isn't changing, do nothing
                if (event.isUserAttending === attending) return event;

                return {
                    ...event,
                    isUserAttending: attending,
                    attendees: attending ? event.attendees + 1 : Math.max(0, event.attendees - 1)
                };
            }
            return event;
        }));
    };

    const getUpcomingEvents = (limit: number = 5) => {
        const now = new Date();
        return events
            .filter((e) => new Date(e.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, limit);
    };

    // Filtered events based on current filters
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Search filter
            if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Type filter
            if (filters.type !== "all" && event.type !== filters.type) {
                return false;
            }

            // Attending filter
            if (filters.attendingOnly && !event.isUserAttending) {
                return false;
            }

            // Date range filter
            if (filters.dateRange) {
                const eventDate = new Date(event.date);
                if (eventDate < filters.dateRange.start || eventDate > filters.dateRange.end) {
                    return false;
                }
            }

            return true;
        });
    }, [events, filters]);

    // Update an existing event
    const updateEvent = (eventId: string, updates: Partial<Event>) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? { ...event, ...updates } : event
        ));
    };

    // Delete an event
    const deleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
    };

    // Set reminder for an event
    const setReminder = (eventId: string, reminder: EventReminder) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                const reminders = event.reminders || [];
                // Check if reminder already exists
                const existingIndex = reminders.findIndex(r => r.minutesBefore === reminder.minutesBefore);

                if (existingIndex >= 0) {
                    // Update existing reminder
                    const newReminders = [...reminders];
                    newReminders[existingIndex] = reminder;
                    return { ...event, reminders: newReminders };
                } else {
                    // Add new reminder
                    return { ...event, reminders: [...reminders, reminder] };
                }
            }
            return event;
        }));
    };

    // Remove reminder from an event
    const removeReminder = (eventId: string, minutesBefore: number) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId && event.reminders) {
                return {
                    ...event,
                    reminders: event.reminders.filter(r => r.minutesBefore !== minutesBefore)
                };
            }
            return event;
        }));
    };

    // Update recurring pattern
    const updateRecurringPattern = (eventId: string, pattern: RecurringPattern, days?: number[], endDate?: Date) => {
        updateEvent(eventId, {
            recurringPattern: pattern,
            recurringDays: days,
            recurringEndDate: endDate,
            recurring: pattern !== null,
        });
    };

    return {
        events,
        filteredEvents,
        filters,
        setFilters,
        addEvent,
        updateEvent,
        deleteEvent,
        rsvpEvent,
        setReminder,
        removeReminder,
        updateRecurringPattern,
        upcomingEvents: getUpcomingEvents(),
        isLoaded,
    };
}
