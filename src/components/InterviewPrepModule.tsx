import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Target, 
  Lightbulb,
  ChevronRight,
  Star,
  Users,
  Code,
  Briefcase,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDomainById } from "@/lib/careerDomains";

interface InterviewPrepModuleProps {
  role: string;
  readinessScore: number;
}

interface InterviewTip {
  category: string;
  icon: React.ReactNode;
  tips: string[];
  gradient: string;
}

interface CommonQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const InterviewPrepModule = ({ role, readinessScore }: InterviewPrepModuleProps) => {
  const domain = getDomainById(role);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Generate role-specific interview tips
  const getInterviewTips = (): InterviewTip[] => {
    const baseTips: InterviewTip[] = [
      {
        category: "Behavioral",
        icon: <Users className="w-5 h-5" />,
        tips: [
          "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
          "Prepare 3-5 stories that showcase different skills",
          "Research the company culture and values beforehand",
          "Practice answering 'Tell me about yourself' in under 2 minutes"
        ],
        gradient: "from-primary to-purple-500"
      },
      {
        category: "Technical",
        icon: <Code className="w-5 h-5" />,
        tips: [
          "Review fundamental concepts in your field",
          "Practice explaining complex topics simply",
          "Prepare to discuss your past projects in depth",
          "Be ready to whiteboard or live-code if applicable"
        ],
        gradient: "from-accent to-cyan-400"
      },
      {
        category: "Professional",
        icon: <Briefcase className="w-5 h-5" />,
        tips: [
          "Research the company's recent news and achievements",
          "Prepare thoughtful questions for the interviewer",
          "Know your salary expectations and market rates",
          "Follow up with a thank-you email within 24 hours"
        ],
        gradient: "from-pink-500 to-rose-400"
      }
    ];
    
    return baseTips;
  };

  // Generate common interview questions based on role
  const getCommonQuestions = (): CommonQuestion[] => {
    const roleQuestions: Record<string, CommonQuestion[]> = {
      frontend_developer: [
        { question: "Explain the difference between let, const, and var", difficulty: "easy", category: "JavaScript" },
        { question: "How does React's virtual DOM work?", difficulty: "medium", category: "React" },
        { question: "Describe your approach to optimizing web performance", difficulty: "hard", category: "Performance" }
      ],
      backend_developer: [
        { question: "Explain REST vs GraphQL APIs", difficulty: "easy", category: "APIs" },
        { question: "How do you handle database transactions?", difficulty: "medium", category: "Databases" },
        { question: "Design a rate-limiting system", difficulty: "hard", category: "System Design" }
      ],
      data_scientist: [
        { question: "Explain the bias-variance tradeoff", difficulty: "easy", category: "ML Basics" },
        { question: "How do you handle missing data?", difficulty: "medium", category: "Data Prep" },
        { question: "Design an A/B testing framework", difficulty: "hard", category: "Statistics" }
      ],
      default: [
        { question: "Tell me about a challenging project you worked on", difficulty: "easy", category: "Behavioral" },
        { question: "How do you prioritize competing deadlines?", difficulty: "medium", category: "Time Management" },
        { question: "Where do you see yourself in 5 years?", difficulty: "medium", category: "Career Goals" }
      ]
    };

    return roleQuestions[role] || roleQuestions.default;
  };

  const tips = getInterviewTips();
  const questions = getCommonQuestions();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success border-success/30";
      case "medium": return "bg-warning/10 text-warning border-warning/30";
      case "hard": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Calculate interview readiness based on overall score
  const interviewReadiness = Math.min(100, Math.round(readinessScore * 0.85 + 15));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <MessageSquare className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"Interview Preparation".split(" ").map((word, i) => (
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
          Get ready for your {domain?.title || "career"} interviews
        </motion.p>
      </motion.div>

      {/* Interview Readiness Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.3, type: "spring" as const }}
      >
        <Card className="glass-card border-primary/20 overflow-hidden">
          <CardContent className="p-6 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-2 rounded-xl bg-primary/10"
                >
                  <Target className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="font-semibold">Interview Readiness</span>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" as const }}
                className="text-3xl font-bold gradient-text"
              >
                {interviewReadiness}%
              </motion.span>
            </div>
            <Progress value={interviewReadiness} className="h-3" />
            <p className="text-sm text-muted-foreground mt-3 relative z-10">
              {interviewReadiness >= 80 
                ? "You're well-prepared! Focus on polishing your presentation." 
                : interviewReadiness >= 60 
                  ? "Good progress! Practice common questions to boost confidence."
                  : "Keep learning! Build more projects to discuss in interviews."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interview Tips by Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tipCategory, index) => (
          <motion.div
            key={tipCategory.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="p-2 rounded-lg bg-primary/10 text-primary">
                    {tipCategory.icon}
                  </span>
                  {tipCategory.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tipCategory.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Common Interview Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lightbulb className="w-5 h-5 text-warning" />
              </motion.div>
              Common Questions for {domain?.title || "Your Role"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 8, backgroundColor: "hsl(var(--secondary))" }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    </motion.div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {q.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </Badge>
                  </div>
                </motion.div>
            ))}
          </div>
        </CardContent>
        </Card>
      </motion.div>

      {/* Quick Tips with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-card border-accent/20 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-3 rounded-full bg-accent/10"
              >
                <Star className="w-6 h-6 text-accent" />
              </motion.div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Pro Tip
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Practice your responses out loud. Recording yourself can help identify areas 
                  for improvement in your delivery and timing. Aim for responses between 
                  1-2 minutes for most questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InterviewPrepModule;
