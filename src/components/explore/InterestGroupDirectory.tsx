import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Globe, ChevronRight, Sparkles, Check, Heart,
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

  // Get icon for clan based on theme
  const getIconForTheme = (theme: string): LucideIcon => {
    const themeIcons: Record<string, LucideIcon> = {
      fitness: Dumbbell,
      tech: Monitor,
      art: Palette,
      food: UtensilsCrossed,
      study: BookOpen,
      gaming: Gamepad2,
      music: Music,
      pets: Cat,
      dogs: Dog,
      books: BookOpen,
      travel: Globe,
      "food hunt": Soup,
      cooking: UtensilsCrossed,
      movies: Film,
      "board games": Gamepad2,
    };
    return themeIcons[theme.toLowerCase()] || Sparkles;
  };

  // Convert clans to group format with icons
  const allClanGroups = clans.map(clan => ({
    id: clan.id,
    name: clan.name,
    icon: getIconForTheme(clan.theme),
    theme: clan.theme,
    memberCount: clan.members.length,
    clanData: clan
  }));

  // Helper to check if a group is joined (by ID or Theme)
  const isJoined = (group: typeof allClanGroups[0]) => 
    isGroupJoined(group.id) || isGroupJoined(group.theme);

  // 1. Joined Groups
  const joinedGroupsList = allClanGroups.filter(g => isJoined(g));

  // 2. Recommended (Matching interests, NOT joined)
  const recommendedGroups = allClanGroups
    .filter(g => !isJoined(g) && currentUserInterests.some(interest =>
      g.theme.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(g.theme.toLowerCase())
    ))
    .sort((a, b) => b.memberCount - a.memberCount);

  // 3. Explore (Everything else, NOT joined)
  const exploreGroups = allClanGroups
    .filter(g => !isJoined(g) && !currentUserInterests.some(interest =>
      g.theme.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(g.theme.toLowerCase())
    ))
    .sort((a, b) => b.memberCount - a.memberCount);

  // Filter by search
  const filterBySearch = (groups: typeof recommendedGroups) => {
    if (!searchQuery) return groups;
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.theme.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredJoined = filterBySearch(joinedGroupsList);
  const filteredRecommended = filterBySearch(recommendedGroups);
  const filteredExplore = filterBySearch(exploreGroups);

  const handleGroupClick = (groupId: string, groupName: string) => {
    // Find the clan to get its theme
    const clan = clans.find(c => c.id === groupId);
    const roomId = clan ? clan.theme : groupId;

    // Navigate to group chat using theme as roomId (matches ChatPage expectations)
    navigate(`/chat?roomId=group-${roomId}&roomName=${encodeURIComponent(groupName)}`);
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

      {/* 1. Joined Groups Section */}
      {filteredJoined.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-rose-500" />
            <h3 className="font-semibold text-foreground text-sm">Your Groups</h3>
          </div>
          <div className="space-y-2">
            {filteredJoined.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(group.id, group.name)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-elevated transition-all cursor-pointer border-2 border-rose-100/50 hover:border-rose-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <group.icon className="h-6 w-6 text-rose-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount} members
                      </span>
                      <span className="capitalize text-muted-foreground/70">{group.theme}</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-medium">
                        <Check className="h-2.5 w-2.5" />
                        Joined
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Recommended Section */}
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
                      <span className="capitalize text-muted-foreground/70">{group.theme}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Explore More Section */}
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
                      <span className="capitalize text-muted-foreground/70">{group.theme}</span>
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
      {filteredJoined.length === 0 && filteredRecommended.length === 0 && filteredExplore.length === 0 && (
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