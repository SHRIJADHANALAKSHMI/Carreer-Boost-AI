import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Lightbulb, Target, TrendingUp, AlertCircle, Sparkles, ArrowUpRight, Zap } from "lucide-react";
import type { AIInsights } from "@/hooks/useCareerAnalysis";

interface EnhancedAIInsightsProps {
  insights: AIInsights;
  score: number;
  role: string;
}

const EnhancedAIInsights = ({ insights, score, role }: EnhancedAIInsightsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const cards = [
    {
      icon: MessageSquare,
      title: "Summary",
      content: insights.summary,
      color: "primary",
      delay: 0.1,
      gradient: "from-primary to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Your Strengths",
      content: insights.strengths?.length > 0 
        ? insights.strengths.join(" • ")
        : "Upload a detailed resume to see your strengths",
      color: "success",
      delay: 0.2,
      gradient: "from-success to-emerald-400",
    },
    {
      icon: AlertCircle,
      title: "Areas to Improve",
      content: insights.weaknesses?.length > 0
        ? insights.weaknesses.join(" • ")
        : "No critical weaknesses identified",
      color: "warning",
      delay: 0.3,
      gradient: "from-warning to-amber-400",
    },
    {
      icon: Target,
      title: "Personalized Advice",
      content: insights.advice,
      color: "accent",
      delay: 0.4,
      gradient: "from-accent to-cyan-400",
    },
    {
      icon: Sparkles,
      title: "Next Best Skill",
      content: insights.nextBestSkill || "Focus on core fundamentals first",
      color: "primary",
      delay: 0.5,
      highlight: true,
      gradient: "from-pink-500 to-rose-400",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
      success: { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
      warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" },
      accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" },
    };
    return colors[color] || colors.primary;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -40, rotateY: -10 },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
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
      className="w-full max-w-4xl mx-auto"
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
          <Zap className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"AI Career Insights".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.03 }}
            >
              {char}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Personalized analysis for your {role.replace(/_/g, " ")} journey
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-4"
      >
        {cards.map((card) => {
          const colors = getColorClasses(card.color);
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ 
                x: 8, 
                scale: 1.01,
                boxShadow: `0 10px 40px hsl(262 83% 55% / 0.1)`,
              }}
              className={`glass-card p-6 relative overflow-hidden group cursor-pointer border ${
                card.highlight ? 'border-primary/40' : 'border-transparent hover:border-primary/20'
              }`}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />

              <div className="flex items-start gap-4 relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{card.title}</h3>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{card.content}</p>
                </div>
              </div>

              {/* Highlight indicator for special cards */}
              {card.highlight && (
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(262 83% 55% / 0.2)",
                      "0 0 40px hsl(262 83% 55% / 0.3)",
                      "0 0 20px hsl(262 83% 55% / 0.2)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                />
              )}
            </motion.div>
          );
        })}

        {/* Motivation card with special styling */}
        <motion.div
          variants={cardVariants}
          whileHover={{ 
            x: 8, 
            scale: 1.01,
          }}
          className="glass-card p-6 relative overflow-hidden group border border-warning/20"
        >
          {/* Animated gradient background */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 opacity-5"
            style={{
              background: "linear-gradient(90deg, hsl(38 92% 50%), hsl(262 83% 55%), hsl(38 92% 50%))",
              backgroundSize: "200% 100%",
            }}
          />

          <div className="flex items-start gap-4 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-amber-400 flex items-center justify-center text-white flex-shrink-0 shadow-lg"
            >
              <Lightbulb className="w-6 h-6" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                Keep Going!
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🚀
                </motion.span>
              </h3>
              <p className="text-muted-foreground mb-3">{insights.motivation}</p>
              {insights.predictedReadiness && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  <TrendingUp className="w-4 h-4" />
                  {insights.predictedReadiness}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAIInsights;
