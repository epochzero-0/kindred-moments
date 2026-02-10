import { useState, useEffect } from "react";
import { Event, EventType } from "@/types";

// Helper to create dates relative to today
const getDateFromToday = (daysOffset: number, hours: number = 9, minutes: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Initial mock events (moved from EventsPage.tsx)
const initialMockEvents: Event[] = [
    {
        id: "ev1",
        title: "Morning Tai Chi",
        date: getDateFromToday(0, 7, 0),
        endDate: getDateFromToday(0, 8, 0),
        location: "Punggol Park",
        type: "neighbourhood",
        attendees: 12,
        capacity: 20,
        neighbourhood: "Punggol",
        languages: ["en", "zh"],
        recurring: true,
        hasChat: true,
    },
    {
        id: "ev2",
        title: "Board Game Night",
        date: getDateFromToday(4, 19, 30),
        endDate: getDateFromToday(4, 22, 0),
        location: "Sengkang CC",
        type: "clan",
        attendees: 8,
        capacity: 12,
        clanId: "c01",
        clanName: "Board Game Kakis",
        languages: ["en"],
        recurring: false,
        hasChat: true,
        expenses: { total: 45, perPerson: 5.63 },
    },
    {
        id: "ev3",
        title: "Inter-Neighbourhood Badminton",
        date: getDateFromToday(5, 14, 0),
        endDate: getDateFromToday(5, 17, 0),
        location: "Bedok Sports Hall",
        type: "competition",
        attendees: 24,
        neighbourhood: "Punggol vs Bedok",
        languages: ["en", "zh", "ms"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev4",
        title: "Mindfulness Walk",
        date: getDateFromToday(1, 6, 30),
        endDate: getDateFromToday(1, 7, 30),
        location: "Punggol Waterway",
        type: "wellness",
        attendees: 6,
        languages: ["en"],
        recurring: true,
        hasChat: true,
    },
    {
        id: "ev5",
        title: "Photography Walk",
        date: getDateFromToday(6, 17, 0),
        endDate: getDateFromToday(6, 19, 0),
        location: "Gardens by the Bay",
        type: "clan",
        attendees: 10,
        capacity: 15,
        clanId: "c02",
        clanName: "Shutter Bugs",
        languages: ["en", "zh"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev6",
        title: "Community Clean-up",
        date: getDateFromToday(12, 8, 0),
        endDate: getDateFromToday(12, 11, 0),
        location: "Punggol Beach",
        type: "neighbourhood",
        attendees: 35,
        capacity: 50,
        neighbourhood: "Punggol",
        languages: ["en", "zh", "ms", "ta"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev7",
        title: "Evening Yoga",
        date: getDateFromToday(0, 18, 0),
        endDate: getDateFromToday(0, 19, 0),
        location: "Community Centre",
        type: "wellness",
        attendees: 8,
        capacity: 15,
        languages: ["en"],
        recurring: true,
        hasChat: true,
    },
    {
        id: "ev8",
        title: "Book Club Meeting",
        date: getDateFromToday(0, 19, 30),
        endDate: getDateFromToday(0, 21, 0),
        location: "Library @ Punggol",
        type: "clan",
        attendees: 5,
        capacity: 12,
        clanId: "c03",
        clanName: "Page Turners",
        languages: ["en"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev9",
        title: "Cooking Class",
        date: getDateFromToday(3, 14, 0),
        endDate: getDateFromToday(3, 16, 0),
        location: "Sengkang CC Kitchen",
        type: "clan",
        attendees: 10,
        capacity: 12,
        clanId: "c04",
        clanName: "Hawker Heroes",
        languages: ["en", "zh"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev10",
        title: "Kids Soccer Practice",
        date: getDateFromToday(3, 16, 30),
        endDate: getDateFromToday(3, 18, 0),
        location: "Punggol Field",
        type: "neighbourhood",
        attendees: 18,
        capacity: 25,
        neighbourhood: "Punggol",
        languages: ["en"],
        recurring: true,
        hasChat: true,
    },
    {
        id: "ev11",
        title: "Night Cycling",
        date: getDateFromToday(3, 20, 0),
        endDate: getDateFromToday(3, 22, 0),
        location: "Park Connector",
        type: "wellness",
        attendees: 12,
        languages: ["en"],
        recurring: false,
        hasChat: true,
    },
    {
        id: "ev12",
        title: "Senior Dance Class",
        date: getDateFromToday(3, 10, 0),
        endDate: getDateFromToday(3, 11, 30),
        location: "RC Hall",
        type: "wellness",
        attendees: 22,
        capacity: 30,
        languages: ["en", "zh"],
        recurring: true,
        hasChat: true,
    },
];

const STORAGE_KEY = "km_events_data";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

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
        };
        setEvents((prev) => [...prev, event]);
        return event;
    };

    const getUpcomingEvents = (limit: number = 5) => {
        const now = new Date();
        return events
            .filter((e) => new Date(e.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, limit);
    };

    return {
        events,
        addEvent,
        upcomingEvents: getUpcomingEvents(),
        isLoaded,
    };
}
