import { useState, useEffect } from "react";
import type { User, Activity, Clan, Match, PulseData } from "@/types";

import usersData from "@/data/users.json";
import activitiesData from "@/data/activities.json";
import clansData from "@/data/clans.json";
import matchesData from "@/data/matches.json";
import pulseData from "@/data/pulse.json";

// Current logged in user (simulating Singpass auth)
const CURRENT_USER_ID = "u001";

export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = (usersData as User[]).find((u) => u.id === CURRENT_USER_ID);
    setUser(currentUser || null);
  }, []);

  return user;
}

export function useUsers(): User[] {
  return usersData as User[];
}

export function useUser(id: string): User | undefined {
  return (usersData as User[]).find((u) => u.id === id);
}

export function useActivities(): Activity[] {
  return activitiesData as Activity[];
}

export function useActivity(id: string): Activity | undefined {
  return (activitiesData as Activity[]).find((a) => a.id === id);
}

export function useClans(): Clan[] {
  return clansData as Clan[];
}

export function useClan(id: string): Clan | undefined {
  return (clansData as Clan[]).find((c) => c.id === id);
}

export function useMatches(): Match[] {
  return matchesData as Match[];
}

export function useUserMatches(userId: string): Match[] {
  return (matchesData as Match[]).filter((m) => m.users.includes(userId));
}

export function usePulseData(): PulseData[] {
  return pulseData as PulseData[];
}

export function useNeighborhoodPulse(neighbourhood: string): PulseData | undefined {
  return (pulseData as PulseData[]).find((p) => p.neighbourhood === neighbourhood);
}

// Get clan members as User objects
export function useClanMembers(clanId: string): User[] {
  const clan = (clansData as Clan[]).find((c) => c.id === clanId);
  if (!clan) return [];
  return (usersData as User[]).filter((u) => clan.members.includes(u.id));
}

// Get suggested clans based on user interests
export function useSuggestedClans(userId: string): Clan[] {
  const user = (usersData as User[]).find((u) => u.id === userId);
  if (!user) return [];

  const userInterests = user.interests;
  return (clansData as Clan[])
    .filter((c) => {
      // Match by theme or neighbourhood
      return (
        userInterests.some((i) => c.theme.toLowerCase().includes(i.toLowerCase())) ||
        c.neighbourhood === user.neighbourhood
      );
    })
    .slice(0, 5);
}

// Calculate average mood from user's mood_last_week
export function calculateAverageMood(moods: number[]): number {
  if (moods.length === 0) return 0;
  return moods.reduce((a, b) => a + b, 0) / moods.length;
}

// Get mood emoji based on score
export function getMoodEmoji(mood: number): string {
  if (mood >= 4.5) return "😊";
  if (mood >= 3.5) return "🙂";
  if (mood >= 2.5) return "😐";
  if (mood >= 1.5) return "😔";
  return "😢";
}
