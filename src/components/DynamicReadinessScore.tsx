import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, TrendingUp, Zap } from "lucide-react";

interface DynamicReadinessScoreProps {
  score: number;
  status: "not_ready" | "partially_ready" | "job_ready";
  role: string;
}

// Confetti particle component
const Confetti = ({ delay }: { delay: number }) => {
  const colors = ["#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 200 - 100;
  const randomRotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ 
        y: -150, 
        x: randomX, 
        opacity: 0, 
        rotate: randomRotation,
        scale: 0.5
      }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm"
      style={{ backgroundColor: randomColor }}
    />
  );
};

const DynamicReadinessScore = ({ score, status, role }: DynamicReadinessScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 100;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
        if (score >= 70) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, isInView]);

  const getStatusConfig = () => {
    switch (status) {
      case "job_ready":
        return {
          label: "Job Ready",
          color: "text-success",
          bgColor: "bg-success/20",
          ringColor: "stroke-success",
          glowColor: "0 0 60px hsl(142 70% 40% / 0.4)",
          gradientFrom: "from-success",
          gradientTo: "to-emerald-400",
          description: "You have the skills employers are looking for!",
          icon: Trophy,
        };
      case "partially_ready":
        return {
          label: "Partially Ready",
          color: "text-warning",
          bgColor: "bg-warning/20",
          ringColor: "stroke-warning",
          glowColor: "0 0 60px hsl(38 92% 50% / 0.4)",
          gradientFrom: "from-warning",
          gradientTo: "to-amber-400",
          description: "You're on the right track with some gaps to fill.",
          icon: TrendingUp,
        };
      default:
        return {
          label: "Not Ready Yet",
          color: "text-destructive",
          bgColor: "bg-destructive/20",
          ringColor: "stroke-destructive",
          glowColor: "0 0 60px hsl(0 72% 51% / 0.4)",
          gradientFrom: "from-destructive",
          gradientTo: "to-red-400",
          description: "Focus on building core skills for this role.",
          icon: Zap,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (displayScore / 100) * circumference;

  // Generate tick marks
  const ticks = Array.from({ length: 50 }, (_, i) => {
    const angle = (i / 50) * 360 - 90;
    const isActive = (i / 50) * 100 <= displayScore;
    return { angle, isActive };
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Your Readiness Score
        </h2>
        <p className="text-muted-foreground">
          For {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </motion.div>

      <motion.div
        initial={{ boxShadow: "0 0 0px transparent" }}
        animate={{ boxShadow: config.glowColor }}
        transition={{ delay: 1.5, duration: 1 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        {/* Confetti effect for high scores */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <Confetti key={i} delay={i * 0.05} />
            ))}
          </div>
        )}

        {/* Background pulse effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} rounded-2xl`}
        />

        {/* Circular progress */}
        <div className="relative w-56 h-56 mx-auto mb-6">
          {/* Tick marks */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            {ticks.map((tick, i) => {
              const innerRadius = 70;
              const outerRadius = 76;
              const radian = (tick.angle * Math.PI) / 180;
              const x1 = 100 + innerRadius * Math.cos(radian);
              const y1 = 100 + innerRadius * Math.sin(radian);
              const x2 = 100 + outerRadius * Math.cos(radian);
              const y2 = 100 + outerRadius * Math.sin(radian);
              
              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={tick.isActive ? config.ringColor : "stroke-muted/20"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: tick.isActive ? 1 : 0.3 }}
                  transition={{ delay: (i / 50) * 1.5 }}
                />
              );
            })}
          </svg>

          {/* Main progress ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              className="fill-none stroke-muted/20"
              strokeWidth="8"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`${config.color.replace('text-', 'stop-')}`} />
                <stop offset="100%" className="stop-primary" />
              </linearGradient>
            </defs>
            {/* Progress circle with gradient */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              className="fill-none"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: isInView ? offset : circumference }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-2`}
            >
              <StatusIcon className={`w-8 h-8 ${config.color}`} />
            </motion.div>
            <motion.span
              className={`text-5xl font-bold ${config.color}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, type: "spring" }}
            >
              {displayScore}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="text-muted-foreground text-sm"
            >
              out of 100
            </motion.span>
          </div>

          {/* Orbiting dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{ 
              width: '100%', 
              height: '100%',
            }}
          >
            <motion.div
              className={`absolute w-4 h-4 rounded-full ${config.bgColor} border-2 ${config.color.replace('text-', 'border-')}`}
              style={{
                top: '3%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Status badge with bounce animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, type: "spring", bounce: 0.4 }}
          className="text-center"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${config.bgColor} ${config.color} font-semibold shadow-lg`}
          >
            <motion.span 
              className="relative flex h-3 w-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.bgColor} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${config.color.replace('text-', 'bg-')}`}></span>
            </motion.span>
            {config.label}
          </motion.span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
            className="text-muted-foreground mt-4 text-sm"
          >
            {config.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DynamicReadinessScore;
