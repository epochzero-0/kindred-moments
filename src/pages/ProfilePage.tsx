import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Settings, Award, Trophy, Users, MapPin, Languages, Heart,
  ChevronRight, Bell, Lock, Globe, LogOut, Shield, BarChart3,
  Calendar, MessageCircle, Star, Zap, Building, Waves, Dumbbell,
  Gift, Crown, Flag, Eye, EyeOff, Check, X, Edit2, Camera, Train,
  Download, Trash2, Clock, Moon, Sun, CloudSun, Plus,
  // Interest icons
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Footprints, Film, Music, BookOpen,
  Monitor, LucideIcon
} from "lucide-react";
import { useCurrentUser, useClans, usePulseData, useUsers } from "@/hooks/use-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useCommunityGoals, CommunityGoal } from "@/hooks/use-community-goals";
import { useFlaggedContent } from "@/hooks/use-flagged-content";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { Link, useNavigate } from "react-router-dom";
import type { Clan } from "@/types";

type ProfileTab = "profile" | "groups" | "achievements" | "admin" | "settings";

// Labels for display
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

const interestLabels: Record<string, string> = {
  running: "Running", "board-games": "Board Games", cooking: "Cooking", gardening: "Gardening",
  photography: "Photography", reading: "Reading", gaming: "Gaming", music: "Music",
  art: "Art & Crafts", fitness: "Fitness", "dog-walking": "Dog Walking", meditation: "Meditation",
  coffee: "Coffee & Tea", cycling: "Cycling", hiking: "Hiking", movies: "Movies",
  karaoke: "Karaoke", drawing: "Drawing", volunteering: "Volunteering", parenting: "Parenting", nature: "Nature",
};

const languageLabels: Record<string, string> = { en: "English", zh: "中文", ms: "Bahasa Melayu", ta: "தமிழ்" };

// Mock data
const userAchievements = {
  points: 2450,
  rank: 7,
  totalContributors: 245,
  streak: 14,
  eventsAttended: 24,
  connectionssMade: 156,
  goalsCompleted: 8,
};

const priorityPerks = [
  { id: "gym", name: "Priority Gym Booking", icon: Dumbbell, unlocked: true, description: "Book gym slots 24h before others" },
  { id: "pool", name: "Priority Pool Access", icon: Waves, unlocked: true, description: "Reserve pool lanes in advance" },
  { id: "room", name: "Community Room", icon: Building, unlocked: false, description: "Book meeting rooms first" },
  { id: "partner", name: "Partner Perks", icon: Gift, unlocked: true, description: "Discounts at local businesses" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { profile: storedProfile, update: updateProfile } = useUserProfile();
  const clans = useClans();
  const pulseData = usePulseData();
  const allUsers = useUsers();
  const { goals: communityGoals, addGoal, updateGoal, endGoal } = useCommunityGoals();
  const { pendingItems: flaggedContent, approveItem, rejectItem } = useFlaggedContent();
  const { joinedGroups } = useChatConnections();
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [isAdmin] = useState(true); // Mock admin status

  // Merge stored profile with mock data - stored takes priority
  const displayName = storedProfile?.displayName || currentUser?.name || "Loading...";
  const displayAvatar = storedProfile?.avatar || null;
  const displayBio = storedProfile?.bio || "Loves morning walks and trying new hawker food. Always up for a good board game session! 🎲";
  const displayLanguages = storedProfile?.languages?.length ? storedProfile.languages : currentUser?.languages || [];
  const displayInterests = storedProfile?.interests?.length ? storedProfile.interests : currentUser?.interests || [];
  const displayNeighbourhoods = storedProfile?.neighbourhoods?.length ? storedProfile.neighbourhoods : (currentUser?.neighbourhood ? [currentUser.neighbourhood] : []);
  const displayUserId = storedProfile?.userId || "";
  const displayComfortLevel = storedProfile?.comfortLevel || currentUser?.comfort_level || "ambivert";
  const displayFreeSlots = storedProfile?.freeSlots?.length ? storedProfile.freeSlots : currentUser?.free_slots || [];

  // Calculate user's effective clans by merging static data + dynamic session joins
  const userClans = useMemo(() => {
    // 1. Start with clans from static data (users.json)
    // FIX: If we have a storedProfile (onboarding done), do NOT use the hardcoded user's clans.
    // This gives a clean slate for the new user profile so you only see groups YOU joined.
    const staticClanIds = storedProfile 
      ? new Set<string>() 
      : new Set([
          ...(currentUser?.joined_clans || []),
          ...clans.filter(c => c.members.includes(currentUser?.id || "")).map(c => c.id)
        ]);

    // 2. Identify real clans that match joined groups
    const realClans = clans.filter(c => 
      staticClanIds.has(c.id) || joinedGroups.some(g => g.id === c.id)
    );

    const realClanIds = new Set(realClans.map(c => c.id));

    // 3. Create synthetic clans for "topic" groups (e.g. "badminton") that aren't in clans.json
    const topicGroups = joinedGroups
      .filter(g => !realClanIds.has(g.id))
      .map(g => {
        // Calculate synthetic members based on users who have this interest
        const interestedUserIds = allUsers
          .filter(u => u.interests.includes(g.id))
          .map(u => u.id);
        
        return {
          id: g.id,
          name: g.name,
          theme: g.id, // Usually the ID is the theme for topic groups
          description: `Community group for ${g.name}`,
          members: interestedUserIds.length > 0 ? interestedUserIds : [currentUser?.id || "user"],
          weekly_goal: "Stay active!",
          meeting_time: "Various times"
        } as Clan;
      });

    return [...realClans, ...topicGroups];
  }, [clans, currentUser, joinedGroups, allUsers, storedProfile]);

  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const connectionCount = allUsers.filter(u => u.neighbourhood === currentUser?.neighbourhood).length - 1;

  // Get user's neighbourhood name for leaderboard matching
  const userNeighbourhoodName = displayNeighbourhoods[0] 
    ? neighbourhoodLabels[displayNeighbourhoods[0]] || displayNeighbourhoods[0] 
    : currentUser?.neighbourhood;
  
  // Calculate neighbourhood rank from pulseData (same as Explore > Areas)
  const sortedNeighbourhoods = [...pulseData].sort((a, b) => b.active_today - a.active_today);
  const userNeighbourhoodRank = sortedNeighbourhoods.findIndex(n => n.neighbourhood === userNeighbourhoodName) + 1 || null;

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "groups" as const, label: "Groups", icon: Users },
    { id: "achievements" as const, label: "Rewards", icon: Award },
    ...(isAdmin ? [{ id: "admin" as const, label: "Admin", icon: Shield }] : []),
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-sakura/10 to-lavender/10 px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* Avatar */}
          <div className="relative">
            {displayAvatar ? (
              <img src={displayAvatar} alt="Avatar" className="h-20 w-20 rounded-2xl bg-muted shadow-elevated" />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-sakura flex items-center justify-center text-2xl font-bold text-white shadow-elevated">
                {displayName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white shadow-soft flex items-center justify-center">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {userAchievements.rank <= 10 && (
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center">
                <Crown className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {displayName}
              </h1>
              <button 
                onClick={() => setActiveTab("profile")}
                className="h-6 w-6 rounded-full hover:bg-white/50 flex items-center justify-center"
              >
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div 
              onClick={() => navigate("/profile/neighbourhoods")}
              className="flex items-center gap-2 mt-1 cursor-pointer hover:bg-white/30 rounded-lg px-2 py-1 -mx-2 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {displayNeighbourhoods.length > 0 
                  ? displayNeighbourhoods.map(n => neighbourhoodLabels[n] || n).join(", ")
                  : currentUser?.neighbourhood || "..."}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground">{connectionCount}</strong> connections
              </span>
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground">{userClans.length}</strong> groups
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mt-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-foreground">{userAchievements.points} pts</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{userAchievements.streak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60">
            <Trophy className="h-3.5 w-3.5 text-pandan" />
            <span className="text-xs font-medium text-foreground">
              {userNeighbourhoodRank ? `Neighbourhood Rank #${userNeighbourhoodRank}` : "Neighbourhood Rank —"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="px-4 py-3 border-b border-border/40 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <ProfileTab 
              key="profile" 
              user={currentUser} 
              clans={userClans}
              displayBio={displayBio}
              displayLanguages={displayLanguages}
              displayInterests={displayInterests}
              displayNeighbourhoods={displayNeighbourhoods}
              displayUserId={displayUserId}
              displayComfortLevel={displayComfortLevel}
              displayFreeSlots={displayFreeSlots}
              onUpdate={updateProfile}
            />
          )}
          {activeTab === "groups" && (
            <GroupsTab key="groups" clans={userClans} neighbourhood={displayNeighbourhoods[0] ? neighbourhoodLabels[displayNeighbourhoods[0]] || displayNeighbourhoods[0] : currentUser?.neighbourhood} />
          )}
          {activeTab === "achievements" && (
            <AchievementsTab key="achievements" achievements={userAchievements} perks={priorityPerks} />
          )}
          {activeTab === "admin" && isAdmin && (
            <AdminTab 
              key="admin" 
              goals={communityGoals} 
              flaggedContent={flaggedContent}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
              onEndGoal={endGoal}
              onApproveFlag={approveItem}
              onRejectFlag={rejectItem}
              onNavigate={navigate}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab key="settings" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Profile Tab
interface ProfileTabProps {
  user: ReturnType<typeof useCurrentUser>;
  clans: Clan[];
  displayBio: string;
  displayLanguages: string[];
  displayInterests: string[];
  displayNeighbourhoods: string[];
  displayUserId: string;
  displayComfortLevel: string;
  displayFreeSlots: string[];
  onUpdate: (updates: Partial<{ bio: string; languages: string[]; interests: string[]; comfortLevel: string; freeSlots: string[] }>) => void;
}

// Available options for selection
const availableLanguages = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文 (Chinese)" },
  { id: "ms", label: "Bahasa Melayu" },
  { id: "ta", label: "தமிழ் (Tamil)" },
];

// Comfort levels
const comfortLevels = [
  { id: "introvert", label: "Introvert", icon: Moon, description: "I prefer smaller, quieter gatherings" },
  { id: "ambivert", label: "Ambivert", icon: CloudSun, description: "I'm comfortable in most situations" },
  { id: "extrovert", label: "Extrovert", icon: Sun, description: "I thrive in social settings" },
];

// Common free time slots
const availableFreeSlots = [
  { id: "07:00-09:00", label: "Morning (7-9am)" },
  { id: "09:00-12:00", label: "Late Morning (9am-12pm)" },
  { id: "12:00-14:00", label: "Lunch (12-2pm)" },
  { id: "14:00-17:00", label: "Afternoon (2-5pm)" },
  { id: "17:00-19:00", label: "Evening (5-7pm)" },
  { id: "19:00-21:00", label: "Night (7-9pm)" },
  { id: "21:00-23:00", label: "Late Night (9-11pm)" },
];

// Interests matching users.json database
const availableInterests: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "art", label: "Art", icon: Palette },
  { id: "badminton", label: "Badminton", icon: CircleDot },
  { id: "board games", label: "Board Games", icon: Gamepad2 },
  { id: "bubble tea", label: "Bubble Tea", icon: Coffee },
  { id: "cats", label: "Cats", icon: Cat },
  { id: "cooking", label: "Cooking", icon: UtensilsCrossed },
  { id: "cycling", label: "Cycling", icon: Bike },
  { id: "dogs", label: "Dogs", icon: Dog },
  { id: "evening walks", label: "Evening Walks", icon: Sunset },
  { id: "food hunt", label: "Food Hunt", icon: Soup },
  { id: "gardening", label: "Gardening", icon: Flower2 },
  { id: "gym light", label: "Gym Light", icon: Dumbbell },
  { id: "jogging", label: "Jogging", icon: Footprints },
  { id: "kopi", label: "Kopi", icon: Coffee },
  { id: "movies", label: "Movies", icon: Film },
  { id: "music", label: "Music", icon: Music },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "tech", label: "Tech", icon: Monitor },
  { id: "volunteering", label: "Volunteering", icon: Heart },
];

const ProfileTab = ({ user, clans, displayBio, displayLanguages, displayInterests, displayNeighbourhoods, displayUserId, displayComfortLevel, displayFreeSlots, onUpdate }: ProfileTabProps) => {
  const [editingBio, setEditingBio] = useState(false);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [editingComfort, setEditingComfort] = useState(false);
  const [editingFreeSlots, setEditingFreeSlots] = useState(false);
  
  const [bioText, setBioText] = useState(displayBio);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(displayLanguages);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(displayInterests);
  const [selectedComfort, setSelectedComfort] = useState(displayComfortLevel);
  const [selectedFreeSlots, setSelectedFreeSlots] = useState<string[]>(displayFreeSlots);

  const handleSaveBio = () => {
    onUpdate({ bio: bioText });
    setEditingBio(false);
  };

  const handleSaveLanguages = () => {
    onUpdate({ languages: selectedLanguages });
    setEditingLanguages(false);
  };

  const handleSaveInterests = () => {
    onUpdate({ interests: selectedInterests });
    setEditingInterests(false);
  };

  const handleSaveComfort = () => {
    onUpdate({ comfortLevel: selectedComfort });
    setEditingComfort(false);
  };

  const handleSaveFreeSlots = () => {
    onUpdate({ freeSlots: selectedFreeSlots });
    setEditingFreeSlots(false);
  };

  const toggleLanguage = (id: string) => {
    setSelectedLanguages(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleFreeSlot = (id: string) => {
    setSelectedFreeSlots(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      {/* Bio */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">About</h3>
          <button 
            onClick={() => {
              setBioText(displayBio);
              setEditingBio(true);
            }}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {displayBio || "No bio yet"}
        </p>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Languages</h3>
          </div>
          <button 
            onClick={() => {
              setSelectedLanguages(displayLanguages);
              setEditingLanguages(true);
            }}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayLanguages.length > 0 ? displayLanguages.map((lang) => (
            <span key={lang} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {languageLabels[lang] || lang}
            </span>
          )) : (
            <span className="text-sm text-muted-foreground">No languages selected</span>
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Interests</h3>
          </div>
          <button 
            onClick={() => {
              setSelectedInterests(displayInterests);
              setEditingInterests(true);
            }}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayInterests.length > 0 ? displayInterests.map((interest) => (
            <span key={interest} className="px-3 py-1.5 rounded-full bg-sakura/10 text-sakura text-xs font-medium">
              {interestLabels[interest] || interest}
            </span>
          )) : (
            <span className="text-sm text-muted-foreground">No interests selected</span>
          )}
        </div>
      </div>

      {/* Neighbourhoods */}
      <Link to="/profile/neighbourhoods" className="block bg-white rounded-2xl shadow-soft p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">My Neighbourhoods</h3>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-2">
          {displayNeighbourhoods.length > 0 ? displayNeighbourhoods.map((hood, i) => (
            <div key={hood} className="px-3 py-1.5 rounded-xl bg-pandan/10 text-pandan text-sm font-medium flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-pandan" />
              {neighbourhoodLabels[hood] || hood}
              {i === 0 && <span className="text-[10px] text-pandan/70">(Primary)</span>}
            </div>
          )) : (
            <span className="text-sm text-muted-foreground">No neighbourhoods selected</span>
          )}
        </div>
        <span className="mt-3 text-xs text-primary inline-block">+ Add or edit MRT stations</span>
      </Link>

      {/* Comfort Level */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {displayComfortLevel === 'introvert' && <Moon className="h-4 w-4 text-muted-foreground" />}
            {displayComfortLevel === 'ambivert' && <CloudSun className="h-4 w-4 text-muted-foreground" />}
            {displayComfortLevel === 'extrovert' && <Sun className="h-4 w-4 text-muted-foreground" />}
            <h3 className="font-semibold text-foreground text-sm">Comfort Level</h3>
          </div>
          <button 
            onClick={() => {
              setSelectedComfort(displayComfortLevel);
              setEditingComfort(true);
            }}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-lavender/20 text-lavender text-sm font-medium capitalize flex items-center gap-1.5">
            {displayComfortLevel === 'introvert' && <Moon className="h-3.5 w-3.5" />}
            {displayComfortLevel === 'ambivert' && <CloudSun className="h-3.5 w-3.5" />}
            {displayComfortLevel === 'extrovert' && <Sun className="h-3.5 w-3.5" />}
            {displayComfortLevel}
          </span>
        </div>
      </div>

      {/* Free Time Slots */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Free Time</h3>
          </div>
          <button 
            onClick={() => {
              setSelectedFreeSlots(displayFreeSlots);
              setEditingFreeSlots(true);
            }}
            className="text-xs text-primary hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayFreeSlots.length > 0 ? displayFreeSlots.map(slot => {
            const slotInfo = availableFreeSlots.find(s => s.id === slot);
            return (
              <span key={slot} className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {slotInfo?.label || slot}
              </span>
            );
          }) : (
            <span className="text-sm text-muted-foreground">No free time slots set</span>
          )}
        </div>
      </div>

      {/* SingPass Verified */}
      <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
          <Shield className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">SingPass Verified</p>
          <p className="text-xs text-muted-foreground">
            {displayUserId ? `ID: ${displayUserId}` : "Your identity is verified. No fake accounts here."}
          </p>
        </div>
        <Check className="h-5 w-5 text-pandan" />
      </div>

      {/* Edit Bio Modal */}
      <AnimatePresence>
        {editingBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingBio(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-4">Edit About</h3>
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingBio(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBio}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Languages Modal */}
      <AnimatePresence>
        {editingLanguages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingLanguages(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-4">Select Languages</h3>
              <div className="space-y-2">
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.id);
                  return (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isSelected 
                          ? "bg-primary/10 ring-2 ring-primary" 
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {lang.label}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingLanguages(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLanguages}
                  disabled={selectedLanguages.length === 0}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-40 hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Interests Modal */}
      <AnimatePresence>
        {editingInterests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingInterests(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-md shadow-elevated max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-semibold text-foreground mb-2">Select Your Interests</h3>
              <p className="text-xs text-muted-foreground mb-4">Choose at least 3 interests to help us find your tribe</p>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-sakura text-white"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <interest.icon className="h-4 w-4" />
                      <span>{interest.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {selectedInterests.length} selected
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingInterests(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInterests}
                  disabled={selectedInterests.length < 3}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-40 hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Comfort Level Modal */}
      <AnimatePresence>
        {editingComfort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingComfort(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-2">Comfort Level</h3>
              <p className="text-sm text-muted-foreground mb-4">How do you prefer to socialize?</p>
              <div className="space-y-2">
                {comfortLevels.map((level) => {
                  const isSelected = selectedComfort === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedComfort(level.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-lavender/20 border-2 border-lavender"
                          : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-lavender text-white" : "bg-white text-muted-foreground"
                      }`}>
                        <level.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isSelected ? "text-lavender" : "text-foreground"}`}>
                          {level.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-lavender" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingComfort(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveComfort}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Free Slots Modal */}
      <AnimatePresence>
        {editingFreeSlots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingFreeSlots(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-semibold text-foreground mb-2">Free Time Slots</h3>
              <p className="text-sm text-muted-foreground mb-4">When are you usually available?</p>
              <div className="space-y-2">
                {availableFreeSlots.map((slot) => {
                  const isSelected = selectedFreeSlots.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleFreeSlot(slot.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-amber-50 border-2 border-amber-400"
                          : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`h-4 w-4 ${isSelected ? "text-amber-600" : "text-muted-foreground"}`} />
                        <span className={`font-medium ${isSelected ? "text-amber-700" : "text-foreground"}`}>
                          {slot.label}
                        </span>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingFreeSlots(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFreeSlots}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Groups Tab
interface GroupsTabProps {
  clans: Clan[];
  neighbourhood?: string;
}

const GroupsTab = ({ clans, neighbourhood }: GroupsTabProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
    {/* Neighbourhood Chat */}
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-3">Neighbourhood</h3>
      <Link
        to="/chat"
        className="flex items-center gap-4 bg-white rounded-2xl shadow-soft p-4 hover:shadow-elevated transition-shadow"
      >
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-sakura/20 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{neighbourhood} Community</h4>
          <p className="text-xs text-muted-foreground">245 members • Very active</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-pandan animate-pulse" />
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Link>
    </div>

    {/* Interest Groups */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">Interest Groups</h3>
        <Link to="/explore" className="text-xs text-primary hover:underline">Find more</Link>
      </div>
      <div className="space-y-3">
        {clans.map((clan, i) => (
          <motion.div
            key={clan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 bg-white rounded-2xl shadow-soft p-4 hover:shadow-elevated transition-shadow cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sakura/20 to-lavender/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-sakura" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{clan.name}</h4>
              <p className="text-xs text-muted-foreground">
                {clan.members.length} members • {clan.theme}
              </p>
            </div>
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        ))}
      </div>
    </div>

    {/* Active Event Chats */}
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-3">Active Event Chats</h3>
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground">Board Game Night</h4>
            <p className="text-xs text-muted-foreground">8 members • Ends in 2h</p>
          </div>
          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-medium">
            Temp Chat
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Achievements Tab
interface AchievementsTabProps {
  achievements: typeof userAchievements;
  perks: typeof priorityPerks;
}

const AchievementsTab = ({ achievements, perks }: AchievementsTabProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
    {/* Points Overview */}
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Points</p>
          <p className="text-3xl font-bold text-foreground">{achievements.points.toLocaleString()}</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/60 flex items-center justify-center">
          <Star className="h-7 w-7 text-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-foreground">{achievements.eventsAttended}</p>
          <p className="text-[10px] text-muted-foreground">Events</p>
        </div>
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-foreground">{achievements.connectionssMade}</p>
          <p className="text-[10px] text-muted-foreground">Connections</p>
        </div>
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-foreground">{achievements.goalsCompleted}</p>
          <p className="text-[10px] text-muted-foreground">Goals</p>
        </div>
      </div>
    </div>

    {/* Top Contributor Status */}
    {achievements.rank <= 10 && (
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8" />
          <div>
            <p className="font-semibold">Top 10 Contributor!</p>
            <p className="text-sm text-white/80">You've unlocked priority bookings & partner perks</p>
          </div>
        </div>
      </div>
    )}

    {/* Priority Perks */}
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-3">Priority Perks</h3>
      <div className="grid grid-cols-2 gap-3">
        {perks.map((perk) => (
          <div
            key={perk.id}
            className={`rounded-2xl p-4 ${
              perk.unlocked ? "bg-white shadow-soft" : "bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`h-10 w-10 rounded-xl ${perk.unlocked ? "bg-pandan/10" : "bg-muted"} flex items-center justify-center`}>
                <perk.icon className={`h-5 w-5 ${perk.unlocked ? "text-pandan" : "text-muted-foreground"}`} />
              </div>
              {perk.unlocked ? (
                <Check className="h-5 w-5 text-pandan" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <h4 className={`font-medium text-sm ${perk.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
              {perk.name}
            </h4>
            <p className="text-[10px] text-muted-foreground mt-1">{perk.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* How to Earn */}
    <div className="bg-muted/50 rounded-2xl p-4">
      <h3 className="font-medium text-foreground text-sm mb-2">How to Earn Points</h3>
      <ul className="space-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Attend events (+50 pts)
        </li>
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Complete community goals (+100 pts)
        </li>
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Organize events (+75 pts)
        </li>
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Daily wellness activities (+10 pts)
        </li>
      </ul>
    </div>
  </motion.div>
);

// Admin Tab
interface AdminTabProps {
  goals: CommunityGoal[];
  flaggedContent: { id: string; type: string; preview: string; reporter: string; time: string; severity: string; }[];
  onAddGoal: (goal: Omit<CommunityGoal, "id">) => void;
  onUpdateGoal: (id: string, updates: Partial<CommunityGoal>) => void;
  onEndGoal: (id: string) => void;
  onApproveFlag: (id: string) => void;
  onRejectFlag: (id: string) => void;
  onNavigate: (path: string) => void;
}

const AdminTab = ({ goals, flaggedContent, onAddGoal, onUpdateGoal, onEndGoal, onApproveFlag, onRejectFlag, onNavigate }: AdminTabProps) => {
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CommunityGoal | null>(null);
  const [reviewingItem, setReviewingItem] = useState<{ id: string; preview: string } | null>(null);
  
  // Form state for new/edit goal
  const [goalForm, setGoalForm] = useState({ title: "", target: "", unit: "" });

  const handleCreateGoal = () => {
    if (!goalForm.title || !goalForm.target || !goalForm.unit) return;
    onAddGoal({
      title: goalForm.title,
      current: 0,
      target: parseInt(goalForm.target),
      unit: goalForm.unit,
      active: true,
    });
    setGoalForm({ title: "", target: "", unit: "" });
    setShowCreateGoal(false);
  };

  const handleEditGoal = () => {
    if (!editingGoal || !goalForm.title || !goalForm.target || !goalForm.unit) return;
    onUpdateGoal(editingGoal.id, {
      title: goalForm.title,
      target: parseInt(goalForm.target),
      unit: goalForm.unit,
    });
    setGoalForm({ title: "", target: "", unit: "" });
    setEditingGoal(null);
  };

  const openEditModal = (goal: CommunityGoal) => {
    setGoalForm({ title: goal.title, target: goal.target.toString(), unit: goal.unit });
    setEditingGoal(goal);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 flex items-center gap-3">
        <Shield className="h-6 w-6 text-violet-600" />
        <div>
          <p className="font-medium text-foreground">Neighbourhood Admin</p>
          <p className="text-xs text-muted-foreground">Manage your community</p>
        </div>
      </div>

      {/* Active Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Active Goals</h3>
          <button
            onClick={() => {
              setGoalForm({ title: "", target: "", unit: "" });
              setShowCreateGoal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            + New Goal
          </button>
        </div>
        {goals.filter(g => g.active).length === 0 ? (
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <p className="text-sm text-muted-foreground">No active goals. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.filter(g => g.active).map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pandan/10 text-pandan">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-pandan rounded-full transition-all"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => openEditModal(goal)}
                    className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onEndGoal(goal.id)}
                    className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    End
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ended Goals */}
      {goals.filter(g => !g.active).length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-3">Ended Goals</h3>
          <div className="space-y-3">
            {goals.filter(g => !g.active).map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-pandan/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-pandan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Completed: {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                    Ended
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wellness Dashboard */}
      <div>
        <h3 className="font-semibold text-foreground text-sm mb-3">Community Wellness (Anonymized)</h3>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">4.2</p>
              <p className="text-[10px] text-muted-foreground">Avg Mood</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">67%</p>
              <p className="text-[10px] text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">↑12%</p>
              <p className="text-[10px] text-muted-foreground">Engagement</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("/goals")}
            className="w-full py-2 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center gap-2 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            View Full Dashboard
          </button>
        </div>
      </div>

      {/* Content Moderation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Flagged Content</h3>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-medium">
            {flaggedContent.length} pending
          </span>
        </div>
        {flaggedContent.length === 0 ? (
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <Check className="h-8 w-8 text-pandan mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All clear! No pending reports.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {flaggedContent.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-3 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    item.severity === "high" ? "bg-rose-100" : item.severity === "medium" ? "bg-amber-100" : "bg-muted"
                  }`}>
                    <Flag className={`h-4 w-4 ${
                      item.severity === "high" ? "text-rose-500" : item.severity === "medium" ? "text-amber-500" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.preview}</p>
                    <p className="text-[10px] text-muted-foreground">{item.reporter} • {item.time}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setReviewingItem({ id: item.id, preview: item.preview })}
                    className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Eye className="h-3 w-3" /> Review
                  </button>
                  <button 
                    onClick={() => onApproveFlag(item.id)}
                    className="py-1.5 px-3 rounded-lg bg-pandan/10 text-pandan text-xs font-medium hover:bg-pandan/20 transition-colors"
                    title="Approve (no action needed)"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => onRejectFlag(item.id)}
                    className="py-1.5 px-3 rounded-lg bg-rose-100 text-rose-500 text-xs font-medium hover:bg-rose-200 transition-colors"
                    title="Remove content"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 p-3 bg-muted/50 rounded-xl flex items-center gap-2">
          <Shield className="h-4 w-4 text-violet-500" />
          <p className="text-xs text-muted-foreground">AI moderation is running in background</p>
        </div>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-4">Create New Goal</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal title (e.g., Volunteer Hours)"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="number"
                  placeholder="Target (e.g., 200)"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g., hours, participants)"
                  value={goalForm.unit}
                  onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowCreateGoal(false)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!goalForm.title || !goalForm.target || !goalForm.unit}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-40 hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editingGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingGoal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-4">Edit Goal</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal title"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="number"
                  placeholder="Target"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={goalForm.unit}
                  onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingGoal(null)}
                  className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditGoal}
                  disabled={!goalForm.title || !goalForm.target || !goalForm.unit}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-40 hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setReviewingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-elevated"
            >
              <h3 className="font-semibold text-foreground mb-2">Review Flagged Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reviewingItem.preview}
              </p>
              <div className="p-3 bg-muted/50 rounded-lg mb-4">
                <p className="text-xs text-muted-foreground italic">
                  Full content would be displayed here in a real implementation. Review the content and decide whether to approve (dismiss the flag) or reject (remove the content).
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onApproveFlag(reviewingItem.id);
                    setReviewingItem(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-pandan/10 text-pandan text-sm font-medium hover:bg-pandan/20"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    onRejectFlag(reviewingItem.id);
                    setReviewingItem(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-rose-100 text-rose-500 text-sm font-medium hover:bg-rose-200"
                >
                  Remove
                </button>
              </div>
              <button
                onClick={() => setReviewingItem(null)}
                className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Settings Tab
const SettingsTab = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'everyone' | 'connections' | 'hidden'>('everyone');

  const settingsGroups = [
    {
      title: "Notifications",
      items: [
        { id: "push", label: "Push Notifications", description: "Event reminders, messages", toggle: true, value: notifications, onChange: setNotifications },
        { id: "email", label: "Email Digest", description: "Weekly community updates", toggle: true, value: emailDigest, onChange: setEmailDigest },
      ],
    },
    {
      title: "Privacy",
      items: [
        { id: "location", label: "Location Sharing", description: "Show neighbourhood to others", toggle: true, value: locationSharing, onChange: setLocationSharing },
        { id: "profile", label: "Profile Visibility", description: profileVisibility === 'everyone' ? 'Everyone' : profileVisibility === 'connections' ? 'Connections only' : 'Hidden', link: true, onClick: () => setShowVisibilityModal(true) },
        { id: "data", label: "Your Data", description: "Download or delete your data", link: true, onClick: () => setShowDataModal(true) },
      ],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      {settingsGroups.map((group) => (
        <div key={group.title}>
          <h3 className="font-semibold text-foreground text-sm mb-3">{group.title}</h3>
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {group.items.map((item, i) => (
              <div
                key={item.id}
                onClick={item.link ? item.onClick : undefined}
                className={`flex items-center justify-between p-4 ${
                  i < group.items.length - 1 ? "border-b border-border/40" : ""
                } ${item.link ? "cursor-pointer hover:bg-muted/30 transition-colors" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.toggle ? (
                  <button
                    onClick={() => item.onChange?.(!item.value)}
                    className={`h-6 w-11 rounded-full transition-colors ${
                      item.value ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <motion.div
                      animate={{ x: item.value ? 20 : 2 }}
                      className="h-5 w-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sign Out */}
      <button className="w-full py-3 rounded-xl bg-rose-50 text-rose-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors">
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Kindred v1.0.0</p>
        <p className="mt-1">Made with ❤️ in Singapore</p>
      </div>

      {/* Profile Visibility Modal */}
      <AnimatePresence>
        {showVisibilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVisibilityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose who can see your profile</p>
              <div className="space-y-2">
                {[
                  { value: 'everyone' as const, label: 'Everyone', desc: 'Anyone in the community can see your profile' },
                  { value: 'connections' as const, label: 'Connections Only', desc: 'Only people you\'ve connected with' },
                  { value: 'hidden' as const, label: 'Hidden', desc: 'Your profile is not visible to others' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setProfileVisibility(option.value);
                      setShowVisibilityModal(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      profileVisibility === option.value
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Your Data Modal */}
      <AnimatePresence>
        {showDataModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDataModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Your Data</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage your personal data</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert('Your data download has been initiated. You will receive an email with a download link within 24 hours.');
                    setShowDataModal(false);
                  }}
                  className="w-full p-3 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download My Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                      alert('Your data deletion request has been submitted. Your account will be deleted within 30 days.');
                      setShowDataModal(false);
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-rose-50 text-rose-500 font-medium text-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete My Data
                </button>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="w-full p-3 rounded-xl bg-muted text-muted-foreground font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;