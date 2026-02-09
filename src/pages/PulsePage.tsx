import { motion } from "framer-motion";
import { TrendingUp, Coffee, Footprints, Utensils, BookOpen } from "lucide-react";

const insights = [
  { text: "Kopi and walks trending tonight", icon: Coffee, accent: "sakura" as const },
  { text: "Jurong East clans most active this week", icon: TrendingUp, accent: "pandan" as const },
  { text: "Hawker meetups up 20% in Toa Payoh", icon: Utensils, accent: "sakura" as const },
  { text: "Reading circles growing in Bishan", icon: BookOpen, accent: "pandan" as const },
];

const activityBlobs = [
  { x: "58%", y: "28%", size: 56, opacity: 0.5, color: "sakura", label: "Toa Payoh" },
  { x: "38%", y: "42%", size: 48, opacity: 0.45, color: "pandan", label: "Jurong" },
  { x: "68%", y: "52%", size: 40, opacity: 0.4, color: "sakura", label: "Bedok" },
  { x: "52%", y: "58%", size: 44, opacity: 0.45, color: "pandan", label: "Bishan" },
  { x: "45%", y: "35%", size: 36, opacity: 0.35, color: "sakura", label: "Queenstown" },
  { x: "72%", y: "40%", size: 32, opacity: 0.35, color: "pandan", label: "Tampines" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const PulsePage = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg px-5 pt-14">
        {/* Header */}
        <motion.div {...fade(0)} className="mb-2">
          <p className="text-sm font-medium text-muted-foreground tracking-wide">neighbourhood pulse</p>
        </motion.div>
        <motion.h1
          {...fade(0.1)}
          className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground mb-8"
        >
          What's happening
          <br />
          around the island
        </motion.h1>

        {/* Singapore Map Area */}
        <motion.div
          {...fade(0.2)}
          className="relative rounded-3xl bg-card/80 backdrop-blur-xl border border-border/40 shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.06)] overflow-hidden mb-8"
        >
          {/* Simplified Singapore silhouette shape using CSS */}
          <div className="relative h-64 w-full">
            {/* Base shape suggestion */}
            <div className="absolute inset-6 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-muted/40 border border-border/20" />

            {/* Activity blobs */}
            {activityBlobs.map((blob, i) => (
              <motion.div
                key={blob.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: blob.opacity, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35 + i * 0.1, ease: "easeOut" }}
                className="absolute flex flex-col items-center"
                style={{ left: blob.x, top: blob.y, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                  className={`rounded-full ${
                    blob.color === "sakura" ? "bg-sakura" : "bg-pandan"
                  }`}
                  style={{ width: blob.size, height: blob.size, filter: "blur(12px)" }}
                />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-medium text-foreground/40 whitespace-nowrap">
                  {blob.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pandan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pandan" />
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">Live</span>
          </div>
        </motion.div>

        {/* Text Insights */}
        <motion.div {...fade(0.4)}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">Tonight's vibe</h2>
          <p className="text-sm text-muted-foreground mb-4">Simple moments across the island 🌴</p>

          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/40 px-4 py-3.5 transition-all duration-300 hover:shadow-sm"
              >
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    insight.accent === "sakura" ? "bg-sakura-light/60" : "bg-pandan-light/60"
                  }`}
                >
                  <insight.icon
                    className={`h-4 w-4 ${
                      insight.accent === "sakura" ? "text-sakura" : "text-pandan"
                    }`}
                  />
                </div>
                <p className="text-sm text-foreground/80 font-medium">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Multilingual footer hint */}
        <motion.p
          {...fade(0.7)}
          className="text-center text-[11px] text-muted-foreground/40 mt-10 tracking-wide"
        >
          available in English · 中文 · Melayu · தமிழ்
        </motion.p>
      </div>
    </div>
  );
};

export default PulsePage;
