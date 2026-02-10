import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Users, MapPin, Sparkles, Coffee, Calendar } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const floatingIcons = [
  { icon: Heart, color: "text-sakura", position: { top: "15%", left: "12%" }, delay: 0 },
  { icon: Users, color: "text-primary", position: { top: "20%", right: "15%" }, delay: 0.5 },
  { icon: MapPin, color: "text-pandan", position: { top: "35%", left: "8%" }, delay: 1 },
  { icon: Coffee, color: "text-honey", position: { top: "45%", right: "10%" }, delay: 1.5 },
  { icon: Calendar, color: "text-lavender", position: { bottom: "35%", left: "15%" }, delay: 2 },
  { icon: Sparkles, color: "text-primary", position: { bottom: "30%", right: "12%" }, delay: 2.5 },
];

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated Fluid Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary organic blob - warm coral */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, hsl(16 85% 58% / 0.8) 0%, hsl(16 85% 58% / 0) 70%)",
            filter: "blur(60px)",
          }}
          initial={{ x: "-30%", y: "-20%" }}
          animate={{
            x: ["-30%", "-25%", "-35%", "-30%"],
            y: ["-20%", "-15%", "-25%", "-20%"],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary blob - sakura pink */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, hsl(350 75% 60% / 0.7) 0%, hsl(350 75% 60% / 0) 70%)",
            filter: "blur(50px)",
            right: "-10%",
            top: "20%",
          }}
          animate={{
            x: ["0%", "5%", "-5%", "0%"],
            y: ["0%", "-10%", "5%", "0%"],
            scale: [1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary blob - lavender */}
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full opacity-45"
          style={{
            background: "radial-gradient(circle, hsl(270 50% 65% / 0.7) 0%, hsl(270 50% 65% / 0) 70%)",
            filter: "blur(55px)",
            left: "10%",
            bottom: "-10%",
          }}
          animate={{
            x: ["0%", "-8%", "8%", "0%"],
            y: ["0%", "8%", "-5%", "0%"],
            scale: [1, 1.08, 0.92, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Accent blob - honey/pandan */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, hsl(155 55% 42% / 0.6) 0%, hsl(38 92% 60% / 0.4) 50%, transparent 70%)",
            filter: "blur(45px)",
            right: "20%",
            bottom: "15%",
          }}
          animate={{
            x: ["0%", "10%", "-5%", "0%"],
            y: ["0%", "-8%", "10%", "0%"],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              background: i % 2 === 0 ? "hsl(16 85% 58% / 0.3)" : "hsl(350 75% 60% / 0.3)",
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.color} opacity-40`}
          style={item.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.6, delay: item.delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay },
          }}
        >
          <item.icon className="w-7 h-7" strokeWidth={1.5} />
        </motion.div>
      ))}

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center px-8 text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Logo - Clean Heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sakura flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <Heart className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
          </motion.div>
        </motion.div>

        {/* Title - Big & Bold */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-4"
        >
          Kindred Heart
        </motion.h1>

        {/* Single tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-muted-foreground mb-12"
        >
          Rediscover your neighbourhood.
        </motion.p>

        {/* CTA Button - Clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 px-8 text-base font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-foreground text-background hover:bg-foreground/90 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Privacy Note - Minimal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 text-xs text-muted-foreground/60"
        >
          Secured with SingPass • Your data stays private
        </motion.p>
      </motion.div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path
              fill="hsl(16 85% 58% / 0.08)"
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
