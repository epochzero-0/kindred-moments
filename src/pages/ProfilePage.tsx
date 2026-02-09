import { motion } from "framer-motion";
import { useCurrentUser, calculateAverageMood, useClans } from "@/hooks/use-data";
import { MapPin, Clock, Shield, Edit2, ChevronRight, Users, BookOpen, Monitor, UtensilsCrossed, Dog, Camera, Activity, Footprints, ChefHat, Clapperboard, Dices, Sparkles, Smile, Handshake, Flame, Moon, Sun, CloudSun, type LucideIcon } from "lucide-react";

const interestIcons: Record<string, LucideIcon> = {
  study: BookOpen,
  tech: Monitor,
  "food hunt": UtensilsCrossed,
  dogs: Dog,
  photography: Camera,
  badminton: Activity,
  "evening walks": Footprints,
  cooking: ChefHat,
  movies: Clapperboard,
  "board games": Dices,
  default: Sparkles,
};

const ProfilePage = () => {
  const user = useCurrentUser();
  const clans = useClans();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const avgMood = calculateAverageMood(user.mood_last_week);
  const userClans = clans.filter((c) => c.members.includes(user.id));
  
  // Determine mood icon based on average mood
  const MoodIcon = avgMood >= 4 ? Smile : avgMood >= 3 ? CloudSun : Moon;

  const comfortLabels = {
    introvert: { label: "Introvert", desc: "Smaller, quieter gatherings" },
    ambivert: { label: "Ambivert", desc: "Flexible with group sizes" },
    extrovert: { label: "Extrovert", desc: "Love larger social events" },
  };

  return (
    <div className="min-h-screen px-8 py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-5 mb-10"
      >
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-sakura flex items-center justify-center text-xl font-bold text-white shadow-soft">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center">
            <MoodIcon className="h-4 w-4 text-pandan" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl text-foreground">{user.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-pandan/10 text-pandan text-[11px] font-medium">Verified</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.neighbourhood}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{userClans.length} clans</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors text-sm font-medium">
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
            <Smile className="h-4 w-4 text-pandan" />
          </div>
          <span className="text-muted-foreground">{avgMood.toFixed(1)} avg mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <Handshake className="h-4 w-4 text-lavender" />
          </div>
          <span className="text-muted-foreground">12 meetups</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">3w streak</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-foreground">Interests</h2>
              <button className="text-xs text-primary font-medium hover:underline">Edit</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => {
                const IconComponent = interestIcons[interest] || interestIcons.default;
                return (
                  <span
                    key={interest}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground"
                  >
                    <IconComponent className="h-3.5 w-3.5 text-primary" />
                    {interest}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Mood history */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-foreground">Mood this week</h2>
              <span className="text-xs text-muted-foreground">Last 5 days</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20">
              {user.mood_last_week.map((mood, i) => {
                const height = (mood / 5) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex-1 rounded-lg bg-gradient-to-t from-primary/60 to-primary/20"
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </motion.div>

          {/* Clans */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-foreground">My clans</h2>
              <button className="text-xs text-primary font-medium hover:underline">Browse</button>
            </div>
            {userClans.length > 0 ? (
              <div className="space-y-2">
                {userClans.map((clan) => (
                  <div
                    key={clan.id}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {clan.theme === "food" ? <UtensilsCrossed className="h-4 w-4 text-primary" /> : clan.theme === "tech" ? <Monitor className="h-4 w-4 text-primary" /> : <Users className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{clan.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{clan.weekly_goal}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No clans yet.</p>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-5">
          {/* Social style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <h2 className="font-serif text-lg text-foreground mb-3">Social style</h2>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-lavender/20 flex items-center justify-center">
                {user.comfort_level === "introvert" ? <Moon className="h-5 w-5 text-lavender" /> : user.comfort_level === "extrovert" ? <Sun className="h-5 w-5 text-lavender" /> : <CloudSun className="h-5 w-5 text-lavender" />}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{comfortLabels[user.comfort_level].label}</p>
                <p className="text-xs text-muted-foreground">{comfortLabels[user.comfort_level].desc}</p>
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <h2 className="font-serif text-lg text-foreground mb-3">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang) => {
                const langNames: Record<string, string> = { en: "English", zh: "中文", ms: "Melayu", ta: "தமிழ்" };
                return (
                  <span key={lang} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                    {langNames[lang] || lang}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <h2 className="font-serif text-lg text-foreground mb-3">Availability</h2>
            <div className="space-y-2">
              {user.free_slots.map((slot, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-pandan/10">
                  <Clock className="h-3.5 w-3.5 text-pandan" />
                  <span className="text-xs font-medium text-foreground">{slot}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Singpass */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="bg-gradient-to-br from-rose-500 to-primary rounded-2xl p-5 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5" />
              <h2 className="font-medium">Singpass Verified</h2>
            </div>
            <p className="text-xs opacity-90">Your identity is verified for a safe community.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
