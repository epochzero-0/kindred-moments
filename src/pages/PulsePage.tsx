import { motion } from "framer-motion";
import { Coffee, Utensils, BookOpen, ArrowRight, Hand, MapPin } from "lucide-react";

const insights = [
  { text: "Kopi walks trending tonight", icon: Coffee },
  { text: "Hawker meetups up 20%", icon: Utensils },
  { text: "Reading circles growing", icon: BookOpen },
];

const activityBlobs = [
  { x: "55%", y: "30%", size: 44, opacity: 0.6, label: "Toa Payoh", count: 12 },
  { x: "35%", y: "45%", size: 38, opacity: 0.5, label: "Jurong", count: 8 },
  { x: "65%", y: "55%", size: 34, opacity: 0.45, label: "Bedok", count: 6 },
  { x: "48%", y: "60%", size: 36, opacity: 0.5, label: "Bishan", count: 7 },
];

const PulsePage = () => {
  return (
    <div className="min-h-screen px-8 py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm mb-1">Neighbourhood Pulse</p>
        <h1 className="text-3xl text-foreground">What's happening around you</h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-pandan animate-pulse" />
          <span className="text-muted-foreground">42 active now</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <Hand className="h-4 w-4 text-lavender" />
          </div>
          <span className="text-muted-foreground">156 connected today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">8 hot zones</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="relative h-72 lg:h-80 w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30" />
            <div className="absolute inset-6 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-gradient-to-br from-muted to-muted/50" />

            {activityBlobs.map((blob, i) => (
              <motion.div
                key={blob.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: blob.opacity, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{ left: blob.x, top: blob.y, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                  className="rounded-full bg-gradient-to-br from-primary to-sakura"
                  style={{ width: blob.size, height: blob.size, filter: "blur(4px)" }}
                />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                  {blob.count}
                </span>
                <span className="absolute -bottom-5 text-[10px] font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {blob.label}
                </span>
              </motion.div>
            ))}

            <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 rounded-full px-3 py-1.5 shadow-soft text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-pandan animate-pulse" />
              Live
            </div>
          </div>
        </motion.div>

        {/* Insights */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Tonight's vibe</p>
          </motion.div>

          {insights.map((insight, i) => (
            <motion.div
              key={insight.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
              className="group flex items-center gap-3 bg-white rounded-xl shadow-soft p-4 card-hover cursor-pointer"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <insight.icon className="h-4 w-4" />
              </div>
              <p className="flex-1 text-[13px] font-medium text-foreground">{insight.text}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl shadow-soft p-4 mt-6"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {["English", "中文", "Melayu", "தமிழ்"].map((lang) => (
                <span key={lang} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;
