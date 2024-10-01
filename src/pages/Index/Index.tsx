import React from "react";
import useTodos from "../../hooks/useTodos";
import { Link, To } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

export const Index = () => {
  const { todos, loading, error, addTodo, deleteTodo, updateTodo } = useTodos();
  const { user } = useUserInfo();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [flashMessage, setFlashMessage] = React.useState<string | null>(null);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [existingTodo, setExistingTodo] = React.useState<Todo | null>(null);
  
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
      <h1>Index page</h1>
      <h2>Welcome, {user?.name} !!</h2>
      <li><Link to="/">Home</Link></li>

      <Tabs>
        <TabList>
          <Tab>Recent Todo</Tab>
          <Tab>Search Todo</Tab>
        </TabList>
      

        <TabPanel>
          <form onSubmit={handleDialogOpen}>
            <button type="submit" className="create-todo-button">Create Todo</button>
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
        </TabPanel>
        <TabPanel>
          <SearchPanel />
        </TabPanel>
      </Tabs>
    </div>
  );
};