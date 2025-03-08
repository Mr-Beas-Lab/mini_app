import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAndTasks, setActiveTab, updateTaskStatus, setLoadingTask } from "@/store/slice/tasksSlice";
import { RootState, AppDispatch } from "@/store/store"; 
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { functions } from "@/libs/firebase";
import { telegramId } from "@/libs/telegram";
import { setShowMessage } from "@/store/slice/messageSlice";
import { updateUserBalance } from "@/store/slice/userSlice";
import { httpsCallable } from "firebase/functions";

interface ClaimTaskRequest {
  telegramId: string;
  taskId: string;
}

// Define the structure of the response data
interface ClaimTaskResponse {
  success: boolean;
}

export default function TaskTabs() {
  const dispatch = useDispatch<AppDispatch>(); 
  const { tasksByCategory, categories, activeTab, taskStatus, loadingTasks } = useSelector((state: RootState) => state.tasks);
  const [redirectedTasks, setRedirectedTasks] = useState<Set<string>>(new Set());  
  const [waitingTasks, setWaitingTasks] = useState<Set<string>>(new Set()); 

  useEffect(() => {
    dispatch(fetchCategoriesAndTasks()); 
  }, [dispatch]);

  const handleStartTask = (task) => {
    // Redirect to the task link
    window.open(task.task, "_blank");

    // Mark the task as redirected and in waiting phase
    setRedirectedTasks((prev) => new Set(prev).add(task.taskId));
    setWaitingTasks((prev) => new Set(prev).add(task.taskId));

    // Wait 5 seconds before enabling the "Claim" button
    setTimeout(() => {
      setWaitingTasks((prev) => {
        const updated = new Set(prev);
        updated.delete(task.taskId);
        return updated;
      });
      dispatch(updateTaskStatus({ taskId: task.taskId, status: "claim" }));
    }, 10000); 
  };


const handleClaimTask = async (task) => {
  dispatch(setLoadingTask({ taskId: task.taskId, loading: true }));

  try {
    const claimTaskFunction = httpsCallable<ClaimTaskRequest, ClaimTaskResponse>(functions, 'claimTask');
    const result = await claimTaskFunction({
      telegramId: String(telegramId),  
      taskId: task.taskId,  
    });

    if (result.data.success) {
      // Update local state after successful claim
      dispatch(updateTaskStatus({ taskId: task.taskId, status: 'completed' }));
      dispatch(updateUserBalance(task.point));  
    }
  } catch (error) {
    console.error('Error claiming task:', error);
    dispatch(
      setShowMessage({
        message: 'Failed to claim task. Please try again.',
        color: 'red',
      })
    );
  } finally {
    dispatch(setLoadingTask({ taskId: task.taskId, loading: false }));
  }
};
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-black min-h-screen">
      <div className="relative">
        <div className="flex border-b border-gray-800 mb-4 overflow-x-auto scrollbar-hidden relative no-scrollbar">
          {categories.map((category) => {
            const hasUnclaimedTasks = tasksByCategory[category.name]?.some(
              (task) => taskStatus[task.taskId] !== "completed"
            );

            return (
              <button
                key={category.id}
                onClick={() => dispatch(setActiveTab(category.name))}
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
        {Object.entries(tasksByCategory).map(([categoryName, categoryTasks]) =>
          categoryName === activeTab ? (
            <div key={categoryName} className="space-y-4">
              {categoryTasks.map((task) => {
                const status = taskStatus[task.taskId] || "start";
                const isRedirected = redirectedTasks.has(task.taskId); // Check if task was redirected
                const isWaiting = waitingTasks.has(task.taskId); // Check if task is in waiting phase

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
                        <a href={task.task} target="_blank" rel="noopener noreferrer">
                          <h3 className="text-white font-medium">{task.taskDescription}</h3>
                        </a>
                        <p className="text-sm text-gray-400">+{task.point} points</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <button
                        className="bg-blue text-white text-sm px-3 py-1 rounded-lg"
                        onClick={() => (status === "start" ? handleStartTask(task) : handleClaimTask(task))}
                        disabled={status === "claim" && !isRedirected} // Disable if not redirected
                      >
                        {loadingTasks[task.taskId] || isWaiting ? ( // Show loader if loading or waiting
                          <Loader2 className="animate-spin" />
                        ) : status === "start" ? (
                          "Start"
                        ) : (
                          "Claim"
                        )}
                      </button>
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