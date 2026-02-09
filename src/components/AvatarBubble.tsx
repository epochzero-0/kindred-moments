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
    sm: "h-12 w-12 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-20 w-20 text-base",
  };

  const colorClasses = {
    sakura: "bg-gradient-to-br from-sakura-light to-sakura/20 text-sakura shadow-apple",
    pandan: "bg-gradient-to-br from-pandan-light to-pandan/20 text-pandan shadow-apple",
    muted: "bg-muted text-muted-foreground shadow-apple-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4 + delay * 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center font-semibold`}
      >
        {initials}
      </motion.div>
    </motion.div>
  );
};

export default AvatarBubble;
