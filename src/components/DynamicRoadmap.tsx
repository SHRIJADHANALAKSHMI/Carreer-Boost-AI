import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BookOpen, Code, Rocket, CheckCircle2, Wrench, Target, FolderKanban, ChevronDown, Sparkles } from "lucide-react";
import type { RoadmapPhase } from "@/hooks/useCareerAnalysis";

interface DynamicRoadmapProps {
  phases: RoadmapPhase[];
  role: string;
}

const phaseIcons = [BookOpen, Code, Rocket, Target];
const phaseColors = [
  { gradient: "from-primary to-purple-500", bg: "bg-primary/10", text: "text-primary" },
  { gradient: "from-accent to-cyan-400", bg: "bg-accent/10", text: "text-accent" },
  { gradient: "from-pink-500 to-rose-400", bg: "bg-pink-500/10", text: "text-pink-500" },
  { gradient: "from-success to-emerald-400", bg: "bg-success/10", text: "text-success" },
];

const DynamicRoadmap = ({ phases, role }: DynamicRoadmapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  if (!phases || phases.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header with animated text */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"Your Personalized Roadmap".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" as const }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground"
        >
          A step-by-step plan to become a {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </motion.p>
      </motion.div>

      <div className="relative">
        {/* Animated timeline line */}
        <motion.div
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute left-6 top-0 w-1 rounded-full"
          style={{ 
            background: "linear-gradient(180deg, hsl(262 83% 55%) 0%, hsl(180 70% 45%) 50%, hsl(142 70% 40%) 100%)" 
          }}
        />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const Icon = phaseIcons[index % phaseIcons.length];
            const colors = phaseColors[index % phaseColors.length];
            const isExpanded = expandedPhase === index;
            
            return (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2, type: "spring" as const }}
                className="relative pl-16"
              >
                {/* Animated timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2, type: "spring" as const }}
                  className="absolute left-3 top-8 z-10"
                >
                  <motion.div
                    animate={isExpanded ? { 
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0px hsl(262 83% 55% / 0)",
                        "0 0 20px hsl(262 83% 55% / 0.5)",
                        "0 0 0px hsl(262 83% 55% / 0)",
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: isExpanded ? Infinity : 0 }}
                    className={`w-6 h-6 rounded-full border-4 border-background ${
                      index === 0 ? `bg-gradient-to-br ${colors.gradient}` : "bg-muted"
                    }`}
                  />
                </motion.div>

                {/* Phase card */}
                <motion.div
                  whileHover={{ x: 8 }}
                  className="glass-card overflow-hidden cursor-pointer group"
                  onClick={() => setExpandedPhase(isExpanded ? -1 : index)}
                >
                  {/* Header */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <motion.span
                          className={`text-sm font-semibold ${colors.text} uppercase tracking-wider`}
                        >
                          {phase.period}
                        </motion.span>
                        <h3 className="text-xl font-bold">{phase.title}</h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-muted-foreground"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Expandable content */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-5">
                      {/* Focus Areas */}
                      {phase.focusAreas?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isExpanded ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Focus Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.focusAreas.map((area, areaIndex) => (
                              <motion.span
                                key={area}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isExpanded ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.1 + areaIndex * 0.05 }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                              >
                                {area}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Skills to Learn */}
                      {phase.skills?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isExpanded ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Skills to Learn
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {phase.skills.map((skill, skillIndex) => (
                              <motion.li
                                key={skill}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2 + skillIndex * 0.05 }}
                                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                              >
                                <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm">{skill}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Projects */}
                      {phase.projects?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isExpanded ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <FolderKanban className="w-4 h-4" />
                            Projects to Build
                          </h4>
                          <ul className="space-y-2">
                            {phase.projects.map((project, projIndex) => (
                              <motion.li
                                key={project}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.3 + projIndex * 0.05 }}
                                className="flex items-start gap-3 group/item"
                              >
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: projIndex * 0.2 }}
                                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient} mt-2 flex-shrink-0`}
                                />
                                <span className="text-muted-foreground text-sm group-hover/item:text-foreground transition-colors">
                                  {project}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Tools */}
                      {phase.tools?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isExpanded ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.4 }}
                        >
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            Tools to Master
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.tools.map((tool, toolIndex) => (
                              <motion.span
                                key={tool}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isExpanded ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.4 + toolIndex * 0.03 }}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary border border-border hover:border-primary/30 transition-colors cursor-default"
                              >
                                {tool}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Outcomes */}
                      {phase.outcomes?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isExpanded ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.5 }}
                          className="pt-5 border-t border-border"
                        >
                          <h4 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            Expected Outcomes
                          </h4>
                          <ul className="space-y-2">
                            {phase.outcomes.map((outcome, outIndex) => (
                              <motion.li
                                key={outcome}
                                initial={{ opacity: 0 }}
                                animate={isExpanded ? { opacity: 1 } : {}}
                                transition={{ delay: 0.5 + outIndex * 0.05 }}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <span className="text-success">✓</span>
                                {outcome}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Hover glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}
                    style={{ 
                      boxShadow: `0 0 30px hsl(262 83% 55% / 0.1)` 
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicRoadmap;
