import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/libs/firebase';

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
  activeTab:  null
};

export const fetchCategoriesAndTasks = createAsyncThunk(
  'tasks/fetchCategoriesAndTasks',
  async () => {
    const categoriesCollection = collection(db, 'categories');
    const categoriesQuery = query(categoriesCollection, orderBy('createdAt', 'asc'));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));

    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, orderBy('createdAt', 'desc'));
    const tasksSnapshot = await getDocs(tasksQuery);

    const tasksByCategory: { [category: string]: Task[] } = {};
    tasksSnapshot.forEach(doc => {
      const data = doc.data();
      const category = categories.find(cat => cat.id === data.category);
      
      if (category) {
        const task = {
          taskId: doc.id,
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
    });

    return { categories, tasksByCategory };
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