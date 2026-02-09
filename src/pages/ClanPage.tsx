import { motion } from "framer-motion";
import { Target, Camera, MapPin, Clock, Users, ChefHat, Footprints } from "lucide-react";

const members = [
  { initials: "AH", color: "bg-sakura-light" },
  { initials: "WL", color: "bg-pandan-light" },
  { initials: "SR", color: "bg-muted" },
  { initials: "JT", color: "bg-sakura-light" },
  { initials: "MK", color: "bg-pandan-light" },
  { initials: "PL", color: "bg-muted" },
  { initials: "RN", color: "bg-sakura-light" },
  { initials: "YS", color: "bg-pandan-light" },
];

const upcomingActivities = [
  { name: "Hawker trail at Old Airport Rd", icon: ChefHat, time: "Tomorrow, 11 am", people: 4 },
  { name: "Morning walk at Jurong Lake", icon: Footprints, time: "Sat, 7:30 am", people: 6 },
  { name: "Phone photography swap", icon: Camera, time: "Sun, 3 pm", people: 3 },
];

const memories = [
  { label: "Kopi morning", gradient: "from-sakura-light to-sakura/30", emoji: "☕" },
  { label: "Laksa cookoff", gradient: "from-pandan-light to-pandan/30", emoji: "🍜" },
  { label: "Garden stroll", gradient: "from-pandan-light to-sakura-light/40", emoji: "🌿" },
  { label: "Sunset bench", gradient: "from-sakura-light to-pandan-light/30", emoji: "🌅" },
  { label: "Sketch session", gradient: "from-muted to-sakura-light/30", emoji: "✏️" },
  { label: "Roti prata night", gradient: "from-sakura-light to-pandan-light/20", emoji: "🫓" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const ClanPage = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg px-5 pt-14">
        {/* Clan Header */}
        <motion.div {...fade(0)} className="rounded-3xl bg-card/80 backdrop-blur-xl border border-border/40 shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.06)] p-6 mb-6">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sakura-light to-pandan-light flex items-center justify-center text-2xl shrink-0">
              🍲
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Jurong Foodies</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Est. 2024 · Jurong West & East</p>
            </div>
          </div>

          {/* Weekly goal */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-pandan-light/50 px-4 py-3">
            <Target className="h-4 w-4 text-pandan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Weekly goal: 3 meetups</p>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-card">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-pandan to-pandan/60 transition-all duration-700" />
              </div>
            </div>
            <span className="text-xs font-medium text-pandan">2/3</span>
          </div>

          {/* Members grid */}
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Members</p>
            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <motion.div
                  key={m.initials}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
                  className={`h-10 w-10 rounded-full ${m.color} flex items-center justify-center text-xs font-medium text-foreground/60 border border-border/30`}
                >
                  {m.initials}
                </motion.div>
              ))}
              <div className="h-10 w-10 rounded-full bg-muted/50 border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                +
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Micro-Activities */}
        <motion.div {...fade(0.15)}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">Coming up</h2>
          <div className="space-y-3 mb-8">
            {upcomingActivities.map((act, i) => (
              <motion.div
                key={act.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/40 p-4 transition-all duration-300 hover:shadow-md hover:shadow-foreground/[0.03]"
              >
                <div className="h-10 w-10 rounded-xl bg-sakura-light/60 flex items-center justify-center shrink-0">
                  <act.icon className="h-4.5 w-4.5 text-sakura" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{act.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{act.time}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />{act.people}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Memory Wall */}
        <motion.div {...fade(0.35)}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">Memory wall</h2>
          <p className="text-sm text-muted-foreground mb-4">One moment from each meet ✨</p>
          <div className="grid grid-cols-3 gap-2.5">
            {memories.map((mem, i) => (
              <motion.div
                key={mem.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${mem.gradient} border border-border/30 flex flex-col items-center justify-center gap-1.5 p-2 transition-transform duration-300 hover:scale-[1.03]`}
              >
                <span className="text-2xl">{mem.emoji}</span>
                <span className="text-[10px] font-medium text-foreground/50 text-center leading-tight">{mem.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClanPage;
