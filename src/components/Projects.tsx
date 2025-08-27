import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Github, ExternalLink, Folder, FileCode, Star, GitCommit } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the Project type for TypeScript
type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  // add other fields as needed
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "",
          description: d.description || "",
          category: d.category || "",
          technologies: Array.isArray(d.technologies) ? d.technologies : [],
          featured: !!d.featured,
          githubUrl: d.githubUrl || "",
          liveUrl: d.liveUrl || "",
          // add other fields as needed
        };
      });
      setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section className="py-20 bg-muted/30 scroll-mt-20">
      <div className="w-full max-w-screen-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileCode className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">git log --oneline</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Featured Repositories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; Production-ready solutions &amp; experiments
          </p>
        </motion.div>

        {/* Featured Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 bg-card">
                {/* File header style */}
                <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <Folder className="h-4 w-4 text-primary ml-2" />
                  <span className="font-mono text-sm text-muted-foreground">
                    {project.title.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                </div>

                <CardHeader className="bg-card relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-mono">
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors font-mono">
                        {project.title}
                      </CardTitle>
                      <Badge variant="outline" className="border-primary/30 text-primary font-mono">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {/* Code-style description */}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 font-mono text-sm">
                    <div className="text-muted-foreground mb-2">// Project Description</div>
                    <div className="text-foreground leading-relaxed">
                      {project.description}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-3 font-mono flex items-center gap-2">
                      <GitCommit className="h-4 w-4" />
                      Dependencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="font-mono hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-mono hover:bg-muted"
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          git clone
                        </Button>
                      </motion.div>
                    )}
                    {project.liveUrl && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          className="font-mono"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          ./deploy
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 font-mono text-sm mb-4">
                <span className="text-primary">Prasad@portfolio</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-blue-500">~/projects</span>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">ls --more</span>
              </div>
              <h3 className="text-2xl mb-2 font-mono">Additional Repositories</h3>
              <p className="text-muted-foreground font-mono">
                Other notable projects and experiments
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card">
                    {/* Mini file header */}
                    <div className="bg-muted/30 border-b border-border px-3 py-1 flex items-center gap-2">
                      <Folder className="h-3 w-3 text-primary" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.title.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-mono">{project.title}</CardTitle>
                        <Badge variant="outline" className="font-mono text-xs">{project.category}</Badge>
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="font-mono text-xs"
                            onClick={() => window.open(project.githubUrl, '_blank')}
                          >
                            <Github className="mr-1 h-3 w-3" />
                            clone
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button 
                            size="sm" 
                            className="font-mono text-xs"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            demo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Terminal prompt at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 font-mono text-sm">
            <span className="text-primary">Prasad@portfolio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/projects</span>
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">cd ../skills</span>
            <motion.span
              className="w-2 h-4 bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}