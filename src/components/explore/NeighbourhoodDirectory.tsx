import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, ChevronRight, MapPin, Users, Sparkles, 
  Smile, Crown, Zap, Calendar, TrendingUp 
} from "lucide-react";
import type { PulseData } from "@/types";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useCurrentUser } from "@/hooks/use-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface NeighbourhoodDirectoryProps {
  pulseData: PulseData[];
}

// Hardcoded extended stats for the detailed view
const getNeighbourhoodDetails = (name: string) => {
  // deterministic random-ish data based on name length
  const seed = name.length;
  
  return {
    weeklyGoal: seed % 2 === 0 ? "Walk 10,000km total" : "500 Community Hours",
    weeklyProgress: 40 + (seed * 5) % 55,
    nextEvent: seed % 2 === 0 ? "Community Potluck (Sat)" : "Mass Morning Walk (Sun)",
    topContributor: ["Sarah Tan", "Uncle Roger", "Jason Lim", "Ahmad"][seed % 4],
    activeNow: 20 + (seed * 3),
    description: `A vibrant community in ${name} focused on staying active and connected.`,
    tags: seed % 2 === 0 
      ? ["Food Hunting", "Evening Walks", "Pets"] 
      : ["Badminton", "Tech Talks", "Gardening"]
  };
};

const NeighbourhoodDirectory = ({ pulseData }: NeighbourhoodDirectoryProps) => {
  const { profile } = useUserProfile();
  const currentUser = useCurrentUser();
  const [selectedArea, setSelectedArea] = useState<PulseData & { rank: number } | null>(null);

  // 1. Sort neighbourhoods to determine rank
  const sortedNeighbourhoods = [...pulseData]
    .sort((a, b) => b.active_today - a.active_today)
    .map((data, index) => ({ ...data, rank: index + 1 }));

  // 2. Identify user's neighbourhoods
  // Use profile neighbourhoods if available, otherwise fall back to currentUser
  const userNeighbourhoodNames = profile?.neighbourhoods && profile.neighbourhoods.length > 0
    ? profile.neighbourhoods
    : currentUser?.neighbourhood 
      ? [currentUser.neighbourhood] 
      : [];

  const userAreas = sortedNeighbourhoods.filter(n => 
    userNeighbourhoodNames.some(name => name.toLowerCase() === n.neighbourhood.toLowerCase())
  );

  const extendedStats = selectedArea ? getNeighbourhoodDetails(selectedArea.neighbourhood) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-sakura/10 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Neighbourhood Leaderboard</h3>
            <p className="text-xs text-muted-foreground">Ranked by community activity</p>
          </div>
        </div>
      </div>

      {/* Your Neighbourhoods Section */}
      {userAreas.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
            Your Areas
          </p>
          <div className="space-y-3">
            {userAreas.map((area) => (
              <motion.div
                key={`user-${area.neighbourhood}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedArea(area)}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                    #{area.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary">{area.neighbourhood}</h3>
                      <Badge variant="secondary" className="text-[10px] h-5 bg-white text-primary">You</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {area.active_today} active
                      </span>
                      <span className="flex items-center gap-1">
                        <Smile className="h-3 w-3" />
                        {area.avg_mood.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/50" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="my-6 border-t border-dashed border-muted-foreground/20" />
        </div>
      )}

      {/* All Neighbourhoods List */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
          Global Rankings
        </p>
        <div className="space-y-3">
          {sortedNeighbourhoods.map((neighbourhood) => (
            <motion.div
              key={neighbourhood.neighbourhood}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedArea(neighbourhood)}
              className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer border border-transparent hover:border-muted"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-semibold text-sm ${
                    neighbourhood.rank === 1 ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                    neighbourhood.rank === 2 ? "bg-slate-100 text-slate-700 border border-slate-200" :
                    neighbourhood.rank === 3 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {neighbourhood.rank <= 3 && <Crown className="h-3 w-3 mr-0.5" />}
                  {neighbourhood.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{neighbourhood.neighbourhood}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{neighbourhood.active_today} active today</span>
                    <span>Mood: {neighbourhood.avg_mood.toFixed(1)}</span>
                  </div>
                </div>

                {/* Top interests - Desktop only */}
                <div className="hidden sm:flex gap-1">
                  {neighbourhood.top_interests.slice(0, 2).map((interest) => (
                    <span key={interest} className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                      {interest}
                    </span>
                  ))}
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed View Modal */}
      <Dialog open={!!selectedArea} onOpenChange={(open) => !open && setSelectedArea(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedArea && extendedStats && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-2xl shadow-sm border border-primary/10">
                    #{selectedArea.rank}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-serif">{selectedArea.neighbourhood}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <Users className="h-3.5 w-3.5" />
                        {selectedArea.active_today} active today
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Mood Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Smile className="h-3.5 w-3.5" />
                      Avg Mood
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">{selectedArea.avg_mood.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Weekly Activity
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-green-600">High</span>
                      <span className="text-xs text-muted-foreground">Top 10%</span>
                    </div>
                  </div>
                </div>

                {/* Competition / Goal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{extendedStats.weeklyGoal}</span>
                    <span className="text-primary font-bold">{extendedStats.weeklyProgress}%</span>
                  </div>
                  <Progress value={extendedStats.weeklyProgress} className="h-2" />
                  <p className="text-[10px] text-muted-foreground text-right">Ends in 3 days</p>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Popular Activities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArea.top_interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="bg-white">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Hardcoded extras */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Crown className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Top Contributor</p>
                      <p className="text-sm font-medium">{extendedStats.topContributor}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Next Community Event</p>
                      <p className="text-sm font-medium">{extendedStats.nextEvent}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default NeighbourhoodDirectory;