import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Calendar, Check, Train } from "lucide-react";

interface NeighbourhoodSelectProps {
  onComplete: (neighbourhoods: string[]) => void;
  onBack: () => void;
}

interface Neighbourhood {
  id: string;
  name: string;
  region: "north" | "south" | "east" | "west" | "central";
  members: number;
  eventsThisWeek: number;
  postalPrefixes: string[]; // First 2 digits of postal codes in this area
}

const neighbourhoods: Neighbourhood[] = [
  // North
  { id: "woodlands", name: "Woodlands", region: "north", members: 156, eventsThisWeek: 5, postalPrefixes: ["72", "73"] },
  { id: "yishun", name: "Yishun", region: "north", members: 203, eventsThisWeek: 8, postalPrefixes: ["76"] },
  { id: "sembawang", name: "Sembawang", region: "north", members: 89, eventsThisWeek: 3, postalPrefixes: ["75"] },
  { id: "amk", name: "Ang Mo Kio", region: "north", members: 178, eventsThisWeek: 6, postalPrefixes: ["56", "57"] },
  
  // East
  { id: "tampines", name: "Tampines", region: "east", members: 245, eventsThisWeek: 12, postalPrefixes: ["52", "82"] },
  { id: "bedok", name: "Bedok", region: "east", members: 312, eventsThisWeek: 15, postalPrefixes: ["46", "47", "48"] },
  { id: "pasir-ris", name: "Pasir Ris", region: "east", members: 134, eventsThisWeek: 4, postalPrefixes: ["51"] },
  { id: "punggol", name: "Punggol", region: "east", members: 287, eventsThisWeek: 11, postalPrefixes: ["82"] },
  { id: "sengkang", name: "Sengkang", region: "east", members: 256, eventsThisWeek: 9, postalPrefixes: ["54", "55"] },
  
  // West
  { id: "jurong-east", name: "Jurong East", region: "west", members: 167, eventsThisWeek: 7, postalPrefixes: ["60", "64"] },
  { id: "clementi", name: "Clementi", region: "west", members: 145, eventsThisWeek: 5, postalPrefixes: ["12"] },
  { id: "bukit-batok", name: "Bukit Batok", region: "west", members: 123, eventsThisWeek: 4, postalPrefixes: ["65"] },
  
  // Central
  { id: "bishan", name: "Bishan", region: "central", members: 198, eventsThisWeek: 8, postalPrefixes: ["57"] },
  { id: "toa-payoh", name: "Toa Payoh", region: "central", members: 176, eventsThisWeek: 6, postalPrefixes: ["31"] },
  { id: "kallang", name: "Kallang", region: "central", members: 142, eventsThisWeek: 5, postalPrefixes: ["33", "34"] },
];

const regionColors = {
  north: { bg: "from-blue-100 to-blue-50", accent: "bg-blue-500", text: "text-blue-600" },
  east: { bg: "from-emerald-100 to-emerald-50", accent: "bg-emerald-500", text: "text-emerald-600" },
  west: { bg: "from-amber-100 to-amber-50", accent: "bg-amber-500", text: "text-amber-600" },
  central: { bg: "from-purple-100 to-purple-50", accent: "bg-purple-500", text: "text-purple-600" },
  south: { bg: "from-rose-100 to-rose-50", accent: "bg-rose-500", text: "text-rose-600" },
};

const NeighbourhoodSelect = ({ onComplete, onBack }: NeighbourhoodSelectProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleNeighbourhood = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onComplete(selected);
  };

  // Group by region
  const grouped = neighbourhoods.reduce((acc, n) => {
    if (!acc[n.region]) acc[n.region] = [];
    acc[n.region].push(n);
    return acc;
  }, {} as Record<string, Neighbourhood[]>);

  const regionOrder: ("central" | "north" | "east" | "west")[] = ["central", "north", "east", "west"];
  const regionLabels = { north: "North", east: "East", west: "West", central: "Central", south: "South" };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(155 55% 42% / 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "-20%",
            left: "-20%",
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(16 85% 58% / 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            bottom: "-20%",
            right: "-20%",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 py-4 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">Step 3 of 3</span>
        <div className="w-9" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-56">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pandan/10 text-pandan text-sm font-medium mb-3">
            <MapPin className="w-4 h-4" />
            Based on your location
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Choose your neighbourhood
          </h1>
          <p className="text-muted-foreground text-sm">
            Select one or more areas to connect with neighbours
          </p>
        </motion.div>

        {/* Regions */}
        {regionOrder.map((region, regionIndex) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + regionIndex * 0.05 }}
            className="mb-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${regionColors[region].accent}`} />
              <span className="text-sm font-medium text-foreground/70">{regionLabels[region]}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              {grouped[region]?.map((neighbourhood, index) => {
                const isSelected = selected.includes(neighbourhood.id);
                const colors = regionColors[region];
                
                return (
                  <motion.button
                    key={neighbourhood.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + regionIndex * 0.05 + index * 0.02 }}
                    onClick={() => toggleNeighbourhood(neighbourhood.id)}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-200 ${
                      isSelected
                        ? `bg-gradient-to-br ${colors.bg} border-2 border-current/20 shadow-soft`
                        : "bg-white/60 backdrop-blur-sm border border-border/40 hover:bg-white/80"
                    }`}
                  >
                    {/* Selected Check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full ${colors.accent} flex items-center justify-center`}
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.div>
                    )}

                    {/* Station Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <Train className={`w-4 h-4 ${isSelected ? colors.text : "text-muted-foreground"}`} />
                      <span className={`font-medium text-sm ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                        {neighbourhood.name}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {neighbourhood.members}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {neighbourhood.eventsThisWeek} events
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-4"
        >
          You can change this anytime in settings
        </motion.p>
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
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className="w-full h-14 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          Confirm Neighbourhood{selected.length > 1 ? "s" : ""}
        </Button>
      </motion.div>
    </div>
  );
};

export default NeighbourhoodSelect;
