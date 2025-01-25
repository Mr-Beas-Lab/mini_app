import { useState, useEffect } from "react";
import { db } from "../firebase";
import { arrayUnion, collection, doc, getDocs, getDoc, increment, updateDoc } from "firebase/firestore";
import { telegramId } from "@/libs/telegram"; // Assuming this is how you get the telegramId

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
  const [user, setUser] = useState<any>(null);  // Store the user data directly from Firestore
  const [isClaiming, setIsClaiming] = useState<{ [key: string]: boolean }>({});  // Track claiming for each task individually

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);

      const fetchedCategories: Category[] = [];
      categoriesSnapshot.forEach((doc) => {
        fetchedCategories.push({
          id: doc.id,
          name: doc.data().name,
        });
      });

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

      setCategories(fetchedCategories);
      setTasks(fetchedTasks);

      if (fetchedCategories.length > 0) {
        setActiveTab(fetchedCategories[0].name);
      }
    };

    fetchCategoriesAndTasks();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", String(telegramId));
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.log("User not found");
      }
    };

    fetchUserData();
  }, []);

  const handleClaimTask = async (task: Task) => {
    if (user && !user.completedTasks?.includes(task.taskId)) {
      setIsClaiming((prev) => ({ ...prev, [task.taskId]: true }));
  
      try {
        // Add a 10-second delay before claiming the task
        setTimeout(async () => {
          try {
            // Get the user document reference
            const userRef = doc(db, "users", String(telegramId));
  
            // Update Firestore with the new completed task and updated balance
            await updateDoc(userRef, {
              completedTasks: arrayUnion(task.taskId), // Add taskId to completed tasks array
              balance: increment(task.point), // Increment balance by task's point value
            });
  
            // Fetch updated user data after successful update
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              setUser(userDoc.data());  // Update user state with the latest data
            }
  
            // Successfully claimed task, reset the claiming state
            setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }));
          } catch (error) {
            console.error("Error claiming task:", error);
            setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }));
          }
        }, 10000); // Wait for 10 seconds (10000 milliseconds)
      } catch (error) {
        console.error("Error starting claim task:", error);
        setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }));
      }
    }
  };
  

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      <div className="flex border-b border-gray-800 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.name)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${activeTab === category.name ? "text-white border-b-2 border-blue" : "text-gray-400 hover:text-gray-300"}`}
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {Object.entries(tasks).map(([categoryName, categoryTasks]) =>
          categoryName === activeTab ? (
            <div key={categoryName} className="space-y-4">
              {categoryTasks.map((task) => {
                const isCompleted = user?.completedTasks?.includes(task.taskId);
                return (
                  <div key={task.taskId} className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-gray-700 rounded-full">
                        <img src={task.taskImage} alt="img" className="w-fit h-fit" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{task.taskDescription}</h3>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm text-gray-400">+{task.point} points</p>
                        </div>
                      </div>
                    </div>
                    {!isCompleted ? (
                      <a
                        className="bg-gradient-to-t from-blue-medium to-blue-light text-white text-sm px-3 py-1 rounded-lg"
                        onClick={() => handleClaimTask(task)}
                        href={task.task} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {isClaiming[task.taskId] ? "..." : "Claim"}
                      </a>
                    ) : (
                      <span className="text-green-500">✔️</span>
                    )}

                  </div>
                );
              })}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
