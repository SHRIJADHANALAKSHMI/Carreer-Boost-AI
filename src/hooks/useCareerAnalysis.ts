import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CareerDomainType = Database["public"]["Enums"]["career_domain"];
type ReadinessStatusType = Database["public"]["Enums"]["readiness_status"];

export interface ExtractedSkill {
  name: string;
  confidence: number;
}

export interface MissingSkill {
  name: string;
  importance: "high" | "medium" | "low";
  reason: string;
}

export interface AIInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
  motivation: string;
  predictedReadiness: string;
  nextBestSkill: string;
}

export interface RoadmapPhase {
  title: string;
  period: string;
  focusAreas: string[];
  skills: string[];
  projects: string[];
  tools: string[];
  outcomes: string[];
}

export interface AnalysisResult {
  id?: string;
  extractedSkills: ExtractedSkill[];
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  readinessScore: number;
  readinessStatus: ReadinessStatusType;
  insights: AIInsights;
  roadmap: { phases: RoadmapPhase[] };
  careerDomain: string;
  createdAt?: string;
}

// Generate a session ID for anonymous users
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("career_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("career_session_id", sessionId);
  }
  return sessionId;
};

export function useCareerAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const analyzeResume = useCallback(async (
    resumeText: string,
    careerDomain: string,
    githubUrl?: string,
    linkedinUrl?: string
  ): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-career", {
        body: { resumeText, careerDomain, githubUrl, linkedinUrl }
      });

      if (error) {
        throw error;
      }

      const result: AnalysisResult = {
        ...data,
        careerDomain,
      };

      // Save to database
      const sessionId = getSessionId();
      const insertData = {
        session_id: sessionId,
        career_domain: careerDomain as CareerDomainType,
        readiness_score: result.readinessScore,
        readiness_status: result.readinessStatus as ReadinessStatusType,
        matched_skills: result.matchedSkills as unknown as Database["public"]["Tables"]["career_analyses"]["Insert"]["matched_skills"],
        missing_skills: result.missingSkills as unknown as Database["public"]["Tables"]["career_analyses"]["Insert"]["missing_skills"],
        extracted_skills: result.extractedSkills as unknown as Database["public"]["Tables"]["career_analyses"]["Insert"]["extracted_skills"],
        ai_insights: result.insights as unknown as Database["public"]["Tables"]["career_analyses"]["Insert"]["ai_insights"],
        roadmap: result.roadmap as unknown as Database["public"]["Tables"]["career_analyses"]["Insert"]["roadmap"],
        resume_text: resumeText.substring(0, 10000),
        github_url: githubUrl || null,
        linkedin_url: linkedinUrl || null,
      };

      const { data: savedAnalysis, error: saveError } = await supabase
        .from("career_analyses")
        .insert(insertData)
        .select()
        .single();

      if (saveError) {
        console.error("Failed to save analysis:", saveError);
      } else if (savedAnalysis) {
        result.id = savedAnalysis.id;
        result.createdAt = savedAnalysis.created_at;
      }

      setAnalysisResult(result);
      toast.success("Analysis complete!");
      return result;

    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const loadHistory = useCallback(async (): Promise<AnalysisResult[]> => {
    try {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from("career_analyses")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const history: AnalysisResult[] = (data || []).map((item) => ({
        id: item.id,
        extractedSkills: (item.extracted_skills as unknown as ExtractedSkill[]) || [],
        matchedSkills: (item.matched_skills as unknown as string[]) || [],
        missingSkills: (item.missing_skills as unknown as MissingSkill[]) || [],
        readinessScore: item.readiness_score,
        readinessStatus: item.readiness_status,
        insights: (item.ai_insights as unknown as AIInsights) || {} as AIInsights,
        roadmap: (item.roadmap as unknown as { phases: RoadmapPhase[] }) || { phases: [] },
        careerDomain: item.career_domain,
        createdAt: item.created_at,
      }));

      setAnalysisHistory(history);
      return history;
    } catch (error) {
      console.error("Failed to load history:", error);
      return [];
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    analysisHistory,
    analyzeResume,
    loadHistory,
    clearAnalysis,
    setAnalysisResult,
  };
}
