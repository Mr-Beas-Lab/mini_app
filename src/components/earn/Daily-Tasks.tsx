import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAndTasks, setActiveTab, updateTaskStatus, setLoadingTask } from "@/store/slice/tasksSlice";
import { RootState, AppDispatch } from "@/store/store"; 
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function TaskTabs() {
  const dispatch = useDispatch<AppDispatch>(); 
  const { tasksByCategory, categories, activeTab, taskStatus, loadingTasks } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchCategoriesAndTasks()); 
  }, [dispatch]);

  const handleStartTask = (task) => {
    dispatch(setLoadingTask({ taskId: task.taskId, loading: true }));
    setTimeout(() => {
      dispatch(updateTaskStatus({ taskId: task.taskId, status: "claim" }));
      dispatch(setLoadingTask({ taskId: task.taskId, loading: false }));
    }, 1000);
  };

  const handleClaimTask = (task) => {
    dispatch(setLoadingTask({ taskId: task.taskId, loading: true }));
    setTimeout(() => {
      dispatch(updateTaskStatus({ taskId: task.taskId, status: "completed" }));
      dispatch(setLoadingTask({ taskId: task.taskId, loading: false }));
    }, 1000);
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
                        <a href={task.task}>
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
                      >
                        {loadingTasks[task.taskId] ? <Loader2 className="animate-spin" /> : status === "start" ? "Start" : "Claim"}
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
