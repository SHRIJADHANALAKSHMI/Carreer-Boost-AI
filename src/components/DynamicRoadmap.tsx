import { motion } from "framer-motion";
import { BookOpen, Code, Rocket, CheckCircle2, Wrench, Target, FolderKanban } from "lucide-react";
import type { RoadmapPhase } from "@/hooks/useCareerAnalysis";

interface DynamicRoadmapProps {
  phases: RoadmapPhase[];
  role: string;
}

const phaseIcons = [BookOpen, Code, Rocket, Target];

const DynamicRoadmap = ({ phases, role }: DynamicRoadmapProps) => {
  if (!phases || phases.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Your Personalized Roadmap
        </h2>
        <p className="text-muted-foreground">
          A step-by-step plan to become a {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="timeline-line" />

        <div className="space-y-8">
          {phases.map((phase, index) => {
            const Icon = phaseIcons[index % phaseIcons.length];
            
            return (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.2 + 0.2 }}
                  className={`absolute left-4 top-6 timeline-dot ${index === 0 ? "timeline-dot-active" : ""}`}
                />

                <div className="glass-card-hover p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-accent">{phase.period}</span>
                      <h3 className="text-xl font-semibold">{phase.title}</h3>
                    </div>
                  </div>

                  {/* Focus Areas */}
                  {phase.focusAreas?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Focus Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.focusAreas.map((area) => (
                          <span key={area} className="px-3 py-1 rounded-full text-xs bg-primary/20 text-primary">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills to Learn */}
                  {phase.skills?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Skills to Learn
                      </h4>
                      <ul className="space-y-2">
                        {phase.skills.map((skill, skillIndex) => (
                          <motion.li
                            key={skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.2 + skillIndex * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-sm">{skill}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Projects */}
                  {phase.projects?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <FolderKanban className="w-4 h-4" />
                        Projects to Build
                      </h4>
                      <ul className="space-y-2">
                        {phase.projects.map((project) => (
                          <li key={project} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{project}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools */}
                  {phase.tools?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        Tools to Master
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.tools.map((tool) => (
                          <span key={tool} className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outcomes */}
                  {phase.outcomes?.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-success mb-2">Expected Outcomes</h4>
                      <ul className="space-y-1">
                        {phase.outcomes.map((outcome) => (
                          <li key={outcome} className="text-sm text-muted-foreground">
                            ✓ {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicRoadmap;
