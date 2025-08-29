import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Settings, Menu, X, Sun, Moon, Code } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface NavigationProps {
  onAdminClick: () => void;
}

export function Navigation({ onAdminClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: "~/home", href: "#home" },
    { label: "~/experience", href: "#experience" },
    { label: "~/projects", href: "#projects" },
    { label: "~/skills", href: "#skills" },
    { label: "~/contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className=" top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Terminal Style */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Code className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Prasad@portfolio:</span>
              <span className="text-primary">~$</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors relative group"
              >
                <span className="group-hover:text-primary">{item.label}</span>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </motion.div>

            {/* Admin Button */}
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onAdminClick}
                className="hidden sm:flex items-center gap-2 font-mono"
              >
                <Settings className="h-4 w-4" />
                sudo admin
              </Button>
            </motion.div> */}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden bg-background border-t border-border"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ delay: index * 0.05 }}
                className="block px-4 py-2 font-mono text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </motion.a>
            ))}
            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ delay: navItems.length * 0.05 }}
              className="px-4 pt-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 justify-center font-mono"
              >
                <Settings className="h-4 w-4" />
                sudo admin
              </Button>
            </motion.div> */}
          </div>
        </motion.div>
      </div>

      {/* Terminal cursor animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        style={{ width: "2px" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.nav>
  );
}