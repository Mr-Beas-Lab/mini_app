 import  { useState } from "react";

const tasks = {
  new: [
    { id: "1", title: "Telegram Trends #3", points: 250, claimed: false },
    { id: "2", title: "MRB at Binance Blockchain", points: 250, claimed: false },
    { id: "3", title: "Telegram Trends #2", points: 250, claimed: false },
  ],
  onchain: [
    { id: "4", title: "Complete First Transaction", points: 300, claimed: false },
    { id: "5", title: "Bridge Assets", points: 400, claimed: false },
  ],
  socials: [
    { id: "6", title: "Follow on Twitter", points: 150, claimed: false },
    { id: "7", title: "Join Discord", points: 200, claimed: false },
  ],
  academy: [
    { id: "8", title: "Complete Intro Course", points: 500, claimed: false },
    { id: "9", title: "Pass Basic Quiz", points: 350, claimed: false },
  ],
};

export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        {Object.keys(tasks).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors 
              ${activeTab === tab 
                ? "text-white border-b-2 border-blue" 
                : "text-gray-400 hover:text-gray-300"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div>
        {Object.entries(tasks).map(([category, categoryTasks]) =>
          category === activeTab ? (
            <div key={category} className="space-y-4">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-400">+{task.points} PT</p>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-t from-blue-medium to-blue-light text-white px-3 py-1 rounded-lg "
                    onClick={() => console.log(`Claiming task: ${task.title}`)}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
