import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  userId: string;
  displayName: string;
  avatar: string | null;
  bio: string;
  languages: string[];
  neighbourhoods: string[];
  interests: string[];
  postalCode: string;
  createdAt: string;
}

const STORAGE_KEY = "kindred-user-profile";

const defaultProfile: UserProfile = {
  userId: "",
  displayName: "",
  avatar: null,
  bio: "",
  languages: ["en"],
  neighbourhoods: [],
  interests: [],
  postalCode: "",
  createdAt: "",
};

export function getUserProfile(): UserProfile | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
  } catch (e) {
    console.error("Failed to parse user profile from sessionStorage", e);
  }
  return null;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent("user-profile-updated", { detail: profile }));
  } catch (e) {
    console.error("Failed to save user profile to sessionStorage", e);
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getUserProfile();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  saveUserProfile(updated);
  return updated;
}

export function clearUserProfile(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("user-profile-updated", { detail: null }));
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getUserProfile());

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<UserProfile | null>) => {
      setProfile(e.detail);
    };

    window.addEventListener("user-profile-updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("user-profile-updated", handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback((updates: Partial<UserProfile>) => {
    const updated = updateUserProfile(updates);
    if (updated) {
      setProfile(updated);
    }
    return updated;
  }, []);

  const save = useCallback((newProfile: UserProfile) => {
    saveUserProfile(newProfile);
    setProfile(newProfile);
  }, []);

  const clear = useCallback(() => {
    clearUserProfile();
    setProfile(null);
  }, []);

  return {
    profile,
    update,
    save,
    clear,
    isLoggedIn: profile !== null && profile.userId !== "",
  };
}

export default useUserProfile;
