import { motion } from "framer-motion";

interface AvatarBubbleProps {
  initials: string;
  color: "sakura" | "pandan" | "muted";
  size?: "sm" | "md" | "lg";
  delay?: number;
  className?: string;
}

const AvatarBubble = ({ initials, color, size = "md", delay = 0, className = "" }: AvatarBubbleProps) => {
  const sizeClasses = {
    sm: "h-14 w-14 text-sm",
    md: "h-18 w-18 text-base",
    lg: "h-20 w-20 text-lg",
  };

  const colorClasses = {
    sakura: "bg-sakura-light text-foreground/70 shadow-[0_0_30px_hsl(var(--sakura)/0.25)]",
    pandan: "bg-pandan-light text-foreground/70 shadow-[0_0_30px_hsl(var(--pandan)/0.25)]",
    muted: "bg-muted text-muted-foreground shadow-[0_0_20px_hsl(var(--border)/0.4)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center font-medium tracking-wide backdrop-blur-sm border border-border/30`}
      >
        {initials}
      </motion.div>
    </motion.div>
  );
};

export default AvatarBubble;
