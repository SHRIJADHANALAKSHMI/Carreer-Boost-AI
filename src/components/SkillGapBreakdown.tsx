import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap } from "lucide-react";

interface SkillGapBreakdownProps {
  matchedSkills: string[];
  missingSkills: string[];
}

const SkillGapBreakdown = ({ matchedSkills, missingSkills }: SkillGapBreakdownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Skill Gap Analysis
        </h2>
        <p className="text-muted-foreground">
          See what skills you have and what you need to develop
        </p>
      </div>

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
              <p className="text-sm text-muted-foreground">{matchedSkills.length} skills found</p>
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
          
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="skill-tag skill-tag-missing"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 glass-card p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Quick insight:</span> Focus on the high-priority missing skills first. 
          These will have the biggest impact on your readiness score.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SkillGapBreakdown;