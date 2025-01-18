import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "./stonfi/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./stonfi/ui/select";
import { Switch } from "./stonfi/ui/switch";
import { Label } from "./stonfi/ui/label";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemSettings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`);
    i18n.changeLanguage(lang);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: isOpen ? 0 : "-100%" }} // Animate the popup to slide down from the top
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-4  bg-background border-t border-border p-4 shadow-lg rounded-xl w-[300px] backdrop-blur-lg bg-opacity-60 z-50"
    >
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="language" className="text-white">Language</Label>
            <Select onValueChange={changeLanguage} defaultValue={i18n.language} >
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
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-white">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
          <div>
            <a href="/privacy-policy" className="text-primary hover:underline text-white">
              Privacy Policy
            </a>
          </div>
        </div>
        <Button onClick={onClose} className="mt-4 w-full bg-blue ">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default SystemSettings;
