import { motion } from "framer-motion";
import { TrendingUp, Coffee, Utensils, BookOpen, ArrowRight, MapPin, Activity } from "lucide-react";

const insights = [
  { text: "Kopi and walks trending tonight", icon: Coffee, gradient: "from-rose-500 to-pink-500" },
  { text: "Jurong East clans most active this week", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
  { text: "Hawker meetups up 20% in Toa Payoh", icon: Utensils, gradient: "from-amber-500 to-orange-500" },
  { text: "Reading circles growing in Bishan", icon: BookOpen, gradient: "from-violet-500 to-purple-500" },
];

const activityBlobs = [
  { x: "58%", y: "28%", size: 52, opacity: 0.7, gradient: "from-rose-500 to-pink-500", label: "Toa Payoh", count: 12 },
  { x: "38%", y: "42%", size: 44, opacity: 0.6, gradient: "from-emerald-500 to-teal-500", label: "Jurong", count: 8 },
  { x: "68%", y: "52%", size: 40, opacity: 0.55, gradient: "from-amber-500 to-orange-500", label: "Bedok", count: 6 },
  { x: "52%", y: "58%", size: 42, opacity: 0.6, gradient: "from-violet-500 to-purple-500", label: "Bishan", count: 7 },
  { x: "45%", y: "35%", size: 36, opacity: 0.5, gradient: "from-pink-500 to-rose-500", label: "Queenstown", count: 5 },
  { x: "72%", y: "40%", size: 32, opacity: 0.5, gradient: "from-teal-500 to-cyan-500", label: "Tampines", count: 4 },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const PulsePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-violet-600">Neighbourhood Pulse</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              What's happening around you
            </h1>
            <p className="text-muted-foreground">Real-time community activity across Singapore</p>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Stats row */}
        <motion.div {...fade(0.1)} className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">42</p>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">156</p>
            <p className="text-sm text-muted-foreground">People connected</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">Hot zones</p>
          </div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Map */}
          <motion.div
            {...fade(0.15)}
            className="bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            <div className="relative h-80 lg:h-[420px] w-full">
              {/* Map background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
              
              {/* Simplified map shape */}
              <div className="absolute inset-8 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-gradient-to-br from-slate-200/50 to-slate-300/30" />

              {/* Activity blobs */}
              {activityBlobs.map((blob, i) => (
                <motion.div
                  key={blob.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: blob.opacity, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                  className="absolute flex flex-col items-center group cursor-pointer"
                  style={{ left: blob.x, top: blob.y, transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`rounded-full bg-gradient-to-br ${blob.gradient} shadow-lg`}
                    style={{ width: blob.size, height: blob.size, filter: "blur(6px)" }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">{blob.count}</span>
                  </div>
                  <span className="absolute -bottom-5 text-xs font-medium text-foreground/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {blob.label}
                  </span>
                </motion.div>
              ))}

              {/* Live indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-elevated">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-foreground">Live</span>
              </div>

              {/* Map pin indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-elevated">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Singapore</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Insights */}
          <div>
            <motion.div {...fade(0.2)} className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Tonight's vibe</h2>
              <button className="text-sm text-primary font-medium hover:underline">View all</button>
            </motion.div>

            <div className="space-y-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={insight.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                  className="group flex items-center gap-4 bg-white rounded-2xl shadow-elevated p-5 transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-0.5"
                >
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${insight.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                    <insight.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="flex-1 text-base text-foreground font-semibold">{insight.text}</p>
                  <ArrowRight className="h-5 w-5 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </motion.div>
              ))}
            </div>

            {/* Languages footer */}
            <motion.div
              {...fade(0.5)}
              className="mt-8 p-5 bg-white rounded-2xl shadow-elevated"
            >
              <p className="text-sm font-medium text-foreground mb-2">Available languages</p>
              <div className="flex flex-wrap gap-2">
                {["English", "中文", "Melayu", "தமிழ்"].map((lang) => (
                  <span key={lang} className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground">
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;
