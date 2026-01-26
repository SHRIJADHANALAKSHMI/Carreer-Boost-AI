import { motion } from "framer-motion";
import { BookOpen, Code, Rocket, CheckCircle2 } from "lucide-react";

interface RoadmapPhase {
  title: string;
  period: string;
  tasks: string[];
  icon: React.ReactNode;
}

interface CareerRoadmapProps {
  phases: RoadmapPhase[];
}

const defaultPhases: RoadmapPhase[] = [
  {
    title: "Foundation Building",
    period: "Days 1-30",
    icon: <BookOpen className="w-5 h-5" />,
    tasks: [
      "Complete core fundamentals course",
      "Build 2 practice projects",
      "Set up development environment",
      "Join relevant communities",
    ],
  },
  {
    title: "Skill Development",
    period: "Days 31-60",
    icon: <Code className="w-5 h-5" />,
    tasks: [
      "Deep dive into framework specifics",
      "Contribute to open source",
      "Build a portfolio project",
      "Practice coding challenges daily",
    ],
  },
  {
    title: "Job Ready",
    period: "Days 61-90",
    icon: <Rocket className="w-5 h-5" />,
    tasks: [
      "Polish portfolio & resume",
      "Practice mock interviews",
      "Apply to target companies",
      "Network with professionals",
    ],
  },
];

const CareerRoadmap = ({ phases = defaultPhases }: CareerRoadmapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Your 90-Day Roadmap
        </h2>
        <p className="text-muted-foreground">
          A personalized plan to get you job-ready
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="timeline-line" />

        <div className="space-y-8">
          {phases.map((phase, index) => (
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    {phase.icon}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-accent">{phase.period}</span>
                    <h3 className="text-xl font-semibold">{phase.title}</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {phase.tasks.map((task, taskIndex) => (
                    <motion.li
                      key={task}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.2 + taskIndex * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CareerRoadmap;