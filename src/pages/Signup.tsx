import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Github, Chrome, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach((passed) => {
      if (passed) score++;
    });

    return { score, checks };
  }, [password]);

  const getStrengthLabel = () => {
    if (passwordStrength.score <= 1) return { label: "Weak", color: "bg-destructive" };
    if (passwordStrength.score <= 3) return { label: "Medium", color: "bg-warning" };
    return { label: "Strong", color: "bg-success" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, displayName);
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Account created successfully!");
      navigate("/onboarding");
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          style={{ background: 'radial-gradient(circle, hsl(280 75% 50% / 0.15) 0%, transparent 50%)' }}
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [-360, -180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full"
          style={{ background: 'radial-gradient(circle, hsl(320 70% 50% / 0.1) 0%, transparent 50%)' }}
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
          
          {/* Logo and Header */}
          <motion.div 
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-muted-foreground">Start your AI-powered career journey</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Display Name Field */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                  focusedField === 'name' || displayName 
                    ? '-top-2.5 text-xs bg-background px-2 text-primary' 
                    : 'top-3 text-muted-foreground'
                }`}
              >
                <Label>Display Name</Label>
              </motion.div>
              <div className="relative">
                <User className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
                  focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
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
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
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
                  className="pl-10 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary"
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

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength.score ? strength.color : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                      <div key={key} className={`flex items-center gap-1 ${passed ? 'text-success' : 'text-muted-foreground'}`}>
                        {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {key === 'length' && '8+ characters'}
                        {key === 'uppercase' && 'Uppercase'}
                        {key === 'lowercase' && 'Lowercase'}
                        {key === 'number' && 'Number'}
                        {key === 'special' && 'Special char'}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <motion.div
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                  focusedField === 'confirm' || confirmPassword 
                    ? '-top-2.5 text-xs bg-background px-2 text-primary' 
                    : 'top-3 text-muted-foreground'
                }`}
              >
                <Label>Confirm Password</Label>
              </motion.div>
              <div className="relative">
                <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors ${
                  focusedField === 'confirm' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary ${
                    confirmPassword && confirmPassword !== password ? 'border-destructive' : ''
                  }`}
                  required
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-3">
                    {confirmPassword === password ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading || passwordStrength.score < 3 || password !== confirmPassword}
                className="w-full h-12 btn-primary text-lg font-semibold group mt-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Create Account
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

          {/* Sign In Link */}
          <p className="text-center mt-6 text-muted-foreground relative z-10">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
