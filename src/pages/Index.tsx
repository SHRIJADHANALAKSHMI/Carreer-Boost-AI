import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ResumeUpload from "@/components/ResumeUpload";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import ReadinessScore from "@/components/ReadinessScore";
import SkillGapBreakdown from "@/components/SkillGapBreakdown";
import CareerRoadmap from "@/components/CareerRoadmap";
import AIExplanation from "@/components/AIExplanation";

type Step = "hero" | "upload" | "role" | "results";

// Mock data for demonstration
const mockResults = {
  frontend: {
    score: 72,
    status: "almost-ready" as const,
    matchedSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git", "REST APIs"],
    missingSkills: ["Testing", "Performance Optimization", "Accessibility", "CI/CD"],
  },
  backend: {
    score: 45,
    status: "not-ready" as const,
    matchedSkills: ["JavaScript", "Git", "REST APIs", "SQL Basics"],
    missingSkills: ["Node.js", "Python", "Database Design", "Docker", "Cloud Services", "System Design"],
  },
  "data-science": {
    score: 38,
    status: "not-ready" as const,
    matchedSkills: ["Python Basics", "SQL", "Git"],
    missingSkills: ["Machine Learning", "Statistics", "Data Visualization", "Pandas", "NumPy", "TensorFlow", "Deep Learning"],
  },
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("hero");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const handleGetStarted = () => {
    setCurrentStep("upload");
  };

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep("role");
    }, 2500);
  };

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    // Simulate analysis
    setTimeout(() => {
      setCurrentStep("results");
    }, 500);
  };

  const handleBack = () => {
    if (currentStep === "results") {
      setCurrentStep("role");
    } else if (currentStep === "role") {
      setCurrentStep("upload");
    } else if (currentStep === "upload") {
      setCurrentStep("hero");
    }
  };

  const results = selectedRole ? mockResults[selectedRole] : null;

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStep === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {currentStep === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 btn-secondary inline-flex items-center gap-2 py-2 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Analyze Your <span className="gradient-text">Resume</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload your PDF resume and our AI will extract your skills automatically
              </p>
            </div>
            <ResumeUpload onUpload={handleUpload} isProcessing={isProcessing} />
          </motion.div>
        )}

        {currentStep === "role" && (
          <motion.div
            key="role"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 btn-secondary inline-flex items-center gap-2 py-2 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <RoleSelector selectedRole={selectedRole} onSelectRole={handleSelectRole} />
          </motion.div>
        )}

        {currentStep === "results" && results && selectedRole && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-4 py-12"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <button
                  onClick={handleBack}
                  className="btn-secondary inline-flex items-center gap-2 py-2 px-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button className="btn-primary inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Roadmap
                </button>
              </div>

              {/* Results Content */}
              <div className="space-y-16">
                {/* Readiness Score */}
                <section>
                  <ReadinessScore score={results.score} status={results.status} />
                </section>

                {/* Skill Gap */}
                <section>
                  <SkillGapBreakdown
                    matchedSkills={results.matchedSkills}
                    missingSkills={results.missingSkills}
                  />
                </section>

                {/* AI Explanation */}
                <section>
                  <AIExplanation
                    score={results.score}
                    role={selectedRole}
                    matchedCount={results.matchedSkills.length}
                    missingCount={results.missingSkills.length}
                  />
                </section>

                {/* Career Roadmap */}
                <section>
                  <CareerRoadmap phases={[]} />
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;