import { useState, useEffect, useCallback } from "react";

const JOINED_GROUPS_KEY = "kindred-joined-groups";
const CONTACTED_USERS_KEY = "kindred-contacted-users";

export interface JoinedGroup {
  id: string;
  name: string;
  joinedAt: string;
}

export interface ContactedUser {
  userId: string;
  name: string;
  contactedAt: string;
}

// Get joined groups from session storage
export function getJoinedGroups(): JoinedGroup[] {
  try {
    const stored = sessionStorage.getItem(JOINED_GROUPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save joined groups to session storage
export function saveJoinedGroups(groups: JoinedGroup[]): void {
  try {
    sessionStorage.setItem(JOINED_GROUPS_KEY, JSON.stringify(groups));
    window.dispatchEvent(new CustomEvent("joined-groups-updated", { detail: groups }));
  } catch (e) {
    console.error("Failed to save joined groups", e);
  }
}

// Get contacted users from session storage
export function getContactedUsers(): ContactedUser[] {
  try {
    const stored = sessionStorage.getItem(CONTACTED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save contacted users to session storage
export function saveContactedUsers(users: ContactedUser[]): void {
  try {
    sessionStorage.setItem(CONTACTED_USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent("contacted-users-updated", { detail: users }));
  } catch (e) {
    console.error("Failed to save contacted users", e);
  }
}

// Hook for managing chat connections
export function useChatConnections() {
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>(() => getJoinedGroups());
  const [contactedUsers, setContactedUsers] = useState<ContactedUser[]>(() => getContactedUsers());

  // Listen for updates from other components
  useEffect(() => {
    const handleGroupsUpdate = (e: CustomEvent<JoinedGroup[]>) => {
      setJoinedGroups(e.detail);
    };
    const handleUsersUpdate = (e: CustomEvent<ContactedUser[]>) => {
      setContactedUsers(e.detail);
    };

    window.addEventListener("joined-groups-updated", handleGroupsUpdate as EventListener);
    window.addEventListener("contacted-users-updated", handleUsersUpdate as EventListener);

    return () => {
      window.removeEventListener("joined-groups-updated", handleGroupsUpdate as EventListener);
      window.removeEventListener("contacted-users-updated", handleUsersUpdate as EventListener);
    };
  }, []);

  const joinGroup = useCallback((id: string, name: string) => {
    const existing = getJoinedGroups();
    if (!existing.find(g => g.id === id)) {
      const updated = [...existing, { id, name, joinedAt: new Date().toISOString() }];
      saveJoinedGroups(updated);
      setJoinedGroups(updated);
    }
  }, []);

  const leaveGroup = useCallback((id: string) => {
    const existing = getJoinedGroups();
    const updated = existing.filter(g => g.id !== id);
    saveJoinedGroups(updated);
    setJoinedGroups(updated);
  }, []);

  const isGroupJoined = useCallback((id: string) => {
    return joinedGroups.some(g => g.id === id);
  }, [joinedGroups]);

  const contactUser = useCallback((userId: string, name: string) => {
    const existing = getContactedUsers();
    if (!existing.find(u => u.userId === userId)) {
      const updated = [...existing, { userId, name, contactedAt: new Date().toISOString() }];
      saveContactedUsers(updated);
      setContactedUsers(updated);
    }
  }, []);

  const isUserContacted = useCallback((userId: string) => {
    return contactedUsers.some(u => u.userId === userId);
  }, [contactedUsers]);

  return {
    joinedGroups,
    contactedUsers,
    joinGroup,
    leaveGroup,
    isGroupJoined,
    contactUser,
    isUserContacted,
  };
}
