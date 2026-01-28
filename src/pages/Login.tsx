import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          style={{ background: 'radial-gradient(circle, hsl(262 83% 58% / 0.15) 0%, transparent 50%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full"
          style={{ background: 'radial-gradient(circle, hsl(180 70% 45% / 0.1) 0%, transparent 50%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism Card */}
        <div className="glass-card p-8 rounded-3xl border border-primary/20 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          {/* Logo and Header */}
          <motion.div 
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your career journey</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Field with Floating Label */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusedField === 'email' || email 
                    ? '-top-2.5 text-xs bg-background px-2 text-primary' 
                    : 'top-3 text-muted-foreground'
                }`}
              >
                <Label>Email</Label>
              </motion.div>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
                  focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field with Floating Label */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusedField === 'password' || password 
                    ? '-top-2.5 text-xs bg-background px-2 text-primary' 
                    : 'top-3 text-muted-foreground'
                }`}
              >
                <Label>Password</Label>
              </motion.div>
              <div className="relative">
                <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
                  focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 btn-primary text-lg font-semibold group"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login Placeholders */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <Button variant="outline" className="h-11 bg-secondary/30 hover:bg-secondary/50 border-border/50" disabled>
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="h-11 bg-secondary/30 hover:bg-secondary/50 border-border/50" disabled>
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-muted-foreground relative z-10">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Guest Option */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Continue as guest →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
