import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  resumeText: string;
  careerDomain: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const careerSkillsMap: Record<string, { required: string[]; nice_to_have: string[] }> = {
  frontend_developer: {
    required: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git", "Responsive Design", "REST APIs"],
    nice_to_have: ["Next.js", "Vue.js", "Angular", "Tailwind CSS", "Testing", "Webpack", "GraphQL", "Accessibility"]
  },
  backend_developer: {
    required: ["Node.js", "Python", "SQL", "REST APIs", "Git", "Database Design", "Authentication", "Server Management"],
    nice_to_have: ["Docker", "Kubernetes", "AWS", "Microservices", "Redis", "GraphQL", "CI/CD", "System Design"]
  },
  fullstack_developer: {
    required: ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "HTML/CSS", "Database Management"],
    nice_to_have: ["TypeScript", "Docker", "AWS", "MongoDB", "Redis", "GraphQL", "Testing", "CI/CD"]
  },
  data_scientist: {
    required: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Pandas", "NumPy", "Scikit-learn"],
    nice_to_have: ["TensorFlow", "PyTorch", "Deep Learning", "NLP", "Big Data", "Spark", "R", "A/B Testing"]
  },
  data_analyst: {
    required: ["SQL", "Excel", "Data Visualization", "Statistics", "Python/R", "Tableau/Power BI", "Data Cleaning", "Reporting"],
    nice_to_have: ["Machine Learning", "ETL", "Looker", "BigQuery", "A/B Testing", "Data Modeling", "Presentation Skills"]
  },
  ml_engineer: {
    required: ["Python", "Machine Learning", "Deep Learning", "TensorFlow/PyTorch", "MLOps", "Docker", "Cloud Platforms", "SQL"],
    nice_to_have: ["Kubernetes", "Spark", "Computer Vision", "NLP", "Model Deployment", "Feature Engineering", "Distributed Systems"]
  },
  ai_engineer: {
    required: ["Python", "Deep Learning", "NLP", "Computer Vision", "TensorFlow/PyTorch", "LLMs", "Cloud Platforms", "APIs"],
    nice_to_have: ["Reinforcement Learning", "MLOps", "Prompt Engineering", "RAG", "Vector Databases", "Model Fine-tuning"]
  },
  cybersecurity_analyst: {
    required: ["Network Security", "Threat Analysis", "SIEM Tools", "Incident Response", "Vulnerability Assessment", "Firewalls", "Linux", "Security Frameworks"],
    nice_to_have: ["Penetration Testing", "Cloud Security", "Forensics", "Python Scripting", "Compliance", "Zero Trust", "SOC Operations"]
  },
  cloud_devops_engineer: {
    required: ["AWS/Azure/GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Infrastructure as Code", "Monitoring", "Git"],
    nice_to_have: ["Terraform", "Ansible", "Jenkins", "Prometheus", "Service Mesh", "Security", "Cost Optimization", "Site Reliability"]
  },
  mobile_developer: {
    required: ["React Native/Flutter", "iOS/Android", "JavaScript/Dart", "Mobile UI/UX", "REST APIs", "Git", "State Management", "App Store Deployment"],
    nice_to_have: ["Swift", "Kotlin", "Firebase", "Push Notifications", "Offline Storage", "Performance Optimization", "Testing"]
  },
  ui_ux_designer: {
    required: ["Figma", "User Research", "Wireframing", "Prototyping", "Visual Design", "Design Systems", "Usability Testing", "Information Architecture"],
    nice_to_have: ["Adobe Suite", "Motion Design", "HTML/CSS", "Accessibility", "Design Thinking", "Sketch", "User Flows", "A/B Testing"]
  },
  product_manager: {
    required: ["Product Strategy", "Roadmap Planning", "User Research", "Agile/Scrum", "Data Analysis", "Stakeholder Management", "Requirements Gathering", "Prioritization"],
    nice_to_have: ["SQL", "A/B Testing", "UX Design", "Technical Knowledge", "Jira", "Product Analytics", "Go-to-Market", "OKRs"]
  },
  business_analyst: {
    required: ["Requirements Analysis", "SQL", "Data Analysis", "Business Process Modeling", "Stakeholder Management", "Documentation", "Excel", "Communication"],
    nice_to_have: ["Power BI/Tableau", "Agile", "BPMN", "UML", "Python", "Project Management", "Industry Knowledge"]
  },
  digital_marketing: {
    required: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics", "Email Marketing", "PPC/Ads", "Copywriting", "Marketing Automation"],
    nice_to_have: ["A/B Testing", "CRM", "Influencer Marketing", "Video Marketing", "Growth Hacking", "Affiliate Marketing", "Brand Strategy"]
  },
  finance_analyst: {
    required: ["Financial Modeling", "Excel", "Financial Statements", "Valuation", "Data Analysis", "Reporting", "Accounting Principles", "Forecasting"],
    nice_to_have: ["SQL", "Python", "Power BI/Tableau", "Bloomberg Terminal", "VBA", "Investment Analysis", "Risk Management", "M&A"]
  },
  mechanical_engineer: {
    required: ["CAD Software", "Engineering Principles", "Materials Science", "Thermodynamics", "Manufacturing Processes", "Technical Drawing", "Problem Solving", "Project Management"],
    nice_to_have: ["FEA/CFD", "MATLAB", "3D Printing", "Lean Manufacturing", "Quality Control", "Automation", "Industry Standards"]
  },
  electrical_engineer: {
    required: ["Circuit Design", "Electronics", "CAD/EDA Tools", "Embedded Systems", "Control Systems", "Power Systems", "Signals & Systems", "Problem Solving"],
    nice_to_have: ["PCB Design", "MATLAB", "PLC Programming", "IoT", "VHDL/Verilog", "Renewable Energy", "Testing Equipment"]
  },
  civil_engineer: {
    required: ["Structural Analysis", "AutoCAD", "Construction Management", "Surveying", "Geotechnical Engineering", "Building Codes", "Project Management", "Technical Drawing"],
    nice_to_have: ["BIM Software", "Revit", "Environmental Engineering", "Transportation Planning", "Cost Estimation", "Sustainability", "STAAD"]
  },
  mba_management: {
    required: ["Strategic Planning", "Financial Analysis", "Leadership", "Project Management", "Business Development", "Marketing Strategy", "Operations", "Data-Driven Decision Making"],
    nice_to_have: ["Change Management", "Entrepreneurship", "M&A", "Consulting", "Digital Transformation", "Supply Chain", "Negotiation"]
  },
  hr_professional: {
    required: ["Recruitment", "Employee Relations", "HR Policies", "Performance Management", "Onboarding", "Labor Law", "HRIS Systems", "Communication"],
    nice_to_have: ["Talent Development", "Compensation & Benefits", "Diversity & Inclusion", "HR Analytics", "Organizational Development", "Culture Building"]
  },
  operations_manager: {
    required: ["Process Optimization", "Supply Chain", "Project Management", "Team Leadership", "Budgeting", "Quality Management", "Problem Solving", "KPI Tracking"],
    nice_to_have: ["Six Sigma", "Lean Management", "ERP Systems", "Vendor Management", "Inventory Management", "Automation", "Data Analysis"]
  },
  consultant: {
    required: ["Problem Solving", "Data Analysis", "Client Management", "Presentation Skills", "Business Strategy", "Research", "Excel/PowerPoint", "Communication"],
    nice_to_have: ["Industry Expertise", "Project Management", "Change Management", "Financial Modeling", "Python/SQL", "Design Thinking", "Stakeholder Management"]
  },
  healthcare_professional: {
    required: ["Clinical Knowledge", "Patient Care", "Medical Terminology", "Documentation", "HIPAA Compliance", "Communication", "Critical Thinking", "Empathy"],
    nice_to_have: ["EHR Systems", "Research", "Leadership", "Quality Improvement", "Telemedicine", "Interdisciplinary Collaboration", "Evidence-Based Practice"]
  },
  educator: {
    required: ["Curriculum Development", "Classroom Management", "Subject Expertise", "Assessment Design", "Communication", "Student Engagement", "Differentiated Instruction", "Technology Integration"],
    nice_to_have: ["EdTech Tools", "Research", "Special Education", "Mentoring", "Professional Development", "Data-Driven Instruction", "Parent Communication"]
  },
  legal_professional: {
    required: ["Legal Research", "Writing & Drafting", "Case Analysis", "Client Communication", "Legal Procedures", "Attention to Detail", "Critical Thinking", "Ethics"],
    nice_to_have: ["Negotiation", "Litigation", "Contract Law", "Corporate Law", "Legal Tech", "Mediation", "Regulatory Compliance"]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, careerDomain, githubUrl, linkedinUrl }: AnalysisRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const skillsForRole = careerSkillsMap[careerDomain] || careerSkillsMap.frontend_developer;
    const allRequiredSkills = [...skillsForRole.required, ...skillsForRole.nice_to_have];

    const systemPrompt = `You are an expert career advisor and resume analyst. Your task is to analyze a resume and provide a detailed career readiness assessment for the specified role.

You must respond with a valid JSON object containing:
1. extractedSkills: Array of objects with {name: string, confidence: number (0-100)}
2. matchedSkills: Array of strings - skills from the resume that match required skills
3. missingSkills: Array of objects with {name: string, importance: "high" | "medium" | "low", reason: string}
4. readinessScore: Number 0-100 based on skill coverage and experience depth
5. readinessStatus: "not_ready" (0-39), "partially_ready" (40-69), or "job_ready" (70-100)
6. insights: Object with {summary: string, strengths: string[], weaknesses: string[], advice: string, motivation: string, predictedReadiness: string, nextBestSkill: string}
7. roadmap: Object with phases array, each phase has {title: string, period: string, focusAreas: string[], skills: string[], projects: string[], tools: string[], outcomes: string[]}

The required skills for ${careerDomain.replace(/_/g, ' ')} are: ${skillsForRole.required.join(', ')}
Nice-to-have skills: ${skillsForRole.nice_to_have.join(', ')}

Be realistic and constructive. Base the readiness score on actual skill matches, experience depth, and role seniority signals in the resume.`;

    const userPrompt = `Analyze this resume for a ${careerDomain.replace(/_/g, ' ')} role:

${resumeText}

${githubUrl ? `GitHub Profile: ${githubUrl}` : ''}
${linkedinUrl ? `LinkedIn Profile: ${linkedinUrl}` : ''}

Provide a comprehensive JSON analysis following the exact structure specified. Be specific about why skills are missing and how important each is.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI quota exceeded. Using fallback analysis." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from AI response, handling markdown code blocks
    let analysisResult;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysisResult = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("analyze-career error:", error);
    
    // Fallback analysis when AI fails
    const fallbackAnalysis = {
      extractedSkills: [],
      matchedSkills: [],
      missingSkills: [],
      readinessScore: 0,
      readinessStatus: "not_ready",
      insights: {
        summary: "We couldn't fully analyze your resume at this time. Please try again.",
        strengths: [],
        weaknesses: [],
        advice: "Try uploading a more detailed resume with clear skill mentions.",
        motivation: "Every career journey starts somewhere. Keep refining your profile!",
        predictedReadiness: "Unable to predict at this time",
        nextBestSkill: "Focus on core fundamentals for your target role"
      },
      roadmap: {
        phases: [
          {
            title: "Foundation Building",
            period: "Days 1-30",
            focusAreas: ["Learn core concepts", "Set up environment"],
            skills: ["Fundamentals"],
            projects: ["Starter project"],
            tools: ["Essential tools"],
            outcomes: ["Basic proficiency"]
          }
        ]
      },
      error: error instanceof Error ? error.message : "Unknown error"
    };

    return new Response(JSON.stringify(fallbackAnalysis), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
