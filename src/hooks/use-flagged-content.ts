import { useState, useEffect } from "react";

export interface FlaggedItem {
  id: string;
  type: "message" | "event" | "user";
  preview: string;
  reporter: string;
  time: string;
  severity: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected";
}

const DEFAULT_FLAGGED: FlaggedItem[] = [
  { id: "f1", type: "message", preview: "Inappropriate language in...", reporter: "AI Auto-flag", time: "2h ago", severity: "medium", status: "pending" },
  { id: "f2", type: "event", preview: "Suspicious event details...", reporter: "User Report", time: "5h ago", severity: "low", status: "pending" },
];

const STORAGE_KEY = "kindred-flagged-content";

export const useFlaggedContent = () => {
  const [items, setItems] = useState<FlaggedItem[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FLAGGED;
    } catch {
      return DEFAULT_FLAGGED;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const pendingItems = items.filter((i) => i.status === "pending");

  const approveItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "approved" as const } : i))
    );
  };

  const rejectItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "rejected" as const } : i))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return {
    items,
    pendingItems,
    approveItem,
    rejectItem,
    removeItem,
  };
};
