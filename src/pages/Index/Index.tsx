import React, { useEffect } from "react";
import useTodos from "../../hooks/useTodos";
import { Link, To } from "react-router-dom";
import { useRecoilState } from "recoil";
import "./Index.css";
import Calendar from "../../components/Calendar/Calendar";
//models
import { Todo, searchTodoRequest } from "../../models/Todo";
import { CreateTodoRequest } from "../../models/Todo";
import { UpdateTodoRequest } from "../../models/Todo";
//components
import CreateTodoDialog from "../../components/CreateTodoDialog/CreateTodoDialog";
import SearchPanel from "../../components/searchPanel/searchPanel";
import ShowTodo from "../../components/ShowTodo/ShowTodo";
//context
import TodoContext from "../../contexts/TodoContext";
//recoils
import { 
  updatedFromDialogAtom, 
  createdFromDialogAtom,
  checkedFromCardAtom
} from "../../atom";
//jotai
import { userAtom, isLoggedinAtom } from "../../atomJotai";
import { useAtom } from "jotai";
//from material-ui
import Button from '@mui/material/Button';
import { styled } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid2';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';



const StyledButton = styled(Button)({
  marginBottom: '10px',
});

//a11y: accessibility, for adding aria-controls attribute to the tab panel
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
  const { todos, loading, error, addTodo, deleteTodo, updateTodo, searchTodoForCalendar, searchTodo } = useTodos();
  const user = useAtom(userAtom)[0];
  const [isLoggedin, setIsLoggedin] = useAtom(isLoggedinAtom);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [flashMessage, setFlashMessage] = React.useState<string | null>(null);
  const [openFlash, setOpenFlash] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [existingTodo, setExistingTodo] = React.useState<Todo | null>(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [searchTodos, setSearchTodos] = React.useState<Todo[]>([]);
  const [calendarTodos, setCalendarTodos] = React.useState<Todo[]>([]);
  const [userName, setUserName] = React.useState<string | null>(null);

  const [updatedFromDialog, setUpdatedFromDialog] = useRecoilState(updatedFromDialogAtom);
  const [createdFromDialog, setCreatedFromDialog] = useRecoilState(createdFromDialogAtom);
  const [checkedFromCard, setCheckedFromCard] = useRecoilState(checkedFromCardAtom);

  useEffect(() => {
    setIsLoggedin(true);
  }, []);

  useEffect(() => {
    if(tabValue === 1) {
      setSearchTodos(todos);
    } else if(tabValue === 0) {
      setCalendarTodos(todos);
    }
  }, [todos]);

  useEffect(() => {
    if (user) setUserName(user.username);
  }, [user]);

  useEffect(() => {
    if (updatedFromDialog) {
      setOpenFlash(true);
      setFlashMessage('Todo updated successfully');
      setUpdatedFromDialog(false);
    }
    if (createdFromDialog) {
      setOpenFlash(true);
      setFlashMessage('Todo created successfully');
      setCreatedFromDialog(false);
    }
    if (checkedFromCard) {
      setOpenFlash(true);
      setFlashMessage('Checked completed successfully');
      setCheckedFromCard(false);
    }
  }, [updatedFromDialog, createdFromDialog, checkedFromCard]);
  
  const handleDialogOpen = async (e: React.FormEvent) => {
    e.preventDefault();

    setExistingTodo(null);
    setIsUpdate(false);
    setDialogOpen(true);
  }

  const handleDialogOpenWithUpdate = async (todo: Todo) => {
    setIsUpdate(true);
    setExistingTodo(todo);
    setDialogOpen(true);
  }

  const handleCreateFromDialog = async (todoRequest: CreateTodoRequest) => {
    if (user) {
      //set user_id for current user
      todoRequest.user_id = user.id;
      addTodo(todoRequest);
    } else {
      console.log("User not found");
    }
  }

  const handleUpdateFromDialog = async (todoRequest: UpdateTodoRequest) => {
    //update
    updateTodo(todoRequest);
  }

  const handleOnDelete = (todo_id: number | undefined) => {
    if (todo_id === undefined) {
      console.log("Todo id is undefined");
      return;
    }

    deleteTodo(todo_id)
      .then(() => {
        setOpenFlash(true);
        setFlashMessage('Todo deleted successfully');
      })
      .catch((err) => console.error(err));
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFlash(false);
  };

  const handleToggleCompleted = async (todo: Todo) => {
    if (typeof todo.id === 'number') {
      const updateRequest: UpdateTodoRequest = {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        completed: !todo.completed
      };
      await updateTodo(updateRequest);
    }
  }

  const handleSelectedMonthChange = (date: string) => {
    searchTodoForCalendar(date);
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

  const handleSearchResult = (searchRequest: searchTodoRequest) => {
    searchTodo(searchRequest);
  }

  return (
    <TodoContext.Provider value={{
      isUpdate, setIsUpdate, existingTodo, setExistingTodo,
      dialogOpen, setDialogOpen, handleDialogOpenWithUpdate,
      handleOnDelete, handleToggleCompleted,
    }}>
      <div>
        <Snackbar
          open={openFlash}
          autoHideDuration={3000}
          onClose={handleClose}
          message={flashMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            message={flashMessage}
            style={{ backgroundColor: 'green', justifyContent: 'center' }}
          />
        </Snackbar>
        <h2>Welcome, {userName} !!</h2>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Recent Todo" {...a11yProps(0)} sx={{ backgroundColor: tabValue === 0 ? 'lightgray' : 'transparent' }}/>
            <Tab label="Search Todo" {...a11yProps(1)} sx={{ backgroundColor: tabValue === 1 ? 'lightgray' : 'transparent' }}/>
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <form onSubmit={handleDialogOpen}>
                <StyledButton type="submit" className="create-todo-button" variant="contained">Create Todo</StyledButton>
              </form>
              {(dialogOpen && tabValue === 0) && (
                <div>
                  <CreateTodoDialog onClose={handleDialogClose} 
                    onCreate={handleCreateFromDialog} isUpdate={isUpdate}
                    existingTodo={existingTodo} onUpdate={handleUpdateFromDialog}
                    dialogOpen={dialogOpen}/>
                </div>
              )}
              <Calendar todos={calendarTodos} onSelectedMonthChange={handleSelectedMonthChange}/>
            </Grid>
            {/* <Grid size={7}>
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
                    handleToggleCompleted={handleToggleCompleted}
                  />
                </div>
              ))}
            </Grid> */}
          </Grid>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          {(dialogOpen && tabValue === 1) && (
            <div>
              <CreateTodoDialog onClose={handleDialogClose} 
                onCreate={handleCreateFromDialog} isUpdate={isUpdate}
                existingTodo={existingTodo} onUpdate={handleUpdateFromDialog}
                dialogOpen={dialogOpen}/>
            </div>
          )}
          <SearchPanel onSearch={handleSearchResult} />
          <br />
          {searchTodos.map((todo) => (
            <div key={todo.id} className="todo-item-box">
              <ShowTodo targetTodo={todo} 
                handleDialogOpenWithUpdate={handleDialogOpenWithUpdate}
                handleOnDelete={handleOnDelete}
                handleToggleCompleted={handleToggleCompleted}
              />
            </div>
          ))}
        </CustomTabPanel>
      </div>
    </TodoContext.Provider>
  );
};