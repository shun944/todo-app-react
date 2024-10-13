import React from "react";
import './CreateUserDialog.css';

import { Button, Box } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/material/TextField';

interface CreateUserDialogProps {
  onClose: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({onClose}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const onCreate = () => {
    console.log('create user');
  }

  return (
    <div className="dialog-user">
      <div className="dialog-content-user">
        <TextField id="username" label="Username" value={username} 
        onChange={handleUsernameChange} size="small"
        />
        <Box mt={1}></Box>
        <TextField id="password" label="Password" type="password" value={password}
        onChange={handlePasswordChange} size="small" />
        <Box mt={2}></Box>
        <Box display="flex" justifyContent="flex-end">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button variant="contained" onClick={onCreate}>Submit</Button>
          </Box>
          <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
        </Box>
      </div>
    </div>
  );
}

export default CreateUserDialog;