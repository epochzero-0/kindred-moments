import { Home, Users, Compass, Radio, Settings, Bell, Heart, BookHeart, Target, MessageCircle, User } from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-data";

const mainTabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trio", icon: Users, label: "Trio Match" },
  { to: "/clan", icon: Compass, label: "Clans" },
  { to: "/pulse", icon: Radio, label: "Pulse" },
];

const wellnessTabs = [
  { to: "/wellness", icon: Heart, label: "Wellness" },
  { to: "/journal", icon: BookHeart, label: "Journal" },
  { to: "/goals", icon: Target, label: "Goals" },
];

const socialTabs = [
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const currentUser = useCurrentUser();
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed left-0 top-0 bottom-0 z-50 w-72 glass-strong border-r border-white/20">
      <div className="flex flex-col h-full">
        {/* Logo / Brand */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sakura via-purple-500 to-primary flex items-center justify-center">
              <span className="text-white text-lg font-bold">K</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Kindred</h1>
              <p className="text-xs text-muted-foreground">Community wellness</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground">Discover</p>
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <tab.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span
                  className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}

          <p className="px-4 py-2 pt-4 text-xs font-medium text-muted-foreground">Wellness</p>
          {wellnessTabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <tab.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span
                  className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}

          <p className="px-4 py-2 pt-4 text-xs font-medium text-muted-foreground">Connect</p>
          {socialTabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <tab.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span
                  className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Alerts</span>
            </button>
            <button className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* User section */}
        <Link to="/profile" className="block p-4 m-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50 hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sakura to-primary flex items-center justify-center text-sm font-semibold text-white shadow-lg">
              {currentUser ? getInitials(currentUser.name) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.neighborhood || 'Singapore'} · Active</p>
            </div>
            <div className="h-2.5 w-2.5 rounded-full bg-pandan animate-pulse" />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
