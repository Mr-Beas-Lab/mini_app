import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface Task {
  taskId: string;
  companyName: string;
  taskDescription: string;
  task: string;
  socialMedia: string;
  taskImage: string;
  point: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

type Tasks = {
  [category: string]: Task[];
};

export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [tasks, setTasks] = useState<Tasks>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      // Fetch categories
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);

      const fetchedCategories: Category[] = [];
      categoriesSnapshot.forEach((doc) => {
        fetchedCategories.push({
          id: doc.id,
          name: doc.data().name,
        });
      });

      // Fetch tasks
      const tasksCollection = collection(db, "tasks");
      const tasksSnapshot = await getDocs(tasksCollection);

      const fetchedTasks: Tasks = {};
      tasksSnapshot.forEach((doc) => {
        const data = doc.data();
        const categoryId = data.category;

        const category = fetchedCategories.find((cat) => cat.id === categoryId);
        if (category) {
          const task: Task = {
            taskId: doc.id,
            companyName: data.companyName,
            taskDescription: data.taskDescription,
            task: data.task,
            socialMedia: data.socialMedia,
            taskImage: data.taskImage,
            point: parseInt(data.point),
            category: category.name,
          };

          if (!fetchedTasks[category.name]) {
            fetchedTasks[category.name] = [];
          }
          fetchedTasks[category.name].push(task);
        }
      });

      // Set categories and tasks in state
      setCategories(fetchedCategories);
      setTasks(fetchedTasks);

      // Set the first tab as active by default
      if (fetchedCategories.length > 0) {
        setActiveTab(fetchedCategories[0].name);
      }
    };

    fetchCategoriesAndTasks();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.name)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === category.name
                ? "text-white border-b-2 border-blue"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div>
        {Object.entries(tasks).map(([categoryName, categoryTasks]) =>
          categoryName === activeTab ? (
            <div key={categoryName} className="space-y-4">
              {categoryTasks.map((task) => (
                <div
                  key={task.taskId}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full">
                      <img
                        src={task.taskImage}
                        alt="img"
                        className="w-fit h-fit"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {task.taskDescription}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-400">
                          +{task.point} points
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-t from-blue-medium to-blue-light text-white px-3 py-1 rounded-lg"
                    onClick={() => window.open(task.task, "_blank")}
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
