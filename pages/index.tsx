import { useState, useMemo, useEffect } from 'react';
import { GetServerSideProps } from 'next'; 
import Head from 'next/head';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTasks } from '../store/tasksSlice';
import { Container, Typography, List, Box, Alert, CircularProgress, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { Task } from '../types';
import { API_URL } from '@/constants/apiConstants';

// Define Props for the component
interface TaskManagerProps {
    initialTasks: Task[];
    ssrError: string | null;
}

export default function TaskManager({ initialTasks, ssrError }: TaskManagerProps) {
  const dispatch = useAppDispatch();
  const { tasks: reduxTasks, isLoading, error: reduxError } = useAppSelector((state) => state.tasks);
  
  // Use Redux tasks if loaded, otherwise use SSR tasks 
  const currentTasks = reduxTasks.length > 0 ? reduxTasks : initialTasks;
  const currentError = reduxError || ssrError;
  

  const [searchTerm, setSearchTerm] = useState('');

  // Search Filteration
  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
        return currentTasks;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return currentTasks.filter(task => 
        task.title.toLowerCase().includes(lowerSearchTerm) || 
        task.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [currentTasks, searchTerm]);


  useEffect(() => {
    if (reduxTasks.length === 0 && initialTasks.length === 0 && !ssrError) {
        dispatch(fetchTasks());
    }
  }, [dispatch, reduxTasks.length, initialTasks.length, ssrError]);


  const renderContent = () => {
    // Determine loading state based on Redux loading and initial SSR load
    if (isLoading && filteredTasks.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (currentError) {
        return <Alert severity="error">{currentError}</Alert>;
    }
    
    if (filteredTasks.length === 0) {
        return (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 2 }}>
                {searchTerm ? `No tasks found matching "${searchTerm}".` : 'No tasks found. Add a new task above!'}
            </Typography>
        );
    }
    
    return (
        <List>
            {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </List>
    );
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Task Management</title>
      </Head>

      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Task Management 
        </Typography>

        {/* Task Creation Form */}
        <TaskForm />

        <Typography variant="h4" component="h2" sx={{ mt: 4, mb: 2 }}>
          Task(s) List
        </Typography>

        {/* Search/Filter Input */}
        <TextField
            fullWidth
            label="Search tasks by title or description"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
                startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
            }}
            sx={{ mb: 3 }}
        />
        
        {renderContent()}
      </Box>
    </Container>
  );
}


// Implement SSR
export const getServerSideProps: GetServerSideProps<TaskManagerProps> = async (context) => {
    try {
        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : process.env.URL;

        const response = await fetch(`${baseUrl}${API_URL}`);
        
        if (!response.ok) {
            // Throw an error if the API call fails
            throw new Error(`API fetch failed with status: ${response.status}`);
        }
        
        const initialTasks: Task[] = await response.json();
        
        return {
            props: {
                initialTasks,
                ssrError: null,
            },
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during SSR.';
        
        return {
            props: {
                initialTasks: [],
                ssrError: `SSR Task Fetch Error: ${errorMessage}`,
            },
        };
    }
};