import React from "react";
import useTodos from "../../hooks/useTodos";
import { Link, To } from "react-router-dom";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useUserInfo } from "../../contexts/UserInfoContext";
import "./Index.css";
//models
import { Todo } from "../../models/Todo";
import { CreateTodoRequest } from "../../models/Todo";
import { UpdateTodoRequest } from "../../models/Todo";
//components
import CreateTodoDialog from "../../components/CreateTodoDialog/CreateTodoDialog";
import SearchPanel from "../../components/searchPanel/searchPanel";
import ShowTodo from "../../components/ShowTodo/ShowTodo";
//from material-ui
import Button from '@mui/material/Button';
import { styled } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Calendar from "../../components/Calendar/Calendar";

const StyledButton = styled(Button)({
  marginBottom: '10px',
});

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Index = () => {
  const { todos, loading, error, addTodo, deleteTodo, updateTodo } = useTodos();
  const { user } = useUserInfo();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [flashMessage, setFlashMessage] = React.useState<string | null>(null);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [existingTodo, setExistingTodo] = React.useState<Todo | null>(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [searchTodos, setSearchTodos] = React.useState<Todo[]>([]);
  
  const handleDialogOpen = async (e: React.FormEvent) => {
    e.preventDefault();

    setExistingTodo(null);
    setIsUpdate(false);
    setDialogOpen(true);
  }

  const handleDialogOpenWithUpdate = async (todo: Todo) => {
    console.log('testtest',todo);
    setIsUpdate(true);
    setExistingTodo(todo);
    setDialogOpen(true);
  }

  const handleCreateFromDialog = async (todoRequest: CreateTodoRequest) => {
    if (user) {
      //set user_id for current user
      todoRequest.user_id = user.id;
      todoRequest.category_master_id = 1; // TODO: category_master_idを選択できるようにする
      addTodo(todoRequest);
    } else {
      console.log("User not found");
    }
  }

  const handleUpdateFromDialog = async (todoRequest: UpdateTodoRequest) => {
    //update
    todoRequest.category_master_id = 1; // TODO: category_master_idを選択できるようにする
    updateTodo(todoRequest);
  }

  const handleOnDelete = (todo_id: number | undefined) => {
    if (todo_id === undefined) {
      console.log("Todo id is undefined");
      return;
    }

    deleteTodo(todo_id)
      .then(() => {
        setFlashMessage('Todo deleted successfully');
        setTimeout(() => setFlashMessage(null), 3000);
        console.log(user?.id);
      })
      .catch((err) => console.error(err));
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleToggleCompleted = (todo: Todo) => {
    if (typeof todo.id === 'number') {
      const updateRequest: UpdateTodoRequest = {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        completed: !todo.completed
      };
      updateRequest.category_master_id = 1; // TODO: category_master_idを選択できるようにする
      updateTodo(updateRequest);
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleSearchResult = (todos: Todo[]) => {
    setSearchTodos(todos);
  }

  return (
    <div>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
      <h2>Welcome, {user?.name} !!</h2>
      <div><Link to="/">Home</Link></div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Recent Todo" {...a11yProps(0)} sx={{ backgroundColor: tabValue === 0 ? 'lightgray' : 'transparent' }}/>
          <Tab label="Search Todo" {...a11yProps(1)} sx={{ backgroundColor: tabValue === 1 ? 'lightgray' : 'transparent' }}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <form onSubmit={handleDialogOpen}>
          <StyledButton type="submit" className="create-todo-button" variant="contained">Create Todo</StyledButton>
        </form>
        {dialogOpen && (
          <div>
            <CreateTodoDialog onClose={handleDialogClose} 
              onCreate={handleCreateFromDialog} isUpdate={isUpdate}
              existingTodo={existingTodo} onUpdate={handleUpdateFromDialog}
              dialogOpen={dialogOpen}/>
          </div>
        )}

        {todos.map((todo) => (
          <div key={todo.id} className="todo-item-box">
            <ShowTodo targetTodo={todo} 
            handleDialogOpenWithUpdate={handleDialogOpenWithUpdate}
            handleOnDelete={handleOnDelete}
            handleToggleCompleted={handleToggleCompleted} />
          </div>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <SearchPanel onSearch={handleSearchResult} />
        <br />
        {searchTodos.map((todo) => (
          <div key={todo.id} className="todo-item-box">
            <ShowTodo targetTodo={todo} 
            handleDialogOpenWithUpdate={handleDialogOpenWithUpdate}
            handleOnDelete={handleOnDelete}
            handleToggleCompleted={handleToggleCompleted} />
          </div>
        ))}
      </CustomTabPanel>
    </div>
  );
};