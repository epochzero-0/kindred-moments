import { Home, Users, Compass, Radio } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trio", icon: Users, label: "Trio" },
  { to: "/clan", icon: Compass, label: "Clan" },
  { to: "/pulse", icon: Radio, label: "Pulse" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-lg">
        <div className="mx-3 mb-3 flex items-center justify-around rounded-3xl border border-border/40 bg-card/70 backdrop-blur-xl px-2 py-2 shadow-[0_-4px_30px_-10px_hsl(var(--foreground)/0.06)]">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-colors duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-sakura-light/60"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`relative z-10 h-5 w-5 transition-colors duration-300 ${
                    isActive ? "text-sakura" : "text-muted-foreground/60"
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
