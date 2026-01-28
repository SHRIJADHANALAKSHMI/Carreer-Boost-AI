import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AnalysisHistory from "@/components/AnalysisHistory";
import { useCareerAnalysis, type AnalysisResult } from "@/hooks/useCareerAnalysis";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { analysisHistory, loadHistory } = useCareerAnalysis();

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleGetStarted = () => {
    navigate("/analyze");
  };

  const handleSelectFromHistory = (analysis: AnalysisResult) => {
    // Navigate to results view with the analysis
    navigate("/analyze", { state: { analysis } });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      
      {/* History section on landing */}
      {analysisHistory.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <AnalysisHistory
            history={analysisHistory}
            onSelectAnalysis={handleSelectFromHistory}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
