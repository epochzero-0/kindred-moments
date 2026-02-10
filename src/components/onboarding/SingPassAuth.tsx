import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Shield, Eye, EyeOff, ArrowLeft, Fingerprint, Lock, Sparkles } from "lucide-react";

interface SingPassAuthProps {
  onSuccess: (profile: { displayName: string; postalCode: string; userId: string }) => void;
  onBack: () => void;
}

type AuthStep = "login" | "verifying" | "success";

const SingPassAuth = ({ onSuccess, onBack }: SingPassAuthProps) => {
  const [step, setStep] = useState<AuthStep>("login");
  const [singpassId, setSingpassId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifyStep, setVerifyStep] = useState(0);

  // Mock user data that would come from SingPass
  const mockProfile = {
    displayName: "Wei Ming",
    postalCode: "520123",
    userId: `KH${Date.now().toString(36).toUpperCase()}`,
  };

  const handleLogin = () => {
    if (!singpassId || !password) {
      setError("Please enter your credentials");
      return;
    }
    setError("");
    setStep("verifying");
  };

  useEffect(() => {
    if (step === "verifying") {
      const intervals = [800, 1600, 2400];
      intervals.forEach((delay, i) => {
        setTimeout(() => setVerifyStep(i + 1), delay);
      });
      const timer = setTimeout(() => {
        setStep("success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        onSuccess(mockProfile);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Animated Background - matching welcome screen */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, hsl(16 85% 58% / 0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
            top: "-20%",
            right: "-10%",
          }}
          animate={{
            x: ["0%", "5%", "0%"],
            y: ["0%", "5%", "0%"],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, hsl(350 75% 60% / 0.5) 0%, transparent 70%)",
            filter: "blur(50px)",
            bottom: "-10%",
            left: "-10%",
          }}
          animate={{
            x: ["0%", "-5%", "0%"],
            y: ["0%", "-5%", "0%"],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, hsl(270 50% 65% / 0.5) 0%, transparent 70%)",
            filter: "blur(45px)",
            top: "40%",
            left: "20%",
          }}
          animate={{
            x: ["0%", "10%", "0%"],
            y: ["0%", "-10%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 py-4 flex items-center"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 flex-1 flex flex-col px-6 pb-8"
          >
            {/* SingPass Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft border border-border/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C41E3A] to-[#A01830] flex items-center justify-center shadow-sm">
                  <Fingerprint className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Singpass</p>
                  <p className="text-xs text-muted-foreground">Verified Login</p>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to verify your identity
              </p>
            </motion.div>

            {/* Login Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-3xl p-6 shadow-elevated border border-border/30"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    Singpass ID
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your Singpass ID"
                    value={singpassId}
                    onChange={(e) => setSingpassId(e.target.value)}
                    className="h-13 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-13 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 pr-12 transition-colors text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                className="w-full h-14 text-base font-medium rounded-2xl mt-6 bg-gradient-to-r from-primary to-sakura hover:from-primary/90 hover:to-sakura/90 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Continue
              </Button>
            </motion.div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-pandan" />
              <p className="text-sm text-muted-foreground">
                256-bit encrypted connection
              </p>
            </motion.div>

            {/* Demo Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-6"
            >
              <div className="p-4 rounded-2xl bg-lavender/10 border border-lavender/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-lavender mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground/80 mb-1">Demo Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Enter any credentials to continue. This is a simulated authentication for demonstration purposes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-6"
          >
            {/* Verification Animation */}
            <div className="relative mb-10">
              {/* Outer orbital rings */}
              <motion.div
                className="absolute inset-0 w-32 h-32 -m-4 rounded-full border-2 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
              </motion.div>
              <motion.div
                className="absolute inset-0 w-40 h-40 -m-8 rounded-full border border-sakura/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sakura" />
              </motion.div>
              
              {/* Center icon */}
              <motion.div
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-sakura to-lavender flex items-center justify-center shadow-apple-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-foreground mb-3"
            >
              Verifying Identity
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-10"
            >
              Connecting to Singpass securely...
            </motion.p>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-xs space-y-4"
            >
              {[
                { text: "Validating credentials", icon: Fingerprint },
                { text: "Retrieving profile", icon: Shield },
                { text: "Securing connection", icon: Lock },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: verifyStep > i ? 1 : 0.4 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/30"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: verifyStep > i ? 1 : 0.8,
                      backgroundColor: verifyStep > i ? "hsl(155 55% 42%)" : "hsl(30 15% 95%)",
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  >
                    {verifyStep > i ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.div>
                  <span className={`text-sm font-medium ${verifyStep > i ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-6"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative mb-8"
            >
              {/* Ripple effects */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-pandan"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
              
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pandan to-pandan/80 flex items-center justify-center shadow-apple-lg">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Check className="w-14 h-14 text-white" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-semibold text-foreground mb-2"
            >
              Verified
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-center mb-8"
            >
              Welcome to Kindred Heart
            </motion.p>

            {/* Success indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-xs p-5 rounded-3xl bg-white/80 backdrop-blur-sm border border-pandan/20 shadow-soft"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pandan/20 to-pandan/10 flex items-center justify-center">
                  <Check className="w-7 h-7 text-pandan" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Verified</p>
                  <p className="text-sm text-muted-foreground">ID: {mockProfile.userId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-pandan">
                <Shield className="w-4 h-4" />
                <span>Identity verified securely</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Preparing your experience...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingPassAuth;
