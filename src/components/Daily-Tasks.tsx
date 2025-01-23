import { useState } from "react";
import mrb from "@/assets/mrb.jpg";

const tasks = {
  basic: [
    { id: "1", title: "Open BingX account", link: "https://bingx.com/invite/4TYTLU/", points: 250, claimed: false },
    { id: "2", title: "Open Binance account", link: "https://accounts.binance.com/register?ref=39072941&utm_medium=app_share_link_telegram/", points: 250, claimed: false },
    { id: "3", title: "Open Exness account", link: "https://one.exnesstrack.org/a/tx6wtloca7", points: 250, claimed: false },
  ],
  onchain: [
    { id: "4", title: "Complete First Transaction", link: "https://bingx.com/invite/4TYTLU/", points: 300, claimed: false },
    { id: "5", title: "Bridge Assets", link: "https://bingx.com/invite/4TYTLU/", points: 400, claimed: false },
  ],
  socials: [
    { id: "6", title: "Follow on Twitter", link: "https://bingx.com/invite/4TYTLU/", points: 150, claimed: false },
    { id: "7", title: "Join Discord", link: "https://bingx.com/invite/4TYTLU/", points: 200, claimed: false },
  ],
  academy: [
    { id: "8", title: "Complete Intro Course", link: "https://bingx.com/invite/4TYTLU/", points: 500, claimed: false },
    { id: "9", title: "Pass Basic Quiz", link: "https://bingx.com/invite/4TYTLU/", points: 350, claimed: false },
  ],
};

export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        {Object.keys(tasks).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
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
                      <div className="flex gap-2 items-center">
                        <img src={mrb} alt="Points icon" className="w-5 h-5" />
                        <p className="text-sm text-gray-400">+{task.points} PT</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-t from-blue-medium to-blue-light text-white px-3 py-1 rounded-lg"
                    onClick={() => window.open(task.link, "_blank")}
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
