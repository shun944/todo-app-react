import React, { useState, useEffect } from 'react';
import './CreateTodoDialog.css';
import { CreateTodoRequest } from '../../models/Todo';
import { UpdateTodoRequest } from '../../models/Todo';
import { Todo } from '../../models/Todo';
import dayjs, { Dayjs } from 'dayjs';
import { useRecoilState } from 'recoil';
import { updatedFromDialogAtom, createdFromDialogAtom } from '../../atom';
import useCategories from '../../hooks/useCategories';

import Textarea from '@mui/joy/Textarea';
import { Button, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';     
import Select, { SelectChangeEvent } from '@mui/material/Select';



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
  start_date: boolean;
  due_date: boolean;
  category: boolean;
}

interface Category {
  id: number;
  name: string;
}

const CreateTodoDialog: React.FC<CreateTodoDialogProps> = ({ onClose, onCreate, isUpdate, existingTodo, onUpdate, dialogOpen }) => {
  const [todo, setTodo] = useState<CreateTodoRequest>({title: '', description: '', start_date: '', due_date: '', user_id: 0, category_master_id: 0});
  const [updateTodo, setUpdateTodo] = useState<UpdateTodoRequest>({id: 0});
  const [errors, setErrors] = useState<TodoErrors>({title: false, description: false, start_date: false, due_date: false, category: false});
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [startDateValue, setStartDateValue] = useState<Dayjs | null>(null);
  const [dueDateValue, setDueDateValue] = useState<Dayjs | null>(null);
  const [enableValidation, setEnableValidation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [updatedFromDialog, setUpdatedFromDialog] = useRecoilState(updatedFromDialogAtom);
  const [createdFromDialog, setCreatedFromDialog] = useRecoilState(createdFromDialogAtom);

  const { categories } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  let currentDate = dayjs().startOf('day');

  useEffect(() => {
    if (categories && categoryOptions.length === 0) {
      categories.map((category) => {
        setCategoryOptions(prevOptions => [...prevOptions, {id: category.id, name: category.category_name}]);
      })
    }
    console.log('categoryOptions', categoryOptions);
  }, [categories]);

  useEffect(() => {
    if (updatedFromDialog) {
      setUpdatedFromDialog(false);
    }
    if (createdFromDialog) {
      setCreatedFromDialog(false);
    }
  });

  useEffect(() => {
    if(isUpdate && existingTodo) {
      const previousTodo: UpdateTodoRequest = {
        ...existingTodo,
      };
      setUpdateTodo(previousTodo);
      setStartDateValue(dayjs(previousTodo.start_date));
      setDueDateValue(dayjs(previousTodo.due_date));
      setSelectedCategory(previousTodo.category_master_id?.toString() || '');
    }
    
  }, [isUpdate, existingTodo, dialogOpen]);

  useEffect(() => {
    if (isUpdate) {
      setStartDateValue(dayjs(updateTodo.start_date));
      setDueDateValue(dayjs(updateTodo.due_date));
      validationTodo(updateTodo, false);
    } 
    else {
      setStartDateValue(dayjs(todo.start_date));
      setDueDateValue(dayjs(todo.due_date));
      if (!todo.due_date && !todo.start_date) {
        setTodo({ ...todo, 
          start_date: currentDate.format('YYYY-MM-DD'),
          due_date: currentDate.format('YYYY-MM-DD')
        });
        
      } else {
        setTodo({ ...todo, 
          start_date: todo.start_date,
          due_date: todo.due_date
        });
      }
      validationTodo(todo, false);
    }
  }, [updateTodo.start_date, todo.start_date, updateTodo.due_date, todo.due_date]);

  useEffect(() => {
    validationTodo(todo, false);
    if (isUpdate) {
      validationTodo(updateTodo, false);
    } else {
      validationTodo(todo, false);
    }
  }, [updateTodo.title, todo.title, updateTodo.description, todo.description]);
  
  const handleCreate = () => {
    setEnableValidation(true);
    const isValidTodo = validationTodo(todo, true);
    if (!isValidTodo) {
      return;
    }
    onCreate(todo);
    setCreatedFromDialog(true);
    onClose();
  };

  const handleUpdate = () => {
    setEnableValidation(true);
    const isValidTodo = validationTodo(updateTodo, true);
    if (!isValidTodo) {
      return;
    }
    onUpdate(updateTodo);
    setUpdatedFromDialog(true);
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

  const handleStartDateChange = (date: Dayjs | null) => {
    let targetDate: string;
    targetDate = date ? date.format('YYYY-MM-DD') : '';
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.start_date = targetDate;
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, start_date: targetDate });
    }

    if (targetDate) {
      setErrors(prevErrors => ({...prevErrors, start_date: false}));
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Start date is required'));
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setSelectedCategory(e.target.value);
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.category_master_id = Number(e.target.value);
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, category_master_id: Number(e.target.value) });
    }
  }

  const validationTodo = (todo: CreateTodoRequest | UpdateTodoRequest, isSubmited: boolean): boolean => {
    if (!enableValidation && !isSubmited) {
      return true;
    }
    let newErrors = {title: false, description: false, start_date: false, due_date: false, category: false};
    let newErrorMessages: string[] = [];
    if (!todo.title) {
      newErrors = {...newErrors, title: true};
      newErrorMessages = [...newErrorMessages, 'Title is required'];
    }
    if (!todo.description) {
      newErrors = {...newErrors, description: true};
      newErrorMessages = [...newErrorMessages, 'Description is required'];
    }
    if (!todo.start_date){
      newErrors = {...newErrors, start_date: true};
      newErrorMessages = [...newErrorMessages, 'Start date is required'];
    }
    if (!todo.due_date){
      newErrors = {...newErrors, due_date: true};
      newErrorMessages = [...newErrorMessages, 'Due date is required'];
    }
    if (dayjs(todo.start_date) > dayjs(todo.due_date)) {
      newErrors = {...newErrors, start_date: true, due_date: true};
      newErrorMessages = [...newErrorMessages, 'Start date must be before due date'];
    }
    if (todo.category_master_id === 0) {
      newErrors = {...newErrors, category: true};
      newErrorMessages = [...newErrorMessages, 'Category is required'];
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    setEnableValidation(false);

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
          sx={{
            height: '150px',
            ...(errors.description ? { borderColor: 'red' } : {})}
          }
        />
        <Box mt={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="start_date"
              value={startDateValue || currentDate}
              onChange={handleStartDateChange}
              format='YYYY-MM-DD'
              sx={{ marginBottom: 2, color: 'red' }}
              
            />
            <DatePicker
              label="due_date"
              value={dueDateValue}
              onChange={handleDueDateChange}
              format='YYYY-MM-DD'
            />
          </LocalizationProvider>
        </Box>
        <FormControl error={errors.category} sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Category</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedCategory}
            label="Age"
            onChange={handleSelectChange}
          >
            {categoryOptions.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>{category.name}</MenuItem>
            ))}
          </Select>
      </FormControl>
        <div>
          <Box mt={2}>
            {
              isUpdate  
              ? <Button variant="contained" onClick={handleUpdate}>Update</Button>
              : <Button variant="contained" onClick={handleCreate}>Create</Button>
            }
          </Box>
          {errorMessages && errorMessages.map((message, index) => 
            <p className="red" key={index}>{message}</p>)
          }
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default CreateTodoDialog;