import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import SingPassAuth from "@/components/onboarding/SingPassAuth";
import ProfileSetup from "@/components/onboarding/ProfileSetup";
import MoodCheckin from "@/components/onboarding/MoodCheckin";
import NeighbourhoodSelect from "@/components/onboarding/NeighbourhoodSelect";

type OnboardingStep = "welcome" | "singpass" | "profile" | "mood" | "neighbourhood";

interface UserProfile {
  displayName: string;
  postalCode: string;
  userId: string;
  avatar?: string | null;
  languages?: string[];
  bio?: string;
  neighbourhoods?: string[];
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleGetStarted = () => {
    setStep("singpass");
  };

  const handleSingPassSuccess = (profile: { displayName: string; postalCode: string; userId: string }) => {
    setUserProfile(profile);
    setStep("profile");
  };

  const handleProfileComplete = (profileData: {
    displayName: string;
    avatar: string | null;
    languages: string[];
    bio: string;
  }) => {
    setUserProfile((prev) => prev ? { ...prev, ...profileData } : null);
    setStep("mood");
  };

  const handleMoodComplete = (_mood: string | null) => {
    // Mood is not stored, just used to set tone
    setStep("neighbourhood");
  };

  const handleNeighbourhoodComplete = (neighbourhoods: string[]) => {
    setUserProfile((prev) => prev ? { ...prev, neighbourhoods } : null);
    // For now, navigate to home. Later this will go to the next onboarding step.
    navigate("/home");
  };

  const handleBack = () => {
    if (step === "singpass") {
      setStep("welcome");
    } else if (step === "profile") {
      setStep("singpass");
    } else if (step === "mood") {
      setStep("profile");
    } else if (step === "neighbourhood") {
      setStep("mood");
    }
  };

  return (
    <>
      {step === "welcome" && <WelcomeScreen onGetStarted={handleGetStarted} />}
      {step === "singpass" && (
        <SingPassAuth onSuccess={handleSingPassSuccess} onBack={handleBack} />
      )}
      {step === "profile" && userProfile && (
        <ProfileSetup
          onComplete={handleProfileComplete}
          onBack={handleBack}
        />
      )}
      {step === "mood" && userProfile && (
        <MoodCheckin
          userName={userProfile.displayName}
          onComplete={handleMoodComplete}
          onBack={handleBack}
          onSkip={() => handleMoodComplete(null)}
        />
      )}
      {step === "neighbourhood" && userProfile && (
        <NeighbourhoodSelect
          postalCode={userProfile.postalCode}
          onComplete={handleNeighbourhoodComplete}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default OnboardingPage;
