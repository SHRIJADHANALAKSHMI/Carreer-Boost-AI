import { motion } from "framer-motion";
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
  Briefcase
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
}

interface CommonQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const InterviewPrepModule = ({ role, readinessScore }: InterviewPrepModuleProps) => {
  const domain = getDomainById(role);
  
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
        ]
      },
      {
        category: "Technical",
        icon: <Code className="w-5 h-5" />,
        tips: [
          "Review fundamental concepts in your field",
          "Practice explaining complex topics simply",
          "Prepare to discuss your past projects in depth",
          "Be ready to whiteboard or live-code if applicable"
        ]
      },
      {
        category: "Professional",
        icon: <Briefcase className="w-5 h-5" />,
        tips: [
          "Research the company's recent news and achievements",
          "Prepare thoughtful questions for the interviewer",
          "Know your salary expectations and market rates",
          "Follow up with a thank-you email within 24 hours"
        ]
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          <span>Interview Preparation</span>
        </h2>
        <p className="text-muted-foreground">
          Get ready for your {domain?.title || "career"} interviews
        </p>
      </div>

      {/* Interview Readiness Indicator */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-semibold">Interview Readiness</span>
            </div>
            <span className="text-2xl font-bold gradient-text">{interviewReadiness}%</span>
          </div>
          <Progress value={interviewReadiness} className="h-3" />
          <p className="text-sm text-muted-foreground mt-3">
            {interviewReadiness >= 80 
              ? "You're well-prepared! Focus on polishing your presentation." 
              : interviewReadiness >= 60 
                ? "Good progress! Practice common questions to boost confidence."
                : "Keep learning! Build more projects to discuss in interviews."}
          </p>
        </CardContent>
      </Card>

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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            Common Questions for {domain?.title || "Your Role"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{q.question}</span>
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

      {/* Quick Tips */}
      <Card className="glass-card border-accent/20 bg-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pro Tip</h4>
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
  );
};

export default InterviewPrepModule;
