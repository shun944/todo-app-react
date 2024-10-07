import React, { useEffect } from "react";
import { Todo } from "../../models/Todo";
import { useState } from "react";
import TodoContext from "../../contexts/TodoContext";
import { useRecoilState } from 'recoil';
import { deletedFromCardAtom, checkedFromCardAtom } from "../../atom";

import { Card, CardContent, Typography, CardActions,
  Button, Checkbox, FormControlLabel, CardHeader } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from '@mui/system';


interface ShowTodoProps {
  targetTodo: Todo;
  handleDialogOpenWithUpdate?: (todo: Todo) => void;
  handleOnDelete?: (id: number | undefined) => void;
  handleToggleCompleted?: (todo: Todo) => void;
}

const ShowTodo: React.FC<ShowTodoProps> = ({targetTodo, handleDialogOpenWithUpdate, handleOnDelete, handleToggleCompleted}) => {
  const [todo, setTodo] = useState<Todo>({title: '', description: '', start_date: '', due_date: '', completed: false, user_id: 0});
  const [deletedFromCard, setDeletedFromCard] = useRecoilState(deletedFromCardAtom);
  const [checkedFromCard, setCheckedFromCard] = useRecoilState(checkedFromCardAtom);
  const todoContext = React.useContext(TodoContext);

  useEffect(() => {
    if (deletedFromCard) {
      setDeletedFromCard(false);
    }
    if (checkedFromCard) {
      setCheckedFromCard(false);
    }
  });

  useEffect(() => {
    setTodo(targetTodo);
  }, [targetTodo]);

  const RightAlignSubheader = styled(CardHeader)({
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiCardHeader-subheader': {
      textAlign: 'right',
    },
  });

  const handleEdit = (todo: Todo) => {
    todoContext.handleDialogOpenWithUpdate(todo);
  }

  const handleDelete = (id: number | undefined) => {
    todoContext.handleOnDelete(id);
    setDeletedFromCard(true);
  }

  const handleCheck = (todo: Todo) => {
    todoContext.handleToggleCompleted(todo);
    setCheckedFromCard(true);
  }

  return (
    <Card variant="outlined">
      <RightAlignSubheader title={todo.title} 
        subheader={
          <>
            <Typography variant="body2">{todo.category}</Typography>
            <Typography variant="body2">{todo.start_date} ~ {todo.due_date}</Typography>
          </>
        } 
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" color="text.secondary">
          {todo.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleEdit(todo)}>Edit</Button>
        <Button size="small" onClick={() => handleDelete(todo.id)}>Delete</Button>
        <Box flexGrow={1} />
        <FormControlLabel
          control={
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                handleCheck(todo)
              }}
            />
          }
          label="completed:"
          labelPlacement="start"
        />
      </CardActions>
    </Card>
  )
}

export default ShowTodo;