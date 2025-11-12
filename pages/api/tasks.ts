import { NextApiRequest, NextApiResponse } from 'next';
import { Task, TaskFormData } from '../../types'; 
import { HttpMethod } from '../../types/api';
import { createTaskFromFormData } from '../../helpers/index';

// Server side in memory store
let tasksStore: Task[] = [];


// Generic API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const { search } = req.query;

    // GET: Fetch all or filtered tasks
  if (req.method === HttpMethod.GET) {
        let filteredTasks = tasksStore;

        // If a search query exists, filter the tasks
        if (search && typeof search === 'string') {
            const searchTerm = search.toLowerCase();
            filteredTasks = tasksStore.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        return res.status(200).json(filteredTasks);

    } else if (req.method === HttpMethod.POST) {
        // POST: Add a new task
        const formData: TaskFormData = req.body;

        if (!formData.title || !formData.dueDate) {
            return res.status(400).json({ message: 'Missing required fields (title, dueDate).' });
        }

        const newTask = createTaskFromFormData(formData);
        tasksStore.push(newTask);
        
        return res.status(201).json(newTask);

    } else if (req.method === HttpMethod.PUT) {
        // PUT: Edit/Toggle Task
        const { id, title, description, priority, dueDate, isCompleted } = req.body;
        const index = tasksStore.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Apply updates
        tasksStore[index] = {
            ...tasksStore[index],
            title: title ?? tasksStore[index].title,
            description: description ?? tasksStore[index].description,
            priority: priority ?? tasksStore[index].priority,
            dueDate: dueDate ?? tasksStore[index].dueDate,
            isCompleted: isCompleted !== undefined ? isCompleted : tasksStore[index].isCompleted,
        };

        return res.status(200).json(tasksStore[index]);

    } else if (req.method === HttpMethod.DELETE) {
        // DELETE: Remove a task
        const id = req.query.id as string;
        const initialLength = tasksStore.length;
        
        tasksStore = tasksStore.filter(t => t.id !== id);

        if (tasksStore.length === initialLength) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(204).end(); // Success, No Content

    } else {
        // Method Not Allowed
        res.setHeader('Allow', [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}