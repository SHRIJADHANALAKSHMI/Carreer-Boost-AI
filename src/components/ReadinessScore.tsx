import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ReadinessScoreProps {
  score: number;
  status: "not-ready" | "almost-ready" | "ready";
}

const ReadinessScore = ({ score, status }: ReadinessScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getStatusConfig = () => {
    switch (status) {
      case "ready":
        return {
          label: "Job Ready",
          icon: "✅",
          color: "text-success",
          glowColor: "0 0 40px hsl(142 76% 45% / 0.5)",
          strokeColor: "hsl(142, 76%, 45%)",
        };
      case "almost-ready":
        return {
          label: "Almost Ready",
          icon: "⚠️",
          color: "text-warning",
          glowColor: "0 0 40px hsl(38 92% 50% / 0.5)",
          strokeColor: "hsl(38, 92%, 50%)",
        };
      default:
        return {
          label: "Not Ready",
          icon: "❌",
          color: "text-destructive",
          glowColor: "0 0 40px hsl(0 72% 51% / 0.5)",
          strokeColor: "hsl(0, 72%, 51%)",
        };
    }
  };

  const config = getStatusConfig();
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8 text-center max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-6">Your Readiness Score</h3>
      
      <div className="relative w-56 h-56 mx-auto mb-6">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={config.strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(${config.glowColor})` }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-6xl font-bold ${config.color}`}
            key={displayScore}
          >
            {displayScore}
          </motion.span>
          <span className="text-lg text-muted-foreground">/ 100</span>
        </div>
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card ${config.color}`}
      >
        <span className="text-xl">{config.icon}</span>
        <span className="font-semibold">{config.label}</span>
      </motion.div>
    </motion.div>
  );
};

export default ReadinessScore;