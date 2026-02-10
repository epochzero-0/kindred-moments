import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, Globe, Sparkles } from "lucide-react";
import { useUsers, useClans, usePulseData, useCurrentUser } from "@/hooks/use-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useSearchParams } from "react-router-dom";
import {
  MembersNearby,
  InterestGroupDirectory,
  NeighbourhoodDirectory,
  GlobeVisualization,
} from "@/components/explore";

// Neighbourhood labels for filtering
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

type ExploreTab = "members" | "groups" | "neighbourhoods" | "globe";

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const { profile: storedProfile } = useUserProfile();
  
  // Initialize state directly from URL to prevent tab mismatch on load
  const [activeTab, setActiveTab] = useState<ExploreTab>(() => {
    const tabParam = searchParams.get("tab") as ExploreTab;
    return (tabParam && ["members", "groups", "neighbourhoods", "globe"].includes(tabParam)) 
      ? tabParam 
      : "members";
  });

  const currentUser = useCurrentUser();
  const allUsers = useUsers();
  const clans = useClans();
  const pulseData = usePulseData();

  // Listen for URL changes (e.g. back button) to update the tab
  useEffect(() => {
    const tabParam = searchParams.get("tab") as ExploreTab;
    if (tabParam && ["members", "groups", "neighbourhoods", "globe"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Get user's neighborhood from stored profile, convert to match users.json format
  const userNeighbourhood = storedProfile?.neighbourhoods?.[0];
  const neighbourhoodDisplayName = userNeighbourhood 
    ? neighbourhoodLabels[userNeighbourhood] || userNeighbourhood
    : currentUser?.neighbourhood || 'Punggol';

  // Get user interests from stored profile or current user
  const userInterests = storedProfile?.interests || currentUser?.interests || [];

  // Filter users by same neighborhood (matching display name)
  const nearbyUsers = allUsers.filter(
    (u) => u.id !== currentUser?.id && 
    u.neighbourhood.toLowerCase() === neighbourhoodDisplayName.toLowerCase()
  );

  const tabs = [
    { id: "members" as const, label: "Members", icon: Users },
    { id: "groups" as const, label: "Groups", icon: Sparkles },
    { id: "neighbourhoods" as const, label: "Areas", icon: MapPin },
    { id: "globe" as const, label: "Globe", icon: Globe },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-6 pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-sm mb-1">Explore</p>
          <h1 className="text-2xl font-semibold text-foreground">Discover your community</h1>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === "members" && (
            <MembersNearby 
              key="members" 
              users={nearbyUsers} 
              currentUserInterests={userInterests}
              neighbourhood={neighbourhoodDisplayName}
            />
          )}
          {activeTab === "groups" && (
            <InterestGroupDirectory 
              key="groups" 
              clans={clans}
              allUsers={allUsers}
              currentUserInterests={userInterests}
              initialSearch={searchParams.get("q") || ""} 
            />
          )}
          {activeTab === "neighbourhoods" && (
            <NeighbourhoodDirectory key="neighbourhoods" pulseData={pulseData} />
          )}
          {activeTab === "globe" && (
            <GlobeVisualization key="globe" pulseData={pulseData} clans={clans} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExplorePage;
