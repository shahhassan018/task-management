'use client'

import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { toggleTaskAsync, deleteTaskAsync } from '../store/tasksSlice';
import { Task } from '../types';
import { getPriorityColor } from '../helpers';
import EditTaskModal from './EditTaskModal';

import { 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    IconButton, 
    Checkbox, 
    Typography, 
    Chip, 
    Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // <-- IMPORT EDIT ICON

// Define props for the component
interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const dispatch = useAppDispatch();
  const priorityStyle = getPriorityColor(task.priority);
  
  // State to control the Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleToggle = () => {
    dispatch(toggleTaskAsync(task));
  };

  const handleDelete = () => {
    dispatch(deleteTaskAsync(task.id));
  };
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ListItem
        secondaryAction={
            <Box>
                {/* 1. EDIT BUTTON */}
                <IconButton 
                    edge="end" 
                    aria-label="edit" 
                    onClick={handleOpenModal} 
                    color="primary"
                    sx={{ mr: 1 }}
                >
                    <EditIcon />
                </IconButton>
                
                {/* 2. DELETE BUTTON */}
                <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={handleDelete} 
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        }
        sx={{ 
          border: `1px solid ${task.isCompleted ? 'success.main' : 'primary.main'}`, 
          borderRadius: 1, 
          mb: 1,
          backgroundColor: task.isCompleted ? '#f0fff0' : '#ffffff',
          opacity: task.isCompleted ? 0.7 : 1,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={task.isCompleted}
            tabIndex={-1}
            disableRipple
            onChange={handleToggle}
            color="primary"
          />
        </ListItemIcon>
        <ListItemText
          primary={
              <Typography 
                  variant="h6"
                  sx={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}
              >
                  {task.title}
              </Typography>
          }
          secondary={
              <Box component="span"> 
                  {/* Description */}
                  <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      component="span" 
                  >
                      {task.description}
                  </Typography>
                  
                  {/* Priority Chip and Due Date container */}
                  <Box 
                      component="span" 
                      sx={{ mt: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
                  >
                      <Chip 
                          component="span" 
                          label={`Priority: ${priorityStyle.label}`} 
                          color={priorityStyle.color} 
                          size="small" 
                          variant="outlined" 
                      />
                      <Typography variant="caption" color="text.hint" sx={{ fontWeight: 'bold' }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                  </Box>
              </Box>
          }
          sx={{ 
              color: task.isCompleted ? 'text.secondary' : 'text.primary',
              ml: 1
          }}
        />
      </ListItem>
      
      {/* Edit Modal Component */}
      <EditTaskModal 
        task={task} 
        open={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}