import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, Zap, Sparkles } from "lucide-react";
import type { ExtractedSkill, MissingSkill } from "@/hooks/useCareerAnalysis";

interface EnhancedSkillGapProps {
  extractedSkills: ExtractedSkill[];
  matchedSkills: string[];
  missingSkills: MissingSkill[];
}

const EnhancedSkillGap = ({ extractedSkills, matchedSkills, missingSkills }: EnhancedSkillGapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      }
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"Skill Gap Analysis".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Compare your current skills against role requirements
        </motion.p>
      </motion.div>

      {/* Extracted Skills with Confidence */}
      {extractedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" as const }}
          whileHover={{ boxShadow: "0 10px 40px hsl(262 83% 55% / 0.1)" }}
          className="glass-card p-6 mb-6 relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center shadow-lg"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">Detected Skills</h3>
              <p className="text-sm text-muted-foreground">{extractedSkills.length} skills found in your resume</p>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            {extractedSkills.slice(0, 10).map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 group"
              >
                <span className="text-sm font-medium w-32 truncate group-hover:text-primary transition-colors">{skill.name}</span>
                <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.confidence}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.08, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent via-primary to-pink-500 rounded-full relative"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, delay: 1 + index * 0.1, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </motion.div>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.08 }}
                  className="text-sm font-semibold text-primary w-12 text-right"
                >
                  {skill.confidence}%
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Matched Skills */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 10px 40px hsl(142 70% 40% / 0.1)" }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center shadow-lg"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">Matched Skills</h3>
              <p className="text-sm text-muted-foreground">{matchedSkills.length} skills aligned</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 relative z-10">
            {matchedSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05, type: "spring" as const }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="skill-tag skill-tag-matched cursor-default"
              >
                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
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
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 10px 40px hsl(0 72% 51% / 0.1)" }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-destructive to-red-400 flex items-center justify-center shadow-lg"
            >
              <XCircle className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">Skills to Develop</h3>
              <p className="text-sm text-muted-foreground">{missingSkills.length} skills needed</p>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            {missingSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                whileHover={{ x: 4, scale: 1.01 }}
                className={`p-3 rounded-xl border ${getImportanceColor(skill.importance)} cursor-default transition-all`}
              >
                <div className="flex items-start gap-2">
                  <motion.div
                    animate={skill.importance === "high" ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {getImportanceIcon(skill.importance)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{skill.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${
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
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 text-success"
              >
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm font-medium">No critical skill gaps!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedSkillGap;
