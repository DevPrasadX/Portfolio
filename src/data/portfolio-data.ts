export interface Company {
  id: string;
  name: string;
  logo?: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  category: 'AI' | 'Cloud' | 'Web' | 'Mobile' | 'DevOps';
}

export interface Skill {
  id: string;
  name: string;
  category: 'Cloud' | 'AI/ML' | 'Programming' | 'DevOps' | 'Databases';
  level: number; // 1-100
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  avatar?: string;
}

// Mock data
export const personalInfo: PersonalInfo = {
  name: "Prasad pansare",
  title: "Senior Cloud & AI Developer",
  bio: "Passionate software developer specializing in cloud-native applications, AI/ML solutions, and scalable architectures. Expert in AWS, Azure, GCP with 8+ years of experience building enterprise-grade solutions.",
  email: "prasadpansare02@gmail.com",
  phone: "+91 9765559032",
  location: "Pune, ,MH",
  github: "https://github.com/DevPrasadX",
  linkedin: "https://linkedin.com/in/Prasadpansare",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
};

export const companies: Company[] = [
  {
    id: "1",
    name: "Microsoft",
    position: "Senior Cloud Solutions Architect",
    startDate: "2022-01",
    description: "Leading cloud migration projects and AI solution development for enterprise clients. Designed and implemented scalable Azure-based architectures serving millions of users.",
    technologies: ["Azure", "Python", "TypeScript", "Kubernetes", "Terraform", "AI Services"],
    achievements: [
      "Led migration of 50+ enterprise applications to Azure, reducing costs by 40%",
      "Implemented AI-powered analytics platform processing 10TB+ daily",
      "Mentored team of 8 developers on cloud-native best practices"
    ]
  },
  {
    id: "2", 
    name: "Amazon Web Services",
    position: "Cloud Application Developer",
    startDate: "2020-03",
    endDate: "2021-12",
    description: "Developed serverless applications and machine learning pipelines on AWS. Specialized in building scalable, cost-effective solutions using AWS native services.",
    technologies: ["AWS Lambda", "DynamoDB", "SageMaker", "React", "Node.js", "CloudFormation"],
    achievements: [
      "Built serverless ML pipeline reducing inference time by 60%",
      "Developed real-time analytics dashboard for 1M+ daily active users",
      "Achieved AWS Solutions Architect Professional certification"
    ]
  },
  {
    id: "3",
    name: "Google Cloud",
    position: "Software Engineer",
    startDate: "2018-06",
    endDate: "2020-02",
    description: "Worked on Google Cloud AI Platform, developing tools and APIs for machine learning workflows. Contributed to open-source projects and internal developer tools.",
    technologies: ["GCP", "Python", "TensorFlow", "Kubernetes", "Go", "BigQuery"],
    achievements: [
      "Contributed to TensorFlow Extended (TFX) open-source project",
      "Improved ML model deployment pipeline efficiency by 80%",
      "Led development of internal ML monitoring dashboard"
    ]
  }
];

export const projects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Cloud Cost Optimizer",
    description: "Machine learning system that analyzes cloud usage patterns and automatically optimizes resource allocation across AWS, Azure, and GCP.",
    githubUrl: "https://github.com/Prasadpansare/cloud-optimizer",
    technologies: ["Python", "TensorFlow", "AWS", "Azure", "GCP", "Kubernetes"],
    featured: true,
    category: "AI"
  },
  {
    id: "2", 
    title: "Serverless Microservices Platform",
    description: "Event-driven microservices architecture built on AWS Lambda with auto-scaling, monitoring, and CI/CD pipeline.",
    githubUrl: "https://github.com/Prasadpansare/serverless-platform",
    liveUrl: "https://platform.example.com",
    technologies: ["AWS Lambda", "API Gateway", "DynamoDB", "CloudFormation", "Node.js"],
    featured: true,
    category: "Cloud"
  },
  {
    id: "3",
    title: "Real-time Analytics Dashboard",
    description: "React-based dashboard for visualizing real-time cloud metrics and AI model performance across multiple cloud providers.",
    githubUrl: "https://github.com/Prasadpansare/analytics-dashboard",
    liveUrl: "https://dashboard.example.com",
    technologies: ["React", "TypeScript", "D3.js", "WebSocket", "Redis"],
    featured: true,
    category: "Web"
  },
  {
    id: "4",
    title: "Multi-Cloud Infrastructure as Code",
    description: "Terraform modules for provisioning and managing infrastructure across AWS, Azure, and GCP with consistent patterns.",
    githubUrl: "https://github.com/Prasadpansare/multicloud-iac",
    technologies: ["Terraform", "AWS", "Azure", "GCP", "Ansible"],
    featured: false,
    category: "DevOps"
  }
];

export const skills: Skill[] = [
  // Cloud
  { id: "1", name: "AWS", category: "Cloud", level: 95 },
  { id: "2", name: "Azure", category: "Cloud", level: 90 },
  { id: "3", name: "Google Cloud", category: "Cloud", level: 85 },
  { id: "4", name: "Kubernetes", category: "Cloud", level: 88 },
  { id: "5", name: "Docker", category: "Cloud", level: 92 },
  
  // AI/ML
  { id: "6", name: "TensorFlow", category: "AI/ML", level: 85 },
  { id: "7", name: "PyTorch", category: "AI/ML", level: 80 },
  { id: "8", name: "Scikit-learn", category: "AI/ML", level: 88 },
  { id: "9", name: "MLOps", category: "AI/ML", level: 82 },
  
  // Programming
  { id: "10", name: "Python", category: "Programming", level: 95 },
  { id: "11", name: "TypeScript", category: "Programming", level: 90 },
  { id: "12", name: "Go", category: "Programming", level: 75 },
  { id: "13", name: "React", category: "Programming", level: 88 },
  
  // DevOps
  { id: "14", name: "Terraform", category: "DevOps", level: 85 },
  { id: "15", name: "CI/CD", category: "DevOps", level: 90 },
  { id: "16", name: "Monitoring", category: "DevOps", level: 82 },
  
  // Databases
  { id: "17", name: "PostgreSQL", category: "Databases", level: 85 },
  { id: "18", name: "MongoDB", category: "Databases", level: 80 },
  { id: "19", name: "Redis", category: "Databases", level: 75 }
];