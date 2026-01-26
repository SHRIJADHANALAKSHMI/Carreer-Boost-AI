import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AnalysisResult } from "@/hooks/useCareerAnalysis";
import { getDomainById } from "@/lib/careerDomains";

interface AnalysisHistoryProps {
  history: AnalysisResult[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  isLoading?: boolean;
}

const AnalysisHistory = ({ history, onSelectAnalysis, isLoading }: AnalysisHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0 && !isLoading) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "job_ready":
        return "text-success bg-success/20";
      case "partially_ready":
        return "text-warning bg-warning/20";
      default:
        return "text-destructive bg-destructive/20";
    }
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-success" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-card p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold">Analysis History</h3>
            <p className="text-sm text-muted-foreground">{history.length} past analyses</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {history.map((analysis, index) => {
                const domain = getDomainById(analysis.careerDomain);
                const previousScore = history[index + 1]?.readinessScore;
                
                return (
                  <motion.button
                    key={analysis.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectAnalysis(analysis)}
                    className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${getStatusColor(analysis.readinessStatus)}`}>
                        {analysis.readinessScore}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">
                          {domain?.title || analysis.careerDomain.replace(/_/g, " ")}
                        </h4>
                        {getTrendIcon(analysis.readinessScore, previousScore)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {analysis.createdAt 
                          ? formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })
                          : "Just now"
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-success">{analysis.matchedSkills?.length || 0} matched</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-destructive">{analysis.missingSkills?.length || 0} missing</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalysisHistory;
