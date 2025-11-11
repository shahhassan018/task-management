
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../store/hooks';
import { addTaskAsync } from '../store/tasksSlice';
import { TaskFormData } from '../types';
import { isFutureDate } from '../helpers';
import { 
  TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormHelperText,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const defaultValues: TaskFormData = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: new Date().toISOString().substring(0, 10),
};

export default function TaskForm() {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<TaskFormData>({ defaultValues });
  
  const isLoading = isFormSubmitting;

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    await dispatch(addTaskAsync(data));
    reset(defaultValues); 
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fff' }}
    >
      {/* Task Name Field */}
      <TextField
        label="Task Name"
        variant="outlined"
        fullWidth
        disabled={isLoading}
        {...register("title", { required: "Task Name is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      {/* Description Field */}
      <TextField
        label="Description (Optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        disabled={isLoading}
        {...register("description")}
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Priority Select Field */}
        <FormControl fullWidth error={!!errors.priority} disabled={isLoading}>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            label="Priority"
            defaultValue={defaultValues.priority}
            {...register("priority", { required: "Priority is required" })}
          >
            <MenuItem value={'High'}>High</MenuItem>
            <MenuItem value={'Medium'}>Medium</MenuItem>
            <MenuItem value={'Low'}>Low</MenuItem>
          </Select>
          <FormHelperText>{errors.priority?.message}</FormHelperText>
        </FormControl>

        {/* Due Date Field */}
        <TextField
          label="Due Date"
          type="date" 
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled={isLoading}
          {...register("dueDate", { 
            required: "Due Date is required",
            // Using helper function for validation
            validate: value => isFutureDate(value) || "Date cannot be in the past"
          })}
          error={!!errors.dueDate}
          helperText={errors.dueDate?.message}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        disabled={isLoading}
        sx={{ height: '56px' }}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </Button>
    </Box>
  );
}