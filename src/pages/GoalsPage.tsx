import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, Footprints, Brain, Handshake, Medal, Dumbbell, Waves, Coffee, Flame, Target, Users, Award, Check, Crown, type LucideIcon } from "lucide-react";
import { usePulseData } from "@/hooks/use-data";
import { useCommunityGoals } from "@/hooks/use-community-goals";

// Icon mapping for goal types
const getGoalIcon = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("walk") || lowerTitle.includes("step")) return Footprints;
  if (lowerTitle.includes("wellness") || lowerTitle.includes("meditation") || lowerTitle.includes("mental")) return Brain;
  if (lowerTitle.includes("connection") || lowerTitle.includes("friend") || lowerTitle.includes("social")) return Handshake;
  if (lowerTitle.includes("volunteer")) return Users;
  if (lowerTitle.includes("fitness") || lowerTitle.includes("gym") || lowerTitle.includes("exercise")) return Dumbbell;
  return Target;
};

const leaderboard = [
  { rank: 1, name: "Jurong Foodies", points: 2450, trend: "up" },
  { rank: 2, name: "Bedok Buddies", points: 2180, trend: "up" },
  { rank: 3, name: "Tampines Clan", points: 1920, trend: "down" },
  { rank: 4, name: "Bishan Kakis", points: 1750, trend: "up" },
  { rank: 5, name: "Yishun Squad", points: 1680, trend: "same" },
];

interface Reward {
  title: string;
  desc: string;
  icon: LucideIcon;
  claimed: boolean;
}

const rewards: Reward[] = [
  { title: "Gym Priority Access", desc: "Skip the queue this month", icon: Dumbbell, claimed: false },
  { title: "Pool Pass", desc: "Free swimming for the week", icon: Waves, claimed: true },
  { title: "$10 Voucher", desc: "Use at partner cafes", icon: Coffee, claimed: false },
];

const GoalsPage = () => {
  const pulseData = usePulseData();
  const { activeGoals, goals } = useCommunityGoals();
  const endedGoals = goals.filter(g => !g.active);
  const totalActive = pulseData.reduce((a, p) => a + p.active_today, 0);

  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered(true);
    // In a real app, this would call an API
  };

  return (
    <div className="min-h-screen px-8 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm mb-1">Goals & Leaderboard</p>
        <h1 className="text-3xl text-foreground">Achieve together</h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">{totalActive} active today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-pandan" />
          </div>
          <span className="text-muted-foreground">{activeGoals.length} active goal{activeGoals.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-lavender" />
          </div>
          <span className="text-muted-foreground">8 clans competing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-sakura/10 flex items-center justify-center">
            <Award className="h-4 w-4 text-sakura" />
          </div>
          <span className="text-muted-foreground">2 rewards earned</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Goals */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-foreground">Active Goals</h2>
              <span className="text-xs text-muted-foreground">February 2026</span>
            </div>
            {activeGoals.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-soft p-5 text-center">
                <p className="text-sm text-muted-foreground">No active goals right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal, i) => {
                  const progress = (goal.current / goal.target) * 100;
                  const GoalIcon = getGoalIcon(goal.title);
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                      className="bg-white rounded-2xl shadow-soft p-5"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <GoalIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-medium text-foreground text-sm">{goal.title}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pandan/10 text-pandan">Active</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Target: {goal.target.toLocaleString()} {goal.unit}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                          </span>
                          <span className={`font-medium ${progress >= 100 ? "text-pandan" : "text-primary"}`}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Ended Goals */}
          {endedGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h2 className="font-serif text-xl text-foreground mb-4">Completed Goals</h2>
              <div className="space-y-3">
                {endedGoals.map((goal, i) => {
                  const GoalIcon = getGoalIcon(goal.title);
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      className="bg-white rounded-2xl shadow-soft p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-pandan/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-pandan" />
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                          <GoalIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Completed: {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">Ended</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Middle - Leaderboard */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg text-foreground">Clan leaderboard</h2>
              <button className="text-xs text-primary font-medium hover:underline">Full list</button>
            </div>

            {/* Podium for Top 3 */}
            <div className="relative pt-6 pb-2 px-2">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/5 to-transparent rounded-b-xl" />

              <div className="flex items-end justify-center gap-3 mb-4 h-48 relative z-10">
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-4 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-lg transform translate-y-2">
                      <span className="text-2xl">🥪</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-400 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white z-10">2</div>
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-xs font-bold text-foreground truncate w-full">{leaderboard[1].name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{leaderboard[1].points} pts</p>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-50 rounded-t-lg border-t border-x border-slate-300 shadow-sm relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-y-12 transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center gap-2 w-1/3 z-20 -mx-1">
                  <div className="relative mb-1">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="h-20 w-20 rounded-full border-4 border-yellow-300 overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center shadow-xl ring-4 ring-white/50">
                      <span className="text-4xl">🍜</span>
                    </div>
                    <div className="absolute -bottom-2 -right-0 h-7 w-7 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white z-10">1</div>
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-sm font-bold text-foreground truncate w-full">{leaderboard[0].name}</p>
                    <p className="text-xs text-yellow-600 font-bold">{leaderboard[0].points} pts</p>
                  </div>
                  <div className="w-full h-28 bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-50 rounded-t-lg border-t border-x border-yellow-300 shadow-md relative group overflow-hidden flex items-end justify-center pb-3">
                    <TrendingUp className="h-5 w-5 text-yellow-600 drop-shadow-sm" />
                    <div className="absolute inset-0 bg-white/40 skew-y-12 transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000 delay-100" />
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-4 border-amber-700/20 overflow-hidden bg-amber-50 flex items-center justify-center shadow-lg transform translate-y-2">
                      <span className="text-2xl">🏃</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white z-10">3</div>
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-xs font-bold text-foreground truncate w-full">{leaderboard[2].name}</p>
                    <p className="text-[10px] text-amber-700/70 font-medium">{leaderboard[2].points} pts</p>
                  </div>
                  <div className="w-full h-14 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 rounded-t-lg border-t border-x border-amber-300 shadow-sm relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-y-12 transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000 delay-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of the list */}
            <div className="space-y-3">
              {leaderboard.slice(3).map((clan, i) => (
                <motion.div
                  key={clan.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-transparent hover:border-muted-foreground/10 hover:bg-muted/50 transition-all"
                >
                  <span className="mobile-touch-target font-medium text-muted-foreground text-xs w-6 text-center">#{clan.rank}</span>
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-sm border border-muted">
                    {i === 0 ? "🏸" : "🧘"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{clan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">{clan.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">pts</p>
                  </div>
                  <div className="w-6 flex justify-end">
                    {clan.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-pandan" />}
                    {clan.trend === "down" && <TrendingUp className="h-3.5 w-3.5 text-destructive rotate-180" />}
                    {clan.trend === "same" && <div className="h-1 w-2 bg-muted-foreground/30 rounded-full" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Event */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-lavender/10 rounded-2xl p-5"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Upcoming event</p>
            <h3 className="font-medium text-foreground text-sm mb-1">Inter-Clan Sports Day</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Badminton, table tennis and more!
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Feb 15, 2026</span>
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isRegistered
                  ? "bg-pandan/20 text-pandan cursor-default"
                  : "bg-lavender/20 text-lavender hover:bg-lavender/30"
                  }`}
              >
                {isRegistered ? "Registered ✓" : "Register"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right - Your Stats */}
        <div className="space-y-5">
          {/* Your contribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-pandan/10 rounded-2xl p-5"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-pandan/20 flex items-center justify-center">
                  <Footprints className="h-5 w-5 text-pandan" />
                </div>
                <h3 className="font-medium text-foreground text-sm">Your contribution</h3>
              </div>
              <div>
                <p className="text-2xl font-medium text-foreground">12.5 <span className="text-sm font-normal text-muted-foreground">km</span></p>
                <p className="text-xs text-muted-foreground">walked this week</p>
              </div>
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-foreground">Rewards</h2>
              <span className="text-[10px] text-muted-foreground">Top 10 clans</span>
            </div>
            <div className="space-y-2">
              {rewards.map((reward, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${reward.claimed ? "bg-pandan/10" : "bg-muted/50"
                    }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <reward.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{reward.title}</p>
                    <p className="text-[10px] text-muted-foreground">{reward.desc}</p>
                  </div>
                  {reward.claimed ? (
                    <span className="px-2 py-0.5 rounded-full bg-pandan text-white text-[10px] font-medium">
                      Claimed
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div >
  );
};

export default GoalsPage;
