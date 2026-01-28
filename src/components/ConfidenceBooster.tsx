import { motion } from "framer-motion";
import { Sparkles, Heart, Star, Zap } from "lucide-react";

interface ConfidenceBoosterProps {
  message: string;
}

const ConfidenceBooster = ({ message }: ConfidenceBoosterProps) => {
  const icons = [Sparkles, Heart, Star, Zap];
  const RandomIcon = icons[Math.floor(Math.random() * icons.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative overflow-hidden"
    >
      <div className="glass-card p-6 rounded-2xl border border-primary/20 relative">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <div className="relative z-10 flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600"
          >
            <RandomIcon className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium"
            >
              {message}
            </motion.p>
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${20 + i * 15}%`,
              top: "50%",
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ConfidenceBooster;
