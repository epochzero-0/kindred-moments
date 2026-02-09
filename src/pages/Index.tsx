import { motion } from "framer-motion";
import ActivityCard from "@/components/ActivityCard";
import StatusFeed from "@/components/StatusFeed";
import { Sparkles, TrendingUp, Users, MapPin } from "lucide-react";
import { useCurrentUser, useActivities, useClans, usePulseData } from "@/hooks/use-data";
import { Link } from "react-router-dom";

const Index = () => {
  const currentUser = useCurrentUser();
  const activities = useActivities();
  const clans = useClans();
  const pulseData = usePulseData();
  
  // Get current neighborhood pulse (using British spelling from data)
  const userNeighbourhood = pulseData.find(p => p.neighbourhood === currentUser?.neighbourhood);
  const totalPeopleActive = pulseData.reduce((sum, p) => sum + p.active_today, 0);

  // Helper to get emoji from mood (1-5 scale)
  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return "😊";
    if (mood >= 3.5) return "🙂";
    if (mood >= 2.5) return "😐";
    return "😔";
  };

  // Map activities to card format - using correct field names from JSON
  const activityCards = activities.slice(0, 6).map(activity => {
    const tags = activity.tags || [];
    const hasExercise = tags.some(t => ['walk', 'badminton', 'exercise'].includes(t));
    return {
      name: activity.title,
      duration: `${activity.duration} min`,
      distance: activity.location,
      peopleGoing: activity.ideal_group,
      variant: (hasExercise ? "pandan" : "sakura") as "pandan" | "sakura",
      emoji: tags.includes("walk") ? "🚶" : 
             tags.includes("badminton") ? "🏸" :
             tags.includes("art") ? "🎨" :
             tags.includes("kopi") || tags.includes("chat") ? "☕" :
             tags.includes("food") ? "🍜" : "✨"
    };
  });

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sakura/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gradient-to-br from-pandan/20 to-cyan-500/20 rounded-full blur-3xl -translate-x-1/2" />
        
        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Good {getTimeOfDay()}, {currentUser?.name?.split(' ')[0] || 'there'}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              What feels nice<br />
              <span className="text-gradient">today?</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover activities in your neighbourhood and connect with like-minded people around you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-8 lg:px-12 pb-8"
      >
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm max-w-fit">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pandan to-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activities.length}</p>
              <p className="text-xs text-muted-foreground">Activities nearby</p>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sakura to-pink-400 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPeopleActive}</p>
              <p className="text-xs text-muted-foreground">People active</p>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-400 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{clans.length}</p>
              <p className="text-xs text-muted-foreground">Clans in area</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-8 lg:px-12 pb-12">
        {/* Main Content - Activities */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground">Happening now</h2>
              <p className="text-muted-foreground">Activities you might enjoy</p>
            </div>
            <Link to="/clan" className="px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
              View all
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activityCards.map((activity, i) => (
              <ActivityCard key={activity.name} {...activity} delay={0.35 + i * 0.05} />
            ))}
          </div>

          {/* Neighborhood Pulse Preview */}
          {userNeighbourhood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <Link to="/pulse" className="block p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{userNeighbourhood.neighbourhood} Pulse</h3>
                    <p className="text-sm text-muted-foreground">Your neighbourhood's wellness vibe</p>
                  </div>
                  <div className="text-4xl">{getMoodEmoji(userNeighbourhood.avg_mood)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pandan to-emerald-400 rounded-full transition-all"
                      style={{ width: `${(userNeighbourhood.avg_mood / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{userNeighbourhood.avg_mood.toFixed(1)}/5</span>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Status Feed */}
        <div className="xl:col-span-1">
          <StatusFeed />
        </div>
      </div>
    </div>
  );
};

export default Index;
