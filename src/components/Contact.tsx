import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Terminal, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export function Contact() {
  // All hooks at top level
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    location: ""

  });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchContactInfo() {
      setLoading(true);
      const docRef = doc(db, "profile", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        setContactInfo({
          email: d.email || "",
          phone: d.phone || "",
          github: d.github || "",
          linkedin: d.linkedin || "",
          location: d.location || ""  
        });
      }
      setLoading(false);
    }
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        timestamp: new Date().toISOString(),
      });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSuccess(false);
      // Optionally handle error
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="py-20 text-center"></div>;
  }

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="font-mono text-primary">curl -X POST /contact</span>
          </div>
          <h2 className="text-4xl mb-4 font-bold">
            Initialize Connection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; Ready to collaborate on your next project
          </p>
        </motion.div>

  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
          <Card className="bg-card hover:shadow-xl transition-all duration-300 w-full m-2">
              {/* Terminal header */}
              <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <MessageSquare className="h-4 w-4 text-primary ml-2" />
                <span className="font-mono text-sm text-muted-foreground">
                  contact_info.json
                </span>
              </div>

              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-mono">
                  <motion.div
                    className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  Connect.init()
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">email:</p>
                    <p className="font-mono">{contactInfo.email}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">phone:</p>
                    <p className="font-mono">{contactInfo.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">location:</p>
                                        <p className="font-mono">{contactInfo.location}</p>

                    {/* You can fetch location from Firebase if needed */}
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-card hover:shadow-xl transition-all duration-300 w-full">
              {/* Terminal header */}
              <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="font-mono text-sm text-muted-foreground ml-2">
                  social_links.sh
                </span>
              </div>
              
              <CardHeader>
                <CardTitle className="font-mono">Social Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <motion.a
                    href={contactInfo.github}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-border"
                  >
                    <Github className="h-5 w-5 text-primary" />
                    <span className="font-mono">{contactInfo.github.replace('https://github.com/', '')}</span>
                  </motion.a>
                  <motion.a
                    href={contactInfo.linkedin}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-border"
                  >
                    <Linkedin className="h-5 w-5 text-primary" />
                    <span className="font-mono">{contactInfo.linkedin.replace('https://linkedin.com/in/', '')}</span>
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-card hover:shadow-xl transition-all duration-300 w-full">
              {/* Terminal header */}
              <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <Send className="h-4 w-4 text-primary ml-2" />
                <span className="font-mono text-sm text-muted-foreground">
                  message_composer.tsx
                </span>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-mono">
                  <motion.div
                    className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Send className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  sendMessage()
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm mb-2 font-mono">const name =</label>
                      <Input 
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="'Your Name'" 
                        className="bg-muted/30 border-border focus:bg-background transition-all font-mono"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm mb-2 font-mono">const email =</label>
                      <Input 
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="'your@email.com'" 
                        className="bg-muted/30 border-border focus:bg-background transition-all font-mono"
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm mb-2 font-mono">const subject =</label>
                    <Input 
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="'Project Collaboration'" 
                      className="bg-muted/30 border-border focus:bg-background transition-all font-mono"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm mb-2 font-mono">const message =</label>
                    <Textarea 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="/* &#10;Let's discuss your next project...&#10;Technologies: AWS, Python, AI/ML&#10;Timeline: Q1 2025&#10;*/"
                      rows={6}
                      className="bg-muted/30 border-border focus:bg-background transition-all resize-none font-mono"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full text-white font-mono"
                      size="lg"
                      disabled={submitting}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {submitting ? "Sending..." : "message.send()"}
                    </Button>
                    {success && (
                      <div className="text-green-600 font-mono mt-2">Message sent successfully!</div>
                    )}
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
            <span className="text-blue-500">~/contact</span>
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">await response...</span>
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