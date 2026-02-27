import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UniversalRoleSelector from "@/components/UniversalRoleSelector";
import EnhancedResumeUpload from "@/components/EnhancedResumeUpload";
import DynamicReadinessScore from "@/components/DynamicReadinessScore";
import EnhancedSkillGap from "@/components/EnhancedSkillGap";
import EnhancedAIInsights from "@/components/EnhancedAIInsights";
import DynamicRoadmap from "@/components/DynamicRoadmap";
import DownloadSection from "@/components/DownloadSection";
import InterviewPrepModule from "@/components/InterviewPrepModule";
import LearningResourcesModule from "@/components/LearningResourcesModule";
import { Button } from "@/components/ui/button";
import { useCareerAnalysis, type AnalysisResult } from "@/hooks/useCareerAnalysis";
import { getDomainById } from "@/lib/careerDomains";
import { useAuth } from "@/contexts/AuthContext";

type Step = "role" | "upload" | "results";

const Analyze = () => {
  const navigate = useNavigate();
  const { user, markResumeUploaded } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<{
    text: string;
    githubUrl?: string;
    linkedinUrl?: string;
  } | null>(null);

  const {
    isAnalyzing,
    analysisResult,
    analyzeResume,
    clearAnalysis,
    setAnalysisResult,
  } = useCareerAnalysis();

  // Trigger analysis when we have both resume and role
  useEffect(() => {
    if (resumeData && selectedRole && currentStep === "upload" && !isAnalyzing && !analysisResult) {
      analyzeResume(
        resumeData.text,
        selectedRole,
        resumeData.githubUrl,
        resumeData.linkedinUrl
      ).then((result) => {
        if (result) {
          setCurrentStep("results");
        }
      });
    }
  }, [resumeData, selectedRole, currentStep, isAnalyzing, analysisResult, analyzeResume]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleRoleContinue = () => {
    if (selectedRole) {
      setCurrentStep("upload");
    }
  };

  const handleUpload = async (text: string, githubUrl?: string, linkedinUrl?: string) => {
    if (user) {
      const { error } = await markResumeUploaded();
      if (error) {
        console.error("Failed to persist resume upload state:", error);
      }
    }

    setResumeData({ text, githubUrl, linkedinUrl });
  };

  const handleBack = () => {
    if (currentStep === "results") {
      clearAnalysis();
      setResumeData(null);
      setCurrentStep("upload");
    } else if (currentStep === "upload") {
      setCurrentStep("role");
    } else {
      navigate(user ? "/dashboard" : "/");
    }
  };

  const handleNewAnalysis = () => {
    clearAnalysis();
    setResumeData(null);
    setSelectedRole(null);
    setCurrentStep("role");
  };

  const selectedDomain = selectedRole ? getDomainById(selectedRole) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold gradient-text">CareerAI</span>
          </div>

          {currentStep === "results" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewAnalysis}
            >
              New Analysis
            </Button>
          )}
          
          {currentStep !== "results" && <div className="w-24" />}
        </div>
      </motion.header>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {currentStep === "role" && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-24 pb-12 px-4"
          >
            <UniversalRoleSelector
              selectedRole={selectedRole}
              onSelectRole={handleRoleSelect}
            />
            
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <Button
                  onClick={handleRoleContinue}
                  className="btn-primary px-8 h-12 text-lg"
                >
                  Continue with {selectedDomain?.title}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentStep === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-24 pb-12 px-4"
          >
            <EnhancedResumeUpload
              onUpload={handleUpload}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>
        )}

        {currentStep === "results" && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-12 px-4"
          >
            <div className="space-y-16 max-w-6xl mx-auto">
              <section>
                <DynamicReadinessScore
                  score={analysisResult.readinessScore}
                  status={analysisResult.readinessStatus}
                  role={analysisResult.careerDomain}
                />
              </section>

              <section>
                <EnhancedAIInsights
                  insights={analysisResult.insights}
                  score={analysisResult.readinessScore}
                  role={analysisResult.careerDomain}
                />
              </section>

              <section>
                <EnhancedSkillGap
                  extractedSkills={analysisResult.extractedSkills}
                  matchedSkills={analysisResult.matchedSkills}
                  missingSkills={analysisResult.missingSkills}
                />
              </section>

              <section>
                <DynamicRoadmap
                  phases={analysisResult.roadmap?.phases || []}
                  role={analysisResult.careerDomain}
                />
              </section>

              <section>
                <InterviewPrepModule
                  role={analysisResult.careerDomain}
                  readinessScore={analysisResult.readinessScore}
                />
              </section>

              <section>
                <LearningResourcesModule
                  role={analysisResult.careerDomain}
                  missingSkills={analysisResult.missingSkills}
                />
              </section>

              <section>
                <DownloadSection analysis={analysisResult} />
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyze;
