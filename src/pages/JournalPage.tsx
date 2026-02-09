import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Plus, Calendar, Lock, ChevronRight, X, Save } from "lucide-react";

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

const moodEmojis = ["😢", "😔", "😐", "🙂", "😊"];
const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"];

const suggestedTags = ["gratitude", "social", "exercise", "work", "self-care", "nature", "reflection", "goals"];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

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
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative px-8 lg:px-12 pt-12 pb-8">
          <motion.div {...fade(0)} className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Book className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-amber-600">Journal</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Your private space
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Only you can see your entries
              </p>
            </div>

            <button
              onClick={() => setShowNewEntry(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5" />
              New entry
            </button>
          </motion.div>
        </div>
      </div>

      <div className="px-8 lg:px-12 pb-12">
        {/* Stats */}
        <motion.div {...fade(0.1)} className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">{entries.length}</p>
            <p className="text-sm text-muted-foreground">Total entries</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">7</p>
            <p className="text-sm text-muted-foreground">Day streak</p>
          </div>
          <div className="bg-white rounded-2xl shadow-elevated p-5">
            <p className="text-3xl font-bold text-foreground">
              {moodEmojis[Math.round(entries.reduce((a, e) => a + e.mood, 0) / entries.length) - 1]}
            </p>
            <p className="text-sm text-muted-foreground">Avg mood</p>
          </div>
        </motion.div>

        {/* Entries list */}
        <motion.div {...fade(0.15)}>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent entries</h2>
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                onClick={() => setSelectedEntry(entry)}
                className="group bg-white rounded-2xl shadow-elevated p-6 cursor-pointer transition-all duration-300 hover:shadow-elevated-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl shrink-0">
                    {moodEmojis[entry.mood - 1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-foreground">{formatDate(entry.date)}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{moodLabels[entry.mood - 1]}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{entry.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Writing prompts */}
        <motion.div {...fade(0.3)} className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Writing prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { prompt: "What are you grateful for today?", emoji: "🙏" },
              { prompt: "What's one thing you learned recently?", emoji: "💡" },
              { prompt: "How are you really feeling right now?", emoji: "💭" },
              { prompt: "What would make tomorrow great?", emoji: "✨" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setNewContent(item.prompt + "\n\n");
                  setShowNewEntry(true);
                }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-elevated text-left hover:shadow-elevated-lg transition-all"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-medium text-foreground">{item.prompt}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowNewEntry(false)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">How are you feeling?</h2>

              {/* Mood selector */}
              <div className="flex justify-between mb-8">
                {moodEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setNewMood(i + 1)}
                    className={`h-14 w-14 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      newMood === i + 1
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg scale-110"
                        : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Content */}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write about your day..."
                className="w-full h-40 p-4 rounded-xl bg-muted border-none resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-6"
              />

              {/* Tags */}
              <div className="mb-8">
                <p className="text-sm font-medium text-foreground mb-3">Add tags</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        newTags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Save className="h-5 w-5" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-8"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl">
                  {moodEmojis[selectedEntry.mood - 1]}
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatDate(selectedEntry.date)}</p>
                  <p className="text-sm text-muted-foreground">Feeling {moodLabels[selectedEntry.mood - 1].toLowerCase()}</p>
                </div>
              </div>

              <p className="text-foreground leading-relaxed mb-6">{selectedEntry.content}</p>

              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-muted-foreground">
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
