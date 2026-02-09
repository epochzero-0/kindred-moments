import { Home, Compass, Calendar, Heart, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/wellness", icon: Heart, label: "Wellness" },
  { to: "/profile", icon: User, label: "Me" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-border/40 px-2 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || 
            (tab.to !== "/" && location.pathname.startsWith(tab.to));
          
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute top-1 h-1 w-8 rounded-full bg-primary"
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
    </nav>
  );
};

export default BottomNav;
