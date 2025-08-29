import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Calendar, ExternalLink, FileText } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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
  description?: string;
}

export function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertifications() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "certifications"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Certification[];
        setCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      }
      setLoading(false);
    }
    fetchCertifications();
  }, []);

  if (loading) return <div></div>;

  const getCategoryColor = (category: string) => {
    const colors = {
      'Cloud': 'bg-blue-500',
      'Security': 'bg-red-500',
      'Programming': 'bg-green-500',
      'AI/ML': 'bg-purple-500',
      'DevOps': 'bg-orange-500',
      'Database': 'bg-indigo-500',
      'Other': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-500',
      'Expired': 'bg-red-500',
      'Pending': 'bg-yellow-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <section className="py-20 bg-muted/20 scroll-mt-20">
      <div className="w-full max-w-screen-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">cat /proc/certifications</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Certifications & Credentials
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; Professional certifications & qualifications
          </p>
        </motion.div>

        {certifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No certifications yet</h3>
            <p className="text-muted-foreground font-mono">
              Add your certifications through the admin dashboard to see them here!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-l-primary bg-card">
                  <CardContent className="pt-4">
                    {cert.image && (
                      <div className="w-full flex justify-center mb-3">
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-24 h-24 object-contain rounded-xl border-2 border-primary/30 shadow-md bg-white/70"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold font-mono text-base text-primary group-hover:text-primary-700 transition-colors flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          {cert.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-mono px-2 py-1 rounded-full border-0 ${getStatusColor(cert.status)} bg-opacity-20 text-${getStatusColor(cert.status).replace('bg-', '')}`}
                        >
                          {cert.status === 'Active' && <span className="mr-1">✅</span>}
                          {cert.status === 'Expired' && <span className="mr-1">⏰</span>}
                          {cert.status === 'Pending' && <span className="mr-1">🕓</span>}
                          {cert.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-mono">🏢 {cert.issuer}</p>
                    {(cert.description || cert.credentialId) && (
                      <div className="mb-2 p-2 rounded bg-muted/40 text-xs text-muted-foreground font-mono border border-border/40">
                        {cert.description || cert.credentialId}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">Issued: {cert.date}</span>
                    </div>
                    {cert.expiryDate && (
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-xs font-mono ${isExpired(cert.expiryDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Expires: {cert.expiryDate} {isExpired(cert.expiryDate) && '(Expired)'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary" className={`text-xs font-mono px-2 py-1 rounded-full ${getCategoryColor(cert.category)} bg-opacity-20 text-${getCategoryColor(cert.category).replace('bg-', '')}`}> 
                        <FileText className="h-3 w-3 mr-1 inline-block" />
                        {cert.category}
                      </Badge>
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                        >
                          Verify <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
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
