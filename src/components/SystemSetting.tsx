import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "./stonfi/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./stonfi/ui/select";
import { Label } from "./stonfi/ui/label";
// import { Moon, Sun } from "lucide-react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemSettings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    const isDark =
      savedTheme === "dark" ||
      (savedTheme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "theme") {
        const newTheme = event.newValue === "dark";
        setIsDarkMode(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`);
    i18n.changeLanguage(lang);
  };

  // const toggleTheme = () => {
  //   const newTheme = !isDarkMode ? "dark" : "light";
  //   setIsDarkMode(!isDarkMode);
  //   document.documentElement.classList.toggle("dark", !isDarkMode);
  //   localStorage.setItem("theme", newTheme);
  // };

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-4 p-4 shadow-lg rounded-xl w-[300px] backdrop-blur-lg z-50 transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <div
              className={`relative inline-flex items-center h-8 w-16 rounded-full cursor-pointer transition-all duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-300"
              }`}
              onClick={toggleTheme}
            >
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  isDarkMode ? "translate-x-8 bg-black" : "translate-x-0 bg-white"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-white" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-500" />
                )}
              </span>
            </div>
          </div> */}
          <div>
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
        <Button onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default SystemSettings;

