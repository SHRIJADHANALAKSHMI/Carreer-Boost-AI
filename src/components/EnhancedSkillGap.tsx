import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, Zap } from "lucide-react";
import type { ExtractedSkill, MissingSkill } from "@/hooks/useCareerAnalysis";

interface EnhancedSkillGapProps {
  extractedSkills: ExtractedSkill[];
  matchedSkills: string[];
  missingSkills: MissingSkill[];
}

const EnhancedSkillGap = ({ extractedSkills, matchedSkills, missingSkills }: EnhancedSkillGapProps) => {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "border-destructive/50 bg-destructive/10 text-destructive";
      case "medium":
        return "border-warning/50 bg-warning/10 text-warning";
      default:
        return "border-muted-foreground/50 bg-muted/10 text-muted-foreground";
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Skill Gap Analysis
        </h2>
        <p className="text-muted-foreground">
          Compare your current skills against role requirements
        </p>
      </div>

      {/* Extracted Skills with Confidence */}
      {extractedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Detected Skills</h3>
              <p className="text-sm text-muted-foreground">{extractedSkills.length} skills found in your resume</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {extractedSkills.slice(0, 10).map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm font-medium w-32 truncate">{skill.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.confidence}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{skill.confidence}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Matched Skills</h3>
              <p className="text-sm text-muted-foreground">{matchedSkills.length} skills aligned</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className="skill-tag skill-tag-matched"
              >
                {skill}
              </motion.span>
            ))}
            {matchedSkills.length === 0 && (
              <p className="text-muted-foreground text-sm">No matched skills yet</p>
            )}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Skills to Develop</h3>
              <p className="text-sm text-muted-foreground">{missingSkills.length} skills needed</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {missingSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className={`p-3 rounded-lg border ${getImportanceColor(skill.importance)}`}
              >
                <div className="flex items-start gap-2">
                  {getImportanceIcon(skill.importance)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{skill.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                        skill.importance === "high" ? "bg-destructive/20" :
                        skill.importance === "medium" ? "bg-warning/20" : "bg-muted"
                      }`}>
                        {skill.importance}
                      </span>
                    </div>
                    <p className="text-xs opacity-80">{skill.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {missingSkills.length === 0 && (
              <p className="text-muted-foreground text-sm">No critical skill gaps!</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedSkillGap;
