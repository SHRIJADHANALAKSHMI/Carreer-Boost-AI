import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles, Target, TrendingUp, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UniversalRoleSelector from "@/components/UniversalRoleSelector";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  {
    id: 1,
    title: "Welcome to CareerAI",
    description: "Your AI-powered career companion. Let's set up your profile for personalized insights.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Choose Your Path",
    description: "Select your target career role. This helps us tailor your experience.",
    icon: Target,
  },
  {
    id: 3,
    title: "You're All Set!",
    description: "Upload your resume to get your personalized career analysis.",
    icon: TrendingUp,
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      if (user) {
        await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("user_id", user.id);
      }
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedRole !== null;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(262 83% 58% / 0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(180 70% 45% / 0.15) 0%, transparent 70%)' }}
        />
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                    backgroundColor: index <= currentStep ? 'hsl(262 83% 55%)' : 'hsl(var(--secondary))',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={index <= currentStep ? 'text-white' : 'text-muted-foreground'}>
                      {step.id}
                    </span>
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            {currentStep === 0 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 mb-8"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Welcome to <span className="gradient-text">CareerAI</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground max-w-xl mx-auto mb-12"
                >
                  Your AI-powered career companion. Get personalized insights, skill gap analysis, 
                  and a roadmap to your dream role.
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                  {[
                    { icon: Target, title: "Skill Analysis", desc: "AI-powered resume parsing" },
                    { icon: TrendingUp, title: "Readiness Score", desc: "Know where you stand" },
                    { icon: BookOpen, title: "Learning Path", desc: "Personalized roadmap" },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="glass-card p-6 rounded-2xl"
                    >
                      <feature.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Choose Your Target Role</h2>
                  <p className="text-muted-foreground">
                    Select the career path you're working towards
                  </p>
                </div>
                <UniversalRoleSelector
                  selectedRole={selectedRole}
                  onSelectRole={setSelectedRole}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-success to-emerald-400 mb-8"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">You're All Set! 🎉</h2>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                  Your profile is ready. Head to your dashboard to upload your resume 
                  and get your personalized career analysis.
                </p>
                <div className="glass-card p-6 rounded-2xl max-w-md mx-auto">
                  <h3 className="font-semibold mb-3">What's Next?</h3>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      Upload your resume (PDF, DOCX, or TXT)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      Get your AI-powered readiness score
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      Follow your personalized learning path
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        <div className="max-w-md mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary gap-2"
          >
            {currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
