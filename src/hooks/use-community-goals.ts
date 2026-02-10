import { useState, useEffect } from "react";

export interface CommunityGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  active: boolean;
}

const DEFAULT_GOALS: CommunityGoal[] = [
  { id: "g1", title: "Volunteer Hours", current: 127, target: 200, unit: "hours", active: true },
  { id: "g2", title: "Community Clean-up", current: 45, target: 50, unit: "participants", active: true },
  { id: "g3", title: "Wellness Challenge", current: 2400000, target: 5000000, unit: "steps", active: true },
];

const STORAGE_KEY = "kindred-community-goals";

export const useCommunityGoals = () => {
  const [goals, setGoals] = useState<CommunityGoal[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<CommunityGoal, "id">) => {
    const newGoal: CommunityGoal = {
      ...goal,
      id: `g${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<CommunityGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const endGoal = (id: string) => {
    updateGoal(id, { active: false });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return {
    goals,
    activeGoals: goals.filter((g) => g.active),
    addGoal,
    updateGoal,
    endGoal,
    deleteGoal,
  };
};
