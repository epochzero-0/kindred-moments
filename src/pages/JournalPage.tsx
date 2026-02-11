import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lock, ChevronRight, X, Save, FileText, Flame, Frown, Meh, Minus, Smile, Laugh, Heart, Lightbulb, MessageSquare, Sparkles, type LucideIcon } from "lucide-react";

interface JournalEntry {
  id: string;
  date: Date;
  mood: number;
  content: string;
  tags: string[];
}

const mockEntries: JournalEntry[] = [
  {
    id: "j1",
    date: new Date(2026, 1, 9),
    mood: 4,
    content: "Had a lovely kopi session with the Jurong Foodies clan today. Met two new people - they were so warm and welcoming. Feeling grateful for this community.",
    tags: ["gratitude", "social"],
  },
  {
    id: "j2",
    date: new Date(2026, 1, 8),
    mood: 3,
    content: "Busy day at work. Did a 5-minute breathing exercise during lunch which helped. Need to remember to take more breaks.",
    tags: ["work", "self-care"],
  },
  {
    id: "j3",
    date: new Date(2026, 1, 7),
    mood: 5,
    content: "Morning walk at East Coast was magical! The sunrise was beautiful and I got my steps in early. Started the day feeling energized.",
    tags: ["exercise", "nature"],
  },
  {
    id: "j4",
    date: new Date(2026, 1, 5),
    mood: 2,
    content: "Feeling a bit low today. Reached out to a clan member for support - it helped to talk. Remember: it's okay to have off days.",
    tags: ["reflection", "support"],
  },
];

const moodIcons: LucideIcon[] = [Frown, Meh, Minus, Smile, Laugh];
const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"];
const suggestedTags = ["gratitude", "social", "exercise", "work", "self-care", "nature", "reflection", "goals"];

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [newMood, setNewMood] = useState(3);
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short" });
  };

  const handleSaveEntry = () => {
    const newEntry: JournalEntry = {
      id: `j${Date.now()}`,
      date: new Date(),
      mood: newMood,
      content: newContent,
      tags: newTags,
    };
    setEntries([newEntry, ...entries]);
    setShowNewEntry(false);
    setNewMood(3);
    setNewContent("");
    setNewTags([]);
  };

  const toggleTag = (tag: string) => {
    setNewTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="min-h-screen px-8 py-10 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-10"
      >
        <div>
          <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Private journal
          </p>
          <h1 className="text-3xl text-foreground">Your private space</h1>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium shadow-soft hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New entry
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-8 mb-10 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-lavender/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-lavender" />
          </div>
          <span className="text-muted-foreground">{entries.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-muted-foreground">7 day streak</span>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const avgMoodIndex = Math.round(entries.reduce((a, e) => a + e.mood, 0) / entries.length) - 1;
            const AvgMoodIcon = moodIcons[avgMoodIndex] || Smile;
            return (
              <div className="h-7 w-7 rounded-lg bg-pandan/10 flex items-center justify-center">
                <AvgMoodIcon className="h-4 w-4 text-pandan" />
              </div>
            );
          })()}
          <span className="text-muted-foreground">Avg mood</span>
        </div>
      </motion.div>

      {/* Entries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <h2 className="font-serif text-xl text-foreground mb-4">Recent entries</h2>
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              onClick={() => setSelectedEntry(entry)}
              className="group bg-white rounded-2xl shadow-soft p-5 cursor-pointer card-hover"
            >
              <div className="flex items-start gap-4">
                {(() => {
                  const MoodIcon = moodIcons[entry.mood - 1] || Smile;
                  return (
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MoodIcon className="h-5 w-5 text-primary" />
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{formatDate(entry.date)}</span>
                    <span className="text-xs text-muted-foreground">· {moodLabels[entry.mood - 1]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{entry.content}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Writing prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10"
      >
        <h2 className="font-serif text-xl text-foreground mb-4">Writing prompts</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { prompt: "What are you grateful for today?", icon: Heart },
            { prompt: "What's one thing you learned recently?", icon: Lightbulb },
            { prompt: "How are you really feeling right now?", icon: MessageSquare },
            { prompt: "What would make tomorrow great?", icon: Sparkles },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => { setNewContent(item.prompt + "\n\n"); setShowNewEntry(true); }}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-soft text-left card-hover"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{item.prompt}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start pt-16 justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowNewEntry(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <p className="text-xs text-muted-foreground mb-4">
                {new Date().toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}
              </p>

              <h2 className="text-xl font-medium text-foreground mb-5">How are you feeling?</h2>

              {/* Mood selector */}
              <div className="flex justify-between mb-6">
                {moodIcons.map((MoodIcon, i) => (
                  <button
                    key={i}
                    onClick={() => setNewMood(i + 1)}
                    className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${newMood === i + 1 ? "bg-primary/20 scale-110" : "bg-muted hover:bg-muted/70"
                      }`}
                  >
                    <MoodIcon className={`h-5 w-5 ${newMood === i + 1 ? "text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>

              {/* Content */}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write about your day..."
                className="w-full h-64 p-4 rounded-xl bg-muted border-none resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-5"
              />

              {/* Tags */}
              <div className="mb-6">
                <p className="text-xs font-medium text-foreground mb-2">Add tags</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${newTags.includes(tag) ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveEntry}
                disabled={!newContent.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium shadow-soft disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4" />
                Save entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Entry Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-8"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                {(() => {
                  const MoodIcon = moodIcons[selectedEntry.mood - 1] || Smile;
                  return (
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MoodIcon className="h-6 w-6 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <p className="font-medium text-foreground">{formatDate(selectedEntry.date)}</p>
                  <p className="text-xs text-muted-foreground">Feeling {moodLabels[selectedEntry.mood - 1].toLowerCase()}</p>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-5">{selectedEntry.content}</p>

              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalPage;
