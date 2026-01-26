import { motion } from "framer-motion";
import { Download, FileText, BarChart3, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AnalysisResult } from "@/hooks/useCareerAnalysis";
import { getDomainById } from "@/lib/careerDomains";

interface DownloadSectionProps {
  analysis: AnalysisResult;
}

const DownloadSection = ({ analysis }: DownloadSectionProps) => {
  const domain = getDomainById(analysis.careerDomain);
  const roleTitle = domain?.title || analysis.careerDomain.replace(/_/g, " ");

  const generateRoadmapContent = (): string => {
    let content = `# Career Roadmap: ${roleTitle}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `Readiness Score: ${analysis.readinessScore}/100\n\n`;
    content += `---\n\n`;

    if (analysis.roadmap?.phases) {
      analysis.roadmap.phases.forEach((phase, index) => {
        content += `## Phase ${index + 1}: ${phase.title}\n`;
        content += `**Timeline:** ${phase.period}\n\n`;

        if (phase.focusAreas?.length) {
          content += `### Focus Areas\n`;
          phase.focusAreas.forEach(area => {
            content += `- ${area}\n`;
          });
          content += `\n`;
        }

        if (phase.skills?.length) {
          content += `### Skills to Learn\n`;
          phase.skills.forEach(skill => {
            content += `- ${skill}\n`;
          });
          content += `\n`;
        }

        if (phase.projects?.length) {
          content += `### Projects to Build\n`;
          phase.projects.forEach(project => {
            content += `- ${project}\n`;
          });
          content += `\n`;
        }

        if (phase.tools?.length) {
          content += `### Tools to Master\n`;
          phase.tools.forEach(tool => {
            content += `- ${tool}\n`;
          });
          content += `\n`;
        }

        if (phase.outcomes?.length) {
          content += `### Expected Outcomes\n`;
          phase.outcomes.forEach(outcome => {
            content += `✓ ${outcome}\n`;
          });
          content += `\n`;
        }

        content += `---\n\n`;
      });
    }

    return content;
  };

  const generateSkillGapContent = (): string => {
    let content = `# Skill Gap Report: ${roleTitle}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `Readiness Score: ${analysis.readinessScore}/100\n\n`;
    content += `---\n\n`;

    content += `## Matched Skills (${analysis.matchedSkills?.length || 0})\n`;
    if (analysis.matchedSkills?.length) {
      analysis.matchedSkills.forEach(skill => {
        content += `✓ ${skill}\n`;
      });
    } else {
      content += `No matched skills found.\n`;
    }
    content += `\n`;

    content += `## Skills to Develop (${analysis.missingSkills?.length || 0})\n\n`;
    if (analysis.missingSkills?.length) {
      const highPriority = analysis.missingSkills.filter(s => s.importance === "high");
      const mediumPriority = analysis.missingSkills.filter(s => s.importance === "medium");
      const lowPriority = analysis.missingSkills.filter(s => s.importance === "low");

      if (highPriority.length) {
        content += `### High Priority\n`;
        highPriority.forEach(skill => {
          content += `- **${skill.name}**: ${skill.reason}\n`;
        });
        content += `\n`;
      }

      if (mediumPriority.length) {
        content += `### Medium Priority\n`;
        mediumPriority.forEach(skill => {
          content += `- **${skill.name}**: ${skill.reason}\n`;
        });
        content += `\n`;
      }

      if (lowPriority.length) {
        content += `### Nice to Have\n`;
        lowPriority.forEach(skill => {
          content += `- **${skill.name}**: ${skill.reason}\n`;
        });
        content += `\n`;
      }
    }

    return content;
  };

  const generateSummaryContent = (): string => {
    let content = `# Career Readiness Summary: ${roleTitle}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;

    content += `## Readiness Score\n`;
    content += `**${analysis.readinessScore}/100** - ${
      analysis.readinessStatus === "job_ready" ? "Job Ready ✓" :
      analysis.readinessStatus === "partially_ready" ? "Partially Ready" :
      "Not Ready Yet"
    }\n\n`;

    if (analysis.insights) {
      content += `## AI Analysis Summary\n`;
      content += `${analysis.insights.summary}\n\n`;

      if (analysis.insights.strengths?.length) {
        content += `## Your Strengths\n`;
        analysis.insights.strengths.forEach(s => {
          content += `• ${s}\n`;
        });
        content += `\n`;
      }

      if (analysis.insights.weaknesses?.length) {
        content += `## Areas to Improve\n`;
        analysis.insights.weaknesses.forEach(w => {
          content += `• ${w}\n`;
        });
        content += `\n`;
      }

      content += `## Personalized Advice\n`;
      content += `${analysis.insights.advice}\n\n`;

      content += `## Next Best Skill to Learn\n`;
      content += `${analysis.insights.nextBestSkill}\n\n`;

      if (analysis.insights.predictedReadiness) {
        content += `## Prediction\n`;
        content += `${analysis.insights.predictedReadiness}\n\n`;
      }
    }

    content += `## Quick Stats\n`;
    content += `- Matched Skills: ${analysis.matchedSkills?.length || 0}\n`;
    content += `- Skills to Develop: ${analysis.missingSkills?.length || 0}\n`;
    content += `- Skills Detected: ${analysis.extractedSkills?.length || 0}\n`;

    return content;
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  const downloads = [
    {
      icon: Map,
      title: "Career Roadmap",
      description: "Your personalized step-by-step plan",
      filename: `career-roadmap-${analysis.careerDomain}.md`,
      generator: generateRoadmapContent,
    },
    {
      icon: BarChart3,
      title: "Skill Gap Report",
      description: "Detailed breakdown of skills to develop",
      filename: `skill-gap-report-${analysis.careerDomain}.md`,
      generator: generateSkillGapContent,
    },
    {
      icon: FileText,
      title: "Readiness Summary",
      description: "Complete analysis overview",
      filename: `readiness-summary-${analysis.careerDomain}.md`,
      generator: generateSummaryContent,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Download Your Reports
        </h2>
        <p className="text-muted-foreground">
          Export professional reports for reference or sharing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {downloads.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{item.description}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => downloadFile(item.generator(), item.filename)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DownloadSection;
