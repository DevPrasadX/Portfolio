import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Award, Terminal, Folder, GitBranch } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the Company type for TypeScript
type Company = {
  id: string;
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
  technologies: string[];
};

export function Experience() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "companies"));
      
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || "",
          position: d.position || "",
          startDate: d.startDate || "",
          endDate: d.endDate || "",
          description: d.description || "",
          achievements: Array.isArray(d.achievements) ? d.achievements : [],
          technologies: Array.isArray(d.technologies) ? d.technologies : [],
        };
      });
      setCompanies(data);
      setLoading(false);
    }
    fetchCompanies();
  }, []);

  if (loading) return <div></div>;

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
            <Terminal className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">cd experience/</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Professional Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; Building enterprise solutions at scale
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="mb-8 relative"
            >
             
              
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary bg-card">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Company Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <Folder className="h-8 w-8 text-primary-foreground" />
                      </motion.div>
                      
                      <div>
                        <CardTitle className="text-2xl mb-2 font-mono">
                          {company.name}
                        </CardTitle>
                        <h3 className="text-lg text-muted-foreground mb-2 font-mono">
                          {company.position}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {company.startDate} → {company.endDate || "Present"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Branch indicator */}
                    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                      <GitBranch className="h-4 w-4" />
                      main
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Code block style description */}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 font-mono text-sm">
                    <div className="text-muted-foreground mb-2">// Role Description</div>
                    <div className="text-foreground">{company.description}</div>
                  </div>

                  <div className="mb-6">
                    <h4 className="flex items-center gap-2 mb-3 font-mono">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Key Achievements
                    </h4>
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                      <ul className="space-y-2">
                        {company.achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 font-mono text-sm"
                          >
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="leading-relaxed">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-mono">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.technologies.map((tech, i) => (
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Terminal prompt at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 font-mono text-sm">
            <span className="text-primary">alex@portfolio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/experience</span>
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">ls -la projects/</span>
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