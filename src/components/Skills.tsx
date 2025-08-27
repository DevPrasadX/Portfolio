import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Database, Code, Cloud, Cpu, Settings } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the Skill and Domain types for TypeScript
type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  // add other fields as needed
};
type Domain = {
  id: string;
  icon: string;
  title: string;
  description: string;
  // add other fields as needed
};

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDomains, setLoadingDomains] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "skills"));
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || "",
          category: d.category || "",
          level: typeof d.level === "number" ? d.level : 0,
          // add other fields as needed
        };
      });
      setSkills(data);
      setLoading(false);
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    async function fetchDomains() {
      setLoadingDomains(true);
      const querySnapshot = await getDocs(collection(db, "domains"));
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          icon: d.icon || "",
          title: d.title || "",
          description: d.description || "",
          // add other fields as needed
        };
      });
      setDomains(data);
      setLoadingDomains(false);
    }
    fetchDomains();
  }, []);

  if (loading) return <div>Loading skills...</div>;

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Cloud': Cloud,
      'AI/ML': Cpu,
      'Programming': Code,
      'DevOps': Settings,
      'Databases': Database
    };
    return icons[category as keyof typeof icons] || Code;
  };

  const getDomainIcon = (iconName: string) => {
    const icons = {
      'Cloud': Cloud,
      'Cpu': Cpu,
      'Settings': Settings,
      'Database': Database,
      'Code': Code
    };
    return icons[iconName as keyof typeof icons] || Code;
  };

  return (
    <section className="py-20 bg-background scroll-mt-20">
      <div className="w-full max-w-screen-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">cat /proc/skills</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Technical Proficiency
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; System specifications &amp; capabilities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const categorySkills = skills.filter(skill => skill.category === category);
            const Icon = getCategoryIcon(category);
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-l-primary bg-card">
                  {/* File header style */}
                  <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <Icon className="h-4 w-4 text-primary ml-2" />
                    <span className="font-mono text-sm text-muted-foreground">
                      {category.toLowerCase().replace('/', '_')}.json
                    </span>
                  </div>

                  <CardHeader className="bg-card relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, delay: categoryIndex * 0.5 }}
                        >
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </motion.div>
                        <CardTitle className="text-xl font-mono">{category}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        {categorySkills.length} modules
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: skillIndex * 0.1 }}
                          className="group/skill"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm group-hover/skill:text-primary transition-colors">
                              {skill.name}
                            </span>
                            <motion.span
                              className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                              whileHover={{ scale: 1.1 }}
                            >
                              {skill.level}%
                            </motion.span>
                          </div>
                          
                          {/* Custom progress bar */}
                          <div className="relative">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary rounded-full relative"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1.5, delay: skillIndex * 0.1, ease: "easeOut" }}
                              >
                                {/* Animated shine effect */}
                                <motion.div
                                  className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{ x: [-20, 100] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: skillIndex * 0.2,
                                    ease: "easeInOut"
                                  }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Skills Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="max-w-4xl mx-auto bg-card border border-border">
            {/* Terminal header */}
            <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="font-mono text-sm text-muted-foreground ml-2">
                skills_summary.sh
              </span>
            </div>
            
            <CardContent className="pt-8">
              <div className="font-mono text-sm space-y-2 mb-6">
                <div className="text-muted-foreground">#!/bin/bash</div>
                <div className="text-muted-foreground"># Skills Matrix Overview</div>
                <div className="text-foreground">echo "Specialized domains:"</div>
              </div>
              
              {loadingDomains ? (
                <div className="text-center py-8">Loading domains...</div>
              ) : domains.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {domains.map((domain, index) => {
                    const Icon = getDomainIcon(domain.icon);
                    return (
                      <motion.div
                        key={domain.id}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-muted/30 rounded-lg border border-border"
                      >
                        <div className="w-16 h-16 mx-auto mb-3 bg-primary rounded-lg flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h4 className="font-mono mb-2">{domain.title}</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {domain.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground font-mono">
                  No domains added yet. Add some in the admin dashboard!
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
            <span className="text-blue-500">~/skills</span>
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">cd ../contact</span>
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