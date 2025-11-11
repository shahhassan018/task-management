import { Task, TaskFormData, TaskPriority } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get color for the Priority Chip
export const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case 'High': return { label: 'High', color: 'error' as const };
        case 'Medium': return { label: 'Medium', color: 'warning' as const };
        case 'Low': return { label: 'Low', color: 'success' as const };
        default: return { label: 'Unknown', color: 'default' as const };
    }
};

// Simple date validation helper
export const isFutureDate = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const date = new Date(dateString).setHours(0, 0, 0, 0);
    return date >= today; 
};

// Form data handler
export const createTaskFromFormData = (formData: TaskFormData): Task => ({
    id: uuidv4(),
    title: formData.title,
    description: formData.description,
    priority: formData.priority as TaskPriority,
    dueDate: formData.dueDate,
    isCompleted: false,
});