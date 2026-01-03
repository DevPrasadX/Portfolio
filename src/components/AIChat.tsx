import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import resumeData from "../data/resume-data";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface PortfolioData {
  companies: any[];
  projects: any[];
  skills: any[];
  domains: any[];
  profile: any;
  certifications: any[];
  achievements: any[];
}

interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Backend API configuration - uses Vite proxy in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function AIChat({ isOpen, onToggle }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! 👋 I'm your AI companion powered by Hugging Face. Don't like reading the whole site? No worries! Just ask me anything about your experience, projects, skills, or specialized domains and I'll provide intelligent, contextual responses based on your latest portfolio data.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch portfolio data from Firestore
  useEffect(() => {
    async function fetchPortfolioData() {
      setIsLoadingData(true);
      try {
        const [companiesSnap, projectsSnap, skillsSnap, domainsSnap, profileSnap, certificationsSnap, achievementsSnap] = await Promise.all([
          getDocs(collection(db, "companies")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "domains")),
          getDocs(collection(db, "profile")),
          getDocs(collection(db, "certifications")),
          getDocs(collection(db, "achievements"))
        ]);

        const companies = companiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const skills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const domains = domainsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const profile = profileSnap.docs.length > 0 ? { id: profileSnap.docs[0].id, ...profileSnap.docs[0].data() } : null;
        const certifications = certificationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const achievements = achievementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setPortfolioData({ companies, projects, skills, domains, profile, certifications, achievements });
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (isOpen) {
      fetchPortfolioData();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response using backend API
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!portfolioData) {
      return "I'm still loading Prasad's portfolio data. Please try asking your question again in a moment, or check out the different sections on his portfolio directly!";
    }

    try {
      // Get user's name from profile data or resumeData
      const userName = portfolioData.profile?.name || resumeData.personal_information?.name || 'the user';

      // Merge Firestore and resumeData for context
      const context = `
        You are ${userName}'s AI assistant for their portfolio website. Here is ${userName}'s current portfolio data (from both Firestore and resume):

        PROFILE:
        Firestore: ${portfolioData.profile ? JSON.stringify(portfolioData.profile, null, 2) : 'No profile data available'}
        Resume: ${resumeData.personal_information ? JSON.stringify(resumeData.personal_information, null, 2) : 'No resume personal info'}

        SUMMARY:
        ${resumeData.summary ? resumeData.summary.join('\n') : 'No summary'}

        EDUCATION:
        ${resumeData.education ? resumeData.education.map(e => `- ${e.institution}: ${e.degree} (${e.period}${e.cgpa ? ', CGPA: ' + e.cgpa : ''})`).join('\n') : 'No education info'}

        TECHNICAL SKILLS:
        ${resumeData.technical_skills ? Object.entries(resumeData.technical_skills).map(([cat, arr]) => `${cat}: ${Array.isArray(arr) ? arr.join(', ') : ''}`).join('\n') : 'No skills'}

        WORK EXPERIENCE (${portfolioData.companies?.length || 0} companies):
        Firestore: ${portfolioData.companies?.map(company => `- ${company.name}: ${company.position} (${company.startDate} - ${company.endDate || 'Present'}) Technologies: ${company.technologies?.join(', ')} Description: ${company.description}`).join('\n') || 'No experience data available'}
        Resume: ${resumeData.experience ? resumeData.experience.map(exp => `- ${exp.company}: ${exp.role} (${exp.period}) Achievements: ${exp.achievements?.join('; ')}`).join('\n') : 'No resume experience'}

        PROJECTS (${portfolioData.projects?.length || 0} projects):
        Firestore: ${portfolioData.projects?.map(project => `- ${project.title} (${project.category}${project.featured ? '- Featured' : ''}) Technologies: ${project.technologies?.join(', ')} Description: ${project.description} ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''} ${project.liveUrl ? `Live Demo: ${project.liveUrl}` : ''}`).join('\n') || 'No project data available'}
        Resume: ${resumeData.projects ? resumeData.projects.map(p => `- ${p.title}: ${p.description} Tech Stack: ${p.tech_stack?.join(', ')} ${p.recognition ? `Recognition: ${p.recognition}` : ''}`).join('\n') : 'No resume projects'}

        SKILLS (${portfolioData.skills?.length || 0} skills):
        Firestore: ${portfolioData.skills?.map(skill => `- ${skill.name} (${skill.category}): ${skill.level}%`).join('\n') || 'No skills data available'}

        SPECIALIZED DOMAINS (${portfolioData.domains?.length || 0} domains):
        Firestore: ${portfolioData.domains?.map(domain => `- ${domain.title}: ${domain.description}`).join('\n') || 'No domain data available'}

        CERTIFICATIONS (${portfolioData.certifications?.length || 0} certifications):
        Firestore: ${portfolioData.certifications?.map(cert => `- ${cert.name} (${cert.issuer}, ${cert.date}) Category: ${cert.category} Status: ${cert.status} ${cert.credentialId ? `Credential: ${cert.credentialId}` : ''} ${cert.link ? `Link: ${cert.link}` : ''}`).join('\n') || 'No certification data available'}
        Resume: ${resumeData.certifications ? resumeData.certifications.map(c => `- ${c}`).join('\n') : 'No resume certifications'}

        ACHIEVEMENTS (${portfolioData.achievements?.length || 0} achievements):
        Firestore: ${portfolioData.achievements?.map(ach => `- ${ach.title} (${ach.category}, ${ach.date}) ${ach.description ? `Description: ${ach.description}` : ''} ${ach.organization ? `Organization: ${ach.organization}` : ''} ${ach.link ? `Link: ${ach.link}` : ''}`).join('\n') || 'No achievement data available'}
        Resume: ${resumeData.achievements ? resumeData.achievements.map(a => `- ${a}`).join('\n') : 'No resume achievements'}

        PATENTS & PUBLICATIONS:
        ${resumeData.patents_and_publications ? resumeData.patents_and_publications.map(p => `- ${p.title} (${p.type}, ${p.date}${p.journal ? ', ' + p.journal : ''})`).join('\n') : 'No patents/publications'}

        LEADERSHIP & INVOLVEMENT:
        ${resumeData.leadership_and_involvement ? resumeData.leadership_and_involvement.map(l => `- ${l.organization}: ${l.role} (${l.period}) Achievements: ${l.achievements?.join('; ')}`).join('\n') : 'No leadership/involvement'}

        Instructions:
        - Respond in a friendly, conversational tone
        - Use emojis occasionally to keep it engaging
        - Provide specific details from the portfolio and resume data when appropriate
        - Keep responses concise but informative (2-4 sentences)
        - If the user asks about something not in the data, politely direct them to explore the portfolio sections
        - Always be helpful and enthusiastic about ${userName}'s work
        - Use ${userName}'s actual name when referring to them
      `;

      // Format the prompt for the model
      // Using a simple instruction format that works with most models
      const prompt = `You are ${userName}'s AI assistant for their portfolio website. Based on the following portfolio information, answer the user's question in a friendly and helpful manner.

${context}

User Question: ${userMessage}

Assistant Response:`;

      // Call backend API instead of Hugging Face directly
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/chat` : '/api/chat';
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.response) {
        return data.response;
      }
      
      throw new Error("Invalid response format from backend API");

        } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Fallback to basic response if API fails
      const lowerMessage = userMessage.toLowerCase();
      const userName = portfolioData?.profile?.name || 'the user';
      
      if (lowerMessage.includes("experience") || lowerMessage.includes("work")) {
        return portfolioData.companies?.length > 0 
          ? `${userName} has ${portfolioData.companies.length} work experiences. The latest is ${portfolioData.companies[0].position} at ${portfolioData.companies[0].name}. Check out the Experience section for more details!`
          : `I don't have ${userName}'s work experience data loaded. Please check the Experience section on the portfolio!`;
      }
      
      if (lowerMessage.includes("project")) {
        return portfolioData.projects?.length > 0 
          ? `${userName} has ${portfolioData.projects.length} projects, including ${portfolioData.projects.slice(0, 2).map(p => p.title).join(" and ")}. Check out the Projects section!`
          : `I don't have ${userName}'s project data loaded. Please check the Projects section on the portfolio!`;
      }
      
      if (lowerMessage.includes("skill")) {
        return portfolioData.skills?.length > 0 
          ? `${userName} has ${portfolioData.skills.length} skills across different categories. Check out the Skills section for details!`
          : `I don't have ${userName}'s skills data loaded. Please check the Skills section on the portfolio!`;
      }
      
      return `I'm having trouble connecting to the AI service right now. Please check out ${userName}'s portfolio sections directly, or try asking again later!`;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponseText = await generateAIResponse(input);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, but I'm having trouble generating a response right now. Please try again or check out Prasad's portfolio sections directly!",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={onToggle}
              size="lg"
              className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-mono"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-muted/50 border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="font-mono">
                  <div className="text-sm font-medium">Your AI Companion</div>
                  <div className="text-xs text-muted-foreground">
                    {isLoadingData ? "Loading data..." : "Hugging Face Active"}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 h-[380px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${message.isUser ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-3 rounded-lg font-mono text-sm ${
                          message.isUser
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className={`flex-shrink-0 ${message.isUser ? "order-1 mr-2" : "order-2 ml-2"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        message.isUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                      }`}>
                        {message.isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Prasad's experience..."
                  className="flex-1 font-mono text-sm"
                  disabled={isLoadingData}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping || isLoadingData}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}