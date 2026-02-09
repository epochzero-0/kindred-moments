import { motion } from "framer-motion";
import { MapPin, Clock, Coffee, Train, Shield } from "lucide-react";
import AvatarBubble from "@/components/AvatarBubble";

const TrioMatch = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-5 pb-28 pt-14">
        {/* Floating Trio Avatars */}
        <div className="relative flex items-center justify-center h-48 mb-6">
          <AvatarBubble initials="JW" color="sakura" size="lg" delay={0} className="absolute left-1/2 -translate-x-[5.5rem]" />
          <AvatarBubble initials="SL" color="pandan" size="lg" delay={0.15} className="absolute left-1/2 -translate-x-1/2 -translate-y-3" />
          <AvatarBubble initials="MR" color="muted" size="lg" delay={0.3} className="absolute left-1/2 translate-x-[1.5rem]" />

          {/* Soft connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 320 192">
            <line x1="110" y1="96" x2="160" y2="84" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="160" y1="84" x2="210" y2="96" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="110" y1="96" x2="210" y2="96" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-snug">
            We found a small moment
            <br />
            near you.
          </h1>
        </motion.div>

        {/* AI Activity Proposal Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-xl border border-border/40 shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.06)] p-6">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sakura-light/30 via-transparent to-pandan-light/20 pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Activity title */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
                  Suggested for your trio
                </p>
                <h2 className="text-xl font-semibold text-foreground tracking-tight">
                  Afternoon kopi & a slow chat ☕
                </h2>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-sakura" />
                  <span>Blk 78 kopitiam, Toa Payoh · tables near the garden</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Train className="h-4 w-4 shrink-0 text-pandan" />
                  <span>3 min from Toa Payoh MRT</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0 text-sakura" />
                  <span>Today, between 3–4:30 pm · about 45 min</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Coffee className="h-4 w-4 shrink-0 text-pandan" />
                  <span>You all enjoy: slow mornings, film photography, local food</span>
                </div>
              </div>

              {/* Conversational note */}
              <p className="text-sm text-foreground/60 italic leading-relaxed">
                "Just a quiet kopi in the afternoon — no pressure, no agenda. Come as you are."
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button className="flex-1 rounded-2xl bg-gradient-to-r from-sakura to-sakura/80 px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 active:scale-[0.97] hover:shadow-md hover:shadow-sakura/20">
                  sounds nice
                </button>
                <button className="flex-1 rounded-2xl bg-muted px-6 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-300 active:scale-[0.97] hover:bg-muted/70">
                  maybe later
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Safety line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-1.5 mt-6"
        >
          <Shield className="h-3 w-3 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground/50 tracking-wide">
            public place · small group · easy going
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TrioMatch;
