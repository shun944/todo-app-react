import React, { useEffect } from "react";
import { Todo } from "../../models/Todo";
import { useState } from "react";

import { Card, CardContent, Typography, CardActions,
  Button, Checkbox, FormControlLabel, CardHeader } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from '@mui/system';


interface ShowTodoProps {
  targetTodo: Todo;
  handleDialogOpenWithUpdate: (todo: Todo) => void;
  handleOnDelete: (id: number | undefined) => void;
  handleToggleCompleted: (todo: Todo) => void;
}

const ShowTodo: React.FC<ShowTodoProps> = ({targetTodo, handleDialogOpenWithUpdate, handleOnDelete, handleToggleCompleted}) => {
  const [todo, setTodo] = useState<Todo>({title: '', description: '', start_date: '', due_date: '', completed: false, user_id: 0});

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
        <Button size="small" onClick={() => handleDialogOpenWithUpdate(todo)}>Edit</Button>
        <Button size="small" onClick={() => handleOnDelete(todo.id)}>Delete</Button>
        <Box flexGrow={1} />
        <FormControlLabel
          control={
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                handleToggleCompleted(todo)
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