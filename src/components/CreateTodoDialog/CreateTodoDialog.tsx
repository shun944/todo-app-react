import React, { useState, useEffect } from 'react';
import './CreateTodoDialog.css';
import { CreateTodoRequest } from '../../models/Todo';
import { UpdateTodoRequest } from '../../models/Todo';
import { Todo } from '../../models/Todo';

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

  useEffect(() => {
    if(isUpdate && existingTodo) {
      const previousTodo: UpdateTodoRequest = {
        ...existingTodo,
      };
      setUpdateTodo(previousTodo);
      console.log('previousTodo', updateTodo);
    }
  }, [isUpdate, existingTodo, dialogOpen]);
  
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdate) {
      const tempTodo = {...updateTodo};
      tempTodo.due_date = e.target.value;
      setUpdateTodo(tempTodo);
    } else {
      setTodo({ ...todo, due_date: e.target.value });
    }

    if (e.target.value) {
      setErrors(prevErrors => ({...prevErrors, due_date: false}));
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Due date is required'));
    } 
  }

  const validationTodo = (todo: CreateTodoRequest | UpdateTodoRequest): boolean => {
    let newErrors = {...errors};
    let newErrorMessages = [...errorMessages];
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
        <div className='label-container'>
          <label>
            title:
            <input type="text" className={errors.title ? 'invalid-form-content' : ''} value={updateTodo.title} onChange={handleTitleChange}/>
          </label>
        </div>
        <div className='label-container'>
          <label>
            description:
            <input type="text" className={errors.description ? 'invalid-form-content' : ''} value={updateTodo.description} onChange={handleDescriptionChange}/>
          </label>
        </div>
        <div className='label-container'>
          <label>
            due_date:
            <input type="date" className={errors.due_date ? 'invalid-form-content' : ''} value={updateTodo.due_date} onChange={handleDueDateChange}/>
          </label>
        </div>
        {
          isUpdate  
          ? <button onClick={handleUpdate}>Update</button>
          : <button onClick={handleCreate}>Create</button>
        }
        {errorMessages && errorMessages.map((message, index) => 
          <p className="red" key={index}>{message}</p>)
        }
        <div>
          <button className='close-dialog' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTodoDialog;