import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, LogOut, Upload, TrendingUp, Target, Calendar, 
  Zap, BookOpen, MessageSquare, Lightbulb, Award, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCareerAnalysis, type AnalysisResult } from "@/hooks/useCareerAnalysis";
import { getDomainById } from "@/lib/careerDomains";
import SmartFeaturesSection from "@/components/SmartFeaturesSection";
import DailyMicroTasks from "@/components/DailyMicroTasks";
import ConfidenceBooster from "@/components/ConfidenceBooster";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { analysisHistory, loadHistory } = useCareerAnalysis();
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    loadHistory().then((history) => {
      if (history.length > 0) {
        setLatestAnalysis(history[0]);
      }
    });
  }, [loadHistory]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNewAnalysis = () => {
    navigate("/analyze");
  };

  const domain = latestAnalysis ? getDomainById(latestAnalysis.careerDomain) : null;

  // Motivation messages based on score
  const getMotivation = () => {
    if (!latestAnalysis) return "Start your journey by uploading your resume!";
    if (latestAnalysis.readinessScore >= 80) return "You're crushing it! Keep up the amazing work! 🚀";
    if (latestAnalysis.readinessScore >= 60) return "Great progress! You're on the right track! 💪";
    if (latestAnalysis.readinessScore >= 40) return "Every step counts. Keep learning and growing! 🌱";
    return "Your journey starts here. Let's build your skills together! ✨";
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-border sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl gradient-text">CareerAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Welcome, {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Confidence Booster */}
        <ConfidenceBooster message={getMotivation()} />

        {/* Quick Stats */}
        {latestAnalysis ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="glass-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Readiness Score</p>
                    <p className="text-3xl font-bold gradient-text">{latestAnalysis.readinessScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <Progress value={latestAnalysis.readinessScore} className="h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Role</p>
                    <p className="text-lg font-semibold">{domain?.title || "Not set"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Briefcase className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Skills Matched</p>
                    <p className="text-lg font-semibold">{latestAnalysis.matchedSkills.length} skills</p>
                  </div>
                  <div className="p-3 rounded-xl bg-success/10">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Skills to Learn</p>
                    <p className="text-lg font-semibold">{latestAnalysis.missingSkills.length} skills</p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/10">
                    <BookOpen className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-primary/20">
              <CardContent className="p-12 text-center">
                <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Start Your Analysis</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your resume to get your AI-powered readiness score and personalized career roadmap.
                </p>
                <Button onClick={handleNewAnalysis} className="btn-primary gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {latestAnalysis && (
          <>
            {/* Smart Features Section */}
            <SmartFeaturesSection analysis={latestAnalysis} />

            {/* Daily Micro-Tasks */}
            <DailyMicroTasks 
              missingSkills={latestAnalysis.missingSkills} 
              role={latestAnalysis.careerDomain} 
            />

            {/* Next Best Skill & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next Best Skill */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-primary/20 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-warning" />
                      Next Best Skill to Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestAnalysis.insights.nextBestSkill ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                          <h4 className="font-semibold text-lg mb-2">{latestAnalysis.insights.nextBestSkill}</h4>
                          <p className="text-sm text-muted-foreground">
                            Mastering this skill will have the biggest impact on your readiness score.
                          </p>
                        </div>
                        <Button className="w-full gap-2" variant="outline">
                          <BookOpen className="w-4 h-4" />
                          Find Resources
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Complete an analysis to get skill recommendations.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start gap-3 h-12" 
                      variant="outline"
                      onClick={handleNewAnalysis}
                    >
                      <Upload className="w-5 h-5 text-primary" />
                      New Resume Analysis
                    </Button>
                    <Button className="w-full justify-start gap-3 h-12" variant="outline">
                      <MessageSquare className="w-5 h-5 text-accent" />
                      Interview Prep
                    </Button>
                    <Button className="w-full justify-start gap-3 h-12" variant="outline">
                      <TrendingUp className="w-5 h-5 text-success" />
                      View Progress Trends
                    </Button>
                    <Button className="w-full justify-start gap-3 h-12" variant="outline">
                      <Calendar className="w-5 h-5 text-warning" />
                      Learning Schedule
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Analysis History */}
            {analysisHistory.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Recent Analyses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisHistory.slice(0, 5).map((analysis, index) => {
                        const analyseDomain = getDomainById(analysis.careerDomain);
                        return (
                          <div
                            key={analysis.id || index}
                            className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                analysis.readinessScore >= 70 ? 'bg-success/10 text-success' :
                                analysis.readinessScore >= 40 ? 'bg-warning/10 text-warning' :
                                'bg-destructive/10 text-destructive'
                              }`}>
                                <span className="font-bold">{analysis.readinessScore}</span>
                              </div>
                              <div>
                                <p className="font-medium">{analyseDomain?.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'Recent'}
                                </p>
                              </div>
                            </div>
                            <Badge variant={
                              analysis.readinessStatus === 'job_ready' ? 'default' :
                              analysis.readinessStatus === 'partially_ready' ? 'secondary' :
                              'outline'
                            }>
                              {analysis.readinessStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Need to import Briefcase
import { Briefcase } from "lucide-react";

export default Dashboard;
