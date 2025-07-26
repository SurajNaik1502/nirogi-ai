
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if there's a stored theme preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = storedTheme === 'dark' || 
      (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(prefersDark);
    
    // Apply theme based on preference
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    
    // Store user preference
    localStorage.setItem('theme', newTheme);
    
    // Apply theme change
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dispatch event so other components can react to theme change
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
