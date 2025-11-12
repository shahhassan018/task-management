import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useAppDispatch } from '../store/hooks';
import { editTaskAsync } from '../store/tasksSlice';
import { Task, TaskFormData } from '../types';
import { isFutureDate } from '../helpers';
import { 
  TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormHelperText,
  Modal, Typography, Paper, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

// Props include the task to edit and a handler to close the modal
interface EditTaskModalProps {
    task: Task;
    open: boolean;
    onClose: () => void;
}

// Convert Task to Form Data format for default values
const taskToFormData = (task: Task): TaskFormData => ({
    title: task.title,
    description: task.description,
    priority: task.priority,
    // Format the date string for the HTML date input
    dueDate: new Date(task.dueDate).toISOString().substring(0, 10),
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function EditTaskModal({ task, open, onClose }: EditTaskModalProps) {
  const dispatch = useAppDispatch();
  
  // Initialize form with the current task data
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: taskToFormData(task)
  });
  
  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    const updatedTask: Task = {
        ...task,
        ...data,
    };
    
    await dispatch(editTaskAsync(updatedTask));
    onClose(); // Close modal upon successful submission
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-task-modal-title">
      <Paper sx={style}>
        <Typography id="edit-task-modal-title" variant="h5" component="h2" gutterBottom>
          Edit Task: {task.title}
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Task Name Field (Uses register) */}
          <TextField
            label="Task Name"
            variant="outlined"
            fullWidth
            disabled={isSubmitting}
            {...register("title", { required: "Task Name is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* Description Field (Uses register) */}
          <TextField
            label="Description (Optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            disabled={isSubmitting}
            {...register("description")}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* PRIORITY SELECT FIELD (NOW USES CONTROLLER) */}
            <FormControl fullWidth error={!!errors.priority} disabled={isSubmitting}>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Controller
                name="priority" // Field name
                control={control} // RHF control object
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select
                    labelId="priority-label"
                    label="Priority"
                    {...field} // Spreads value and onChange
                    value={field.value || ''} // Ensure value is set, even if initial value is empty
                  >
                    <MenuItem value={'High'}>High</MenuItem>
                    <MenuItem value={'Medium'}>Medium</MenuItem>
                    <MenuItem value={'Low'}>Low</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.priority?.message}</FormHelperText>
            </FormControl>

            {/* Due Date Field (Uses register) */}
            <TextField
              label="Due Date"
              type="date" 
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={isSubmitting}
              {...register("dueDate", { 
                required: "Due Date is required",
                validate: value => isFutureDate(value) || "Date cannot be in the past"
              })}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isSubmitting}
            sx={{ height: '56px' }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}