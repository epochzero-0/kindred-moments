import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, Sparkles, Coffee, Calendar } from "lucide-react";

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

      {/* Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-[280px] h-[280px] rounded-full border border-primary/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.div
          className="absolute w-[380px] h-[380px] rounded-full border border-sakura/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: -360 }}
          transition={{ 
            opacity: { duration: 1, delay: 0.2 },
            scale: { duration: 1, delay: 0.2 },
            rotate: { duration: 80, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.div
          className="absolute w-[480px] h-[480px] rounded-full border border-lavender/8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ 
            opacity: { duration: 1, delay: 0.4 },
            scale: { duration: 1, delay: 0.4 },
            rotate: { duration: 100, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 relative"
        >
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 w-24 h-24 -m-2 rounded-full bg-gradient-to-br from-primary/30 via-sakura/20 to-lavender/20 blur-xl" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-sakura to-lavender flex items-center justify-center shadow-apple-lg">
            <Heart className="w-10 h-10 text-white fill-white/30" strokeWidth={2} />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-semibold tracking-tight mb-3"
        >
          <span className="text-gradient">Kindred Heart</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Your neighbourhood, reconnected.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { icon: Users, label: "Meet neighbours" },
            { icon: Calendar, label: "Join activities" },
            { icon: Heart, label: "Build community" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border/50 shadow-soft"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full h-14 text-base font-medium rounded-2xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="currentColor"
              />
            </svg>
            Get Started with SingPass
          </Button>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 flex items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-pandan/20 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-pandan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground/80">
            Verified identity, anonymous participation.
          </p>
        </motion.div>
      </div>

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
              fill="hsl(16 85% 58% / 0.05)"
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
