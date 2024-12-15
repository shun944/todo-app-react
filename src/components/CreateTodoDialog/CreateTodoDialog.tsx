import React, { useState, useEffect } from 'react';
import './CreateTodoDialog.css';
import { CreateTodoRequest } from '../../models/Todo';
import { UpdateTodoRequest } from '../../models/Todo';
import { Todo } from '../../models/Todo';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { updatedFromDialogAtom, createdFromDialogAtom } from '../../atomJotai';
import useCategories from '../../hooks/useCategories';

import { Button, Box, TextField, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';     
import Select from '@mui/material/Select';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface CreateTodoDialogProps {
  onClose: () => void;
  onCreate: (todo: CreateTodoRequest) => void;
  isUpdate?: boolean;
  existingTodo?: Todo | null;
  onUpdate: (todo: UpdateTodoRequest) => void;
  dialogOpen?: boolean;
}

interface Category {
  id: number;
  name: string;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  start_date: yup.string().required('Start date is required'),
  due_date: yup.string().required('Due date is required'),
  category: yup.number().required('Category is required'),
});

const CreateTodoDialog: React.FC<CreateTodoDialogProps> = ({ onClose, onCreate, isUpdate, existingTodo, onUpdate, dialogOpen }) => {
  const [updatedFromDialog, setUpdatedFromDialog] = useAtom(updatedFromDialogAtom);
  const [createdFromDialog, setCreatedFromDialog] = useAtom(createdFromDialogAtom);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { categories } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  let currentDate = dayjs().startOf('day');

  useEffect(() => {
    if (updatedFromDialog) {
      setUpdatedFromDialog(false);
    }
    if (createdFromDialog) {
      setCreatedFromDialog(false);
    }
  });

  useEffect(() => {
    if (categories && categoryOptions.length === 0) {
      categories.map((category) => {
        setCategoryOptions(prevOptions => [...prevOptions, {id: category.id, name: category.category_name}]);
      })
    }
  }, [categories]);

  const handleCreateClick = (data: any) => {  
    const createRequest = setFormValueForCreate(data);
    onCreate(createRequest);
    setCreatedFromDialog(true);
    onClose();
  };

  const handleUpdateClick = (data: any) => {  
    const updateRequest = setFormValueForUpdate(data);
    onUpdate(updateRequest);
    setUpdatedFromDialog(true);
    onClose();
  };

  const setFormValueForCreate = (data: any) => {
    const createTodoRequest: CreateTodoRequest = {
      title: data.title,
      description: data.description,
      start_date: data.start_date,
      due_date: data.due_date,
      user_id: 0,
      category_master_id: data.category
    };
    return createTodoRequest;
  }

  const setFormValueForUpdate = (data: any) => {
    const updateTodoRequest: UpdateTodoRequest = {
      id: existingTodo?.id || 0,
      title: data.title,
      description: data.description,
      start_date: data.start_date,
      due_date: data.due_date,
      category_master_id: data.category
    }
    return updateTodoRequest;
  }

  return (
    <div className='dialog'>
      <div className='dialog-content'>
        <form onSubmit={handleSubmit(isUpdate ? handleUpdateClick : handleCreateClick)}>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, mb: 3, width: '100%' }}>
            <Controller name="title" control={control} 
              defaultValue={existingTodo?.title} render={({ field }) => (
                <TextField {...field} id="title" label="Title"
                  type="title" size="small" error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
                />
              )}
            />
            <Controller name="description" control={control} 
              defaultValue={existingTodo?.description} render={({ field }) => (
                <TextField {...field} id="description" label="Description"
                  type="description" multiline rows={4} error={!!errors.description}
                  helperText={errors.description ? errors.description.message : ''}
                />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller name="start_date" control={control}
                defaultValue={existingTodo?.start_date ? existingTodo.start_date : currentDate.format('YYYY-MM-DD')}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="start_date" value={dayjs(field.value) || null} 
                    format='YYYY-MM-DD'
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null);
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.start_date, helperText: errors.start_date ? errors.start_date.message : ''
                      }
                    }}
                  />
                )}
              />
              <Controller name="due_date" control={control}
                defaultValue={existingTodo?.due_date ? existingTodo.due_date : currentDate.format('YYYY-MM-DD')}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="due_date" value={dayjs(field.value) || null} 
                    format='YYYY-MM-DD'
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.format('YYYY-MM-DD') : null);
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.start_date, helperText: errors.start_date ? errors.start_date.message : ''
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Controller name="category" control={control}
              defaultValue={existingTodo?.category_master_id ? existingTodo.category_master_id : 1}
              render={({ field }) => (
                <FormControl fullWidth error={errors.category ? true : false}>
                  <InputLabel id="select-label">Category</InputLabel>
                  <Select
                    labelId="select-label" id="select"
                    label="Category" {...field}
                    value={field.value || ''}
                    onChange={(event) => {
                      // 選択された値をフォームに更新
                      field.onChange(event.target.value);
                    }}
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.category?.message}
                  </FormHelperText>
                </FormControl>
                )}
            />
            {
              isUpdate  
              ? <Button type="submit" variant="contained">Update</Button>
              : <Button type="submit" variant="contained">Create</Button>
            }
            <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default CreateTodoDialog;