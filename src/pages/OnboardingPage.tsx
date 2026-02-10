import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import SingPassAuth from "@/components/onboarding/SingPassAuth";

type OnboardingStep = "welcome" | "singpass";

interface UserProfile {
  displayName: string;
  postalCode: string;
  userId: string;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleGetStarted = () => {
    setStep("singpass");
  };

  const handleSingPassSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    // For now, navigate to home. Later this will go to the next onboarding step.
    navigate("/home");
  };

  const handleBack = () => {
    setStep("welcome");
  };

  return (
    <>
      {step === "welcome" && <WelcomeScreen onGetStarted={handleGetStarted} />}
      {step === "singpass" && (
        <SingPassAuth onSuccess={handleSingPassSuccess} onBack={handleBack} />
      )}
    </>
  );
};

export default OnboardingPage;
