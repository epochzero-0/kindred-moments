import { motion } from "framer-motion";
import ActivityCard from "@/components/ActivityCard";

const activities = [
  { name: "Morning walk at East Coast", duration: "30 min", distance: "1.2 km", peopleGoing: 4, variant: "sakura" as const, emoji: "🌸" },
  { name: "Kopi & sketch at Tiong Bahru", duration: "1 hr", distance: "0.8 km", peopleGoing: 3, variant: "pandan" as const, emoji: "☕" },
  { name: "Sunset yoga at Marina Barrage", duration: "45 min", distance: "2.5 km", peopleGoing: 7, variant: "sakura" as const, emoji: "🧘" },
  { name: "Cook laksa together", duration: "1.5 hrs", distance: "0.3 km", peopleGoing: 5, variant: "pandan" as const, emoji: "🍜" },
  { name: "Read quietly at Botanic Gardens", duration: "1 hr", distance: "3 km", peopleGoing: 2, variant: "pandan" as const, emoji: "📖" },
  { name: "Film photography walk", duration: "2 hrs", distance: "1.5 km", peopleGoing: 6, variant: "sakura" as const, emoji: "📷" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-5 pb-28 pt-16">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-2"
        >
          <p className="text-sm font-medium text-muted-foreground tracking-wide">
            Good afternoon ☀️
          </p>
        </motion.div>

        {/* Hero question */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[2rem] font-semibold leading-tight tracking-tight text-foreground mb-10"
        >
          What feels nice
          <br />
          today?
        </motion.h1>

        {/* Activity cards */}
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <ActivityCard key={activity.name} {...activity} delay={0.25 + i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
