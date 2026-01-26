import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Target, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import type { AIInsights } from "@/hooks/useCareerAnalysis";

interface EnhancedAIInsightsProps {
  insights: AIInsights;
  score: number;
  role: string;
}

const EnhancedAIInsights = ({ insights, score, role }: EnhancedAIInsightsProps) => {
  const cards = [
    {
      icon: MessageSquare,
      title: "Summary",
      content: insights.summary,
      color: "primary",
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      title: "Your Strengths",
      content: insights.strengths?.length > 0 
        ? insights.strengths.join(" • ")
        : "Upload a detailed resume to see your strengths",
      color: "success",
      delay: 0.2,
    },
    {
      icon: AlertCircle,
      title: "Areas to Improve",
      content: insights.weaknesses?.length > 0
        ? insights.weaknesses.join(" • ")
        : "No critical weaknesses identified",
      color: "warning",
      delay: 0.3,
    },
    {
      icon: Target,
      title: "Personalized Advice",
      content: insights.advice,
      color: "accent",
      delay: 0.4,
    },
    {
      icon: Sparkles,
      title: "Next Best Skill",
      content: insights.nextBestSkill || "Focus on core fundamentals first",
      color: "primary",
      delay: 0.5,
      highlight: true,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      primary: { bg: "bg-primary/20", text: "text-primary" },
      success: { bg: "bg-success/20", text: "text-success" },
      warning: { bg: "bg-warning/20", text: "text-warning" },
      accent: { bg: "bg-accent/20", text: "text-accent" },
    };
    return colors[color] || colors.primary;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          AI Career Insights
        </h2>
        <p className="text-muted-foreground">
          Personalized analysis for your {role.replace(/_/g, " ")} journey
        </p>
      </div>

      <div className="space-y-4">
        {cards.map((card) => {
          const colors = getColorClasses(card.color);
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              className={`glass-card p-6 ${card.highlight ? 'border-primary/30 glow-primary' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground">{card.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Motivation card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6 border-primary/30"
          style={{ boxShadow: '0 0 30px hsl(262 83% 58% / 0.1)' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center text-warning flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2">Keep Going!</h3>
              <p className="text-muted-foreground">{insights.motivation}</p>
              {insights.predictedReadiness && (
                <p className="text-sm text-primary mt-2 font-medium">
                  📈 {insights.predictedReadiness}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedAIInsights;
