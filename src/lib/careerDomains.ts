import { 
  Code2, Database, Layout, Layers, BarChart3, Brain, Shield, Cloud, 
  Smartphone, Palette, Package, Briefcase, TrendingUp, Megaphone, 
  Calculator, Wrench, Zap, Building, GraduationCap, Users, Settings, 
  UserCheck, Heart, BookOpen, Scale
} from "lucide-react";

export interface CareerDomain {
  id: string;
  title: string;
  category: string;
  icon: typeof Code2;
  description: string;
  color: string;
}

export const careerCategories = [
  { id: "tech", label: "Technology", color: "from-violet-500 to-purple-600" },
  { id: "business", label: "Business", color: "from-blue-500 to-cyan-600" },
  { id: "creative", label: "Creative", color: "from-pink-500 to-rose-600" },
  { id: "engineering", label: "Engineering", color: "from-amber-500 to-orange-600" },
  { id: "professional", label: "Professional", color: "from-emerald-500 to-teal-600" },
];

export const careerDomains: CareerDomain[] = [
  // Technology
  { id: "frontend_developer", title: "Frontend Developer", category: "tech", icon: Layout, description: "React, TypeScript, CSS, UX/UI", color: "violet" },
  { id: "backend_developer", title: "Backend Developer", category: "tech", icon: Database, description: "Node.js, Python, APIs, Databases", color: "violet" },
  { id: "fullstack_developer", title: "Full Stack Developer", category: "tech", icon: Layers, description: "End-to-end web development", color: "violet" },
  { id: "data_scientist", title: "Data Scientist", category: "tech", icon: BarChart3, description: "Python, ML, Statistics, Analytics", color: "violet" },
  { id: "data_analyst", title: "Data Analyst", category: "tech", icon: TrendingUp, description: "SQL, Visualization, Reporting", color: "violet" },
  { id: "ml_engineer", title: "ML Engineer", category: "tech", icon: Brain, description: "TensorFlow, PyTorch, MLOps", color: "violet" },
  { id: "ai_engineer", title: "AI Engineer", category: "tech", icon: Code2, description: "LLMs, Deep Learning, NLP", color: "violet" },
  { id: "cybersecurity_analyst", title: "Cybersecurity Analyst", category: "tech", icon: Shield, description: "Security, Threat Analysis, SIEM", color: "violet" },
  { id: "cloud_devops_engineer", title: "Cloud/DevOps Engineer", category: "tech", icon: Cloud, description: "AWS, Docker, Kubernetes, CI/CD", color: "violet" },
  { id: "mobile_developer", title: "Mobile Developer", category: "tech", icon: Smartphone, description: "React Native, Flutter, iOS/Android", color: "violet" },
  
  // Creative
  { id: "ui_ux_designer", title: "UI/UX Designer", category: "creative", icon: Palette, description: "Figma, User Research, Prototyping", color: "pink" },
  
  // Business
  { id: "product_manager", title: "Product Manager", category: "business", icon: Package, description: "Strategy, Roadmaps, Agile", color: "blue" },
  { id: "business_analyst", title: "Business Analyst", category: "business", icon: Briefcase, description: "Requirements, Process Modeling", color: "blue" },
  { id: "digital_marketing", title: "Digital Marketing", category: "business", icon: Megaphone, description: "SEO, Ads, Social Media", color: "blue" },
  { id: "finance_analyst", title: "Finance Analyst", category: "business", icon: Calculator, description: "Financial Modeling, Valuation", color: "blue" },
  { id: "mba_management", title: "MBA/Management", category: "business", icon: GraduationCap, description: "Strategy, Leadership, Operations", color: "blue" },
  { id: "consultant", title: "Consultant", category: "business", icon: UserCheck, description: "Strategy, Problem Solving, Client Management", color: "blue" },
  
  // Engineering
  { id: "mechanical_engineer", title: "Mechanical Engineer", category: "engineering", icon: Wrench, description: "CAD, Manufacturing, Design", color: "amber" },
  { id: "electrical_engineer", title: "Electrical Engineer", category: "engineering", icon: Zap, description: "Circuits, Embedded Systems", color: "amber" },
  { id: "civil_engineer", title: "Civil Engineer", category: "engineering", icon: Building, description: "Structural, Construction, CAD", color: "amber" },
  
  // Professional
  { id: "hr_professional", title: "HR Professional", category: "professional", icon: Users, description: "Recruitment, Employee Relations", color: "emerald" },
  { id: "operations_manager", title: "Operations Manager", category: "professional", icon: Settings, description: "Process Optimization, Supply Chain", color: "emerald" },
  { id: "healthcare_professional", title: "Healthcare Professional", category: "professional", icon: Heart, description: "Clinical, Patient Care", color: "emerald" },
  { id: "educator", title: "Educator", category: "professional", icon: BookOpen, description: "Teaching, Curriculum, EdTech", color: "emerald" },
  { id: "legal_professional", title: "Legal Professional", category: "professional", icon: Scale, description: "Legal Research, Compliance", color: "emerald" },
];

export const getDomainById = (id: string): CareerDomain | undefined => {
  return careerDomains.find(d => d.id === id);
};

export const getDomainsByCategory = (category: string): CareerDomain[] => {
  return careerDomains.filter(d => d.category === category);
};
