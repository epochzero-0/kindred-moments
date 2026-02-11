export interface User {
  id: string;
  name: string;
  age: number;
  neighbourhood: string;
  languages: string[];
  interests: string[];
  comfort_level: "introvert" | "ambivert" | "extrovert";
  free_slots: string[];
  joined_clans: string[];
  mood_last_week: number[];
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  duration: number;
  location: string;
  tags: string[];
  ideal_group: number;
  language: string;
}

export interface Clan {
  id: string;
  name: string;
  neighbourhood: string;
  theme: string;
  members: string[];
  weekly_goal: string;
  events_planned: number;
}

export interface Match {
  id: string;
  users: string[];
  activity: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  feedback: number[];
}

export interface PulseData {
  neighbourhood: string;
  active_today: number;
  avg_mood: number;
  top_interests: string[];
}

export interface StatusUpdate {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  activity?: string;
  joinable: boolean;
  responses: string[];
}

export interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  content: string;
  tags: string[];
}

export interface BreathingExercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  pattern: string;
  icon: string;
}

export interface NeighborhoodGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  participants: string[];
}

export type EventType = "neighbourhood" | "clan" | "competition" | "wellness";

export interface Event {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  type: EventType;
  attendees: number;
  capacity?: number;
  neighbourhood?: string;
  clanId?: string;
  clanName?: string;
  languages: string[];
  recurring: boolean;
  description?: string;
  hasChat: boolean;
  expenses?: { total: number; perPerson: number };
  openToAll?: boolean; // Added from CreateEventModal form data
  isUserAttending?: boolean;
}
