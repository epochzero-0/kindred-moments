import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ArrowLeft, Check } from "lucide-react";

interface ProfileSetupProps {
  onComplete: (profile: {
    displayName: string;
    avatar: string | null;
    languages: string[];
    bio: string;
  }) => void;
  onBack: () => void;
}

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ms", label: "Bahasa" },
  { code: "ta", label: "தமிழ்" },
];

const ProfileSetup = ({ onComplete, onBack }: ProfileSetupProps) => {
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [bio, setBio] = useState("");

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.filter((l) => l !== code)
        : [...prev, code]
    );
  };

  const handleAvatarClick = () => {
    if (!avatar) {
      // Use lorelei style for a cleaner, modern illustrated look
      const seed = displayName || Math.random().toString(36).substring(7);
      setAvatar(`https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede`);
    } else {
      setAvatar(null);
    }
  };

  const handleSubmit = () => {
    if (!displayName.trim() || selectedLanguages.length === 0) return;
    onComplete({
      displayName: displayName.trim(),
      avatar,
      languages: selectedLanguages,
      bio: bio.trim(),
    });
  };

  const isValid = displayName.trim().length > 0 && selectedLanguages.length > 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(16 85% 58% / 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "-20%",
            right: "-20%",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 py-4 flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm text-muted-foreground">Step 1 of 3</span>
        <div className="w-9" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6">
        {/* Title + Avatar Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-6"
        >
          {/* Avatar */}
          <button onClick={handleAvatarClick} className="relative shrink-0">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden transition-all ${
              avatar 
                ? "ring-3 ring-primary/20" 
                : "bg-muted/50 border-2 border-dashed border-border hover:border-primary/40"
            }`}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            {avatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pandan flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
          
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-1">
              Create your profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Just the basics to get started
            </p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-5 shadow-soft border border-border/30 space-y-5"
        >
          {/* Display Name */}
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Display name
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              className="h-11 rounded-xl bg-background/50 border-border/50 text-base"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Languages you speak
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-muted/50 text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 flex justify-between">
              <span>Bio <span className="font-normal text-muted-foreground">(optional)</span></span>
              <span className="text-xs text-muted-foreground">{bio.length}/150</span>
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 150))}
              placeholder="A little about yourself..."
              className="min-h-[70px] rounded-xl bg-background/50 border-border/50 resize-none text-sm"
            />
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-6"
        >
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-14 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            Next
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
