import { motion } from "framer-motion";
import ActivityCard from "@/components/ActivityCard";
import StatusFeed from "@/components/StatusFeed";
import { ArrowRight, MapPin, Users, Home, Smile, Meh, Frown, Footprints, Trophy, Palette, Coffee, UtensilsCrossed, Sparkles } from "lucide-react";
import { useCurrentUser, useActivities, useClans, usePulseData } from "@/hooks/use-data";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

const Index = () => {
  const currentUser = useCurrentUser();
  const activities = useActivities();
  const clans = useClans();
  const pulseData = usePulseData();
  
  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

  const getMoodIcon = (mood: number): { icon: LucideIcon; color: string } => {
    if (mood >= 4) return { icon: Smile, color: "text-pandan" };
    if (mood >= 3) return { icon: Meh, color: "text-amber-500" };
    return { icon: Frown, color: "text-muted-foreground" };
  };

  const activityCards = activities.slice(0, 4).map(activity => {
    const tags = activity.tags || [];
    const hasExercise = tags.some(t => ['walk', 'badminton', 'exercise'].includes(t));
    const getIcon = (): LucideIcon => {
      if (tags.includes("walk")) return Footprints;
      if (tags.includes("badminton")) return Trophy;
      if (tags.includes("art")) return Palette;
      if (tags.includes("kopi") || tags.includes("chat")) return Coffee;
      if (tags.includes("food")) return UtensilsCrossed;
      return Sparkles;
    };
    return {
      name: activity.title,
      duration: `${activity.duration} min`,
      distance: activity.location,
      peopleGoing: activity.ideal_group,
      variant: (hasExercise ? "pandan" : "sakura") as "pandan" | "sakura",
      icon: getIcon()
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen px-8 py-10 max-w-6xl">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-muted-foreground text-sm mb-1">{getGreeting()}</p>
        <h1 className="text-3xl text-foreground">
          {firstName}, what feels <span className="text-gradient">nice today?</span>
        </h1>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-muted-foreground">{activities.length} activities nearby</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-pandan" />
          </div>
          <span className="text-muted-foreground">{totalPeopleActive} people active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <Home className="h-3.5 w-3.5 text-lavender" />
          </div>
          <span className="text-muted-foreground">{clans.length} clans</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Activities */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl text-foreground">Happening now</h2>
              <Link to="/clan" className="text-sm text-primary hover:underline underline-offset-2 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activityCards.map((activity, i) => (
                <ActivityCard key={activity.name} {...activity} delay={0.15 + i * 0.05} />
              ))}
            </div>
          </section>

          {/* Neighbourhood Pulse */}
          {userNeighbourhood && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/pulse" 
                className="block p-5 rounded-2xl bg-white shadow-soft hover:shadow-elevated transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Neighbourhood Pulse</p>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {userNeighbourhood.neighbourhood}
                    </h3>
                  </div>
                  {(() => {
                    const { icon: MoodIcon, color } = getMoodIcon(userNeighbourhood.avg_mood);
                    return (
                      <div className={`h-10 w-10 rounded-xl ${color === 'text-pandan' ? 'bg-pandan/10' : color === 'text-amber-500' ? 'bg-amber-500/10' : 'bg-muted'} flex items-center justify-center`}>
                        <MoodIcon className={`h-5 w-5 ${color}`} />
                      </div>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(userNeighbourhood.avg_mood / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{userNeighbourhood.avg_mood.toFixed(1)}</span>
                </div>
              </Link>
            </motion.section>
          )}
        </div>

        {/* Sidebar - Status Feed */}
        <div className="lg:col-span-2">
          <StatusFeed compact />
        </div>
      </div>
    </div>
  );
};

export default Index;
