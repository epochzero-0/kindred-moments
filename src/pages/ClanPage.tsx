import { motion } from "framer-motion";
import { Target, Camera, Clock, Users, ChefHat, Footprints, ArrowRight, Plus, Trophy, Calendar } from "lucide-react";

const members = [
  { initials: "AH", gradient: "from-rose-400 to-pink-500" },
  { initials: "WL", gradient: "from-emerald-400 to-teal-500" },
  { initials: "SR", gradient: "from-blue-400 to-indigo-500" },
  { initials: "JT", gradient: "from-amber-400 to-orange-500" },
  { initials: "MK", gradient: "from-purple-400 to-violet-500" },
  { initials: "PL", gradient: "from-cyan-400 to-blue-500" },
  { initials: "RN", gradient: "from-pink-400 to-rose-500" },
  { initials: "YS", gradient: "from-teal-400 to-emerald-500" },
];

const upcomingActivities = [
  { name: "Hawker trail at Old Airport Rd", icon: ChefHat, time: "Tomorrow, 11 am", people: 4, gradient: "from-orange-500 to-red-500" },
  { name: "Morning walk at Jurong Lake", icon: Footprints, time: "Sat, 7:30 am", people: 6, gradient: "from-emerald-500 to-teal-500" },
  { name: "Phone photography swap", icon: Camera, time: "Sun, 3 pm", people: 3, gradient: "from-violet-500 to-purple-500" },
];

const memories = [
  { label: "Kopi morning", emoji: "☕" },
  { label: "Laksa cookoff", emoji: "🍜" },
  { label: "Garden stroll", emoji: "🌿" },
  { label: "Sunset bench", emoji: "🌅" },
  { label: "Sketch session", emoji: "✏️" },
  { label: "Roti prata night", emoji: "🫓" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const ClanPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)} className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Clan avatar */}
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-400 via-rose-500 to-pink-500 flex items-center justify-center text-5xl shadow-2xl shadow-rose-500/25">
              🍲
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Jurong Foodies</h1>
                <span className="px-3 py-1 rounded-full bg-pandan/10 text-pandan text-xs font-semibold">Active</span>
              </div>
              <p className="text-muted-foreground">Est. 2024 · Jurong West & East · 8 members</p>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity">
              <Calendar className="h-5 w-5" />
              Schedule meetup
            </button>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Stats cards */}
        <motion.div {...fade(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pandan to-emerald-400 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Weekly goal</p>
                  <span className="text-sm font-bold text-pandan">2/3</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-pandan to-emerald-400 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Total meetups</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Active members</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Members */}
          <motion.div {...fade(0.15)} className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">Members</h2>
                <button className="text-sm text-primary font-medium hover:underline">Invite</button>
              </div>
              <div className="space-y-3">
                {members.map((m, i) => (
                  <motion.div
                    key={m.initials}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.03 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                      {m.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Member {m.initials}</p>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </motion.div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Add member</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right column - Activities & Memories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Activities */}
            <motion.div {...fade(0.2)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Coming up</h2>
                <button className="text-sm text-primary font-medium hover:underline">See all</button>
              </div>
              <div className="space-y-3">
                {upcomingActivities.map((act, i) => (
                  <motion.div
                    key={act.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                    className="group flex items-center gap-4 bg-white rounded-2xl shadow-elevated p-5 transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-0.5"
                  >
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${act.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                      <act.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground truncate">{act.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />{act.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />{act.people} going
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all">
                      Join
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Memory Wall */}
            <motion.div {...fade(0.35)}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Memory wall</h2>
                  <p className="text-sm text-muted-foreground">One moment from each meet</p>
                </div>
                <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  Add photo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {memories.map((mem, i) => (
                  <motion.div
                    key={mem.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.04 }}
                    className="aspect-square bg-white rounded-2xl shadow-elevated flex flex-col items-center justify-center gap-2 p-3 transition-all duration-200 hover:shadow-elevated-lg hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="text-3xl">{mem.emoji}</span>
                    <span className="text-xs font-medium text-muted-foreground text-center leading-tight">{mem.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClanPage;
