import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Building2, 
  Code2, 
  Brain, 
  User, 
  Save,
  X,
  Github,
  ExternalLink,
  Terminal,
  Target,
  Trophy,
  Award
} from "lucide-react";
import { companies, projects, skills, personalInfo, type Company, type Project, type Skill } from "../data/portfolio-data";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

interface AdminDashboardProps {
  onClose: () => void;
}

interface Domain {
  id: string;
  title: string;
  description: string;
  icon: 'Cloud' | 'Cpu' | 'Settings' | 'Database' | 'Code';
}

interface Technology {
  id: string;
  name: string;
  category: 'Cloud' | 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI/ML' | 'Mobile' | 'Other';
  description?: string;
  icon?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Professional' | 'Academic' | 'Award' | 'Publication' | 'Patent' | 'Other';
  organization?: string;
  link?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  category: 'Cloud' | 'Security' | 'Programming' | 'AI/ML' | 'DevOps' | 'Database' | 'Other';
  credentialId?: string;
  link?: string;
  image?: string;
  status: 'Active' | 'Expired' | 'Pending';
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("companies");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingTechnologies, setLoadingTechnologies] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [loadingCertifications, setLoadingCertifications] = useState(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
    setEditingProject(null);
    setEditingSkill(null);
    setEditingDomain(null);
    setEditingTechnology(null);
    setEditingAchievement(null);
    setEditingCertification(null);
  };

  // Fetch companies
  useEffect(() => {
    async function fetchCompanies() {
      setLoadingCompanies(true);
      const querySnapshot = await getDocs(collection(db, "companies"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Company[];
      setCompanies(data);
      setLoadingCompanies(false);
    }
    fetchCompanies();
  }, []);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(data);
      setLoadingProjects(false);
    }
    fetchProjects();
  }, []);

  // Fetch skills
  useEffect(() => {
    async function fetchSkills() {
      setLoadingSkills(true);
      const querySnapshot = await getDocs(collection(db, "skills"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
      setSkills(data);
      setLoadingSkills(false);
    }
    fetchSkills();
  }, []);

  // Add domain CRUD functions
  const handleAddDomain = async (domainData: Omit<Domain, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "domains"), domainData);
      setDomains(prev => [...prev, { ...domainData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingDomain(null);
    } catch (error) {
      console.error("Error adding domain:", error);
      alert("Failed to add domain. See console for details.");
    }
  };

  const handleEditDomain = async (id: string, domainData: Omit<Domain, "id">) => {
    try {
      await updateDoc(doc(db, "domains", id), domainData);
      setDomains(prev => prev.map(d => d.id === id ? { ...domainData, id } : d));
      setIsDialogOpen(false);
      setEditingDomain(null);
    } catch (error) {
      console.error("Error editing domain:", error);
      alert("Failed to edit domain. See console for details.");
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await deleteDoc(doc(db, "domains", id));
      setDomains(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting domain:", error);
      alert("Failed to delete domain. See console for details.");
    }
  };

  // Add technology CRUD functions
  const handleAddTechnology = async (technologyData: Omit<Technology, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "technologies"), technologyData);
      setTechnologies(prev => [...prev, { ...technologyData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingTechnology(null);
    } catch (error) {
      console.error("Error adding technology:", error);
      alert("Failed to add technology. See console for details.");
    }
  };

  const handleEditTechnology = async (id: string, technologyData: Omit<Technology, "id">) => {
    try {
      await updateDoc(doc(db, "technologies", id), technologyData);
      setTechnologies(prev => prev.map(t => t.id === id ? { ...technologyData, id } : t));
      setIsDialogOpen(false);
      setEditingTechnology(null);
    } catch (error) {
      console.error("Error editing technology:", error);
      alert("Failed to edit technology. See console for details.");
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    try {
      await deleteDoc(doc(db, "technologies", id));
      setTechnologies(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting technology:", error);
      alert("Failed to delete technology. See console for details.");
    }
  };

  // Add achievement CRUD functions
  const handleAddAchievement = async (achievementData: Omit<Achievement, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "achievements"), achievementData);
      setAchievements(prev => [...prev, { ...achievementData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error("Error adding achievement:", error);
      alert("Failed to add achievement. See console for details.");
    }
  };

  const handleEditAchievement = async (id: string, achievementData: Omit<Achievement, "id">) => {
    try {
      await updateDoc(doc(db, "achievements", id), achievementData);
      setAchievements(prev => prev.map(a => a.id === id ? { ...achievementData, id } : a));
      setIsDialogOpen(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error("Error editing achievement:", error);
      alert("Failed to edit achievement. See console for details.");
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      await deleteDoc(doc(db, "achievements", id));
      setAchievements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement. See console for details.");
    }
  };

  // Add certification CRUD functions
  const handleAddCertification = async (certificationData: Omit<Certification, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "certifications"), certificationData);
      setCertifications(prev => [...prev, { ...certificationData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error("Error adding certification:", error);
      alert("Failed to add certification. See console for details.");
    }
  };

  const handleEditCertification = async (id: string, certificationData: Omit<Certification, "id">) => {
    try {
      await updateDoc(doc(db, "certifications", id), certificationData);
      setCertifications(prev => prev.map(c => c.id === id ? { ...certificationData, id } : c));
      setIsDialogOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error("Error editing certification:", error);
      alert("Failed to edit certification. See console for details.");
    }
  };

  const handleDeleteCertification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "certifications", id));
      setCertifications(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification. See console for details.");
    }
  };

  // Add domains fetch useEffect
  useEffect(() => {
    async function fetchDomains() {
      setLoadingDomains(true);
      const querySnapshot = await getDocs(collection(db, "domains"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Domain[];
      setDomains(data);
      setLoadingDomains(false);
    }
    fetchDomains();
  }, []);

  // Add technologies fetch useEffect
  useEffect(() => {
    async function fetchTechnologies() {
      setLoadingTechnologies(true);
      const querySnapshot = await getDocs(collection(db, "technologies"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Technology[];
      setTechnologies(data);
      setLoadingTechnologies(false);
    }
    fetchTechnologies();
  }, []);

  // Add achievements fetch useEffect
  useEffect(() => {
    async function fetchAchievements() {
      setLoadingAchievements(true);
      const querySnapshot = await getDocs(collection(db, "achievements"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Achievement[];
      setAchievements(data);
      setLoadingAchievements(false);
    }
    fetchAchievements();
  }, []);

  // Add certifications fetch useEffect
  useEffect(() => {
    async function fetchCertifications() {
      setLoadingCertifications(true);
      const querySnapshot = await getDocs(collection(db, "certifications"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certification[];
      setCertifications(data);
      setLoadingCertifications(false);
    }
    fetchCertifications();
  }, []);

  const handleAddCompany = async (companyData: Omit<Company, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "companies"), companyData);
      setCompanies(prev => [...prev, { ...companyData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingCompany(null);
    } catch (error) {
      console.error("Error adding company:", error);
      alert("Failed to add company. See console for details.");
    }
  };

  const handleAddProject = async (projectData: Omit<Project, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), projectData);
      setProjects(prev => [...prev, { ...projectData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. See console for details.");
    }
  };

  const handleAddSkill = async (skillData: Omit<Skill, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "skills"), skillData);
      setSkills(prev => [...prev, { ...skillData, id: docRef.id }]);
      setIsDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill. See console for details.");
    }
  };

  // Delete handlers
  const handleDeleteCompany = async (id: string) => {
    try {
      await deleteDoc(doc(db, "companies", id));
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company. See console for details.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. See console for details.");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, "skills", id));
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. See console for details.");
    }
  };

  const handleEditCompany = async (id: string, companyData: Omit<Company, "id">) => {
    try {
      await updateDoc(doc(db, "companies", id), companyData);
      setCompanies(prev => prev.map(c => c.id === id ? { ...companyData, id } : c));
      setIsDialogOpen(false);
      setEditingCompany(null);
    } catch (error) {
      console.error("Error editing company:", error);
      alert("Failed to edit company. See console for details.");
    }
  };

  const handleEditProject = async (id: string, projectData: Omit<Project, "id">) => {
    try {
      await updateDoc(doc(db, "projects", id), projectData);
      setProjects(prev => prev.map(p => p.id === id ? { ...projectData, id } : p));
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error editing project:", error);
      alert("Failed to edit project. See console for details.");
    }
  };

  const handleEditSkill = async (id: string, skillData: Omit<Skill, "id">) => {
    try {
      await updateDoc(doc(db, "skills", id), skillData);
      setSkills(prev => prev.map(s => s.id === id ? { ...skillData, id } : s));
      setIsDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error("Error editing skill:", error);
      alert("Failed to edit skill. See console for details.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="bg-muted border-b border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <Terminal className="h-4 w-4 text-primary ml-2" />
            <span className="font-mono text-sm text-muted-foreground">admin_dashboard.tsx</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 font-mono">sudo admin --dashboard</h1>
              <p className="text-muted-foreground font-mono">Portfolio content management system</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:bg-muted font-mono"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full mb-6 flex-wrap gap-1">
              <TabsTrigger value="companies" className="flex items-center gap-1 font-mono text-xs">
                <Building2 className="h-3 w-3" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1 font-mono text-xs">
                <Code2 className="h-3 w-3" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-1 font-mono text-xs">
                <Brain className="h-3 w-3" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="domains" className="flex items-center gap-1 font-mono text-xs">
                <Target className="h-3 w-3" />
                Domains
              </TabsTrigger>
              <TabsTrigger value="technologies" className="flex items-center gap-1 font-mono text-xs">
                <Terminal className="h-3 w-3" />
                Technologies
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1 font-mono text-xs">
                <Trophy className="h-3 w-3" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-1 font-mono text-xs">
                <Award className="h-3 w-3" />
                Certifications
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1 font-mono text-xs">
                <User className="h-3 w-3" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Companies Tab */}
            <TabsContent value="companies">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./experience/</h2>
                <Dialog open={isDialogOpen && activeTab === "companies"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      touch new_company.json
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingCompany ? "vim company.json" : "nano new_company.json"}
                      </DialogTitle>
                    </DialogHeader>
                    <CompanyForm company={editingCompany} onClose={handleCloseDialog} onSave={editingCompany ? (data) => handleEditCompany(editingCompany.id, data) : handleAddCompany} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingCompanies ? (
                <div>Loading companies...</div>
              ) : (
                <div className="grid gap-4">
                  {companies.map((company) => (
                    <motion.div
                      key={company.id}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg font-mono">{company.name}</CardTitle>
                              <p className="text-muted-foreground font-mono">{company.position}</p>
                              <p className="text-sm text-muted-foreground font-mono">
                                {company.startDate} → {company.endDate || "Present"}
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingCompany(company);
                                  setIsDialogOpen(true);
                                }}
                                className="font-mono"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 font-mono" onClick={() => handleDeleteCompany(company.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3 font-mono">{company.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {company.technologies.slice(0, 5).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs font-mono">
                                {tech}
                              </Badge>
                            ))}
                            {company.technologies.length > 5 && (
                              <Badge variant="secondary" className="text-xs font-mono">
                                +{company.technologies.length - 5}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./projects/</h2>
                <Dialog open={isDialogOpen && activeTab === "projects"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      git init new-project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingProject ? "vim project.json" : "nano new_project.json"}
                      </DialogTitle>
                    </DialogHeader>
                    <ProjectForm project={editingProject} onClose={handleCloseDialog} onSave={editingProject ? (data) => handleEditProject(editingProject.id, data) : handleAddProject} />
                  </DialogContent>
                </Dialog>
              </div>
              {loadingProjects ? (
                <div>Loading projects...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg font-mono">{project.title}</CardTitle>
                                {project.featured && (
                                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-mono">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="outline" className="font-mono">{project.category}</Badge>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingProject(project);
                                  setIsDialogOpen(true);
                                }}
                                className="font-mono"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 font-mono">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs font-mono">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge variant="secondary" className="text-xs font-mono">
                                +{project.technologies.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <Button variant="outline" size="sm" className="font-mono">
                                <Github className="h-3 w-3 mr-1" />
                                clone
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button variant="outline" size="sm" className="font-mono">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                demo
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./skills/</h2>
                <Dialog open={isDialogOpen && activeTab === "skills"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      echo "new_skill" &gt;&gt; skills.json
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingSkill ? "vim skill.json" : "nano new_skill.json"}
                      </DialogTitle>
                    </DialogHeader>
                    <SkillForm skill={editingSkill} onClose={handleCloseDialog} onSave={editingSkill ? (data) => handleEditSkill(editingSkill.id, data) : handleAddSkill} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingSkills ? (
                <div>Loading skills...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium font-mono">{skill.name}</h3>
                              <Badge variant="outline" className="text-xs font-mono">
                                {skill.category}
                              </Badge>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingSkill(skill);
                                  setIsDialogOpen(true);
                                }}
                                className="font-mono"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteSkill(skill.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium font-mono">{skill.level}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Domains Tab */}
            <TabsContent value="domains">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./domains/</h2>
                <Dialog open={isDialogOpen && activeTab === "domains"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      echo "new_domain" &gt;&gt; domains.json
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingDomain ? "vim domain.json" : "nano new_domain.json"}
                      </DialogTitle>
                    </DialogHeader>
                    <DomainForm domain={editingDomain} onClose={handleCloseDialog} onSave={editingDomain ? (data) => handleEditDomain(editingDomain.id, data) : handleAddDomain} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingDomains ? (
                <div>Loading domains...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => (
                    <motion.div
                      key={domain.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium font-mono">{domain.title}</h3>
                              <Badge variant="outline" className="text-xs font-mono">
                                {domain.icon}
                              </Badge>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingDomain(domain);
                                  setIsDialogOpen(true);
                                }}
                                className="font-mono"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteDomain(domain.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 font-mono">{domain.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Technologies Tab */}
            <TabsContent value="technologies">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./technologies/</h2>
                <Dialog open={isDialogOpen && activeTab === "technologies"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      npm install new_technology
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingTechnology ? "vim technology.json" : "npm install new_technology"}
                      </DialogTitle>
                    </DialogHeader>
                    <TechnologyForm technology={editingTechnology} onClose={handleCloseDialog} onSave={editingTechnology ? (data) => handleEditTechnology(editingTechnology.id, data) : handleAddTechnology} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingTechnologies ? (
                <div>Loading technologies...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technologies.map((technology) => (
                    <motion.div
                      key={technology.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium font-mono">{technology.name}</h3>
                              <Badge variant="outline" className="text-xs font-mono">
                                {technology.category}
                              </Badge>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTechnology(technology);
                                  setIsDialogOpen(true);
                                }}
                                className="font-mono"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteTechnology(technology.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {technology.description && (
                            <p className="text-sm text-muted-foreground mb-2 font-mono">{technology.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./achievements/</h2>
                <Dialog open={isDialogOpen && activeTab === "achievements"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      git commit --achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingAchievement ? "vim achievement.json" : "nano new_achievement.json"}
                      </DialogTitle>
                    </DialogHeader>
                    <AchievementForm achievement={editingAchievement} onClose={handleCloseDialog} onSave={editingAchievement ? (data) => handleEditAchievement(editingAchievement.id, data) : handleAddAchievement} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingAchievements ? (
                <div>Loading achievements...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium font-mono text-sm">{achievement.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {achievement.category}
                              </Badge>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingAchievement(achievement);
                                    setIsDialogOpen(true);
                                  }}
                                  className="font-mono"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteAchievement(achievement.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 font-mono">{achievement.description}</p>
                          {achievement.organization && (
                            <p className="text-xs text-muted-foreground font-mono mb-2">🏢 {achievement.organization}</p>
                          )}
                          <p className="text-xs text-muted-foreground font-mono">📅 {achievement.date}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold font-mono">./certifications/</h2>
                <Dialog open={isDialogOpen && activeTab === "certifications"} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-2" />
                      npm install certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-mono">
                        {editingCertification ? "vim certification.json" : "npm install new_certification"}
                      </DialogTitle>
                    </DialogHeader>
                    <CertificationForm certification={editingCertification} onClose={handleCloseDialog} onSave={editingCertification ? (data) => handleEditCertification(editingCertification.id, data) : handleAddCertification} />
                  </DialogContent>
                </Dialog>
              </div>

              {loadingCertifications ? (
                <div>Loading certifications...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certifications.map((certification) => (
                    <motion.div
                      key={certification.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium font-mono text-sm">{certification.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {certification.status}
                              </Badge>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCertification(certification);
                                    setIsDialogOpen(true);
                                  }}
                                  className="font-mono"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 font-mono" onClick={() => handleDeleteCertification(certification.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 font-mono">🏢 {certification.issuer}</p>
                          <p className="text-xs text-muted-foreground font-mono mb-2">📅 {certification.date}</p>
                          {certification.expiryDate && (
                            <p className="text-xs text-muted-foreground font-mono">⏰ Expires: {certification.expiryDate}</p>
                          )}
                          <Badge variant="secondary" className="text-xs font-mono mt-2">
                            {certification.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="font-mono">vim ~/.profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Form Components (keeping the same functionality but updating styling)
function CompanyForm({ company, onClose, onSave }: { company: Company | null; onClose: () => void; onSave: (data: Omit<Company, "id">) => void }) {
  const [form, setForm] = useState<Omit<Company, "id">>({
    name: company?.name || "",
    position: company?.position || "",
    startDate: company?.startDate || "",
    endDate: company?.endDate || "",
    description: company?.description || "",
    technologies: company?.technologies || [],
    achievements: company?.achievements || [],
  });
  const [technologiesInput, setTechnologiesInput] = useState(company?.technologies?.join(", ") || "");

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">company_name</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Microsoft" className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">position</Label>
          <Input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="Senior Cloud Architect" className="font-mono" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">start_date</Label>
          <Input type="month" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">end_date</Label>
          <Input type="month" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="font-mono" />
        </div>
      </div>
      <div>
        <Label className="font-mono">description</Label>
        <Textarea 
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe your role and responsibilities..."
          rows={4}
          className="font-mono"
        />
      </div>
      <div>
        <Label className="font-mono">technologies[]</Label>
        <Input 
          value={technologiesInput}
          onChange={e => setTechnologiesInput(e.target.value)}
          onBlur={e => {
            const techArray = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
            setForm(f => ({ ...f, technologies: techArray }));
          }}
          placeholder="AWS, Python, Kubernetes, TypeScript"
          className="font-mono"
        />
        <div className="text-xs text-muted-foreground mt-1 font-mono">
          💡 Type technologies separated by commas (e.g., "AWS, Python, React")
        </div>
      </div>
      <div>
        <Label className="font-mono">achievements[]</Label>
        <Textarea 
          value={form.achievements.join("\n")}
          onChange={e => setForm(f => ({ ...f, achievements: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) }))}
          placeholder="Led migration of 50+ applications to cloud&#10;Reduced infrastructure costs by 40%"
          rows={4}
          className="font-mono"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
          <Save className="h-4 w-4 mr-2" />
          :wq (save & exit)
        </Button>
        <Button variant="outline" onClick={onClose} className="font-mono">
          :q! (exit)
        </Button>
      </div>
    </div>
  );
}

function ProjectForm({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (data: Omit<Project, "id">) => void }) {
  const [form, setForm] = useState<Omit<Project, "id">>({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    technologies: project?.technologies || [],
    featured: project?.featured || false,
    category: project?.category || "AI",
  });
  const [technologiesInput, setTechnologiesInput] = useState(project?.technologies?.join(", ") || "");

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono">project_title</Label>
        <Input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="AI-Powered Cloud Optimizer"
          className="font-mono"
        />
      </div>
      <div>
        <Label className="font-mono">category</Label>
        <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Project["category"] }))}>
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AI">AI</SelectItem>
            <SelectItem value="Cloud">Cloud</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="font-mono">description</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe your project..."
          rows={4}
          className="font-mono"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">github_url</Label>
          <Input
            value={form.githubUrl}
            onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
            placeholder="https://github.com/..."
            className="font-mono"
          />
        </div>
        <div>
          <Label className="font-mono">live_url</Label>
          <Input
            value={form.liveUrl}
            onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))}
            placeholder="https://..."
            className="font-mono"
          />
        </div>
      </div>
      <div>
        <Label className="font-mono">technologies[]</Label>
        <Input
          value={technologiesInput}
          onChange={e => setTechnologiesInput(e.target.value)}
          onBlur={e => {
            const techArray = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
            setForm(f => ({ ...f, technologies: techArray }));
          }}
          placeholder="React, TypeScript, AWS, Python"
          className="font-mono"
        />
        <div className="text-xs text-muted-foreground mt-1 font-mono">
          💡 Type technologies separated by commas (e.g., "React, TypeScript, AWS")
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="featured" className="font-mono">featured_project</Label>
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
          <Save className="h-4 w-4 mr-2" />
          git commit -m "save"
        </Button>
        <Button variant="outline" onClick={onClose} className="font-mono">
          git reset
        </Button>
      </div>
    </div>
  );
}

function SkillForm({ skill, onClose, onSave }: { skill: Skill | null; onClose: () => void; onSave: (data: Omit<Skill, "id">) => void }) {
  const [form, setForm] = useState<Omit<Skill, "id">>({
    name: skill?.name || "",
    category: skill?.category || "Cloud",
    level: skill?.level || 50,
  });

  const [bulkSkills, setBulkSkills] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  const handleBulkAdd = () => {
    if (!bulkSkills.trim()) return;
    
    const skillNames = bulkSkills.split(',').map(s => s.trim()).filter(Boolean);
    const currentLevel = form.level;
    const currentCategory = form.category;
    
    // Create multiple skills from the comma-separated input
    skillNames.forEach(skillName => {
      const newSkill: Omit<Skill, "id"> = {
        name: skillName,
        category: currentCategory,
        level: currentLevel,
      };
      onSave(newSkill);
    });
    
    setBulkSkills("");
    setShowBulkAdd(false);
  };

  return (
    <div className="space-y-4">
      {showBulkAdd ? (
        // Bulk Add Mode
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-mono text-lg">bulk_add_skills</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBulkAdd(false)}
              className="font-mono"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-muted/20">
            <div className="text-sm text-muted-foreground mb-2 font-mono">
              💡 Enter multiple skills separated by commas. They'll all use the same category and level.
            </div>
            <div>
              <Label className="font-mono">skills[]</Label>
              <Input 
                value={bulkSkills}
                onChange={e => setBulkSkills(e.target.value)}
                placeholder="Python, JavaScript, React, TypeScript, AWS, Docker"
                className="font-mono"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="font-mono">category_for_all</Label>
                <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Skill["category"] }))}>
                  <SelectTrigger className="font-mono">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Databases">Databases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-mono">level_for_all (1-100)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={form.level}
                  onChange={e => setForm(f => ({ ...f, level: parseInt(e.target.value, 10) }))}
                  placeholder="85"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1 font-mono" onClick={handleBulkAdd}>
                <Save className="h-4 w-4 mr-2" />
                bulk_add
              </Button>
              <Button variant="outline" onClick={() => setShowBulkAdd(false)} className="font-mono">
                cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Single Skill Add Mode
        <>
          <div className="flex items-center justify-between">
            <Label className="font-mono text-lg">add_single_skill</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBulkAdd(true)}
              className="font-mono"
            >
              bulk_add
            </Button>
          </div>
          
          <div>
            <Label className="font-mono">skill_name</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Python" className="font-mono" />
          </div>
          <div>
            <Label className="font-mono">category</Label>
            <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Skill["category"] }))}>
              <SelectTrigger className="font-mono">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cloud">Cloud</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Databases">Databases</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono">proficiency_level (1-100)</Label>
            <Input 
              type="number" 
              min="1" 
              max="100" 
              value={form.level}
              onChange={e => setForm(f => ({ ...f, level: parseInt(e.target.value, 10) }))}
              placeholder="85"
              className="font-mono"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
              <Save className="h-4 w-4 mr-2" />
              :w (save)
            </Button>
            <Button variant="outline" onClick={onClose} className="font-mono">
              :q (quit)
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function DomainForm({ domain, onClose, onSave }: { domain: Domain | null; onClose: () => void; onSave: (data: Omit<Domain, "id">) => void }) {
  const [form, setForm] = useState<Omit<Domain, "id">>({
    title: domain?.title || "",
    description: domain?.description || "",
    icon: domain?.icon || "Cloud",
  });

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono">domain_title</Label>
        <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Cloud Infrastructure" className="font-mono" />
      </div>
      <div>
        <Label className="font-mono">description</Label>
        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your expertise in this domain..." rows={4} className="font-mono" />
      </div>
      <div>
        <Label className="font-mono">icon</Label>
        <Select value={form.icon} onValueChange={(val: string) => setForm(f => ({ ...f, icon: val as Domain["icon"] }))}>
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cloud">Cloud</SelectItem>
            <SelectItem value="Cpu">Cpu</SelectItem>
            <SelectItem value="Settings">Settings</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
            <SelectItem value="Code">Code</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
          <Save className="h-4 w-4 mr-2" />
          :w (save)
        </Button>
        <Button variant="outline" onClick={onClose} className="font-mono">
          :q (quit)
        </Button>
      </div>
    </div>
  );
}

function TechnologyForm({ technology, onClose, onSave }: { technology: Technology | null; onClose: () => void; onSave: (data: Omit<Technology, "id">) => void }) {
  const [form, setForm] = useState<Omit<Technology, "id">>({
    name: technology?.name || "",
    category: technology?.category || "Cloud",
    description: technology?.description || "",
    icon: technology?.icon || "",
  });

  const [bulkTechnologies, setBulkTechnologies] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  const handleBulkAdd = () => {
    if (!bulkTechnologies.trim()) return;
    
    const techNames = bulkTechnologies.split(',').map(s => s.trim()).filter(Boolean);
    const currentCategory = form.category;
    const currentDescription = form.description;
    
    // Create multiple technologies from the comma-separated input
    techNames.forEach(techName => {
      const newTechnology: Omit<Technology, "id"> = {
        name: techName,
        category: currentCategory,
        description: currentDescription,
        icon: "",
      };
      onSave(newTechnology);
    });
    
    setBulkTechnologies("");
    setShowBulkAdd(false);
  };

  return (
    <div className="space-y-4">
      {showBulkAdd ? (
        // Bulk Add Mode
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-mono text-lg">bulk_add_technologies</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBulkAdd(false)}
              className="font-mono"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-lg bg-muted/20">
            <div className="text-sm text-muted-foreground mb-2 font-mono">
              💡 Enter multiple technologies separated by commas. They'll all use the same category and description.
            </div>
            <div>
              <Label className="font-mono">technologies[]</Label>
              <Input 
                value={bulkTechnologies}
                onChange={e => setBulkTechnologies(e.target.value)}
                placeholder="React, TypeScript, AWS, Docker, Kubernetes"
                className="font-mono"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="font-mono">category_for_all</Label>
                <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Technology["category"] }))}>
                  <SelectTrigger className="font-mono">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-mono">description_for_all</Label>
                <Input 
                  value={form.description || ""}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description for all technologies"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1 font-mono" onClick={handleBulkAdd}>
                <Save className="h-4 w-4 mr-2" />
                bulk_add
              </Button>
              <Button variant="outline" onClick={() => setShowBulkAdd(false)} className="font-mono">
                cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Single Technology Add Mode
        <>
          <div className="flex items-center justify-between">
            <Label className="font-mono text-lg">add_single_technology</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBulkAdd(true)}
              className="font-mono"
            >
              bulk_add
            </Button>
          </div>
          
          <div>
            <Label className="font-mono">technology_name</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="React" className="font-mono" />
          </div>
          <div>
            <Label className="font-mono">category</Label>
            <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Technology["category"] }))}>
              <SelectTrigger className="font-mono">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cloud">Cloud</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono">description (optional)</Label>
            <Input 
              value={form.description || ""} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
              placeholder="Brief description of the technology"
              className="font-mono" 
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
              <Save className="h-4 w-4 mr-2" />
              npm install
            </Button>
            <Button variant="outline" onClick={onClose} className="font-mono">
              npm uninstall
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function AchievementForm({ achievement, onClose, onSave }: { achievement: Achievement | null; onClose: () => void; onSave: (data: Omit<Achievement, "id">) => void }) {
  const [form, setForm] = useState<Omit<Achievement, "id">>({
    title: achievement?.title || "",
    description: achievement?.description || "",
    date: achievement?.date || "",
    category: achievement?.category || "Professional",
    organization: achievement?.organization || "",
    link: achievement?.link || "",
  });

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono">achievement_title</Label>
        <Input 
          value={form.title} 
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
          placeholder="Best Developer Award" 
          className="font-mono" 
        />
      </div>
      
      <div>
        <Label className="font-mono">category</Label>
        <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Achievement["category"] }))}>
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Academic">Academic</SelectItem>
            <SelectItem value="Award">Award</SelectItem>
            <SelectItem value="Publication">Publication</SelectItem>
            <SelectItem value="Patent">Patent</SelectItem>
            <SelectItem value="Hackathon">Hackathon</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="font-mono">description</Label>
        <Textarea 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          placeholder="Describe the achievement, what you accomplished, and its impact..."
          rows={4} 
          className="font-mono" 
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">organization</Label>
          <Input 
            value={form.organization} 
            onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} 
            placeholder="Microsoft, Google, IEEE, etc." 
            className="font-mono" 
          />
        </div>
        <div>
          <Label className="font-mono">date</Label>
          <Input 
            type="month" 
            value={form.date} 
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
            className="font-mono" 
          />
        </div>
      </div>
      
      <div>
        <Label className="font-mono">link (optional)</Label>
        <Input 
          value={form.link} 
          onChange={e => setForm(f => ({ ...f, link: e.target.value }))} 
          placeholder="https://..." 
          className="font-mono" 
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
          <Save className="h-4 w-4 mr-2" />
          :w (save)
        </Button>
        <Button variant="outline" onClick={onClose} className="font-mono">
          :q (quit)
        </Button>
      </div>
    </div>
  );
}

function CertificationForm({ certification, onClose, onSave }: { certification: Certification | null; onClose: () => void; onSave: (data: Omit<Certification, "id">) => void }) {
  const [form, setForm] = useState<Omit<Certification, "id">>({
    name: certification?.name || "",
    issuer: certification?.issuer || "",
    date: certification?.date || "",
    expiryDate: certification?.expiryDate || "",
    category: certification?.category || "Cloud",
    credentialId: certification?.credentialId || "",
    link: certification?.link || "",
    image: certification?.image || "",
    status: certification?.status || "Active",
  });

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono">certification_name</Label>
        <Input 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          placeholder="AWS Solutions Architect Professional" 
          className="font-mono" 
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">issuing_company</Label>
          <Input 
            value={form.issuer} 
            onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} 
            placeholder="Amazon Web Services" 
            className="font-mono" 
          />
        </div>
        <div>
          <Label className="font-mono">category</Label>
          <Select value={form.category} onValueChange={(val: string) => setForm(f => ({ ...f, category: val as Certification["category"] }))}>
            <SelectTrigger className="font-mono">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cloud">Cloud</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="AI/ML">AI/ML</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="font-mono">what_did_you_learn</Label>
        <Textarea 
          value={form.credentialId} 
          onChange={e => setForm(f => ({ ...f, credentialId: e.target.value }))} 
          placeholder="Describe the key skills and knowledge you gained from this certification..."
          rows={3} 
          className="font-mono" 
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">issue_date</Label>
          <Input 
            type="month" 
            value={form.date} 
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
            className="font-mono" 
          />
        </div>
        <div>
          <Label className="font-mono">expiry_date (optional)</Label>
          <Input 
            type="month" 
            value={form.expiryDate} 
            onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} 
            className="font-mono" 
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">verification_link</Label>
          <Input 
            value={form.link} 
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))} 
            placeholder="https://..." 
            className="font-mono" 
          />
        </div>
        <div>
          <Label className="font-mono">certification_logo_url</Label>
          <Input 
            value={form.image} 
            onChange={e => setForm(f => ({ ...f, image: e.target.value }))} 
            placeholder="https://..." 
            className="font-mono" 
          />
        </div>
      </div>
      
      <div>
        <Label className="font-mono">status</Label>
        <Select value={form.status} onValueChange={(val: string) => setForm(f => ({ ...f, status: val as Certification["status"] }))}>
          <SelectTrigger className="font-mono">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button className="flex-1 font-mono" onClick={() => onSave(form)}>
          <Save className="h-4 w-4 mr-2" />
          npm install certification
        </Button>
        <Button variant="outline" onClick={onClose} className="font-mono">
          npm uninstall
        </Button>
      </div>
    </div>
  );
}

function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const docRef = doc(db, "profile", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as typeof form;
          setForm(data);
        }
      } catch (e) {
        setError("Failed to load profile");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await setDoc(doc(db, "profile", "main"), form);
      setSuccess(true);
    } catch (e) {
      setError("Failed to save profile");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">full_name</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">job_title</Label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="font-mono" />
        </div>
      </div>
      <div>
        <Label className="font-mono">bio</Label>
        <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} className="font-mono" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">email</Label>
          <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">phone</Label>
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="font-mono" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">location</Label>
          <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">avatar_url</Label>
          <Input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="font-mono" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="font-mono">github_url</Label>
          <Input value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} className="font-mono" />
        </div>
        <div>
          <Label className="font-mono">linkedin_url</Label>
          <Input value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} className="font-mono" />
        </div>
      </div>
      <Button className="w-full font-mono" onClick={handleSave} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "source ~/.profile && echo \"Profile updated\""}
      </Button>
      {success && <div className="text-green-600 font-mono">Profile saved!</div>}
      {error && <div className="text-red-600 font-mono">{error}</div>}
    </div>
  );
}