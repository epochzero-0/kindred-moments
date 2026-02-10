import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Globe, ChevronRight, Sparkles, Check,
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Dumbbell, Footprints, Film, Music,
  Camera, BookOpen, Monitor, HandHeart, LucideIcon
} from "lucide-react";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useNavigate } from "react-router-dom";
import type { User, Clan } from "@/types";

export interface InterestGroupDirectoryProps {
  clans: Clan[];
  allUsers: User[];
  currentUserInterests: string[];
  initialSearch?: string;
}

// Top interest-based groups
const interestGroups: { id: string; name: string; icon: LucideIcon; theme: string }[] = [
  { id: "art", name: "Art & Creativity", icon: Palette, theme: "creative" },
  { id: "badminton", name: "Badminton Players", icon: CircleDot, theme: "sports" },
  { id: "board games", name: "Board Game Nights", icon: Gamepad2, theme: "games" },
  { id: "bubble tea", name: "Bubble Tea Lovers", icon: Coffee, theme: "food" },
  { id: "cats", name: "Cat Parents", icon: Cat, theme: "pets" },
  { id: "cooking", name: "Home Cooks", icon: UtensilsCrossed, theme: "food" },
  { id: "cycling", name: "Cycling Squad", icon: Bike, theme: "fitness" },
  { id: "dogs", name: "Dog Lovers", icon: Dog, theme: "pets" },
  { id: "evening walks", name: "Evening Walkers", icon: Sunset, theme: "wellness" },
  { id: "food hunt", name: "Food Hunters", icon: Soup, theme: "food" },
  { id: "gardening", name: "Green Thumbs", icon: Flower2, theme: "hobby" },
  { id: "gym light", name: "Gym Buddies", icon: Dumbbell, theme: "fitness" },
  { id: "jogging", name: "Jogging Club", icon: Footprints, theme: "fitness" },
  { id: "kopi", name: "Kopi Kakis", icon: Coffee, theme: "food" },
  { id: "movies", name: "Movie Buffs", icon: Film, theme: "entertainment" },
  { id: "music", name: "Music Enthusiasts", icon: Music, theme: "entertainment" },
  { id: "photography", name: "Photography Club", icon: Camera, theme: "creative" },
  { id: "study", name: "Study Buddies", icon: BookOpen, theme: "learning" },
  { id: "tech", name: "Tech Explorers", icon: Monitor, theme: "tech" },
  { id: "volunteering", name: "Volunteers United", icon: HandHeart, theme: "community" },
];

const InterestGroupDirectory = ({ clans, allUsers, currentUserInterests, initialSearch = "" }: InterestGroupDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const navigate = useNavigate();
  const { isGroupJoined } = useChatConnections();

  // Update search query if initialSearch prop changes (e.g. navigation from bot)
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Count members per interest group
  const getGroupMemberCount = (interestId: string) => {
    return allUsers.filter(u => u.interests.includes(interestId)).length;
  };

  // Split groups into recommended (matching user interests) and explore (others)
  const recommendedGroups = interestGroups
    .filter(g => currentUserInterests.includes(g.id))
    .map(g => ({ ...g, memberCount: getGroupMemberCount(g.id) }))
    .sort((a, b) => b.memberCount - a.memberCount);

  const exploreGroups = interestGroups
    .filter(g => !currentUserInterests.includes(g.id))
    .map(g => ({ ...g, memberCount: getGroupMemberCount(g.id) }))
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 10); // Top 10 to explore

  // Filter by search
  const filterBySearch = (groups: typeof recommendedGroups) => {
    if (!searchQuery) return groups;
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.theme.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredRecommended = filterBySearch(recommendedGroups);
  const filteredExplore = filterBySearch(exploreGroups);

  const handleGroupClick = (groupId: string, groupName: string) => {
    navigate(`/chat?roomId=group-${groupId}&roomName=${encodeURIComponent(groupName)}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20">
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interest groups..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Recommended for you */}
      {filteredRecommended.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-pandan" />
            <h3 className="font-semibold text-foreground text-sm">Recommended for you</h3>
          </div>
          <div className="space-y-2">
            {filteredRecommended.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(group.id, group.name)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer border-2 border-transparent hover:border-pandan/30"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pandan/20 to-emerald-100 flex items-center justify-center">
                    <group.icon className="h-6 w-6 text-pandan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount} members
                      </span>
                      {isGroupJoined(group.id) ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-medium">
                          <Check className="h-2.5 w-2.5" />
                          Joined
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-pandan/10 text-pandan text-[10px] font-medium">
                          Matches your interest
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Explore more */}
      {filteredExplore.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Explore more</h3>
          </div>
          <div className="space-y-2">
            {filteredExplore.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(group.id, group.name)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-sakura/10 flex items-center justify-center">
                    <group.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount} members
                      </span>
                      {isGroupJoined(group.id) ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-medium">
                          <Check className="h-2.5 w-2.5" />
                          Joined
                        </span>
                      ) : (
                        <span className="capitalize text-muted-foreground/70">{group.theme}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredRecommended.length === 0 && filteredExplore.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No groups found for "{searchQuery}"</p>
        </div>
      )}
    </motion.div>
  );
};

export default InterestGroupDirectory;
