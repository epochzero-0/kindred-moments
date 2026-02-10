import { Home, Compass, Calendar, Heart, Target, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/wellness", icon: Heart, label: "Wellness" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/profile", icon: User, label: "Me" },
];

const BottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Hover trigger zone */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-12 z-40"
        onMouseEnter={() => setIsVisible(true)}
      />
      
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onMouseLeave={() => setIsVisible(false)}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-t border-white/40 shadow-lg px-2"
          >
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.to || 
                  location.pathname.startsWith(tab.to + "/");
                
                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className="relative flex flex-col items-center justify-center flex-1 h-full group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomnav-active"
                        className="absolute bottom-1 h-1 w-8 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <div
                      className={`flex items-center justify-center transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;
