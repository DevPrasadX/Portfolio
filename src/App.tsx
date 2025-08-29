import { useState, useEffect } from "react";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";
import { motion, AnimatePresence } from "motion/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Achievements } from "./components/Achievements";
import { Certifications } from "./components/Certifications";
import { AdminDashboard } from "./components/AdminDashboard";
import AdminAuth from "./components/AdminAuth";
import { AIChat } from "./components/AIChat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  const [showChat, setShowChat] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Track page view
    logEvent(analytics, "page_view");

    const handleOpenAIChat = () => {
      setShowChat(true);
    };

    window.addEventListener('openAIChat', handleOpenAIChat);
    return () => window.removeEventListener('openAIChat', handleOpenAIChat);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen overflow-x-hidden">
                <Navigation onAdminClick={() => {}} />
                <main>
                  <section id="home">
                    <Hero />
                  </section>
                  <section id="experience">
                    <Experience />
                  </section>
                  <section id="projects">
                    <Projects />
                  </section>
                  <section id="skills">
                    <Skills />
                  </section>
                  <section id="achievements">
                    <Achievements />
                  </section>
                  <section id="certifications">
                    <Certifications />
                  </section>
                  <section id="contact">
                    <Contact />
                  </section>
                </main>
                {/* Footer */}
                <footer className="bg-muted/80 backdrop-blur-sm border-t border-border py-8">
                  <div className="container mx-auto px-6 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="font-mono"
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-primary">Prasad@portfolio</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="text-blue-500">~</span>
                        <span className="text-muted-foreground">$</span>
                        <span className="text-foreground">echo "© 2025 Prasad pansare"</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Built with React, TypeScript, Tailwind CSS & lots of ☕
                      </p>
                    </motion.div>
                  </div>
                </footer>
                {/* AI Chat Interface */}
                <AIChat 
                  isOpen={showChat} 
                  onToggle={() => setShowChat(!showChat)} 
                />
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              !isAdminAuthenticated ? (
                <AdminAuth onAuthSuccess={() => setIsAdminAuthenticated(true)} />
              ) : (
                <AdminDashboard onClose={() => setIsAdminAuthenticated(false)} />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}