import { Home, Users, Compass, Radio, Heart, BookHeart, Target, MessageCircle, User } from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-data";

const mainTabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trio", icon: Users, label: "Trio" },
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

const NavItem = ({ to, icon: Icon, label, isActive }: { to: string; icon: typeof Home; label: string; isActive: boolean }) => (
  <NavLink
    to={to}
    className="relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group"
  >
    {isActive && (
      <motion.div
        layoutId="nav-active"
        className="absolute inset-0 rounded-xl bg-primary/8"
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    )}
    <div className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    }`}>
      <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
    </div>
    <span className={`relative z-10 text-[13px] font-medium transition-colors duration-200 ${
      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
    }`}>
      {label}
    </span>
  </NavLink>
);

const BottomNav = () => {
  const location = useLocation();
  const currentUser = useCurrentUser();
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <nav className="fixed left-0 top-0 bottom-0 z-50 w-56 bg-white/80 backdrop-blur-xl border-r border-border/40">
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary via-sakura to-lavender flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">K</span>
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">Kindred</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 space-y-6 overflow-y-auto">
          <div className="space-y-0.5">
            {mainTabs.map((tab) => (
              <NavItem key={tab.to} {...tab} isActive={location.pathname === tab.to} />
            ))}
          </div>

          <div>
            <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Wellness</p>
            <div className="space-y-0.5">
              {wellnessTabs.map((tab) => (
                <NavItem key={tab.to} {...tab} isActive={location.pathname === tab.to} />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Connect</p>
            <div className="space-y-0.5">
              {socialTabs.map((tab) => (
                <NavItem key={tab.to} {...tab} isActive={location.pathname === tab.to} />
              ))}
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-3 pt-4 border-t border-border/40">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-sakura flex items-center justify-center text-xs font-semibold text-white">
              {currentUser ? getInitials(currentUser.name) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentUser?.name || 'Loading...'}</p>
              <p className="text-[11px] text-muted-foreground">{currentUser?.neighbourhood || ''}</p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
