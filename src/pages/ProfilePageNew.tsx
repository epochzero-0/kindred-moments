import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Settings, Award, Trophy, Users, MapPin, Languages, Heart,
  ChevronRight, Bell, Lock, Globe, LogOut, Shield, BarChart3,
  Calendar, MessageCircle, Star, Zap, Building, Waves, Dumbbell,
  Gift, Crown, Flag, Eye, EyeOff, Check, X, Edit2, Camera
} from "lucide-react";
import { useCurrentUser, useClans, usePulseData, useUsers } from "@/hooks/use-data";
import { Link } from "react-router-dom";

type ProfileTab = "profile" | "groups" | "achievements" | "leaderboard" | "admin" | "settings";

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

const neighbourhoodLeaderboard = [
  { rank: 1, name: "Punggol", points: 12450, change: 0 },
  { rank: 2, name: "Sengkang", points: 11200, change: 1 },
  { rank: 3, name: "Bedok", points: 10800, change: -1 },
  { rank: 4, name: "Tampines", points: 9500, change: 2 },
  { rank: 5, name: "Jurong East", points: 8900, change: 0 },
  { rank: 6, name: "Woodlands", points: 8400, change: -2 },
  { rank: 7, name: "Ang Mo Kio", points: 7800, change: 1 },
  { rank: 8, name: "Clementi", points: 7200, change: -1 },
];

const communityGoals = [
  { id: "g1", title: "Volunteer Hours", current: 127, target: 200, unit: "hours", active: true },
  { id: "g2", title: "Community Clean-up", current: 45, target: 50, unit: "participants", active: true },
  { id: "g3", title: "Wellness Challenge", current: 2400000, target: 5000000, unit: "steps", active: true },
];

const flaggedContent = [
  { id: "f1", type: "message", preview: "Inappropriate language in...", reporter: "AI Auto-flag", time: "2h ago", severity: "medium" },
  { id: "f2", type: "event", preview: "Suspicious event details...", reporter: "User Report", time: "5h ago", severity: "low" },
];

const ProfilePage = () => {
  const currentUser = useCurrentUser();
  const clans = useClans();
  const pulseData = usePulseData();
  const allUsers = useUsers();
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [isAdmin] = useState(true); // Mock admin status

  const userClans = clans.filter(c => 
    currentUser?.joined_clans?.includes(c.id) || c.members.includes(currentUser?.id || "")
  ).slice(0, 5);

  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const connectionCount = allUsers.filter(u => u.neighbourhood === currentUser?.neighbourhood).length - 1;

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "groups" as const, label: "Groups", icon: Users },
    { id: "achievements" as const, label: "Rewards", icon: Award },
    { id: "leaderboard" as const, label: "Ranks", icon: Trophy },
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
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-sakura flex items-center justify-center text-2xl font-bold text-white shadow-elevated">
              {currentUser?.name?.split(" ").map(n => n[0]).join("") || "?"}
            </div>
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
                {currentUser?.name || "Loading..."}
              </h1>
              <button className="h-6 w-6 rounded-full hover:bg-white/50 flex items-center justify-center">
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currentUser?.neighbourhood || "..."}</span>
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
            <span className="text-xs font-medium text-foreground">Rank #{userAchievements.rank}</span>
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
            <ProfileTab key="profile" user={currentUser} clans={userClans} />
          )}
          {activeTab === "groups" && (
            <GroupsTab key="groups" clans={userClans} neighbourhood={currentUser?.neighbourhood} />
          )}
          {activeTab === "achievements" && (
            <AchievementsTab key="achievements" achievements={userAchievements} perks={priorityPerks} />
          )}
          {activeTab === "leaderboard" && (
            <LeaderboardTab 
              key="leaderboard" 
              neighbourhoods={neighbourhoodLeaderboard} 
              userNeighbourhood={currentUser?.neighbourhood}
              userRank={userAchievements.rank}
            />
          )}
          {activeTab === "admin" && isAdmin && (
            <AdminTab key="admin" goals={communityGoals} flaggedContent={flaggedContent} />
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
  clans: ReturnType<typeof useClans>;
}

const ProfileTab = ({ user, clans }: ProfileTabProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
    {/* Bio */}
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground text-sm">About</h3>
        <button className="text-xs text-primary">Edit</button>
      </div>
      <p className="text-sm text-muted-foreground">
        Loves morning walks and trying new hawker food. Always up for a good board game session! 🎲
      </p>
    </div>

    {/* Languages */}
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">Languages</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {user?.languages?.map((lang) => (
          <span key={lang} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
            {lang}
          </span>
        ))}
      </div>
    </div>

    {/* Interests */}
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">Interests</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {user?.interests?.map((interest) => (
          <span key={interest} className="px-3 py-1.5 rounded-full bg-sakura/10 text-sakura text-xs font-medium">
            {interest}
          </span>
        ))}
      </div>
    </div>

    {/* Neighbourhoods */}
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">My Neighbourhoods</h3>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-xl bg-pandan/10 text-pandan text-sm font-medium flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-pandan" />
          {user?.neighbourhood}
          <span className="text-[10px] text-pandan/70">(Primary)</span>
        </div>
      </div>
      <button className="mt-3 text-xs text-primary hover:underline">+ Add another MRT station</button>
    </div>

    {/* SingPass Verified */}
    <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
        <Shield className="h-5 w-5 text-red-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">SingPass Verified</p>
        <p className="text-xs text-muted-foreground">Your identity is verified. No fake accounts here.</p>
      </div>
      <Check className="h-5 w-5 text-pandan ml-auto" />
    </div>
  </motion.div>
);

// Groups Tab
interface GroupsTabProps {
  clans: ReturnType<typeof useClans>;
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

// Leaderboard Tab
interface LeaderboardTabProps {
  neighbourhoods: typeof neighbourhoodLeaderboard;
  userNeighbourhood?: string;
  userRank: number;
}

const LeaderboardTab = ({ neighbourhoods, userNeighbourhood, userRank }: LeaderboardTabProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
    {/* Your Rank */}
    <div className="bg-gradient-to-br from-primary/10 to-sakura/10 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Your Personal Rank</p>
          <p className="text-2xl font-bold text-foreground">#{userRank}</p>
          <p className="text-xs text-muted-foreground">out of 245 in {userNeighbourhood}</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/60 flex items-center justify-center">
          <Trophy className="h-7 w-7 text-primary" />
        </div>
      </div>
    </div>

    {/* Neighbourhood Rankings */}
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-3">Neighbourhood Leaderboard</h3>
      <div className="space-y-2">
        {neighbourhoods.map((n, i) => {
          const isUser = n.name === userNeighbourhood;
          return (
            <motion.div
              key={n.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                isUser ? "bg-primary/10 ring-2 ring-primary" : "bg-white shadow-soft"
              }`}
            >
              {/* Rank */}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  n.rank === 1
                    ? "bg-yellow-100 text-yellow-600"
                    : n.rank === 2
                    ? "bg-gray-100 text-gray-500"
                    : n.rank === 3
                    ? "bg-orange-100 text-orange-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {n.rank}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${isUser ? "text-primary" : "text-foreground"}`}>
                  {n.name} {isUser && "(You)"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{n.points.toLocaleString()}</p>
                <p className={`text-[10px] ${
                  n.change > 0 ? "text-pandan" : n.change < 0 ? "text-rose-500" : "text-muted-foreground"
                }`}>
                  {n.change > 0 ? `↑${n.change}` : n.change < 0 ? `↓${Math.abs(n.change)}` : "—"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.div>
);

// Admin Tab
interface AdminTabProps {
  goals: typeof communityGoals;
  flaggedContent: typeof flaggedContent;
}

const AdminTab = ({ goals, flaggedContent }: AdminTabProps) => {
  const [showCreateGoal, setShowCreateGoal] = useState(false);

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

      {/* Community Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Community Goals</h3>
          <button
            onClick={() => setShowCreateGoal(true)}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium"
          >
            + New Goal
          </button>
        </div>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  goal.active ? "bg-pandan/10 text-pandan" : "bg-muted text-muted-foreground"
                }`}>
                  {goal.active ? "Active" : "Ended"}
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
                <button className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground">
                  Edit
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground">
                  End
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <button className="w-full py-2 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
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
                <button className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" /> Review
                </button>
                <button className="py-1.5 px-3 rounded-lg bg-pandan/10 text-pandan text-xs font-medium">
                  <Check className="h-3 w-3" />
                </button>
                <button className="py-1.5 px-3 rounded-lg bg-rose-100 text-rose-500 text-xs font-medium">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-muted/50 rounded-xl flex items-center gap-2">
          <Shield className="h-4 w-4 text-violet-500" />
          <p className="text-xs text-muted-foreground">AI moderation is running in background</p>
        </div>
      </div>
    </motion.div>
  );
};

// Settings Tab
const SettingsTab = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const settingsGroups = [
    {
      title: "Notifications",
      items: [
        { id: "push", label: "Push Notifications", description: "Event reminders, messages", toggle: true, value: notifications, onChange: setNotifications },
        { id: "email", label: "Email Digest", description: "Weekly community updates", toggle: true, value: true },
      ],
    },
    {
      title: "Privacy",
      items: [
        { id: "location", label: "Location Sharing", description: "Show neighbourhood to others", toggle: true, value: locationSharing, onChange: setLocationSharing },
        { id: "profile", label: "Profile Visibility", description: "Who can see your profile", link: true },
        { id: "data", label: "Your Data", description: "Download or delete your data", link: true },
      ],
    },
    {
      title: "Preferences",
      items: [
        { id: "language", label: "Language", description: "English", link: true },
        { id: "neighbourhoods", label: "Manage Neighbourhoods", description: "Add or remove MRT stations", link: true },
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
                className={`flex items-center justify-between p-4 ${
                  i < group.items.length - 1 ? "border-b border-border/40" : ""
                }`}
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
    </motion.div>
  );
};

export default ProfilePage;
