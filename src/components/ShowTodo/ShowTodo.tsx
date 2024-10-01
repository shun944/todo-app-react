import React, { useEffect } from "react";
import { Todo } from "../../models/Todo";
import { useState } from "react";

interface ShowTodoProps {
  targetTodo: Todo;
  handleDialogOpenWithUpdate: (todo: Todo) => void;
  handleOnDelete: (id: number | undefined) => void;
  handleToggleCompleted: (todo: Todo) => void;
}

const ShowTodo: React.FC<ShowTodoProps> = ({targetTodo, handleDialogOpenWithUpdate, handleOnDelete, handleToggleCompleted}) => {
  const [todo, setTodo] = useState<Todo>({title: '', description: '', due_date: '', completed: false, user_id: 0});

  useEffect(() => {
    setTodo(targetTodo);
  }, [targetTodo]);

  return (
    <div>
      <div className="todo-title-box">
        <p className="todo-title">{todo.title}</p>
        <p className="todo-due-date">~{todo.due_date}</p>
      </div>
      <div className="todo-description-box">
        <p className="todo-description">{todo.description}</p>
        <p className="todo-category">{todo.category}</p>
      </div>
      <div className="function-box">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleDialogOpenWithUpdate(todo)}
        }>
          <button className="edit-button" type="submit">Edit</button>
        </form>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleOnDelete(todo.id)}
        }>
          <button className="delete-button" type="submit">Delete</button>
        </form>
        <label className="completed-checkbox">
        completed :
          <input type="checkbox" checked={todo.completed || false} onChange={(e) => {
            handleToggleCompleted(todo)}
            } />
        </label>
      </div>
    </div>
  )
}

export default ShowTodo;