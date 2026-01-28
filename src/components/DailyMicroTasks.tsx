import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Zap, Calendar, Clock, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MissingSkill } from "@/hooks/useCareerAnalysis";

interface DailyMicroTasksProps {
  missingSkills: MissingSkill[];
  role: string;
}

interface MicroTask {
  id: string;
  title: string;
  duration: string;
  skill: string;
  completed: boolean;
  type: "learn" | "practice" | "read" | "watch";
}

const DailyMicroTasks = ({ missingSkills, role }: DailyMicroTasksProps) => {
  // Generate daily tasks based on missing skills
  const generateTasks = (): MicroTask[] => {
    const taskTypes: ("learn" | "practice" | "read" | "watch")[] = ["learn", "practice", "read", "watch"];
    const taskTemplates = {
      learn: ["Study the basics of", "Complete a tutorial on", "Review documentation for"],
      practice: ["Build a small project using", "Solve 3 coding challenges in", "Practice implementing"],
      read: ["Read an article about", "Explore best practices for", "Review a case study on"],
      watch: ["Watch a 15-min video on", "Follow a walkthrough for", "Study a demo of"],
    };

    return missingSkills.slice(0, 4).map((skill, index) => {
      const type = taskTypes[index % taskTypes.length];
      const templates = taskTemplates[type];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      return {
        id: `task-${index}`,
        title: `${template} ${skill.name}`,
        duration: type === "watch" ? "15 min" : type === "read" ? "10 min" : "30 min",
        skill: skill.name,
        completed: false,
        type,
      };
    });
  };

  const [tasks, setTasks] = useState<MicroTask[]>(generateTasks);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "learn": return "bg-primary/10 text-primary";
      case "practice": return "bg-success/10 text-success";
      case "read": return "bg-accent/10 text-accent";
      case "watch": return "bg-warning/10 text-warning";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Today's Micro-Tasks
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Badge>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className="font-medium">{completedCount}/{tasks.length} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  task.completed 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                }`}
              >
                <motion.div
                  animate={{ scale: task.completed ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getTypeColor(task.type)}`}>
                      {task.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.duration}
                    </span>
                  </div>
                </div>

                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-success"
                  >
                    <Trophy className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {completedCount === tasks.length && tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-success/20 to-accent/20 text-center"
            >
              <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="font-semibold">All tasks completed! 🎉</p>
              <p className="text-sm text-muted-foreground">Great job staying consistent!</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyMicroTasks;
