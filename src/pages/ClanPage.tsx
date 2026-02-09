import { motion } from "framer-motion";
import { Clock, Users, ChefHat, Footprints, Camera, Plus, ArrowRight, Target, Trophy, Coffee, Soup, Leaf, Sunset, type LucideIcon } from "lucide-react";

const members = [
  { initials: "AH" }, { initials: "WL" }, { initials: "SR" }, { initials: "JT" },
  { initials: "MK" }, { initials: "PL" }, { initials: "RN" }, { initials: "YS" },
];

const upcomingActivities = [
  { name: "Hawker trail at Old Airport Rd", icon: ChefHat, time: "Tomorrow, 11am", people: 4 },
  { name: "Morning walk at Jurong Lake", icon: Footprints, time: "Sat, 7:30am", people: 6 },
  { name: "Phone photography swap", icon: Camera, time: "Sun, 3pm", people: 3 },
];

interface Memory {
  label: string;
  icon: LucideIcon;
}

const memories: Memory[] = [
  { label: "Kopi morning", icon: Coffee },
  { label: "Laksa cookoff", icon: Soup },
  { label: "Garden stroll", icon: Leaf },
  { label: "Sunset bench", icon: Sunset },
];

const ClanPage = () => {
  return (
    <div className="min-h-screen px-8 py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-sakura to-lavender flex items-center justify-center shadow-sm">
            <Soup className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Jurong Foodies</h1>
            <p className="text-sm text-muted-foreground">Jurong West & East · 8 members</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-6 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-pandan" />
          </div>
          <span className="text-muted-foreground">2/3 weekly goal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">12 meetups</span>
        </div>
        <button className="ml-auto text-sm text-primary font-medium hover:underline flex items-center gap-1">
          Schedule meetup <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Members */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Members</p>
              <button className="text-xs text-primary font-medium hover:underline">Invite</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {members.map((m, i) => (
                <motion.div
                  key={m.initials}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + i * 0.03 }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/70 to-sakura/70 flex items-center justify-center text-[10px] font-semibold text-white"
                >
                  {m.initials}
                </motion.div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </motion.div>

        {/* Right - Activities & Memories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Coming up</p>
              <button className="text-xs text-primary font-medium hover:underline">See all</button>
            </div>
            <div className="space-y-3">
              {upcomingActivities.map((act, i) => (
                <motion.div
                  key={act.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                  className="group flex items-center gap-4 bg-white rounded-2xl shadow-soft p-4 card-hover cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <act.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {act.name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{act.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{act.people}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-pandan/10 text-pandan text-xs font-medium opacity-0 group-hover:opacity-100 transition-all hover:bg-pandan hover:text-white">
                    Join
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Memories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Memory wall</p>
              <button className="text-xs text-primary font-medium hover:underline">Add photo</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {memories.map((mem, i) => (
                <motion.div
                  key={mem.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.04 }}
                  className="aspect-square bg-white rounded-xl shadow-soft flex flex-col items-center justify-center gap-1.5 p-3 card-hover cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <mem.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{mem.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClanPage;
