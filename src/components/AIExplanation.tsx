import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Target } from "lucide-react";

interface AIExplanationProps {
  score: number;
  role: string;
  matchedCount: number;
  missingCount: number;
}

const AIExplanation = ({ score, role, matchedCount, missingCount }: AIExplanationProps) => {
  const getRoleLabel = () => {
    switch (role) {
      case "frontend":
        return "Frontend Developer";
      case "backend":
        return "Backend Developer";
      case "data-science":
        return "Data Scientist";
      default:
        return role;
    }
  };

  const getExplanation = () => {
    if (score >= 80) {
      return {
        summary: `Great news! You're highly prepared for a ${getRoleLabel()} role.`,
        details: `With ${matchedCount} relevant skills already in your toolkit, you've built a solid foundation. Your profile shows strong alignment with industry requirements. Focus on polishing your ${missingCount} remaining skill gaps to become an even stronger candidate.`,
        motivation: "You're in the final stretch! Consider starting your job search while continuing to learn.",
      };
    } else if (score >= 50) {
      return {
        summary: `You're making solid progress toward becoming a ${getRoleLabel()}.`,
        details: `With ${matchedCount} skills matched and ${missingCount} areas to develop, you have a clear path forward. Your current skills provide a good foundation, but focused learning on the missing skills will significantly boost your job readiness.`,
        motivation: "Stay consistent with daily learning. You're closer than you think!",
      };
    } else {
      return {
        summary: `You're at the beginning of your ${getRoleLabel()} journey, and that's okay!`,
        details: `You have ${matchedCount} relevant skills to build upon. While there are ${missingCount} skills to develop, remember that every expert was once a beginner. Focus on the fundamentals first, and you'll see rapid improvement.`,
        motivation: "Start with one skill at a time. Small daily progress leads to big results!",
      };
    }
  };

  const explanation = getExplanation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          AI Career Insights
        </h2>
        <p className="text-muted-foreground">
          Personalized analysis of your career readiness
        </p>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary</h3>
              <p className="text-muted-foreground">{explanation.summary}</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Detailed Analysis</h3>
              <p className="text-muted-foreground">{explanation.details}</p>
            </div>
          </div>
        </motion.div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 border-primary/30"
          style={{ boxShadow: '0 0 30px hsl(262 83% 58% / 0.1)' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center text-warning flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Keep Going!</h3>
              <p className="text-muted-foreground">{explanation.motivation}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AIExplanation;