import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Calendar, Check, Train } from "lucide-react";
import { useUserProfile, updateUserProfile } from "@/hooks/use-user-profile";

interface Neighbourhood {
  id: string;
  name: string;
  region: "north" | "south" | "east" | "west" | "central";
  members: number;
  eventsThisWeek: number;
}

const neighbourhoods: Neighbourhood[] = [
  // North
  { id: "woodlands", name: "Woodlands", region: "north", members: 156, eventsThisWeek: 5 },
  { id: "yishun", name: "Yishun", region: "north", members: 203, eventsThisWeek: 8 },
  { id: "sembawang", name: "Sembawang", region: "north", members: 89, eventsThisWeek: 3 },
  { id: "amk", name: "Ang Mo Kio", region: "north", members: 178, eventsThisWeek: 6 },
  
  // East
  { id: "tampines", name: "Tampines", region: "east", members: 245, eventsThisWeek: 12 },
  { id: "bedok", name: "Bedok", region: "east", members: 312, eventsThisWeek: 15 },
  { id: "pasir-ris", name: "Pasir Ris", region: "east", members: 134, eventsThisWeek: 4 },
  { id: "punggol", name: "Punggol", region: "east", members: 287, eventsThisWeek: 11 },
  { id: "sengkang", name: "Sengkang", region: "east", members: 256, eventsThisWeek: 9 },
  
  // West
  { id: "jurong-east", name: "Jurong East", region: "west", members: 167, eventsThisWeek: 7 },
  { id: "clementi", name: "Clementi", region: "west", members: 145, eventsThisWeek: 5 },
  { id: "bukit-batok", name: "Bukit Batok", region: "west", members: 123, eventsThisWeek: 4 },
  
  // Central
  { id: "bishan", name: "Bishan", region: "central", members: 198, eventsThisWeek: 8 },
  { id: "toa-payoh", name: "Toa Payoh", region: "central", members: 176, eventsThisWeek: 6 },
  { id: "kallang", name: "Kallang", region: "central", members: 142, eventsThisWeek: 5 },
];

const regionColors = {
  north: { bg: "from-blue-100 to-blue-50", accent: "bg-blue-500", text: "text-blue-600" },
  east: { bg: "from-emerald-100 to-emerald-50", accent: "bg-emerald-500", text: "text-emerald-600" },
  west: { bg: "from-amber-100 to-amber-50", accent: "bg-amber-500", text: "text-amber-600" },
  central: { bg: "from-purple-100 to-purple-50", accent: "bg-purple-500", text: "text-purple-600" },
  south: { bg: "from-rose-100 to-rose-50", accent: "bg-rose-500", text: "text-rose-600" },
};

const regionLabels = {
  north: "North",
  east: "East", 
  west: "West",
  central: "Central",
  south: "South",
};

const EditNeighbourhoodsPage = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [selected, setSelected] = useState<string[]>([]);

  // Load saved neighbourhoods on mount
  useEffect(() => {
    if (profile?.neighbourhoods?.length) {
      setSelected(profile.neighbourhoods);
    }
  }, [profile]);

  const toggleNeighbourhood = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    updateUserProfile({ neighbourhoods: selected });
    navigate("/profile");
  };

  const handleBack = () => {
    navigate("/profile");
  };

  // Group by region
  const grouped = neighbourhoods.reduce((acc, n) => {
    if (!acc[n.region]) acc[n.region] = [];
    acc[n.region].push(n);
    return acc;
  }, {} as Record<string, Neighbourhood[]>);

  const regionOrder: Array<"north" | "east" | "west" | "central"> = ["north", "east", "west", "central"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Edit Neighbourhoods</h1>
            <p className="text-xs text-muted-foreground">Select your MRT stations</p>
          </div>
          <Train className="h-6 w-6 text-pandan" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Tap to select the MRT stations near you
        </motion.p>

        {regionOrder.map((region, regionIndex) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: regionIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-3 w-3 rounded-full ${regionColors[region].accent}`} />
              <h2 className={`font-semibold text-sm ${regionColors[region].text}`}>
                {regionLabels[region]}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {grouped[region]?.map((hood, index) => {
                const isSelected = selected.includes(hood.id);
                const isPrimary = selected[0] === hood.id;
                return (
                  <motion.button
                    key={hood.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: regionIndex * 0.1 + index * 0.05 }}
                    onClick={() => toggleNeighbourhood(hood.id)}
                    className={`relative p-4 rounded-2xl text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? `bg-gradient-to-br ${regionColors[region].bg} border-${region === "north" ? "blue" : region === "east" ? "emerald" : region === "west" ? "amber" : "purple"}-300 shadow-soft`
                        : "bg-white border-transparent shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full ${regionColors[region].accent} flex items-center justify-center text-white`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.div>
                    )}

                    {/* Primary badge */}
                    {isPrimary && (
                      <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full bg-pandan/20 text-pandan font-medium">
                        Primary
                      </span>
                    )}

                    <div className={`flex items-center gap-1.5 ${isPrimary ? "mt-5" : ""}`}>
                      <Train className={`h-4 w-4 ${isSelected ? regionColors[region].text : "text-muted-foreground"}`} />
                      <span className={`font-semibold text-sm ${isSelected ? regionColors[region].text : "text-foreground"}`}>
                        {hood.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {hood.members}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {hood.eventsThisWeek}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fixed Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-5 pt-6 bg-background border-t border-border/30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
      >
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-3 text-sm text-muted-foreground"
          >
            <Check className="w-4 h-4 text-pandan" />
            {selected.length} neighbourhood{selected.length > 1 ? "s" : ""} selected
          </motion.div>
        )}
        <Button
          onClick={handleSave}
          disabled={selected.length === 0}
          className="w-full h-14 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default EditNeighbourhoodsPage;
