import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Target, TrendingUp, Zap, Star, Code, Briefcase } from "lucide-react";
import { useRef } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

// Floating particle component
const FloatingParticle = ({ delay, duration, x, y, size }: { 
  delay: number; 
  duration: number; 
  x: number; 
  y: number; 
  size: number;
}) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Animated icon orbiting
const OrbitingIcon = ({ icon: Icon, delay, radius, duration, color }: {
  icon: React.ElementType;
  delay: number;
  radius: number;
  duration: number;
  color: string;
}) => (
  <motion.div
    className="absolute"
    style={{ 
      width: radius * 2, 
      height: radius * 2,
      left: '50%',
      top: '50%',
      marginLeft: -radius,
      marginTop: -radius,
    }}
    animate={{ rotate: 360 }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
  >
    <motion.div
      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl ${color} backdrop-blur-sm`}
      animate={{ rotate: -360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <Icon className="w-5 h-5 text-white" />
    </motion.div>
  </motion.div>
);

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 4,
  }));

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient blob */}
        <motion.div
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          initial={{ background: 'radial-gradient(circle, hsl(262 83% 58% / 0.25) 0%, transparent 70%)' }}
        >
          <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, hsl(262 83% 58% / 0.25) 0%, transparent 70%)' }} />
        </motion.div>
        
        {/* Secondary gradient blob */}
        <motion.div
          style={{ y: y2 }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
        >
          <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, hsl(180 70% 45% / 0.2) 0%, transparent 70%)' }} />
        </motion.div>

        {/* Accent blob */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full blur-3xl"
        >
          <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, hsl(320 70% 50% / 0.15) 0%, transparent 70%)' }} />
        </motion.div>

        {/* Floating particles */}
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(262 83% 58%) 1px, transparent 1px),
              linear-gradient(90deg, hsl(262 83% 58%) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div style={{ opacity }} className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 glass-card px-5 py-2.5 mb-8 border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Career Intelligence
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-success"
            />
          </motion.div>

          {/* Main Headline with letter animation */}
          <motion.div className="mb-6">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              {"From Resume to ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="gradient-text inline-block"
              >
                Role-Ready
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-muted-foreground text-4xl md:text-5xl"
              >
                — powered by AI
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Subtitle with word animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            {"Analyze your skills, uncover gaps, and follow a personalized career roadmap with real AI insights.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.05 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* CTA Buttons with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px hsl(262 83% 55% / 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg group relative overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%", skewX: "-15deg" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Analyze My Resume</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "hsl(262 83% 55%)" }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
            >
              See How It Works
            </motion.button>
          </motion.div>

          {/* Feature Cards with staggered animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Skill Analysis"
              description="AI extracts and verifies your technical skills from your resume"
              delay={1.9}
              gradient="from-primary to-purple-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Readiness Score"
              description="Get a real readiness score for your target role"
              delay={2.1}
              gradient="from-accent to-cyan-400"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Roadmap"
              description="Personalized 90-day plan to bridge your skill gaps"
              delay={2.3}
              gradient="from-pink-500 to-rose-400"
            />
          </motion.div>

          {/* Orbiting icons around center */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <div className="relative w-full h-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <OrbitingIcon icon={Code} delay={0} radius={280} duration={20} color="bg-primary/80" />
                <OrbitingIcon icon={Briefcase} delay={5} radius={320} duration={25} color="bg-accent/80" />
                <OrbitingIcon icon={Star} delay={10} radius={360} duration={30} color="bg-pink-500/80" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-12 rounded-full border-2 border-primary/40 flex justify-center pt-2 backdrop-blur-sm"
        >
          <motion.div
            animate={{ 
              height: [8, 16, 8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 rounded-full bg-primary"
          />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-muted-foreground mt-2 text-center"
        >
          Scroll to explore
        </motion.p>
      </motion.div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient: string;
}

const FeatureCard = ({ icon, title, description, delay, gradient }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8, delay, type: "spring" }}
    whileHover={{ 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3 }
    }}
    className="glass-card p-6 text-left group cursor-pointer relative overflow-hidden"
  >
    {/* Animated gradient border on hover */}
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
    />
    
    <motion.div
      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white shadow-lg`}
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
    
    {/* Shine effect on hover */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
    />
  </motion.div>
);

export default HeroSection;
