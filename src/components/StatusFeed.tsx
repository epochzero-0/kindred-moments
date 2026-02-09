import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Plus, Send } from "lucide-react";

interface StatusUpdate {
  id: string;
  userName: string;
  userInitials: string;
  content: string;
  location?: string;
  timestamp: Date;
  joinable: boolean;
  joined: number;
}

const mockStatuses: StatusUpdate[] = [
  {
    id: "s1",
    userName: "Ravi",
    userInitials: "RK",
    content: "Heading to kopitiam for kopi ☕ Anyone want to join?",
    location: "Toa Payoh",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    joinable: true,
    joined: 3,
  },
  {
    id: "s2",
    userName: "Aiman",
    userInitials: "AR",
    content: "Evening walk in 30 mins 🚶‍♂️",
    location: "Jurong Lake",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    joinable: true,
    joined: 4,
  },
  {
    id: "s3",
    userName: "Priya",
    userInitials: "PC",
    content: "Just finished meditation 🧘 Feeling refreshed!",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    joinable: false,
    joined: 0,
  },
  {
    id: "s4",
    userName: "Wei Lin",
    userInitials: "WL",
    content: "Board game night tonight! 🎲",
    location: "Bedok",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    joinable: true,
    joined: 6,
  },
];

const formatTime = (date: Date) => {
  const mins = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

interface StatusFeedProps {
  compact?: boolean;
}

const StatusFeed = ({ compact = false }: StatusFeedProps) => {
  const [statuses, setStatuses] = useState<StatusUpdate[]>(mockStatuses);
  const [showInput, setShowInput] = useState(false);
  const [newContent, setNewContent] = useState("");

  const handlePost = () => {
    if (!newContent.trim()) return;
    setStatuses([{
      id: `s${Date.now()}`,
      userName: "You",
      userInitials: "ST",
      content: newContent,
      timestamp: new Date(),
      joinable: false,
      joined: 0,
    }, ...statuses]);
    setNewContent("");
    setShowInput(false);
  };

  const displayStatuses = compact ? statuses.slice(0, 4) : statuses;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-foreground">Updates</h3>
        <button
          onClick={() => setShowInput(!showInput)}
          className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* New status input */}
      {showInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4"
        >
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-3 rounded-xl bg-muted/50 border-none resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[60px]"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowInput(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!newContent.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium disabled:opacity-40"
            >
              <Send className="h-3 w-3" /> Post
            </button>
          </div>
        </motion.div>
      )}

      {/* Status list */}
      <div className="space-y-4">
        {displayStatuses.map((status, i) => (
          <motion.div
            key={status.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group"
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/70 to-sakura/70 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
                {status.userInitials}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name & time */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-medium text-foreground">{status.userName}</span>
                  <span className="text-[11px] text-muted-foreground">{formatTime(status.timestamp)}</span>
                </div>

                {/* Content */}
                <p className="text-[13px] text-foreground/80 leading-relaxed">{status.content}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-1.5">
                  {status.location && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />{status.location}
                    </span>
                  )}
                  {status.joinable && (
                    <button className="text-[11px] font-medium text-pandan hover:underline">
                      Join +{status.joined}
                    </button>
                  )}
                  <button className="flex items-center gap-1 text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="h-3 w-3" /> Reply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {compact && statuses.length > 4 && (
        <button className="w-full mt-4 pt-3 border-t border-border/50 text-xs text-primary font-medium hover:underline">
          See all updates
        </button>
      )}
    </div>
  );
};

export default StatusFeed;
