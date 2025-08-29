import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, Terminal, Play, FileText, MessageCircle, Bot } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { personalInfo } from "../data/portfolio-data";
import { RESUME_PDF_URL } from "../data/resume-pdf-url";

// Define the Profile type for TypeScript
type Profile = {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  // add any other fields you use from profile
};

export function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const docRef = doc(db, "profile", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        setProfile({
          name: d.name || "",
          title: d.title || "",
          avatar: d.avatar || "",
          bio: d.bio || "",
          // add other fields as needed
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const codeLines = profile ? [
    "const developer = {",
    `  name: '${profile.name}',`,
    `  title: '${profile.title}',`,
    `  skills: ['AWS', 'Python', 'AI/ML'],`, // You can make this dynamic if you want
    `  passion: 'Building scalable solutions',`, // You can make this dynamic if you want
    `  status: 'available_for_hire',`,
    "};"
  ] : [];

  if (loading || !profile) return <div></div>;

  return (
    <section className=" min-h-screen flex items-center justify-center relative overflow-hidden bg-background scroll-mt-20 pt-24">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <div className="container w-full max-w-screen-lg mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Terminal/Code */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            {/* Terminal Window */}
            <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-muted-foreground">Prasad@portfolio: ~/developer</span>
                </div>
              </div>
              
              {/* Terminal Content */}
              <div className="bg-card p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-primary">Prasad@portfolio</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-600 dark:text-blue-400">~/developer</span>
                  <span className="text-muted-foreground">$</span>
                  <motion.span
                    className="text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    cat about_me.js
                  </motion.span>
                </div>
                
                <div className="space-y-1">
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (index * 0.1) }}
                      className="text-foreground"
                    >
                      {line.includes('const') && <span className="text-purple-600 dark:text-purple-400">const </span>}
                      {line.includes('developer') && <span className="text-blue-600 dark:text-blue-400">developer </span>}
                      {line.includes('=') && <span className="text-red-600 dark:text-red-400">= </span>}
                      {line.includes('{') && <span className="text-yellow-600 dark:text-yellow-400">{'{'}</span>}
                      {line.includes("'") && (
                        <span className="text-green-600 dark:text-green-400">
                          {line.replace(/'/g, "'")}
                        </span>
                      )}
                      {!line.includes("'") && !line.includes('const') && !line.includes('developer') && !line.includes('=') && !line.includes('{') && (
                        <span>{line}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  className="flex items-center gap-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <span className="text-primary">Prasad@portfolio</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-600 dark:text-blue-400">~/developer</span>
                  <span className="text-muted-foreground">$</span>
                  <motion.span
                    className="w-2 h-5 bg-primary"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Profile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              className="w-32 h-32 mx-auto lg:mx-0 mb-6 rounded-full overflow-hidden border-4 border-primary shadow-xl"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 font-mono">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  ●
                </motion.span>
                Status: Available for hire
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h1 className="text-4xl lg:text-5xl mb-4 font-bold">
                <span className="text-foreground">{profile.name}</span>
              </h1>
              <h2 className="text-xl lg:text-2xl text-muted-foreground mb-6 font-mono">
                {profile.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="font-mono"
                  onClick={() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  ./contact_me
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mono"
                  onClick={() => {
                    window.open("https://github.com/DevPrasadX", "_blank");
                  }}
                >
                  <Github className="mr-2 h-5 w-5" />
                  git clone
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mono"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = RESUME_PDF_URL;
                    link.download = "Prasad_Resume_new.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  cat resume.pdf
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8 p-4 bg-card border border-border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">2+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">20+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">3</div>
                <div className="text-sm text-muted-foreground">Cloud Certs</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* AI Chat Introduction */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="bg-hero-gradient p-8 rounded-xl border border-border/50 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-mono font-medium">AI Assistant Available</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Don't like reading the whole site? Got ya. Just type in something for me and my AI companion will generate the information for you.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-mono bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                onClick={() => {
                  // This will be handled by the parent component
                  window.dispatchEvent(new CustomEvent('openAIChat'));
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                ./start_chat
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}