import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, Code, Rocket, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/hooks/useCareerAnalysis";
import { getDomainById } from "@/lib/careerDomains";

interface SmartFeaturesSectionProps {
  analysis: AnalysisResult;
}

// Role-specific project ideas
const projectIdeas: Record<string, { title: string; description: string; difficulty: string }[]> = {
  frontend_developer: [
    { title: "Personal Portfolio", description: "Build a responsive portfolio with React and animations", difficulty: "beginner" },
    { title: "E-commerce Dashboard", description: "Create a product management dashboard with filters and charts", difficulty: "intermediate" },
    { title: "Real-time Chat App", description: "Build a chat application with WebSocket integration", difficulty: "advanced" },
  ],
  backend_developer: [
    { title: "REST API", description: "Build a CRUD API with authentication and rate limiting", difficulty: "beginner" },
    { title: "Microservices Architecture", description: "Design and implement a microservices system", difficulty: "intermediate" },
    { title: "Distributed Task Queue", description: "Build a job queue with Redis and workers", difficulty: "advanced" },
  ],
  data_scientist: [
    { title: "Data Visualization Dashboard", description: "Create interactive charts from a dataset", difficulty: "beginner" },
    { title: "Predictive Model", description: "Build and deploy an ML model for predictions", difficulty: "intermediate" },
    { title: "NLP Sentiment Analyzer", description: "Create a sentiment analysis pipeline", difficulty: "advanced" },
  ],
  default: [
    { title: "Portfolio Project", description: "Showcase your skills with a comprehensive project", difficulty: "beginner" },
    { title: "Industry Tool", description: "Build a tool that solves a real problem in your field", difficulty: "intermediate" },
    { title: "Open Source Contribution", description: "Contribute to an open source project in your domain", difficulty: "advanced" },
  ],
};

// Interview prep checklist items
const interviewChecklist = [
  { id: 1, text: "Update resume with latest experience", category: "Preparation" },
  { id: 2, text: "Research target companies", category: "Research" },
  { id: 3, text: "Practice STAR method for behavioral questions", category: "Practice" },
  { id: 4, text: "Prepare questions for interviewers", category: "Preparation" },
  { id: 5, text: "Review common technical questions", category: "Technical" },
  { id: 6, text: "Set up clean, professional interview space", category: "Logistics" },
];

const SmartFeaturesSection = ({ analysis }: SmartFeaturesSectionProps) => {
  const domain = getDomainById(analysis.careerDomain);
  const projects = projectIdeas[analysis.careerDomain] || projectIdeas.default;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-success/10 text-success border-success/30";
      case "intermediate": return "bg-warning/10 text-warning border-warning/30";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Trend Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Readiness Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 bg-secondary/30 rounded-xl">
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text mb-2">{analysis.readinessScore}%</p>
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Track your progress by completing more analyses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role-Specific Project Ideas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-accent" />
              Project Ideas for {domain?.title || "Your Role"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Code className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge className={`${getDifficultyColor(project.difficulty)} capitalize`}>
                    {project.difficulty}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Interview Prep Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Interview Preparation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interviewChecklist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors">
                    {/* Checkbox placeholder */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.text}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {item.category}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights Summary */}
      {analysis.insights.advice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI Career Advice</h4>
                  <p className="text-muted-foreground">{analysis.insights.advice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SmartFeaturesSection;
