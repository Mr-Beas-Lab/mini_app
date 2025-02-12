import { useState, useEffect } from "react"
import { db } from "../firebase"
import {
   collection,
  doc,
  getDocs,
  getDoc,
   query,
  orderBy,
 } from "firebase/firestore"
import { telegramId } from "@/libs/telegram"
import { Loader2 } from "lucide-react"

interface Task {
  taskId: string
  companyName: string
  taskDescription: string
  task: string
  socialMedia: string
  taskImage: string
  point: number
  category: string
}

interface Category {
  id: string
  name: string
}

type Tasks = {
  [category: string]: Task[]
}

export default function TaskTabs() {
  const [activeTab, setActiveTab] = useState<string>("")
  const [tasks, setTasks] = useState<Tasks>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<any>(null)
  const [taskStatus, setTaskStatus] = useState<{ [key: string]: "start" | "claim" | "completed" }>({})
  const [loadingTasks, setLoadingTasks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      try {
        // Fetch categories
        const categoriesCollection = collection(db, "categories")
        const categoriesQuery = query(categoriesCollection, orderBy("createdAt", "asc"))
        const categoriesSnapshot = await getDocs(categoriesQuery)

        let fetchedCategories: Category[] = []
        categoriesSnapshot.forEach((doc) => {
          fetchedCategories.push({ id: doc.id, name: doc.data().name })
        })

        // Fetch tasks
        const tasksCollection = collection(db, "tasks")
        const tasksQuery = query(tasksCollection, orderBy("createdAt", "desc"))
        const tasksSnapshot = await getDocs(tasksQuery)

        const fetchedTasks: Tasks = {}
        tasksSnapshot.forEach((doc) => {
          const data = doc.data()
          const category = fetchedCategories.find((cat) => cat.id === data.category)

          if (category) {
            const task: Task = {
              taskId: doc.id,
              companyName: data.companyName,
              taskDescription: data.taskDescription,
              task: data.task,
              socialMedia: data.socialMedia,
              taskImage: data.taskImage || "/placeholder.svg",
              point: data.point,
              category: category.name,
            }

            if (!fetchedTasks[category.name]) {
              fetchedTasks[category.name] = []
            }
            fetchedTasks[category.name].push(task)
          }
        })

        setCategories(fetchedCategories)
        setTasks(fetchedTasks)

        if (fetchedCategories.length > 0) {
          setActiveTab(fetchedCategories[0].name)
        }
      } catch (error) {
        console.error("Error fetching categories and tasks:", error)
      }
    }

    fetchCategoriesAndTasks()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!telegramId) return

      try {
        const userRef = doc(db, "users", String(telegramId))
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUser(userData)

          // Initialize task status based on user completed tasks
          const updatedTaskStatus: { [key: string]: "start" | "claim" | "completed" } = {}
          Object.values(tasks).flat().forEach((task) => {
            updatedTaskStatus[task.taskId] = userData.completedTasks?.includes(task.taskId) ? "completed" : "start"
          })
          setTaskStatus(updatedTaskStatus)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [tasks])

  const handleStartTask = (task: Task) => {
    setLoadingTasks((prev) => ({ ...prev, [task.taskId]: true }));
    window.open(task.task, "_blank");

    setTimeout(() => {
      setTaskStatus((prev) => ({ ...prev, [task.taskId]: "claim" }));
      setLoadingTasks((prev) => ({ ...prev, [task.taskId]: false }));
    }, 10000);
  };

  const handleClaimTask = async (task) => {
    if (!user || user.completedTasks?.includes(task.taskId)) return;
    setLoadingTasks((prev) => ({ ...prev, [task.taskId]: true }));
  
    // Prepare the request payload
    const payload = {
      telegram_id: String(telegramId),
      task_id: task.taskId,
    };
  
    try {
      // Send POST request to the FastAPI backend
      const response = await fetch("http://your-backend-url/claim-task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Error claiming task: " + (await response.text()));
      }
  
      // Update the local user state with the new completed tasks and balance
      const data = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        completedTasks: [...(prevUser.completedTasks || []), task.taskId],
        balance: (prevUser.balance || 0) + task.point,
      }));
  
      setTaskStatus((prev) => ({ ...prev, [task.taskId]: "completed" }));
    } catch (error) {
      console.error("Error claiming task:", error);
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [task.taskId]: false }));
    }
  };



  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      <div className="relative">
      <div className="flex border-b border-gray-800 mb-4 overflow-x-auto scrollbar-hidden relative no-scrollbar">
        {categories.map((category) => {
          // Check if the category has unclaimed tasks
          const hasUnclaimedTasks = tasks[category.name]?.some(
            (task) => taskStatus[task.taskId] !== "completed"
          );

          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.name)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === category.name ? "text-white border-b-2 border-blue" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {category.name}
              <span className={`w-2 h-2 rounded-full ${hasUnclaimedTasks ? "bg-blue" : "bg-gray-500"}`}></span>
            </button>
          );
        })}
      </div>

      </div>

      <div>
        {Object.entries(tasks).map(([categoryName, categoryTasks]) =>
          categoryName === activeTab ? (
            <div key={categoryName} className="space-y-4">
              {categoryTasks.map((task) => {
                const status = taskStatus[task.taskId] || "start"

                return (
                  <div
                    key={task.taskId}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-gray-700 rounded-full">
                        <img src={task.taskImage} alt="img" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{task.taskDescription}</h3>
                        <p className="text-sm text-gray-400">+{task.point} points</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <button
                        className="bg-blue text-white text-sm px-3 py-1 rounded-lg"
                        onClick={() => (status === "start" ? handleStartTask(task) : handleClaimTask(task))}
                      >
                        {/* {status === "start" ? "Start" : "Claim"} */}
                        {loadingTasks[task.taskId] ? <Loader2 className="animate-spin" /> : taskStatus[task.taskId] === "start" ? "Start" : "Claim"}

                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}
