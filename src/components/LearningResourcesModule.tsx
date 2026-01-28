import { motion } from "framer-motion";
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Star,
  Clock,
  Award,
  GraduationCap,
  Layers,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDomainById } from "@/lib/careerDomains";
import type { MissingSkill } from "@/hooks/useCareerAnalysis";

interface LearningResourcesModuleProps {
  role: string;
  missingSkills: MissingSkill[];
}

interface Resource {
  title: string;
  type: "course" | "tutorial" | "documentation" | "video" | "book";
  platform: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  skill: string;
  url: string;
}

// Real learning resource URLs
const platformUrls: Record<string, string> = {
  "Coursera": "https://www.coursera.org/search?query=",
  "Udemy": "https://www.udemy.com/courses/search/?q=",
  "LinkedIn Learning": "https://www.linkedin.com/learning/search?keywords=",
  "Pluralsight": "https://www.pluralsight.com/search?q=",
  "freeCodeCamp": "https://www.freecodecamp.org/news/search/?query=",
  "YouTube": "https://www.youtube.com/results?search_query=",
  "MDN Web Docs": "https://developer.mozilla.org/en-US/search?q=",
  "Documentation": "https://devdocs.io/#q=",
};

const LearningResourcesModule = ({ role, missingSkills }: LearningResourcesModuleProps) => {
  const domain = getDomainById(role);

  // Generate learning resources based on missing skills and role
  const getResources = (): Resource[] => {
    const platforms = Object.keys(platformUrls);
    
    const skillBasedResources: Resource[] = missingSkills.slice(0, 6).map((skill, index) => {
      const platform = platforms[index % platforms.length];
      const searchTerm = encodeURIComponent(skill.name);
      
      return {
        title: `Master ${skill.name}`,
        type: skill.importance === "high" ? "course" : "tutorial",
        platform,
        level: skill.importance === "high" ? "intermediate" : "beginner",
        duration: skill.importance === "high" ? "20-30 hours" : "5-10 hours",
        skill: skill.name,
        url: `${platformUrls[platform]}${searchTerm}`,
      };
    });

    // Add some general resources for the role
    const roleTitle = domain?.title || "Professional Skills";
    const roleResources: Resource[] = [
      {
        title: `${roleTitle} Fundamentals`,
        type: "course",
        platform: "Coursera",
        level: "beginner",
        duration: "40 hours",
        skill: "Core Concepts",
        url: `https://www.coursera.org/search?query=${encodeURIComponent(roleTitle)}`,
      },
      {
        title: `Advanced ${roleTitle} Practices`,
        type: "course",
        platform: "Udemy",
        level: "advanced",
        duration: "25 hours",
        skill: "Best Practices",
        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(roleTitle + " advanced")}`,
      },
    ];

    return [...skillBasedResources, ...roleResources].slice(0, 8);
  };

  const resources = getResources();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course": return <GraduationCap className="w-4 h-4" />;
      case "tutorial": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "documentation": return <BookOpen className="w-4 h-4" />;
      case "book": return <BookOpen className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-success/10 text-success border-success/30";
      case "intermediate": return "bg-warning/10 text-warning border-warning/30";
      case "advanced": return "bg-primary/10 text-primary border-primary/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Learning path stages
  const learningPath = [
    { stage: "Foundation", description: "Build core knowledge", weeks: "Weeks 1-4", icon: <Layers className="w-5 h-5" /> },
    { stage: "Practice", description: "Apply through projects", weeks: "Weeks 5-8", icon: <Zap className="w-5 h-5" /> },
    { stage: "Mastery", description: "Advanced concepts", weeks: "Weeks 9-12", icon: <Award className="w-5 h-5" /> },
  ];

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <span>Learning Resources</span>
        </h2>
        <p className="text-muted-foreground">
          Curated resources to help you become a {domain?.title || "professional"}
        </p>
      </div>

      {/* Learning Path Overview */}
      <Card className="glass-card border-primary/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Your Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPath.map((phase, index) => (
              <motion.div
                key={phase.stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-4 rounded-xl bg-secondary/50 border border-border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {phase.icon}
                  </div>
                  <div>
                    <span className="font-semibold">{phase.stage}</span>
                    <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{phase.description}</p>
                {index < learningPath.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Skills Section */}
      {missingSkills.filter(s => s.importance === "high").length > 0 && (
        <Card className="glass-card border-warning/20 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Star className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Priority Skills to Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills
                    .filter(s => s.importance === "high")
                    .slice(0, 5)
                    .map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-background">
                        {skill.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="glass-card h-full hover:shadow-lg transition-all hover:border-primary/30 group cursor-pointer"
              onClick={() => handleResourceClick(resource.url)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getTypeIcon(resource.type)}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {resource.type}
                    </Badge>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h4>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {resource.platform}
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {resource.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {resource.skill}
                  </Badge>
                  <Badge className={`text-xs capitalize ${getLevelColor(resource.level)}`}>
                    {resource.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tips Card */}
      <Card className="glass-card border-accent/20 bg-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Learning Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set aside dedicated learning time each day (even 30 minutes helps)</li>
                <li>• Build projects as you learn to reinforce concepts</li>
                <li>• Join communities to learn from others and stay motivated</li>
                <li>• Track your progress and celebrate small wins</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LearningResourcesModule;
