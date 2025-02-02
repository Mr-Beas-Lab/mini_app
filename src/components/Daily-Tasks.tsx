import { useState, useEffect } from "react"
import { db } from "../firebase"
import { arrayUnion, collection, doc, getDocs, getDoc, increment, updateDoc } from "firebase/firestore"
import { telegramId } from "@/libs/telegram" // Assuming this is how you get the telegramId

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
  const [isClaiming, setIsClaiming] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      const categoriesCollection = collection(db, "categories")
      const categoriesSnapshot = await getDocs(categoriesCollection)

      const fetchedCategories: Category[] = []
      categoriesSnapshot.forEach((doc) => {
        fetchedCategories.push({
          id: doc.id,
          name: doc.data().name,
        })
      })

      const tasksCollection = collection(db, "tasks")
      const tasksSnapshot = await getDocs(tasksCollection)

      const fetchedTasks: Tasks = {}
      tasksSnapshot.forEach((doc) => {
        const data = doc.data()
        const categoryId = data.category
        const category = fetchedCategories.find((cat) => cat.id === categoryId)

        if (category) {
          const task: Task = {
            taskId: doc.id,
            companyName: data.companyName,
            taskDescription: data.taskDescription,
            task: data.task,
            socialMedia: data.socialMedia,
            taskImage: data.taskImage,
            point: Number.parseInt(data.point),
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
    }

    fetchCategoriesAndTasks()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", String(telegramId))
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        setUser(userDoc.data())
      } else {
        console.log("User not found")
      }
    }

    fetchUserData()
  }, [])

  const handleClaimTask = async (task: Task) => {
    if (user && !user.completedTasks?.includes(task.taskId)) {
      setIsClaiming((prev) => ({ ...prev, [task.taskId]: true }))

      try {
        setTimeout(async () => {
          try {
            const userRef = doc(db, "users", String(telegramId))

            await updateDoc(userRef, {
              completedTasks: arrayUnion(task.taskId),
              balance: increment(task.point),
            })

            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
              setUser(userDoc.data())
            }

            setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }))
          } catch (error) {
            console.error("Error claiming task:", error)
            setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }))
          }
        }, 10000)
      } catch (error) {
        console.error("Error starting claim task:", error)
        setIsClaiming((prev) => ({ ...prev, [task.taskId]: false }))
      }
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      {/* Tabs Container with Hidden Scroll & Fade Effect */}
      <div className="relative">
        <div className="flex border-b border-gray-800 mb-4 overflow-x-auto scrollbar-hidden relative no-scrollbar">
          {categories.map((category) => {
            const hasNewTasks = tasks[category.name]?.some((task) => !user?.completedTasks?.includes(task.taskId))
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab === category.name
                    ? "text-white border-b-2 border-blue"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: hasNewTasks ? "#30c0f9" : "#374151" }}
                ></span>
              </button>
            )
          })}
        </div>

        {/* Right Fade Effect */}
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>

      {/* Tasks Display */}
      <div>
        {Object.entries(tasks).map(([categoryName, categoryTasks]) =>
          categoryName === activeTab ? (
            <div key={categoryName} className="space-y-4">
              {categoryTasks.map((task) => {
                const isCompleted = user?.completedTasks?.includes(task.taskId)
                return (
                  <div
                    key={task.taskId}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-gray-700 rounded-full">
                        <img src={task.taskImage || "/placeholder.svg"} alt="img" className="w-fit h-fit" />
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
                )
              })}
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}
;
