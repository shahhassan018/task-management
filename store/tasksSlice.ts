import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, TasksState, TaskFormData } from '../types';
import { ADD_TASK, API_URL, DELETE_TASK, FETCH_TASKS_LIST, TOGGLE_TASK } from '../constants/apiConstants';
import { HttpMethod } from '../types/api';

// (API Calls)

export const fetchTasks = createAsyncThunk(FETCH_TASKS_LIST, async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks.');
    return (await response.json()) as Task[];
});

export const addTaskAsync = createAsyncThunk(ADD_TASK, async (formData: TaskFormData) => {
    const response = await fetch(API_URL, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to add task.');
    return (await response.json()) as Task;
});

export const toggleTaskAsync = createAsyncThunk(TOGGLE_TASK, async (task: Task) => {
    const response = await fetch(API_URL, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, isCompleted: !task.isCompleted }),
    });
    if (!response.ok) throw new Error('Failed to toggle task status.');
    return (await response.json()) as Task;
});

export const deleteTaskAsync = createAsyncThunk(DELETE_TASK, async (id: string) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: HttpMethod.DELETE
    });
    if (!response.ok) throw new Error('Failed to delete task.');
    return id; 
});

// --- SLICE ---
const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle Fetch Tasks
    builder
        .addCase(fetchTasks.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
            state.isLoading = false;
            state.tasks = action.payload;
        })
        .addCase(fetchTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to load tasks.';
        })
    // Handle Add Task
        .addCase(addTaskAsync.pending, (state) => {
             state.isLoading = true;
        })
        .addCase(addTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
            state.isLoading = false;
            state.tasks.push(action.payload);
        })
        .addCase(addTaskAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to add task.';
        })
    // Handle Toggle Task
        .addCase(toggleTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        })
    // Handle Delete Task
        .addCase(deleteTaskAsync.fulfilled, (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        });
  },
});

export default tasksSlice.reducer;