import { motion } from "framer-motion";
import { MapPin, Clock, Train, Check, Heart } from "lucide-react";

const TrioMatch = () => {
  const members = [
    { initials: "JW", name: "Jan" },
    { initials: "SL", name: "Sara" },
    { initials: "MR", name: "Maya" },
  ];

  return (
    <div className="min-h-screen px-8 py-10 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm mb-1">Trio Match</p>
        <h1 className="text-3xl text-foreground">A small moment, just for you</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left - Trio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trio Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-4">Your trio</p>
            <div className="flex items-center gap-3 mb-4">
              {members.map((m, i) => (
                <motion.div
                  key={m.initials}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/80 to-sakura flex items-center justify-center text-sm font-semibold text-white">
                    {m.initials}
                  </div>
                  <span className="text-xs font-medium text-foreground mt-1.5">{m.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-[13px] text-muted-foreground flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-sakura" />
              Shared interests: slow mornings, film photography, local food
            </p>
          </motion.div>

          {/* Safety */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Safe & comfortable</p>
            <div className="space-y-2">
              {["Public place", "Small group of 3", "Easy exit options"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-foreground/80">
                  <Check className="h-3.5 w-3.5 text-pandan" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-sakura to-lavender" />
            
            <div className="p-6">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Suggested</p>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Afternoon kopi & a slow chat ☕
              </h2>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-sakura/10 text-sakura flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Blk 78 kopitiam, Toa Payoh</p>
                    <p className="text-[11px] text-muted-foreground">Tables near the garden</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-pandan/10 text-pandan flex items-center justify-center">
                    <Train className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">3 min from Toa Payoh MRT</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Today, 3–4:30 pm</p>
                    <p className="text-[11px] text-muted-foreground">About 45 minutes</p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-foreground/70 italic">
                  "Just a quiet kopi in the afternoon — no pressure, no agenda."
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
                  Sounds nice
                </button>
                <button className="flex-1 bg-muted text-foreground rounded-xl py-3 text-sm font-medium hover:bg-muted/70 transition-colors">
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrioMatch;
