import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Define types for Task and Tasks
interface Task {
  taskId: string;
  companyName: string;
  taskDescription: string;
  task: string;
  socialMedia: string;
  taskImage: string; 
  point: number;
  category: Category;
}

interface Category {
  name: string;
  description: string;
}

type Tasks = {
  [category: string]: Task[];
};

// The TaskTabs component
export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [tasks, setTasks] = useState<Tasks>({}); // Use the Tasks type here

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);

      let fetchedTasks: Tasks = {
        basic: [],
        onchain: [],
        socials: [],
        academy: [],
      };

      taskSnapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category?.toLowerCase();

        // Ensure category exists and push task into corresponding category
        if (category && fetchedTasks[category]) {
          const task: Task = {
            taskId: doc.id, // Use Firestore document ID as taskId
            companyName: data.companyName,
            taskDescription: data.taskDescription,
            task: data.task,
            socialMedia: data.socialMedia,
            taskImage: data.taskImage,
            point: data.point,
            category: { name: category, description: data.description },
          };

          fetchedTasks[category].push(task);
        }
      });

      setTasks(fetchedTasks); // Update state with fetched tasks
    };

    fetchTasks();
  }, []);

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
                  key={task.taskId}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                    <img src={task.taskImage} alt="img" />
                    <div>
                      <h3 className="text-white font-medium">{task.task}</h3>
                      <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-400">+{task.point} points</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-t from-blue-medium to-blue-light text-white px-3 py-1 rounded-lg"
                    onClick={() => window.open(task.taskImage, "_blank")}
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
