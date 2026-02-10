import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import type { PulseData } from "@/types";

export interface NeighbourhoodDirectoryProps {
  pulseData: PulseData[];
}

const NeighbourhoodDirectory = ({ pulseData }: NeighbourhoodDirectoryProps) => {
  const sortedNeighbourhoods = [...pulseData].sort((a, b) => b.active_today - a.active_today);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Leaderboard header */}
      <div className="bg-gradient-to-br from-primary/10 to-sakura/10 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Neighbourhood Leaderboard</h3>
        </div>
        <p className="text-xs text-muted-foreground">Ranked by community activity and engagement</p>
      </div>

      {/* Neighbourhoods list */}
      <div className="space-y-3">
        {sortedNeighbourhoods.map((neighbourhood, i) => (
          <motion.div
            key={neighbourhood.neighbourhood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center font-semibold ${i === 0
                  ? "bg-yellow-100 text-yellow-600"
                  : i === 1
                    ? "bg-gray-100 text-gray-500"
                    : i === 2
                      ? "bg-orange-100 text-orange-600"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{neighbourhood.neighbourhood}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{neighbourhood.active_today} active today</span>
                  <span>Mood: {neighbourhood.avg_mood.toFixed(1)}/5</span>
                </div>
              </div>

              {/* Top interests */}
              <div className="hidden sm:flex gap-1">
                {neighbourhood.top_interests.slice(0, 2).map((interest) => (
                  <span key={interest} className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                    {interest}
                  </span>
                ))}
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NeighbourhoodDirectory;
