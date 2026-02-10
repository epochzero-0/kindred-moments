import { useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // For now, navigate to home. Later this will go to the next onboarding step.
    navigate("/home");
  };

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
};

export default OnboardingPage;
