import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DynamicReadinessScoreProps {
  score: number;
  status: "not_ready" | "partially_ready" | "job_ready";
  role: string;
}

const DynamicReadinessScore = ({ score, status, role }: DynamicReadinessScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
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
      case "job_ready":
        return {
          label: "Job Ready",
          color: "text-success",
          bgColor: "bg-success/20",
          ringColor: "stroke-success",
          glowColor: "shadow-[0_0_40px_hsl(142_76%_45%_/_0.4)]",
          description: "You have the skills employers are looking for!",
        };
      case "partially_ready":
        return {
          label: "Partially Ready",
          color: "text-warning",
          bgColor: "bg-warning/20",
          ringColor: "stroke-warning",
          glowColor: "shadow-[0_0_40px_hsl(38_92%_50%_/_0.4)]",
          description: "You're on the right track with some gaps to fill.",
        };
      default:
        return {
          label: "Not Ready Yet",
          color: "text-destructive",
          bgColor: "bg-destructive/20",
          ringColor: "stroke-destructive",
          glowColor: "shadow-[0_0_40px_hsl(0_72%_51%_/_0.4)]",
          description: "Focus on building core skills for this role.",
        };
    }
  };

  const config = getStatusConfig();
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Your Readiness Score
        </h2>
        <p className="text-muted-foreground">
          For {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </div>

      <div className={`glass-card p-8 ${config.glowColor} transition-shadow duration-500`}>
        {/* Circular progress */}
        <div className="relative w-52 h-52 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              className="fill-none stroke-muted/30"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              className={`fill-none ${config.ringColor}`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-5xl font-bold ${config.color}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {displayScore}
            </motion.span>
            <span className="text-muted-foreground text-sm">out of 100</span>
          </div>
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} ${config.color} font-semibold`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.bgColor} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color.replace('text-', 'bg-')}`}></span>
            </span>
            {config.label}
          </span>
          <p className="text-muted-foreground mt-3 text-sm">
            {config.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DynamicReadinessScore;
