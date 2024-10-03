import React, { useState, useEffect } from 'react';
import './CreateTodoDialog.css';
import { CreateTodoRequest } from '../../models/Todo';
import { UpdateTodoRequest } from '../../models/Todo';
import { Todo } from '../../models/Todo';
import dayjs, { Dayjs } from 'dayjs';

import Textarea from '@mui/joy/Textarea';
import { Button, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CreateTodoDialogProps {
  onClose: () => void;
  onCreate: (todo: CreateTodoRequest) => void;
  isUpdate?: boolean;
  existingTodo?: Todo | null;
  onUpdate: (todo: UpdateTodoRequest) => void;
  dialogOpen?: boolean;
}

interface TodoErrors {
  title: boolean;
  description: boolean;
  due_date: boolean;
}

const CreateTodoDialog: React.FC<CreateTodoDialogProps> = ({ onClose, onCreate, isUpdate, existingTodo, onUpdate, dialogOpen }) => {
  const [todo, setTodo] = useState<CreateTodoRequest>({title: '', description: '', due_date: '', user_id: 0});
  const [updateTodo, setUpdateTodo] = useState<UpdateTodoRequest>({id: 0});
  const [errors, setErrors] = useState<TodoErrors>({title: false, description: false, due_date: false});
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(dayjs().startOf('day'));

  let currentDate = dayjs().startOf('day');

  useEffect(() => {
    if(isUpdate && existingTodo) {
      const previousTodo: UpdateTodoRequest = {
        ...existingTodo,
      };
      setUpdateTodo(previousTodo);
      setDatePickerValue(dayjs(previousTodo.due_date));
    }
    
  }, [isUpdate, existingTodo, dialogOpen]);

  useEffect(() => {
    if (isUpdate) {
      setDatePickerValue(dayjs(updateTodo.due_date));
    } 
    else {
      setDatePickerValue(dayjs(todo.due_date));
      if (!todo.due_date) {
        setTodo({ ...todo, due_date: currentDate.format('YYYY-MM-DD') });
      } else {
        setTodo({ ...todo, due_date: todo.due_date });
      }
    }
  }, [updateTodo.due_date, todo.due_date]);
  
  const handleCreate = () => {
    const isValidTodo = validationTodo(todo);
    if (!isValidTodo) {
      return;
    }
    onCreate(todo);
    onClose();
  };

  const handleUpdate = () => {
    const isValidTodo = validationTodo(updateTodo);
    if (!isValidTodo) {
      return;
    }
    onUpdate(updateTodo);
    onClose();
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.title = e.target.value;
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, title: e.target.value });
    }

    if (e.target.value) {
      setErrors(prevErrors => ({...prevErrors, title: false}));
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Title is required'));
    } 
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.description = e.target.value;
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, description: e.target.value });
    }

    if (e.target.value) {
      setErrors(prevErrors => ({...prevErrors, description: false}));
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Description is required'));
    } 
  }

  const handleDueDateChange = (date: Dayjs | null) => {
    let targetDate: string;
    targetDate = date ? date.format('YYYY-MM-DD') : '';
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.due_date = targetDate;
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, due_date: targetDate });
    }

    if (targetDate) {
      setErrors(prevErrors => ({...prevErrors, due_date: false}));
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Due date is required'));
    } 
  }

  const validationTodo = (todo: CreateTodoRequest | UpdateTodoRequest): boolean => {
    let newErrors = {title: false, description: false, due_date: false};
    let newErrorMessages: string[] = [];
    if (!todo.title) {
      newErrors = {...newErrors, title: true};
      newErrorMessages = [...newErrorMessages, 'Title is required'];
    }
    if (!todo.description) {
      newErrors = {...newErrors, description: true};
      newErrorMessages = [...newErrorMessages, 'Description is required'];
    }
    if(!todo.due_date){
      newErrors = {...newErrors, due_date: true};
      newErrorMessages = [...newErrorMessages, 'Due date is required'];
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);

    return !newErrorMessages.length;
  }

  return (
    <div className='dialog'>
      <div className='dialog-content'>
        <label htmlFor="title">title:</label>
        <Textarea id="title" value={updateTodo.title} onChange={handleTitleChange}
          sx={errors.title ? { borderColor: 'red' } : {}}
        />
        <label htmlFor="description">description:</label>
        <Textarea id="description" value={updateTodo.description} onChange={handleDescriptionChange}
          sx={errors.description ? { borderColor: 'red' } : {}}
        />
        <Box mt={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="due_date"
              value={datePickerValue}
              onChange={handleDueDateChange || currentDate}
              format='YYYY-MM-DD'
            />
          </LocalizationProvider>
        </Box>
        <div>
          <Box mt={2}>
            {
              isUpdate  
              ? <Button variant="contained" onClick={handleUpdate} >Update</Button>
              : <Button variant="contained" onClick={handleCreate}>Create</Button>
            }
          </Box>
          {errorMessages && errorMessages.map((message, index) => 
            <p className="red" key={index}>{message}</p>)
          }
          <Box display="flex" justifyContent="flex-end">
            {/* <button className='close-dialog' onClick={onClose}>Close</button> */}
            <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default CreateTodoDialog;