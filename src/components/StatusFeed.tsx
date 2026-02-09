import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, MessageCircle, Plus, X, Send } from "lucide-react";

interface StatusUpdate {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userGradient: string;
  content: string;
  activity?: string;
  location?: string;
  timestamp: Date;
  joinable: boolean;
  responses: number;
  joined: number;
}

const mockStatuses: StatusUpdate[] = [
  {
    id: "s1",
    userId: "u002",
    userName: "Ravi Kumar",
    userInitials: "RK",
    userGradient: "from-emerald-400 to-teal-500",
    content: "Heading to kopitiam for kopi ☕ Anyone want to join?",
    activity: "Kopi session",
    location: "Blk 78, Toa Payoh",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    joinable: true,
    responses: 2,
    joined: 3,
  },
  {
    id: "s2",
    userId: "u003",
    userName: "Aiman Rahman",
    userInitials: "AR",
    userGradient: "from-blue-400 to-indigo-500",
    content: "Evening walk at the park in 30 mins 🚶‍♂️",
    activity: "Evening walk",
    location: "Jurong Lake Gardens",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    joinable: true,
    responses: 5,
    joined: 4,
  },
  {
    id: "s3",
    userId: "u004",
    userName: "Priya Chen",
    userInitials: "PC",
    userGradient: "from-rose-400 to-pink-500",
    content: "Just finished a great meditation session 🧘 Feeling refreshed!",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    joinable: false,
    responses: 8,
    joined: 0,
  },
  {
    id: "s4",
    userId: "u005",
    userName: "Wei Lin Tan",
    userInitials: "WL",
    userGradient: "from-amber-400 to-orange-500",
    content: "Board game night at my place tonight! 🎲",
    activity: "Board games",
    location: "Bedok Central",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    joinable: true,
    responses: 12,
    joined: 6,
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

interface StatusFeedProps {
  compact?: boolean;
}

const StatusFeed = ({ compact = false }: StatusFeedProps) => {
  const [statuses, setStatuses] = useState<StatusUpdate[]>(mockStatuses);
  const [showNewStatus, setShowNewStatus] = useState(false);
  const [newContent, setNewContent] = useState("");

  const handlePostStatus = () => {
    if (!newContent.trim()) return;

    const newStatus: StatusUpdate = {
      id: `s${Date.now()}`,
      userId: "u001",
      userName: "Sarah Tan",
      userInitials: "ST",
      userGradient: "from-violet-400 to-purple-500",
      content: newContent,
      timestamp: new Date(),
      joinable: false,
      responses: 0,
      joined: 0,
    };

    setStatuses([newStatus, ...statuses]);
    setNewContent("");
    setShowNewStatus(false);
  };

  const displayStatuses = compact ? statuses.slice(0, 3) : statuses;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Status updates</h2>
          <p className="text-sm text-muted-foreground">See what your community is up to</p>
        </div>
        <button
          onClick={() => setShowNewStatus(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-medium shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Post update
        </button>
      </div>

      {/* New status input (inline) */}
      {showNewStatus && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl shadow-elevated p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              ST
            </div>
            <div className="flex-1">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What are you up to? Share with your clan..."
                className="w-full p-3 rounded-xl bg-muted border-none resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <button className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition-colors">
                    📍 Add location
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition-colors">
                    🎯 Make joinable
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewStatus(false)}
                    className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostStatus}
                    disabled={!newContent.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status list */}
      <div className="space-y-4">
        {displayStatuses.map((status, i) => (
          <motion.div
            key={status.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-elevated p-5 transition-all duration-300 hover:shadow-elevated-lg"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${status.userGradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                {status.userInitials}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">{status.userName}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{formatTime(status.timestamp)}</span>
                </div>

                {/* Content */}
                <p className="text-foreground mb-3">{status.content}</p>

                {/* Activity & Location */}
                {(status.activity || status.location) && (
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {status.activity && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                        🎯 {status.activity}
                      </span>
                    )}
                    {status.location && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {status.location}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {status.joinable && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pandan/10 text-pandan font-medium text-sm hover:bg-pandan hover:text-white transition-all">
                      <Users className="h-4 w-4" />
                      Join ({status.joined})
                    </button>
                  )}
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    {status.responses > 0 ? `${status.responses} replies` : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {compact && statuses.length > 3 && (
        <button className="w-full mt-4 py-3 text-center text-primary font-medium hover:underline">
          View all updates →
        </button>
      )}
    </div>
  );
};

export default StatusFeed;
