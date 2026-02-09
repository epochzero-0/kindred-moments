import { motion } from "framer-motion";
import { useCurrentUser, calculateAverageMood, getMoodEmoji, useClans } from "@/hooks/use-data";
import { User, MapPin, Heart, Clock, Shield, Edit2, ChevronRight, Star, Users } from "lucide-react";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const interestColors: Record<string, string> = {
  study: "from-blue-500 to-indigo-500",
  tech: "from-violet-500 to-purple-500",
  "food hunt": "from-orange-500 to-red-500",
  dogs: "from-amber-500 to-yellow-500",
  photography: "from-pink-500 to-rose-500",
  badminton: "from-emerald-500 to-teal-500",
  "evening walks": "from-cyan-500 to-blue-500",
  cooking: "from-red-500 to-orange-500",
  movies: "from-purple-500 to-pink-500",
  "board games": "from-green-500 to-emerald-500",
  default: "from-gray-500 to-slate-500",
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
  const moodEmoji = getMoodEmoji(avgMood);
  const userClans = clans.filter((c) => c.members.includes(user.id));

  const comfortLabels = {
    introvert: { label: "Introvert", desc: "Prefer smaller, quieter gatherings" },
    ambivert: { label: "Ambivert", desc: "Flexible with group sizes" },
    extrovert: { label: "Extrovert", desc: "Love larger social events" },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)} className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-primary/25">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <span className="text-lg">{moodEmoji}</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{user.name}</h1>
                <span className="px-3 py-1 rounded-full bg-pandan/10 text-pandan text-xs font-semibold">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {user.neighbourhood}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {userClans.length} clans
                </span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors">
              <Edit2 className="h-4 w-4" />
              Edit profile
            </button>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Stats cards */}
        <motion.div {...fade(0.1)} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgMood.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg mood</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userClans.length}</p>
                <p className="text-xs text-muted-foreground">Clans joined</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Meetups</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3w</p>
                <p className="text-xs text-muted-foreground">Active streak</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interests */}
            <motion.div {...fade(0.15)} className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Interests</h2>
                <button className="text-sm text-primary font-medium hover:underline">Edit</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => {
                  const gradient = interestColors[interest] || interestColors.default;
                  return (
                    <span
                      key={interest}
                      className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-lg`}
                    >
                      {interest}
                    </span>
                  );
                })}
              </div>
            </motion.div>

            {/* Mood history */}
            <motion.div {...fade(0.2)} className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Mood this week</h2>
                <span className="text-sm text-muted-foreground">Last 5 days</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-24">
                {user.mood_last_week.map((mood, i) => {
                  const height = (mood / 5) * 100;
                  const colors = [
                    "from-rose-500 to-pink-500",
                    "from-orange-500 to-amber-500",
                    "from-emerald-500 to-teal-500",
                    "from-blue-500 to-indigo-500",
                    "from-violet-500 to-purple-500",
                  ];
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className={`flex-1 rounded-xl bg-gradient-to-t ${colors[i]} shadow-lg`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
            </motion.div>

            {/* My clans */}
            <motion.div {...fade(0.25)} className="bg-white rounded-2xl shadow-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">My clans</h2>
                <button className="text-sm text-primary font-medium hover:underline">Browse more</button>
              </div>
              {userClans.length > 0 ? (
                <div className="space-y-3">
                  {userClans.map((clan) => (
                    <div
                      key={clan.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl">
                        {clan.theme === "food" ? "🍜" : clan.theme === "tech" ? "💻" : "👥"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{clan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {clan.members.length} members · {clan.weekly_goal}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">You haven't joined any clans yet.</p>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Comfort level */}
            <motion.div {...fade(0.3)} className="bg-white rounded-2xl shadow-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Social style</h2>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {comfortLabels[user.comfort_level].label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {comfortLabels[user.comfort_level].desc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div {...fade(0.35)} className="bg-white rounded-2xl shadow-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang) => {
                  const langNames: Record<string, string> = {
                    en: "English",
                    zh: "中文",
                    ms: "Melayu",
                    ta: "தமிழ்",
                  };
                  return (
                    <span
                      key={lang}
                      className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-medium"
                    >
                      {langNames[lang] || lang}
                    </span>
                  );
                })}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div {...fade(0.4)} className="bg-white rounded-2xl shadow-elevated p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Availability</h2>
              <div className="space-y-2">
                {user.free_slots.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-pandan/10"
                  >
                    <Clock className="h-4 w-4 text-pandan" />
                    <span className="text-sm font-medium text-foreground">{slot}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Singpass verified */}
            <motion.div {...fade(0.45)} className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6" />
                <h2 className="text-lg font-bold">Singpass Verified</h2>
              </div>
              <p className="text-sm opacity-90">
                Your identity is verified, ensuring a safe community for everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
