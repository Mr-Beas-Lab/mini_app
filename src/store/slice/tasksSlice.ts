import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { telegramId } from '@/libs/telegram';
import { convertTimestamps } from '@/libs/firestore'; 

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

interface TasksState {
  tasksByCategory: { [category: string]: Task[] };
  categories: Category[];
  loading: boolean;
  error: string | null;
  taskStatus: { [taskId: string]: 'start' | 'claim' | 'completed' };
  loadingTasks: { [taskId: string]: boolean };
  activeTab: string | null;
}

const initialState: TasksState = {
  tasksByCategory: {},
  categories: [],
  loading: false,
  error: null,
  taskStatus: {},
  loadingTasks: {},
  activeTab: null,
};

export const fetchCategoriesAndTasks = createAsyncThunk(
  'tasks/fetchCategoriesAndTasks',
  async () => {
    const id = String(telegramId);

    // Fetch categories
    const categoriesCollection = collection(db, 'categories');
    const categoriesQuery = query(categoriesCollection, orderBy('createdAt', 'asc'));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    // Fetch tasks
    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, orderBy('createdAt', 'desc'));
    const tasksSnapshot = await getDocs(tasksQuery);

    // Fetch user's completed tasks
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    const completedTasks = userData.completedTasks || [];

    // Convert timestamps in user data (if any)
    const serializableUserData = convertTimestamps(userData);

    // Initialize tasksByCategory and taskStatus
    const tasksByCategory: { [category: string]: Task[] } = {};
    const taskStatus: { [taskId: string]: 'start' | 'claim' | 'completed' } = {};

    tasksSnapshot.forEach((doc) => {
      const data = doc.data();
      const category = categories.find((cat) => cat.id === data.category);
      const taskId = doc.id;

      if (category) {
        const task = {
          taskId: taskId,
          companyName: data.companyName,
          taskDescription: data.taskDescription,
          task: data.task,
          socialMedia: data.socialMedia,
          taskImage: data.taskImage || '/placeholder.svg',
          point: Number.parseInt(data.point),
          category: category.name,
        };

        if (!tasksByCategory[category.name]) {
          tasksByCategory[category.name] = [];
        }
        tasksByCategory[category.name].push(task);
      }

      // Set task status based on completedTasks
      taskStatus[taskId] = completedTasks.includes(taskId) ? 'completed' : 'start';
    });

    return {
      categories,
      tasksByCategory,
      taskStatus,
      userData: serializableUserData,  
    };
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateTaskStatus: (state, action) => {
      state.taskStatus[action.payload.taskId] = action.payload.status;
    },
    setLoadingTask: (state, action) => {
      state.loadingTasks[action.payload.taskId] = action.payload.loading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAndTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAndTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.tasksByCategory = action.payload.tasksByCategory;
        state.taskStatus = action.payload.taskStatus;
        if (action.payload.categories.length > 0) {
          state.activeTab = action.payload.categories[0].name;
        }
      })
      .addCase(fetchCategoriesAndTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { setActiveTab, updateTaskStatus, setLoadingTask } = tasksSlice.actions;
export default tasksSlice.reducer;