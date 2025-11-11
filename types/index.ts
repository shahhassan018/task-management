export type TaskPriority = 'Low' | 'Medium' | 'High';

// Task Model
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;    
  isCompleted: boolean;
}

// Redux State Model
export interface TasksState {
  tasks: Task[];
  isLoading: boolean; 
  error: string | null;
}

// Form Data Model (for React Hook Form)
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority; 
  dueDate: string;
}

// Edit Payload
export interface EditTaskPayload extends TaskFormData {
    id: string;
}