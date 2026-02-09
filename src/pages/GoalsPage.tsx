import { motion } from "framer-motion";
import { Target, Trophy, TrendingUp, Users, Flame, Medal, ChevronRight, Footprints } from "lucide-react";
import { usePulseData, useClans } from "@/hooks/use-data";

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  icon: string;
  gradient: string;
}

const neighborhoodGoals: Goal[] = [
  {
    id: "g1",
    title: "Community Walk Challenge",
    description: "Let's walk 500km together this month!",
    target: 500,
    current: 342,
    unit: "km",
    deadline: "Feb 28",
    icon: "🚶",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "g2",
    title: "Wellness Minutes",
    description: "1000 minutes of meditation as a community",
    target: 1000,
    current: 756,
    unit: "min",
    deadline: "Feb 28",
    icon: "🧘",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "g3",
    title: "Social Connections",
    description: "100 new friendships made",
    target: 100,
    current: 67,
    unit: "connections",
    deadline: "Feb 28",
    icon: "🤝",
    gradient: "from-rose-500 to-pink-500",
  },
];

const leaderboard = [
  { rank: 1, name: "Jurong Foodies", points: 2450, trend: "up", badge: "🥇" },
  { rank: 2, name: "Bedok Buddies", points: 2180, trend: "up", badge: "🥈" },
  { rank: 3, name: "Tampines Clan", points: 1920, trend: "down", badge: "🥉" },
  { rank: 4, name: "Bishan Kakis", points: 1750, trend: "up", badge: "" },
  { rank: 5, name: "Yishun Squad", points: 1680, trend: "same", badge: "" },
  { rank: 6, name: "Sengkang Circle", points: 1540, trend: "down", badge: "" },
  { rank: 7, name: "Clementi Crew", points: 1320, trend: "up", badge: "" },
  { rank: 8, name: "Woodlands Gang", points: 1180, trend: "same", badge: "" },
];

const rewards = [
  { title: "Gym Priority Access", desc: "Skip the queue this month", icon: "💪", claimed: false },
  { title: "Pool Pass", desc: "Free swimming for the week", icon: "🏊", claimed: true },
  { title: "$10 Voucher", desc: "Use at partner cafes", icon: "☕", claimed: false },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const GoalsPage = () => {
  const pulseData = usePulseData();
  const totalActive = pulseData.reduce((a, p) => a + p.active_today, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />

        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-600">Goals & Leaderboard</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Achieve together
            </h1>
            <p className="text-muted-foreground">Neighborhood goals and clan competitions</p>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Stats */}
        <motion.div {...fade(0.1)} className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalActive}</p>
                <p className="text-xs text-muted-foreground">Active today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Active goals</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Clans competing</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Medal className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Rewards earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Neighborhood Goals */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div {...fade(0.15)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Neighborhood goals</h2>
                <span className="text-sm text-muted-foreground">February 2026</span>
              </div>
              <div className="space-y-4">
                {neighborhoodGoals.map((goal, i) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                      className="bg-white rounded-2xl shadow-elevated p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${goal.gradient} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-foreground">{goal.title}</h3>
                            <span className="text-xs text-muted-foreground">Ends {goal.deadline}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                          <span className={`font-bold ${progress >= 100 ? "text-pandan" : "text-primary"}`}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            className={`h-full rounded-full bg-gradient-to-r ${goal.gradient}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Your contribution */}
            <motion.div {...fade(0.3)} className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <Footprints className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Your contribution</h3>
                  <p className="text-sm opacity-90">You've walked 12.5km this week!</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">12.5</p>
                  <p className="text-sm opacity-90">km walked</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column - Leaderboard & Rewards */}
          <div className="space-y-6">
            {/* Clan Leaderboard */}
            <motion.div {...fade(0.2)} className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Clan leaderboard</h2>
                <button className="text-sm text-primary font-medium hover:underline">Full list</button>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((clan, i) => (
                  <motion.div
                    key={clan.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      clan.rank <= 3 ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-muted/50"
                    }`}
                  >
                    <span className="w-8 text-center font-bold text-foreground">
                      {clan.badge || `#${clan.rank}`}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{clan.name}</p>
                      <p className="text-xs text-muted-foreground">{clan.points.toLocaleString()} pts</p>
                    </div>
                    {clan.trend === "up" && <TrendingUp className="h-4 w-4 text-pandan" />}
                    {clan.trend === "down" && <TrendingUp className="h-4 w-4 text-destructive rotate-180" />}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Rewards */}
            <motion.div {...fade(0.35)} className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Rewards</h2>
                <span className="text-sm text-muted-foreground">Top 10 clans</span>
              </div>
              <div className="space-y-3">
                {rewards.map((reward, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      reward.claimed ? "bg-pandan/10" : "bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{reward.title}</p>
                      <p className="text-xs text-muted-foreground">{reward.desc}</p>
                    </div>
                    {reward.claimed ? (
                      <span className="px-2 py-1 rounded-lg bg-pandan text-white text-xs font-medium">
                        Claimed
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming event */}
            <motion.div {...fade(0.4)} className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
              <p className="text-xs font-medium uppercase opacity-75 mb-2">Upcoming event</p>
              <h3 className="font-bold text-lg mb-2">Inter-Clan Sports Day</h3>
              <p className="text-sm opacity-90 mb-4">
                Join your clan for badminton, table tennis, and more!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Feb 15, 2026</span>
                <button className="px-4 py-2 rounded-lg bg-white/20 text-sm font-medium hover:bg-white/30 transition-colors">
                  Register
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
