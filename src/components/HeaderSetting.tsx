import { useState } from "react";
import { Info, Settings } from "lucide-react";
import SystemSettings from "./SystemSetting";
 
const HeaderSetting = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);  
  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);  
  };

  return (
    <section className="flex items-center justify-between space-x-4 p-5">
      <button
        className="text-gray-400 transition-colors duration-200"
        aria-label="Information"
      >
        <Info className="w-6 h-6" />
      </button>
      <button
        className="text-gray-400 transition-colors duration-200"
        aria-label="Settings"
        onClick={toggleSettingsModal} // Open settings modal on click
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Show SystemSettings modal when isSettingsOpen is true */}
      <SystemSettings isOpen={isSettingsOpen} onClose={toggleSettingsModal} />
    </section>
  );
};

export default HeaderSetting;
