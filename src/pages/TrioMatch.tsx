import { motion } from "framer-motion";
import { MapPin, Clock, Coffee, Train, Shield, Sparkles, Heart, Check } from "lucide-react";

const TrioMatch = () => {
  const members = [
    { initials: "JW", gradient: "from-rose-400 to-pink-500", name: "Jan" },
    { initials: "SL", gradient: "from-emerald-400 to-teal-500", name: "Sara" },
    { initials: "MR", gradient: "from-amber-400 to-orange-500", name: "Maya" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-rose-600">Trio Match</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              We found a small moment near you
            </h1>
            <p className="text-muted-foreground">Three kindred spirits, one perfect afternoon</p>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column - Avatars and info */}
          <div className="space-y-6">
            {/* Trio Avatars Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-elevated p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Your trio</h3>
              <div className="flex items-center gap-4 mb-4">
                {members.map((m, i) => (
                  <motion.div
                    key={m.initials}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
                      {m.initials}
                    </div>
                    <span className="text-sm font-medium text-foreground mt-2">{m.name}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4 text-rose-500" />
                <p className="text-sm">
                  You all enjoy: slow mornings, film photography, local food
                </p>
              </div>
            </motion.div>

            {/* Safety info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-elevated p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Safe & comfortable</h3>
                  <p className="text-sm text-muted-foreground">Built with trust in mind</p>
                </div>
              </div>
              <div className="space-y-2">
                {["Public place", "Small group of 3", "Easy exit options"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column - Activity Proposal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
              {/* Gradient header */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500" />
              
              <div className="p-8">
                {/* Label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Suggested for your trio
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Afternoon kopi & a slow chat <span className="text-3xl">☕</span>
                </h2>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 text-foreground">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Blk 78 kopitiam, Toa Payoh</p>
                      <p className="text-xs text-muted-foreground">Tables near the garden</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-foreground">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
                      <Train className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">3 min from Toa Payoh MRT</p>
                      <p className="text-xs text-muted-foreground">Easy to reach</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-foreground">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Today, between 3–4:30 pm</p>
                      <p className="text-xs text-muted-foreground">About 45 minutes</p>
                    </div>
                  </div>
                </div>

                {/* Conversational note */}
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl p-4 mb-8">
                  <p className="text-sm text-foreground/80 italic leading-relaxed">
                    "Just a quiet kopi in the afternoon — no pressure, no agenda. Come as you are."
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl px-6 py-4 text-sm font-bold shadow-lg shadow-primary/25 transition-all duration-200 hover:opacity-90 active:scale-[0.98]">
                    Sounds nice
                  </button>
                  <button className="flex-1 bg-muted text-foreground rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-200 hover:bg-muted/70 active:scale-[0.98]">
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrioMatch;
