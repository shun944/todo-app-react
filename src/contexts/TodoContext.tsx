import React from "react";
import { Todo } from "../models/Todo";

const TodoContext = React.createContext({
  isUpdate: false,
  setIsUpdate: (isUpdate: boolean) => {},
  existingTodo: null as Todo | null,
  setExistingTodo: (todo: Todo | null) => {},
  dialogOpen: false,
  setDialogOpen: (isOpen: boolean) => {},
  handleDialogOpenWithUpdate: async (todo: Todo) => {},
  handleOnDelete: (todo_id: number | undefined) => {},
  handleToggleCompleted: (todo: Todo) => {},
});

export default TodoContext;