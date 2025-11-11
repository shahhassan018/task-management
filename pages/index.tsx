'use client'

import { useEffect } from 'react';
import Head from 'next/head';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTasks } from '../store/tasksSlice';
import { Container, Typography, List, Box, Alert, CircularProgress } from '@mui/material';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

function TaskManager() {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);
  
  // Load tasks from API on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading && tasks.length === 0) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    if (tasks.length === 0) {
        return (
            <Typography variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center', p: 2 }}>
                No tasks found. Add a new task above!
            </Typography>
        );
    }
    return (
        <List>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </List>
    );
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Next.js API & Redux Task Manager</title>
      </Head>

      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Task Management
        </Typography>

        {/* Task Creation Form */}
        <TaskForm />

        <Typography variant="h4" component="h2" sx={{ mt: 4, mb: 2 }}>
          Task List
        </Typography>
        
        {renderContent()}
      </Box>
    </Container>
  );
}

export default TaskManager;