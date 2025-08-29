import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Calendar, Award } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Professional' | 'Academic' | 'Award' | 'Publication' | 'Patent' | 'Other';
  organization?: string;
  link?: string;
}

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "achievements"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Achievement[];
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
      setLoading(false);
    }
    fetchAchievements();
  }, []);

  if (loading) return <div></div>;

  const getCategoryColor = (category: string) => {
    const colors = {
      'Professional': 'bg-blue-500',
      'Academic': 'bg-green-500', 
      'Award': 'bg-yellow-500',
      'Publication': 'bg-purple-500',
      'Patent': 'bg-red-500',
      'Other': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Award':
        return <Trophy className="h-4 w-4" />;
      case 'Academic':
        return <Award className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">cat /proc/achievements</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Achievements & Recognition
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; Milestones & accomplishments
          </p>
        </motion.div>

        {achievements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
            <p className="text-muted-foreground font-mono">
              Add your achievements through the admin dashboard to see them here!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-l-primary bg-card">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium font-mono text-sm">{achievement.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 font-mono">
                      {achievement.description}
                    </p>
                    {achievement.organization && (
                      <p className="text-xs text-muted-foreground font-mono mb-2">🏢 {achievement.organization}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">{achievement.date}</span>
                    </div>
                    {achievement.link && (
                      <div className="mt-2">
                        <a 
                          href={achievement.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-mono"
                        >
                          View Details →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
